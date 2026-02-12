#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDataset } from '../../src/data/sovereigns.merge.js';
import { nowIso } from './common.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..', '..');
const outDir = join(rootDir, 'docs', 'modernization', 'baselines', 'datasets');

function isRuleDerivedEdge(edge) {
  const refs = Array.isArray(edge.evidence_refs) ? edge.evidence_refs : [];
  return refs.includes('SRC-DERIVED-RULES')
    && edge.c === 'i'
    && edge.claim_type === 'inferred'
    && typeof edge.inference_rule === 'string'
    && edge.inference_rule.trim() !== '';
}

function wrap(mode, people, edges) {
  return {
    generated_at: nowIso(),
    mode,
    people,
    edges
  };
}

async function main() {
  await mkdir(outDir, { recursive: true });

  const canonicalMerged = getDataset('canonical');
  const researchMerged = getDataset('research');

  const canonical = wrap(
    'canonical',
    canonicalMerged.people,
    canonicalMerged.edges.filter(edge => !isRuleDerivedEdge(edge))
  );
  const research = wrap(
    'research',
    researchMerged.people,
    researchMerged.edges.filter(edge => !isRuleDerivedEdge(edge))
  );

  const canonicalPath = join(outDir, 'canonical-raw.json');
  const researchPath = join(outDir, 'research-raw.json');

  await writeFile(canonicalPath, `${JSON.stringify(canonical, null, 2)}\n`, 'utf8');
  await writeFile(researchPath, `${JSON.stringify(research, null, 2)}\n`, 'utf8');

  console.log('Raw dataset exports written:');
  console.log(`- ${canonicalPath} (${canonical.people.length} people / ${canonical.edges.length} edges)`);
  console.log(`- ${researchPath} (${research.people.length} people / ${research.edges.length} edges)`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

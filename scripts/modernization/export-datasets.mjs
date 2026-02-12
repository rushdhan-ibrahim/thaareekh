#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDataset } from '../../src/data/sovereigns.merge.js';
import { sources } from '../../src/data/sources.js';
import { nowIso } from './common.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..', '..');
const outDir = join(rootDir, 'docs', 'modernization', 'baselines', 'datasets');

function wrap(mode) {
  const ds = getDataset(mode);
  return {
    generated_at: nowIso(),
    mode: ds.mode,
    people: ds.people,
    edges: ds.edges
  };
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const canonical = wrap('canonical');
  const research = wrap('research');

  const canonicalPath = join(outDir, 'canonical.json');
  const researchPath = join(outDir, 'research.json');
  const sourcesPath = join(outDir, 'sources.json');

  await writeFile(canonicalPath, `${JSON.stringify(canonical, null, 2)}\n`, 'utf8');
  await writeFile(researchPath, `${JSON.stringify(research, null, 2)}\n`, 'utf8');
  await writeFile(sourcesPath, `${JSON.stringify(sources, null, 2)}\n`, 'utf8');

  console.log('Dataset exports written:');
  console.log(`- ${canonicalPath} (${canonical.people.length} people / ${canonical.edges.length} edges)`);
  console.log(`- ${researchPath} (${research.people.length} people / ${research.edges.length} edges)`);
  console.log(`- ${sourcesPath} (${sources.length} sources)`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

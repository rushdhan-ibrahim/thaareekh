#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDataset } from '../../src/data/sovereigns.merge.js';
import {
  countBy,
  csvRowCount,
  normalizeRefs,
  sortObjectByKey
} from './common.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..', '..');
const docsDir = join(rootDir, 'docs');
const researchDir = join(docsDir, 'research-program');

const DEFAULT_BASELINE = join(docsDir, 'modernization', 'baselines', 'baseline-latest.json');

const LEDGER_FILES = {
  person_coverage: join(researchDir, 'ledgers', 'person-coverage.csv'),
  relationship_evidence: join(researchDir, 'ledgers', 'relationship-evidence-ledger.csv'),
  inference_tracker: join(researchDir, 'ledgers', 'inference-dossier-tracker.csv'),
  concept_coverage: join(researchDir, 'ledgers', 'concept-coverage.csv'),
  source_queue: join(researchDir, 'ledgers', 'source-expansion-queue.csv'),
  source_extract_log: join(researchDir, 'ledgers', 'source-extract-log.csv')
};

function parseBaselinePath(args) {
  const idx = args.indexOf('--baseline');
  if (idx >= 0 && args[idx + 1]) return args[idx + 1];
  return DEFAULT_BASELINE;
}

function datasetStats(dataset) {
  const confidenceSplit = sortObjectByKey(countBy(dataset.edges, e => e.c || '?'));
  const relationSplit = sortObjectByKey(countBy(dataset.edges, e => e.t || '?'));
  const claimTypeSplit = sortObjectByKey(countBy(dataset.edges, e => e.claim_type || 'unknown'));
  const gradeSplit = sortObjectByKey(countBy(dataset.edges, e => e.confidence_grade || '?'));

  let withEvidence = 0;
  let multiSource = 0;
  for (const edge of dataset.edges) {
    const refs = normalizeRefs(edge.evidence_refs);
    if (refs.length) withEvidence += 1;
    if (refs.length > 1) multiSource += 1;
  }

  return {
    people: dataset.people.length,
    edges: dataset.edges.length,
    inferred_edges: dataset.edges.filter(e => e.c === 'i').length,
    uncertain_edges: dataset.edges.filter(e => e.c === 'u').length,
    edges_with_evidence_refs: withEvidence,
    multi_source_edges: multiSource,
    confidence_split: confidenceSplit,
    relation_split: relationSplit,
    claim_type_split: claimTypeSplit,
    confidence_grade_split: gradeSplit
  };
}

async function ledgerStats() {
  const out = {};
  for (const [key, path] of Object.entries(LEDGER_FILES)) {
    out[key] = await csvRowCount(path);
  }
  return out;
}

function compareObject(path, expected, actual, issues) {
  const ex = expected ?? {};
  const ac = actual ?? {};
  const keys = new Set([...Object.keys(ex), ...Object.keys(ac)]);
  for (const key of keys) {
    const nextPath = `${path}.${key}`;
    const a = ex[key];
    const b = ac[key];
    if (a && typeof a === 'object' && !Array.isArray(a) && b && typeof b === 'object' && !Array.isArray(b)) {
      compareObject(nextPath, a, b, issues);
      continue;
    }
    if (a !== b) {
      issues.push(`${nextPath}: expected ${JSON.stringify(a)} != actual ${JSON.stringify(b)}`);
    }
  }
}

async function main() {
  const baselinePath = parseBaselinePath(process.argv.slice(2));
  const baseline = JSON.parse(await readFile(baselinePath, 'utf8'));

  const canonical = datasetStats(getDataset('canonical'));
  const research = datasetStats(getDataset('research'));
  const ledgers = await ledgerStats();

  const current = {
    datasets: {
      canonical,
      research
    },
    research_workspace: {
      ledgers
    }
  };

  const expected = {
    datasets: {
      canonical: baseline.datasets?.canonical,
      research: baseline.datasets?.research
    },
    research_workspace: {
      ledgers: baseline.research_workspace?.ledgers
    }
  };

  const issues = [];
  compareObject('baseline', expected, current, issues);

  if (issues.length) {
    console.error(`Modernization parity check failed (${issues.length})`);
    for (const issue of issues) {
      console.error(`- ${issue}`);
    }
    process.exit(1);
  }

  console.log('Modernization parity check passed.');
  console.log(`baseline: ${baselinePath}`);
  console.log(`canonical: ${canonical.people} people / ${canonical.edges} edges`);
  console.log(`research: ${research.people} people / ${research.edges} edges`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

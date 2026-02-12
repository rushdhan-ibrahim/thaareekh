#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDataset } from '../../src/data/sovereigns.merge.js';
import { sourceById } from '../../src/data/sources.js';
import {
  countBy,
  countFilesRecursive,
  csvRowCount,
  normalizeRefs,
  nowIso,
  sortObjectByKey,
  todayIso
} from './common.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..', '..');
const docsDir = join(rootDir, 'docs');
const researchDir = join(docsDir, 'research-program');
const baselinesDir = join(docsDir, 'modernization', 'baselines');

const LEDGER_FILES = {
  person_coverage: join(researchDir, 'ledgers', 'person-coverage.csv'),
  relationship_evidence: join(researchDir, 'ledgers', 'relationship-evidence-ledger.csv'),
  inference_tracker: join(researchDir, 'ledgers', 'inference-dossier-tracker.csv'),
  concept_coverage: join(researchDir, 'ledgers', 'concept-coverage.csv'),
  source_queue: join(researchDir, 'ledgers', 'source-expansion-queue.csv'),
  source_extract_log: join(researchDir, 'ledgers', 'source-extract-log.csv')
};

function parseDateArg(args) {
  const idx = args.indexOf('--date');
  if (idx >= 0 && args[idx + 1] && /^\d{4}-\d{2}-\d{2}$/.test(args[idx + 1])) {
    return args[idx + 1];
  }
  return todayIso();
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

function sourceStats() {
  const sources = [...sourceById.values()];
  return {
    registered_sources: sources.length,
    quality_split: sortObjectByKey(countBy(sources, s => s.quality || '?')),
    top_domains: sortObjectByKey(countBy(sources, s => {
      try {
        if (!s.url) return 'unknown';
        return new URL(s.url).hostname || 'unknown';
      } catch {
        return 'unknown';
      }
    }))
  };
}

async function researchWorkspaceStats() {
  const ledgerRows = {};
  for (const [key, file] of Object.entries(LEDGER_FILES)) {
    ledgerRows[key] = await csvRowCount(file);
  }
  return {
    research_program_file_count: await countFilesRecursive(researchDir),
    ledgers: ledgerRows
  };
}

async function runtimeSurfaceStats() {
  const srcDir = join(rootDir, 'src');
  const scriptsDir = join(rootDir, 'scripts');
  return {
    src_file_count: await countFilesRecursive(srcDir),
    scripts_file_count: await countFilesRecursive(scriptsDir)
  };
}

async function main() {
  const date = parseDateArg(process.argv.slice(2));
  const canonical = getDataset('canonical');
  const research = getDataset('research');

  const baseline = {
    baseline_date: date,
    generated_at: nowIso(),
    generator: 'scripts/modernization/generate-baseline.mjs',
    datasets: {
      canonical: datasetStats(canonical),
      research: datasetStats(research)
    },
    sources: sourceStats(),
    research_workspace: await researchWorkspaceStats(),
    runtime_surface: await runtimeSurfaceStats()
  };

  await mkdir(baselinesDir, { recursive: true });

  const datedPath = join(baselinesDir, `baseline-${date}.json`);
  const latestPath = join(baselinesDir, 'baseline-latest.json');

  const payload = `${JSON.stringify(baseline, null, 2)}\n`;
  await writeFile(datedPath, payload, 'utf8');
  await writeFile(latestPath, payload, 'utf8');

  console.log(`Modernization baseline written:`);
  console.log(`- ${datedPath}`);
  console.log(`- ${latestPath}`);
  console.log(`canonical: ${baseline.datasets.canonical.people} people / ${baseline.datasets.canonical.edges} edges`);
  console.log(`research: ${baseline.datasets.research.people} people / ${baseline.datasets.research.edges} edges`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

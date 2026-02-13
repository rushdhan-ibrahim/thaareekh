#!/usr/bin/env node

import { performance } from 'node:perf_hooks';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSearchEngine } from '../../apps/web/src/search/search-engine.ts';
import { createPathfinder } from '../../apps/web/src/graph/pathfinder.ts';
import { getDataset } from '../../src/data/sovereigns.merge.js';
import { officeById } from '../../src/data/offices.js';
import { nowIso } from './common.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..', '..');
const outDir = join(projectRoot, 'docs', 'modernization', 'baselines', 'benchmarks');
const rustCliBinary = join(
  projectRoot,
  'target',
  'release',
  process.platform === 'win32' ? 'maldives-research-cli.exe' : 'maldives-research-cli'
);

function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[idx] ?? 0;
}

function summarize(values) {
  if (!values.length) {
    return { samples: 0, mean: 0, p95: 0, min: 0, max: 0 };
  }
  const total = values.reduce((sum, value) => sum + value, 0);
  return {
    samples: values.length,
    mean: total / values.length,
    p95: percentile(values, 95),
    min: Math.min(...values),
    max: Math.max(...values)
  };
}

function run(cmd, args, cwd = projectRoot) {
  const out = spawnSync(cmd, args, {
    cwd,
    encoding: 'utf8'
  });
  if (out.status !== 0) {
    const details = [out.stdout, out.stderr].filter(Boolean).join('\n').trim();
    throw new Error(`Command failed: ${cmd} ${args.join(' ')}\n${details}`);
  }
  return out.stdout.trim();
}

function timedCommand(cmd, args, cwd = projectRoot) {
  const t0 = performance.now();
  run(cmd, args, cwd);
  return performance.now() - t0;
}

function timedCommandSamples(
  cmd,
  args,
  cwd = projectRoot,
  { warmup = 1, samples = 5 } = {}
) {
  for (let i = 0; i < warmup; i += 1) {
    run(cmd, args, cwd);
  }
  const values = [];
  for (let i = 0; i < samples; i += 1) {
    const t0 = performance.now();
    run(cmd, args, cwd);
    values.push(performance.now() - t0);
  }
  return summarize(values);
}

function measureLoop(iterations, fn) {
  const samples = [];
  for (let i = 0; i < iterations; i += 1) {
    const t0 = performance.now();
    fn(i);
    samples.push(performance.now() - t0);
  }
  return summarize(samples);
}

function toMs(value) {
  return Number(value.toFixed(3));
}

function roundStats(stats) {
  return {
    samples: stats.samples,
    mean: toMs(stats.mean),
    p95: toMs(stats.p95),
    min: toMs(stats.min),
    max: toMs(stats.max)
  };
}

async function main() {
  const dataset = getDataset('research');
  const officeMap = new Map(
    [...officeById.entries()].map(([id, value]) => [
      id,
      {
        id,
        name: String(value?.name ?? '')
      }
    ])
  );
  const searchEngine = createSearchEngine(dataset.people, dataset.edges, officeMap);
  const pathfinder = createPathfinder(dataset.edges);

  const searchQueries = [
    'koimala',
    'dy:hilaaly c:u',
    'thakurufaanu',
    '#20',
    'didi',
    'sultan',
    'dy:utheemu c:i',
    'fandiyaaru',
    'addu',
    'mohamed',
    'dhammaru veeru',
    'dy:lunar o:naib'
  ];

  const personIds = dataset.people.map((person) => person.id).slice(0, 120);
  const pathPairs = [];
  for (let i = 0; i < 200; i += 1) {
    if (!personIds.length) break;
    const a = personIds[(i * 7) % personIds.length];
    let b = personIds[(i * 13 + 11) % personIds.length];
    if (a === b) b = personIds[(i * 17 + 3) % personIds.length];
    if (a && b) pathPairs.push([a, b]);
  }

  const searchStats = measureLoop(480, (i) => {
    const query = searchQueries[i % searchQueries.length];
    searchEngine.rankSearch(query, 12);
  });

  const pathStats = measureLoop(Math.max(200, pathPairs.length), (i) => {
    const pair = pathPairs[i % pathPairs.length];
    if (!pair) return;
    pathfinder.findRelationshipPath(pair[0], pair[1], { maxDepth: 10 });
  });

  const deriveCanonicalStats = measureLoop(40, () => {
    getDataset('canonical');
  });
  const deriveResearchStats = measureLoop(40, () => {
    getDataset('research');
  });

  run('node', ['scripts/modernization/export-datasets.mjs'], projectRoot);
  run('node', ['scripts/modernization/export-ui-reference.mjs'], projectRoot);

  const nodeQaLedgerColdMs = timedCommand('node', ['scripts/qa-research-ledgers.mjs'], projectRoot);
  const nodeQaBatchContentColdMs = timedCommand('node', ['scripts/qa-batch-content.mjs'], projectRoot);
  const nodeQaSmokeColdMs = timedCommand('node', ['scripts/qa-smoke.mjs'], projectRoot);
  const nodeQaColdSuiteMs = nodeQaLedgerColdMs + nodeQaBatchContentColdMs + nodeQaSmokeColdMs;

  const nodeQaLedgerStats = timedCommandSamples(
    'node',
    ['scripts/qa-research-ledgers.mjs'],
    projectRoot
  );
  const nodeQaBatchContentStats = timedCommandSamples(
    'node',
    ['scripts/qa-batch-content.mjs'],
    projectRoot
  );
  const nodeQaSmokeStats = timedCommandSamples('node', ['scripts/qa-smoke.mjs'], projectRoot);
  const nodeQaSuiteMeanMs =
    nodeQaLedgerStats.mean + nodeQaBatchContentStats.mean + nodeQaSmokeStats.mean;

  const rustBuildMs = timedCommand(
    'cargo',
    ['build', '--release', '-q', '-p', 'maldives-research-cli'],
    projectRoot
  );
  if (!existsSync(rustCliBinary)) {
    throw new Error(`Rust CLI binary not found after build: ${rustCliBinary}`);
  }

  const rustQaLedgerColdMs = timedCommand(
    rustCliBinary,
    [
      'qa-ledgers',
      'docs/modernization/baselines/datasets/research.json',
      'docs/research-program/ledgers'
    ],
    projectRoot
  );
  const rustQaBatchContentColdMs = timedCommand(rustCliBinary, ['qa-batch-content', '.'], projectRoot);
  const rustQaSmokeColdMs = timedCommand(
    rustCliBinary,
    [
      'qa-smoke',
      'docs/modernization/baselines/datasets/canonical.json',
      'docs/modernization/baselines/datasets/ui-reference.json'
    ],
    projectRoot
  );
  const rustQaColdSuiteMs = rustQaLedgerColdMs + rustQaBatchContentColdMs + rustQaSmokeColdMs;

  const rustQaLedgerStats = timedCommandSamples(
    rustCliBinary,
    [
      'qa-ledgers',
      'docs/modernization/baselines/datasets/research.json',
      'docs/research-program/ledgers'
    ],
    projectRoot
  );
  const rustQaBatchContentStats = timedCommandSamples(
    rustCliBinary,
    ['qa-batch-content', '.'],
    projectRoot
  );
  const rustQaSmokeStats = timedCommandSamples(
    rustCliBinary,
    [
      'qa-smoke',
      'docs/modernization/baselines/datasets/canonical.json',
      'docs/modernization/baselines/datasets/ui-reference.json'
    ],
    projectRoot
  );
  const rustQaSuiteMeanMs =
    rustQaLedgerStats.mean + rustQaBatchContentStats.mean + rustQaSmokeStats.mean;

  const payload = {
    generated_at: nowIso(),
    machine: {
      node: process.version,
      platform: process.platform,
      arch: process.arch
    },
    targets: {
      search_p95_ms: 100,
      path_p95_ms: 100
    },
    lanes: {
      search_query_latency_ms: {
        ...Object.fromEntries(
          Object.entries(searchStats).map(([k, v]) => [k, typeof v === 'number' ? toMs(v) : v])
        ),
        note: 'Measured via TypeScript search engine rankSearch over representative mixed queries.'
      },
      path_query_latency_ms: {
        ...Object.fromEntries(
          Object.entries(pathStats).map(([k, v]) => [k, typeof v === 'number' ? toMs(v) : v])
        ),
        note: 'Measured via TypeScript pathfinder over representative pair samples.'
      },
      dataset_merge_derived_latency_ms: {
        canonical: Object.fromEntries(
          Object.entries(deriveCanonicalStats).map(([k, v]) => [k, typeof v === 'number' ? toMs(v) : v])
        ),
        research: Object.fromEntries(
          Object.entries(deriveResearchStats).map(([k, v]) => [k, typeof v === 'number' ? toMs(v) : v])
        ),
        note: 'Measured via repeated getDataset(mode) materialization.'
      },
      research_pipeline_wall_clock_ms: {
        cold_start: {
          node: {
            qa_ledgers: toMs(nodeQaLedgerColdMs),
            qa_batch_content: toMs(nodeQaBatchContentColdMs),
            qa_smoke: toMs(nodeQaSmokeColdMs),
            suite_total: toMs(nodeQaColdSuiteMs)
          },
          rust: {
            build_once: toMs(rustBuildMs),
            qa_ledgers: toMs(rustQaLedgerColdMs),
            qa_batch_content: toMs(rustQaBatchContentColdMs),
            qa_smoke: toMs(rustQaSmokeColdMs),
            suite_total: toMs(rustQaColdSuiteMs)
          },
          rust_speedup_vs_node: toMs(nodeQaColdSuiteMs / Math.max(rustQaColdSuiteMs, 0.001))
        },
        node: {
          qa_ledgers: roundStats(nodeQaLedgerStats),
          qa_batch_content: roundStats(nodeQaBatchContentStats),
          qa_smoke: roundStats(nodeQaSmokeStats),
          suite_total_mean: toMs(nodeQaSuiteMeanMs)
        },
        rust: {
          build_once: toMs(rustBuildMs),
          qa_ledgers: roundStats(rustQaLedgerStats),
          qa_batch_content: roundStats(rustQaBatchContentStats),
          qa_smoke: roundStats(rustQaSmokeStats),
          suite_total_mean: toMs(rustQaSuiteMeanMs)
        },
        rust_speedup_vs_node: toMs(nodeQaSuiteMeanMs / Math.max(rustQaSuiteMeanMs, 0.001)),
        note: 'Warm lane uses warmup + 5 measured samples per command for stable wall-clock comparisons.'
      }
    }
  };

  await mkdir(outDir, { recursive: true });
  const day = payload.generated_at.slice(0, 10);
  const latestPath = join(outDir, 'benchmark-latest.json');
  const datedPath = join(outDir, `benchmark-${day}.json`);

  const encoded = `${JSON.stringify(payload, null, 2)}\n`;
  await writeFile(latestPath, encoded, 'utf8');
  await writeFile(datedPath, encoded, 'utf8');

  console.log('Modernization benchmark snapshot written:');
  console.log(`- ${latestPath}`);
  console.log(`- ${datedPath}`);
  console.log(`search p95: ${toMs(searchStats.p95)} ms`);
  console.log(`path p95: ${toMs(pathStats.p95)} ms`);
  console.log(
    `pipeline rust speedup vs node: ${toMs(nodeQaSuiteMeanMs / Math.max(rustQaSuiteMeanMs, 0.001))}x`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..', '..');
const defaultBenchmarkPath = join(
  projectRoot,
  'docs',
  'modernization',
  'baselines',
  'benchmarks',
  'benchmark-latest.json'
);
const benchmarkPath = process.argv[2] ?? defaultBenchmarkPath;
const MIN_PIPELINE_WARM_SPEEDUP = 2;

function toMs(value) {
  return Number(value.toFixed(3));
}

function assertNumber(value, label) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Missing numeric value for ${label}.`);
  }
  return value;
}

async function main() {
  const raw = await readFile(benchmarkPath, 'utf8');
  const payload = JSON.parse(raw);
  const lanes = payload?.lanes ?? {};
  const targets = payload?.targets ?? {};

  const searchP95 = assertNumber(lanes?.search_query_latency_ms?.p95, 'search_query_latency_ms.p95');
  const pathP95 = assertNumber(lanes?.path_query_latency_ms?.p95, 'path_query_latency_ms.p95');
  const warmSpeedup = assertNumber(
    lanes?.research_pipeline_wall_clock_ms?.rust_speedup_vs_node,
    'research_pipeline_wall_clock_ms.rust_speedup_vs_node'
  );

  const searchBudget = Number(targets?.search_p95_ms ?? 100);
  const pathBudget = Number(targets?.path_p95_ms ?? 100);

  const failures = [];
  if (searchP95 > searchBudget) {
    failures.push(`Search p95 ${toMs(searchP95)}ms exceeds budget ${toMs(searchBudget)}ms.`);
  }
  if (pathP95 > pathBudget) {
    failures.push(`Path p95 ${toMs(pathP95)}ms exceeds budget ${toMs(pathBudget)}ms.`);
  }
  if (warmSpeedup < MIN_PIPELINE_WARM_SPEEDUP) {
    failures.push(
      `Warm pipeline speedup ${toMs(warmSpeedup)}x is below minimum ${MIN_PIPELINE_WARM_SPEEDUP}x.`
    );
  }

  const coldSpeedup = lanes?.research_pipeline_wall_clock_ms?.cold_start?.rust_speedup_vs_node;
  const warnings = [];
  if (typeof coldSpeedup === 'number' && Number.isFinite(coldSpeedup) && coldSpeedup < 1) {
    warnings.push(
      `Cold-start speedup is ${toMs(coldSpeedup)}x (< 1.0x). Warm-lane budget still passes.`
    );
  }

  if (failures.length) {
    console.error(`Benchmark budget check failed (${failures.length}):`);
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log('Benchmark budget check passed.');
  console.log(`- search p95: ${toMs(searchP95)}ms (budget ${toMs(searchBudget)}ms)`);
  console.log(`- path p95: ${toMs(pathP95)}ms (budget ${toMs(pathBudget)}ms)`);
  console.log(`- warm pipeline speedup: ${toMs(warmSpeedup)}x (min ${MIN_PIPELINE_WARM_SPEEDUP}x)`);
  if (warnings.length) {
    console.log(`Benchmark warnings (${warnings.length}):`);
    for (const warning of warnings) {
      console.log(`- ${warning}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

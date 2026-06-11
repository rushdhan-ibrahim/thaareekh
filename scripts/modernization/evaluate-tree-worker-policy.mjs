#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runUiBrowserBenchmarks } from './ui-browser-benchmarks.mjs';
import { nowIso } from './common.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..', '..');
const outDir = join(projectRoot, 'docs', 'modernization', 'baselines', 'benchmarks');

function toMs(value) {
  return Number(Number(value || 0).toFixed(3));
}

function pickMetrics(payload) {
  if (payload?.status !== 'ok') return null;
  return {
    tree_switch_first_ms: toMs(payload.tree_mode_switch_first_latency_ms),
    tree_switch_p95_ms: toMs(payload.tree_mode_switch_latency_ms?.p95),
    tree_switch_mean_ms: toMs(payload.tree_mode_switch_latency_ms?.mean),
    filter_toggle_p95_ms: toMs(payload.filter_toggle_latency_ms?.p95),
    first_interaction_p95_ms: toMs(payload.first_interaction_latency_ms?.p95),
    pan_zoom_frame_mean_ms: toMs(payload.pan_zoom_frame_ms?.mean)
  };
}

async function runForMode(mode) {
  const prev = process.env.UI_BENCH_TREE_WORKER;
  process.env.UI_BENCH_TREE_WORKER = mode;
  try {
    return await runUiBrowserBenchmarks(projectRoot);
  } finally {
    if (prev === undefined) delete process.env.UI_BENCH_TREE_WORKER;
    else process.env.UI_BENCH_TREE_WORKER = prev;
  }
}

function decidePolicy(onMetrics, offMetrics) {
  if (!onMetrics || !offMetrics) {
    return {
      recommendation: 'enabled_by_default',
      rationale: 'One or more policy profiles did not produce a complete UI benchmark lane; keep worker enabled by default with existing fallback.'
    };
  }

  const deltaFirst = toMs(offMetrics.tree_switch_first_ms - onMetrics.tree_switch_first_ms);
  const deltaP95 = toMs(offMetrics.tree_switch_p95_ms - onMetrics.tree_switch_p95_ms);
  const deltaFilter = toMs(offMetrics.filter_toggle_p95_ms - onMetrics.filter_toggle_p95_ms);
  const strongRegression =
    onMetrics.tree_switch_first_ms > offMetrics.tree_switch_first_ms + 8
    || onMetrics.tree_switch_p95_ms > offMetrics.tree_switch_p95_ms + 8;

  if (strongRegression) {
    return {
      recommendation: 'feature_flag_default_off',
      rationale: `Worker profile regressed tree-switch metrics (first delta ${deltaFirst}ms, p95 delta ${deltaP95}ms); keep opt-in until further tuning.`
    };
  }

  return {
    recommendation: 'enabled_by_default',
    rationale: `Worker profile is neutral/improved for tree switching (first delta ${deltaFirst}ms, p95 delta ${deltaP95}ms, filter delta ${deltaFilter}ms); keep enabled-by-default with explicit opt-out.`
  };
}

async function main() {
  const onRun = await runForMode('on');
  const offRun = await runForMode('off');
  const onMetrics = pickMetrics(onRun);
  const offMetrics = pickMetrics(offRun);
  const decision = decidePolicy(onMetrics, offMetrics);

  const payload = {
    generated_at: nowIso(),
    decision,
    profiles: {
      worker_on: {
        status: onRun?.status ?? 'unavailable',
        metrics: onMetrics,
        raw: onRun
      },
      worker_off: {
        status: offRun?.status ?? 'unavailable',
        metrics: offMetrics,
        raw: offRun
      }
    }
  };

  await mkdir(outDir, { recursive: true });
  const day = payload.generated_at.slice(0, 10);
  const latestPath = join(outDir, 'tree-worker-policy-latest.json');
  const datedPath = join(outDir, `tree-worker-policy-${day}.json`);
  const encoded = `${JSON.stringify(payload, null, 2)}\n`;
  await writeFile(latestPath, encoded, 'utf8');
  await writeFile(datedPath, encoded, 'utf8');

  console.log('Tree worker policy evaluation written:');
  console.log(`- ${latestPath}`);
  console.log(`- ${datedPath}`);
  console.log(`recommendation: ${decision.recommendation}`);
  console.log(`rationale: ${decision.rationale}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

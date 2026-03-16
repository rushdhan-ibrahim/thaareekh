# Tree Worker Policy Decision

Date: 2026-02-21  
Status: decided

## Decision

- Keep tree-placement worker **enabled by default** in both runtimes.
- Keep explicit opt-out support for troubleshooting and profiling.

## Evidence source

- Benchmark artifact: `docs/modernization/baselines/benchmarks/tree-worker-policy-latest.json`
- Comparison command: `npm run modernization:benchmark:tree-worker-policy`
- Profiles compared:
  - worker forced on (`UI_BENCH_TREE_WORKER=on`)
  - worker forced off (`UI_BENCH_TREE_WORKER=off`)

## Measured result (2026-02-21 run)

- Worker on:
  - tree switch first: `111.4ms`
  - tree switch p95: `83.6ms`
  - filter toggle p95: `51.1ms`
- Worker off:
  - tree switch first: `115.6ms`
  - tree switch p95: `80.6ms`
  - filter toggle p95: `52.2ms`
- Delta (`off - on`):
  - tree switch first: `+4.2ms` (on faster)
  - tree switch p95: `-3.0ms` (off slightly faster)
  - filter toggle p95: `+1.1ms` (on faster)

Interpretation: no meaningful regression from default-on policy; results are neutral-to-positive with default-on.

## Runtime controls

- URL query override (both JS and TS apps):
  - `?tree_worker=off` to disable worker
  - `?tree_worker=on` to force worker on
- Internal globals honored by rebuild path:
  - `window.__treePlacementWorkerPolicy` (`on|off|auto`)
  - `window.__disableTreePlacementWorker` (legacy boolean override)

## Related updates

- UI benchmark lane now captures tree switch timings:
  - `ui_browser.tree_mode_switch_first_latency_ms`
  - `ui_browser.tree_mode_switch_latency_ms`
- Benchmark budgets now include tree switch thresholds:
  - first switch: `<= 220ms`
  - p95 switch: `<= 180ms`

# Phase 0 Benchmark Plan

Date: 2026-02-10
Status: active

## Benchmark lanes
1. UI boot and first interaction latency (CDP lane integrated; may report `unavailable` when browser endpoint is not reachable).
2. Pan/zoom smoothness under research dataset (CDP lane integrated; same availability caveat).
3. Search query latency and ranking time (automated in `modernization:benchmark`).
4. Filter toggling and rebuild latency (CDP lane integrated; same availability caveat).
5. Relationship path query latency (automated in `modernization:benchmark`).
6. Dataset merge + derived inference generation time (automated in `modernization:benchmark`).
7. Research pipeline wall-clock time (automated in `modernization:benchmark`).
8. Tree mode switch latency (CDP lane integrated; measured as first switch and warm p95).

## Baseline capture
- Use current JS system as baseline.
- Record mean/p95 for each lane.
- Store benchmark snapshots alongside modernization baselines.
- Benchmark command: `npm run modernization:benchmark`.
- Snapshot artifacts:
  - `docs/modernization/baselines/benchmarks/benchmark-latest.json`
  - `docs/modernization/baselines/benchmarks/benchmark-2026-02-21.json`
  - `docs/modernization/baselines/benchmarks/benchmark-2026-02-20.json`
  - `docs/modernization/baselines/benchmarks/benchmark-2026-02-13.json`
  - `docs/modernization/baselines/benchmarks/tree-worker-policy-latest.json`

## Acceptance criteria
- Meet or exceed all performance targets in `docs/modernization-plan-typescript-rust-2026-02-10.md`.

## UI lane availability policy
- `modernization:benchmark-check` enforces search/path/pipeline budgets on every run.
- UI budgets are enforced when `lanes.ui_browser.status === "ok"`.
- If UI lanes are unavailable, default check behavior is warning-only with explicit reason in output.
- UI runner now reports structured diagnostics (`cdp_port_probe_error`, launch attempts, Chrome exit signals) to make environment failures actionable.
- In full-access local execution, UI lane is now operational and strict mode passes (`modernization:benchmark-check:require-ui`).
- Use strict enforcement in controlled environments:
  - `npm run modernization:benchmark-check:require-ui`
  - or `MODERNIZATION_REQUIRE_UI_BENCH=1 npm run modernization:benchmark-check`
  - CI profile toggle: set repository variable `MODERNIZATION_REQUIRE_UI_BENCH=1` for `.github/workflows/modernization-parity.yml`.
  - CI reliability hardening applied: `UI_BENCH_SERVE_MODE=http` and `CHROME_BIN` auto-detection.

## Latest snapshot (2026-02-21)
- Search query latency p95: `1.386ms` (within `<=100ms` target).
- Relationship path latency p95: `0.161ms` (within `<=100ms` target).
- Dataset materialization:
  - canonical mean: `0.894ms`, p95: `1.292ms`;
  - research mean: `1.098ms`, p95: `1.322ms`.
- Research QA suite wall clock:
  - Warm lane (steady state):
    - Node suite mean: `211.477ms`
    - Rust suite mean (release binary): `33.158ms`
    - Rust vs Node speedup: `6.378x` (exceeds target).
  - Cold-start lane (first command execution):
    - Node suite total: `326.560ms`
    - Rust suite total: `1115.566ms`
    - Rust vs Node speedup: `0.293x` (expected warning lane; warm budget remains primary gate).
  - Rust build-once time: `234335.265ms`.
- UI lane status: `ok`:
  - first interaction p95: `54.200ms`
  - filter toggle p95: `54.200ms`
  - tree switch first: `97.400ms` (within `<=220ms`)
  - tree switch p95: `77.700ms` (within `<=180ms`)
  - pan/zoom frame mean: `15.846ms` (within `<=16.7ms`)
  - pan/zoom frame p95: `16.600ms` (within `<=24ms`)
  - estimated FPS: `63.108` (within `>=50`)
- Worker policy profile run:
  - `npm run modernization:benchmark:tree-worker-policy`
  - decision artifact: `docs/modernization/baselines/benchmarks/tree-worker-policy-latest.json`
  - current recommendation: `enabled_by_default`.

## Tooling implementation
- Node benchmarking script for engine/pipeline lanes: `scripts/modernization/run-benchmarks.mjs`.
- UI CDP benchmark runner: `scripts/modernization/ui-browser-benchmarks.mjs`.
- Rust lane execution uses release CLI binary (`cargo build --release`) for fair runtime comparison.
- Pipeline lane includes both:
  - cold-start single-run measurements;
  - warm steady-state metrics (warmup + 5 measured samples per command).
- UI trace lane is integrated into benchmark payload as `lanes.ui_browser`.

## Follow-up actions
1. Observe CI strict-profile stability and decide when strict UI lane can become always-on required.
2. Expand UI lane to include era-slider drag jank metrics.
3. Optimize Rust cold-start path (binary startup + command dispatch) for short-lived single-command execution.

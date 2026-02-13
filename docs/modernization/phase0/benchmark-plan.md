# Phase 0 Benchmark Plan

Date: 2026-02-10
Status: active

## Benchmark lanes
1. UI boot and first interaction latency (pending browser trace lane).
2. Pan/zoom smoothness under research dataset (pending browser trace lane).
3. Search query latency and ranking time (automated in `modernization:benchmark`).
4. Filter toggling and rebuild latency (pending UI parity/cutover lane).
5. Relationship path query latency (automated in `modernization:benchmark`).
6. Dataset merge + derived inference generation time (automated in `modernization:benchmark`).
7. Research pipeline wall-clock time (automated in `modernization:benchmark`).

## Baseline capture
- Use current JS system as baseline.
- Record mean/p95 for each lane.
- Store benchmark snapshots alongside modernization baselines.
- Benchmark command: `npm run modernization:benchmark`.
- Snapshot artifacts:
  - `docs/modernization/baselines/benchmarks/benchmark-latest.json`
  - `docs/modernization/baselines/benchmarks/benchmark-2026-02-13.json`

## Acceptance criteria
- Meet or exceed all performance targets in `docs/modernization-plan-typescript-rust-2026-02-10.md`.

## Latest snapshot (2026-02-13)
- Search query latency p95: `1.514ms` (within `<=100ms` target).
- Relationship path latency p95: `0.125ms` (within `<=100ms` target).
- Dataset materialization:
  - canonical mean: `0.871ms`, p95: `1.157ms`;
  - research mean: `1.250ms`, p95: `1.846ms`.
- Research QA suite wall clock:
  - Node suite mean: `200.681ms`
  - Rust suite mean (release binary): `39.699ms`
  - Rust vs Node speedup: `5.055x` (exceeds target).
  - Rust build-once time (not included in suite mean): `238.981ms`.

## Tooling implementation
- Node benchmarking script for engine/pipeline lanes: `scripts/modernization/run-benchmarks.mjs`.
- Rust lane execution uses release CLI binary (`cargo build --release`) for fair runtime comparison.
- Pipeline lane uses warmup + 5 measured samples per command to avoid cold-start outlier skew.
- Browser trace tooling remains pending for UI boot/pan/zoom/filter lanes.

## Follow-up actions
1. Add browser trace capture lane for UI boot, first input latency, and pan/zoom frame pacing.
2. Add explicit cold-start lane (first-run process launch) alongside warm-lane metrics for operational transparency.
3. Add CI-safe performance budget checker and fail thresholds for measured lanes.

# Phase 0 Benchmark Plan

Date: 2026-02-10
Status: drafted

## Benchmark lanes
1. UI boot and first interaction latency.
2. Pan/zoom smoothness under research dataset.
3. Search query latency and ranking time.
4. Filter toggling and rebuild latency.
5. Relationship path query latency.
6. Dataset merge + derived inference generation time.
7. Research pipeline wall-clock time (full QA run).

## Baseline capture
- Use current JS system as baseline.
- Record mean/p95 for each lane.
- Store benchmark snapshots alongside modernization baselines.

## Acceptance criteria
- Meet or exceed all performance targets in `docs/modernization-plan-typescript-rust-2026-02-10.md`.

## Tooling intent
- Node benchmarking scripts for engine and pipeline.
- Browser performance traces for UI lanes.
- Rust criterion benches for engine lanes after migration.

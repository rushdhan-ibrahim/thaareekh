# Phase 0 Implementation Log

Date: 2026-02-10

## Completed in this pass
- Established modernization workspace docs and ADR set.
- Added baseline generation script (`scripts/modernization/generate-baseline.mjs`).
- Added parity check script (`scripts/modernization/check-parity.mjs`).
- Added dataset export script (`scripts/modernization/export-datasets.mjs`).
- Added pre-derived dataset export script (`scripts/modernization/export-raw-datasets.mjs`).
- Added Rust derive parity verifier (`scripts/modernization/verify-rust-derive-parity.mjs`).
- Added JSON schema foundation (`schemas/dataset.schema.json`).
- Added TypeScript web scaffold (`apps/web`).
- Added Rust workspace scaffold (`crates/domain`, `crates/engine`, `crates/research-cli`).
- Ported research ledger QA checks into Rust CLI (`qa-ledgers`).
- Ported batch content QA into Rust CLI (`qa-batch-content`) with Node-vs-Rust parity harness.
- Ported ledger reconciliation into Rust CLI (`reconcile-ledgers`) with semantic CSV parity harness.
- Ported evidence audit into Rust CLI (`audit-evidence`) with multi-case Node-vs-Rust parity harness.
- Ported source coverage audit into Rust CLI (`source-coverage-audit`) with markdown parity harness.
- Ported relationship-ledger quality refresh into Rust CLI (`refresh-relationship-ledger-quality`) with parity harness.
- Ported inference-notes sync into Rust CLI (`sync-inference-notes`) with parity harness.
- Ported person dossier refresh into Rust CLI (`refresh-person-dossiers`) with full-output parity harness.
- Ported rule-derived inference dossier refresh into Rust CLI (`refresh-derived-inference-dossiers`) with full-output parity harness.
- Ported curated inference dossier refresh into Rust CLI (`refresh-curated-inference-dossiers`) with full-output parity harness.
- Added source registry export artifact for modernization fixtures (`docs/modernization/baselines/datasets/sources.json`).
- Added CI parity workflow (`.github/workflows/modernization-parity.yml`).
- Re-ran full verification chain and confirmed `npm run modernization:verify` is fully green on 2026-02-12.
- Added compaction-safe status handoff (`docs/modernization/phase0/continuation-handoff.md`).
- Added initial frontend TypeScript parity module for search scoring (`apps/web/src/search/search-engine.ts`) with Node parity harness (`verify-ts-search-engine-parity.mjs`).
- Added TypeScript parity module for relationship pathfinding (`apps/web/src/graph/pathfinder.ts`) with direct legacy-vs-TS parity harness (`verify-ts-pathfinder-parity.mjs`).
- Added TypeScript parity module for relationship-neighbor extraction (`apps/web/src/graph/relationships.ts`) with deterministic parity harness (`verify-ts-relationships-parity.mjs`).

## Pending for full Phase 0 completion
- Complete feature-by-feature behavior specification with exact acceptance tests.
- Add performance benchmark automation and baseline snapshots.

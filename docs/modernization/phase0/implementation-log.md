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
- Added TypeScript search-controller parity module (`apps/web/src/ui/search-controller.ts`) with helper-level parity harness (`verify-ts-search-controller-parity.mjs`).
- Hardened TypeScript source-of-truth by stopping JS emission into `apps/web/src` and removing generated `.js` mirror files.
- Added explicit CI gates for Node install, TypeScript typecheck, and web build in modernization workflow.
- Added research-script migration tracker to enforce full Node->Rust operations migration scope (`research-script-migration-matrix.md`).
- Ported `qa-smoke` checks into Rust CLI (`qa-smoke`) with Node-vs-Rust parity harness (`verify-rust-qa-smoke-parity.mjs`).
- Added UI reference fixture export for Rust QA parity (`export-ui-reference.mjs`).
- Ported `research-baseline-report` into Rust CLI with Node-vs-Rust parity harness (`verify-rust-research-baseline-report-parity.mjs`).
- Ported `refresh-concept-entries` into Rust CLI with Node-vs-Rust parity harness (`verify-rust-refresh-concept-entries-parity.mjs`).
- Ported `build-offline-archive` into Rust CLI with Node-vs-Rust parity harness (`verify-rust-build-offline-archive-parity.mjs`).
- Ported `phase1-locator-batch-a`, `phase1-locator-batch-b`, `phase1-locator-batch-c`, `phase1-locator-batch-d`, and `phase1-locator-batch-e` into Rust CLI with parity harness (`verify-rust-phase1-locator-batches-parity.mjs`).
- Ported `phase5-conflict-batch-c`, `phase5-promotion-batch-a`, and `phase5-promotion-batch-b` into Rust CLI with parity harness (`verify-rust-phase5-batches-parity.mjs`).
- Ported `phase1-batch-a`, `phase1-batch-b`, `phase1-batch-c`, `phase1-batch-d`, and `phase1-batch-sweep` into Rust CLI with full tree parity harness (`verify-rust-phase1-batch-drivers-parity.mjs`).
- Added modernization phase reconciliation checkpoint (`progress-reconciliation-2026-02-13.md`) mapping current execution against the full TS+Rust migration plan.
- Wired TypeScript search controller into runtime scaffold (`apps/web/src/main.ts` + `apps/web/src/ui/search-runtime.ts`) with `reasonLabel` and locale adapter layer integration.
- Added TypeScript command-palette module (`apps/web/src/ui/command-palette.ts`) and shared runtime wiring via `search-runtime.ts`.
- Added command-palette parity harness (`scripts/modernization/verify-ts-command-palette-parity.mjs`) and CI/package integration.
- Extended TypeScript runtime locale adapter coverage to static shell labels, command-palette hints/placeholders, and localized ARIA text (`apps/web/src/main.ts`, `apps/web/src/ui/search-runtime.ts`).
- Added benchmark automation runner (`scripts/modernization/run-benchmarks.mjs`) and root script (`modernization:benchmark`) with snapshot exports under `docs/modernization/baselines/benchmarks/`.
- Hardened benchmark fairness by running Rust QA lane via release CLI binary (`target/release/maldives-research-cli`) rather than repeated `cargo run` invocations.
- Added warmup + sampled benchmark methodology (5 measured samples/lane) for stable Node-vs-Rust QA wall-clock comparison.
- Added explicit cold-start benchmark lane for Node-vs-Rust first-run process startup comparison.
- Added benchmark budget verifier (`scripts/modernization/verify-benchmark-budgets.mjs`) and package script (`modernization:benchmark-check`).
- Added CI benchmark budget enforcement steps in `.github/workflows/modernization-parity.yml`.
- Captured first benchmark snapshot (`benchmark-2026-02-13.json`) and published measured baseline against modernization performance targets.

## Pending for full Phase 0 completion
- Complete feature-by-feature behavior specification with exact acceptance tests.
- Add browser trace lanes for UI boot/pan/zoom/filter latency and integrate budget checker into CI.

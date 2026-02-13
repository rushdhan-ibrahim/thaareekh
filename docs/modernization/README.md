# Modernization Workspace

Date initialized: 2026-02-10

This folder tracks implementation of the TypeScript + Rust rewrite.

## Layout
- `phase0/`: parity specs, ADRs, benchmarks, and migration readiness artifacts.
- `baselines/`: frozen modernization baselines and dataset exports.
- `phase0/continuation-handoff.md`: compact restart point after context compaction.
- `phase0/research-script-migration-matrix.md`: Node->Rust research-script migration tracker.

## Core commands
- `npm run modernization:baseline`
- `npm run modernization:parity`
- `npm run modernization:export-datasets`
- `npm run modernization:export-raw-datasets`
- `npm run modernization:export-ui-reference`
- `npm run modernization:rust-derive-parity`
- `npm run modernization:qa-ledgers-rust`
- `npm run modernization:qa-smoke-rust`
- `npm run modernization:qa-smoke-parity`
- `npm run modernization:research-baseline-report-rust`
- `npm run modernization:research-baseline-report-parity`
- `npm run modernization:qa-batch-content-rust`
- `npm run modernization:qa-batch-content-parity`
- `npm run modernization:reconcile-rust`
- `npm run modernization:reconcile-parity`
- `npm run modernization:audit-evidence-rust`
- `npm run modernization:audit-evidence-parity`
- `npm run modernization:source-coverage-rust`
- `npm run modernization:source-coverage-parity`
- `npm run modernization:refresh-rel-quality-rust`
- `npm run modernization:refresh-rel-quality-parity`
- `npm run modernization:sync-inference-notes-rust`
- `npm run modernization:sync-inference-notes-parity`
- `npm run modernization:refresh-person-dossiers-rust`
- `npm run modernization:refresh-person-dossiers-parity`
- `npm run modernization:refresh-derived-dossiers-rust`
- `npm run modernization:refresh-derived-dossiers-parity`
- `npm run modernization:refresh-curated-dossiers-rust`
- `npm run modernization:refresh-curated-dossiers-parity`
- `npm run modernization:refresh-concept-entries-rust`
- `npm run modernization:refresh-concept-entries-parity`
- `npm run modernization:build-offline-archive-rust`
- `npm run modernization:build-offline-archive-parity`
- `npm run modernization:phase1-batch-a-rust`
- `npm run modernization:phase1-batch-b-rust`
- `npm run modernization:phase1-batch-c-rust`
- `npm run modernization:phase1-batch-d-rust`
- `npm run modernization:phase1-batch-sweep-rust`
- `npm run modernization:phase1-batch-drivers-parity`
- `npm run modernization:phase1-locator-batch-a-rust`
- `npm run modernization:phase1-locator-batch-b-rust`
- `npm run modernization:phase1-locator-batch-c-rust`
- `npm run modernization:phase1-locator-batch-d-rust`
- `npm run modernization:phase1-locator-batch-e-rust`
- `npm run modernization:phase1-locator-batches-parity`
- `npm run modernization:phase5-conflict-batch-c-rust`
- `npm run modernization:phase5-promotion-batch-a-rust`
- `npm run modernization:phase5-promotion-batch-b-rust`
- `npm run modernization:phase5-batches-parity`
- `npm run modernization:ts-search-engine-parity`
- `npm run modernization:ts-command-palette-parity`
- `npm run modernization:ts-search-controller-parity`
- `npm run modernization:ts-pathfinder-parity`
- `npm run modernization:ts-relationships-parity`
- `npm run modernization:benchmark`
- `npm run modernization:benchmark-check`
- `npm run modernization:verify`

## Rules
- No cutover unless parity checks pass against `baselines/baseline-latest.json`.
- Existing research artifacts in `docs/research-program/**` remain source-of-truth during migration.
- No behavior changes without explicit parity-matrix update.

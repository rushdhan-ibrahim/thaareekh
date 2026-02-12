# Modernization Workspace

Date initialized: 2026-02-10

This folder tracks implementation of the TypeScript + Rust rewrite.

## Layout
- `phase0/`: parity specs, ADRs, benchmarks, and migration readiness artifacts.
- `baselines/`: frozen modernization baselines and dataset exports.
- `phase0/continuation-handoff.md`: compact restart point after context compaction.

## Core commands
- `npm run modernization:baseline`
- `npm run modernization:parity`
- `npm run modernization:export-datasets`
- `npm run modernization:export-raw-datasets`
- `npm run modernization:rust-derive-parity`
- `npm run modernization:qa-ledgers-rust`
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
- `npm run modernization:ts-search-engine-parity`
- `npm run modernization:ts-pathfinder-parity`
- `npm run modernization:ts-relationships-parity`
- `npm run modernization:verify`

## Rules
- No cutover unless parity checks pass against `baselines/baseline-latest.json`.
- Existing research artifacts in `docs/research-program/**` remain source-of-truth during migration.
- No behavior changes without explicit parity-matrix update.

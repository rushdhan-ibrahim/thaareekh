# Research Script Migration Matrix

Date: 2026-02-12
Status: active

Goal: migrate all research operation scripts from Node/JS to Rust CLI while preserving exact behavior.

## Migrated to Rust (parity harnessed)
- `derive` dataset expansion parity.
- `qa-smoke` parity.
- `research-baseline-report` parity.
- `qa-ledgers` parity.
- `qa-batch-content` parity.
- `reconcile-ledgers` parity.
- `audit-evidence` parity.
- `source-coverage-audit` parity.
- `refresh-relationship-ledger-quality` parity.
- `sync-inference-notes` parity.
- `refresh-person-dossiers` parity.
- `refresh-derived-inference-dossiers` parity.
- `refresh-curated-inference-dossiers` parity.
- `refresh-concept-entries` parity.
- `build-offline-archive` parity.
- `phase1-locator-batch-a` parity.
- `phase1-locator-batch-b` parity.
- `phase1-locator-batch-c` parity.
- `phase1-locator-batch-d` parity.
- `phase1-locator-batch-e` parity.
- `phase1-batch-a` parity.
- `phase1-batch-b` parity.
- `phase1-batch-c` parity.
- `phase1-batch-d` parity.
- `phase1-batch-sweep` parity.
- `phase5-conflict-batch-c` parity.
- `phase5-promotion-batch-a` parity.
- `phase5-promotion-batch-b` parity.

## Pending migration (operational)
- None.

## Pending migration (batch drivers)
- None.

## Execution order
1. Operational scripts first (these affect repeatable QA, ledgers, and archival outputs).
2. Batch drivers next (these orchestrate curated research passes).
3. After each migration, add Node-vs-Rust parity harness and wire into CI.

## Guardrails
- No migration accepted without parity checks.
- No behavior changes without explicit documentation update.
- Keep legacy Node scripts available until Rust replacements are validated and adopted.

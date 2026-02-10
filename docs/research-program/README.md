# Research Program Workspace

Date initialized: 2026-02-08

This folder is the working area for the deep research drive defined in `docs/deep-research-drive-program-plan.md`.

## Structure
- `templates/`: reusable authoring templates (person, concept, inference).
- `ledgers/`: CSV trackers for person coverage, edge evidence, and inference dossiers.
- `ledgers/source-expansion-queue.csv`: prioritized Phase 1 source acquisition and corroboration queue.
- `ledgers/source-extract-log.csv`: extraction notes with locator-level progress for queued sources.
- `people/`: one dossier per person ID (`P*.md`).
- `concepts/`: one dossier per concept/system/title/office/institution.
- `inferences/`: one dossier per inferred edge pair.
- `title-style-register.md`: periodized title/office/style interpretation register.
- `etymology-sobriquet-register.md`: attested etymology and sobriquet tracking register.
- `../confidence-grade-explainer.md`: user-facing definitions for confidence classes and source grades.
- `baseline-metrics-*.md`: timestamped baseline/progress metric snapshots.
- `source-coverage-audit-*.md`: source concentration and coverage-gap audits.

## Usage flow
1. Update graph/source records and citations first.
2. Run `node scripts/reconcile-research-ledgers.mjs` to sync person/relationship/inference/concept ledgers with the current research graph.
3. Regenerate pair dossiers and inference notes:
   - `node scripts/refresh-curated-inference-dossiers.mjs`
   - `node scripts/refresh-derived-inference-dossiers.mjs`
   - `node scripts/sync-curated-inference-notes.mjs`
4. Refresh person dossiers when needed: `node scripts/refresh-person-dossiers.mjs`.
5. Run QA and promotion checks before canonical promotion.

## Ledger safety
- `node scripts/research-baseline-report.mjs` updates only baseline metric markdown by default.
- Use `node scripts/research-baseline-report.mjs --write-ledgers` only when intentionally regenerating person/relationship/inference ledgers from dataset baselines.

## Required linkage
- Every inferred edge in data must map to exactly one dossier in `inferences/`.
- Every person in the graph must map to one dossier in `people/`.
- Every edge claim in data must have a row in relationship evidence ledger.

## Reconciliation safety
- `scripts/reconcile-research-ledgers.mjs` archives stale relationship/inference ledger rows under `ledgers/archive/` before final write.
- Archived inference markdown files from tracker drift are stored under `inferences/archive-YYYY-MM-DD/`.

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
1. Update source records and citations first.
2. Fill or revise person/concept/inference dossiers.
3. Reflect claim-level updates in ledgers.
4. Run QA and promotion checks before canonical promotion.

## Ledger safety
- `node scripts/research-baseline-report.mjs` updates only baseline metric markdown by default.
- Use `node scripts/research-baseline-report.mjs --write-ledgers` only when intentionally regenerating person/relationship/inference ledgers from dataset baselines.

## Required linkage
- Every inferred edge in data must map to exactly one dossier in `inferences/`.
- Every person in the graph must map to one dossier in `people/`.
- Every edge claim in data must have a row in relationship evidence ledger.

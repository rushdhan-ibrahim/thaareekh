# Phase 0 Continuation Handoff

Date: 2026-02-13
Status: active

This document is the compact resumption point for modernization work after context compaction.
For phase-vs-plan reconciliation, see `docs/modernization/phase0/progress-reconciliation-2026-02-13.md`.

## Current verified state
- Full modernization verification is passing locally via `npm run modernization:verify`.
- Rust parity is complete for all currently migrated research pipeline jobs listed in `package.json`.
- CI workflow includes parity steps for all migrated Rust jobs in `.github/workflows/modernization-parity.yml`.
- CI workflow now includes mandatory `npm ci`, `npm run typecheck`, and `npm run build:web` gates.

## Rust parity ports completed
- Dataset derive parity (`verify-rust-derive-parity.mjs`).
- QA smoke parity (`qa-smoke`).
- Research baseline-report parity (`research-baseline-report`).
- Ledger QA parity (`qa-ledgers`).
- Batch-content QA parity (`qa-batch-content`).
- Ledger reconcile parity (`reconcile-ledgers`).
- Evidence audit parity (`audit-evidence`).
- Source coverage audit parity (`source-coverage-audit`).
- Relationship ledger quality refresh parity (`refresh-relationship-ledger-quality`).
- Inference notes sync parity (`sync-inference-notes`).
- Person dossier refresh parity (`refresh-person-dossiers`).
- Rule-derived inference dossier refresh parity (`refresh-derived-inference-dossiers`).
- Curated inference dossier refresh parity (`refresh-curated-inference-dossiers`).
- Concept entry refresh parity (`refresh-concept-entries`).
- Offline archive build parity (`build-offline-archive`).
- Phase 1 locator batch parity (`phase1-locator-batch-a`, `phase1-locator-batch-b`, `phase1-locator-batch-c`, `phase1-locator-batch-d`, `phase1-locator-batch-e`).
- Phase 1 batch driver parity (`phase1-batch-a`, `phase1-batch-b`, `phase1-batch-c`, `phase1-batch-d`, `phase1-batch-sweep`).
- Phase 5 conflict/promotion batch parity (`phase5-conflict-batch-c`, `phase5-promotion-batch-a`, `phase5-promotion-batch-b`).

## Known parity caveats (intentional)
- `sync-inference-notes` uses semantic parity, not raw file-text parity.
- Rationale: generated object-key ordering can differ while behavior is equivalent.
- Harness: `scripts/modernization/verify-rust-sync-inference-notes-parity.mjs` validates effective content mapping for all tracker keys.
- Frontend TS parity scripts currently execute with Node's `--experimental-strip-types`.
- Rationale: deterministic parity checks can run without requiring local TypeScript toolchain install.

## Canonical commands for re-validation
- `cargo fmt --all`
- `cargo check`
- `npm run typecheck`
- `npm run build:web`
- `npm run modernization:verify`

## Frontend TypeScript migration status
- Scaffold exists in `apps/web` (Vite + strict TypeScript).
- Search scoring engine parity module is migrated:
  - Legacy source: `src/ui/search-engine.js` (core ranking logic).
  - TS target: `apps/web/src/search/search-engine.ts`.
  - Parity harness: `scripts/modernization/verify-ts-search-engine-parity.mjs`.
- Search controller core parity module is migrated:
  - Legacy source: `src/ui/search.js`.
  - TS target: `apps/web/src/ui/search-controller.ts`.
  - Parity harness: `scripts/modernization/verify-ts-search-controller-parity.mjs`.
- Relationship pathfinding parity module is migrated:
  - Legacy source: `src/graph/pathfinder.js`.
  - TS target: `apps/web/src/graph/pathfinder.ts`.
  - Parity harness: `scripts/modernization/verify-ts-pathfinder-parity.mjs`.
- Relationship-neighbor extraction parity module is migrated:
  - Legacy source: `src/graph/relationships.js`.
  - TS target: `apps/web/src/graph/relationships.ts`.
  - Parity harness: `scripts/modernization/verify-ts-relationships-parity.mjs`.
- Full DOM wiring cutover for search controller is still pending.
- Search runtime cutover is now wired in scaffold runtime (`apps/web/src/main.ts`, `apps/web/src/ui/search-runtime.ts`), including locale and reason-label adapter hooks.

## Next prioritized backlog (in order)
1. Complete search UI controller DOM wiring cutover to TypeScript runtime module.
2. Validate and extend locale/runtime adapter coverage beyond search (command palette + sidebar labels).
3. Complete command-palette runtime parity and unify shortcut behavior with graph/tree interaction focus states.
4. Continue feature matrix UX section top-down (filters, sidebar evidence cards, compare flow).
5. Add benchmark automation for search, pathfinding, and first-paint responsiveness.
6. Extend parity harnesses for any future research-driver additions before cutover.

## Non-negotiable constraints during migration
- No functionality loss.
- No knowledge/research data loss.
- Legacy Node/JS path remains source-of-truth until feature-level parity checks are green.
- Research operation script migration sequence is tracked in `docs/modernization/phase0/research-script-migration-matrix.md`.

# Phase 0 Continuation Handoff

Date: 2026-02-12
Status: active

This document is the compact resumption point for modernization work after context compaction.

## Current verified state
- Full modernization verification is passing locally via `npm run modernization:verify`.
- Rust parity is complete for all currently migrated research pipeline jobs listed in `package.json`.
- CI workflow includes parity steps for all migrated Rust jobs in `.github/workflows/modernization-parity.yml`.

## Rust parity ports completed
- Dataset derive parity (`verify-rust-derive-parity.mjs`).
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

## Known parity caveats (intentional)
- `sync-inference-notes` uses semantic parity, not raw file-text parity.
- Rationale: generated object-key ordering can differ while behavior is equivalent.
- Harness: `scripts/modernization/verify-rust-sync-inference-notes-parity.mjs` validates effective content mapping for all tracker keys.
- Frontend TS parity scripts currently execute with Node's `--experimental-strip-types`.
- Rationale: deterministic parity checks can run without requiring local TypeScript toolchain install.

## Canonical commands for re-validation
- `cargo fmt --all`
- `cargo check`
- `npm run modernization:verify`

## Frontend TypeScript migration status
- Scaffold exists in `apps/web` (Vite + strict TypeScript).
- Search scoring engine parity module is migrated:
  - Legacy source: `src/ui/search-engine.js` (core ranking logic).
  - TS target: `apps/web/src/search/search-engine.ts`.
  - Parity harness: `scripts/modernization/verify-ts-search-engine-parity.mjs`.
- Relationship pathfinding parity module is migrated:
  - Legacy source: `src/graph/pathfinder.js`.
  - TS target: `apps/web/src/graph/pathfinder.ts`.
  - Parity harness: `scripts/modernization/verify-ts-pathfinder-parity.mjs`.
- Relationship-neighbor extraction parity module is migrated:
  - Legacy source: `src/graph/relationships.js`.
  - TS target: `apps/web/src/graph/relationships.ts`.
  - Parity harness: `scripts/modernization/verify-ts-relationships-parity.mjs`.
- Search UI controller parity (`src/ui/search.js`) is still pending.

## Next prioritized backlog (in order)
1. Migrate search UI controller to TypeScript and verify keyboard + dropdown behavior parity.
2. Add TS adapter layer for `reasonLabel` and locale hooks in app runtime wiring.
3. Migrate command-palette interaction module and dedupe with shared search engine.
4. Continue feature matrix UX section top-down (filters, sidebar evidence cards, compare flow).
5. Add benchmark automation for search, pathfinding, and first-paint responsiveness.

## Non-negotiable constraints during migration
- No functionality loss.
- No knowledge/research data loss.
- Legacy Node/JS path remains source-of-truth until feature-level parity checks are green.

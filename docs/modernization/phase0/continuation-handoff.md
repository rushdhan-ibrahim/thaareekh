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
- Benchmark automation is wired via `npm run modernization:benchmark` with snapshots written to `docs/modernization/baselines/benchmarks/`.
- Benchmark budget checker is wired via `npm run modernization:benchmark-check` and enforced in modernization CI workflow.
- Latest benchmark snapshot date: 2026-02-13 (`benchmark-latest.json`).
- UI trace lane attempt checkpoint is documented in `docs/modernization/phase0/ui-trace-progress-2026-02-13.md`.

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
- `npm run modernization:benchmark`
- `npm run modernization:benchmark-check`

## Frontend TypeScript migration status — PHASE 3 COMPLETE

All 20+ legacy JS modules have been ported to TypeScript with dependency injection.
Total: ~9,300 lines of TypeScript across 24 modules, 16 parity harnesses, 38 total parity checks.

### Modules ported (in dependency order)
1. **Types**: `state.ts`, `legacy-modules.d.ts` — domain types, ambient module declarations
2. **Utils**: `css.ts` (cs/eC/nC), `format.ts` (fR/esc), `dynasties.ts` (buildDynastySet)
3. **i18n**: `i18n.ts` — 530 keys en+dv, t(), personName(), relationLabel(), refreshChromeLabels()
4. **Graph core**: `filter.ts` (filterCore), `highlight.ts` (hiN/hiE/clH), `relationships.ts` (gNb/parOf/chOf), `pathfinder.ts` (BFS path finding)
5. **Search**: `search-engine.ts`, `search-controller.ts`, `command-palette.ts`, `search-runtime.ts`
6. **Light UI**: `hover-card.ts`, `theme.ts`, `commandbar.ts`, `timeline-viz.ts`, `modal.ts`, `onboarding.ts`
7. **State/nav**: `viewstate.ts`, `history.ts`, `navigation.ts`, `keyboard-nav.ts`, `storytrails.ts`, `minimap.ts`
8. **Complex**: `compare.ts`, `exporter.ts`, `tree-options.ts`
9. **Heavy pair**: `sidebar.ts` (1215 lines), `rebuild.ts` (1489 lines)
10. **Orchestration**: `main.ts` (985 lines) — wires all modules

### Parity harnesses (16 total)
- search-engine, command-palette, search-controller, pathfinder, relationships
- i18n, filter, highlight, viewstate, history, keyboard-nav, minimap
- compare, tree-options, sidebar, rebuild

## Phase 6 cutover status
- Root `index.html` updated: loads `apps/web/dist/assets/main.js` (Vite bundle) + `apps/web/dist/assets/index.css`.
- CDN externals: d3@7, @floating-ui/dom@1, gsap@3 resolved by importmap at runtime.
- `sw.js` CACHE_NAME bumped to `v9` with modernized asset list.
- `apps/web/dist/` tracked in git for static deployment (removed from `.gitignore`).
- Build: `npm run build:web` — typecheck + Vite build (55 modules, ~400ms).

## Next prioritized backlog (in order)
1. **Phase 6**: Shadow-run comparison — run legacy (`src/main.js`) and modernized (`apps/web/dist/assets/main.js`) side by side; manual UX walkthrough.
2. **Phase 6**: Tag `v2.0.0-modernized`, keep legacy `src/` for 1 release cycle.
3. **Phase 5**: Integrate CDP-based UI benchmark runner into `modernization:benchmark` (paused due to environment constraints).
4. **Phase 5**: Add browser trace lanes for FMP, TTI, pan/zoom fps, filter toggle latency.
5. Optimize Rust cold-start startup path for short-lived CLI invocation.

## Non-negotiable constraints during migration
- No functionality loss.
- No knowledge/research data loss.
- Legacy Node/JS path remains source-of-truth until feature-level parity checks are green.
- Research operation script migration sequence is tracked in `docs/modernization/phase0/research-script-migration-matrix.md`.

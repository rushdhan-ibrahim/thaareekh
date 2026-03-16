# Phase 0 Continuation Handoff

Date: 2026-02-21
Status: active

This document is the compact resumption point for modernization work after context compaction.
For phase-vs-plan reconciliation, see `docs/modernization/phase0/progress-reconciliation-2026-02-20.md`.

## Current verified state
- Latest full modernization verification run was passing; this checkpoint was validated with targeted gates due local long-chain execution stalls:
  - `./node_modules/.bin/tsc --noEmit -p apps/web/tsconfig.json --pretty false`
  - `node --experimental-strip-types scripts/modernization/verify-ts-rebuild-parity.mjs`
  - `node --experimental-strip-types scripts/modernization/verify-tree-placement-worker-parity.mjs`
  - `npm run modernization:parity`
  - `npm run modernization:benchmark-check`
  - `npm run modernization:benchmark-check:require-ui`
- Baseline parity is passing against refreshed baseline (2026-02-20): canonical `204 people / 565 edges`, research `204 people / 573 edges`.
- Rust parity is complete for all currently migrated research pipeline jobs listed in `package.json`.
- CI workflow includes parity steps for all migrated Rust jobs in `.github/workflows/modernization-parity.yml`.
- CI workflow now includes mandatory `npm ci`, `npm run typecheck`, and `npm run build:web` gates.
- `build:web` orchestration is now deterministic:
  - root script runs direct `tsc --noEmit -p apps/web/tsconfig.json --pretty false` before workspace Vite build;
  - `apps/web` build script is Vite-only (`vite build`).
- Benchmark automation is wired via `npm run modernization:benchmark` with snapshots written to `docs/modernization/baselines/benchmarks/`.
- Benchmark budget checker is wired via `npm run modernization:benchmark-check` and enforced in modernization CI workflow.
- UI benchmark lane is now integrated in benchmark payload (`lanes.ui_browser`) with explicit availability policy and strict mode command (`npm run modernization:benchmark-check:require-ui`).
- UI runner now emits actionable diagnostics for environment failures (CDP port probe errors and per-launch Chrome exit metadata).
- Strict UI budget gate now passes in full-access local runs (`npm run modernization:benchmark-check:require-ui`).
- Modernization CI now hardens UI lane execution profile:
  - `UI_BENCH_SERVE_MODE=http` is pinned;
  - `CHROME_BIN` is auto-detected before benchmark execution.
- Phase B render scheduler is active in both entrypoints (`apps/web/src/main.ts`, `src/main.js`) with invalidation flags and frame-batched rebuild dispatch.
- Phase C initial incremental DOM rollout is active in both rebuild paths (`apps/web/src/graph/rebuild.ts`, `src/graph/rebuild.js`) with persistent mode roots and keyed joins for core graph/tree layers.
- Phase D simulation lifecycle optimization is now active in both rebuild paths:
  - simulation instance reuse,
  - frame-budgeted tick DOM sync,
  - stable-layout early-stop heuristics.
- Phase E cache-first tree optimization is now active in both rebuild paths:
  - tree placement memoization keyed by language/density/node+edge shape signatures.
- Phase E optional worker-prewarm extension is now integrated in both runtimes:
  - shared tree placement compute cores (`tree-placement-core`);
  - background prewarm worker (`tree-placement-worker`) with sync fallback path.
- Targeted tree-placement worker parity harness is now in place and green:
  - `scripts/modernization/verify-tree-placement-worker-parity.mjs`
  - enforced in CI via `npm run modernization:tree-placement-worker-parity`.
- Tree-placement worker policy is now closed:
  - decision artifact: `docs/modernization/phase0/tree-worker-policy-decision-2026-02-21.md`;
  - benchmark artifact: `docs/modernization/baselines/benchmarks/tree-worker-policy-latest.json`;
  - default policy: enabled by default with opt-out support.
- Worker policy control surface is now explicit in both runtimes:
  - URL query: `?tree_worker=on|off`;
  - globals: `window.__treePlacementWorkerPolicy` (`on|off|auto`) and legacy `window.__disableTreePlacementWorker`.
- Phase F data-path optimization is now active in both rebuild paths and main orchestration:
  - persistent `nodeById`, typed adjacency, and selection-edge indexes;
  - O(1) edge restore path for history/selection where available.
- Latest benchmark snapshot date: 2026-02-21 (`benchmark-latest.json`).
- UI trace lane attempt checkpoint is documented in `docs/modernization/phase0/ui-trace-progress-2026-02-13.md`.
- Verification-ledger UI integration checkpoint is documented in `docs/modernization/phase0/verification-ledger-ui-integration-2026-02-20.md`.
- Verification ledger module is now lazy-loaded as a split chunk (`relationship-verification.js`) to reduce eager JS payload.
- Current graph/tree performance execution blueprint is documented in `docs/modernization/phase0/performance-optimization-plan-2026-02-20.md`.
- Phase G hardening checkpoint for this rollout is documented in `docs/modernization/phase0/phase-g-hardening-checkpoint-2026-02-20.md`.

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
- In some environments, `cargo run`-driven parity chains can stall in Cargo fingerprint scanning.
- Preferred mitigation for spot-checks is using the already-built release binary (`target/release/maldives-research-cli`) where command parity harnesses permit it.

## Canonical commands for re-validation
- `cargo fmt --all`
- `cargo check`
- `cargo run -q -p maldives-research-cli -- sync-edge-verification-index .`
- `npm run typecheck`
- `npm run build:web`
- `npm run research:sync-edge-verification-index`
- `npm run modernization:verify`
- `npm run modernization:tree-placement-worker-parity`
- `npm run modernization:benchmark:tree-worker-policy`
- `npm run modernization:benchmark`
- `npm run modernization:benchmark-check`
- `npm run modernization:benchmark-check:require-ui`

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
- Build: `npm run build:web` passing (direct root `tsc` gate + workspace Vite build).

## Next prioritized backlog (in order)
1. Optimize Rust cold-start startup path for short-lived CLI invocation.
2. Extend UI lane with era-slider drag jank metric after strict UI profile is stable.
3. Decide when strict UI lane should become always-on required after CI stability window.

## Non-negotiable constraints during migration
- No functionality loss.
- No knowledge/research data loss.
- Legacy Node/JS path remains source-of-truth until feature-level parity checks are green.
- Research operation script migration sequence is tracked in `docs/modernization/phase0/research-script-migration-matrix.md`.

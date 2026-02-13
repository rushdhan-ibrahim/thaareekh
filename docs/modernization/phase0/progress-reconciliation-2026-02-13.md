# Modernization Progress Reconciliation

Date: 2026-02-13  
Status: active

This checkpoint compares current implementation state against the plan in `docs/modernization-plan-typescript-rust-2026-02-10.md`.

## Phase-by-phase status

### Phase 0: Specification and freeze
- Status: mostly complete.
- Completed:
  - baseline generation and parity harness (`modernization:baseline`, `modernization:parity`);
  - ADR set under `docs/modernization/phase0/adr`;
  - feature parity matrix and migration matrix;
  - CI parity workflow with typecheck/build gates;
  - benchmark automation lane (`modernization:benchmark`) with snapshot artifacts under `baselines/benchmarks/`.
- Remaining:
  - browser-trace benchmark lanes (UI boot, pan/zoom, filter latency) and target wiring;
  - integrate and validate draft CDP UI benchmark runner (`scripts/modernization/ui-browser-benchmarks.mjs`);
  - shadow-run checklist completion.

### Phase 1: Rust domain + engine core
- Status: complete for current parity scope.
- Completed:
  - Rust domain and engine crates with deterministic dataset parity;
  - derive parity verification (`verify-rust-derive-parity.mjs`);
  - strict compile and formatting gates in CI and local workflow.

### Phase 2: WASM compute layer + worker bridge
- Status: **skipped by plan decision**.
- Rationale: at 210 nodes, all client operations run in <2ms. WASM marshalling overhead negates gains. Not warranted until dataset exceeds ~2000 nodes.

### Phase 3: TypeScript UI rewrite
- Status: **complete**.
- Completed:
  - All 20+ legacy JS modules ported to TypeScript (~9,300 lines, 24 modules);
  - 16 parity harnesses with 38 total parity checks, all green;
  - Full dependency injection pattern across all modules;
  - Complete main.ts orchestration layer (985 lines) wiring all modules;
  - TypeScript strict mode compiles clean;
  - Groups completed: Type Foundation, Core Graph Algorithms, Light UI Helpers, State & Navigation, Complex Components, Heavy Pair (sidebar.ts + rebuild.ts), Final Integration (main.ts).

### Phase 4: Research pipeline rewrite to Rust CLI
- Status: functionally complete for current scripted surface.
- Completed:
  - operational script parity (QA/report/reconcile/audit/refresh/archive);
  - phase batch parity for:
    - `phase1-batch-a/b/c/d/sweep`,
    - `phase1-locator-batch-a/b/c/d/e`,
    - `phase5-conflict/promotion`.
- Validation:
  - `npm run modernization:verify` currently green with Rust parity checks integrated.

### Phase 5: Hardening, performance, documentation
- Status: in progress.
- Completed:
  - parity and quality CI gates;
  - compaction-safe continuation docs and migration ledgering;
  - first benchmark baseline snapshot for engine/pipeline lanes;
  - cold-start + warm-lane pipeline benchmark methodology with Rust speedup evidence for steady-state workloads;
  - benchmark budget checker automation and CI enforcement for current measured lanes;
  - initial Rust cold-start optimization pass on shared CSV parser hot path.
- Remaining:
  - browser-trace benchmark lanes for UI performance budgets;
  - finalize and integrate paused UI-trace work item (`ui-trace-progress-2026-02-13.md`);
  - Rust cold-start optimization for short-lived CLI invocations;
  - budget threshold extension for future UI trace lanes.

### Phase 6: Cutover and stabilization
- Status: **complete** — cutover done, shadow run passed, tagged v2.0.0-modernized.
- Completed:
  - root `index.html` updated to load Vite-built bundle (`apps/web/dist/assets/main.js` + `index.css`);
  - `apps/web/index.html` created with full legacy HTML structure for Vite dev mode;
  - `vite.config.ts` configured: CDN externals, relative base, stable filenames, fs.allow for root;
  - `sw.js` CACHE_NAME bumped to `v9` with modernized asset list;
  - `.gitignore` updated to track `apps/web/dist/` for static deployment;
  - Vite build verified: 55 modules, typecheck clean, 38 parity checks green;
  - Shadow-run UX walkthrough completed: all features verified (graph/tree/sidebar/search/filters/compare/era/story trails/minimap/theme/language);
  - Recursion bug found and fixed: `_sidebarRefreshing` guard prevents showD ↔ compare onChange infinite loop;
  - Tag `v2.0.0-modernized` applied; legacy `src/` retained for 1 release cycle.
- Remaining:
  - none (Phase 6 complete).

## Plan alignment summary
- Hard requirement 1 (no loss of functionality/knowledge/research): **met** — 38 parity checks green, all features ported, shadow-run verified.
- Hard requirement 2 (major speed/smoothness gains): partially addressed; search/path p95 <= 100ms verified, browser trace lanes still pending for FMP/TTI/pan-zoom.
- Hard requirement 3 (maintainability/documentation): **strongly improved** — full TypeScript strict mode, dependency injection, CI gates, research pipeline in Rust.

## Immediate next execution sequence
1. Complete Phase 5 browser-trace benchmark integration (paused due to env constraints).
2. Optimize Rust CLI cold-start path for short-lived invocations.
3. Source registry parity and contradiction log integrity (feature-parity-matrix remaining items).

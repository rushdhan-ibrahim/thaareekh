# Phase 0 Implementation Log

Date: 2026-02-10

## Completed in this pass
- Established modernization workspace docs and ADR set.
- Added baseline generation script (`scripts/modernization/generate-baseline.mjs`).
- Added parity check script (`scripts/modernization/check-parity.mjs`).
- Added dataset export script (`scripts/modernization/export-datasets.mjs`).
- Added pre-derived dataset export script (`scripts/modernization/export-raw-datasets.mjs`).
- Added Rust derive parity verifier (`scripts/modernization/verify-rust-derive-parity.mjs`).
- Added JSON schema foundation (`schemas/dataset.schema.json`).
- Added TypeScript web scaffold (`apps/web`).
- Added Rust workspace scaffold (`crates/domain`, `crates/engine`, `crates/research-cli`).
- Ported research ledger QA checks into Rust CLI (`qa-ledgers`).
- Ported batch content QA into Rust CLI (`qa-batch-content`) with Node-vs-Rust parity harness.
- Ported ledger reconciliation into Rust CLI (`reconcile-ledgers`) with semantic CSV parity harness.
- Ported evidence audit into Rust CLI (`audit-evidence`) with multi-case Node-vs-Rust parity harness.
- Ported source coverage audit into Rust CLI (`source-coverage-audit`) with markdown parity harness.
- Ported relationship-ledger quality refresh into Rust CLI (`refresh-relationship-ledger-quality`) with parity harness.
- Ported inference-notes sync into Rust CLI (`sync-inference-notes`) with parity harness.
- Ported person dossier refresh into Rust CLI (`refresh-person-dossiers`) with full-output parity harness.
- Ported rule-derived inference dossier refresh into Rust CLI (`refresh-derived-inference-dossiers`) with full-output parity harness.
- Ported curated inference dossier refresh into Rust CLI (`refresh-curated-inference-dossiers`) with full-output parity harness.
- Added source registry export artifact for modernization fixtures (`docs/modernization/baselines/datasets/sources.json`).
- Added CI parity workflow (`.github/workflows/modernization-parity.yml`).
- Re-ran full verification chain and confirmed `npm run modernization:verify` is fully green on 2026-02-12.
- Added compaction-safe status handoff (`docs/modernization/phase0/continuation-handoff.md`).
- Added initial frontend TypeScript parity module for search scoring (`apps/web/src/search/search-engine.ts`) with Node parity harness (`verify-ts-search-engine-parity.mjs`).
- Added TypeScript parity module for relationship pathfinding (`apps/web/src/graph/pathfinder.ts`) with direct legacy-vs-TS parity harness (`verify-ts-pathfinder-parity.mjs`).
- Added TypeScript parity module for relationship-neighbor extraction (`apps/web/src/graph/relationships.ts`) with deterministic parity harness (`verify-ts-relationships-parity.mjs`).
- Added TypeScript search-controller parity module (`apps/web/src/ui/search-controller.ts`) with helper-level parity harness (`verify-ts-search-controller-parity.mjs`).
- Hardened TypeScript source-of-truth by stopping JS emission into `apps/web/src` and removing generated `.js` mirror files.
- Added explicit CI gates for Node install, TypeScript typecheck, and web build in modernization workflow.
- Added research-script migration tracker to enforce full Node->Rust operations migration scope (`research-script-migration-matrix.md`).
- Ported `qa-smoke` checks into Rust CLI (`qa-smoke`) with Node-vs-Rust parity harness (`verify-rust-qa-smoke-parity.mjs`).
- Added UI reference fixture export for Rust QA parity (`export-ui-reference.mjs`).
- Ported `research-baseline-report` into Rust CLI with Node-vs-Rust parity harness (`verify-rust-research-baseline-report-parity.mjs`).
- Ported `refresh-concept-entries` into Rust CLI with Node-vs-Rust parity harness (`verify-rust-refresh-concept-entries-parity.mjs`).
- Ported `build-offline-archive` into Rust CLI with Node-vs-Rust parity harness (`verify-rust-build-offline-archive-parity.mjs`).
- Ported `phase1-locator-batch-a`, `phase1-locator-batch-b`, `phase1-locator-batch-c`, `phase1-locator-batch-d`, and `phase1-locator-batch-e` into Rust CLI with parity harness (`verify-rust-phase1-locator-batches-parity.mjs`).
- Ported `phase5-conflict-batch-c`, `phase5-promotion-batch-a`, and `phase5-promotion-batch-b` into Rust CLI with parity harness (`verify-rust-phase5-batches-parity.mjs`).
- Ported `phase1-batch-a`, `phase1-batch-b`, `phase1-batch-c`, `phase1-batch-d`, and `phase1-batch-sweep` into Rust CLI with full tree parity harness (`verify-rust-phase1-batch-drivers-parity.mjs`).
- Added modernization phase reconciliation checkpoint (`progress-reconciliation-2026-02-13.md`) mapping current execution against the full TS+Rust migration plan.
- Wired TypeScript search controller into runtime scaffold (`apps/web/src/main.ts` + `apps/web/src/ui/search-runtime.ts`) with `reasonLabel` and locale adapter layer integration.
- Added TypeScript command-palette module (`apps/web/src/ui/command-palette.ts`) and shared runtime wiring via `search-runtime.ts`.
- Added command-palette parity harness (`scripts/modernization/verify-ts-command-palette-parity.mjs`) and CI/package integration.
- Extended TypeScript runtime locale adapter coverage to static shell labels, command-palette hints/placeholders, and localized ARIA text (`apps/web/src/main.ts`, `apps/web/src/ui/search-runtime.ts`).
- Added benchmark automation runner (`scripts/modernization/run-benchmarks.mjs`) and root script (`modernization:benchmark`) with snapshot exports under `docs/modernization/baselines/benchmarks/`.
- Hardened benchmark fairness by running Rust QA lane via release CLI binary (`target/release/maldives-research-cli`) rather than repeated `cargo run` invocations.
- Added warmup + sampled benchmark methodology (5 measured samples/lane) for stable Node-vs-Rust QA wall-clock comparison.
- Added explicit cold-start benchmark lane for Node-vs-Rust first-run process startup comparison.
- Added benchmark budget verifier (`scripts/modernization/verify-benchmark-budgets.mjs`) and package script (`modernization:benchmark-check`).
- Added CI benchmark budget enforcement steps in `.github/workflows/modernization-parity.yml`.
- Optimized Rust CSV parsing path (`crates/research-cli/src/csv_utils.rs`) by removing `Vec<char>` materialization and switching to streaming parse iteration.
- Captured first benchmark snapshot (`benchmark-2026-02-13.json`) and published measured baseline against modernization performance targets.
- Started dependency-free UI trace lane implementation with draft CDP runner (`scripts/modernization/ui-browser-benchmarks.mjs`); paused before integration due environment constraints documented in `ui-trace-progress-2026-02-13.md`.
- Added TypeScript type foundation: expanded `state.ts` (InferenceBasis, PersonNode simulation fields, _badgeData), expanded `legacy-modules.d.ts` (office timeline, sourceById, geo functions, inference-notes functions, era milestones, timeline extent).
- Added TypeScript i18n module (`apps/web/src/ui/i18n.ts`) — full 530-key en+dv dictionary, `t()`, `personName()`, `relationLabel()`, `refreshChromeLabels()`, `setLanguage()`, NAME_DV map. Parity harness: 260 en keys, 237 dv keys, 210 people.
- Added TypeScript utils: `css.ts` (cs/eC/nC), `format.ts` (fR/esc), `dynasties.ts` (dyS).
- Added TypeScript graph algorithms: `filter.ts` (filterCore with dependency injection, 6 config parity), `highlight.ts` (hiN/hiE/clH, ancestralEdgeKeys, linkKey, 7 tests).
- Added TypeScript light UI helpers: `hover-card.ts`, `theme.ts`, `commandbar.ts`, `timeline-viz.ts`, `modal.ts`, `onboarding.ts`.
- Added TypeScript state & navigation modules: `viewstate.ts` (8 tests), `history.ts` (15 tests), `navigation.ts`, `keyboard-nav.ts` (11 tests), `storytrails.ts`, `minimap.ts` (19 tests).
- Added TypeScript complex components: `compare.ts` (25 tests), `exporter.ts`, `tree-options.ts` (7 tests).
- Added TypeScript heavy pair: `sidebar.ts` (1215 lines, full port of sidebar.js — dependency injection via SidebarDeps, estLife/sourceQualityWeight pure helpers, 30 tests), `rebuild.ts` (1489 lines, full port of rebuild.js — dependency injection via RebuildDeps, degreeRank/earliestYear/chronoPostProcess pure helpers, 26 tests).
- Registered all 16 TS parity harnesses in package.json verify chain (38 total parity checks now green).
- Full main.ts rewrite (985 lines): wires all 20+ TS modules together with dependency injection, replaces scaffold stub. Imports all data modules, creates AppState, bound helpers (goF, hiN, hiE, clH, etc.), filter wrapper with eraPersonOk computation, era controls, filter panel, sidebar/selection management, view mode toggles, density/overlay/focus controls, story trail sync, global event listeners (zoom-changed, lang-changed, selection-changed, resize, request-sidebar-open, parallax pattern), service worker registration, dynasty dropdown population, saved view state restoration.

- Phase 6 cutover: replaced root `index.html` to load Vite-built bundle from `apps/web/dist/assets/main.js` (bundled TS + data modules, 1,054 kB / 164 kB gzip) and `apps/web/dist/assets/index.css` (bundled 9 CSS files, 38 kB / 8 kB gzip). CDN externals (d3, gsap, @floating-ui/dom) resolved by importmap at runtime.
- Phase 6 cutover: updated `apps/web/index.html` with full legacy HTML structure for Vite dev mode; CSS paths resolve to `../../css/`, script entry is `/src/main.ts`.
- Phase 6 cutover: updated `apps/web/vite.config.ts` with `base: './'` for relative paths, `build.rollupOptions.external` for CDN libs, `server.fs.allow` for root access, stable output filenames (no content hashes).
- Phase 6 cutover: bumped `sw.js` CACHE_NAME from `v8` to `v9`, replaced 40+ legacy JS module entries with 2 Vite bundle entries (`main.js` + `index.css`), added `@floating-ui/dom` and `gsap` to EXTERNAL_ASSETS.
- Phase 6 cutover: updated `.gitignore` to track `apps/web/dist/` build artifacts (required for static site deployment).
- Build verification: 55 modules transformed, Vite build completes in ~400ms, typecheck clean, 38 parity checks green.

## Pending for full Phase 0 completion
- Complete feature-by-feature behavior specification with exact acceptance tests.
- Add browser trace lanes for UI boot/pan/zoom/filter latency and integrate budget checker into CI.

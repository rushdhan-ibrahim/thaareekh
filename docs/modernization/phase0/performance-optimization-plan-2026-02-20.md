# Performance Optimization Plan (Graph + Tree)

Date: 2026-02-20  
Status: active (Phase A integrated, Phase B complete, Phase C complete, Phase D complete, Phase E cache + worker-prewarm rollout complete, Phase F complete, Phase G hardening follow-through delivered; worker default policy finalized)  
Scope: legacy JS path and modern TypeScript path, with Rust acceleration where it materially improves UI responsiveness

## Objectives

1. No loss of features, knowledge, data fidelity, or explainability.
2. Substantially lower interaction latency and smoother pan/zoom/tree interactions.
3. Deterministic maintainability: explicit budgets, measurable gates, and compaction-safe progress logs.

## Current state summary

Code audit findings:

- Full rebuilds are still required for structural graph/tree updates, but rapid input storms are now batched via render invalidation scheduler in both runtimes (`apps/web/src/main.ts`, `src/main.js`).
- Graph/tree rendering now uses persistent mode roots plus keyed joins for core layers (links/nodes/labels/badges/section overlays) in both runtimes (`apps/web/src/graph/rebuild.ts`, `src/graph/rebuild.js`), replacing blanket content teardown.
- Tree layout is compute-heavy and fully synchronous in the main thread (`apps/web/src/graph/rebuild.ts`).
- UI performance lanes are integrated into benchmark payloads and operational in full-access runs; restricted sandboxes may still report unavailable due CDP limits (`scripts/modernization/ui-browser-benchmarks.mjs`, `scripts/modernization/run-benchmarks.mjs`).
- Dataset scale is now meaningful for interactivity pressure (research dataset: 204 people, 573 edges).

## Execution checkpoint (2026-02-20)

- Phase A delivered:
  - UI benchmark lane is integrated into `modernization:benchmark` output as `lanes.ui_browser`.
  - Benchmark budget checker supports strict UI mode (`modernization:benchmark-check:require-ui`) and warning-only fallback when unavailable.
  - UI runner now captures actionable diagnostics (CDP port probe errors, launch-attempt tails, Chrome exit signals).
  - UI frame metric corrected to per-frame normalization; strict UI budget gate now passes in full-access local runs.
- Phase B initial rollout delivered:
  - Added render invalidation scheduler (`geometryDirty`, `styleDirty`, `selectionDirty`, `overlayDirty`, `eraVisibilityDirty`) in:
    - `apps/web/src/main.ts`
    - `src/main.js`
  - Routed high-frequency controls (chips/filters/view-mode toggles/density/theme/overlay reset flows) through scheduler to coalesce rebuild bursts.
- Phase C initial rollout delivered:
  - Replaced blanket SVG content clear path with persistent mode roots (`mode-graph`, `mode-tree`) and incremental keyed joins.
  - Migrated graph-mode core layers to keyed joins:
    - links
    - edge labels
    - nodes
    - badges
  - Migrated tree-mode core layers to keyed joins:
    - links
    - nodes
    - reign sub-labels
    - badges
    - section dividers
  - Hardened overlay lifecycle to avoid duplicate graph era overlays when re-rendering incrementally.
- Phase D delivered in both runtimes:
  - simulation lifecycle now reuses one force instance in graph mode and updates nodes/links/forces incrementally;
  - tick-to-DOM sync is frame-budgeted (`requestAnimationFrame` + minimum interval guard);
  - stable-layout early-stop heuristic now halts simulation after sustained low alpha/velocity.
- Phase E delivered (cache-first rollout) in both runtimes:
  - tree placement memoization keyed by language, density geometry, node shape signature, and edge signature;
  - cached placement payload now reuses positional/depth/section metadata across non-structural rebuilds;
  - BBox label cache remains active to reduce repeated forced layout reads.
- Phase E optional worker extension delivered (best-effort prewarm path):
  - shared pure tree placement cores added for TS and legacy JS runtimes;
  - module-worker drivers added for both runtimes with error-safe fallback;
  - graph-mode rebuild now prewarms tree placement cache via worker when available.
- Phase F delivered in both runtimes:
  - persistent hot-path indexes are now rebuilt alongside filtered data (`nodeById`, typed adjacency, selection-edge map);
  - selection restoration and history edge restore now use O(1) edge-key lookup before scan fallback;
  - node/link object reuse across rebuilds now preserves simulation continuity and reduces object churn.
- Phase G hardening follow-through delivered:
  - deterministic web build chain now avoids nested typecheck in workspace build script:
    - root `build:web` runs direct `tsc --noEmit -p apps/web/tsconfig.json --pretty false` before Vite build;
    - `apps/web` build script now runs `vite build` only.
  - tree-placement worker determinism harness added:
    - `scripts/modernization/verify-tree-placement-worker-parity.mjs`;
    - checks legacy JS worker and TS worker payload/result equivalence to synchronous tree-placement compute across multiple fixtures.
  - modernization CI now enforces worker parity harness:
    - `.github/workflows/modernization-parity.yml` runs `npm run modernization:tree-placement-worker-parity`.
- Worker policy decision delivered:
  - policy benchmark comparison added (`npm run modernization:benchmark:tree-worker-policy`);
  - current decision: keep worker enabled by default with explicit opt-out;
  - runtime overrides now supported via `?tree_worker=on|off` and `window.__treePlacementWorkerPolicy`.
- UI performance lane now includes tree-switch metrics:
  - first tree switch latency;
  - warm tree switch latency p95;
  - budget checks integrated in `scripts/modernization/verify-benchmark-budgets.mjs`.
- Validation checkpoint for D/E/F rollout:
  - `npm run modernization:parity` passing;
  - `node --experimental-strip-types scripts/modernization/verify-ts-rebuild-parity.mjs` passing (26/26);
  - `npm run modernization:benchmark-check` passing;
  - `npm run modernization:benchmark-check:require-ui` passing.
- Current environment note:
  - strict UI lane passes in full-access mode.
  - restricted sandbox runs may still surface `listen EPERM: operation not permitted 127.0.0.1` and Chrome headless `SIGABRT` before CDP endpoint availability.

## Performance budgets (must pass)

Environment: modern laptop baseline, production build.

- First interaction p95: <= 120 ms
- Filter toggle latency p95 (single toggle): <= 120 ms
- Pan/zoom median frame time: <= 16.7 ms
- Pan/zoom p95 frame time: <= 24 ms
- Tree mode switch p95: <= 180 ms
- Era slider drag mode: zero visible jank; no repeated full rebuilds per frame

All budgets apply to both:

- `index.html` / legacy JS path
- `apps/web` TypeScript path

## Non-negotiable quality gates

1. Existing parity chain remains green (`npm run modernization:verify`).
2. New performance checks run in CI as budget gates.
3. Visual and behavioral parity retained for:
   - focus mode
   - overlays
   - tree placement semantics
   - edge/node selection and sidebar behavior
   - era controls and playback

## Implementation phases

## Phase A: Measurement and instrumentation (no behavior change)

Deliverables:

- Integrate UI benchmark lane into main benchmark runner.
  - Add `runUiBrowserBenchmarks(...)` call in `scripts/modernization/run-benchmarks.mjs`.
  - Persist UI lane output under `docs/modernization/baselines/benchmarks/benchmark-*.json`.
- Extend budget checker (`scripts/modernization/verify-benchmark-budgets.mjs`) with UI thresholds.
- Add runtime instrumentation:
  - rebuild duration markers
  - tree layout duration markers
  - simulation warm/cold start markers

Acceptance:

- Benchmark snapshots include UI boot, first interaction, filter toggle, pan/zoom frame metrics.
- CI can fail on UI budget regressions.

## Phase B: Rebuild scheduler and change classification

Goal: avoid full rebuild for small state changes.

Actions:

- Introduce a `render scheduler` with batched invalidation flags:
  - `geometryDirty`
  - `styleDirty`
  - `selectionDirty`
  - `overlayDirty`
  - `eraVisibilityDirty`
- Route high-frequency controls to scheduler instead of direct `rebuild()` in:
  - `apps/web/src/main.ts`
  - `src/main.js`
- Keep full rebuild only for structural changes (filter/view mode/dataset changes).

Acceptance:

- No multi-trigger rebuild storms from rapid UI interactions.
- Era slider drag path remains lightweight and does not trigger repeated full rebuilds.

## Phase C: Incremental SVG updates (replace teardown/recreate)

Goal: retain DOM nodes and update only changed attributes/data bindings.

Actions:

- In graph mode and tree mode, replace blanket group clear (`selectAll('*').remove()`) with keyed data joins.
- Maintain stable keys for node/link/label/badge selections.
- Isolate expensive ops:
  - marker updates only when dynasty set changes
  - edge label layer updates only when labelable edges change
  - selection highlight updates without geometry rebuild

Acceptance:

- Repeated filter/overlay toggles reuse existing DOM nodes.
- Reduced GC churn and lower p95 interaction latency.

## Phase D: Graph simulation lifecycle optimization

Status: complete in TypeScript and legacy JS paths.

Goal: preserve force layout quality while lowering frame work.

Actions:

- Keep one simulation instance where possible; update forces/data incrementally.
- Throttle tick DOM sync using a strict frame budget guard.
- Cache frequently queried node maps used in tick/edge callbacks (remove repeated `.find(...)`).
- Add early-stop heuristics for stable layouts.

Acceptance:

- Lower frame-time variance during pan/zoom and force settle.
- Equivalent visual outcomes for graph layout quality.

## Phase E: Tree layout optimization + optional worker offload

Goal: remove main-thread spikes in tree render path.

Status: cache-first rollout complete in TypeScript and legacy JS paths; optional worker prewarm path integrated with sync fallback.

Actions:

- Split tree render into:
  - pure compute layout function (positions + paths metadata)
  - render function (DOM updates)
- Memoize layout inputs and cache results for repeated non-structural updates.
- Move pure tree compute to Web Worker after deterministic parity check.
- Keep identical ordering and placement semantics from current algorithm.

Rust alignment option:

- If worker compute still heavy, port pure tree layout compute to Rust/WASM module (compute only, DOM stays TS/JS).
- Keep JS and TS fallback path for parity and debuggability.

Acceptance:

- Tree mode switch and filter updates meet budget.
- Same node/edge placement semantics within defined tolerance.

## Phase F: Data-path and lookup optimization

Status: complete in TypeScript and legacy JS paths.

Actions:

- Build persistent indexes per filtered dataset:
  - `nodeById`
  - adjacency by relation type
  - selected edge key map
- Reuse connected components/tree metadata when only style/selection changes.
- Avoid repeated `getBBox` and layout reads outside controlled fit/measure steps.

Acceptance:

- Reduced CPU in filter + render hot paths.
- No correctness drift in filtering/tree grouping.

## Phase G: Rollout and hardening

Actions:

- Implement each phase in TypeScript first, then mirror to legacy JS path for parity until final cutover.
- Update documentation:
  - progress log
  - benchmark snapshots
  - residual risks
- Run full verification and performance checks per phase.

Acceptance:

- Budgets pass.
- Full parity suite remains green.
- No feature regressions in manual UX checks.

## Execution order (recommended)

1. Phase A (measure first)
2. Phase B (scheduler)
3. Phase C (incremental DOM)
4. Phase D (simulation)
5. Phase E (tree compute/worker)
6. Phase F (indexes/caching)
7. Phase G (hardening/documentation)

Current execution position:
- Phase D/F complete and Phase E cache + worker-prewarm rollout complete in both runtimes.
- Phase G hardening follow-through (build determinism + worker parity harness + worker policy closeout) is complete.
- Next work item is strict UI-lane CI profile hardening plus continued benchmark regression watch.

## Risks and controls

- Risk: behavior drift during incremental rendering.
  - Control: parity checks + visual/manual acceptance matrix per phase.
- Risk: worker/off-main-thread race conditions.
  - Control: versioned job tokens + stale result discard.
- Risk: legacy/TS divergence.
  - Control: TS-first patch pattern mirrored immediately in JS with parity scripts.

## Progress logging protocol

For each completed step, record:

- files changed
- benchmark delta (before/after)
- parity status
- known regressions (if any) and rollback point

Primary log targets:

- `docs/modernization/phase0/implementation-log.md`
- `docs/modernization/phase0/continuation-handoff.md`

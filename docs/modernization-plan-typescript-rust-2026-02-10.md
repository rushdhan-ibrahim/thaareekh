# TypeScript + Rust Modernization Plan

Date: 2026-02-10  
Status: in progress (Phase 0/1/4 parity foundation complete; Phase 3 active; Phase 2/6 pending)

## 1. Objective
Perform a full rewrite of the project using a TypeScript + Rust architecture with zero loss of knowledge/functionality, major performance gains, and substantially better long-term maintainability.

This plan is constrained by three hard requirements:
1. No loss of functionality, knowledge, or research artifacts.
2. Very significant improvement in speed, efficiency, smoothness, and UX responsiveness.
3. Significant increase in maintainability, upgradeability, and documentation quality.

## 2. Current Baseline (for parity targets)

### Runtime and data baseline
- Current app is browser-first ES modules (`index.html` + `src/**/*.js`) with no build system.
- Data model currently assembled from multiple JS datasets (`core/promoted/research`) with derived inference expansion at runtime.
- Baseline counts:
  - canonical mode: 210 people, 608 edges
  - research mode: 210 people, 627 edges
  - derived/inferred edges (research): 341
- Research workspace footprint: 600+ files under `docs/research-program/`.

### Existing functional surface that must be preserved
- Graph + tree modes.
- Search, command palette/bar, filters, compare, pathfinding, minimap.
- Era slider/playback, story trails, timeline overlays.
- Confidence and source-grade semantics (`c/i/u`, `A/B/C/D`).
- Per-edge explainability and inference dossier linking.
- Exporters and offline/service-worker support.
- Full research pipeline scripts:
  - ledger reconciliation
  - QA checks
  - contradiction/promotion flows
  - dossier refresh jobs

## 3. Recommended Target Architecture

### 3.1 Stack split (best combination)
- **TypeScript**: UI layer, interaction orchestration, accessibility, rendering integration, developer tooling.
- **Rust**: domain engine, merge/inference core, validation, high-performance graph/search/path queries, research pipeline CLI, and WASM compute module for browser.

### 3.2 Monorepo structure
- `apps/web` (TypeScript):
  - Vite-based web app
  - strict TS, typed state, testable UI modules
  - UI layer only (no domain logic duplication)
- `crates/domain` (Rust):
  - canonical typed schemas (`Person`, `Edge`, `Claim`, `Source`, `InferenceDossier`, etc.)
- `crates/engine` (Rust):
  - dataset merge, derived-edge generation, pathfinding, filtering, scoring
- `crates/wasm-engine` (Rust -> WASM):
  - browser-facing compute API (called from TS, ideally via web worker)
- `crates/research-cli` (Rust):
  - replacement for Node research scripts with strongly typed CSV/markdown transforms
- `schemas/`:
  - JSON Schema + migration versions

### 3.3 Rendering and responsiveness strategy
- Move all heavy graph compute (layout prep, filtering, ranking, pathfinding, inference checks) into Rust/WASM worker threads.
- Keep UI thread focused on paint + interaction.
- Introduce incremental rendering and viewport culling for smooth pan/zoom.
- Preserve visual style and UX behavior, but with deterministic state transitions and performance budgets.

## 4. No-Loss Parity Strategy (critical)

### 4.1 Golden master corpus
Freeze and treat as non-negotiable test corpus:
- `src/data/*.js` data outputs (canonical + research).
- `docs/research-program/**` ledgers/dossiers/findings.
- Current inference notes and contradiction states.

### 4.2 Parity harness
Build automated parity checks that compare old vs rewritten engine outputs for:
- record counts (people/edges/derived edges),
- edge identity and confidence/grade labels,
- inference dossier linkage completeness,
- source refs and citation locator integrity,
- QA script equivalent outputs.

No migration phase is accepted unless parity passes.

### 4.3 Functional parity acceptance matrix
Each current feature gets:
- explicit behavior spec,
- automated test (unit/integration/e2e),
- manual UX checklist for visual and interaction parity.

## 5. Performance and UX Targets

These are go/no-go targets for release:
- Initial app interactive time reduced by at least 40%.
- Main-thread long tasks (>50ms) reduced by at least 70%.
- Pan/zoom interaction maintains near-60fps on modern laptop hardware with research dataset loaded.
- Search/filter/path interactions under 100ms p95.
- Dataset merge and derived inference generation materially faster than current JS baseline (target 3x+ for batch operations).
- Research QA pipeline wall-clock time reduced by at least 50%.

## 6. Phased Rewrite Plan

### Phase 0: Specification and Freeze (1-2 weeks)
- Lock feature inventory, behavior specs, and baseline snapshots.
- Define canonical data schema and versioning.
- Define ADRs (architecture decision records).
- Deliverable: signed-off parity specification and benchmark baseline.

### Phase 1: Rust Domain + Engine Core (2-3 weeks)
- Implement typed domain model and merge engine in Rust.
- Port derived inference logic with deterministic outputs.
- Build compatibility importer for current JS data modules.
- Deliverable: CLI that reproduces canonical/research dataset outputs with parity checks.

### Phase 2: WASM Compute Layer + Worker Bridge (1-2 weeks)
- Expose Rust engine queries to TypeScript via WASM bindings.
- Integrate worker boundary for non-blocking compute.
- Deliverable: browser test harness proving compute parity and latency improvements.

### Phase 3: TypeScript UI Rewrite (3-5 weeks)
- Rewrite UI modules in strict TypeScript.
- Preserve all existing modes/features/interactions.
- Migrate search/filter/compare/timeline/story trail flows to typed state architecture.
- Deliverable: feature-complete TS UI wired to Rust/WASM engine with parity UI tests.

### Phase 4: Research Pipeline Rewrite to Rust CLI (3-4 weeks)
- Port Node `.mjs` research scripts to Rust subcommands.
- Preserve exact CSV and markdown semantics.
- Maintain archival safety behavior and QA gates.
- Deliverable: Rust CLI that can run all current research/QA pipelines end-to-end.

### Phase 5: Hardening, Performance, and Documentation (2-3 weeks)
- Benchmark and tune compute + rendering.
- Finalize migration docs, contributor docs, operations playbook.
- Add CI gates for parity + performance budgets.
- Deliverable: production-ready rewritten system.

### Phase 6: Cutover and Stabilization (1-2 weeks)
- Shadow-run both systems in parallel.
- Run final ledger reconciliation and contradiction-state parity audit.
- Switch default runtime to rewritten stack after sign-off.
- Deliverable: controlled cutover with rollback plan.

## 7. Tooling and Quality Gates

### 7.1 TypeScript standards
- `strict: true` with zero implicit any.
- Shared typed contracts generated from schema.
- Vitest + Playwright for unit/e2e.

### 7.2 Rust standards
- `clippy -D warnings`, `rustfmt`, `cargo test`.
- Property tests for merge/inference behavior.
- Snapshot tests for output stability.

### 7.3 CI gates
- Parity suite must pass.
- Research QA suite must pass.
- Performance budget checks must pass.
- Documentation completeness checklist must pass.

## 8. Data and Documentation Migration Plan

### 8.1 Data model migration
- Move from ad-hoc JS constants to schema-versioned data packages (JSON/JSONL/CBOR as needed).
- Keep source IDs, confidence classes, and citation locators first-class fields.
- Maintain deterministic ordering and IDs to preserve all existing references.

### 8.2 Documentation and explainability
- Preserve all existing `docs/research-program/**` artifacts unchanged during initial migration.
- Build typed indexers and link validators for:
  - inference dossiers,
  - contradiction log entries,
  - promotion queue items,
  - edge-claim ledger alignment.
- Keep “handcrafted per pair” inference explanation workflow mandatory.

## 9. Risk Register and Controls

### Risk 1: Full rewrite drift from existing behavior
- Control: parity harness + staged shadow mode + no-cutover until parity signed off.

### Risk 2: Research ledger semantic breakage
- Control: byte-level CSV compatibility tests and golden snapshots.

### Risk 3: WASM integration complexity
- Control: keep domain engine usable natively via CLI and add thin TS adapter layer only.

### Risk 4: Timeline overrun
- Control: milestone gates, each phase delivering independently useful output.

## 10. Recommended Implementation Order

1. Lock parity spec and benchmarks.
2. Build Rust engine and dataset compatibility first.
3. Rewrite UI in TypeScript against stable engine API.
4. Port research scripts to Rust CLI.
5. Run dual-stack shadow period before final cutover.

This order minimizes risk of knowledge loss while maximizing measurable performance gains.

## 11. Definition of Success

Rewrite is considered complete only when:
- all current functionality exists and matches behavior,
- all research and knowledge artifacts remain intact and queryable,
- performance targets are met,
- maintainability is demonstrably improved via typed contracts, modular architecture, CI gates, and complete technical documentation.

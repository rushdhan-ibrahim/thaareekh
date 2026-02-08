# Rust + TypeScript Modernization Assessment

Date: 2026-02-08  
Scope: Full-project technical modernization while preserving functional behavior, knowledge content, and research workflow outputs.

## 1) Multi-agent analysis run

Five parallel analysis tracks were used:

1. Architecture agent: app/runtime structure, module boundaries, entrypoints.
2. Data-model agent: people/edges/source schema and inference metadata consistency.
3. UI/interaction agent: graph, sidebar, search, compare, pathfinding behavior.
4. Research-pipeline agent: ledger/dossier scripts, QA, promotion workflow.
5. Ops/tooling agent: build/runtime dependencies, offline support, release ergonomics.

## 2) Current-state snapshot (measured)

- Frontend modules: `43` JS files in `src/` (`20,976` LOC).
- Research/ops scripts: `25` Node `.mjs` files in `scripts/` (`8,591` LOC).
- CSS: `1,940` LOC.
- Largest code concentrations:
  - `src/data/sovereigns.promoted.js` (`4,761` LOC)
  - `src/data/inference-notes.js` (`3,853` LOC)
  - `src/data/sovereigns.research.js` (`3,681` LOC)
  - `src/graph/rebuild.js` (`1,482` LOC)
  - `src/ui/sidebar.js` (`1,001` LOC)
- Runtime style: browser-native ES modules with import map in `index.html`; no bundler/project config (`package.json`, `tsconfig`, `vite.config`, etc. absent).
- External runtime dependencies are CDN import-map based (`d3`, `@floating-ui/dom`, `gsap`) plus service-worker caching.
- Data and research stack is currently JavaScript-centric:
  - merged runtime dataset via `src/data/sovereigns.merge.js`
  - evidence/source ledgers in CSV
  - person/concept/inference dossiers in Markdown
  - QA and batch operations in Node scripts.

## 3) Benefits of moving to Rust + TypeScript

## 3.1 Type safety and consistency (high value)

- TypeScript can enforce cross-module correctness for edge/person/source shapes in UI code and scripts.
- Rust can enforce strict typed schemas and invariant checks for research pipelines.
- This directly targets classes of drift already observed in practice (for example, inferred-vs-direct classification mismatches in high-impact bridge claims).

## 3.2 Stronger data pipeline reliability (high value)

- Rust CLI tooling can provide deterministic CSV/JSON/Markdown transforms with stronger parser guarantees and clearer failure modes.
- Shared schema definitions can reduce repeated ad-hoc parsing logic currently duplicated across scripts.

## 3.3 Performance headroom (medium value)

- Rust is useful for compute-heavy pipeline tasks: inference recomputation, validation sweeps, large batch transforms.
- Browser-side graph rendering remains DOM/SVG bound; TypeScript gives most near-term ROI there, while Rust helps more in backplane/build processing than direct DOM rendering.

## 3.4 Better modernization posture (high value)

- TypeScript + modern tooling improves testability, editor support, refactoring safety, and onboarding.
- Rust introduces long-term maintainability for critical data-engine components and “correctness by construction” where needed.

## 4) Risks and constraints

- A big-bang rewrite is high-risk for research continuity and behavior parity.
- Full frontend-in-Rust (WASM-first UI rewrite) is not the best first move for this codebase because the app is D3 + DOM + interaction heavy.
- Knowledge integrity risk is real: data/schema migration bugs can silently alter claims if parity gates are weak.
- Team velocity risk: Rust + TS dual-stack transition adds short-term overhead.

## 5) Recommended target architecture

Use a staged TS-first frontend modernization with Rust for the data/research core:

1. TypeScript web app (UI/graph/search/sidebar/workflows).
2. Rust core crate for:
   - canonical data model,
   - schema validation/invariants,
   - inference rule engine,
   - ledger quality checks.
3. Rust CLI for batch and QA tasks (replacing high-value Node scripts first).
4. Optional Rust API service later (if/when multi-user editing, auth, or remote querying is needed).

This satisfies a Rust + TypeScript stack without forcing an early high-risk WASM UI rewrite.

## 6) Modernization plan (phased, parity-first)

## Phase 0: Parity contract and fixtures

- Freeze functional parity contract:
  - same people/edge counts and IDs,
  - same dossier/link coverage,
  - same confidence/grade semantics,
  - same inference explainability behavior.
- Create golden snapshots:
  - dataset exports (`canonical`, `research`),
  - key UI interaction outcomes (search/path/compare),
  - QA outputs.

Exit gate: reproducible parity baseline committed.

## Phase 1: Tooling bootstrap (TypeScript foundation)

- Introduce `package.json`, lockfile, `tsconfig`, lint/format/test tooling.
- Adopt Vite (or equivalent) for dev/build while preserving static deploy behavior.
- Vendor external runtime assets where practical (especially offline-critical dependencies).

Exit gate: app runs identically through typed build pipeline; no behavior regressions on smoke tests.

## Phase 2: UI and app migration JS -> TS

- Convert `src/` modules incrementally:
  - start with data interfaces and shared utilities,
  - then graph/search/compare/sidebar modules,
  - finally entrypoint wiring.
- Define strict interfaces for:
  - `Person`, `Edge`, `Source`, `InferenceNote`, `Office`.
- Preserve DOM structure and user-facing behavior.

Exit gate: complete `src/` in TS with strict mode, parity checks green.

## Phase 3: Rust core model + validator

- Create Rust workspace (`crates/core`, `crates/cli`).
- Implement typed model + serde loaders for project data artifacts.
- Implement invariant checks mirroring current QA:
  - person/edge references,
  - inferred-edge dossier mapping,
  - ledger row consistency,
  - contradiction/promotion policy checks.

Exit gate: Rust validator reproduces existing QA results on current repository.

## Phase 4: Rust CLI replacement of high-value scripts

- Port highest-risk/highest-value scripts first:
  - `qa-research-ledgers`,
  - relationship ledger quality refresh,
  - promotion/conflict batch operations,
  - inference consistency checks.
- Keep Node scripts as fallback during overlap period.

Exit gate: dual-run parity (Node vs Rust outputs equivalent for target scripts).

## Phase 5: Data artifact normalization and integration

- Move large data arrays to structured artifacts (JSON/NDJSON/SQLite export path) generated by Rust tooling.
- Keep frontend consumption stable via generated TS-safe loaders.
- Add deterministic build step that emits:
  - runtime dataset bundles,
  - ledger diagnostics,
  - audit manifests.

Exit gate: reproducible build artifacts; no drift in people/edges/inference counts.

## Phase 6: Optional service/API layer (only if needed)

- Add Rust HTTP layer only when remote workflows require it.
- Otherwise keep static deployment model and Rust CLI pipelines.

Exit gate: explicit product need validated; no unnecessary infra complexity.

## 7) Project execution plan (pragmatic)

Recommended team split (parallel workstreams):

1. TS App Team: UI modules, typed interfaces, interaction parity.
2. Rust Core Team: schema, validators, inference engine, CLI.
3. QA/Parity Team: golden tests, regression harness, audit dashboards.
4. Research Workflow Team: ledger/dossier continuity, contradiction/promotion policy integrity.
5. DevEx Team: tooling, CI, release, offline packaging.

## 8) Decision summary

Moving to Rust + TypeScript is beneficial for this project, but only with staged migration and strict parity gates.

- Strong recommendation: **TypeScript-first app migration + Rust data/pipeline core**.
- Avoid: immediate all-at-once rewrite or early Rust/WASM UI rewrite.
- Priority objective: preserve research correctness and explainability while modernizing the engineering stack.


# Modernization Progress Reconciliation

Date: 2026-02-21  
Status: active

This checkpoint reconciles current implementation state against `docs/modernization-plan-typescript-rust-2026-02-10.md`.

## Runtime and baseline reconciliation
- Baseline parity is passing against `docs/modernization/baselines/baseline-latest.json`.
- Latest benchmark snapshot is `docs/modernization/baselines/benchmarks/benchmark-2026-02-21.json`.
- Worker policy snapshot is `docs/modernization/baselines/benchmarks/tree-worker-policy-2026-02-21.json`.
- Current baseline counts:
  - canonical: 204 people / 565 edges
  - research: 204 people / 573 edges
- Checkpoint validation status:
  - `./node_modules/.bin/tsc --noEmit -p apps/web/tsconfig.json --pretty false` passing;
  - `node --experimental-strip-types scripts/modernization/verify-ts-rebuild-parity.mjs` passing;
  - `node --experimental-strip-types scripts/modernization/verify-tree-placement-worker-parity.mjs` passing;
  - `npm run modernization:benchmark:tree-worker-policy` passing;
  - `npm run build:web` passing;
  - `npm run modernization:parity` passing;
  - `npm run modernization:benchmark-check` passing;
  - `npm run modernization:benchmark-check:require-ui` passing.

## Phase-by-phase status

### Phase 0: Specification and freeze
- Status: mostly complete.
- Completed:
  - parity baseline refresh and validation;
  - benchmark automation and budget checker in CI;
  - UI benchmark lane integration in payload plus availability policy (`modernization:benchmark-check` default, `modernization:benchmark-check:require-ui` strict);
  - UI runner diagnostics hardening (launch-attempt metadata, CDP probe errors);
  - strict UI budget gate validated in full-access local runs.
  - CI profile hardening for UI lane:
    - `UI_BENCH_SERVE_MODE=http` in modernization workflow;
    - `CHROME_BIN` auto-detection in modernization workflow before benchmarks.
- Remaining:
  - observe CI stability and decide whether strict UI lane should be always-on required (rather than variable-gated).

### Phase 1: Rust domain + engine core
- Status: complete for current parity scope.

### Phase 2: WASM compute layer + worker bridge
- Status: deferred by current dataset scale; revisit when tree/graph compute profiling justifies off-main-thread Rust/WASM acceleration.

### Phase 3: TypeScript UI rewrite
- Status: complete (module parity delivered; modernized bundle is default runtime).

### Phase 4: Research pipeline rewrite to Rust CLI
- Status: functionally complete for current scripted surface.

### Phase 5: Hardening, performance, documentation
- Status: active.
- Current focus:
  - execute the graph/tree performance optimization phases (A->G) from `docs/modernization/phase0/performance-optimization-plan-2026-02-20.md`.
  - Phase B scheduler rollout is complete in both runtimes (`apps/web/src/main.ts`, `src/main.js`).
  - Phase C initial incremental DOM rollout is complete in both runtimes (`apps/web/src/graph/rebuild.ts`, `src/graph/rebuild.js`).
  - Phase D simulation lifecycle optimization is complete in both runtimes.
  - Phase E tree placement cache rollout is complete in both runtimes.
  - Phase E optional worker-prewarm extension is integrated in both runtimes (sync fallback retained).
  - Phase F hot-path indexing and lookup optimization is complete in both runtimes.
  - Phase G follow-through for build determinism and worker-output parity gating is complete.
  - Phase G worker policy closeout is complete: default policy is `enabled_by_default` with explicit opt-out controls.

### Phase 6: Cutover and stabilization
- Status: complete (bundle cutover in place; legacy JS path retained as fallback/parity reference).

## Immediate next execution sequence
1. Continue benchmark sampling and regression watch as research graph size grows.
2. Optimize Rust cold-start startup path for short-lived command invocations.
3. Decide when strict UI lane should be always-on required after CI reliability observation window.

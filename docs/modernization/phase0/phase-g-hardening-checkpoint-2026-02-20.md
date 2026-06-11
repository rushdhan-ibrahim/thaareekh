# Phase G Hardening Checkpoint

Date: 2026-02-20  
Status: active (Phase E optional worker prewarm integrated; hardening follow-through complete, worker policy decided)

## Scope delivered in this checkpoint

- Integrated optional Phase E worker offload path in both runtimes:
  - TypeScript: `apps/web/src/graph/tree-placement-core.ts`, `apps/web/src/graph/tree-placement-worker.ts`, `apps/web/src/graph/rebuild.ts`, `apps/web/src/main.ts`
  - legacy JS: `src/graph/tree-placement-core.js`, `src/graph/tree-placement-worker.js`, `src/graph/rebuild.js`
- Kept correctness-first fallback:
  - tree rendering remains fully functional without worker results;
  - worker results are used as cache hits when available;
  - graph-mode rebuilds now prewarm tree placement in background when possible.
- Added CI hardening profile for strict UI budget enforcement:
  - `.github/workflows/modernization-parity.yml` now supports optional strict lane via repository variable `MODERNIZATION_REQUIRE_UI_BENCH=1`.
  - CI job now pins UI bench serve mode to HTTP (`UI_BENCH_SERVE_MODE=http`) and auto-detects `CHROME_BIN` before benchmark execution for improved lane reliability.
- Added workspace dependency for worker-side tree compute resolution:
  - `apps/web/package.json` now includes `d3` for module resolution during build-time worker processing.
- Added deterministic web build path:
  - root `build:web` now runs direct `tsc --noEmit -p apps/web/tsconfig.json --pretty false` before workspace Vite build;
  - `apps/web` `build` script now runs `vite build` only (typecheck split out).
- Added targeted tree-placement worker parity harness and CI gate:
  - script: `scripts/modernization/verify-tree-placement-worker-parity.mjs`;
  - command: `npm run modernization:tree-placement-worker-parity`;
  - CI step added in `.github/workflows/modernization-parity.yml`.
- Added worker-policy controls and decision artifacts:
  - URL-level worker override in both apps: `?tree_worker=on|off`;
  - rebuild policy resolver now honors `window.__treePlacementWorkerPolicy` (`on|off|auto`) plus legacy `window.__disableTreePlacementWorker`;
  - policy comparison command: `npm run modernization:benchmark:tree-worker-policy`;
  - decision doc: `docs/modernization/phase0/tree-worker-policy-decision-2026-02-21.md`.

## Validation ledger

Passed in this checkpoint:

- `node --check src/graph/rebuild.js`
- `node --check src/graph/tree-placement-core.js`
- `node --check src/graph/tree-placement-worker.js`
- `node --check src/main.js`
- `./node_modules/.bin/tsc --noEmit -p apps/web/tsconfig.json --pretty false`
- `node --experimental-strip-types scripts/modernization/verify-ts-rebuild-parity.mjs` (26/26)
- `npm run modernization:parity`
- `npm run modernization:benchmark-check`
- `npm run modernization:benchmark-check:require-ui`
- `npm run modernization:tree-placement-worker-parity`
- `npm run modernization:benchmark:tree-worker-policy`
- `npm run build:web`

## Known issues and mitigations

- Previous intermittent `build:web` stall in nested script execution path is addressed by split typecheck/build orchestration.
- Residual risk:
  - cold-start Rust benchmark lane remains slower than Node in this snapshot; warm lane budgets remain the enforced target.

## Next hardening actions

1. Optionally extend worker parity fixtures with larger research-augmented datasets when edge count materially grows.
2. Decide when strict UI lane should become always-on (instead of variable-gated) after observing CI stability for multiple runs.

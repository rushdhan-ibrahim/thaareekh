# Verification Ledger UI Integration

Date: 2026-02-20
Status: implemented

## Goal
Integrate manual verification ledger state directly into relationship details in both runtimes:
- legacy JS app (`src/`)
- modern TS app (`apps/web/`) powered by Rust-led pipeline tooling

The scope is to make edge-level review status, canonical decision, and pair dossier linkage visible in the tree/map relationship panels without changing underlying graph semantics.

## Implementation plan
1. Add a generated edge-verification index artifact from ledgers.
2. Wire JS sidebar relation cards to render verification metadata and document links.
3. Wire TS sidebar relation cards with parity behavior.
4. Add Rust CLI command for modern pipeline generation.
5. Keep Node generator for legacy operational compatibility.
6. Validate with `cargo check`, `npm run typecheck`, and `npm run build:web`.

## Completed
- Added generated data module: `src/data/relationship-verification.js`.
- Added Node generator: `scripts/sync-edge-verification-index.mjs`.
- Added Rust generator command:
  - module: `crates/research-cli/src/sync_edge_verification_index.rs`
  - CLI command: `sync-edge-verification-index <root-dir> [date]`
  - wired in `crates/research-cli/src/main.rs`
- Added relationship card integration in JS sidebar:
  - `src/ui/sidebar.js`
  - shows verification status, canonical decision, reviewer/date, claim/source IDs, and links to ledger/tracker/dossier/explainer.
- Added relationship card integration in TS sidebar:
  - `apps/web/src/ui/sidebar.ts`
  - same behavior via dependency injection from `apps/web/src/main.ts`.
- Added ambient typings for TS legacy imports:
  - `apps/web/src/types/legacy-modules.d.ts`
- Added i18n keys (EN dictionary; DV falls back to EN):
  - `src/ui/i18n.js`
  - `apps/web/src/ui/i18n.ts`
- Added package scripts:
  - `research:sync-edge-verification-index`
  - `modernization:sync-edge-verification-rust`

## Commands
- Legacy generator:
  - `node scripts/sync-edge-verification-index.mjs`
- Modern/Rust generator:
  - `cargo run -q -p maldives-research-cli -- sync-edge-verification-index .`
- Verification:
  - `cargo check`
  - `npm run typecheck`
  - `npm run build:web`

## Current verification results
- `cargo check`: pass
- `npm run typecheck`: pass
- `npm run build:web`: pass

## Lazy-load follow-up
- Completed lazy-loading of verification index module on relationship detail open for both runtimes.
- Runtime behavior:
  - edge detail opens immediately;
  - verification panel shows loading state;
  - panel auto-refreshes once verification module is loaded (without duplicating history entries).
- Bundle impact (Vite build):
  - `dist/assets/main.js`: `1303.66 kB` -> `1055.39 kB`
  - new split chunk: `dist/assets/relationship-verification.js` (`249.08 kB`)

## Notes
- The verification index is intentionally compact (no full excerpt/citation blobs) to limit bundle growth while keeping review and dossier metadata visible in-UI.
- Full raw claim text/locator remains available in source ledgers and dossier markdown files linked from the card.

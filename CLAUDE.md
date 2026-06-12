# Rannavaaru — working notes for agents

This clone (`/Users/Shared/chronicle`) is the canonical working copy. An older
copy may exist under `~/Documents/` — do NOT work there: that path is iCloud-
synced and iCloud evicts file contents (`ls -lO` shows `dataless`), which makes
git and builds hang for minutes. If forced to touch it, hydrate first
(`git ls-files -z | xargs -0 cat >/dev/null`) and check `.git` too.

## Architecture
- Deployed runtime: `apps/web` (Vite + TypeScript). Root `src/` is a JS mirror
  kept logic-identical (parity-tested), plus the shared data layer
  (`src/data/*.js`) imported by both.
- `apps/web/dist/` is committed (static deploys read it); rebuild with
  `cd apps/web && npx vite build` and commit dist with source changes.
- Service worker `sw.js`: bump `CACHE_NAME` on every deploy.
- d3/gsap/floating-ui come from the CDN importmap at runtime; d3 is also a
  devDependency because the tree-placement worker bundle must inline it
  (importmaps don't reach workers).

## Conventions
- Runtime imports between sibling TS modules use `.ts` extensions
  (`allowImportingTsExtensions`) so the Node `--experimental-strip-types`
  parity scripts can resolve them. Type-only imports may stay `.js`.
- Every behavioral module pair (TS + JS) with pure logic gets a
  `scripts/modernization/verify-ts-<name>-parity.mjs`, wired into
  `package.json` (`modernization:verify`) and `.github/workflows/
  modernization-parity.yml`.
- All user-visible strings go through `t()` from `ui/i18n` (en + dv
  dictionaries; missing dv falls back to en).

## Verify before pushing
- `npm run typecheck`
- the TS parity loop (`for S in …; node --experimental-strip-types
  scripts/modernization/verify-ts-$S-parity.mjs`)
- `node scripts/qa-smoke.mjs`
- `cd apps/web && npx vite build` (sub-second here)

## Deploys
- Push `scriptorium`, let `modernization-parity` go green, fast-forward
  `main`, push to `origin` AND the `thaareekh` remote.
- GitHub Pages publishes only from the thaareekh repo (deploy.yml is
  conditioned on it); live site: https://myrkvidur.com/thaareekh/

# UI Trace Progress Checkpoint

Date: 2026-02-13  
Status: paused / in progress

## Goal
Add browser-trace benchmark lanes for:
1. UI boot and first interaction latency.
2. Pan/zoom smoothness.
3. Filter toggle/rebuild latency.

## Work completed in this paused pass
- Investigated browser automation/tooling availability in the current workspace.
- Confirmed no existing browser automation dependency in `package.json` or `apps/web/package.json`.
- Confirmed system Chrome exists at:
  - `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
- Attempted dependency install (`playwright-core`) and confirmed network restriction failure (`ENOTFOUND registry.npmjs.org`).
- Started dependency-free browser automation approach using Chrome DevTools Protocol (CDP) from Node built-ins.
- Added draft script:
  - `scripts/modernization/ui-browser-benchmarks.mjs`
  - This script currently:
    - locates Chrome binary;
    - launches headless Chrome with CDP;
    - evaluates scripted legacy UI interactions (`index.html`) for boot/interaction/pan-zoom/filter samples;
    - returns structured benchmark payload or `unavailable` status with reason.

## Issues encountered
- `npm` package installation blocked by network resolution errors in this environment.
- Local loopback serving via background `python3 -m http.server` is unreliable under current sandbox constraints.
- Headless Chrome execution required escalated execution in this environment.
- Legacy app readiness under `file://` context is environment-sensitive (import-map/CDN runtime behavior can prevent graph initialization).

## Current state of the code change
- `scripts/modernization/ui-browser-benchmarks.mjs` is added but **not yet integrated** into:
  - `scripts/modernization/run-benchmarks.mjs`,
  - `package.json` scripts,
  - CI workflow or benchmark budget checks.
- No commit has been made for this paused UI-trace pass yet.

## Resume checklist
1. Validate `ui-browser-benchmarks.mjs` execution path end-to-end in current environment.
2. Integrate UI lane output into `scripts/modernization/run-benchmarks.mjs`.
3. Add package script(s) for UI benchmark lane execution.
4. Update docs and benchmark plan with first UI lane snapshot.
5. Extend benchmark checker to enforce UI lane thresholds when lanes are available/stable.

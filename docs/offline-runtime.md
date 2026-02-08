# Offline Runtime Notes

Date: 2026-02-06

## What was added
- Service worker caching for core app modules and local research archive.
- Runtime caching for external dependencies currently loaded from CDN:
  - `d3` ESM URL
  - Google Fonts stylesheet (+ fetched font files)

## How to prime offline mode
1. Start the local server and open the app while online.
2. Wait for the app to finish loading once.
3. Reload once (to ensure service worker control is active).
4. Disconnect internet and reload.

The app should continue to load using the local service-worker cache.

## Current limitation
- A completely fresh first launch with no internet still cannot resolve CDN assets until they are cached once.
- If you want true zero-network first launch, vendor `d3` and fonts locally and switch `index.html` imports to local files.

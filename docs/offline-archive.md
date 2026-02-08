# Offline Research Archive

This project stores the integrated genealogy knowledge locally in code and an explicit archive snapshot.

## Local data files
- `src/data/sovereigns.js`
- `src/data/sovereigns.core.js`
- `src/data/sovereigns.promoted.js`
- `src/data/sovereigns.research.js`
- `src/data/profile.enrichments.js`
- `src/data/offices.js`
- `src/data/sources.js`

## Generated offline snapshot
- `docs/offline-research-archive.json`

This JSON contains:
- canonical dataset snapshot
- research dataset snapshot
- office/title catalog + historical timeline
- source registry metadata
- claim indices grouped by source ID

## Regenerate after new research
Run:

```bash
node scripts/build-offline-archive.mjs
```

The app can operate without internet because people/edge/source metadata is local. External source URLs are optional outbound references.

# Data Model v2

Date: 2026-02-06

## Purpose
Extend the graph data model to support evidence-backed research without breaking the existing app.

## Files
- `src/data/sovereigns.core.js`: canonical baseline dataset.
- `src/data/sovereigns.research.js`: staged research additions.
- `src/data/sovereigns.merge.js`: runtime dataset resolver and merge entry point.
- `src/data/sources.js`: source registry scaffold.
- `src/data/profile.enrichments.js`: per-person enrichment overlays for existing IDs.
- `src/data/offices.js`: office/title catalog and timeline snapshots.

## Runtime mode
Mode is resolved from URL query param `mode`:
- `?mode=canonical` (default when missing/invalid)
- `?mode=research`

`canonical` returns only core data.
`research` returns core + staged research additions.

## Person schema (compatible superset)
Required current fields:
- `id`, `n`, `nm`, `rg`, `dy`, `g`, `re`, `no`

Optional v2 fields:
- `aliases: string[]`
- `regnal_names: string[]`
- `titles: string[]`
- `known_as: {name,type,c,note?,source_refs?}[]`
- `offices_held: {office_id,label?,start?,end?,c,note?,source_refs?}[]`
- `royal_link?: {status,summary,source_refs?}`
- `dynasty_notes?: string`
- `source_refs: string[]`
- `person_confidence?: "A"|"B"|"C"|"D"`

## Edge schema (compatible superset)
Required current fields:
- `t`, `s`, `d`, `l`, `c`

Optional v2 fields:
- `evidence_refs: string[]`
- `claim_type?: "direct"|"inferred"|"contested"`
- `event_context?: string`
- `confidence_grade?: "A"|"B"|"C"|"D"`

## Source schema
`src/data/sources.js` entries:
- `id`: stable key used by `source_refs`/`evidence_refs`
- `url`
- `title`
- `publisher`
- `access_date`
- `quality` (`A/B/C/D`)
- `notes`

## Offline archive
- Generator: `scripts/build-offline-archive.mjs`
- Output: `docs/offline-research-archive.json`

The archive serializes:
- source registry metadata
- office catalog + historical timeline
- canonical dataset snapshot
- research dataset snapshot
- source-indexed claim map

This keeps the integrated knowledge base locally available even when external source URLs are not reachable.

## Non-breaking guarantees
- Existing UI continues to read `people`, `edges`, `byId`.
- Missing optional v2 fields must not break rendering.
- Existing confidence styling (`c|i|u`) remains functional.

# Phase 1 Source Sweep

Date started: 2026-02-08  
Status: in progress

## Objective
Expand and rebalance the source base so high-impact genealogical claims are less dependent on:
- `SRC-DERIVED-RULES`,
- a narrow cluster of Wikipedia pages,
- a small number of specialist secondary compendia.

## What has been started
1. Source registry expanded with new high-priority records:
- official archival/legal documents,
- primary chronicle facsimile records (TUFS),
- inscription/manuscript records (MNU Saruna),
- early travel narratives and historical facsimiles.
2. Source concentration and gap audit tooling created.
3. Phase 1 execution queue seeded in:
- `docs/research-program/ledgers/source-expansion-queue.csv`.

## Batch F (2026-02-08) launch update
1. Added official-profile extraction lane for remaining modern presidency anchors:
- `SRC-PO-MAUMOON`
- `SRC-PO-NASHEED`
- `SRC-PO-SOLIH`
- `SRC-PO-MUIZZU`
2. Added lexicon-hardening lane for title/office semantics:
- `SRC-SSRN-SUOOD-LEGAL`
- `SRC-MRF-TITLES`
- `SRC-WIKI-HEADS-STATE`
3. New queue and extract IDs:
- `SRCQ-023`, `SRCQ-024`
- `EXT-047` through `EXT-053`

## Batch G (2026-02-08) targeted bridge hardening update
1. Added quote-hardening lane for late-monarchy bridge contradictions:
- `SRC-MRF-KINGS`
- `SRC-MRF-PHOTO-6`
- `SRC-MRF-KAKAAGE-ALBUM`
2. New queue and extract IDs:
- `SRCQ-025`
- `EXT-054` through `EXT-056`
3. Scope:
- quote-level extraction for `CLM-0209`, `CLM-0215`, and `CLM-0364`
- classification-consistency review with explicit note that independent non-MRF corroboration remains required for promotion.

## Priority lanes (execution order)
1. `P0` Chronicle and inscription extraction:
- Tarikh Islam Diba Mahall facsimile + annotations.
- Loamaafaanu and Raadhavalhi corpus entries.
2. `P0` Corroboration for weakly-covered dynasties:
- Lunar and early Hilaaly clusters.
3. `P1` Office/institution semantics:
- Pyrard and Bell extracts for title/office definitions.
4. `P1` Dhiyamigili-southern continuity hardening:
- target branch corroboration for inferred continuity links.

## Immediate outputs for next batch
- Create first 10 person dossiers from `P1-P29` with explicit source locator fields.
- Create first 12 inferred-edge dossiers for curated `P0` bridge edges.
- Backfill relationship evidence ledger locators for claims currently marked `todo`.

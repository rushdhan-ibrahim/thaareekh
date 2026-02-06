# Expansion Round 10 — Corroboration Upgrades and Corrections

Date: 2026-02-06

## Scope
- Upgrade selected held `C` claims where additional corroboration was found.
- Correct modeling errors found during verification.
- Re-promote canonical and refresh offline archive.

## Key corrections
1. **Removed duplicate identity node**
- `P197` (Muleegey Dom Hassan Maniku) was removed after cross-checking showed this designation maps to Sultan Hassan Izzuddine / Dom Bandaarain (`P80`) in the transition chronology.

2. **Fixed incorrect parentage direction**
- `P199` (Abbas Ibrahim) was incorrectly modeled as child of `P198`.
- Corrected to sibling-branch modeling (`P149`, `P198`, `P199` as siblings).

3. **Adjusted uncertain Recca-branch parent links**
- Removed speculative inferred father links from `P195` to `P194` and `P196`.
- Kept direct mother links via `P193` where attested in branch narratives.

## Corroboration additions
### New source records
- `SRC-WIKI-BURECCA`
- `SRC-WIKI-HEADS-STATE`
- `SRC-EDITION-NASREENA-SISTER`

### Upgraded claims
- `P194` Burecca profile confidence raised to `B`.
- `P194 <-> P51` spouse edge upgraded from inferred `C` to direct `B` with multi-source corroboration.
- `P57 <-> P194` sibling edge upgraded to direct `B`.
- Modern sibling branch (`P149 <-> P198`, `P149 <-> P199`, `P198 <-> P199`) upgraded to direct `B` with cross-source support.

## Promotion + archive
- Re-generated `src/data/sovereigns.promoted.js` from strict direct `A/B` criteria.
- Rebuilt offline archive at `docs/offline-research-archive.json`.

## Validation
- Evidence audit clean in both modes:
  - unknown source refs: `0`
  - missing evidence/grade: `0`
- Isolated nodes: `0` in both modes.

## Dataset state after round 10
- Canonical: `184` people, `442` edges
- Research: `187` people, `471` edges

## Remaining research-only nodes
- `P176` Fathimath Saudha
- `P181` Kondey Ali Manikfan
- `P196` Reccy

These remain out of canonical due insufficient corroboration for strict `A/B` promotion.

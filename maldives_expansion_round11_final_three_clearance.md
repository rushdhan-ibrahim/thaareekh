# Expansion Round 11 — Final Three Research-Only Clearance

Date: 2026-02-06

## Objective
Clear the last three research-only nodes (`P176`, `P181`, `P196`) into canonical by improving corroboration and upgrading relation confidence where justified.

## Added corroboration sources
- `SRC-WIKI-FATHIMATH-SAUDHA`
- `SRC-SUN-SAUDHA-SISTER`
- `SRC-MRF-MIDU-ROYAL-CHAIN`

Also strengthened supporting registry context:
- `SRC-WIKI-BURECCA`
- `SRC-WIKI-HEADS-STATE`
- `SRC-EDITION-NASREENA-SISTER`

## Upgrades applied
### P176 — Fathimath Saudha
- Person confidence upgraded to `B`.
- Sibling link `P172 <-> P176` upgraded to direct `B`.

### P181 — Kondey Ali Manikfan
- Person confidence upgraded to `B`.
- Spouse link `P180 <-> P181` upgraded from inferred `C` to direct `B`.
- Isdu-descent context `P181 -> P76` upgraded to direct `B` as explicit descendant-chain claim.

### P196 — Reccy
- Person confidence upgraded to `B`.
- Parent/sibling links (`P193 -> P196`, `P57 <-> P196`, `P194 <-> P196`) upgraded to direct `B` with strengthened corroboration.

## Promotion and offline archive
- Re-generated `src/data/sovereigns.promoted.js` from strict criteria (`c`, `direct`, grade `A/B`).
- Rebuilt `docs/offline-research-archive.json`.

## Validation
- Canonical: `187` people, `454` edges
- Research: `187` people, `471` edges
- Unknown source refs: `0` in both modes
- Missing evidence/grade rows: `0` in both modes
- Isolated nodes: `0` in both modes

## Outcome
- Research-only people remaining: `0`
- All tracked nodes are now represented in canonical mode under the current strict promotion policy.

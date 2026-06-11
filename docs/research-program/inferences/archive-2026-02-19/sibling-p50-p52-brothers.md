# Inference Dossier

Edge key: `sibling|P50|P52|brothers`  
Last updated: `2026-02-19`  
Inference class: `curated`

## 1) Edge identity
- Relation type: sibling
- Source node: P50 Ibrahim (Bavana Furasuddha)
- Target node: P52 Yoosuf (Veeru Aanandha)
- Label: brothers
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P50 Ibrahim (Bavana Furasuddha) and P52 Yoosuf (Veeru Aanandha) are modeled as `sibling` with label `brothers` to preserve a targeted continuity claim without over-promoting certainty.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Current adjudication state: deferred in manual batch-M due generation mismatch with canonical parentage chain.
- Immediate direct-claim anchors around these nodes:
- CLM-0344: parent P46 Omar (Loka Sundhura) -> P52 Yoosuf (Veeru Aanandha) (SRC-MRF-KINGS, grade B)
- CLM-0346: parent P52 Yoosuf (Veeru Aanandha) -> P55 Hassan (Singa Veeru) (SRC-MRF-KINGS, grade B)
- CLM-0441: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P52 Yoosuf (Veeru Aanandha) [brothers] (SRC-MRF-KINGS, grade B)
- CLM-0601: parent P47 Hassan (Raadha Aanandha) -> P50 Ibrahim (Bavana Furasuddha) (SRC-ROYALARK-MALDIVES, grade B)

## 3) Logic chain (pair-specific)
1. Manual batch-M recheck confirms canonical chain places P50 one generation below P52.
2. Direct anchor: parent P47 Hassan (Raadha Aanandha) -> P50 Ibrahim (Bavana Furasuddha) (CLM-0601, SRC-ROYALARK-MALDIVES, grade B).
3. Accepted dynasty structure places P47 and P52 as brother-generation peers; therefore P52 is uncle generation relative to P50.
4. Sibling classification for P50/P52 is generation-incompatible under this chain.
5. Canonical decision for CLM-0440 is deferred pending edge-class correction.

## 4) Alternative interpretations
- Preferred corrected interpretation: uncle↔nephew style kin (or broader collateral kin), not sibling.
- Competing interpretation trigger: explicit direct source naming sibling for this exact pair (currently absent and contradicted by parent chain).
- Model-retention rationale: keep dossier open only until class correction is applied.

## 5) Verification checklist
- Promotion requirement: not applicable in current sibling class due canonical generation mismatch.
- Correction requirement: retire/recast sibling edge using canonical P47-parentage and brother-generation context.
- Review cadence: close when sibling cleanup pass is applied.

## 6) Source basis
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0440
- Inferred claim locator: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P50 Ibrahim and P52 Yoosuf (sibling (brothers)) in 2026-02-08 snapshot.

## 7) Integration notes
- `src/data/inference-notes.js` summary should be synced if relation wording changes after verification.
- Canonical promotion candidate: no (remains inferred until explicit pairwise wording is captured).
- Verification priority level: high (current grade C)
- Manual batch-M note (2026-02-19): CLM-0440 deferred for class correction.

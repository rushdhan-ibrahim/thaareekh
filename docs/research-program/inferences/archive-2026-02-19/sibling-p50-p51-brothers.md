# Inference Dossier

Edge key: `sibling|P50|P51|brothers`  
Last updated: `2026-02-19`  
Inference class: `curated`

## 1) Edge identity
- Relation type: sibling
- Source node: P50 Ibrahim (Bavana Furasuddha)
- Target node: P51 Kalu Mohamed (Dhammaru Bavana)
- Label: brothers
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P50 Ibrahim (Bavana Furasuddha) and P51 Kalu Mohamed (Dhammaru Bavana) are modeled as `sibling` with label `brothers` to preserve a targeted continuity claim without over-promoting certainty.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Current adjudication state: deferred in manual batch-M due generation mismatch with canonical parentage chain.
- Immediate direct-claim anchors around these nodes:
- CLM-0174: kin P51 Kalu Mohamed (Dhammaru Bavana) <-> P60 Mohamed (Singa Bavana) [grandfather] (SRC-MRF-KINGS, grade B)
- CLM-0175: kin P51 Kalu Mohamed (Dhammaru Bavana) <-> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) [grandfather] (SRC-MRF-KINGS, grade B)
- CLM-0176: kin P51 Kalu Mohamed (Dhammaru Bavana) <-> P63 Ali (Audha Siyaaaka Katthiri) [father-in-law] (SRC-MRF-KINGS, grade B)
- CLM-0343: parent P46 Omar (Loka Sundhura) -> P51 Kalu Mohamed (Dhammaru Bavana) (SRC-MRF-KINGS, grade B)
- CLM-0345: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P59 Hassan of Shiraz (Ram Mani Loka) (SRC-MRF-KINGS, grade B)
- CLM-0441: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P52 Yoosuf (Veeru Aanandha) [brothers] (SRC-MRF-KINGS, grade B)

## 3) Logic chain (pair-specific)
1. Manual batch-M recheck confirms canonical chain places P50 one generation below P51.
2. Direct anchor: parent P47 Hassan (Raadha Aanandha) -> P50 Ibrahim (Bavana Furasuddha) (CLM-0601, SRC-ROYALARK-MALDIVES, grade B).
3. Direct anchor: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P47 Hassan (Raadha Aanandha) [half-brothers] (CLM-0639, SRC-ROYALARK-MALDIVES, grade B).
4. Under this chain, P51 is uncle generation relative to P50; sibling classification is generation-incompatible.
5. Canonical decision for CLM-0439 is deferred pending edge-class correction.

## 4) Alternative interpretations
- Preferred corrected interpretation: uncle↔nephew style kin (or broader collateral kin), not sibling.
- Competing interpretation trigger: explicit direct source naming sibling for this exact pair (currently absent and contradicted by parent chain).
- Model-retention rationale: keep dossier open only until class correction is applied.

## 5) Verification checklist
- Promotion requirement: not applicable in current sibling class due canonical generation mismatch.
- Correction requirement: retire/recast sibling edge using the P47-parentage + P47/P51 sibling anchors.
- Review cadence: close when sibling cleanup pass is applied.

## 6) Source basis
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0439
- Inferred claim locator: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P50 Ibrahim and P51 Kalu Mohamed (sibling (brothers)) in 2026-02-08 snapshot.

## 7) Integration notes
- `src/data/inference-notes.js` summary should be synced if relation wording changes after verification.
- Canonical promotion candidate: no (remains inferred until explicit pairwise wording is captured).
- Verification priority level: high (current grade C)
- Manual batch-M note (2026-02-19): CLM-0439 deferred for class correction.

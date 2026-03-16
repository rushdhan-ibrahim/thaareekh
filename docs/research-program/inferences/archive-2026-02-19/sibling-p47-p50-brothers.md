# Inference Dossier

Edge key: `sibling|P47|P50|brothers`  
Last updated: `2026-02-19`  
Inference class: `curated`

## 1) Edge identity
- Relation type: sibling
- Source node: P47 Hassan (Raadha Aanandha)
- Target node: P50 Ibrahim (Bavana Furasuddha)
- Label: brothers
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P47 Hassan (Raadha Aanandha) and P50 Ibrahim (Bavana Furasuddha) are modeled as `sibling` with label `brothers` to preserve a targeted continuity claim without over-promoting certainty.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Current adjudication state: deferred in manual batch-M due parent-child conflict.
- Immediate direct-claim anchors around these nodes:
- CLM-0341: parent P46 Omar (Loka Sundhura) -> P47 Hassan (Raadha Aanandha) (SRC-MRF-KINGS, grade B)
- CLM-0601: parent P47 Hassan (Raadha Aanandha) -> P50 Ibrahim (Bavana Furasuddha) (SRC-ROYALARK-MALDIVES, grade B)
- CLM-0639: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P47 Hassan (Raadha Aanandha) [half-brothers] (SRC-ROYALARK-MALDIVES, grade B)

## 3) Logic chain (pair-specific)
1. Manual batch-M recheck confirms this pair has explicit direct parentage, not sibling relation.
2. Direct anchor: parent P47 Hassan (Raadha Aanandha) -> P50 Ibrahim (Bavana Furasuddha) (CLM-0601, SRC-ROYALARK-MALDIVES, grade B).
3. Because P47 is direct parent of P50, sibling classification is generation-incompatible.
4. Canonical decision for CLM-0433 is deferred pending edge-class correction (remove sibling class; retain parent chain).

## 4) Alternative interpretations
- Preferred corrected interpretation: parent-child (already directly modeled via CLM-0601).
- Competing interpretation trigger: not applicable; direct parent claim is already explicit.
- Model-retention rationale: keep dossier open only until sibling edge cleanup is completed.

## 5) Verification checklist
- Promotion requirement: not applicable in current sibling class due direct parent contradiction.
- Correction requirement: retire/recast sibling edge and preserve parent edge `P47 -> P50` as canonical.
- Review cadence: close when sibling cleanup pass is applied.

## 6) Source basis
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0433
- Inferred claim locator: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P47 Hassan and P50 Ibrahim (sibling (brothers)) in 2026-02-08 snapshot.

## 7) Integration notes
- `src/data/inference-notes.js` summary should be synced if relation wording changes after verification.
- Canonical promotion candidate: no (remains inferred until explicit pairwise wording is captured).
- Verification priority level: high (current grade C)
- Manual batch-M note (2026-02-19): CLM-0433 deferred for class correction.

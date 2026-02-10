# Inference Dossier

Edge key: `sibling|P50|P52|brothers`  
Last updated: `2026-02-10`  
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
- Immediate direct-claim anchors around these nodes:
- CLM-0344: parent P46 Omar (Loka Sundhura) -> P52 Yoosuf (Veeru Aanandha) (SRC-MRF-KINGS, grade B)
- CLM-0346: parent P52 Yoosuf (Veeru Aanandha) -> P55 Hassan (Singa Veeru) (SRC-MRF-KINGS, grade B)
- CLM-0441: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P52 Yoosuf (Veeru Aanandha) [brothers] (SRC-MRF-KINGS, grade B)
- CLM-0601: parent P47 Hassan (Raadha Aanandha) -> P50 Ibrahim (Bavana Furasuddha) (SRC-ROYALARK-MALDIVES, grade B)

## 3) Logic chain (pair-specific)
1. Shortest direct-claim support path (3 steps) linking this pair:
2. - parent P50 Ibrahim (Bavana Furasuddha) -> P47 Hassan (Raadha Aanandha) (CLM-0601, SRC-ROYALARK-MALDIVES)
3. - parent P47 Hassan (Raadha Aanandha) -> P46 Omar (Loka Sundhura) (CLM-0341, SRC-MRF-KINGS)
4. - parent P46 Omar (Loka Sundhura) -> P52 Yoosuf (Veeru Aanandha) (CLM-0344, SRC-MRF-KINGS)
5. This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.
6. Current modeling choice remains `inferred` because explicit source wording that names `sibling` for P50 Ibrahim (Bavana Furasuddha) and P52 Yoosuf (Veeru Aanandha) is still absent.

## 4) Alternative interpretations
- Possible competing interpretation: half-sibling or cousin if shared-parent evidence is partial rather than full.
- Competing interpretation trigger: direct wording that uses non-sibling kin terminology for this pair.
- Model-retention rationale: keep the edge as inferred until explicit pairwise wording is located.

## 5) Verification checklist
- Promotion requirement: an A/B source statement explicitly naming P50 Ibrahim (Bavana Furasuddha) and P52 Yoosuf (Veeru Aanandha) with relation class `sibling` (brothers).
- Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.
- Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster.

## 6) Source basis
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0440
- Inferred claim locator: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P50 Ibrahim and P52 Yoosuf (sibling (brothers)) in 2026-02-08 snapshot.

## 7) Integration notes
- `src/data/inference-notes.js` summary should be synced if relation wording changes after verification.
- Canonical promotion candidate: no (remains inferred until explicit pairwise wording is captured).
- Verification priority level: high (current grade C)

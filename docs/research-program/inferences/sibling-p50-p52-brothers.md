# Inference Dossier

Edge key: `sibling|P50|P52|brothers`  
Last updated: `2026-02-08`  
Inference class: `curated`

## 1) Edge identity
- Relation type: sibling
- Source node: Ibrahim (P50)
- Target node: Yoosuf (P52)
- Label: brothers
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: This edge keeps P50 and P52 as brothers from shared parent support through P46, with neighboring sibling claims reinforcing the cluster but not replacing direct pairwise wording.
- Historical/dynastic context: Hilaaly sibling cluster where P50, P51, and P52 sit in one immediate branch context.
- Immediate claim anchors used for this pair review:
- CLM-0342: parent Omar (P46) -> Ibrahim (P50) (SRC-MRF-KINGS, grade B)
- CLM-0344: parent Omar (P46) -> Yoosuf (P52) (SRC-MRF-KINGS, grade B)
- CLM-0441: sibling Kalu Mohamed (P51) -> Yoosuf (P52) [brothers] (SRC-MRF-KINGS, grade B)

## 3) Logic chain (pair-specific)
1. This pair is retained as inferred sibling (brothers) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.
2. Supporting claim CLM-0342: parent Omar (P46) -> Ibrahim (P50) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P50 Ibrahim.
3. Supporting claim CLM-0344: parent Omar (P46) -> Yoosuf (P52) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P52 Yoosuf.
4. Supporting claim CLM-0441: sibling Kalu Mohamed (P51) -> Yoosuf (P52) [brothers] (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P51 Kalu Mohamed and P52 Yoosuf as siblings (brothers).
5. Combined interpretation: these anchors keep the pair in-model as inferred sibling (brothers), but not promoted to confirmed until explicit pairwise wording is found.
6. Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement.

## 4) Alternative interpretations
- The pair could be half-brothers if future maternal data differentiates them.
- A collateral reinterpretation is possible if one of the parent links is revised.
- Any direct contradictory statement should trigger relabel or removal.

## 5) Verification checklist
- Promotion requirement: Direct A/B wording naming P50 and P52 as brothers.
- Downgrade/removal trigger: Parent reassignment that breaks shared-parent basis.
- Review cadence: Re-check during each Hilaaly sibling-cluster evidence sweep.

## 6) Source basis
- `SRC-MRF-KINGS (Maldives Kings List)`
- Primary inferred claim row: CLM-0440
- Inferred claim locator: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P50 Ibrahim and P52 Yoosuf (sibling (brothers)) in 2026-02-08 snapshot.
- Supporting direct-claim locators reviewed:
- CLM-0342: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P46 Omar and P50 Ibrahim (parent) in 2026-02-08 snapshot.
- CLM-0344: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P46 Omar and P52 Yoosuf (parent) in 2026-02-08 snapshot.
- CLM-0441: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P51 Kalu Mohamed and P52 Yoosuf (sibling (brothers)) in 2026-02-08 snapsho…

## 7) Integration notes
- `src/data/inference-notes.js` summary update needed: yes (keep wording aligned with this curated rationale).
- Edge label/type update needed: no (pending direct pairwise wording).
- Canonical promotion candidate: no (remains inferred).
- Verification priority level: medium-high

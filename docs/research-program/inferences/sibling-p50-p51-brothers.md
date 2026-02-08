# Inference Dossier

Edge key: `sibling|P50|P51|brothers`  
Last updated: `2026-02-08`  
Inference class: `curated`

## 1) Edge identity
- Relation type: sibling
- Source node: Ibrahim (P50)
- Target node: Kalu Mohamed (P51)
- Label: brothers
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: This edge models P50 and P51 as brothers because both are anchored as children of P46 and occur in the same tightly connected branch segment.
- Historical/dynastic context: Hilaaly cluster descending from P46 with multiple successor branches.
- Immediate claim anchors used for this pair review:
- CLM-0342: parent Omar (P46) -> Ibrahim (P50) (SRC-MRF-KINGS, grade B)
- CLM-0343: parent Omar (P46) -> Kalu Mohamed (P51) (SRC-MRF-KINGS, grade B)
- CLM-0441: sibling Kalu Mohamed (P51) -> Yoosuf (P52) [brothers] (SRC-MRF-KINGS, grade B)

## 3) Logic chain (pair-specific)
1. This pair is retained as inferred sibling (brothers) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.
2. Supporting claim CLM-0342: parent Omar (P46) -> Ibrahim (P50) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P50 Ibrahim.
3. Supporting claim CLM-0343: parent Omar (P46) -> Kalu Mohamed (P51) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P51 Kalu Mohamed.
4. Supporting claim CLM-0441: sibling Kalu Mohamed (P51) -> Yoosuf (P52) [brothers] (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P51 Kalu Mohamed and P52 Yoosuf as siblings (brothers).
5. Combined interpretation: these anchors keep the pair in-model as inferred sibling (brothers), but not promoted to confirmed until explicit pairwise wording is found.
6. Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement.

## 4) Alternative interpretations
- Half-brother class may be more precise if maternal differentiation emerges.
- One edge may represent branch affiliation rather than direct parent-child relation.
- If explicit source text gives another relation, revise accordingly.

## 5) Verification checklist
- Promotion requirement: A/B source explicitly stating P50 and P51 are brothers.
- Downgrade/removal trigger: Updated parent record that removes one endpoint from P46 descent.
- Review cadence: Re-check in each Hilaaly branch parentage refresh cycle.

## 6) Source basis
- `SRC-MRF-KINGS (Maldives Kings List)`
- Primary inferred claim row: CLM-0439
- Inferred claim locator: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P50 Ibrahim and P51 Kalu Mohamed (sibling (brothers)) in 2026-02-08 snapshot.
- Supporting direct-claim locators reviewed:
- CLM-0342: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P46 Omar and P50 Ibrahim (parent) in 2026-02-08 snapshot.
- CLM-0343: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P46 Omar and P51 Kalu Mohamed (parent) in 2026-02-08 snapshot.
- CLM-0441: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P51 Kalu Mohamed and P52 Yoosuf (sibling (brothers)) in 2026-02-08 snapsho…

## 7) Integration notes
- `src/data/inference-notes.js` summary update needed: yes (keep wording aligned with this curated rationale).
- Edge label/type update needed: no (pending direct pairwise wording).
- Canonical promotion candidate: no (remains inferred).
- Verification priority level: medium-high

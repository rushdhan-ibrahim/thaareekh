# Inference Dossier

Edge key: `sibling|P47|P50|brothers`  
Last updated: `2026-02-08`  
Inference class: `curated`

## 1) Edge identity
- Relation type: sibling
- Source node: Hassan (P47)
- Target node: Ibrahim (P50)
- Label: brothers
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: This edge models P47 and P50 as brothers based on shared parent anchors through P46; the model stays inferred until explicit pairwise sibling wording is documented.
- Historical/dynastic context: Mid-Hilaaly succession segment descending from P46 Omar.
- Immediate claim anchors used for this pair review:
- CLM-0341: parent Omar (P46) -> Hassan (P47) (SRC-MRF-KINGS, grade B)
- CLM-0342: parent Omar (P46) -> Ibrahim (P50) (SRC-MRF-KINGS, grade B)

## 3) Logic chain (pair-specific)
1. This pair is retained as inferred sibling (brothers) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.
2. Supporting claim CLM-0341: parent Omar (P46) -> Hassan (P47) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P47 Hassan.
3. Supporting claim CLM-0342: parent Omar (P46) -> Ibrahim (P50) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P50 Ibrahim.
4. Combined interpretation: these anchors keep the pair in-model as inferred sibling (brothers), but not promoted to confirmed until explicit pairwise wording is found.
5. Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement.

## 4) Alternative interpretations
- The pair could be half-brothers if maternal lines differ.
- One of the parent links may represent adoptive/household assignment rather than biological parentage.
- If direct genealogical text gives another class, relation label should be revised.

## 5) Verification checklist
- Promotion requirement: A/B source naming P47 and P50 explicitly as brothers.
- Downgrade/removal trigger: Any corrected parent assignment that breaks shared-parent basis.
- Review cadence: Re-check during Hilaaly mid-line parentage audit passes.

## 6) Source basis
- `SRC-MRF-KINGS (Maldives Kings List)`
- Primary inferred claim row: CLM-0433
- Inferred claim locator: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P47 Hassan and P50 Ibrahim (sibling (brothers)) in 2026-02-08 snapshot.
- Supporting direct-claim locators reviewed:
- CLM-0341: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P46 Omar and P47 Hassan (parent) in 2026-02-08 snapshot.
- CLM-0342: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P46 Omar and P50 Ibrahim (parent) in 2026-02-08 snapshot.

## 7) Integration notes
- `src/data/inference-notes.js` summary update needed: yes (keep wording aligned with this curated rationale).
- Edge label/type update needed: no (pending direct pairwise wording).
- Canonical promotion candidate: no (remains inferred).
- Verification priority level: medium-high

# Inference Dossier

Edge key: `sibling|P47|P51|brothers`  
Last updated: `2026-02-08`  
Inference class: `curated`

## 1) Edge identity
- Relation type: sibling
- Source node: Hassan (P47)
- Target node: Kalu Mohamed (P51)
- Label: brothers
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: This edge keeps P47 and P51 as brothers due to shared parent support through P46, with downstream P51 descendant claims reinforcing that this branch is genealogically central.
- Historical/dynastic context: Mid-Hilaaly succession and collateral descendants from P46.
- Immediate claim anchors used for this pair review:
- CLM-0341: parent Omar (P46) -> Hassan (P47) (SRC-MRF-KINGS, grade B)
- CLM-0343: parent Omar (P46) -> Kalu Mohamed (P51) (SRC-MRF-KINGS, grade B)
- CLM-0441: sibling Kalu Mohamed (P51) -> Yoosuf (P52) [brothers] (SRC-MRF-KINGS, grade B)

## 3) Logic chain (pair-specific)
1. This pair is retained as inferred sibling (brothers) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.
2. Supporting claim CLM-0341: parent Omar (P46) -> Hassan (P47) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P47 Hassan.
3. Supporting claim CLM-0343: parent Omar (P46) -> Kalu Mohamed (P51) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P51 Kalu Mohamed.
4. Supporting claim CLM-0441: sibling Kalu Mohamed (P51) -> Yoosuf (P52) [brothers] (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P51 Kalu Mohamed and P52 Yoosuf as siblings (brothers).
5. Combined interpretation: these anchors keep the pair in-model as inferred sibling (brothers), but not promoted to confirmed until explicit pairwise wording is found.
6. Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement.

## 4) Alternative interpretations
- The pair may be half-brothers if later maternal evidence distinguishes them.
- A collateral-branch merge in the source tradition could overstate direct siblingness.
- If explicit wording diverges, convert label to the sourced class.

## 5) Verification checklist
- Promotion requirement: A/B source explicitly stating P47 and P51 are brothers.
- Downgrade/removal trigger: Parent-line correction for either endpoint removing the shared-parent anchor.
- Review cadence: Re-check after each mid-Hilaaly branch corroboration update.

## 6) Source basis
- `SRC-MRF-KINGS (Maldives Kings List)`
- Primary inferred claim row: CLM-0434
- Inferred claim locator: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P47 Hassan and P51 Kalu Mohamed (sibling (brothers)) in 2026-02-08 snapshot.
- Supporting direct-claim locators reviewed:
- CLM-0341: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P46 Omar and P47 Hassan (parent) in 2026-02-08 snapshot.
- CLM-0343: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P46 Omar and P51 Kalu Mohamed (parent) in 2026-02-08 snapshot.
- CLM-0441: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P51 Kalu Mohamed and P52 Yoosuf (sibling (brothers)) in 2026-02-08 snapsho…

## 7) Integration notes
- `src/data/inference-notes.js` summary update needed: yes (keep wording aligned with this curated rationale).
- Edge label/type update needed: no (pending direct pairwise wording).
- Canonical promotion candidate: no (remains inferred).
- Verification priority level: medium-high

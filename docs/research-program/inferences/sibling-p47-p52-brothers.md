# Inference Dossier

Edge key: `sibling|P47|P52|brothers`  
Last updated: `2026-02-08`  
Inference class: `curated`

## 1) Edge identity
- Relation type: sibling
- Source node: Hassan (P47)
- Target node: Yoosuf (P52)
- Label: brothers
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: This edge models P47 and P52 as brothers because both are parent-linked to P46 and align with the sibling-rich branch pattern observed in nearby entries.
- Historical/dynastic context: Mid-Hilaaly sibling cluster around P46 with short reignal intervals.
- Immediate claim anchors used for this pair review:
- CLM-0341: parent Omar (P46) -> Hassan (P47) (SRC-MRF-KINGS, grade B)
- CLM-0344: parent Omar (P46) -> Yoosuf (P52) (SRC-MRF-KINGS, grade B)
- CLM-0441: sibling Kalu Mohamed (P51) -> Yoosuf (P52) [brothers] (SRC-MRF-KINGS, grade B)

## 3) Logic chain (pair-specific)
1. This pair is retained as inferred sibling (brothers) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.
2. Supporting claim CLM-0341: parent Omar (P46) -> Hassan (P47) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P47 Hassan.
3. Supporting claim CLM-0344: parent Omar (P46) -> Yoosuf (P52) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P52 Yoosuf.
4. Supporting claim CLM-0441: sibling Kalu Mohamed (P51) -> Yoosuf (P52) [brothers] (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P51 Kalu Mohamed and P52 Yoosuf as siblings (brothers).
5. Combined interpretation: these anchors keep the pair in-model as inferred sibling (brothers), but not promoted to confirmed until explicit pairwise wording is found.
6. Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement.

## 4) Alternative interpretations
- The tie could be half-brother rather than full brother.
- One endpoint may belong to an adjacent branch if early records are normalized differently.
- If direct text provides exact relation wording, adopt that class.

## 5) Verification checklist
- Promotion requirement: A/B source naming P47 and P52 as brothers.
- Downgrade/removal trigger: Incompatible parent reassignment for either endpoint.
- Review cadence: Re-check after each Hilaaly sibling-cluster verification pass.

## 6) Source basis
- `SRC-MRF-KINGS (Maldives Kings List)`
- Primary inferred claim row: CLM-0435
- Inferred claim locator: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P47 Hassan and P52 Yoosuf (sibling (brothers)) in 2026-02-08 snapshot.
- Supporting direct-claim locators reviewed:
- CLM-0341: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P46 Omar and P47 Hassan (parent) in 2026-02-08 snapshot.
- CLM-0344: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P46 Omar and P52 Yoosuf (parent) in 2026-02-08 snapshot.
- CLM-0441: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P51 Kalu Mohamed and P52 Yoosuf (sibling (brothers)) in 2026-02-08 snapsho…

## 7) Integration notes
- `src/data/inference-notes.js` summary update needed: yes (keep wording aligned with this curated rationale).
- Edge label/type update needed: no (pending direct pairwise wording).
- Canonical promotion candidate: no (remains inferred).
- Verification priority level: medium-high

# Inference Dossier

Edge key: `sibling|P31|P40|brothers`  
Last updated: `2026-02-08`  
Inference class: `curated`

## 1) Edge identity
- Relation type: sibling
- Source node: Ibrahim (P31)
- Target node: Aboobakuru (P40)
- Label: brothers
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: This edge keeps P31 and P40 as brothers because both are modeled as children of P30, while existing notes also allow a potential half-brother interpretation pending direct wording.
- Historical/dynastic context: Hilaaly branch continuity from P30 into the P40 collateral line.
- Immediate claim anchors used for this pair review:
- CLM-0333: parent Hassan (P30) -> Ibrahim (P31) (SRC-MRF-KINGS, grade B)
- CLM-0335: parent Hassan (P30) -> Aboobakuru (P40) (SRC-MRF-KINGS, grade B)
- CLM-0432: sibling Yoosuf (P39) -> Aboobakuru (P40) [half-brothers] (SRC-MRF-KINGS, grade B)

## 3) Logic chain (pair-specific)
1. This pair is retained as inferred sibling (brothers) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.
2. Supporting claim CLM-0333: parent Hassan (P30) -> Ibrahim (P31) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P31 Ibrahim.
3. Supporting claim CLM-0335: parent Hassan (P30) -> Aboobakuru (P40) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P40 Aboobakuru.
4. Supporting claim CLM-0432: sibling Yoosuf (P39) -> Aboobakuru (P40) [half-brothers] (SRC-MRF-KINGS, grade B); excerpt: Kings list marks P39 and P40 as half-brothers.
5. Combined interpretation: these anchors keep the pair in-model as inferred sibling (brothers), but not promoted to confirmed until explicit pairwise wording is found.
6. Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement.

## 4) Alternative interpretations
- Half-brother status is plausible and may be the correct specific label.
- A collateral interpretation could apply if one parent assignment is revised.
- If direct texts name a different relation class, this edge should be relabeled.

## 5) Verification checklist
- Promotion requirement: A/B source text explicitly naming P31 and P40 as brothers (or half-brothers).
- Downgrade/removal trigger: Source-backed parent reassignment removing shared-parent support.
- Review cadence: Re-check after each Hilaaly lineage corroboration batch.

## 6) Source basis
- `SRC-MRF-HILAALY (Royal House of Hilaaly)`
- `SRC-WIKI-MONARCHS (List of Maldivian monarchs)`
- `SRC-MRF-KINGS (Maldives Kings List)`
- Primary inferred claim row: CLM-0430
- Inferred claim locator: Inference synthesis from SRC-MRF-HILAALY with corroborative sequence context
- Supporting direct-claim locators reviewed:
- CLM-0333: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P30 Hassan and P31 Ibrahim (parent) in 2026-02-08 snapshot.
- CLM-0335: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P30 Hassan and P40 Aboobakuru (parent) in 2026-02-08 snapshot.
- CLM-0432: SRC-MRF-KINGS entries for P39-P40 kin annotation

## 7) Integration notes
- `src/data/inference-notes.js` summary update needed: yes (keep wording aligned with this curated rationale).
- Edge label/type update needed: no (pending direct pairwise wording).
- Canonical promotion candidate: no (remains inferred).
- Verification priority level: high (branch-sensitive Hilaaly relation)

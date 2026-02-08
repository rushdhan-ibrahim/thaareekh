# Inference Dossier

Edge key: `sibling|P31|P39|brothers`  
Last updated: `2026-02-08`  
Inference class: `curated`

## 1) Edge identity
- Relation type: sibling
- Source node: Ibrahim (P31)
- Target node: Yoosuf (P39)
- Label: brothers
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: This edge models P31 and P39 as brothers because both are anchored as children of P30; the pair remains inferred until a source line names them together as brothers.
- Historical/dynastic context: Hilaaly transition from P30 into P31 and P39 sovereign lines.
- Immediate claim anchors used for this pair review:
- CLM-0333: parent Hassan (P30) -> Ibrahim (P31) (SRC-MRF-KINGS, grade B)
- CLM-0334: parent Hassan (P30) -> Yoosuf (P39) (SRC-MRF-KINGS, grade B)
- CLM-0432: sibling Yoosuf (P39) -> Aboobakuru (P40) [half-brothers] (SRC-MRF-KINGS, grade B)

## 3) Logic chain (pair-specific)
1. This pair is retained as inferred sibling (brothers) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.
2. Supporting claim CLM-0333: parent Hassan (P30) -> Ibrahim (P31) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P31 Ibrahim.
3. Supporting claim CLM-0334: parent Hassan (P30) -> Yoosuf (P39) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P39 Yoosuf.
4. Supporting claim CLM-0432: sibling Yoosuf (P39) -> Aboobakuru (P40) [half-brothers] (SRC-MRF-KINGS, grade B); excerpt: Kings list marks P39 and P40 as half-brothers.
5. Combined interpretation: these anchors keep the pair in-model as inferred sibling (brothers), but not promoted to confirmed until explicit pairwise wording is found.
6. Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement.

## 4) Alternative interpretations
- They could be half-brothers if maternal branches differ.
- One endpoint might belong to an adjacent collateral branch in alternate chronicle traditions.
- If direct wording provides another class (for example cousin), the edge should be updated.

## 5) Verification checklist
- Promotion requirement: A/B source explicitly identifying P31 and P39 as brothers.
- Downgrade/removal trigger: Documented reassignment of either P31 or P39 to a different parent line.
- Review cadence: Re-check after Hilaaly high-impact bridge verification cycles.

## 6) Source basis
- `SRC-MRF-HILAALY (Royal House of Hilaaly)`
- `SRC-WIKI-MONARCHS (List of Maldivian monarchs)`
- `SRC-MRF-KINGS (Maldives Kings List)`
- Primary inferred claim row: CLM-0429
- Inferred claim locator: Inference synthesis from SRC-MRF-HILAALY with corroborative sequence context
- Supporting direct-claim locators reviewed:
- CLM-0333: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P30 Hassan and P31 Ibrahim (parent) in 2026-02-08 snapshot.
- CLM-0334: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P30 Hassan and P39 Yoosuf (parent) in 2026-02-08 snapshot.
- CLM-0432: SRC-MRF-KINGS entries for P39-P40 kin annotation

## 7) Integration notes
- `src/data/inference-notes.js` summary update needed: yes (keep wording aligned with this curated rationale).
- Edge label/type update needed: no (pending direct pairwise wording).
- Canonical promotion candidate: no (remains inferred).
- Verification priority level: high (core Hilaaly sovereign bridge)

# Inference Dossier

Edge key: `parent|P13|P15|`  
Last updated: `2026-02-08`  
Inference class: `curated`

## 1) Edge identity
- Relation type: parent
- Source node: Audha (P13)
- Target node: Yoosuf (P15)
- Label: (none)
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: This edge preserves a provisional parent claim from P13 to P15 based on surrounding lineage statements (P13->P14 and sibling P14<->P15) without direct wording for P13->P15 itself.
- Historical/dynastic context: Early Lunar succession corridor where explicit sibling and parent links are partially preserved.
- Immediate claim anchors used for this pair review:
- CLM-0263: parent Audha (P13) -> Hali (P14) (SRC-MRF-KINGS, grade B)
- CLM-0386: sibling Hali (P14) -> Yoosuf (P15) [brothers] (SRC-MRF-KINGS, grade B)
- CLM-0285: parent Yoosuf (P15) -> Salis (P16) (SRC-MRF-KINGS, grade B)

## 3) Logic chain (pair-specific)
1. This pair is retained as inferred parent because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.
2. Supporting claim CLM-0263: parent Audha (P13) -> Hali (P14) (SRC-MRF-KINGS, grade B); excerpt: Kings list gives P14 as son of P13 in the early Lunar succession sequence.
3. Supporting claim CLM-0386: sibling Hali (P14) -> Yoosuf (P15) [brothers] (SRC-MRF-KINGS, grade B); excerpt: Kings list marks P14 and P15 as brothers.
4. Supporting claim CLM-0285: parent Yoosuf (P15) -> Salis (P16) (SRC-MRF-KINGS, grade B); excerpt: Kings list states P16 as son of P15.
5. Combined interpretation: these anchors keep the pair in-model as inferred parent, but not promoted to confirmed until explicit pairwise wording is found.
6. Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement.

## 4) Alternative interpretations
- P15 may be collateral sibling-generation kin rather than direct child of P13.
- The relation may require insertion of an additional intermediate node not yet modeled.
- If manuscript evidence confirms different parentage, the edge should be removed.

## 5) Verification checklist
- Promotion requirement: Direct A/B source phrase naming P13 as parent of P15.
- Downgrade/removal trigger: Primary chronicle sequence assigning P15 to another parent.
- Review cadence: Re-check after Lunar manuscript corroboration queue completion.

## 6) Source basis
- `SRC-MRF-KINGS (Maldives Kings List)`
- Primary inferred claim row: CLM-0264
- Inferred claim locator: Inference synthesis from SRC-MRF-KINGS entries #13-#15
- Supporting direct-claim locators reviewed:
- CLM-0263: SRC-MRF-KINGS entries #13-#14 lineage note. URL anchor: https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml. Node pair: P13 Audha <-> P14 Hali (parent), 2026-02-08 snapshot.
- CLM-0386: SRC-MRF-KINGS entries #14-#15 kin annotation. URL anchor: https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml. Node pair: P14 Hali <-> P15 Yoosuf (sibling (brothers)), 2026-02-08 snapshot.
- CLM-0285: SRC-MRF-KINGS entries #15-#16 parentage note. URL anchor: https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml. Node pair: P15 Yoosuf <-> P16 Salis (parent), 2026-02-08 snapshot.

## 7) Integration notes
- `src/data/inference-notes.js` summary update needed: yes (keep wording aligned with this curated rationale).
- Edge label/type update needed: no (pending direct pairwise wording).
- Canonical promotion candidate: no (remains inferred).
- Verification priority level: high (early Lunar chain integrity)

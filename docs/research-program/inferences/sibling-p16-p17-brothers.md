# Inference Dossier

Edge key: `sibling|P16|P17|brothers`  
Last updated: `2026-02-08`  
Inference class: `curated`

## 1) Edge identity
- Relation type: sibling
- Source node: Salis (P16)
- Target node: Davud (P17)
- Label: brothers
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: This edge keeps P16 and P17 as brothers because both are explicitly modeled as children of P15, but direct sibling wording for this exact pair is still not captured.
- Historical/dynastic context: Early Lunar succession segment around P15 descendants.
- Immediate claim anchors used for this pair review:
- CLM-0285: parent Yoosuf (P15) -> Salis (P16) (SRC-MRF-KINGS, grade B)
- CLM-0286: parent Yoosuf (P15) -> Davud (P17) (SRC-MRF-KINGS, grade B)
- CLM-0408: sibling Salis (P16) -> Omar Veeru (P18) [half-brothers] (SRC-MRF-KINGS, grade B)

## 3) Logic chain (pair-specific)
1. This pair is retained as inferred sibling (brothers) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.
2. Supporting claim CLM-0285: parent Yoosuf (P15) -> Salis (P16) (SRC-MRF-KINGS, grade B); excerpt: Kings list states P16 as son of P15.
3. Supporting claim CLM-0286: parent Yoosuf (P15) -> Davud (P17) (SRC-MRF-KINGS, grade B); excerpt: Kings list states P17 as son of P15.
4. Supporting claim CLM-0408: sibling Salis (P16) -> Omar Veeru (P18) [half-brothers] (SRC-MRF-KINGS, grade B); excerpt: Kings list marks P16 and P18 as half-brothers (maternal).
5. Combined interpretation: these anchors keep the pair in-model as inferred sibling (brothers), but not promoted to confirmed until explicit pairwise wording is found.
6. Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement.

## 4) Alternative interpretations
- The pair could be half-brothers if maternal distinction is eventually documented.
- A scribal sequence issue could indicate one is nephew rather than brother.
- If a primary source labels them differently, adjust relation label accordingly.

## 5) Verification checklist
- Promotion requirement: A/B statement explicitly naming P16 and P17 as brothers.
- Downgrade/removal trigger: Source text assigning only one of them to P15 or assigning different parentage.
- Review cadence: Re-check after early Lunar manuscript extraction updates.

## 6) Source basis
- `SRC-MRF-KINGS (Maldives Kings List)`
- Primary inferred claim row: CLM-0407
- Inferred claim locator: Inference synthesis from SRC-MRF-KINGS parent edges P15->P16 and P15->P17
- Supporting direct-claim locators reviewed:
- CLM-0285: SRC-MRF-KINGS entries #15-#16 parentage note. URL anchor: https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml. Node pair: P15 Yoosuf <-> P16 Salis (parent), 2026-02-08 snapshot.
- CLM-0286: SRC-MRF-KINGS entries #15-#17 parentage note. URL anchor: https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml. Node pair: P15 Yoosuf <-> P17 Davud (parent), 2026-02-08 snapshot.
- CLM-0408: SRC-MRF-KINGS entries #16-#18 kin annotation. URL anchor: https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml. Node pair: P16 Salis <-> P18 Omar Veeru (sibling (half-brothers)), 2026-02-08 sn…

## 7) Integration notes
- `src/data/inference-notes.js` summary update needed: yes (keep wording aligned with this curated rationale).
- Edge label/type update needed: no (pending direct pairwise wording).
- Canonical promotion candidate: no (remains inferred).
- Verification priority level: medium-high

# Inference Dossier

Edge key: `sibling|P5|P8|brothers`  
Last updated: `2026-02-08`  
Inference class: `curated`

## 1) Edge identity
- Relation type: sibling
- Source node: Dhinei (P5)
- Target node: Valla Dio (P8)
- Label: brothers
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: This edge keeps P5 and P8 as brothers by combining short-chain sibling evidence in the same sequence block, but it remains inferred because no direct P5-P8 sibling sentence is captured yet.
- Historical/dynastic context: Extended early Lunar sibling chain spanning P5 through P8.
- Immediate claim anchors used for this pair review:
- CLM-0436: sibling Dhinei (P5) -> Dhilhel (P6) [brothers] (SRC-MRF-KINGS, grade B)
- CLM-0442: sibling Dhilhel (P6) -> Wadi (P7) [brothers] (SRC-MRF-KINGS, grade B)
- CLM-0446: sibling Wadi (P7) -> Valla Dio (P8) [brothers] (SRC-MRF-KINGS, grade B)

## 3) Logic chain (pair-specific)
1. This pair is retained as inferred sibling (brothers) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.
2. Supporting claim CLM-0436: sibling Dhinei (P5) -> Dhilhel (P6) [brothers] (SRC-MRF-KINGS, grade B); excerpt: Kings list explicitly notes P5 and P6 as brothers.
3. Supporting claim CLM-0442: sibling Dhilhel (P6) -> Wadi (P7) [brothers] (SRC-MRF-KINGS, grade B); excerpt: Kings list explicitly notes P6 and P7 as brothers.
4. Supporting claim CLM-0446: sibling Wadi (P7) -> Valla Dio (P8) [brothers] (SRC-MRF-KINGS, grade B); excerpt: Kings list explicitly notes P7 and P8 as brothers.
5. Combined interpretation: these anchors keep the pair in-model as inferred sibling (brothers), but not promoted to confirmed until explicit pairwise wording is found.
6. Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement.

## 4) Alternative interpretations
- The link may represent broader same-generation kin rather than strict brotherhood.
- One middle segment could reflect editorial normalization instead of biological relation.
- If direct evidence gives a different class, replace this inferred label.

## 5) Verification checklist
- Promotion requirement: A/B direct wording naming P5 and P8 as brothers.
- Downgrade/removal trigger: Direct evidence that breaks the P5-P6-P7-P8 sibling chain.
- Review cadence: Re-check when line-level chronicle extracts are added for early Lunar nodes.

## 6) Source basis
- `SRC-MRF-KINGS (Maldives Kings List)`
- Primary inferred claim row: CLM-0438
- Inferred claim locator: Inference synthesis from SRC-MRF-KINGS sibling chain entries #5-#8
- Supporting direct-claim locators reviewed:
- CLM-0436: SRC-MRF-KINGS entries #5-#6 kin annotation. URL anchor: https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml. Node pair: P5 Dhinei <-> P6 Dhilhel (sibling (brothers)), 2026-02-08 snapshot.
- CLM-0442: SRC-MRF-KINGS entries #6-#7 kin annotation. URL anchor: https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml. Node pair: P6 Dhilhel <-> P7 Wadi (sibling (brothers)), 2026-02-08 snapshot.
- CLM-0446: SRC-MRF-KINGS entries #7-#8 kin annotation. URL anchor: https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml. Node pair: P7 Wadi <-> P8 Valla Dio (sibling (brothers)), 2026-02-08 snapshot.

## 7) Integration notes
- `src/data/inference-notes.js` summary update needed: yes (keep wording aligned with this curated rationale).
- Edge label/type update needed: no (pending direct pairwise wording).
- Canonical promotion candidate: no (remains inferred).
- Verification priority level: medium

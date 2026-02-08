# Inference Dossier

Edge key: `sibling|P19|P25|half-siblings`  
Last updated: `2026-02-08`  
Inference class: `curated`

## 1) Edge identity
- Relation type: sibling
- Source node: Ahmed Shihabuddine (P19)
- Target node: Raadhaafathi (P25)
- Label: half-siblings
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: This edge preserves a half-sibling interpretation for P19 and P25 because both are linked to P18 and nearby sibling notes indicate mixed full/half sibling patterns in the same household cluster.
- Historical/dynastic context: Lunar household branch around P18 with mixed sibling annotations.
- Immediate claim anchors used for this pair review:
- CLM-0316: parent Omar Veeru (P18) -> Ahmed Shihabuddine (P19) (SRC-MRF-KINGS, grade B)
- CLM-0318: parent Omar Veeru (P18) -> Raadhaafathi (P25) (SRC-MRF-KINGS, grade B)
- CLM-0427: sibling Khadijah (P20) -> Raadhaafathi (P25) [half-sisters] (SRC-MRF-KINGS, grade B)

## 3) Logic chain (pair-specific)
1. This pair is retained as inferred sibling (half-siblings) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.
2. Supporting claim CLM-0316: parent Omar Veeru (P18) -> Ahmed Shihabuddine (P19) (SRC-MRF-KINGS, grade B); excerpt: Kings list gives P19 as child of P18.
3. Supporting claim CLM-0318: parent Omar Veeru (P18) -> Raadhaafathi (P25) (SRC-MRF-KINGS, grade B); excerpt: Kings list gives P25 as child of P18 in the same household branch.
4. Supporting claim CLM-0427: sibling Khadijah (P20) -> Raadhaafathi (P25) [half-sisters] (SRC-MRF-KINGS, grade B); excerpt: Kings list marks P20 and P25 as half-sisters.
5. Combined interpretation: these anchors keep the pair in-model as inferred sibling (half-siblings), but not promoted to confirmed until explicit pairwise wording is found.
6. Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement.

## 4) Alternative interpretations
- They may be full siblings if maternal evidence eventually aligns.
- They may be broader household kin rather than strict sibling relation.
- If direct text says full siblings or non-siblings, revise the label.

## 5) Verification checklist
- Promotion requirement: Direct A/B wording naming P19 and P25 as half-siblings (or explicit sibling class).
- Downgrade/removal trigger: Evidence that one endpoint is not child of P18 or that sibling class is incompatible.
- Review cadence: Re-check when Lunar family-structure citations are expanded with line-level extracts.

## 6) Source basis
- `SRC-MRF-KINGS (Maldives Kings List)`
- Primary inferred claim row: CLM-0418
- Inferred claim locator: Inference synthesis from SRC-MRF-KINGS entries #19/#20/#25
- Supporting direct-claim locators reviewed:
- CLM-0316: SRC-MRF-KINGS entries #18-#19 lineage note. URL anchor: https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml. Node pair: P18 Omar Veeru <-> P19 Ahmed Shihabuddine (parent), 2026-02-08 snapshot.
- CLM-0318: SRC-MRF-KINGS entries #18 and #25 lineage note. URL anchor: https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml. Node pair: P18 Omar Veeru <-> P25 Raadhaafathi (parent), 2026-02-08 snapshot.
- CLM-0427: SRC-MRF-KINGS entries #20 and #25 kin annotation. URL anchor: https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml. Node pair: P20 Khadijah <-> P25 Raadhaafathi (sibling (half-sisters)), 2026-…

## 7) Integration notes
- `src/data/inference-notes.js` summary update needed: yes (keep wording aligned with this curated rationale).
- Edge label/type update needed: no (pending direct pairwise wording).
- Canonical promotion candidate: no (remains inferred).
- Verification priority level: medium-high

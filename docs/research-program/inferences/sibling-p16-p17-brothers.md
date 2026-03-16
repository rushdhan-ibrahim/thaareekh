# Inference Dossier

Edge key: `sibling|P16|P17|brothers`  
Last updated: `2026-02-19`  
Inference class: `curated`

## 1) Edge identity
- Relation type: sibling
- Source node: P16 Salis (Meesuvvara)
- Target node: P17 Davud (Sundhura Bavana)
- Label: brothers
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P16 Salis (Meesuvvara) and P17 Davud (Sundhura Bavana) are modeled as `sibling` with label `brothers` to preserve a targeted continuity claim without over-promoting certainty.
- Historical/dynastic context: Lunar -> Lunar
- Immediate direct-claim anchors around these nodes:
- CLM-0285: parent P15 Yoosuf (Bavanaadheeththa) -> P16 Salis (Meesuvvara) (SRC-MRF-KINGS, grade B)
- CLM-0286: parent P15 Yoosuf (Bavanaadheeththa) -> P17 Davud (Sundhura Bavana) (SRC-MRF-KINGS, grade B)
- CLM-0571: parent P16 Salis (Meesuvvara) -> P18 Omar Veeru (Loka Abarana) (SRC-ROYALARK-MALDIVES, grade B)

## 3) Logic chain (pair-specific)
1. Shortest direct-claim support path (2 steps) linking this pair:
2. - parent P16 Salis (Meesuvvara) -> P15 Yoosuf (Bavanaadheeththa) (CLM-0285, SRC-MRF-KINGS)
3. - parent P15 Yoosuf (Bavanaadheeththa) -> P17 Davud (Sundhura Bavana) (CLM-0286, SRC-MRF-KINGS)
4. This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.
5. Current modeling choice remains `inferred` because explicit source wording that names `sibling` for P16 Salis (Meesuvvara) and P17 Davud (Sundhura Bavana) is still absent.

## 4) Alternative interpretations
- Possible competing interpretation: half-sibling or cousin if shared-parent evidence is partial rather than full.
- Competing interpretation trigger: direct wording that uses non-sibling kin terminology for this pair.
- Model-retention rationale: keep the edge as inferred until explicit pairwise wording is located.

## 5) Verification checklist
- Promotion requirement: an A/B source statement explicitly naming P16 Salis (Meesuvvara) and P17 Davud (Sundhura Bavana) with relation class `sibling` (brothers).
- Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.
- Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster.

## 6) Source basis
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0407
- Inferred claim locator: Inference synthesis from SRC-MRF-KINGS parent edges P15->P16 and P15->P17

## 7) Integration notes
- `src/data/inference-notes.js` summary should be synced if relation wording changes after verification.
- Canonical promotion candidate: no (remains inferred until explicit pairwise wording is captured).
- Verification priority level: high (current grade C)

# Inference Dossier

Edge key: `parent|P13|P15|`  
Last updated: `2026-02-10`  
Inference class: `curated`

## 1) Edge identity
- Relation type: parent
- Source node: P13 Audha (Areedha Suvara)
- Target node: P15 Yoosuf (Bavanaadheeththa)
- Label: (no label)
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P13 Audha (Areedha Suvara) and P15 Yoosuf (Bavanaadheeththa) are modeled as `parent` to preserve a targeted continuity claim without over-promoting certainty.
- Historical/dynastic context: Lunar -> Lunar
- Immediate direct-claim anchors around these nodes:
- CLM-0263: parent P13 Audha (Areedha Suvara) -> P14 Hali (Areedha Suvara) (SRC-MRF-KINGS, grade B)
- CLM-0285: parent P15 Yoosuf (Bavanaadheeththa) -> P16 Salis (Meesuvvara) (SRC-MRF-KINGS, grade B)
- CLM-0286: parent P15 Yoosuf (Bavanaadheeththa) -> P17 Davud (Sundhura Bavana) (SRC-MRF-KINGS, grade B)
- CLM-0352: parent P7 Wadi (Dhagathaa Suvara) -> P13 Audha (Areedha Suvara) (SRC-MRF-KINGS, grade B)
- CLM-0386: sibling P14 Hali (Areedha Suvara) <-> P15 Yoosuf (Bavanaadheeththa) [brothers] (SRC-MRF-KINGS, grade B)

## 3) Logic chain (pair-specific)
1. Shortest direct-claim support path (2 steps) linking this pair:
2. - parent P13 Audha (Areedha Suvara) -> P14 Hali (Areedha Suvara) (CLM-0263, SRC-MRF-KINGS)
3. - sibling P14 Hali (Areedha Suvara) <-> P15 Yoosuf (Bavanaadheeththa) [brothers] (CLM-0386, SRC-MRF-KINGS)
4. This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.
5. Current modeling choice remains `inferred` because explicit source wording that names `parent` for P13 Audha (Areedha Suvara) and P15 Yoosuf (Bavanaadheeththa) is still absent.

## 4) Alternative interpretations
- Possible competing interpretation: grandparent or older collateral guardian-line relation instead of direct parent.
- Competing interpretation trigger: explicit source naming a different immediate parent for the target node.
- Model-retention rationale: keep the edge as inferred until explicit pairwise wording is located.

## 5) Verification checklist
- Promotion requirement: an A/B source statement explicitly naming P13 Audha (Areedha Suvara) and P15 Yoosuf (Bavanaadheeththa) with relation class `parent`.
- Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.
- Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster.

## 6) Source basis
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0264
- Inferred claim locator: Inference synthesis from SRC-MRF-KINGS entries #13-#15

## 7) Integration notes
- `src/data/inference-notes.js` summary should be synced if relation wording changes after verification.
- Canonical promotion candidate: no (remains inferred until explicit pairwise wording is captured).
- Verification priority level: high (current grade C)

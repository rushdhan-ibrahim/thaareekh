# Inference Dossier

Edge key: `kin|P7|P15|grandparent`  
Last updated: `2026-02-10`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P7 Wadi (Dhagathaa Suvara)
- Target node: P15 Yoosuf (Bavanaadheeththa)
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P7 Wadi (Dhagathaa Suvara) and P15 Yoosuf (Bavanaadheeththa) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Lunar -> Lunar
- Rule basis status: resolved (1 supporting edge).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P7 Wadi (Dhagathaa Suvara) -> P13 Audha (Areedha Suvara) (CLM-0352, SRC-MRF-KINGS, grade B); excerpt: Kings list sequence indicates P7 as father of P13.
3. Rule application (parent-of-parent-grandparent): with source -> P13 Audha (Areedha Suvara) and P13 Audha (Areedha Suvara) -> target parent links, P7 Wadi (Dhagathaa Suvara) is modeled as inferred grandparent-line kin of P15 Yoosuf (Bavanaadheeththa).
4. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P7 Wadi (Dhagathaa Suvara) and P15 Yoosuf (Bavanaadheeththa) as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0086
- Inferred claim locator: Inference basis: parent-of-parent-grandparent (see docs/research-program/inferences/kin-p15-p7-grandparent.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

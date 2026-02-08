# Inference Dossier

Edge key: `kin|P13|P6|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-08`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P13 Audha (Areedha Suvara)
- Target node: P6 Dhilhel (Dhagathaa Abarana)
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P13 Audha (Areedha Suvara) and P6 Dhilhel (Dhagathaa Abarana) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Lunar -> Lunar
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle resolved as follows.
2. Supporting edge: parent P7 Wadi (Dhagathaa Suvara) -> P13 Audha (Areedha Suvara) (CLM-0352, SRC-MRF-KINGS, grade B); excerpt: Kings list sequence indicates P7 as father of P13.
3. Supporting edge: sibling P6 Dhilhel (Dhagathaa Abarana) <-> P7 Wadi (Dhagathaa Suvara) [brothers] (CLM-0442, SRC-MRF-KINGS, grade B); excerpt: Kings list explicitly notes P6 and P7 as brothers.
4. Rule application (parent-sibling-aunt-uncle): sibling(P7 Wadi (Dhagathaa Suvara), P6 Dhilhel (Dhagathaa Abarana)) plus parent(P7 Wadi (Dhagathaa Suvara), child) yields inferred aunt/uncle-line kin between P13 Audha (Areedha Suvara) and P6 Dhilhel (Dhagathaa Abarana).
5. Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.
- Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P13 Audha (Areedha Suvara) and P6 Dhilhel (Dhagathaa Abarana) as kin (aunt/uncle↔niece/nephew).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0061
- Inferred claim locator: Inference basis: parent-sibling-aunt-uncle (see docs/research-program/inferences/kin-p13-p6-aunt-uncle-niece-nephew.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

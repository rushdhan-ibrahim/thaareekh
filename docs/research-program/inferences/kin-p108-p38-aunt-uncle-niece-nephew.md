# Inference Dossier

Edge key: `kin|P108|P38|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-08`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P108 Kulhiveri Hilaal Kaiulhanna Kaloge
- Target node: P38 Danna Mohamed (Raadha Bavana)
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P108 Kulhiveri Hilaal Kaiulhanna Kaloge and P38 Danna Mohamed (Raadha Bavana) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle resolved as follows.
2. Supporting edge: parent P192 Yusuf Handeygirin -> P38 Danna Mohamed (Raadha Bavana) (CLM-0326, SRC-MRF-HILAALY, grade B); excerpt: Hilaaly branch source gives parent edge P192 to P38.
3. Supporting edge: sibling P108 Kulhiveri Hilaal Kaiulhanna Kaloge <-> P192 Yusuf Handeygirin [brothers] (CLM-0373, SRC-MRF-HILAALY, grade B); excerpt: Royal House of Hilaaly family/genealogy content links P108 Kulhiveri Hilaal Kaiulhanna Kaloge and P192 Yusuf Handeygirin as siblings (brothers).
4. Rule application (parent-sibling-aunt-uncle): sibling(P192 Yusuf Handeygirin, P108 Kulhiveri Hilaal Kaiulhanna Kaloge) plus parent(P192 Yusuf Handeygirin, child) yields inferred aunt/uncle-line kin between P108 Kulhiveri Hilaal Kaiulhanna Kaloge and P38 Danna Mohamed (Raadha Bavana).
5. Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.
- Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P108 Kulhiveri Hilaal Kaiulhanna Kaloge and P38 Danna Mohamed (Raadha Bavana) as kin (aunt/uncle↔niece/nephew).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-HILAALY` (Royal House of Hilaaly)
- Primary inferred claim row: CLM-0016
- Inferred claim locator: Inference basis: parent-sibling-aunt-uncle (see docs/research-program/inferences/kin-p108-p38-aunt-uncle-niece-nephew.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

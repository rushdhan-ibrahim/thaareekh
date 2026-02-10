# Inference Dossier

Edge key: `kin|P155|P129|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-10`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P155 Maandhoogey Bodu Dhorhy Manippulu
- Target node: P129 Princess Veyogey Dhon Goma
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P155 Maandhoogey Bodu Dhorhy Manippulu and P129 Princess Veyogey Dhon Goma are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Huraagey -> Huraagey
- Rule basis status: unresolved support edges.

## 3) Logic chain (pair-specific)
1. Supporting edge: unresolved from inference basis metadata for rule parent-sibling-aunt-uncle.
2. This dossier should be re-generated after edge-basis reconciliation.
3. Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.
- Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P155 Maandhoogey Bodu Dhorhy Manippulu and P129 Princess Veyogey Dhon Goma as kin (aunt/uncle↔niece/nephew).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- Primary inferred claim row: CLM-0054
- Inferred claim locator: Inference basis: parent-sibling-aunt-uncle (see docs/research-program/inferences/kin-p129-p155-aunt-uncle-niece-nephew.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

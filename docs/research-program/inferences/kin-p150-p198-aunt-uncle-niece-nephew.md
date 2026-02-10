# Inference Dossier

Edge key: `kin|P198|P150|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-10`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P198 Ilyas Ibrahim
- Target node: P150 Dunya Maumoon
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P198 Ilyas Ibrahim and P150 Dunya Maumoon are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Modern -> Modern
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle resolved as follows.
2. Supporting edge: parent P149 Nasreena Ibrahim -> P150 Dunya Maumoon (CLM-0281, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox spouse and issue fields support Nasreena Ibrahim as spouse in the child list including Dunya Maumoon. (pair: P149 Nasreena Ib...
3. Supporting edge: sibling P149 Nasreena Ibrahim <-> P198 Ilyas Ibrahim [siblings] (CLM-0398, SRC-WIKI-ILYAS-IBRAHIM, grade B); excerpt: Ilyas Ibrahim family/genealogy content links P149 Nasreena Ibrahim and P198 Ilyas Ibrahim as siblings (siblings).
4. Rule application (parent-sibling-aunt-uncle): sibling(P149 Nasreena Ibrahim, P198 Ilyas Ibrahim) plus parent(P149 Nasreena Ibrahim, child) yields inferred aunt/uncle-line kin between P198 Ilyas Ibrahim and P150 Dunya Maumoon.
5. Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.
- Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P198 Ilyas Ibrahim and P150 Dunya Maumoon as kin (aunt/uncle↔niece/nephew).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-WIKI-MAUMOON` (Maumoon Abdul Gayoom)
- `SRC-WIKI-ILYAS-IBRAHIM` (Ilyas Ibrahim)
- Primary inferred claim row: CLM-0087
- Inferred claim locator: Inference basis: parent-sibling-aunt-uncle (see docs/research-program/inferences/kin-p150-p198-aunt-uncle-niece-nephew.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

# Inference Dossier

Edge key: `kin|P47|P55|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-10`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P47 Hassan (Raadha Aanandha)
- Target node: P55 Hassan (Singa Veeru)
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P47 Hassan (Raadha Aanandha) and P55 Hassan (Singa Veeru) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (1 supporting edge).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle resolved as follows.
2. Supporting edge: parent P52 Yoosuf (Veeru Aanandha) -> P55 Hassan (Singa Veeru) (CLM-0346, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P52 Yoosuf as parent of P55 Hassan.
3. Rule application (parent-sibling-aunt-uncle): sibling(P52 Yoosuf (Veeru Aanandha), P47 Hassan (Raadha Aanandha)) plus parent(P52 Yoosuf (Veeru Aanandha), child) yields inferred aunt/uncle-line kin between P47 Hassan (Raadha Aanandha) and P55 Hassan (Singa Veeru).
4. Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.
- Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P47 Hassan (Raadha Aanandha) and P55 Hassan (Singa Veeru) as kin (aunt/uncle↔niece/nephew).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0169
- Inferred claim locator: Inference basis: parent-sibling-aunt-uncle (see docs/research-program/inferences/kin-p47-p55-aunt-uncle-niece-nephew.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

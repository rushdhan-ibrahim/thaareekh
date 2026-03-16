# Inference Dossier

Edge key: `kin|P31|P41|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P31 Ibrahim (Dhammaru Veeru)
- Target node: P41 Hadi Hassan (Raadha Veeru)
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P31 Ibrahim (Dhammaru Veeru) and P41 Hadi Hassan (Raadha Veeru) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (1 supporting edge).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle resolved as follows.
2. Supporting edge: parent P39 Yoosuf (Loka Aananadha) -> P41 Hadi Hassan (Raadha Veeru) (CLM-0596, SRC-ROYALARK-MALDIVES, grade B); excerpt: RoyalArk Maldives lineage reconstruction gives Yoosuf (P39) as father of Hadi Hassan (P41), which aligns with current canonical parent selection.
3. Rule application (parent-sibling-aunt-uncle): sibling(P39 Yoosuf (Loka Aananadha), P31 Ibrahim (Dhammaru Veeru)) plus parent(P39 Yoosuf (Loka Aananadha), child) yields inferred aunt/uncle-line kin between P31 Ibrahim (Dhammaru Veeru) and P41 Hadi Hassan (Raadha Veeru).
4. Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.
- Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P31 Ibrahim (Dhammaru Veeru) and P41 Hadi Hassan (Raadha Veeru) as kin (aunt/uncle↔niece/nephew).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-ROYALARK-MALDIVES` (RoyalArk Maldives — Complete Genealogical Database (segments 3-16))
- Primary inferred claim row: CLM-0146
- Inferred claim locator: Inference basis: parent-sibling-aunt-uncle (see docs/research-program/inferences/kin-p31-p41-aunt-uncle-niece-nephew.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

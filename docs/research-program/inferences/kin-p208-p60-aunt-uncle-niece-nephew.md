# Inference Dossier

Edge key: `kin|P208|P60|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P208 Princess Aysha Rani Kilege
- Target node: P60 Mohamed (Singa Bavana)
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P208 Princess Aysha Rani Kilege and P60 Mohamed (Singa Bavana) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (1 supporting edge).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle resolved as follows.
2. Supporting edge: parent P219 Umar Ma'afai Kilege -> P60 Mohamed (Singa Bavana) (CLM-0587, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Umar Ma'afai Kilege as parent of Mohamed.
3. Rule application (parent-sibling-aunt-uncle): sibling(P219 Umar Ma'afai Kilege, P208 Princess Aysha Rani Kilege) plus parent(P219 Umar Ma'afai Kilege, child) yields inferred aunt/uncle-line kin between P208 Princess Aysha Rani Kilege and P60 Mohamed (Singa Bavana).
4. Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.
- Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P208 Princess Aysha Rani Kilege and P60 Mohamed (Singa Bavana) as kin (aunt/uncle↔niece/nephew).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-ROYALARK-MALDIVES` (RoyalArk Maldives — Complete Genealogical Database (segments 3-16))
- Primary inferred claim row: CLM-0509
- Inferred claim locator: Inference basis documented in docs/research-program/inferences/kin-p208-p60-aunt-uncle-niece-nephew.md.

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

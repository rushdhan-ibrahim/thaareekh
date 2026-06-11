# Inference Dossier

Edge key: `kin|P90|P95|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P90 Mohamed Imaduddine V (Keerithi Maha Radun)
- Target node: P95 Mohamed Farid (Keerithi Maha Radun)
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P90 Mohamed Imaduddine V (Keerithi Maha Radun) and P95 Mohamed Farid (Keerithi Maha Radun) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Huraagey -> Huraagey
- Rule basis status: resolved (1 supporting edge).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle resolved as follows.
2. Supporting edge: parent P129 Princess Veyogey Dhon Goma -> P95 Mohamed Farid (Keerithi Maha Radun) (CLM-0262, SRC-WIKI-MUHAMMAD-FAREED, grade B); excerpt: Muhammad Fareed Didi family/genealogy content lists P129 Princess Veyogey Dhon Goma as parent of P95 Mohamed Farid.
3. Rule application (parent-sibling-aunt-uncle): sibling(P129 Princess Veyogey Dhon Goma, P90 Mohamed Imaduddine V (Keerithi Maha Radun)) plus parent(P129 Princess Veyogey Dhon Goma, child) yields inferred aunt/uncle-line kin between P90 Mohamed Imaduddine V (Keerithi Maha Radun) and P95 Mohamed Farid (Keerithi Maha Radun).
4. Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.
- Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P90 Mohamed Imaduddine V (Keerithi Maha Radun) and P95 Mohamed Farid (Keerithi Maha Radun) as kin (aunt/uncle↔niece/nephew).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-WIKI-MUHAMMAD-FAREED` (Muhammad Fareed Didi)
- Primary inferred claim row: CLM-0217
- Inferred claim locator: Inference basis: parent-sibling-aunt-uncle (see docs/research-program/inferences/kin-p90-p95-aunt-uncle-niece-nephew.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

# Inference Dossier

Edge key: `kin|P211|P96|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-10`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P211 Dona Leonor de Malvidas
- Target node: P96 Donna Ines
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P211 Dona Leonor de Malvidas and P96 Donna Ines are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle resolved as follows.
2. Supporting edge: parent P66 Joao’ (Keerithi Maha Radun) -> P96 Donna Ines (CLM-0349, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P66 Joao’ as parent of P96 Donna Ines.
3. Supporting edge: sibling P211 Dona Leonor de Malvidas <-> P66 Joao’ (Keerithi Maha Radun) [siblings (same parents: Dom Manoel + Dona Leonor)] (CLM-0630, SRC-ROYALARK-M16, grade B); excerpt: Direct sibling (siblings (same parents: Dom Manoel + Dona Leonor)) relation recorded between Dona Leonor de Malvidas and Joao’.
4. Rule application (parent-sibling-aunt-uncle): sibling(P66 Joao’ (Keerithi Maha Radun), P211 Dona Leonor de Malvidas) plus parent(P66 Joao’ (Keerithi Maha Radun), child) yields inferred aunt/uncle-line kin between P211 Dona Leonor de Malvidas and P96 Donna Ines.
5. Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.
- Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P211 Dona Leonor de Malvidas and P96 Donna Ines as kin (aunt/uncle↔niece/nephew).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-KINGS` (Maldives Kings List)
- `SRC-ROYALARK-M16` (RoyalArk: Maldive Islands - Huraa’gey Dynasty (late period))
- Primary inferred claim row: CLM-0528
- Inferred claim locator: Inference basis documented in docs/research-program/inferences/kin-p211-p96-aunt-uncle-niece-nephew.md.

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

# Inference Dossier

Edge key: `kin|P210|P213|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P210 Dom Pedro de Malvidas
- Target node: P213 Infanta Dona Ines de Malvidas
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P210 Dom Pedro de Malvidas and P213 Infanta Dona Ines de Malvidas are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle resolved as follows.
2. Supporting edge: parent P66 Joao’ (Keerithi Maha Radun) -> P213 Infanta Dona Ines de Malvidas (CLM-0609, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry under Dom Joao lists Infanta Dona Ines de Malvidas as daughter of Dom Joao and Dona Francisca de Vasconcelos.
3. Supporting edge: sibling P210 Dom Pedro de Malvidas <-> P66 Joao’ (Keerithi Maha Radun) [brothers (same parents: Dom Manoel + Dona Leonor)] (CLM-0628, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry lists Dom Joao and Dom Pedro as sons in the same Dom Manoel and Dona Leonor de Ataide sibling set.
4. Rule application (parent-sibling-aunt-uncle): sibling(P66 Joao’ (Keerithi Maha Radun), P210 Dom Pedro de Malvidas) plus parent(P66 Joao’ (Keerithi Maha Radun), child) yields inferred aunt/uncle-line kin between P210 Dom Pedro de Malvidas and P213 Infanta Dona Ines de Malvidas.
5. Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.
- Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P210 Dom Pedro de Malvidas and P213 Infanta Dona Ines de Malvidas as kin (aunt/uncle↔niece/nephew).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-ROYALARK-M16` (RoyalArk: Maldive Islands - Huraa’gey Dynasty (late period))
- Primary inferred claim row: CLM-0517
- Inferred claim locator: Inference basis documented in docs/research-program/inferences/kin-p210-p213-aunt-uncle-niece-nephew.md.

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

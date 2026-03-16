# Inference Dossier

Edge key: `sibling|P209|P210|siblings (shared parent)`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: sibling
- Source node: P209 Dom Francisco de Malvidas
- Target node: P210 Dom Pedro de Malvidas
- Label: siblings (shared parent)
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P209 Dom Francisco de Malvidas and P210 Dom Pedro de Malvidas are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule shared-parent-sibling resolved as follows.
2. Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P209 Dom Francisco de Malvidas (CLM-0605, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry under Dom Manoel lists Dom Francisco de Malvidas among the children of Dom Manoel and Dona Leonor de Ataide.
3. Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P210 Dom Pedro de Malvidas (CLM-0606, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry under Dom Manoel lists Dom Pedro de Malvidas among the children of Dom Manoel and Dona Leonor de Ataide.
4. Rule application (shared-parent-sibling): because both endpoints share parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka), P209 Dom Francisco de Malvidas and P210 Dom Pedro de Malvidas are modeled as inferred sibling-line kin.
5. Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: half-sibling or cousin if one supporting parent edge is revised.
- Contradiction trigger: direct sources assigning a different parent to one endpoint.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P209 Dom Francisco de Malvidas and P210 Dom Pedro de Malvidas as sibling (siblings (shared parent)).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-ROYALARK-M16` (RoyalArk: Maldive Islands - Huraa’gey Dynasty (late period))
- Primary inferred claim row: CLM-0622
- Inferred claim locator: Inference basis documented in docs/research-program/inferences/sibling-p209-p210-siblings-shared-parent.md.

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

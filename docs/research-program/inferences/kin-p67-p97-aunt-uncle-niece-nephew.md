# Inference Dossier

Edge key: `kin|P67|P97|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P67 Philippe’ (Keerithi Maha Radun)
- Target node: P97 Dom Luis de Sousa
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P67 Philippe’ (Keerithi Maha Radun) and P97 Dom Luis de Sousa are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle resolved as follows.
2. Supporting edge: parent P213 Infanta Dona Ines de Malvidas -> P97 Dom Luis de Sousa (CLM-0580, SRC-ROYALARK-M16, grade A); excerpt: Direct parent relation recorded between Infanta Dona Ines de Malvidas as parent of Dom Luis de Sousa.
3. Supporting edge: sibling P213 Infanta Dona Ines de Malvidas <-> P67 Philippe’ (Keerithi Maha Radun) [siblings (same parents: Dom Joao + Dona Francisca)] (CLM-0632, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry for Dom Joao and Dona Francisca lists both Dom Felipe (P67) and Infanta Dona Ines (P213), supporting a direct sibling relation.
4. Rule application (parent-sibling-aunt-uncle): sibling(P213 Infanta Dona Ines de Malvidas, P67 Philippe’ (Keerithi Maha Radun)) plus parent(P213 Infanta Dona Ines de Malvidas, child) yields inferred aunt/uncle-line kin between P67 Philippe’ (Keerithi Maha Radun) and P97 Dom Luis de Sousa.
5. Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.
- Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P67 Philippe’ (Keerithi Maha Radun) and P97 Dom Luis de Sousa as kin (aunt/uncle↔niece/nephew).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-ROYALARK-M16` (RoyalArk: Maldive Islands - Huraa’gey Dynasty (late period))
- Primary inferred claim row: CLM-0187
- Inferred claim locator: Inference basis: parent-sibling-aunt-uncle (see docs/research-program/inferences/kin-p67-p97-aunt-uncle-niece-nephew.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

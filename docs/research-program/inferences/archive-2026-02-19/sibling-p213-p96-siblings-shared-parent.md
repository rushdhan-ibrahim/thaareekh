# Inference Dossier

Edge key: `sibling|P213|P96|siblings (shared parent)`  
Last updated: `2026-02-10`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: sibling
- Source node: P213 Infanta Dona Ines de Malvidas
- Target node: P96 Donna Ines
- Label: siblings (shared parent)
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P213 Infanta Dona Ines de Malvidas and P96 Donna Ines are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule shared-parent-sibling resolved as follows.
2. Supporting edge: parent P66 Joao’ (Keerithi Maha Radun) -> P213 Infanta Dona Ines de Malvidas (CLM-0609, SRC-ROYALARK-M16, grade A); excerpt: Direct parent relation recorded between Joao’ as parent of Infanta Dona Ines de Malvidas.
3. Supporting edge: parent P66 Joao’ (Keerithi Maha Radun) -> P96 Donna Ines (CLM-0349, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P66 Joao’ as parent of P96 Donna Ines.
4. Rule application (shared-parent-sibling): because both endpoints share parent P66 Joao’ (Keerithi Maha Radun), P213 Infanta Dona Ines de Malvidas and P96 Donna Ines are modeled as inferred sibling-line kin.
5. Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: half-sibling or cousin if one supporting parent edge is revised.
- Contradiction trigger: direct sources assigning a different parent to one endpoint.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P213 Infanta Dona Ines de Malvidas and P96 Donna Ines as sibling (siblings (shared parent)).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-ROYALARK-M16` (RoyalArk: Maldive Islands - Huraa’gey Dynasty (late period))
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0633
- Inferred claim locator: Inference basis documented in docs/research-program/inferences/sibling-p213-p96-siblings-shared-parent.md.

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

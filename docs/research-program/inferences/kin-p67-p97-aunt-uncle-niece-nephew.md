# Inference Dossier

Edge key: `kin|P67|P97|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-08`  
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
2. Supporting edge: parent P96 Donna Ines -> P97 Dom Luis de Sousa (CLM-0368, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P96 Donna Ines as parent of P97 Dom Luis de Sousa.
3. Supporting edge: sibling P67 Philippe’ (Keerithi Maha Radun) <-> P96 Donna Ines [siblings] (CLM-0445, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content links P67 Philippe’ and P96 Donna Ines as siblings (siblings).
4. Rule application (parent-sibling-aunt-uncle): sibling(P96 Donna Ines, P67 Philippe’ (Keerithi Maha Radun)) plus parent(P96 Donna Ines, child) yields inferred aunt/uncle-line kin between P67 Philippe’ (Keerithi Maha Radun) and P97 Dom Luis de Sousa.
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
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0187
- Inferred claim locator: Inference basis: parent-sibling-aunt-uncle (see docs/research-program/inferences/kin-p67-p97-aunt-uncle-niece-nephew.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

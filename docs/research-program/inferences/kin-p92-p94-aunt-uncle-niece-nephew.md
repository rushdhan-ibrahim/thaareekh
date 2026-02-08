# Inference Dossier

Edge key: `kin|P92|P94|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-08`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P92 Mohamed Imaduddine VI (Keerithi Maha Radun)
- Target node: P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka)
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P92 Mohamed Imaduddine VI (Keerithi Maha Radun) and P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Huraagey -> Huraagey
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle resolved as follows.
2. Supporting edge: parent P88 Mohamed Mueenuddine (Keerithi Maha Radun) -> P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka) (CLM-0367, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P88 Mohamed Mueenuddine as parent of P94 Hassan Nooredine II.
3. Supporting edge: sibling P88 Mohamed Mueenuddine (Keerithi Maha Radun) <-> P92 Mohamed Imaduddine VI (Keerithi Maha Radun) [half-brothers (same father)] (CLM-0449, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P88 Mohamed Mueenuddine and P92 Mohamed Imaduddine VI as siblings (half-brothers (same father)).
4. Rule application (parent-sibling-aunt-uncle): sibling(P88 Mohamed Mueenuddine (Keerithi Maha Radun), P92 Mohamed Imaduddine VI (Keerithi Maha Radun)) plus parent(P88 Mohamed Mueenuddine (Keerithi Maha Radun), child) yields inferred aunt/uncle-line kin between P92 Mohamed Imaduddine VI (Keerithi Maha Radun) and P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka).
5. Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.
- Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P92 Mohamed Imaduddine VI (Keerithi Maha Radun) and P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka) as kin (aunt/uncle↔niece/nephew).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0220
- Inferred claim locator: Inference basis: parent-sibling-aunt-uncle (see docs/research-program/inferences/kin-p92-p94-aunt-uncle-niece-nephew.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

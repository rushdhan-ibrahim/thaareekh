# Inference Dossier

Edge key: `kin|P60|P66|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-10`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P60 Mohamed (Singa Bavana)
- Target node: P66 Joao’ (Keerithi Maha Radun)
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P60 Mohamed (Singa Bavana) and P66 Joao’ (Keerithi Maha Radun) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle resolved as follows.
2. Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P66 Joao’ (Keerithi Maha Radun) (CLM-0347, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P61 Hassan IX / Dom Manoel as parent of P66 Joao’.
3. Supporting edge: sibling P60 Mohamed (Singa Bavana) <-> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) [half-brothers (maternal, same mother Golavehi Aisha Rani Kilege)] (CLM-0640, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct sibling (half-brothers (maternal, same mother Golavehi Aisha Rani Kilege)) relation recorded between Mohamed and Hassan IX / Dom Manoel.
4. Rule application (parent-sibling-aunt-uncle): sibling(P61 Hassan IX / Dom Manoel (Dhirikusa Loka), P60 Mohamed (Singa Bavana)) plus parent(P61 Hassan IX / Dom Manoel (Dhirikusa Loka), child) yields inferred aunt/uncle-line kin between P60 Mohamed (Singa Bavana) and P66 Joao’ (Keerithi Maha Radun).
5. Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.
- Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P60 Mohamed (Singa Bavana) and P66 Joao’ (Keerithi Maha Radun) as kin (aunt/uncle↔niece/nephew).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-KINGS` (Maldives Kings List)
- `SRC-ROYALARK-MALDIVES` (RoyalArk Maldives — Complete Genealogical Database (segments 3-16))
- Primary inferred claim row: CLM-0181
- Inferred claim locator: Inference basis: parent-sibling-aunt-uncle (see docs/research-program/inferences/kin-p60-p66-aunt-uncle-niece-nephew.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

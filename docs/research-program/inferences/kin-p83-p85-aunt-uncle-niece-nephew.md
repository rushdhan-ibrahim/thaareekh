# Inference Dossier

Edge key: `kin|P83|P85|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P83 Mohamed Muizzuddine (Keerithi Maha Radun)
- Target node: P85 Mohamed Mueenuddine (Keerithi Maha Radun)
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P83 Mohamed Muizzuddine (Keerithi Maha Radun) and P85 Mohamed Mueenuddine (Keerithi Maha Radun) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Huraagey -> Huraagey
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle resolved as follows.
2. Supporting edge: parent P84 Hassan Nooredine (Keerithi Maha Radun) -> P85 Mohamed Mueenuddine (Keerithi Maha Radun) (CLM-0360, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P84 Hassan Nooredine as parent of P85 Mohamed Mueenuddine.
3. Supporting edge: sibling P83 Mohamed Muizzuddine (Keerithi Maha Radun) <-> P84 Hassan Nooredine (Keerithi Maha Radun) [brothers] (CLM-0448, SRC-WIKI-MONARCHS, grade B); excerpt: List of Maldivian monarchs family/genealogy content links P83 Mohamed Muizzuddine and P84 Hassan Nooredine as siblings (brothers).
4. Rule application (parent-sibling-aunt-uncle): sibling(P84 Hassan Nooredine (Keerithi Maha Radun), P83 Mohamed Muizzuddine (Keerithi Maha Radun)) plus parent(P84 Hassan Nooredine (Keerithi Maha Radun), child) yields inferred aunt/uncle-line kin between P83 Mohamed Muizzuddine (Keerithi Maha Radun) and P85 Mohamed Mueenuddine (Keerithi Maha Radun).
5. Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.
- Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P83 Mohamed Muizzuddine (Keerithi Maha Radun) and P85 Mohamed Mueenuddine (Keerithi Maha Radun) as kin (aunt/uncle↔niece/nephew).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-KINGS` (Maldives Kings List)
- `SRC-WIKI-MONARCHS` (List of Maldivian monarchs)
- Primary inferred claim row: CLM-0202
- Inferred claim locator: Inference basis: parent-sibling-aunt-uncle (see docs/research-program/inferences/kin-p83-p85-aunt-uncle-niece-nephew.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

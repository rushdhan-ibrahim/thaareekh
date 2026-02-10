# Inference Dossier

Edge key: `kin|P176|P178|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-10`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P176 Fathimath Saudha
- Target node: P178 Umair Muizzu
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P176 Fathimath Saudha and P178 Umair Muizzu are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Modern -> Modern
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle resolved as follows.
2. Supporting edge: parent P172 Mohamed Muizzu -> P178 Umair Muizzu (CLM-0309, SRC-WIKI-MUIZZU, grade B); excerpt: Wikipedia raw infobox issue field lists Umair Muizzu as child of Mohamed Muizzu. (pair: P172 Mohamed Muizzu -> P178 Umair Muizzu).
3. Supporting edge: sibling P172 Mohamed Muizzu <-> P176 Fathimath Saudha [siblings] (CLM-0413, SRC-WIKI-FATHIMATH-SAUDHA, grade B); excerpt: Fathimath Saudha family/genealogy content links P172 Mohamed Muizzu and P176 Fathimath Saudha as siblings (siblings).
4. Rule application (parent-sibling-aunt-uncle): sibling(P172 Mohamed Muizzu, P176 Fathimath Saudha) plus parent(P172 Mohamed Muizzu, child) yields inferred aunt/uncle-line kin between P176 Fathimath Saudha and P178 Umair Muizzu.
5. Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.
- Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P176 Fathimath Saudha and P178 Umair Muizzu as kin (aunt/uncle↔niece/nephew).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-WIKI-MUIZZU` (Mohamed Muizzu)
- `SRC-WIKI-FATHIMATH-SAUDHA` (Fathimath Saudha)
- Primary inferred claim row: CLM-0114
- Inferred claim locator: Inference basis: parent-sibling-aunt-uncle (see docs/research-program/inferences/kin-p176-p178-aunt-uncle-niece-nephew.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

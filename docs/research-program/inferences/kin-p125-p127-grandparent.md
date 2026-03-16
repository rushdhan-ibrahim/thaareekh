# Inference Dossier

Edge key: `kin|P127|P125|grandparent`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P127 Abdul Sattar Umar
- Target node: P125 Meera Laila Nasheed
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P127 Abdul Sattar Umar and P125 Meera Laila Nasheed are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Modern -> Modern
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P127 Abdul Sattar Umar -> P122 Mohamed Nasheed (CLM-0258, SRC-ATOLL-NASHEED-PARENTS, grade B); excerpt: Atoll Times report names Mohamed Nasheed’s father as Abdul Sattar Umar. (pair: P127 Abdul Sattar Umar -> P122 Mohamed Nasheed).
3. Supporting edge: parent P122 Mohamed Nasheed -> P125 Meera Laila Nasheed (CLM-0254, SRC-WIKI-NASHEED, grade B); excerpt: Wikipedia raw infobox issue field lists Meera Laila Nasheed as child of Mohamed Nasheed. (pair: P122 Mohamed Nasheed -> P125 Meera Laila Nasheed).
4. Rule application (parent-of-parent-grandparent): with source -> P122 Mohamed Nasheed and P122 Mohamed Nasheed -> target parent links, P127 Abdul Sattar Umar is modeled as inferred grandparent-line kin of P125 Meera Laila Nasheed.
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P127 Abdul Sattar Umar and P125 Meera Laila Nasheed as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-ATOLL-NASHEED-PARENTS` (Nasheed's parents sign up to The Democrats)
- `SRC-WIKI-NASHEED` (Mohamed Nasheed)
- Primary inferred claim row: CLM-0050
- Inferred claim locator: Inference basis: parent-of-parent-grandparent (see docs/research-program/inferences/kin-p125-p127-grandparent.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

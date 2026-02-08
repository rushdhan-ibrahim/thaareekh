# Inference Dossier

Edge key: `kin|P155|P94|grandparent`  
Last updated: `2026-02-08`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P155 Maandhoogey Bodu Dhorhy Manippulu
- Target node: P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka)
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P155 Maandhoogey Bodu Dhorhy Manippulu and P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Huraagey -> Huraagey
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P155 Maandhoogey Bodu Dhorhy Manippulu -> P88 Mohamed Mueenuddine (Keerithi Maha Radun) (CLM-0288, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P155 Maandhoogey Bodu Dhorhy Manippulu as parent of P88 Mohamed Mueenuddine.
3. Supporting edge: parent P88 Mohamed Mueenuddine (Keerithi Maha Radun) -> P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka) (CLM-0367, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P88 Mohamed Mueenuddine as parent of P94 Hassan Nooredine II.
4. Rule application (parent-of-parent-grandparent): with source -> P88 Mohamed Mueenuddine (Keerithi Maha Radun) and P88 Mohamed Mueenuddine (Keerithi Maha Radun) -> target parent links, P155 Maandhoogey Bodu Dhorhy Manippulu is modeled as inferred grandparent-line kin of P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka).
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P155 Maandhoogey Bodu Dhorhy Manippulu and P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka) as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0099
- Inferred claim locator: Inference basis: parent-of-parent-grandparent (see docs/research-program/inferences/kin-p155-p94-grandparent.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

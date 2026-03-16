# Inference Dossier

Edge key: `kin|P222|P94|grandparent`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P222 Hassan Izz ud-din
- Target node: P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka)
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P222 Hassan Izz ud-din and P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Huraagey -> Huraagey
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P222 Hassan Izz ud-din -> P88 Mohamed Mueenuddine (Keerithi Maha Radun) (CLM-0591, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Hassan Izz ud-din as parent of Mohamed Mueenuddine.
3. Supporting edge: parent P88 Mohamed Mueenuddine (Keerithi Maha Radun) -> P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka) (CLM-0367, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P88 Mohamed Mueenuddine as parent of P94 Hassan Nooredine II.
4. Rule application (parent-of-parent-grandparent): with source -> P88 Mohamed Mueenuddine (Keerithi Maha Radun) and P88 Mohamed Mueenuddine (Keerithi Maha Radun) -> target parent links, P222 Hassan Izz ud-din is modeled as inferred grandparent-line kin of P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka).
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P222 Hassan Izz ud-din and P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka) as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-ROYALARK-MALDIVES` (RoyalArk Maldives — Complete Genealogical Database (segments 3-16))
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0557
- Inferred claim locator: Inference basis documented in docs/research-program/inferences/kin-p222-p94-grandparent.md.

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

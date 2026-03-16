# Inference Dossier

Edge key: `kin|P55|P50|cousins`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P55 Hassan (Singa Veeru)
- Target node: P50 Ibrahim (Bavana Furasuddha)
- Label: cousins
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P55 Hassan (Singa Veeru) and P50 Ibrahim (Bavana Furasuddha) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (3 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule children-of-siblings-cousin resolved as follows.
2. Supporting edge: parent P52 Yoosuf (Veeru Aanandha) -> P55 Hassan (Singa Veeru) (CLM-0346, SRC-MRF-KINGS, grade B); excerpt: Direct parent relation recorded in the supporting source lane.
3. Supporting edge: parent P47 Hassan (Raadha Aanandha) -> P50 Ibrahim (Bavana Furasuddha) (CLM-0601, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded in the supporting source lane.
4. Supporting edge: sibling P47 Hassan (Raadha Aanandha) <-> P52 Yoosuf (Veeru Aanandha) [brothers] (CLM-0435, SRC-MRF-KINGS, grade C inferred); excerpt: Sibling relation for the two parents recorded in the supporting source lane.
5. Rule application (children-of-siblings-cousin): children of sibling parents P52 Yoosuf (Veeru Aanandha) and P47 Hassan (Raadha Aanandha) are modeled as inferred cousin-line kin (P55 Hassan (Singa Veeru) <-> P50 Ibrahim (Bavana Furasuddha)).
6. Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: aunt/uncle-line relation if one parent-generation anchor is revised.
- Contradiction trigger: source-backed revision of either parent edge or the parent-sibling edge used in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P55 Hassan (Singa Veeru) and P50 Ibrahim (Bavana Furasuddha) as kin (cousins).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-KINGS` (Maldives Kings List)
- `SRC-ROYALARK-MALDIVES` (RoyalArk Maldives — Complete Genealogical Database (segments 3-16))
- Primary inferred claim row: CLM-0660
- Inferred claim locator: Inference basis documented in docs/research-program/inferences/kin-p50-p55-cousins.md.

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

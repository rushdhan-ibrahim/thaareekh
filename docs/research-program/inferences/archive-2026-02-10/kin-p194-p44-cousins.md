# Inference Dossier

Edge key: `kin|P194|P44|cousins`  
Last updated: `2026-02-08`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P194 Burecca
- Target node: P44 Mohamed (Bavana Abarana)
- Label: cousins
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P194 Burecca and P44 Mohamed (Bavana Abarana) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule children-of-siblings-cousin resolved as follows.
2. Supporting edge: parent P41 Hadi Hassan (Raadha Veeru) -> P44 Mohamed (Bavana Abarana) (CLM-0339, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P41 Hadi Hassan as parent of P44 Mohamed.
3. Supporting edge: parent P193 Princess Recca -> P194 Burecca (CLM-0327, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P193 Princess Recca as parent of P194 Burecca.
4. Rule application (children-of-siblings-cousin): children of sibling parents P41 Hadi Hassan (Raadha Veeru) and P193 Princess Recca are modeled as inferred cousin-line kin (P194 Burecca <-> P44 Mohamed (Bavana Abarana)).
5. Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: more distant collateral kin if parent-sibling linkage weakens.
- Contradiction trigger: changes to either child-parent edge or the parent-sibling edge.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P194 Burecca and P44 Mohamed (Bavana Abarana) as kin (cousins).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0137
- Inferred claim locator: Inference basis: children-of-siblings-cousin (see docs/research-program/inferences/kin-p194-p44-cousins.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

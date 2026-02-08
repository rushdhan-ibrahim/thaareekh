# Inference Dossier

Edge key: `kin|P90|P92|cousins`  
Last updated: `2026-02-08`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P90 Mohamed Imaduddine V (Keerithi Maha Radun)
- Target node: P92 Mohamed Imaduddine VI (Keerithi Maha Radun)
- Label: cousins
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P90 Mohamed Imaduddine V (Keerithi Maha Radun) and P92 Mohamed Imaduddine VI (Keerithi Maha Radun) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.
- Historical/dynastic context: Huraagey -> Huraagey
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule children-of-siblings-cousin resolved as follows.
2. Supporting edge: parent P87 Ibrahim Nooredine (Keerithi Maha Radun) -> P90 Mohamed Imaduddine V (Keerithi Maha Radun) (CLM-0365, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P87 Ibrahim Nooredine as parent of P90 Mohamed Imaduddine V.
3. Supporting edge: parent P155 Maandhoogey Bodu Dhorhy Manippulu -> P92 Mohamed Imaduddine VI (Keerithi Maha Radun) (CLM-0289, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P155 Maandhoogey Bodu Dhorhy Manippulu as parent of P92 Mohamed Imaduddine VI.
4. Rule application (children-of-siblings-cousin): children of sibling parents P87 Ibrahim Nooredine (Keerithi Maha Radun) and P155 Maandhoogey Bodu Dhorhy Manippulu are modeled as inferred cousin-line kin (P90 Mohamed Imaduddine V (Keerithi Maha Radun) <-> P92 Mohamed Imaduddine VI (Keerithi Maha Radun)).
5. Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: more distant collateral kin if parent-sibling linkage weakens.
- Contradiction trigger: changes to either child-parent edge or the parent-sibling edge.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P90 Mohamed Imaduddine V (Keerithi Maha Radun) and P92 Mohamed Imaduddine VI (Keerithi Maha Radun) as kin (cousins).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0216
- Inferred claim locator: Inference basis: children-of-siblings-cousin (see docs/research-program/inferences/kin-p90-p92-cousins.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

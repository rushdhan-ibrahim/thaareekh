# Inference Dossier

Edge key: `kin|P208|P55|cousins`  
Last updated: `2026-02-10`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P208 Princess Aysha Rani Kilege
- Target node: P55 Hassan (Singa Veeru)
- Label: cousins
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P208 Princess Aysha Rani Kilege and P55 Hassan (Singa Veeru) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (3 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule children-of-siblings-cousin resolved as follows.
2. Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P208 Princess Aysha Rani Kilege (CLM-0602, SRC-MRF-KINGS, grade B); excerpt: Direct parent relation recorded between Kalu Mohamed as parent of Princess Aysha Rani Kilege.
3. Supporting edge: parent P52 Yoosuf (Veeru Aanandha) -> P55 Hassan (Singa Veeru) (CLM-0346, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P52 Yoosuf as parent of P55 Hassan.
4. Supporting edge: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P52 Yoosuf (Veeru Aanandha) [brothers] (CLM-0441, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P51 Kalu Mohamed and P52 Yoosuf as siblings (brothers).
5. Rule application (children-of-siblings-cousin): children of sibling parents P51 Kalu Mohamed (Dhammaru Bavana) and P52 Yoosuf (Veeru Aanandha) are modeled as inferred cousin-line kin (P208 Princess Aysha Rani Kilege <-> P55 Hassan (Singa Veeru)).
6. Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: more distant collateral kin if parent-sibling linkage weakens.
- Contradiction trigger: changes to either child-parent edge or the parent-sibling edge.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P208 Princess Aysha Rani Kilege and P55 Hassan (Singa Veeru) as kin (cousins).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0508
- Inferred claim locator: Inference basis documented in docs/research-program/inferences/kin-p208-p55-cousins.md.

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

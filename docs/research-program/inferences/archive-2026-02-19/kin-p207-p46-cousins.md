# Inference Dossier

Edge key: `kin|P46|P207|cousins`  
Last updated: `2026-02-10`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P46 Omar (Loka Sundhura)
- Target node: P207 Recca
- Label: cousins
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P46 Omar (Loka Sundhura) and P207 Recca are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (3 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule children-of-siblings-cousin resolved as follows.
2. Supporting edge: parent P39 Yoosuf (Loka Aananadha) -> P46 Omar (Loka Sundhura) (CLM-0336, SRC-MRF-KINGS, grade B); excerpt: Kings list records parent edge P39 to P46.
3. Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P207 Recca (CLM-0598, SRC-MRF-HILAALY, grade B); excerpt: Direct parent relation recorded between Aboobakuru as parent of Recca.
4. Supporting edge: sibling P39 Yoosuf (Loka Aananadha) <-> P40 Aboobakuru (Bavana Sooja) [half-brothers] (CLM-0432, SRC-MRF-KINGS, grade B); excerpt: Kings list marks P39 and P40 as half-brothers.
5. Rule application (children-of-siblings-cousin): children of sibling parents P39 Yoosuf (Loka Aananadha) and P40 Aboobakuru (Bavana Sooja) are modeled as inferred cousin-line kin (P46 Omar (Loka Sundhura) <-> P207 Recca).
6. Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: more distant collateral kin if parent-sibling linkage weakens.
- Contradiction trigger: changes to either child-parent edge or the parent-sibling edge.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P46 Omar (Loka Sundhura) and P207 Recca as kin (cousins).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-KINGS` (Maldives Kings List)
- `SRC-MRF-HILAALY` (Royal House of Hilaaly)
- Primary inferred claim row: CLM-0502
- Inferred claim locator: Inference basis documented in docs/research-program/inferences/kin-p207-p46-cousins.md.

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

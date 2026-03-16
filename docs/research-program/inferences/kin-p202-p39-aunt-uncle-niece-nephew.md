# Inference Dossier

Edge key: `kin|P39|P202|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P39 Yoosuf (Loka Aananadha)
- Target node: P202 Kamba Dio
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P39 Yoosuf (Loka Aananadha) and P202 Kamba Dio are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle resolved as follows.
2. Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P202 Kamba Dio (CLM-0597, SRC-MRF-HILAALY, grade B); excerpt: Direct parent relation recorded between Aboobakuru as parent of Kamba Dio.
3. Supporting edge: sibling P39 Yoosuf (Loka Aananadha) <-> P40 Aboobakuru (Bavana Sooja) [half-brothers] (CLM-0432, SRC-MRF-KINGS, grade B); excerpt: Kings list marks P39 and P40 as half-brothers.
4. Rule application (parent-sibling-aunt-uncle): sibling(P40 Aboobakuru (Bavana Sooja), P39 Yoosuf (Loka Aananadha)) plus parent(P40 Aboobakuru (Bavana Sooja), child) yields inferred aunt/uncle-line kin between P39 Yoosuf (Loka Aananadha) and P202 Kamba Dio.
5. Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.
- Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P39 Yoosuf (Loka Aananadha) and P202 Kamba Dio as kin (aunt/uncle↔niece/nephew).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-HILAALY` (Royal House of Hilaaly)
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0494
- Inferred claim locator: Inference basis documented in docs/research-program/inferences/kin-p202-p39-aunt-uncle-niece-nephew.md.

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

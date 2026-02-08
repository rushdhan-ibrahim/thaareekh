# Inference Dossier

Edge key: `kin|P30|P41|grandparent`  
Last updated: `2026-02-08`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P30 Hassan (Bavana)
- Target node: P41 Hadi Hassan (Raadha Veeru)
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P30 Hassan (Bavana) and P41 Hadi Hassan (Raadha Veeru) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P30 Hassan (Bavana) -> P40 Aboobakuru (Bavana Sooja) (CLM-0335, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P40 Aboobakuru.
3. Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P41 Hadi Hassan (Raadha Veeru) (CLM-0338, SRC-MRF-KINGS, grade B); excerpt: Kings list records parent edge P40 to P41.
4. Rule application (parent-of-parent-grandparent): with source -> P40 Aboobakuru (Bavana Sooja) and P40 Aboobakuru (Bavana Sooja) -> target parent links, P30 Hassan (Bavana) is modeled as inferred grandparent-line kin of P41 Hadi Hassan (Raadha Veeru).
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P30 Hassan (Bavana) and P41 Hadi Hassan (Raadha Veeru) as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0143
- Inferred claim locator: Inference basis: parent-of-parent-grandparent (see docs/research-program/inferences/kin-p30-p41-grandparent.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

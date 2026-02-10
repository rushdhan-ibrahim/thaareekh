# Inference Dossier

Edge key: `kin|P41|P45|grandparent`  
Last updated: `2026-02-10`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P41 Hadi Hassan (Raadha Veeru)
- Target node: P45 Hassan (Raadha Loka)
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P41 Hadi Hassan (Raadha Veeru) and P45 Hassan (Raadha Loka) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P41 Hadi Hassan (Raadha Veeru) -> P44 Mohamed (Bavana Abarana) (CLM-0339, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P41 Hadi Hassan as parent of P44 Mohamed.
3. Supporting edge: parent P44 Mohamed (Bavana Abarana) -> P45 Hassan (Raadha Loka) (CLM-0340, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P44 Mohamed as parent of P45 Hassan.
4. Rule application (parent-of-parent-grandparent): with source -> P44 Mohamed (Bavana Abarana) and P44 Mohamed (Bavana Abarana) -> target parent links, P41 Hadi Hassan (Raadha Veeru) is modeled as inferred grandparent-line kin of P45 Hassan (Raadha Loka).
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P41 Hadi Hassan (Raadha Veeru) and P45 Hassan (Raadha Loka) as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0163
- Inferred claim locator: Inference basis: parent-of-parent-grandparent (see docs/research-program/inferences/kin-p41-p45-grandparent.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

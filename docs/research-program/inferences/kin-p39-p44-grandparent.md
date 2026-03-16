# Inference Dossier

Edge key: `kin|P39|P44|grandparent`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P39 Yoosuf (Loka Aananadha)
- Target node: P44 Mohamed (Bavana Abarana)
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P39 Yoosuf (Loka Aananadha) and P44 Mohamed (Bavana Abarana) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P39 Yoosuf (Loka Aananadha) -> P41 Hadi Hassan (Raadha Veeru) (CLM-0596, SRC-ROYALARK-MALDIVES, grade B); excerpt: RoyalArk Maldives lineage reconstruction gives Yoosuf (P39) as father of Hadi Hassan (P41), which aligns with current canonical parent selection.
3. Supporting edge: parent P41 Hadi Hassan (Raadha Veeru) -> P44 Mohamed (Bavana Abarana) (CLM-0339, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P41 Hadi Hassan as parent of P44 Mohamed.
4. Rule application (parent-of-parent-grandparent): with source -> P41 Hadi Hassan (Raadha Veeru) and P41 Hadi Hassan (Raadha Veeru) -> target parent links, P39 Yoosuf (Loka Aananadha) is modeled as inferred grandparent-line kin of P44 Mohamed (Bavana Abarana).
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P39 Yoosuf (Loka Aananadha) and P44 Mohamed (Bavana Abarana) as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-ROYALARK-MALDIVES` (RoyalArk Maldives — Complete Genealogical Database (segments 3-16))
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0558
- Inferred claim locator: Inference basis documented in docs/research-program/inferences/kin-p39-p44-grandparent.md.

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

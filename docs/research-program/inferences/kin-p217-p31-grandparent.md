# Inference Dossier

Edge key: `kin|P217|P31|grandparent`  
Last updated: `2026-02-10`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P217 Dori Kuja
- Target node: P31 Ibrahim (Dhammaru Veeru)
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P217 Dori Kuja and P31 Ibrahim (Dhammaru Veeru) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P217 Dori Kuja -> P30 Hassan (Bavana) (CLM-0585, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Dori Kuja as parent of Hassan.
3. Supporting edge: parent P30 Hassan (Bavana) -> P31 Ibrahim (Dhammaru Veeru) (CLM-0333, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P31 Ibrahim.
4. Rule application (parent-of-parent-grandparent): with source -> P30 Hassan (Bavana) and P30 Hassan (Bavana) -> target parent links, P217 Dori Kuja is modeled as inferred grandparent-line kin of P31 Ibrahim (Dhammaru Veeru).
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P217 Dori Kuja and P31 Ibrahim (Dhammaru Veeru) as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-ROYALARK-MALDIVES` (RoyalArk Maldives — Complete Genealogical Database (segments 3-16))
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0537
- Inferred claim locator: Inference basis documented in docs/research-program/inferences/kin-p217-p31-grandparent.md.

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

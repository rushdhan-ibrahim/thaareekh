# Inference Dossier

Edge key: `kin|P51|P50|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-10`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P51 Kalu Mohamed (Dhammaru Bavana)
- Target node: P50 Ibrahim (Bavana Furasuddha)
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P51 Kalu Mohamed (Dhammaru Bavana) and P50 Ibrahim (Bavana Furasuddha) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle resolved as follows.
2. Supporting edge: parent P47 Hassan (Raadha Aanandha) -> P50 Ibrahim (Bavana Furasuddha) (CLM-0601, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Hassan as parent of Ibrahim.
3. Supporting edge: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P47 Hassan (Raadha Aanandha) [half-brothers] (CLM-0639, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct sibling (half-brothers) relation recorded between Kalu Mohamed and Hassan.
4. Rule application (parent-sibling-aunt-uncle): sibling(P47 Hassan (Raadha Aanandha), P51 Kalu Mohamed (Dhammaru Bavana)) plus parent(P47 Hassan (Raadha Aanandha), child) yields inferred aunt/uncle-line kin between P51 Kalu Mohamed (Dhammaru Bavana) and P50 Ibrahim (Bavana Furasuddha).
5. Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.
- Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P51 Kalu Mohamed (Dhammaru Bavana) and P50 Ibrahim (Bavana Furasuddha) as kin (aunt/uncle↔niece/nephew).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-ROYALARK-MALDIVES` (RoyalArk Maldives — Complete Genealogical Database (segments 3-16))
- Primary inferred claim row: CLM-0567
- Inferred claim locator: Inference basis documented in docs/research-program/inferences/kin-p50-p51-aunt-uncle-niece-nephew.md.

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

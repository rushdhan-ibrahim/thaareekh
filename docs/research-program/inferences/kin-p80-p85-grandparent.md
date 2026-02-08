# Inference Dossier

Edge key: `kin|P80|P85|grandparent`  
Last updated: `2026-02-08`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P80 Hassan Izzuddine (Kula Ran Meeba Audha)
- Target node: P85 Mohamed Mueenuddine (Keerithi Maha Radun)
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P80 Hassan Izzuddine (Kula Ran Meeba Audha) and P85 Mohamed Mueenuddine (Keerithi Maha Radun) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Huraagey -> Huraagey
- Rule basis status: resolved (1 supporting edge).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P84 Hassan Nooredine (Keerithi Maha Radun) -> P85 Mohamed Mueenuddine (Keerithi Maha Radun) (CLM-0360, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P84 Hassan Nooredine as parent of P85 Mohamed Mueenuddine.
3. Rule application (parent-of-parent-grandparent): with source -> P84 Hassan Nooredine (Keerithi Maha Radun) and P84 Hassan Nooredine (Keerithi Maha Radun) -> target parent links, P80 Hassan Izzuddine (Kula Ran Meeba Audha) is modeled as inferred grandparent-line kin of P85 Mohamed Mueenuddine (Keerithi Maha Radun).
4. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P80 Hassan Izzuddine (Kula Ran Meeba Audha) and P85 Mohamed Mueenuddine (Keerithi Maha Radun) as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0198
- Inferred claim locator: Inference basis: parent-of-parent-grandparent (see docs/research-program/inferences/kin-p80-p85-grandparent.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

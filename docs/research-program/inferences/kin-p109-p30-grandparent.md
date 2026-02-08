# Inference Dossier

Edge key: `kin|P109|P30|grandparent`  
Last updated: `2026-02-08`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P109 Muslim Abbas of Hilaal
- Target node: P30 Hassan (Bavana)
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P109 Muslim Abbas of Hilaal and P30 Hassan (Bavana) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P109 Muslim Abbas of Hilaal -> P108 Kulhiveri Hilaal Kaiulhanna Kaloge (CLM-0231, SRC-MRF-HILAALY, grade B); excerpt: Royal House of Hilaaly family/genealogy content lists P109 Muslim Abbas of Hilaal as parent of P108 Kulhiveri Hilaal Kaiulhanna Kaloge.
3. Supporting edge: parent P108 Kulhiveri Hilaal Kaiulhanna Kaloge -> P30 Hassan (Bavana) (CLM-0230, SRC-MRF-HILAALY, grade B); excerpt: Royal House of Hilaaly family/genealogy content lists P108 Kulhiveri Hilaal Kaiulhanna Kaloge as parent of P30 Hassan.
4. Rule application (parent-of-parent-grandparent): with source -> P108 Kulhiveri Hilaal Kaiulhanna Kaloge and P108 Kulhiveri Hilaal Kaiulhanna Kaloge -> target parent links, P109 Muslim Abbas of Hilaal is modeled as inferred grandparent-line kin of P30 Hassan (Bavana).
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P109 Muslim Abbas of Hilaal and P30 Hassan (Bavana) as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-HILAALY` (Royal House of Hilaaly)
- Primary inferred claim row: CLM-0019
- Inferred claim locator: Inference basis: parent-of-parent-grandparent rule from edge metadata

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

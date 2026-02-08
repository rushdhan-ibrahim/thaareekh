# Inference Dossier

Edge key: `kin|P121|P135|grandparent`  
Last updated: `2026-02-08`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P121 Abdulla Yameen Abdul Gayoom
- Target node: P135 Galolhu Sitti
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P121 Abdulla Yameen Abdul Gayoom and P135 Galolhu Sitti are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Modern -> Addu Line
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P135 Galolhu Sitti -> P120 Abdul Gayoom Ibrahim (CLM-0270, SRC-WIKI-ABDUL-GAYOOM-IBRAHIM, grade B); excerpt: Abdul Gayoom Ibrahim family/genealogy content lists P135 Galolhu Sitti as parent of P120 Abdul Gayoom Ibrahim.
3. Supporting edge: parent P120 Abdul Gayoom Ibrahim -> P121 Abdulla Yameen Abdul Gayoom (CLM-0253, SRC-PO-YAMEEN, grade A); excerpt: Official former-president profile states Abdulla Yameen is son of Abdul Gayoom Ibrahim. (pair: P120 Abdul Gayoom Ibrahim -> P121 Abdulla Yameen Abd...
4. Rule application (parent-of-parent-grandparent): with source -> P120 Abdul Gayoom Ibrahim and P120 Abdul Gayoom Ibrahim -> target parent links, P121 Abdulla Yameen Abdul Gayoom is modeled as inferred grandparent-line kin of P135 Galolhu Sitti.
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P121 Abdulla Yameen Abdul Gayoom and P135 Galolhu Sitti as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-WIKI-ABDUL-GAYOOM-IBRAHIM` (Abdul Gayoom Ibrahim)
- `SRC-PO-YAMEEN` (President Abdulla Yameen Abdul Gayoom)
- Primary inferred claim row: CLM-0044
- Inferred claim locator: Inference basis: parent-of-parent-grandparent (see docs/research-program/inferences/kin-p121-p135-grandparent.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

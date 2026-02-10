# Inference Dossier

Edge key: `kin|P135|P119|grandparent`  
Last updated: `2026-02-10`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P135 Galolhu Sitti
- Target node: P119 Maumoon Abdul Gayoom
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P135 Galolhu Sitti and P119 Maumoon Abdul Gayoom are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Addu Line -> Modern
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P135 Galolhu Sitti -> P120 Abdul Gayoom Ibrahim (CLM-0270, SRC-WIKI-ABDUL-GAYOOM-IBRAHIM, grade B); excerpt: Abdul Gayoom Ibrahim family/genealogy content lists P135 Galolhu Sitti as parent of P120 Abdul Gayoom Ibrahim.
3. Supporting edge: parent P120 Abdul Gayoom Ibrahim -> P119 Maumoon Abdul Gayoom (CLM-0252, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox father field names Abdul Gayoom Ibrahim as father of Maumoon Abdul Gayoom. (pair: P120 Abdul Gayoom Ibrahim -> P119 Maumoon A...
4. Rule application (parent-of-parent-grandparent): with source -> P120 Abdul Gayoom Ibrahim and P120 Abdul Gayoom Ibrahim -> target parent links, P135 Galolhu Sitti is modeled as inferred grandparent-line kin of P119 Maumoon Abdul Gayoom.
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P135 Galolhu Sitti and P119 Maumoon Abdul Gayoom as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-WIKI-ABDUL-GAYOOM-IBRAHIM` (Abdul Gayoom Ibrahim)
- `SRC-WIKI-MAUMOON` (Maumoon Abdul Gayoom)
- Primary inferred claim row: CLM-0038
- Inferred claim locator: Inference basis: parent-of-parent-grandparent (see docs/research-program/inferences/kin-p119-p135-grandparent.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

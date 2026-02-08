# Inference Dossier

Edge key: `kin|P133|P135|grandparent`  
Last updated: `2026-02-08`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P133 Ibrahim Al-Husainee
- Target node: P135 Galolhu Sitti
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P133 Ibrahim Al-Husainee and P135 Galolhu Sitti are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Addu Line -> Addu Line
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P133 Ibrahim Al-Husainee -> P134 Galolhu Seedhi (CLM-0268, SRC-WIKI-ABDUL-GAYOOM-IBRAHIM, grade B); excerpt: Abdul Gayoom Ibrahim family/genealogy content lists P133 Ibrahim Al-Husainee as parent of P134 Galolhu Seedhi.
3. Supporting edge: parent P134 Galolhu Seedhi -> P135 Galolhu Sitti (CLM-0269, SRC-WIKI-ABDUL-GAYOOM-IBRAHIM, grade B); excerpt: Abdul Gayoom Ibrahim family/genealogy content lists P134 Galolhu Seedhi as parent of P135 Galolhu Sitti.
4. Rule application (parent-of-parent-grandparent): with source -> P134 Galolhu Seedhi and P134 Galolhu Seedhi -> target parent links, P133 Ibrahim Al-Husainee is modeled as inferred grandparent-line kin of P135 Galolhu Sitti.
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P133 Ibrahim Al-Husainee and P135 Galolhu Sitti as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-WIKI-ABDUL-GAYOOM-IBRAHIM` (Abdul Gayoom Ibrahim)
- Primary inferred claim row: CLM-0072
- Inferred claim locator: Inference basis: parent-of-parent-grandparent (see docs/research-program/inferences/kin-p133-p135-grandparent.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

# Inference Dossier

Edge key: `kin|P77|P81|grandparent`  
Last updated: `2026-02-08`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P77 Mohamed Imaduddine (Kula Sundhura Siyaaaka)
- Target node: P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi)
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P77 Mohamed Imaduddine (Kula Sundhura Siyaaaka) and P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Dhiyamigili -> Dhiyamigili
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P77 Mohamed Imaduddine (Kula Sundhura Siyaaaka) -> P78 Ibrahim Iskander (Rannava Loka) (CLM-0354, SRC-WIKI-MONARCHS, grade B); excerpt: List of Maldivian monarchs family/genealogy content lists P77 Mohamed Imaduddine as parent of P78 Ibrahim Iskander.
3. Supporting edge: parent P78 Ibrahim Iskander (Rannava Loka) -> P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) (CLM-0356, SRC-WIKI-MONARCHS, grade B); excerpt: List of Maldivian monarchs family/genealogy content lists P78 Ibrahim Iskander as parent of P81 Mohamed Ghiyathuddine.
4. Rule application (parent-of-parent-grandparent): with source -> P78 Ibrahim Iskander (Rannava Loka) and P78 Ibrahim Iskander (Rannava Loka) -> target parent links, P77 Mohamed Imaduddine (Kula Sundhura Siyaaaka) is modeled as inferred grandparent-line kin of P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi).
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P77 Mohamed Imaduddine (Kula Sundhura Siyaaaka) and P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-WIKI-MONARCHS` (List of Maldivian monarchs)
- Primary inferred claim row: CLM-0195
- Inferred claim locator: Inference basis: parent-of-parent-grandparent (see docs/research-program/inferences/kin-p77-p81-grandparent.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

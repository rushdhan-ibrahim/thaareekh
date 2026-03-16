# Inference Dossier

Edge key: `kin|P121|P150|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P121 Abdulla Yameen Abdul Gayoom
- Target node: P150 Dunya Maumoon
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P121 Abdulla Yameen Abdul Gayoom and P150 Dunya Maumoon are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Modern -> Modern
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle resolved as follows.
2. Supporting edge: parent P119 Maumoon Abdul Gayoom -> P150 Dunya Maumoon (CLM-0248, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Dunya Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P150 Dunya Maumoon).
3. Supporting edge: sibling P119 Maumoon Abdul Gayoom <-> P121 Abdulla Yameen Abdul Gayoom [half-brothers] (CLM-0375, SRC-PO-YAMEEN, grade A); excerpt: Official former-president profile identifies Abdulla Yameen as younger brother of former President Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul ...
4. Rule application (parent-sibling-aunt-uncle): sibling(P119 Maumoon Abdul Gayoom, P121 Abdulla Yameen Abdul Gayoom) plus parent(P119 Maumoon Abdul Gayoom, child) yields inferred aunt/uncle-line kin between P121 Abdulla Yameen Abdul Gayoom and P150 Dunya Maumoon.
5. Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.
- Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P121 Abdulla Yameen Abdul Gayoom and P150 Dunya Maumoon as kin (aunt/uncle↔niece/nephew).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-WIKI-MAUMOON` (Maumoon Abdul Gayoom)
- `SRC-PO-YAMEEN` (President Abdulla Yameen Abdul Gayoom)
- Primary inferred claim row: CLM-0045
- Inferred claim locator: Inference basis: parent-sibling-aunt-uncle (see docs/research-program/inferences/kin-p121-p150-aunt-uncle-niece-nephew.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

# Inference Dossier

Edge key: `sibling|P143|P147|siblings (shared parent)`  
Last updated: `2026-02-08`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: sibling
- Source node: P143 Ahmed Nasir
- Target node: P147 Aishath Nasir
- Label: siblings (shared parent)
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P143 Ahmed Nasir and P147 Aishath Nasir are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.
- Historical/dynastic context: Modern -> Modern
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule shared-parent-sibling resolved as follows.
2. Supporting edge: parent P115 Ibrahim Nasir -> P143 Ahmed Nasir (CLM-0239, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ahmed Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P143 Ahmed Nasir).
3. Supporting edge: parent P115 Ibrahim Nasir -> P147 Aishath Nasir (CLM-0243, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Aishath Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P147 Aishath Nasir).
4. Rule application (shared-parent-sibling): because both endpoints share parent P115 Ibrahim Nasir, P143 Ahmed Nasir and P147 Aishath Nasir are modeled as inferred sibling-line kin.
5. Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: half-sibling or cousin if one supporting parent edge is revised.
- Contradiction trigger: direct sources assigning a different parent to one endpoint.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P143 Ahmed Nasir and P147 Aishath Nasir as sibling (siblings (shared parent)).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-WIKI-IBRAHIM-NASIR` (Ibrahim Nasir)
- Primary inferred claim row: CLM-0391
- Inferred claim locator: Inference basis: shared-parent-sibling (see docs/research-program/inferences/sibling-p143-p147-siblings-shared-parent.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

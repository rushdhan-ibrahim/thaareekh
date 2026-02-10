# Inference Dossier

Edge key: `kin|P116|P146|grandparent`  
Last updated: `2026-02-10`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P116 Ahmed Didi
- Target node: P146 Ismail Nasir
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P116 Ahmed Didi and P146 Ismail Nasir are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Modern -> Modern
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P116 Ahmed Didi -> P115 Ibrahim Nasir (CLM-0244, SRC-PO-NASIR, grade A); excerpt: Official former-president profile states Ibrahim Nasir was son of Ahmed Didi and Nayaage Aishath Didi. (pair: P116 Ahmed Didi -> P115 Ibrahim Nasir).
3. Supporting edge: parent P115 Ibrahim Nasir -> P146 Ismail Nasir (CLM-0242, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ismail Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P146 Ismail Nasir).
4. Rule application (parent-of-parent-grandparent): with source -> P115 Ibrahim Nasir and P115 Ibrahim Nasir -> target parent links, P116 Ahmed Didi is modeled as inferred grandparent-line kin of P146 Ismail Nasir.
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P116 Ahmed Didi and P146 Ismail Nasir as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-PO-NASIR` (President Al Ameer Ibrahim Nasir)
- `SRC-WIKI-IBRAHIM-NASIR` (Ibrahim Nasir)
- Primary inferred claim row: CLM-0029
- Inferred claim locator: Inference basis: parent-of-parent-grandparent rule from edge metadata

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

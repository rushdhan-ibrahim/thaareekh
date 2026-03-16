# Inference Dossier

Edge key: `kin|P112|P114|grandparent`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P112 Roanugey Aishath Didi
- Target node: P114 Ameena Mohamed Amin
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P112 Roanugey Aishath Didi and P114 Ameena Mohamed Amin are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Modern -> Modern
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P112 Roanugey Aishath Didi -> P110 Mohamed Amin Didi (CLM-0236, SRC-PO-AMIN, grade A); excerpt: Official former-president profile states Mohamed Amin was born as son of Ahmed Didi and Nayaage Aishath Didi. (pair: P112 Roanugey Aishath Didi -> ...
3. Supporting edge: parent P110 Mohamed Amin Didi -> P114 Ameena Mohamed Amin (CLM-0232, SRC-WIKI-AMIN-DIDI, grade B); excerpt: Mohamed Amin Didi family/genealogy content lists P110 Mohamed Amin Didi as parent of P114 Ameena Mohamed Amin.
4. Rule application (parent-of-parent-grandparent): with source -> P110 Mohamed Amin Didi and P110 Mohamed Amin Didi -> target parent links, P112 Roanugey Aishath Didi is modeled as inferred grandparent-line kin of P114 Ameena Mohamed Amin.
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P112 Roanugey Aishath Didi and P114 Ameena Mohamed Amin as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-PO-AMIN` (President Al Ameer Mohamed Amin)
- `SRC-WIKI-AMIN-DIDI` (Mohamed Amin Didi)
- Primary inferred claim row: CLM-0022
- Inferred claim locator: Inference basis: parent-of-parent-grandparent rule from edge metadata

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

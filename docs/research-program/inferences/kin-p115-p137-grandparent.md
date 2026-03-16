# Inference Dossier

Edge key: `kin|P137|P115|grandparent`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P137 Moosa Didi
- Target node: P115 Ibrahim Nasir
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P137 Moosa Didi and P115 Ibrahim Nasir are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Modern -> Modern
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P137 Moosa Didi -> P117 Nayaage Aishath Didi (CLM-0272, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P137 Moosa Didi as parent of P117 Nayaage Aishath Didi.
3. Supporting edge: parent P117 Nayaage Aishath Didi -> P115 Ibrahim Nasir (CLM-0245, SRC-PO-NASIR, grade A); excerpt: Official former-president profile states Ibrahim Nasir was son of Ahmed Didi and Nayaage Aishath Didi. (pair: P117 Nayaage Aishath Didi -> P115 Ibr...
4. Rule application (parent-of-parent-grandparent): with source -> P117 Nayaage Aishath Didi and P117 Nayaage Aishath Didi -> target parent links, P137 Moosa Didi is modeled as inferred grandparent-line kin of P115 Ibrahim Nasir.
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P137 Moosa Didi and P115 Ibrahim Nasir as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-WIKI-IBRAHIM-NASIR` (Ibrahim Nasir)
- `SRC-PO-NASIR` (President Al Ameer Ibrahim Nasir)
- Primary inferred claim row: CLM-0024
- Inferred claim locator: Inference basis: parent-of-parent-grandparent rule from edge metadata

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

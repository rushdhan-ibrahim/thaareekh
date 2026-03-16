# Inference Dossier

Edge key: `kin|P138|P117|grandparent`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P138 Dhadimagu Ganduvaru Maryam Didi
- Target node: P117 Nayaage Aishath Didi
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P138 Dhadimagu Ganduvaru Maryam Didi and P117 Nayaage Aishath Didi are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Modern -> Modern
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P138 Dhadimagu Ganduvaru Maryam Didi -> P137 Moosa Didi (CLM-0273, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P138 Dhadimagu Ganduvaru Maryam Didi as parent of P137 Moosa Didi.
3. Supporting edge: parent P137 Moosa Didi -> P117 Nayaage Aishath Didi (CLM-0272, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P137 Moosa Didi as parent of P117 Nayaage Aishath Didi.
4. Rule application (parent-of-parent-grandparent): with source -> P137 Moosa Didi and P137 Moosa Didi -> target parent links, P138 Dhadimagu Ganduvaru Maryam Didi is modeled as inferred grandparent-line kin of P117 Nayaage Aishath Didi.
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P138 Dhadimagu Ganduvaru Maryam Didi and P117 Nayaage Aishath Didi as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-WIKI-IBRAHIM-NASIR` (Ibrahim Nasir)
- Primary inferred claim row: CLM-0032
- Inferred claim locator: Inference basis: parent-of-parent-grandparent (see docs/research-program/inferences/kin-p117-p138-grandparent.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

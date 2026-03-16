# Inference Dossier

Edge key: `kin|P130|P183|grandparent`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P130 Prince Ibrahim Faamuladheyri Kilegefaanu
- Target node: P183 Ganduvaru Hassan Didi
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P130 Prince Ibrahim Faamuladheyri Kilegefaanu and P183 Ganduvaru Hassan Didi are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Dhiyamigili -> Addu Line
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P130 Prince Ibrahim Faamuladheyri Kilegefaanu -> P180 Princess Aishath Didi (CLM-0267, SRC-MRF-MIDU-ROYAL, grade B); excerpt: Midu Royal Family Branch (Addu/Meedhoo records) family/genealogy content lists P130 Prince Ibrahim Faamuladheyri Kilegefaanu as parent of P180 Prin...
3. Supporting edge: parent P180 Princess Aishath Didi -> P183 Ganduvaru Hassan Didi (CLM-0319, SRC-MRF-MIDU-ROYAL, grade B); excerpt: Midu Royal Family Branch (Addu/Meedhoo records) family/genealogy content lists P180 Princess Aishath Didi as parent of P183 Ganduvaru Hassan Didi.
4. Rule application (parent-of-parent-grandparent): with source -> P180 Princess Aishath Didi and P180 Princess Aishath Didi -> target parent links, P130 Prince Ibrahim Faamuladheyri Kilegefaanu is modeled as inferred grandparent-line kin of P183 Ganduvaru Hassan Didi.
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P130 Prince Ibrahim Faamuladheyri Kilegefaanu and P183 Ganduvaru Hassan Didi as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-MIDU-ROYAL` (Midu Royal Family Branch (Addu/Meedhoo records))
- Primary inferred claim row: CLM-0065
- Inferred claim locator: Inference basis: parent-of-parent-grandparent (see docs/research-program/inferences/kin-p130-p183-grandparent.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

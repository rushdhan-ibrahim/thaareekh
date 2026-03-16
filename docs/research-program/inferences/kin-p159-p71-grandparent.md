# Inference Dossier

Edge key: `kin|P159|P71|grandparent`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P159 Hussain Faamuladeyri Kilege
- Target node: P71 Mohamed Mohyedine (Naakiree Sundhura)
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P159 Hussain Faamuladeyri Kilege and P71 Mohamed Mohyedine (Naakiree Sundhura) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Utheemu -> Utheemu
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P159 Hussain Faamuladeyri Kilege -> P160 Abu Naibu Hassan Dorhimeyna Kilege (CLM-0293, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P159 Hussain Faamuladeyri Kilege as parent of P160 Abu Naibu Hassan Dorhimeyna Kilege.
3. Supporting edge: parent P160 Abu Naibu Hassan Dorhimeyna Kilege -> P71 Mohamed Mohyedine (Naakiree Sundhura) (CLM-0295, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P160 Abu Naibu Hassan Dorhimeyna Kilege as parent of P71 Mohamed Mohyedine.
4. Rule application (parent-of-parent-grandparent): with source -> P160 Abu Naibu Hassan Dorhimeyna Kilege and P160 Abu Naibu Hassan Dorhimeyna Kilege -> target parent links, P159 Hussain Faamuladeyri Kilege is modeled as inferred grandparent-line kin of P71 Mohamed Mohyedine (Naakiree Sundhura).
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P159 Hussain Faamuladeyri Kilege and P71 Mohamed Mohyedine (Naakiree Sundhura) as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0101
- Inferred claim locator: Inference basis: parent-of-parent-grandparent (see docs/research-program/inferences/kin-p159-p71-grandparent.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

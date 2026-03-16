# Inference Dossier

Edge key: `kin|P180|P139|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P180 Princess Aishath Didi
- Target node: P139 Hussain Didi
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P180 Princess Aishath Didi and P139 Hussain Didi are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Dhiyamigili-South -> Modern
- Rule basis status: resolved (1 supporting edge).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle resolved as follows.
2. Supporting edge: parent P140 Al-Nabeel Karayye Hassan Didi -> P139 Hussain Didi (CLM-0275, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P140 Al-Nabeel Karayye Hassan Didi as parent of P139 Hussain Didi.
3. Rule application (parent-sibling-aunt-uncle): sibling(P140 Al-Nabeel Karayye Hassan Didi, P180 Princess Aishath Didi) plus parent(P140 Al-Nabeel Karayye Hassan Didi, child) yields inferred aunt/uncle-line kin between P180 Princess Aishath Didi and P139 Hussain Didi.
4. Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.
- Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P180 Princess Aishath Didi and P139 Hussain Didi as kin (aunt/uncle↔niece/nephew).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-WIKI-IBRAHIM-NASIR` (Ibrahim Nasir)
- Primary inferred claim row: CLM-0075
- Inferred claim locator: Inference basis: parent-sibling-aunt-uncle (see docs/research-program/inferences/kin-p139-p180-aunt-uncle-niece-nephew.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

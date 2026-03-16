# Inference Dossier

Edge key: `kin|P140|P183|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P140 Al-Nabeel Karayye Hassan Didi
- Target node: P183 Ganduvaru Hassan Didi
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P140 Al-Nabeel Karayye Hassan Didi and P183 Ganduvaru Hassan Didi are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Dhiyamigili-South -> Addu Line
- Rule basis status: resolved (1 supporting edge).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle resolved as follows.
2. Supporting edge: parent P180 Princess Aishath Didi -> P183 Ganduvaru Hassan Didi (CLM-0319, SRC-MRF-MIDU-ROYAL, grade B); excerpt: Midu Royal Family Branch (Addu/Meedhoo records) family/genealogy content lists P180 Princess Aishath Didi as parent of P183 Ganduvaru Hassan Didi.
3. Rule application (parent-sibling-aunt-uncle): sibling(P180 Princess Aishath Didi, P140 Al-Nabeel Karayye Hassan Didi) plus parent(P180 Princess Aishath Didi, child) yields inferred aunt/uncle-line kin between P140 Al-Nabeel Karayye Hassan Didi and P183 Ganduvaru Hassan Didi.
4. Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.
- Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P140 Al-Nabeel Karayye Hassan Didi and P183 Ganduvaru Hassan Didi as kin (aunt/uncle↔niece/nephew).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-MIDU-ROYAL` (Midu Royal Family Branch (Addu/Meedhoo records))
- Primary inferred claim row: CLM-0080
- Inferred claim locator: Inference basis: parent-sibling-aunt-uncle (see docs/research-program/inferences/kin-p140-p183-aunt-uncle-niece-nephew.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

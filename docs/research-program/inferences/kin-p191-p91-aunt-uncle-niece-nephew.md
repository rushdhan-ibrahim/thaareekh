# Inference Dossier

Edge key: `kin|P191|P91|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-08`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P191 Ibrahim Fareed Didi
- Target node: P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri)
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P191 Ibrahim Fareed Didi and P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Huraagey -> Huraagey
- Rule basis status: resolved (1 supporting edge).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle resolved as follows.
2. Supporting edge: parent P129 Princess Veyogey Dhon Goma -> P191 Ibrahim Fareed Didi (CLM-0261, SRC-WIKI-IBRAHIM-FAREED, grade B); excerpt: Ibrahim Fareed Didi family/genealogy content lists P129 Princess Veyogey Dhon Goma as parent of P191 Ibrahim Fareed Didi.
3. Rule application (parent-sibling-aunt-uncle): sibling(P129 Princess Veyogey Dhon Goma, P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri)) plus parent(P129 Princess Veyogey Dhon Goma, child) yields inferred aunt/uncle-line kin between P191 Ibrahim Fareed Didi and P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri).
4. Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.
- Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P191 Ibrahim Fareed Didi and P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) as kin (aunt/uncle↔niece/nephew).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-WIKI-IBRAHIM-FAREED` (Ibrahim Fareed Didi)
- Primary inferred claim row: CLM-0127
- Inferred claim locator: Inference basis: parent-sibling-aunt-uncle (see docs/research-program/inferences/kin-p191-p91-aunt-uncle-niece-nephew.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

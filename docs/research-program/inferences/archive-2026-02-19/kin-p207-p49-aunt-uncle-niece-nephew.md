# Inference Dossier

Edge key: `kin|P207|P49|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-10`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P207 Recca
- Target node: P49 Sheikh Hassan (Raadha Fanaveeru)
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P207 Recca and P49 Sheikh Hassan (Raadha Fanaveeru) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (1 supporting edge).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle resolved as follows.
2. Supporting edge: parent P202 Kamba Dio -> P49 Sheikh Hassan (Raadha Fanaveeru) (CLM-0572, SRC-MRF-HILAALY, grade B); excerpt: Direct parent relation recorded between Kamba Dio as parent of Sheikh Hassan.
3. Rule application (parent-sibling-aunt-uncle): sibling(P202 Kamba Dio, P207 Recca) plus parent(P202 Kamba Dio, child) yields inferred aunt/uncle-line kin between P207 Recca and P49 Sheikh Hassan (Raadha Fanaveeru).
4. Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.
- Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P207 Recca and P49 Sheikh Hassan (Raadha Fanaveeru) as kin (aunt/uncle↔niece/nephew).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-HILAALY` (Royal House of Hilaaly)
- Primary inferred claim row: CLM-0503
- Inferred claim locator: Inference basis documented in docs/research-program/inferences/kin-p207-p49-aunt-uncle-niece-nephew.md.

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

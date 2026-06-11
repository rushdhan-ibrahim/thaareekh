# Inference Dossier

Edge key: `sibling|P91|P129|siblings (shared parent)`  
Last updated: `2026-02-10`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: sibling
- Source node: P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri)
- Target node: P129 Princess Veyogey Dhon Goma
- Label: siblings (shared parent)
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) and P129 Princess Veyogey Dhon Goma are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.
- Historical/dynastic context: Huraagey -> Huraagey
- Rule basis status: resolved (1 supporting edge).

## 3) Logic chain (pair-specific)
1. Support set for rule shared-parent-sibling resolved as follows.
2. Supporting edge: parent P87 Ibrahim Nooredine (Keerithi Maha Radun) -> P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) (CLM-0366, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P87 Ibrahim Nooredine as parent of P91 Mohamed Shamsuddine III.
3. Rule application (shared-parent-sibling): because both endpoints share parent P87 Ibrahim Nooredine (Keerithi Maha Radun), P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) and P129 Princess Veyogey Dhon Goma are modeled as inferred sibling-line kin.
4. Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: half-sibling or cousin if one supporting parent edge is revised.
- Contradiction trigger: direct sources assigning a different parent to one endpoint.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) and P129 Princess Veyogey Dhon Goma as sibling (siblings (shared parent)).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0383
- Inferred claim locator: Inference basis: shared-parent-sibling (see docs/research-program/inferences/sibling-p129-p91-siblings-shared-parent.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

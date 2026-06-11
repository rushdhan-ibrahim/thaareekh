# Inference Dossier

Edge key: `kin|P50|P55|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P50 Ibrahim (Bavana Furasuddha)
- Target node: P55 Hassan (Singa Veeru)
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P50 Ibrahim (Bavana Furasuddha) and P55 Hassan (Singa Veeru) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: contested (manual batch-L review identified a generation mismatch in the sibling premise).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle was rechecked manually in batch L.
2. Supporting edge: parent P52 Yoosuf (Veeru Aanandha) -> P55 Hassan (Singa Veeru) (CLM-0346, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P52 Yoosuf as parent of P55 Hassan.
3. Canonical chain for P50 lineage: parent P47 Hassan (Raadha Aanandha) -> P50 Ibrahim (Bavana Furasuddha) (CLM-0601, SRC-ROYALARK-MALDIVES, grade B) and sibling P47 Hassan (Raadha Aanandha) <-> P52 Yoosuf (Veeru Aanandha) [brothers] (CLM-0440, SRC-MRF-KINGS, grade C inferred support currently non-canonical).
4. Under the accepted generation mapping, P50 and P55 are both children of sibling parents (P47 and P52), so the pair is cousin-line, not aunt/uncle↔niece/nephew.
5. Canonical decision for CLM-0171 is deferred pending edge-class correction from aunt/uncle to cousin-line.

## 4) Alternative interpretations
- Preferred corrected interpretation: cousin-line relation.
- Contradiction trigger: unresolved generation mismatch in the current aunt/uncle rule application.
- Model-retention rationale: keep this dossier open until the edge class is recast.

## 5) Verification checklist
- Promotion requirement: not applicable in current edge class (aunt/uncle) due generation mismatch.
- Correction requirement: replace this edge with a cousin-line claim between P50 and P55 using canonical parentage anchors.
- Review cadence: reopen after sibling/kin normalization pass for the P47/P50/P52 corridor.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0171
- Inferred claim locator: Inference basis: parent-sibling-aunt-uncle (see docs/research-program/inferences/kin-p50-p55-aunt-uncle-niece-nephew.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (manual batch-L sets CLM-0171 to deferred pending edge-class correction).
- If support edges change, re-run derived dossier refresh and regenerate this dossier as cousin-line.

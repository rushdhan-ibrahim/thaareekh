# Inference Dossier

Edge key: `kin|P50|P219|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P50 Ibrahim (Bavana Furasuddha)
- Target node: P219 Umar Ma'afai Kilege
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P50 Ibrahim (Bavana Furasuddha) and P219 Umar Ma'afai Kilege are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: contested (manual batch-H review identified a generation mismatch in the sibling premise).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle was rechecked manually in batch H.
2. Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P219 Umar Ma'afai Kilege (CLM-0603, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Kalu Mohamed as parent of Umar Ma'afai Kilege.
3. Canonical chain for P50 lineage: parent P47 Hassan (Raadha Aanandha) -> P50 Ibrahim (Bavana Furasuddha) (CLM-0601, SRC-ROYALARK-MALDIVES, grade B) and sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P47 Hassan (Raadha Aanandha) [half-brothers] (CLM-0639, SRC-ROYALARK-MALDIVES, grade B).
4. Under this canonical chain, P50 is nephew of P51, and P219 is child of P51; therefore P50 and P219 are generation-peers (cousin-line), not aunt/uncle↔niece/nephew.
5. Canonical decision for CLM-0542 is deferred pending model correction from aunt/uncle to cousin-line.

## 4) Alternative interpretations
- Preferred corrected interpretation: cousin-line relation.
- Contradiction trigger: unresolved conflict between inferred sibling premise `P50<->P51` and canonical parent/sibling anchors `CLM-0601` + `CLM-0639`.
- Model-retention rationale: keep this dossier open until the edge class is recast.

## 5) Verification checklist
- Promotion requirement: not applicable in current edge class (aunt/uncle) due generation mismatch.
- Correction requirement: replace this edge with a cousin-line claim between P50 and P219 using canonical parentage anchors.
- Review cadence: reopen after sibling/kin normalization pass for the P47/P50/P51 corridor.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-ROYALARK-MALDIVES` (RoyalArk Maldives — Complete Genealogical Database (segments 3-16))
- Primary inferred claim row: CLM-0542
- Inferred claim locator: Inference basis documented in docs/research-program/inferences/kin-p219-p50-aunt-uncle-niece-nephew.md.

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (manual batch-H sets CLM-0542 to deferred pending edge-class correction).
- If support edges change, re-run derived dossier refresh and regenerate this dossier as cousin-line.

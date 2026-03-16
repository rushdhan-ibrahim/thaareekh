# Inference Dossier

Edge key: `sibling|P90|P129|siblings (shared parent)`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: sibling
- Source node: P90 Mohamed Imaduddine V (Keerithi Maha Radun)
- Target node: P129 Princess Veyogey Dhon Goma
- Label: siblings (shared parent)
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P90 Mohamed Imaduddine V (Keerithi Maha Radun) and P129 Princess Veyogey Dhon Goma are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.
- Historical/dynastic context: Huraagey -> Huraagey
- Rule basis status: contested (manual batch-L review: second parent anchor for P129 remains deferred).

## 3) Logic chain (pair-specific)
1. Support set for rule shared-parent-sibling was rechecked manually in batch L.
2. Supporting edge: parent P87 Ibrahim Nooredine (Keerithi Maha Radun) -> P90 Mohamed Imaduddine V (Keerithi Maha Radun) (CLM-0365, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P87 Ibrahim Nooredine as parent of P90 Mohamed Imaduddine V.
3. Required companion anchor `parent P87 -> P129` is represented by CLM-0364, which remains deferred pending independent non-MRF corroboration (see contradiction-log CLOG-2026-02-08-C2).
4. Because the shared-parent rule requires both parent anchors, sibling classification for P90/P129 remains deferred until CLM-0364 closes.

## 4) Alternative interpretations
- Possible competing interpretation: half-sibling via non-paternal route or broader collateral kin if the deferred parent anchor does not close.
- Contradiction trigger: failure to corroborate `P87 -> P129` independently.
- Model-retention rationale: keep this dossier open in deferred state pending closure of CLM-0364.

## 5) Verification checklist
- Promotion requirement: close CLM-0364 with independent corroboration, then re-evaluate sibling derivation.
- Downgrade/removal trigger: source-backed evidence rejecting paternal link `P87 -> P129`.
- Review cadence: reopen immediately after CLOG-2026-02-08-C2 closure.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0382
- Inferred claim locator: Inference basis: shared-parent-sibling (see docs/research-program/inferences/sibling-p129-p90-siblings-shared-parent.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (manual batch-L defers CLM-0382 pending CLM-0364 corroboration closure).
- If support edges change, re-run derived dossier refresh before any promotion decision.

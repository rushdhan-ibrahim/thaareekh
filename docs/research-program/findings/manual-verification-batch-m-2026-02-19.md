# Manual Verification Batch M — 2026-02-19

## Scope
- Manual adjudication of 40 inferred claims in the next pending tranche (`CLM-0388` through `CLM-0473`, non-contiguous).
- This tranche is dominated by shared-parent sibling derivations, plus selected kin inferences.

## Targeted claims
- `CLM-0388`, `CLM-0389`, `CLM-0390`, `CLM-0391`, `CLM-0392`, `CLM-0393`, `CLM-0394`, `CLM-0395`, `CLM-0396`, `CLM-0397`
- `CLM-0400`, `CLM-0401`, `CLM-0402`, `CLM-0403`, `CLM-0404`, `CLM-0405`, `CLM-0407`
- `CLM-0409`, `CLM-0410`, `CLM-0411`, `CLM-0412`, `CLM-0414`, `CLM-0415`, `CLM-0416`, `CLM-0418`, `CLM-0419`, `CLM-0420`, `CLM-0421`
- `CLM-0429`, `CLM-0430`, `CLM-0433`, `CLM-0434`, `CLM-0435`, `CLM-0437`, `CLM-0438`, `CLM-0439`, `CLM-0440`, `CLM-0443`
- `CLM-0472`, `CLM-0473`

## Manual adjudication result
- Approved: 37
- Deferred: 3

## Deferred claims and rationale
- `CLM-0433` `sibling|P47|P50|brothers`
- `CLM-0439` `sibling|P50|P51|brothers`
- `CLM-0440` `sibling|P50|P52|brothers`

All three are deferred due generation mismatch with canonical parentage (`P47 -> P50`) and the established sibling generation around `P47/P51/P52`. They require edge-class correction rather than sibling retention.

## Explainability hardening
- Updated dossier files with handcrafted deferred logic and correction direction:
  - `docs/research-program/inferences/sibling-p47-p50-brothers.md`
  - `docs/research-program/inferences/sibling-p50-p51-brothers.md`
  - `docs/research-program/inferences/sibling-p50-p52-brothers.md`

## Integration updates
- `relationship-evidence-ledger.csv`
  - Updated all 40 targeted rows with manual batch-M reviewer metadata.
  - Set `canonical_decision=approved` for 37 claims and `canonical_decision=deferred` for the 3 claims above.
- `inference-dossier-tracker.csv`
  - Set `dossier_status=approved` for 37 edge keys.
  - Kept the 3 deferred edge keys at `dossier_status=in_progress` with class-correction notes.
- `person-coverage.csv`
  - Updated impacted nodes to `verified_manual_batch_m` (38 nodes in this tranche).

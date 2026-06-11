# Manual Verification Batch N — 2026-02-19

## Scope
- Manual adjudication of 40 inferred claims in the next pending tranche (`CLM-0474` through `CLM-0566`, non-contiguous).
- Tranche spans founder-to-Hilaaly corridor links and Portuguese-bridge descendant kin propagation.

## Targeted claims
- `CLM-0474`, `CLM-0475`, `CLM-0476`, `CLM-0477`, `CLM-0478`, `CLM-0479`, `CLM-0480`, `CLM-0481`, `CLM-0482`, `CLM-0483`, `CLM-0484`, `CLM-0485`, `CLM-0487`, `CLM-0488`, `CLM-0490`, `CLM-0491`, `CLM-0493`, `CLM-0494`, `CLM-0495`, `CLM-0496`, `CLM-0497`
- `CLM-0504`, `CLM-0511`, `CLM-0517`, `CLM-0523`, `CLM-0529`, `CLM-0536`
- `CLM-0554`, `CLM-0555`, `CLM-0556`, `CLM-0557`, `CLM-0558`, `CLM-0559`, `CLM-0560`, `CLM-0561`, `CLM-0562`, `CLM-0563`, `CLM-0564`, `CLM-0565`, `CLM-0566`

## Manual adjudication result
- Approved: 39
- Deferred: 1

## Deferred claim and rationale
- `CLM-0474` `kin|P222|P129|aunt/uncle↔niece/nephew`
  - Deferred because the dossier still carries unresolved support-chain placeholders and does not yet provide a resolved pair-specific support claim set.

## Explainability hardening
- Updated deferred dossier:
  - `docs/research-program/inferences/kin-p129-p222-aunt-uncle-niece-nephew.md`

## Integration updates
- `relationship-evidence-ledger.csv`
  - Updated all 40 targeted rows with manual batch-N reviewer metadata.
  - Set `canonical_decision=approved` for 39 claims and `canonical_decision=deferred` for `CLM-0474`.
- `inference-dossier-tracker.csv`
  - Set `dossier_status=approved` for 39 edge keys.
  - Kept `kin|P222|P129|aunt/uncle↔niece/nephew` at `dossier_status=in_progress` with unresolved-support note.
- `person-coverage.csv`
  - Updated impacted nodes to `verified_manual_batch_n` (37 nodes in this tranche).

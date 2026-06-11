# Manual Verification Batch F — 2026-02-19

## Scope
- Manual adjudication of founder-corridor inferred claims after the `P217/P218` structural correction.
- Targeted 13 `in_progress` inferred edges:
  - `CLM-0130`, `CLM-0492`
  - `CLM-0537`, `CLM-0538`, `CLM-0539`
  - `CLM-0651`, `CLM-0652`, `CLM-0653`
  - `CLM-0143`, `CLM-0144`, `CLM-0145`, `CLM-0149`, `CLM-0150`

## Manual adjudication result
- Approved and canonicalized all 13 targeted inferred claims.
- For each claim:
  - `review_status=approved`
  - `canonical_decision=approved`
  - `reviewer=manual-verification-batch-f`
  - `last_reviewed=2026-02-19`

## Quality actions performed
- Added missing dossiers for newly introduced inferred edges:
  - `docs/research-program/inferences/kin-p218-p31-grandparent.md`
  - `docs/research-program/inferences/kin-p218-p39-grandparent.md`
  - `docs/research-program/inferences/kin-p218-p40-grandparent.md`
- Updated `inference-dossier-tracker.csv` rows for all 13 targeted edge keys:
  - `dossier_status=approved`
  - `last_updated=2026-02-19`
  - notes updated with manual batch-F adjudication rationale

## Evidence basis and rule checks
- `parent-of-parent-grandparent` claims were verified against approved support edges, especially:
  - `P217 -> P30`, `P218 -> P30` (RoyalArk founder-family correction lane)
  - `P30 -> P31/P39/P40` and `P39 -> P41/P46`
  - `P40 -> P193/P202`
- `parent-sibling-aunt-uncle` claims were verified against:
  - `P30 <-> P32` sibling (twins)
  - `P30 -> P31/P39/P40` parent edges

## Integration notes
- Person coverage statuses were moved to `verified_manual_batch_f` for:
  - `P30`, `P31`, `P32`, `P39`, `P40`, `P41`, `P46`, `P193`, `P202`, `P217`, `P218`
- This batch intentionally keeps claim type as inferred (`c=i`) while marking canonical acceptance of the inference logic.


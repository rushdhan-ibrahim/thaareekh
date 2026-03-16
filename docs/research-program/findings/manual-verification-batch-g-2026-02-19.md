# Manual Verification Batch G — 2026-02-19

## Scope
- Manual adjudication of Portuguese bridge-descendant inferred chains centered on:
  - `P220/P221 -> P61 -> P209/P210/P211/P212`
  - `P60 <-> P61` aunt/uncle propagation to descendants
  - `P61 -> P66 -> P67/P213` grandparent/aunt-uncle propagation
- Targeted 21 inferred claims:
  - `CLM-0512`, `CLM-0513`, `CLM-0514`, `CLM-0515`
  - `CLM-0518`, `CLM-0519`, `CLM-0520`, `CLM-0521`
  - `CLM-0524`, `CLM-0525`, `CLM-0526`, `CLM-0527`
  - `CLM-0530`, `CLM-0531`, `CLM-0532`, `CLM-0533`
  - `CLM-0535`, `CLM-0552`, `CLM-0553`, `CLM-0181`, `CLM-0183`

## Manual adjudication result
- Approved and canonicalized all 21 targeted inferred claims.
- Ledger metadata set for all:
  - `review_status=approved`
  - `canonical_decision=approved`
  - `reviewer=manual-verification-batch-g`
  - `last_reviewed=2026-02-19`

## Verification basis
- Pair-specific inference dossiers were present for all 21 targeted edge keys.
- Support chains were manually checked in dossiers and aligned with approved direct anchors, including:
  - `CLM-0588`, `CLM-0590` (`P220/P221 -> P61`)
  - `CLM-0605`, `CLM-0606`, `CLM-0607`, `CLM-0608` (`P61 -> P209/P210/P211/P212`)
  - `CLM-0347`, `CLM-0348`, `CLM-0609` (`P61 -> P66 -> P67/P213`)
  - `CLM-0640` (`P60 <-> P61` half-brothers)
  - Sibling anchors for `P209/210/211/212 <-> P66` (`CLM-0625`, `CLM-0628`, `CLM-0630`, `CLM-0631`)

## Integration updates
- `inference-dossier-tracker.csv` updated for all 21 targeted edge keys:
  - `dossier_status=approved`
  - `last_updated=2026-02-19`
  - batch-G adjudication notes
- `person-coverage.csv` updated to `verified_manual_batch_g` for:
  - `P60`, `P61`, `P66`, `P67`, `P209`, `P210`, `P211`, `P212`, `P213`, `P220`, `P221`

## Modeling note
- Claims remain inferred (`c=i`) by type, but are now manually reviewed and canonically accepted for current research-mode modeling.


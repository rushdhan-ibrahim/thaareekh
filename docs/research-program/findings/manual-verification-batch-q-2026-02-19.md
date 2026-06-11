# Manual Verification Batch Q — 2026-02-19

## Scope
- Close remaining `in_progress` contested parent claims in the relationship evidence ledger without removing research-mode alternate branches.
- Targeted claims:
  - `CLM-0599` `parent|P40|P41|reported alternate parent claim`
  - `CLM-0600` `parent|P46|P50|reported alternate parent claim`
  - `CLM-0662` `parent|P87|P129|reported paternal parent claim`

## Manual adjudication result
- Reviewed: 3
- Canonical approved: 0
- Canonical deferred: 3

All 3 targeted claims were set to:
- `review_status=approved`
- `canonical_decision=deferred`
- `reviewer=manual-verification-batch-q`
- `last_reviewed=2026-02-19`

## Pair-specific rationale
- `CLM-0599` (`P40 -> P41` alternate):
  - Canonical branch remains `P39 -> P41` (`CLM-0596`) based on stronger existing adjudication state.
  - Alternate tradition is retained in research mode as explicit contested evidence for transparency and future chronicle-level review.
- `CLM-0600` (`P46 -> P50` alternate):
  - Canonical branch remains `P47 -> P50` (`CLM-0601`) with direct wording support.
  - `P46 -> P50` is retained only as contested alternate branch to preserve minority lineage reporting.
- `CLM-0662` (`P87 -> P129` alternate paternal formulation):
  - Current canonical corridor keeps `P185 -> P129` and `P91 <-> P129` half-sibling evidence active.
  - Optional paternal formulation `P87 -> P129` remains explicitly deferred and research-only pending stronger independent corroboration.

## Integration updates
- `docs/research-program/ledgers/relationship-evidence-ledger.csv`
  - Closed all remaining `in_progress` contested parent rows by converting them to reviewed deferred state.

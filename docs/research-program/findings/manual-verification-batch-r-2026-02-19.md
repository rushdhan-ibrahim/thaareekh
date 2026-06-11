# Manual Verification Batch R — 2026-02-19

## Scope
- Manual biography/relation verification tranche for early Hilaaly transition nodes still marked `in_progress`.
- Targeted people: `P29`, `P37`, `P38`.
- Targeted relation claims:
  - `CLM-0332` (`parent|P29|P37|`)
  - `CLM-0326` (`parent|P192|P38|`)
  - `CLM-0142` (`kin|P38|P30|cousins (fathers were brothers)`)

## Manual adjudication result
- Reviewed claims: 3
- Canonical approved: 3
- Canonical deferred: 0

All 3 claims remain:
- `review_status=approved`
- `canonical_decision=approved`
- `reviewer=manual-verification-batch-r`
- `last_reviewed=2026-02-19`

## Pair-specific rationale
- `CLM-0332` (`P29 -> P37`):
  - Retained as canonical current-model parent mapping.
  - Kept at `confidence_grade=C` due documented alternate historiographic attribution in other traditions.
- `CLM-0326` (`P192 -> P38`):
  - Parent attribution remains coherent with the Hilaaly collateral branch sequence.
  - No contradictory higher-confidence branch identified in current evidence pack.
- `CLM-0142` (`P38 <-> P30` cousins):
  - Relationship wording matches the "fathers were brothers" formulation in branch material.
  - Semantics remain specific and suitable for direct canonical retention.

## Integration updates
- `docs/research-program/ledgers/relationship-evidence-ledger.csv`
  - Updated review metadata for `CLM-0332`, `CLM-0326`, `CLM-0142`.
- `docs/research-program/ledgers/person-coverage.csv`
  - `P29`, `P37`, `P38` moved to `verified_manual_batch_r`.
- `docs/research-program/people/P29.md`
  - Research status updated to `verified_manual_batch_r`.
- `docs/research-program/people/P37.md`
  - Research status updated to `verified_manual_batch_r`.
- `docs/research-program/people/P38.md`
  - Research status updated to `verified_manual_batch_r`.

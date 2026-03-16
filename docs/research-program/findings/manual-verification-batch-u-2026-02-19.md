# Manual Verification Batch U — 2026-02-19

## Scope
- Manual verification tranche for modern family-corridor dossiers:
  - `P113`, `P118`, `P123`, `P141`, `P142`
- Targeted claims:
  - `CLM-0237`, `CLM-0452`
  - `CLM-0246`, `CLM-0247`, `CLM-0453`
  - `CLM-0256`, `CLM-0257`, `CLM-0457`
  - `CLM-0276`, `CLM-0277`, `CLM-0454`
  - `CLM-0278`, `CLM-0279`, `CLM-0455`

## Manual adjudication result
- Reviewed claims: 14
- Canonical approved: 14
- Canonical deferred: 0

All 14 claims remain:
- `review_status=approved`
- `canonical_decision=approved`
- `reviewer=manual-verification-batch-u`
- `last_reviewed=2026-02-19`

## Pair-specific rationale
- Spouse claims:
  - `P110<->P113`, `P115<->P118`, `P122<->P123`, `P115<->P141`, `P115<->P142` remain direct and coherent with person-level spouse fields in the cited source snapshots.
- Parent claims:
  - `P113->P114`
  - `P118->P124` and `P118->P145`
  - `P123->P125` and `P123->P126`
  - `P141->P143` and `P141->P144`
  - `P142->P146` and `P142->P147`
  remain aligned with spouse-specific issue-grouping locators and are retained as canonical direct claims.

## Integration updates
- `docs/research-program/ledgers/relationship-evidence-ledger.csv`
  - Updated review metadata for all 14 targeted claims.
- `docs/research-program/ledgers/person-coverage.csv`
  - `P113`, `P118`, `P123`, `P141`, `P142` moved to `verified_manual_batch_u`.
- `docs/research-program/people/P113.md`
  - Research status updated to `verified_manual_batch_u`.
- `docs/research-program/people/P118.md`
  - Research status updated to `verified_manual_batch_u`.
- `docs/research-program/people/P123.md`
  - Research status updated to `verified_manual_batch_u`.
- `docs/research-program/people/P141.md`
  - Research status updated to `verified_manual_batch_u`.
- `docs/research-program/people/P142.md`
  - Research status updated to `verified_manual_batch_u`.

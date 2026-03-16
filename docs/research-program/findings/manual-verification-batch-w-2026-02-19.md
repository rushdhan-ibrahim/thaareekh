# Manual Verification Batch W — 2026-02-19

## Scope
- Manual verification tranche for current-era and adjacent bridge dossiers:
  - `P161`, `P162`, `P163`, `P167`, `P172`, `P173`
- Targeted claims:
  - `CLM-0296`
  - `CLM-0297`, `CLM-0298`, `CLM-0299`, `CLM-0459`
  - `CLM-0300`, `CLM-0301`, `CLM-0302`
  - `CLM-0303`, `CLM-0304`, `CLM-0307`, `CLM-0460`
  - `CLM-0308`, `CLM-0309`, `CLM-0310`, `CLM-0314`, `CLM-0315`, `CLM-0413`, `CLM-0461`
  - `CLM-0311`, `CLM-0312`, `CLM-0313`

## Manual adjudication result
- Reviewed claims: 22
- Canonical approved: 22
- Canonical deferred: 0

All 22 claims remain:
- `review_status=approved`
- `canonical_decision=approved`
- `reviewer=manual-verification-batch-w`
- `last_reviewed=2026-02-19`

## Pair-specific rationale
- `P161` corridor:
  - `P161->P71` retained as direct parent claim.
- `P162/P163` corridor:
  - Spouse relation `P162<->P163` retained.
  - Parent relations to `P164/P165/P166` retained for both parents.
- `P167` corridor:
  - Parent links to `P169` and `P170` retained.
  - Maternal link `P171->P167` retained.
  - Spouse link `P167<->P168` retained.
- `P172/P173` corridor:
  - Parent links to `P177/P178/P179` retained for both parents.
  - Parent links `P174->P172` and `P175->P172` retained.
  - Sibling link `P172<->P176` retained with corroborative support.
  - Spouse link `P172<->P173` retained.

## Integration updates
- `docs/research-program/ledgers/relationship-evidence-ledger.csv`
  - Updated review metadata for all 22 targeted claims.
- `docs/research-program/ledgers/person-coverage.csv`
  - `P161`, `P162`, `P163`, `P167`, `P172`, `P173` moved to `verified_manual_batch_w`.
- `docs/research-program/people/P161.md`
  - Research status updated to `verified_manual_batch_w`.
- `docs/research-program/people/P162.md`
  - Research status updated to `verified_manual_batch_w`.
- `docs/research-program/people/P163.md`
  - Research status updated to `verified_manual_batch_w`.
- `docs/research-program/people/P167.md`
  - Research status updated to `verified_manual_batch_w`.
- `docs/research-program/people/P172.md`
  - Research status updated to `verified_manual_batch_w`.
- `docs/research-program/people/P173.md`
  - Research status updated to `verified_manual_batch_w`.

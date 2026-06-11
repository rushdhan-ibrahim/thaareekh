# Manual Verification Batch V — 2026-02-19

## Scope
- Manual verification tranche for mixed modern and bridge-family nodes:
  - `P149`, `P154`, `P156`, `P158`, `P160`
- Targeted claims:
  - `CLM-0281`, `CLM-0282`, `CLM-0283`, `CLM-0284`
  - `CLM-0398`, `CLM-0399`
  - `CLM-0456`
  - `CLM-0095`, `CLM-0287`
  - `CLM-0290`
  - `CLM-0292`
  - `CLM-0293`, `CLM-0295`

## Manual adjudication result
- Reviewed claims: 13
- Canonical approved: 13
- Canonical deferred: 0

All 13 claims remain:
- `review_status=approved`
- `canonical_decision=approved`
- `reviewer=manual-verification-batch-v`
- `last_reviewed=2026-02-19`

## Pair-specific rationale
- `P149` corridor:
  - Spouse link `P119<->P149` and child links `P149->P150/P151/P152/P153` retained as direct family claims.
  - Sibling links `P149<->P198` and `P149<->P199` retained with multi-source support.
- `P154` corridor:
  - Parent claim `P154->P82` reconfirmed.
  - Contextual kin claim `P154<->P80` retained as uncle/nephew semantics.
- `P156` and `P158`:
  - `P156->P4` and `P158->P10` retained as direct parent claims.
- `P160` corridor:
  - `P159->P160` and `P160->P71` retained as direct parent links.

## Integration updates
- `docs/research-program/ledgers/relationship-evidence-ledger.csv`
  - Updated review metadata for all 13 targeted claims.
- `docs/research-program/ledgers/person-coverage.csv`
  - `P149`, `P154`, `P156`, `P158`, `P160` moved to `verified_manual_batch_v`.
- `docs/research-program/people/P149.md`
  - Research status updated to `verified_manual_batch_v`.
- `docs/research-program/people/P154.md`
  - Research status updated to `verified_manual_batch_v`.
- `docs/research-program/people/P156.md`
  - Research status updated to `verified_manual_batch_v`.
- `docs/research-program/people/P158.md`
  - Research status updated to `verified_manual_batch_v`.
- `docs/research-program/people/P160.md`
  - Research status updated to `verified_manual_batch_v`.

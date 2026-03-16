# Manual Verification Batch X — 2026-02-19

## Scope
- Manual verification tranche for bridge and collateral dynastic nodes:
  - `P181`, `P184`, `P187`, `P188`, `P192`, `P195`
- Targeted claims:
  - `CLM-0117`, `CLM-0462`
  - `CLM-0321`
  - `CLM-0464`
  - `CLM-0465`
  - `CLM-0128`, `CLM-0129`, `CLM-0326`
  - `CLM-0330`, `CLM-0466`

## Manual adjudication result
- Reviewed claims: 10
- Canonical approved: 10
- Canonical deferred: 0

All 10 claims remain:
- `review_status=approved`
- `canonical_decision=approved`
- `reviewer=manual-verification-batch-x`
- `last_reviewed=2026-02-19`

## Pair-specific rationale
- `P181`:
  - Descendant-context kin relation to `P76` retained as contextual lineage semantics.
  - Spouse relation `P180<->P181` retained.
- `P184`:
  - Parent link `P184->P83` retained as direct claim.
- `P187` and `P188`:
  - Spouse links `P85<->P187` and `P86<->P188` retained.
- `P192` corridor:
  - Uncle/nephew links `P192<->P30` and `P192<->P32` retained.
  - Parent link `P192->P38` reconfirmed.
- `P195` corridor:
  - Parent link `P195->P57` retained.
  - Spouse link `P193<->P195` retained.

## Integration updates
- `docs/research-program/ledgers/relationship-evidence-ledger.csv`
  - Updated review metadata for all 10 targeted claims.
- `docs/research-program/ledgers/person-coverage.csv`
  - `P181`, `P184`, `P187`, `P188`, `P192`, `P195` moved to `verified_manual_batch_x`.
- `docs/research-program/people/P181.md`
  - Research status updated to `verified_manual_batch_x`.
- `docs/research-program/people/P184.md`
  - Research status updated to `verified_manual_batch_x`.
- `docs/research-program/people/P187.md`
  - Research status updated to `verified_manual_batch_x`.
- `docs/research-program/people/P188.md`
  - Research status updated to `verified_manual_batch_x`.
- `docs/research-program/people/P192.md`
  - Research status updated to `verified_manual_batch_x`.
- `docs/research-program/people/P195.md`
  - Research status updated to `verified_manual_batch_x`.

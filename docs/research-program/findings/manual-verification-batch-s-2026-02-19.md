# Manual Verification Batch S — 2026-02-19

## Scope
- Manual verification tranche for contextual-kin nodes with low edge count still marked `in_progress`.
- Targeted people: `P42`, `P53`, `P56`, `P62`.
- Targeted claims:
  - `CLM-0162` (`kin|P41|P42|deposition contest context`)
  - `CLM-0151` (`kin|P32|P53|ancestor`)
  - `CLM-0178` (`kin|P55|P56|succession transition context`)
  - `CLM-0180` (`kin|P56|P57|succession transition context`)
  - `CLM-0182` (`kin|P61|P62|prime-minister context`)

## Manual adjudication result
- Reviewed claims: 5
- Canonical approved: 5
- Canonical deferred: 0

All 5 claims remain:
- `review_status=approved`
- `canonical_decision=approved`
- `reviewer=manual-verification-batch-s`
- `last_reviewed=2026-02-19`

## Pair-specific rationale
- `CLM-0162`:
  - Relation is contextual (deposition contest), not explicit bloodline.
  - Current kin-context modeling is appropriate and should not be upcast to parent/sibling without stronger lineage wording.
- `CLM-0151`:
  - Ancestor label is broad by design and matches available branch wording.
  - Retained as canonical contextual kin relation.
- `CLM-0178` and `CLM-0180`:
  - Succession-context relations are coherent and supported by dual-source framing.
  - Retained as contextual kin links instead of over-precise genealogical typing.
- `CLM-0182`:
  - Prime-minister context link is role/political proximity, not parentage.
  - Retained as contextual kin/affinity semantics.

## Integration updates
- `docs/research-program/ledgers/relationship-evidence-ledger.csv`
  - Updated review metadata for `CLM-0162`, `CLM-0151`, `CLM-0178`, `CLM-0180`, `CLM-0182`.
- `docs/research-program/ledgers/person-coverage.csv`
  - `P42`, `P53`, `P56`, `P62` moved to `verified_manual_batch_s`.
- `docs/research-program/people/P42.md`
  - Research status updated to `verified_manual_batch_s`.
- `docs/research-program/people/P53.md`
  - Research status updated to `verified_manual_batch_s`.
- `docs/research-program/people/P56.md`
  - Research status updated to `verified_manual_batch_s`.
- `docs/research-program/people/P62.md`
  - Research status updated to `verified_manual_batch_s`.

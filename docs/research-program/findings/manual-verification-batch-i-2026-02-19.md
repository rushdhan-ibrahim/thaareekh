# Manual Verification Batch I — 2026-02-19

## Scope
- Manual adjudication of 40 inferred claims from the oldest pending corridor (`CLM-0002` through `CLM-0050`, with non-contiguous IDs).
- Claim mix:
  - grandparent rule-derived chains
  - aunt/uncle propagation chains
  - reported kin continuity links in modern and bridge corridors

## Targeted claims
- `CLM-0002`, `CLM-0003`, `CLM-0004`, `CLM-0006`, `CLM-0007`
- `CLM-0010`, `CLM-0012`, `CLM-0013`, `CLM-0014`
- `CLM-0020`, `CLM-0021`, `CLM-0022`, `CLM-0023`, `CLM-0024`
- `CLM-0025`, `CLM-0026`, `CLM-0027`, `CLM-0028`, `CLM-0029`, `CLM-0030`
- `CLM-0031`, `CLM-0032`, `CLM-0033`, `CLM-0034`, `CLM-0035`, `CLM-0036`, `CLM-0037`
- `CLM-0038`, `CLM-0039`, `CLM-0040`, `CLM-0041`, `CLM-0042`, `CLM-0043`, `CLM-0044`
- `CLM-0045`, `CLM-0046`, `CLM-0047`, `CLM-0048`, `CLM-0049`, `CLM-0050`

## Manual adjudication result
- Approved: 40
- Deferred: 0

All 40 targeted claims were set to:
- `review_status=approved`
- `canonical_decision=approved`
- `reviewer=manual-verification-batch-i`
- `last_reviewed=2026-02-19`

## Verification basis
- Each targeted edge had a dossier present in `inference-dossier-tracker.csv`.
- Pair-level logic chains in dossiers were manually checked against supporting claim IDs; all referenced support claims were already `review_status=approved`.
- No contradiction flags were found in this tranche during dossier sweep.

## Integration updates
- `relationship-evidence-ledger.csv`
  - Updated 40 targeted rows with batch-I adjudication metadata and notes.
- `inference-dossier-tracker.csv`
  - Updated corresponding 40 edge keys to `dossier_status=approved` with batch-I notes.
- `person-coverage.csv`
  - Updated to `verified_manual_batch_i` for 42 impacted nodes:
  - `P31`, `P39`, `P40`, `P68`, `P83`, `P84`, `P98`, `P100`, `P102`, `P103`, `P104`, `P106`, `P107`, `P110`, `P111`, `P112`, `P114`, `P115`, `P116`, `P117`, `P119`, `P120`, `P121`, `P122`, `P124`, `P125`, `P127`, `P134`, `P135`, `P136`, `P137`, `P138`, `P143`, `P144`, `P145`, `P146`, `P147`, `P150`, `P151`, `P152`, `P153`, `P168`.

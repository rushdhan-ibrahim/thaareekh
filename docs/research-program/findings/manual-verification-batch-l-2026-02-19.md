# Manual Verification Batch L — 2026-02-19

## Scope
- Manual adjudication of 40 inferred claims in the next pending tranche (`CLM-0170` through `CLM-0387`, non-contiguous).
- Tranche includes kin, parent, and sibling inferred edges.

## Targeted claims
- `CLM-0170`, `CLM-0171`, `CLM-0172`, `CLM-0173`, `CLM-0177`, `CLM-0179`
- `CLM-0186`, `CLM-0187`, `CLM-0188`, `CLM-0195`, `CLM-0196`, `CLM-0198`, `CLM-0199`
- `CLM-0202`, `CLM-0203`, `CLM-0204`, `CLM-0206`, `CLM-0207`, `CLM-0211`, `CLM-0213`, `CLM-0214`, `CLM-0216`, `CLM-0217`, `CLM-0218`, `CLM-0219`, `CLM-0220`, `CLM-0222`
- `CLM-0264`, `CLM-0358`, `CLM-0364`
- `CLM-0376`, `CLM-0377`, `CLM-0378`, `CLM-0379`, `CLM-0380`, `CLM-0381`, `CLM-0382`, `CLM-0384`, `CLM-0385`, `CLM-0387`

## Manual adjudication result
- Approved: 36
- Deferred: 4

## Deferred claims and rationale
- `CLM-0171` `kin|P50|P55|aunt/uncle↔niece/nephew`
- `CLM-0172` `kin|P50|P59|aunt/uncle↔niece/nephew`
  - Deferred due generation mismatch: canonical chain (`P47->P50` with sibling corridor around `P47/P51/P52`) supports cousin-line relation rather than aunt/uncle-line.
- `CLM-0364` `parent|P87|P129|`
  - Deferred pending independent non-MRF corroboration per contradiction-log `CLOG-2026-02-08-C2`.
- `CLM-0382` `sibling|P90|P129|siblings (shared parent)`
  - Deferred because shared-parent derivation depends on unresolved `CLM-0364`.

## Explainability hardening
- Updated dossier files with handcrafted deferred reasoning:
  - `docs/research-program/inferences/kin-p50-p55-aunt-uncle-niece-nephew.md`
  - `docs/research-program/inferences/kin-p50-p59-aunt-uncle-niece-nephew.md`
  - `docs/research-program/inferences/sibling-p129-p90-siblings-shared-parent.md`
  - `docs/research-program/inferences/parent-p87-p129.md`

## Integration updates
- `relationship-evidence-ledger.csv`
  - Updated all 40 targeted rows with manual batch-L reviewer metadata.
  - Set `canonical_decision=approved` for 36 claims and `canonical_decision=deferred` for the 4 claims above.
- `inference-dossier-tracker.csv`
  - Set `dossier_status=approved` for 36 edge keys.
  - Kept 4 deferred edge keys at `dossier_status=in_progress` with explicit dependency notes.
- `person-coverage.csv`
  - Updated impacted nodes to `verified_manual_batch_l` (41 nodes in this tranche).

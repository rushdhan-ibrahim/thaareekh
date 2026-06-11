# Manual Verification Batch H — 2026-02-19

## Scope
- Manual adjudication of 18 inferred Hilaaly-branch kin claims centered on:
  - `P208/P219/P220` descendant lines of `P51`.
  - aunt/uncle and cousin propagation involving `P46/P47/P50/P52/P55/P60/P61`.
- Targeted claims:
  - `CLM-0505`, `CLM-0506`, `CLM-0507`, `CLM-0508`, `CLM-0509`, `CLM-0510`
  - `CLM-0540`, `CLM-0541`, `CLM-0542`, `CLM-0543`, `CLM-0544`, `CLM-0545`
  - `CLM-0546`, `CLM-0547`, `CLM-0548`, `CLM-0549`, `CLM-0550`, `CLM-0551`

## Result summary
- Approved canonical inferred claims: 15
- Deferred claims: 3

## Deferred claims and rationale
- `CLM-0506` `kin|P50|P208|aunt/uncle↔niece/nephew`
- `CLM-0542` `kin|P50|P219|aunt/uncle↔niece/nephew`
- `CLM-0548` `kin|P50|P220|aunt/uncle↔niece/nephew`

Manual batch-H review found these three claims depend on sibling premise `P50<->P51` from `CLM-0439`, which conflicts with canonical accepted anchors:
- `CLM-0601` (`parent|P47|P50|`)
- `CLM-0639` (`sibling|P51|P47|half-brothers`)

Under the accepted chain, `P50` is nephew of `P51`; therefore `P50` is generation-peer with `P51`'s children (`P208/P219/P220`) and these pairs are better modeled as cousin-line, not aunt/uncle-line.

## Ledger integration updates
- `relationship-evidence-ledger.csv` updated for all 18 claims:
  - `review_status=approved`
  - `reviewer=manual-verification-batch-h`
  - `last_reviewed=2026-02-19`
  - `canonical_decision=approved` (15 claims)
  - `canonical_decision=deferred` (3 claims listed above)
- `inference-dossier-tracker.csv` updated for all 18 edge keys:
  - `dossier_status=approved` for 15 validated claims
  - `dossier_status=in_progress` for 3 deferred claims
  - `last_updated=2026-02-19`
  - pair-specific adjudication notes recorded
- `person-coverage.csv` updated to `verified_manual_batch_h` for:
  - `P46`, `P47`, `P50`, `P51`, `P52`, `P55`, `P60`, `P61`, `P208`, `P219`, `P220`

## Explainability hardening
- Updated 3 dossier files with handcrafted pair-level contradiction notes and correction direction:
  - `docs/research-program/inferences/kin-p208-p50-aunt-uncle-niece-nephew.md`
  - `docs/research-program/inferences/kin-p219-p50-aunt-uncle-niece-nephew.md`
  - `docs/research-program/inferences/kin-p220-p50-aunt-uncle-niece-nephew.md`
- Each now documents why the current edge class is deferred and why cousin-line recast is required.

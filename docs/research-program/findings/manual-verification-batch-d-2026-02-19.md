# Manual Verification Batch D — 2026-02-19

## Scope
- Completed manual adjudication for the remaining 25 `direct` claims previously at `review_status=todo` and `canonical_decision=pending`.
- Sources reviewed directly (non-automated adjudication):
  - `SRC-MRF-KINGS` (`maldives_kings_list.full.shtml`)
  - `SRC-MRF-HILAALY` (`maldives_hilaaly.shtml`)
  - `SRC-MRF-UTHEEM` (`maldives_utheem.shtml`)
  - `SRC-ROYALARK-MALDIVES` (RoyalArk Maldives genealogy pages, notably `maldive3.htm`, `maldive4.htm`, `maldive16.htm`)

## Result Summary
- Approved: 24 claims
- Deferred: 1 claim

## Approved Claims
- `CLM-0571` `parent|P16|P18|`
- `CLM-0572` `parent|P202|P49|`
- `CLM-0573` `parent|P203|P11|`
- `CLM-0574` `parent|P203|P12|`
- `CLM-0575` `parent|P204|P11|`
- `CLM-0576` `parent|P205|P9|`
- `CLM-0577` `parent|P206|P34|`
- `CLM-0578` `parent|P206|P35|`
- `CLM-0591` `parent|P222|P88|`
- `CLM-0592` `parent|P222|P92|`
- `CLM-0593` `parent|P223|P2|`
- `CLM-0594` `parent|P224|P10|`
- `CLM-0597` `parent|P40|P202|`
- `CLM-0601` `parent|P47|P50|`
- `CLM-0602` `parent|P51|P208|`
- `CLM-0610` `parent|P86|P222|`
- `CLM-0611` `sibling|P1|P223|siblings`
- `CLM-0612` `sibling|P200|P104|brothers`
- `CLM-0613` `sibling|P201|P104|brothers`
- `CLM-0617` `sibling|P200|P201|brothers`
- `CLM-0639` `sibling|P51|P47|half-brothers`
- `CLM-0650` `spouse|P222|P186|married`
- `CLM-0642` `spouse|P204|P203|married`
- `CLM-0643` `spouse|P208|P63|married`

## Deferred Claim
- `CLM-0644` `spouse|P30|P218|married`
  - Adjudication: `canonical_decision=deferred`
  - Reason: RoyalArk wording indicates Golavehi/Kalavahi Kabulo is the wife of Dori Kuja (P217) and mother of Hassan al-Hilali (P30), not spouse of P30.
  - Follow-up modeling action indicated by evidence:
    - verify/add `spouse|P217|P218|`
    - verify/add maternal edge `parent|P218|P30|` (and likely `parent|P218|P32|` in the same twin context)

## Ledger Changes Applied
- Updated in `docs/research-program/ledgers/relationship-evidence-ledger.csv`:
  - `review_status=approved` for all 25 claims in this batch
  - `canonical_decision=approved` for 24 claims
  - `canonical_decision=deferred` for `CLM-0644`
  - `reviewer=manual-verification-batch-d`
  - `last_reviewed=2026-02-19`
  - claim-specific citation locators and handcrafted notes recorded per row

- Updated in `docs/research-program/ledgers/person-coverage.csv`:
  - Set impacted nodes to `dossier_status=verified_manual_batch_d`
  - Updated `last_updated=2026-02-19`
  - Added batch-D closure note in `notes`


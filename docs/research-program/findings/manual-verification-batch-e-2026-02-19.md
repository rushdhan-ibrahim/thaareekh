# Manual Verification Batch E — 2026-02-19

## Scope
- Follow-up closure after Batch D deferred `CLM-0644` (`spouse|P30|P218|married`).
- Implemented graph-level structural correction in `src/data/sovereigns.js`:
  - removed `spouse|P30|P218|married`
  - added `spouse|P217|P218|married`
  - added `parent|P218|P30|`
  - added `parent|P218|P32|`
- Reconciled ledgers to graph state (`node scripts/reconcile-research-ledgers.mjs`), which generated:
  - `CLM-0654` `parent|P218|P30|`
  - `CLM-0655` `parent|P218|P32|`
  - `CLM-0656` `spouse|P217|P218|married`

## Manual Adjudication
- Approved and canonicalized:
  - `CLM-0654`
  - `CLM-0655`
  - `CLM-0656`
- Reviewer metadata set to:
  - `reviewer=manual-verification-batch-e`
  - `last_reviewed=2026-02-19`

## Evidence Basis
- RoyalArk `maldive4` founder lineage wording:
  - Dori Kuja (Hilali Kalo) married Golavehi/Kalavahi Kabulo
  - Hassan al-Hilali and Hussain are presented as their twin sons
- URL:
  - `https://www.royalark.net/Maldives/maldive4.htm`

## Integration Notes
- `CLM-0644` is no longer present as an active ledger row after reconciliation; stale row was archived by reconciliation tooling.
- Person coverage for `P217`, `P218`, `P30`, `P32` updated to `verified_manual_batch_e`.


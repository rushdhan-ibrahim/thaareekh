# Manual Verification Batch B (2026-02-19)

Scope: Portuguese-Hilaaly bridge corridor (`P61/P66/P67/P97/P101/P209/P210/P211/P212/P213`) with direct lineage and sibling-set claims sourced from RoyalArk M16 and Batch I extraction artifacts.

## 1) Claims Approved (Canonical)

1. `CLM-0580` `parent|P213|P97|`
2. `CLM-0605` `parent|P61|P209|`
3. `CLM-0606` `parent|P61|P210|`
4. `CLM-0607` `parent|P61|P211|`
5. `CLM-0608` `parent|P61|P212|`
6. `CLM-0609` `parent|P66|P213|`
7. `CLM-0625` `sibling|P209|P66|brothers (same parents: Dom Manoel + Dona Leonor)`
8. `CLM-0628` `sibling|P210|P66|brothers (same parents: Dom Manoel + Dona Leonor)`
9. `CLM-0630` `sibling|P211|P66|siblings (same parents: Dom Manoel + Dona Leonor)`
10. `CLM-0631` `sibling|P212|P66|siblings (same parents: Dom Manoel + Dona Leonor)`
11. `CLM-0632` `sibling|P213|P67|siblings (same parents: Dom Joao + Dona Francisca)`
12. `CLM-0641` `spouse|P101|P66|married at Cochin before Nov 1587`

All claims above are marked `review_status=approved`, `canonical_decision=approved`, `reviewer=manual-verification-batch-b`, `last_reviewed=2026-02-19` in `relationship-evidence-ledger.csv`.

## 2) Evidence Basis Used

1. `EXT-061` (`SRC-ROYALARK-M16`) quote-level extraction packet for Dom Manoel / Dom Joao branch relationships.
2. `EXT-062` (`SRC-DESILVA-PORT-ENCOUNTERS`) corroborative historical context for Portuguese-period branch continuity.
3. Batch I findings cross-check:
- `docs/research-program/findings/phase1-batch-i-quote-and-corroboration.md`
- `docs/research-program/findings/phase1-batch-h-foundational-extractions.md`

## 3) Person Coverage Updates

Updated to `verified_manual_batch_b` in `person-coverage.csv`:
- `P61`
- `P66`
- `P67`
- `P97`
- `P101`
- `P209`
- `P210`
- `P211`
- `P212`
- `P213`

## 4) Integrity Note

Batch B intentionally consolidates the Portuguese bridge under `P213` lineage continuity and keeps removed duplicate-node corridors (`P96` pathway) out of active ledgers and active inference dossier set.

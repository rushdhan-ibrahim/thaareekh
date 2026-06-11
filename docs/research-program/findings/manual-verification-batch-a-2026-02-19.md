# Manual Verification Batch A (2026-02-19)

Scope: high-impact transition corridor around `P74/P76`, `P78/P79`, and `P86/P88/P91/P95/P129`, plus legacy removed-edge checks for `P101/P97` and `P109/P30`.

## 1) Decisions Applied

1. `sibling|P78|P79|brothers`
- Status: confirmed direct claim (`c`, grade `B`).
- Manual decision: approved as canonical.
- Ledger row: `CLM-0447`.

2. `kin|P74|P76|cousins (fathers were brothers)`
- Status: confirmed direct claim (`c`, grade `B`).
- Manual decision: approved as canonical; supersedes older nephew phrasing.
- Ledger row: `CLM-0647`.

3. `kin|P86|P95|great-grandfather (maternal: P86→P87→P129→P95)`
- Status: confirmed direct claim (`c`, grade `B`).
- Manual decision: approved as canonical maternal-chain relation.
- Ledger row: `CLM-0648`.

4. `sibling|P91|P129|half-siblings (shared mother P185)`
- Status: confirmed direct claim (`c`, grade `B`).
- Manual decision: approved as canonical; replaces older inferred shared-parent wording.
- Ledger row: `CLM-0649`.

## 2) Explicitly Removed/Not Present (Validated)

1. `kin|P88|P95|grandfather?`
- Current graph status: absent.
- Manual outcome: remains removed.

2. `kin|P101|P97|grandparent`
- Current graph status: absent.
- Manual outcome: remains removed.

3. `kin|P109|P30|grandparent`
- Current graph status: absent.
- Manual outcome: remains removed.

## 3) Integrity Corrections Completed

1. Reconciled ledgers to live graph (`204` people / `581` edges / `308` inferred).
2. Archived stale inference tracker rows to ledger archive.
3. Archived `33` orphan inference dossier markdown files under:
- `docs/research-program/inferences/archive-2026-02-19/`
4. Updated manual-review metadata for verified claims in `relationship-evidence-ledger.csv`.
5. Updated person coverage statuses for this batch to `verified_manual_batch_a`.

## 4) Follow-on Priority

1. Complete full person dossier refresh to propagate post-reconciliation relation text across all people files.
2. Run updated `qa-research-ledgers.mjs` key-level integrity checks (set equality + orphan dossier detection).
3. Start Manual Verification Batch B (next relation corridor and biographies).

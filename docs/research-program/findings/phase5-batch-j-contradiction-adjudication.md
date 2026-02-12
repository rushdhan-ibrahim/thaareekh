# Phase 5 Batch J Contradiction Adjudication

Date: 2026-02-10  
Status: round-1 adjudication pass completed

## Scope
Adjudication pass for contradiction cluster `CLOG-2026-02-09-D1` through `CLOG-2026-02-09-D5` using current graph state, ledgers, and Batch H/I extraction packets.

## Decision summary

### D1 — P61 chronology
- Outcome: partially resolved in model direction.
- Current model reflects `1531/1584` framing with uncertainty notes.
- Remaining open point: exact archival-grade terminal chronology still not fixed by a primary record citation.

### D2 — P67 birth/death/issue
- Outcome: issue-line conflict resolved; chronology precision still open.
- Resolved part: model no longer routes descendants through P67 and treats Huraagey bridge through P213.
- Remaining open point: final death-year precision among competing reports.

### D3 — P27 maternal parentage
- Outcome: resolved in model.
- Current model explicitly carries both parent links (`P26 -> P27`, `P25 -> P27`) and no longer suppresses maternal attribution.

### D4 — P41 paternal parentage
- Outcome: managed contradiction state.
- Canonical route remains `P39 -> P41`.
- Alternate `P40 -> P41` remains retained as `u/D` contested evidence for transparency and future verification.

### D5 — P60/P61 sibling typing
- Outcome: resolved in model.
- Current model uses maternal half-brother classification with explicit shared-mother pathway.

## Ledger alignment in this pass
- Updated contradiction-sensitive relationship rows:
  - `CLM-0595` (P25->P27)
  - `CLM-0596` (P39->P41)
  - `CLM-0599` (P40->P41 alternate; set to deferred canonical decision)
  - `CLM-0640` (P60<->P61 half-brothers)
- Added contradiction updates section in:
  - `docs/research-program/contradiction-log.md` (`CLOG-2026-02-10-J1`..`J5`)

## Next action queue
1. Run a focused quote-level extraction pass for `SRC-ROYALARK-MALDIVES` rows tied to D3/D4/D5 so these claims can move from generic locator text to pair-specific wording.
2. Execute archival follow-up lane for D1/D2 chronology precision (Goa/Cochin/Portuguese chronicle primary records).
3. After quote-level refresh, run a contradiction closure pass to convert resolved items from “managed/open” to explicitly “closed in model” where no unresolved branch remains.

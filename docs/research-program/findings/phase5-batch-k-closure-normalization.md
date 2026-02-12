# Phase 5 Batch K Contradiction Closure Normalization

Date: 2026-02-10  
Status: completed

## Purpose
Normalize D1..D5 contradiction states after Batch J so the log, ledgers, and model state communicate the same closure level.

## Outcome matrix

| Contradiction | Current state | Notes |
|---|---|---|
| D1 (P61 chronology) | Open (precision-only) | Structural direction is settled in-model; archival-grade exact dates still pending. |
| D2 (P67 issue/chronology) | Mixed: issue closed, chronology open | No modeled descendants via P67; death-year precision remains disputed. |
| D3 (P27 maternal parentage) | Closed in model | Dual-parent representation (`P25` + `P26`) retained canonically. |
| D4 (P41 paternal parentage) | Managed contradiction | Canonical `P39 -> P41`; alternate `P40 -> P41` preserved as contested `u/D`. |
| D5 (P60/P61 sibling type) | Closed in model | Maternal half-brother classification is canonical. |

## Ledger alignment applied in Batch K
- `CLM-0595` promoted to approved canonical status (D3 closure).
- `CLM-0596` promoted to approved canonical status (D4 canonical branch).
- `CLM-0599` retained deferred as contested alternate evidence (D4 alternate branch).
- `CLM-0640` promoted to approved canonical status (D5 closure).

## New archival follow-up lane (for remaining open chronology work)
- `SRCQ-048`: Portuguese chronicle extraction for P61/P67 chronology adjudication.
- `SRCQ-049`: Goa/Cochin archival registry lane for baptism/death-event corroboration.
- `EXT-067`, `EXT-068`: extraction-log entries opened for those two follow-up tracks.
- Initial scout outcome is documented in `docs/research-program/findings/phase5-batch-k-couto-corpus-scout.md` and confirms that chronology-closing named statements are still pending.

## Next execution target
1. Extract quote-locatable chronology statements from `SRC-DIOGO-COUTO`.
2. Capture an archival registry citation pathway for Cochin/Goa entries linked to P61/P67 chronology.
3. Re-run contradiction closure review and downgrade active contradictions list if chronology precision is resolved.

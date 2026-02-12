# Phase 5 Batch K Diogo do Couto Corpus Scout

Date: 2026-02-10  
Status: initial scout completed

## Objective
Identify whether currently accessible `Da Asia` OCR corpora contain direct chronology statements usable for D1/D2 (`P61` Dom Manoel and `P67` Dom Philippe).

## Method
1. Queried Archive.org `Da Asia` identifiers (Barros + Couto corpus) via advanced search.
2. Downloaded available `_djvu.txt` OCR texts for identifier-level scanning.
3. Searched for Maldives tokens (`maldiua|maldiva|maldive`) and then screened for name-linked chronology cues (`dom manoel`, `dom felipe`, `rei de maldiv*`).

## Scout result
- Identifiers scanned from discovery set: 28
- Identifiers with Maldives-token hits: 17
- Highest-hit files:
  - `daasiadejoodebar03p1barr` (30)
  - `decadaprimeirate02barr` (29)
  - `daasiadejoodebar01p2barr` (6)
  - `daasiadejoodebar04p1barr` (5)
  - `daasiadejoodebar04p3barr` (5)

## Key finding for D1/D2
- The sweep recovered many Maldives-route and island-context mentions.
- It did **not** recover direct, quote-ready chronology statements for:
  - Dom Manoel (`P61`) birth/death timing
  - Dom Philippe (`P67`) birth/death/issue timing
- Therefore, this lane improves corpus mapping but does not close D1/D2 chronology precision.

## Evidence snippets (identifier + line references)
- `daasiadediogodec01cout`: line 3135 (`Ilhas de Maldiva` geography context)
- `daasiadejoodebar03p1barr`: lines 5837, 5858 (`Ilha Maldiva` + unnamed king context)
- `daasiadejoodebar10p1barr`: line 2504 (`Ilhas de Maldivas, cujo Rey ...` generic king reference)
- `decadaquartadaas00cout`: lines 1976, 3739 (`ilhas de Maldiua` route/operation context)

## Next extraction move
1. Chapter-level manual OCR cleanup on the identified high-hit files where king references appear.
2. Parallel archival registry lane (`goa-cochin-archive-lane`) for baptism/death-event record-series discovery.
3. Re-evaluate D1/D2 only after one named, date-bearing primary excerpt is captured.

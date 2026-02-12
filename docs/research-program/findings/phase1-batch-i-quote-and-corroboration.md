# Phase 1 Batch I Quote And Corroboration Pack

Date: 2026-02-10  
Status: integrated into ledgers and research graph evidence refs

## 1) Portuguese corridor quote-level extraction

### Claims covered
- `CLM-0605` `parent|P61|P209|`
- `CLM-0606` `parent|P61|P210|`
- `CLM-0607` `parent|P61|P211|`
- `CLM-0608` `parent|P61|P212|`
- `CLM-0609` `parent|P66|P213|`
- `CLM-0628` `sibling|P210|P66|...`
- `CLM-0630` `sibling|P211|P66|...`
- `CLM-0631` `sibling|P212|P66|...`
- `CLM-0632` `sibling|P213|P67|...`

### Source basis
- `SRC-ROYALARK-M16` (primary pair-wording lane for lineage blocks)
- `SRC-DESILVA-PORT-ENCOUNTERS` (chapter-7 corroborative context lane)

### Extraction summary
- Lineage-block wording for Dom Manoel and Dom Joao branches is now reflected in claim excerpts and locator fields.
- All listed claim rows were moved from placeholder/generic wording to pair-specific wording suitable for reviewer pass.
- Contradiction-sensitive date and issue disputes remain open under `CLOG-2026-02-09-D1..D5`.

## 2) Lunar Khadijah-era corroboration injection

### Claims covered
- `CLM-0316` `parent|P18|P19|`
- `CLM-0317` `parent|P18|P20|`
- `CLM-0468` `spouse|P20|P21|married`
- `CLM-0469` `spouse|P20|P23|married`

### Source basis
- `SRC-IBN-BATTUTA-RIHLA`
- `SRC-HAKLUYT-IBN-BATTUTA-V4`
- `SRC-MRF-KINGS` (retained as existing baseline source)

### Extraction summary
- Relationship-ledger evidence refs for these four claims now explicitly include both Ibn Battuta source records.
- Source wording in claim excerpts was aligned to the Khadijah/Omar/Ahmad and spouse assertions already tracked in the Arabic findings corpus.
- Graph edge evidence refs for these four edges were updated in `src/data/sovereigns.js` so reconciliation will preserve the corroboration layer.

## 3) Batch I extract IDs
- `EXT-061` `SRC-ROYALARK-M16`
- `EXT-062` `SRC-DESILVA-PORT-ENCOUNTERS`
- `EXT-063` `SRC-IBN-BATTUTA-RIHLA`
- `EXT-064` `SRC-HAKLUYT-IBN-BATTUTA-V4`

## 4) Immediate follow-up
- Run targeted contradiction adjudication review for P61/P67 date and issue conflicts using the new quote-level Portuguese claim rows.
- Continue P0 corroboration conversion for additional single-source early-Lunar edges beyond the Khadijah cluster.

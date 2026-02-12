# Phase 1 Batch H Foundational Extractions

Date: 2026-02-10  
Status: active extraction lane (`P0` foundations)

## Scope
Batch H activates four foundational `P0` sources that had been registered but not yet represented in the extraction ledgers:

- `SRC-BELL-1940` (`SRCQ-026`)
- `SRC-IBN-BATTUTA-RIHLA` (`SRCQ-027`)
- `SRC-HAKLUYT-IBN-BATTUTA-V4` (`SRCQ-034`)
- `SRC-DESILVA-PORT-ENCOUNTERS` (`SRCQ-040`)

## Extraction packets

### 1) `SRC-BELL-1940` (foundational monograph)
- Evidence packet: dynasty-sequence corroboration lane + inscription-linked ruler anchors.
- Current extraction basis: `docs/research-program/findings/european-colonial-findings.md` sections 1.1-1.6.
- Immediate target output:
  - cross-dynasty corroboration priorities for early sovereign chains,
  - office/title semantics reinforcement tied to epigraphic evidence,
  - acquisition and quote-harvest plan for full-text constrained sections.

### 2) `SRC-IBN-BATTUTA-RIHLA` (primary eyewitness corpus)
- Evidence packet: Lunar 1340s kinship and court-role claims.
- Current extraction basis: `docs/research-program/findings/arabic-islamic-findings.md` sections 1.1-1.6 and claim table `G1-G13`.
- Direct graph targets already modeled:
  - `parent|P18|P19|` (`CLM-0316`)
  - `parent|P18|P20|` (`CLM-0317`)
  - `spouse|P20|P21|married` (`CLM-0468`)
  - `spouse|P20|P23|married` (`CLM-0469`)
- Key concept targets:
  - qadi/fandiyaaru authority semantics,
  - wazir power structure under a reigning sultana.

### 3) `SRC-HAKLUYT-IBN-BATTUTA-V4` (chapter-specific corroboration)
- Evidence packet: chapter-locatable corroboration lane for exact pair wording checks in the Lunar corridor.
- Current extraction basis: `docs/research-program/findings/arabic-islamic-findings.md` source entry 5.1 and sections 1.1-1.6.
- Immediate target output:
  - pair-level corroboration against already modeled edges,
  - adjudication support for contested conversion and ancestry narratives.

### 4) `SRC-DESILVA-PORT-ENCOUNTERS` (translated Portuguese primary layer)
- Evidence packet: Portuguese-period bridge hardening with contradiction focus.
- Current extraction basis: `docs/research-program/findings/european-colonial-findings.md` sections 2.1-2.10.
- Direct graph targets already modeled:
  - `parent|P61|P209|` (`CLM-0605`)
  - `parent|P61|P210|` (`CLM-0606`)
  - `parent|P66|P213|` (`CLM-0609`)
- Sibling bridge target:
  - `sibling|P213|P67|siblings (same parents: Dom Joao + Dona Francisca)` (`CLM-0632`)
- Contradiction targets:
  - `CLOG-2026-02-09-D1` through `CLOG-2026-02-09-D5`.

## Batch H integration completed in this pass
- Source queue rows `SRCQ-026`, `SRCQ-027`, `SRCQ-034`, and `SRCQ-040` promoted to `in_progress`.
- Source extract ledger rows `EXT-057` through `EXT-060` added.
- Relationship-ledger locator hardening completed for:
  - `CLM-0605`
  - `CLM-0606`
  - `CLM-0607`
  - `CLM-0608`
  - `CLM-0609`
  - `CLM-0628`
  - `CLM-0630`
  - `CLM-0631`
  - `CLM-0632`

## Next-step execution target
- Convert Batch H source packets into additional corroboration rows for high-risk single-source edges in Lunar/Hilaaly early dynastic corridors while maintaining contradiction-first handling for the Portuguese bridge cluster.

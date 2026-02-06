# Archival Sweep + Missed Links Review (Round 4)

Date: 2026-02-06

## Actions completed
1. Targeted sweep for:
- Nasheed parentage (official/primary preference)
- Abdul Majeed Didi chain intermediaries into pre-republic sovereign lines

2. Applied evidence-backed staging updates in `src/data/sovereigns.research.js`.

## New integrations this round

### A) Nasheed family expansion (documented)
Added nodes:
- `P125` Meera Laila Nasheed
- `P126` Zaya Laila Nasheed

Added edges:
- `P122 -> P125`
- `P123 -> P125`
- `P122 -> P126`
- `P123 -> P126`

Source basis: `SRC-WIKI-NASHEED` (secondary, explicit child names)

### B) Abdul Majeed/Fareed intermediary clarification
Added node:
- `P129` Princess Veyogey Dhon Goma (alias: Don Goma)

Added edges:
- `P129 -> P95` (`c`, grade `B`)
- `P87 -> P129` (`i`, grade `B`; inferred from existing royal notes lineage statement)

This refines the late Huraagey -> modern continuity chain:
- `P87 -> P129 -> P95 <- P111`

### C) Existing key bridge retained from prior round
- `P111 -> P95` (Abdul Majeed Didi -> Muhammad Fareed Didi)

## Current graph integrity and structure
Research mode totals:
- People: `115`
- Edges: `133`
- Evidence/grade coverage: `100%`
- Components: `19`
- Largest component: `70`

Modern cluster distribution:
- One large merged component now includes Amin/Nasir branch and historical royal line.
- Gayoom branch remains separate (`3` nodes).
- Nasheed nuclear family remains separate (`4` nodes).

## High-value missing links still pending

1. **Nasheed parentage** (still unresolved with current high-quality sources)
- Current official page reviewed does not provide explicit parent names.
- Secondary sources used so far did not provide sufficient confidence for robust parent edges in this dataset context.
- Status: hold parent edges for `P122` until stronger citation is obtained.

2. **Gayoom branch bridge to historical line**
- `P119/P121/P120` cluster is internally well linked.
- Missing explicit person-by-person chain to a specific sovereign node.
- Status: keep as separate modern cluster until chain is documented.

3. **Ibrahim Nasir deep-chain formalization**
- One inferred historical-context link exists (`P115 <-> P81`), but intermediary steps are not fully specified.
- Status: still a targeted archival task.

## Analyst judgment: strongest next targets
1. Official biographies/archival records for Nasheed parent names.
2. Documentary family trees for Gayoom paternal/maternal lines.
3. Named intermediaries linking Abdul Majeed and Nasir branches to specific late-Huraagey household members beyond already-added nodes.

## Sources used in this round
- https://presidency.gov.mv/PO/FormerPresident/4
- https://presidency.gov.mv/PO/FormerPresident/5
- https://en.wikipedia.org/wiki/Mohamed_Nasheed
- https://en.wikipedia.org/wiki/Muhammad_Fareed_Didi
- https://en.wikipedia.org/wiki/Abdul_Majeed_Didi
- https://maldivesroyalfamily.com/maldives_kings_list.full.shtml


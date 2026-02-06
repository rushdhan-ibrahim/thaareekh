# Addu/Fuvahmulah + Gayoom Bridge Investigation (Round 6)

Date: 2026-02-06

## What was investigated
1. Gayoom branch linkage to historical lines.
2. Addu and Fuvahmulah family-tree branches connected to the banished Dhiyamigili crown-prince line.

## Integrated model updates

### A) Dhiyamigili exile branch (Fuvahmulah)
Added nodes:
- `P130` Prince Ibrahim Faamuladheyri Kilegefaanu
- `P131` Mohamed Didi (southern-provinces successor line)

Added edges:
- `P81 -> P130` (`c`, grade `B`)
- `P130 -> P131` (`c`, grade `B`)

### B) Addu maternal-line chain into Gayoom branch
Added nodes:
- `P132` Al-Naib Muhammad Thakurufaanu of Addu
- `P133` Ibrahim Al-Husainee
- `P134` Galolhu Seedhi
- `P135` Galolhu Sitti

Added edges:
- `P132 <-> P133` (`c`, grandparental context)
- `P133 -> P134` (`c`)
- `P134 -> P135` (`c`)
- `P135 -> P120` (`c`)

### C) South-branch continuity hypothesis
Added inferred bridge:
- `P130 <-> P132` (`i`, grade `B`) label `possible southern-branch continuity (Addu/Fuvahmulah)`

This is explicitly marked inferred because current sources support regional/lineage continuity but not full step-by-step parent chain.

## Structural effect
Research-mode graph now:
- People: `123`
- Edges: `142`
- Components: `18`
- Largest component: `79`

Notable result:
- Gayoom branch now sits inside the largest historical-modern connected component.

## Remaining key uncertainty
- `P130 <-> P132` should be upgraded only when person-by-person intermediary chain is sourced.

## Sources used
- https://en.wikipedia.org/wiki/Prince_Ibrahim,_Faamuladheyri_Kilegefaanu
- https://en.wikipedia.org/wiki/Abdul_Gayoom_Ibrahim
- https://en.wikipedia.org/wiki/Abdul_Majeed_Didi
- https://en.wikipedia.org/wiki/Muhammad_Fareed_Didi
- https://atolltimes.mv/post/news/3844
- https://presidency.gov.mv/PO/FormerPresident/4
- https://presidency.gov.mv/PO/FormerPresident/5


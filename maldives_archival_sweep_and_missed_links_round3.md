# Archival Sweep + Missed Links Review (Round 3)

Date: 2026-02-06

## What was done
1. Archival/source sweep on Abdul Majeed Didi and modern leaders.
2. Added A/B-backed modern-family nodes/edges to research dataset.
3. Ran full graph linkage analysis to identify remaining disconnected clusters and likely bridges.

## Links newly integrated this round

### A/B-backed bridge into historical line
- `P111 (Prince Abdul Majeed Didi) -> P95 (Mohamed Farid)` as parent (`c`, grade `B`)
- Evidence: `SRC-WIKI-ABDUL-MAJEED`, `SRC-WIKI-MUHAMMAD-FAREED`

### Additional continuity bridge
- `P104 (Mohamed Thakurufaanu) <-> P68 (Mohamed Imaduddine I)` as inferred kin continuity (`i`, grade `B`)
- Evidence: `SRC-MRF-UTHEEM`, `SRC-WIKI-MONARCHS`
- Purpose: connects de-facto Utheemu restoration branch to legal Utheemu sovereign branch.

## Current graph status (research mode)
- People: `112`
- Edges: `127`
- Components: `19` (reduced from 21)
- Largest component: `69`
- Evidence/grade coverage: `100%` of edges

## Modern-family nodes added
- Amin branch: `P110..P114`
- Nasir branch: `P115..P118`, `P124`
- Gayoom branch: `P119..P121`
- Nasheed branch: `P122..P123`

## High-confidence potential missed links (not yet added)

1. Nasheed parentage nodes
- `P122` currently only linked to spouse (`P123`)
- Need stronger official/primary parentage documentation before adding parent edges.

2. Explicit Maumoon-to-royal chain
- `P119` has strong modern family links, but explicit person-by-person path to specific historical sovereign nodes is still missing in current high-quality sources.

3. Ibrahim Nasir deep royal-chain formalization
- We already added inferred lineage context to Dhiyamigili-era node (`P115 <-> P81`), but a complete named chain with intermediary persons should be captured before promotion to canonical.

4. Amin Didi "female-line reigning branch" explicit path
- Official profile confirms the claim conceptually, but intermediary person sequence is not yet encoded.

## Lower-confidence structural opportunities
- Early Lunar cluster still has several small disconnected components (`P1-P3`, `P4`, etc.) due to sparse explicit kin data.
- These should be linked only when direct kin statements are located in primary/chronicle materials.

## Recommended next patch order
1. Add Nasheed parent nodes only with official evidence (`A/B`).
2. Build named intermediary chain from Abdul Majeed line to pre-republic sovereign nodes.
3. Expand Maumoon branch with explicit intermediary persons if documentary evidence found.
4. Run component analysis after each batch to verify meaningful merge improvements.

## Sources used this round
- https://presidency.gov.mv/PO/FormerPresident/7
- https://presidency.gov.mv/PO/FormerPresident/6
- https://presidency.gov.mv/PO/FormerPresident/5
- https://presidency.gov.mv/PO/FormerPresident/1
- https://en.wikipedia.org/wiki/Abdul_Majeed_Didi
- https://en.wikipedia.org/wiki/Muhammad_Fareed_Didi
- https://en.wikipedia.org/wiki/Ibrahim_Nasir
- https://en.wikipedia.org/wiki/Maumoon_Abdul_Gayoom
- https://en.wikipedia.org/wiki/Mohamed_Nasheed
- https://en.wikipedia.org/wiki/List_of_Maldivian_monarchs
- https://maldivesroyalfamily.com/maldives_utheem.shtml

# Promotion Candidates — Round 1 (Strict)

Date: 2026-02-06
Scope: `src/data/sovereigns.research.js` only
Rule used: promote only nodes/edges that are confirmed (`c`) with grade `A/B`, and not dependent on any node that currently participates in inferred/uncertain edges.

## Summary
- Research staging totals: 39 people, 49 edges
- Strict Promote Batch A: 31 people, 18 edges
- Hold set: 8 people, 31 edges

## Batch A — Promote Now (strict safe)

### People IDs
`P96, P97, P98, P99, P100, P103, P105, P106, P107, P108, P109, P112, P113, P114, P116, P117, P118, P119, P120, P121, P122, P123, P124, P125, P126, P127, P128, P131, P133, P134, P135`

### Edges
1. `parent P96 -> P97` (`A`)
2. `parent P97 -> P98` (`B`)
3. `parent P98 -> P99` (`B`)
4. `parent P99 -> P100` (`B`)
5. `parent P109 -> P108` (`B`)
6. `parent P120 -> P121` (`A`)
7. `parent P120 -> P119` (`B`)
8. `sibling P119 <-> P121` (`A`)
9. `spouse P122 <-> P123` (`B`)
10. `parent P127 -> P122` (`B`)
11. `parent P128 -> P122` (`B`)
12. `parent P122 -> P125` (`B`)
13. `parent P123 -> P125` (`B`)
14. `parent P122 -> P126` (`B`)
15. `parent P123 -> P126` (`B`)
16. `parent P133 -> P134` (`B`)
17. `parent P134 -> P135` (`B`)
18. `parent P135 -> P120` (`B`)

## Batch B — Confirmed but Blocked by Inferred-Adjacency
These are `c` edges with `A/B` grades, but they touch nodes that also have inferred links; if you promote them, consider promoting the adjacent inferred context too.

1. `parent P66 -> P96` (`A`)
2. `parent P100 -> P80` (`A`)
3. `sibling P67 <-> P96` (`A`)
4. `parent P103 -> P104` (`A`)
5. `sibling P104 <-> P105` (`B`)
6. `parent P104 -> P106` (`B`)
7. `kin P61 <-> P104` (`B`)
8. `kin P66 <-> P104` (`B`)
9. `parent P107 -> P30` (`B`)
10. `parent P108 -> P30` (`B`)
11. `parent P111 -> P110` (`A`)
12. `parent P112 -> P110` (`A`)
13. `spouse P110 <-> P113` (`B`)
14. `parent P110 -> P114` (`B`)
15. `parent P116 -> P115` (`A`)
16. `parent P117 -> P115` (`A`)
17. `spouse P115 <-> P118` (`B`)
18. `parent P115 -> P124` (`B`)
19. `parent P111 -> P95` (`B`)
20. `parent P81 -> P130` (`B`)
21. `parent P130 -> P131` (`B`)
22. `kin P132 <-> P133` (`B`)
23. `parent P129 -> P95` (`B`)
24. `kin P76 <-> P77` (`B`)
25. `kin P81 <-> P82` (`B`)

## Hold nodes (strict)
`P101, P104, P110, P111, P115, P129, P130, P132`

Why these are held:
- Each currently participates in at least one inferred (`i`) relationship in staging, which fails the strict criterion.

## Recommendation
1. Promote Batch A immediately to canonical.
2. Promote Batch B in thematic sub-batches only after deciding whether to also promote adjacent inferred context.
3. Keep strict hold nodes in research mode until their inferred edges are either confirmed or separated.

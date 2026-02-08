# Source-Priority Correction Queue

Date: 2026-02-08
Mode baseline: `research`

## Goal
Prioritize factual hardening where inferred links have the highest downstream impact on user interpretation.

## Tier 1 — Curated inferred links (handcrafted review first)
These are non-derived inferred edges and should be reviewed claim-by-claim with explicit archival wording.

### A) Dynasty continuity bridges
- `kin P104 <-> P68` (reported Utheemu continuity bridge)
- `kin P130 <-> P132` (southern branch continuity hypothesis)
- `kin P132 <-> P182` (Addu/Meedhoo branch continuity)

### B) Modern political-family bridges
- `kin P110 <-> P115`
- `kin P111 <-> P115`
- `kin P122 <-> P168`

### C) Late-monarchy branch precision
- `kin P87 <-> P92`
- `parent P87 -> P129`
- `parent P80 -> P84`

### D) Early-chain sibling/parent completions
- `parent P13 -> P15`
- `sibling P5 <-> P7`
- `sibling P5 <-> P8`
- `sibling P6 <-> P8`
- `sibling P16 <-> P17`
- `sibling P19 <-> P25`
- `sibling P31 <-> P39`
- `sibling P31 <-> P40`
- `sibling P47 <-> P50`
- `sibling P47 <-> P51`
- `sibling P47 <-> P52`
- `sibling P50 <-> P51`
- `sibling P50 <-> P52`
- `sibling P78 <-> P79`
- `kin P31 <-> P32`

## Tier 2 — Rule-derived inferred links (bulk but auditable)
Derived rule edges now carry explicit machine-readable inference basis:
- `shared-parent-sibling`
- `parent-of-parent-grandparent`
- `parent-sibling-aunt-uncle`
- `children-of-siblings-cousin`

Current impact:
- 214 derived inferred edges in research mode.
- These should be sampled by dynasty and period, then either:
- retained as inferred with explicit basis, or
- replaced by direct sourced edges where textual support exists.

## Tier 3 — Source concentration risk
Current edge inference relies heavily on a small source subset:
- `SRC-DERIVED-RULES` (rule engine output)
- `SRC-MRF-KINGS`
- `SRC-WIKI-MONARCHS`

Hardening strategy:
- add primary or higher-authority corroboration for high-visibility bridges first.
- downgrade/remove inferred bridges when corroboration cannot be raised.

## Promotion policy
Move an inferred edge to confirmed only when:
1. Source text names the exact relation class for the exact node pair, and
2. The claim has at least one A/B-quality source with no direct contradiction.

If unresolved:
- keep as inferred with handwritten logic dossier, or
- remove from canonical and keep only in research staging.

# Cross-Dataset Missed Links Analysis

Date: 2026-02-06
Scope: full graph inventory including classical sovereign dataset, bridge additions, and modern political-family staging cluster.

## 1) Current structural picture
- Research-mode graph now has `112` people and `124` edges.
- Connected components reduced to `21` (from 23 before latest transition-edge additions).
- Largest component is `56` nodes (classical lines + some bridge chains).
- Modern political-family cluster is currently a separate component (expected, due to missing explicit chain-to-specific sultan individuals).

## 2) Missed links that were identified and now integrated
The following previously identified gaps are now integrated in research mode:
1. `P76 <-> P77`
- label: `dynastic overthrow transition`
- rationale: Isdu -> Dhiyamigili transition context
- confidence: `B`

2. `P81 <-> P82`
- label: `succession replacement transition`
- rationale: Dhiyamigili -> Huraagey replacement context
- confidence: `B`

## 3) High-priority potential links still missing (by confidence)

### A/B candidates (needs person-level chain citation, not just dynasty statement)
1. `Prince Abdul Majeed Didi` (`P111`) -> specific late Huraagey sovereign anchor (`P91`/`P95` etc.)
- Why likely: official Amin Didi profile states descent from Huraa sultans, but no explicit person-by-person chain in currently loaded sources.
- Current status: not added as direct edge to avoid false precision.

2. `Ibrahim Nasir` (`P115`) -> explicit royal anchor via Abdul Majeed line
- Why likely: secondary sources report descent from Abdul Majeed Didi and relation to Amin Didi.
- Current status: represented only as inferred modern-elite kin context (`P111 <-> P115`, `P110 <-> P115`).

3. `Maumoon Abdul Gayoom` (`P119`) -> explicit Huraa/Huraagey ancestor chain
- Why likely: repeated secondary statements about dynastic descent.
- Current status: not linked to a specific sultan node due to missing explicit chain steps.

### B/C candidates (contextual, should stay staging/inferred)
4. `Mohamed Nasheed` (`P122`) parentage and older-line links
- Why likely: prominent Malé political family with known public relations.
- Current status: spouse link captured; parent links withheld pending stronger citations.

5. Cross-links among modern clusters (`Amin/Nasir/Gayoom/Nasheed`) through Didi-family sub-branches
- Why likely: elite-family overlaps in Malé; frequent shared surnames/titles (`Didi`).
- Current status: only the strongest documented links added.

## 4) Edge-quality observations
- Strong over-representation of lineage claims at dynasty level compared with person-level chain citations.
- Where an official source says "descended from X dynasty" without chain detail, direct edge to a specific historical person is often too strong.
- Best practice for these cases:
  - add inferred `kin` edges to intermediary non-sovereign nodes once identified,
  - avoid direct jump edges to named sultans unless chain steps are explicit.

## 5) Recommended next research targets to close remaining gaps
1. Locate official/archival biography pages for:
- Prince Abdul Majeed Didi detailed lineage
- Ibrahim Nasir family tree publication
- Maumoon family archival/genealogy publications

2. Identify named intermediary persons connecting:
- Abdul Majeed branch <-> late Huraagey sovereign branch
- Gayoom paternal/maternal lines <-> documented royal nodes

3. For Mohamed Nasheed cluster:
- secure parentage and grandparent names from high-quality sources (official biographies, parliamentary records, reputable biographical references)

## 6) Practical integration policy (to avoid false links)
- `c` edges: only when person-to-person relation is explicit.
- `i` edges: allowed for well-supported family-context inferences, but must be labeled as inferred/contextual.
- `u` edges: keep in staging only; never promote to canonical until resolved.

## 7) Candidate patch queue for next round
1. Add modern intermediary Didi nodes once named in high-quality sources.
2. Add Abdul Majeed-to-specific-sultan chain only when person steps are sourced.
3. Add Nasheed parent nodes once primary/official evidence is obtained.


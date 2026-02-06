# Maldives Sovereigns Genealogy — Comprehensive Online Research Plan

## 1) Objective and scope
Build a source-backed, audit-ready genealogy that:
- validates every person and relationship in the current graph,
- fills missing people (including collateral and dead-end branches),
- resolves missing inter-dynasty links,
- expands identity data for each person: common name, regnal name, title style, aliases, transliterations, Christian/Islamic name changes, and honorific forms.

## 2) Core deliverables
- A master research ledger (one row per person, including non-sovereigns).
- A relationship evidence table (one row per edge claim).
- A source index with citation quality grading.
- A gap log of unresolved or conflicting claims.
- A change log mapping findings to graph updates.

## 3) Source strategy (priority order)
Use primary and near-primary sources first, then reputable secondary sources.

1. Maldivian institutional sources
- National Archives of Maldives
- Maldives government heritage/cultural portals
- National Museum publications/catalogues

2. Scholarly sources
- Peer-reviewed articles and monographs on Maldivian dynasties, Islamization, Portuguese period, and court chronicles.
- University repositories and JSTOR/Project MUSE/Brill/Cambridge/Oxford references.

3. Chronicle and document editions (translated/transliterated)
- Raadavali and related chronicle editions.
- Document collections containing regnal lists, succession disputes, and kinship notes.

4. Specialist genealogy compendia
- `maldivesroyalfamily.com`
- `royalark.net`

5. Tertiary cross-check
- Wikipedia and derivative summaries only for leads, never as sole evidence.

## 4) Evidence model and confidence rules
For each claim, capture:
- Claim type: `person`, `name_variant`, `parent`, `sibling`, `spouse`, `kin`, `dynasty_link`, `date`, `title`.
- Exact claim text (short extract), source URL, access date, and citation location (page/section).
- Confidence:
  - `A` = explicit in primary source or two independent high-quality sources.
  - `B` = explicit in one strong secondary source.
  - `C` = inferred from structured context (mark as inferred).
  - `D` = disputed/weak; keep out of canonical graph until confirmed.

Graph inclusion rule:
- `c` (confirmed): A/B only.
- `i` (inferred): C with explicit rationale.
- `u` (uncertain): D or unresolved conflict.

## 5) Research workflow (phase-by-phase)

### Phase 1: Baseline extraction and audit setup
- Export all current people and edges from `src/data/sovereigns.js`.
- Create two working tables:
  - `people_master`
  - `relationship_claims`
- Add current IDs (`P1..`) and sovereign ordinal numbers (`#1..#95`) as anchors.

### Phase 2: Identity expansion (all people)
For each person, collect:
- canonical display name,
- regnal name,
- throne numeral,
- title style (e.g., Sultan, Didi, Kilege, Katthiri),
- religious/baptismal names (Portuguese-Christian period),
- alternative transliterations and spelling variants,
- source language form if available (Dhivehi/Arabic/Portuguese forms).

Output:
- `name_variants` list with provenance per variant.

### Phase 3: Relationship completion (including dead branches)
- For every sovereign note and source mention, enumerate all first-degree relatives and named second-degree connectors.
- Add non-ruling bridge persons even with no descendants.
- Build explicit chains where dynastic transitions require intermediate persons.

Minimum completion checks per person:
- parents (or reason unknown),
- siblings (if mentioned),
- spouses/consorts,
- children (including those with no issue),
- dynasty attribution and rationale.

### Phase 4: Inter-dynasty bridge deep dive
Treat each bridge as a mini dossier with chain-of-evidence diagrams.

Priority bridges:
1. Lunar -> Hilaaly (Golaavahi Kambulo line and related claims).
2. Hilaaly -> Utheemu (Utheem branch and Thakurufan lineage).
3. Hilaaly -> Huraagey (Joao -> Donna Ines -> Dom Luis -> Dom Maraduru -> Hussain Daharadha -> Mohamed Faamuladeyri -> Hassan Izzuddine).
4. Diyamigili -> Huraagey transition (cousin links, depositional context, and succession legitimacy).
5. Marriage-based inter-dynasty links (e.g., Ali VI and Hilaaly princess lines).

### Phase 5: Chronology and accession reconciliation
- Reconcile accession ranges and duplicate accession identities.
- Verify same-person multi-accession mappings (`#61/#64/#65`, `#87/#89`, etc.).
- Align person-level life events to reign-level events without conflating identities.

### Phase 6: Conflict resolution protocol
When sources disagree:
- Prefer contemporaneous/primary over later summaries.
- Prefer explicit genealogy statements over narrative implication.
- Keep both claims with confidence labels if unresolved.
- Record adjudication note and why one claim is selected as canonical.

## 6) Query playbook for online research
Use structured searches combining person, ordinal, and dynasty keywords.

Patterns:
- `"Sultan" "[name]" "Maldives" genealogy`
- `"[regnal name]" "Raadavali"`
- `"[name variant]" "Hilaaly" OR "Huraa" OR "Utheem"`
- `"Donna Ines" "Dom Luis de Sousa" Maldives`
- `"Thakurufan" "Kateeb" "Utheem" lineage`
- `"Maldives" "dynasty" "Portuguese" "Goa"`

For each promising hit:
- capture URL immediately,
- extract exact relationship/name claim,
- log as independent confirmation or contradiction.

## 7) Data structure additions to support research output
Add research-facing fields (in staging data before production graph merge):
- `aliases: []`
- `regnal_names: []`
- `titles: []`
- `name_notes`
- `source_refs: []`
- per-edge `evidence_refs: []`

Keep production graph compact, but preserve full citation metadata in sidecar research files.

## 8) Quality gates before graph updates
A batch of edits is accepted only if:
- every new person has at least one source citation,
- every new edge has explicit evidence or marked inference,
- all inferred links are labeled and reversible,
- no orphan IDs or malformed edges,
- dynastic bridge chains are traversable end-to-end.

## 9) Work sequencing and estimated effort
1. Build ledger + import existing graph facts.
2. Complete identity expansion for all existing nodes.
3. Complete bridge dossiers (highest risk of current omissions).
4. Expand collateral/dead branches by dynasty.
5. Reconcile conflicts and finalize confidence labels.
6. Apply graph patch and re-run integrity checks.

## 10) Immediate next research sprint (recommended)
Sprint 1 targets highest structural risk:
- Hilaaly -> Huraagey chain full person list with names/titles/variants.
- Hilaaly -> Utheemu kin basis with explicit intermediary persons.
- Lunar -> Hilaaly maternal connection evidence quality review.
- Add all named non-sovereigns in those chains, even without descendants.

Completion criterion for sprint 1:
- each of the 3 bridges has a documented, source-cited chain with confidence grades and proposed graph edits.

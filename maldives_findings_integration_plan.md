# Maldives Genealogy Findings Integration Plan

Date: 2026-02-06
Project scope: integrate all completed and ongoing research findings into the graph app while preserving auditability and uncertainty semantics.

## 1) Outcome we are targeting
A graph that supports two equally important use cases:
- `Canonical view`: only strongly supported facts.
- `Research view`: full working set including inferred and uncertain claims, with visible evidence trail.

This avoids mixing provisional claims into the final narrative while still preserving research momentum.

## 2) Current-state constraints (from codebase)
- Data model is compact: `people[]` + `edges[]` in `src/data/sovereigns.js`.
- Edge confidence already exists as `c` (`c|i|u`) and is rendered by style.
- No citation/evidence objects are currently stored or shown.
- UI filters exist for dynasty, tree, and edge type only.
- Sidebar shows relation confidence tags but not source provenance.

## 3) Target data model (v2)

### 3.1 Keep existing fields for compatibility
- `people`: keep `id`, `n`, `nm`, `rg`, `dy`, `g`, `re`, `no`.
- `edges`: keep `t`, `s`, `d`, `l`, `c`.

### 3.2 Add research-grade metadata
Add optional fields without breaking old rendering:

For each person:
- `aliases: string[]`
- `regnal_names: string[]`
- `titles: string[]`
- `dynasty_notes?: string`
- `source_refs: string[]` (source IDs)
- `person_confidence?: "A"|"B"|"C"|"D"`

For each edge:
- `evidence_refs: string[]` (source IDs)
- `claim_type?: "direct"|"inferred"|"contested"`
- `event_context?: string` (for political transitions vs bloodline)
- `confidence_grade?: "A"|"B"|"C"|"D"`

Add a source registry file:
- `src/data/sources.js`
- shape: `{ id, url, title, publisher, access_date, quality, notes }`

## 4) Data architecture split

### 4.1 Separate canonical and staging datasets
- `src/data/sovereigns.core.js` -> stable canonical dataset (default app view)
- `src/data/sovereigns.research.js` -> pending/experimental additions
- `src/data/sovereigns.merge.js` -> deterministic merge function by mode

Modes:
- `canonical`: include `c` + selected `i` approved claims
- `research`: include all (`c/i/u`) + staging people

### 4.2 Why this split
- Prevents accidental promotion of uncertain claims.
- Makes PR review straightforward.
- Enables batch promotion workflow from research to canonical.

## 5) UI/UX redesign to accommodate confidence and sources

### 5.1 New top toolbar controls
Add:
- `Mode` selector: `Canonical | Research`
- `Confidence` filter chips: `Confirmed`, `Inferred`, `Uncertain`
- `Source quality` filter: `A/B/C/D`

### 5.2 Sidebar redesign
For selected person, show sections:
1. `Identity`
- canonical name, regnal name(s), aliases, titles

2. `Evidence`
- source list with quality badges (`A/B/C/D`)
- links open in new tab

3. `Relationships`
- each relation row includes
  - edge type
  - confidence badge (`c/i/u`)
  - source count (e.g., `3 sources`)

4. `Research notes`
- unresolved conflicts or wording caveats

### 5.3 Visual semantics in graph
- Keep current dashed styling for `i/u`.
- Add optional opacity scaling by `confidence_grade` (A highest).
- Add legend group for `Political transition edge` vs `Genealogical edge`.

### 5.4 Mobile parity
- Bottom sheet mirrors all sidebar sections including evidence links.
- Keep sections collapsible to avoid scroll overload.

## 6) Integration pipeline for all findings

### Phase 1: Model and scaffolding
1. Add `sources.js` and type shape docs (`docs/data-model-v2.md`).
2. Extend data accessors so missing new fields are safely handled.
3. Add merge-mode mechanism (`canonical`/`research`) with URL param support.

Acceptance:
- App behavior unchanged in canonical mode.

### Phase 2: Source backfill and IDs
1. Register all current sources from:
- `maldives_sovereigns_research.md`
- `maldives_sovereigns_online_research_plan.md`
- `maldives_sovereigns_sprint1_bridge_dossier.md`
2. Assign source IDs and attach to existing high-confidence bridge edges.

Acceptance:
- Every new Sprint finding references at least one source ID.

### Phase 3: Person/name expansion
1. Add bridge persons (`P96+`, and later `P110+`) in research dataset.
2. Populate aliases/regnal names/titles for existing + new people.
3. Normalize transliteration variants (single policy doc).

Acceptance:
- Search supports aliases and regnal names.

### Phase 4: Relationship integration
1. Apply all `c` edges from dossiers to research dataset.
2. Add `i/u` edges with explicit label and evidence_refs.
3. Distinguish political succession edges from bloodline edges.

Acceptance:
- No orphan nodes or malformed edges.
- Tree decomposition and filters still work.

### Phase 5: UI evidence features
1. Add confidence/source filters in toolbar.
2. Render evidence section in sidebar/bottom sheet.
3. Display source count and confidence per relation row.

Acceptance:
- User can isolate uncertain claims in one click.

### Phase 6: Promotion workflow
1. Add `docs/promotion-checklist.md` with required criteria.
2. Introduce a review script to find edges with no evidence_refs.
3. Promote approved records from research to core in batches.

Acceptance:
- Canonical dataset remains strictly evidence-backed.

## 7) Dhiyamigili-specific integration track
Treat as dedicated sub-batch because of mixed political vs genealogical claims.

Batch D1 (`confirmed`):
- Isdu -> Dhiyamigili transition edge (event context).
- Dhiyamigili -> Huraagey replacement edge (event context).

Batch D2 (`inferred/provisional`):
- marriage bridge for #78 with Isdhoo spouse node.
- cousin-label refinement for #81 <-> #82 pending stronger citation.

Rule:
- Keep Dhiyamigili bloodline-to-Huraagey claims out of canonical until direct genealogical text is cited.

## 8) Validation and QA

### 8.1 Automated checks (add script)
- unique person IDs
- valid edge endpoints
- no duplicate edge tuples (`t,s,d,l,c`)
- evidence_refs exist in source registry
- canonical mode contains no `u` edges

### 8.2 Manual checks
- regression test search, focus navigation, tree filter, mobile sheet
- inspect 10 critical bridge nodes for citation visibility
- verify legend and confidence semantics match rendering

## 9) Repository changes to schedule
- `src/data/sovereigns.core.js` (new)
- `src/data/sovereigns.research.js` (new)
- `src/data/sources.js` (new)
- `src/data/sovereigns.merge.js` (new)
- `src/main.js` (mode + filter wiring)
- `src/graph/filter.js` (confidence/source quality filters)
- `src/graph/rebuild.js` (edge rendering enhancements)
- `src/ui/sidebar.js` (evidence/identity sections)
- `index.html` (new controls + legend updates)
- `docs/data-model-v2.md` (new)
- `docs/promotion-checklist.md` (new)

## 10) Rollout sequence and risk control
1. Ship data model extensions behind defaults (no UI changes).
2. Ship evidence registry and attach sources to a small subset.
3. Ship mode toggle + confidence filters.
4. Ingest Sprint findings in research mode.
5. Promote confirmed subsets to canonical after checklist pass.

Key risk:
- Overloading graph with low-confidence links reduces readability.
Mitigation:
- mode separation + confidence filters + event-context edge type.

## 11) Immediate next execution plan (concrete)
1. Implement v2 scaffolding and non-breaking merge loader.
2. Integrate Sprint 1 confirmed bridge nodes/edges into `research` dataset.
3. Add evidence display in sidebar and per-edge source counts.
4. Run QA checks and produce first promotion candidate diff.

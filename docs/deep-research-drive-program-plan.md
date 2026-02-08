# Deep Research Drive Program Plan

Date: 2026-02-08  
Status: Execution in progress (research workspace active)

## 1) Program aim
Build a materially deeper, fully auditable knowledge base for the Maldives genealogy graph by expanding:
- every person profile,
- every relationship claim,
- every concept/system/title/office/institution/style,
- every relevant etymology, sobriquet, and naming variant,
while preserving strict source traceability and uncertainty semantics.

## 2) Baseline snapshot (as of 2026-02-08, research mode)
- people: 187
- edges: 471
- confidence split: 230 confirmed (`c`), 238 inferred (`i`), 3 uncertain (`u`)
- inferred split: 24 curated + 214 rule-derived
- registered sources: 60
- office catalog entries: 15
- office timeline periods: 6
- people with `source_refs`: 110/187
- people with `aliases`: 62/187
- people with `titles`: 46/187

## 3) Scope

### 3.1 Person-level scope (all nodes)
For each person, research and document:
- canonical name + transliteration variants,
- regnal names and throne numbering context,
- titles, styles, honorifics, sobriquets,
- offices held (with dates/period notes where known),
- kinship claims (direct and collateral),
- geography (atoll/island/exile/migration relevance),
- event participation (succession, deposition, reforms, conflicts),
- evidence quality and open conflicts.

### 3.2 Knowledge-domain scope (non-person entities)
Create explicit knowledge coverage for:
- dynastic systems and succession logic,
- state offices and institutional structures,
- court/legal/religious titles and role semantics,
- naming systems (Islamic, royal, Portuguese-Christian, modern),
- etymology and language forms (Dhivehi/Arabic/Portuguese/English),
- political context concepts (restoration, deposition, regency, legitimacy).

## 4) Required deliverables
1. `Person Dossiers`: one dossier per person ID with citations and unresolved questions.
2. `Relationship Evidence Ledger`: one row per edge claim with claim text and source anchors.
3. `Concept & Institution Lexicon`: definitions, periodization, and source-backed usage examples.
4. `Title/Style Register`: title meanings, rank/context shifts, and period applicability.
5. `Etymology/Sobriquet Register`: explained origins and source-backed attestation.
6. `Inference Dossier Set`: one handcrafted explanation per inferred edge pair.
7. `Confidence & Grade Explainer`: user-readable explanation of `c/i/u` and `A/B/C/D`.
8. `Contradiction Log`: explicit competing claims and adjudication notes.
9. `Promotion Queue`: candidate claims ready to move from research to canonical.

## 5) Evidence and inference policy

### 5.1 Source and claim rules
- No claim enters structured data without at least one source ID.
- Each claim must store the precise relation/entity statement, not only a page URL.
- Grade assignment (`A/B/C/D`) must be justified in a short note.
- Conflicts are preserved, not silently overwritten.

### 5.2 Inferred edge policy (strict)
Every inferred edge (`c: "i"`) must have a node-specific dossier, including rule-derived edges.

Minimum dossier content for each inferred pair:
1. Edge identity: exact pair + relation type + label.
2. Why this specific pair: prose summary tied to those two nodes.
3. Logic chain: explicit step-by-step reasoning using cited supporting facts/edges.
4. Alternatives considered: plausible competing interpretations.
5. Upgrade criteria: exact evidence needed to promote to confirmed.
6. Downgrade/removal criteria: exact contradiction conditions.
7. Source list: IDs plus quoted claim fragments in notes.

Rule-derived basis metadata can remain machine-readable, but user-visible reasoning must be handcrafted per pair.

### 5.3 Public explainability requirement
Ship a clearly understandable user-facing explainer covering:
- what `Confirmed`, `Inferred`, and `Uncertain` mean,
- what source grades `A/B/C/D` mean,
- how inference is produced and reviewed,
- where users can inspect pair-specific inference dossiers.

## 6) Workstreams

### WS0: Program setup and tooling
- Freeze a baseline snapshot and metric report.
- Define dossier templates and naming conventions.
- Define claim/citation schema for research logs.
Output: ready-to-use research workspace with templates and QA script hooks.

### WS1: Source expansion and indexing
- Build a prioritized source queue by dynasty/period/topic.
- Add source metadata (publisher, quality, date, access status, notes).
- Track source concentration risk and diversify high-impact claims.
Output: expanded, graded source registry and retrieval backlog.

### WS2: Person dossier expansion
- Run dynasty-by-dynasty deep pass for all people.
- Capture identity variants, titles, offices, timeline anchors, family links.
- Mark unknowns explicitly instead of implicit gaps.
Output: full dossier coverage for 100% of person nodes.

### WS3: Concept/system/title/institution deep pass
- Build structured entries for offices, institutions, styles, and legal/political concepts.
- Record period shifts in meaning and function.
- Link concept entries to person and event claims.
Output: lexicon layer supporting historical interpretation.

### WS4: Inference hardening and documentation
- Generate full inferred-edge inventory.
- Produce handcrafted pair-specific dossiers in priority order (high-visibility first).
- Align `src/data/inference-notes.js` summaries with full dossiers.
Output: complete inference explainability pack with upgrade paths.

### WS5: Conflict resolution and factual hardening
- Triage contradictions by severity and graph impact.
- Adjudicate with explicit selection rationale and fallback stance.
- Prepare promotion candidates where evidence reaches threshold.
Output: contradiction log + promotion-ready claim sets.

### WS6: Integration and UX clarity
- Map vetted findings into data files (`people`, `edges`, `sources`, enrichments).
- Surface confidence/grade explanations in sidebar/legend/evidence views.
- Link inferred edges to their detailed pair dossier.
Output: verifiable, user-readable research-mode experience.

## 7) Phased execution plan

### Phase 0 (Preparation, 2-3 days)
- Finalize templates, folder structure, QA checks, and baseline metrics.
- Lock editorial conventions (transliteration, title casing, citation style).

### Phase 1 (Source sweep, 1-2 weeks)
- Expand and grade source inventory across all dynasties and modern branches.
- Build topic queues: persons, institutions, titles, etymologies.

### Phase 2 (Person deepening, 2-4 weeks)
- Complete dossiers for all existing nodes; add missing collateral people where needed.
- Backfill `source_refs`, aliases, titles, offices at scale.

### Phase 3 (Concept and institution deepening, 1-2 weeks)
- Complete lexicon coverage for systems/titles/offices/institutions/styles.
- Connect each concept entry to concrete person/time examples.

### Phase 4 (Inference dossier program, 1-2 weeks)
- Author handcrafted dossier for each inferred pair (start with 24 curated, then 214 derived).
- Align UI-facing summaries and verification checklist for each pair.

### Phase 5 (Conflict adjudication + promotion, ongoing in batches)
- Resolve top-impact contradictions.
- Promote only claims meeting canonical thresholds.

### Phase 6 (Explainability release, parallel with phases 4-5)
- Publish confidence/grade explainer and pair-level inference access in UI.
- Run user-verifiability review pass.

## 8) Repository artifact plan (planned additions)
- `docs/research-program/templates/person-dossier.md`
- `docs/research-program/templates/concept-entry.md`
- `docs/research-program/templates/inference-dossier.md`
- `docs/research-program/people/<person-id>.md`
- `docs/research-program/concepts/<concept-id>.md`
- `docs/research-program/inferences/<edge-key>.md`
- `docs/research-program/title-style-register.md`
- `docs/research-program/etymology-sobriquet-register.md`
- `docs/confidence-grade-explainer.md`
- `docs/research-program/contradiction-log.md`
- `docs/research-program/promotion-queue.md`

## 9) Quality gates and completion criteria
- 100% of people have dossier coverage.
- 100% of edges have evidence references.
- 100% of inferred edges have handcrafted pair-specific logic dossiers.
- All `A/B` claims have explicit citation anchors.
- No canonical promotion for unresolved `D`-grade claims.
- User can inspect relation confidence and evidence without hidden assumptions.

## 10) Risks and controls
- Risk: source monoculture biases conclusions.
  - Control: enforce source-diversity targets on high-impact claims.
- Risk: inferred edges overwhelm readability.
  - Control: pair dossiers + confidence filters + staged promotion.
- Risk: terminology drift across eras.
  - Control: concept lexicon with period-specific definitions.
- Risk: ingestion outpaces verification.
  - Control: batch gates; no promotion without checklist pass.

## 11) Pre-research kickoff checklist
- Approve this plan and phase sequencing.
- Confirm dossier templates and storage paths.
- Confirm first execution batch order:
1. High-impact inferred bridges
2. Core sovereign clusters
3. Concept/institution lexicon expansion
- Begin Phase 0 only after checklist sign-off.

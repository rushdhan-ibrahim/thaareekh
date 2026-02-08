# Visual Design Overhaul Plan

Date: 2026-02-06

## Objectives
1. Make the experience beautiful, culturally grounded, and emotionally rich while preserving research rigor.
2. Make exploration dramatically easier, faster, and more reliable on desktop and mobile.
3. Remove current interaction bugs and establish a maintainable UI system for future growth.

## Design Direction

### Theme concept: "Reef Chronicle"
- Visual mood: warm, archival, luminous; inspired by coral stone, lagoon light, and manuscript edges.
- Perception goal: users should feel time depth, dynastic continuity, and cultural specificity.

### Color system (tokenized)
- `--bg-0`: deep warm stone (`#1f1a16`)
- `--bg-1`: coral dusk (`#2a211c`)
- `--surface`: parchment-dark (`#2f2721`)
- `--ink`: warm ivory (`#f3ece1`)
- `--muted`: sand (`#b7a793`)
- `--accent-coral`: reef coral (`#d67b59`)
- `--accent-lagoon`: lagoon teal (`#2f9f9c`)
- `--accent-gold`: aged brass (`#c8a365`)
- Dynasty colors will be remapped to a warm, coordinated palette with guaranteed contrast.

### Typography
- Display/headings: `Fraunces` (or `Cormorant Garamond` fallback) for historical tone.
- Body/UI: `Source Sans 3` for readability and dense information.
- Mono/meta: `JetBrains Mono`.
- Dhivehi support/fallback: `Noto Sans Thaana`.
- Deliver as local assets for offline support.

### Patterns and texture
- Add subtle SVG pattern overlays inspired by Maldivian coral-stone carving motifs.
- Use low-opacity masks only on large surfaces (not under dense text).
- Include "age layers" in background gradients that shift by timeline period.

## UX Overhaul

### Information architecture
- Three primary panes:
1. `Explore` (graph/tree canvas)
2. `Profile` (person + relationships + sources)
3. `Institutions` (offices/titles timeline and glossary)
- Mobile: bottom sheet with snap points and persistent quick actions.

### Navigation model
- Global command/search bar with facets (`dynasty`, `office`, `era`, `confidence`).
- Persistent breadcrumb for "how you got here."
- Back/forward history for selected person and filtered states.

### Clickability and interaction reliability
- Every visual edge gets a transparent fat hit-area path for reliable clicking.
- Node labels, title chips, office chips, and source badges become interactive filters.
- Relationship lines open a "link card" (type, confidence, sources, period).
- Unified pointer/keyboard handling to prevent "looks clickable but not clickable."

### Readability and density control
- Add density toggles: `compact`, `comfortable`, `presentation`.
- Increase type scale consistency and whitespace rhythm.
- Keep long facts/source lists collapsed by default with fast expand.

## Tree and Graph Redesign

### Coral-branch tree mode
- Replace rigid orthogonal tree links with smooth branching curves (Bezier/spline).
- Vary branch thickness slightly by confidence/line strength.
- Add subtle animated "flow" on selected ancestral paths.
- Keep strict chronological vertical logic while using coral-like lateral growth.

### Graph mode refinement
- Better collision, clustering, and dynasty grouping.
- Progressive reveal for large neighborhoods to reduce overload.
- Focus mode dims non-relevant graph areas when a person/path is selected.

## Functional Upgrades

### New exploration features
1. Relationship Path Finder: "Show exactly how A and B are related."
2. Era Slider: scrub centuries and watch links/nodes animate through time.
3. Source Lens: toggle only high-confidence/high-grade edges.
4. Compare Cards: side-by-side profile comparison for two selected people.
5. Story Trails: curated guided narratives (e.g., Dhiyamigili -> Huraagey transition).

### Bug and quality hardening
- Fix event conflicts between zoom/pan and click-select.
- Remove stale sidebar/bottom-sheet sync edge cases.
- Improve mobile viewport handling, overflow behavior, and focus management.
- Add regression checks for search, selection, and panel toggles.

## Technical Plan

### Recommended approach
- Keep current D3 foundation and modular ES modules; overhaul incrementally.
- Add small focused libraries only where needed:
1. `floating-ui` for robust tooltips/popovers
2. `motion` (or GSAP) for controlled timeline/profile transitions
3. `elkjs` optional for advanced layout fallback if tree complexity grows

### Performance
- Virtualize heavy side lists.
- Debounce expensive redraw paths.
- Cache computed relation paths and timeline slices.
- Add frame-budget target: interactions should feel smooth at 60fps on modern laptops.

### Accessibility
- Keyboard navigation across search, nodes, tabs, and relation rows.
- WCAG AA contrast targets.
- Reduced-motion mode.
- Clear focus states for all interactive elements.

## Delivery Phases

### Phase 1: Foundations (2-3 days)
- Design tokens, typography, spacing scale, base component restyle.
- Fix major click/hover/pan bugs.

### Phase 2: Profile and Navigation (2-3 days)
- New profile card layout, tabs, chip interactions, source drawer polish.
- Command search + breadcrumb history + view-state persistence.

### Phase 3: Coral Tree + Graph polish (3-5 days)
- Curved coral tree renderer.
- Edge hit-areas and relationship link cards.
- Focus mode and confidence/source overlays.

### Phase 4: Cultural polish + storytelling (2-4 days)
- Coral-stone motif integration.
- Era transitions and optional ambient visual treatment.
- Curated story trails.

### Phase 5: QA and stabilization (2 days)
- Cross-device QA, accessibility pass, performance tuning, bug sweep.

## Acceptance Criteria
1. First impression feels premium, warm, and culturally rooted.
2. User can click any intended interactive element with >99% reliability.
3. A new user can find a person, inspect links, and understand confidence without guidance.
4. Tree mode is visually beautiful and still chronologically clear.
5. Mobile experience remains smooth and fully functional.

## What else should improve
1. Add an "Evidence narrative" view that summarizes why a link is believed and where uncertainty remains.
2. Add map-linked context (atolls/islands tied to births, deaths, offices, exile routes).
3. Add multilingual profile rendering (English + Dhivehi toggles).
4. Add export options for selected subtrees (PNG/PDF/JSON citation bundle).

## Live Checklist Status
Updated: 2026-02-07

- done: Graph mode progressive reveal for large neighborhoods (de-cluttered edges and dimmed non-priority nodes).
- done: Animated flow treatment on selected ancestral paths in tree mode.
- done: Long facts and source lists collapsed by default with fast expand controls.
- done: Evidence Narrative view added to profile cards and relationship cards.
- done: Map-linked context added in profile cards (birth/death/context points with route hints).
- done: Multilingual profile rendering toggle added (English + Dhivehi UI/profile labels).
- done: Export options implemented for subtree outputs (PNG, PDF print, JSON citation bundle).
- done: Era controls stabilization pass completed (fixed runtime label/render bug in timeline toggle UI).
- done: Localization hardening completed for core interaction surfaces (profile relation cards, search empty states, compare panel, and exploration history).
- done: Full narrative i18n pass completed for relation-path steps, office/source phrasing, graph tooltips/status labels, and Dhivehi dictionary parity.

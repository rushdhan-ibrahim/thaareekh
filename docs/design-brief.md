# Rannavaaru — Design Brief

> An interactive genealogy visualization of the Maldives royal lineage (1117–1968 CE).
> Live at myrkvidur.com/thaareekh. This document describes the application's architecture, data model, component inventory, interaction patterns, and design constraints so a designer can propose a new visual direction.

---

## 1. What the App Does

Rannavaaru visualizes ~210 historical persons and ~450 relationship edges spanning 8 dynasties of the Maldivian monarchy. Users can:

- **Explore** a force-directed graph or a chronological tree layout
- **Search** people by name, dynasty, title, or office via a command palette
- **Select** nodes to view detailed profile cards, relationship lists, office histories, evidence summaries, and geographic context
- **Filter** by dynasty, edge type (parent/sibling/spouse/kin), confidence level (confirmed/inferred/uncertain), source grade (A–D), and era year
- **Compare** two people side-by-side
- **Follow story trails** — guided narrative paths through the graph
- **Switch language** between English and Dhivehi (Thaana script, RTL)
- **Toggle** light/dark theme and three density modes (compact/comfortable/presentation)

---

## 2. Page Structure

```
┌──────────────────────────────────────────────────────────┐
│  HEADER (54px)                                           │
│  Brand · Nav · Back/Fwd · Graph/Tree · Search · Filters  │
│  Language · Export · Theme toggle                         │
├──────────────────────────────┬───────────────────────────┤
│                              │                           │
│  GRAPH CANVAS (SVG)          │  SIDEBAR (320–380px)      │
│  • Force-directed or tree    │  • Profile card           │
│  • Zoom/pan (d3-zoom)        │  • 3 tabs: Story /        │
│  • Floating breadcrumbs      │    Offices / Evidence     │
│  • Floating filter panel     │  • Relationship list      │
│  • Minimap (bottom-right)    │  • Legend & method guide   │
│  • Era overlay               │                           │
│                              │                           │
├──────────────────────────────┴───────────────────────────┤
│  COMMAND PALETTE (modal overlay, z-50)                   │
│  ONBOARDING TOUR (spotlight overlay, z-60)               │
│  BOTTOM SHEET (mobile only, replaces sidebar)            │
└──────────────────────────────────────────────────────────┘
```

- **Desktop**: 2-column grid — graph canvas + sidebar
- **Tablet** (< 1024px): Full-width graph, sidebar replaced by bottom sheet
- **Mobile** (< 640px): Simplified header, bottom sheet with drag snap (full/half/peek)

---

## 3. Data Model

### Person (Node)

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique ID, e.g. `"P30"` |
| `nm` | string | Primary name |
| `g` | `"M"` / `"F"` | Gender |
| `dy` | string | Dynasty: `Lunar`, `Hilaaly`, `Utheemu`, `Dhiyamigili`, `Isdu`, `Huraagey`, `Devadu`, or `unknown` |
| `re` | `[[start,end], ...]` | Reign period(s) — may be null for non-sovereigns |
| `n` | `number[]` | Sovereign ordinal number(s) — empty for non-sovereigns |
| `yb`, `yd` | number | Year born, year died (may be null) |
| `pb`, `pd` | string | Place born, place died |
| `aliases` | string[] | Alternate names |
| `regnal_names` | string[] | Regnal titles |
| `known_as` | object[] | Sobriquets with type + confidence |
| `titles` | string[] | Formal titles held |
| `offices_held` | object[] | Office positions with period and sources |
| `bio` | string | Multi-paragraph biography |
| `facts` | string[] | Interesting facts (max 3 shown initially) |
| `royal_link` | object | Documented link to royal line (sovereign/descent/collateral/affinal/uncertain) |

### Edge (Relationship)

| Field | Type | Description |
|-------|------|-------------|
| `s`, `d` | string | Source and destination person IDs |
| `t` | string | Type: `parent`, `sibling`, `spouse`, `kin` |
| `c` | string | Confidence: `c` (confirmed), `i` (inferred), `u` (uncertain) |
| `l` | string | Human-readable label |
| `confidence_grade` | `A`–`D` | Source quality grade |
| `evidence_refs` | string[] | Source reference IDs |
| `claim_type` | string | `direct`, `inferred`, `contested` |
| `inference_basis` | object | If inferred: via_parent, shared_parent, etc. |

### Office

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | e.g. `"OFF-SOVEREIGN"` |
| `name` | string | Full title |
| `kind` | string | `crown`, `executive`, `institution`, `peerage`, `furadaana`, `ministerial`, `military`, `judicial`, `deputy` |
| `summary` | string | Description text |
| `alt_names` | string[] | Variant names |
| `source_refs` | string[] | Source IDs |

19 offices catalogued across 6 historical periods (14th century to Republican era).

---

## 4. Component Inventory

### 4.1 Header Bar
- **Brand mark**: App name + date range "1117 – 1968"
- **Navigation**: Back / Forward history buttons
- **View toggle**: Graph / Tree mode
- **Sidebar toggle**: "Details" button
- **Reset view**: Home icon button (shortcut: `0`)
- **Search trigger**: Expandable input bar with `/` keyboard hint
- **Filter toggle**: Hamburger icon (shortcut: `F`)
- **Language picker**: `<select>` (English / Dhivehi)
- **Export picker**: `<select>` (PNG / PDF / JSON)
- **Theme toggle**: Sun/moon icon

### 4.2 Graph Canvas (SVG)
- **Nodes**: `<g>` groups containing:
  - Background `<rect>` (sharp corners, rx 1–3)
  - Left accent `<rect>` (3px, dynasty-colored)
  - Name `<text>` (serif font)
  - Optional sovereign badge icon
  - Optional reign year sub-label
- **Edges**: `<path>` elements with:
  - Bézier curves (vertical-first for tree, force-curved for graph)
  - Dynasty-colored arrowhead markers (`<marker>` in `<defs>`)
  - Dashed stroke for inferred/uncertain
  - Optional midpoint label
- **Era overlay**: Year axis with dot markers and annotation labels
- **Parchment-grain texture** (body `::before` — feTurbulence SVG noise)
- **Islamic 8-pointed star watermark** (graph area `::before` — tiled SVG, 4% opacity)
- **Radial gradient atmosphere** (graph area `::after` — warm era-driven glow at top/bottom edges)

### 4.3 Sidebar (Desktop) / Bottom Sheet (Mobile)
3 tabs per selected person:

**Tab: Story**
- Profile card with dynasty-colored left border, illuminated drop-cap on name
- Known names (clickable pill buttons)
- Known-by sobriquets with type + confidence badges
- Titles (pill buttons)
- Biography (multi-paragraph, lead paragraph styled differently)
- Royal link status
- Interesting facts (collapsible, max 3 initially)
- Compare controls (Set A / Set B / Compare Next)

**Tab: Offices & Roles**
- Office cards: icon + name + period + kind label + summary + source pills
- Historical context: era strip (horizontal scrollable markers) + collapsible era cards

**Tab: Evidence**
- Evidence strength bar (stacked horizontal: % confirmed / inferred / uncertain)
- Key sources (top 3, with A–D quality badges, collapsible show-more)
- Uncertainty watchlist (inferred/uncertain edges for this person)
- Geographic context (inline SVG map with birth/death dots, route paths, place labels)

**Below tabs:**
- Relationship list grouped by type (Parent, Children, Siblings, Spouses, Kin)
- Each relation item: name link + confidence tag + "Go" button
- Legend (colored lines for each edge type + dashed for inferred/uncertain)
- About section
- Method & confidence guide (collapsible reference)

**For edge selection (relationship card):**
- Type & confidence header
- Edge metadata (type, confidence, grade, claim type)
- Inference panel (if inferred): rule, logic steps, verification checklist
- Verification panel (if in ledger): review status, canonical decision, dossier link
- Evidence narrative & source stack
- Navigate-to-person buttons

### 4.4 Command Palette (Modal)
- Full-screen overlay with blur backdrop
- Centered search box (max-width 480px)
- Result list: dynasty-colored dot + name + metadata + badge
- Keyboard hints: arrows navigate, Enter selects, Esc closes
- Searches across: names, aliases, known-as, titles, offices, dynasty names

### 4.5 Filter Panel (Floating)
- Positioned top-left over graph canvas
- Sections separated by dashed "manuscript ruling" dividers:
  - Dynasty & Tree (two `<select>` dropdowns)
  - Edge Types (4 toggle chips: Parent / Sibling / Spouse / Kin)
  - Confidence (3 toggle chips: Confirmed / Inferred / Uncertain)
  - Sources & Overlay (grade filter + overlay mode dropdown)
  - Display (density mode + Focus / Details / Institutions toggles)
  - Era (year slider with play button)
  - Story Trails (trail picker + step navigation)
  - Fit / Reset buttons

### 4.6 Tree Options Popover
- Appears when in Tree mode
- Lists all trees by root person name, dynasty dot, year
- "Linked only" toggle to filter inter-connected trees

### 4.7 Floating Breadcrumbs
- Centered above graph canvas
- Shows navigation history as rectangular tab items
- Each crumb: person name + dynasty/date metadata
- Active crumb highlighted with accent background
- Horizontally scrollable

### 4.8 Hover Card
- Appears on node hover (14px offset from cursor)
- Shows: name (small-caps), dynasty color bar, reign period, dynasty name, sovereign number or "non-sovereign", connection count, first sentence of biography (truncated 120 chars)

### 4.9 Minimap
- Fixed bottom-right of graph canvas (160 x 100px)
- Shows all nodes as colored dots
- Viewport rectangle shows current pan/zoom position
- Click-to-pan navigation

### 4.10 Onboarding Tour
- 5-step spotlight sequence
- Darkened backdrop with clip-path spotlight on target element
- Tooltip: title + description + step dots + Next/Skip buttons

### 4.11 Loader
- Full-screen overlay during initial graph build
- Spinner + "Building graph..." text

---

## 5. Interaction Patterns

| Action | Result |
|--------|--------|
| Click node | Select person, open sidebar, highlight connected edges/nodes, update breadcrumbs |
| Click edge | Open relationship card in sidebar |
| Hover node | Show hover card with name/dynasty/reign/bio snippet |
| Click empty canvas | Deselect, clear sidebar |
| Scroll / pinch | Zoom graph (range 0.08x – 4x) |
| Drag canvas | Pan |
| Click minimap | Pan to that area |
| Press `/` | Open command palette |
| Press `F` | Toggle filter panel |
| Press `D` | Toggle sidebar |
| Press `0` | Fit graph to content |
| Press `Esc` | Close sidebar or active overlay |
| Arrow keys | Navigate between connected nodes |
| Tab | Cycle through nodes |
| Alt+Left/Right | Navigate history back/forward |

---

## 6. Visual Language (Current State)

### Color System
- **8 dynasty colors** per theme (muted ink-wash tones in current scriptorium theme)
- **4 edge-type colors**: parent (--ep), sibling (--es), spouse (--esp), kin (--ek)
- **3 semantic overlays**: inferred (--ei), uncertain (--eu), accent (--ac)
- **4 source grades**: A (--sq-a), B (--sq-b), C (--sq-c), D (--sq-d)
- **Surface hierarchy**: bg > bg2 > sf > sf2 (increasing elevation)
- **Text hierarchy**: tx (primary) > tx2 (secondary) > tx3 (tertiary)
- **Accent**: single accent color (--ac) + secondary (--ac2)
- **Border**: bd (subtle) + bd2 (stronger)

### Typography
Currently 4 font stacks:
- **Body serif** (--serif): Cormorant Garamond
- **Display** (--display): Cinzel — headings, section labels (small-caps)
- **Monospace** (--mono): JetBrains Mono — dates, metadata, badges
- **Thaana** (--thaana): Noto Sans Thaana — Dhivehi RTL text

### Spacing
4px base scale: 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48px

### Radii
Sharp: 3px (--radius), 2px (--radius-sm)

### Shadows
Warm brown tones only (`rgba(60,42,20,...)`), no colored glow effects. Three levels: sm, md, lg.

### Motion
Three duration tiers (150ms / 300ms / 500ms), two easing curves (ease-out + spring). `prefers-reduced-motion` fully supported.

---

## 7. Technical Constraints

These are non-negotiable and any visual redesign must work within them:

1. **SVG-based graph rendering** — nodes are SVG `<g>` groups with `<rect>` + `<text>`. No HTML-in-SVG (foreignObject). Font rendering follows SVG rules.

2. **CSS custom properties** — all theming flows through CSS variables. The token file (`css/tokens.css`) is the single source of truth. Theme switching is `data-theme="light|dark"` on `<html>`.

3. **Dynasty colors must be distinct** — 8 dynasties need visually separable colors that work in both light and dark themes, on nodes, edges, arrowhead markers, sidebar borders, and hover cards.

4. **Edge legibility at small zoom** — users zoom out to 8% to see the full 800-year span. Edge strokes, dashes, and colors must remain distinguishable at very small scales.

5. **RTL support** — Dhivehi (Thaana script) flips sidebar, filter panel, command palette, and hover card to RTL. Header and graph canvas stay LTR. Font must support Thaana Unicode block.

6. **Three density modes** — compact, comfortable, presentation — scale node sizes, font sizes, and padding. Design must accommodate all three.

7. **Responsive breakpoints** — 1024px (sidebar → bottom sheet), 640px (simplified header, hide date range / back-forward / separators).

8. **Performance** — no `backdrop-filter` on always-visible elements. CSS `contain` on graph area and sidebar. No heavy box-shadows on frequently-animated elements. GPU-composited transforms preferred.

9. **Accessibility** — all interactive elements need visible focus indicators (`outline: 2px solid`). Skip link, ARIA live region for selection announcements, `prefers-reduced-motion` respected. Color alone must not be the only way to distinguish edge types (dashes supplement color).

10. **No external image assets** — all decorative elements are inline SVG or CSS (data URIs). No image files to manage.

---

## 8. What Needs Design

The entire visual identity is open for rethinking. Specifically:

- **Color palette** — dynasty colors, theme colors (light + dark), accent, semantic colors
- **Typography** — font choices, scale, weight usage
- **Node appearance** — shape, size, visual hierarchy (sovereign vs non-sovereign, male vs female)
- **Edge appearance** — stroke styles, colors, how to encode type + confidence + grade visually
- **Surface treatment** — backgrounds, textures, watermarks, atmospheric effects
- **Component styling** — every UI component listed in Section 4
- **Motion and animation** — transitions, hover states, selection feedback, loading states
- **Iconography** — office kind icons, navigation icons, action icons
- **Overall mood and atmosphere** — the emotional quality of the experience

The structural layout (header / canvas / sidebar / bottom sheet) and interaction model (Section 5) are stable and not changing. The redesign is purely visual: surfaces, colors, typography, shapes, and decorative treatment.

---

## 9. Files to Modify

All visual changes live in 9 CSS files:

| File | Purpose | Lines |
|------|---------|-------|
| `css/tokens.css` | Design tokens: colors, fonts, spacing, shadows, motion | 140 |
| `css/base.css` | Reset, body, density modes, RTL, loader | 132 |
| `css/layout.css` | Header, sidebar, filter panel, breadcrumbs, bottom sheet, responsive | 518 |
| `css/components.css` | Profile cards, chips, badges, relations, offices, eras, evidence, legend | 886 |
| `css/graph.css` | SVG node/edge styling, minimap, era overlay, selection pulse | 88 |
| `css/search.css` | Command palette, inline search dropdown | 204 |
| `css/tooltip.css` | Hover cards and simple tooltips | 69 |
| `css/onboarding.css` | Tour spotlight overlay and tooltip | 97 |
| `css/animations.css` | All `@keyframes` definitions | 74 |

SVG node rendering (rect attributes, text positioning, marker defs) is in `src/graph/rebuild.js` — coordinate with developer for any node shape changes.

---

## 10. Deliverables Expected

1. **Color palette** with all token values for light + dark themes (all variables in tokens.css)
2. **Typography selections** — font families, weights, and size scale
3. **Component mockups or specs** for the major surfaces (node, sidebar profile, command palette, filter panel)
4. **Dynasty color set** — 8 distinguishable colors per theme, tested for contrast
5. **Edge encoding scheme** — how type, confidence, and grade map to visual attributes

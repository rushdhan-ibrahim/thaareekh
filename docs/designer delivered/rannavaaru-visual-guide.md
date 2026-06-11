# Rannavaaru Visual Integration Guide

## Applying the Computational Manuscript Aesthetic to a Maldivian Royal Genealogy

> This guide maps the design language developed in the *Cabinet of Ink & Light* onto the Rannavaaru genealogy system. It is structured to follow the 9 CSS files listed in the design brief, with specific token values, component recipes, and references to source files in the cabinet project.

---

## Part I — Philosophy

### The Core Insight

The cabinet project discovered that the @instance_11 aesthetic is not "retro book design" and not "shader art with paper texture." It is a **computational manuscript** — code given the hierarchy, gravity, and page-furniture of an illuminated treatise.

Rannavaaru is already reaching for this. The design brief describes parchment-grain textures, Islamic 8-pointed star watermarks, illuminated drop-caps, and manuscript ruling dividers. The current implementation treats these as decoration. This guide treats them as **structure**.

The genealogy of the Maldivian monarchy is itself a kind of manuscript — a *raadhavalhi*, a historical recording of kings written in Thaana script on palm-leaf and paper. The visual system should feel like the digital continuation of that tradition: a living codex where the graph is the illumination, the sidebar is the commentary, and the whole page is a folio.

### Three Tensions to Hold

From the research document that guided the cabinet project:

1. **Sacred and technical** — the data is historical scholarship, but the presentation should carry weight, as if recording lineage is itself an act of devotion
2. **Precise and human** — the graph is computed, but the surfaces should feel *written*, with jitter, grain, and imperfection
3. **Still and alive** — most elements are quiet; animation is reserved for moments of significance (selection, navigation, era transitions)

### What to Steal from the Cabinet

| Cabinet Element | Rannavaaru Equivalent |
|---|---|
| Paper as color (radial gradient, grain, vignette) | Graph canvas and sidebar backgrounds |
| Rubric red for structural emphasis | Dynasty accent, sovereign markers, confidence indicators |
| Seed-based jitter via mulberry32 PRNG | Slight irregularity in node rectangles, edge curves, ornament placement |
| Ornament only at thresholds | Headpiece in header, dividers between sidebar sections, colophon in footer |
| Code underlay behind geometric plates | Historical source text as ghost-layer behind graph nodes |
| Astronomical motion (8–20s loops) | Slow breathing on selected nodes, gentle pulse on era markers |
| Self-drawing SVG paths | Edge animation on selection, tree-branch reveal |
| Dormant-motion control | Pause animations on sidebar sections not in viewport |

---

## Part II — Design Tokens (`css/tokens.css`)

### Paper System

Replace the current background with a layered paper surface. Reference: every `folio` element in the cabinet.

```css
:root {
  /* ═══ PAPER SURFACE ═══ */
  --paper: #ece6dc;
  --paper-mid: #e2dbd0;
  --paper-warm: #f0ebe0;

  /* ═══ INK HIERARCHY ═══ */
  --ink: #16130f;
  --ink-light: #3a342c;
  --ash: #6c645d;
  --ash-light: #9e9589;
  --ghost: #c4bdb3;

  /* ═══ RUBRIC ═══ */
  --rubric: #8b2d23;
  --rubric-light: #a8473a;

  /* ═══ RULE LINES ═══ */
  --rule: rgb(0 0 0 / 0.10);
  --rule-soft: rgb(0 0 0 / 0.05);
  --rule-strong: rgb(0 0 0 / 0.14);
}
```

### Dark Theme

The dark theme should invert the manuscript metaphor: cream ink on dark parchment, like a negative of a printed page or a brass astrolabe against dark cloth.

```css
[data-theme="dark"] {
  --paper: #1a1714;
  --paper-mid: #221e1a;
  --paper-warm: #2a2520;

  --ink: #e8e2d6;
  --ink-light: #c8c0b4;
  --ash: #9e9589;
  --ash-light: #6c645d;
  --ghost: #3d3529;

  --rubric: #c4563e;
  --rubric-light: #d4705a;

  --rule: rgb(255 255 255 / 0.08);
  --rule-soft: rgb(255 255 255 / 0.04);
  --rule-strong: rgb(255 255 255 / 0.12);
}
```

### Dynasty Colors

Eight dynasties need eight distinguishable colors. Use muted, ink-wash tones — not saturated primaries. Think of colors as different inks in a scribe's palette. Each should work as a 3px left-border accent, an edge stroke, and a node background tint.

```css
:root {
  /* ═══ DYNASTY PALETTE — light theme ═══ */
  --dy-lunar:       #5b7a6e;   /* muted teal — the sea */
  --dy-hilaaly:     #7a6350;   /* warm brown — sandalwood */
  --dy-utheemu:     #8b2d23;   /* rubric red — the liberation */
  --dy-dhiyamigili: #5a6278;   /* slate blue — the deep */
  --dy-isdu:        #7a6a8a;   /* muted purple — the distance */
  --dy-huraagey:    #6b7a4e;   /* olive — the land */
  --dy-devadu:      #8a6e50;   /* copper — the trade */
  --dy-unknown:     #8a8478;   /* neutral ash */
}

[data-theme="dark"] {
  --dy-lunar:       #7da494;
  --dy-hilaaly:     #a08670;
  --dy-utheemu:     #c4563e;
  --dy-dhiyamigili: #7a88a0;
  --dy-isdu:        #9a8ab0;
  --dy-huraagey:    #8a9a6e;
  --dy-devadu:      #b08e6e;
  --dy-unknown:     #9a9488;
}
```

### Edge Type Colors

Keep the existing 4-type system but map to the manuscript palette:

```css
:root {
  --ep: var(--ink);          /* parent: primary ink */
  --es: var(--ash);          /* sibling: secondary ink */
  --esp: var(--rubric);      /* spouse: rubric red */
  --ek: var(--ghost);        /* kin: ghost tone */
}
```

### Source Quality Grades

```css
:root {
  --sq-a: var(--ink);        /* highest: full ink authority */
  --sq-b: var(--ash);        /* good: secondary ink */
  --sq-c: var(--ash-light);  /* fair: lighter */
  --sq-d: var(--ghost);      /* poor: ghost */
}
```

### Typography

Keep the current families but refine the usage. Reference: the three-family system in the cabinet.

```css
:root {
  --serif: 'EB Garamond', 'Cormorant Garamond', Georgia, serif;
  --display: 'Cormorant SC', Georgia, serif;
  --mono: 'JetBrains Mono', 'Courier New', monospace;
  --thaana: 'MV Iyyu Nala', 'MV Boli', 'Noto Sans Thaana', sans-serif;
}
```

**Rationale for switching from Cinzel to Cormorant SC:** Cinzel is a Roman capitalis face — it belongs to Latin epigraphy. Cormorant SC is a Garamond-derived small-caps family that belongs to the humanist manuscript tradition, which is a closer cousin to Islamic book arts. Both traditions prize calligraphic precision and geometric harmony.

### Motion

```css
:root {
  --ease-out: cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --dur-fast: 200ms;
  --dur-mid: 400ms;
  --dur-slow: 800ms;
  --dur-breath: 8s;     /* for ambient breathing animations */
  --dur-orbit: 60s;     /* for slow rotational ornaments */
}
```

---

## Part III — Surface Treatment (`css/base.css`)

### The Page as Folio

Reference: `folio::before` and `folio::after` in every cabinet file, and `relic-common.css` lines on `body.relic-enhanced .folio`.

```css
body {
  background:
    radial-gradient(circle at 50% -10%, rgb(255 255 255 / 0.05), transparent 40%),
    linear-gradient(180deg, #231e1a, #171311 58%, #100d0b);
}

/* Or for light theme body: */
[data-theme="light"] body {
  background: #1e1b18;
}
```

### Graph Canvas Surface

The SVG graph area should feel like the main page of the manuscript — the writing surface.

```css
.graph-canvas {
  background:
    radial-gradient(ellipse at 30% 15%, rgb(255 255 255 / 0.14), transparent 40%),
    linear-gradient(175deg, rgb(0 0 0 / 0.02), rgb(255 255 255 / 0.01)),
    var(--paper);
}

/* Paper grain overlay */
.graph-canvas::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)'/%3E%3C/svg%3E");
  opacity: 0.14;
  mix-blend-mode: multiply;
  pointer-events: none;
  z-index: 0;
}

/* Edge vignette */
.graph-canvas::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 55%, rgb(0 0 0 / 0.04) 100%);
  pointer-events: none;
  z-index: 0;
}
```

### Islamic Star Watermark

Keep the existing tiled 8-pointed star, but reduce opacity to 2–3% and render it with `mix-blend-mode: multiply` so it sits *in* the paper, not on it.

### Sidebar Surface

The sidebar should feel like the *marginal commentary* — slightly different paper tone.

```css
.sidebar {
  background: var(--paper-mid);
  border-left: 1px solid var(--rule);
}
```

---

## Part IV — Graph Rendering (`css/graph.css` + `src/graph/rebuild.js`)

### Node Appearance

The current nodes use sharp-cornered rectangles with a dynasty-colored left accent. This is already close to the manuscript style. Refine:

**Node shape:** Keep rectangles but add 0.5–1px of seed-based irregularity to the corner radii. Reference: the jitter system in `movement-library.ts`, function `mulberry32`. Each node can derive its jitter from its person ID hash.

**Sovereign nodes:** Add a small ornamental mark — a tiny 8-pointed star or diamond to the left of the name, rendered as an inline SVG `<polygon>`. Reference: the `pointRing` function in `movement-library.ts` which generates star polygons.

**Node background:** A very subtle radial gradient from center-bright to edge-dark, simulating the slight unevenness of ink wash:

```css
.node-bg {
  fill: var(--paper);
  stroke: var(--rule-strong);
  stroke-width: 0.5;
}

.node-bg--sovereign {
  fill: url(#sovereignGradient);  /* Define in SVG defs */
}
```

**Name text:** Use `font-family: var(--serif)` with `font-variant: small-caps` for sovereign names.

**Reign sub-label:** Use `font-family: var(--mono)` at smaller size, with `font-variant-numeric: oldstyle-nums`.

### Edge Appearance

Edges should feel like *drawn connections* — lines traced by a scribe, not computed by a machine.

**Type encoding:**
- Parent: solid stroke, `var(--ink)`, 1px
- Sibling: solid stroke, `var(--ash)`, 0.6px
- Spouse: solid stroke, `var(--rubric)`, 0.8px — rubric because marriage is a structural event in lineage
- Kin: dotted stroke, `var(--ghost)`, 0.5px

**Confidence encoding:**
- Confirmed: solid stroke
- Inferred: dashed stroke (`stroke-dasharray: 6,4`)
- Uncertain: dotted stroke (`stroke-dasharray: 2,4`) + lower opacity (0.5)

**Grade encoding:** Stroke width scales subtly with grade: A = full width, B = 0.85x, C = 0.7x, D = 0.55x.

**Selection animation:** When an edge is selected, animate it using the self-drawing technique from the cabinet (stroke-dashoffset transition). Reference: the `.drw` class in `relic-common.css` and the `drawLater` function in `movement-library.ts`.

### Arrowhead Markers

Use small diamond-shaped arrowheads instead of triangles — they're more consistent with the ornamental vocabulary. Reference: the diamond ornaments at cardinal points in Plate I (The Orrery).

---

## Part V — Components (`css/components.css`)

### Profile Card (Sidebar)

The profile card should feel like a **manuscript entry** — a person's record in the raadhavalhi.

**Structure:**
- Dynasty-colored left border (3px) — keep existing
- Name as illuminated heading: `font-family: var(--display)`, small-caps, tracked
- Below the name: a thin ornamental rule (reference: the headpiece SVG pattern)
- Drop-cap on the first letter of the biography — use a proper framed initial, not just `::first-letter`. Reference: the illuminated initials in the treatise file. For Rannavaaru, the initial can be framed in a small dynasty-colored square

**Known Names / Titles (pill buttons):**
- Background: `var(--paper-mid)`
- Border: `1px solid var(--rule)`
- Text: `var(--ash)`, `font-family: var(--mono)`, small
- On hover: border becomes `var(--rule-strong)`, subtle lift (`translateY(-1px)`)

**Biography text:**
- `font-family: var(--serif)`
- Lead paragraph: slightly larger, `var(--ink)`
- Subsequent paragraphs: `var(--ink-light)`
- Justified text with `hyphens: auto`

### Evidence Tab

**Evidence strength bar:**
- Use a horizontal stacked bar where confirmed/inferred/uncertain segments are colored with the ink hierarchy: `var(--ink)` / `var(--ash)` / `var(--ghost)`
- Each segment has a 1px rule between them

**Source quality badges:**
- A/B/C/D rendered as small squares with the grade letter in `var(--mono)`
- Grade A: filled `var(--ink)`, Grade B: outlined, Grade C: dashed outline, Grade D: ghost

**Geographic context map:**
- Use the same paper surface treatment as the main graph
- Place markers as small filled circles with dynasty color
- Route paths as dashed lines with self-drawing animation on reveal

### Office Cards

- Office icon: a small SVG ornament appropriate to the kind (crown = 8-pointed star, military = crossed lines, judicial = balanced diamond, etc.). Reference: the `miniMedallion` function in `movement-library.ts` for generating small ornamental SVGs
- Period displayed in `var(--mono)` with oldstyle numerals
- Kind label in small-caps rubric

### Section Dividers

Use manuscript ruling dividers between sidebar sections. Reference: the `.divider` elements in the ballet files. Instead of horizontal rules, use the ornamental pattern: `◆ · ◇ · ◆` or the diamond headpiece SVG from the cabinet.

```css
.sidebar-divider {
  text-align: center;
  margin: 16px 0;
  color: var(--ash-light);
  letter-spacing: 0.5em;
  font-size: 0.6rem;
  user-select: none;
}
```

### Relationship List

- Group headers (Parent, Children, Siblings, Spouses, Kin) in `var(--display)` small-caps
- Confidence tags: solid pill for confirmed, dashed border for inferred, ghost background for uncertain
- "Go" button: minimal, just an arrow ornament (→) in `var(--ash)`

---

## Part VI — Search & Navigation (`css/search.css`, `css/layout.css`)

### Command Palette

Reference: the code-block styling in the cabinet files. The command palette should feel like an index or concordance page.

```css
.command-palette {
  background: var(--paper);
  border: 1px solid var(--rule-strong);
  box-shadow: 0 16px 48px rgb(0 0 0 / 0.12);
  font-family: var(--serif);
}

.command-palette input {
  font-family: var(--mono);
  background: var(--paper-mid);
  border: 1px solid var(--rule);
  color: var(--ink);
}

.command-palette .result-item {
  border-bottom: 1px solid var(--rule-soft);
}

.command-palette .result-item:hover {
  background: var(--paper-warm);
}
```

### Header Bar

The header should feel like a **running head** — the kind of header that appears at the top of a printed folio page.

- Background: `var(--paper-mid)` with a 1px bottom border
- Brand mark: `font-family: var(--display)`, small-caps, tracked
- Date range "1117 – 1968" in `var(--mono)` with oldstyle numerals, `var(--ash)`
- Navigation buttons: minimal, no background, icon + subtle hover state

### Filter Panel

The filter panel should feel like a marginal annotation system. Reference: the `.margin-note` styling in the treatise.

- Positioned as a floating panel with `var(--paper)` background
- Section headers in `var(--display)` small-caps
- Dashed "manuscript ruling" dividers between sections — use `border-bottom: 1px dashed var(--rule)`
- Toggle chips with dynasty colors as subtle left-accent borders

### Breadcrumbs

- Background: `var(--paper-mid)`, minimal padding
- Each crumb: `font-family: var(--serif)`, dynasty color dot, person name
- Active crumb: `var(--ink)` text, `var(--paper-warm)` background
- Separator: thin dot `·` in `var(--ash-light)`

---

## Part VII — Hover Card (`css/tooltip.css`)

The hover card should feel like a **gloss** — a marginal note that appears when you consult a name in the text.

```css
.hover-card {
  background: var(--paper);
  border: 1px solid var(--rule-strong);
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.08);
  padding: 12px 14px;
  max-width: 280px;
}

.hover-card .name {
  font-family: var(--display);
  font-variant: small-caps;
  letter-spacing: 0.08em;
  color: var(--ink);
}

.hover-card .dynasty-bar {
  height: 2px;
  margin: 6px 0;
  background: var(--dynasty-color);
}

.hover-card .reign {
  font-family: var(--mono);
  font-size: 0.75rem;
  font-variant-numeric: oldstyle-nums;
  color: var(--ash);
}

.hover-card .bio-snippet {
  font-family: var(--serif);
  font-size: 0.85rem;
  color: var(--ink-light);
  font-style: italic;
}
```

---

## Part VIII — Animation (`css/animations.css`)

### Motion Vocabulary

Reference: `relic-common.css` from the cabinet project.

```css
/* ═══ Ambient — astronomical timing ═══ */
@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.018); opacity: 0.92; }
}

@keyframes pulse {
  0%, 100% { opacity: 0.48; }
  50% { opacity: 0.94; }
}

@keyframes spinSlow {
  to { transform: rotate(360deg); }
}

/* ═══ Functional — for transitions ═══ */
@keyframes revealUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes drawPath {
  to { stroke-dashoffset: 0; }
}

/* ═══ Selection feedback ═══ */
@keyframes selectPulse {
  0% { stroke-width: 1; opacity: 0.9; }
  50% { stroke-width: 2.5; opacity: 1; }
  100% { stroke-width: 1; opacity: 0.9; }
}
```

### Key Animation Rules

1. **No bounce, no overshoot** — use `var(--ease-out)` everywhere, never `ease-in-out` with exaggerated curves
2. **Node selection:** A single gentle pulse (1 cycle of `selectPulse`, 600ms), then hold at the expanded state
3. **Edge reveal:** Self-drawing animation over 800ms when an edge is highlighted
4. **Sidebar open:** `translateX` slide with `var(--dur-mid)` and `var(--ease-out)`
5. **Era slider:** When scrubbing through time, nodes should fade in/out with `var(--dur-fast)` opacity transition
6. **Tree branch reveal:** When switching to tree mode, edges draw themselves from root to leaves in a staggered cascade (40ms per level)
7. **Dormant-motion:** Use the same IntersectionObserver pattern from `relic-enhancer.ts` — elements outside viewport get `animation-play-state: paused`

---

## Part IX — Ornamental Library

### Using the Movement Library

The `movement-library.js` from the cabinet project can be used directly in Rannavaaru for decorative elements. Import it and use `MovementLibrary.renderMini()` to generate small ornamental SVGs for:

- **Loader screen:** A slowly rotating Astrolabe or Compass Rose as the loading indicator
- **Empty sidebar state:** A breathing Sigil Bloom or Vesica
- **Story trail icons:** Different mini-artefacts for each story trail
- **Era markers:** Small Pilgrim Stars along the timeline
- **Dynasty emblems:** Map each dynasty to a mini-artefact style

### Folio Corners

Reference: `relic-enhancer.ts`, function `injectFolioCorners`. Place four corner ornaments on the main page to frame the graph canvas like a manuscript page.

### Section Headpieces

Use the diamond-pattern SVG headpiece from the cabinet for major section transitions in the sidebar.

---

## Part X — Specific Maldivian Considerations

### Thaana Script

When the language is set to Dhivehi:
- Sidebar and filter panel flip to RTL
- Use `font-family: var(--thaana)` for all Dhivehi text
- Thaana text should be slightly larger (Thaana glyphs are typically smaller than Latin at the same font-size)
- The rubric color works well with Thaana — use it for structural emphasis (dynasty names, dates, section marks)
- Drop-cap initials should be disabled in RTL mode (Thaana doesn't have a drop-cap tradition; use a decorated border-right instead)

### Historical Sensitivity

The raadhavalhi tradition is a real Maldivian manuscript form. The visual treatment should honor this without costuming. Specifically:
- Use geometric patterns from Islamic art (8-pointed stars, interlocking circles) rather than calligraphic ornamentation
- Avoid fake Arabic script or decorative Thaana that isn't actual text
- The reserved white of the page should carry much of the motif (reference: Acehnese Qur'an illumination where the page itself is the primary design element)

### Maritime Context

The Maldives is an archipelago. The dynasty colors should carry subtle marine associations without being literal:
- Warm tones for land-based power (Utheemu's rubric red, Hilaaly's sandalwood brown)
- Cool tones for maritime power (Lunar dynasty's sea teal, Dhiyamigili's deep slate)
- The grain texture can have a slightly different character than pure paper grain — imagine salt air, coral surfaces, the texture of a document stored in a tropical climate

---

## Part XI — File Reference Map

| Rannavaaru File | Primary Cabinet Reference | What to Extract |
|---|---|---|
| `css/tokens.css` | Every file's `:root` block | Paper/ink/rubric palette, typography stacks, motion tokens |
| `css/base.css` | `folio::before`, `folio::after` in any cabinet HTML | Grain layer, vignette, paper surface system |
| `css/graph.css` | Plates I, VII (Orrery, Rose) | Node ornaments, edge drawing, arrowhead diamonds |
| `css/components.css` | Treatise: `.theorem`, `.prose`, `.section-heading`, `.illuminated-initial` | Profile card structure, section styling, drop-caps |
| `css/layout.css` | `relic-common.css` lines 1–60 | Shared animation keyframes, cabinet-card styling |
| `css/search.css` | Treatise: `.code-block` styling | Command palette as concordance |
| `css/tooltip.css` | Treatise: `.margin-note` | Hover card as gloss |
| `css/animations.css` | `relic-common.css` keyframes | Full motion vocabulary |
| `css/onboarding.css` | — | Keep existing, apply paper surface to tooltip |
| `src/graph/rebuild.js` | `movement-library.ts`: `mulberry32`, `pointRing`, `drawLater` | Jitter system, ornamental SVG generation |

---

## Part XII — Implementation Order

Following the cabinet project's own lesson: *build the editorial system first, the ornament engine second, and the shader relics third.*

### Phase 1: Tokens & Surfaces (1–2 sessions)
1. Replace all color tokens in `tokens.css` with the manuscript palette
2. Replace body and graph canvas backgrounds with the layered paper system
3. Replace sidebar background with `--paper-mid`
4. Update typography to Cormorant SC for display
5. Test both themes at all three density modes

### Phase 2: Component Refinement (2–3 sessions)
6. Restyle profile card with manuscript structure (heading, rule, drop-cap, justified bio)
7. Restyle chips, badges, pills to use ink hierarchy instead of colored backgrounds
8. Add ornamental dividers between sidebar sections
9. Restyle command palette as concordance
10. Restyle hover card as gloss
11. Update edge type/confidence/grade encoding

### Phase 3: Ornamental Layer (1–2 sessions)
12. Add `movement-library.js` to the project
13. Use `renderMini()` for loader, empty states, era markers, dynasty emblems
14. Add folio corner ornaments to the main page
15. Add headpiece pattern to the header or sidebar header

### Phase 4: Motion & Polish (1 session)
16. Import motion vocabulary from `relic-common.css`
17. Add self-drawing edge animation on selection
18. Add staggered tree-branch reveal
19. Add dormant-motion IntersectionObserver
20. Test `prefers-reduced-motion`
21. Test Dhivehi RTL at all breakpoints

---

## Appendix: The Raadhavalhi Principle

The raadhavalhi — the Maldivian historical chronicle of kings — was a manuscript tradition spanning centuries. It recorded lineage, succession, and the deeds of rulers in Thaana script on paper and palm-leaf.

What Rannavaaru is building is a digital raadhavalhi. The visual system should carry this awareness quietly. Not through decoration, but through the gravity of the page: the quality of the paper, the weight of the ink, the restraint of the ornament, and the sense that this record — like the manuscript tradition before it — is being composed with care, for those who will read it after us.

The page is the religion. The graph is the miracle.

# Rannavaaru Implementation Spec

## Companion to the Visual Integration Guide

> This file contains every concrete value an engineer needs to implement the visual redesign. No prose, no philosophy — just specs, tables, and drop-in code.

---

## 1. Complete `tokens.css` (Drop-In Replacement)

```css
/* ═══════════════════════════════════════════
   RANNAVAARU DESIGN TOKENS
   Manuscript-derived visual system
   ═══════════════════════════════════════════ */

:root {
  /* ═══ PAPER SURFACE ═══ */
  --bg:   #ece6dc;    /* primary page */
  --bg2:  #e2dbd0;    /* secondary surface (sidebar, panels) */
  --sf:   #d8cfc2;    /* elevated surface (cards, hover cards) */
  --sf2:  #cec4b5;    /* highest elevation (active card, selected) */

  /* ═══ INK HIERARCHY ═══ */
  --tx:   #16130f;    /* primary text */
  --tx2:  #3a342c;    /* secondary text */
  --tx3:  #6c645d;    /* tertiary text / labels */

  /* ═══ STRUCTURAL ═══ */
  --bd:   rgb(0 0 0 / 0.08);   /* subtle border */
  --bd2:  rgb(0 0 0 / 0.14);   /* strong border */
  --ac:   #8b2d23;              /* accent (rubric red) */
  --ac2:  #a8473a;              /* accent lighter */

  /* ═══ SEMANTIC ═══ */
  --rubric:     #8b2d23;
  --ash:        #6c645d;
  --ash-light:  #9e9589;
  --ghost:      #c4bdb3;
  --rule:       rgb(0 0 0 / 0.10);

  /* ═══ DYNASTY COLORS ═══ */
  --dy-lunar:       #5b7a6e;
  --dy-hilaaly:     #7a6350;
  --dy-utheemu:     #8b2d23;
  --dy-dhiyamigili: #5a6278;
  --dy-isdu:        #7a6a8a;
  --dy-huraagey:    #6b7a4e;
  --dy-devadu:      #8a6e50;
  --dy-unknown:     #8a8478;

  /* ═══ EDGE TYPE COLORS ═══ */
  --ep:   #16130f;    /* parent: ink */
  --es:   #6c645d;    /* sibling: ash */
  --esp:  #8b2d23;    /* spouse: rubric */
  --ek:   #c4bdb3;    /* kin: ghost */

  /* ═══ CONFIDENCE OVERLAYS ═══ */
  --ei:   #6c645d;    /* inferred: ash */
  --eu:   #c4bdb3;    /* uncertain: ghost */

  /* ═══ SOURCE QUALITY ═══ */
  --sq-a: #16130f;    /* grade A: full ink */
  --sq-b: #6c645d;    /* grade B: ash */
  --sq-c: #9e9589;    /* grade C: ash-light */
  --sq-d: #c4bdb3;    /* grade D: ghost */

  /* ═══ TYPOGRAPHY ═══ */
  --serif:    'EB Garamond', 'Cormorant Garamond', Georgia, serif;
  --display:  'Cormorant SC', Georgia, serif;
  --mono:     'JetBrains Mono', 'Courier New', monospace;
  --thaana:   'MV Iyyu Nala', 'MV Boli', 'Noto Sans Thaana', sans-serif;

  /* ═══ TYPE SCALE (px) ═══ */
  --fs-xs:    11px;
  --fs-sm:    12px;
  --fs-base:  15px;
  --fs-md:    17px;
  --fs-lg:    20px;
  --fs-xl:    24px;
  --fs-xxl:   28px;

  /* ═══ SPACING (4px base) ═══ */
  --sp-1: 4px;   --sp-2: 8px;   --sp-3: 12px;  --sp-4: 16px;
  --sp-5: 20px;  --sp-6: 24px;  --sp-7: 28px;  --sp-8: 32px;
  --sp-9: 36px;  --sp-10: 40px; --sp-11: 44px; --sp-12: 48px;

  /* ═══ RADII ═══ */
  --radius:    3px;
  --radius-sm: 1.5px;
  --radius-lg: 6px;

  /* ═══ SHADOWS (warm brown) ═══ */
  --shadow-sm:  0 1px 3px rgba(60, 42, 20, 0.06);
  --shadow-md:  0 4px 12px rgba(60, 42, 20, 0.08);
  --shadow-lg:  0 12px 36px rgba(60, 42, 20, 0.12);

  /* ═══ MOTION ═══ */
  --ease-out:    cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --dur-fast:    150ms;
  --dur-mid:     300ms;
  --dur-slow:    500ms;
  --dur-breath:  8000ms;
  --dur-orbit:   60000ms;
}

/* ═══ DARK THEME ═══ */
[data-theme="dark"] {
  --bg:   #1a1714;
  --bg2:  #221e1a;
  --sf:   #2e2924;
  --sf2:  #3a342e;

  --tx:   #e8e2d6;
  --tx2:  #c8c0b4;
  --tx3:  #9e9589;

  --bd:   rgb(255 255 255 / 0.06);
  --bd2:  rgb(255 255 255 / 0.12);
  --ac:   #c4563e;
  --ac2:  #d4705a;

  --rubric:     #c4563e;
  --ash:        #9e9589;
  --ash-light:  #6c645d;
  --ghost:      #3d3529;
  --rule:       rgb(255 255 255 / 0.08);

  --dy-lunar:       #7da494;
  --dy-hilaaly:     #a08670;
  --dy-utheemu:     #c4563e;
  --dy-dhiyamigili: #7a88a0;
  --dy-isdu:        #9a8ab0;
  --dy-huraagey:    #8a9a6e;
  --dy-devadu:      #b08e6e;
  --dy-unknown:     #9a9488;

  --ep:   #e8e2d6;
  --es:   #9e9589;
  --esp:  #c4563e;
  --ek:   #3d3529;

  --ei:   #9e9589;
  --eu:   #3d3529;

  --sq-a: #e8e2d6;
  --sq-b: #9e9589;
  --sq-c: #6c645d;
  --sq-d: #3d3529;

  --shadow-sm:  0 1px 3px rgba(0, 0, 0, 0.15);
  --shadow-md:  0 4px 12px rgba(0, 0, 0, 0.20);
  --shadow-lg:  0 12px 36px rgba(0, 0, 0, 0.30);
}

/* ═══ DENSITY MODES ═══ */
[data-density="compact"] {
  --fs-base: 13px;
  --fs-md:   15px;
  --node-h:  28px;
  --node-pad: 4px 8px;
  --node-name-size: 11px;
  --node-sub-size: 9px;
}

[data-density="comfortable"] {
  --fs-base: 15px;
  --fs-md:   17px;
  --node-h:  36px;
  --node-pad: 6px 10px;
  --node-name-size: 13px;
  --node-sub-size: 10px;
}

[data-density="presentation"] {
  --fs-base: 17px;
  --fs-md:   20px;
  --node-h:  48px;
  --node-pad: 10px 14px;
  --node-name-size: 16px;
  --node-sub-size: 12px;
}
```

---

## 2. Edge Encoding Matrix

Every edge has three dimensions: **type**, **confidence**, and **grade**. Here is the complete visual encoding:

### Type → Color + Base Width

| Type | Color Variable | Base Stroke Width | Dash Pattern |
|------|---------------|-------------------|-------------|
| Parent | `var(--ep)` | 1.0px | solid |
| Sibling | `var(--es)` | 0.6px | solid |
| Spouse | `var(--esp)` | 0.8px | solid |
| Kin | `var(--ek)` | 0.5px | `2,4` (dotted) |

### Confidence → Dash Override + Opacity

| Confidence | Stroke Dash | Opacity |
|-----------|-------------|---------|
| Confirmed (`c`) | inherit from type | 1.0 |
| Inferred (`i`) | `6,4` | 0.75 |
| Uncertain (`u`) | `2,4` | 0.5 |

### Grade → Width Multiplier

| Grade | Width Multiplier |
|-------|-----------------|
| A | 1.0× |
| B | 0.85× |
| C | 0.7× |
| D | 0.55× |

### Composite Example

A **parent** edge, **inferred** confidence, grade **B**:
- Color: `var(--ep)` (#16130f light / #e8e2d6 dark)
- Width: 1.0 × 0.85 = **0.85px**
- Dash: `6,4`
- Opacity: **0.75**

---

## 3. SVG Node Spec (for `src/graph/rebuild.js`)

### Node Dimensions (per density mode)

| Property | Compact | Comfortable | Presentation |
|----------|---------|-------------|-------------|
| Rect width | auto (text + 24px) | auto (text + 32px) | auto (text + 44px) |
| Rect height | 28px | 36px | 48px |
| Corner radius | 1.5px | 2px | 3px |
| Accent bar width | 2px | 3px | 4px |
| Accent bar offset | 0 | 0 | 0 |
| Name font-size | 11px | 13px | 16px |
| Name y-offset | 18px | 22px | 28px |
| Sub-label font-size | 9px | 10px | 12px |
| Sub-label y-offset | 26px | 33px | 43px |

### Node Colors

```
Background rect:  fill="var(--bg)"   stroke="var(--bd2)" stroke-width="0.5"
Accent bar:       fill="var(--dy-{dynasty})"
Name text:        fill="var(--tx)"   font-family="var(--serif)"
Sub-label text:   fill="var(--tx3)"  font-family="var(--mono)"
```

### Sovereign Badge

An 8-pointed star SVG polygon, placed 4px left of the name text:

```
Comfortable mode: viewBox="0 0 12 12"
Points: 6,0 7.2,4.2 12,4.8 8.4,7.8 9,12 6,9.6 3,12 3.6,7.8 0,4.8 4.8,4.2
fill="var(--ac)"  opacity="0.7"  width="10" height="10"
```

For compact: scale to 8×8. For presentation: scale to 14×14.

### Arrowhead Marker (Diamond)

Replace triangle arrowheads with diamonds:

```xml
<marker id="arrow-{dynasty}" viewBox="0 0 8 8" refX="8" refY="4"
        markerWidth="6" markerHeight="6" orient="auto">
  <polygon points="0,4 4,0 8,4 4,8" fill="var(--dy-{dynasty})" />
</marker>
```

---

## 4. Dynasty → Artefact Mapping

For `MovementLibrary.renderMini()` calls:

| Dynasty | Mini Artefact | Seed |
|---------|--------------|------|
| Lunar | `vesica` | 101 |
| Hilaaly | `chaplet` | 102 |
| Utheemu | `sigilBloom` | 103 |
| Dhiyamigili | `astrolabe` | 104 |
| Isdu | `roseWindow` | 105 |
| Huraagey | `pilgrimStar` | 106 |
| Devadu | `waterClock` | 107 |
| Unknown | `memoryField` | 108 |

### Usage

```js
import { MovementLibrary } from './assets/movement-library.js';

// In sidebar empty state:
MovementLibrary.renderMini('vesica', emptyStateContainer, 200);

// For loader:
MovementLibrary.renderMini('astrolabe', loaderContainer, 2026);

// For dynasty emblem in profile card:
const dynastyArtefact = DYNASTY_ARTEFACT_MAP[person.dy];
MovementLibrary.renderMini(dynastyArtefact, emblemContainer, person.id.hashCode());
```

---

## 5. Paper Surface CSS (Drop-In for `base.css`)

### Body Background

```css
body {
  background:
    radial-gradient(circle at 50% -10%, rgb(255 255 255 / 0.05), transparent 40%),
    linear-gradient(180deg, #231e1a, #171311 58%, #100d0b);
}

[data-theme="light"] body {
  background: #1e1b18;
}
```

### Graph Canvas

```css
.graph-canvas {
  position: relative;
  background:
    radial-gradient(ellipse at 30% 15%, rgb(255 255 255 / 0.14), transparent 40%),
    linear-gradient(175deg, rgb(0 0 0 / 0.02), rgb(255 255 255 / 0.01)),
    var(--bg);
  isolation: isolate;
}

/* Grain */
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

/* Vignette */
.graph-canvas::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 55%, rgb(0 0 0 / 0.04) 100%);
  pointer-events: none;
  z-index: 0;
}
```

### Dark Theme Override

```css
[data-theme="dark"] .graph-canvas {
  background:
    radial-gradient(ellipse at 30% 15%, rgb(255 255 255 / 0.04), transparent 40%),
    linear-gradient(175deg, rgb(255 255 255 / 0.01), rgb(0 0 0 / 0.02)),
    var(--bg);
}

[data-theme="dark"] .graph-canvas::before {
  opacity: 0.08;
  mix-blend-mode: screen;
}

[data-theme="dark"] .graph-canvas::after {
  background: radial-gradient(ellipse at center, transparent 55%, rgb(0 0 0 / 0.08) 100%);
}
```

---

## 6. Sidebar Section Divider (Drop-In)

```css
.sidebar-divider {
  text-align: center;
  margin: var(--sp-4) 0;
  color: var(--ash-light);
  letter-spacing: 0.5em;
  font-size: 10px;
  user-select: none;
  line-height: 1;
}

/* Content: ◆ · ◇ · ◆ — set in HTML or via content */
.sidebar-divider::before {
  content: '◆\00a0·\00a0◇\00a0·\00a0◆';
}
```

---

## 7. Animations (Drop-In for `animations.css`)

```css
/* ═══ Ambient ═══ */
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

@keyframes spinReverse {
  to { transform: rotate(-360deg); }
}

/* ═══ Functional ═══ */
@keyframes revealUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes revealFade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes drawPath {
  to { stroke-dashoffset: 0; }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

/* ═══ Selection ═══ */
@keyframes selectPulse {
  0%   { stroke-width: var(--select-base-w, 1); opacity: 0.9; }
  50%  { stroke-width: calc(var(--select-base-w, 1) * 2.5); opacity: 1; }
  100% { stroke-width: var(--select-base-w, 1); opacity: 0.9; }
}

@keyframes selectGlow {
  0%   { filter: drop-shadow(0 0 0 transparent); }
  50%  { filter: drop-shadow(0 0 4px rgb(139 45 35 / 0.2)); }
  100% { filter: drop-shadow(0 0 0 transparent); }
}

/* ═══ Edge drawing ═══ */
.edge-draw {
  transition: stroke-dashoffset 800ms var(--ease-out);
}

/* ═══ Tree cascade reveal ═══ */
.tree-branch-reveal {
  animation: drawPath 600ms var(--ease-out) forwards;
  animation-delay: calc(var(--tree-depth, 0) * 40ms);
}

/* ═══ Dormant control ═══ */
.is-dormant * {
  animation-play-state: paused !important;
}
```

---

## 8. Component Quick-Reference

### Profile Card Name

```css
.profile-name {
  font-family: var(--display);
  font-size: var(--fs-lg);
  font-variant: small-caps;
  letter-spacing: 0.08em;
  color: var(--tx);
  line-height: 1.3;
}
```

### Profile Card Biography

```css
.profile-bio {
  font-family: var(--serif);
  font-size: var(--fs-base);
  color: var(--tx2);
  text-align: justify;
  hyphens: auto;
  -webkit-hyphens: auto;
  line-height: 1.6;
}

.profile-bio:first-of-type {
  color: var(--tx);
  font-size: var(--fs-md);
}
```

### Pill Buttons (Names / Titles)

```css
.pill {
  display: inline-block;
  font-family: var(--mono);
  font-size: var(--fs-xs);
  color: var(--tx3);
  background: var(--bg2);
  border: 1px solid var(--bd);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  transition: border-color var(--dur-fast) var(--ease-out),
              transform var(--dur-fast) var(--ease-out);
}

.pill:hover {
  border-color: var(--bd2);
  transform: translateY(-1px);
}
```

### Confidence Tags

```css
.tag-confirmed { border: 1px solid var(--tx3); color: var(--tx3); }
.tag-inferred  { border: 1px dashed var(--ash); color: var(--ash); }
.tag-uncertain { border: 1px dotted var(--ghost); color: var(--ghost); background: rgb(0 0 0 / 0.02); }
```

### Source Grade Badges

```css
.grade { 
  display: inline-block; width: 18px; height: 18px; line-height: 18px;
  text-align: center; font-family: var(--mono); font-size: 10px;
  border-radius: var(--radius-sm);
}
.grade-a { background: var(--tx); color: var(--bg); }
.grade-b { border: 1px solid var(--tx3); color: var(--tx3); }
.grade-c { border: 1px dashed var(--ash-light); color: var(--ash-light); }
.grade-d { border: 1px dotted var(--ghost); color: var(--ghost); }
```

### Evidence Strength Bar

```css
.evidence-bar {
  display: flex; height: 6px; border-radius: 1px; overflow: hidden;
  gap: 1px; background: var(--bd);
}
.evidence-bar .confirmed { background: var(--tx); }
.evidence-bar .inferred  { background: var(--ash); }
.evidence-bar .uncertain { background: var(--ghost); }
```

### Hover Card

```css
.hover-card {
  background: var(--bg);
  border: 1px solid var(--bd2);
  box-shadow: var(--shadow-md);
  padding: var(--sp-3) var(--sp-4);
  max-width: 280px;
  animation: revealFade var(--dur-fast) var(--ease-out);
}
```

### Command Palette

```css
.command-palette {
  background: var(--bg);
  border: 1px solid var(--bd2);
  box-shadow: var(--shadow-lg);
  max-width: 520px;
  width: 90vw;
}

.command-palette input {
  font-family: var(--mono);
  font-size: var(--fs-base);
  background: var(--bg2);
  border: 1px solid var(--bd);
  color: var(--tx);
  padding: var(--sp-3) var(--sp-4);
  width: 100%;
}

.command-palette .result-item {
  padding: var(--sp-2) var(--sp-4);
  border-bottom: 1px solid var(--rule);
  font-family: var(--serif);
  cursor: pointer;
}

.command-palette .result-item:hover,
.command-palette .result-item.is-active {
  background: var(--sf);
}

.command-palette .result-dynasty {
  font-family: var(--mono);
  font-size: var(--fs-xs);
  color: var(--tx3);
}
```

### Header

```css
.header {
  background: var(--bg2);
  border-bottom: 1px solid var(--bd);
  height: 54px;
}

.header .brand {
  font-family: var(--display);
  font-variant: small-caps;
  letter-spacing: 0.12em;
  font-size: var(--fs-md);
  color: var(--tx);
}

.header .date-range {
  font-family: var(--mono);
  font-variant-numeric: oldstyle-nums;
  font-size: var(--fs-sm);
  color: var(--tx3);
  letter-spacing: 0.04em;
}
```

---

## 9. RTL / Thaana Overrides

```css
[dir="rtl"] {
  text-align: right;
}

[dir="rtl"] .profile-bio {
  text-align: right;   /* no justify in RTL Thaana */
  hyphens: none;
}

[dir="rtl"] .profile-name {
  font-variant: normal;  /* no small-caps for Thaana */
  letter-spacing: 0;
}

[dir="rtl"] .node-accent {
  /* Accent bar moves to right side */
  x: calc(100% - 3px);
}

/* Thaana needs slightly larger size to match Latin x-height */
[lang="dv"] {
  font-family: var(--thaana);
  font-size: calc(var(--fs-base) * 1.1);
  line-height: 1.7;
}

/* Drop-cap disabled in RTL; use decorated right border instead */
[dir="rtl"] .profile-bio:first-of-type::first-letter {
  float: none;
  font-size: inherit;
}

[dir="rtl"] .profile-bio:first-of-type {
  border-right: 3px solid var(--ac);
  padding-right: var(--sp-3);
}
```

---

## 10. Jitter System (for `rebuild.js`)

Drop-in PRNG for seed-based node irregularity:

```js
function mulberry32(seed) {
  let a = seed >>> 0;
  return function() {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Usage: derive jitter from person ID
function nodeJitter(personId) {
  const seed = hashCode(personId);
  const rng = mulberry32(seed);
  return {
    rx: 1.5 + rng() * 1.5,           // corner radius: 1.5–3px
    accentW: 2.8 + rng() * 0.4,      // accent bar: 2.8–3.2px  
    yShift: (rng() - 0.5) * 0.6,     // vertical micro-shift: ±0.3px
  };
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
```

---

## 11. Folio Corners (for main page frame)

To add corner ornaments to the graph canvas, use the movement library's mini renderer. Place four absolutely-positioned containers at the corners:

```html
<div class="folio-corner folio-corner--nw" id="corner-nw"></div>
<div class="folio-corner folio-corner--ne" id="corner-ne"></div>
<div class="folio-corner folio-corner--sw" id="corner-sw"></div>
<div class="folio-corner folio-corner--se" id="corner-se"></div>
```

```css
.folio-corner {
  position: absolute;
  width: 64px;
  height: 64px;
  opacity: 0.25;
  pointer-events: none;
  mix-blend-mode: multiply;
  z-index: 1;
}
.folio-corner--nw { top: 12px; left: 12px; }
.folio-corner--ne { top: 12px; right: 12px; }
.folio-corner--sw { bottom: 12px; left: 12px; }
.folio-corner--se { bottom: 12px; right: 12px; }
```

```js
const corners = ['nw', 'ne', 'sw', 'se'];
const kinds = ['sigilBloom', 'vesica', 'roseWindow', 'pilgrimStar'];
corners.forEach((pos, i) => {
  MovementLibrary.renderMini(kinds[i], document.getElementById(`corner-${pos}`), 100 + i * 13);
});
```

---

## 12. Files to Deliver to Engineer

| File | Purpose |
|------|---------|
| This spec (`rannavaaru-implementation-spec.md`) | Every concrete value and code snippet |
| The visual guide (`rannavaaru-visual-guide.md`) | Philosophy, rationale, Maldivian context |
| Cabinet zip (`cabinet-of-ink-and-light.zip`) | All reference files, source TS, compiled JS, shared CSS |

The engineer reads the spec for *what to do*, consults the guide for *why*, and opens the cabinet files for *working examples*.

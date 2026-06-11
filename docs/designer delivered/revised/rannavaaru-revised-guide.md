# Rannavaaru — Revised Visual Guide

## For the Engineer Who Has Completed Phase 1

> You've already landed the tokens, the paper surface, the grain, the typography, and the color palette. This document replaces the previous visual guide and implementation spec. It describes what's still missing and — critically — what the previous guides got wrong.

> **Reference mockup:** `rannavaaru-definitive-mockup.html` — open it, study it, leave it running. It is the living reference for everything in this document.

> **Reference source files:** `cabinet-of-ink-and-light.zip` — contains movement-library.js, relic-common.css, relic-enhancer.js, and five HTML files showing the design language in action.

---

## What the Previous Guides Got Wrong

The original guides treated this as a reskinning job: swap the tokens, apply some textures, add a few ornaments, and then optionally animate things in a final "polish" phase. This produced a well-themed app. It did not produce a computational manuscript.

The definitive mockup proved three things the guides failed to communicate:

**1. Motion is not polish — it is the design.**
The guides said "animation is reserved for moments of significance." This is wrong. Animation is the medium. Every sovereign node breathes. Every highlighted edge carries flowing particles. The dynasty rings orbit continuously. The code ghost scrolls. The headpiece redraws itself. The seal rotates and breathes simultaneously. The era margin glows with a traveling highlight. The system is alive at all times, not just during transitions. Without continuous motion, the aesthetic collapses into a static costume.

**2. The graph is an illumination, not a themed canvas.**
The guides described how to skin the existing graph canvas with paper textures. But the graph itself — the dynasty rings behind it, the particles flowing along edges, the nodes that breathe with individual rhythms — is the illumination of the manuscript. The data *produces* the visual system. Dynasty rings are computed from reign span data. Arc lengths are proportional to historical duration. Rotation speeds encode dynasty weight. The graph is not decorated by the manuscript aesthetic; it IS the manuscript.

**3. The code must be visible.**
The guides mentioned a "code underlay" as optional background texture. In the definitive mockup, the code ghost shows the actual force simulation algorithm, the dynasty cluster function, the edge routing logic — the code that builds this specific view. It scrolls continuously. This is not decoration. It is the "computational" in "computational manuscript." The algorithm is visible beneath its own output, like the proofs behind a theorem.

---

## What You've Already Done (Phase 1 ✓)

These are confirmed complete and correct — do not revisit:

- All color tokens replaced with the manuscript palette (paper/ink/rubric/ash/ghost)
- Both light and dark themes with all dynasty colors
- Paper surface on graph canvas (radial gradients, grain at 0.18 opacity, multiply blend, vignette)
- Sidebar surface with secondary paper tone
- Typography switched to EB Garamond / Cormorant SC / JetBrains Mono
- Edge type colors mapped to ink hierarchy (parent=ink, sibling=ash, spouse=rubric, kin=ghost)
- Source quality grades mapped to ink hierarchy
- Body background (dark surround framing the paper folio)

---

## What to Do Next

The remaining work is organized by system, not by CSS file, because the key changes span multiple files and require JS work in `src/graph/rebuild.js`.

---

### System 1: Continuous Node Motion

**Files:** `css/graph.css`, `css/animations.css`, `src/graph/rebuild.js`

Every sovereign node breathes. Not on hover. Not on selection. Always. This is the heartbeat of the manuscript.

```css
@keyframes breatheNode {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.008); }
}
```

In `rebuild.js`, when constructing a sovereign node's `<g>` group:

```js
if (person.re && person.re.length > 0) {
  // Sovereign — assign breathing
  const period = 10 + mulberry32(hashCode(person.id))() * 6; // 10–16s
  const delay = mulberry32(hashCode(person.id) + 1)() * 8;   // 0–8s phase offset
  g.style.animation = `breatheNode ${period}s ease-in-out ${delay}s infinite`;
}
```

Each sovereign gets a unique period (10–16s) and phase offset (0–8s) derived from their person ID via the `mulberry32` PRNG. This means the nodes breathe gently but out of sync — like heartbeats in a crowd.

The sovereign star ornament also breathes independently:

```css
@keyframes breatheSov {
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 0.85; }
}
```

Apply with a 6-second period and a random phase offset per node.

The selected node gets a rubric glow pulse that settles:

```css
@keyframes selectGlow {
  0%   { filter: none; stroke-width: 0.5; }
  50%  { filter: drop-shadow(0 0 4px rgb(139 45 35 / 0.12)); stroke-width: 1.8; }
  100% { filter: none; stroke-width: 1.2; }
}
```

This runs once (not infinite) and holds at the final state.

**`prefers-reduced-motion`:** All breathing and ambient animations are paused. Selection glow still runs once since it communicates state.

---

### System 2: Edge Particles

**Files:** `src/graph/rebuild.js` (new particle system), `css/graph.css`

This is the most important new system. Highlighted edges carry a continuous flow of tiny dots from source to destination. The lineage flows visibly.

```js
// Particle system — add to rebuild.js
const particleGroup = svgRoot.appendChild(
  document.createElementNS(NS, 'g')
);

function spawnParticle(pathElement) {
  const len = pathElement.getTotalLength();
  if (!len) return;

  const dot = document.createElementNS(NS, 'circle');
  dot.setAttribute('r', 1.2 + Math.random() * 0.3);
  dot.setAttribute('fill', 'var(--tx)');
  dot.setAttribute('opacity', '0');
  particleGroup.appendChild(dot);

  let t = 0;
  const speed = 0.0006 + Math.random() * 0.0006;

  function step() {
    t += speed;
    if (t > 1) {
      particleGroup.removeChild(dot);
      return;
    }
    const pt = pathElement.getPointAtLength(t * len);
    dot.setAttribute('cx', pt.x);
    dot.setAttribute('cy', pt.y);
    dot.setAttribute('opacity', (Math.sin(t * Math.PI) * 0.3).toFixed(3));
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Emit a wave of particles along all highlighted edges every 4.5 seconds
function emitWave() {
  highlightedEdgePaths.forEach((path, i) => {
    setTimeout(() => spawnParticle(path), i * 180);
  });
}

setInterval(emitWave, 4500);
```

Each particle travels from source to destination at a slightly different speed (0.06–0.12% of path length per frame). Opacity follows `sin(t * π)` — fades in at origin, peaks at midpoint, fades out at destination. The stagger of 180ms between edges in a wave means the particles don't all start at once.

**Performance note:** Each wave spawns one particle per highlighted edge. A typical selection highlights 3–8 edges. Each particle lives for ~2–3 seconds. Maximum concurrent particles: ~15. This is negligible. If performance is a concern at extreme zoom-out (100+ visible edges), limit particle emission to the 8 nearest highlighted edges.

**`prefers-reduced-motion`:** Disable the particle system entirely. The static highlighted edges still communicate the same information.

---

### System 3: Dynasty Rings (Orrery)

**Files:** `src/graph/rebuild.js`, `css/animations.css`

Behind the graph, concentric dynasty rings rotate like an astrolabe. Each ring is computed from data:

```js
const dynastyData = [
  { key: 'Lunar',       color: '--dy-lunar',       reignYears: 268, startYear: 1117 },
  { key: 'Hilaaly',     color: '--dy-hilaaly',      reignYears: 188, startYear: 1385 },
  { key: 'Utheemu',     color: '--dy-utheemu',      reignYears: 119, startYear: 1573 },
  { key: 'Dhiyamigili', color: '--dy-dhiyamigili',  reignYears:  67, startYear: 1692 },
  { key: 'Huraagey',    color: '--dy-huraagey',     reignYears:  59, startYear: 1759 },
  // Isdu, Devadu, unknown — add if data supports
];

const TOTAL_YEARS = 851; // 1117–1968
const orreryGroup = svgRoot.insertBefore(
  document.createElementNS(NS, 'g'),
  edgeGroup  // insert BEHIND edges
);
orreryGroup.setAttribute('opacity', '0.5');

dynastyData.forEach((d, i) => {
  const r = 75 + i * 42;  // concentric radii
  const rotationPeriod = 60 + d.reignYears * 0.35; // longer dynasty = slower

  const g = document.createElementNS(NS, 'g');
  g.style.animation = `spin ${rotationPeriod}s linear infinite`;
  g.style.transformOrigin = `${centerX}px ${centerY}px`;

  // Main circle
  circle(g, centerX, centerY, r, `var(${d.color})`, 0.45, 0.1);

  // Dashed inner circle
  circle(g, centerX, centerY, r - 4, `var(${d.color})`, 0.12, 0.05, '1.5,6');

  // Era arc — proportional to reign span
  const arcAngle = (d.reignYears / TOTAL_YEARS) * Math.PI * 2;
  const startAngle = -Math.PI / 2;
  arc(g, centerX, centerY, r, startAngle, arcAngle, `var(${d.color})`, 1.1, 0.07);

  // Diamond at arc start
  diamondAt(g, centerX + r * Math.cos(startAngle),
               centerY + r * Math.sin(startAngle),
               `var(${d.color})`, 0.1);

  orreryGroup.appendChild(g);
});

// Innermost breathing ring
const innerRing = circle(orreryGroup, centerX, centerY, 55, 'var(--tx)', 0.2, 0.04);
innerRing.style.animation = `breathe 16s ease-in-out infinite`;
innerRing.style.transformOrigin = `${centerX}px ${centerY}px`;

// Central star
star4(orreryGroup, centerX, centerY, 6, 'var(--tx)', 0.04);
```

The dynasty currently selected in the filter panel should have its ring at slightly higher opacity (0.15 instead of 0.07 for the arc).

```css
@keyframes spin { to { transform: rotate(360deg); } }
```

**The rings respond to era filtering.** When the user scrubs the era slider, the ring corresponding to the current era pulses briefly (opacity spikes from 0.07 to 0.15 over 400ms, then fades back).

---

### System 4: Code Ghost

**Files:** `css/base.css`, new JS module or inline in the graph component

A continuously scrolling underlay showing the algorithm that builds the current view.

```css
.code-ghost {
  position: absolute;
  inset: 0;
  z-index: 0;    /* behind everything */
  font-family: var(--mono);
  font-size: 0.48rem;
  line-height: 1.3;
  color: var(--ghost);
  opacity: 0.12;
  overflow: hidden;
  padding: 40px 40px 40px 58px;
  pointer-events: none;
}

.code-ghost-inner {
  white-space: pre;
  animation: codeScroll 140s linear infinite;
}

@keyframes codeScroll {
  from { transform: translateY(0); }
  to   { transform: translateY(-50%); }
}
```

The inner element contains the code text duplicated twice (for seamless looping). The code should be the actual force simulation setup, the dynasty ring geometry calculation, and the edge routing function — taken from your real source files. Not lorem ipsum, not pseudo-code. The real algorithm. The manuscript shows its own computation.

When the view changes (graph → tree), the code ghost text should change to show the tree layout algorithm instead.

---

### System 5: Era Margin Glow

**Files:** `css/layout.css`, `css/animations.css`

A faint rubric radial gradient that drifts slowly along the era axis, as if a reading lamp is moving across the page.

```css
.era-glow {
  position: absolute;
  left: 0;
  width: 48px;   /* same width as era margin */
  height: 50px;
  background: radial-gradient(
    ellipse at right center,
    rgb(139 45 35 / 0.06),
    transparent 70%
  );
  pointer-events: none;
  z-index: 2;
  animation: eraTravel 22s ease-in-out infinite alternate;
}

@keyframes eraTravel {
  0%   { top: 58%; }  /* adjust to match your era range */
  100% { top: 72%; }
}
```

The glow should travel between the dates of the currently filtered era. When the era filter changes, update the keyframe endpoints (or use a CSS custom property with JS).

**`prefers-reduced-motion`:** Glow stays static at the midpoint of the era range.

---

### System 6: Self-Drawing Edges

**Files:** `src/graph/rebuild.js`, `css/animations.css`

When a node is selected and its edges become highlighted, each edge draws itself:

```js
function animateEdgeDraw(pathElement, delayMs) {
  const len = pathElement.getTotalLength();
  pathElement.style.strokeDasharray = len;
  pathElement.style.strokeDashoffset = len;
  pathElement.style.animation =
    `edgeDraw 1.6s var(--ease-out) ${delayMs}ms forwards`;
}

// Stagger: each edge gets a random delay 0–600ms
highlightedEdges.forEach(path => {
  animateEdgeDraw(path, Math.random() * 600);
});
```

```css
@keyframes edgeDraw { to { stroke-dashoffset: 0; } }
```

For tree mode, the stagger should follow depth: `delay = depth * 120ms + random(0, 200ms)`.

---

### System 7: Sidebar Seal

**Files:** `css/components.css`, new JS or inline SVG in sidebar component

The dynasty seal at the top of the sidebar is the most complex single ornament. It has three layers:

**Outer ring** — rotates once per 90 seconds, carries cardinal tick marks and 8-fold radial lines:
```css
.seal-outer {
  animation: spin 90s linear infinite;
  transform-origin: center;
}
```

**Inner star** — a 16-pointed star built from three nested star polygons, breathes on a 10s cycle:
```css
.seal-inner {
  animation: sealBreathe 10s ease-in-out infinite;
  transform-origin: center;
}

@keyframes sealBreathe {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.03); }
}
```

**Orbit dots** — 8 dots on the outer circle, counter-rotating at 55 seconds:
```css
.seal-orbits {
  animation: spinReverse 55s linear infinite;
  transform-origin: center;
}
```

The seal should be 100px × 100px. It uses the dynasty color of the currently selected person. When the selection changes to a different dynasty, the seal color transitions over 400ms.

A JS helper to generate the star polygon points:

```js
function starPoints(cx, cy, n, outerR, innerR) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const angle = (Math.PI * i) / n - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    pts.push(`${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`);
  }
  return pts.join(' ');
}

// Three nested stars for the seal:
// starPoints(50, 50, 16, 38, 22)  — outer
// starPoints(50, 50, 16, 28, 17)  — middle
// starPoints(50, 50,  8, 14,  8)  — inner
```

---

### System 8: Self-Drawing Headpiece

**Files:** `css/components.css`, `css/animations.css`, sidebar component

The ornamental headpiece at the top of the sidebar draws itself on load and periodically redraws (every 30 seconds):

```css
@keyframes headpieceDraw {
  to { stroke-dashoffset: 0; }
}

@keyframes headpieceRedraw {
  0%, 90% { stroke-dashoffset: 0; }
  95%     { stroke-dashoffset: var(--len); }
  100%    { stroke-dashoffset: 0; }
}
```

Each path element in the headpiece SVG gets:

```js
const len = path.getTotalLength();
path.style.strokeDasharray = len;
path.style.strokeDashoffset = len;
path.style.setProperty('--len', len);
path.style.animation =
  `headpieceDraw 1.5s var(--ease-out) ${i * 120}ms forwards,
   headpieceRedraw 30s var(--ease-out) ${3 + i * 0.2}s infinite`;
```

This means the headpiece draws itself on first load (staggered by element), then every 30 seconds the strokes briefly retract and re-emerge — the scribe's pen retracing its own flourish.

---

### System 9: Node Jitter

**Files:** `src/graph/rebuild.js`

Already specified in the previous guide but critical to restate: every node rectangle, every accent bar width, every edge control point should be slightly irregular via the `mulberry32` PRNG seeded from the person/edge ID.

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
```

Node jitter: corner radius 1.5–3px, accent bar width 2.7–3.3px. Edge jitter: Bézier control point offsets ±1–5px from computed position. This is what makes the graph feel drawn rather than rendered. Without it, the aesthetic is lifeless no matter how much motion you add.

---

## Revised Implementation Order

The original guide put motion last. That was the fundamental mistake. Here is the correct order, starting from where you are now:

### Phase 2: The Breath (1–2 sessions)
1. Add `breatheNode` animation to all sovereign nodes with per-ID period/phase
2. Add `breatheSov` animation to all sovereign star ornaments
3. Add `selectGlow` animation on node selection
4. Add self-drawing edge animation on selection (staggered)
5. Test `prefers-reduced-motion` — all ambient stops, selection glow still fires once

### Phase 3: The Flow (1–2 sessions)
6. Build the edge particle system
7. Wire it to emit waves every 4.5s along highlighted edges
8. Build the dynasty orrery rings from dynasty data
9. Wire orrery ring opacity to era filter changes
10. Add the innermost breathing ring and central star

### Phase 4: The Ghost (1 session)
11. Add the code ghost element to the graph canvas
12. Populate it with your actual force simulation / tree layout code
13. Add the `codeScroll` animation (140s continuous)
14. Switch code text when graph/tree view changes

### Phase 5: The Seal and Ornaments (1–2 sessions)
15. Build the 3-layer dynasty seal SVG for the sidebar
16. Wire seal color to selected person's dynasty
17. Build the self-drawing headpiece for the sidebar
18. Add the era margin glow
19. Add folio corner ornaments

### Phase 6: Component Refinement (1–2 sessions)
20. Restyle sidebar profile with illuminated initial, centered name, ornamental name-rule
21. Restyle pills, badges, confidence tags per the implementation spec
22. Add ornamental dividers (◆ · ◇ · ◆) between sidebar sections
23. Restyle command palette as manuscript concordance
24. Restyle hover card with corner brackets and terminal ornament
25. Test Dhivehi RTL at all breakpoints

---

## Amended Token Values

The tokens from Phase 1 are correct. Add these motion tokens if not already present:

```css
:root {
  /* ═══ MOTION — amended ═══ */
  --ease-out:    cubic-bezier(0.25, 0.1, 0.25, 1);
  --dur-fast:    200ms;
  --dur-mid:     400ms;
  --dur-slow:    800ms;
  --dur-draw:    1600ms;  /* edge self-draw */
  --dur-breath:  12s;     /* mean sovereign breathing period */
  --dur-orbit:   90s;     /* seal outer ring period */
  --dur-orrery:  80s;     /* fastest dynasty ring (Utheemu) */
  --dur-code:    140s;    /* code ghost scroll period */
  --dur-glow:    22s;     /* era glow travel period */
  --dur-redraw:  30s;     /* headpiece redraw cycle */
}
```

---

## Amended Animations (complete `animations.css`)

```css
/* ═══ AMBIENT — always running ═══ */

@keyframes breatheNode {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.008); }
}

@keyframes breatheSov {
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 0.85; }
}

@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%      { transform: scale(1.02); opacity: 0.88; }
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50%      { opacity: 0.75; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes spinReverse {
  to { transform: rotate(-360deg); }
}

@keyframes codeScroll {
  from { transform: translateY(0); }
  to   { transform: translateY(-50%); }
}

@keyframes eraTravel {
  0%   { top: var(--era-glow-start, 58%); }
  100% { top: var(--era-glow-end, 72%); }
}

@keyframes sealBreathe {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.03); }
}

/* ═══ TRIGGERED — on interaction ═══ */

@keyframes selectGlow {
  0%   { filter: none; stroke-width: 0.5; }
  50%  { filter: drop-shadow(0 0 4px rgb(139 45 35 / 0.12)); stroke-width: 1.8; }
  100% { filter: none; stroke-width: 1.2; }
}

@keyframes edgeDraw {
  to { stroke-dashoffset: 0; }
}

@keyframes nodeIn {
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes headpieceDraw {
  to { stroke-dashoffset: 0; }
}

@keyframes headpieceRedraw {
  0%, 90% { stroke-dashoffset: 0; }
  95%     { stroke-dashoffset: var(--len); }
  100%    { stroke-dashoffset: 0; }
}

/* ═══ REDUCED MOTION ═══ */

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  /* Exception: allow selectGlow to fire once for state communication */
  .node-bg.is-selected {
    animation-duration: 600ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

---

## Complete File Checklist

Everything the engineer needs:

| File | What It Is |
|------|-----------|
| This document (`rannavaaru-revised-guide.md`) | What to build, in what order, with all code |
| `rannavaaru-definitive-mockup.html` | The living reference — open it, keep it running |
| `cabinet-of-ink-and-light.zip` | Source files for ornamental library and animation vocabulary |
| `rannavaaru-implementation-spec.md` | Still valid for: tokens.css, edge encoding matrix, node dimensions, dynasty-artefact mapping, RTL overrides, component CSS snippets |

The implementation spec is still correct for everything it covers. This document supersedes the original visual guide entirely and amends the implementation spec's animation section and implementation order.

---

## The Principle

A raadhavalhi was never finished. Each reign added a page. Each scribe added their hand. The manuscript grew. It breathed with the life of the dynasty it recorded.

This is what continuous motion means in Rannavaaru. The nodes breathe because the lineage is alive in the record. The particles flow because descent is not a static fact but a living connection. The dynasty rings orbit because time does not stop at the edge of a database query. The code scrolls because the computation is continuous, not a one-time render.

The manuscript computes. The lineage flows. Nothing is still.

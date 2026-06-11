/**
 * Code Ghost — the algorithm visible beneath its own output.
 * "The computational in computational manuscript."
 *
 * Continuously scrolling monospace overlay showing the actual
 * force simulation / tree layout code that builds the current view.
 */

// ── Graph-mode code excerpt (force simulation + edge routing) ──
const GRAPH_CODE = `// ═══ Force-directed graph simulation ═══
// N-body charge repulsion + link spring + collision avoidance

sim = d3.forceSimulation(nodes)
  .force("link",    d3.forceLink(links).id(d => d.id)
                      .distance(dens.forceDistance)
                      .strength(0.3))
  .force("charge",  d3.forceManyBody()
                      .strength(dens.forceCharge))
  .force("center",  d3.forceCenter(W / 2, H / 2))
  .force("collide", d3.forceCollide(d => (d._hw || 40) + 6)
                      .strength(0.85)
                      .iterations(1))
  .force("x",       d3.forceX(W / 2).strength(0.04))
  .force("y",       d3.forceY(H / 2).strength(0.04))
  .alphaDecay(0.05);

// ═══ Edge stroke color by relationship type ═══
function edgeStrokeColor(e) {
  if (e.t === "parent")  return cs("--ep");
  if (e.t === "sibling") return cs("--es");
  if (e.t === "spouse")  return cs("--esp");
  return cs("--ek");  // kin
}

// ═══ Dynasty color mapping ═══
// Manuscript pigment tones:
//   Lunar      → verdigris  #5b7a6e
//   Hilaaly    → burnt ochre #7a6350
//   Utheemu    → rubric red  #8b2d23
//   Dhiyamigili → woad blue  #5a6278
//   Huraagey   → terre verte #6b7a4e

function dynastyColor(dy) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue("--dy-" + dy.toLowerCase())
    .trim() || "#8a8478";
}

// ═══ Node sizing from text bounding box ═══
nodes.each(function (d) {
  const label = personName(d);
  const bb = cachedBBox(textEl, label, fontSize);
  const w = bb.width + pad * 2;
  const h = bb.height + 10;
  d._hw = w / 2;
  d._hh = h / 2;
});

// ═══ Orrery ring geometry ═══
// Concentric dynasty rings, rotation ∝ reign duration
//   period = 60 + reignYears × 0.35 seconds
const DYNASTIES = [
  { key: "lunar",       r:  75, reign: 268 },
  { key: "hilaaly",     r: 117, reign: 188 },
  { key: "utheemu",     r: 159, reign: 119 },
  { key: "dhiyamigili", r: 201, reign:  67 },
  { key: "huraagey",    r: 243, reign:  59 },
];

// ═══ Highlight: self-drawing edges ═══
edges.each(function (d) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  el.style.strokeDasharray = len;
  el.style.strokeDashoffset = len;
  el.style.animation =
    \`edgeDraw 1.6s var(--ease-out) \${delay}ms forwards\`;
});

// ═══ Particle system ═══
// Opacity follows sin(t × π): fade in → peak → fade out
function spawnParticle(edge) {
  let t = 0;
  const speed = 0.0006 + rng() * 0.0006;
  function step() {
    t += speed;
    if (t > 1) { dot.remove(); return; }
    const pt = getPoint(t);
    dot.setAttribute("cx", pt.x);
    dot.setAttribute("cy", pt.y);
    dot.setAttribute("opacity",
      (Math.sin(t * Math.PI) * 0.3).toFixed(3));
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ═══ Sovereign breathing ═══
// Each sovereign rect scales 1.000 → 1.008
// Period: 10–16s, phase offset via seeded PRNG
const rng = mulberry32(hashCode(node.id));
const period = 10 + rng() * 6;
const phase  = -(rng() * 8);
rect.style.animation =
  \`breatheNode \${period}s ease-in-out \${phase}s infinite\`;`;

// ── Tree-mode code excerpt (chronological placement) ──
const TREE_CODE = `// ═══ Chronological tree layout ═══
// Replace depth-based Y with date-aware Y positioning

function chronoPostProcess(root, pxPerYear, minYear) {
  const queue = [root];
  root.chronoY = 0;
  const rootYear = nodeYear(root.data);
  if (rootYear)
    root.chronoY = (rootYear - minYear) * pxPerYear;

  while (queue.length) {
    const node = queue.shift();
    if (!node?.children) continue;
    for (const child of node.children) {
      const yr = nodeYear(child.data);
      if (yr) {
        const ideal = (yr - minYear) * pxPerYear;
        child.chronoY = Math.max(ideal,
          node.chronoY + minGap);
      } else {
        child.chronoY = node.chronoY + depthY;
      }
      queue.push(child);
    }
  }
}

// ═══ Undated node interpolation ═══
// Walk ancestor chain up, descendant chain down,
// interpolate proportionally between dated nodes
hierarchy.each(node => {
  if (nodeYear(node)) return;
  let ancestor = node.parent;
  while (ancestor && !nodeYear(ancestor))
    ancestor = ancestor.parent;
  if (!ancestor) return;

  let dated = null, depth = 0;
  const find = (n, d) => {
    if (dated) return;
    if (nodeYear(n) && n !== node) {
      dated = n; depth = d; return;
    }
    if (n.children) n.children.forEach(
      c => find(c, d + 1));
  };
  find(node, 0);
  if (!dated) return;

  const frac = ancestorDepth / totalSteps;
  node.chronoY = ancestor.chronoY +
    frac * (dated.chronoY - ancestor.chronoY);
});

// ═══ Multi-column interval coloring ═══
// Greedy assignment: 3 columns max
function assignColumns(trees) {
  const cols = [[], [], []];
  trees.sort((a, b) => a.minYear - b.minYear);
  for (const tree of trees) {
    let best = 0, bestEnd = Infinity;
    for (let c = 0; c < cols.length; c++) {
      const last = cols[c].at(-1);
      const end = last ? last.maxYear : -Infinity;
      if (end < bestEnd) { best = c; bestEnd = end; }
    }
    tree.col = best;
    cols[best].push(tree);
  }
  return trees;
}

// ═══ Node year extraction ═══
function nodeYear(node) {
  return node.re?.[0]?.[0]  // reign start
    || node.yb              // birth year
    || (node.yd             // death year − 50
        ? node.yd - 50
        : null);
}

// ═══ Isolated node attachment ═══
// Multi-pass: spouse > parent > sibling > kin
function attachIsolates(isolates, treeNodes, edges) {
  const priority = { spouse: 0, parent: 1,
                     sibling: 2, kin: 3 };
  for (const iso of isolates) {
    let bestEdge = null, bestPri = 4;
    for (const e of edges) {
      const { s, t } = linkIds(e);
      if (s !== iso.id && t !== iso.id) continue;
      const pri = priority[e._e.t] ?? 3;
      if (pri < bestPri) {
        bestEdge = e; bestPri = pri;
      }
    }
    if (!bestEdge) continue;
    const anchor = treeNodes.get(
      linkIds(bestEdge).s === iso.id
        ? linkIds(bestEdge).t
        : linkIds(bestEdge).s);
    if (!anchor) continue;
    iso.x = anchor.x + offset;
    iso.y = anchor.y;
  }
}

// ═══ Coral-branch bezier curves ═══
// Vertical-first path: drop down, then sweep across
function treePath(s, t) {
  const midY = s.y + (t.y - s.y) * 0.5;
  return \`M\${s.x},\${s.y}
          C\${s.x},\${midY}
           \${t.x},\${midY}
           \${t.x},\${t.y}\`;
}

// ═══ Era overlay time annotations ═══
dynastyTransitions.forEach(dt => {
  const y = (dt.year - minYear) * pxPerYear;
  layer.append("line")
    .attr("x1", x0).attr("x2", x1)
    .attr("y1", y).attr("y2", y)
    .attr("stroke", dynastyColor(dt.dynasty))
    .attr("stroke-opacity", 0.3);
  layer.append("text")
    .attr("x", x0 - 6).attr("y", y + 3)
    .text(dt.short || dt.label);
});`;

let ghostEl = null;
let innerEl = null;

/**
 * Initialize the code ghost. Call once after DOM ready.
 * Creates the overlay element inside #ga.
 */
export function initCodeGhost() {
  const ga = document.getElementById('ga');
  if (!ga || ghostEl) return;

  ghostEl = document.createElement('div');
  ghostEl.className = 'code-ghost';
  ghostEl.setAttribute('aria-hidden', 'true');

  innerEl = document.createElement('div');
  innerEl.className = 'code-ghost-inner';
  ghostEl.appendChild(innerEl);

  // Insert as first child of #ga so it sits behind SVG
  ga.insertBefore(ghostEl, ga.firstChild);

  // Default to graph code
  setGhostCode('graph');
}

/**
 * Switch the ghost code content based on view mode.
 * @param {'graph'|'tree'} mode
 */
export function setGhostCode(mode) {
  if (!innerEl) return;
  const code = mode === 'tree' ? TREE_CODE : GRAPH_CODE;
  // Duplicate for seamless loop
  innerEl.textContent = code + '\n\n' + code;
}

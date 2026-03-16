import * as d3 from 'd3';
import state from '../state.js';
import { filt, computeEraPersonOk } from './filter.js';
import { hiN, hiE, clH } from './highlight.js';
import { showD, showLinkDetail } from '../ui/sidebar.js';
import { cs, eC, nC } from '../utils/css.js';
import { fR, esc } from '../utils/format.js';
import { timelineExtent } from '../data/timeline.js';
import { dynastyTransitions, eraMilestones } from '../data/era-events.js';
import { personName, relationLabel, t } from '../ui/i18n.js';
import { showNodeHoverCard, moveHoverCard, hideHoverCard } from '../ui/hover-card.js';
import { computeTreePlacement } from './tree-placement-core.js';

const TIME_EXTENT = timelineExtent();
const PROGRESSIVE_THRESHOLD = 140;
let treePlacementCache = null;
let graphRenderRefs = null;
let graphTickRaf = 0;
let graphLastSyncTs = 0;
let graphStableTicks = 0;
let treePlacementWorker = null;
let treePlacementWorkerReady = false;
let treePlacementWorkerFailed = false;
const treePlacementWorkerPending = new Set();
const treePlacementWorkerCache = new Map();
const TREE_PLACEMENT_WORKER_CACHE_MAX = 4;

// Cache for text BBox measurements to avoid forced reflows on re-renders
const _bboxCache = new Map();
function cachedBBox(textEl, label, fontSize) {
  const key = `${label}|${fontSize}`;
  let cached = _bboxCache.get(key);
  if (cached) return cached;
  const bb = textEl.getBBox();
  cached = { x: bb.x, y: bb.y, width: bb.width, height: bb.height };
  _bboxCache.set(key, cached);
  return cached;
}
// Clear cache on language change (labels change)
if (typeof window !== 'undefined') {
  window.addEventListener('lang-changed', () => _bboxCache.clear());
}

function degreeRank(nodes, links) {
  const degree = new Map(nodes.map(n => [n.id, 0]));
  links.forEach(l => {
    const { s, t } = linkIds(l);
    if (degree.has(s)) degree.set(s, degree.get(s) + 1);
    if (degree.has(t)) degree.set(t, degree.get(t) + 1);
  });
  return {
    degree,
    ranked: nodes
      .slice()
      .sort((a, b) => {
        const d = (degree.get(b.id) || 0) - (degree.get(a.id) || 0);
        if (d !== 0) return d;
        const ay = a.re?.[0]?.[0] ?? 99999;
        const by = b.re?.[0]?.[0] ?? 99999;
        return ay - by;
      })
  };
}

function graphProgressiveReveal(nodes, links) {
  if (nodes.length < PROGRESSIVE_THRESHOLD) return null;
  const { degree, ranked } = degreeRank(nodes, links);
  const adj = new Map(nodes.map(n => [n.id, new Set()]));
  links.forEach(l => {
    const { s, t } = linkIds(l);
    adj.get(s)?.add(t);
    adj.get(t)?.add(s);
  });

  let target = Math.max(92, Math.min(220, Math.round(nodes.length * 0.5)));
  if (state.density === "compact") target = Math.max(80, target - 18);
  if (state.density === "presentation") target = Math.min(nodes.length, target + 20);
  const reveal = new Set();

  const seeds = [];
  if (state.selId && adj.has(state.selId)) seeds.push(state.selId);
  else if (state.selEdge) {
    const { s, t } = linkIds(state.selEdge);
    if (adj.has(s)) seeds.push(s);
    if (adj.has(t)) seeds.push(t);
  }
  ranked.slice(0, Math.max(14, Math.ceil(target * 0.16))).forEach(n => seeds.push(n.id));

  const q = [];
  const seen = new Set();
  seeds.forEach(id => {
    if (seen.has(id)) return;
    seen.add(id);
    q.push({ id, d: 0 });
  });
  while (q.length && reveal.size < target) {
    const cur = q.shift();
    reveal.add(cur.id);
    if (cur.d >= 2) continue;
    const next = [...(adj.get(cur.id) || [])]
      .sort((a, b) => (degree.get(b) || 0) - (degree.get(a) || 0));
    for (const id of next) {
      if (seen.has(id)) continue;
      seen.add(id);
      q.push({ id, d: cur.d + 1 });
      if (q.length > 1800) break;
    }
  }
  if (reveal.size < target) {
    ranked.forEach(n => {
      if (reveal.size >= target) return;
      reveal.add(n.id);
    });
  }
  return {
    reveal,
    target,
    total: nodes.length
  };
}

function linkIds(l) {
  return {
    s: typeof l.source === "object" ? l.source.id : l.source,
    t: typeof l.target === "object" ? l.target.id : l.target
  };
}

function relationTypeLabel(t) {
  return relationLabel(t);
}

function confidenceLabel(c) {
  if (c === "c") return t('confirmed');
  if (c === "i") return t('inferred');
  return t('uncertain');
}

function dynastyColor(dy) {
  const key = `--dy-${(dy || "unknown").toLowerCase()}`;
  return cs(key) || cs("--ac");
}

function trimLabel(s, n = 26) {
  if (!s) return "";
  return s.length > n ? `${s.slice(0, n - 1)}\u2026` : s;
}

function densityProfile() {
  if (state.density === "compact") {
    return {
      text: 11,
      padMale: 8,
      padFemale: 11,
      treeNodeY: 48,
      treeNodeX: 150,
      treeDepthNudge: 9,
      treeDepthY: 58,
      treeSiblingX: 130,
      treeSectionGap: 40,
      treeCharW: 6.5,
      forceDistance: 78,
      forceCharge: -640,
      forceCollide: 32,
      forceStrength: 0.032,
      maxLabelChars: 18
    };
  }
  if (state.density === "presentation") {
    return {
      text: 14,
      padMale: 11,
      padFemale: 15,
      treeNodeY: 70,
      treeNodeX: 210,
      treeDepthNudge: 16,
      treeDepthY: 86,
      treeSiblingX: 180,
      treeSectionGap: 60,
      treeCharW: 8.0,
      forceDistance: 120,
      forceCharge: -1060,
      forceCollide: 50,
      forceStrength: 0.04,
      maxLabelChars: 28
    };
  }
  return {
    text: 12,
    padMale: 9,
    padFemale: 13,
    treeNodeY: 58,
    treeNodeX: 170,
    treeDepthNudge: 12,
    treeDepthY: 68,
    treeSiblingX: 150,
    treeSectionGap: 48,
    treeCharW: 7.1,
    forceDistance: 90,
    forceCharge: -800,
    forceCollide: 40,
    forceStrength: 0.035,
    maxLabelChars: 22
  };
}

function deconflictY(rows, minGap = 20) {
  const out = [];
  let last = -Infinity;
  rows.forEach(r => {
    if (Math.abs(r.y - last) < minGap) return;
    out.push(r);
    last = r.y;
  });
  return out;
}

function drawGraphEraOverlay() {
  if (!state.svgEl || state.W < 220 || state.H < 160) return;
  const pad = 14;
  const width = Math.max(250, Math.min(430, state.W - pad * 2));
  const height = 46;
  const x = pad;
  const y = Math.max(8, state.H - height - 12);
  const sx = d3.scaleLinear()
    .domain([TIME_EXTENT.min, TIME_EXTENT.max])
    .range([10, width - 10]);

  const transitions = dynastyTransitions
    .filter(d => d.year >= TIME_EXTENT.min && d.year <= TIME_EXTENT.max)
    .slice()
    .sort((a, b) => a.year - b.year);
  const milestones = eraMilestones
    .filter(d => d.year >= TIME_EXTENT.min && d.year <= TIME_EXTENT.max)
    .slice()
    .sort((a, b) => a.year - b.year);

  state.svgEl.selectAll("g.era-ov").remove();
  const g = state.svgEl.append("g")
    .attr("class", "era-ov")
    .attr("transform", `translate(${x},${y})`)
    .attr("pointer-events", "none");

  // Clip path to prevent text escaping the rounded rect
  const clipId = "eov-clip";
  const clip = g.append("clipPath").attr("id", clipId);
  clip.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("rx", 8)
    .attr("ry", 8);

  g.append("rect")
    .attr("class", "eov-bg")
    .attr("width", width)
    .attr("height", height)
    .attr("rx", 8)
    .attr("ry", 8);

  // Content group clipped to the rounded rect
  const gc = g.append("g").attr("clip-path", `url(#${clipId})`);

  gc.append("line")
    .attr("class", "eov-axis")
    .attr("x1", 10)
    .attr("x2", width - 10)
    .attr("y1", 24)
    .attr("y2", 24);

  gc.selectAll("line.eov-ms")
    .data(milestones)
    .enter()
    .append("line")
    .attr("class", "eov-ms")
    .attr("x1", d => sx(d.year))
    .attr("x2", d => sx(d.year))
    .attr("y1", 19)
    .attr("y2", 29);

  gc.selectAll("circle.eov-dot")
    .data(transitions)
    .enter()
    .append("circle")
    .attr("class", "eov-dot")
    .attr("cx", d => sx(d.year))
    .attr("cy", 24)
    .attr("r", 2.6)
    .attr("fill", d => dynastyColor(d.dynasty));

  // Right-aligned caption (drawn first so labels can avoid its space)
  const cap = state.eraEnabled && Number.isFinite(state.eraYear)
    ? `${state.eraYear}`
    : `${t('all_eras')} ${TIME_EXTENT.min}\u2013${TIME_EXTENT.max}`;
  const capReserved = cap.length * 5.5 + 16; // approximate px width of caption

  // De-conflict transition labels to avoid overlap
  const charW = 5.2; // approximate px per character at 8-9px font
  const insetL = 10, insetR = 10; // padding inside the rounded rect
  const labelled = [];
  let lastEndTop = insetL, lastEndBot = insetL; // start past left padding
  for (const d of transitions) {
    const cx = sx(d.year);
    const txt = `${d.year} ${trimLabel(d.short || d.label, 12)}`;
    const halfW = (txt.length * charW) / 2;
    // Skip if label would intrude into the caption's reserved zone
    if (cx + halfW > width - capReserved) continue;
    // Clamp center so text stays within padded bounds
    const clampedCx = Math.max(insetL + halfW, Math.min(width - insetR - halfW, cx));
    // Alternate rows: even index = top (y=12), odd = bottom (y=42)
    const row = labelled.length % 2;
    const lastEnd = row === 0 ? lastEndTop : lastEndBot;
    if (clampedCx - halfW < lastEnd + 6) continue; // 6px minimum gap
    labelled.push({ ...d, _txt: txt, _row: row, _cx: clampedCx });
    if (row === 0) lastEndTop = clampedCx + halfW;
    else lastEndBot = clampedCx + halfW;
  }
  gc.selectAll("text.eov-lbl")
    .data(labelled)
    .enter()
    .append("text")
    .attr("class", "eov-label")
    .attr("x", d => d._cx)
    .attr("y", d => d._row === 0 ? 12 : 42)
    .attr("text-anchor", "middle")
    .text(d => d._txt);

  gc.append("text")
    .attr("class", "eov-year")
    .attr("x", width - 10)
    .attr("y", 12)
    .attr("text-anchor", "end")
    .text(cap);

  if (state.eraEnabled && Number.isFinite(state.eraYear)) {
    const xNow = sx(Math.max(TIME_EXTENT.min, Math.min(TIME_EXTENT.max, state.eraYear)));
    const near = [...transitions, ...milestones]
      .slice()
      .sort((a, b) => Math.abs(a.year - state.eraYear) - Math.abs(b.year - state.eraYear))[0];
    gc.append("line")
      .attr("class", "eov-now")
      .attr("x1", xNow)
      .attr("x2", xNow)
      .attr("y1", 6)
      .attr("y2", 40);
    if (near) {
      gc.append("text")
        .attr("class", "eov-year")
        .attr("x", Math.min(width - 8, xNow + 8))
        .attr("y", 30)
        .attr("text-anchor", xNow > width - 110 ? "end" : "start")
        .text(trimLabel(near.short || near.label, 24));
    }
  }
}

function drawTreeEraAnnotations(g, yScale, minYear, maxYear, xExtent) {
  const transitions = dynastyTransitions
    .filter(d => d.year >= minYear && d.year <= maxYear)
    .map(d => ({
      ...d,
      kind: "transition",
      y: yScale(d.year),
      color: dynastyColor(d.dynasty)
    }));
  const milestones = eraMilestones
    .filter(d => d.year >= minYear && d.year <= maxYear)
    .map(d => ({
      ...d,
      kind: d.kind || "milestone",
      y: yScale(d.year),
      color: cs("--bd2")
    }));
  const rows = deconflictY([...transitions, ...milestones].sort((a, b) => a.y - b.y), 20);
  const hasNow = state.eraEnabled
    && Number.isFinite(state.eraYear)
    && state.eraYear >= minYear
    && state.eraYear <= maxYear;
  const layer = g.selectAll("g.era-ann")
    .data(rows.length || hasNow ? [0] : [])
    .join("g")
    .attr("class", "era-ann")
    .attr("pointer-events", "none");
  if (layer.empty()) return;

  layer.selectAll("line.era-guide")
    .data(rows, d => `${d.kind}|${d.year}|${d.label || d.short || ""}`)
    .join("line")
    .attr("class", "era-guide")
    .attr("x1", 20)
    .attr("x2", xExtent)
    .attr("y1", d => d.y)
    .attr("y2", d => d.y)
    .attr("stroke", d => d.color)
    .attr("stroke-opacity", d => d.kind === "transition" ? 0.2 : 0.13)
    .attr("stroke-dasharray", d => d.kind === "transition" ? "2,4" : "1,7");

  layer.selectAll("circle.era-dot")
    .data(rows.filter(r => r.kind === "transition"), d => `${d.year}|${d.label || d.short || ""}`)
    .join("circle")
    .attr("class", "era-dot")
    .attr("cx", 24)
    .attr("cy", d => d.y)
    .attr("r", 2.4)
    .attr("fill", d => d.color);

  layer.selectAll("text.era-label")
    .data(rows, d => `${d.kind}|${d.year}|${d.label || d.short || ""}`)
    .join("text")
    .attr("class", "era-label")
    .attr("x", 30)
    .attr("y", d => d.y - 4)
    .attr("fill", d => d.kind === "transition" ? d.color : cs("--tx3"))
    .text(d => `${d.year} \u00b7 ${trimLabel(d.short || d.label, 34)}`);

  layer.selectAll("line.era-now")
    .data(hasNow ? [yScale(state.eraYear)] : [])
    .join("line")
    .attr("class", "era-now")
    .attr("x1", 20)
    .attr("x2", xExtent)
    .attr("y1", d => d)
    .attr("y2", d => d)
    .attr("stroke", cs("--ac"))
    .attr("stroke-width", 1.35)
    .attr("stroke-opacity", 0.74);

  layer.selectAll("text.era-now-label")
    .data(hasNow ? [yScale(state.eraYear)] : [])
    .join("text")
    .attr("class", "era-now-label")
    .attr("x", 30)
    .attr("y", d => d - 6)
    .text(`${t('filter_year')}: ${state.eraYear}`);
}

function sourceGradeColor(g) {
  if (g === "A") return cs("--sq-a");
  if (g === "B") return cs("--sq-b");
  if (g === "D") return cs("--sq-d");
  return cs("--sq-c");
}

function edgeStrokeColor(e) {
  if (state.overlayMode === "confidence") {
    if (e.c === "c") return cs("--ac2");
    if (e.c === "i") return cs("--ei");
    return cs("--eu");
  }
  if (state.overlayMode === "source") return sourceGradeColor(e.confidence_grade);
  return eC(e);
}

function edgeDashArray(e, isExtraParent = false) {
  if (state.overlayMode === "source") {
    if (isExtraParent) return "3,5";
    const g = e.confidence_grade || "C";
    if (g === "A") return null;
    if (g === "B") return "4,2";
    if (g === "C") return "2,4";
    return "1,6";
  }
  if (isExtraParent) return "3,5";
  return e.c === "i" ? "5,4" : e.c === "u" ? "3,5" : null;
}

function edgeOpacity(e, base) {
  if (state.overlayMode === "confidence") {
    if (e.c === "c") return Math.max(base, 0.88);
    if (e.c === "i") return Math.max(base * 0.86, 0.7);
    return Math.max(base * 0.8, 0.6);
  }
  if (state.overlayMode === "source") {
    const g = e.confidence_grade || "C";
    if (g === "A") return Math.max(base, 0.92);
    if (g === "B") return Math.max(base * 0.92, 0.78);
    if (g === "C") return Math.max(base * 0.85, 0.64);
    return Math.max(base * 0.75, 0.5);
  }
  return base;
}

function edgeWidth(e, parentW, otherW) {
  const base = e.t === "parent" ? parentW : otherW;
  if (state.overlayMode === "confidence") {
    if (e.c === "u") return base + 0.45;
    if (e.c === "c") return base + 0.3;
    return base + 0.2;
  }
  if (state.overlayMode === "source") {
    const g = e.confidence_grade || "C";
    if (g === "A") return base + 0.5;
    if (g === "B") return base + 0.25;
    if (g === "D") return base + 0.1;
  }
  return base;
}

function sameLink(a, b) {
  const la = linkIds(a);
  const lb = linkIds(b);
  const dir = (la.s === lb.s && la.t === lb.t) || (la.s === lb.t && la.t === lb.s);
  if (!dir) return false;
  return (a?._e?.t || "kin") === (b?._e?.t || "kin");
}

function edgeSelectionKey(link) {
  const { s, t } = linkIds(link);
  const a = s < t ? s : t;
  const b = s < t ? t : s;
  return `${a}|${b}|${link?._e?.t || "kin"}`;
}

function ensureLayer(parent, className) {
  return parent.selectAll(`g.${className}`).data([className]).join("g").attr("class", className);
}

function treePlacementCacheKey(nodes, links, dens, lang) {
  const nodeIds = nodes.map(n => n.id).sort().join(",");
  const nodeLabelShape = nodes
    .map(n => `${n.id}:${personName(n).length}:${n.g === "F" ? 1 : 0}`)
    .sort()
    .join(",");
  const edgeKeys = links
    .map(l => {
      const { s, t } = linkIds(l);
      return `${s}|${t}|${l._e.t}|${l._e.c}|${l._e.confidence_grade || ""}`;
    })
    .sort()
    .join(",");
  return [
    lang,
    dens.treeSiblingX,
    dens.treeDepthY,
    dens.treeSectionGap,
    dens.maxLabelChars,
    nodeIds,
    nodeLabelShape,
    edgeKeys
  ].join("::");
}

function toTreePlacementValue(output) {
  return {
    pos: new Map(output.pos),
    depthMap: new Map(output.depthMap),
    sections: output.sections,
    yOffset: output.yOffset,
    treeMinYear: output.treeMinYear,
    treePxPerYear: output.treePxPerYear,
    treeBaseY: output.treeBaseY,
    treeMaxColX: output.treeMaxColX
  };
}

function toTreePlacementInput(nodes, links, dens) {
  return {
    nodes: nodes.map(n => ({
      id: n.id,
      label: personName(n),
      g: n.g,
      dy: n.dy,
      n: n.n || [],
      re: n.re || [],
      yb: n.yb,
      yd: n.yd
    })),
    links: links.map(l => {
      const { s, t } = linkIds(l);
      return {
        s,
        d: t,
        t: l._e.t,
        c: l._e.c,
        confidence_grade: l._e.confidence_grade,
        l: l._e.l
      };
    }),
    dens: {
      padMale: dens.padMale,
      padFemale: dens.padFemale,
      treeDepthY: dens.treeDepthY,
      treeSiblingX: dens.treeSiblingX,
      treeSectionGap: dens.treeSectionGap,
      treeCharW: dens.treeCharW,
      maxLabelChars: dens.maxLabelChars
    },
    labels: {
      earlySovereigns: t('early_sovereigns') || 'Early Sovereigns',
      unconnected: t('unconnected') || 'Unconnected'
    }
  };
}

function trimTreeWorkerCache() {
  while (treePlacementWorkerCache.size > TREE_PLACEMENT_WORKER_CACHE_MAX) {
    const firstKey = treePlacementWorkerCache.keys().next().value;
    if (!firstKey) break;
    treePlacementWorkerCache.delete(firstKey);
  }
}

function treePlacementWorkerEnabled() {
  if (typeof window === 'undefined' || typeof Worker === 'undefined') return false;
  const policy = String(window.__treePlacementWorkerPolicy || '').toLowerCase();
  if (policy === 'off' || policy === 'false' || policy === 'disabled') return false;
  if (policy === 'on' || policy === 'true' || policy === 'enabled') return true;
  return !window.__disableTreePlacementWorker;
}

function ensureTreePlacementWorker() {
  if (treePlacementWorkerFailed || !treePlacementWorkerEnabled()) return null;
  if (treePlacementWorker) return treePlacementWorker;
  try {
    const worker = new Worker(new URL('./tree-placement-worker.js', import.meta.url), { type: 'module' });
    worker.addEventListener('message', event => {
      const msg = event.data;
      if (!msg || !msg.key) return;
      treePlacementWorkerPending.delete(msg.key);
      if (msg.type === 'tree-placement-result') {
        treePlacementWorkerCache.set(msg.key, toTreePlacementValue(msg.result));
        trimTreeWorkerCache();
        treePlacementWorkerReady = true;
      }
    });
    worker.addEventListener('error', () => {
      treePlacementWorkerFailed = true;
      treePlacementWorkerReady = false;
      treePlacementWorkerPending.clear();
      treePlacementWorkerCache.clear();
      treePlacementWorker = null;
    });
    treePlacementWorker = worker;
  } catch {
    treePlacementWorkerFailed = true;
    treePlacementWorker = null;
  }
  return treePlacementWorker;
}

function queueTreePlacementWorker(key, input) {
  if (treePlacementCache?.key === key) return;
  if (treePlacementWorkerCache.has(key) || treePlacementWorkerPending.has(key)) return;
  const worker = ensureTreePlacementWorker();
  if (!worker) return;
  treePlacementWorkerPending.add(key);
  worker.postMessage({
    type: 'tree-placement-request',
    key,
    payload: input
  });
}

function syncGraphDom() {
  if (!graphRenderRefs) return;
  const refs = graphRenderRefs;
  refs.gL.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
  refs.gN.attr("transform", d => `translate(${d.x},${d.y})`);
  refs.edgeLabelSel
    .attr("x", d => (d.source.x + d.target.x) / 2)
    .attr("y", d => (d.source.y + d.target.y) / 2);
  if (refs.gBadges) {
    refs.gBadges
      .attr("x", d => (refs.nodeMap.get(d.id)?.x || 0) + d.ox)
      .attr("y", d => (refs.nodeMap.get(d.id)?.y || 0) + d.oy);
  }
}

function scheduleGraphDomSync(minIntervalMs = 14) {
  if (graphTickRaf) return;
  graphTickRaf = requestAnimationFrame(ts => {
    graphTickRaf = 0;
    if (minIntervalMs > 0 && ts - graphLastSyncTs < minIntervalMs) return;
    graphLastSyncTs = ts;
    syncGraphDom();
  });
}

function maybeStopStableGraphSimulation(sim) {
  const alpha = sim.alpha?.() ?? 0;
  if (alpha > 0.045) {
    graphStableTicks = 0;
    return;
  }
  let maxVelocity = 0;
  for (const n of state.nodes) {
    const vx = Math.abs(n.vx || 0);
    const vy = Math.abs(n.vy || 0);
    if (vx > maxVelocity) maxVelocity = vx;
    if (vy > maxVelocity) maxVelocity = vy;
  }
  if (maxVelocity < 0.03) graphStableTicks += 1;
  else graphStableTicks = 0;
  if (graphStableTicks < 10) return;
  graphStableTicks = 0;
  sim.alphaTarget?.(0);
  sim.stop?.();
  syncGraphDom();
  document.getElementById("ld")?.classList.add("dn");
}

function restoreSelectionHighlight() {
  if (state.selId) {
    const exists = state.nodes.some(n => n.id === state.selId);
    if (exists) hiN(state.selId);
    else state.selId = null;
  }
  if (!state.selId && state.selEdge) {
    const edgeIdx = state._edgeBySelectionKey;
    const match = edgeIdx?.get?.(edgeSelectionKey(state.selEdge))
      || state.links.find(l => sameLink(l, state.selEdge));
    if (match) {
      state.selEdge = match;
      hiE(match);
    } else {
      state.selEdge = null;
    }
  }
  if (!state.selId && !state.selEdge) clH();
}

function bindLinkInteractions(sel, tooltip) {
  if (!sel) return;
  const nodeById = state._nodeById || new Map(state.nodes.map(n => [n.id, n]));
  const nm = id => personName(nodeById.get(id) || id);
  sel
    .attr("tabindex", 0)
    .attr("role", "button")
    .attr("aria-label", d => {
      const e = d._e || {};
      const { s, t } = linkIds(d);
      return `${relationTypeLabel(e.t || "kin")}: ${nm(s)} \u2192 ${nm(t)}`;
    });
  sel
    .on("mouseenter", (ev, d) => {
      const e = d._e || {};
      const { s: hSrc, t: hTgt } = linkIds(d);
      tooltip.innerHTML = `<b>${esc(relationTypeLabel(e.t || "kin"))}</b><div class="ts">${esc(nm(hSrc))} \u2192 ${esc(nm(hTgt))} \u00b7 ${esc(confidenceLabel(e.c || "u"))}${e.confidence_grade ? ` \u00b7 ${esc(t('confidence_grade'))} ${esc(e.confidence_grade)}` : ""}${e.l ? ` \u00b7 ${esc(e.l)}` : ""}</div>`;
      tooltip.classList.add("sh");
    })
    .on("mousemove", ev => {
      tooltip.style.left = (ev.clientX + 12) + "px";
      tooltip.style.top = (ev.clientY + 12) + "px";
    })
    .on("mouseleave", () => tooltip.classList.remove("sh"))
    .on("click", (ev, d) => {
      ev.stopPropagation();
      state.selId = null;
      state.selEdge = d;
      hiE(d);
      showLinkDetail(d);
      if (!state.sidebarOpen) window.dispatchEvent(new CustomEvent('request-sidebar-open'));
    })
    .on("keydown", (ev, d) => {
      if (ev.key !== "Enter" && ev.key !== " ") return;
      ev.preventDefault();
      ev.stopPropagation();
      state.selId = null;
      state.selEdge = d;
      hiE(d);
      showLinkDetail(d);
      if (!state.sidebarOpen) window.dispatchEvent(new CustomEvent('request-sidebar-open'));
    });
}

/**
 * Lightweight era-only update: toggles visibility on existing node/edge DOM elements
 * based on the current era year. Returns true if the visible set changed (meaning
 * a full rebuild is needed), false if only display toggling was sufficient.
 */
export function updateEraVisibility() {
  if (!state.gN || !state.gL) return true; // no DOM yet, need full rebuild
  const eraOk = computeEraPersonOk();
  // Check if the visible set changed
  const prevIds = new Set(state.nodes.map(n => n.id));
  let changed = false;
  for (const id of eraOk) {
    if (!prevIds.has(id)) { changed = true; break; }
  }
  if (!changed) {
    for (const id of prevIds) {
      if (!eraOk.has(id)) { changed = true; break; }
    }
  }
  if (changed) return true; // different people visible, need full rebuild

  // Same set — just update era overlay/status text
  const mode = state.viewMode === "tree" ? t('tree') : t('graph');
  const stat = [state.nodes.length, state.links.length, mode];
  if (state.eraEnabled && Number.isFinite(state.eraYear)) stat.push(`${t('year_word')}: ${state.eraYear}`);
  if (state.focusMode) stat.push(t('focus'));
  document.getElementById("st").textContent = stat.join(" \u00b7 ");
  return false;
}

export function rebuild() {
  // Save previous node positions for warm-start
  const prevPositions = new Map();
  if (state.nodes) {
    state.nodes.forEach(n => {
      if (Number.isFinite(n.x) && Number.isFinite(n.y)) {
        prevPositions.set(n.id, { x: n.x, y: n.y, vx: n.vx || 0, vy: n.vy || 0 });
      }
    });
  }

  const prevNodeById = new Map((state.nodes || []).map(n => [n.id, n]));
  const prevLinkByKey = new Map();
  (state.links || []).forEach(l => {
    const sid = typeof l.source === "object" ? l.source.id : l.source;
    const tid = typeof l.target === "object" ? l.target.id : l.target;
    const key = `${sid}|${tid}|${l._e?.t || "kin"}|${l._e?.c || ""}|${l._e?.confidence_grade || ""}|${l._e?.l || ""}`;
    prevLinkByKey.set(key, l);
  });

  const data = filt();
  state.nodes = data.nodes.map(p => {
    const prev = prevNodeById.get(p.id);
    if (!prev) return { ...p };
    Object.assign(prev, p);
    return prev;
  });
  state.links = data.links.map(e => {
    const key = `${e.s}|${e.d}|${e.t}|${e.c}|${e.confidence_grade || ""}|${e.l || ""}`;
    const prev = prevLinkByKey.get(key);
    if (prev) {
      prev.source = e.s;
      prev.target = e.d;
      prev._e = e;
      return prev;
    }
    return { source: e.s, target: e.d, _e: e };
  });

  // Restore positions for surviving nodes (warm-start)
  let survivorCount = 0;
  if (prevPositions.size > 0) {
    state.nodes.forEach(n => {
      const prev = prevPositions.get(n.id);
      if (prev) {
        n.x = prev.x; n.y = prev.y;
        n.vx = prev.vx; n.vy = prev.vy;
        survivorCount++;
      }
    });
  }
  state._warmStart = prevPositions.size > 0 && survivorCount > state.nodes.length * 0.5;

  state._nodeById = new Map(state.nodes.map(n => [n.id, n]));

  // Build cached adjacency map for O(1) neighbor lookup (used by highlight.js)
  const makeAdjMap = () => new Map(state.nodes.map(n => [n.id, new Set()]));
  const adj = makeAdjMap();
  const adjByType = new Map();
  const edgeBySelection = new Map();
  state.links.forEach(l => {
    const sid = typeof l.source === "object" ? l.source.id : l.source;
    const tid = typeof l.target === "object" ? l.target.id : l.target;
    adj.get(sid)?.add(tid);
    adj.get(tid)?.add(sid);
    const relType = l._e?.t || "kin";
    let typed = adjByType.get(relType);
    if (!typed) {
      typed = makeAdjMap();
      adjByType.set(relType, typed);
    }
    typed.get(sid)?.add(tid);
    typed.get(tid)?.add(sid);
    edgeBySelection.set(edgeSelectionKey(l), l);
  });
  state._adj = adj;
  state._adjByType = adjByType;
  state._edgeBySelectionKey = edgeBySelection;

  // Build cached parentByChild map for ancestral flow (used by highlight.js)
  const pbc = new Map();
  state.links.forEach(l => {
    if (l._e.t !== "parent") return;
    const sid = typeof l.source === "object" ? l.source.id : l.source;
    const tid = typeof l.target === "object" ? l.target.id : l.target;
    const arr = pbc.get(tid) || [];
    arr.push(sid);
    pbc.set(tid, arr);
  });
  state._parentByChild = pbc;
  const mode = state.viewMode === "tree" ? t('tree') : t('graph');
  const stat = [state.nodes.length, state.links.length, mode];
  if (state.eraEnabled && Number.isFinite(state.eraYear)) stat.push(`${t('year_word')}: ${state.eraYear}`);
  if (state.focusMode) stat.push(t('focus'));
  if (state.overlayMode === "confidence") stat.push(t('overlay_confidence'));
  if (state.overlayMode === "source") stat.push(t('overlay_source'));
  document.getElementById("st").textContent = stat.join(" \u00b7 ");

  const area = document.getElementById("ga");
  state.W = area.clientWidth;
  state.H = area.clientHeight;
  state.svgEl = d3.select("#sv");

  // Persistent scaffolding: create defs, gg, and zoom binding only once
  if (!state._svgScaffold) {
    state.svgEl.selectAll("*").remove();
    const defs = state.svgEl.append("defs").attr("class", "persistent-defs");
    // Node drop shadow filter (static)
    const dropFilter = defs.append("filter").attr("id", "nodeShadow").attr("x", "-20%").attr("y", "-20%").attr("width", "140%").attr("height", "140%");
    dropFilter.append("feDropShadow").attr("dx", 0).attr("dy", 2).attr("stdDeviation", 3).attr("flood-color", "rgba(0,0,0,0.25)").attr("flood-opacity", 0.4);
    // Default arrow marker (fallback)
    defs.append("marker").attr("id", "ar-default").attr("viewBox", "0 0 10 10").attr("refX", 10).attr("refY", 5)
      .attr("markerWidth", 5).attr("markerHeight", 5).attr("orient", "auto-start-reverse")
      .append("path").attr("d", "M0 0L10 5L0 10z").attr("fill", cs("--ep"));
    const ggGroup = state.svgEl.append("g").attr("class", "gg");
    state.svgEl.call(state.zoomBehavior);
    state._svgScaffold = { defs, ggGroup };
  }

  // Update dynasty markers (only add new ones)
  const defs = state._svgScaffold.defs;
  const seenDy = new Set();
  defs.selectAll("marker[id^='ar-']").each(function () {
    const id = d3.select(this).attr("id");
    if (id && id !== "ar-default") seenDy.add(id.replace("ar-", ""));
  });
  state.nodes.forEach(n => {
    const dy = (n.dy || 'unknown').toLowerCase();
    if (seenDy.has(dy)) return;
    seenDy.add(dy);
    defs.append("marker").attr("id", `ar-${dy}`).attr("viewBox", "0 0 10 10").attr("refX", 10).attr("refY", 5)
      .attr("markerWidth", 5).attr("markerHeight", 5).attr("orient", "auto-start-reverse")
      .append("path").attr("d", "M0 0L10 5L0 10z").attr("fill", dynastyColor(dy));
  });

  // Persistent mode roots: graph and tree are updated incrementally via keyed joins
  const g = state._svgScaffold.ggGroup;
  const graphRoot = ensureLayer(g, "mode-graph");
  const treeRoot = ensureLayer(g, "mode-tree");

  if (state.viewMode !== "tree") {
    const prewarmDens = densityProfile();
    const prewarmKey = treePlacementCacheKey(state.nodes, state.links, prewarmDens, state.lang);
    if (treePlacementCache?.key !== prewarmKey && !treePlacementWorkerCache.has(prewarmKey)) {
      queueTreePlacementWorker(prewarmKey, toTreePlacementInput(state.nodes, state.links, prewarmDens));
    }
  }

  if (state.viewMode === "tree") {
    graphRoot.style("display", "none");
    treeRoot.style("display", null);
    state.svgEl.call(state.zoomBehavior.transform, d3.zoomIdentity);
  } else if (state.tr !== d3.zoomIdentity) {
    treeRoot.style("display", "none");
    graphRoot.style("display", null);
    state.svgEl.call(state.zoomBehavior.transform, state.tr);
  } else {
    treeRoot.style("display", "none");
    graphRoot.style("display", null);
  }

  if (state.viewMode === "tree" && state.sim) {
    state.sim.stop();
    state.sim = null;
  }
  if (state.viewMode !== "graph") {
    graphRenderRefs = null;
    graphStableTicks = 0;
    if (graphTickRaf) {
      cancelAnimationFrame(graphTickRaf);
      graphTickRaf = 0;
    }
  }
  state.gLH = null;
  state.gBadges = null;
  if (state.viewMode === "tree") {
    renderTree(treeRoot);
    state.svgEl.selectAll("g.era-ov").remove();
  } else {
    renderGraph(graphRoot);
    // Defer era overlay to avoid blocking initial render
    setTimeout(() => drawGraphEraOverlay(), 0);
  }

  const tooltip = document.getElementById("tt");
  bindLinkInteractions(state.gLH, tooltip);
  state.gN.on("mouseenter", (ev, d) => {
    showNodeHoverCard(ev, d);
  })
    .on("mousemove", ev => { moveHoverCard(ev); })
    .on("mouseleave", () => hideHoverCard());

  state.gN.on("click", (ev, d) => {
    // Ignore click immediately following a drag gesture.
    if (d.__dragEndedAt && Date.now() - d.__dragEndedAt < 140) return;
    ev.stopPropagation();
    state.selId = d.id;
    state.selEdge = null;
    showD(d.id);
    hiN(d.id);
    if (!state.sidebarOpen) window.dispatchEvent(new CustomEvent('request-sidebar-open'));
  });
  state.gN.on("keydown", (ev, d) => {
    if (ev.key !== "Enter" && ev.key !== " ") return;
    ev.preventDefault();
    ev.stopPropagation();
    state.selId = d.id;
    state.selEdge = null;
    showD(d.id);
    hiN(d.id);
    if (!state.sidebarOpen) window.dispatchEvent(new CustomEvent('request-sidebar-open'));
  });
  state.svgEl.on("click", () => {
    state.selId = null;
    state.selEdge = null;
    clH();
    window.dispatchEvent(new CustomEvent('selection-changed', { detail: { type: 'none' } }));
  });
  restoreSelectionHighlight();
  if (!state.loaderHidden) {
    const reduceMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const delay = reduceMotion ? 0 : 1400;
    setTimeout(() => {
      document.getElementById("ld").classList.add("dn");
      state.loaderHidden = true;
    }, delay);
  }
}

function drawNodes(g, withDrag = false) {
  const dens = densityProfile();
  const nodeSel = g.selectAll("g.node")
    .data(state.nodes, d => d.id)
    .join(
      enter => {
        const gn = enter.append("g").attr("class", "node");
        gn.append("rect").attr("class", "node-body");
        gn.append("rect").attr("class", "node-accent").attr("width", 3);
        gn.append("text").attr("class", "node-name");
        return gn;
      },
      update => update,
      exit => exit.remove()
    )
    .attr("cursor", "pointer")
    .attr("data-pr", "1")
    .attr("tabindex", 0)
    .attr("role", "button")
    .attr("aria-label", d => `${t('open_profile_for')} ${personName(d)}`);
  state.gN = nodeSel;

  if (withDrag) {
    state.gN.call(d3.drag()
      .on("start", (e, d) => {
        d.__dragMoved = false;
        d.__dragStartX = e.x;
        d.__dragStartY = e.y;
        if (!e.active) state.sim.alphaTarget(.2).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (e, d) => {
        const dx = Math.abs(e.x - d.__dragStartX);
        const dy = Math.abs(e.y - d.__dragStartY);
        if (dx > 3 || dy > 3) d.__dragMoved = true;
        d.fx = e.x;
        d.fy = e.y;
      })
      .on("end", (e, d) => {
        if (d.__dragMoved) d.__dragEndedAt = Date.now();
        if (!e.active) state.sim.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }));
  } else {
    state.gN.on(".drag", null);
  }
  state.gN.select("rect.node-body")
    .attr("rx", d => d.g === "F" ? 12 : 4).attr("ry", d => d.g === "F" ? 12 : 4)
    .attr("fill", cs("--nf")).attr("stroke", d => nC(d.dy)).attr("stroke-width", d => d.g === "F" ? 2.2 : 1.5)
    .attr("filter", "url(#nodeShadow)");
  state.gN.select("rect.node-accent")
    .attr("rx", d => d.g === "F" ? 12 : 4).attr("ry", d => d.g === "F" ? 12 : 4)
    .attr("fill", d => nC(d.dy)).attr("opacity", 0.85)
    .attr("width", 3);
  state.gN.select("text.node-name")
    .attr("text-anchor", "middle").attr("dy", ".35em").attr("font-size", dens.text)
    .attr("font-family", "var(--sans)").attr("fill", cs("--nt")).attr("font-weight", 500)
    .text(d => (d.g === "F" ? "\u2640 " : "") + trimLabel(personName(d), dens.maxLabelChars));

  state._badgeData = [];
  state.gN.each(function (d) {
    const textEl = d3.select(this).select("text.node-name");
    const label = (d.g === "F" ? "\u2640 " : "") + trimLabel(personName(d), dens.maxLabelChars);
    const bb = cachedBBox(textEl.node(), label, dens.text);
    const p = d.g === "F" ? dens.padFemale : dens.padMale;
    const w = bb.width + p * 2;
    const h = bb.height + 10;
    d3.select(this).select("rect.node-body").attr("x", bb.x - p).attr("y", bb.y - 5).attr("width", w).attr("height", h);
    d3.select(this).select(".node-accent").attr("x", bb.x - p).attr("y", bb.y - 5).attr("height", h);
    d._hw = w / 2; d._hh = h / 2;
    if ((d.n || []).length > 0) {
      state._badgeData.push({
        id: d.id, n: d.n[0], dy: d.dy,
        ox: bb.x + bb.width + p - 2,
        oy: bb.y - 1
      });
    }
  });
}

function renderGraph(g) {
  const dens = densityProfile();
  const base = 0.82;
  const nodeById = new Map(state.nodes.map(n => [n.id, n]));
  const progressive = graphProgressiveReveal(state.nodes, state.links);
  const showEdge = d => {
    if (!progressive) return true;
    const { s, t } = linkIds(d);
    return progressive.reveal.has(s) && progressive.reveal.has(t);
  };
  const edgeBaseOpacity = d => {
    const o = edgeOpacity(d._e, base);
    if (!progressive) return o;
    return showEdge(d) ? o : Math.min(0.07, o * 0.14);
  };
  const linkLayer = ensureLayer(g, "graph-links");
  const labelLayer = g.selectAll("g.graph-edge-labels").data([0]).join("g").attr("class", "elg graph-edge-labels");
  const nodeLayer = ensureLayer(g, "graph-nodes");
  const badgeLayer = g.selectAll("g.graph-badges").data([0]).join("g").attr("class", "badge-layer graph-badges");

  state.gL = linkLayer.selectAll("line.graph-link")
    .data(state.links, d => linkKey(d))
    .join("line")
    .attr("class", "graph-link")
    .attr("stroke", d => edgeStrokeColor(d._e))
    .attr("stroke-width", d => edgeWidth(d._e, 2.2, 1.5))
    .attr("stroke-dasharray", d => edgeDashArray(d._e))
    .attr("stroke-opacity", d => edgeBaseOpacity(d))
    .attr("data-bo", d => edgeBaseOpacity(d))
    .attr("pointer-events", "stroke")
    .attr("stroke-linecap", "round")
    .style("cursor", "pointer")
    .style("display", d => showEdge(d) ? null : "none")
    .attr("marker-end", d => {
      if (d._e.t !== "parent" || d._e.c !== "c") return "";
      const sid = typeof d.source === "object" ? d.source.id : d.source;
      const sn = nodeById.get(sid);
      const dy = (sn?.dy || 'default').toLowerCase();
      return `url(#ar-${dy})`;
    });

  // Hit-area interactions bound directly on gL (no duplicate gLH layer)
  state.gLH = state.gL;

  const lE = state.links.filter(d => d._e.l && (d._e.t !== "parent" || d._e.c !== "c"));
  const edgeLabelSel = labelLayer.selectAll("text")
    .data(lE, d => linkKey(d))
    .join("text")
    .attr("text-anchor", "middle").attr("dy", -3).attr("font-size", 7.5)
    .attr("font-family", "var(--mono)").attr("fill", d => edgeStrokeColor(d._e)).attr("opacity", d => showEdge(d) ? .62 : 0)
    .text(d => d._e.l);

  drawNodes(nodeLayer, true);

  const badgeData = state._badgeData || [];
  if (badgeData.length) {
    state.gBadges = badgeLayer
      .selectAll("text")
      .data(badgeData, d => `${d.id}|${d.n}`)
      .join("text")
      .attr("class", "node-badge")
      .attr("text-anchor", "end")
      .attr("font-size", 8.5)
      .attr("font-family", "var(--mono)")
      .attr("fill", d => nC(d.dy))
      .attr("opacity", 0.8)
      .text(d => "#" + d.n);
  } else {
    badgeLayer.selectAll("*").remove();
    state.gBadges = null;
  }

  if (progressive) {
    state.gN.attr("data-pr", d => progressive.reveal.has(d.id) ? "1" : "0");
    state.gN.select("rect.node-body").attr("opacity", function () {
      return this.parentNode?.getAttribute("data-pr") === "1" ? 1 : 0.23;
    });
    state.gN.select("text.node-name").attr("opacity", function () {
      return this.parentNode?.getAttribute("data-pr") === "1" ? 1 : 0.24;
    });
    const st = document.getElementById("st");
    if (st) st.textContent += ` \u00b7 reveal ${progressive.reveal.size}/${progressive.total}`;
  } else {
    state.gN.attr("data-pr", "1");
    state.gN.select("rect.node-body").attr("opacity", 1);
    state.gN.select("text.node-name").attr("opacity", 1);
  }

  const nodeMap = nodeById;
  const simAlpha = state._warmStart ? 0.3 : 1;
  graphRenderRefs = {
    gL: state.gL,
    gN: state.gN,
    edgeLabelSel,
    gBadges: state.gBadges,
    nodeMap
  };

  let sim = state.sim;
  if (!sim) {
    sim = d3.forceSimulation(state.nodes)
      .on("tick", () => {
        scheduleGraphDomSync(14);
        maybeStopStableGraphSimulation(sim);
      })
      .on("end", () => document.getElementById("ld").classList.add("dn"));
    state.sim = sim;
  }

  sim.nodes(state.nodes);
  const linkForce = sim.force("link");
  if (linkForce) {
    linkForce
      .id(d => d.id)
      .links(state.links)
      .distance(dens.forceDistance)
      .strength(0.3);
  } else {
    sim.force("link", d3.forceLink(state.links).id(d => d.id).distance(dens.forceDistance).strength(0.3));
  }
  sim.force("charge", d3.forceManyBody().strength(dens.forceCharge));
  sim.force("center", d3.forceCenter(state.W / 2, state.H / 2));
  sim.force("collide", d3.forceCollide(d => (d._hw || dens.forceCollide) + 6).strength(0.85).iterations(1));
  sim.force("x", d3.forceX(state.W / 2).strength(dens.forceStrength));
  sim.force("y", d3.forceY(state.H / 2).strength(dens.forceStrength));
  graphStableTicks = 0;
  sim
    .alpha(simAlpha)
    .alphaDecay(0.05)
    .restart();
  syncGraphDom();
}

function drawTreeSectionDividers(g, sections, xExtent) {
  const layer = g.selectAll("g.tree-sections")
    .data(sections.length ? [0] : [])
    .join("g")
    .attr("class", "tree-sections")
    .attr("pointer-events", "none");
  if (layer.empty()) return;

  layer.selectAll("line.tree-sec-line")
    .data(sections, d => `${d.label}|${d.y}|${d.dynasty || ""}`)
    .join("line")
    .attr("class", "tree-sec-line")
    .attr("x1", 30).attr("x2", Math.max(xExtent, 400))
    .attr("y1", d => d.y - 12).attr("y2", d => d.y - 12)
    .attr("stroke", d => d.dynasty ? dynastyColor(d.dynasty) : cs("--bd2"))
    .attr("stroke-opacity", 0.35)
    .attr("stroke-dasharray", "4,6");

  layer.selectAll("circle.tree-sec-dot")
    .data(sections, d => `${d.label}|${d.y}|${d.dynasty || ""}`)
    .join("circle")
    .attr("class", "tree-sec-dot")
    .attr("cx", 22).attr("cy", d => d.y - 12).attr("r", 3)
    .attr("fill", d => d.dynasty ? dynastyColor(d.dynasty) : cs("--bd2"))
    .attr("opacity", 0.6);

  layer.selectAll("text.tree-sec-label")
    .data(sections, d => `${d.label}|${d.y}|${d.dynasty || ""}`)
    .join("text")
    .attr("class", "tree-sec-label")
    .attr("x", 34).attr("y", d => d.y - 18)
    .attr("font-family", "var(--display, var(--sans))")
    .attr("font-size", 10)
    .attr("fill", d => d.dynasty ? dynastyColor(d.dynasty) : cs("--bd2"))
    .attr("opacity", 0.7)
    .text(d => `${d.label}${d.count > 1 ? ` (${d.count})` : ""}`);
}

function estimateNodeWidth(d, dens) {
  const len = Math.min(personName(d).length + (d.g === "F" ? 2 : 0), dens.maxLabelChars);
  const pad = d.g === "F" ? dens.padFemale : dens.padMale;
  return len * dens.treeCharW + pad * 2;
}

function reignSpan(n) {
  const r = n.re;
  if (!r || !r.length) return "";
  const first = r[0];
  if (first.length === 2 && first[0] && first[1]) return `${first[0]}\u2013${first[1]}`;
  if (first.length >= 1 && first[0]) return `r.\u2009${first[0]}`;
  return "";
}

/**
 * Post-process d3.tree() Y coordinates to reflect chronological dates.
 * Keeps X (sibling separation) untouched; only adjusts Y.
 *
 * @param {d3.HierarchyNode} hierarchy - Root of the d3 hierarchy
 * @param {number} pxPerYear - Pixels per calendar year
 * @param {number} treeMinYear - The global minimum year for Y=0
 * @param {number} treeDepthY - Structural depth spacing (fallback for undated)
 * @param {number} minGap - Minimum parent→child gap in px
 */
function chronoPostProcess(hierarchy, pxPerYear, treeMinYear, treeDepthY, minGap) {
  // Step 1: Compute best year for each node (memoised on the hierarchy node)
  function nodeYear(d) {
    const data = d.data;
    return data.re?.[0]?.[0] || data.yb || (data.yd ? data.yd - 50 : null);
  }

  // Step 2: BFS top-down pass — assign chronoY
  const queue = [hierarchy];
  hierarchy.chronoY = 0; // root starts at 0
  const rootYear = nodeYear(hierarchy);
  if (rootYear) {
    hierarchy.chronoY = (rootYear - treeMinYear) * pxPerYear;
  }

  while (queue.length) {
    const node = queue.shift();
    if (!node.children) continue;
    for (const child of node.children) {
      const yr = nodeYear(child);
      if (yr) {
        const idealY = (yr - treeMinYear) * pxPerYear;
        child.chronoY = Math.max(idealY, node.chronoY + minGap);
      } else {
        // No date — use structural fallback offset from parent
        child.chronoY = node.chronoY + treeDepthY;
      }
      queue.push(child);
    }
  }

  // Step 3: Interpolate undated interior nodes between dated ancestor & descendant
  hierarchy.each(node => {
    if (nodeYear(node)) return; // already has a date
    if (!node.parent) return;
    // Find nearest dated ancestor
    let datedAncestor = node.parent;
    while (datedAncestor && !nodeYear(datedAncestor)) datedAncestor = datedAncestor.parent;
    if (!datedAncestor) return;
    // Find nearest dated descendant (DFS among this node's subtree)
    let datedDesc = null;
    let descDepth = 0;
    const findDated = (n, depth) => {
      if (datedDesc) return;
      if (nodeYear(n) && n !== node) { datedDesc = n; descDepth = depth; return; }
      if (n.children) n.children.forEach(c => findDated(c, depth + 1));
    };
    findDated(node, 0);
    if (!datedDesc) return;
    // Count depth from datedAncestor to node
    let ancestorDepth = 0;
    let walk = node;
    while (walk && walk !== datedAncestor) { ancestorDepth++; walk = walk.parent; }
    // Linear interpolation
    const totalSteps = ancestorDepth + descDepth;
    if (totalSteps <= 0) return;
    const frac = ancestorDepth / totalSteps;
    node.chronoY = datedAncestor.chronoY + frac * (datedDesc.chronoY - datedAncestor.chronoY);
    // Enforce minGap from parent
    node.chronoY = Math.max(node.chronoY, node.parent.chronoY + minGap);
  });

  // Step 4: Bottom-up enforcement of minGap (push children down if too close)
  const leaves = [];
  hierarchy.each(n => { if (!n.children || !n.children.length) leaves.push(n); });
  // Process from leaves toward root
  const visited = new Set();
  const stack = [...leaves];
  while (stack.length) {
    const node = stack.shift();
    if (visited.has(node)) continue;
    visited.add(node);
    if (node.parent) {
      const deficit = minGap - (node.chronoY - node.parent.chronoY);
      if (deficit > 0) {
        // Push this node and all its descendants down
        const pushDown = n => {
          n.chronoY += deficit;
          if (n.children) n.children.forEach(pushDown);
        };
        pushDown(node);
      }
      if (!visited.has(node.parent)) stack.push(node.parent);
    }
  }

  // Normalize: shift so root.chronoY = 0
  const rootCY = hierarchy.chronoY;
  hierarchy.each(n => { n.chronoY -= rootCY; });
}

function renderTree(g) {
  const dens = densityProfile();
  const byId = new Map(state.nodes.map(n => [n.id, n]));
  const pLinks = state.links.filter(l => l._e.t === "parent");
  const rankC = c => c === "c" ? 0 : c === "i" ? 1 : 2;
  const sy = id => (byId.get(id)?.re?.[0]?.[0]) ?? 9999;
  const parentByChild = new Map();
  pLinks.forEach(l => {
    const s = typeof l.source === "object" ? l.source.id : l.source;
    const d = typeof l.target === "object" ? l.target.id : l.target;
    const cur = parentByChild.get(d);
    if (!cur) { parentByChild.set(d, { p: s, e: l._e }); return; }
    const better = rankC(l._e.c) < rankC(cur.e.c) || (rankC(l._e.c) === rankC(cur.e.c) && sy(s) < sy(cur.p));
    if (better) parentByChild.set(d, { p: s, e: l._e });
  });

  let pos = new Map();
  let depthMap = new Map();
  let sections = [];
  let yOffset = 60;
  let treeMinYear = 1100;
  let treePxPerYear = 3;
  let treeBaseY = yOffset;
  let treeMaxColX = 80;
  const placementKey = treePlacementCacheKey(state.nodes, state.links, dens, state.lang);
  const workerPlacement = treePlacementWorkerCache.get(placementKey) || null;
  const cachedPlacement = treePlacementCache?.key === placementKey
    ? treePlacementCache.value
    : workerPlacement;
  if (cachedPlacement) {
    pos = cachedPlacement.pos;
    depthMap = cachedPlacement.depthMap;
    sections = cachedPlacement.sections;
    yOffset = cachedPlacement.yOffset;
    treeMinYear = cachedPlacement.treeMinYear;
    treePxPerYear = cachedPlacement.treePxPerYear;
    treeBaseY = cachedPlacement.treeBaseY;
    treeMaxColX = cachedPlacement.treeMaxColX;
    if (treePlacementCache?.key !== placementKey) {
      treePlacementCache = { key: placementKey, value: cachedPlacement };
    }
  } else {
    const input = toTreePlacementInput(state.nodes, state.links, dens);
    queueTreePlacementWorker(placementKey, input);
    const computed = toTreePlacementValue(computeTreePlacement(input));
    pos = computed.pos;
    depthMap = computed.depthMap;
    sections = computed.sections;
    yOffset = computed.yOffset;
    treeMinYear = computed.treeMinYear;
    treePxPerYear = computed.treePxPerYear;
    treeBaseY = computed.treeBaseY;
    treeMaxColX = computed.treeMaxColX;
    treePlacementCache = { key: placementKey, value: computed };
  }

  // Apply positions
  state.nodes.forEach(n => {
    const p = pos.get(n.id);
    n.x = p ? p.x : 80;
    n.y = p ? p.y : yOffset;
  });

  // --- Edge construction (unchanged logic) ---
  const fullByChild = new Map();
  pLinks.forEach(l => {
    const s = typeof l.source === "object" ? l.source.id : l.source;
    const d = typeof l.target === "object" ? l.target.id : l.target;
    const arr = fullByChild.get(d) || [];
    arr.push({ s, e: l._e });
    fullByChild.set(d, arr);
  });
  const extraParents = [];
  fullByChild.forEach((arr, d) => {
    const primary = parentByChild.get(d)?.p;
    arr.forEach(a => { if (a.s !== primary) extraParents.push({ source: a.s, target: d, _e: a.e }); });
  });
  const eMap = new Map(state.links.map(l => [`${typeof l.source === "object" ? l.source.id : l.source}|${typeof l.target === "object" ? l.target.id : l.target}|${l._e.t}`, l]));
  const primParent = [...parentByChild.entries()].map(([d, v]) => eMap.get(`${v.p}|${d}|parent`) || { source: v.p, target: d, _e: v.e });
  const spouses = state.links.filter(l => l._e.t === "spouse");
  const other = state.links.filter(l => l._e.t === "kin" || l._e.t === "sibling");
  const drawLinks = [...primParent, ...spouses, ...other, ...extraParents];
  const extraSet = new Set(extraParents);

  const linkPath = d => {
    const sid = typeof d.source === "object" ? d.source.id : d.source;
    const tid = typeof d.target === "object" ? d.target.id : d.target;
    const s = byId.get(sid), t = byId.get(tid);
    if (!s || !t) return "";
    if (d._e.t === "spouse") {
      const lift = Math.sign((t.x || 0) - (s.x || 0)) * 10;
      return `M${s.x},${s.y} Q${(s.x + t.x) / 2},${(s.y + t.y) / 2 - 8 - lift} ${t.x},${t.y}`;
    }
    // Coral-branch curve: grows vertically from parent, then curves laterally toward child
    const seed = `${sid}|${tid}`;
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = ((h << 5) - h) + seed.charCodeAt(i);
    const wobble = ((h % 21) - 10) * 2.2;
    const lateralBend = ((h % 13) - 6) * 1.4;
    const c1x = s.x + lateralBend;
    const c1y = s.y + (t.y - s.y) * 0.35;
    const c2x = t.x + wobble * 0.3;
    const c2y = s.y + (t.y - s.y) * 0.75;
    return `M${s.x},${s.y} C${c1x},${c1y} ${c2x},${c2y} ${t.x},${t.y}`;
  };

  const baseOpacity = d => {
    const raw = (d._e.t === "kin" || d._e.t === "sibling") ? .24 : .84;
    return edgeOpacity(d._e, raw);
  };

  // Depth-based edge thickness (coral trunk effect)
  const treeEdgeWidth = d => {
    const sid = typeof d.source === "object" ? d.source.id : d.source;
    const sourceDepth = depthMap.get(sid) ?? 0;
    const depthW = Math.max(1.6, 3.2 - sourceDepth * 0.6);
    if (d._e.t !== "parent") return edgeWidth(d._e, 1.4, 1.4);
    return edgeWidth(d._e, depthW, depthW);
  };

  // Compute xExtent for section dividers
  const xExtent = d3.max(state.nodes, n => n.x) ?? state.W;
  const sectionLayer = ensureLayer(g, "tree-sections-root");
  drawTreeSectionDividers(sectionLayer, sections, xExtent);

  const linkLayer = ensureLayer(g, "tree-links");
  const nodeLayer = ensureLayer(g, "tree-nodes");
  const badgeLayer = g.selectAll("g.tree-badges").data([0]).join("g").attr("class", "badge-layer tree-badges");
  const treeLinkKey = d => `${linkKey(d)}|${d._e.c || ""}|${d._e.l || ""}|${d._e.confidence_grade || ""}`;
  state.gL = linkLayer.selectAll("path.tree-link")
    .data(drawLinks, treeLinkKey)
    .join("path")
    .attr("class", "tree-link")
    .attr("fill", "none")
    .attr("stroke", d => edgeStrokeColor(d._e))
    .attr("stroke-width", d => treeEdgeWidth(d))
    .attr("stroke-linecap", "round")
    .attr("stroke-dasharray", d => edgeDashArray(d._e, d._e.t === "parent" && extraSet.has(d)))
    .attr("stroke-opacity", d => baseOpacity(d))
    .attr("data-bo", d => baseOpacity(d))
    .attr("pointer-events", "stroke")
    .style("cursor", "pointer")
    .attr("d", d => linkPath(d));

  state.gLH = state.gL;

  drawNodes(nodeLayer, false);
  state.gN.selectAll("text.node-reign-label")
    .data(d => {
      const span = reignSpan(d);
      return span ? [span] : [];
    })
    .join("text")
      .attr("class", "node-reign-label")
      .attr("text-anchor", "middle")
      .attr("dy", "1.8em")
      .attr("font-size", dens.text - 2.5)
      .attr("font-family", "var(--mono)")
      .attr("fill", cs("--tx3"))
      .attr("opacity", 0.7)
      .text(d => d);
  state.gN.each(function (d) {
    const hasReign = !!reignSpan(d);
    const rect = d3.select(this).select("rect.node-body");
    const baseHeight = parseFloat(rect.attr("height"));
    if (!Number.isFinite(baseHeight)) return;
    const extra = hasReign ? dens.text - 1 : 0;
    rect.attr("height", baseHeight + extra);
    const accent = d3.select(this).select(".node-accent");
    if (!accent.empty()) accent.attr("height", baseHeight + extra);
    d._hh = (baseHeight + extra) / 2;
  });
  state.gN.attr("transform", d => `translate(${d.x},${d.y})`);

  const badgeData = state._badgeData || [];
  if (badgeData.length) {
    state.gBadges = badgeLayer
      .selectAll("text")
      .data(badgeData, d => `${d.id}|${d.n}`)
      .join("text")
      .attr("class", "node-badge")
      .attr("text-anchor", "end")
      .attr("font-size", 8.5)
      .attr("font-family", "var(--mono)")
      .attr("fill", d => nC(d.dy))
      .attr("opacity", 0.8)
      .text(d => "#" + d.n);
    state.gBadges
      .attr("x", d => (byId.get(d.id)?.x || 0) + d.ox)
      .attr("y", d => (byId.get(d.id)?.y || 0) + d.oy);
  } else {
    badgeLayer.selectAll("*").remove();
    state.gBadges = null;
  }

  // Zoom-to-fit on tree render
  requestAnimationFrame(() => {
    const gNode = document.querySelector('#sv .gg');
    if (!gNode) return;
    const bb = gNode.getBBox();
    if (!Number.isFinite(bb.width) || !Number.isFinite(bb.height) || bb.width <= 0 || bb.height <= 0) return;
    const m = 28;
    const sx = (state.W - m * 2) / bb.width;
    const scy = (state.H - m * 2) / bb.height;
    const k = Math.max(0.02, Math.min(4, Math.min(sx, scy)));
    const tx = (state.W - bb.width * k) / 2 - bb.x * k;
    const ty = (state.H - bb.height * k) / 2 - bb.y * k;
    const tf = d3.zoomIdentity.translate(tx, ty).scale(k);
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    state.svgEl.transition().duration(reduceMotion ? 0 : 500).call(state.zoomBehavior.transform, tf);
  });
}

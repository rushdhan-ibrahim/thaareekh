import * as d3 from 'd3';
import state from '../state.js';
import { filt } from './filter.js';
import { hiN, hiE, clH } from './highlight.js';
import { showD, showLinkDetail } from '../ui/sidebar.js';
import { cs, eC, nC } from '../utils/css.js';
import { fR, esc } from '../utils/format.js';
import { timelineExtent } from '../data/timeline.js';
import { dynastyTransitions, eraMilestones } from '../data/era-events.js';
import { personName, relationLabel, t } from '../ui/i18n.js';
import { showNodeHoverCard, moveHoverCard, hideHoverCard } from '../ui/hover-card.js';

const TIME_EXTENT = timelineExtent();
const PROGRESSIVE_THRESHOLD = 140;

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
  if (!rows.length && !(state.eraEnabled && Number.isFinite(state.eraYear))) return;

  const layer = g.append("g").attr("class", "era-ann").attr("pointer-events", "none");
  layer.selectAll("line.era-guide")
    .data(rows)
    .enter()
    .append("line")
    .attr("class", "era-guide")
    .attr("x1", 20)
    .attr("x2", xExtent)
    .attr("y1", d => d.y)
    .attr("y2", d => d.y)
    .attr("stroke", d => d.color)
    .attr("stroke-opacity", d => d.kind === "transition" ? 0.2 : 0.13)
    .attr("stroke-dasharray", d => d.kind === "transition" ? "2,4" : "1,7");

  layer.selectAll("circle.era-dot")
    .data(rows.filter(r => r.kind === "transition"))
    .enter()
    .append("circle")
    .attr("class", "era-dot")
    .attr("cx", 24)
    .attr("cy", d => d.y)
    .attr("r", 2.4)
    .attr("fill", d => d.color);

  layer.selectAll("text.era-label")
    .data(rows)
    .enter()
    .append("text")
    .attr("class", "era-label")
    .attr("x", 30)
    .attr("y", d => d.y - 4)
    .attr("fill", d => d.kind === "transition" ? d.color : cs("--tx3"))
    .text(d => `${d.year} \u00b7 ${trimLabel(d.short || d.label, 34)}`);

  if (state.eraEnabled && Number.isFinite(state.eraYear) && state.eraYear >= minYear && state.eraYear <= maxYear) {
    const yNow = yScale(state.eraYear);
    layer.append("line")
      .attr("class", "era-now")
      .attr("x1", 20)
      .attr("x2", xExtent)
      .attr("y1", yNow)
      .attr("y2", yNow)
      .attr("stroke", cs("--ac"))
      .attr("stroke-width", 1.35)
      .attr("stroke-opacity", 0.74);
    layer.append("text")
      .attr("class", "era-now-label")
      .attr("x", 30)
      .attr("y", yNow - 6)
      .text(`${t('filter_year')}: ${state.eraYear}`);
  }
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

function restoreSelectionHighlight() {
  if (state.selId) {
    const exists = state.nodes.some(n => n.id === state.selId);
    if (exists) hiN(state.selId);
    else state.selId = null;
  }
  if (!state.selId && state.selEdge) {
    const match = state.links.find(l => sameLink(l, state.selEdge));
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
  const nm = id => personName(state.nodes.find(n => n.id === id) || id);
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
    })
    .on("keydown", (ev, d) => {
      if (ev.key !== "Enter" && ev.key !== " ") return;
      ev.preventDefault();
      ev.stopPropagation();
      state.selId = null;
      state.selEdge = d;
      hiE(d);
      showLinkDetail(d);
    });
}

export function rebuild() {
  const data = filt();
  state.nodes = data.nodes.map(p => ({ ...p }));
  state.links = data.links.map(e => ({ source: e.s, target: e.d, _e: e }));
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
  d3.select("#sv").selectAll("*").remove();
  state.svgEl = d3.select("#sv");
  const g = state.svgEl.append("g").attr("class", "gg");
  state.svgEl.call(state.zoomBehavior);
  if (state.viewMode === "tree") {
    // Tree view does its own zoom-to-fit; start from identity
    state.svgEl.call(state.zoomBehavior.transform, d3.zoomIdentity);
  } else if (state.tr !== d3.zoomIdentity) {
    state.svgEl.call(state.zoomBehavior.transform, state.tr);
  }

  const defs = state.svgEl.append("defs");
  // Default arrow marker (fallback)
  defs.append("marker").attr("id", "ar-default").attr("viewBox", "0 0 10 10").attr("refX", 10).attr("refY", 5)
    .attr("markerWidth", 5).attr("markerHeight", 5).attr("orient", "auto-start-reverse")
    .append("path").attr("d", "M0 0L10 5L0 10z").attr("fill", cs("--ep"));
  // Dynasty-colored arrowhead markers
  const seenDy = new Set();
  state.nodes.forEach(n => {
    const dy = (n.dy || 'unknown').toLowerCase();
    if (seenDy.has(dy)) return;
    seenDy.add(dy);
    defs.append("marker").attr("id", `ar-${dy}`).attr("viewBox", "0 0 10 10").attr("refX", 10).attr("refY", 5)
      .attr("markerWidth", 5).attr("markerHeight", 5).attr("orient", "auto-start-reverse")
      .append("path").attr("d", "M0 0L10 5L0 10z").attr("fill", dynastyColor(dy));
  });
  // Node drop shadow filter
  const dropFilter = defs.append("filter").attr("id", "nodeShadow").attr("x", "-20%").attr("y", "-20%").attr("width", "140%").attr("height", "140%");
  dropFilter.append("feDropShadow").attr("dx", 0).attr("dy", 2).attr("stdDeviation", 3).attr("flood-color", "rgba(0,0,0,0.25)").attr("flood-opacity", 0.4);

  if (state.sim) { state.sim.stop(); state.sim = null; }
  state.gLH = null;
  state.gBadges = null;
  if (state.viewMode === "tree") renderTree(g);
  else renderGraph(g);
  if (state.viewMode === "graph") drawGraphEraOverlay();

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
  });
  state.gN.on("keydown", (ev, d) => {
    if (ev.key !== "Enter" && ev.key !== " ") return;
    ev.preventDefault();
    ev.stopPropagation();
    state.selId = d.id;
    state.selEdge = null;
    showD(d.id);
    hiN(d.id);
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
  state.gN = g.append("g").selectAll("g").data(state.nodes, d => d.id).enter().append("g").attr("cursor", "pointer")
    .attr("data-pr", "1")
    .attr("tabindex", 0)
    .attr("role", "button")
    .attr("aria-label", d => `${t('open_profile_for')} ${personName(d)}`);
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
  }
  state.gN.append("rect").attr("rx", d => d.g === "F" ? 12 : 4).attr("ry", d => d.g === "F" ? 12 : 4)
    .attr("fill", cs("--nf")).attr("stroke", d => nC(d.dy)).attr("stroke-width", d => d.g === "F" ? 2.2 : 1.5)
    .attr("filter", "url(#nodeShadow)");
  // Dynasty color accent strip on left edge
  state.gN.append("rect").attr("class", "node-accent")
    .attr("rx", d => d.g === "F" ? 12 : 4).attr("ry", d => d.g === "F" ? 12 : 4)
    .attr("fill", d => nC(d.dy)).attr("opacity", 0.85)
    .attr("width", 3);
  state.gN.append("text").attr("text-anchor", "middle").attr("dy", ".35em").attr("font-size", dens.text)
    .attr("font-family", "var(--sans)").attr("fill", cs("--nt")).attr("font-weight", 500)
    .text(d => (d.g === "F" ? "\u2640 " : "") + trimLabel(personName(d), dens.maxLabelChars));
  // Size rects and compute node half-dimensions; collect badge data for separate layer
  state._badgeData = [];
  state.gN.each(function (d) {
    const t = d3.select(this).select("text"), bb = t.node().getBBox(), p = d.g === "F" ? dens.padFemale : dens.padMale;
    const w = bb.width + p * 2;
    const h = bb.height + 10;
    d3.select(this).select("rect").attr("x", bb.x - p).attr("y", bb.y - 5).attr("width", w).attr("height", h);
    // Position accent strip
    d3.select(this).select(".node-accent").attr("x", bb.x - p).attr("y", bb.y - 5).attr("height", h);
    d._hw = w / 2; d._hh = h / 2;
    // Collect sovereign badge offset data
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
  state.gL = g.append("g").selectAll("line").data(state.links).enter().append("line")
    .attr("stroke", d => edgeStrokeColor(d._e))
    .attr("stroke-width", d => edgeWidth(d._e, 2.2, 1.5))
    .attr("stroke-dasharray", d => edgeDashArray(d._e))
    .attr("stroke-opacity", d => edgeBaseOpacity(d))
    .attr("data-bo", d => edgeBaseOpacity(d))
    .attr("marker-end", d => {
      if (d._e.t !== "parent" || d._e.c !== "c") return "";
      const sid = typeof d.source === "object" ? d.source.id : d.source;
      const sn = state.nodes.find(n => n.id === sid);
      const dy = (sn?.dy || 'default').toLowerCase();
      return `url(#ar-${dy})`;
    });

  state.gLH = g.append("g").attr("class", "elh").selectAll("line").data(state.links).enter().append("line")
    .attr("stroke", "transparent")
    .attr("stroke-width", 13)
    .attr("pointer-events", "stroke")
    .style("display", d => showEdge(d) ? null : "none")
    .style("cursor", "pointer");

  const lE = state.links.filter(d => d._e.l && (d._e.t !== "parent" || d._e.c !== "c"));
  g.append("g").attr("class", "elg").selectAll("text").data(lE).enter().append("text")
    .attr("text-anchor", "middle").attr("dy", -3).attr("font-size", 7.5)
    .attr("font-family", "var(--mono)").attr("fill", d => edgeStrokeColor(d._e)).attr("opacity", d => showEdge(d) ? .62 : 0)
    .text(d => d._e.l).each(function (d) { d._lbl = this; });

  drawNodes(g, true);

  // Render sovereign badges in a separate top-level layer (always on top of all nodes)
  const badgeData = state._badgeData || [];
  if (badgeData.length) {
    state.gBadges = g.append("g").attr("class", "badge-layer")
      .selectAll("text").data(badgeData).enter().append("text")
      .attr("class", "node-badge")
      .attr("text-anchor", "end")
      .attr("font-size", 8.5)
      .attr("font-family", "var(--mono)")
      .attr("fill", d => nC(d.dy))
      .attr("opacity", 0.8)
      .text(d => "#" + d.n);
  } else {
    state.gBadges = null;
  }

  if (progressive) {
    state.gN.attr("data-pr", d => progressive.reveal.has(d.id) ? "1" : "0");
    state.gN.select("rect").attr("opacity", function () {
      return this.parentNode?.getAttribute("data-pr") === "1" ? 1 : 0.23;
    });
    state.gN.select("text").attr("opacity", function () {
      return this.parentNode?.getAttribute("data-pr") === "1" ? 1 : 0.24;
    });
    const st = document.getElementById("st");
    if (st) st.textContent += ` \u00b7 reveal ${progressive.reveal.size}/${progressive.total}`;
  } else {
    state.gN.attr("data-pr", "1");
  }

  const nodeMap = new Map(state.nodes.map(n => [n.id, n]));
  state.sim = d3.forceSimulation(state.nodes)
    .force("link", d3.forceLink(state.links).id(d => d.id).distance(dens.forceDistance).strength(.3))
    .force("charge", d3.forceManyBody().strength(dens.forceCharge))
    .force("center", d3.forceCenter(state.W / 2, state.H / 2))
    .force("collide", d3.forceCollide(d => (d._hw || dens.forceCollide) + 6).strength(0.85).iterations(3))
    .force("x", d3.forceX(state.W / 2).strength(dens.forceStrength))
    .force("y", d3.forceY(state.H / 2).strength(dens.forceStrength))
    .alphaDecay(0.025)
    .on("tick", () => {
      state.gL.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
      state.gLH.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
      state.gN.attr("transform", d => `translate(${d.x},${d.y})`);
      d3.selectAll(".elg text").each(function (d) { d3.select(this).attr("x", (d.source.x + d.target.x) / 2).attr("y", (d.source.y + d.target.y) / 2); });
      // Position badges alongside their parent nodes
      if (state.gBadges) {
        state.gBadges
          .attr("x", d => (nodeMap.get(d.id)?.x || 0) + d.ox)
          .attr("y", d => (nodeMap.get(d.id)?.y || 0) + d.oy);
      }
    })
    .on("end", () => document.getElementById("ld").classList.add("dn"));
}

function drawTreeSectionDividers(g, sections, xExtent) {
  const layer = g.append("g").attr("class", "tree-sections").attr("pointer-events", "none");
  sections.forEach(sec => {
    const color = sec.dynasty ? dynastyColor(sec.dynasty) : cs("--bd2");
    layer.append("line")
      .attr("x1", 30).attr("x2", Math.max(xExtent, 400))
      .attr("y1", sec.y - 12).attr("y2", sec.y - 12)
      .attr("stroke", color).attr("stroke-opacity", 0.35)
      .attr("stroke-dasharray", "4,6");
    layer.append("circle")
      .attr("cx", 22).attr("cy", sec.y - 12).attr("r", 3)
      .attr("fill", color).attr("opacity", 0.6);
    layer.append("text")
      .attr("x", 34).attr("y", sec.y - 18)
      .attr("font-family", "var(--display, var(--sans))")
      .attr("font-size", 10).attr("fill", color).attr("opacity", 0.7)
      .text(`${sec.label}${sec.count > 1 ? ` (${sec.count})` : ""}`);
  });
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

  const children = new Map(state.nodes.map(n => [n.id, []]));
  parentByChild.forEach((v, c) => children.get(v.p)?.push(c));
  children.forEach(arr => arr.sort((a, b) => sy(a) - sy(b)));

  const roots = state.nodes.filter(n => !parentByChild.has(n.id)).sort((a, b) => sy(a.id) - sy(b.id));

  // --- NEW: Build d3.hierarchy per root, separate isolated/leaf nodes ---
  const isolatedNodes = [];
  const treeRoots = [];
  roots.forEach(r => {
    const childList = children.get(r.id) || [];
    if (childList.length === 0) {
      // Single-node tree (no descendants) → isolated section
      isolatedNodes.push(r);
    } else {
      const h = d3.hierarchy(r, d => (children.get(d.id) || []).map(id => byId.get(id)).filter(Boolean));
      // Determine dominant dynasty
      const dyCounts = {};
      h.each(node => {
        const dy = node.data.dy || "unknown";
        dyCounts[dy] = (dyCounts[dy] || 0) + 1;
      });
      let dominantDy = "unknown", maxCount = 0;
      for (const [dy, cnt] of Object.entries(dyCounts)) {
        if (cnt > maxCount) { maxCount = cnt; dominantDy = dy; }
      }
      // Earliest year across all nodes in this tree
      // Check: reign start, birth year, death year (minus ~50 as estimate)
      let earliestYear = 9999;
      h.each(node => {
        const d = node.data;
        const reignStart = d.re?.[0]?.[0];
        if (reignStart && reignStart < earliestYear) earliestYear = reignStart;
        if (d.yb && d.yb < earliestYear) earliestYear = d.yb;
        if (d.yd && (d.yd - 50) < earliestYear) earliestYear = d.yd - 50;
      });
      treeRoots.push({ hierarchy: h, size: h.descendants().length, dominantDy, rootName: personName(r), earliestYear });
    }
  });
  // For trees with no dates at all, infer from connected nodes outside the tree
  // (e.g. a spouse in another tree may have dates)
  const undatedTrees = treeRoots.filter(tr => tr.earliestYear >= 9000);
  if (undatedTrees.length) {
    // Build a set of all node IDs in each undated tree for exclusion
    const nodeYearCache = new Map();
    state.nodes.forEach(n => {
      const y = n.re?.[0]?.[0] || n.yb || (n.yd ? n.yd - 50 : null);
      if (y) nodeYearCache.set(n.id, y);
    });
    undatedTrees.forEach(tr => {
      const treeIds = new Set();
      tr.hierarchy.each(node => treeIds.add(node.data.id));
      // Check edges connecting tree members to external dated nodes
      let bestYear = 9999;
      state.links.forEach(l => {
        const sid = typeof l.source === "object" ? l.source.id : l.source;
        const tid = typeof l.target === "object" ? l.target.id : l.target;
        if (treeIds.has(sid) && !treeIds.has(tid) && nodeYearCache.has(tid)) {
          bestYear = Math.min(bestYear, nodeYearCache.get(tid));
        }
        if (treeIds.has(tid) && !treeIds.has(sid) && nodeYearCache.has(sid)) {
          bestYear = Math.min(bestYear, nodeYearCache.get(sid));
        }
      });
      if (bestYear < 9000) tr.earliestYear = bestYear;
    });
    // Final fallback: use median of all dated trees
    const datedYears = treeRoots.filter(tr => tr.earliestYear < 9000).map(tr => tr.earliestYear).sort((a, b) => a - b);
    const median = datedYears.length ? datedYears[Math.floor(datedYears.length / 2)] : 1400;
    treeRoots.forEach(tr => {
      if (tr.earliestYear >= 9000) tr.earliestYear = median;
    });
  }

  // Sort: earliest reign year first (chronological), then largest first as tiebreaker
  treeRoots.sort((a, b) => a.earliestYear - b.earliestYear || b.size - a.size);

  // Split isolated nodes: only actual sovereigns (with ordinal number) go to "Early Sovereigns" at top
  // Everyone else (wives, modern figures without tree links) goes to "Unconnected" at bottom
  const earlySovereignIsolated = isolatedNodes.filter(n => (n.n || []).length > 0 && sy(n.id) < 9999).sort((a, b) => sy(a.id) - sy(b.id));
  const undatedIsolated = isolatedNodes.filter(n => !((n.n || []).length > 0 && sy(n.id) < 9999));

  // All trees participate in the chronological column layout regardless of size
  const placedTrees = treeRoots;

  // --- Layout ---
  const treeLayout = d3.tree()
    .nodeSize([dens.treeSiblingX, dens.treeDepthY])
    .separation((a, b) => {
      const wA = estimateNodeWidth(a.data, dens);
      const wB = estimateNodeWidth(b.data, dens);
      return Math.max(1, (wA / 2 + wB / 2 + 24) / dens.treeSiblingX);
    });

  const pos = new Map(); // id → { x, y, depth }
  const depthMap = new Map(); // id → depth (for edge thickness)
  const sections = [];
  let yOffset = 60;

  // 1. Early sovereigns — placed chronologically after trees establish the year→Y scale
  //    (deferred to section 3 below)

  // 2. Unified chronological tree placement (major + minor together)
  // ---------------------------------------------------------------
  // Year→Y mapping (hoisted so unconnected section can reuse)
  let treeMinYear = 1100, treePxPerYear = 3, treeBaseY = yOffset;
  let treeMaxColX = 80; // rightmost column start X

  if (placedTrees.length) {
    // Phase 1: Run d3.tree() layout, compute X dimensions and year ranges
    const treeDims = placedTrees.map(tr => {
      treeLayout(tr.hierarchy);
      const desc = tr.hierarchy.descendants();
      const minNodeX = d3.min(desc, d => d.x) ?? 0;
      const maxNodeX = d3.max(desc, d => d.x) ?? 0;
      let latestYear = tr.earliestYear;
      tr.hierarchy.each(node => {
        const d = node.data;
        if (d.re?.[0]?.[1] && d.re[0][1] > latestYear) latestYear = d.re[0][1];
        if (d.re?.[0]?.[0] && d.re[0][0] > latestYear) latestYear = d.re[0][0];
        if (d.yd && d.yd > latestYear) latestYear = d.yd;
        if (d.yb && (d.yb + 50) > latestYear) latestYear = d.yb + 50;
      });
      return {
        tr, desc, minNodeX, maxNodeX,
        width: (maxNodeX - minNodeX) + dens.treeSiblingX,
        earliestYear: tr.earliestYear,
        latestYear,
        isMajor: tr.size >= 5
      };
    });
    treeDims.sort((a, b) => a.earliestYear - b.earliestYear || b.tr.size - a.tr.size);

    // Phase 2: Year → Y scale (include early sovereigns in range)
    const earlySovYears = earlySovereignIsolated.map(n => sy(n.id)).filter(y => y < 9999);
    const minYear = Math.min(d3.min(treeDims, d => d.earliestYear) ?? 1100, d3.min(earlySovYears) ?? Infinity);
    const maxYear = Math.max(d3.max(treeDims, d => d.latestYear) ?? 1968, d3.max(earlySovYears) ?? -Infinity);
    const yearRange = (maxYear - minYear) || 1;
    // Pixels per year: calibrated so the tallest single tree roughly spans
    // its historical reign duration. Clamped for readability.
    const tallestStructH = d3.max(treeDims, d => d3.max(d.desc, n => n.y) ?? 0) ?? 300;
    const tallestSpan = d3.max(treeDims, d => d.latestYear - d.earliestYear) || 100;
    const pxPerYear = Math.max(3, Math.min(6, tallestStructH / tallestSpan * 1.2));
    treeMinYear = minYear;
    treePxPerYear = pxPerYear;
    treeBaseY = yOffset;

    // Phase 2b: Chronological Y post-processing — replace depth-based Y with date-aware Y
    const minGap = dens.treeDepthY * 0.55; // comfortable parent-child minimum gap
    treeDims.forEach(td => {
      chronoPostProcess(td.tr.hierarchy, pxPerYear, td.earliestYear, dens.treeDepthY, minGap);
      // Recompute height after chrono adjustment
      td.height = d3.max(td.desc, d => d.chronoY) ?? 0;
    });

    // Phase 3: Greedy column assignment (interval coloring)
    // Each column tracks its next-available-Y and max width.
    // Trees are placed at max(idealY, column.nextY).
    const MAX_COLS = 3;
    const columns = []; // { nextY, maxWidth }

    treeDims.forEach(td => {
      const idealY = yOffset + (td.earliestYear - minYear) * pxPerYear;

      // Try each existing column — prefer one where we can place at idealY
      let bestCol = -1;
      let bestGap = Infinity;
      for (let c = 0; c < columns.length; c++) {
        if (columns[c].nextY <= idealY) {
          // This column has room at idealY — pick closest match
          const gap = idealY - columns[c].nextY;
          if (gap < bestGap) { bestGap = gap; bestCol = c; }
        }
      }

      if (bestCol === -1) {
        if (columns.length < MAX_COLS) {
          // Create a new column — it can place at idealY
          bestCol = columns.length;
          columns.push({ nextY: yOffset, maxWidth: 0 });
        } else {
          // Cap reached — find column with smallest push-down
          let minNext = Infinity;
          for (let c = 0; c < columns.length; c++) {
            if (columns[c].nextY < minNext) { minNext = columns[c].nextY; bestCol = c; }
          }
        }
      }

      const treeY = Math.max(idealY, columns[bestCol].nextY);
      td.assignedCol = bestCol;
      td.assignedY = treeY;
      columns[bestCol].nextY = treeY + td.height + dens.treeSectionGap;
      columns[bestCol].maxWidth = Math.max(columns[bestCol].maxWidth, td.width);
    });

    // Phase 4: Compute actual column widths (account for node render widths)
    // Each tree's true extent includes the rendered width of edge nodes, not
    // just center-to-center span. Compute per-column max extent accurately.
    treeDims.forEach(td => {
      let trueWidth = 0;
      td.desc.forEach(d => {
        const nodeW = estimateNodeWidth(d.data, dens);
        const rightExtent = (d.x - td.minNodeX) + nodeW / 2;
        trueWidth = Math.max(trueWidth, rightExtent);
      });
      td.trueWidth = trueWidth;
    });
    // Recompute column maxWidth using true extent
    const colTrueWidth = new Array(columns.length).fill(0);
    treeDims.forEach(td => {
      colTrueWidth[td.assignedCol] = Math.max(colTrueWidth[td.assignedCol], td.trueWidth);
    });

    const colGap = 60;
    const colX = [];
    // If early sovereigns exist, offset tree columns to the right to avoid overlap
    const earlySovColWidth = earlySovereignIsolated.length
      ? d3.max(earlySovereignIsolated, n => estimateNodeWidth(n, dens)) + 40
      : 0;
    let cx = 80 + earlySovColWidth;
    for (let c = 0; c < columns.length; c++) {
      colX.push(cx);
      cx += colTrueWidth[c] + colGap;
    }

    treeMaxColX = cx; // track rightmost extent for unconnected column

    // Phase 5: Position every tree
    treeDims.forEach(td => {
      const baseX = colX[td.assignedCol];
      const baseY = td.assignedY;
      td.desc.forEach(d => {
        const px = d.x - td.minNodeX + baseX;
        const py = (d.chronoY ?? d.y) + baseY;
        pos.set(d.data.id, { x: px, y: py, depth: d.depth });
        depthMap.set(d.data.id, d.depth);
      });
      sections.push({
        y: baseY,
        dynasty: td.tr.dominantDy,
        label: td.tr.rootName || td.tr.dominantDy,
        count: td.tr.size
      });
    });

    yOffset = Math.max(...columns.map(c => c.nextY));
  }

  // 3. Early sovereigns — chronological Y placement using same scale as trees
  if (earlySovereignIsolated.length) {
    const earlyColX = 80; // left-most column, before tree columns
    const minGapSov = 34;
    let prevSovY = -Infinity;
    sections.push({ y: treeBaseY, dynasty: "lunar", label: t('early_sovereigns') || "Early Sovereigns", count: earlySovereignIsolated.length });
    earlySovereignIsolated.forEach(n => {
      const yr = sy(n.id);
      const idealY = yr < 9999 ? treeBaseY + (yr - treeMinYear) * treePxPerYear : treeBaseY;
      const nodeY = Math.max(idealY, prevSovY + minGapSov);
      const w = estimateNodeWidth(n, dens);
      pos.set(n.id, { x: earlyColX + w / 2, y: nodeY, depth: 0 });
      depthMap.set(n.id, 0);
      prevSovY = nodeY;
    });
  }

  // 4. Attach isolated nodes next to their closest positioned relation
  //    Checks ALL edge types: spouse, parent, kin, sibling.
  //    Uses collision detection to avoid overlapping existing nodes.
  const attachedIds = new Set();
  const prio = { spouse: 4, parent: 3, sibling: 2, kin: 1 };

  // Check if position (cx, cy) with given width collides with any existing node
  function hasCollision(cx, cy, halfW, excludeId) {
    const margin = 8;
    for (const [id, p] of pos) {
      if (id === excludeId) continue;
      const nd = byId.get(id);
      if (!nd) continue;
      const nw = estimateNodeWidth(nd, dens) / 2;
      // Horizontal overlap check
      if (Math.abs(cx - p.x) < (halfW + nw + margin) && Math.abs(cy - p.y) < 28) {
        return true;
      }
    }
    return false;
  }

  function attachPass(candidates) {
    let attached = 0;
    candidates.forEach(n => {
      if (pos.has(n.id)) return;
      let bestPartner = null;
      let bestType = null;
      for (const l of state.links) {
        const sid = typeof l.source === "object" ? l.source.id : l.source;
        const tid = typeof l.target === "object" ? l.target.id : l.target;
        const partnerId = sid === n.id ? tid : tid === n.id ? sid : null;
        if (!partnerId || !pos.has(partnerId)) continue;
        const thisPrio = prio[l._e.t] || 0;
        if (!bestPartner || thisPrio > (prio[bestType] || 0)) {
          bestPartner = partnerId;
          bestType = l._e.t;
        }
      }
      if (bestPartner && byId.get(bestPartner)) {
        const sp = pos.get(bestPartner);
        const pw = estimateNodeWidth(byId.get(bestPartner), dens);
        const nw = estimateNodeWidth(n, dens);
        const halfW = nw / 2;

        // Try positions: right of partner, then below, then left
        const candidates = [
          { x: sp.x + pw / 2 + halfW + 16, y: sp.y },       // right
          { x: sp.x, y: sp.y + 34 },                          // below
          { x: sp.x - pw / 2 - halfW - 16, y: sp.y },        // left
          { x: sp.x + pw / 2 + halfW + 16, y: sp.y + 34 },   // right-below
          { x: sp.x - pw / 2 - halfW - 16, y: sp.y + 34 },   // left-below
        ];

        let placed = false;
        for (const c of candidates) {
          if (!hasCollision(c.x, c.y, halfW, n.id)) {
            pos.set(n.id, { x: c.x, y: c.y, depth: sp.depth });
            depthMap.set(n.id, 0);
            attachedIds.add(n.id);
            attached++;
            placed = true;
            break;
          }
        }
        // Fallback: place below partner with enough vertical offset
        if (!placed) {
          let fy = sp.y + 34;
          while (hasCollision(sp.x, fy, halfW, n.id) && fy < sp.y + 200) fy += 34;
          pos.set(n.id, { x: sp.x, y: fy, depth: sp.depth });
          depthMap.set(n.id, 0);
          attachedIds.add(n.id);
          attached++;
        }
      }
    });
    return attached;
  }

  // Run up to 3 passes to handle chains of unpositioned nodes
  for (let pass = 0; pass < 3; pass++) {
    const remaining = undatedIsolated.filter(n => !pos.has(n.id));
    if (!remaining.length || !attachPass(remaining)) break;
  }

  // 5. Remaining unconnected — placed at chronological Y positions
  const remainingIsolated = undatedIsolated.filter(n => !attachedIds.has(n.id));
  if (remainingIsolated.length) {
    // Compute each node's best year
    const nodeYear = n => n.re?.[0]?.[0] || n.yb || (n.yd ? n.yd - 50 : null);
    remainingIsolated.sort((a, b) => (nodeYear(a) ?? 9999) - (nodeYear(b) ?? 9999));

    // Place in a column to the right of all tree columns
    const unconnectedX = treeMaxColX + 40;
    let prevY = -Infinity;
    const minGap = 34; // minimum vertical gap between unconnected nodes
    let rowX = unconnectedX;
    const rowMaxWidth = Math.max(800, state.W - 100);
    sections.push({ y: treeBaseY, dynasty: null, label: t('unconnected') || "Unconnected", count: remainingIsolated.length });

    remainingIsolated.forEach(n => {
      const yr = nodeYear(n);
      // Ideal Y from chronology (same scale as trees)
      let idealY = yr ? treeBaseY + (yr - treeMinYear) * treePxPerYear : yOffset;
      // Ensure no overlap with previous node
      const nodeY = Math.max(idealY, prevY + minGap);
      const w = estimateNodeWidth(n, dens);
      // Wrap to next sub-column if X too wide
      if (rowX + w > rowMaxWidth && rowX > unconnectedX) {
        rowX = unconnectedX;
      }
      pos.set(n.id, { x: rowX + w / 2, y: nodeY, depth: 0 });
      depthMap.set(n.id, 0);
      prevY = nodeY;
      rowX += w + 16;
      // Reset row for next node (each gets its own Y)
      rowX = unconnectedX;
    });
    yOffset = Math.max(yOffset, prevY + 50);
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

  // Draw section dividers (replaces era annotations)
  drawTreeSectionDividers(g, sections, xExtent);

  // Draw edges
  state.gL = g.append("g").selectAll("path").data(drawLinks).enter().append("path")
    .attr("fill", "none")
    .attr("stroke", d => edgeStrokeColor(d._e))
    .attr("stroke-width", d => treeEdgeWidth(d))
    .attr("stroke-linecap", "round")
    .attr("stroke-dasharray", d => edgeDashArray(d._e, d._e.t === "parent" && extraSet.has(d)))
    .attr("stroke-opacity", d => baseOpacity(d))
    .attr("data-bo", d => baseOpacity(d))
    .attr("d", d => linkPath(d));

  state.gLH = g.append("g").attr("class", "elh").selectAll("path").data(drawLinks).enter().append("path")
    .attr("d", d => linkPath(d))
    .attr("fill", "none")
    .attr("stroke", "transparent")
    .attr("stroke-width", 14)
    .attr("pointer-events", "stroke")
    .style("cursor", "pointer");

  // Draw nodes (with reign labels)
  drawNodes(g, false);
  // Add reign year sub-labels
  state.gN.each(function (d) {
    const span = reignSpan(d);
    if (!span) return;
    d3.select(this).append("text")
      .attr("class", "node-reign-label")
      .attr("text-anchor", "middle")
      .attr("dy", "1.8em")
      .attr("font-size", dens.text - 2.5)
      .attr("font-family", "var(--mono)")
      .attr("fill", cs("--tx3"))
      .attr("opacity", 0.7)
      .text(span);
  });
  // Adjust node rect sizing to account for reign label extra height
  state.gN.each(function (d) {
    const hasReign = !!reignSpan(d);
    if (!hasReign) return;
    const rect = d3.select(this).select("rect");
    const curH = parseFloat(rect.attr("height"));
    const extra = dens.text - 1;
    rect.attr("height", curH + extra);
    // Also adjust accent strip height
    const accent = d3.select(this).select(".node-accent");
    if (!accent.empty()) accent.attr("height", curH + extra);
    d._hh = (curH + extra) / 2;
  });
  state.gN.attr("transform", d => `translate(${d.x},${d.y})`);

  // Render sovereign badges in a separate top-level layer (always on top of all nodes)
  const badgeData = state._badgeData || [];
  if (badgeData.length) {
    state.gBadges = g.append("g").attr("class", "badge-layer")
      .selectAll("text").data(badgeData).enter().append("text")
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

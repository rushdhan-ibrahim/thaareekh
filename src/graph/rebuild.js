import * as d3 from 'd3';
import state from '../state.js';
import { filt } from './filter.js';
import { hiN, clH } from './highlight.js';
import { showD } from '../ui/sidebar.js';
import { cs, eC, nC } from '../utils/css.js';
import { fR, esc } from '../utils/format.js';

export function rebuild() {
  const data = filt();
  state.nodes = data.nodes.map(p => ({ ...p }));
  state.links = data.links.map(e => ({ source: e.s, target: e.d, _e: e }));
  const mode = state.viewMode === "tree" ? "tree" : "graph";
  document.getElementById("st").textContent = state.nodes.length + " \u00b7 " + state.links.length + " \u00b7 " + mode;

  const area = document.getElementById("ga");
  state.W = area.clientWidth;
  state.H = area.clientHeight;
  d3.select("#sv").selectAll("*").remove();
  state.svgEl = d3.select("#sv");
  const g = state.svgEl.append("g").attr("class", "gg");
  state.svgEl.call(state.zoomBehavior);
  if (state.tr !== d3.zoomIdentity) state.svgEl.call(state.zoomBehavior.transform, state.tr);

  const defs = state.svgEl.append("defs");
  defs.append("marker").attr("id", "ar").attr("viewBox", "0 0 10 10").attr("refX", 10).attr("refY", 5)
    .attr("markerWidth", 5).attr("markerHeight", 5).attr("orient", "auto-start-reverse")
    .append("path").attr("d", "M0 0L10 5L0 10z").attr("fill", cs("--ep"));

  if (state.sim) { state.sim.stop(); state.sim = null; }
  if (state.viewMode === "tree") renderTree(g);
  else renderGraph(g);

  const tooltip = document.getElementById("tt");
  state.gN.on("mouseenter", (ev, d) => {
    tooltip.innerHTML = `<b>${esc(d.nm)}</b><div class="ts">${esc(fR(d.re || []))} \u00b7 ${esc(d.dy || "?")} \u00b7 ${(d.n || []).map(x => "#" + x).join(", ")}</div>`;
    tooltip.classList.add("sh");
  })
    .on("mousemove", ev => { tooltip.style.left = (ev.clientX + 12) + "px"; tooltip.style.top = (ev.clientY + 12) + "px"; })
    .on("mouseleave", () => tooltip.classList.remove("sh"));

  state.gN.on("click", (ev, d) => { ev.stopPropagation(); state.selId = d.id; showD(d.id); hiN(d.id); });
  state.svgEl.on("click", () => { state.selId = null; clH(); });
  setTimeout(() => document.getElementById("ld").classList.add("dn"), 2500);
}

function drawNodes(g, withDrag = false) {
  state.gN = g.append("g").selectAll("g").data(state.nodes, d => d.id).enter().append("g").attr("cursor", "pointer");
  if (withDrag) {
    state.gN.call(d3.drag()
      .on("start", (e, d) => { if (!e.active) state.sim.alphaTarget(.2).restart(); d.fx = d.x; d.fy = d.y; })
      .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
      .on("end", (e, d) => { if (!e.active) state.sim.alphaTarget(0); d.fx = null; d.fy = null; }));
  }
  state.gN.append("rect").attr("rx", d => d.g === "F" ? 12 : 4).attr("ry", d => d.g === "F" ? 12 : 4)
    .attr("fill", cs("--nf")).attr("stroke", d => nC(d.dy)).attr("stroke-width", d => d.g === "F" ? 2.2 : 1.5);
  state.gN.append("text").attr("text-anchor", "middle").attr("dy", ".35em").attr("font-size", 10.5)
    .attr("font-family", "var(--sans)").attr("fill", cs("--nt")).attr("font-weight", 500)
    .text(d => (d.g === "F" ? "\u2640 " : "") + d.nm);
  state.gN.each(function (d) {
    const t = d3.select(this).select("text"), bb = t.node().getBBox(), p = d.g === "F" ? 12 : 8;
    d3.select(this).select("rect").attr("x", bb.x - p).attr("y", bb.y - 5).attr("width", bb.width + p * 2).attr("height", bb.height + 10);
    d._hw = (bb.width + p * 2) / 2; d._hh = (bb.height + 10) / 2;
  });
}

function renderGraph(g) {
  state.gL = g.append("g").selectAll("line").data(state.links).enter().append("line")
    .attr("stroke", d => eC(d._e)).attr("stroke-width", d => d._e.c === "u" ? 2 : 1.4)
    .attr("stroke-dasharray", d => d._e.c === "i" ? "5,4" : d._e.c === "u" ? "3,5" : null)
    .attr("stroke-opacity", .8)
    .attr("marker-end", d => d._e.t === "parent" && d._e.c === "c" ? "url(#ar)" : "");

  const lE = state.links.filter(d => d._e.l && (d._e.t !== "parent" || d._e.c !== "c"));
  g.append("g").attr("class", "elg").selectAll("text").data(lE).enter().append("text")
    .attr("text-anchor", "middle").attr("dy", -3).attr("font-size", 7.5)
    .attr("font-family", "var(--mono)").attr("fill", d => eC(d._e)).attr("opacity", .6)
    .text(d => d._e.l).each(function (d) { d._lbl = this; });

  drawNodes(g, true);

  state.sim = d3.forceSimulation(state.nodes)
    .force("link", d3.forceLink(state.links).id(d => d.id).distance(90).strength(.3))
    .force("charge", d3.forceManyBody().strength(-700))
    .force("center", d3.forceCenter(state.W / 2, state.H / 2))
    .force("collide", d3.forceCollide(40))
    .force("x", d3.forceX(state.W / 2).strength(.035))
    .force("y", d3.forceY(state.H / 2).strength(.035))
    .on("tick", () => {
      state.gL.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
      state.gN.attr("transform", d => `translate(${d.x},${d.y})`);
      d3.selectAll(".elg text").each(function (d) { d3.select(this).attr("x", (d.source.x + d.target.x) / 2).attr("y", (d.source.y + d.target.y) / 2); });
    })
    .on("end", () => document.getElementById("ld").classList.add("dn"));
}

function renderTree(g) {
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
  const pos = new Map();
  const tree = d3.tree().nodeSize([58, 170]);
  let xShift = 90;
  roots.forEach(r => {
    const h = d3.hierarchy(r, d => (children.get(d.id) || []).map(id => byId.get(id)).filter(Boolean));
    tree(h);
    const desc = h.descendants();
    const minX = d3.min(desc, d => d.x) ?? 0;
    const maxX = d3.max(desc, d => d.x) ?? 0;
    const width = Math.max(220, (maxX - minX) + 180);
    desc.forEach(d => pos.set(d.data.id, { x: d.x - minX + xShift, depth: d.depth }));
    xShift += width;
  });

  const years = state.nodes.map(n => sy(n.id)).filter(y => Number.isFinite(y) && y < 9999);
  const minY = d3.min(years) ?? 1100;
  const maxY = d3.max(years) ?? 2000;
  const yScale = d3.scaleLinear().domain([minY, maxY]).range([80, Math.max(120, state.H - 80)]);
  state.nodes.forEach(n => {
    const p = pos.get(n.id) || { x: xShift + 80, depth: 0 };
    n.x = p.x;
    n.y = yScale(sy(n.id)) + p.depth * 12;
  });

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
  state.gL = g.append("g").selectAll("path").data(drawLinks).enter().append("path")
    .attr("fill", "none")
    .attr("stroke", d => eC(d._e))
    .attr("stroke-width", d => d._e.t === "parent" ? 1.6 : 1.2)
    .attr("stroke-dasharray", d => d._e.t === "parent" && extraParents.includes(d) ? "3,5" : d._e.c === "i" ? "5,4" : d._e.c === "u" ? "3,5" : null)
    .attr("stroke-opacity", d => d._e.t === "kin" || d._e.t === "sibling" ? .22 : .82)
    .attr("d", d => {
      const sid = typeof d.source === "object" ? d.source.id : d.source;
      const tid = typeof d.target === "object" ? d.target.id : d.target;
      const s = byId.get(sid), t = byId.get(tid);
      if (!s || !t) return "";
      if (d._e.t === "spouse") return `M${s.x},${s.y} L${t.x},${t.y}`;
      const cx = (s.x + t.x) / 2;
      return `M${s.x},${s.y} C${cx},${s.y} ${cx},${t.y} ${t.x},${t.y}`;
    });

  drawNodes(g, false);
  state.gN.attr("transform", d => `translate(${d.x},${d.y})`);

  const axis = g.append("g").attr("class", "tax");
  const yTicks = d3.ticks(minY, maxY, 8);
  axis.selectAll("line").data(yTicks).enter().append("line")
    .attr("x1", 20).attr("x2", Math.max(state.W, xShift + 100)).attr("y1", d => yScale(d)).attr("y2", d => yScale(d))
    .attr("stroke", cs("--bd")).attr("stroke-opacity", .45);
  axis.selectAll("text").data(yTicks).enter().append("text")
    .attr("x", 24).attr("y", d => yScale(d) - 4).attr("font-size", 9).attr("font-family", "var(--mono)")
    .attr("fill", cs("--tx3")).text(d => d);
}

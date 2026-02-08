import state from '../state.js';

function linkIds(l) {
  return {
    s: typeof l.source === "object" ? l.source.id : l.source,
    t: typeof l.target === "object" ? l.target.id : l.target
  };
}

function linkKey(l) {
  const { s, t } = linkIds(l);
  return `${s}|${t}|${l?._e?.t || "kin"}`;
}

function baseOpacity(el) {
  const base = Number(el.getAttribute('data-bo'));
  return Number.isFinite(base) ? base : 0.8;
}

function edgeDimOpacity(el) {
  const base = baseOpacity(el);
  if (state.focusMode) return Math.max(0.06, base * 0.32);
  return Math.max(0.22, base * 0.62);
}

function nodeDimOpacity() {
  return state.focusMode ? 0.14 : 0.62;
}

function nodeBaseOpacity(el) {
  const low = el?.parentNode?.getAttribute?.('data-pr') === '0';
  return low ? 0.24 : 1;
}

function clearFlow() {
  state.gL?.classed('flow-edge', false);
}

function ancestralEdgeKeys(id, maxDepth = 14) {
  const parentByChild = new Map();
  state.links.forEach(l => {
    if (l?._e?.t !== "parent") return;
    const { s, t } = linkIds(l);
    const arr = parentByChild.get(t) || [];
    arr.push(s);
    parentByChild.set(t, arr);
  });
  const out = new Set();
  const q = [{ id, d: 0 }];
  const seen = new Set([id]);
  while (q.length) {
    const cur = q.shift();
    if (cur.d >= maxDepth) continue;
    const parents = parentByChild.get(cur.id) || [];
    parents.forEach(p => {
      out.add(`${p}|${cur.id}|parent`);
      if (seen.has(p)) return;
      seen.add(p);
      q.push({ id: p, d: cur.d + 1 });
    });
  }
  return out;
}

function applyAncestralFlow(id) {
  clearFlow();
  if (!id || state.viewMode !== "tree") return;
  const keys = ancestralEdgeKeys(id);
  if (!keys.size) return;
  state.gL?.classed("flow-edge", d => keys.has(linkKey(d)));
}

export function hiN(id) {
  state.selEdge = null;
  const cn = new Set([id]);
  state.links.forEach(l => {
    const { s, t } = linkIds(l);
    if (s === id) cn.add(t);
    if (t === id) cn.add(s);
  });
  const nd = nodeDimOpacity();
  state.gN.classed("node-selected", d => d.id === id);
  state.gN.classed("node-connected", d => d.id !== id && cn.has(d.id));
  state.gN.select("rect").attr("opacity", function (d) {
    if (cn.has(d.id)) return 1;
    return Math.min(nd, nodeBaseOpacity(this));
  });
  state.gN.select("text").attr("opacity", function (d) {
    if (cn.has(d.id)) return 1;
    return Math.min(nd, nodeBaseOpacity(this));
  });
  state.gL.attr("stroke-opacity", function (d) {
    const { s, t } = linkIds(d);
    return (s === id || t === id) ? 1 : edgeDimOpacity(this);
  });
  state.gL.classed("edge-highlight", function(d) {
    const { s, t } = linkIds(d);
    return s === id || t === id;
  });
  applyAncestralFlow(id);
}

export function hiE(link) {
  state.selId = null;
  state.selEdge = link;
  state.gN?.classed("node-selected", false);
  state.gN?.classed("node-connected", false);
  state.gL?.classed("edge-highlight", false);
  clearFlow();
  const { s: sid, t: tid } = linkIds(link);
  const nd = state.focusMode ? 0.18 : 0.66;
  state.gN.select("rect").attr("opacity", function (d) {
    if (d.id === sid || d.id === tid) return 1;
    return Math.min(nd, nodeBaseOpacity(this));
  });
  state.gN.select("text").attr("opacity", function (d) {
    if (d.id === sid || d.id === tid) return 1;
    return Math.min(nd, nodeBaseOpacity(this));
  });
  state.gL.attr("stroke-opacity", function (d) {
    if (d === link) return 1;
    return edgeDimOpacity(this);
  });
}

export function clH() {
  state.selEdge = null;
  state.gN?.classed("node-selected", false);
  state.gN?.classed("node-connected", false);
  state.gL?.classed("edge-highlight", false);
  clearFlow();
  state.gN?.select("rect").attr("opacity", function () {
    return nodeBaseOpacity(this);
  });
  state.gN?.select("text").attr("opacity", function () {
    return nodeBaseOpacity(this);
  });
  state.gL?.attr("stroke-opacity", function () {
    const base = Number(this.getAttribute('data-bo'));
    return Number.isFinite(base) ? base : 0.8;
  });
}

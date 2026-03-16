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

function syncFocusModeClass() {
  document.body.classList.toggle("focus-mode", !!state.focusMode);
}

function clearFlow() {
  state.gL?.classed('flow-edge', false);
}

function ancestralEdgeKeys(id, maxDepth = 14) {
  const parentByChild = state._parentByChild || new Map();
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
  const neighbors = state._adj?.get(id);
  const cn = new Set([id]);
  if (neighbors) neighbors.forEach(n => cn.add(n));
  else state.links.forEach(l => {
    const { s, t } = linkIds(l);
    if (s === id) cn.add(t);
    if (t === id) cn.add(s);
  });
  syncFocusModeClass();
  state.gN.classed("node-selected", d => d.id === id);
  state.gN.classed("node-connected", d => d.id !== id && cn.has(d.id));
  state.gN.classed("node-dimmed", d => !cn.has(d.id));
  state.gL.classed("edge-dimmed", d => {
    const { s, t } = linkIds(d);
    return s !== id && t !== id;
  });
  state.gL.classed("edge-highlight", d => {
    const { s, t } = linkIds(d);
    return s === id || t === id;
  });
  applyAncestralFlow(id);
}

export function hiE(link) {
  state.selId = null;
  state.selEdge = link;
  syncFocusModeClass();
  state.gN?.classed("node-selected", false);
  state.gN?.classed("node-connected", false);
  state.gL?.classed("edge-highlight", false);
  clearFlow();
  const { s: sid, t: tid } = linkIds(link);
  state.gN.classed("node-dimmed", d => d.id !== sid && d.id !== tid);
  state.gL.classed("edge-dimmed", d => d !== link);
}

export function clH() {
  state.selEdge = null;
  state.gN?.classed("node-selected", false);
  state.gN?.classed("node-connected", false);
  state.gN?.classed("node-dimmed", false);
  state.gL?.classed("edge-highlight", false);
  state.gL?.classed("edge-dimmed", false);
  clearFlow();
  document.body.classList.remove("focus-mode");
}

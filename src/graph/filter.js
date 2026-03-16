import { people, edges } from '../data/sovereigns.merge.js';
import state from '../state.js';
import { activeInYearById } from '../data/timeline.js';
import { personName, t } from '../ui/i18n.js';

/** Compute the set of person IDs active in the current era year. */
export function computeEraPersonOk() {
  const y = state.eraEnabled ? Number(state.eraYear) : NaN;
  return new Set(people
    .filter(p => !state.eraEnabled || activeInYearById(p.id, y))
    .map(p => p.id));
}

// Cached chip state — invalidated by chip clicks (listened in main.js)
let _cachedActiveE = null;
let _cachedActiveConf = null;

export function invalidateChipCache() {
  _cachedActiveE = null;
  _cachedActiveConf = null;
}

export function activeE() {
  if (_cachedActiveE) return _cachedActiveE;
  const s = new Set();
  document.querySelectorAll(".chip[data-e]").forEach(c => {
    if (c.classList.contains("on")) s.add(c.dataset.e);
  });
  _cachedActiveE = s;
  return s;
}

export function activeConfidence() {
  if (_cachedActiveConf) return _cachedActiveConf;
  const s = new Set();
  document.querySelectorAll(".chip[data-cf]").forEach(c => {
    if (c.classList.contains("on")) s.add(c.dataset.cf);
  });
  _cachedActiveConf = s;
  return s;
}

export function filt() {
  const ae = activeE();
  const ac = activeConfidence();
  const y = state.eraEnabled ? Number(state.eraYear) : NaN;
  const dV = document.getElementById("df").value;
  const sqV = document.getElementById("sqf")?.value || "__all__";
  const eraPersonOk = new Set(people
    .filter(p => !state.eraEnabled || activeInYearById(p.id, y))
    .map(p => p.id));
  const fe = edges.filter(e => {
    if (!ae.has(e.t)) return false;
    if (!ac.has(e.c)) return false;
    if (sqV !== "__all__" && (e.confidence_grade || "") !== sqV) return false;
    if (!eraPersonOk.has(e.s) || !eraPersonOk.has(e.d)) return false;
    return true;
  });
  const pPool = people.filter(p => eraPersonOk.has(p.id));
  const adj = new Map();
  pPool.forEach(p => adj.set(p.id, new Set()));
  fe.forEach(e => { adj.get(e.s)?.add(e.d); adj.get(e.d)?.add(e.s); });
  const seen = new Set(), comps = [];
  pPool.forEach(p => {
    if (seen.has(p.id)) return;
    const q = [p.id], c = [];
    seen.add(p.id);
    while (q.length) {
      const u = q.pop(); c.push(u);
      (adj.get(u) || []).forEach(v => { if (!seen.has(v)) { seen.add(v); q.push(v); } });
    }
    comps.push(c);
  });
  comps.sort((a, b) => b.length - a.length);

  // Build richer tree metadata for the tree-options popover
  const byId = new Map(pPool.map(p => [p.id, p]));
  const treesMeta = comps.map((c, i) => {
    // Find the "best" representative node (earliest sovereign, or largest degree, or first)
    let rep = byId.get(c[0]);
    let repYear = Infinity;
    for (const id of c) {
      const p = byId.get(id);
      if (!p) continue;
      const yr = p.re?.[0]?.[0] || p.yb || 9999;
      if ((p.n || []).length > 0 && yr < repYear) { rep = p; repYear = yr; }
    }
    // If no sovereign found, use earliest-dated person
    if (repYear === Infinity) {
      for (const id of c) {
        const p = byId.get(id);
        if (!p) continue;
        const yr = p.re?.[0]?.[0] || p.yb || 9999;
        if (yr < repYear) { rep = p; repYear = yr; }
      }
    }
    // Dominant dynasty
    const dyCounts = {};
    c.forEach(id => { const p = byId.get(id); if (p) { const dy = p.dy || 'Unknown'; dyCounts[dy] = (dyCounts[dy] || 0) + 1; } });
    let dominantDy = 'Unknown', maxC = 0;
    for (const [dy, cnt] of Object.entries(dyCounts)) { if (cnt > maxC) { maxC = cnt; dominantDy = dy; } }
    return { index: i, ids: c, size: c.length, repId: rep?.id, repName: rep ? personName(rep) : '?', dynasty: dominantDy, year: repYear < 9999 ? repYear : null };
  });
  state._treesMeta = treesMeta;

  const tf = document.getElementById("tf"), pv = tf.dataset.savedValue || tf.value;
  tf.innerHTML = `<option value="__all__">${t('all_trees')}</option>`;
  treesMeta.forEach((tm) => {
    const o = document.createElement("option");
    o.value = tm.index;
    const label = tm.repName !== '?' ? `${tm.repName} (${tm.size})` : `Tree ${tm.index + 1} (${tm.size})`;
    o.textContent = label;
    tf.appendChild(o);
  });
  if ([...tf.options].some(o => o.value === pv)) tf.value = pv;
  if (tf.dataset.savedValue) delete tf.dataset.savedValue;
  const tV = tf.value, aC = new Set(), aD = new Set();
  if (tV === "__all__") pPool.forEach(p => aC.add(p.id));
  else (comps[+tV] || []).forEach(id => aC.add(id));
  pPool.forEach(p => { if (dV === "__all__" || (p.dy || "Unknown") === dV) aD.add(p.id); });
  const al = new Set([...aC].filter(x => aD.has(x)));
  return { nodes: pPool.filter(p => al.has(p.id)), links: fe.filter(e => al.has(e.s) && al.has(e.d)) };
}

import { people, edges } from '../data/sovereigns.merge.js';

export function activeE() {
  const s = new Set();
  document.querySelectorAll(".chip[data-e]").forEach(c => {
    if (c.classList.contains("on")) s.add(c.dataset.e);
  });
  return s;
}

export function activeConfidence() {
  const s = new Set();
  document.querySelectorAll(".chip[data-cf]").forEach(c => {
    if (c.classList.contains("on")) s.add(c.dataset.cf);
  });
  return s;
}

export function filt() {
  const ae = activeE();
  const ac = activeConfidence();
  const dV = document.getElementById("df").value;
  const sqV = document.getElementById("sqf")?.value || "__all__";
  const fe = edges.filter(e => {
    if (!ae.has(e.t)) return false;
    if (!ac.has(e.c)) return false;
    if (sqV !== "__all__" && (e.confidence_grade || "") !== sqV) return false;
    return true;
  });
  const adj = new Map();
  people.forEach(p => adj.set(p.id, new Set()));
  fe.forEach(e => { adj.get(e.s)?.add(e.d); adj.get(e.d)?.add(e.s); });
  const seen = new Set(), comps = [];
  people.forEach(p => {
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
  const tf = document.getElementById("tf"), pv = tf.value;
  tf.innerHTML = '<option value="__all__">All trees</option>';
  comps.forEach((c, i) => {
    const o = document.createElement("option");
    o.value = i; o.textContent = "Tree " + (i + 1) + " (" + c.length + ")";
    tf.appendChild(o);
  });
  if ([...tf.options].some(o => o.value === pv)) tf.value = pv;
  const tV = tf.value, aC = new Set(), aD = new Set();
  if (tV === "__all__") people.forEach(p => aC.add(p.id));
  else (comps[+tV] || []).forEach(id => aC.add(id));
  people.forEach(p => { if (dV === "__all__" || (p.dy || "Unknown") === dV) aD.add(p.id); });
  const al = new Set([...aC].filter(x => aD.has(x)));
  return { nodes: people.filter(p => al.has(p.id)), links: fe.filter(e => al.has(e.s) && al.has(e.d)) };
}

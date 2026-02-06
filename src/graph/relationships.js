import state from '../state.js';

export function gNb(id, type) {
  const r = [];
  state.links.forEach(l => {
    if (l._e.t !== type) return;
    const s = typeof l.source === "object" ? l.source.id : l.source;
    const t = typeof l.target === "object" ? l.target.id : l.target;
    const item = {
      id: s === id ? t : s,
      c: l._e.c,
      srcCount: (l._e.evidence_refs || []).length,
      cg: l._e.confidence_grade || "",
      l: l._e.l || "",
      t: l._e.t
    };
    if (s === id || t === id) r.push(item);
  });
  return [...new Map(r.map(x => [x.id, x])).values()];
}

export function parOf(id) {
  const r = [];
  state.links.forEach(l => {
    if (l._e.t !== "parent") return;
    const s = typeof l.source === "object" ? l.source.id : l.source;
    const t = typeof l.target === "object" ? l.target.id : l.target;
    if (t === id) {
      r.push({
        id: s,
        c: l._e.c,
        srcCount: (l._e.evidence_refs || []).length,
        cg: l._e.confidence_grade || "",
        l: l._e.l || "",
        t: l._e.t
      });
    }
  });
  return [...new Map(r.map(x => [x.id, x])).values()];
}

export function chOf(id) {
  const r = [];
  state.links.forEach(l => {
    if (l._e.t !== "parent") return;
    const s = typeof l.source === "object" ? l.source.id : l.source;
    const t = typeof l.target === "object" ? l.target.id : l.target;
    if (s === id) {
      r.push({
        id: t,
        c: l._e.c,
        srcCount: (l._e.evidence_refs || []).length,
        cg: l._e.confidence_grade || "",
        l: l._e.l || "",
        t: l._e.t
      });
    }
  });
  return [...new Map(r.map(x => [x.id, x])).values()];
}

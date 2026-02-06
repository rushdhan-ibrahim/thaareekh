import { people as corePeople, edges as coreEdges } from './sovereigns.core.js';
import { people as researchPeople, edges as researchEdges } from './sovereigns.research.js';

const VALID_MODES = new Set(['canonical', 'research']);

export function resolveDataMode() {
  if (typeof window === 'undefined') return 'canonical';
  const mode = new URLSearchParams(window.location.search).get('mode');
  return VALID_MODES.has(mode) ? mode : 'canonical';
}

function mergePeople(base, extra) {
  const seen = new Set(base.map(p => p.id));
  const out = base.slice();
  extra.forEach(p => {
    if (!seen.has(p.id)) {
      seen.add(p.id);
      out.push(p);
    }
  });
  return out;
}

function edgeKey(e) {
  return [e.t, e.s, e.d, e.l || '', e.c, e.claim_type || '', e.confidence_grade || ''].join('|');
}

function mergeEdges(base, extra) {
  const seen = new Set(base.map(edgeKey));
  const out = base.slice();
  extra.forEach(e => {
    const k = edgeKey(e);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(e);
    }
  });
  return out;
}

function addToMapSet(map, k, v) {
  if (!map.has(k)) map.set(k, new Set());
  map.get(k).add(v);
}

function expandDerivedRelations(people, edges) {
  const derived = [];
  const undirectedTypes = new Set(['sibling', 'spouse', 'kin']);
  const byId = new Map(people.map(p => [p.id, p]));

  const hasDirected = new Set(edges.map(e => `${e.t}|${e.s}|${e.d}`));
  const hasUndirected = new Set(
    edges
      .filter(e => undirectedTypes.has(e.t))
      .map(e => `${e.t}|${[e.s, e.d].sort().join('|')}`)
  );

  const parentEdges = edges.filter(e => e.t === 'parent' && e.c !== 'u');
  const parentsByChild = new Map();
  const childrenByParent = new Map();
  parentEdges.forEach(e => {
    addToMapSet(parentsByChild, e.d, e.s);
    addToMapSet(childrenByParent, e.s, e.d);
  });

  const siblingMap = new Map();
  edges
    .filter(e => e.t === 'sibling' && e.c !== 'u')
    .forEach(e => {
      addToMapSet(siblingMap, e.s, e.d);
      addToMapSet(siblingMap, e.d, e.s);
    });

  function addDerived(e) {
    const out = {
      ...e,
      c: 'i',
      claim_type: 'inferred',
      confidence_grade: 'C',
      evidence_refs: ['SRC-DERIVED-RULES'],
      event_context: e.event_context || 'derived:family-rule'
    };
    if (undirectedTypes.has(out.t)) {
      const uk = `${out.t}|${[out.s, out.d].sort().join('|')}`;
      if (hasUndirected.has(uk)) return;
      hasUndirected.add(uk);
    } else {
      const dk = `${out.t}|${out.s}|${out.d}`;
      if (hasDirected.has(dk)) return;
      hasDirected.add(dk);
    }
    derived.push(out);
  }

  // 1) Derive siblings from shared parent.
  childrenByParent.forEach(children => {
    const arr = [...children];
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const a = arr[i], b = arr[j];
        if (!byId.has(a) || !byId.has(b)) continue;
        addDerived({
          t: 'sibling',
          s: a,
          d: b,
          l: 'siblings (shared parent)',
          event_context: 'derived:shared-parent'
        });
        addToMapSet(siblingMap, a, b);
        addToMapSet(siblingMap, b, a);
      }
    }
  });

  // 2) Derive grandparent relations.
  parentsByChild.forEach((parents, child) => {
    [...parents].forEach(parent => {
      const gps = parentsByChild.get(parent) || new Set();
      [...gps].forEach(gp => {
        if (!byId.has(gp) || !byId.has(child) || gp === child) return;
        // Avoid impossible duplicate semantics when direct parent already exists.
        if (hasDirected.has(`parent|${gp}|${child}`)) return;
        addDerived({
          t: 'kin',
          s: gp,
          d: child,
          l: 'grandparent',
          event_context: 'derived:parent-of-parent'
        });
      });
    });
  });

  // 3) Derive aunt/uncle relations from parent siblings.
  parentsByChild.forEach((parents, child) => {
    [...parents].forEach(parent => {
      const sibs = siblingMap.get(parent) || new Set();
      [...sibs].forEach(sib => {
        if (!byId.has(sib) || !byId.has(child) || sib === child) return;
        if (hasDirected.has(`parent|${sib}|${child}`) || hasDirected.has(`parent|${child}|${sib}`)) return;
        addDerived({
          t: 'kin',
          s: sib,
          d: child,
          l: 'aunt/uncle↔niece/nephew',
          event_context: 'derived:parent-sibling'
        });
      });
    });
  });

  // 4) Derive cousins from children of siblings.
  const siblingPairs = [];
  const seenPairs = new Set();
  siblingMap.forEach((sibs, a) => {
    [...sibs].forEach(b => {
      const k = [a, b].sort().join('|');
      if (seenPairs.has(k)) return;
      seenPairs.add(k);
      siblingPairs.push([a, b]);
    });
  });
  siblingPairs.forEach(([a, b]) => {
    const aKids = [...(childrenByParent.get(a) || new Set())];
    const bKids = [...(childrenByParent.get(b) || new Set())];
    aKids.forEach(c1 => {
      bKids.forEach(c2 => {
        if (c1 === c2 || !byId.has(c1) || !byId.has(c2)) return;
        if (hasUndirected.has(`sibling|${[c1, c2].sort().join('|')}`)) return;
        if (hasDirected.has(`parent|${c1}|${c2}`) || hasDirected.has(`parent|${c2}|${c1}`)) return;
        addDerived({
          t: 'kin',
          s: c1,
          d: c2,
          l: 'cousins',
          event_context: 'derived:children-of-siblings'
        });
      });
    });
  });

  return derived;
}

function normalizeEdge(e) {
  const out = { ...e };
  if (!out.confidence_grade) {
    out.confidence_grade = out.c === 'u' ? 'D' : out.c === 'i' ? 'C' : 'B';
  }
  if (!out.claim_type) {
    out.claim_type = out.c === 'u' ? 'contested' : out.c === 'i' ? 'inferred' : 'direct';
  }
  if (!Array.isArray(out.evidence_refs) || out.evidence_refs.length === 0) {
    // Baseline legacy provenance: existing graph was sourced from kings list compilation.
    out.evidence_refs = ['SRC-MRF-KINGS'];
  }
  return out;
}

function normalizeEdges(list) {
  return list.map(normalizeEdge);
}

export function getDataset(mode = resolveDataMode()) {
  if (mode === 'research') {
    const people = mergePeople(corePeople, researchPeople);
    const edges = mergeEdges(coreEdges, researchEdges);
    const derived = expandDerivedRelations(people, edges);
    return {
      mode,
      people,
      edges: normalizeEdges(mergeEdges(edges, derived))
    };
  }
  {
    const people = corePeople;
    const edges = coreEdges;
    const derived = expandDerivedRelations(people, edges);
    return { mode: 'canonical', people, edges: normalizeEdges(mergeEdges(edges, derived)) };
  }
}

export const { mode, people, edges } = getDataset();
export const byId = new Map(people.map(p => [p.id, p]));

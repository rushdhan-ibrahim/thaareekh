import type { PersonNode, EdgeRecord, TreeMeta } from '../types/state';

/** Inputs that the filter reads from the DOM / app state. */
export interface FilterInput {
  activeEdgeTypes: Set<string>;
  activeConfidence: Set<string>;
  dynastyValue: string;
  sourceGradeValue: string;
  eraEnabled: boolean;
  eraYear: number;
  eraPersonOk: Set<string>;
}

export interface FilterResult {
  nodes: PersonNode[];
  links: EdgeRecord[];
  treesMeta: TreeMeta[];
  components: string[][];
}

/**
 * Pure filter logic: filter edges and build connected components.
 * Does NOT touch the DOM — all inputs arrive via `FilterInput`.
 */
export function filterCore(
  people: PersonNode[],
  edges: EdgeRecord[],
  input: FilterInput,
  personNameFn: (p: PersonNode) => string
): FilterResult {
  const { activeEdgeTypes, activeConfidence, sourceGradeValue, eraPersonOk } = input;

  // Filter edges
  const filteredEdges = edges.filter(e => {
    if (!activeEdgeTypes.has(e.t)) return false;
    if (!activeConfidence.has(e.c)) return false;
    if (sourceGradeValue !== '__all__' && (e.confidence_grade ?? '') !== sourceGradeValue) return false;
    if (!eraPersonOk.has(e.s) || !eraPersonOk.has(e.d)) return false;
    return true;
  });

  // Pool of people alive in era
  const pPool = people.filter(p => eraPersonOk.has(p.id));

  // Build adjacency for connected components
  const adj = new Map<string, Set<string>>();
  pPool.forEach(p => adj.set(p.id, new Set()));
  filteredEdges.forEach(e => {
    adj.get(e.s)?.add(e.d);
    adj.get(e.d)?.add(e.s);
  });

  // BFS connected components
  const seen = new Set<string>();
  const comps: string[][] = [];
  pPool.forEach(p => {
    if (seen.has(p.id)) return;
    const q = [p.id];
    const c: string[] = [];
    seen.add(p.id);
    while (q.length) {
      const u = q.pop()!;
      c.push(u);
      const neighbors = adj.get(u);
      if (neighbors) {
        for (const v of neighbors) {
          if (!seen.has(v)) { seen.add(v); q.push(v); }
        }
      }
    }
    comps.push(c);
  });
  comps.sort((a, b) => b.length - a.length);

  // Build tree metadata
  const byId = new Map(pPool.map(p => [p.id, p]));
  const treesMeta: TreeMeta[] = comps.map((c, i) => {
    let rep = byId.get(c[0]!);
    let repYear = Infinity;
    for (const id of c) {
      const p = byId.get(id);
      if (!p) continue;
      const yr = p.re?.[0]?.[0] ?? p.yb ?? 9999;
      if ((p.n ?? []).length > 0 && yr < repYear) { rep = p; repYear = yr; }
    }
    if (repYear === Infinity) {
      for (const id of c) {
        const p = byId.get(id);
        if (!p) continue;
        const yr = p.re?.[0]?.[0] ?? p.yb ?? 9999;
        if (yr < repYear) { rep = p; repYear = yr; }
      }
    }
    const dyCounts: Record<string, number> = {};
    c.forEach(id => {
      const p = byId.get(id);
      if (p) { const dy = p.dy ?? 'Unknown'; dyCounts[dy] = (dyCounts[dy] ?? 0) + 1; }
    });
    let dominantDy = 'Unknown';
    let maxC = 0;
    for (const [dy, cnt] of Object.entries(dyCounts)) {
      if (cnt > maxC) { maxC = cnt; dominantDy = dy; }
    }
    return {
      index: i,
      ids: c,
      size: c.length,
      repId: rep?.id,
      repName: rep ? personNameFn(rep) : '?',
      dynasty: dominantDy,
      year: repYear < 9999 ? repYear : null
    };
  });

  return { nodes: pPool, links: filteredEdges, treesMeta, components: comps };
}

/**
 * Apply dynasty + tree dropdown filtering to narrow the node/edge set.
 */
export function applyTreeDynastyFilter(
  result: FilterResult,
  dynastyValue: string,
  treeValue: string
): { nodes: PersonNode[]; links: EdgeRecord[] } {
  const { nodes: pPool, links: filteredEdges, components } = result;

  const aC = new Set<string>();
  const aD = new Set<string>();

  if (treeValue === '__all__') {
    pPool.forEach(p => aC.add(p.id));
  } else {
    const idx = parseInt(treeValue, 10);
    const comp = components[idx];
    if (comp) comp.forEach(id => aC.add(id));
  }

  pPool.forEach(p => {
    if (dynastyValue === '__all__' || (p.dy ?? 'Unknown') === dynastyValue) aD.add(p.id);
  });

  const al = new Set([...aC].filter(x => aD.has(x)));

  return {
    nodes: pPool.filter(p => al.has(p.id)),
    links: filteredEdges.filter(e => al.has(e.s) && al.has(e.d))
  };
}

/** Read active edge type chips from DOM. */
export function activeE(): Set<string> {
  const s = new Set<string>();
  document.querySelectorAll('.chip[data-e]').forEach(c => {
    if (c.classList.contains('on')) s.add((c as HTMLElement).dataset.e ?? '');
  });
  return s;
}

/** Read active confidence chips from DOM. */
export function activeConfidence(): Set<string> {
  const s = new Set<string>();
  document.querySelectorAll('.chip[data-cf]').forEach(c => {
    if (c.classList.contains('on')) s.add((c as HTMLElement).dataset.cf ?? '');
  });
  return s;
}

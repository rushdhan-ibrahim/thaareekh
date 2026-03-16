import type { AppState, LinkDatum } from '../types/state';

/** Extract source/target string IDs from a d3 link datum. */
export function linkIds(l: LinkDatum): { s: string; t: string } {
  return {
    s: typeof l.source === 'object' ? l.source.id : l.source,
    t: typeof l.target === 'object' ? l.target.id : l.target
  };
}

/** Canonical edge key: "sourceId|targetId|type". */
export function linkKey(l: LinkDatum): string {
  const { s: hSrc, t: hTgt } = linkIds(l);
  return `${hSrc}|${hTgt}|${l._e?.t ?? 'kin'}`;
}

function syncFocusModeClass(state: AppState): void {
  document.body.classList.toggle('focus-mode', !!state.focusMode);
}

/**
 * Walk parent edges upward from a person, collecting edge keys.
 * Pure function: takes links array, not global state.
 */
export function ancestralEdgeKeys(
  id: string,
  links: LinkDatum[],
  maxDepth: number = 14,
  cachedParentByChild?: Map<string, string[]>
): Set<string> {
  const parentByChild = cachedParentByChild ?? new Map<string, string[]>();
  if (!cachedParentByChild) {
    links.forEach(l => {
      if (l._e?.t !== 'parent') return;
      const { s: hSrc, t: hTgt } = linkIds(l);
      const arr = parentByChild.get(hTgt) ?? [];
      arr.push(hSrc);
      parentByChild.set(hTgt, arr);
    });
  }
  const out = new Set<string>();
  const q: Array<{ id: string; d: number }> = [{ id, d: 0 }];
  const seen = new Set<string>([id]);
  while (q.length) {
    const cur = q.shift()!;
    if (cur.d >= maxDepth) continue;
    const parents = parentByChild.get(cur.id) ?? [];
    parents.forEach(p => {
      out.add(`${p}|${cur.id}|parent`);
      if (seen.has(p)) return;
      seen.add(p);
      q.push({ id: p, d: cur.d + 1 });
    });
  }
  return out;
}

function clearFlow(state: AppState): void {
  (state.gL as any)?.classed?.('flow-edge', false);
}

function applyAncestralFlow(id: string | null, state: AppState): void {
  clearFlow(state);
  if (!id || state.viewMode !== 'tree') return;
  const keys = ancestralEdgeKeys(id, state.links, 14, state._parentByChild);
  if (!keys.size) return;
  (state.gL as any)?.classed?.('flow-edge', (d: LinkDatum) => keys.has(linkKey(d)));
}

/** Highlight a node and its immediate neighbors. */
export function hiN(id: string, state: AppState): void {
  state.selEdge = null;
  const neighbors = state._adj?.get(id);
  const cn = new Set<string>([id]);
  if (neighbors) neighbors.forEach(n => cn.add(n));
  else state.links.forEach(l => {
    const { s: hSrc, t: hTgt } = linkIds(l);
    if (hSrc === id) cn.add(hTgt);
    if (hTgt === id) cn.add(hSrc);
  });
  syncFocusModeClass(state);
  const gN = state.gN as any;
  const gL = state.gL as any;

  gN?.classed?.('node-selected', (d: { id: string }) => d.id === id);
  gN?.classed?.('node-connected', (d: { id: string }) => d.id !== id && cn.has(d.id));
  gN?.classed?.('node-dimmed', (d: { id: string }) => !cn.has(d.id));
  gL?.classed?.('edge-dimmed', (d: LinkDatum) => {
    const { s: hSrc, t: hTgt } = linkIds(d);
    return hSrc !== id && hTgt !== id;
  });
  gL?.classed?.('edge-highlight', (d: LinkDatum) => {
    const { s: hSrc, t: hTgt } = linkIds(d);
    return hSrc === id || hTgt === id;
  });
  applyAncestralFlow(id, state);
}

/** Highlight an edge and its two endpoint nodes. */
export function hiE(link: LinkDatum, state: AppState): void {
  state.selId = null;
  state.selEdge = link;
  syncFocusModeClass(state);
  const gN = state.gN as any;
  const gL = state.gL as any;

  gN?.classed?.('node-selected', false);
  gN?.classed?.('node-connected', false);
  gL?.classed?.('edge-highlight', false);
  clearFlow(state);

  const { s: sid, t: tid } = linkIds(link);
  gN?.classed?.('node-dimmed', (d: { id: string }) => d.id !== sid && d.id !== tid);
  gL?.classed?.('edge-dimmed', (d: LinkDatum) => d !== link);
}

/** Clear all highlighting. */
export function clH(state: AppState): void {
  state.selEdge = null;
  const gN = state.gN as any;
  const gL = state.gL as any;

  gN?.classed?.('node-selected', false);
  gN?.classed?.('node-connected', false);
  gN?.classed?.('node-dimmed', false);
  gL?.classed?.('edge-highlight', false);
  gL?.classed?.('edge-dimmed', false);
  clearFlow(state);
  document.body.classList.remove('focus-mode');
}

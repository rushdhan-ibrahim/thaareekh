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

function baseOpacity(el: Element): number {
  const base = Number(el.getAttribute('data-bo'));
  return Number.isFinite(base) ? base : 0.8;
}

function edgeDimOpacity(el: Element, focusMode: boolean): number {
  const base = baseOpacity(el);
  if (focusMode) return Math.max(0.06, base * 0.32);
  return Math.max(0.35, base * 0.75);
}

function nodeDimOpacity(focusMode: boolean): number {
  return focusMode ? 0.14 : 0.82;
}

function nodeBaseOpacity(el: Element | null): number {
  const low = el?.parentElement?.getAttribute?.('data-pr') === '0';
  return low ? 0.24 : 1;
}

/**
 * Walk parent edges upward from a person, collecting edge keys.
 * Pure function: takes links array, not global state.
 */
export function ancestralEdgeKeys(
  id: string,
  links: LinkDatum[],
  maxDepth: number = 14
): Set<string> {
  const parentByChild = new Map<string, string[]>();
  links.forEach(l => {
    if (l._e?.t !== 'parent') return;
    const { s: hSrc, t: hTgt } = linkIds(l);
    const arr = parentByChild.get(hTgt) ?? [];
    arr.push(hSrc);
    parentByChild.set(hTgt, arr);
  });
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
  const keys = ancestralEdgeKeys(id, state.links);
  if (!keys.size) return;
  (state.gL as any)?.classed?.('flow-edge', (d: LinkDatum) => keys.has(linkKey(d)));
}

/** Highlight a node and its immediate neighbors. */
export function hiN(id: string, state: AppState): void {
  state.selEdge = null;
  const cn = new Set<string>([id]);
  state.links.forEach(l => {
    const { s: hSrc, t: hTgt } = linkIds(l);
    if (hSrc === id) cn.add(hTgt);
    if (hTgt === id) cn.add(hSrc);
  });
  const nd = nodeDimOpacity(state.focusMode);
  const gN = state.gN as any;
  const gL = state.gL as any;

  gN?.classed?.('node-selected', (d: { id: string }) => d.id === id);
  gN?.classed?.('node-connected', (d: { id: string }) => d.id !== id && cn.has(d.id));
  gN?.select?.('rect')?.attr?.('opacity', function (this: Element, d: { id: string }) {
    if (cn.has(d.id)) return 1;
    return Math.min(nd, nodeBaseOpacity(this));
  });
  gN?.select?.('text')?.attr?.('opacity', function (this: Element, d: { id: string }) {
    if (cn.has(d.id)) return 1;
    return Math.min(nd, nodeBaseOpacity(this));
  });
  gL?.attr?.('stroke-opacity', function (this: Element, d: LinkDatum) {
    const { s: hSrc, t: hTgt } = linkIds(d);
    return (hSrc === id || hTgt === id) ? 1 : edgeDimOpacity(this, state.focusMode);
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
  const gN = state.gN as any;
  const gL = state.gL as any;

  gN?.classed?.('node-selected', false);
  gN?.classed?.('node-connected', false);
  gL?.classed?.('edge-highlight', false);
  clearFlow(state);

  const { s: sid, t: tid } = linkIds(link);
  const nd = state.focusMode ? 0.18 : 0.82;

  gN?.select?.('rect')?.attr?.('opacity', function (this: Element, d: { id: string }) {
    if (d.id === sid || d.id === tid) return 1;
    return Math.min(nd, nodeBaseOpacity(this));
  });
  gN?.select?.('text')?.attr?.('opacity', function (this: Element, d: { id: string }) {
    if (d.id === sid || d.id === tid) return 1;
    return Math.min(nd, nodeBaseOpacity(this));
  });
  gL?.attr?.('stroke-opacity', function (this: Element, d: LinkDatum) {
    if (d === link) return 1;
    return edgeDimOpacity(this, state.focusMode);
  });
}

/** Clear all highlighting. */
export function clH(state: AppState): void {
  state.selEdge = null;
  const gN = state.gN as any;
  const gL = state.gL as any;

  gN?.classed?.('node-selected', false);
  gN?.classed?.('node-connected', false);
  gL?.classed?.('edge-highlight', false);
  clearFlow(state);

  gN?.select?.('rect')?.attr?.('opacity', function (this: Element) {
    return nodeBaseOpacity(this);
  });
  gN?.select?.('text')?.attr?.('opacity', function (this: Element) {
    return nodeBaseOpacity(this);
  });
  gL?.attr?.('stroke-opacity', function (this: Element) {
    const base = Number(this.getAttribute('data-bo'));
    return Number.isFinite(base) ? base : 0.8;
  });
}

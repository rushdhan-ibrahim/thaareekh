import type { AppState, PersonNode, EdgeRecord, LinkDatum } from '../types/state.js';
import type { TreePlacementInput, TreePlacementOutput } from './tree-placement-core.ts';

type D3Like = typeof import('d3');

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DynastyTransition {
  year: number;
  dynasty: string;
  label: string;
  short?: string;
}

interface EraMilestone {
  year: number;
  label: string;
  short?: string;
  kind?: string;
}

interface DensityProfile {
  text: number;
  padMale: number;
  padFemale: number;
  treeNodeY: number;
  treeNodeX: number;
  treeDepthNudge: number;
  treeDepthY: number;
  treeSiblingX: number;
  treeSectionGap: number;
  treeCharW: number;
  forceDistance: number;
  forceCharge: number;
  forceCollide: number;
  forceStrength: number;
  maxLabelChars: number;
}

interface TreeDim {
  tr: { hierarchy: any; size: number; dominantDy: string; rootName: string; earliestYear: number };
  desc: any[];
  minNodeX: number;
  maxNodeX: number;
  width: number;
  earliestYear: number;
  latestYear: number;
  isMajor: boolean;
  height?: number;
  trueWidth?: number;
  assignedCol?: number;
  assignedY?: number;
}

interface Section {
  y: number;
  dynasty: string | null;
  label: string;
  count: number;
}

interface TreePlacementCacheValue {
  pos: Map<string, { x: number; y: number; depth: number }>;
  depthMap: Map<string, number>;
  sections: Section[];
  yOffset: number;
  treeMinYear: number;
  treePxPerYear: number;
  treeBaseY: number;
  treeMaxColX: number;
}

interface GraphRenderRefs {
  gL: any;
  gN: any;
  edgeLabelSel: any;
  gBadges: any;
  nodeMap: Map<string, PersonNode>;
}

interface TreePlacementWorkerResult {
  type: 'tree-placement-result';
  key: string;
  result: TreePlacementOutput;
  elapsedMs: number;
}

interface TreePlacementWorkerError {
  type: 'tree-placement-error';
  key: string;
  error: string;
}

// ---------------------------------------------------------------------------
// Module-level deps (set via initRebuild)
// ---------------------------------------------------------------------------

let _state: AppState;
let _d3: D3Like;
let _filt: () => { nodes: PersonNode[]; links: EdgeRecord[] };
let _hiN: (id: string) => void;
let _hiE: (link: LinkDatum) => void;
let _clH: () => void;
let _showD: (id: string) => void;
let _showLinkDetail: (link: LinkDatum) => void;
let _cs: (key: string) => string = () => '';
let _eC: (e: EdgeRecord) => string = () => '';
let _nC: (dy: string | undefined) => string = () => '';
let _fR: (re: Array<[number, number?]>) => string = () => '';
let _esc: (s: string) => string = (s) => s;
let _personName: (p: PersonNode | string) => string = (p) => typeof p === 'string' ? p : p.nm;
let _relationLabel: (t: string) => string = (t) => t;
let _t: (key: string) => string = (k) => k;
let _showNodeHoverCard: (ev: MouseEvent, d: PersonNode) => void = () => {};
let _moveHoverCard: (ev: MouseEvent) => void = () => {};
let _hideHoverCard: () => void = () => {};
let _computeTreePlacement: (input: TreePlacementInput) => TreePlacementOutput = () => {
  throw new Error('tree placement compute dependency not initialized');
};

let _dynastyTransitions: DynastyTransition[] = [];
let _eraMilestones: EraMilestone[] = [];
let _timeExtent: { min: number; max: number } = { min: 1100, max: 1968 };
let _treePlacementCache: { key: string; value: TreePlacementCacheValue } | null = null;
let _graphRenderRefs: GraphRenderRefs | null = null;
let _graphTickRaf = 0;
let _graphLastSyncTs = 0;
let _graphStableTicks = 0;
let _treePlacementWorker: Worker | null = null;
let _treePlacementWorkerReady = false;
let _treePlacementWorkerFailed = false;
const _treePlacementWorkerPending = new Set<string>();
const _treePlacementWorkerCache = new Map<string, TreePlacementCacheValue>();

const PROGRESSIVE_THRESHOLD = 140;
const TREE_PLACEMENT_WORKER_CACHE_MAX = 4;

// BBox cache — avoids forced reflows on re-renders with same labels
const _bboxCache = new Map<string, { x: number; y: number; width: number; height: number }>();
function cachedBBox(textEl: SVGTextElement, label: string, fontSize: number): { x: number; y: number; width: number; height: number } {
  const key = `${label}|${fontSize}`;
  let cached = _bboxCache.get(key);
  if (cached) return cached;
  const bb = textEl.getBBox();
  cached = { x: bb.x, y: bb.y, width: bb.width, height: bb.height };
  _bboxCache.set(key, cached);
  return cached;
}
window.addEventListener('lang-changed', () => _bboxCache.clear());

// ---------------------------------------------------------------------------
// Pure helpers (testable)
// ---------------------------------------------------------------------------

export function degreeRank(
  nodes: PersonNode[],
  links: LinkDatum[]
): { degree: Map<string, number>; ranked: PersonNode[] } {
  const degree = new Map<string, number>(nodes.map(n => [n.id, 0]));
  links.forEach(l => {
    const { s: hSrc, t: hTgt } = linkIds(l);
    if (degree.has(hSrc)) degree.set(hSrc, (degree.get(hSrc) || 0) + 1);
    if (degree.has(hTgt)) degree.set(hTgt, (degree.get(hTgt) || 0) + 1);
  });
  return {
    degree,
    ranked: nodes
      .slice()
      .sort((a, b) => {
        const d = (degree.get(b.id) || 0) - (degree.get(a.id) || 0);
        if (d !== 0) return d;
        const ay = a.re?.[0]?.[0] ?? 99999;
        const by = b.re?.[0]?.[0] ?? 99999;
        return ay - by;
      })
  };
}

export function earliestYear(node: any): number | null {
  const data = node.data || node;
  return data.re?.[0]?.[0] || data.yb || (data.yd ? data.yd - 50 : null);
}

/**
 * Post-process d3.tree() Y coordinates to reflect chronological dates.
 * Keeps X (sibling separation) untouched; only adjusts Y.
 */
export function chronoPostProcess(
  hierarchy: any,
  pxPerYear: number,
  treeMinYear: number,
  treeDepthY: number,
  minGap: number
): void {
  function nodeYear(d: any): number | null {
    const data = d.data;
    return data.re?.[0]?.[0] || data.yb || (data.yd ? data.yd - 50 : null);
  }

  // BFS top-down pass — assign chronoY
  const queue = [hierarchy];
  hierarchy.chronoY = 0;
  const rootYear = nodeYear(hierarchy);
  if (rootYear) {
    hierarchy.chronoY = (rootYear - treeMinYear) * pxPerYear;
  }

  while (queue.length) {
    const node = queue.shift();
    if (!node.children) continue;
    for (const child of node.children) {
      const yr = nodeYear(child);
      if (yr) {
        const idealY = (yr - treeMinYear) * pxPerYear;
        child.chronoY = Math.max(idealY, node.chronoY + minGap);
      } else {
        child.chronoY = node.chronoY + treeDepthY;
      }
      queue.push(child);
    }
  }

  // Interpolate undated interior nodes
  hierarchy.each((node: any) => {
    if (nodeYear(node)) return;
    if (!node.parent) return;
    let datedAncestor = node.parent;
    while (datedAncestor && !nodeYear(datedAncestor)) datedAncestor = datedAncestor.parent;
    if (!datedAncestor) return;
    let datedDesc: any = null;
    let descDepth = 0;
    const findDated = (n: any, depth: number) => {
      if (datedDesc) return;
      if (nodeYear(n) && n !== node) { datedDesc = n; descDepth = depth; return; }
      if (n.children) n.children.forEach((c: any) => findDated(c, depth + 1));
    };
    findDated(node, 0);
    if (!datedDesc) return;
    let ancestorDepth = 0;
    let walk = node;
    while (walk && walk !== datedAncestor) { ancestorDepth++; walk = walk.parent; }
    const totalSteps = ancestorDepth + descDepth;
    if (totalSteps <= 0) return;
    const frac = ancestorDepth / totalSteps;
    node.chronoY = datedAncestor.chronoY + frac * (datedDesc.chronoY - datedAncestor.chronoY);
    node.chronoY = Math.max(node.chronoY, node.parent.chronoY + minGap);
  });

  // Bottom-up enforcement of minGap
  const leaves: any[] = [];
  hierarchy.each((n: any) => { if (!n.children || !n.children.length) leaves.push(n); });
  const visited = new Set<any>();
  const stack = [...leaves];
  while (stack.length) {
    const node = stack.shift();
    if (visited.has(node)) continue;
    visited.add(node);
    if (node.parent) {
      const deficit = minGap - (node.chronoY - node.parent.chronoY);
      if (deficit > 0) {
        const pushDown = (n: any) => {
          n.chronoY += deficit;
          if (n.children) n.children.forEach(pushDown);
        };
        pushDown(node);
      }
      if (!visited.has(node.parent)) stack.push(node.parent);
    }
  }

  // Normalize: shift so root.chronoY = 0
  const rootCY = hierarchy.chronoY;
  hierarchy.each((n: any) => { n.chronoY -= rootCY; });
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function linkIds(l: LinkDatum): { s: string; t: string } {
  return {
    s: typeof l.source === 'object' ? l.source.id : l.source,
    t: typeof l.target === 'object' ? l.target.id : l.target
  };
}

function linkKey(l: LinkDatum): string {
  const { s: hSrc, t: hTgt } = linkIds(l);
  return `${hSrc}|${hTgt}|${l._e?.t ?? 'kin'}`;
}

function relationTypeLabel(tType: string): string {
  return _relationLabel(tType);
}

function confidenceLabel(c: string): string {
  if (c === 'c') return _t('confirmed');
  if (c === 'i') return _t('inferred');
  return _t('uncertain');
}

function dynastyColor(dy: string): string {
  const key = `--dy-${(dy || 'unknown').toLowerCase()}`;
  return _cs(key) || _cs('--ac');
}

function trimLabel(s: string | undefined, n: number = 26): string {
  if (!s) return '';
  return s.length > n ? `${s.slice(0, n - 1)}\u2026` : s;
}

function densityProfile(): DensityProfile {
  if (_state.density === 'compact') {
    return {
      text: 11, padMale: 8, padFemale: 11,
      treeNodeY: 48, treeNodeX: 150, treeDepthNudge: 9, treeDepthY: 58,
      treeSiblingX: 130, treeSectionGap: 40, treeCharW: 6.5,
      forceDistance: 78, forceCharge: -640, forceCollide: 32,
      forceStrength: 0.032, maxLabelChars: 18
    };
  }
  if (_state.density === 'presentation') {
    return {
      text: 14, padMale: 11, padFemale: 15,
      treeNodeY: 70, treeNodeX: 210, treeDepthNudge: 16, treeDepthY: 86,
      treeSiblingX: 180, treeSectionGap: 60, treeCharW: 8.0,
      forceDistance: 120, forceCharge: -1060, forceCollide: 50,
      forceStrength: 0.04, maxLabelChars: 28
    };
  }
  return {
    text: 12, padMale: 9, padFemale: 13,
    treeNodeY: 58, treeNodeX: 170, treeDepthNudge: 12, treeDepthY: 68,
    treeSiblingX: 150, treeSectionGap: 48, treeCharW: 7.1,
    forceDistance: 90, forceCharge: -800, forceCollide: 40,
    forceStrength: 0.035, maxLabelChars: 22
  };
}

function edgeStrokeColor(e: EdgeRecord): string {
  if (_state.overlayMode === 'confidence') {
    if (e.c === 'c') return _cs('--ac2');
    if (e.c === 'i') return _cs('--ei');
    return _cs('--eu');
  }
  if (_state.overlayMode === 'source') return sourceGradeColor(e.confidence_grade);
  return _eC(e);
}

function sourceGradeColor(g: string | undefined): string {
  if (g === 'A') return _cs('--sq-a');
  if (g === 'B') return _cs('--sq-b');
  if (g === 'D') return _cs('--sq-d');
  return _cs('--sq-c');
}

function edgeDashArray(e: EdgeRecord, isExtraParent: boolean = false): string | null {
  if (_state.overlayMode === 'source') {
    if (isExtraParent) return '3,5';
    const g = e.confidence_grade || 'C';
    if (g === 'A') return null;
    if (g === 'B') return '4,2';
    if (g === 'C') return '2,4';
    return '1,6';
  }
  if (isExtraParent) return '3,5';
  return e.c === 'i' ? '5,4' : e.c === 'u' ? '3,5' : null;
}

function edgeOpacity(e: EdgeRecord, base: number): number {
  if (_state.overlayMode === 'confidence') {
    if (e.c === 'c') return Math.max(base, 0.88);
    if (e.c === 'i') return Math.max(base * 0.86, 0.7);
    return Math.max(base * 0.8, 0.6);
  }
  if (_state.overlayMode === 'source') {
    const g = e.confidence_grade || 'C';
    if (g === 'A') return Math.max(base, 0.92);
    if (g === 'B') return Math.max(base * 0.92, 0.78);
    if (g === 'C') return Math.max(base * 0.85, 0.64);
    return Math.max(base * 0.75, 0.5);
  }
  return base;
}

function edgeWidth(e: EdgeRecord, parentW: number, otherW: number): number {
  const base = e.t === 'parent' ? parentW : otherW;
  if (_state.overlayMode === 'confidence') {
    if (e.c === 'u') return base + 0.45;
    if (e.c === 'c') return base + 0.3;
    return base + 0.2;
  }
  if (_state.overlayMode === 'source') {
    const g = e.confidence_grade || 'C';
    if (g === 'A') return base + 0.5;
    if (g === 'B') return base + 0.25;
    if (g === 'D') return base + 0.1;
  }
  return base;
}

function sameLink(a: LinkDatum, b: LinkDatum): boolean {
  const la = linkIds(a);
  const lb = linkIds(b);
  const dir = (la.s === lb.s && la.t === lb.t) || (la.s === lb.t && la.t === lb.s);
  if (!dir) return false;
  return (a?._e?.t || 'kin') === (b?._e?.t || 'kin');
}

function edgeSelectionKey(link: LinkDatum): string {
  const { s: hSrc, t: hTgt } = linkIds(link);
  const a = hSrc < hTgt ? hSrc : hTgt;
  const b = hSrc < hTgt ? hTgt : hSrc;
  return `${a}|${b}|${link?._e?.t || 'kin'}`;
}

function ensureLayer(parent: any, className: string): any {
  return parent.selectAll(`g.${className}`).data([className]).join('g').attr('class', className);
}

function treePlacementCacheKey(nodes: PersonNode[], links: LinkDatum[], dens: DensityProfile, lang: string): string {
  const nodeIds = nodes.map(n => n.id).sort().join(',');
  const nodeLabelShape = nodes
    .map(n => `${n.id}:${_personName(n).length}:${n.g === 'F' ? 1 : 0}`)
    .sort()
    .join(',');
  const edgeKeys = links
    .map(l => {
      const { s: hSrc, t: hTgt } = linkIds(l);
      return `${hSrc}|${hTgt}|${l._e.t}|${l._e.c}|${l._e.confidence_grade || ''}`;
    })
    .sort()
    .join(',');
  return [
    lang,
    dens.treeSiblingX,
    dens.treeDepthY,
    dens.treeSectionGap,
    dens.maxLabelChars,
    nodeIds,
    nodeLabelShape,
    edgeKeys
  ].join('::');
}

function toTreePlacementValue(output: TreePlacementOutput): TreePlacementCacheValue {
  return {
    pos: new Map(output.pos),
    depthMap: new Map(output.depthMap),
    sections: output.sections,
    yOffset: output.yOffset,
    treeMinYear: output.treeMinYear,
    treePxPerYear: output.treePxPerYear,
    treeBaseY: output.treeBaseY,
    treeMaxColX: output.treeMaxColX
  };
}

function toTreePlacementInput(nodes: PersonNode[], links: LinkDatum[], dens: DensityProfile): TreePlacementInput {
  return {
    nodes: nodes.map(n => {
      const out: TreePlacementInput['nodes'][number] = {
        id: n.id,
        label: _personName(n),
        n: (n.n || []).map(v => String(v)),
        re: n.re || []
      };
      if (n.g !== undefined) out.g = n.g;
      if (n.dy !== undefined) out.dy = n.dy;
      if (n.yb !== undefined) out.yb = n.yb;
      if (n.yd !== undefined) out.yd = n.yd;
      return out;
    }),
    links: links.map(l => {
      const { s: hSrc, t: hTgt } = linkIds(l);
      const out: TreePlacementInput['links'][number] = {
        s: hSrc,
        d: hTgt,
        t: l._e.t,
        c: l._e.c
      };
      if (l._e.confidence_grade !== undefined) out.confidence_grade = l._e.confidence_grade;
      if (l._e.l !== undefined) out.l = l._e.l;
      return out;
    }),
    dens: {
      padMale: dens.padMale,
      padFemale: dens.padFemale,
      treeDepthY: dens.treeDepthY,
      treeSiblingX: dens.treeSiblingX,
      treeSectionGap: dens.treeSectionGap,
      treeCharW: dens.treeCharW,
      maxLabelChars: dens.maxLabelChars
    },
    labels: {
      earlySovereigns: _t('early_sovereigns') || 'Early Sovereigns',
      unconnected: _t('unconnected') || 'Unconnected'
    }
  };
}

function trimTreeWorkerCache(): void {
  while (_treePlacementWorkerCache.size > TREE_PLACEMENT_WORKER_CACHE_MAX) {
    const firstKey = _treePlacementWorkerCache.keys().next().value;
    if (!firstKey) break;
    _treePlacementWorkerCache.delete(firstKey);
  }
}

function treePlacementWorkerEnabled(): boolean {
  if (typeof window === 'undefined' || typeof Worker === 'undefined') return false;
  const policy = String((window as any).__treePlacementWorkerPolicy || '').toLowerCase();
  if (policy === 'off' || policy === 'false' || policy === 'disabled') return false;
  if (policy === 'on' || policy === 'true' || policy === 'enabled') return true;
  return !((window as any).__disableTreePlacementWorker);
}

function ensureTreePlacementWorker(): Worker | null {
  if (_treePlacementWorkerFailed || !treePlacementWorkerEnabled()) return null;
  if (_treePlacementWorker) return _treePlacementWorker;
  try {
    const worker = new Worker(new URL('./tree-placement-worker.ts', import.meta.url), { type: 'module' });
    worker.addEventListener('message', (event: MessageEvent<TreePlacementWorkerResult | TreePlacementWorkerError>) => {
      const msg = event.data;
      if (!msg || !msg.key) return;
      _treePlacementWorkerPending.delete(msg.key);
      if (msg.type === 'tree-placement-result') {
        _treePlacementWorkerCache.set(msg.key, toTreePlacementValue(msg.result));
        trimTreeWorkerCache();
        _treePlacementWorkerReady = true;
      }
    });
    worker.addEventListener('error', () => {
      _treePlacementWorkerFailed = true;
      _treePlacementWorkerReady = false;
      _treePlacementWorkerPending.clear();
      _treePlacementWorkerCache.clear();
      _treePlacementWorker = null;
    });
    _treePlacementWorker = worker;
  } catch {
    _treePlacementWorkerFailed = true;
    _treePlacementWorker = null;
  }
  return _treePlacementWorker;
}

function queueTreePlacementWorker(key: string, input: TreePlacementInput): void {
  if (_treePlacementCache?.key === key) return;
  if (_treePlacementWorkerCache.has(key) || _treePlacementWorkerPending.has(key)) return;
  const worker = ensureTreePlacementWorker();
  if (!worker) return;
  _treePlacementWorkerPending.add(key);
  worker.postMessage({
    type: 'tree-placement-request',
    key,
    payload: input
  });
}

function syncGraphDom(): void {
  if (!_graphRenderRefs) return;
  const refs = _graphRenderRefs;
  refs.gL.attr('x1', (d: any) => d.source.x).attr('y1', (d: any) => d.source.y).attr('x2', (d: any) => d.target.x).attr('y2', (d: any) => d.target.y);
  refs.gN.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
  refs.edgeLabelSel
    .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
    .attr('y', (d: any) => (d.source.y + d.target.y) / 2);
  if (refs.gBadges) {
    refs.gBadges
      .attr('x', (d: any) => (refs.nodeMap.get(d.id)?.x || 0) + d.ox)
      .attr('y', (d: any) => (refs.nodeMap.get(d.id)?.y || 0) + d.oy);
  }
}

function scheduleGraphDomSync(minIntervalMs: number = 14): void {
  if (_graphTickRaf) return;
  _graphTickRaf = requestAnimationFrame((ts: number) => {
    _graphTickRaf = 0;
    if (minIntervalMs > 0 && ts - _graphLastSyncTs < minIntervalMs) return;
    _graphLastSyncTs = ts;
    syncGraphDom();
  });
}

function maybeStopStableGraphSimulation(sim: any): void {
  const alpha = sim.alpha?.() ?? 0;
  if (alpha > 0.045) {
    _graphStableTicks = 0;
    return;
  }
  let maxVelocity = 0;
  for (const n of _state.nodes as any[]) {
    const vx = Math.abs(n.vx || 0);
    const vy = Math.abs(n.vy || 0);
    if (vx > maxVelocity) maxVelocity = vx;
    if (vy > maxVelocity) maxVelocity = vy;
  }
  if (maxVelocity < 0.03) _graphStableTicks += 1;
  else _graphStableTicks = 0;
  if (_graphStableTicks < 10) return;
  _graphStableTicks = 0;
  sim.alphaTarget?.(0);
  sim.stop?.();
  syncGraphDom();
  document.getElementById('ld')?.classList.add('dn');
}

function graphProgressiveReveal(
  nodes: PersonNode[],
  links: LinkDatum[]
): { reveal: Set<string>; target: number; total: number } | null {
  if (nodes.length < PROGRESSIVE_THRESHOLD) return null;
  const { degree, ranked } = degreeRank(nodes, links);
  const adj = new Map<string, Set<string>>(nodes.map(n => [n.id, new Set()]));
  links.forEach(l => {
    const { s: hSrc, t: hTgt } = linkIds(l);
    adj.get(hSrc)?.add(hTgt);
    adj.get(hTgt)?.add(hSrc);
  });

  let target = Math.max(92, Math.min(220, Math.round(nodes.length * 0.5)));
  if (_state.density === 'compact') target = Math.max(80, target - 18);
  if (_state.density === 'presentation') target = Math.min(nodes.length, target + 20);
  const reveal = new Set<string>();

  const seeds: string[] = [];
  if (_state.selId && adj.has(_state.selId)) seeds.push(_state.selId);
  else if (_state.selEdge) {
    const { s: hSrc, t: hTgt } = linkIds(_state.selEdge);
    if (adj.has(hSrc)) seeds.push(hSrc);
    if (adj.has(hTgt)) seeds.push(hTgt);
  }
  ranked.slice(0, Math.max(14, Math.ceil(target * 0.16))).forEach(n => seeds.push(n.id));

  const q: Array<{ id: string; d: number }> = [];
  const seen = new Set<string>();
  seeds.forEach(id => {
    if (seen.has(id)) return;
    seen.add(id);
    q.push({ id, d: 0 });
  });
  while (q.length && reveal.size < target) {
    const cur = q.shift()!;
    reveal.add(cur.id);
    if (cur.d >= 2) continue;
    const next = [...(adj.get(cur.id) || [])]
      .sort((a, b) => (degree.get(b) || 0) - (degree.get(a) || 0));
    for (const id of next) {
      if (seen.has(id)) continue;
      seen.add(id);
      q.push({ id, d: cur.d + 1 });
      if (q.length > 1800) break;
    }
  }
  if (reveal.size < target) {
    ranked.forEach(n => {
      if (reveal.size >= target) return;
      reveal.add(n.id);
    });
  }
  return { reveal, target, total: nodes.length };
}

function deconflictY(rows: Array<{ y: number } & Record<string, unknown>>, minGap: number = 20): typeof rows {
  const out: typeof rows = [];
  let last = -Infinity;
  rows.forEach(r => {
    if (Math.abs(r.y - last) < minGap) return;
    out.push(r);
    last = r.y;
  });
  return out;
}

function estimateNodeWidth(d: PersonNode, dens: DensityProfile): number {
  const len = Math.min(_personName(d).length + (d.g === 'F' ? 2 : 0), dens.maxLabelChars);
  const pad = d.g === 'F' ? dens.padFemale : dens.padMale;
  return len * dens.treeCharW + pad * 2;
}

function reignSpan(n: PersonNode): string {
  const r = n.re;
  if (!r || !r.length) return '';
  const first = r[0]!;
  if (first.length === 2 && first[0] && first[1]) return `${first[0]}\u2013${first[1]}`;
  if (first.length >= 1 && first[0]) return `r.\u2009${first[0]}`;
  return '';
}

// ---------------------------------------------------------------------------
// Era overlays
// ---------------------------------------------------------------------------

function drawGraphEraOverlay(): void {
  if (!_state.svgEl || _state.W < 220 || _state.H < 160) return;
  const pad = 14;
  const width = Math.max(250, Math.min(430, _state.W - pad * 2));
  const height = 46;
  const x = pad;
  const y = Math.max(8, _state.H - height - 12);
  const sx = (_d3 as any).scaleLinear()
    .domain([_timeExtent.min, _timeExtent.max])
    .range([10, width - 10]);

  const transitions = _dynastyTransitions
    .filter(d => d.year >= _timeExtent.min && d.year <= _timeExtent.max)
    .slice()
    .sort((a, b) => a.year - b.year);
  const milestones = _eraMilestones
    .filter(d => d.year >= _timeExtent.min && d.year <= _timeExtent.max)
    .slice()
    .sort((a, b) => a.year - b.year);

  const svgEl = _state.svgEl as any;
  svgEl.selectAll('g.era-ov').remove();
  const g = svgEl.append('g')
    .attr('class', 'era-ov')
    .attr('transform', `translate(${x},${y})`)
    .attr('pointer-events', 'none');

  const clipId = 'eov-clip';
  const clip = g.append('clipPath').attr('id', clipId);
  clip.append('rect')
    .attr('width', width).attr('height', height)
    .attr('rx', 8).attr('ry', 8);

  g.append('rect')
    .attr('class', 'eov-bg')
    .attr('width', width).attr('height', height)
    .attr('rx', 8).attr('ry', 8);

  const gc = g.append('g').attr('clip-path', `url(#${clipId})`);

  gc.append('line')
    .attr('class', 'eov-axis')
    .attr('x1', 10).attr('x2', width - 10)
    .attr('y1', 24).attr('y2', 24);

  gc.selectAll('line.eov-ms')
    .data(milestones)
    .enter().append('line')
    .attr('class', 'eov-ms')
    .attr('x1', (d: any) => sx(d.year))
    .attr('x2', (d: any) => sx(d.year))
    .attr('y1', 19).attr('y2', 29);

  gc.selectAll('circle.eov-dot')
    .data(transitions)
    .enter().append('circle')
    .attr('class', 'eov-dot')
    .attr('cx', (d: any) => sx(d.year))
    .attr('cy', 24).attr('r', 2.6)
    .attr('fill', (d: any) => dynastyColor(d.dynasty));

  const cap = _state.eraEnabled && Number.isFinite(_state.eraYear)
    ? `${_state.eraYear}`
    : `${_t('all_eras')} ${_timeExtent.min}\u2013${_timeExtent.max}`;
  const capReserved = cap.length * 5.5 + 16;

  const charW = 5.2;
  const insetL = 10, insetR = 10;
  const labelled: Array<DynastyTransition & { _txt: string; _row: number; _cx: number }> = [];
  let lastEndTop = insetL, lastEndBot = insetL;
  for (const d of transitions) {
    const cx = sx(d.year);
    const txt = `${d.year} ${trimLabel(d.short || d.label, 12)}`;
    const halfW = (txt.length * charW) / 2;
    if (cx + halfW > width - capReserved) continue;
    const clampedCx = Math.max(insetL + halfW, Math.min(width - insetR - halfW, cx));
    const row = labelled.length % 2;
    const lastEnd = row === 0 ? lastEndTop : lastEndBot;
    if (clampedCx - halfW < lastEnd + 6) continue;
    labelled.push({ ...d, _txt: txt, _row: row, _cx: clampedCx });
    if (row === 0) lastEndTop = clampedCx + halfW;
    else lastEndBot = clampedCx + halfW;
  }
  gc.selectAll('text.eov-lbl')
    .data(labelled)
    .enter().append('text')
    .attr('class', 'eov-label')
    .attr('x', (d: any) => d._cx)
    .attr('y', (d: any) => d._row === 0 ? 12 : 42)
    .attr('text-anchor', 'middle')
    .text((d: any) => d._txt);

  gc.append('text')
    .attr('class', 'eov-year')
    .attr('x', width - 10).attr('y', 12)
    .attr('text-anchor', 'end')
    .text(cap);

  if (_state.eraEnabled && Number.isFinite(_state.eraYear)) {
    const xNow = sx(Math.max(_timeExtent.min, Math.min(_timeExtent.max, _state.eraYear as number)));
    const near = [...transitions, ...milestones]
      .slice()
      .sort((a, b) => Math.abs(a.year - (_state.eraYear as number)) - Math.abs(b.year - (_state.eraYear as number)))[0];
    gc.append('line')
      .attr('class', 'eov-now')
      .attr('x1', xNow).attr('x2', xNow)
      .attr('y1', 6).attr('y2', 40);
    if (near) {
      gc.append('text')
        .attr('class', 'eov-year')
        .attr('x', Math.min(width - 8, xNow + 8))
        .attr('y', 30)
        .attr('text-anchor', xNow > width - 110 ? 'end' : 'start')
        .text(trimLabel(near.short || near.label, 24));
    }
  }
}

function drawTreeEraAnnotations(g: any, yScale: (year: number) => number, minYear: number, maxYear: number, xExtent: number): void {
  const transitions = _dynastyTransitions
    .filter(d => d.year >= minYear && d.year <= maxYear)
    .map(d => ({
      ...d, kind: 'transition' as const,
      y: yScale(d.year),
      color: dynastyColor(d.dynasty)
    }));
  const milestones = _eraMilestones
    .filter(d => d.year >= minYear && d.year <= maxYear)
    .map(d => ({
      ...d, kind: (d.kind || 'milestone') as string,
      y: yScale(d.year),
      color: _cs('--bd2')
    }));
  const rows = deconflictY([...transitions, ...milestones].sort((a, b) => a.y - b.y), 20);
  const hasNow = _state.eraEnabled
    && Number.isFinite(_state.eraYear)
    && (_state.eraYear as number) >= minYear
    && (_state.eraYear as number) <= maxYear;
  const layer = g.selectAll('g.era-ann')
    .data(rows.length || hasNow ? [0] : [])
    .join('g')
    .attr('class', 'era-ann')
    .attr('pointer-events', 'none');
  if (layer.empty()) return;

  layer.selectAll('line.era-guide')
    .data(rows, (d: any) => `${d.kind}|${d.year}|${d.label || d.short || ''}`)
    .join('line')
    .attr('class', 'era-guide')
    .attr('x1', 20).attr('x2', xExtent)
    .attr('y1', (d: any) => d.y).attr('y2', (d: any) => d.y)
    .attr('stroke', (d: any) => d.color)
    .attr('stroke-opacity', (d: any) => d.kind === 'transition' ? 0.2 : 0.13)
    .attr('stroke-dasharray', (d: any) => d.kind === 'transition' ? '2,4' : '1,7');

  layer.selectAll('circle.era-dot')
    .data(rows.filter((r: any) => r.kind === 'transition'), (d: any) => `${d.year}|${d.label || d.short || ''}`)
    .join('circle')
    .attr('class', 'era-dot')
    .attr('cx', 24).attr('cy', (d: any) => d.y).attr('r', 2.4)
    .attr('fill', (d: any) => d.color);

  layer.selectAll('text.era-label')
    .data(rows, (d: any) => `${d.kind}|${d.year}|${d.label || d.short || ''}`)
    .join('text')
    .attr('class', 'era-label')
    .attr('x', 30).attr('y', (d: any) => d.y - 4)
    .attr('fill', (d: any) => d.kind === 'transition' ? d.color : _cs('--tx3'))
    .text((d: any) => `${d.year} \u00b7 ${trimLabel(d.short || d.label, 34)}`);

  layer.selectAll('line.era-now')
    .data(hasNow ? [yScale(_state.eraYear as number)] : [])
    .join('line')
    .attr('class', 'era-now')
    .attr('x1', 20).attr('x2', xExtent)
    .attr('y1', (d: any) => d).attr('y2', (d: any) => d)
    .attr('stroke', _cs('--ac'))
    .attr('stroke-width', 1.35).attr('stroke-opacity', 0.74);

  layer.selectAll('text.era-now-label')
    .data(hasNow ? [yScale(_state.eraYear as number)] : [])
    .join('text')
    .attr('class', 'era-now-label')
    .attr('x', 30).attr('y', (d: any) => d - 6)
    .text(`${_t('filter_year')}: ${_state.eraYear}`);
}

function drawTreeSectionDividers(g: any, sections: Section[], xExtent: number): void {
  const layer = g.selectAll('g.tree-sections')
    .data(sections.length ? [0] : [])
    .join('g')
    .attr('class', 'tree-sections')
    .attr('pointer-events', 'none');
  if (layer.empty()) return;

  layer.selectAll('line.tree-sec-line')
    .data(sections, (d: any) => `${d.label}|${d.y}|${d.dynasty || ''}`)
    .join('line')
    .attr('class', 'tree-sec-line')
    .attr('x1', 30).attr('x2', Math.max(xExtent, 400))
    .attr('y1', (d: any) => d.y - 12).attr('y2', (d: any) => d.y - 12)
    .attr('stroke', (d: any) => d.dynasty ? dynastyColor(d.dynasty) : _cs('--bd2'))
    .attr('stroke-opacity', 0.35)
    .attr('stroke-dasharray', '4,6');

  layer.selectAll('circle.tree-sec-dot')
    .data(sections, (d: any) => `${d.label}|${d.y}|${d.dynasty || ''}`)
    .join('circle')
    .attr('class', 'tree-sec-dot')
    .attr('cx', 22).attr('cy', (d: any) => d.y - 12).attr('r', 3)
    .attr('fill', (d: any) => d.dynasty ? dynastyColor(d.dynasty) : _cs('--bd2'))
    .attr('opacity', 0.6);

  layer.selectAll('text.tree-sec-label')
    .data(sections, (d: any) => `${d.label}|${d.y}|${d.dynasty || ''}`)
    .join('text')
    .attr('class', 'tree-sec-label')
    .attr('x', 34).attr('y', (d: any) => d.y - 18)
    .attr('font-family', 'var(--display, var(--sans))')
    .attr('font-size', 10)
    .attr('fill', (d: any) => d.dynasty ? dynastyColor(d.dynasty) : _cs('--bd2'))
    .attr('opacity', 0.7)
    .text((d: any) => `${d.label}${d.count > 1 ? ` (${d.count})` : ''}`);
}

// ---------------------------------------------------------------------------
// Node rendering
// ---------------------------------------------------------------------------

function drawNodes(g: any, withDrag: boolean = false): void {
  const dens = densityProfile();
  const d3 = _d3 as any;
  const nodeSel = g.selectAll('g.node')
    .data(_state.nodes, (d: any) => d.id)
    .join(
      (enter: any) => {
        const gn = enter.append('g').attr('class', 'node');
        gn.append('rect').attr('class', 'node-body');
        gn.append('rect').attr('class', 'node-accent').attr('width', 3);
        gn.append('text').attr('class', 'node-name');
        return gn;
      },
      (update: any) => update,
      (exit: any) => exit.remove()
    )
    .attr('cursor', 'pointer')
    .attr('data-pr', '1')
    .attr('tabindex', 0).attr('role', 'button')
    .attr('aria-label', (d: any) => `${_t('open_profile_for')} ${_personName(d)}`);
  _state.gN = nodeSel;

  if (withDrag) {
    (_state.gN as any).call(d3.drag()
      .on('start', (e: any, d: any) => {
        d.__dragMoved = false;
        d.__dragStartX = e.x;
        d.__dragStartY = e.y;
        if (!e.active) (_state.sim as any).alphaTarget(.2).restart();
        d.fx = d.x; d.fy = d.y;
      })
      .on('drag', (e: any, d: any) => {
        const dx = Math.abs(e.x - d.__dragStartX);
        const dy = Math.abs(e.y - d.__dragStartY);
        if (dx > 3 || dy > 3) d.__dragMoved = true;
        d.fx = e.x; d.fy = e.y;
      })
      .on('end', (e: any, d: any) => {
        if (d.__dragMoved) d.__dragEndedAt = Date.now();
        if (!e.active) (_state.sim as any).alphaTarget(0);
        d.fx = null; d.fy = null;
      }));
  } else {
    (_state.gN as any).on('.drag', null);
  }
  const gN = _state.gN as any;
  gN.select('rect.node-body')
    .attr('rx', (d: any) => d.g === 'F' ? 12 : 4).attr('ry', (d: any) => d.g === 'F' ? 12 : 4)
    .attr('fill', _cs('--nf')).attr('stroke', (d: any) => _nC(d.dy)).attr('stroke-width', (d: any) => d.g === 'F' ? 2.2 : 1.5)
    .attr('filter', 'url(#nodeShadow)');
  gN.select('rect.node-accent')
    .attr('rx', (d: any) => d.g === 'F' ? 12 : 4).attr('ry', (d: any) => d.g === 'F' ? 12 : 4)
    .attr('fill', (d: any) => _nC(d.dy)).attr('opacity', 0.85)
    .attr('width', 3);
  gN.select('text.node-name')
    .attr('text-anchor', 'middle').attr('dy', '.35em').attr('font-size', dens.text)
    .attr('font-family', 'var(--sans)').attr('fill', _cs('--nt')).attr('font-weight', 500)
    .text((d: any) => (d.g === 'F' ? '\u2640 ' : '') + trimLabel(_personName(d), dens.maxLabelChars));

  _state._badgeData = [];
  gN.each(function (this: SVGElement, d: any) {
    const sel = d3.select(this);
    const tEl = sel.select('text.node-name');
    const label = (d.g === 'F' ? '\u2640 ' : '') + trimLabel(_personName(d), dens.maxLabelChars);
    const bb = cachedBBox(tEl.node(), label, dens.text);
    const p = d.g === 'F' ? dens.padFemale : dens.padMale;
    const w = bb.width + p * 2;
    const h = bb.height + 10;
    sel.select('rect.node-body').attr('x', bb.x - p).attr('y', bb.y - 5).attr('width', w).attr('height', h);
    sel.select('.node-accent').attr('x', bb.x - p).attr('y', bb.y - 5).attr('height', h);
    d._hw = w / 2; d._hh = h / 2;
    if ((d.n || []).length > 0) {
      _state._badgeData.push({
        id: d.id, n: d.n[0], dy: d.dy,
        ox: bb.x + bb.width + p - 2,
        oy: bb.y - 1
      });
    }
  });
}

// ---------------------------------------------------------------------------
// Interaction binding
// ---------------------------------------------------------------------------

function restoreSelectionHighlight(): void {
  if (_state.selId) {
    const exists = _state.nodes.some(n => n.id === _state.selId);
    if (exists) _hiN(_state.selId);
    else _state.selId = null;
  }
  if (!_state.selId && _state.selEdge) {
    const edgeIdx = ((_state as any)._edgeBySelectionKey as Map<string, LinkDatum> | undefined);
    const match = edgeIdx?.get(edgeSelectionKey(_state.selEdge!))
      || _state.links.find(l => sameLink(l, _state.selEdge!));
    if (match) {
      _state.selEdge = match;
      _hiE(match);
    } else {
      _state.selEdge = null;
    }
  }
  if (!_state.selId && !_state.selEdge) _clH();
}

function bindLinkInteractions(sel: any, tooltip: HTMLElement | null): void {
  if (!sel || !tooltip) return;
  const nodeById = ((_state as any)._nodeById as Map<string, PersonNode> | undefined)
    || new Map<string, PersonNode>(_state.nodes.map(n => [n.id, n]));
  const nm = (id: string) => _personName(nodeById.get(id) || id);
  sel
    .attr('tabindex', 0).attr('role', 'button')
    .attr('aria-label', (d: any) => {
      const e = d._e || {};
      const { s: hSrc, t: hTgt } = linkIds(d);
      return `${relationTypeLabel(e.t || 'kin')}: ${nm(hSrc)} \u2192 ${nm(hTgt)}`;
    });
  sel
    .on('mouseenter', (ev: MouseEvent, d: any) => {
      const e = d._e || {};
      const { s: hSrc, t: hTgt } = linkIds(d);
      tooltip.innerHTML = `<b>${_esc(relationTypeLabel(e.t || 'kin'))}</b><div class="ts">${_esc(nm(hSrc))} \u2192 ${_esc(nm(hTgt))} \u00b7 ${_esc(confidenceLabel(e.c || 'u'))}${e.confidence_grade ? ` \u00b7 ${_esc(_t('confidence_grade'))} ${_esc(e.confidence_grade)}` : ''}${e.l ? ` \u00b7 ${_esc(e.l)}` : ''}</div>`;
      tooltip.classList.add('sh');
    })
    .on('mousemove', (ev: MouseEvent) => {
      tooltip.style.left = (ev.clientX + 12) + 'px';
      tooltip.style.top = (ev.clientY + 12) + 'px';
    })
    .on('mouseleave', () => tooltip.classList.remove('sh'))
    .on('click', (ev: MouseEvent, d: any) => {
      ev.stopPropagation();
      _state.selId = null;
      _state.selEdge = d;
      _hiE(d);
      _showLinkDetail(d);
      if (!_state.sidebarOpen) window.dispatchEvent(new CustomEvent('request-sidebar-open'));
    })
    .on('keydown', (ev: KeyboardEvent, d: any) => {
      if (ev.key !== 'Enter' && ev.key !== ' ') return;
      ev.preventDefault();
      ev.stopPropagation();
      _state.selId = null;
      _state.selEdge = d;
      _hiE(d);
      _showLinkDetail(d);
      if (!_state.sidebarOpen) window.dispatchEvent(new CustomEvent('request-sidebar-open'));
    });
}

// ---------------------------------------------------------------------------
// Graph mode
// ---------------------------------------------------------------------------

function renderGraph(g: any): void {
  const d3 = _d3 as any;
  const dens = densityProfile();
  const base = 0.68;
  const nodeById = new Map(_state.nodes.map(n => [n.id, n]));
  const progressive = graphProgressiveReveal(_state.nodes, _state.links);
  const showEdge = (d: any) => {
    if (!progressive) return true;
    const { s: hSrc, t: hTgt } = linkIds(d);
    return progressive.reveal.has(hSrc) && progressive.reveal.has(hTgt);
  };
  const edgeBaseOpacity = (d: any) => {
    const o = edgeOpacity(d._e, base);
    if (!progressive) return o;
    return showEdge(d) ? o : Math.min(0.07, o * 0.14);
  };
  const linkLayer = ensureLayer(g, 'graph-links');
  const labelLayer = g.selectAll('g.graph-edge-labels').data([0]).join('g').attr('class', 'elg graph-edge-labels');
  const nodeLayer = ensureLayer(g, 'graph-nodes');
  const badgeLayer = g.selectAll('g.graph-badges').data([0]).join('g').attr('class', 'badge-layer graph-badges');

  _state.gL = linkLayer.selectAll('line.graph-link')
    .data(_state.links, (d: any) => linkKey(d))
    .join('line')
    .attr('class', 'graph-link')
    .attr('stroke', (d: any) => edgeStrokeColor(d._e))
    .attr('stroke-width', (d: any) => edgeWidth(d._e, 2.2, 1.5))
    .attr('stroke-dasharray', (d: any) => edgeDashArray(d._e))
    .attr('stroke-opacity', (d: any) => edgeBaseOpacity(d))
    .attr('data-bo', (d: any) => edgeBaseOpacity(d))
    .attr('pointer-events', 'stroke')
    .attr('stroke-linecap', 'round')
    .style('cursor', 'pointer')
    .style('display', (d: any) => showEdge(d) ? null : 'none')
    .attr('marker-end', (d: any) => {
      if (d._e.t !== 'parent' || d._e.c !== 'c') return '';
      const sid = typeof d.source === 'object' ? d.source.id : d.source;
      const sn = nodeById.get(sid);
      const dy = (sn?.dy || 'default').toLowerCase();
      return `url(#ar-${dy})`;
    });

  // Hit-area interactions bound directly on gL (no duplicate gLH layer)
  _state.gLH = _state.gL;

  const lE = _state.links.filter((d: any) => d._e.l && (d._e.t !== 'parent' || d._e.c !== 'c'));
  const edgeLabelSel = labelLayer.selectAll('text')
    .data(lE, (d: any) => linkKey(d))
    .join('text')
    .attr('text-anchor', 'middle').attr('dy', -3).attr('font-size', 7.5)
    .attr('font-family', 'var(--mono)').attr('fill', (d: any) => edgeStrokeColor(d._e)).attr('opacity', (d: any) => showEdge(d) ? .62 : 0)
    .text((d: any) => d._e.l);

  drawNodes(nodeLayer, true);

  const badgeData = _state._badgeData || [];
  if (badgeData.length) {
    _state.gBadges = badgeLayer
      .selectAll('text')
      .data(badgeData, (d: any) => `${d.id}|${d.n}`)
      .join('text')
      .attr('class', 'node-badge').attr('text-anchor', 'end')
      .attr('font-size', 8.5).attr('font-family', 'var(--mono)')
      .attr('fill', (d: any) => _nC(d.dy)).attr('opacity', 0.8)
      .text((d: any) => '#' + d.n);
  } else {
    badgeLayer.selectAll('*').remove();
    _state.gBadges = null;
  }

  if (progressive) {
    const gN = _state.gN as any;
    gN.attr('data-pr', (d: any) => progressive.reveal.has(d.id) ? '1' : '0');
    gN.select('rect.node-body').attr('opacity', function (this: any) {
      return this.parentNode?.getAttribute('data-pr') === '1' ? 1 : 0.23;
    });
    gN.select('text.node-name').attr('opacity', function (this: any) {
      return this.parentNode?.getAttribute('data-pr') === '1' ? 1 : 0.24;
    });
    const st = document.getElementById('st');
    if (st) st.textContent += ` \u00b7 reveal ${progressive.reveal.size}/${progressive.total}`;
  } else {
    (_state.gN as any).attr('data-pr', '1');
    (_state.gN as any).select('rect.node-body').attr('opacity', 1);
    (_state.gN as any).select('text.node-name').attr('opacity', 1);
  }

  const nodeMap = nodeById;
  const simAlpha = (_state as any)._warmStart ? 0.3 : 1;
  _graphRenderRefs = {
    gL: _state.gL as any,
    gN: _state.gN as any,
    edgeLabelSel,
    gBadges: _state.gBadges as any,
    nodeMap
  };

  let sim = _state.sim as any;
  if (!sim) {
    sim = d3.forceSimulation(_state.nodes)
      .on('tick', () => {
        scheduleGraphDomSync(14);
        maybeStopStableGraphSimulation(sim);
      })
      .on('end', () => document.getElementById('ld')?.classList.add('dn'));
    _state.sim = sim;
  }

  sim.nodes(_state.nodes);
  const linkForce = sim.force('link');
  if (linkForce) {
    linkForce
      .id((d: any) => d.id)
      .links(_state.links)
      .distance(dens.forceDistance)
      .strength(0.3);
  } else {
    sim.force('link', d3.forceLink(_state.links).id((d: any) => d.id).distance(dens.forceDistance).strength(0.3));
  }
  sim.force('charge', d3.forceManyBody().strength(dens.forceCharge));
  sim.force('center', d3.forceCenter(_state.W / 2, _state.H / 2));
  sim.force('collide', d3.forceCollide((d: any) => (d._hw || dens.forceCollide) + 6).strength(0.85).iterations(1));
  sim.force('x', d3.forceX(_state.W / 2).strength(dens.forceStrength));
  sim.force('y', d3.forceY(_state.H / 2).strength(dens.forceStrength));
  _graphStableTicks = 0;
  sim
    .alpha(simAlpha)
    .alphaDecay(0.05)
    .restart();
  syncGraphDom();
}

// ---------------------------------------------------------------------------
// Tree mode
// ---------------------------------------------------------------------------

function renderTree(g: any): void {
  const d3 = _d3 as any;
  const dens = densityProfile();
  const byId = new Map(_state.nodes.map(n => [n.id, n]));
  const pLinks = _state.links.filter(l => l._e.t === 'parent');
  const rankC = (c: string) => c === 'c' ? 0 : c === 'i' ? 1 : 2;
  const sy = (id: string) => (byId.get(id)?.re?.[0]?.[0]) ?? 9999;
  const parentByChild = new Map<string, { p: string; e: EdgeRecord }>();
  pLinks.forEach(l => {
    const s = typeof l.source === 'object' ? l.source.id : l.source;
    const dId = typeof l.target === 'object' ? l.target.id : l.target;
    const cur = parentByChild.get(dId);
    if (!cur) { parentByChild.set(dId, { p: s, e: l._e }); return; }
    const better = rankC(l._e.c) < rankC(cur.e.c) || (rankC(l._e.c) === rankC(cur.e.c) && sy(s) < sy(cur.p));
    if (better) parentByChild.set(dId, { p: s, e: l._e });
  });

  let pos = new Map<string, { x: number; y: number; depth: number }>();
  let depthMap = new Map<string, number>();
  let sections: Section[] = [];
  let yOffset = 60;
  let treeMinYear = 1100;
  let treePxPerYear = 3;
  let treeBaseY = yOffset;
  let treeMaxColX = 80;
  const placementKey = treePlacementCacheKey(_state.nodes, _state.links, dens, _state.lang);
  const workerPlacement = _treePlacementWorkerCache.get(placementKey) || null;
  const cachedPlacement = _treePlacementCache?.key === placementKey
    ? _treePlacementCache.value
    : workerPlacement;
  if (cachedPlacement) {
    pos = cachedPlacement.pos;
    depthMap = cachedPlacement.depthMap;
    sections = cachedPlacement.sections;
    yOffset = cachedPlacement.yOffset;
    treeMinYear = cachedPlacement.treeMinYear;
    treePxPerYear = cachedPlacement.treePxPerYear;
    treeBaseY = cachedPlacement.treeBaseY;
    treeMaxColX = cachedPlacement.treeMaxColX;
    if (_treePlacementCache?.key !== placementKey) {
      _treePlacementCache = { key: placementKey, value: cachedPlacement };
    }
  } else {
    const input = toTreePlacementInput(_state.nodes, _state.links, dens);
    queueTreePlacementWorker(placementKey, input);
    const computed = toTreePlacementValue(_computeTreePlacement(input));
    pos = computed.pos;
    depthMap = computed.depthMap;
    sections = computed.sections;
    yOffset = computed.yOffset;
    treeMinYear = computed.treeMinYear;
    treePxPerYear = computed.treePxPerYear;
    treeBaseY = computed.treeBaseY;
    treeMaxColX = computed.treeMaxColX;
    _treePlacementCache = { key: placementKey, value: computed };
  }

  // Apply positions
  _state.nodes.forEach(n => {
    const p = pos.get(n.id);
    (n as any).x = p ? p.x : 80;
    (n as any).y = p ? p.y : yOffset;
  });

  // Edge construction
  const fullByChild = new Map<string, Array<{ s: string; e: EdgeRecord }>>();
  pLinks.forEach(l => {
    const s = typeof l.source === 'object' ? l.source.id : l.source;
    const dId = typeof l.target === 'object' ? l.target.id : l.target;
    const arr = fullByChild.get(dId) || [];
    arr.push({ s, e: l._e });
    fullByChild.set(dId, arr);
  });
  const extraParents: LinkDatum[] = [];
  fullByChild.forEach((arr, dId) => {
    const primary = parentByChild.get(dId)?.p;
    arr.forEach(a => { if (a.s !== primary) extraParents.push({ source: a.s, target: dId, _e: a.e }); });
  });
  const eMap = new Map(_state.links.map(l => [`${typeof l.source === 'object' ? l.source.id : l.source}|${typeof l.target === 'object' ? l.target.id : l.target}|${l._e.t}`, l]));
  const primParent = [...parentByChild.entries()].map(([dId, v]) => eMap.get(`${v.p}|${dId}|parent`) || { source: v.p, target: dId, _e: v.e });
  const spouses = _state.links.filter(l => l._e.t === 'spouse');
  const other = _state.links.filter(l => l._e.t === 'kin' || l._e.t === 'sibling');
  const drawLinks = [...primParent, ...spouses, ...other, ...extraParents];
  const extraSet = new Set(extraParents);

  const linkPath = (d: any) => {
    const sid = typeof d.source === 'object' ? d.source.id : d.source;
    const tid = typeof d.target === 'object' ? d.target.id : d.target;
    const sNode = byId.get(sid), tNode = byId.get(tid);
    if (!sNode || !tNode) return '';
    if (d._e.t === 'spouse') {
      const lift = Math.sign(((tNode as any).x || 0) - ((sNode as any).x || 0)) * 10;
      return `M${(sNode as any).x},${(sNode as any).y} Q${((sNode as any).x + (tNode as any).x) / 2},${((sNode as any).y + (tNode as any).y) / 2 - 8 - lift} ${(tNode as any).x},${(tNode as any).y}`;
    }
    const seed = `${sid}|${tid}`;
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = ((h << 5) - h) + seed.charCodeAt(i);
    const wobble = ((h % 21) - 10) * 2.2;
    const lateralBend = ((h % 13) - 6) * 1.4;
    const c1x = (sNode as any).x + lateralBend;
    const c1y = (sNode as any).y + ((tNode as any).y - (sNode as any).y) * 0.35;
    const c2x = (tNode as any).x + wobble * 0.3;
    const c2y = (sNode as any).y + ((tNode as any).y - (sNode as any).y) * 0.75;
    return `M${(sNode as any).x},${(sNode as any).y} C${c1x},${c1y} ${c2x},${c2y} ${(tNode as any).x},${(tNode as any).y}`;
  };

  const baseOpacityFn = (d: any) => {
    const raw = (d._e.t === 'kin' || d._e.t === 'sibling') ? .24 : .84;
    return edgeOpacity(d._e, raw);
  };

  const treeEdgeWidth = (d: any) => {
    const sid = typeof d.source === 'object' ? d.source.id : d.source;
    const sourceDepth = depthMap.get(sid) ?? 0;
    const depthW = Math.max(1.6, 3.2 - sourceDepth * 0.6);
    if (d._e.t !== 'parent') return edgeWidth(d._e, 1.4, 1.4);
    return edgeWidth(d._e, depthW, depthW);
  };

  const xExtent = d3.max(_state.nodes, (n: any) => n.x) ?? _state.W;
  const sectionLayer = ensureLayer(g, 'tree-sections-root');
  drawTreeSectionDividers(sectionLayer, sections, xExtent);

  const linkLayer = ensureLayer(g, 'tree-links');
  const nodeLayer = ensureLayer(g, 'tree-nodes');
  const badgeLayer = g.selectAll('g.tree-badges').data([0]).join('g').attr('class', 'badge-layer tree-badges');
  const treeLinkKey = (d: any) => `${linkKey(d)}|${d._e.c || ''}|${d._e.l || ''}|${d._e.confidence_grade || ''}`;
  _state.gL = linkLayer.selectAll('path.tree-link')
    .data(drawLinks, treeLinkKey)
    .join('path')
    .attr('class', 'tree-link')
    .attr('fill', 'none')
    .attr('stroke', (d: any) => edgeStrokeColor(d._e))
    .attr('stroke-width', (d: any) => treeEdgeWidth(d))
    .attr('stroke-linecap', 'round')
    .attr('stroke-dasharray', (d: any) => edgeDashArray(d._e, d._e.t === 'parent' && extraSet.has(d)))
    .attr('stroke-opacity', (d: any) => baseOpacityFn(d))
    .attr('data-bo', (d: any) => baseOpacityFn(d))
    .attr('pointer-events', 'stroke')
    .style('cursor', 'pointer')
    .attr('d', (d: any) => linkPath(d));

  _state.gLH = _state.gL;

  drawNodes(nodeLayer, false);
  const gN = _state.gN as any;
  gN.selectAll('text.node-reign-label')
    .data((d: any) => {
      const span = reignSpan(d);
      return span ? [span] : [];
    })
    .join('text')
    .attr('class', 'node-reign-label')
    .attr('text-anchor', 'middle').attr('dy', '1.8em')
    .attr('font-size', dens.text - 2.5)
    .attr('font-family', 'var(--mono)').attr('fill', _cs('--tx3'))
    .attr('opacity', 0.7)
    .text((d: any) => d);
  gN.each(function (this: any, d: any) {
    const hasReign = !!reignSpan(d);
    const rect = d3.select(this).select('rect.node-body');
    const baseHeight = parseFloat(rect.attr('height'));
    if (!Number.isFinite(baseHeight)) return;
    const extra = hasReign ? dens.text - 1 : 0;
    rect.attr('height', baseHeight + extra);
    const accent = d3.select(this).select('.node-accent');
    if (!accent.empty()) accent.attr('height', baseHeight + extra);
    d._hh = (baseHeight + extra) / 2;
  });
  gN.attr('transform', (d: any) => `translate(${d.x},${d.y})`);

  const badgeData = _state._badgeData || [];
  if (badgeData.length) {
    _state.gBadges = badgeLayer
      .selectAll('text')
      .data(badgeData, (d: any) => `${d.id}|${d.n}`)
      .join('text')
      .attr('class', 'node-badge').attr('text-anchor', 'end')
      .attr('font-size', 8.5).attr('font-family', 'var(--mono)')
      .attr('fill', (d: any) => _nC(d.dy)).attr('opacity', 0.8)
      .text((d: any) => '#' + d.n);
    (_state.gBadges as any)
      .attr('x', (d: any) => (byId.get(d.id)?.x || 0) + d.ox)
      .attr('y', (d: any) => (byId.get(d.id)?.y || 0) + d.oy);
  } else {
    badgeLayer.selectAll('*').remove();
    _state.gBadges = null;
  }

  // Zoom-to-fit
  requestAnimationFrame(() => {
    const gNode = document.querySelector('#sv .gg');
    if (!gNode) return;
    const bb = (gNode as SVGGraphicsElement).getBBox();
    if (!Number.isFinite(bb.width) || !Number.isFinite(bb.height) || bb.width <= 0 || bb.height <= 0) return;
    const m = 28;
    const sxScale = (_state.W - m * 2) / bb.width;
    const scy = (_state.H - m * 2) / bb.height;
    const k = Math.max(0.02, Math.min(4, Math.min(sxScale, scy)));
    const tx = (_state.W - bb.width * k) / 2 - bb.x * k;
    const ty = (_state.H - bb.height * k) / 2 - bb.y * k;
    const tf = (_d3 as any).zoomIdentity.translate(tx, ty).scale(k);
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    (_state.svgEl as any).transition().duration(reduceMotion ? 0 : 500).call((_state.zoomBehavior as any).transform, tf);
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

// Track last era person set for lightweight era-only updates
let _lastEraPersonIds: Set<string> | null = null;

/**
 * Check if the visible person set changed for era-only updates.
 * Returns true if a full rebuild is needed, false if nothing changed.
 */
export function updateEraVisibility(eraPersonOk: Set<string>): boolean {
  if (!_lastEraPersonIds) return true;
  if (_lastEraPersonIds.size !== eraPersonOk.size) return true;
  for (const id of eraPersonOk) {
    if (!_lastEraPersonIds.has(id)) return true;
  }
  return false;
}

export function rebuild(): void {
  // Save previous node positions for warm-start
  const prevPositions = new Map<string, { x: number; y: number; vx: number; vy: number }>();
  if (_state.nodes) {
    _state.nodes.forEach((n: any) => {
      if (Number.isFinite(n.x) && Number.isFinite(n.y)) {
        prevPositions.set(n.id, { x: n.x, y: n.y, vx: n.vx || 0, vy: n.vy || 0 });
      }
    });
  }

  const prevNodeById = new Map<string, PersonNode>((_state.nodes || []).map((n: any) => [n.id, n]));
  const prevLinkByKey = new Map<string, LinkDatum>();
  (_state.links || []).forEach((l: any) => {
    const sid = typeof l.source === 'object' ? l.source.id : l.source;
    const tid = typeof l.target === 'object' ? l.target.id : l.target;
    const key = `${sid}|${tid}|${l._e?.t || 'kin'}|${l._e?.c || ''}|${l._e?.confidence_grade || ''}|${l._e?.l || ''}`;
    prevLinkByKey.set(key, l);
  });

  const data = _filt();
  _state.nodes = data.nodes.map(p => {
    const prev = prevNodeById.get(p.id);
    if (!prev) return { ...p };
    Object.assign(prev, p);
    return prev;
  });
  _state.links = data.links.map(e => {
    const key = `${e.s}|${e.d}|${e.t}|${e.c}|${e.confidence_grade || ''}|${e.l || ''}`;
    const prev = prevLinkByKey.get(key);
    if (prev) {
      prev.source = e.s;
      prev.target = e.d;
      prev._e = e;
      return prev;
    }
    return { source: e.s, target: e.d, _e: e };
  });

  // Restore positions for surviving nodes (warm-start)
  let survivorCount = 0;
  if (prevPositions.size > 0) {
    _state.nodes.forEach((n: any) => {
      const prev = prevPositions.get(n.id);
      if (prev) {
        n.x = prev.x; n.y = prev.y;
        n.vx = prev.vx; n.vy = prev.vy;
        survivorCount++;
      }
    });
  }
  (_state as any)._warmStart = prevPositions.size > 0 && survivorCount > _state.nodes.length * 0.5;

  const nodeById = new Map<string, PersonNode>(_state.nodes.map(n => [n.id, n]));
  (_state as any)._nodeById = nodeById;

  // Build adjacency maps for O(1) highlight lookups
  const makeAdjMap = () => new Map<string, Set<string>>(_state.nodes.map(n => [n.id, new Set()]));
  const adj = makeAdjMap();
  const adjByType = new Map<string, Map<string, Set<string>>>();
  const edgeBySelection = new Map<string, LinkDatum>();
  _state.links.forEach(l => {
    const sid = typeof l.source === 'object' ? l.source.id : l.source;
    const tid = typeof l.target === 'object' ? l.target.id : l.target;
    adj.get(sid)?.add(tid);
    adj.get(tid)?.add(sid);
    const relType = l._e?.t || 'kin';
    let typed = adjByType.get(relType);
    if (!typed) {
      typed = makeAdjMap();
      adjByType.set(relType, typed);
    }
    typed.get(sid)?.add(tid);
    typed.get(tid)?.add(sid);
    edgeBySelection.set(edgeSelectionKey(l), l);
  });
  _state._adj = adj;
  (_state as any)._adjByType = adjByType;
  (_state as any)._edgeBySelectionKey = edgeBySelection;

  // Build parent-by-child map for ancestral flow
  const pbc = new Map<string, string[]>();
  _state.links.forEach(l => {
    if (l._e.t !== 'parent') return;
    const sid = typeof l.source === 'object' ? l.source.id : l.source;
    const tid = typeof l.target === 'object' ? l.target.id : l.target;
    const arr = pbc.get(tid) ?? [];
    arr.push(sid);
    pbc.set(tid, arr);
  });
  _state._parentByChild = pbc;

  // Update era person set tracking
  _lastEraPersonIds = new Set(_state.nodes.map(n => n.id));

  const mode = _state.viewMode === 'tree' ? _t('tree') : _t('graph');
  const stat: (string | number)[] = [_state.nodes.length, _state.links.length, mode];
  if (_state.eraEnabled && Number.isFinite(_state.eraYear)) stat.push(`${_t('year_word')}: ${_state.eraYear}`);
  if (_state.focusMode) stat.push(_t('focus'));
  if (_state.overlayMode === 'confidence') stat.push(_t('overlay_confidence'));
  if (_state.overlayMode === 'source') stat.push(_t('overlay_source'));
  const stEl = document.getElementById('st');
  if (stEl) stEl.textContent = stat.join(' \u00b7 ');

  const area = document.getElementById('ga');
  if (area) {
    _state.W = area.clientWidth;
    _state.H = area.clientHeight;
  }
  const d3 = _d3 as any;
  _state.svgEl = d3.select('#sv');

  // Persistent scaffolding: create defs, gg, and zoom binding only once
  if (!(_state as any)._svgScaffold) {
    (_state.svgEl as any).selectAll('*').remove();
    const defs = (_state.svgEl as any).append('defs').attr('class', 'persistent-defs');
    const dropFilter = defs.append('filter').attr('id', 'nodeShadow').attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
    dropFilter.append('feDropShadow').attr('dx', 0).attr('dy', 2).attr('stdDeviation', 3).attr('flood-color', 'rgba(0,0,0,0.25)').attr('flood-opacity', 0.4);
    defs.append('marker').attr('id', 'ar-default').attr('viewBox', '0 0 10 10').attr('refX', 10).attr('refY', 5)
      .attr('markerWidth', 5).attr('markerHeight', 5).attr('orient', 'auto-start-reverse')
      .append('path').attr('d', 'M0 0L10 5L0 10z').attr('fill', _cs('--ep'));
    const ggGroup = (_state.svgEl as any).append('g').attr('class', 'gg');
    (_state.svgEl as any).call(_state.zoomBehavior);
    (_state as any)._svgScaffold = { defs, ggGroup };
  }

  // Update dynasty markers (only add new ones)
  const defs = (_state as any)._svgScaffold.defs;
  const seenDy = new Set<string>();
  defs.selectAll("marker[id^='ar-']").each(function (this: any) {
    const id = d3.select(this).attr('id');
    if (id && id !== 'ar-default') seenDy.add(id.replace('ar-', ''));
  });
  _state.nodes.forEach(n => {
    const dy = (n.dy || 'unknown').toLowerCase();
    if (seenDy.has(dy)) return;
    seenDy.add(dy);
    defs.append('marker').attr('id', `ar-${dy}`).attr('viewBox', '0 0 10 10').attr('refX', 10).attr('refY', 5)
      .attr('markerWidth', 5).attr('markerHeight', 5).attr('orient', 'auto-start-reverse')
      .append('path').attr('d', 'M0 0L10 5L0 10z').attr('fill', dynastyColor(dy));
  });

  // Persistent mode roots: graph and tree are updated incrementally via keyed joins
  const g = (_state as any)._svgScaffold.ggGroup;
  const graphRoot = ensureLayer(g, 'mode-graph');
  const treeRoot = ensureLayer(g, 'mode-tree');

  if (_state.viewMode !== 'tree') {
    const prewarmDens = densityProfile();
    const prewarmKey = treePlacementCacheKey(_state.nodes, _state.links, prewarmDens, _state.lang);
    if (_treePlacementCache?.key !== prewarmKey && !_treePlacementWorkerCache.has(prewarmKey)) {
      queueTreePlacementWorker(prewarmKey, toTreePlacementInput(_state.nodes, _state.links, prewarmDens));
    }
  }

  if (_state.viewMode === 'tree') {
    graphRoot.style('display', 'none');
    treeRoot.style('display', null);
    (_state.svgEl as any).call((_state.zoomBehavior as any).transform, d3.zoomIdentity);
  } else if (_state.tr !== d3.zoomIdentity) {
    treeRoot.style('display', 'none');
    graphRoot.style('display', null);
    (_state.svgEl as any).call((_state.zoomBehavior as any).transform, _state.tr);
  } else {
    treeRoot.style('display', 'none');
    graphRoot.style('display', null);
  }

  if (_state.viewMode === 'tree' && _state.sim) {
    (_state.sim as any).stop();
    _state.sim = null;
  }
  if (_state.viewMode !== 'graph') {
    _graphRenderRefs = null;
    _graphStableTicks = 0;
    if (_graphTickRaf) {
      cancelAnimationFrame(_graphTickRaf);
      _graphTickRaf = 0;
    }
  }
  _state.gLH = null;
  _state.gBadges = null;
  if (_state.viewMode === 'tree') {
    renderTree(treeRoot);
    (_state.svgEl as any).selectAll('g.era-ov').remove();
  } else {
    renderGraph(graphRoot);
    // Defer era overlay to avoid blocking initial render
    setTimeout(() => drawGraphEraOverlay(), 0);
  }

  const tooltip = document.getElementById('tt');
  bindLinkInteractions(_state.gLH, tooltip);
  const gN = _state.gN as any;
  gN.on('mouseenter', (ev: MouseEvent, d: any) => { _showNodeHoverCard(ev, d); })
    .on('mousemove', (ev: MouseEvent) => { _moveHoverCard(ev); })
    .on('mouseleave', () => _hideHoverCard());

  gN.on('click', (ev: MouseEvent, d: any) => {
    if (d.__dragEndedAt && Date.now() - d.__dragEndedAt < 140) return;
    ev.stopPropagation();
    _state.selId = d.id;
    _state.selEdge = null;
    _showD(d.id);
    _hiN(d.id);
    if (!_state.sidebarOpen) window.dispatchEvent(new CustomEvent('request-sidebar-open'));
  });
  gN.on('keydown', (ev: KeyboardEvent, d: any) => {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    ev.preventDefault();
    ev.stopPropagation();
    _state.selId = d.id;
    _state.selEdge = null;
    _showD(d.id);
    _hiN(d.id);
    if (!_state.sidebarOpen) window.dispatchEvent(new CustomEvent('request-sidebar-open'));
  });
  (_state.svgEl as any).on('click', () => {
    _state.selId = null;
    _state.selEdge = null;
    _clH();
    window.dispatchEvent(new CustomEvent('selection-changed', { detail: { type: 'none' } }));
  });
  restoreSelectionHighlight();
  if (!_state.loaderHidden) {
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const delay = reduceMotion ? 0 : 1400;
    setTimeout(() => {
      document.getElementById('ld')?.classList.add('dn');
      _state.loaderHidden = true;
    }, delay);
  }
}

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------

export interface RebuildDeps {
  state: AppState;
  d3: D3Like;
  filt: () => { nodes: PersonNode[]; links: EdgeRecord[] };
  hiN: (id: string) => void;
  hiE: (link: LinkDatum) => void;
  clH: () => void;
  showD: (id: string) => void;
  showLinkDetail: (link: LinkDatum) => void;
  cs: (key: string) => string;
  eC: (e: EdgeRecord) => string;
  nC: (dy: string | undefined) => string;
  fR: (re: Array<[number, number?]>) => string;
  esc: (s: string) => string;
  personName: (p: PersonNode | string) => string;
  relationLabel: (t: string) => string;
  t: (key: string) => string;
  showNodeHoverCard: (ev: MouseEvent, d: PersonNode) => void;
  moveHoverCard: (ev: MouseEvent) => void;
  hideHoverCard: () => void;
  computeTreePlacement: (input: TreePlacementInput) => TreePlacementOutput;
  dynastyTransitions: DynastyTransition[];
  eraMilestones: EraMilestone[];
  timeExtent: { min: number; max: number };
}

export function initRebuild(deps: RebuildDeps): void {
  _state = deps.state;
  _d3 = deps.d3;
  _filt = deps.filt;
  _hiN = deps.hiN;
  _hiE = deps.hiE;
  _clH = deps.clH;
  _showD = deps.showD;
  _showLinkDetail = deps.showLinkDetail;
  _cs = deps.cs;
  _eC = deps.eC;
  _nC = deps.nC;
  _fR = deps.fR;
  _esc = deps.esc;
  _personName = deps.personName;
  _relationLabel = deps.relationLabel;
  _t = deps.t;
  _showNodeHoverCard = deps.showNodeHoverCard;
  _moveHoverCard = deps.moveHoverCard;
  _hideHoverCard = deps.hideHoverCard;
  _computeTreePlacement = deps.computeTreePlacement;
  _dynastyTransitions = deps.dynastyTransitions;
  _eraMilestones = deps.eraMilestones;
  _timeExtent = deps.timeExtent;
}

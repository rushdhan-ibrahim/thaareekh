import type { AppState, PersonNode } from '../types/state.js';

type D3Like = typeof import('d3');

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NodeBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  w: number;
  h: number;
}

// ---------------------------------------------------------------------------
// Pure helpers (testable)
// ---------------------------------------------------------------------------

export function getNodeBounds(nodes: Array<{ x?: number; y?: number }>): NodeBounds | null {
  if (!nodes.length) return null;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  nodes.forEach(n => {
    if (Number.isFinite(n.x) && Number.isFinite(n.y)) {
      minX = Math.min(minX, n.x!);
      maxX = Math.max(maxX, n.x!);
      minY = Math.min(minY, n.y!);
      maxY = Math.max(maxY, n.y!);
    }
  });
  if (!Number.isFinite(minX)) return null;
  const w = Math.max(1, maxX - minX);
  const h = Math.max(1, maxY - minY);
  return { minX, maxX, minY, maxY, w, h };
}

// ---------------------------------------------------------------------------
// Module state
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let minimapSvg: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let minimapG: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let viewportRect: any = null;
let _cachedBounds: NodeBounds | null = null;
let _viewportRaf = 0;

function dynastyColor(dy: string | undefined): string {
  return `var(--dy-${(dy || 'unknown').toLowerCase()})`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function initMinimap(state: AppState, d3: D3Like): void {
  const container = document.getElementById('minimap');
  const svg = document.getElementById('minimapSvg');
  if (!container || !svg) return;

  minimapSvg = d3.select(svg);

  container.addEventListener('click', ev => {
    if (!state.svgEl || !state.zoomBehavior) return;
    const rect = container.getBoundingClientRect();
    const clickX = ev.clientX - rect.left;
    const clickY = ev.clientY - rect.top;
    const bounds = getNodeBounds(state.nodes as Array<{ x?: number; y?: number }>);
    if (!bounds) return;
    const scale = Math.min(160 / bounds.w, 100 / bounds.h) * 0.85;
    const gx = (clickX / scale) + bounds.minX - (160 / scale - bounds.w) / 2;
    const gy = (clickY / scale) + bounds.minY - (100 / scale - bounds.h) / 2;
    const tr = state.tr as { k?: number } | null;
    const k = tr?.k || 1;
    const tx = state.W / 2 - gx * k;
    const ty = state.H / 2 - gy * k;
    const transform = d3.zoomIdentity.translate(tx, ty).scale(k);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const svgEl = state.svgEl as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const zoomBehavior = state.zoomBehavior as any;
    svgEl.transition().duration(300).call(zoomBehavior.transform, transform);
  });

  const scheduleViewportUpdate = (): void => {
    if (_viewportRaf) return;
    _viewportRaf = requestAnimationFrame(() => {
      _viewportRaf = 0;
      updateViewport(state, d3);
    });
  };

  window.addEventListener('zoom-changed', scheduleViewportUpdate);
}

export function updateMinimap(state: AppState, d3: D3Like): void {
  if (!minimapSvg) return;
  const container = document.getElementById('minimap');
  if (!container || container.hidden) return;

  const bounds = getNodeBounds(state.nodes as Array<{ x?: number; y?: number }>);
  _cachedBounds = bounds;
  if (!bounds) {
    minimapSvg.selectAll('*').remove();
    minimapG = null;
    viewportRect = null;
    return;
  }

  const pad = 10;
  const scale = Math.min((160 - pad * 2) / bounds.w, (100 - pad * 2) / bounds.h);
  const ox = (160 - bounds.w * scale) / 2 - bounds.minX * scale;
  const oy = (100 - bounds.h * scale) / 2 - bounds.minY * scale;

  // Create groups once, update transform
  if (!minimapG) {
    minimapSvg.selectAll('*').remove();
    minimapG = minimapSvg.append('g');
    viewportRect = minimapSvg.append('rect').attr('class', 'minimap-viewport');
  }
  minimapG.attr('transform', `translate(${ox},${oy}) scale(${scale})`);

  // D3 data-join: only create/remove changed circles
  const r = Math.max(1.5, 3 / scale);
  const dots = minimapG.selectAll('circle.minimap-dot')
    .data(state.nodes, (d: unknown) => (d as PersonNode).id);
  dots.exit().remove();
  dots.enter()
    .append('circle')
    .attr('class', 'minimap-dot')
    .attr('fill', (d: unknown) => dynastyColor((d as PersonNode).dy))
    .merge(dots)
    .attr('cx', (d: unknown) => (d as { x: number }).x)
    .attr('cy', (d: unknown) => (d as { y: number }).y)
    .attr('r', r);

  updateViewport(state, d3);
}

export function updateViewport(state: AppState, d3: D3Like): void {
  if (!viewportRect || !minimapG) return;
  const bounds = _cachedBounds || getNodeBounds(state.nodes as Array<{ x?: number; y?: number }>);
  if (!bounds) return;

  const pad = 10;
  const scale = Math.min((160 - pad * 2) / bounds.w, (100 - pad * 2) / bounds.h);
  const ox = (160 - bounds.w * scale) / 2 - bounds.minX * scale;
  const oy = (100 - bounds.h * scale) / 2 - bounds.minY * scale;

  const tr = (state.tr as { x: number; y: number; k: number }) || d3.zoomIdentity;
  const vx = (-tr.x / tr.k) * scale + ox;
  const vy = (-tr.y / tr.k) * scale + oy;
  const vw = (state.W / tr.k) * scale;
  const vh = (state.H / tr.k) * scale;

  viewportRect
    .attr('x', vx)
    .attr('y', vy)
    .attr('width', vw)
    .attr('height', vh);
}

export function setMinimapVisible(state: AppState, d3: D3Like, visible: boolean): void {
  const container = document.getElementById('minimap');
  if (!container) return;
  state.minimapVisible = visible;
  container.hidden = !visible;
  if (visible) updateMinimap(state, d3);
}

export function toggleMinimap(state: AppState, d3: D3Like): void {
  setMinimapVisible(state, d3, !state.minimapVisible);
}

/**
 * Mini-map overlay showing node positions and viewport rectangle.
 */
import * as d3 from 'd3';
import state from '../state.js';
import { cs } from '../utils/css.js';

let minimapSvg = null;
let minimapG = null;
let viewportRect = null;
let _cachedBounds = null;
let _viewportRaf = 0;

function dynastyColor(dy) {
  return `var(--dy-${(dy || 'unknown').toLowerCase()})`;
}

export function initMinimap() {
  const container = document.getElementById('minimap');
  const svg = document.getElementById('minimapSvg');
  if (!container || !svg) return;

  minimapSvg = d3.select(svg);

  container.addEventListener('click', ev => {
    if (!state.svgEl || !state.zoomBehavior) return;
    const rect = container.getBoundingClientRect();
    const clickX = ev.clientX - rect.left;
    const clickY = ev.clientY - rect.top;
    // Map minimap coords to graph coords
    const bounds = getNodeBounds();
    if (!bounds) return;
    const scale = Math.min(160 / bounds.w, 100 / bounds.h) * 0.85;
    const gx = (clickX / scale) + bounds.minX - (160 / scale - bounds.w) / 2;
    const gy = (clickY / scale) + bounds.minY - (100 / scale - bounds.h) / 2;
    const k = state.tr?.k || 1;
    const tx = state.W / 2 - gx * k;
    const ty = state.H / 2 - gy * k;
    const t = d3.zoomIdentity.translate(tx, ty).scale(k);
    state.svgEl.transition().duration(300).call(state.zoomBehavior.transform, t);
  });

  const scheduleViewportUpdate = () => {
    if (_viewportRaf) return;
    _viewportRaf = requestAnimationFrame(() => {
      _viewportRaf = 0;
      updateViewport();
    });
  };
  window.addEventListener('zoom-changed', scheduleViewportUpdate);
}

function getNodeBounds() {
  if (!state.nodes.length) return null;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  state.nodes.forEach(n => {
    if (Number.isFinite(n.x) && Number.isFinite(n.y)) {
      minX = Math.min(minX, n.x);
      maxX = Math.max(maxX, n.x);
      minY = Math.min(minY, n.y);
      maxY = Math.max(maxY, n.y);
    }
  });
  if (!Number.isFinite(minX)) return null;
  const w = Math.max(1, maxX - minX);
  const h = Math.max(1, maxY - minY);
  return { minX, maxX, minY, maxY, w, h };
}

export function updateMinimap() {
  if (!minimapSvg) return;
  const container = document.getElementById('minimap');
  if (!container || container.hidden) return;

  const bounds = getNodeBounds();
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
    .data(state.nodes, d => d.id);
  dots.exit().remove();
  dots.enter()
    .append('circle')
    .attr('class', 'minimap-dot')
    .attr('fill', d => dynastyColor(d.dy))
    .merge(dots)
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', r);

  updateViewport();
}

export function updateViewport() {
  if (!viewportRect || !minimapG) return;
  const bounds = _cachedBounds || getNodeBounds();
  if (!bounds) return;

  const pad = 10;
  const scale = Math.min((160 - pad * 2) / bounds.w, (100 - pad * 2) / bounds.h);
  const ox = (160 - bounds.w * scale) / 2 - bounds.minX * scale;
  const oy = (100 - bounds.h * scale) / 2 - bounds.minY * scale;

  const tr = state.tr || d3.zoomIdentity;
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

export function setMinimapVisible(visible) {
  const container = document.getElementById('minimap');
  if (!container) return;
  state.minimapVisible = visible;
  container.hidden = !visible;
  if (visible) updateMinimap();
}

export function toggleMinimap() {
  setMinimapVisible(!state.minimapVisible);
}

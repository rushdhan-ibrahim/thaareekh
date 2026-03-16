import * as d3 from 'd3';
import state from './state.js';
import { people, edges, mode } from './data/sovereigns.merge.js';
import { dyS } from './utils/dynasties.js';
import { rebuild, updateEraVisibility } from './graph/rebuild.js';
import { invalidateChipCache } from './graph/filter.js';
import { hiN, hiE, clH } from './graph/highlight.js';
import { cS, initSheet } from './ui/modal.js';
import { goF } from './ui/navigation.js';
import { initSearch } from './ui/search.js';
import { initTheme } from './ui/theme.js';
import { showD, showInstitutionsPane, showLinkDetail, showOfficeDetail, getCurrentOfficeId } from './ui/sidebar.js';
import { initCommandBar } from './ui/commandbar.js';
import { initHistory, clearHistory, withHistoryMuted } from './ui/history.js';
import { armCompareFrom, clearCompare, getCompareState, initCompare, setCompareA, setCompareB, setCompareState, swapCompare } from './ui/compare.js';
import { applyViewState, initViewStatePersistence, loadViewState } from './ui/viewstate.js';
import { clearStoryTrail, initStoryTrails } from './ui/storytrails.js';
import { timelineExtent } from './data/timeline.js';
import { initLanguageControl, setLanguage, t } from './ui/i18n.js';
import { initExporter } from './ui/exporter.js';
import { initCommandPalette } from './ui/command-palette.js';
import { initMinimap, updateMinimap, toggleMinimap } from './ui/minimap.js';
import { initOnboarding } from './ui/onboarding.js';
import { initKeyboardNav } from './ui/keyboard-nav.js';
import { initTreeOptions, updateTreeOptionsVisibility, refreshTreeOptionLabels } from './ui/tree-options.js';

function applyTreeWorkerPolicyFromQuery() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const raw = (params.get("tree_worker") || params.get("treeWorker") || "").trim().toLowerCase();
  if (!raw) return;
  if (raw === "off" || raw === "0" || raw === "false" || raw === "disabled") {
    window.__disableTreePlacementWorker = true;
    window.__treePlacementWorkerPolicy = "off";
    return;
  }
  if (raw === "on" || raw === "1" || raw === "true" || raw === "enabled") {
    window.__disableTreePlacementWorker = false;
    window.__treePlacementWorkerPolicy = "on";
  }
}
applyTreeWorkerPolicyFromQuery();

// Expose goF globally for inline onclick handlers in sidebar HTML
window.goF = goF;
window.setCmpA = setCompareA;
window.setCmpB = setCompareB;
window.armCmp = armCompareFrom;
window.swapCmp = swapCompare;
window.clrCmp = clearCompare;

const savedView = loadViewState();
const ERA = timelineExtent();

let graphInteractionTimer = null;
let zoomEventRaf = null;
let pendingZoomDetail = null;
let zoomTransformRaf = null;
let pendingZoomTransform = null;
let zoomLayerEl = null;

function getZoomLayerEl() {
  if (zoomLayerEl && document.body.contains(zoomLayerEl)) return zoomLayerEl;
  zoomLayerEl = document.querySelector('#sv .gg');
  return zoomLayerEl;
}

function scheduleZoomTransform(transform) {
  pendingZoomTransform = transform;
  if (zoomTransformRaf) return;
  zoomTransformRaf = requestAnimationFrame(() => {
    zoomTransformRaf = null;
    const next = pendingZoomTransform;
    pendingZoomTransform = null;
    if (!next) return;
    const layer = getZoomLayerEl();
    if (!layer) return;
    layer.setAttribute('transform', String(next));
  });
}

function ensureGraphInteractionStyles() {
  if (document.getElementById('graph-interaction-optimizations')) return;
  const style = document.createElement('style');
  style.id = 'graph-interaction-optimizations';
  style.textContent = `
    body.graph-interacting #sv g.graph-edge-labels {
      display: none !important;
    }
    body.graph-interacting #sv g.graph-badges,
    body.graph-interacting #sv g.tree-badges,
    body.graph-interacting #sv text.node-reign-label {
      display: none !important;
    }
    body.graph-interacting #sv .node-body,
    body.graph-interacting #sv .node-accent {
      filter: none !important;
    }
    body.graph-interacting #sv .graph-link,
    body.graph-interacting #sv .tree-link,
    body.graph-interacting #sv .nd {
      shape-rendering: optimizeSpeed;
      stroke-dasharray: none !important;
      marker-end: none !important;
      pointer-events: none !important;
    }
    body.graph-interacting #sv .gg {
      will-change: transform;
    }
  `;
  document.head.appendChild(style);
}

function emitZoomChanged(detail) {
  pendingZoomDetail = detail;
  if (zoomEventRaf) return;
  zoomEventRaf = requestAnimationFrame(() => {
    zoomEventRaf = null;
    const next = pendingZoomDetail;
    pendingZoomDetail = null;
    if (!next) return;
    window.dispatchEvent(new CustomEvent('zoom-changed', { detail: next }));
  });
}

function setGraphInteractionMode(active) {
  if (graphInteractionTimer) {
    window.clearTimeout(graphInteractionTimer);
    graphInteractionTimer = null;
  }
  if (!active) {
    graphInteractionTimer = window.setTimeout(() => {
      graphInteractionTimer = null;
      document.body.classList.remove('graph-interacting');
    }, 110);
    return;
  }
  if (state.viewMode !== 'graph') {
    document.body.classList.remove('graph-interacting');
    return;
  }
  document.body.classList.add('graph-interacting');
}

ensureGraphInteractionStyles();

// Initialize zoom behavior
state.zoomBehavior = d3.zoom().scaleExtent([0.08, 4])
  .on("start", () => {
    setGraphInteractionMode(true);
  })
  .on("zoom", e => {
    state.tr = e.transform;
    scheduleZoomTransform(e.transform);
    emitZoomChanged({ x: e.transform.x, y: e.transform.y, k: e.transform.k });
  })
  .on("end", () => {
    setGraphInteractionMode(false);
  });

// Update translate extent after rebuilds to prevent panning too far off-screen
function updateTranslateExtent() {
  const gNode = document.querySelector('#sv .gg');
  if (!gNode) return;
  const bb = gNode.getBBox();
  if (!Number.isFinite(bb.width) || bb.width <= 0) return;
  // Add generous padding (1.5x content size on each side) so users can breathe
  // but can't lose the content entirely
  const padX = Math.max(state.W, bb.width * 1.5);
  const padY = Math.max(state.H, bb.height * 1.5);
  state.zoomBehavior.translateExtent([
    [bb.x - padX, bb.y - padY],
    [bb.x + bb.width + padX, bb.y + bb.height + padY]
  ]);
}

const renderInvalidation = {
  geometryDirty: false,
  styleDirty: false,
  selectionDirty: false,
  overlayDirty: false,
  eraVisibilityDirty: false
};
let renderRaf = 0;

function resetRenderInvalidation() {
  renderInvalidation.geometryDirty = false;
  renderInvalidation.styleDirty = false;
  renderInvalidation.selectionDirty = false;
  renderInvalidation.overlayDirty = false;
  renderInvalidation.eraVisibilityDirty = false;
}

function applySelectionHighlight() {
  if (state.selId) {
    hiN(state.selId);
    return;
  }
  if (state.selEdge) {
    hiE(state.selEdge);
    return;
  }
  clH();
}

function flushRenderQueue() {
  if (renderRaf) {
    cancelAnimationFrame(renderRaf);
    renderRaf = 0;
  }
  const snapshot = { ...renderInvalidation };
  resetRenderInvalidation();
  const needsFullRebuild = snapshot.geometryDirty
    || snapshot.styleDirty
    || snapshot.overlayDirty
    || snapshot.eraVisibilityDirty;
  if (needsFullRebuild) {
    rebuild();
    applySelectionHighlight();
    return;
  }
  if (snapshot.selectionDirty) {
    applySelectionHighlight();
  }
}

function requestRender(invalidation = { geometryDirty: true }, { resetZoom = false, immediate = false } = {}) {
  for (const [key, value] of Object.entries(invalidation)) {
    if (value) renderInvalidation[key] = true;
  }
  if (resetZoom) {
    state.tr = d3.zoomIdentity;
  }
  if (immediate) {
    flushRenderQueue();
    return;
  }
  if (renderRaf) return;
  renderRaf = requestAnimationFrame(() => {
    renderRaf = 0;
    flushRenderQueue();
  });
}

// Theme toggle
if (savedView?.theme === 'dark' || savedView?.theme === 'light') {
  document.documentElement.dataset.theme = savedView.theme;
  const bt = document.getElementById('bt');
  if (bt) bt.textContent = savedView.theme === 'dark' ? '\u2600' : '\u263E';
}
initTheme(() => requestRender({ styleDirty: true }));
initSheet();
initCommandBar();
initCommandPalette();
initLanguageControl(savedView?.lang || 'en');
initEraControls();
initExporter();
initFilterPanel();
initMinimap();

function shouldRegisterServiceWorker() {
  if (typeof window === 'undefined') return false;
  const { hostname, search } = window.location;
  const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
  const forceEnable = new URLSearchParams(search).get('sw') === 'on';
  return !isLocalHost || forceEnable;
}

if (shouldRegisterServiceWorker() && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // Offline support is best-effort.
    });
  });
}

function normalizeDensity(v) {
  return v === 'compact' || v === 'presentation' ? v : 'comfortable';
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function applyDensityMode(v, { rebuildNow = true } = {}) {
  state.density = normalizeDensity(v);
  document.documentElement.dataset.density = state.density;
  const dns = document.getElementById('dns');
  if (dns) dns.value = state.density;
  if (rebuildNow) requestRender({ styleDirty: true });
}

function syncEraToStoryStep(payload) {
  const y = Number(payload?.step?.year);
  if (!Number.isFinite(y)) return;
  if (state.eraPlaying) stopEraPlayback();
  if (!state.eraEnabled) setEraEnabled(true, { rebuildNow: false });
  setEraYear(y, { rebuildNow: true });
}

initStoryTrails({ onStepChange: syncEraToStoryStep });

function centuryLabel(y) {
  const c = Math.floor((y - 1) / 100) + 1;
  const suf = c % 10 === 1 && c % 100 !== 11 ? "st"
    : c % 10 === 2 && c % 100 !== 12 ? "nd"
      : c % 10 === 3 && c % 100 !== 13 ? "rd"
        : "th";
  return `${c}${suf} c.`;
}

let eraRaf = 0;
let eraDebounceTimer = 0;
function queueEraRebuild() {
  if (eraRaf) return;
  eraRaf = requestAnimationFrame(() => {
    eraRaf = 0;
    requestRender({ eraVisibilityDirty: true });
  });
}
function queueEraDebouncedRebuild() {
  if (eraRaf) { cancelAnimationFrame(eraRaf); eraRaf = 0; }
  clearTimeout(eraDebounceTimer);
  eraDebounceTimer = setTimeout(() => {
    eraDebounceTimer = 0;
    // Try lightweight path first; only do full rebuild if visible set changed
    const needsFull = updateEraVisibility();
    if (needsFull) requestRender({ eraVisibilityDirty: true });
  }, 150);
}

function emitEraChanged() {
  window.dispatchEvent(new CustomEvent('era-changed', {
    detail: {
      enabled: state.eraEnabled,
      year: state.eraYear,
      playing: state.eraPlaying
    }
  }));
}

function stopEraPlayback() {
  if (state.eraTimer) {
    clearInterval(state.eraTimer);
    state.eraTimer = null;
  }
  state.eraPlaying = false;
  const playBtn = document.getElementById("epy");
  if (playBtn) {
    playBtn.textContent = "\u25b6";
    playBtn.classList.remove("on");
  }
  emitEraChanged();
}

function renderEraUi() {
  const eta = document.getElementById("eta");
  const ey = document.getElementById("ey");
  const eyv = document.getElementById("eyv");
  const epy = document.getElementById("epy");
  if (!eta || !ey || !eyv || !epy) return;
  const yRaw = Number.isFinite(state.eraYear) ? state.eraYear : ERA.max;
  const y = Math.max(ERA.min, Math.min(ERA.max, yRaw));
  state.eraYear = y;

  // Enhanced piecewise era atmosphere
  const yAtmosphere = state.eraEnabled ? y : (ERA.min + ERA.max) / 2;
  const eraRatio = (yAtmosphere - ERA.min) / Math.max(1, (ERA.max - ERA.min));
  let light, warm;
  if (eraRatio < 0.25) {
    // Early (1100-1300): Cooler blues, deep shadows
    light = (0.04 + eraRatio * 0.08).toFixed(3);
    warm = (0.06 + eraRatio * 0.04).toFixed(3);
  } else if (eraRatio < 0.6) {
    // Middle (1300-1600): Warm gold peak
    const sub = (eraRatio - 0.25) / 0.35;
    light = (0.06 + sub * 0.08).toFixed(3);
    warm = (0.08 + sub * 0.08).toFixed(3);
  } else {
    // Late (1600-1968): Brighter, more teal
    const sub = (eraRatio - 0.6) / 0.4;
    light = (0.14 - sub * 0.04).toFixed(3);
    warm = (0.16 - sub * 0.08).toFixed(3);
  }
  document.documentElement.style.setProperty("--era-light", light);
  document.documentElement.style.setProperty("--era-warm", warm);
  eta.classList.toggle("on", state.eraEnabled);
  eta.setAttribute("aria-pressed", state.eraEnabled ? "true" : "false");
  eta.textContent = state.eraEnabled ? t('era') : t('all_eras');
  ey.disabled = !state.eraEnabled;
  ey.value = String(y);
  eyv.textContent = state.eraEnabled ? `${y} \u00b7 ${centuryLabel(y)}` : `${t('all_years')} ${ERA.min}\u2013${ERA.max}`;
  epy.textContent = state.eraPlaying ? "||" : "\u25b6";
  epy.classList.toggle("on", state.eraPlaying);
  epy.setAttribute("aria-pressed", state.eraPlaying ? "true" : "false");
}

function setEraEnabled(on, { rebuildNow = true } = {}) {
  state.eraEnabled = Boolean(on);
  if (!state.eraEnabled) stopEraPlayback();
  renderEraUi();
  emitEraChanged();
  if (rebuildNow) queueEraRebuild();
}

function setEraYear(y, { rebuildNow = true } = {}) {
  const next = Math.max(ERA.min, Math.min(ERA.max, Number(y)));
  if (!Number.isFinite(next)) return;
  state.eraYear = next;
  renderEraUi();
  emitEraChanged();
  if (rebuildNow) queueEraRebuild();
}

function startEraPlayback() {
  if (state.eraPlaying) return;
  if (!state.eraEnabled) setEraEnabled(true, { rebuildNow: false });
  if (!Number.isFinite(state.eraYear)) state.eraYear = ERA.max;
  if (state.eraYear >= ERA.max) setEraYear(ERA.min, { rebuildNow: false });
  state.eraPlaying = true;
  renderEraUi();
  emitEraChanged();
  state.eraTimer = setInterval(() => {
    const y = Number(state.eraYear);
    const step = y < 1700 ? 5 : y < 1900 ? 3 : 1;
    const next = Math.min(ERA.max, y + step);
    setEraYear(next, { rebuildNow: true });
    if (next >= ERA.max) stopEraPlayback();
  }, 95);
}

function initEraControls() {
  const eta = document.getElementById("eta");
  const ey = document.getElementById("ey");
  const epy = document.getElementById("epy");
  if (!eta || !ey || !epy) return;
  ey.min = String(ERA.min);
  ey.max = String(ERA.max);
  ey.step = "1";
  if (!Number.isFinite(state.eraYear)) state.eraYear = ERA.max;
  renderEraUi();
  eta.addEventListener("click", () => setEraEnabled(!state.eraEnabled));
  ey.addEventListener("input", () => {
    if (!state.eraEnabled) setEraEnabled(true, { rebuildNow: false });
    // During drag: update UI immediately, debounce the expensive rebuild
    setEraYear(Number(ey.value), { rebuildNow: false });
    queueEraDebouncedRebuild();
  });
  ey.addEventListener("change", () => {
    // On mouseup: cancel pending debounce and rebuild immediately
    clearTimeout(eraDebounceTimer);
    eraDebounceTimer = 0;
    if (!state.eraEnabled) setEraEnabled(true, { rebuildNow: false });
    setEraYear(Number(ey.value), { rebuildNow: true });
  });
  epy.addEventListener("click", () => {
    if (state.eraPlaying) stopEraPlayback();
    else startEraPlayback();
  });
}

// --- Filter Panel ---
function initFilterPanel() {
  const fpBtn = document.getElementById('fp');
  const fpClose = document.getElementById('fpClose');
  const panel = document.getElementById('filterPanel');
  if (!fpBtn || !panel) return;

  function togglePanel() {
    state.filterPanelOpen = !state.filterPanelOpen;
    panel.classList.toggle('open', state.filterPanelOpen);
    fpBtn.classList.toggle('on', state.filterPanelOpen);
    fpBtn.setAttribute('aria-pressed', state.filterPanelOpen ? 'true' : 'false');
  }

  fpBtn.addEventListener('click', togglePanel);
  fpClose?.addEventListener('click', () => {
    state.filterPanelOpen = false;
    panel.classList.remove('open');
    fpBtn.classList.remove('on');
    fpBtn.setAttribute('aria-pressed', 'false');
  });

  // 'F' key shortcut
  document.addEventListener('keydown', e => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      togglePanel();
    }
    if (e.key === 'd' || e.key === 'D') {
      e.preventDefault();
      setSidebarOpen(!state.sidebarOpen);
    }
    if (e.key === 'Escape' && state.sidebarOpen) {
      e.preventDefault();
      setSidebarOpen(false);
    }
    if (e.key === '0') {
      e.preventDefault();
      fitToContent();
    }
  });
}

function findEdgeFromHistoryEntry(entry) {
  if (!entry || entry.type !== 'edge') return null;
  if (entry.s && entry.d) {
    const a = entry.s < entry.d ? entry.s : entry.d;
    const b = entry.s < entry.d ? entry.d : entry.s;
    const key = `${a}|${b}|${entry.rel || 'kin'}`;
    const edgeIdx = state._edgeBySelectionKey;
    const direct = edgeIdx?.get?.(key);
    if (direct) return direct;
  }
  return state.links.find(l => {
    const s = typeof l.source === 'object' ? l.source.id : l.source;
    const t = typeof l.target === 'object' ? l.target.id : l.target;
    const dir = (s === entry.s && t === entry.d) || (s === entry.d && t === entry.s);
    if (!dir) return false;
    if (entry.rel && l._e?.t !== entry.rel) return false;
    return true;
  }) || null;
}

function snapshotSelectedEdge(link) {
  if (!link) return null;
  const s = typeof link.source === 'object' ? link.source.id : link.source;
  const d = typeof link.target === 'object' ? link.target.id : link.target;
  if (!s || !d) return null;
  return {
    type: 'edge',
    s,
    d,
    rel: link._e?.t || 'kin'
  };
}

function showEmptySidebar() {
  document.getElementById("sT").textContent = t('select_sovereign');
  document.getElementById("sT").classList.add("emp");
  document.getElementById("sM").innerHTML = "";
  document.getElementById("sN").innerHTML = t('click_node_details');
  document.getElementById("sR").innerHTML = "";
  window.dispatchEvent(new CustomEvent('selection-changed', { detail: { type: 'none' } }));
}

function renderSidebarToggleUi() {
  const label = state.sidebarOpen ? t('hide_sidebar') : t('show_sidebar');
  for (const id of ['vms', 'vms2']) {
    const btn = document.getElementById(id);
    if (!btn) continue;
    btn.classList.toggle("on", state.sidebarOpen);
    btn.setAttribute("aria-pressed", state.sidebarOpen ? "true" : "false");
    btn.textContent = t('details_panel');
    btn.title = label;
    btn.setAttribute("aria-label", label);
  }
  const closeBtn = document.getElementById("sideClose");
  if (closeBtn) {
    closeBtn.title = t('close_sidebar');
    closeBtn.setAttribute("aria-label", t('close_sidebar'));
  }
}

function setSidebarOpen(open, { rebuildNow = false } = {}) {
  state.sidebarOpen = Boolean(open);
  document.body.classList.toggle("sidebar-collapsed", !state.sidebarOpen);
  renderSidebarToggleUi();
  if (rebuildNow) {
    requestRender({ geometryDirty: true }, { immediate: true });
    setTimeout(updateTranslateExtent, 500);
    return;
  }
  // Lightweight viewport update — no full rebuild needed
  requestAnimationFrame(() => {
    const area = document.getElementById("ga");
    state.W = area.clientWidth;
    state.H = area.clientHeight;
    // Nudge graph simulation center if running
    if (state.viewMode === "graph" && state.sim) {
      state.sim.force("center", d3.forceCenter(state.W / 2, state.H / 2));
      const xForce = state.sim.force("x");
      const yForce = state.sim.force("y");
      if (xForce) xForce.x(state.W / 2);
      if (yForce) yForce.y(state.H / 2);
      state.sim.alpha(0.15).restart();
    }
    updateTranslateExtent();
  });
}

function fitToContent() {
  if (!state.svgEl) return;
  const gNode = document.querySelector('#sv .gg');
  if (!gNode) {
    state.svgEl.transition().duration(prefersReducedMotion() ? 0 : 400).call(state.zoomBehavior.transform, d3.zoomIdentity);
    return;
  }
  const bb = gNode.getBBox();
  if (!Number.isFinite(bb.width) || !Number.isFinite(bb.height) || bb.width <= 0 || bb.height <= 0) {
    state.svgEl.transition().duration(prefersReducedMotion() ? 0 : 400).call(state.zoomBehavior.transform, d3.zoomIdentity);
    return;
  }
  const m = 28;
  const sx = (state.W - m * 2) / bb.width;
  const sy = (state.H - m * 2) / bb.height;
  const k = Math.max(0.12, Math.min(4, Math.min(sx, sy)));
  const x = (state.W - bb.width * k) / 2 - bb.x * k;
  const y = (state.H - bb.height * k) / 2 - bb.y * k;
  const t = d3.zoomIdentity.translate(x, y).scale(k);
  state.svgEl.transition().duration(prefersReducedMotion() ? 0 : 400).call(state.zoomBehavior.transform, t);
  // Recompute pan limits after zoom animation
  setTimeout(updateTranslateExtent, 450);
}

function restoreSelection(snapshot) {
  const sel = snapshot?.selection;
  if (!sel) return;
  withHistoryMuted(() => {
    if (sel.type === 'person' && sel.id) {
      goF(sel.id);
      return;
    }
    if (sel.type === 'edge' && sel.s && sel.d) {
      const link = findEdgeFromHistoryEntry(sel);
      if (!link) return;
      state.selId = null;
      state.selEdge = link;
      hiE(link);
      showLinkDetail(link);
    }
  });
}

function refreshFocusOverlay() {
  requestRender(
    { overlayDirty: true, selectionDirty: true },
    { resetZoom: true }
  );
}

initHistory(entry => {
  withHistoryMuted(() => {
    if (entry.type === 'person') {
      goF(entry.id);
      return;
    }
    if (entry.type === 'office') {
      showOfficeDetail(entry.officeId);
      return;
    }
    if (entry.type === 'edge') {
      const link = findEdgeFromHistoryEntry(entry);
      if (!link) return;
      state.selId = null;
      state.selEdge = link;
      hiE(link);
      showLinkDetail(link);
    }
  });
});

let institutionsReturnSelection = null;

let compareRerenderLock = false;
initCompare(() => {
  if (compareRerenderLock) return;
  compareRerenderLock = true;
  try {
    withHistoryMuted(() => {
      if (state.selId) showD(state.selId);
      else if (state.selEdge) showLinkDetail(state.selEdge);
    });
  } finally {
    compareRerenderLock = false;
  }
});

// Bottom sheet close buttons
document.getElementById("bX").addEventListener("click", cS);
document.getElementById("ov").addEventListener("click", cS);

// Search
initSearch();

// Edge type chip toggles
document.querySelectorAll(".chip[data-e]").forEach(c => c.addEventListener("click", () => {
  c.classList.toggle("on");
  invalidateChipCache();
  requestRender({ geometryDirty: true }, { resetZoom: true });
}));

// Confidence chip toggles
document.querySelectorAll(".chip[data-cf]").forEach(c => c.addEventListener("click", () => {
  c.classList.toggle("on");
  invalidateChipCache();
  requestRender({ geometryDirty: true }, { resetZoom: true });
}));

// Dynasty filter
document.getElementById("df").addEventListener("change", () => {
  requestRender({ geometryDirty: true }, { resetZoom: true });
});

// Tree filter
document.getElementById("tf").addEventListener("change", () => {
  requestRender({ geometryDirty: true }, { resetZoom: true });
});

// Source quality filter
document.getElementById("sqf").addEventListener("change", () => {
  requestRender({ geometryDirty: true }, { resetZoom: true });
});
document.getElementById("dns").addEventListener("change", e => {
  applyDensityMode(e.target.value, { rebuildNow: true });
});
document.getElementById("ovm").addEventListener("change", e => {
  const v = e.target.value;
  state.overlayMode = v === "confidence" || v === "source" ? v : "relation";
  refreshFocusOverlay();
});

document.getElementById("vmi").addEventListener("click", () => {
  const btn = document.getElementById("vmi");
  const isOpen = btn.classList.contains("on");
  if (isOpen) {
    btn.classList.remove("on");
    btn.setAttribute("aria-pressed", "false");
    if (institutionsReturnSelection?.type === 'person' && institutionsReturnSelection.id) {
      goF(institutionsReturnSelection.id);
    } else if (institutionsReturnSelection?.type === 'edge') {
      const link = findEdgeFromHistoryEntry(institutionsReturnSelection);
      if (link) {
        state.selId = null;
        state.selEdge = link;
        hiE(link);
        showLinkDetail(link);
      } else {
        showEmptySidebar();
      }
    } else {
      showEmptySidebar();
    }
    institutionsReturnSelection = null;
    return;
  }
  institutionsReturnSelection = state.selId
    ? { type: 'person', id: state.selId }
    : snapshotSelectedEdge(state.selEdge);
  state.selId = null;
  state.selEdge = null;
  clH();
  showInstitutionsPane();
});

document.getElementById("vms").addEventListener("click", () => {
  setSidebarOpen(!state.sidebarOpen);
});
document.getElementById("vms2")?.addEventListener("click", () => {
  setSidebarOpen(!state.sidebarOpen);
});
document.getElementById("sideClose")?.addEventListener("click", () => {
  setSidebarOpen(false);
});

document.getElementById("fm").addEventListener("click", () => {
  state.focusMode = !state.focusMode;
  document.getElementById("fm").classList.toggle("on", state.focusMode);
  document.getElementById("fm").setAttribute("aria-pressed", state.focusMode ? "true" : "false");
  if (state.selId) hiN(state.selId);
  else if (state.selEdge) hiE(state.selEdge);
  else clH();
  window.dispatchEvent(new CustomEvent('selection-changed', { detail: state.selId ? { type: 'person', id: state.selId } : state.selEdge ? { type: 'edge' } : { type: 'none' } }));
});

// View mode toggles
document.getElementById("vmg").addEventListener("click", () => {
  document.body.classList.remove('graph-interacting');
  state.viewMode = "graph";
  document.getElementById("vmg").classList.add("on");
  document.getElementById("vmt").classList.remove("on");
  document.getElementById("vmg").setAttribute("aria-pressed", "true");
  document.getElementById("vmt").setAttribute("aria-pressed", "false");
  requestRender({ geometryDirty: true }, { resetZoom: true });
  updateTreeOptionsVisibility();
});
document.getElementById("vmt").addEventListener("click", () => {
  document.body.classList.remove('graph-interacting');
  state.viewMode = "tree";
  document.getElementById("vmt").classList.add("on");
  document.getElementById("vmg").classList.remove("on");
  document.getElementById("vmt").setAttribute("aria-pressed", "true");
  document.getElementById("vmg").setAttribute("aria-pressed", "false");
  const parentChip = document.querySelector('.chip[data-e="parent"]');
  if (parentChip && !parentChip.classList.contains("on")) parentChip.classList.add("on");
  requestRender({ geometryDirty: true }, { resetZoom: true });
  updateTreeOptionsVisibility();
});

// Fit button (filter panel)
document.getElementById("bf").addEventListener("click", () => {
  fitToContent();
});

// Reset view button (header)
document.getElementById("resetView")?.addEventListener("click", () => {
  fitToContent();
});

// Reset button
document.getElementById("br").addEventListener("click", () => {
  document.body.classList.remove('graph-interacting');
  document.getElementById("si").value = "";
  document.getElementById("dd").classList.remove("open");
  document.getElementById("df").value = "__all__";
  document.getElementById("tf").value = "__all__";
  document.getElementById("sqf").value = "__all__";
  applyDensityMode("comfortable", { rebuildNow: false });
  document.querySelectorAll(".chip[data-e]").forEach(c => c.classList.add("on"));
  document.querySelectorAll(".chip[data-cf]").forEach(c => c.classList.add("on"));
  invalidateChipCache();
  state.viewMode = "graph";
  document.getElementById("vmg").classList.add("on");
  document.getElementById("vmt").classList.remove("on");
  document.getElementById("vmg").setAttribute("aria-pressed", "true");
  document.getElementById("vmt").setAttribute("aria-pressed", "false");
  state.focusMode = false;
  state.overlayMode = "relation";
  stopEraPlayback();
  state.eraEnabled = false;
  state.eraYear = ERA.max;
  renderEraUi();
  document.getElementById("fm").classList.remove("on");
  document.getElementById("fm").setAttribute("aria-pressed", "false");
  document.getElementById("vmi").classList.remove("on");
  document.getElementById("vmi").setAttribute("aria-pressed", "false");
  document.getElementById("ovm").value = "relation";
  state.selId = null;
  state.selEdge = null;
  clearCompare();
  clearStoryTrail();
  clH();
  clearHistory();
  cS();
  institutionsReturnSelection = null;
  showEmptySidebar();
  requestRender({ geometryDirty: true }, { resetZoom: true, immediate: true });
});

// Populate dynasty dropdown
dyS.forEach(d => {
  const o = document.createElement("option");
  o.value = d; o.textContent = d;
  document.getElementById("df").appendChild(o);
});

applyViewState(savedView, setCompareState);
setLanguage(state.lang, { silent: true });
applyDensityMode(state.density, { rebuildNow: false });
setSidebarOpen(state.sidebarOpen, { rebuildNow: false });
if (!Number.isFinite(state.eraYear)) state.eraYear = ERA.max;
renderEraUi();
showEmptySidebar();

// Initial stats & render
document.getElementById("st").textContent = people.length + " \u00b7 " + edges.length + (mode === "research" ? " \u00b7 research" : "");
rebuild();
// Fit to content on fresh load (no saved zoom), then update pan limits
const hasSavedZoom = savedView?.zoom && Number.isFinite(savedView.zoom.k) && savedView.zoom.k !== 1;
setTimeout(() => { if (!hasSavedZoom) fitToContent(); setTimeout(updateTranslateExtent, 500); }, 1200);
restoreSelection(savedView);
initViewStatePersistence(getCompareState);
initKeyboardNav(fitToContent);
initTreeOptions();

// Delayed onboarding after initial render
setTimeout(() => initOnboarding(), 100);

// Auto-open sidebar when a node/edge is clicked while it's collapsed
window.addEventListener('request-sidebar-open', () => {
  if (!state.sidebarOpen) setSidebarOpen(true);
});

// ARIA live region announcements
window.addEventListener('selection-changed', e => {
  const live = document.getElementById('a11y-live');
  if (!live) return;
  const detail = e.detail;
  if (detail?.type === 'person' && detail.id) {
    const node = state._nodeById?.get?.(detail.id) || state.nodes.find(n => n.id === detail.id);
    live.textContent = node ? `Selected: ${node.nm || detail.id}` : '';
  } else if (detail?.type === 'edge') {
    live.textContent = 'Relationship selected';
  } else if (detail?.type === 'office') {
    live.textContent = `Office selected: ${detail.officeId}`;
  } else {
    live.textContent = '';
  }
});

window.addEventListener('lang-changed', () => {
  renderSidebarToggleUi();
  renderEraUi();
  refreshTreeOptionLabels();
  withHistoryMuted(() => {
    const vmi = document.getElementById('vmi');
    if (vmi?.classList.contains('on')) {
      showInstitutionsPane();
      return;
    }
    const curOfc = getCurrentOfficeId();
    if (curOfc) {
      showOfficeDetail(curOfc);
      return;
    }
    if (state.selId) {
      showD(state.selId);
      return;
    }
    if (state.selEdge) {
      showLinkDetail(state.selEdge);
      return;
    }
    showEmptySidebar();
  });
});

// Handle window resize
window.addEventListener("resize", () => {
  state.W = document.getElementById("ga").clientWidth;
  state.H = document.getElementById("ga").clientHeight;
});

// Parallax pattern effect on zoom (throttled to every other frame)
let parallaxLast = 0;
window.addEventListener('zoom-changed', e => {
  if (document.body.classList.contains('graph-interacting')) return;
  const now = performance.now();
  if (now - parallaxLast < 32) return;
  parallaxLast = now;
  const detail = e.detail;
  if (!detail) return;
  const ga = document.getElementById('ga');
  if (!ga) return;
  const ox = (detail.x * 0.015).toFixed(1);
  const oy = (detail.y * 0.015).toFixed(1);
  ga.style.setProperty('--pattern-ox', `${ox}px`);
  ga.style.setProperty('--pattern-oy', `${oy}px`);
});

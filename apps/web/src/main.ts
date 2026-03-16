/**
 * Main entry point — wires all TS modules together.
 * Mirrors the legacy src/main.js orchestration layer.
 */

import * as d3 from 'd3';
import type { AppState, PersonNode, LinkDatum, EdgeRecord } from './types/state.js';

// Data modules (legacy JS, ambient-typed in legacy-modules.d.ts)
import { people, edges, mode, byId } from '../../../src/data/sovereigns.merge.js';
import { sourceById } from '../../../src/data/sources.js';
import { officeById, officeTimeline, officeFunctionForYear, buildOfficeHolders } from '../../../src/data/offices.js';
import { dynastyTransitions, eraMilestones } from '../../../src/data/era-events.js';
import { timelineExtent, activeInYearById } from '../../../src/data/timeline.js';
import { storyTrails } from '../../../src/data/storytrails.js';
import { resolvePlace, extractPlaceMentions, placeLabelForLang } from '../../../src/data/geo.js';
import {
  getInferenceNote, getInferenceDossierPath,
  inferenceEdgeKey, isDerivedInferenceEdge
} from '../../../src/data/inference-notes.js';

// TS modules
import { buildDynastySet } from './utils/dynasties.js';
import { cs, eC, nC } from './utils/css.js';
import { fR, esc } from './utils/format.js';
import {
  t, personName, relationLabel, getLang,
  setLanguage, initLanguageControl, refreshChromeLabels
} from './ui/i18n.js';
import { filterCore, activeE, activeConfidence, applyTreeDynastyFilter, computeEraPersonOk, invalidateChipCache } from './graph/filter.js';
import { hiN, hiE, clH } from './graph/highlight.js';
import { gNb, parOf, chOf } from './graph/relationships.js';
import { showNodeHoverCard, moveHoverCard, hideHoverCard } from './ui/hover-card.js';
import { goF } from './ui/navigation.js';
import { initTheme } from './ui/theme.js';
import { initSheet, oS, cS } from './ui/modal.js';
import { initCommandBar } from './ui/commandbar.js';
import {
  initHistory, clearHistory, withHistoryMuted,
  recordPerson, recordEdge, recordOffice
} from './ui/history.js';
import {
  initCompare, clearCompare, getCompareState, setCompareState,
  setCompareA, setCompareB, armCompareFrom, swapCompare,
  compareSummaryHtml, handlePersonViewed
} from './ui/compare.js';
import {
  loadViewState, applyViewState, initViewStatePersistence, saveViewState
} from './ui/viewstate.js';
import { initStoryTrails, clearStoryTrail } from './ui/storytrails.js';
import { initExporter } from './ui/exporter.js';
import { initMinimap, updateMinimap, toggleMinimap } from './ui/minimap.js';
import { initOnboarding } from './ui/onboarding.js';
import { initKeyboardNav } from './ui/keyboard-nav.js';
import {
  initTreeOptions, updateTreeOptionsVisibility, refreshTreeOptionLabels
} from './ui/tree-options.js';
import { initTimelineViz } from './ui/timeline-viz.js';
import {
  initSidebar, showD, showLinkDetail, showInstitutionsPane,
  showOfficeDetail, getCurrentOfficeId
} from './ui/sidebar.js';
import { initRebuild, rebuild, updateEraVisibility } from './graph/rebuild.js';
import { computeTreePlacement } from './graph/tree-placement-core.ts';
import { createPathfinder } from './graph/pathfinder.js';
import { initSearchRuntime } from './ui/search-runtime.js';

function applyTreeWorkerPolicyFromQuery(): void {
  const params = new URLSearchParams(window.location.search);
  const raw = (params.get('tree_worker') || params.get('treeWorker') || '').trim().toLowerCase();
  if (!raw) return;
  if (raw === 'off' || raw === '0' || raw === 'false' || raw === 'disabled') {
    (window as any).__disableTreePlacementWorker = true;
    (window as any).__treePlacementWorkerPolicy = 'off';
    return;
  }
  if (raw === 'on' || raw === '1' || raw === 'true' || raw === 'enabled') {
    (window as any).__disableTreePlacementWorker = false;
    (window as any).__treePlacementWorkerPolicy = 'on';
  }
}
applyTreeWorkerPolicyFromQuery();

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const state: AppState = {
  nodes: [],
  links: [],
  sim: null,
  svgEl: null,
  gL: null,
  gLH: null,
  gN: null,
  gBadges: null,
  selId: null,
  selEdge: null,
  tr: d3.zoomIdentity,
  W: 0,
  H: 0,
  zoomBehavior: null,
  viewMode: 'graph',
  lang: 'en',
  density: 'comfortable',
  sidebarOpen: true,
  focusMode: false,
  overlayMode: 'relation',
  eraEnabled: false,
  eraYear: null,
  eraPlaying: false,
  eraTimer: null,
  loaderHidden: false,
  filterPanelOpen: false,
  onboardingComplete: false,
  minimapVisible: false,
  _treesMeta: [],
  _badgeData: []
};

// Typed references to data
const typedPeople = people as unknown as PersonNode[];
const typedEdges = edges as unknown as EdgeRecord[];
const typedById = byId as unknown as Map<string, PersonNode>;

// ---------------------------------------------------------------------------
// Derived data
// ---------------------------------------------------------------------------

const dyS = buildDynastySet(typedPeople);
const ERA = timelineExtent();
const pathfinder = createPathfinder(typedEdges as any);

// ---------------------------------------------------------------------------
// Bound helpers (closing over shared deps so modules get clean signatures)
// ---------------------------------------------------------------------------

function boundGoF(id: string): void {
  goF(id, {
    d3: d3 as any,
    state,
    showD,
    hiN: (nid: string) => hiN(nid, state),
    cS
  });
}

function boundHiN(id: string): void { hiN(id, state); }
function boundHiE(link: LinkDatum): void { hiE(link, state); }
function boundClH(): void { clH(state); }

function boundShowNodeHoverCard(ev: MouseEvent, d: PersonNode): void {
  showNodeHoverCard(ev, d, state);
}
function boundMoveHoverCard(ev: MouseEvent): void { moveHoverCard(ev); }
function boundHideHoverCard(): void { hideHoverCard(); }

function boundGNb(id: string, type: string): ReturnType<typeof gNb> {
  return gNb(id, type, state.links as any);
}
function boundParOf(id: string): ReturnType<typeof parOf> {
  return parOf(id, state.links as any);
}
function boundChOf(id: string): ReturnType<typeof chOf> {
  return chOf(id, state.links as any);
}

type RenderInvalidation = {
  geometryDirty: boolean;
  styleDirty: boolean;
  selectionDirty: boolean;
  overlayDirty: boolean;
  eraVisibilityDirty: boolean;
};

const renderInvalidation: RenderInvalidation = {
  geometryDirty: false,
  styleDirty: false,
  selectionDirty: false,
  overlayDirty: false,
  eraVisibilityDirty: false
};
let renderRaf = 0;

function resetRenderInvalidation(): void {
  renderInvalidation.geometryDirty = false;
  renderInvalidation.styleDirty = false;
  renderInvalidation.selectionDirty = false;
  renderInvalidation.overlayDirty = false;
  renderInvalidation.eraVisibilityDirty = false;
}

function applySelectionHighlight(): void {
  if (state.selId) {
    boundHiN(state.selId);
    return;
  }
  if (state.selEdge) {
    boundHiE(state.selEdge);
    return;
  }
  boundClH();
}

function flushRenderQueue(): void {
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

function requestRender(
  invalidation: Partial<RenderInvalidation> = { geometryDirty: true },
  opts: { resetZoom?: boolean; immediate?: boolean } = {}
): void {
  const entries = Object.entries(invalidation) as Array<[keyof RenderInvalidation, boolean | undefined]>;
  for (const [key, value] of entries) {
    if (value) renderInvalidation[key] = true;
  }
  if (opts.resetZoom) {
    state.tr = d3.zoomIdentity as any;
  }
  if (opts.immediate) {
    flushRenderQueue();
    return;
  }
  if (renderRaf) return;
  renderRaf = requestAnimationFrame(() => {
    renderRaf = 0;
    flushRenderQueue();
  });
}

// Expose globally for inline onclick handlers in sidebar HTML
(window as any).goF = boundGoF;
(window as any).showOfficeDetail = showOfficeDetail;
(window as any).setCmpA = setCompareA;
(window as any).setCmpB = setCompareB;
(window as any).armCmp = armCompareFrom;
(window as any).swapCmp = swapCompare;
(window as any).clrCmp = clearCompare;

// ---------------------------------------------------------------------------
// Filter wrapper for rebuild
// ---------------------------------------------------------------------------

function filt(): { nodes: PersonNode[]; links: EdgeRecord[] } {
  const y = state.eraYear ?? ERA.max;
  const eraPersonOk = new Set<string>(
    typedPeople
      .filter(p => !state.eraEnabled || activeInYearById(p.id, y))
      .map(p => p.id)
  );

  const input = {
    activeEdgeTypes: activeE(),
    activeConfidence: activeConfidence(),
    dynastyValue: '__all__',
    sourceGradeValue: (document.getElementById('sqf') as HTMLSelectElement | null)?.value || '__all__',
    eraEnabled: state.eraEnabled,
    eraYear: y,
    eraPersonOk
  };
  const result = filterCore(typedPeople, typedEdges, input, personName as any);

  // Apply tree/dynasty dropdown filter
  const dynastyVal = (document.getElementById('df') as HTMLSelectElement | null)?.value || '__all__';
  const treeVal = (document.getElementById('tf') as HTMLSelectElement | null)?.value || '__all__';
  const filtered = applyTreeDynastyFilter(result, dynastyVal, treeVal);

  state._treesMeta = result.treesMeta ?? [];
  return { nodes: filtered.nodes, links: filtered.links };
}

// ---------------------------------------------------------------------------
// Init modules
// ---------------------------------------------------------------------------

const savedView = loadViewState();

let graphInteractionTimer: number | null = null;
let zoomEventRaf: number | null = null;
let pendingZoomDetail: { x: number; y: number; k: number } | null = null;
let zoomTransformRaf: number | null = null;
let pendingZoomTransform: any = null;
let zoomLayerEl: SVGGElement | null = null;

function getZoomLayerEl(): SVGGElement | null {
  if (zoomLayerEl && document.body.contains(zoomLayerEl)) return zoomLayerEl;
  zoomLayerEl = document.querySelector('#sv .gg');
  return zoomLayerEl;
}

function scheduleZoomTransform(transform: any): void {
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

function ensureGraphInteractionStyles(): void {
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

function emitZoomChanged(detail: { x: number; y: number; k: number }): void {
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

function setGraphInteractionMode(active: boolean): void {
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

// Zoom behavior
state.zoomBehavior = (d3 as any).zoom().scaleExtent([0.08, 4])
  .on('start', () => {
    setGraphInteractionMode(true);
  })
  .on('zoom', (e: any) => {
    state.tr = e.transform;
    scheduleZoomTransform(e.transform);
    emitZoomChanged({ x: e.transform.x, y: e.transform.y, k: e.transform.k });
  })
  .on('end', () => {
    setGraphInteractionMode(false);
  });

function updateTranslateExtent(): void {
  const gNode = document.querySelector('#sv .gg') as SVGGElement | null;
  if (!gNode) return;
  const bb = gNode.getBBox();
  if (!Number.isFinite(bb.width) || bb.width <= 0) return;
  const padX = Math.max(state.W, bb.width * 1.5);
  const padY = Math.max(state.H, bb.height * 1.5);
  (state.zoomBehavior as any).translateExtent([
    [bb.x - padX, bb.y - padY],
    [bb.x + bb.width + padX, bb.y + bb.height + padY]
  ]);
}

// Theme
if (savedView && (savedView.theme === 'dark' || savedView.theme === 'light')) {
  document.documentElement.dataset.theme = savedView.theme as string;
  const bt = document.getElementById('bt');
  if (bt) bt.textContent = savedView.theme === 'dark' ? '\u2600' : '\u263E';
}
initTheme(() => requestRender({ styleDirty: true }));
initSheet();
initCommandBar();

// i18n
initLanguageControl((savedView?.lang as string) || 'en');

// Init sidebar (dependency injection)
initSidebar({
  byId: typedById,
  people: typedPeople,
  edges: typedEdges,
  sourceById: sourceById as Map<string, any>,
  officeById: officeById as Map<string, any>,
  officeTimeline: officeTimeline as any[],
  fR, esc,
  personName: personName as any,
  relationLabel,
  t, getLang,
  gNb: boundGNb as any,
  parOf: boundParOf as any,
  chOf: boundChOf as any,
  recordPerson,
  recordEdge: recordEdge as any,
  recordOffice,
  compareSummaryHtml,
  handlePersonViewed,
  oS,
  resolvePlace: resolvePlace as any,
  extractPlaceMentions: extractPlaceMentions as any,
  placeLabelForLang: placeLabelForLang as any,
  getInferenceNote: getInferenceNote as any,
  getInferenceDossierPath: getInferenceDossierPath as any,
  inferenceEdgeKey: inferenceEdgeKey as any,
  isDerivedInferenceEdge: isDerivedInferenceEdge as any,
  officeFunctionForYear: officeFunctionForYear as any,
  buildOfficeHolders: buildOfficeHolders as any
});

// Init rebuild (dependency injection)
initRebuild({
  state,
  d3: d3 as any,
  filt: filt as any,
  hiN: boundHiN,
  hiE: boundHiE,
  clH: boundClH,
  showD,
  showLinkDetail,
  cs, eC, nC,
  fR, esc,
  personName: personName as any,
  relationLabel,
  t,
  showNodeHoverCard: boundShowNodeHoverCard,
  moveHoverCard: boundMoveHoverCard,
  hideHoverCard: boundHideHoverCard,
  computeTreePlacement,
  dynastyTransitions: dynastyTransitions as any[],
  eraMilestones: eraMilestones as any[],
  timeExtent: ERA as any
});

// Compare
let _sidebarRefreshing = false;
function refreshSidebar(): void {
  if (_sidebarRefreshing) return;
  _sidebarRefreshing = true;
  try {
    withHistoryMuted(() => {
      if (state.selId) showD(state.selId);
      else if (state.selEdge) showLinkDetail(state.selEdge);
    });
  } finally {
    _sidebarRefreshing = false;
  }
}

initCompare(
  {
    byId: typedById,
    fR, esc,
    personName: personName as any,
    t,
    findRelationshipPath: pathfinder.findRelationshipPath as any
  },
  () => refreshSidebar()
);

// Exporter
initExporter({
  state,
  byId: typedById,
  sourceById: sourceById as Map<string, any>,
  getLang
});

// Minimap
initMinimap(state, d3 as any);

// Timeline visualization
initTimelineViz();

// Search runtime (TS search + command palette)
initSearchRuntime(document);

// ---------------------------------------------------------------------------
// Era controls
// ---------------------------------------------------------------------------

function normalizeDensity(v: string): 'compact' | 'comfortable' | 'presentation' {
  return v === 'compact' || v === 'presentation' ? v : 'comfortable';
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function applyDensityMode(v: string, opts: { rebuildNow?: boolean } = {}): void {
  state.density = normalizeDensity(v);
  document.documentElement.dataset.density = state.density;
  const dns = document.getElementById('dns') as HTMLSelectElement | null;
  if (dns) dns.value = state.density;
  if (opts.rebuildNow !== false) requestRender({ styleDirty: true });
}

function centuryLabel(y: number): string {
  const c = Math.floor((y - 1) / 100) + 1;
  const suf = c % 10 === 1 && c % 100 !== 11 ? 'st'
    : c % 10 === 2 && c % 100 !== 12 ? 'nd'
      : c % 10 === 3 && c % 100 !== 13 ? 'rd'
        : 'th';
  return `${c}${suf} c.`;
}

let eraRaf = 0;
let eraDebounceTimer = 0;
function queueEraRebuild(): void {
  if (eraRaf) return;
  eraRaf = requestAnimationFrame(() => {
    eraRaf = 0;
    requestRender({ eraVisibilityDirty: true });
  });
}
function queueEraDebouncedRebuild(): void {
  if (eraRaf) { cancelAnimationFrame(eraRaf); eraRaf = 0; }
  clearTimeout(eraDebounceTimer);
  eraDebounceTimer = window.setTimeout(() => {
    eraDebounceTimer = 0;
    const y = state.eraYear ?? ERA.max;
    const eraPersonOk = computeEraPersonOk(
      typedPeople, state.eraEnabled, y, activeInYearById as any
    );
    const needsFull = updateEraVisibility(eraPersonOk);
    if (needsFull) requestRender({ eraVisibilityDirty: true });
  }, 150);
}

function emitEraChanged(): void {
  window.dispatchEvent(new CustomEvent('era-changed', {
    detail: { enabled: state.eraEnabled, year: state.eraYear, playing: state.eraPlaying }
  }));
}

function stopEraPlayback(): void {
  if (state.eraTimer) {
    clearInterval(state.eraTimer);
    state.eraTimer = null;
  }
  state.eraPlaying = false;
  const playBtn = document.getElementById('epy');
  if (playBtn) {
    playBtn.textContent = '\u25b6';
    playBtn.classList.remove('on');
  }
  emitEraChanged();
}

function renderEraUi(): void {
  const eta = document.getElementById('eta');
  const ey = document.getElementById('ey') as HTMLInputElement | null;
  const eyv = document.getElementById('eyv');
  const epy = document.getElementById('epy');
  if (!eta || !ey || !eyv || !epy) return;
  const yRaw = Number.isFinite(state.eraYear) ? state.eraYear! : ERA.max;
  const y = Math.max(ERA.min, Math.min(ERA.max, yRaw));
  state.eraYear = y;

  const yAtmosphere = state.eraEnabled ? y : (ERA.min + ERA.max) / 2;
  const eraRatio = (yAtmosphere - ERA.min) / Math.max(1, ERA.max - ERA.min);
  let light: string, warm: string;
  if (eraRatio < 0.25) {
    light = (0.04 + eraRatio * 0.08).toFixed(3);
    warm = (0.06 + eraRatio * 0.04).toFixed(3);
  } else if (eraRatio < 0.6) {
    const sub = (eraRatio - 0.25) / 0.35;
    light = (0.06 + sub * 0.08).toFixed(3);
    warm = (0.08 + sub * 0.08).toFixed(3);
  } else {
    const sub = (eraRatio - 0.6) / 0.4;
    light = (0.14 - sub * 0.04).toFixed(3);
    warm = (0.16 - sub * 0.08).toFixed(3);
  }
  document.documentElement.style.setProperty('--era-light', light);
  document.documentElement.style.setProperty('--era-warm', warm);
  eta.classList.toggle('on', state.eraEnabled);
  eta.setAttribute('aria-pressed', state.eraEnabled ? 'true' : 'false');
  eta.textContent = state.eraEnabled ? t('era') : t('all_eras');
  ey.disabled = !state.eraEnabled;
  ey.value = String(y);
  eyv.textContent = state.eraEnabled
    ? `${y} \u00b7 ${centuryLabel(y)}`
    : `${t('all_years')} ${ERA.min}\u2013${ERA.max}`;
  epy.textContent = state.eraPlaying ? '||' : '\u25b6';
  epy.classList.toggle('on', state.eraPlaying);
  epy.setAttribute('aria-pressed', state.eraPlaying ? 'true' : 'false');
}

function setEraEnabled(on: boolean, opts: { rebuildNow?: boolean } = {}): void {
  state.eraEnabled = Boolean(on);
  if (!state.eraEnabled) stopEraPlayback();
  renderEraUi();
  emitEraChanged();
  if (opts.rebuildNow !== false) queueEraRebuild();
}

function setEraYear(y: number, opts: { rebuildNow?: boolean } = {}): void {
  const next = Math.max(ERA.min, Math.min(ERA.max, Number(y)));
  if (!Number.isFinite(next)) return;
  state.eraYear = next;
  renderEraUi();
  emitEraChanged();
  if (opts.rebuildNow !== false) queueEraRebuild();
}

function startEraPlayback(): void {
  if (state.eraPlaying) return;
  if (!state.eraEnabled) setEraEnabled(true, { rebuildNow: false });
  if (!Number.isFinite(state.eraYear!)) state.eraYear = ERA.max;
  if (state.eraYear! >= ERA.max) setEraYear(ERA.min, { rebuildNow: false });
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

function initEraControls(): void {
  const eta = document.getElementById('eta');
  const ey = document.getElementById('ey') as HTMLInputElement | null;
  const epy = document.getElementById('epy');
  if (!eta || !ey || !epy) return;
  ey.min = String(ERA.min);
  ey.max = String(ERA.max);
  ey.step = '1';
  if (!Number.isFinite(state.eraYear!)) state.eraYear = ERA.max;
  renderEraUi();
  eta.addEventListener('click', () => setEraEnabled(!state.eraEnabled));
  ey.addEventListener('input', () => {
    if (!state.eraEnabled) setEraEnabled(true, { rebuildNow: false });
    setEraYear(Number(ey.value), { rebuildNow: false });
    queueEraDebouncedRebuild();
  });
  ey.addEventListener('change', () => {
    if (!state.eraEnabled) setEraEnabled(true, { rebuildNow: false });
    clearTimeout(eraDebounceTimer);
    eraDebounceTimer = 0;
    setEraYear(Number(ey.value), { rebuildNow: true });
  });
  epy.addEventListener('click', () => {
    if (state.eraPlaying) stopEraPlayback();
    else startEraPlayback();
  });
}

function syncEraToStoryStep(payload: { step?: { year?: number } }): void {
  const y = Number(payload?.step?.year);
  if (!Number.isFinite(y)) return;
  if (state.eraPlaying) stopEraPlayback();
  if (!state.eraEnabled) setEraEnabled(true, { rebuildNow: false });
  setEraYear(y, { rebuildNow: true });
}

initEraControls();

// Story trails
initStoryTrails(
  { storyTrails: storyTrails as any[], byId: typedById, goF: boundGoF },
  { onStepChange: syncEraToStoryStep as any }
);

// ---------------------------------------------------------------------------
// Filter panel
// ---------------------------------------------------------------------------

function initFilterPanel(): void {
  const fpBtn = document.getElementById('fp');
  const fpClose = document.getElementById('fpClose');
  const panel = document.getElementById('filterPanel');
  if (!fpBtn || !panel) return;

  function togglePanel(): void {
    state.filterPanelOpen = !state.filterPanelOpen;
    panel!.classList.toggle('open', state.filterPanelOpen);
    fpBtn!.classList.toggle('on', state.filterPanelOpen);
    fpBtn!.setAttribute('aria-pressed', state.filterPanelOpen ? 'true' : 'false');
  }

  fpBtn.addEventListener('click', togglePanel);
  fpClose?.addEventListener('click', () => {
    state.filterPanelOpen = false;
    panel.classList.remove('open');
    fpBtn.classList.remove('on');
    fpBtn.setAttribute('aria-pressed', 'false');
  });

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    const tag = (document.activeElement as HTMLElement | null)?.tagName;
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

initFilterPanel();

// ---------------------------------------------------------------------------
// Sidebar & selection
// ---------------------------------------------------------------------------

interface HistoryEntry { type: string; id?: string; s?: string; d?: string; rel?: string }

function edgeHistoryKey(s: string, d: string, rel: string): string {
  const a = s < d ? s : d;
  const b = s < d ? d : s;
  return `${a}|${b}|${rel || 'kin'}`;
}

function findEdgeFromHistoryEntry(entry: HistoryEntry | null): LinkDatum | null {
  if (!entry || entry.type !== 'edge') return null;
  if (entry.s && entry.d) {
    const edgeIdx = (state as any)._edgeBySelectionKey as Map<string, LinkDatum> | undefined;
    const direct = edgeIdx?.get(edgeHistoryKey(entry.s, entry.d, entry.rel || 'kin'));
    if (direct) return direct;
  }
  return state.links.find(l => {
    const s = typeof l.source === 'object' ? l.source.id : l.source;
    const tId = typeof l.target === 'object' ? l.target.id : l.target;
    const dir = (s === entry.s && tId === entry.d) || (s === entry.d && tId === entry.s);
    if (!dir) return false;
    if (entry.rel && l._e?.t !== entry.rel) return false;
    return true;
  }) || null;
}

function snapshotSelectedEdge(link: LinkDatum | null): HistoryEntry | null {
  if (!link) return null;
  const s = typeof link.source === 'object' ? link.source.id : link.source;
  const d = typeof link.target === 'object' ? link.target.id : link.target;
  if (!s || !d) return null;
  return { type: 'edge', s, d, rel: link._e?.t || 'kin' };
}

function showEmptySidebar(): void {
  const sT = document.getElementById('sT');
  const sM = document.getElementById('sM');
  const sN = document.getElementById('sN');
  const sR = document.getElementById('sR');
  if (sT) { sT.textContent = t('select_sovereign'); sT.classList.add('emp'); }
  if (sM) sM.innerHTML = '';
  if (sN) sN.innerHTML = t('click_node_details');
  if (sR) sR.innerHTML = '';
  window.dispatchEvent(new CustomEvent('selection-changed', { detail: { type: 'none' } }));
}

function renderSidebarToggleUi(): void {
  const label = state.sidebarOpen ? t('hide_sidebar') : t('show_sidebar');
  for (const id of ['vms', 'vms2']) {
    const btn = document.getElementById(id);
    if (!btn) continue;
    btn.classList.toggle('on', state.sidebarOpen);
    btn.setAttribute('aria-pressed', state.sidebarOpen ? 'true' : 'false');
    btn.textContent = t('details_panel');
    btn.title = label;
    btn.setAttribute('aria-label', label);
  }
  const closeBtn = document.getElementById('sideClose');
  if (closeBtn) {
    closeBtn.title = t('close_sidebar');
    closeBtn.setAttribute('aria-label', t('close_sidebar'));
  }
}

function setSidebarOpen(open: boolean, opts: { rebuildNow?: boolean } = {}): void {
  state.sidebarOpen = Boolean(open);
  document.body.classList.toggle('sidebar-collapsed', !state.sidebarOpen);
  renderSidebarToggleUi();
  if (opts.rebuildNow) {
    requestRender({ geometryDirty: true }, { immediate: true });
    setTimeout(updateTranslateExtent, 500);
    return;
  }
  requestAnimationFrame(() => {
    const area = document.getElementById('ga');
    if (area) {
      state.W = area.clientWidth;
      state.H = area.clientHeight;
    }
    if (state.viewMode === 'graph' && state.sim) {
      const sim = state.sim as any;
      sim.force('center', (d3 as any).forceCenter(state.W / 2, state.H / 2));
      const xForce = sim.force('x');
      const yForce = sim.force('y');
      if (xForce) xForce.x(state.W / 2);
      if (yForce) yForce.y(state.H / 2);
      sim.alpha(0.03).restart();
    }
    updateTranslateExtent();
  });
}

function fitToContent(): void {
  if (!state.svgEl) return;
  const gNode = document.querySelector('#sv .gg') as SVGGElement | null;
  const svgEl = state.svgEl as any;
  const zoomBehavior = state.zoomBehavior as any;
  if (!gNode) {
    svgEl.transition().duration(prefersReducedMotion() ? 0 : 400).call(zoomBehavior.transform, d3.zoomIdentity);
    return;
  }
  const bb = gNode.getBBox();
  if (!Number.isFinite(bb.width) || !Number.isFinite(bb.height) || bb.width <= 0 || bb.height <= 0) {
    svgEl.transition().duration(prefersReducedMotion() ? 0 : 400).call(zoomBehavior.transform, d3.zoomIdentity);
    return;
  }
  const m = 28;
  const sx = (state.W - m * 2) / bb.width;
  const sy = (state.H - m * 2) / bb.height;
  const k = Math.max(0.12, Math.min(4, Math.min(sx, sy)));
  const x = (state.W - bb.width * k) / 2 - bb.x * k;
  const y = (state.H - bb.height * k) / 2 - bb.y * k;
  const tr = d3.zoomIdentity.translate(x, y).scale(k);
  svgEl.transition().duration(prefersReducedMotion() ? 0 : 400).call(zoomBehavior.transform, tr);
  setTimeout(updateTranslateExtent, 450);
}

function restoreSelection(snapshot: Record<string, unknown> | null): void {
  const sel = snapshot?.selection as HistoryEntry | undefined;
  if (!sel) return;
  withHistoryMuted(() => {
    if (sel.type === 'person' && sel.id) {
      boundGoF(sel.id);
      return;
    }
    if (sel.type === 'edge' && sel.s && sel.d) {
      const link = findEdgeFromHistoryEntry(sel);
      if (!link) return;
      state.selId = null;
      state.selEdge = link;
      boundHiE(link);
      showLinkDetail(link);
    }
  });
}

function refreshFocusOverlay(): void {
  requestRender(
    { overlayDirty: true, selectionDirty: true },
    { resetZoom: true }
  );
}

// History
initHistory(
  (entry: any) => {
    withHistoryMuted(() => {
      if (entry.type === 'person') {
        boundGoF(entry.id);
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
        boundHiE(link);
        showLinkDetail(link);
      }
    });
  },
  {
    byId: typedById,
    officeById: officeById as any,
    fR, personName: personName as any,
    relationLabel, t
  }
);

let institutionsReturnSelection: HistoryEntry | null = null;

// ---------------------------------------------------------------------------
// Bottom sheet close
// ---------------------------------------------------------------------------

document.getElementById('bX')?.addEventListener('click', cS);
document.getElementById('ov')?.addEventListener('click', cS);

// ---------------------------------------------------------------------------
// Edge type & confidence chip toggles
// ---------------------------------------------------------------------------

document.querySelectorAll('.chip[data-e]').forEach(c => c.addEventListener('click', () => {
  c.classList.toggle('on');
  invalidateChipCache();
  requestRender({ geometryDirty: true }, { resetZoom: true });
}));
document.querySelectorAll('.chip[data-cf]').forEach(c => c.addEventListener('click', () => {
  c.classList.toggle('on');
  invalidateChipCache();
  requestRender({ geometryDirty: true }, { resetZoom: true });
}));

// ---------------------------------------------------------------------------
// Dropdown filters
// ---------------------------------------------------------------------------

document.getElementById('df')?.addEventListener('change', () => {
  requestRender({ geometryDirty: true }, { resetZoom: true });
});
document.getElementById('tf')?.addEventListener('change', () => {
  requestRender({ geometryDirty: true }, { resetZoom: true });
});
document.getElementById('sqf')?.addEventListener('change', () => {
  requestRender({ geometryDirty: true }, { resetZoom: true });
});

document.getElementById('dns')?.addEventListener('change', (e: Event) => {
  applyDensityMode((e.target as HTMLSelectElement).value, { rebuildNow: true });
});

document.getElementById('ovm')?.addEventListener('change', (e: Event) => {
  const v = (e.target as HTMLSelectElement).value;
  state.overlayMode = v === 'confidence' || v === 'source' ? v : 'relation';
  refreshFocusOverlay();
});

// ---------------------------------------------------------------------------
// Institutions pane
// ---------------------------------------------------------------------------

document.getElementById('vmi')?.addEventListener('click', () => {
  const btn = document.getElementById('vmi')!;
  const isOpen = btn.classList.contains('on');
  if (isOpen) {
    btn.classList.remove('on');
    btn.setAttribute('aria-pressed', 'false');
    if (institutionsReturnSelection?.type === 'person' && institutionsReturnSelection.id) {
      boundGoF(institutionsReturnSelection.id);
    } else if (institutionsReturnSelection?.type === 'edge') {
      const link = findEdgeFromHistoryEntry(institutionsReturnSelection);
      if (link) {
        state.selId = null;
        state.selEdge = link;
        boundHiE(link);
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
  boundClH();
  showInstitutionsPane();
});

// ---------------------------------------------------------------------------
// Sidebar toggles
// ---------------------------------------------------------------------------

document.getElementById('vms')?.addEventListener('click', () => setSidebarOpen(!state.sidebarOpen));
document.getElementById('vms2')?.addEventListener('click', () => setSidebarOpen(!state.sidebarOpen));
document.getElementById('sideClose')?.addEventListener('click', () => setSidebarOpen(false));

// ---------------------------------------------------------------------------
// Focus mode
// ---------------------------------------------------------------------------

document.getElementById('fm')?.addEventListener('click', () => {
  state.focusMode = !state.focusMode;
  const btn = document.getElementById('fm')!;
  btn.classList.toggle('on', state.focusMode);
  btn.setAttribute('aria-pressed', state.focusMode ? 'true' : 'false');
  if (state.selId) boundHiN(state.selId);
  else if (state.selEdge) boundHiE(state.selEdge);
  else boundClH();
  window.dispatchEvent(new CustomEvent('selection-changed', {
    detail: state.selId ? { type: 'person', id: state.selId }
      : state.selEdge ? { type: 'edge' }
        : { type: 'none' }
  }));
});

// ---------------------------------------------------------------------------
// View mode toggles
// ---------------------------------------------------------------------------

document.getElementById('vmg')?.addEventListener('click', () => {
  document.body.classList.remove('graph-interacting');
  state.viewMode = 'graph';
  document.getElementById('vmg')?.classList.add('on');
  document.getElementById('vmt')?.classList.remove('on');
  document.getElementById('vmg')?.setAttribute('aria-pressed', 'true');
  document.getElementById('vmt')?.setAttribute('aria-pressed', 'false');
  requestRender({ geometryDirty: true }, { resetZoom: true });
  updateTreeOptionsVisibility();
});

document.getElementById('vmt')?.addEventListener('click', () => {
  document.body.classList.remove('graph-interacting');
  state.viewMode = 'tree';
  document.getElementById('vmt')?.classList.add('on');
  document.getElementById('vmg')?.classList.remove('on');
  document.getElementById('vmt')?.setAttribute('aria-pressed', 'true');
  document.getElementById('vmg')?.setAttribute('aria-pressed', 'false');
  const parentChip = document.querySelector('.chip[data-e="parent"]');
  if (parentChip && !parentChip.classList.contains('on')) parentChip.classList.add('on');
  requestRender({ geometryDirty: true }, { resetZoom: true });
  updateTreeOptionsVisibility();
});

// ---------------------------------------------------------------------------
// Fit & reset
// ---------------------------------------------------------------------------

document.getElementById('bf')?.addEventListener('click', () => fitToContent());
document.getElementById('resetView')?.addEventListener('click', () => fitToContent());

document.getElementById('br')?.addEventListener('click', () => {
  document.body.classList.remove('graph-interacting');
  const si = document.getElementById('si') as HTMLInputElement | null;
  if (si) si.value = '';
  document.getElementById('dd')?.classList.remove('open');
  const df = document.getElementById('df') as HTMLSelectElement | null;
  const tf = document.getElementById('tf') as HTMLSelectElement | null;
  const sqf = document.getElementById('sqf') as HTMLSelectElement | null;
  if (df) df.value = '__all__';
  if (tf) tf.value = '__all__';
  if (sqf) sqf.value = '__all__';
  applyDensityMode('comfortable', { rebuildNow: false });
  document.querySelectorAll('.chip[data-e]').forEach(c => c.classList.add('on'));
  document.querySelectorAll('.chip[data-cf]').forEach(c => c.classList.add('on'));
  invalidateChipCache();
  state.viewMode = 'graph';
  document.getElementById('vmg')?.classList.add('on');
  document.getElementById('vmt')?.classList.remove('on');
  document.getElementById('vmg')?.setAttribute('aria-pressed', 'true');
  document.getElementById('vmt')?.setAttribute('aria-pressed', 'false');
  state.focusMode = false;
  state.overlayMode = 'relation';
  stopEraPlayback();
  state.eraEnabled = false;
  state.eraYear = ERA.max;
  renderEraUi();
  document.getElementById('fm')?.classList.remove('on');
  document.getElementById('fm')?.setAttribute('aria-pressed', 'false');
  document.getElementById('vmi')?.classList.remove('on');
  document.getElementById('vmi')?.setAttribute('aria-pressed', 'false');
  const ovm = document.getElementById('ovm') as HTMLSelectElement | null;
  if (ovm) ovm.value = 'relation';
  state.selId = null;
  state.selEdge = null;
  clearCompare();
  clearStoryTrail();
  boundClH();
  clearHistory();
  cS();
  institutionsReturnSelection = null;
  showEmptySidebar();
  requestRender({ geometryDirty: true }, { resetZoom: true, immediate: true });
});

// ---------------------------------------------------------------------------
// Populate dynasty dropdown
// ---------------------------------------------------------------------------

dyS.forEach(d => {
  const o = document.createElement('option');
  o.value = d; o.textContent = d;
  document.getElementById('df')?.appendChild(o);
});

// ---------------------------------------------------------------------------
// Apply saved view state & initial render
// ---------------------------------------------------------------------------

applyViewState(savedView, state, d3 as any, setCompareState as (data: unknown) => void);
setLanguage(state.lang, { silent: true });
applyDensityMode(state.density, { rebuildNow: false });
setSidebarOpen(state.sidebarOpen, { rebuildNow: false });
if (!Number.isFinite(state.eraYear!)) state.eraYear = ERA.max;
renderEraUi();
showEmptySidebar();

// Stats line
const st = document.getElementById('st');
if (st) st.textContent = typedPeople.length + ' \u00b7 ' + typedEdges.length + (mode === 'research' ? ' \u00b7 research' : '');

rebuild();
setTimeout(updateTranslateExtent, 1200);
restoreSelection(savedView);

initViewStatePersistence(state, d3 as any, getCompareState);
initKeyboardNav({ state, showD, hiN: boundHiN, fitToContent });
initTreeOptions({
  state,
  d3: d3 as any,
  edges: typedEdges as any[],
  t, esc,
  rebuild
});

setTimeout(() => initOnboarding(), 100);

// ---------------------------------------------------------------------------
// Global event listeners
// ---------------------------------------------------------------------------

window.addEventListener('request-sidebar-open', () => {
  if (!state.sidebarOpen) setSidebarOpen(true);
});

window.addEventListener('selection-changed', ((e: CustomEvent) => {
  const live = document.getElementById('a11y-live');
  if (!live) return;
  const detail = e.detail;
  if (detail?.type === 'person' && detail.id) {
    const nodeById = (state as any)._nodeById as Map<string, PersonNode> | undefined;
    const node = nodeById?.get(detail.id) || state.nodes.find(n => n.id === detail.id);
    live.textContent = node ? `Selected: ${node.nm || detail.id}` : '';
  } else if (detail?.type === 'office' && detail.officeId) {
    live.textContent = `Office selected: ${detail.officeId}`;
  } else if (detail?.type === 'edge') {
    live.textContent = 'Relationship selected';
  } else {
    live.textContent = '';
  }
}) as EventListener);

window.addEventListener('lang-changed', () => {
  renderSidebarToggleUi();
  renderEraUi();
  refreshTreeOptionLabels();
  if (_sidebarRefreshing) return;
  _sidebarRefreshing = true;
  try {
    withHistoryMuted(() => {
      const vmi = document.getElementById('vmi');
      if (vmi?.classList.contains('on')) { showInstitutionsPane(); return; }
      const officeId = getCurrentOfficeId();
      if (officeId) { showOfficeDetail(officeId); return; }
      if (state.selId) { showD(state.selId); return; }
      if (state.selEdge) { showLinkDetail(state.selEdge); return; }
      showEmptySidebar();
    });
  } finally {
    _sidebarRefreshing = false;
  }
});

window.addEventListener('resize', () => {
  const area = document.getElementById('ga');
  if (area) {
    state.W = area.clientWidth;
    state.H = area.clientHeight;
  }
});

let parallaxLast = 0;
window.addEventListener('zoom-changed', ((e: CustomEvent) => {
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
}) as EventListener);

function shouldRegisterServiceWorker(): boolean {
  if (typeof window === 'undefined') return false;
  const { hostname, search } = window.location;
  const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
  const forceEnable = new URLSearchParams(search).get('sw') === 'on';
  return !isLocalHost || forceEnable;
}

// Service worker registration
if (shouldRegisterServiceWorker() && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // Offline support is best-effort.
    });
  });
}

import * as d3 from 'd3';
import state from '../state.js';

const KEY = 'maldives-genealogy:viewstate:v1';

function safeParse(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function linkIds(l) {
  if (!l) return { s: null, d: null };
  const s = typeof l.source === 'object' ? l.source.id : l.source;
  const d = typeof l.target === 'object' ? l.target.id : l.target;
  return { s, d };
}

function selectedEdgeState() {
  if (!state.selEdge) return null;
  const { s, d } = linkIds(state.selEdge);
  if (!s || !d) return null;
  return {
    type: 'edge',
    s,
    d,
    rel: state.selEdge?._e?.t || 'kin'
  };
}

function activeChips(selector, key) {
  return [...document.querySelectorAll(selector)]
    .filter(el => el.classList.contains('on'))
    .map(el => el.dataset[key])
    .filter(Boolean);
}

function setChips(selector, key, values) {
  if (!Array.isArray(values)) return;
  const set = new Set(values || []);
  document.querySelectorAll(selector).forEach(el => {
    const v = el.dataset[key];
    el.classList.toggle('on', set.has(v));
  });
}

export function loadViewState() {
  try {
    return safeParse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export function applyViewState(snapshot, setCompareState) {
  if (!snapshot) return;

  if (snapshot.theme === 'dark' || snapshot.theme === 'light') {
    document.documentElement.dataset.theme = snapshot.theme;
    const bt = document.getElementById('bt');
    if (bt) bt.textContent = snapshot.theme === 'dark' ? '\u2600' : '\u263E';
  }

  const df = document.getElementById('df');
  const tf = document.getElementById('tf');
  const sqf = document.getElementById('sqf');
  const dns = document.getElementById('dns');
  const ovm = document.getElementById('ovm');
  const lng = document.getElementById('lng');
  const si = document.getElementById('si');

  if (df && snapshot.filters?.df) df.value = snapshot.filters.df;
  if (tf && snapshot.filters?.tf != null) {
    const wanted = String(snapshot.filters.tf);
    tf.value = wanted;
    if (tf.value !== wanted) tf.dataset.savedValue = wanted;
  }
  if (sqf && snapshot.filters?.sqf) sqf.value = snapshot.filters.sqf;
  if (dns && snapshot.density) dns.value = snapshot.density;
  if (ovm && snapshot.overlayMode) ovm.value = snapshot.overlayMode;
  if (lng && snapshot.lang) lng.value = snapshot.lang;
  if (si && typeof snapshot.search === 'string') si.value = snapshot.search;

  setChips('.chip[data-e]', 'e', snapshot.filters?.edge);
  setChips('.chip[data-cf]', 'cf', snapshot.filters?.confidence);

  state.viewMode = snapshot.viewMode === 'tree' ? 'tree' : 'graph';
  state.lang = snapshot.lang === 'dv' ? 'dv' : 'en';
  state.density = snapshot.density === 'compact' || snapshot.density === 'presentation' ? snapshot.density : 'comfortable';
  state.sidebarOpen = snapshot.sidebarOpen !== false;
  state.focusMode = Boolean(snapshot.focusMode);
  state.overlayMode = snapshot.overlayMode === 'confidence' || snapshot.overlayMode === 'source' ? snapshot.overlayMode : 'relation';
  state.eraEnabled = Boolean(snapshot.eraEnabled);
  state.eraYear = Number.isFinite(snapshot.eraYear) ? Number(snapshot.eraYear) : state.eraYear;
  state.filterPanelOpen = Boolean(snapshot.filterPanelOpen);
  state.minimapVisible = Boolean(snapshot.minimapVisible);
  // Restore filter panel open state
  const filterPanel = document.getElementById('filterPanel');
  const fpBtn = document.getElementById('fp');
  if (filterPanel) filterPanel.classList.toggle('open', state.filterPanelOpen);
  if (fpBtn) {
    fpBtn.classList.toggle('on', state.filterPanelOpen);
    fpBtn.setAttribute('aria-pressed', state.filterPanelOpen ? 'true' : 'false');
  }
  // Restore minimap visibility
  const minimap = document.getElementById('minimap');
  if (minimap) minimap.hidden = !state.minimapVisible;
  document.getElementById('vmg')?.classList.toggle('on', state.viewMode === 'graph');
  document.getElementById('vmt')?.classList.toggle('on', state.viewMode === 'tree');
  document.getElementById('fm')?.classList.toggle('on', state.focusMode);
  document.getElementById('vmg')?.setAttribute('aria-pressed', state.viewMode === 'graph' ? 'true' : 'false');
  document.getElementById('vmt')?.setAttribute('aria-pressed', state.viewMode === 'tree' ? 'true' : 'false');
  document.getElementById('fm')?.setAttribute('aria-pressed', state.focusMode ? 'true' : 'false');
  document.getElementById('vmi')?.setAttribute('aria-pressed', 'false');
  document.documentElement.dataset.density = state.density;
  if (dns) dns.value = state.density;
  const ey = document.getElementById('ey');
  if (ey && Number.isFinite(state.eraYear)) ey.value = String(state.eraYear);
  if (ovm) ovm.value = state.overlayMode;

  if (snapshot.zoom && Number.isFinite(snapshot.zoom.x) && Number.isFinite(snapshot.zoom.y) && Number.isFinite(snapshot.zoom.k)) {
    state.tr = d3.zoomIdentity.translate(snapshot.zoom.x, snapshot.zoom.y).scale(snapshot.zoom.k);
  }

  if (snapshot.compare && typeof setCompareState === 'function') {
    setCompareState(snapshot.compare);
  }
}

export function saveViewState(getCompareState) {
  const tr = state.tr || d3.zoomIdentity;
  const selection = state.selId
    ? { type: 'person', id: state.selId }
    : selectedEdgeState();

  const snapshot = {
    version: 1,
    saved_at: new Date().toISOString(),
    theme: document.documentElement.dataset.theme || 'dark',
    viewMode: state.viewMode || 'graph',
    lang: state.lang || 'en',
    density: state.density || 'comfortable',
    sidebarOpen: state.sidebarOpen !== false,
    focusMode: Boolean(state.focusMode),
    overlayMode: state.overlayMode || 'relation',
    eraEnabled: Boolean(state.eraEnabled),
    eraYear: Number.isFinite(state.eraYear) ? Number(state.eraYear) : null,
    filterPanelOpen: Boolean(state.filterPanelOpen),
    minimapVisible: Boolean(state.minimapVisible),
    filters: {
      df: document.getElementById('df')?.value || '__all__',
      tf: document.getElementById('tf')?.value || '__all__',
      sqf: document.getElementById('sqf')?.value || '__all__',
      edge: activeChips('.chip[data-e]', 'e'),
      confidence: activeChips('.chip[data-cf]', 'cf')
    },
    search: document.getElementById('si')?.value || '',
    zoom: { x: tr.x, y: tr.y, k: tr.k },
    selection,
    compare: typeof getCompareState === 'function' ? getCompareState() : null
  };

  try {
    localStorage.setItem(KEY, JSON.stringify(snapshot));
  } catch {
    // Ignore persistence failures (private mode / disabled storage).
  }
  return snapshot;
}

export function initViewStatePersistence(getCompareState) {
  let t = null;
  const flush = () => {
    t = null;
    saveViewState(getCompareState);
  };
  const schedule = () => {
    if (t) clearTimeout(t);
    t = setTimeout(flush, 220);
  };

  const onChangeIds = ['df', 'tf', 'sqf', 'dns', 'ovm', 'ey', 'lng'];
  onChangeIds.forEach(id => document.getElementById(id)?.addEventListener('change', schedule));
  document.getElementById('ey')?.addEventListener('input', schedule);
  document.getElementById('si')?.addEventListener('input', schedule);

  document.addEventListener('click', e => {
    if (
      e.target.closest('.chip[data-e]') ||
      e.target.closest('.chip[data-cf]') ||
      e.target.closest('#vmg') ||
      e.target.closest('#vmt') ||
      e.target.closest('#vms') ||
      e.target.closest('#vms2') ||
      e.target.closest('#bf') ||
      e.target.closest('#br') ||
      e.target.closest('#bt') ||
      e.target.closest('#eta') ||
      e.target.closest('#epy') ||
      e.target.closest('[data-token]')
    ) {
      schedule();
    }
  });

  window.addEventListener('selection-changed', schedule);
  window.addEventListener('compare-changed', schedule);
  window.addEventListener('zoom-changed', schedule);
  window.addEventListener('era-changed', schedule);
  window.addEventListener('resize', schedule);
  window.addEventListener('beforeunload', () => saveViewState(getCompareState));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveViewState(getCompareState);
  });

  schedule();
  return { schedule, flush: () => saveViewState(getCompareState) };
}

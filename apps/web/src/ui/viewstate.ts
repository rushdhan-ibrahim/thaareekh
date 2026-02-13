import type { AppState, ViewMode, Locale, Density, OverlayMode } from '../types/state.js';

type D3Like = typeof import('d3');

const KEY = 'maldives-genealogy:viewstate:v1';

// ---------------------------------------------------------------------------
// Pure helpers (testable)
// ---------------------------------------------------------------------------

export function safeParse(raw: string | null): Record<string, unknown> | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function linkIds(l: { source: unknown; target: unknown } | null): { s: string | null; d: string | null } {
  if (!l) return { s: null, d: null };
  const s = typeof l.source === 'object' && l.source !== null ? (l.source as { id: string }).id : l.source as string;
  const d = typeof l.target === 'object' && l.target !== null ? (l.target as { id: string }).id : l.target as string;
  return { s, d };
}

function selectedEdgeState(state: AppState): Record<string, string> | null {
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

export function activeChips(selector: string, key: string): string[] {
  return [...document.querySelectorAll(selector)]
    .filter(el => el.classList.contains('on'))
    .map(el => (el as HTMLElement).dataset[key])
    .filter((v): v is string => Boolean(v));
}

export function setChips(selector: string, key: string, values: unknown): void {
  if (!Array.isArray(values)) return;
  const set = new Set<string>(values as string[]);
  document.querySelectorAll(selector).forEach(el => {
    const v = (el as HTMLElement).dataset[key];
    el.classList.toggle('on', set.has(v!));
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function loadViewState(): Record<string, unknown> | null {
  try {
    return safeParse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export function applyViewState(
  snapshot: Record<string, unknown> | null,
  state: AppState,
  d3: D3Like,
  setCompareState?: (data: unknown) => void
): void {
  if (!snapshot) return;

  const filters = snapshot.filters as Record<string, unknown> | undefined;

  if (snapshot.theme === 'dark' || snapshot.theme === 'light') {
    document.documentElement.dataset.theme = snapshot.theme;
    const bt = document.getElementById('bt');
    if (bt) bt.textContent = snapshot.theme === 'dark' ? '\u2600' : '\u263E';
  }

  const df = document.getElementById('df') as HTMLSelectElement | null;
  const tf = document.getElementById('tf') as HTMLSelectElement | null;
  const sqf = document.getElementById('sqf') as HTMLSelectElement | null;
  const dns = document.getElementById('dns') as HTMLSelectElement | null;
  const ovm = document.getElementById('ovm') as HTMLSelectElement | null;
  const lng = document.getElementById('lng') as HTMLSelectElement | null;
  const si = document.getElementById('si') as HTMLInputElement | null;

  if (df && filters?.df) df.value = String(filters.df);
  if (tf && filters?.tf != null) {
    const wanted = String(filters.tf);
    tf.value = wanted;
    if (tf.value !== wanted) tf.dataset.savedValue = wanted;
  }
  if (sqf && filters?.sqf) sqf.value = String(filters.sqf);
  if (dns && snapshot.density) dns.value = String(snapshot.density);
  if (ovm && snapshot.overlayMode) ovm.value = String(snapshot.overlayMode);
  if (lng && snapshot.lang) lng.value = String(snapshot.lang);
  if (si && typeof snapshot.search === 'string') si.value = snapshot.search;

  setChips('.chip[data-e]', 'e', filters?.edge);
  setChips('.chip[data-cf]', 'cf', filters?.confidence);

  state.viewMode = (snapshot.viewMode === 'tree' ? 'tree' : 'graph') as ViewMode;
  state.lang = (snapshot.lang === 'dv' ? 'dv' : 'en') as Locale;
  state.density = (
    snapshot.density === 'compact' || snapshot.density === 'presentation'
      ? snapshot.density
      : 'comfortable'
  ) as Density;
  state.sidebarOpen = snapshot.sidebarOpen !== false;
  state.focusMode = Boolean(snapshot.focusMode);
  state.overlayMode = (
    snapshot.overlayMode === 'confidence' || snapshot.overlayMode === 'source'
      ? snapshot.overlayMode
      : 'relation'
  ) as OverlayMode;
  state.eraEnabled = Boolean(snapshot.eraEnabled);
  state.eraYear = Number.isFinite(snapshot.eraYear) ? Number(snapshot.eraYear) : state.eraYear;
  state.filterPanelOpen = Boolean(snapshot.filterPanelOpen);
  state.minimapVisible = Boolean(snapshot.minimapVisible);

  const filterPanel = document.getElementById('filterPanel');
  const fpBtn = document.getElementById('fp');
  if (filterPanel) filterPanel.classList.toggle('open', state.filterPanelOpen);
  if (fpBtn) {
    fpBtn.classList.toggle('on', state.filterPanelOpen);
    fpBtn.setAttribute('aria-pressed', state.filterPanelOpen ? 'true' : 'false');
  }

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
  const ey = document.getElementById('ey') as HTMLInputElement | null;
  if (ey && Number.isFinite(state.eraYear)) ey.value = String(state.eraYear);
  if (ovm) ovm.value = state.overlayMode;

  const zoom = snapshot.zoom as { x?: number; y?: number; k?: number } | undefined;
  if (zoom && Number.isFinite(zoom.x) && Number.isFinite(zoom.y) && Number.isFinite(zoom.k)) {
    state.tr = d3.zoomIdentity.translate(zoom.x!, zoom.y!).scale(zoom.k!);
  }

  if (snapshot.compare && typeof setCompareState === 'function') {
    setCompareState(snapshot.compare);
  }
}

export function saveViewState(
  state: AppState,
  d3: D3Like,
  getCompareState?: () => unknown
): Record<string, unknown> {
  const tr = (state.tr as { x: number; y: number; k: number }) || d3.zoomIdentity;
  const selection = state.selId
    ? { type: 'person', id: state.selId }
    : selectedEdgeState(state);

  const snapshot: Record<string, unknown> = {
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
      df: (document.getElementById('df') as HTMLSelectElement | null)?.value || '__all__',
      tf: (document.getElementById('tf') as HTMLSelectElement | null)?.value || '__all__',
      sqf: (document.getElementById('sqf') as HTMLSelectElement | null)?.value || '__all__',
      edge: activeChips('.chip[data-e]', 'e'),
      confidence: activeChips('.chip[data-cf]', 'cf')
    },
    search: (document.getElementById('si') as HTMLInputElement | null)?.value || '',
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

export function initViewStatePersistence(
  state: AppState,
  d3: D3Like,
  getCompareState?: () => unknown
): { schedule: () => void; flush: () => Record<string, unknown> } {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const flush = (): void => {
    timer = null;
    saveViewState(state, d3, getCompareState);
  };
  const schedule = (): void => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(flush, 220);
  };

  const onChangeIds = ['df', 'tf', 'sqf', 'dns', 'ovm', 'ey', 'lng'];
  onChangeIds.forEach(id => document.getElementById(id)?.addEventListener('change', schedule));
  document.getElementById('ey')?.addEventListener('input', schedule);
  document.getElementById('si')?.addEventListener('input', schedule);

  document.addEventListener('click', e => {
    const t = e.target as Element;
    if (
      t.closest('.chip[data-e]') ||
      t.closest('.chip[data-cf]') ||
      t.closest('#vmg') ||
      t.closest('#vmt') ||
      t.closest('#vms') ||
      t.closest('#vms2') ||
      t.closest('#bf') ||
      t.closest('#br') ||
      t.closest('#bt') ||
      t.closest('#eta') ||
      t.closest('#epy') ||
      t.closest('[data-token]')
    ) {
      schedule();
    }
  });

  window.addEventListener('selection-changed', schedule);
  window.addEventListener('compare-changed', schedule);
  window.addEventListener('zoom-changed', schedule);
  window.addEventListener('era-changed', schedule);
  window.addEventListener('resize', schedule);
  window.addEventListener('beforeunload', () => saveViewState(state, d3, getCompareState));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveViewState(state, d3, getCompareState);
  });

  schedule();
  return { schedule, flush: () => saveViewState(state, d3, getCompareState) };
}

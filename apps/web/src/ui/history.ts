import type { PersonNode } from '../types/state.js';

const MAX_ENTRIES = 80;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface HistoryEntry {
  type: 'person' | 'edge';
  id?: string;
  s?: string;
  d?: string;
  rel?: string;
  label?: string;
  short?: string;
  meta?: string;
}

interface HistoryState {
  entries: HistoryEntry[];
  idx: number;
  muted: boolean;
  onNavigate: ((entry: HistoryEntry) => void) | null;
}

// Module-level references to injected dependencies
let _byId: Map<string, PersonNode> = new Map();
let _fR: (re: Array<[number, number?]>) => string = () => '';
let _personName: (p: PersonNode | string, byId?: Map<string, PersonNode>) => string = (p) => typeof p === 'string' ? p : p.nm;
let _relationLabel: (t: string) => string = (t) => t;
let _t: (key: string) => string = (k) => k;

// ---------------------------------------------------------------------------
// Pure helpers (testable)
// ---------------------------------------------------------------------------

export function keyOf(entry: HistoryEntry | null): string {
  if (!entry) return '';
  if (entry.type === 'person') return `p|${entry.id}`;
  return `e|${entry.s}|${entry.d}|${entry.rel || ''}|${entry.label || ''}`;
}

export function isSame(a: HistoryEntry | null, b: HistoryEntry | null): boolean {
  return keyOf(a) === keyOf(b);
}

export function trimLabel(s: string | undefined, n: number = 34): string {
  if (!s) return '';
  return s.length > n ? `${s.slice(0, n - 1)}\u2026` : s;
}

// ---------------------------------------------------------------------------
// Internal state
// ---------------------------------------------------------------------------

const hist: HistoryState = {
  entries: [],
  idx: -1,
  muted: false,
  onNavigate: null
};

function endpointName(id: string): string {
  return _personName(_byId.get(id) ?? id);
}

function relationTypeLabel(rel: string): string {
  return _relationLabel(rel);
}

function confidenceLabel(c: string): string {
  if (c === 'c') return _t('confirmed');
  if (c === 'i') return _t('inferred');
  return _t('uncertain');
}

function renderBreadcrumbs(): void {
  const wrap = document.getElementById('bc');
  if (!wrap) return;
  if (!hist.entries.length) {
    wrap.innerHTML = `<span class="bc-empty">${_t('history_empty')}</span>`;
    return;
  }
  const from = Math.max(0, hist.idx - 5);
  const rows = hist.entries.slice(from, hist.idx + 1);
  wrap.innerHTML = rows.map((entry, i) => {
    const idx = from + i;
    const active = idx === hist.idx ? ' on' : '';
    const main = trimLabel(entry.short || entry.label || '', 30);
    const meta = trimLabel(entry.meta || '', 38);
    return `<button class="bc-item${active}" data-bci="${idx}" title="${entry.label || ''}"><span class="bc-main">${main}</span>${meta ? `<span class="bc-meta">${meta}</span>` : ''}</button>`;
  }).join('<span class="bc-sep">\u203a</span>');
}

function syncButtons(): void {
  const b = document.getElementById('hbk') as HTMLButtonElement | null;
  const f = document.getElementById('hfw') as HTMLButtonElement | null;
  if (b) b.disabled = hist.idx <= 0;
  if (f) f.disabled = hist.idx >= hist.entries.length - 1;
}

function push(entry: HistoryEntry): void {
  if (hist.muted || !entry) return;
  const cur = hist.entries[hist.idx];
  if (cur && isSame(cur, entry)) {
    renderBreadcrumbs();
    syncButtons();
    return;
  }
  hist.entries = hist.entries.slice(0, hist.idx + 1);
  hist.entries.push(entry);
  if (hist.entries.length > MAX_ENTRIES) {
    hist.entries.shift();
  }
  hist.idx = hist.entries.length - 1;
  renderBreadcrumbs();
  syncButtons();
}

function navigateTo(idx: number): void {
  if (idx < 0 || idx >= hist.entries.length) return;
  hist.idx = idx;
  renderBreadcrumbs();
  syncButtons();
  const target = hist.entries[idx];
  if (!target || !hist.onNavigate) return;
  hist.muted = true;
  try {
    hist.onNavigate(target);
  } finally {
    hist.muted = false;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function withHistoryMuted(fn: (() => void) | undefined): void {
  hist.muted = true;
  try {
    fn?.();
  } finally {
    hist.muted = false;
  }
}

export function clearHistory(): void {
  hist.entries = [];
  hist.idx = -1;
  renderBreadcrumbs();
  syncButtons();
}

export function recordPerson(id: string): void {
  const p = _byId.get(id);
  if (!p) return;
  const reign = _fR(p.re || []) || _t('year_unknown');
  const meta = [p.dy || _t('unknown_dynasty'), reign].join(' \u00b7 ');
  push({
    type: 'person',
    id,
    label: `${_personName(p)} \u00b7 ${meta}`,
    short: _personName(p),
    meta
  });
}

export function recordEdge(link: {
  source: unknown;
  target: unknown;
  _e?: { t?: string; c?: string };
}): void {
  if (!link) return;
  const s = typeof link.source === 'object' && link.source !== null
    ? (link.source as { id: string }).id
    : link.source as string;
  const d = typeof link.target === 'object' && link.target !== null
    ? (link.target as { id: string }).id
    : link.target as string;
  const rel = link._e?.t || 'kin';
  const relLabel = relationTypeLabel(rel);
  const conf = confidenceLabel(link._e?.c || 'u');
  const label = `${endpointName(s)} \u2192 ${endpointName(d)} (${relLabel.toLowerCase()})`;
  const meta = `${relLabel} \u00b7 ${conf}`;
  push({
    type: 'edge',
    s,
    d,
    rel,
    label,
    short: `${endpointName(s)} \u2192 ${endpointName(d)}`,
    meta
  });
}

export interface HistoryDeps {
  byId: Map<string, PersonNode>;
  fR: (re: Array<[number, number?]>) => string;
  personName: (p: PersonNode | string, byId?: Map<string, PersonNode>) => string;
  relationLabel: (t: string) => string;
  t: (key: string) => string;
}

export function initHistory(
  onNavigate: (entry: HistoryEntry) => void,
  deps: HistoryDeps
): void {
  _byId = deps.byId;
  _fR = deps.fR;
  _personName = deps.personName;
  _relationLabel = deps.relationLabel;
  _t = deps.t;

  hist.onNavigate = onNavigate;
  const backBtn = document.getElementById('hbk');
  const fwdBtn = document.getElementById('hfw');
  backBtn?.addEventListener('click', () => navigateTo(hist.idx - 1));
  fwdBtn?.addEventListener('click', () => navigateTo(hist.idx + 1));
  document.getElementById('bc')?.addEventListener('click', e => {
    const btn = (e.target as Element).closest('[data-bci]');
    if (!btn) return;
    navigateTo(Number((btn as HTMLElement).dataset.bci));
  });
  window.addEventListener('keydown', e => {
    const back = (e.metaKey || e.altKey) && e.key === 'ArrowLeft';
    const fwd = (e.metaKey || e.altKey) && e.key === 'ArrowRight';
    if (back) {
      e.preventDefault();
      navigateTo(hist.idx - 1);
    } else if (fwd) {
      e.preventDefault();
      navigateTo(hist.idx + 1);
    }
  });
  window.addEventListener('lang-changed', () => renderBreadcrumbs());
  renderBreadcrumbs();
  syncButtons();
}

import { byId } from '../data/sovereigns.merge.js';
import { fR } from '../utils/format.js';
import { personName, relationLabel, t } from './i18n.js';

const MAX_ENTRIES = 80;
const hist = {
  entries: [],
  idx: -1,
  muted: false,
  onNavigate: null
};

function keyOf(entry) {
  if (!entry) return '';
  if (entry.type === 'person') return `p|${entry.id}`;
  return `e|${entry.s}|${entry.d}|${entry.rel || ''}|${entry.label || ''}`;
}

function isSame(a, b) {
  return keyOf(a) === keyOf(b);
}

function trimLabel(s, n = 34) {
  if (!s) return '';
  return s.length > n ? `${s.slice(0, n - 1)}\u2026` : s;
}

function endpointName(id) {
  return personName(byId.get(id) || id);
}

function relationTypeLabel(t) {
  return relationLabel(t);
}

function confidenceLabel(c) {
  if (c === 'c') return t('confirmed');
  if (c === 'i') return t('inferred');
  return t('uncertain');
}

function renderBreadcrumbs() {
  const wrap = document.getElementById('bc');
  if (!wrap) return;
  if (!hist.entries.length) {
    wrap.innerHTML = `<span class="bc-empty">${t('history_empty')}</span>`;
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

function syncButtons() {
  const b = document.getElementById('hbk');
  const f = document.getElementById('hfw');
  if (b) b.disabled = hist.idx <= 0;
  if (f) f.disabled = hist.idx >= hist.entries.length - 1;
}

function push(entry) {
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

function navigateTo(idx) {
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

export function withHistoryMuted(fn) {
  hist.muted = true;
  try {
    fn?.();
  } finally {
    hist.muted = false;
  }
}

export function clearHistory() {
  hist.entries = [];
  hist.idx = -1;
  renderBreadcrumbs();
  syncButtons();
}

export function recordPerson(id) {
  const p = byId.get(id);
  if (!p) return;
  const reign = fR(p.re || []) || t('year_unknown');
  const meta = [p.dy || t('unknown_dynasty'), reign].join(' \u00b7 ');
  push({
    type: 'person',
    id,
    label: `${personName(p)} \u00b7 ${meta}`,
    short: personName(p),
    meta
  });
}

export function recordEdge(link) {
  if (!link) return;
  const s = typeof link.source === 'object' ? link.source.id : link.source;
  const d = typeof link.target === 'object' ? link.target.id : link.target;
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

export function initHistory(onNavigate) {
  hist.onNavigate = onNavigate;
  const backBtn = document.getElementById('hbk');
  const fwdBtn = document.getElementById('hfw');
  backBtn?.addEventListener('click', () => navigateTo(hist.idx - 1));
  fwdBtn?.addEventListener('click', () => navigateTo(hist.idx + 1));
  document.getElementById('bc')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-bci]');
    if (!btn) return;
    navigateTo(Number(btn.dataset.bci));
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

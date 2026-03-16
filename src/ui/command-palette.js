/**
 * Command Palette - modal search overlay triggered by / or Cmd+K.
 */
import { rankSearch, reasonLabel } from './search-engine.js';
import { goF } from './navigation.js';
import { showOfficeDetail } from './sidebar.js';
import { personName, t } from './i18n.js';
import { fR, esc } from '../utils/format.js';

const KIND_ICON = {
  crown: '\u265B', judicial: '\u2696', ministerial: '\uD83C\uDFDB',
  deputy: '\u2691', executive: '\u25C6', institution: '\u2699',
  peerage: '\u2654', furadaana: '\u2605', military: '\u2694'
};
const KIND_KEY = {
  crown: 'crown_office', judicial: 'judicial_office', ministerial: 'ministerial_office',
  deputy: 'deputy_office', executive: 'executive_office', institution: 'institution_office',
  peerage: 'peerage_office', furadaana: 'furadaana_office', military: 'military_office'
};

let active = -1;
let results = [];

function getEls() {
  return {
    palette: document.getElementById('cmdPalette'),
    input: document.getElementById('cmdInput'),
    resultsEl: document.getElementById('cmdResults'),
    trigger: document.getElementById('cmdTrigger')
  };
}

function dynastyColor(dy) {
  return `var(--dy-${(dy || 'unknown').toLowerCase()})`;
}

function openPalette() {
  const { palette, input } = getEls();
  if (!palette) return;
  palette.classList.add('open');
  input.value = '';
  active = -1;
  results = [];
  renderResults();
  requestAnimationFrame(() => input.focus());
}

function closePalette() {
  const { palette, input } = getEls();
  if (!palette) return;
  palette.classList.remove('open');
  input.blur();
  results = [];
  active = -1;
}

function isOpen() {
  return getEls().palette?.classList.contains('open') ?? false;
}

function choose(idx) {
  const r = results[idx];
  if (!r) return;
  closePalette();
  if (r.type === 'office') {
    showOfficeDetail(r.office.id);
    window.dispatchEvent(new CustomEvent('request-sidebar-open'));
  } else {
    goF(r.person.id);
  }
}

function renderResults() {
  const { resultsEl } = getEls();
  if (!resultsEl) return;
  if (!results.length) {
    const { input } = getEls();
    if (input?.value.trim()) {
      resultsEl.innerHTML = `<div class="cmd-palette-empty">${esc(t('no_matches'))}</div>`;
    } else {
      resultsEl.innerHTML = `<div class="cmd-palette-empty">${esc(t('command_empty_hint'))}</div>`;
    }
    return;
  }
  resultsEl.innerHTML = results.map((r, i) => {
    if (r.type === 'office') {
      const o = r.office;
      const icon = KIND_ICON[o.kind] || '\u25CB';
      return `<div class="cmd-result${i === active ? ' active' : ''}" data-idx="${i}">
        <div class="cmd-result-ofc-dot">${icon}</div>
        <div class="cmd-result-info">
          <div class="cmd-result-name">${esc(o.name)}</div>
          <div class="cmd-result-meta">${esc(t(KIND_KEY[o.kind] || 'office_generic'))} \u00b7 ${esc(t('office_word'))}</div>
        </div>
        <span class="cmd-result-badge">${esc(reasonLabel(r.reason))}</span>
      </div>`;
    }
    const p = r.person;
    return `<div class="cmd-result${i === active ? ' active' : ''}" data-idx="${i}">
      <div class="cmd-result-dot" style="background:${dynastyColor(p.dy)}"></div>
      <div class="cmd-result-info">
        <div class="cmd-result-name">${p.g === 'F' ? '\u2640 ' : ''}${esc(personName(p))}</div>
        <div class="cmd-result-meta">${esc(fR(p.re))} · ${esc(p.dy || '?')}</div>
      </div>
      <span class="cmd-result-badge">${esc(reasonLabel(r.reason))}</span>
    </div>`;
  }).join('');

  resultsEl.querySelectorAll('.cmd-result').forEach(el => {
    el.addEventListener('mouseenter', () => {
      active = Number(el.dataset.idx);
      updateActive();
    });
    el.addEventListener('mousedown', ev => {
      ev.preventDefault();
      choose(Number(el.dataset.idx));
    });
  });
}

function updateActive() {
  const { resultsEl } = getEls();
  if (!resultsEl) return;
  resultsEl.querySelectorAll('.cmd-result').forEach((el, i) => {
    el.classList.toggle('active', i === active);
    if (i === active) el.scrollIntoView({ block: 'nearest' });
  });
}

export function initCommandPalette() {
  const { palette, input, trigger } = getEls();
  if (!palette || !input) return;

  trigger?.addEventListener('click', openPalette);

  // Global keyboard shortcut
  document.addEventListener('keydown', e => {
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      e.preventDefault();
      openPalette();
      return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (isOpen()) closePalette();
      else openPalette();
    }
  });

  // Backdrop click
  palette.addEventListener('click', e => {
    if (e.target === palette) closePalette();
  });

  // Input handler
  let timer = null;
  input.addEventListener('input', () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      const q = input.value;
      results = q.trim() ? rankSearch(q, 20) : [];
      active = results.length ? 0 : -1;
      renderResults();
    }, 60);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closePalette();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (results.length) {
        active = (active + 1) % results.length;
        updateActive();
      }
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length) {
        active = (active - 1 + results.length) % results.length;
        updateActive();
      }
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      choose(active >= 0 ? active : 0);
    }
  });
}

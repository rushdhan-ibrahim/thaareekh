import * as d3 from 'd3';
import state from '../state.js';
import { edges } from '../data/sovereigns.merge.js';
import { t } from './i18n.js';
import { esc } from '../utils/format.js';
import { rebuild } from '../graph/rebuild.js';

let _open = false;

function panel() { return document.getElementById('treeOptPanel'); }
function btn() { return document.getElementById('treeOptBtn'); }
function listEl() { return document.getElementById('topList'); }

function dynColor(dy) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--dy-${(dy || 'unknown').toLowerCase()}`).trim() || '#888';
}

/**
 * Determine which tree indices are "linked" — i.e., share at least one
 * edge with a node in another tree. Two trees are linked if any edge
 * in the full dataset connects a node in tree A with a node in tree B.
 */
function linkedTreeIndices(treesMeta) {
  if (!treesMeta || !treesMeta.length) return new Set();
  // Map each person ID → tree index
  const nodeTree = new Map();
  treesMeta.forEach(tm => {
    tm.ids.forEach(id => nodeTree.set(id, tm.index));
  });
  const linked = new Set();
  for (const e of edges) {
    const tA = nodeTree.get(e.s);
    const tB = nodeTree.get(e.d);
    if (tA != null && tB != null && tA !== tB) {
      linked.add(tA);
      linked.add(tB);
    }
  }
  return linked;
}

function renderList() {
  const el = listEl();
  if (!el) return;

  const meta = state._treesMeta || [];
  const linkedOnly = document.getElementById('linkedOnly')?.checked || false;
  const linked = linkedOnly ? linkedTreeIndices(meta) : null;
  const tfValue = document.getElementById('tf')?.value || '__all__';

  const filtered = linked ? meta.filter(tm => linked.has(tm.index)) : meta;

  if (!filtered.length) {
    el.innerHTML = `<div class="top-empty">${t('no_matches') || 'No trees found'}</div>`;
    return;
  }

  // "All trees" option at top
  let html = `<button class="top-item${tfValue === '__all__' ? ' active' : ''}" data-tree="__all__">
    <span class="top-item-name">${t('all_trees')}</span>
    <span class="top-item-meta">${filtered.length} ${t('trees_word')}</span>
  </button>`;

  filtered.forEach(tm => {
    const active = tfValue === String(tm.index);
    const name = tm.repName !== '?' ? esc(tm.repName) : `Tree ${tm.index + 1}`;
    const yearStr = tm.year ? String(tm.year) : '';
    html += `<button class="top-item${active ? ' active' : ''}" data-tree="${tm.index}">
      <span class="top-item-dot" style="background:${dynColor(tm.dynasty)}"></span>
      <span class="top-item-name">${name}</span>
      <span class="top-item-meta">${tm.size} &middot; ${esc(tm.dynasty)}${yearStr ? ' &middot; ' + yearStr : ''}</span>
    </button>`;
  });

  el.innerHTML = html;

  // Bind click handlers
  el.querySelectorAll('.top-item').forEach(item => {
    item.addEventListener('click', () => {
      const val = item.dataset.tree;
      const tf = document.getElementById('tf');
      if (tf) {
        // Ensure option exists
        if (![...tf.options].some(o => o.value === val)) {
          tf.value = '__all__';
          tf.dataset.savedValue = val;
        } else {
          tf.value = val;
        }
        // Save value for filter rebuild
        tf.dataset.savedValue = val;
      }
      state.tr = d3.zoomIdentity;
      close();
      rebuild();
    });
  });
}

function open() {
  const p = panel();
  if (!p) return;
  _open = true;
  p.classList.add('open');
  btn()?.setAttribute('aria-expanded', 'true');

  // Position popover below the button
  const b = btn()?.getBoundingClientRect();
  if (b) {
    p.style.left = Math.max(8, b.left) + 'px';
    p.style.top = (b.bottom + 6) + 'px';
  }

  renderList();
}

function close() {
  const p = panel();
  if (!p) return;
  _open = false;
  p.classList.remove('open');
  btn()?.setAttribute('aria-expanded', 'false');
}

function toggle() {
  if (_open) close();
  else open();
}

export function initTreeOptions() {
  const b = btn();
  if (!b) return;

  b.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle();
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!_open) return;
    if (panel()?.contains(e.target) || btn()?.contains(e.target)) return;
    close();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && _open) {
      close();
    }
  });

  // "Linked only" toggle
  document.getElementById('linkedOnly')?.addEventListener('change', () => {
    renderList();
  });

  // Show/hide button based on view mode
  updateVisibility();
}

export function updateTreeOptionsVisibility() {
  updateVisibility();
  // If open and switching away from tree view, close
  if (_open && state.viewMode !== 'tree') close();
}

function updateVisibility() {
  const b = btn();
  if (!b) return;
  b.style.display = state.viewMode === 'tree' ? '' : 'none';
}

export function refreshTreeOptionLabels() {
  const b = btn();
  if (b) b.textContent = t('tree_options');
  const title = document.getElementById('topTitle');
  if (title) title.textContent = t('tree_options');
  const lbl = document.getElementById('linkedLabel');
  if (lbl) lbl.textContent = t('linked_trees_only');
  if (_open) renderList();
}

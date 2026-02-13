import type { AppState, TreeMeta, EdgeRecord } from '../types/state.js';

type D3Like = typeof import('d3');

// Module-level deps
let _state: AppState;
let _d3: D3Like;
let _edges: Array<{ s: string; d: string; [key: string]: unknown }> = [];
let _t: (key: string) => string = (k) => k;
let _esc: (s: string) => string = (s) => s;
let _rebuild: () => void = () => {};

let _open = false;

function panel(): HTMLElement | null { return document.getElementById('treeOptPanel'); }
function btn(): HTMLElement | null { return document.getElementById('treeOptBtn'); }
function listEl(): HTMLElement | null { return document.getElementById('topList'); }

function dynColor(dy: string | undefined): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--dy-${(dy || 'unknown').toLowerCase()}`).trim() || '#888';
}

// ---------------------------------------------------------------------------
// Pure helpers (testable)
// ---------------------------------------------------------------------------

export function linkedTreeIndices(
  treesMeta: TreeMeta[],
  edges: Array<{ s: string; d: string }>
): Set<number> {
  if (!treesMeta || !treesMeta.length) return new Set();
  const nodeTree = new Map<string, number>();
  treesMeta.forEach(tm => {
    tm.ids.forEach(id => nodeTree.set(id, tm.index));
  });
  const linked = new Set<number>();
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

// ---------------------------------------------------------------------------
// Internal rendering
// ---------------------------------------------------------------------------

function renderList(): void {
  const el = listEl();
  if (!el) return;

  const meta = _state._treesMeta || [];
  const linkedOnly = (document.getElementById('linkedOnly') as HTMLInputElement | null)?.checked || false;
  const linked = linkedOnly ? linkedTreeIndices(meta, _edges) : null;
  const tfValue = (document.getElementById('tf') as HTMLSelectElement | null)?.value || '__all__';

  const filtered = linked ? meta.filter(tm => linked.has(tm.index)) : meta;

  if (!filtered.length) {
    el.innerHTML = `<div class="top-empty">${_t('no_matches') || 'No trees found'}</div>`;
    return;
  }

  let html = `<button class="top-item${tfValue === '__all__' ? ' active' : ''}" data-tree="__all__">
    <span class="top-item-name">${_t('all_trees')}</span>
    <span class="top-item-meta">${filtered.length} ${_t('trees_word')}</span>
  </button>`;

  filtered.forEach(tm => {
    const active = tfValue === String(tm.index);
    const name = tm.repName !== '?' ? _esc(tm.repName) : `Tree ${tm.index + 1}`;
    const yearStr = tm.year ? String(tm.year) : '';
    html += `<button class="top-item${active ? ' active' : ''}" data-tree="${tm.index}">
      <span class="top-item-dot" style="background:${dynColor(tm.dynasty)}"></span>
      <span class="top-item-name">${name}</span>
      <span class="top-item-meta">${tm.size} &middot; ${_esc(tm.dynasty)}${yearStr ? ' &middot; ' + yearStr : ''}</span>
    </button>`;
  });

  el.innerHTML = html;

  el.querySelectorAll('.top-item').forEach(item => {
    item.addEventListener('click', () => {
      const val = (item as HTMLElement).dataset.tree;
      const tf = document.getElementById('tf') as HTMLSelectElement | null;
      if (tf && val) {
        if (![...tf.options].some(o => o.value === val)) {
          tf.value = '__all__';
          tf.dataset.savedValue = val;
        } else {
          tf.value = val;
        }
        tf.dataset.savedValue = val;
      }
      _state.tr = _d3.zoomIdentity;
      close();
      _rebuild();
    });
  });
}

function open(): void {
  const p = panel();
  if (!p) return;
  _open = true;
  p.classList.add('open');
  btn()?.setAttribute('aria-expanded', 'true');

  const b = btn()?.getBoundingClientRect();
  if (b) {
    p.style.left = Math.max(8, b.left) + 'px';
    p.style.top = (b.bottom + 6) + 'px';
  }

  renderList();
}

function close(): void {
  const p = panel();
  if (!p) return;
  _open = false;
  p.classList.remove('open');
  btn()?.setAttribute('aria-expanded', 'false');
}

function toggle(): void {
  if (_open) close();
  else open();
}

function updateVisibility(): void {
  const b = btn();
  if (!b) return;
  (b as HTMLElement).style.display = _state.viewMode === 'tree' ? '' : 'none';
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface TreeOptionsDeps {
  state: AppState;
  d3: D3Like;
  edges: Array<{ s: string; d: string; [key: string]: unknown }>;
  t: (key: string) => string;
  esc: (s: string) => string;
  rebuild: () => void;
}

export function initTreeOptions(deps: TreeOptionsDeps): void {
  _state = deps.state;
  _d3 = deps.d3;
  _edges = deps.edges;
  _t = deps.t;
  _esc = deps.esc;
  _rebuild = deps.rebuild;

  const b = btn();
  if (!b) return;

  b.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle();
  });

  document.addEventListener('click', (e) => {
    if (!_open) return;
    if (panel()?.contains(e.target as Node) || btn()?.contains(e.target as Node)) return;
    close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && _open) {
      close();
    }
  });

  document.getElementById('linkedOnly')?.addEventListener('change', () => {
    renderList();
  });

  updateVisibility();
}

export function updateTreeOptionsVisibility(): void {
  updateVisibility();
  if (_open && _state.viewMode !== 'tree') close();
}

export function refreshTreeOptionLabels(): void {
  const b = btn();
  if (b) b.textContent = _t('tree_options');
  const title = document.getElementById('topTitle');
  if (title) title.textContent = _t('tree_options');
  const lbl = document.getElementById('linkedLabel');
  if (lbl) lbl.textContent = _t('linked_trees_only');
  if (_open) renderList();
}

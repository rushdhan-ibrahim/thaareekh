import type { PersonNode, EdgeRecord } from '../types/state.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CompareState {
  a: string | null;
  b: string | null;
  armed: boolean;
  onChange: ((state: { a: string | null; b: string | null; armed: boolean }) => void) | null;
}

interface PathHop {
  from: string;
  to: string;
  edge: EdgeRecord & { confidence_grade?: string };
}

interface RelPath {
  depth: number;
  cost?: number;
  ids: string[];
  hops: PathHop[];
}

// Module-level deps
let _byId: Map<string, PersonNode> = new Map();
let _fR: (re: Array<[number, number?]>) => string = () => '';
let _esc: (s: string) => string = (s) => s;
let _personName: (p: PersonNode | string, byId?: Map<string, PersonNode>) => string = (p) => typeof p === 'string' ? p : p.nm;
let _t: (key: string) => string = (k) => k;
let _findRelationshipPath: (a: string, b: string, opts?: { maxDepth?: number }) => RelPath | null = () => null;

// ---------------------------------------------------------------------------
// Pure helpers (testable)
// ---------------------------------------------------------------------------

export function life(p: PersonNode | null | undefined): string {
  const from = p?.yb ?? p?.re?.[0]?.[0] ?? null;
  const lastRe = p?.re?.at?.(-1);
  const to = p?.yd ?? lastRe?.[1] ?? lastRe?.[0] ?? null;
  if (from == null && to == null) return _t('unknown_short');
  if (from != null && to == null) return `${from}\u2013`;
  if (from == null && to != null) return `\u2013${to}`;
  return `${from}\u2013${to}`;
}

// ---------------------------------------------------------------------------
// Internal state
// ---------------------------------------------------------------------------

const cmp: CompareState = {
  a: null,
  b: null,
  armed: false,
  onChange: null
};

function emitChange(): void {
  renderCompareBadge();
  cmp.onChange?.(getCompareState());
  window.dispatchEvent(new CustomEvent('compare-changed', { detail: getCompareState() }));
}

function nameOf(id: string | null): string {
  if (!id) return _t('unknown_short');
  return _personName(_byId.get(id) ?? id);
}

export function confidenceBadge(c: string | undefined): string {
  if (!c || c === 'c') return `<span class="rt">${_esc(_t('confirmed'))}</span>`;
  const cls = c === 'i' ? 'rt-i' : 'rt-u';
  return `<span class="rt ${cls}">${_esc(c === 'i' ? _t('inferred') : _t('uncertain'))}</span>`;
}

function relationshipStepLabel(step: PathHop): string {
  const e = step.edge || ({} as EdgeRecord);
  if (e.t === 'parent') {
    if (e.s === step.from && e.d === step.to) return _t('relation_parent_to_child');
    return _t('relation_child_to_parent');
  }
  if (e.t === 'sibling') return _t('relation_sibling');
  if (e.t === 'spouse') return _t('relation_spouse');
  if (e.l) return `${_t('relation_kin')} (${e.l})`;
  return _t('relation_kin');
}

export function relationshipPathHtml(a: PersonNode, b: PersonNode): string {
  const path = _findRelationshipPath(a.id, b.id, { maxDepth: 12 });
  if (!path) {
    return `<div class="pcs"><div class="sl">${_esc(_t('relationship_path'))}</div><div class="nt" style="color:var(--tx3)">${_esc(_t('no_relationship_path'))}</div></div>`;
  }
  if (!path.hops.length) {
    return `<div class="pcs"><div class="sl">${_esc(_t('relationship_path'))}</div><div class="nt">${_esc(_t('same_person'))}</div></div>`;
  }
  const rows = path.hops.map((step, i) => {
    const from = _personName(_byId.get(step.from) ?? step.from);
    const to = _personName(_byId.get(step.to) ?? step.to);
    const edge = step.edge || ({} as EdgeRecord & { confidence_grade?: string });
    const rel = relationshipStepLabel(step);
    const grade = edge.confidence_grade ? ` <span class="rt">${_esc(_t('confidence_grade'))} ${_esc(edge.confidence_grade)}</span>` : '';
    return `<li><b>${i + 1}.</b> ${_esc(from)} \u2192 ${_esc(to)} <span class="rt">${_esc(rel)}</span> ${confidenceBadge(edge.c)}${grade}</li>`;
  }).join('');
  const chain = path.ids.map(id => _personName(_byId.get(id) ?? id)).join(' \u2192 ');
  return `
    <div class="pcs">
      <div class="sl">${_esc(_t('relationship_path'))}</div>
      <div class="rs">${path.depth} ${_esc(path.depth === 1 ? _t('hop_singular') : _t('hop_plural'))} \u00b7 ${_esc(_t('weighted_score'))} ${path.cost?.toFixed(2) || _esc(_t('not_available_short'))}</div>
      <div class="rs">${_esc(chain)}</div>
      <ul class="pfl">${rows}</ul>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getCompareState(): { a: string | null; b: string | null; armed: boolean } {
  return { a: cmp.a, b: cmp.b, armed: cmp.armed };
}

export function setCompareState(next: { a?: string | null; b?: string | null; armed?: boolean } | null): void {
  cmp.a = next?.a || null;
  cmp.b = next?.b || null;
  cmp.armed = Boolean(next?.armed);
  emitChange();
}

export function clearCompare(): void {
  cmp.a = null;
  cmp.b = null;
  cmp.armed = false;
  emitChange();
}

export function swapCompare(): void {
  const a = cmp.a;
  cmp.a = cmp.b;
  cmp.b = a;
  cmp.armed = false;
  emitChange();
}

export function setCompareA(id: string | null): void {
  if (!id) return;
  cmp.a = id;
  if (cmp.b === id) cmp.b = null;
  cmp.armed = false;
  emitChange();
}

export function setCompareB(id: string | null): void {
  if (!id) return;
  if (!cmp.a) cmp.a = id;
  else cmp.b = id;
  if (cmp.a === cmp.b) cmp.b = null;
  cmp.armed = false;
  emitChange();
}

export function armCompareFrom(id: string | null): void {
  if (id) {
    cmp.a = id;
    if (cmp.b === id) cmp.b = null;
  }
  cmp.armed = true;
  emitChange();
}

export function handlePersonViewed(id: string | null): void {
  if (!id) return;
  if (cmp.armed) {
    if (!cmp.a) {
      cmp.a = id;
    } else if (cmp.a !== id) {
      cmp.b = id;
      cmp.armed = false;
    }
    emitChange();
    return;
  }
  if (cmp.a === id && cmp.b === id) {
    cmp.b = null;
    emitChange();
  }
}

export function compareSummaryHtml(): string {
  if (!cmp.a || !cmp.b) return '';
  const a = _byId.get(cmp.a);
  const b = _byId.get(cmp.b);
  if (!a || !b) return '';
  const aKnown = new Set(
    [a.nm, a.rg, ...(a.aliases || []), ...(a.regnal_names || []),
     ...((a.known_as || []).map(k => typeof k === 'string' ? k : k?.name))]
      .filter((v): v is string => Boolean(v))
  );
  const bKnown = new Set(
    [b.nm, b.rg, ...(b.aliases || []), ...(b.regnal_names || []),
     ...((b.known_as || []).map(k => typeof k === 'string' ? k : k?.name))]
      .filter((v): v is string => Boolean(v))
  );
  return `
    <section class="pc">
      <div class="pch">
        <div class="pcn">${_esc(_t('compare_title'))}</div>
        <div class="pcd">${_esc(nameOf(cmp.a))} ${_esc(_t('versus_short'))} ${_esc(nameOf(cmp.b))}</div>
      </div>
      <div class="pcg cmpg">
        <div class="pcl">
          <span>A</span>
          <b>${_esc(_personName(a))}</b>
          <div class="rs">${_esc(a.dy || _t('unknown'))} \u00b7 ${_esc(_fR(a.re || []))}</div>
          <div class="rs">${_esc(_t('life'))} ${_esc(life(a))}</div>
          <div class="rs">${_esc(_t('known_names_count'))}: ${aKnown.size}</div>
        </div>
        <div class="pcl">
          <span>B</span>
          <b>${_esc(_personName(b))}</b>
          <div class="rs">${_esc(b.dy || _t('unknown'))} \u00b7 ${_esc(_fR(b.re || []))}</div>
          <div class="rs">${_esc(_t('life'))} ${_esc(life(b))}</div>
          <div class="rs">${_esc(_t('known_names_count'))}: ${bKnown.size}</div>
        </div>
      </div>
      ${relationshipPathHtml(a, b)}
      <div class="pnl">
        <button class="gb" onclick="goF('${a.id}')">${_esc(_t('go_a'))}</button>
        <button class="gb" onclick="goF('${b.id}')">${_esc(_t('go_b'))}</button>
        <button class="gb" onclick="swapCmp()">${_esc(_t('swap'))}</button>
        <button class="gb" onclick="clrCmp()">${_esc(_t('clear'))}</button>
      </div>
    </section>
  `;
}

function renderCompareBadge(): void {
  const el = document.getElementById('cmp');
  if (!el) return;
  const parts: string[] = [];
  parts.push(`<span class="cmp-t">${_esc(_t('compare_label'))}</span>`);
  parts.push(`<span class="cmp-v">${_esc(nameOf(cmp.a))}</span>`);
  parts.push(`<span class="cmp-s">${_esc(_t('versus_short'))}</span>`);
  parts.push(`<span class="cmp-v">${_esc(nameOf(cmp.b))}</span>`);
  if (cmp.armed) parts.push(`<span class="cmp-a">${_esc(_t('select_next_person'))}</span>`);
  const actions = `
    <button class="qcb" data-cmp-action="swap">${_esc(_t('swap'))}</button>
    <button class="qcb" data-cmp-action="clear">${_esc(_t('clear'))}</button>
  `;
  el.innerHTML = `<div class="cmp-r">${parts.join('')}</div><div class="cmp-x">${actions}</div>`;
}

export interface CompareDeps {
  byId: Map<string, PersonNode>;
  fR: (re: Array<[number, number?]>) => string;
  esc: (s: string) => string;
  personName: (p: PersonNode | string, byId?: Map<string, PersonNode>) => string;
  t: (key: string) => string;
  findRelationshipPath: (a: string, b: string, opts?: { maxDepth?: number }) => RelPath | null;
}

export function initCompare(
  deps: CompareDeps,
  onChange?: (state: { a: string | null; b: string | null; armed: boolean }) => void
): void {
  _byId = deps.byId;
  _fR = deps.fR;
  _esc = deps.esc;
  _personName = deps.personName;
  _t = deps.t;
  _findRelationshipPath = deps.findRelationshipPath;
  cmp.onChange = onChange ?? null;

  document.getElementById('cmp')?.addEventListener('click', e => {
    const btn = (e.target as Element).closest('[data-cmp-action]');
    if (!btn) return;
    const action = (btn as HTMLElement).dataset.cmpAction;
    if (action === 'swap') swapCompare();
    else if (action === 'clear') clearCompare();
  });
  renderCompareBadge();
}

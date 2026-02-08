import { byId } from '../data/sovereigns.merge.js';
import { fR, esc } from '../utils/format.js';
import { findRelationshipPath } from '../graph/pathfinder.js';
import { personName, t } from './i18n.js';

const cmp = {
  a: null,
  b: null,
  armed: false,
  onChange: null
};

function life(p) {
  const from = p?.yb ?? p?.re?.[0]?.[0] ?? null;
  const to = p?.yd ?? p?.re?.at(-1)?.[1] ?? p?.re?.at(-1)?.[0] ?? null;
  if (from == null && to == null) return t('unknown_short');
  if (from != null && to == null) return `${from}\u2013`;
  if (from == null && to != null) return `\u2013${to}`;
  return `${from}\u2013${to}`;
}

function emitChange() {
  renderCompareBadge();
  cmp.onChange?.(getCompareState());
  window.dispatchEvent(new CustomEvent('compare-changed', { detail: getCompareState() }));
}

function nameOf(id) {
  if (!id) return t('unknown_short');
  return personName(byId.get(id) || id);
}

function confidenceBadge(c) {
  if (!c || c === 'c') return `<span class="rt">${esc(t('confirmed'))}</span>`;
  const cls = c === 'i' ? 'rt-i' : 'rt-u';
  return `<span class="rt ${cls}">${esc(c === 'i' ? t('inferred') : t('uncertain'))}</span>`;
}

function relationshipStepLabel(step) {
  const e = step?.edge || {};
  if (e.t === 'parent') {
    if (e.s === step.from && e.d === step.to) return t('relation_parent_to_child');
    return t('relation_child_to_parent');
  }
  if (e.t === 'sibling') return t('relation_sibling');
  if (e.t === 'spouse') return t('relation_spouse');
  if (e.l) return `${t('relation_kin')} (${e.l})`;
  return t('relation_kin');
}

function relationshipPathHtml(a, b) {
  const path = findRelationshipPath(a.id, b.id, { maxDepth: 12 });
  if (!path) {
    return `<div class="pcs"><div class="sl">${esc(t('relationship_path'))}</div><div class="nt" style="color:var(--tx3)">${esc(t('no_relationship_path'))}</div></div>`;
  }
  if (!path.hops.length) {
    return `<div class="pcs"><div class="sl">${esc(t('relationship_path'))}</div><div class="nt">${esc(t('same_person'))}</div></div>`;
  }
  const rows = path.hops.map((step, i) => {
    const from = personName(byId.get(step.from) || step.from);
    const to = personName(byId.get(step.to) || step.to);
    const edge = step.edge || {};
    const rel = relationshipStepLabel(step);
    const grade = edge.confidence_grade ? ` <span class="rt">${esc(t('confidence_grade'))} ${esc(edge.confidence_grade)}</span>` : '';
    return `<li><b>${i + 1}.</b> ${esc(from)} \u2192 ${esc(to)} <span class="rt">${esc(rel)}</span> ${confidenceBadge(edge.c)}${grade}</li>`;
  }).join('');
  const chain = path.ids.map(id => personName(byId.get(id) || id)).join(' \u2192 ');
  return `
    <div class="pcs">
      <div class="sl">${esc(t('relationship_path'))}</div>
      <div class="rs">${path.depth} ${esc(path.depth === 1 ? t('hop_singular') : t('hop_plural'))} \u00b7 ${esc(t('weighted_score'))} ${path.cost?.toFixed(2) || esc(t('not_available_short'))}</div>
      <div class="rs">${esc(chain)}</div>
      <ul class="pfl">${rows}</ul>
    </div>
  `;
}

export function getCompareState() {
  return { a: cmp.a, b: cmp.b, armed: cmp.armed };
}

export function setCompareState(next) {
  cmp.a = next?.a || null;
  cmp.b = next?.b || null;
  cmp.armed = Boolean(next?.armed);
  emitChange();
}

export function clearCompare() {
  cmp.a = null;
  cmp.b = null;
  cmp.armed = false;
  emitChange();
}

export function swapCompare() {
  const a = cmp.a;
  cmp.a = cmp.b;
  cmp.b = a;
  cmp.armed = false;
  emitChange();
}

export function setCompareA(id) {
  if (!id) return;
  cmp.a = id;
  if (cmp.b === id) cmp.b = null;
  cmp.armed = false;
  emitChange();
}

export function setCompareB(id) {
  if (!id) return;
  if (!cmp.a) cmp.a = id;
  else cmp.b = id;
  if (cmp.a === cmp.b) cmp.b = null;
  cmp.armed = false;
  emitChange();
}

export function armCompareFrom(id) {
  if (id) {
    cmp.a = id;
    if (cmp.b === id) cmp.b = null;
  }
  cmp.armed = true;
  emitChange();
}

export function handlePersonViewed(id) {
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

export function compareSummaryHtml() {
  if (!cmp.a || !cmp.b) return '';
  const a = byId.get(cmp.a);
  const b = byId.get(cmp.b);
  if (!a || !b) return '';
  const aKnown = new Set([a.nm, a.rg, ...(a.aliases || []), ...(a.regnal_names || []), ...((a.known_as || []).map(k => typeof k === 'string' ? k : k?.name))].filter(Boolean));
  const bKnown = new Set([b.nm, b.rg, ...(b.aliases || []), ...(b.regnal_names || []), ...((b.known_as || []).map(k => typeof k === 'string' ? k : k?.name))].filter(Boolean));
  return `
    <section class="pc">
      <div class="pch">
        <div class="pcn">${esc(t('compare_title'))}</div>
        <div class="pcd">${esc(nameOf(cmp.a))} ${esc(t('versus_short'))} ${esc(nameOf(cmp.b))}</div>
      </div>
      <div class="pcg cmpg">
        <div class="pcl">
          <span>A</span>
          <b>${esc(personName(a))}</b>
          <div class="rs">${esc(a.dy || t('unknown'))} \u00b7 ${esc(fR(a.re || []))}</div>
          <div class="rs">${esc(t('life'))} ${esc(life(a))}</div>
          <div class="rs">${esc(t('known_names_count'))}: ${aKnown.size}</div>
        </div>
        <div class="pcl">
          <span>B</span>
          <b>${esc(personName(b))}</b>
          <div class="rs">${esc(b.dy || t('unknown'))} \u00b7 ${esc(fR(b.re || []))}</div>
          <div class="rs">${esc(t('life'))} ${esc(life(b))}</div>
          <div class="rs">${esc(t('known_names_count'))}: ${bKnown.size}</div>
        </div>
      </div>
      ${relationshipPathHtml(a, b)}
      <div class="pnl">
        <button class="gb" onclick="goF('${a.id}')">${esc(t('go_a'))}</button>
        <button class="gb" onclick="goF('${b.id}')">${esc(t('go_b'))}</button>
        <button class="gb" onclick="swapCmp()">${esc(t('swap'))}</button>
        <button class="gb" onclick="clrCmp()">${esc(t('clear'))}</button>
      </div>
    </section>
  `;
}

function renderCompareBadge() {
  const el = document.getElementById('cmp');
  if (!el) return;
  const parts = [];
  parts.push(`<span class="cmp-t">${esc(t('compare_label'))}</span>`);
  parts.push(`<span class="cmp-v">${esc(nameOf(cmp.a))}</span>`);
  parts.push(`<span class="cmp-s">${esc(t('versus_short'))}</span>`);
  parts.push(`<span class="cmp-v">${esc(nameOf(cmp.b))}</span>`);
  if (cmp.armed) parts.push(`<span class="cmp-a">${esc(t('select_next_person'))}</span>`);
  const actions = `
    <button class="qcb" data-cmp-action="swap">${esc(t('swap'))}</button>
    <button class="qcb" data-cmp-action="clear">${esc(t('clear'))}</button>
  `;
  el.innerHTML = `<div class="cmp-r">${parts.join('')}</div><div class="cmp-x">${actions}</div>`;
}

export function initCompare(onChange) {
  cmp.onChange = onChange;
  document.getElementById('cmp')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-cmp-action]');
    if (!btn) return;
    const action = btn.dataset.cmpAction;
    if (action === 'swap') swapCompare();
    else if (action === 'clear') clearCompare();
  });
  renderCompareBadge();
}

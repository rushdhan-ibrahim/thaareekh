/**
 * Rich hover cards using Floating UI for positioning.
 */
import { personName } from './i18n.js';
import { fR, esc } from '../utils/format.js';
import state from '../state.js';

let hoverEl = null;
let hideTimer = null;

function ensureEl() {
  if (hoverEl) return hoverEl;
  hoverEl = document.createElement('div');
  hoverEl.className = 'hover-card';
  hoverEl.setAttribute('role', 'tooltip');
  document.body.appendChild(hoverEl);
  return hoverEl;
}

function dynastyColor(dy) {
  return `var(--dy-${(dy || 'unknown').toLowerCase()})`;
}

function connectionCount(id) {
  let count = 0;
  state.links.forEach(l => {
    const s = typeof l.source === 'object' ? l.source.id : l.source;
    const t = typeof l.target === 'object' ? l.target.id : l.target;
    if (s === id || t === id) count++;
  });
  return count;
}

export function showNodeHoverCard(ev, d) {
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
  const el = ensureEl();
  const conns = connectionCount(d.id);
  el.innerHTML = `
    <div class="hover-card-name">${d.g === 'F' ? '\u2640 ' : ''}${esc(personName(d))}</div>
    <div class="hover-card-bar" style="background:${dynastyColor(d.dy)}"></div>
    <div class="hover-card-reign">${esc(fR(d.re || []))} · ${esc(d.dy || '?')}</div>
    <div class="hover-card-stats">
      <span>${(d.n || []).map(x => '#' + x).join(', ') || 'non-sovereign'}</span>
      <span>${conns} connection${conns !== 1 ? 's' : ''}</span>
    </div>
    ${d.bio ? `<div class="hover-card-bio">${esc(d.bio.split('.')[0].slice(0, 120))}${d.bio.split('.')[0].length > 120 ? '\u2026' : '.'}</div>` : ''}
  `;

  // Position using manual offset from mouse (Floating UI imported dynamically if available)
  el.style.left = (ev.clientX + 14) + 'px';
  el.style.top = (ev.clientY + 14) + 'px';
  el.classList.add('visible');
}

export function moveHoverCard(ev) {
  if (!hoverEl || !hoverEl.classList.contains('visible')) return;
  hoverEl.style.left = (ev.clientX + 14) + 'px';
  hoverEl.style.top = (ev.clientY + 14) + 'px';
}

export function hideHoverCard() {
  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    hideTimer = null;
    if (hoverEl) hoverEl.classList.remove('visible');
  }, 80);
}

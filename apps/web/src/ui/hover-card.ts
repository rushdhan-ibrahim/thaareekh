import type { PersonNode, AppState, LinkDatum } from '../types/state';
import { personName } from './i18n';
import { fR, esc } from '../utils/format';

let hoverEl: HTMLDivElement | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

function ensureEl(): HTMLDivElement {
  if (hoverEl) return hoverEl;
  hoverEl = document.createElement('div');
  hoverEl.className = 'hover-card';
  hoverEl.setAttribute('role', 'tooltip');
  hoverEl.style.left = '0';
  hoverEl.style.top = '0';
  hoverEl.style.willChange = 'transform';
  document.body.appendChild(hoverEl);
  return hoverEl;
}

function dynastyColor(dy: string | undefined): string {
  return `var(--dy-${(dy ?? 'unknown').toLowerCase()})`;
}

function connectionCount(id: string, links: LinkDatum[], adj?: Map<string, Set<string>>): number {
  // Use cached adjacency map for O(1) lookup; fallback to iteration
  if (adj) {
    const neighbors = adj.get(id);
    return neighbors ? neighbors.size : 0;
  }
  let count = 0;
  links.forEach(l => {
    const s = typeof l.source === 'object' ? l.source.id : l.source;
    const t = typeof l.target === 'object' ? l.target.id : l.target;
    if (s === id || t === id) count++;
  });
  return count;
}

export function showNodeHoverCard(ev: MouseEvent, d: PersonNode, state: AppState): void {
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
  const el = ensureEl();
  const conns = connectionCount(d.id, state.links, state._adj as Map<string, Set<string>> | undefined);
  const bio = d.bio ?? '';
  const snippet = bio.split('.')[0] ?? '';
  el.innerHTML = `
    <div class="hover-card-name">${d.g === 'F' ? '\u2640 ' : ''}${esc(personName(d))}</div>
    <div class="hover-card-bar" style="background:${dynastyColor(d.dy)}"></div>
    <div class="hover-card-reign">${esc(fR(d.re))} \u00b7 ${esc(d.dy ?? '?')}</div>
    <div class="hover-card-stats">
      <span>${(d.n ?? []).map(x => '#' + x).join(', ') || 'non-sovereign'}</span>
      <span>${conns} connection${conns !== 1 ? 's' : ''}</span>
    </div>
    ${bio ? `<div class="hover-card-bio">${esc(snippet.slice(0, 120))}${snippet.length > 120 ? '\u2026' : '.'}</div>` : ''}
  `;
  el.style.transform = `translate(${ev.clientX + 14}px,${ev.clientY + 14}px)`;
  el.classList.add('visible');
}

export function moveHoverCard(ev: MouseEvent): void {
  if (!hoverEl || !hoverEl.classList.contains('visible')) return;
  hoverEl.style.transform = `translate(${ev.clientX + 14}px,${ev.clientY + 14}px)`;
}

export function hideHoverCard(): void {
  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    hideTimer = null;
    if (hoverEl) hoverEl.classList.remove('visible');
  }, 80);
}

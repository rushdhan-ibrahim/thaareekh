/**
 * The Illuminated Timeline — dresses the native era range input with
 * dynasty reign bands, a jewel thumb, and a bubble naming the year and
 * whoever held the throne. The input itself stays for accessibility.
 * Mirror of apps/web/src/ui/era-scrubber.ts.
 */
import { dynastyBandStops, scrubProgress, reigningAt } from './era-scrubber-core.js';
import { audioEvent } from '../audio/scriptorium-audio.js';

function bandGradient(minY, maxY) {
  const stops = dynastyBandStops(minY, maxY);
  const segs = [];
  for (const s of stops) {
    const v = s.key === 'modern' ? 'var(--ac)' : `var(--dy-${s.key})`;
    segs.push(`color-mix(in srgb, ${v} 42%, transparent) ${s.fromPct}% ${s.toPct}%`);
  }
  return `linear-gradient(90deg, ${segs.join(', ')})`;
}

function ordinalLabel(p) {
  const name = p.nm ?? p.id;
  const n = Array.isArray(p.n) && p.n.length ? ` · #${p.n[0]}` : '';
  return `${name}${n}`;
}

export function initEraScrubber(deps) {
  const ey = document.getElementById('ey');
  if (!ey || ey.closest('.scrub-wrap')) return;
  const minY = deps.minY ?? Number(ey.min || 1117);
  const maxY = deps.maxY ?? Number(ey.max || 1968);

  const wrap = document.createElement('div');
  wrap.className = 'scrub-wrap';
  ey.parentElement?.insertBefore(wrap, ey);
  const bands = document.createElement('div');
  bands.className = 'scrub-bands';
  bands.style.background = bandGradient(minY, maxY);
  const bubble = document.createElement('div');
  bubble.className = 'scrub-bubble';
  bubble.setAttribute('aria-hidden', 'true');
  wrap.appendChild(bands);
  wrap.appendChild(ey);
  wrap.appendChild(bubble);

  let hideTimer = 0;

  const showBubble = (year, ghost) => {
    const prog = scrubProgress(year, minY, maxY);
    const who = reigningAt(year, deps.people);
    const label = who.length ? ` · ${ordinalLabel(who[0])}` : '';
    bubble.textContent = `${year}${label}`;
    // Clamp so the bubble never clips outside the wrap at the extremes
    bubble.style.left = `${(6 + prog * 88).toFixed(2)}%`;
    bubble.classList.toggle('ghost', ghost);
    bubble.classList.add('show');
    window.clearTimeout(hideTimer);
  };
  const scheduleHide = ms => {
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => bubble.classList.remove('show'), ms);
  };

  ey.addEventListener('input', () => {
    const year = Number(ey.value);
    showBubble(year, false);
    audioEvent('tick', { progress: scrubProgress(year, minY, maxY) });
  });
  ey.addEventListener('pointerdown', () => wrap.classList.add('scrubbing'));
  ey.addEventListener('focus', () => showBubble(Number(ey.value), false));
  const release = () => {
    wrap.classList.remove('scrubbing');
    scheduleHide(900);
  };
  ey.addEventListener('pointerup', release);
  ey.addEventListener('blur', release);

  // Hover preview: name the year under the cursor without changing it.
  wrap.addEventListener('pointermove', e => {
    if (wrap.classList.contains('scrubbing')) return;
    const r = wrap.getBoundingClientRect();
    if (r.width < 10) return;
    const frac = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const year = Math.round(minY + frac * (maxY - minY));
    showBubble(year, true);
  });
  wrap.addEventListener('pointerleave', () => scheduleHide(150));
}

/**
 * Sidebar Seal — 3-layer rotating/breathing/counter-rotating SVG ornament.
 * Outer ring (90s spin), inner 16-pointed star (10s breathe), orbit dots (55s counter-spin).
 */

const NS = 'http://www.w3.org/2000/svg';

let sealContainer = null;
let sealSvg = null;

/** Generate star polygon points */
function starPoints(cx, cy, n, outerR, innerR) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const angle = (Math.PI * i) / n - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    pts.push(`${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`);
  }
  return pts.join(' ');
}

function el(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    e.setAttribute(k, String(v));
  }
  parent.appendChild(e);
  return e;
}

/** Build the seal SVG. Call once after sidebar DOM is ready. */
export function initSidebarSeal() {
  const sidebar = document.querySelector('.sb') || document.querySelector('.side .sb');
  if (!sidebar || sealContainer) return;

  sealContainer = document.createElement('div');
  sealContainer.className = 'seal-block';
  sealContainer.setAttribute('aria-hidden', 'true');

  sealSvg = document.createElementNS(NS, 'svg');
  sealSvg.setAttribute('viewBox', '0 0 100 100');
  sealSvg.setAttribute('width', '100');
  sealSvg.setAttribute('height', '100');
  sealSvg.classList.add('seal-svg');
  sealContainer.appendChild(sealSvg);

  const st = document.querySelector('.st');
  if (st) {
    st.appendChild(sealContainer);
  }

  buildSeal('--ac');
}

function buildSeal(colorVar) {
  if (!sealSvg) return;
  sealSvg.innerHTML = '';

  const cx = 50, cy = 50;

  // Layer 1: Outer rotating ring (90s)
  const outer = el('g', {}, sealSvg);
  outer.style.cssText = `animation:spin 90s linear infinite;transform-origin:50px 50px`;

  el('circle', { cx, cy, r: 46, fill: 'none', stroke: `var(${colorVar})`, 'stroke-width': 0.6, opacity: 0.35 }, outer);
  el('circle', { cx, cy, r: 43, fill: 'none', stroke: 'var(--tx)', 'stroke-width': 0.18, opacity: 0.1, 'stroke-dasharray': '1.5,5' }, outer);

  // Cardinal ticks
  const cardinals = [[50, 3], [97, 50], [50, 97], [3, 50]];
  cardinals.forEach(([x, y]) => {
    const dx = x < 50 ? 1 : x > 50 ? -1 : 0;
    const dy = y < 50 ? 1 : y > 50 ? -1 : 0;
    el('polygon', {
      points: `${x},${y} ${x + dy * 1.5},${y + dx * 4 + dy * 4} ${x - dy * 1.5},${y - dx * 4 + dy * 4}`,
      fill: `var(${colorVar})`, opacity: 0.4
    }, outer);
  });

  // 8-fold radials
  const radials = [[50, 6, 50, 94], [6, 50, 94, 50], [18, 18, 82, 82], [82, 18, 18, 82]];
  radials.forEach(([x1, y1, x2, y2]) => {
    el('line', { x1, y1, x2, y2, stroke: 'var(--tx)', 'stroke-width': 0.12, opacity: 0.06 }, outer);
  });

  // Layer 2: Inner breathing star (10s)
  const inner = el('g', {}, sealSvg);
  inner.style.cssText = `animation:sealBreathe 10s ease-in-out infinite;transform-origin:50px 50px`;

  el('polygon', { points: starPoints(50, 50, 16, 38, 22), fill: 'none', stroke: `var(${colorVar})`, 'stroke-width': 0.5, opacity: 0.45 }, inner);
  el('polygon', { points: starPoints(50, 50, 16, 28, 17), fill: 'none', stroke: `var(${colorVar})`, 'stroke-width': 0.3, opacity: 0.25 }, inner);
  el('polygon', { points: starPoints(50, 50, 8, 14, 8), fill: 'none', stroke: `var(${colorVar})`, 'stroke-width': 0.25, opacity: 0.2 }, inner);
  el('circle', { cx: 50, cy: 50, r: 4, fill: `var(${colorVar})`, opacity: 0.2 }, inner);
  // Pulse ring
  const pulseRing = el('circle', { cx: 50, cy: 50, r: 20, fill: 'none', stroke: `var(${colorVar})`, 'stroke-width': 0.2, opacity: 0.15 }, inner);
  pulseRing.style.animation = 'pulse 6s ease-in-out infinite';

  // Layer 3: Counter-rotating orbit dots (55s)
  const orb = el('g', {}, sealSvg);
  orb.style.cssText = `animation:spinReverse 55s linear infinite;transform-origin:50px 50px`;

  for (let i = 0; i < 8; i++) {
    const a = Math.PI * 2 * i / 8 - Math.PI / 2;
    const x = 50 + 44 * Math.cos(a);
    const y = 50 + 44 * Math.sin(a);
    el('circle', {
      cx: x.toFixed(1), cy: y.toFixed(1),
      r: i % 2 === 0 ? 1.3 : 0.8,
      fill: `var(${colorVar})`,
      opacity: i % 2 === 0 ? 0.3 : 0.18
    }, orb);
  }
}

/** Update seal color to match current dynasty */
export function updateSealColor(dynastyKey) {
  if (!sealSvg) return;
  const colorVar = dynastyKey ? `--dy-${dynastyKey.toLowerCase()}` : '--ac';
  buildSeal(colorVar);
}

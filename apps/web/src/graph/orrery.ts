/**
 * Dynasty Orrery — concentric rings rotating behind the graph.
 * Each dynasty gets a ring whose rotation period encodes dynasty weight.
 * "The rings encode historical data, not decoration."
 *
 * Performance architecture: the orrery lives in an HTML underlay
 * (.orrery-host) behind the SVG, one element per ring, rotated with
 * composited CSS transforms. The graph's zoom transform is mirrored
 * onto .orrery-space, so the rings stay welded to graph space while
 * never invalidating the SVG scene.
 */

import { hashCode, mulberry32 } from '../utils/prng.ts';

const NS = 'http://www.w3.org/2000/svg';

interface DynastyRing {
  key: string;
  reignYears: number;
  startYear: number;
  speed: number; // hand-tuned rotation period in seconds
}

const DYNASTIES: DynastyRing[] = [
  { key: 'lunar', reignYears: 268, startYear: 1117, speed: 140 },
  { key: 'hilaaly', reignYears: 188, startYear: 1385, speed: 110 },
  { key: 'utheemu', reignYears: 119, startYear: 1573, speed: 80 },
  { key: 'dhiyamigili', reignYears: 67, startYear: 1692, speed: 100 },
  { key: 'huraagey', reignYears: 59, startYear: 1759, speed: 105 }
];

const BASE_R = 75;
const RING_GAP = 42;
const BREATH_R = 55;
const STAR_R = 6;
const TOTAL_YEARS = 851; // 1117–1968

let hostEl: HTMLElement | null = null;
let spaceEl: HTMLElement | null = null;

function svgChild(tag: string, attrs: Record<string, string | number>, parent: Element): SVGElement {
  const e = document.createElementNS(NS, tag) as SVGElement;
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  parent.appendChild(e);
  return e;
}

/** A self-contained ring SVG: circle, dashed inner, era arc, diamond. */
function ringSvg(dy: DynastyRing, r: number): SVGSVGElement {
  const pad = 6;
  const size = (r + pad) * 2;
  const svg = document.createElementNS(NS, 'svg') as SVGSVGElement;
  svg.setAttribute('viewBox', `${-(r + pad)} ${-(r + pad)} ${size} ${size}`);
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.classList.add('o-ring', `o-ring-${dy.key}`);
  svg.style.left = `${-(r + pad)}px`;
  svg.style.top = `${-(r + pad)}px`;
  svg.style.animationDuration = `${dy.speed}s`;
  const colorVar = `--dy-${dy.key}`;

  svgChild('circle', { cx: 0, cy: 0, r, fill: 'none', stroke: `var(${colorVar})`, 'stroke-width': 0.45, opacity: 0.1 }, svg);
  svgChild('circle', { cx: 0, cy: 0, r: r - 4, fill: 'none', stroke: `var(${colorVar})`, 'stroke-width': 0.12, opacity: 0.05, 'stroke-dasharray': '1.5,6' }, svg);

  const arcAngle = (dy.reignYears / TOTAL_YEARS) * Math.PI * 2;
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + arcAngle;
  const x1 = r * Math.cos(startAngle);
  const y1 = r * Math.sin(startAngle);
  const x2 = r * Math.cos(endAngle);
  const y2 = r * Math.sin(endAngle);
  const largeArc = arcAngle > Math.PI ? 1 : 0;
  const arc = svgChild('path', {
    d: `M${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${largeArc},1 ${x2.toFixed(2)},${y2.toFixed(2)}`,
    fill: 'none', stroke: `var(${colorVar})`, 'stroke-width': 1.1, opacity: 0.07
  }, svg);
  arc.classList.add('o-arc');

  const s = 3;
  svgChild('polygon', {
    points: `${x1},${y1 - s} ${x1 + s},${y1} ${x1},${y1 + s} ${x1 - s},${y1}`,
    fill: `var(${colorVar})`, opacity: 0.1
  }, svg);
  return svg;
}

function star8Svg(r: number): SVGSVGElement {
  const svg = document.createElementNS(NS, 'svg') as SVGSVGElement;
  const pad = 2;
  const size = (r + pad) * 2;
  svg.setAttribute('viewBox', `${-(r + pad)} ${-(r + pad)} ${size} ${size}`);
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.classList.add('o-star');
  svg.style.left = `${-(r + pad)}px`;
  svg.style.top = `${-(r + pad)}px`;
  const ri = r * 0.25;
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const angle = (Math.PI * i) / 8 - Math.PI / 2;
    const rr = i % 2 === 0 ? r : ri;
    pts.push(`${(rr * Math.cos(angle)).toFixed(2)},${(rr * Math.sin(angle)).toFixed(2)}`);
  }
  svgChild('polygon', { points: pts.join(' '), fill: 'var(--tx)', opacity: 0.04 }, svg);
  return svg;
}

function breatheSvg(r: number): SVGSVGElement {
  const svg = document.createElementNS(NS, 'svg') as SVGSVGElement;
  const pad = 2;
  const size = (r + pad) * 2;
  svg.setAttribute('viewBox', `${-(r + pad)} ${-(r + pad)} ${size} ${size}`);
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.classList.add('o-breathe');
  svg.style.left = `${-(r + pad)}px`;
  svg.style.top = `${-(r + pad)}px`;
  svgChild('circle', { cx: 0, cy: 0, r, fill: 'none', stroke: 'var(--tx)', 'stroke-width': 0.2, opacity: 0.04 }, svg);
  return svg;
}

/**
 * Build (or rebuild) the orrery underlay inside the graph chamber.
 * `ga` is the #ga element; (cx, cy) is the anchor in graph coordinates.
 */
export function buildOrrery(ga: HTMLElement | null, cx: number, cy: number): void {
  if (!ga) return;
  hostEl = ga.querySelector('.orrery-host');
  if (!hostEl) {
    hostEl = document.createElement('div');
    hostEl.className = 'orrery-host';
    hostEl.setAttribute('aria-hidden', 'true');
    ga.insertBefore(hostEl, ga.firstChild);
  }
  hostEl.innerHTML = '';
  spaceEl = document.createElement('div');
  spaceEl.className = 'orrery-space';
  const anchor = document.createElement('div');
  anchor.className = 'orrery-anchor';
  anchor.style.transform = `translate(${cx}px, ${cy}px)`;
  spaceEl.appendChild(anchor);
  hostEl.appendChild(spaceEl);

  const jRng = mulberry32(hashCode(`orrery-${cx}-${cy}`));
  const J = (v: number, a: number) => v + (jRng() - 0.5) * a;

  anchor.appendChild(star8Svg(STAR_R));
  anchor.appendChild(breatheSvg(BREATH_R));
  DYNASTIES.forEach((dy, i) => {
    const r = BASE_R + i * RING_GAP + J(0, 3);
    anchor.appendChild(ringSvg(dy, r));
  });
}

/** Mirror the graph's zoom transform onto the orrery space. */
export function updateOrreryTransform(t: { x: number; y: number; k: number } | null): void {
  if (!spaceEl || !t) return;
  spaceEl.style.transform = `translate(${t.x}px, ${t.y}px) scale(${t.k})`;
}

/** Pulse a dynasty's era arc when the era filter changes. */
export function pulseOrreryDynasty(_parent: unknown, dynastyKey: string): void {
  const arc = hostEl?.querySelector(`.o-ring-${dynastyKey} .o-arc`) as SVGElement | null;
  if (!arc || typeof arc.animate !== 'function') return;
  arc.animate(
    [{ opacity: 0.07 }, { opacity: 0.15 }, { opacity: 0.07 }],
    { duration: 600, easing: 'ease-out' }
  );
}

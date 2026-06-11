/**
 * Dynasty Orrery — concentric rings rotating behind the graph.
 * Each dynasty gets a ring whose rotation period encodes dynasty weight.
 * "The rings encode historical data, not decoration."
 */

import { hashCode, mulberry32 } from '../utils/prng.ts';

const NS = 'http://www.w3.org/2000/svg';

interface DynastyRing {
  key: string;
  reignYears: number;
  startYear: number;
  speed: number;  // hand-tuned rotation period in seconds
}

const DYNASTIES: DynastyRing[] = [
  { key: 'lunar',       reignYears: 268, startYear: 1117, speed: 140 },
  { key: 'hilaaly',     reignYears: 188, startYear: 1385, speed: 110 },
  { key: 'utheemu',     reignYears: 119, startYear: 1573, speed:  80 },
  { key: 'dhiyamigili', reignYears:  67, startYear: 1692, speed: 100 },
  { key: 'huraagey',    reignYears:  59, startYear: 1759, speed: 105 },
];

const BASE_R   = 75;
const RING_GAP = 42;
const BREATH_R = 55;
const STAR_R   = 6;
const TOTAL_YEARS = 851; // 1117–1968

/** Build or update the orrery group. */
export function buildOrrery(parentG: any, cx: number, cy: number): any {
  let orreryG = parentG.select('g.orrery-layer');
  if (orreryG.empty()) {
    orreryG = parentG.insert('g', ':first-child').attr('class', 'orrery-layer');
  }
  orreryG.attr('opacity', 0.5);
  orreryG.selectAll('*').remove();

  // Jitter RNG seeded from center position
  const jRng = mulberry32(hashCode(`orrery-${cx}-${cy}`));
  const J = (v: number, a: number) => v + (jRng() - 0.5) * a;

  // Central 8-pointed star
  star8(orreryG.node(), cx, cy, STAR_R, '--tx', 0.04);

  // Innermost breathing ring
  const breatheCircle = circle(orreryG.node(), cx, cy, BREATH_R, '--tx', 0.04, 0.2);
  breatheCircle.style.transformBox = 'fill-box';
  breatheCircle.style.transformOrigin = 'center';
  breatheCircle.style.animation = 'breathe 16s ease-in-out infinite';

  DYNASTIES.forEach((dy, i) => {
    const r = BASE_R + i * RING_GAP + J(0, 3);
    const colorVar = `--dy-${dy.key}`;

    const ringG = document.createElementNS(NS, 'g');
    ringG.setAttribute('class', `orrery-ring orrery-ring-${dy.key}`);
    // fill-box lengths are measured from the ring's own bbox corner, so a
    // px origin lands off-center — 'center' pivots on the ring's true middle
    ringG.style.transformBox = 'fill-box';
    ringG.style.transformOrigin = 'center';
    ringG.style.animation = `spin ${dy.speed}s linear infinite`;
    orreryG.node().appendChild(ringG);

    // Main circle: stroke-width .45, opacity .1
    circle(ringG, cx, cy, r, colorVar, 0.1, 0.45);
    // Dashed inner circle
    circle(ringG, cx, cy, r - 4, colorVar, 0.05, 0.12, '1.5,6');

    // Era arc — proportional to reign span
    const arcAngle = (dy.reignYears / TOTAL_YEARS) * Math.PI * 2;
    const startAngle = -Math.PI / 2;
    arc(ringG, cx, cy, r, startAngle, arcAngle, colorVar, 1.1, 0.07);

    // Diamond marker at arc start
    const dx = cx + r * Math.cos(startAngle);
    const dy2 = cy + r * Math.sin(startAngle);
    diamondAt(ringG, dx, dy2, colorVar, 0.1);
  });

  return orreryG;
}

export function pulseOrreryDynasty(parentG: any, dynastyKey: string): void {
  const ringG = parentG.select(`.orrery-ring-${dynastyKey}`);
  if (ringG.empty()) return;
  const arcPath = ringG.select('path');
  if (arcPath.empty()) return;
  arcPath.transition().duration(200).attr('opacity', 0.15)
    .transition().duration(400).attr('opacity', 0.07);
}

function circle(parent: Element, cx: number, cy: number, r: number, colorVar: string, opacity: number, strokeWidth: number, dashPattern?: string): SVGCircleElement {
  const el = document.createElementNS(NS, 'circle') as SVGCircleElement;
  el.setAttribute('cx', String(cx));
  el.setAttribute('cy', String(cy));
  el.setAttribute('r', String(r));
  el.setAttribute('fill', 'none');
  el.setAttribute('stroke', `var(${colorVar})`);
  el.setAttribute('stroke-width', String(strokeWidth));
  el.setAttribute('opacity', String(opacity));
  if (dashPattern) el.setAttribute('stroke-dasharray', dashPattern);
  parent.appendChild(el);
  return el;
}

function arc(parent: Element, cx: number, cy: number, r: number, startAngle: number, arcAngle: number, colorVar: string, strokeWidth: number, opacity: number): SVGPathElement {
  const endAngle = startAngle + arcAngle;
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const largeArc = arcAngle > Math.PI ? 1 : 0;
  const d = `M${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2}`;
  const el = document.createElementNS(NS, 'path') as SVGPathElement;
  el.setAttribute('d', d);
  el.setAttribute('fill', 'none');
  el.setAttribute('stroke', `var(${colorVar})`);
  el.setAttribute('stroke-width', String(strokeWidth));
  el.setAttribute('opacity', String(opacity));
  parent.appendChild(el);
  return el;
}

function diamondAt(parent: Element, x: number, y: number, colorVar: string, opacity: number): SVGPolygonElement {
  const s = 3;
  const pts = `${x},${y - s} ${x + s},${y} ${x},${y + s} ${x - s},${y}`;
  const el = document.createElementNS(NS, 'polygon') as SVGPolygonElement;
  el.setAttribute('points', pts);
  el.setAttribute('fill', `var(${colorVar})`);
  el.setAttribute('opacity', String(opacity));
  parent.appendChild(el);
  return el;
}

/** 8-pointed star (matching mockup's central star) */
function star8(parent: Element, cx: number, cy: number, r: number, colorVar: string, opacity: number): SVGPolygonElement {
  const ri = r * 0.25;  // inner radius
  const pts = `${cx},${cy - r} ${cx + ri},${cy - ri} ${cx + r},${cy} ${cx + ri},${cy + ri} ${cx},${cy + r} ${cx - ri},${cy + ri} ${cx - r},${cy} ${cx - ri},${cy - ri}`;
  const el = document.createElementNS(NS, 'polygon') as SVGPolygonElement;
  el.setAttribute('points', pts);
  el.setAttribute('fill', `var(${colorVar})`);
  el.setAttribute('opacity', String(opacity));
  parent.appendChild(el);
  return el;
}

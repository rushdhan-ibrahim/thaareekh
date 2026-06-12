/**
 * Self-Drawing Headpiece — ornamental SVG that draws itself on load
 * and periodically redraws every 30 seconds.
 */

const NS = 'http://www.w3.org/2000/svg';

let headpieceContainer: HTMLElement | null = null;

interface HeadpiecePart {
  d: string;
  sw: number;
  op: number;
  stroke?: string;
  fill?: string;
}

const PARTS: HeadpiecePart[] = [
  { d: 'M0,8 L72,8', sw: 0.3, op: 0.18 },
  { d: 'M128,8 L200,8', sw: 0.3, op: 0.18 },
  { d: 'M76,3 L82,8 L76,13', sw: 0.4, op: 0.3 },
  { d: 'M124,3 L118,8 L124,13', sw: 0.4, op: 0.3 },
  { d: 'M90,1 L96,8 L90,15 L84,8 Z', sw: 0.5, op: 0.4, stroke: 'var(--rubric)' },
  { d: 'M110,1 L116,8 L110,15 L104,8 Z', sw: 0.5, op: 0.4, stroke: 'var(--rubric)' },
  { d: 'M100,0 L105,8 L100,16 L95,8 Z', sw: 0.6, op: 0.5, stroke: 'var(--rubric)' },
  { d: 'M100,4 L103,8 L100,12 L97,8 Z', sw: 0.35, op: 0.25, fill: 'var(--rubric)' },
];

/** Build the headpiece SVG. Call once after sidebar DOM is ready. */
export function initHeadpiece(): void {
  const st = document.querySelector('.st');
  if (!st || headpieceContainer) return;

  headpieceContainer = document.createElement('div');
  headpieceContainer.className = 'headpiece-block';
  headpieceContainer.setAttribute('aria-hidden', 'true');

  const svg = document.createElementNS(NS, 'svg') as SVGSVGElement;
  svg.setAttribute('viewBox', '0 0 200 16');
  svg.setAttribute('width', '200');
  svg.setAttribute('height', '16');
  svg.classList.add('headpiece-svg');

  PARTS.forEach((p, i) => {
    const path = document.createElementNS(NS, 'path') as SVGPathElement;
    path.setAttribute('d', p.d);
    path.setAttribute('fill', p.fill || 'none');
    path.setAttribute('stroke', p.stroke || 'var(--tx)');
    path.setAttribute('stroke-width', String(p.sw));
    path.setAttribute('opacity', String(p.op));
    svg.appendChild(path);

    // Self-drawing animation (skip filled shapes)
    if (!p.fill) {
      const len = 0; // Will be computed after DOM insertion
      path.dataset.partIndex = String(i);
    }
  });

  headpieceContainer.appendChild(svg);

  // Insert at the top of sidebar header
  st.insertBefore(headpieceContainer, st.firstChild);

  // Compute path lengths and apply animations after DOM insertion
  requestAnimationFrame(() => {
    const paths = svg.querySelectorAll('path');
    paths.forEach((path) => {
      if (path.getAttribute('fill') !== 'none') return;
      const len = path.getTotalLength();
      if (len <= 0) return;
      const i = parseInt(path.dataset.partIndex || '0', 10);
      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = String(len);
      path.style.setProperty('--len', String(len));
      path.style.animation = `headpieceDraw 1.5s var(--ease-out) ${i * 120}ms forwards`;
    });
  });
}

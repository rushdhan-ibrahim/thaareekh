/**
 * Folio Ornaments — corner diamonds and era margin glow.
 */

const NS = 'http://www.w3.org/2000/svg';

let cornersAdded = false;

/** Add folio corner ornaments to the graph area. */
export function initFolioCorners(): void {
  const ga = document.getElementById('ga');
  if (!ga || cornersAdded) return;
  cornersAdded = true;

  const corners: { pos: string; top?: string; bottom?: string; left?: string; right?: string; w: number; h: number; points: string }[] = [
    {
      pos: 'nw', top: '6px', left: '52px', w: 26, h: 26,
      points: '13,1 15,9 13,17 11,9'
    },
    {
      pos: 'se', bottom: '6px', right: '8px', w: 22, h: 22,
      points: '11,2 20,11 11,20 2,11'
    },
  ];

  corners.forEach(c => {
    const div = document.createElement('div');
    div.className = `folio-corner folio-corner--${c.pos}`;
    div.setAttribute('aria-hidden', 'true');
    if (c.top) div.style.top = c.top;
    if (c.bottom) div.style.bottom = c.bottom;
    if (c.left) div.style.left = c.left;
    if (c.right) div.style.right = c.right;
    div.style.width = `${c.w}px`;
    div.style.height = `${c.h}px`;

    const svg = document.createElementNS(NS, 'svg') as SVGSVGElement;
    svg.setAttribute('viewBox', `0 0 ${c.w} ${c.h}`);

    const poly = document.createElementNS(NS, 'polygon');
    poly.setAttribute('points', c.points);
    poly.setAttribute('fill', 'none');
    poly.setAttribute('stroke', 'var(--tx)');
    poly.setAttribute('stroke-width', '0.35');
    poly.setAttribute('opacity', '0.5');
    svg.appendChild(poly);

    // Inner fill
    if (c.pos === 'nw') {
      const inner = document.createElementNS(NS, 'polygon');
      inner.setAttribute('points', '13,4 14.5,9 13,14 11.5,9');
      inner.setAttribute('fill', 'var(--tx)');
      inner.setAttribute('opacity', '0.2');
      svg.appendChild(inner);
    }

    div.appendChild(svg);
    ga.appendChild(div);
  });
}

let eraGlowEl: HTMLElement | null = null;

/** Add era margin glow to the graph area. */
export function initEraGlow(): void {
  const ga = document.getElementById('ga');
  if (!ga || eraGlowEl) return;

  eraGlowEl = document.createElement('div');
  eraGlowEl.className = 'era-glow';
  eraGlowEl.setAttribute('aria-hidden', 'true');
  ga.appendChild(eraGlowEl);
}

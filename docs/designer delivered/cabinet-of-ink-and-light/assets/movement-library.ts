namespace MovementLibrary {
  type Num = number | string;
  const NS = 'http://www.w3.org/2000/svg';

  export type ArtifactKind =
    | 'astrolabe'
    | 'vesica'
    | 'roseWindow'
    | 'labyrinth'
    | 'eclipseEngine'
    | 'aetherKnot'
    | 'chaplet'
    | 'waterClock'
    | 'pilgrimStar'
    | 'lanternWindow'
    | 'sigilBloom'
    | 'memoryField';

  export interface RenderOptions {
    seed?: number;
    compact?: boolean;
  }

  export interface GalleryPlate {
    numeral: string;
    title: string;
    caption?: string;
    kind: ArtifactKind;
    code: string;
    divider?: string;
    seed?: number;
    viewBox?: string;
    width?: number;
    height?: number;
    note?: string;
  }

  interface Animator {
    element: SVGSVGElement;
    update: (time: number) => void;
  }

  const animators: Animator[] = [];
  let rafId = 0;

  const defaults: Record<ArtifactKind, { viewBox: string; width: number; height: number }> = {
    astrolabe: { viewBox: '0 0 320 320', width: 292, height: 292 },
    vesica: { viewBox: '0 0 320 320', width: 292, height: 292 },
    roseWindow: { viewBox: '0 0 320 320', width: 292, height: 292 },
    labyrinth: { viewBox: '0 0 320 320', width: 292, height: 292 },
    eclipseEngine: { viewBox: '0 0 380 220', width: 360, height: 210 },
    aetherKnot: { viewBox: '0 0 360 220', width: 340, height: 210 },
    chaplet: { viewBox: '0 0 320 320', width: 292, height: 292 },
    waterClock: { viewBox: '0 0 220 360', width: 198, height: 324 },
    pilgrimStar: { viewBox: '0 0 320 320', width: 292, height: 292 },
    lanternWindow: { viewBox: '0 0 220 360', width: 198, height: 324 },
    sigilBloom: { viewBox: '0 0 320 320', width: 292, height: 292 },
    memoryField: { viewBox: '0 0 380 240', width: 360, height: 228 },
  };

  function loop(time: number): void {
    rafId = window.requestAnimationFrame(loop);
    if (document.hidden) return;
    for (const animator of animators) {
      const plate = animator.element.closest('.plate, .geometric-plate, .artefact-plate') as HTMLElement | null;
      if (plate && !plate.classList.contains('is-active') && !plate.classList.contains('vis')) continue;
      animator.update(time);
    }
  }

  function ensureLoop(): void {
    if (!rafId) {
      rafId = window.requestAnimationFrame(loop);
    }
  }

  function addAnimator(element: SVGSVGElement, update: (time: number) => void): void {
    animators.push({ element, update });
    ensureLoop();
  }

  function mulberry32(seed: number): () => number {
    let a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function create<K extends keyof SVGElementTagNameMap>(
    tag: K,
    attrs: Record<string, Num> = {},
    parent?: SVGElement,
  ): SVGElementTagNameMap[K] {
    const node = document.createElementNS(NS, tag);
    for (const [key, value] of Object.entries(attrs)) {
      node.setAttribute(key, String(value));
    }
    if (parent) parent.appendChild(node);
    return node;
  }

  function setAttrs(node: Element, attrs: Record<string, Num>): void {
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  }

  function clear(svg: SVGSVGElement): void {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
  }

  function polar(cx: number, cy: number, radius: number, angle: number): [number, number] {
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
  }

  function pointRing(cx: number, cy: number, outer: number, inner: number, count: number, rotation = -Math.PI / 2): string {
    let points = '';
    for (let i = 0; i < count * 2; i++) {
      const angle = rotation + (Math.PI * i) / count;
      const radius = i % 2 === 0 ? outer : inner;
      const [x, y] = polar(cx, cy, radius, angle);
      points += `${x.toFixed(1)},${y.toFixed(1)} `;
    }
    return points.trim();
  }

  function sampledPath(
    sample: (t: number) => [number, number],
    steps = 160,
    closed = false,
  ): string {
    let d = '';
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const [x, y] = sample(t);
      d += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    }
    if (closed) d += 'Z';
    return d;
  }

  function arcPath(
    cx: number,
    cy: number,
    radius: number,
    startAngle: number,
    endAngle: number,
  ): string {
    const [x1, y1] = polar(cx, cy, radius, startAngle);
    const [x2, y2] = polar(cx, cy, radius, endAngle);
    const large = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
    const sweep = endAngle > startAngle ? 1 : 0;
    return `M${x1.toFixed(2)},${y1.toFixed(2)} A${radius},${radius} 0 ${large} ${sweep} ${x2.toFixed(2)},${y2.toFixed(2)}`;
  }

  function drawClass(node: Element): void {
    node.classList.add('relic-draw');
  }

  function drawLater(scope: Element): void {
    scope.querySelectorAll<SVGGeometryElement>('.relic-draw').forEach((path) => {
      try {
        const length = path.getTotalLength();
        (path as SVGGeometryElement).style.strokeDasharray = `${length}`;
        (path as SVGGeometryElement).style.strokeDashoffset = `${length}`;
      } catch (error) {
        // No total length available for this geometry. Ignore it.
      }
    });
  }

  function rootGroup(svg: SVGSVGElement, className: string): SVGGElement {
    return create('g', { class: className }, svg);
  }

  function addText(svg: SVGSVGElement, x: number, y: number, text: string, rubric = false, size = 10, anchor = 'start'): void {
    const node = create('text', {
      x,
      y,
      fill: rubric ? 'var(--rubric)' : 'var(--ink-soft)',
      'font-family': "'EB Garamond', Georgia, serif",
      'font-size': size,
      'font-style': 'italic',
      'text-anchor': anchor,
      opacity: rubric ? 0.72 : 0.52,
    }, svg);
    node.textContent = text;
  }

  function ornamentRing(svg: SVGSVGElement, cx: number, cy: number, radius: number, count: number, seed: number): void {
    const rng = mulberry32(seed);
    const g = create('g', { opacity: 0.7 }, svg);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const [x, y] = polar(cx, cy, radius + (rng() - 0.5) * 1.8, angle);
      const symbol = i % 2 === 0 ? pointRing(x, y, 3.1, 1.5, 4, angle) : pointRing(x, y, 2.3, 1.2, 4, angle + Math.PI / 4);
      create('polygon', {
        points: symbol,
        fill: i % 2 === 0 ? 'none' : 'var(--ink)',
        stroke: 'var(--ink)',
        'stroke-width': 0.32,
      }, g);
    }
  }

  function renderAstrolabe(svg: SVGSVGElement, seed: number): void {
    clear(svg);
    const rng = mulberry32(seed);
    const c = 160;
    const outer = rootGroup(svg, 'relic-spin-slow');
    const inner = rootGroup(svg, 'relic-spin-reverse');
    const staticLayer = create('g', {}, svg);

    [138, 120, 102, 82, 58].forEach((r, i) => {
      const circle = create('circle', {
        cx: c,
        cy: c,
        r,
        fill: 'none',
        stroke: 'var(--ink)',
        'stroke-width': i === 0 ? 0.8 : 0.4,
        opacity: i === 0 ? 0.95 : 0.62,
      }, outer);
      drawClass(circle);
    });

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
      const [x1, y1] = polar(c, c, 26, angle);
      const [x2, y2] = polar(c, c, 134, angle);
      const line = create('line', {
        x1, y1, x2, y2,
        stroke: 'var(--ink)',
        'stroke-width': i % 2 === 0 ? 0.55 : 0.22,
        opacity: i % 2 === 0 ? 0.78 : 0.42,
      }, staticLayer);
      drawClass(line);
    }

    for (let i = 0; i < 5; i++) {
      const start = -Math.PI * 0.12 + i * 0.18;
      const end = Math.PI * 1.18 - i * 0.12;
      const arc = create('path', {
        d: arcPath(c, c, 36 + i * 18, start, end),
        fill: 'none',
        stroke: 'var(--ink)',
        'stroke-width': 0.32,
        opacity: 0.48,
      }, inner);
      drawClass(arc);
    }

    const rete = create('polygon', {
      points: pointRing(c, c, 72, 28, 8),
      fill: 'none',
      stroke: 'var(--ink)',
      'stroke-width': 0.8,
      opacity: 0.84,
    }, inner);
    drawClass(rete);

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
      const [x, y] = polar(c, c, 92 + (rng() - 0.5) * 2, angle);
      create('circle', {
        cx: x,
        cy: y,
        r: 2 + rng() * 1.1,
        fill: 'var(--ink)',
        opacity: 0.88,
      }, inner);
    }

    const center = create('circle', {
      cx: c,
      cy: c,
      r: 10,
      fill: 'none',
      stroke: 'var(--ink)',
      'stroke-width': 0.4,
      class: 'relic-breathe',
    }, svg);
    drawClass(center);

    ornamentRing(svg, c, c, 148, 12, seed + 17);
    addText(svg, 250, 34, 'altitude · declination', true, 8, 'end');
    addText(svg, 70, 302, 'rete in contrary motion', false, 8, 'start');
    drawLater(svg);
  }

  function renderVesica(svg: SVGSVGElement, seed: number): void {
    clear(svg);
    const rng = mulberry32(seed);
    const cx = 160;
    const cy = 160;
    const radius = 92;
    const overlap = 52;
    const left = create('g', { class: 'relic-breathe' }, svg);
    const right = create('g', { class: 'relic-breathe relic-delay-2' }, svg);

    const c1 = create('circle', {
      cx: cx - overlap,
      cy,
      r: radius,
      fill: 'none',
      stroke: 'var(--ink)',
      'stroke-width': 0.8,
      opacity: 0.9,
    }, left);
    drawClass(c1);

    const c2 = create('circle', {
      cx: cx + overlap,
      cy,
      r: radius,
      fill: 'none',
      stroke: 'var(--ink)',
      'stroke-width': 0.8,
      opacity: 0.9,
    }, right);
    drawClass(c2);

    const vesica = create('path', {
      d: `M${cx.toFixed(1)},${(cy - 76).toFixed(1)} C${(cx - 42).toFixed(1)},${(cy - 56).toFixed(1)} ${
        (cx - 42).toFixed(1)
      },${(cy + 56).toFixed(1)} ${cx.toFixed(1)},${(cy + 76).toFixed(1)} C${(cx + 42).toFixed(1)},${
        (cy + 56).toFixed(1)
      } ${(cx + 42).toFixed(1)},${(cy - 56).toFixed(1)} ${cx.toFixed(1)},${(cy - 76).toFixed(1)}Z`,
      fill: 'none',
      stroke: 'var(--ink)',
      'stroke-width': 0.85,
      opacity: 0.9,
    }, svg);
    drawClass(vesica);

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const [x, y] = polar(cx, cy, 22 + i * 9.5, angle + (i % 2) * 0.14);
      const dot = create('circle', {
        cx: x,
        cy: y,
        r: 1.6 + rng() * 1.1,
        fill: 'var(--ink)',
        opacity: 0.75,
      }, svg);
      if (i % 2 === 0) dot.classList.add('relic-float');
    }

    const almondStar = create('polygon', {
      points: pointRing(cx, cy, 18, 7, 8),
      fill: 'var(--ink)',
      opacity: 0.88,
      class: 'relic-pulse',
    }, svg);
    drawClass(almondStar);

    [-112, 112].forEach((offset, idx) => {
      const arc = create('path', {
        d: arcPath(cx, cy, 132, idx === 0 ? Math.PI * 0.72 : -Math.PI * 0.28, idx === 0 ? Math.PI * 1.28 : Math.PI * 0.28),
        fill: 'none',
        stroke: 'var(--ink)',
        'stroke-width': 0.28,
        opacity: 0.38,
      }, svg);
      drawClass(arc);
      const [tx, ty] = polar(cx, cy, 134, idx === 0 ? Math.PI : 0);
      create('circle', { cx: tx, cy: ty, r: 2.4, fill: 'var(--ink)' }, svg);
    });

    addText(svg, 160, 36, 'intersection as revelation', true, 8, 'middle');
    addText(svg, 160, 304, 'two circles, one interior door', false, 8, 'middle');
    drawLater(svg);
  }

  function renderRoseWindow(svg: SVGSVGElement, seed: number): void {
    clear(svg);
    const rng = mulberry32(seed);
    const c = 160;
    const outer = rootGroup(svg, 'relic-spin-slow');
    const inner = rootGroup(svg, 'relic-spin-reverse');
    const petals = 12;

    [138, 112, 84, 54, 28].forEach((r, i) => {
      const circle = create('circle', {
        cx: c,
        cy: c,
        r,
        fill: 'none',
        stroke: 'var(--ink)',
        'stroke-width': i === 0 ? 0.7 : 0.3,
        opacity: 0.78,
      }, outer);
      drawClass(circle);
    });

    for (let i = 0; i < petals; i++) {
      const angle = (i / petals) * Math.PI * 2 - Math.PI / 2;
      const [x, y] = polar(c, c, 70, angle);
      const p = create('circle', {
        cx: x,
        cy: y,
        r: 34 + rng() * 1.6,
        fill: 'none',
        stroke: 'var(--ink)',
        'stroke-width': 0.55,
        opacity: 0.85,
      }, inner);
      drawClass(p);
    }

    for (let i = 0; i < petals; i++) {
      const angle = (i / petals) * Math.PI * 2 - Math.PI / 2;
      const [x1, y1] = polar(c, c, 26, angle);
      const [x2, y2] = polar(c, c, 136, angle);
      const spoke = create('line', {
        x1,
        y1,
        x2,
        y2,
        stroke: 'var(--ink)',
        'stroke-width': i % 3 === 0 ? 0.45 : 0.22,
        opacity: i % 3 === 0 ? 0.62 : 0.34,
      }, svg);
      drawClass(spoke);
    }

    create('polygon', {
      points: pointRing(c, c, 22, 9, 8),
      fill: 'none',
      stroke: 'var(--ink)',
      'stroke-width': 0.7,
      class: 'relic-pulse',
    }, svg);

    ornamentRing(svg, c, c, 148, 16, seed + 40);
    addText(svg, 160, 304, 'tracery turning on a hidden axle', false, 8, 'middle');
    drawLater(svg);
  }

  function renderLabyrinth(svg: SVGSVGElement, seed: number): void {
    clear(svg);
    const rng = mulberry32(seed);
    const cx = 160;
    const cy = 160;
    const g = create('g', { class: 'relic-breathe' }, svg);

    const segments: Array<[number, number, number, number]> = [];
    let left = 42;
    let right = 278;
    let top = 42;
    let bottom = 278;
    let horizontal = true;
    while (right - left > 28 && bottom - top > 28) {
      if (horizontal) {
        segments.push([left, top, right, top]);
        segments.push([right, top, right, bottom - 18]);
        top += 18 + rng() * 8;
        right -= 18 + rng() * 8;
      } else {
        segments.push([right, bottom, left + 18, bottom]);
        segments.push([left, bottom, left, top]);
        bottom -= 18 + rng() * 8;
        left += 18 + rng() * 8;
      }
      horizontal = !horizontal;
    }

    for (const [x1, y1, x2, y2] of segments) {
      const line = create('line', {
        x1: x1.toFixed(1),
        y1: y1.toFixed(1),
        x2: x2.toFixed(1),
        y2: y2.toFixed(1),
        stroke: 'var(--ink)',
        'stroke-width': 1.0,
        'stroke-linecap': 'square',
        opacity: 0.88,
      }, g);
      drawClass(line);
    }

    for (let i = 0; i < 4; i++) {
      const square = create('rect', {
        x: 52 + i * 22,
        y: 52 + i * 22,
        width: 216 - i * 44,
        height: 216 - i * 44,
        fill: 'none',
        stroke: 'var(--ink)',
        'stroke-width': 0.24,
        opacity: 0.32,
      }, svg);
      drawClass(square);
    }

    create('polygon', {
      points: pointRing(cx, cy, 14, 5.4, 4, Math.PI / 4),
      fill: 'var(--ink)',
      opacity: 0.84,
      class: 'relic-pulse',
    }, svg);

    addText(svg, 160, 26, 'recursion as pilgrimage', true, 8, 'middle');
    addText(svg, 160, 304, 'every turn is still inward', false, 8, 'middle');
    drawLater(svg);
  }

  function renderEclipseEngine(svg: SVGSVGElement, seed: number): void {
    clear(svg);
    const cx = 190;
    const cy = 110;
    const outer = create('g', {}, svg);
    const moon = create('g', { class: 'relic-shadow-disc' }, svg);

    [86, 62, 42].forEach((r, i) => {
      const circle = create('circle', {
        cx,
        cy,
        r,
        fill: 'none',
        stroke: 'var(--ink)',
        'stroke-width': i === 0 ? 0.7 : 0.28,
        opacity: 0.75,
      }, outer);
      drawClass(circle);
    });

    for (let i = 0; i < 18; i++) {
      const angle = -Math.PI / 2 + (i / 18) * Math.PI * 2;
      const [x1, y1] = polar(cx, cy, 94, angle);
      const [x2, y2] = polar(cx, cy, 128, angle);
      const line = create('line', {
        x1,
        y1,
        x2,
        y2,
        stroke: 'var(--ink)',
        'stroke-width': i % 3 === 0 ? 0.4 : 0.18,
        opacity: 0.28,
      }, outer);
      drawClass(line);
    }

    create('circle', {
      cx: 78,
      cy,
      r: 48,
      fill: 'none',
      stroke: 'var(--ink)',
      'stroke-width': 0.55,
      opacity: 0.72,
    }, outer);
    create('line', {
      x1: 18,
      y1: cy,
      x2: 356,
      y2: cy,
      stroke: 'var(--ink)',
      'stroke-width': 0.25,
      opacity: 0.32,
    }, outer);

    create('circle', {
      cx: cx + 32,
      cy,
      r: 30,
      fill: 'var(--paper)',
      stroke: 'var(--ink)',
      'stroke-width': 0.65,
      opacity: 0.96,
    }, moon);

    const corona = create('circle', {
      cx,
      cy,
      r: 24,
      fill: 'none',
      stroke: 'var(--ink)',
      'stroke-width': 0.4,
      opacity: 0.4,
      class: 'relic-pulse',
    }, svg);
    drawClass(corona);

    addText(svg, 30, 28, 'penumbra / occlusion / return', true, 8, 'start');
    addText(svg, 330, 198, 'shadow made measurable', false, 8, 'end');
    drawLater(svg);

    addAnimator(svg, (time) => {
      const phase = (time * 0.00018 + seed * 0.03) % 1;
      const x = 148 + Math.sin(phase * Math.PI * 2) * 68;
      setAttrs(moon.firstElementChild as Element, { cx: x.toFixed(2), cy: cy });
    });
  }

  function renderAetherKnot(svg: SVGSVGElement, seed: number): void {
    clear(svg);
    const cx = 180;
    const cy = 110;
    const pathA = sampledPath((t) => {
      const a = t * Math.PI * 2;
      const x = cx + 112 * Math.sin(a);
      const y = cy + 58 * Math.sin(a) * Math.cos(a);
      return [x, y];
    }, 260);

    const pathB = sampledPath((t) => {
      const a = t * Math.PI * 2;
      const x = cx + 88 * Math.sin(a + Math.PI / 2);
      const y = cy + 36 * Math.sin(a + Math.PI / 2) * Math.cos(a + Math.PI / 2);
      return [x, y];
    }, 220);

    const p1 = create('path', {
      d: pathA,
      fill: 'none',
      stroke: 'var(--ink)',
      'stroke-width': 0.95,
      opacity: 0.9,
    }, svg);
    drawClass(p1);

    const p2 = create('path', {
      d: pathB,
      fill: 'none',
      stroke: 'var(--ink)',
      'stroke-width': 0.35,
      opacity: 0.38,
    }, svg);
    drawClass(p2);

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const [x, y] = polar(cx, cy, 86, angle);
      create('circle', { cx: x, cy: y, r: 2.2, fill: 'var(--ink)', opacity: 0.78 }, svg);
    }

    create('line', { x1: 26, y1: cy, x2: 334, y2: cy, stroke: 'var(--ink)', 'stroke-width': 0.18, opacity: 0.25 }, svg);
    create('line', { x1: cx, y1: 24, x2: cx, y2: 196, stroke: 'var(--ink)', 'stroke-width': 0.18, opacity: 0.25 }, svg);

    const tracer = create('circle', { cx: cx + 112, cy, r: 3.2, fill: 'var(--ink)' }, svg);
    addText(svg, 26, 28, 'braid of returning curves', true, 8, 'start');
    addText(svg, 334, 198, 'the knot remembers its own passage', false, 8, 'end');
    drawLater(svg);

    addAnimator(svg, (time) => {
      const t = ((time * 0.00008) + seed * 0.11) % 1;
      const a = t * Math.PI * 2;
      const x = cx + 112 * Math.sin(a);
      const y = cy + 58 * Math.sin(a) * Math.cos(a);
      setAttrs(tracer, { cx: x.toFixed(2), cy: y.toFixed(2) });
    });
  }

  function renderChaplet(svg: SVGSVGElement, seed: number): void {
    clear(svg);
    const rng = mulberry32(seed);
    const c = 160;
    const rosary = rootGroup(svg, 'relic-spin-slow');

    create('circle', {
      cx: c,
      cy: c,
      r: 104,
      fill: 'none',
      stroke: 'var(--ink)',
      'stroke-width': 0.55,
      opacity: 0.48,
    }, rosary);

    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2 - Math.PI / 2;
      const [x, y] = polar(c, c, 104, angle);
      create('circle', {
        cx: x,
        cy: y,
        r: i % 9 === 0 ? 5 : 3.2,
        fill: i % 9 === 0 ? 'none' : 'var(--ink)',
        stroke: 'var(--ink)',
        'stroke-width': i % 9 === 0 ? 0.45 : 0.18,
        opacity: 0.85,
      }, rosary);
    }

    const inner = create('g', { class: 'relic-spin-reverse' }, svg);
    create('polygon', {
      points: pointRing(c, c, 44, 16, 8),
      fill: 'none',
      stroke: 'var(--ink)',
      'stroke-width': 0.65,
      opacity: 0.82,
    }, inner);
    [36, 58, 80].forEach((r) => {
      const arc = create('path', {
        d: arcPath(c, c, r, -Math.PI * 0.65, Math.PI * 0.65),
        fill: 'none',
        stroke: 'var(--ink)',
        'stroke-width': 0.28,
        opacity: 0.4,
      }, inner);
      drawClass(arc);
    });

    const chain = create('g', { class: 'relic-sway' }, svg);
    for (let i = 0; i < 7; i++) {
      create('line', {
        x1: c,
        y1: 214 + i * 12,
        x2: c,
        y2: 224 + i * 12,
        stroke: 'var(--ink)',
        'stroke-width': 0.38,
        opacity: 0.8,
      }, chain);
      create('circle', { cx: c, cy: 230 + i * 12, r: i === 6 ? 5.2 : 2.2, fill: 'var(--ink)', opacity: 0.86 }, chain);
    }

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const [x, y] = polar(c, c, 68, angle);
      create('circle', { cx: x, cy: y, r: 1.6 + rng() * 0.8, fill: 'var(--ink)', opacity: 0.7 }, svg);
    }

    addText(svg, 160, 28, 'counted by angle and breath', true, 8, 'middle');
    addText(svg, 160, 304, 'thirty-six beads, one returning loop', false, 8, 'middle');
    drawLater(svg);
  }

  function renderWaterClock(svg: SVGSVGElement, seed: number): void {
    clear(svg);
    const cx = 110;
    const vessel = create('g', {}, svg);
    const drops = create('g', {}, svg);
    const ripples = create('g', {}, svg);

    const outline1 = create('path', {
      d: 'M48,28 C48,112 74,138 96,176 C116,210 116,262 96,312',
      fill: 'none',
      stroke: 'var(--ink)',
      'stroke-width': 0.9,
      opacity: 0.88,
    }, vessel);
    drawClass(outline1);

    const outline2 = create('path', {
      d: 'M172,28 C172,112 146,138 124,176 C104,210 104,262 124,312',
      fill: 'none',
      stroke: 'var(--ink)',
      'stroke-width': 0.9,
      opacity: 0.88,
    }, vessel);
    drawClass(outline2);

    ['28', '312'].forEach((y) => {
      const line = create('line', {
        x1: 48,
        y1: y,
        x2: 172,
        y2: y,
        stroke: 'var(--ink)',
        'stroke-width': 1.05,
      }, vessel);
      drawClass(line);
    });

    create('circle', { cx, cy: 176, r: 5.2, fill: 'none', stroke: 'var(--ink)', 'stroke-width': 0.35, opacity: 0.8 }, vessel);

    for (let i = 0; i < 4; i++) {
      create('ellipse', {
        cx,
        cy: 274 + i * 12,
        rx: 28 + i * 12,
        ry: 6 + i * 1.4,
        fill: 'none',
        stroke: 'var(--ink)',
        'stroke-width': 0.24,
        opacity: 0.3 + i * 0.06,
      }, ripples);
    }

    const falling: SVGCircleElement[] = [];
    for (let i = 0; i < 6; i++) {
      const dot = create('circle', { cx, cy: 114 - i * 18, r: 1.9, fill: 'var(--ink)', opacity: 0.65 }, drops);
      falling.push(dot);
    }

    addText(svg, 110, 18, 'gravity writing time', true, 8, 'middle');
    addText(svg, 110, 346, 'drip / pool / measure / repeat', false, 8, 'middle');
    drawLater(svg);

    addAnimator(svg, (time) => {
      const base = time * 0.00018 + seed * 0.09;
      falling.forEach((dot, i) => {
        const phase = (base + i * 0.17) % 1;
        const y = 108 + phase * 120;
        const x = cx + Math.sin(phase * Math.PI * 4 + i) * 4;
        const opacity = phase < 0.94 ? 0.6 : 0.15;
        setAttrs(dot, { cx: x.toFixed(2), cy: y.toFixed(2), opacity: opacity.toFixed(2) });
      });
      ripples.childNodes.forEach((node, i) => {
        const ripple = node as SVGEllipseElement;
        const phase = ((base * 0.7) + i * 0.14) % 1;
        setAttrs(ripple, {
          rx: (24 + i * 11 + phase * 12).toFixed(2),
          opacity: (0.12 + (1 - phase) * 0.22).toFixed(2),
        });
      });
    });
  }

  function renderPilgrimStar(svg: SVGSVGElement, seed: number): void {
    clear(svg);
    const rng = mulberry32(seed);
    const c = 160;
    const orbits = rootGroup(svg, 'relic-spin-slow');
    const field = rootGroup(svg, 'relic-spin-reverse');

    [132, 98, 70, 42].forEach((r, i) => {
      const circle = create('circle', {
        cx: c,
        cy: c,
        r,
        fill: 'none',
        stroke: 'var(--ink)',
        'stroke-width': i === 0 ? 0.65 : 0.28,
        opacity: 0.72,
      }, orbits);
      drawClass(circle);
    });

    const star = create('polygon', {
      points: pointRing(c, c, 78, 24, 8),
      fill: 'none',
      stroke: 'var(--ink)',
      'stroke-width': 0.9,
      opacity: 0.86,
    }, svg);
    drawClass(star);

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
      const [x2, y2] = polar(c, c, 126, angle);
      const line = create('line', {
        x1: c,
        y1: c,
        x2: x2.toFixed(1),
        y2: y2.toFixed(1),
        stroke: 'var(--ink)',
        'stroke-width': i % 2 === 0 ? 0.44 : 0.22,
        opacity: i % 2 === 0 ? 0.72 : 0.38,
      }, svg);
      drawClass(line);
      create('circle', { cx: x2, cy: y2, r: i % 2 === 0 ? 3.2 : 2.1, fill: 'var(--ink)', opacity: 0.86 }, field);
    }

    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2 + rng() * 0.14;
      const [x, y] = polar(c, c, 48 + (i % 4) * 20, angle);
      create('circle', { cx: x, cy: y, r: 1.2 + rng() * 1.6, fill: 'var(--ink)', opacity: 0.7 }, field);
    }

    create('polygon', {
      points: pointRing(c, c, 18, 7, 8),
      fill: 'var(--ink)',
      opacity: 0.92,
      class: 'relic-pulse',
    }, svg);

    addText(svg, 160, 22, 'route and constellation, same grammar', true, 8, 'middle');
    addText(svg, 160, 304, 'the map inside the traveller', false, 8, 'middle');
    drawLater(svg);
  }

  function renderLanternWindow(svg: SVGSVGElement, seed: number): void {
    clear(svg);
    const cx = 110;
    const frame = create('g', {}, svg);
    const light = create('g', { class: 'relic-breathe' }, svg);

    const arch = create('path', {
      d: 'M40,320 L40,118 C40,62 72,28 110,28 C148,28 180,62 180,118 L180,320',
      fill: 'none',
      stroke: 'var(--ink)',
      'stroke-width': 1.1,
      opacity: 0.9,
    }, frame);
    drawClass(arch);

    [272, 232, 190, 146].forEach((y, i) => {
      const line = create('line', {
        x1: 58,
        y1: y,
        x2: 162,
        y2: y,
        stroke: 'var(--ink)',
        'stroke-width': i === 0 ? 0.55 : 0.24,
        opacity: i === 0 ? 0.52 : 0.3,
      }, frame);
      drawClass(line);
    });

    [66, 98, 122, 78].forEach((r, i) => {
      const circle = create('circle', {
        cx,
        cy: 128,
        r,
        fill: 'none',
        stroke: 'var(--ink)',
        'stroke-width': i === 0 ? 0.55 : 0.25,
        opacity: 0.72 - i * 0.1,
      }, light);
      drawClass(circle);
    });

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
      const [x, y] = polar(cx, 128, 56, angle);
      create('circle', { cx: x, cy: y, r: 21, fill: 'none', stroke: 'var(--ink)', 'stroke-width': 0.4, opacity: 0.62 }, light);
    }

    create('polygon', {
      points: pointRing(cx, 128, 16, 6, 8),
      fill: 'var(--ink)',
      opacity: 0.9,
      class: 'relic-pulse',
    }, light);

    ornamentRing(svg, cx, 128, 146, 8, seed + 10);
    addText(svg, 110, 18, 'light caught in stone geometry', true, 8, 'middle');
    addText(svg, 110, 346, 'tracery as vessel', false, 8, 'middle');
    drawLater(svg);
  }

  function renderSigilBloom(svg: SVGSVGElement, seed: number): void {
    clear(svg);
    const c = 160;
    const outer = rootGroup(svg, 'relic-spin-slow');
    const inner = rootGroup(svg, 'relic-spin-reverse');

    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const [x, y] = polar(c, c, 78, angle);
      const crescent = create('path', {
        d: `M${x - 20},${y} A22,22 0 1 1 ${x + 20},${y} A15,15 0 1 0 ${x - 20},${y}`,
        fill: i % 2 === 0 ? 'var(--ink)' : 'none',
        stroke: 'var(--ink)',
        'stroke-width': 0.55,
        opacity: 0.85,
      }, outer);
      drawClass(crescent);
      setAttrs(crescent, { transform: `rotate(${(angle * 180) / Math.PI}, ${x}, ${y})` });
    }

    const diamond = create('polygon', {
      points: pointRing(c, c, 66, 18, 4, Math.PI / 4),
      fill: 'none',
      stroke: 'var(--ink)',
      'stroke-width': 0.78,
      opacity: 0.9,
    }, inner);
    drawClass(diamond);

    [32, 52, 96, 122].forEach((r) => {
      const circle = create('circle', { cx: c, cy: c, r, fill: 'none', stroke: 'var(--ink)', 'stroke-width': 0.25, opacity: 0.36 }, svg);
      drawClass(circle);
    });

    create('polygon', {
      points: pointRing(c, c, 18, 7.2, 8),
      fill: 'var(--ink)',
      opacity: 0.92,
      class: 'relic-pulse',
    }, svg);

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const [x, y] = polar(c, c, 114, angle);
      create('circle', { cx: x, cy: y, r: i % 2 === 0 ? 3 : 1.5, fill: 'var(--ink)', opacity: 0.78 }, svg);
    }

    addText(svg, 160, 22, 'fourfold bloom around a seal', true, 8, 'middle');
    addText(svg, 160, 304, 'crescent / diamond / star / return', false, 8, 'middle');
    drawLater(svg);
  }

  function renderMemoryField(svg: SVGSVGElement, seed: number): void {
    clear(svg);
    const rng = mulberry32(seed);
    const field = create('g', {}, svg);

    for (let i = 0; i < 11; i++) {
      const x = 28 + i * 32;
      const sway = (i % 2 === 0 ? -1 : 1) * (1.8 + i * 0.14);
      const line = create('line', {
        x1: x,
        y1: 24,
        x2: x,
        y2: 210,
        stroke: 'var(--ink)',
        'stroke-width': i % 3 === 0 ? 0.65 : 0.35,
        opacity: 0.75,
        class: `relic-sway relic-delay-${(i % 3) + 1}`,
      }, field);
      line.style.transformOrigin = `${x}px 24px`;
      line.style.setProperty('--relic-sway-angle', `${sway}deg`);
      drawClass(line);

      for (let j = 0; j < 4; j++) {
        const y = 56 + j * 40 + (rng() - 0.5) * 12;
        create('circle', {
          cx: x,
          cy: y.toFixed(1),
          r: j === 2 && i % 4 === 0 ? 5 : 2.4 + rng() * 1.4,
          fill: j === 2 && i % 4 === 0 ? 'none' : 'var(--ink)',
          stroke: 'var(--ink)',
          'stroke-width': j === 2 && i % 4 === 0 ? 0.48 : 0.18,
          opacity: 0.84,
        }, field);
      }
    }

    for (let i = 0; i < 5; i++) {
      const path = create('path', {
        d: sampledPath((t) => {
          const x = 28 + t * 324;
          const y = 118 + Math.sin((t * Math.PI * 2 * (i + 1)) + i * 0.8) * (12 + i * 4);
          return [x, y];
        }, 120),
        fill: 'none',
        stroke: 'var(--ink)',
        'stroke-width': 0.18,
        opacity: 0.15 + i * 0.04,
      }, svg);
      drawClass(path);
    }

    addText(svg, 24, 22, 'a hanging notation of thought', true, 8, 'start');
    addText(svg, 356, 228, 'numbers remembered as weight and interval', false, 8, 'end');
    drawLater(svg);
  }

  const registry: Record<ArtifactKind, (svg: SVGSVGElement, seed: number) => void> = {
    astrolabe: renderAstrolabe,
    vesica: renderVesica,
    roseWindow: renderRoseWindow,
    labyrinth: renderLabyrinth,
    eclipseEngine: renderEclipseEngine,
    aetherKnot: renderAetherKnot,
    chaplet: renderChaplet,
    waterClock: renderWaterClock,
    pilgrimStar: renderPilgrimStar,
    lanternWindow: renderLanternWindow,
    sigilBloom: renderSigilBloom,
    memoryField: renderMemoryField,
  };

  function miniMedallion(kind: ArtifactKind, svg: SVGSVGElement, seed: number): void {
    clear(svg);
    svg.setAttribute('viewBox', '0 0 96 96');
    const c = 48;
    const outer = create('circle', {
      cx: c,
      cy: c,
      r: 38,
      fill: 'none',
      stroke: 'var(--ink)',
      'stroke-width': 0.5,
      opacity: 0.72,
    }, svg);
    drawClass(outer);

    if (kind === 'vesica') {
      create('circle', { cx: 40, cy: 48, r: 22, fill: 'none', stroke: 'var(--ink)', 'stroke-width': 0.5, opacity: 0.8 }, svg);
      create('circle', { cx: 56, cy: 48, r: 22, fill: 'none', stroke: 'var(--ink)', 'stroke-width': 0.5, opacity: 0.8 }, svg);
      create('polygon', { points: pointRing(c, c, 8, 3, 8), fill: 'var(--ink)', opacity: 0.88 }, svg);
    } else if (kind === 'labyrinth') {
      [[18, 18, 60, 60], [26, 26, 44, 44], [34, 34, 28, 28]].forEach(([x, y, w, h]) => {
        const rect = create('rect', { x, y, width: w, height: h, fill: 'none', stroke: 'var(--ink)', 'stroke-width': 0.35, opacity: 0.72 }, svg);
        drawClass(rect);
      });
      create('polygon', { points: pointRing(c, c, 7, 3, 4, Math.PI / 4), fill: 'var(--ink)', opacity: 0.9 }, svg);
    } else if (kind === 'chaplet') {
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const [x, y] = polar(c, c, 28, angle);
        create('circle', { cx: x, cy: y, r: i % 3 === 0 ? 3.2 : 1.8, fill: 'var(--ink)', opacity: 0.82 }, svg);
      }
      create('line', { x1: c, y1: 64, x2: c, y2: 84, stroke: 'var(--ink)', 'stroke-width': 0.4 }, svg);
      create('circle', { cx: c, cy: 88, r: 3.2, fill: 'var(--ink)', opacity: 0.9 }, svg);
    } else if (kind === 'memoryField') {
      for (let i = 0; i < 5; i++) {
        const x = 24 + i * 12;
        create('line', { x1: x, y1: 22, x2: x, y2: 76, stroke: 'var(--ink)', 'stroke-width': 0.35, opacity: 0.8 }, svg);
        create('circle', { cx: x, cy: 34 + (i % 3) * 10, r: 2.1, fill: 'var(--ink)', opacity: 0.85 }, svg);
        create('circle', { cx: x, cy: 54 + ((i + 1) % 3) * 6, r: i % 2 ? 1.6 : 2.6, fill: 'var(--ink)', opacity: 0.8 }, svg);
      }
    } else if (kind === 'waterClock') {
      const path = create('path', { d: 'M28,14 C28,40 40,48 46,58 C52,68 52,74 46,86 M68,14 C68,40 56,48 50,58 C44,68 44,74 50,86', fill: 'none', stroke: 'var(--ink)', 'stroke-width': 0.55, opacity: 0.82 }, svg);
      drawClass(path);
      create('circle', { cx: 48, cy: 48, r: 2.2, fill: 'var(--ink)', opacity: 0.9 }, svg);
    } else {
      create('polygon', { points: pointRing(c, c, 24, 10, 8), fill: 'none', stroke: 'var(--ink)', 'stroke-width': 0.55, opacity: 0.86 }, svg);
      create('polygon', { points: pointRing(c, c, 10, 4.5, 8), fill: 'var(--ink)', opacity: 0.9 }, svg);
      [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].forEach((angle) => {
        const [x, y] = polar(c, c, 30, angle);
        create('circle', { cx: x, cy: y, r: 2, fill: 'var(--ink)', opacity: 0.75 }, svg);
      });
    }

    drawLater(svg);
  }

  export function render(kind: ArtifactKind, svg: SVGSVGElement, options: RenderOptions = {}): void {
    const seed = options.seed ?? 1;
    registry[kind](svg, seed);
    svg.classList.add('relic-art-svg');
  }

  export function renderMini(kind: ArtifactKind, host: HTMLElement, seed = 1): SVGSVGElement {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'relic-mini-svg');
    host.appendChild(svg);
    miniMedallion(kind, svg, seed);
    return svg;
  }

  export function getDefaults(kind: ArtifactKind): { viewBox: string; width: number; height: number } {
    return defaults[kind];
  }

  export function mountGallery(root: HTMLElement, plates: GalleryPlate[]): void {
    root.innerHTML = '';
    plates.forEach((plate, index) => {
      const def = defaults[plate.kind];
      const container = document.createElement('section');
      container.className = 'relic-gallery-item';
      container.innerHTML = `
        <div class="plate rv artefact-plate" data-artefact-kind="${plate.kind}" data-plate-index="${index}">
          <div class="code-bg"></div>
          <svg class="art" aria-hidden="true"></svg>
        </div>
        <div class="plate-num rv"><span class="rubric">${plate.numeral}</span></div>
        <div class="plate-title rv">${plate.title}</div>
        <div class="divider rv">${plate.divider ?? '◆ · ◇ · ◆'}</div>
      `;
      const code = container.querySelector('.code-bg') as HTMLDivElement;
      code.textContent = plate.code.trim();
      const svg = container.querySelector('svg') as SVGSVGElement;
      svg.setAttribute('viewBox', plate.viewBox ?? def.viewBox);
      svg.setAttribute('width', String(plate.width ?? def.width));
      svg.setAttribute('height', String(plate.height ?? def.height));
      render(plate.kind, svg, { seed: plate.seed ?? index + 1 });
      root.appendChild(container);
    });
  }
}

(window as any).MovementLibrary = MovementLibrary;

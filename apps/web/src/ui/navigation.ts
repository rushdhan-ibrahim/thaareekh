import type { AppState } from '../types/state.js';

type D3Like = typeof import('d3');

let gsapModule: Record<string, unknown> | null = null;
let gsapLoaded = false;

async function loadGsap(): Promise<Record<string, unknown> | null> {
  if (gsapLoaded) return gsapModule;
  gsapLoaded = true;
  try {
    gsapModule = await import('gsap') as unknown as Record<string, unknown>;
  } catch {
    gsapModule = null;
  }
  return gsapModule;
}

// Preload GSAP eagerly
loadGsap();

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

export interface NavigationDeps {
  d3: D3Like;
  state: AppState;
  showD: (id: string) => void;
  hiN: (id: string) => void;
  cS: () => void;
}

export function goF(id: string, deps: NavigationDeps): void {
  const { d3, state, showD, hiN, cS } = deps;
  cS();
  state.selId = id;
  state.selEdge = null;
  const n = state.nodes.find(x => x.id === id);
  if (n) {
    const nx = (n as unknown as { x: number }).x;
    const ny = (n as unknown as { y: number }).y;
    const targetTransform = d3.zoomIdentity
      .translate(state.W / 2 - nx * 1.2, state.H / 2 - ny * 1.2)
      .scale(1.2);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const svgEl = state.svgEl as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const zoomBehavior = state.zoomBehavior as any;

    if (prefersReducedMotion()) {
      svgEl.call(zoomBehavior.transform, targetTransform);
    } else if (gsapModule) {
      const gsap = (gsapModule as { gsap?: { to?: unknown }; default?: { to?: unknown } }).gsap
        || (gsapModule as { default?: { to?: unknown } }).default;
      if (gsap && typeof (gsap as { to?: unknown }).to === 'function') {
        const cur = (state.tr as { x: number; y: number; k: number }) || d3.zoomIdentity;
        const proxy = { x: cur.x, y: cur.y, k: cur.k };
        (gsap as { to: (target: unknown, vars: Record<string, unknown>) => void }).to(proxy, {
          x: targetTransform.x,
          y: targetTransform.y,
          k: targetTransform.k,
          duration: 0.5,
          ease: 'power2.out',
          onUpdate() {
            const tr = d3.zoomIdentity.translate(proxy.x, proxy.y).scale(proxy.k);
            svgEl.call(zoomBehavior.transform, tr);
          }
        });
      } else {
        svgEl.transition().duration(400).call(zoomBehavior.transform, targetTransform);
      }
    } else {
      // Fallback to D3 transition
      svgEl.transition().duration(400).call(zoomBehavior.transform, targetTransform);
    }
  }
  showD(id);
  hiN(id);
}

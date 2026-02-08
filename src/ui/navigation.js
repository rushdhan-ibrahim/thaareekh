import * as d3 from 'd3';
import state from '../state.js';
import { showD } from './sidebar.js';
import { hiN } from '../graph/highlight.js';
import { cS } from './modal.js';

let gsapModule = null;
let gsapLoaded = false;

async function loadGsap() {
  if (gsapLoaded) return gsapModule;
  gsapLoaded = true;
  try {
    gsapModule = await import('gsap');
  } catch {
    gsapModule = null;
  }
  return gsapModule;
}

// Preload GSAP eagerly
loadGsap();

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

export function goF(id) {
  cS();
  state.selId = id;
  state.selEdge = null;
  const n = state.nodes.find(x => x.id === id);
  if (n) {
    const targetTransform = d3.zoomIdentity
      .translate(state.W / 2 - n.x * 1.2, state.H / 2 - n.y * 1.2)
      .scale(1.2);

    if (prefersReducedMotion()) {
      state.svgEl.call(state.zoomBehavior.transform, targetTransform);
    } else if (gsapModule?.gsap?.to || gsapModule?.default?.to) {
      // GSAP-powered smoother camera transition
      const gsap = gsapModule.gsap || gsapModule.default;
      const cur = state.tr || d3.zoomIdentity;
      const proxy = { x: cur.x, y: cur.y, k: cur.k };
      gsap.to(proxy, {
        x: targetTransform.x,
        y: targetTransform.y,
        k: targetTransform.k,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate() {
          const t = d3.zoomIdentity.translate(proxy.x, proxy.y).scale(proxy.k);
          state.svgEl.call(state.zoomBehavior.transform, t);
        }
      });
    } else {
      // Fallback to D3 transition
      state.svgEl.transition().duration(400).call(state.zoomBehavior.transform, targetTransform);
    }
  }
  showD(id);
  hiN(id);
}

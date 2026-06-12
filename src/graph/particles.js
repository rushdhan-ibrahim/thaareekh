/**
 * Edge Particle System — tiny dots flow along highlighted edges,
 * visualizing lineage as living connection.
 */
import state from '../state.js';
import { hashCode, mulberry32 } from '../utils/prng.js';

const NS = 'http://www.w3.org/2000/svg';
const WAVE_INTERVAL = 4500;   // ms between particle waves
const MAX_EDGES = 8;          // cap edge count for performance at extreme zoom-out

let particleGroup = null;
let waveTimer = null;
let burstTimers = [];          // initial-burst wave timeouts
let staggerTimers = [];        // per-edge spawn timeouts within a wave
let activeEdges = [];          // DOM elements of highlighted edges

/** Start emitting particle waves on the given edge elements */
export function startParticles(edgeEls) {
  stopParticles();
  if (!edgeEls.length) return;

  // Ensure particle layer exists (above edges, below nodes)
  if (!particleGroup) {
    const gg = document.querySelector('#sv .gg');
    if (!gg) return;
    particleGroup = document.createElementNS(NS, 'g');
    particleGroup.setAttribute('class', 'particle-layer');
    // Insert before node layer so particles draw below nodes
    const nodeLayer = gg.querySelector('.graph-nodes') || gg.querySelector('.tree-nodes');
    if (nodeLayer) {
      gg.insertBefore(particleGroup, nodeLayer);
    } else {
      gg.appendChild(particleGroup);
    }
  }

  activeEdges = edgeEls.slice(0, MAX_EDGES);
  emitWave();
  // Initial burst: two early waves before the regular interval kicks in
  burstTimers.push(setTimeout(emitWave, 2500), setTimeout(emitWave, 3800));
  waveTimer = setInterval(emitWave, WAVE_INTERVAL);
}

/** Stop all particle emission and clear active particles */
export function stopParticles() {
  if (waveTimer) {
    clearInterval(waveTimer);
    waveTimer = null;
  }
  burstTimers.forEach(clearTimeout);
  burstTimers = [];
  staggerTimers.forEach(clearTimeout);
  staggerTimers = [];
  activeEdges = [];
  if (driverRaf) {
    cancelAnimationFrame(driverRaf);
    driverRaf = 0;
  }
  liveDots.forEach(d => d.dot.remove());
  liveDots = [];
  if (particleGroup) {
    particleGroup.remove();
    particleGroup = null;
  }
}

function emitWave() {
  if (!activeEdges.length || !particleGroup) return;
  const rng = mulberry32(hashCode(String(Date.now())));
  // Previous wave's stagger timers have fired by now (max 8 × 180ms < interval)
  staggerTimers.forEach(clearTimeout);
  staggerTimers = [];
  activeEdges.forEach((el, i) => {
    staggerTimers.push(setTimeout(() => spawnParticle(el, rng), i * 180));
  });
}

function spawnParticle(edgeEl, rng) {
  if (!particleGroup) return;
  const isLine = edgeEl.tagName === 'line';
  let len, getPoint;

  if (isLine) {
    const x1 = +edgeEl.getAttribute('x1'), y1 = +edgeEl.getAttribute('y1');
    const x2 = +edgeEl.getAttribute('x2'), y2 = +edgeEl.getAttribute('y2');
    len = Math.hypot(x2 - x1, y2 - y1);
    getPoint = t => ({ x: x1 + t * (x2 - x1), y: y1 + t * (y2 - y1) });
  } else if (edgeEl.getTotalLength) {
    len = edgeEl.getTotalLength();
    getPoint = t => edgeEl.getPointAtLength(t * len);
  } else {
    return;
  }

  if (len < 1) return;

  const dot = document.createElementNS(NS, 'circle');
  dot.setAttribute('r', (1.2 + (rng?.() ?? Math.random()) * 0.3).toFixed(2));
  dot.setAttribute('fill', 'var(--tx)');
  dot.setAttribute('opacity', '0');
  dot.setAttribute('pointer-events', 'none');
  particleGroup.appendChild(dot);

  liveDots.push({ dot, t: 0, speed: 0.0006 + (rng?.() ?? Math.random()) * 0.0006, getPoint });
  ensureDriver();
}

let liveDots = [];
let driverRaf = 0;

/** One shared rAF loop drives every particle. */
function ensureDriver() {
  if (driverRaf) return;
  const frame = () => {
    if (!particleGroup || liveDots.length === 0) {
      driverRaf = 0;
      return;
    }
    const keep = [];
    for (const d of liveDots) {
      d.t += d.speed;
      if (d.t > 1) { d.dot.remove(); continue; }
      const pt = d.getPoint(d.t);
      d.dot.setAttribute('cx', pt.x);
      d.dot.setAttribute('cy', pt.y);
      d.dot.setAttribute('opacity', (Math.sin(d.t * Math.PI) * 0.3).toFixed(3));
      keep.push(d);
    }
    liveDots = keep;
    driverRaf = requestAnimationFrame(frame);
  };
  driverRaf = requestAnimationFrame(frame);
}

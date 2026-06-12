/**
 * The Overture — an illumination sequence in place of a loading spinner.
 * First visit: title plate inks in, a rule draws, then the graph reveals
 * by century cohort. Return visits get a brief veil. Any input skips.
 */
import { hashCode, mulberry32 } from '../utils/prng.ts';

const SEEN_KEY = 'maldives-genealogy:overture-seen';
const FULL_MS = 2600;

function reducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

function seenRecently(): boolean {
  try {
    const t = Number(localStorage.getItem(SEEN_KEY) || 0);
    return Date.now() - t < 6 * 24 * 3600 * 1000;
  } catch {
    return false;
  }
}

function markSeen(): void {
  try {
    localStorage.setItem(SEEN_KEY, String(Date.now()));
  } catch {
    /* fine */
  }
}

function buildVeil(full: boolean): HTMLElement {
  const v = document.createElement('div');
  v.className = `overture${full ? ' full' : ''}`;
  v.innerHTML = full
    ? '<div class="ov-plate"><h1 class="ov-title">Rannavaaru</h1>' +
      '<div class="ov-rule"></div>' +
      '<p class="ov-sub">Maldives Royal Genealogy · 1117–1968</p>' +
      '<p class="ov-hint">tap anywhere to begin</p></div>'
    : '';
  document.body.appendChild(v);
  return v;
}

function nodeYearOf(g: Element): number {
  const d = (g as unknown as { __data__?: { yb?: number; yd?: number; re?: unknown } }).__data__;
  if (!d) return 1500;
  const re = d.re as number[] | number[][] | undefined;
  if (Array.isArray(re) && re.length) {
    const first = Array.isArray(re[0]) ? (re[0] as number[])[0] : (re as number[])[0];
    if (Number.isFinite(Number(first))) return Number(first);
  }
  if (Number.isFinite(Number(d.yb))) return Number(d.yb);
  if (Number.isFinite(Number(d.yd))) return Number(d.yd);
  return 1500;
}

function inkInNodes(): void {
  const ga = document.getElementById('ga');
  const nodes = document.querySelectorAll('#sv .graph-nodes > g, #sv .tree-nodes > g');
  if (!ga || !nodes.length) return;
  const rng = mulberry32(hashCode('overture'));
  nodes.forEach(g => {
    const year = nodeYearOf(g);
    const cohort = Math.floor((year - 1100) / 100);
    const delay = Math.max(0, cohort * 130 + rng() * 160);
    (g as HTMLElement).style.setProperty('--ink-d', `${Math.round(delay)}ms`);
  });
  ga.classList.add('overture-ink');
  window.setTimeout(() => ga.classList.remove('overture-ink'), 2400);
}

/**
 * Mount the overture. Resolves (and removes itself) on graph-first-render,
 * a 4 s safety cap, or any user input.
 */
export function initOverture(): void {
  const ld = document.getElementById('ld');
  if (ld) ld.remove(); // the veil replaces the spinner entirely
  const full = !seenRecently() && !reducedMotion();
  const veil = buildVeil(full);
  let done = false;

  const finish = (skipped: boolean): void => {
    if (done) return;
    done = true;
    markSeen();
    veil.classList.add('out');
    window.setTimeout(() => veil.remove(), 750);
    if (full && !skipped && !reducedMotion()) inkInNodes();
    document.removeEventListener('pointerdown', onInput, true);
    document.removeEventListener('keydown', onInput, true);
  };
  const onInput = (): void => finish(true);

  if (!full) {
    // Return visit: brief veil, lifted on first render (or quickly anyway).
    document.addEventListener('graph-first-render', () => finish(false), { once: true });
    window.setTimeout(() => finish(false), reducedMotion() ? 250 : 900);
    return;
  }
  document.addEventListener('pointerdown', onInput, true);
  document.addEventListener('keydown', onInput, true);
  document.addEventListener(
    'graph-first-render',
    () => {
      window.setTimeout(() => finish(false), Math.max(0, FULL_MS - 1400));
    },
    { once: true }
  );
  window.setTimeout(() => finish(false), 4000); // safety cap
}

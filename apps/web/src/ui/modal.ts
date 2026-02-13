type SnapName = 'full' | 'half' | 'peek';

const SNAP_VALUES: Record<SnapName, number> = {
  full: 0,
  half: 38,
  peek: 64
};

let snap: SnapName = 'half';
let drag: { y0: number; start: number } | null = null;

function bsEl(): HTMLElement | null {
  return document.getElementById('bs');
}

function ovEl(): HTMLElement | null {
  return document.getElementById('ov');
}

function setSnapClass(next: string): void {
  const bs = bsEl();
  if (!bs) return;
  snap = (SNAP_VALUES[next as SnapName] != null ? next : 'half') as SnapName;
  bs.classList.remove('snap-full', 'snap-half', 'snap-peek');
  bs.classList.add(`snap-${snap}`);
  bs.style.removeProperty('--snap-drag');
}

/** Pure function: find nearest snap point name. */
export function nearestSnap(v: number): SnapName {
  let best: SnapName = 'half';
  let bestDist = Infinity;
  for (const [k, n] of Object.entries(SNAP_VALUES)) {
    const d = Math.abs(v - n);
    if (d < bestDist) {
      best = k as SnapName;
      bestDist = d;
    }
  }
  return best;
}

export function setSheetSnap(next: string): void {
  setSnapClass(next);
}

export function oS(prefer: string = 'half'): void {
  const bs = bsEl();
  const ov = ovEl();
  if (!bs || !ov) return;
  bs.classList.add('op');
  ov.classList.add('op');
  setSnapClass(prefer);
}

export function cS(): void {
  const bs = bsEl();
  const ov = ovEl();
  if (!bs || !ov) return;
  bs.classList.remove('op', 'snap-full', 'snap-half', 'snap-peek', 'dragging');
  bs.style.removeProperty('--snap-drag');
  ov.classList.remove('op');
  drag = null;
}

export function initSheet(): void {
  const bs = bsEl();
  const handle = document.querySelector('.bsh');
  if (!bs || !handle) return;

  handle.addEventListener('dblclick', () => {
    if (!bs.classList.contains('op')) return;
    setSnapClass(snap === 'full' ? 'half' : 'full');
  });

  handle.addEventListener('pointerdown', ((e: PointerEvent) => {
    if (window.innerWidth > 1024 || !bs.classList.contains('op')) return;
    drag = {
      y0: e.clientY,
      start: SNAP_VALUES[snap] ?? SNAP_VALUES.half
    };
    bs.classList.add('dragging');
    (handle as Element & { setPointerCapture?: (id: number) => void }).setPointerCapture?.(e.pointerId);
  }) as EventListener);

  handle.addEventListener('pointermove', ((e: PointerEvent) => {
    if (!drag) return;
    const h = bs.getBoundingClientRect().height || 1;
    const dy = e.clientY - drag.y0;
    const delta = (dy / h) * 100;
    const val = Math.max(0, Math.min(94, drag.start + delta));
    bs.style.setProperty('--snap-drag', `${val}%`);
  }) as EventListener);

  function endDrag(): void {
    if (!drag || !bs) return;
    const v = Number.parseFloat(bs.style.getPropertyValue('--snap-drag')) || drag.start;
    bs.classList.remove('dragging');
    bs.style.removeProperty('--snap-drag');
    drag = null;
    if (v > 82) {
      cS();
      return;
    }
    setSnapClass(nearestSnap(v));
  }

  handle.addEventListener('pointerup', endDrag);
  handle.addEventListener('pointercancel', endDrag);
}

const SNAP_VALUES = {
  full: 0,
  half: 38,
  peek: 64
};

let snap = 'half';
let drag = null;

function bsEl() {
  return document.getElementById('bs');
}

function ovEl() {
  return document.getElementById('ov');
}

function setSnapClass(next) {
  const bs = bsEl();
  if (!bs) return;
  snap = SNAP_VALUES[next] != null ? next : 'half';
  bs.classList.remove('snap-full', 'snap-half', 'snap-peek');
  bs.classList.add(`snap-${snap}`);
  bs.style.removeProperty('--snap-drag');
}

function nearestSnap(v) {
  let best = 'half';
  let bestDist = Infinity;
  Object.entries(SNAP_VALUES).forEach(([k, n]) => {
    const d = Math.abs(v - n);
    if (d < bestDist) {
      best = k;
      bestDist = d;
    }
  });
  return best;
}

export function setSheetSnap(next) {
  setSnapClass(next);
}

export function oS(prefer = 'half') {
  const bs = bsEl();
  const ov = ovEl();
  if (!bs || !ov) return;
  bs.classList.add('op');
  ov.classList.add('op');
  setSnapClass(prefer);
}

export function cS() {
  const bs = bsEl();
  const ov = ovEl();
  if (!bs || !ov) return;
  bs.classList.remove('op', 'snap-full', 'snap-half', 'snap-peek', 'dragging');
  bs.style.removeProperty('--snap-drag');
  ov.classList.remove('op');
  drag = null;
}

export function initSheet() {
  const bs = bsEl();
  const handle = document.querySelector('.bsh');
  if (!bs || !handle) return;

  handle.addEventListener('dblclick', () => {
    if (!bs.classList.contains('op')) return;
    setSnapClass(snap === 'full' ? 'half' : 'full');
  });

  handle.addEventListener('pointerdown', e => {
    if (window.innerWidth > 1024 || !bs.classList.contains('op')) return;
    drag = {
      y0: e.clientY,
      start: SNAP_VALUES[snap] ?? SNAP_VALUES.half
    };
    bs.classList.add('dragging');
    handle.setPointerCapture?.(e.pointerId);
  });

  handle.addEventListener('pointermove', e => {
    if (!drag) return;
    const h = bs.getBoundingClientRect().height || 1;
    const dy = e.clientY - drag.y0;
    const delta = (dy / h) * 100;
    const val = Math.max(0, Math.min(94, drag.start + delta));
    bs.style.setProperty('--snap-drag', `${val}%`);
  });

  function endDrag() {
    if (!drag) return;
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

import { byId } from '../data/sovereigns.merge.js';
import { storyTrails } from '../data/storytrails.js';
import { goF } from './navigation.js';

const trailState = {
  id: null,
  idx: 0,
  onStepChange: null
};

function activeTrail() {
  return storyTrails.find(t => t.id === trailState.id) || null;
}

function normalizeStep(raw) {
  if (!raw) return null;
  if (typeof raw === 'string') return { id: raw };
  if (typeof raw === 'object' && raw.id) return raw;
  return null;
}

function trailSteps(tr) {
  if (!tr) return [];
  return (tr.steps || []).map(normalizeStep).filter(Boolean);
}

function clampIdx(tr, idx) {
  const steps = trailSteps(tr);
  if (!steps.length) return 0;
  return Math.max(0, Math.min(idx, steps.length - 1));
}

function activeStep(tr) {
  if (!tr) return null;
  return trailSteps(tr)[trailState.idx] || null;
}

function stepPersonId(tr) {
  return activeStep(tr)?.id || null;
}

function emitStepChanged() {
  const tr = activeTrail();
  const steps = trailSteps(tr);
  const detail = {
    id: tr?.id || null,
    index: trailState.idx,
    total: steps.length,
    trail: tr || null,
    step: activeStep(tr)
  };
  trailState.onStepChange?.(detail);
  window.dispatchEvent(new CustomEvent('storytrail-step-changed', { detail }));
}

function renderInfo() {
  const el = document.getElementById('sti');
  const prev = document.getElementById('stp');
  const next = document.getElementById('stn');
  const rail = document.getElementById('str');
  const railTag = document.getElementById('strt');
  const railYear = document.getElementById('stry');
  const railDesc = document.getElementById('strd');
  const tr = activeTrail();
  if (!tr) {
    if (el) el.textContent = '';
    if (prev) prev.disabled = true;
    if (next) next.disabled = true;
    if (rail) rail.hidden = true;
    if (railTag) railTag.textContent = '';
    if (railYear) railYear.textContent = '';
    if (railDesc) railDesc.textContent = '';
    return;
  }
  const steps = trailSteps(tr);
  const step = activeStep(tr);
  const total = steps.length;
  const person = step?.id ? byId.get(step.id) : null;
  const stepTitle = step?.title || person?.nm || step?.id || '';
  if (el) el.textContent = `${trailState.idx + 1}/${total} ${tr.title}`;
  if (prev) prev.disabled = trailState.idx <= 0;
  if (next) next.disabled = trailState.idx >= total - 1;
  if (rail) rail.hidden = !step;
  if (railTag) railTag.textContent = stepTitle;
  if (railYear) {
    railYear.textContent = Number.isFinite(step?.year)
      ? `${step.year}`
      : '';
  }
  if (railDesc) {
    railDesc.textContent = step?.note || tr.summary || '';
  }
}

function jumpToCurrentStep() {
  const tr = activeTrail();
  if (!tr) return;
  const personId = stepPersonId(tr);
  if (!personId || !byId.has(personId)) return;
  goF(personId);
}

function setStep(index, { navigate = true } = {}) {
  const tr = activeTrail();
  if (!tr) return;
  trailState.idx = clampIdx(tr, index);
  renderInfo();
  emitStepChanged();
  if (navigate) jumpToCurrentStep();
}

export function clearStoryTrail({ navigate = false } = {}) {
  trailState.id = null;
  trailState.idx = 0;
  const sel = document.getElementById('stl');
  if (sel) sel.value = '';
  renderInfo();
  emitStepChanged();
  if (navigate) jumpToCurrentStep();
}

export function initStoryTrails({ onStepChange } = {}) {
  trailState.onStepChange = typeof onStepChange === 'function' ? onStepChange : null;
  const sel = document.getElementById('stl');
  const prev = document.getElementById('stp');
  const next = document.getElementById('stn');
  if (!sel || !prev || !next) return;

  sel.innerHTML = '<option value="">Story Trail</option>' +
    storyTrails.map(t => `<option value="${t.id}">${t.title}</option>`).join('');

  sel.addEventListener('change', () => {
    const id = sel.value || null;
    if (!id) {
      clearStoryTrail();
      return;
    }
    const tr = storyTrails.find(t => t.id === id);
    if (!tr) {
      clearStoryTrail();
      return;
    }
    trailState.id = tr.id;
    trailState.idx = 0;
    renderInfo();
    emitStepChanged();
    jumpToCurrentStep();
  });

  prev.addEventListener('click', () => {
    const tr = activeTrail();
    if (!tr) return;
    setStep(trailState.idx - 1);
  });

  next.addEventListener('click', () => {
    const tr = activeTrail();
    if (!tr) return;
    setStep(trailState.idx + 1);
  });

  renderInfo();
  emitStepChanged();
}

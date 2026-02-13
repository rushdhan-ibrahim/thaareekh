import type { PersonNode } from '../types/state.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StoryTrailStep {
  id: string;
  year?: number;
  title?: string;
  note?: string;
}

interface StoryTrail {
  id: string;
  title: string;
  summary: string;
  theme?: string;
  steps: Array<StoryTrailStep | string>;
}

interface StepChangedDetail {
  id: string | null;
  index: number;
  total: number;
  trail: StoryTrail | null;
  step: StoryTrailStep | null;
}

interface TrailState {
  id: string | null;
  idx: number;
  onStepChange: ((detail: StepChangedDetail) => void) | null;
}

// Module-level deps
let _storyTrails: StoryTrail[] = [];
let _byId: Map<string, PersonNode> = new Map();
let _goF: (id: string) => void = () => {};

// ---------------------------------------------------------------------------
// Pure helpers (testable)
// ---------------------------------------------------------------------------

export function normalizeStep(raw: StoryTrailStep | string | null | undefined): StoryTrailStep | null {
  if (!raw) return null;
  if (typeof raw === 'string') return { id: raw };
  if (typeof raw === 'object' && raw.id) return raw;
  return null;
}

export function trailSteps(tr: StoryTrail | null): StoryTrailStep[] {
  if (!tr) return [];
  return (tr.steps || []).map(normalizeStep).filter((s): s is StoryTrailStep => s !== null);
}

export function clampIdx(tr: StoryTrail | null, idx: number): number {
  const steps = trailSteps(tr);
  if (!steps.length) return 0;
  return Math.max(0, Math.min(idx, steps.length - 1));
}

// ---------------------------------------------------------------------------
// Internal state
// ---------------------------------------------------------------------------

const trailState: TrailState = {
  id: null,
  idx: 0,
  onStepChange: null
};

function activeTrail(): StoryTrail | null {
  return _storyTrails.find(t => t.id === trailState.id) || null;
}

function activeStep(tr: StoryTrail | null): StoryTrailStep | null {
  if (!tr) return null;
  return trailSteps(tr)[trailState.idx] || null;
}

function stepPersonId(tr: StoryTrail | null): string | null {
  return activeStep(tr)?.id || null;
}

function emitStepChanged(): void {
  const tr = activeTrail();
  const steps = trailSteps(tr);
  const detail: StepChangedDetail = {
    id: tr?.id || null,
    index: trailState.idx,
    total: steps.length,
    trail: tr || null,
    step: activeStep(tr)
  };
  trailState.onStepChange?.(detail);
  window.dispatchEvent(new CustomEvent('storytrail-step-changed', { detail }));
}

function renderInfo(): void {
  const el = document.getElementById('sti');
  const prev = document.getElementById('stp') as HTMLButtonElement | null;
  const next = document.getElementById('stn') as HTMLButtonElement | null;
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
  const person = step?.id ? _byId.get(step.id) : undefined;
  const stepTitle = step?.title || person?.nm || step?.id || '';
  if (el) el.textContent = `${trailState.idx + 1}/${total} ${tr.title}`;
  if (prev) prev.disabled = trailState.idx <= 0;
  if (next) next.disabled = trailState.idx >= total - 1;
  if (rail) rail.hidden = !step;
  if (railTag) railTag.textContent = stepTitle;
  if (railYear) {
    railYear.textContent = Number.isFinite(step?.year)
      ? `${step!.year}`
      : '';
  }
  if (railDesc) {
    railDesc.textContent = step?.note || tr.summary || '';
  }
}

function jumpToCurrentStep(): void {
  const tr = activeTrail();
  if (!tr) return;
  const personId = stepPersonId(tr);
  if (!personId || !_byId.has(personId)) return;
  _goF(personId);
}

function setStep(index: number, opts: { navigate?: boolean } = {}): void {
  const { navigate = true } = opts;
  const tr = activeTrail();
  if (!tr) return;
  trailState.idx = clampIdx(tr, index);
  renderInfo();
  emitStepChanged();
  if (navigate) jumpToCurrentStep();
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function clearStoryTrail(opts: { navigate?: boolean } = {}): void {
  const { navigate = false } = opts;
  trailState.id = null;
  trailState.idx = 0;
  const sel = document.getElementById('stl') as HTMLSelectElement | null;
  if (sel) sel.value = '';
  renderInfo();
  emitStepChanged();
  if (navigate) jumpToCurrentStep();
}

export interface StoryTrailDeps {
  storyTrails: StoryTrail[];
  byId: Map<string, PersonNode>;
  goF: (id: string) => void;
}

export function initStoryTrails(
  deps: StoryTrailDeps,
  opts: { onStepChange?: (detail: StepChangedDetail) => void } = {}
): void {
  _storyTrails = deps.storyTrails;
  _byId = deps.byId;
  _goF = deps.goF;
  trailState.onStepChange = typeof opts.onStepChange === 'function' ? opts.onStepChange : null;

  const sel = document.getElementById('stl') as HTMLSelectElement | null;
  const prev = document.getElementById('stp') as HTMLButtonElement | null;
  const next = document.getElementById('stn') as HTMLButtonElement | null;
  if (!sel || !prev || !next) return;

  sel.innerHTML = '<option value="">Story Trail</option>' +
    _storyTrails.map(tr => `<option value="${tr.id}">${tr.title}</option>`).join('');

  sel.addEventListener('change', () => {
    const id = sel.value || null;
    if (!id) {
      clearStoryTrail();
      return;
    }
    const tr = _storyTrails.find(trail => trail.id === id);
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

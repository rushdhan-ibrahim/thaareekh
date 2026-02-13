import type { SearchHit, SearchPerson, SearchReason } from '../search/search-engine';

const DEFAULT_MAX_RESULTS = 12;
const DEFAULT_INPUT_DELAY_MS = 80;

export interface SearchControllerDeps {
  rankSearch: (query: string, limit: number) => SearchHit[];
  reasonLabel: (reason: SearchReason) => string;
  formatReign: (reign: SearchPerson['re']) => string;
  escapeHtml: (value: string) => string;
  personName: (person: SearchPerson) => string;
  t: (key: string) => string;
  goToPerson: (personId: string) => void;
}

export interface SearchControllerOptions {
  maxResults?: number;
  inputDelayMs?: number;
}

interface SearchState {
  rows: SearchHit[];
  active: number;
}

export interface SearchControllerHandle {
  render: (query: string) => void;
  choose: (index: number) => void;
  getState: () => { rowCount: number; active: number };
  destroy: () => void;
}

export interface KeydownEvaluationInput {
  isOpen: boolean;
  rowCount: number;
  active: number;
  key: string;
}

export interface KeydownEvaluation {
  shouldRender: boolean;
  ignore: boolean;
  preventDefault: boolean;
  nextActive: number;
  chooseIndex: number | null;
  shouldClose: boolean;
}

export function shouldRenderOnArrowKey(isOpen: boolean, key: string): boolean {
  return !isOpen && (key === 'ArrowDown' || key === 'ArrowUp');
}

export function nextActiveIndex(active: number, rowCount: number, key: 'ArrowDown' | 'ArrowUp'): number {
  if (rowCount <= 0) return -1;
  if (key === 'ArrowDown') return (active + 1) % rowCount;
  return (active - 1 + rowCount) % rowCount;
}

export function evaluateKeydown(input: KeydownEvaluationInput): KeydownEvaluation {
  const shouldRender = shouldRenderOnArrowKey(input.isOpen, input.key);
  if (input.rowCount <= 0 && input.key !== 'Escape') {
    return {
      shouldRender,
      ignore: true,
      preventDefault: false,
      nextActive: input.active,
      chooseIndex: null,
      shouldClose: false
    };
  }

  if (input.key === 'ArrowDown') {
    return {
      shouldRender,
      ignore: false,
      preventDefault: true,
      nextActive: nextActiveIndex(input.active, input.rowCount, 'ArrowDown'),
      chooseIndex: null,
      shouldClose: false
    };
  }

  if (input.key === 'ArrowUp') {
    return {
      shouldRender,
      ignore: false,
      preventDefault: true,
      nextActive: nextActiveIndex(input.active, input.rowCount, 'ArrowUp'),
      chooseIndex: null,
      shouldClose: false
    };
  }

  if (input.key === 'Enter') {
    return {
      shouldRender,
      ignore: false,
      preventDefault: true,
      nextActive: input.active,
      chooseIndex: input.active >= 0 ? input.active : 0,
      shouldClose: false
    };
  }

  if (input.key === 'Escape') {
    return {
      shouldRender,
      ignore: false,
      preventDefault: false,
      nextActive: -1,
      chooseIndex: null,
      shouldClose: true
    };
  }

  return {
    shouldRender,
    ignore: true,
    preventDefault: false,
    nextActive: input.active,
    chooseIndex: null,
    shouldClose: false
  };
}

export function renderSearchDropdownHtml(
  rows: SearchHit[],
  active: number,
  deps: Pick<SearchControllerDeps, 'escapeHtml' | 'personName' | 'formatReign' | 'reasonLabel' | 't'>
): string {
  if (!rows.length) {
    return `<div class="dde">${deps.escapeHtml(deps.t('no_matches'))}</div>`;
  }

  return rows
    .map((row, index) => {
      const person = row.person;
      return `<div class="ddi${index === active ? ' act' : ''}" id="sr-opt-${index}" role="option" aria-selected="${
        index === active ? 'true' : 'false'
      }" data-id="${person.id}" data-idx="${index}">
        <b>${person.g === 'F' ? '\u2640 ' : ''}${deps.escapeHtml(deps.personName(person))}</b>
        <em>${deps.escapeHtml(deps.formatReign(person.re))} · ${deps.escapeHtml(person.dy || '?')} · ${deps.escapeHtml(
          deps.reasonLabel(row.reason)
        )}</em>
      </div>`;
    })
    .join('');
}

export function initSearchController(
  documentRef: Document,
  deps: SearchControllerDeps,
  options: SearchControllerOptions = {}
): SearchControllerHandle | null {
  const inputNode = documentRef.getElementById('si');
  const dropdownNode = documentRef.getElementById('dd');
  if (!(inputNode instanceof HTMLInputElement) || !(dropdownNode instanceof HTMLElement)) return null;
  const input = inputNode;
  const dropdown = dropdownNode;

  const maxResults = options.maxResults ?? DEFAULT_MAX_RESULTS;
  const inputDelayMs = options.inputDelayMs ?? DEFAULT_INPUT_DELAY_MS;
  const state: SearchState = { rows: [], active: -1 };
  let inputTimer: ReturnType<typeof setTimeout> | null = null;

  dropdown.setAttribute('role', 'listbox');

  function applyActive(): void {
    const rows = dropdown.querySelectorAll<HTMLElement>('.ddi');
    rows.forEach((el, index) => {
      const isActive = index === state.active;
      el.classList.toggle('act', isActive);
      el.setAttribute('aria-selected', isActive ? 'true' : 'false');
      if (isActive) input.setAttribute('aria-activedescendant', el.id);
    });
    if (state.active < 0) input.removeAttribute('aria-activedescendant');
  }

  function choose(index: number): void {
    const row = state.rows[index];
    if (!row) return;
    deps.goToPerson(row.person.id);
    dropdown.classList.remove('open');
    input.removeAttribute('aria-activedescendant');
    input.value = '';
    state.rows = [];
    state.active = -1;
  }

  function render(query: string): void {
    if (!query.trim()) {
      dropdown.classList.remove('open');
      input.removeAttribute('aria-activedescendant');
      state.rows = [];
      state.active = -1;
      return;
    }

    state.rows = deps.rankSearch(query, maxResults);
    state.active = state.rows.length ? 0 : -1;

    dropdown.innerHTML = renderSearchDropdownHtml(state.rows, state.active, deps);
    dropdown.classList.add('open');

    if (!state.rows.length) {
      input.removeAttribute('aria-activedescendant');
      return;
    }

    dropdown.querySelectorAll<HTMLElement>('.ddi').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        state.active = Number(el.dataset.idx);
        applyActive();
      });
      el.addEventListener('mousedown', (event) => {
        event.preventDefault();
        choose(Number(el.dataset.idx));
      });
    });
  }

  const onInput = (): void => {
    if (inputTimer) clearTimeout(inputTimer);
    inputTimer = setTimeout(() => {
      inputTimer = null;
      render(input.value);
    }, inputDelayMs);
  };

  const onFocus = (): void => render(input.value);

  const onKeydown = (event: KeyboardEvent): void => {
    const evaluation = evaluateKeydown({
      isOpen: dropdown.classList.contains('open'),
      rowCount: state.rows.length,
      active: state.active,
      key: event.key
    });

    if (evaluation.shouldRender) render(input.value);
    if (evaluation.ignore) return;
    if (evaluation.preventDefault) event.preventDefault();

    if (evaluation.shouldClose) {
      dropdown.classList.remove('open');
      state.active = -1;
      input.removeAttribute('aria-activedescendant');
      return;
    }

    if (evaluation.chooseIndex != null) {
      choose(evaluation.chooseIndex);
      return;
    }

    if (evaluation.nextActive !== state.active) {
      state.active = evaluation.nextActive;
      applyActive();
    }
  };

  const onDocumentClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement | null;
    if (!target?.closest('.swrap')) dropdown.classList.remove('open');
  };

  input.addEventListener('input', onInput);
  input.addEventListener('focus', onFocus);
  input.addEventListener('keydown', onKeydown);
  documentRef.addEventListener('click', onDocumentClick);

  return {
    render,
    choose,
    getState: () => ({ rowCount: state.rows.length, active: state.active }),
    destroy: () => {
      if (inputTimer) clearTimeout(inputTimer);
      input.removeEventListener('input', onInput);
      input.removeEventListener('focus', onFocus);
      input.removeEventListener('keydown', onKeydown);
      documentRef.removeEventListener('click', onDocumentClick);
    }
  };
}

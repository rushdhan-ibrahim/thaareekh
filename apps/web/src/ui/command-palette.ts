import type { SearchHit, SearchPerson, SearchReason } from '../search/search-engine';

const DEFAULT_LIMIT = 20;
const DEFAULT_INPUT_DELAY_MS = 60;

export interface CommandPaletteDeps {
  rankSearch: (query: string, limit: number) => SearchHit[];
  reasonLabel: (reason: SearchReason) => string;
  formatReign: (reign: SearchPerson['re']) => string;
  escapeHtml: (value: string) => string;
  personName: (person: SearchPerson) => string;
  t: (key: string) => string;
  goToPerson: (personId: string) => void;
  goToOffice?: (officeId: string) => void;
  dynastyColor: (dynasty: string | undefined) => string;
}

export interface CommandPaletteOptions {
  limit?: number;
  inputDelayMs?: number;
}

interface PaletteState {
  active: number;
  results: SearchHit[];
}

export interface CommandPaletteHandle {
  open: () => void;
  close: () => void;
  isOpen: () => boolean;
  destroy: () => void;
}

export function isEditableTarget(tagName: string | null | undefined, isContentEditable: boolean): boolean {
  const tag = (tagName ?? '').toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select' || isContentEditable;
}

export function nextPaletteActiveIndex(
  active: number,
  rowCount: number,
  key: 'ArrowDown' | 'ArrowUp'
): number {
  if (rowCount <= 0) return -1;
  if (key === 'ArrowDown') return (active + 1) % rowCount;
  return (active - 1 + rowCount) % rowCount;
}

export function renderCommandPaletteHtml(
  query: string,
  results: SearchHit[],
  active: number,
  deps: Pick<
    CommandPaletteDeps,
    'escapeHtml' | 'personName' | 'formatReign' | 'reasonLabel' | 'dynastyColor' | 't'
  >
): string {
  if (!results.length) {
    if (query.trim()) {
      return `<div class="cmd-palette-empty">${deps.escapeHtml(deps.t('no_matches'))}</div>`;
    }
    return `<div class="cmd-palette-empty">${deps.escapeHtml(deps.t('command_empty_hint'))}</div>`;
  }
  const KIND_ICON: Record<string, string> = {
    crown: '\u265B', judicial: '\u2696', ministerial: '\uD83C\uDFDB',
    deputy: '\u2691', executive: '\u25C6', institution: '\u2699',
    peerage: '\u2654', furadaana: '\u2605', military: '\u2694'
  };
  const KIND_KEY: Record<string, string> = {
    crown: 'crown_office', judicial: 'judicial_office', ministerial: 'ministerial_office',
    deputy: 'deputy_office', executive: 'executive_office', institution: 'institution_office',
    peerage: 'peerage_office', furadaana: 'furadaana_office', military: 'military_office'
  };
  return results
    .map((row, index) => {
      if (row.type === 'office' && row.office) {
        const o = row.office;
        const icon = KIND_ICON[o.kind || ''] || '\u25CB';
        return `<div class="cmd-result${index === active ? ' active' : ''}" data-idx="${index}">
      <div class="cmd-result-ofc-dot">${icon}</div>
      <div class="cmd-result-info">
        <div class="cmd-result-name">${deps.escapeHtml(o.name)}</div>
        <div class="cmd-result-meta">${deps.escapeHtml(deps.t(KIND_KEY[o.kind || ''] || 'office_generic'))} \u00b7 ${deps.escapeHtml(deps.t('office_word'))}</div>
      </div>
      <span class="cmd-result-badge">${deps.escapeHtml(deps.reasonLabel(row.reason))}</span>
    </div>`;
      }
      const person = row.person;
      return `<div class="cmd-result${index === active ? ' active' : ''}" data-idx="${index}">
      <div class="cmd-result-dot" style="background:${deps.dynastyColor(person.dy)}"></div>
      <div class="cmd-result-info">
        <div class="cmd-result-name">${person.g === 'F' ? '\u2640 ' : ''}${deps.escapeHtml(deps.personName(person))}</div>
        <div class="cmd-result-meta">${deps.escapeHtml(deps.formatReign(person.re))} · ${deps.escapeHtml(person.dy || '?')}</div>
      </div>
      <span class="cmd-result-badge">${deps.escapeHtml(deps.reasonLabel(row.reason))}</span>
    </div>`;
    })
    .join('');
}

export function initCommandPaletteController(
  documentRef: Document,
  deps: CommandPaletteDeps,
  options: CommandPaletteOptions = {}
): CommandPaletteHandle | null {
  const palette = documentRef.getElementById('cmdPalette');
  const input = documentRef.getElementById('cmdInput');
  const resultsEl = documentRef.getElementById('cmdResults');
  const trigger = documentRef.getElementById('cmdTrigger');
  if (
    !(palette instanceof HTMLElement) ||
    !(input instanceof HTMLInputElement) ||
    !(resultsEl instanceof HTMLElement)
  ) {
    return null;
  }
  const paletteEl = palette;
  const inputEl = input;
  const resultsRoot = resultsEl;

  const state: PaletteState = {
    active: -1,
    results: []
  };
  const limit = options.limit ?? DEFAULT_LIMIT;
  const inputDelayMs = options.inputDelayMs ?? DEFAULT_INPUT_DELAY_MS;
  let timer: ReturnType<typeof setTimeout> | null = null;

  function isOpen(): boolean {
    return paletteEl.classList.contains('open');
  }

  function updateActive(): void {
    const rows = resultsRoot.querySelectorAll<HTMLElement>('.cmd-result');
    rows.forEach((el, index) => {
      const active = index === state.active;
      el.classList.toggle('active', active);
      if (active) el.scrollIntoView({ block: 'nearest' });
    });
  }

  function choose(index: number): void {
    const row = state.results[index];
    if (!row) return;
    close();
    if (row.type === 'office' && row.office && deps.goToOffice) {
      deps.goToOffice(row.office.id);
      window.dispatchEvent(new CustomEvent('request-sidebar-open'));
    } else {
      deps.goToPerson(row.person.id);
    }
  }

  function renderResults(): void {
    resultsRoot.innerHTML = renderCommandPaletteHtml(inputEl.value, state.results, state.active, deps);
    if (!state.results.length) return;

    resultsRoot.querySelectorAll<HTMLElement>('.cmd-result').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        state.active = Number(el.dataset.idx);
        updateActive();
      });
      el.addEventListener('mousedown', (event) => {
        event.preventDefault();
        choose(Number(el.dataset.idx));
      });
    });
  }

  function open(): void {
    paletteEl.classList.add('open');
    inputEl.value = '';
    state.active = -1;
    state.results = [];
    renderResults();
    requestAnimationFrame(() => inputEl.focus());
  }

  function close(): void {
    paletteEl.classList.remove('open');
    inputEl.blur();
    state.results = [];
    state.active = -1;
  }

  const onGlobalKeydown = (event: KeyboardEvent): void => {
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const activeElement = documentRef.activeElement;
      const tagName = activeElement instanceof HTMLElement ? activeElement.tagName : null;
      const isContentEditable = activeElement instanceof HTMLElement ? activeElement.isContentEditable : false;
      if (isEditableTarget(tagName, isContentEditable)) return;
      event.preventDefault();
      open();
      return;
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (isOpen()) close();
      else open();
    }
  };

  const onBackdropClick = (event: MouseEvent): void => {
    if (event.target === paletteEl) close();
  };

  const onInput = (): void => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      const query = inputEl.value;
      state.results = query.trim() ? deps.rankSearch(query, limit) : [];
      state.active = state.results.length ? 0 : -1;
      renderResults();
    }, inputDelayMs);
  };

  const onInputKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      state.active = nextPaletteActiveIndex(state.active, state.results.length, 'ArrowDown');
      updateActive();
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      state.active = nextPaletteActiveIndex(state.active, state.results.length, 'ArrowUp');
      updateActive();
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      choose(state.active >= 0 ? state.active : 0);
    }
  };

  const onTriggerClick = (): void => open();

  trigger?.addEventListener('click', onTriggerClick);
  documentRef.addEventListener('keydown', onGlobalKeydown);
  paletteEl.addEventListener('click', onBackdropClick);
  inputEl.addEventListener('input', onInput);
  inputEl.addEventListener('keydown', onInputKeydown);

  return {
    open,
    close,
    isOpen,
    destroy: () => {
      if (timer) clearTimeout(timer);
      trigger?.removeEventListener('click', onTriggerClick);
      documentRef.removeEventListener('keydown', onGlobalKeydown);
      paletteEl.removeEventListener('click', onBackdropClick);
      inputEl.removeEventListener('input', onInput);
      inputEl.removeEventListener('keydown', onInputKeydown);
    }
  };
}

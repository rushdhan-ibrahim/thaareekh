import type { OfficeDefinition, SearchEdge, SearchPerson, SearchReason } from '../search/search-engine';
import { createSearchEngine, reasonLabel } from '../search/search-engine';
import { initCommandPaletteController } from './command-palette';
import { initSearchController } from './search-controller';

import { getDataset } from '../../../../src/data/sovereigns.merge.js';
import { officeById as legacyOfficeById } from '../../../../src/data/offices.js';

type Locale = 'en' | 'dv';

const REASON_LABEL_KEYS: Record<SearchReason, string> = {
  filter: 'reason_filter',
  number: 'reason_number',
  name: 'reason_name',
  alias: 'reason_alias',
  'known-as': 'reason_known_as',
  regnal: 'reason_regnal',
  title: 'reason_title',
  office: 'reason_office',
  dynasty: 'reason_dynasty',
  fuzzy: 'reason_fuzzy',
  match: 'reason_match',
  'office-name': 'reason_office_name',
  'office-alias': 'reason_office_alias',
  'office-kind': 'reason_office_kind',
  'office-fuzzy': 'reason_office_fuzzy'
};

const TRANSLATIONS: Record<Locale, Record<string, string>> = {
  en: {
    no_matches: 'No matches',
    command_empty_hint: 'Start typing to search names, dynasties, and titles.',
    search_placeholder: 'Search name/known-as/title/# · filters: dy:hilaaly c:u o:fandiyaaru',
    search_aria: 'Search people',
    clear_search_aria: 'Clear search',
    command_input_placeholder: 'Search people, dynasties, offices, titles, and aliases',
    runtime_title: 'Modernization Runtime: Search Cutover',
    runtime_intro:
      'TypeScript search and command-palette controllers are wired to shared runtime adapters, with locale/reason-label hooks and research-dataset-backed ranking.',
    locale_label: 'Locale',
    trigger_open_palette: 'Open command palette',
    hint_navigate: 'navigate',
    hint_select: 'select',
    hint_close: 'close',
    selected_prefix: 'Focused person',
    selected_none: 'none',
    migration_guardrail: 'Migration guardrail: no functionality or knowledge loss',
    reason_filter: 'Filter match',
    reason_number: 'Ordinal/number match',
    reason_name: 'Name match',
    reason_alias: 'Alias match',
    reason_known_as: 'Known-as match',
    reason_regnal: 'Regnal match',
    reason_title: 'Title match',
    reason_office: 'Office match',
    reason_dynasty: 'Dynasty match',
    reason_fuzzy: 'Fuzzy match',
    reason_match: 'Match',
    reason_office_name: 'office name',
    reason_office_alias: 'office alias',
    reason_office_kind: 'office kind',
    reason_office_fuzzy: 'office (fuzzy)',
    office_word: 'Office',
    office_generic: 'Office',
    crown_office: 'Crown',
    judicial_office: 'Judicial',
    ministerial_office: 'Ministerial',
    deputy_office: 'Deputy',
    executive_office: 'Executive',
    institution_office: 'Institution',
    peerage_office: 'Peerage',
    furadaana_office: 'Furadaana',
    military_office: 'Military'
  },
  dv: {
    no_matches: 'މެޗެސް ނުވޭ',
    command_empty_hint: 'ނަން، ދިނަސްޓީ އަދި ލަޤަބު ހޯދުމަށް ލިޔުން ފަށާށެވެ.',
    search_placeholder: 'ނަން/ކިޔާނަން/ލަޤަބު/# ހޯދާ · dy:hilaaly c:u o:fandiyaaru',
    search_aria: 'ފަރާތްތައް ހޯދާ',
    clear_search_aria: 'ސާރޗް ސާފުކުރޭ',
    command_input_placeholder: 'ފަރާތް، ދިނަސްޓީ، އޮފީސް، ލަޤަބު، އެލިއަސް ހޯދާ',
    runtime_title: 'މޮޑަނައިޒޭޝަން ރަންޓައިމް: ސާރޗް ކަޓްއޯވަރ',
    runtime_intro:
      'TypeScript ސާރޗް އަދި ކޮމާންޑް-ޕެލެޓް ކޮންޓްރޯލަރތައް ޝެއާޑް ރަންޓައިމް އެޑަޕްޓަރުތަކާ ވައިރު ކުރެވިފައިވާއިރު locale/reason-label ހޫކްތަކާ ރިސާޗް-ޑޭޓާސެޓް ބޭސް ރޭންކިންގް އެކު ހިމެނޭ.',
    locale_label: 'ބަސް',
    trigger_open_palette: 'ކޮމާންޑް ޕެލެޓް ހުޅުވާ',
    hint_navigate: 'ހިނގާ',
    hint_select: 'ހޮވާ',
    hint_close: 'ބަންދު',
    selected_prefix: 'ފޯކަސްވާ ފަރާތް',
    selected_none: 'ނެތް',
    migration_guardrail: 'މައިގްރޭޝަން ގާޑްރޭލް: ފަންކްޝަނަލިޓީ ނުވަތަ މައުލޫމާތު ގެއްލުމެއް ނެތް',
    reason_filter: 'ފިލްޓަރ މެޗް',
    reason_number: 'އޯޑިނަލް/ނަންބަރ މެޗް',
    reason_name: 'ނަން މެޗް',
    reason_alias: 'އެލިއަސް މެޗް',
    reason_known_as: 'Known-as މެޗް',
    reason_regnal: 'ރެގްނަލް މެޗް',
    reason_title: 'ލަޤަބު މެޗް',
    reason_office: 'އޮފީސް މެޗް',
    reason_dynasty: 'ދިނަސްޓީ މެޗް',
    reason_fuzzy: 'ފަޒީ މެޗް',
    reason_match: 'މެޗް',
    reason_office_name: 'މަޤާމުގެ ނަން',
    reason_office_alias: 'މަޤާމުގެ ބަދަލު ނަން',
    reason_office_kind: 'މަޤާމުގެ ބާވަތް',
    reason_office_fuzzy: 'މަޤާމު (ގާތްގަނޑަކަށް)',
    office_word: 'މަޤާމު',
    office_generic: 'މަޤާމު',
    crown_office: 'ތާޖު',
    judicial_office: 'ފަނޑިޔާރު',
    ministerial_office: 'ވަޒީރު',
    deputy_office: 'ނައިބު',
    executive_office: 'ވެރިކަން',
    institution_office: 'މުއައްސަސާ',
    peerage_office: 'ކިލެގެ',
    furadaana_office: 'ފުރަދާނަ',
    military_office: 'ސިފައިން'
  }
};

function escapeHtml(value: string): string {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function personName(person: SearchPerson): string {
  const name = (person.nm ?? '').trim();
  if (name) return name;
  return person.id;
}

function formatReign(reign: SearchPerson['re']): string {
  if (!Array.isArray(reign) || !reign.length) return '?';
  const first = reign[0];
  if (!Array.isArray(first) || !first.length) return '?';
  const start = first[0];
  const end = first[1] ?? '?';
  return `${start}-${end}`;
}

function createOfficeMap(source: Map<string, { id: string; name: string }>): Map<string, OfficeDefinition> {
  const map = new Map<string, OfficeDefinition>();
  for (const office of source.values()) {
    if (!office?.id || !office?.name) continue;
    map.set(office.id, { id: office.id, name: office.name });
  }
  return map;
}

function createLocaleHooks(initialLocale: Locale = 'en'): {
  t: (key: string) => string;
  setLocale: (locale: Locale) => void;
  getLocale: () => Locale;
} {
  let activeLocale: Locale = initialLocale;
  return {
    t: (key) => TRANSLATIONS[activeLocale]?.[key] ?? TRANSLATIONS.en[key] ?? key,
    setLocale: (locale) => {
      activeLocale = locale;
    },
    getLocale: () => activeLocale
  };
}

function createReasonLabelAdapter(t: (key: string) => string): (reason: SearchReason) => string {
  return (reason) => {
    const defaultLabel = reasonLabel(reason, t);
    const key = REASON_LABEL_KEYS[reason];
    if (!key) return defaultLabel;
    const translated = t(key);
    return translated === key ? defaultLabel : translated;
  };
}

function dynastyColor(dynasty: string | undefined): string {
  const key = (dynasty || 'unknown').toLowerCase();
  return `var(--dy-${key})`;
}

function applyRuntimeLocaleText(documentRef: Document, t: (key: string) => string): void {
  const textBindings: Array<[string, string]> = [
    ['mx-title', 'runtime_title'],
    ['mx-intro', 'runtime_intro'],
    ['mx-locale-label', 'locale_label'],
    ['mx-trigger-label', 'trigger_open_palette'],
    ['mx-hint-navigate', 'hint_navigate'],
    ['mx-hint-select', 'hint_select'],
    ['mx-hint-close', 'hint_close']
  ];
  for (const [id, key] of textBindings) {
    const node = documentRef.getElementById(id);
    if (!(node instanceof HTMLElement)) continue;
    node.textContent = t(key);
  }

  const searchInput = documentRef.getElementById('si');
  if (searchInput instanceof HTMLInputElement) {
    searchInput.placeholder = t('search_placeholder');
    searchInput.setAttribute('aria-label', t('search_aria'));
  }

  const clearButton = documentRef.getElementById('sc');
  if (clearButton instanceof HTMLButtonElement) {
    clearButton.setAttribute('aria-label', t('clear_search_aria'));
  }

  const commandInput = documentRef.getElementById('cmdInput');
  if (commandInput instanceof HTMLInputElement) {
    commandInput.placeholder = t('command_input_placeholder');
  }

  const selected = documentRef.getElementById('search-selected');
  if (selected instanceof HTMLElement) {
    const personId = selected.dataset.personId ?? '';
    const focusValue = personId || t('selected_none');
    selected.textContent = `${t('selected_prefix')}: ${focusValue}`;
  }

  const note = documentRef.getElementById('mx-note');
  if (note instanceof HTMLElement) {
    note.textContent = t('migration_guardrail');
  }
}

function goToPersonFactory(_documentRef: Document, _t: (key: string) => string): (personId: string) => void {
  return (personId: string) => {
    const goF = (window as any).goF;
    if (typeof goF === 'function') {
      goF(personId);
    }
  };
}

function goToOfficeFactory(): (officeId: string) => void {
  return (officeId: string) => {
    const showOfficeDetail = (window as any).showOfficeDetail;
    if (typeof showOfficeDetail === 'function') {
      showOfficeDetail(officeId);
    }
  };
}

export function initSearchRuntime(documentRef: Document): { setLocale: (locale: Locale) => void } {
  const dataset = getDataset('research') as unknown as { people: SearchPerson[]; edges: SearchEdge[] };

  const locale = createLocaleHooks('en');
  const officeById = createOfficeMap(legacyOfficeById as Map<string, { id: string; name: string }>);
  const engine = createSearchEngine(dataset.people ?? [], dataset.edges ?? [], officeById);
  const reasonLabelAdapter = createReasonLabelAdapter(locale.t);
  const goToPerson = goToPersonFactory(documentRef, locale.t);
  const goToOffice = goToOfficeFactory();
  documentRef.documentElement.lang = locale.getLocale();

  applyRuntimeLocaleText(documentRef, locale.t);

  const input = documentRef.getElementById('si');

  const clearButton = documentRef.getElementById('sc');
  if (clearButton instanceof HTMLButtonElement && input instanceof HTMLInputElement) {
    clearButton.addEventListener('click', () => {
      input.value = '';
      input.focus();
    });
  }

  initSearchController(documentRef, {
    rankSearch: engine.rankSearch,
    reasonLabel: reasonLabelAdapter,
    formatReign,
    escapeHtml,
    personName,
    t: locale.t,
    goToPerson,
    goToOffice
  });

  initCommandPaletteController(documentRef, {
    rankSearch: engine.rankSearch,
    reasonLabel: reasonLabelAdapter,
    formatReign,
    escapeHtml,
    personName,
    t: locale.t,
    goToPerson,
    goToOffice,
    dynastyColor
  });

  return {
    setLocale: (nextLocale: Locale) => {
      locale.setLocale(nextLocale);
      documentRef.documentElement.lang = locale.getLocale();
      applyRuntimeLocaleText(documentRef, locale.t);
    }
  };
}

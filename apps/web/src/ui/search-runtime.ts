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
  match: 'reason_match'
};

const TRANSLATIONS: Record<Locale, Record<string, string>> = {
  en: {
    no_matches: 'No matches',
    command_empty_hint: 'Start typing to search names, dynasties, and titles.',
    search_placeholder: 'Search name/known-as/title/# · filters: dy:hilaaly c:u o:fandiyaaru',
    selected_prefix: 'Focused person',
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
    reason_match: 'Match'
  },
  dv: {
    no_matches: 'މެޗެސް ނުވޭ',
    command_empty_hint: 'ނަން، ދިނަސްޓީ އަދި ލަޤަބު ހޯދުމަށް ލިޔުން ފަށާށެވެ.',
    search_placeholder: 'ނަން/ކިޔާނަން/ލަޤަބު/# ހޯދާ · dy:hilaaly c:u o:fandiyaaru',
    selected_prefix: 'ފޯކަސްވާ ފަރާތް',
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
    reason_match: 'މެޗް'
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

function goToPersonFactory(documentRef: Document, t: (key: string) => string): (personId: string) => void {
  return (personId: string) => {
    const selected = documentRef.getElementById('search-selected');
    if (!(selected instanceof HTMLElement)) return;
    selected.textContent = `${t('selected_prefix')}: ${personId}`;
  };
}

export function initSearchRuntime(documentRef: Document): { setLocale: (locale: Locale) => void } {
  const dataset = getDataset('research') as unknown as { people: SearchPerson[]; edges: SearchEdge[] };

  const locale = createLocaleHooks('en');
  const officeById = createOfficeMap(legacyOfficeById as Map<string, { id: string; name: string }>);
  const engine = createSearchEngine(dataset.people ?? [], dataset.edges ?? [], officeById);
  const reasonLabelAdapter = createReasonLabelAdapter(locale.t);
  const goToPerson = goToPersonFactory(documentRef, locale.t);

  const input = documentRef.getElementById('si');
  if (input instanceof HTMLInputElement) {
    input.placeholder = locale.t('search_placeholder');
  }

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
    goToPerson
  });

  initCommandPaletteController(documentRef, {
    rankSearch: engine.rankSearch,
    reasonLabel: reasonLabelAdapter,
    formatReign,
    escapeHtml,
    personName,
    t: locale.t,
    goToPerson,
    dynastyColor
  });

  return {
    setLocale: (nextLocale: Locale) => {
      locale.setLocale(nextLocale);
      if (input instanceof HTMLInputElement) {
        input.placeholder = locale.t('search_placeholder');
      }
      const selected = documentRef.getElementById('search-selected');
      if (selected instanceof HTMLElement && selected.textContent?.endsWith(': none')) {
        selected.textContent = `${locale.t('selected_prefix')}: none`;
      }
    }
  };
}

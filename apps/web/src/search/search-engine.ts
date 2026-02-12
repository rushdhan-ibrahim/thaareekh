export type ConfidenceCode = 'c' | 'i' | 'u';

export type SearchReason =
  | 'filter'
  | 'number'
  | 'name'
  | 'alias'
  | 'known-as'
  | 'regnal'
  | 'title'
  | 'office'
  | 'dynasty'
  | 'fuzzy'
  | 'match';

export interface SearchPersonOffice {
  office_id?: string;
  label?: string;
}

export interface SearchPerson {
  id: string;
  nm: string;
  rg?: string;
  dy?: string;
  n?: Array<string | number>;
  aliases?: string[];
  regnal_names?: string[];
  titles?: string[];
  known_as?: Array<string | { name?: string }>;
  offices_held?: SearchPersonOffice[];
  re?: Array<[number, number?]>;
}

export interface SearchEdge {
  s: string;
  d: string;
  c?: string;
}

export interface OfficeDefinition {
  id: string;
  name: string;
}

export interface ParsedQuery {
  dy: string | null;
  c: ConfidenceCode | null;
  t: string | null;
  o: string | null;
  terms: string[];
}

export interface SearchHit {
  person: SearchPerson;
  score: number;
  reason: SearchReason;
}

export interface SearchEngine {
  parseQuery: (raw: string) => ParsedQuery;
  scorePerson: (person: SearchPerson, query: ParsedQuery) => SearchHit | null;
  rankSearch: (query: string, limit?: number) => SearchHit[];
}

const MAX_RESULTS = 12;

const reasonKey: Record<SearchReason, string> = {
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

function norm(input: unknown): string {
  return String(input ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function editDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;

  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i]![0] = i;
  for (let j = 0; j <= n; j++) dp[0]![j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i]![j] = Math.min(
        dp[i - 1]![j]! + 1,
        dp[i]![j - 1]! + 1,
        dp[i - 1]![j - 1]! + cost
      );
    }
  }

  return dp[m]![n]!;
}

function buildConfidenceIndex(people: SearchPerson[], edges: SearchEdge[]): Map<string, Set<string>> {
  const confidenceByPerson = new Map<string, Set<string>>();
  people.forEach((p) => confidenceByPerson.set(p.id, new Set<string>()));
  edges.forEach((edge) => {
    if (!edge.c) return;
    confidenceByPerson.get(edge.s)?.add(edge.c);
    confidenceByPerson.get(edge.d)?.add(edge.c);
  });
  return confidenceByPerson;
}

export function reasonLabel(reason: SearchReason, t: (key: string) => string): string {
  return t(reasonKey[reason] ?? 'reason_match');
}

export function createSearchEngine(
  people: SearchPerson[],
  edges: SearchEdge[],
  officeById: Map<string, OfficeDefinition>
): SearchEngine {
  const confidenceByPerson = buildConfidenceIndex(people, edges);

  function parseQuery(raw: string): ParsedQuery {
    const out: ParsedQuery = { dy: null, c: null, t: null, o: null, terms: [] };
    raw
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .forEach((tok) => {
        const index = tok.indexOf(':');
        if (index > 0) {
          const key = norm(tok.slice(0, index));
          const value = norm(tok.slice(index + 1));
          if (!value) return;
          if (key === 'dy' || key === 'dynasty') {
            out.dy = value;
          } else if (key === 'c' || key === 'conf') {
            const mapped =
              (
                {
                  confirmed: 'c',
                  inferred: 'i',
                  uncertain: 'u',
                  c: 'c',
                  i: 'i',
                  u: 'u'
                } as const
              )[value] ?? null;
            if (mapped) out.c = mapped;
          } else if (key === 't' || key === 'title') {
            out.t = value;
          } else if (key === 'o' || key === 'office') {
            out.o = value;
          } else {
            out.terms.push(norm(tok));
          }
          return;
        }
        out.terms.push(norm(tok));
      });
    return out;
  }

  function scorePerson(person: SearchPerson, query: ParsedQuery): SearchHit | null {
    const nm = norm(person.nm);
    const rg = norm(person.rg ?? '');
    const dy = norm(person.dy ?? '');
    const nums = (person.n ?? []).map((value) => String(value));
    const aliases = (person.aliases ?? []).map(norm);
    const regnal = (person.regnal_names ?? []).map(norm);
    const titles = (person.titles ?? []).map(norm);
    const knownAs = (person.known_as ?? []).map((value) =>
      norm(typeof value === 'string' ? value : (value as { name?: string })?.name ?? '')
    );
    const personOffices = (person.offices_held ?? []).flatMap((office) => {
      const def = office.office_id ? officeById.get(office.office_id) : null;
      return [office.label, office.office_id, def?.name].map(norm).filter(Boolean);
    });
    const officeDefs = (person.titles ?? []).flatMap((title) => {
      const hit = [...officeById.values()].find((office) => norm(office.name) === norm(title));
      return hit ? [norm(hit.name)] : [];
    });

    const hay = [
      nm,
      rg,
      dy,
      ...aliases,
      ...regnal,
      ...knownAs,
      ...titles,
      ...personOffices,
      ...officeDefs,
      nums.join(' ')
    ].join(' ');

    if (query.dy && !dy.includes(query.dy)) return null;
    if (query.c && !confidenceByPerson.get(person.id)?.has(query.c)) return null;
    if (query.t && !titles.some((title) => title.includes(query.t!))) return null;
    if (query.o && !personOffices.some((office) => office.includes(query.o!))) return null;
    if (!query.terms.length && (query.dy || query.c || query.t || query.o)) {
      const y = person.re?.[0]?.[0] ?? 99999;
      return { person, score: 20_000 - y, reason: 'filter' };
    }

    let score = 0;
    let reason: SearchReason = 'match';
    let hits = 0;

    for (const term of query.terms) {
      const numQ = term.startsWith('#') ? term.slice(1) : term;
      let termHit = false;

      if (nums.includes(numQ)) {
        score += 120;
        reason = 'number';
        termHit = true;
      }

      if (nm === term) {
        score += 110;
        reason = 'name';
        termHit = true;
      } else if (nm.startsWith(term)) {
        score += 90;
        reason = 'name';
        termHit = true;
      } else if (nm.includes(term)) {
        score += 70;
        reason = 'name';
        termHit = true;
      }

      if (aliases.some((alias) => alias === term)) {
        score += 80;
        reason = 'alias';
        termHit = true;
      } else if (aliases.some((alias) => alias.includes(term))) {
        score += 55;
        reason = 'alias';
        termHit = true;
      }

      if (knownAs.some((known) => known === term)) {
        score += 78;
        reason = 'known-as';
        termHit = true;
      } else if (knownAs.some((known) => known.includes(term))) {
        score += 54;
        reason = 'known-as';
        termHit = true;
      }

      if (rg.includes(term) || regnal.some((regnalName) => regnalName.includes(term))) {
        score += 45;
        if (reason === 'match') reason = 'regnal';
        termHit = true;
      }

      if (titles.some((title) => title.includes(term))) {
        score += 30;
        if (reason === 'match') reason = 'title';
        termHit = true;
      }

      if (personOffices.some((office) => office.includes(term))) {
        score += 35;
        if (reason === 'match') reason = 'office';
        termHit = true;
      }

      if (dy.includes(term)) {
        score += 20;
        if (reason === 'match') reason = 'dynasty';
        termHit = true;
      }

      if (!termHit && term.length >= 4) {
        const fuzzyPool = [nm, ...aliases, ...knownAs, ...regnal];
        const best = fuzzyPool.reduce((acc, value) => Math.min(acc, editDistance(term, value)), 999);
        if (best <= 2) {
          score += 38 - best * 8;
          if (reason === 'match') reason = 'fuzzy';
          termHit = true;
        }
      }

      if (termHit) {
        hits += 1;
      } else if (hay.includes(term)) {
        hits += 0.5;
      }
    }

    if (!hits) return null;
    if (hits < query.terms.length) score -= (query.terms.length - hits) * 18;
    if (query.dy || query.c || query.t || query.o) score += 10;
    return { person, score, reason };
  }

  function rankSearch(query: string, limit = MAX_RESULTS): SearchHit[] {
    const parsed = parseQuery(query);
    return people
      .map((person) => scorePerson(person, parsed))
      .filter((hit): hit is SearchHit => Boolean(hit))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const aY = a.person.re?.[0]?.[0] ?? 99999;
        const bY = b.person.re?.[0]?.[0] ?? 99999;
        return aY - bY;
      })
      .slice(0, limit);
  }

  return { parseQuery, scorePerson, rankSearch };
}

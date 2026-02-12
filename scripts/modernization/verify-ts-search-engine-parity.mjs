import assert from 'node:assert/strict';
import { people, edges } from '../../src/data/sovereigns.merge.js';
import { officeById } from '../../src/data/offices.js';
import { createSearchEngine as createTsSearchEngine } from '../../apps/web/src/search/search-engine.ts';

const MAX_RESULTS = 12;

const norm = (s) => (s || '')
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim();

function editDistance(a, b) {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

function createLegacyReferenceEngine(peopleSet, edgeSet, officeIndex) {
  const pc = new Map();
  peopleSet.forEach((person) => pc.set(person.id, new Set()));
  edgeSet.forEach((edge) => {
    pc.get(edge.s)?.add(edge.c);
    pc.get(edge.d)?.add(edge.c);
  });

  function parseQuery(raw) {
    const out = { dy: null, c: null, t: null, o: null, terms: [] };
    raw.trim().split(/\s+/).filter(Boolean).forEach((tok) => {
      const i = tok.indexOf(':');
      if (i > 0) {
        const k = norm(tok.slice(0, i));
        const v = norm(tok.slice(i + 1));
        if (!v) return;
        if (k === 'dy' || k === 'dynasty') out.dy = v;
        else if (k === 'c' || k === 'conf') {
          const mapped = { confirmed: 'c', inferred: 'i', uncertain: 'u', c: 'c', i: 'i', u: 'u' }[v];
          if (mapped) out.c = mapped;
        } else if (k === 't' || k === 'title') out.t = v;
        else if (k === 'o' || k === 'office') out.o = v;
        else out.terms.push(norm(tok));
        return;
      }
      out.terms.push(norm(tok));
    });
    return out;
  }

  function scorePerson(person, qParsed) {
    const nm = norm(person.nm);
    const rg = norm(person.rg || '');
    const dy = norm(person.dy || '');
    const nums = (person.n || []).map((x) => String(x));
    const aliases = (person.aliases || []).map(norm);
    const regnal = (person.regnal_names || []).map(norm);
    const titles = (person.titles || []).map(norm);
    const knownAs = (person.known_as || []).map((k) => norm(typeof k === 'string' ? k : k?.name || ''));
    const personOffices = (person.offices_held || []).flatMap((o) => {
      const def = o.office_id ? officeIndex.get(o.office_id) : null;
      return [o.label, o.office_id, def?.name].map(norm).filter(Boolean);
    });
    const officeDefs = (person.titles || []).flatMap((title) => {
      const hit = [...officeIndex.values()].find((office) => norm(office.name) === norm(title));
      return hit ? [norm(hit.name)] : [];
    });
    const hay = [nm, rg, dy, ...aliases, ...regnal, ...knownAs, ...titles, ...personOffices, ...officeDefs, nums.join(' ')].join(' ');

    if (qParsed.dy && !dy.includes(qParsed.dy)) return null;
    if (qParsed.c && !pc.get(person.id)?.has(qParsed.c)) return null;
    if (qParsed.t && !titles.some((title) => title.includes(qParsed.t))) return null;
    if (qParsed.o && !personOffices.some((office) => office.includes(qParsed.o))) return null;
    if (!qParsed.terms.length && (qParsed.dy || qParsed.c || qParsed.t || qParsed.o)) {
      const y = person.re?.[0]?.[0] ?? 99999;
      return { person, score: 20_000 - y, reason: 'filter' };
    }

    let score = 0;
    let reason = 'match';
    let hits = 0;

    for (const term of qParsed.terms) {
      const numQ = term.startsWith('#') ? term.slice(1) : term;
      let termHit = false;

      if (nums.includes(numQ)) { score += 120; reason = 'number'; termHit = true; }
      if (nm === term) { score += 110; reason = 'name'; termHit = true; }
      else if (nm.startsWith(term)) { score += 90; reason = 'name'; termHit = true; }
      else if (nm.includes(term)) { score += 70; reason = 'name'; termHit = true; }

      if (aliases.some((alias) => alias === term)) { score += 80; reason = 'alias'; termHit = true; }
      else if (aliases.some((alias) => alias.includes(term))) { score += 55; reason = 'alias'; termHit = true; }
      if (knownAs.some((alias) => alias === term)) { score += 78; reason = 'known-as'; termHit = true; }
      else if (knownAs.some((alias) => alias.includes(term))) { score += 54; reason = 'known-as'; termHit = true; }

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

      if (termHit) hits++;
      else if (hay.includes(term)) hits += 0.5;
    }

    if (!hits) return null;
    if (hits < qParsed.terms.length) score -= (qParsed.terms.length - hits) * 18;
    if (qParsed.dy || qParsed.c || qParsed.t || qParsed.o) score += 10;
    return { person, score, reason };
  }

  function rankSearch(q, limit = MAX_RESULTS) {
    const parsed = parseQuery(q);
    return peopleSet
      .map((person) => scorePerson(person, parsed))
      .filter(Boolean)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const aY = a.person.re?.[0]?.[0] ?? 99999;
        const bY = b.person.re?.[0]?.[0] ?? 99999;
        return aY - bY;
      })
      .slice(0, limit);
  }

  return { parseQuery, rankSearch };
}

const reference = createLegacyReferenceEngine(people, edges, officeById);
const ts = createTsSearchEngine(people, edges, officeById);

const queries = [
  '',
  'amin',
  'maumoon',
  'nasheed',
  '#1',
  'dy:hilaaly',
  'c:inferred',
  'conf:u',
  'o:fandiyaaru',
  'office:president',
  't:sultan',
  'title:queen',
  'dy:hilaaly c:i',
  'dy:hilaaly c:i office:fandiyaaru',
  'dhon bandaarain',
  'ibrahim',
  'muhammed amin',
  'faamuladheyri',
  'handeygiri',
  'sulthan mohammed'
];

const toComparable = (rows) => rows.map((row) => ({
  id: row.person.id,
  score: row.score,
  reason: row.reason
}));

for (const query of queries) {
  assert.deepStrictEqual(
    ts.parseQuery(query),
    reference.parseQuery(query),
    `Parsed-query mismatch for "${query}"`
  );

  assert.deepStrictEqual(
    toComparable(ts.rankSearch(query)),
    toComparable(reference.rankSearch(query)),
    `Ranked search mismatch for "${query}"`
  );

  assert.deepStrictEqual(
    toComparable(ts.rankSearch(query, 5)),
    toComparable(reference.rankSearch(query, 5)),
    `Ranked search (limit=5) mismatch for "${query}"`
  );
}

console.log('TypeScript search-engine parity passed (reference == TS).');

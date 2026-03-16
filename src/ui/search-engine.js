/**
 * Shared search scoring engine.
 * Extracted from search.js so both inline search and command palette can reuse it.
 */
import { people, edges } from '../data/sovereigns.merge.js';
import { officeCatalog, officeById } from '../data/offices.js';
import { fR } from '../utils/format.js';
import { personName, t } from './i18n.js';

const MAX_RESULTS = 12;

const norm = s => (s || "")
  .toLowerCase()
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .trim();

function editDistance(a, b) {
  const m = a.length, n = b.length;
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

const pc = new Map();
people.forEach(p => pc.set(p.id, new Set()));
edges.forEach(e => {
  pc.get(e.s)?.add(e.c);
  pc.get(e.d)?.add(e.c);
});

export function parseQuery(raw) {
  const out = { dy: null, c: null, t: null, o: null, terms: [] };
  raw.trim().split(/\s+/).filter(Boolean).forEach(tok => {
    const i = tok.indexOf(":");
    if (i > 0) {
      const k = norm(tok.slice(0, i));
      const v = norm(tok.slice(i + 1));
      if (!v) return;
      if (k === "dy" || k === "dynasty") out.dy = v;
      else if (k === "c" || k === "conf") {
        const mapped = { confirmed: "c", inferred: "i", uncertain: "u", c: "c", i: "i", u: "u" }[v];
        if (mapped) out.c = mapped;
      } else if (k === "t" || k === "title") out.t = v;
      else if (k === "o" || k === "office") out.o = v;
      else out.terms.push(norm(tok));
      return;
    }
    out.terms.push(norm(tok));
  });
  return out;
}

export function reasonLabel(reason) {
  if (reason === 'filter') return t('reason_filter');
  if (reason === 'number') return t('reason_number');
  if (reason === 'name') return t('reason_name');
  if (reason === 'alias') return t('reason_alias');
  if (reason === 'known-as') return t('reason_known_as');
  if (reason === 'regnal') return t('reason_regnal');
  if (reason === 'title') return t('reason_title');
  if (reason === 'office') return t('reason_office');
  if (reason === 'dynasty') return t('reason_dynasty');
  if (reason === 'fuzzy') return t('reason_fuzzy');
  if (reason === 'office-name') return t('reason_office_name');
  if (reason === 'office-alias') return t('reason_office_alias');
  if (reason === 'office-kind') return t('reason_office_kind');
  if (reason === 'office-fuzzy') return t('reason_office_fuzzy');
  return t('reason_match');
}

export function scorePerson(p, qParsed) {
  const nm = norm(p.nm);
  const rg = norm(p.rg || "");
  const dy = norm(p.dy || "");
  const nums = (p.n || []).map(x => String(x));
  const aliases = (p.aliases || []).map(norm);
  const regnal = (p.regnal_names || []).map(norm);
  const titles = (p.titles || []).map(norm);
  const knownAs = (p.known_as || []).map(k => norm(typeof k === "string" ? k : k?.name || ""));
  const personOffices = (p.offices_held || []).flatMap(o => {
    const def = o.office_id ? officeById.get(o.office_id) : null;
    return [o.label, o.office_id, def?.name].map(norm).filter(Boolean);
  });
  const officeDefs = (p.titles || []).flatMap(t => {
    const hit = [...officeById.values()].find(o => norm(o.name) === norm(t));
    return hit ? [norm(hit.name)] : [];
  });
  const hay = [nm, rg, dy, ...aliases, ...regnal, ...knownAs, ...titles, ...personOffices, ...officeDefs, nums.join(" ")].join(" ");

  if (qParsed.dy && !dy.includes(qParsed.dy)) return null;
  if (qParsed.c && !pc.get(p.id)?.has(qParsed.c)) return null;
  if (qParsed.t && !titles.some(t => t.includes(qParsed.t))) return null;
  if (qParsed.o && !personOffices.some(o => o.includes(qParsed.o))) return null;
  if (!qParsed.terms.length && (qParsed.dy || qParsed.c || qParsed.t || qParsed.o)) {
    const y = p.re?.[0]?.[0] ?? 99999;
    return { type: 'person', person: p, score: 20_000 - y, reason: "filter" };
  }

  let score = 0;
  let reason = "match";
  let hits = 0;

  for (const term of qParsed.terms) {
    const numQ = term.startsWith("#") ? term.slice(1) : term;
    let termHit = false;

    if (nums.includes(numQ)) { score += 120; reason = "number"; termHit = true; }
    if (nm === term) { score += 110; reason = "name"; termHit = true; }
    else if (nm.startsWith(term)) { score += 90; reason = "name"; termHit = true; }
    else if (nm.includes(term)) { score += 70; reason = "name"; termHit = true; }

    if (aliases.some(a => a === term)) { score += 80; reason = "alias"; termHit = true; }
    else if (aliases.some(a => a.includes(term))) { score += 55; reason = "alias"; termHit = true; }
    if (knownAs.some(a => a === term)) { score += 78; reason = "known-as"; termHit = true; }
    else if (knownAs.some(a => a.includes(term))) { score += 54; reason = "known-as"; termHit = true; }

    if (rg.includes(term) || regnal.some(r => r.includes(term))) {
      score += 45; if (reason === "match") reason = "regnal"; termHit = true;
    }
    if (titles.some(t => t.includes(term))) {
      score += 30; if (reason === "match") reason = "title"; termHit = true;
    }
    if (personOffices.some(o => o.includes(term))) {
      score += 35; if (reason === "match") reason = "office"; termHit = true;
    }
    if (dy.includes(term)) {
      score += 20; if (reason === "match") reason = "dynasty"; termHit = true;
    }

    if (!termHit && term.length >= 4) {
      const fuzzyPool = [nm, ...aliases, ...knownAs, ...regnal];
      const best = fuzzyPool.reduce((acc, v) => Math.min(acc, editDistance(term, v)), 999);
      if (best <= 2) {
        score += 38 - best * 8;
        if (reason === "match") reason = "fuzzy";
        termHit = true;
      }
    }
    if (termHit) hits++;
    else if (hay.includes(term)) hits += 0.5;
  }

  if (!hits) return null;
  if (hits < qParsed.terms.length) score -= (qParsed.terms.length - hits) * 18;
  if (qParsed.dy || qParsed.c || qParsed.t || qParsed.o) score += 10;
  return { type: 'person', person: p, score, reason };
}

export function scoreOffice(office, qParsed) {
  // Only score offices against free-text terms (not pure filter queries)
  if (!qParsed.terms.length) return null;
  // Skip if person-specific filters are active
  if (qParsed.dy || qParsed.c || qParsed.t) return null;

  const nm = norm(office.name);
  const altNames = (office.alt_names || []).map(norm);
  const kind = norm(office.kind || '');
  const summary = norm(office.summary || '');

  let score = 0;
  let reason = 'office-name';

  for (const term of qParsed.terms) {
    if (nm === term) { score += 100; reason = 'office-name'; }
    else if (nm.startsWith(term)) { score += 85; reason = 'office-name'; }
    else if (nm.includes(term)) { score += 65; reason = 'office-name'; }
    else if (altNames.some(a => a === term)) { score += 75; reason = 'office-alias'; }
    else if (altNames.some(a => a.includes(term))) { score += 50; reason = 'office-alias'; }
    else if (kind.includes(term)) { score += 25; reason = 'office-kind'; }
    else if (summary.includes(term)) { score += 15; reason = 'office-name'; }
    else if (term.length >= 4) {
      const pool = [nm, ...altNames];
      const best = pool.reduce((acc, v) => Math.min(acc, editDistance(term, v)), 999);
      if (best <= 2) { score += 35 - best * 8; reason = 'office-fuzzy'; }
    }
  }

  if (score <= 0) return null;
  return { type: 'office', office, score, reason };
}

export function rankSearch(q, limit = MAX_RESULTS) {
  const parsed = parseQuery(q);
  const personHits = people
    .map(p => scorePerson(p, parsed))
    .filter(Boolean);
  const officeHits = officeCatalog
    .map(o => scoreOffice(o, parsed))
    .filter(Boolean);
  return [...personHits, ...officeHits]
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.type === 'person' && b.type === 'person') {
        const aY = a.person.re?.[0]?.[0] ?? 99999;
        const bY = b.person.re?.[0]?.[0] ?? 99999;
        return aY - bY;
      }
      // Offices sort after persons at same score
      if (a.type !== b.type) return a.type === 'office' ? 1 : -1;
      return 0;
    })
    .slice(0, limit);
}

import type {
  PersonNode, EdgeRecord, LinkDatum, InferenceBasis
} from '../types/state.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SourceEntry {
  id: string;
  url?: string;
  title: string;
  publisher?: string;
  access_date?: string;
  quality?: string;
  notes?: string;
}

interface OfficeCatalogEntry {
  id: string;
  name: string;
  kind?: string;
  summary?: string;
  alt_names?: string[];
  source_refs?: string[];
}

interface OfficeTimelinePeriod {
  label: string;
  period?: string;
  summary?: string;
  offices?: string[];
  source_refs?: string[];
}

interface PlaceAnchor {
  id: string;
  en: string;
  dv: string;
  x: number;
  y: number;
  aliases: string[];
}

interface RoyalAdj {
  to: string;
  t: string;
  c: string;
  evidence_refs: string[];
}

interface RoyalLinkResult {
  status: string;
  summary: string;
  source_refs: string[];
  pathText: string;
}

interface InferenceDetail {
  ruleLabel: string;
  summary: string;
  dossier?: string;
  logic: string[];
  verification: string[];
}

interface RelNeighbor {
  id: string;
  c: string | undefined;
  srcCount: number;
  cg: string;
  l: string;
  t: string | undefined;
}

// ---------------------------------------------------------------------------
// Module-level deps (set via initSidebar)
// ---------------------------------------------------------------------------

let _byId: Map<string, PersonNode> = new Map();
let _people: PersonNode[] = [];
let _edges: EdgeRecord[] = [];
let _sourceById: Map<string, SourceEntry> = new Map();
let _officeById: Map<string, OfficeCatalogEntry> = new Map();
let _officeTimeline: OfficeTimelinePeriod[] = [];
let _fR: (re: Array<[number, number?]>) => string = () => '';
let _esc: (s: string) => string = (s) => s;
let _personName: (p: PersonNode | string, byId?: Map<string, PersonNode>) => string = (p) => typeof p === 'string' ? p : p.nm;
let _relationLabel: (t: string) => string = (t) => t;
let _t: (key: string) => string = (k) => k;
let _getLang: () => string = () => 'en';
let _gNb: (id: string, type: string) => RelNeighbor[] = () => [];
let _parOf: (id: string) => RelNeighbor[] = () => [];
let _chOf: (id: string) => RelNeighbor[] = () => [];
let _recordPerson: (id: string) => void = () => {};
let _recordEdge: (link: LinkDatum) => void = () => {};
let _compareSummaryHtml: () => string = () => '';
let _handlePersonViewed: (id: string) => void = () => {};
let _currentPersonId: string | null = null;
let _oS: (prefer?: string) => void = () => {};
let _resolvePlace: (text: string | undefined | null) => PlaceAnchor | null = () => null;
let _extractPlaceMentions: (text: string) => PlaceAnchor[] = () => [];
let _placeLabelForLang: (anchor: PlaceAnchor, lang: string) => string = (a) => a.en;
let _getInferenceNote: (edge: Record<string, unknown>) => { summary?: string; dossier?: string; logic?: string[]; verification?: string[] } | null = () => null;
let _getInferenceDossierPath: (edge: Record<string, unknown>) => string | null = () => null;
let _inferenceEdgeKey: (edge: Record<string, unknown>) => string = () => '';
let _isDerivedInferenceEdge: (edge: Record<string, unknown>) => boolean = () => false;

// Pre-computed data
let RULER_IDS = new Set<string>();
let ROYAL_ADJ = new Map<string, RoyalAdj[]>();

// ---------------------------------------------------------------------------
// Pure helpers (testable)
// ---------------------------------------------------------------------------

export function estLife(p: PersonNode): { yb: number | null; yd: number | null; ybEst: boolean; ydEst: boolean } {
  const yrs = (p.re || []).flat().filter((v): v is number => v != null);
  const from = yrs.length ? Math.min(...yrs) : null;
  const to = yrs.length ? Math.max(...yrs) : null;
  const yb = p.yb ?? (from != null ? from - 30 : null);
  const yd = p.yd ?? (to != null ? to + 10 : null);
  return {
    yb,
    yd,
    ybEst: p.yb == null && yb != null,
    ydEst: p.yd == null && yd != null
  };
}

export function sourceQualityWeight(q: string): number {
  if (q === 'A') return 4;
  if (q === 'B') return 3;
  if (q === 'C') return 2;
  if (q === 'D') return 1;
  return 0;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function uniq(arr: unknown[]): string[] {
  return [...new Set((arr || []).filter(Boolean) as string[])];
}

function confidenceLabel(c: string): string {
  if (c === 'c') return _t('confirmed');
  if (c === 'i') return _t('inferred');
  return _t('uncertain');
}

function confidenceBadge(c: string | undefined): string {
  if (!c || c === 'c') return '';
  const cls = c === 'i' ? 'rt-i' : 'rt-u';
  return `<span class="rt ${cls}">${confidenceLabel(c)}</span>`;
}

function pluralLabel(count: number, singularKey: string, pluralKey: string): string {
  return count === 1 ? _t(singularKey) : _t(pluralKey);
}

function relationTypeShortLabel(type: string): string {
  if (type === 'parent') return _t('edge_parent');
  if (type === 'sibling') return _t('edge_sibling');
  if (type === 'spouse') return _t('edge_spouse');
  return _t('edge_kin');
}

function relationTypeLabel(tType: string): string {
  return _relationLabel(tType);
}

function sourceRowsFromRefs(refs: string[]): Array<{ id: string; title: string; quality: string; publisher: string }> {
  return uniq(refs)
    .filter(id => _sourceById.has(id))
    .map(id => {
      const src = _sourceById.get(id);
      return {
        id,
        title: src?.title || src?.url || id,
        quality: src?.quality || '?',
        publisher: src?.publisher || ''
      };
    })
    .sort((a, b) => sourceQualityWeight(b.quality) - sourceQualityWeight(a.quality) || a.title.localeCompare(b.title));
}

function periodLabel(start: number | null | undefined, end: number | null | undefined): string {
  if (start == null && end == null) return _t('period_unknown');
  if (start != null && end == null) return `${start}\u2013`;
  if (start == null && end != null) return `\u2013${end}`;
  return start === end ? String(start) : `${start}\u2013${end}`;
}

function rankEdge(a: RoyalAdj, b: RoyalAdj): number {
  const tRank = (tType: string) => (tType === 'parent' ? 0 : tType === 'sibling' ? 1 : tType === 'kin' ? 2 : 3);
  const cRank = (c: string) => (c === 'c' ? 0 : c === 'i' ? 1 : 2);
  return tRank(a.t) - tRank(b.t) || cRank(a.c) - cRank(b.c);
}

function findRoyalPath(start: string, maxDepth: number = 8): { ids: string[]; hops: RoyalAdj[] } | null {
  if (RULER_IDS.has(start)) return { ids: [start], hops: [] };
  const q = [start];
  const seen = new Set([start]);
  const prev = new Map<string, { id: string; edge: RoyalAdj }>();
  const depth = new Map<string, number>([[start, 0]]);

  while (q.length) {
    const cur = q.shift()!;
    const curDepth = depth.get(cur) || 0;
    if (curDepth >= maxDepth) continue;
    const nexts = (ROYAL_ADJ.get(cur) || []).slice().sort(rankEdge);
    for (const next of nexts) {
      if (seen.has(next.to)) continue;
      seen.add(next.to);
      prev.set(next.to, { id: cur, edge: next });
      depth.set(next.to, curDepth + 1);
      if (RULER_IDS.has(next.to)) {
        const ids = [next.to];
        const hops: RoyalAdj[] = [];
        let ptr = next.to;
        while (ptr !== start) {
          const step = prev.get(ptr)!;
          hops.push(step.edge);
          ids.push(step.id);
          ptr = step.id;
        }
        ids.reverse();
        hops.reverse();
        return { ids, hops };
      }
      q.push(next.to);
    }
  }
  return null;
}

function royalLinkInfo(p: PersonNode): RoyalLinkResult {
  if ((p.royal_link as Record<string, unknown>)?.status && (p.royal_link as Record<string, unknown>)?.summary) {
    const rl = p.royal_link as { status: string; summary: string; source_refs?: string[] };
    let summary = rl.summary;
    if (_getLang() === 'dv') {
      if (rl.status === 'sovereign') summary = _t('royal_summary_sovereign');
      else if (rl.status === 'none') summary = _t('royal_summary_none');
      else if (rl.status === 'descent') summary = _t('royal_summary_documented_descent');
      else summary = _t('royal_summary_documented_link_prefix');
    }
    return {
      status: rl.status,
      summary,
      source_refs: rl.source_refs || [],
      pathText: ''
    };
  }
  if (RULER_IDS.has(p.id)) {
    return {
      status: 'sovereign',
      summary: _t('royal_summary_sovereign'),
      source_refs: p.source_refs || [],
      pathText: ''
    };
  }
  const path = findRoyalPath(p.id);
  if (!path) {
    return {
      status: 'none',
      summary: _t('royal_summary_none'),
      source_refs: [],
      pathText: ''
    };
  }
  const hasSpouse = path.hops.some(h => h.t === 'spouse');
  const allParent = path.hops.every(h => h.t === 'parent');
  const hasUncertain = path.hops.some(h => h.c === 'u');
  let status = allParent ? 'descent' : hasSpouse ? 'affinal' : 'collateral';
  if (hasUncertain) status = 'uncertain';
  const target = _byId.get(path.ids[path.ids.length - 1]!);
  const edgeSet = new Set(path.hops.map(h => relationTypeShortLabel(h.t)));
  const rel = [...edgeSet].join(', ');
  const pathText = path.ids.map(id => _personName(_byId.get(id) || id)).join(' \u2192 ');
  const prefix = status === 'descent' ? _t('royal_summary_documented_descent') : _t('royal_summary_documented_link_prefix');
  return {
    status,
    summary: `${prefix}${target ? `: ${_personName(target)}` : ''} ${_t('royal_summary_via')} ${rel || _t('family_links')}.`.trim(),
    source_refs: uniq(path.hops.flatMap(h => h.evidence_refs || [])),
    pathText
  };
}

function collectSourceRefs(p: PersonNode): string[] {
  const refs: string[] = [];
  refs.push(...(p.source_refs || []));
  (p.known_as || []).forEach(k => refs.push(...((k && typeof k === 'object' && 'source_refs' in k ? (k as { source_refs?: string[] }).source_refs : undefined) || [])));
  (p.offices_held || []).forEach(o => refs.push(...((o && o.source_refs) || [])));
  if (p.royal_link && 'source_refs' in (p.royal_link as Record<string, unknown>)) {
    refs.push(...((p.royal_link as { source_refs?: string[] }).source_refs || []));
  }
  const royal = royalLinkInfo(p);
  refs.push(...(royal.source_refs || []));
  return uniq(refs).filter(id => _sourceById.has(id));
}

function knownAsRows(p: PersonNode): string {
  const rows = (p.known_as || [])
    .map(k => (typeof k === 'string' ? { name: k } : k))
    .filter((k): k is { name?: string; type?: string; c?: string; note?: string } => k != null && typeof k === 'object' && 'name' in k && Boolean((k as { name?: string }).name));
  if (!rows.length) return `<div class="nt" style="color:var(--tx3)">${_esc(_t('no_known_by_names'))}</div>`;
  return `<ul class="pfl">${rows.map(k => `<li><button class="pn pn-b" data-q="${_esc(k.name || '')}">${_esc(k.name || '')}</button> ${k.type ? `<span class="rt">${_esc(k.type)}</span>` : ''} ${confidenceBadge(k.c)}${k.note ? `<div class="rs">${_esc(k.note)}</div>` : ''}</li>`).join('')}</ul>`;
}

function sovereignOfficeLabel(p: PersonNode | null): string {
  if (p?.g === 'F') return _t('queen_title');
  if (p?.g === 'M') return _t('sultan_title');
  return _t('sovereign_title');
}

function inferredSovereignOffice(p: PersonNode): Record<string, unknown> | null {
  if (!(p.n || []).length) return null;
  const years = (p.re || []).flat().filter((y): y is number => y != null && Number.isFinite(y));
  if (!years.length) return null;
  return {
    office_id: 'OFF-SOVEREIGN',
    label: sovereignOfficeLabel(p),
    start: Math.min(...years),
    end: Math.max(...years),
    c: 'c',
    note: _t('derived_from_reign_record'),
    source_refs: p.source_refs || []
  };
}

function officeRows(p: PersonNode): Array<Record<string, unknown>> {
  const explicit = (p.offices_held || []).map(x => ({ ...x }));
  const sovereign = inferredSovereignOffice(p);
  if (sovereign && !explicit.some(x => x.office_id === 'OFF-SOVEREIGN')) explicit.unshift(sovereign as typeof explicit[0]);
  return explicit;
}

function officePanel(p: PersonNode): string {
  const rows = officeRows(p);
  const held = rows.length
    ? `<ul class="rl">${rows.map(o => {
      const def = _officeById.get(o.office_id as string || '');
      const nm = (o.label as string) || (o.office_id === 'OFF-SOVEREIGN' ? sovereignOfficeLabel(p) : (def?.name || (o.office_id as string) || _t('office_generic')));
      const role = def?.summary || '';
      const y = periodLabel(o.start as number | undefined, o.end as number | undefined);
      return `<li class="ri"><div class="rlf"><div class="rn">${_esc(nm)} ${confidenceBadge(o.c as string | undefined)}</div><div class="rs">${_esc(y)}${o.note ? ` \u00b7 ${_esc(o.note as string)}` : ''}</div>${role ? `<div class="rs">${_esc(role)}</div>` : ''}</div></li>`;
    }).join('')}</ul>`
    : `<div class="nt" style="color:var(--tx3)">${_esc(_t('no_office_records'))}</div>`;

  const timeline = `<details class="odt"><summary>${_esc(_t('historical_office_timeline'))}</summary><ul class="rl">${_officeTimeline.map(period => {
    const officeNames = (period.offices || []).map(id => _officeById.get(id)?.name || id);
    return `<li class="ri"><div class="rlf"><div class="rn">${_esc(period.label)}</div><div class="rs">${_esc(period.period || '')} \u00b7 ${_esc(officeNames.join(', '))}</div><div class="rs">${_esc(period.summary || '')}</div></div></li>`;
  }).join('')}</ul></details>`;

  return `<div class="pcs"><div class="sl">${_esc(_t('held_offices_titles'))}</div>${held}</div>${timeline}`;
}

function factsPanelHtml(facts: string[]): string {
  if (!facts.length) return '';
  const lead = facts.slice(0, 3).map(f => `<li>${_esc(f)}</li>`).join('');
  const tail = facts.slice(3).map(f => `<li>${_esc(f)}</li>`).join('');
  const more = facts.length - 3;
  return `
    <div class="pcs">
      <div class="sl">${_esc(_t('interesting_facts'))}</div>
      <ul class="pfl">${lead}</ul>
      ${tail ? `<details class="odt"><summary>${_esc(_t('show_more'))} ${more} ${_esc(more === 1 ? _t('more_fact') : _t('more_facts'))}</summary><ul class="pfl">${tail}</ul></details>` : ''}
    </div>
  `;
}

function personEvidencePanel(p: PersonNode): string {
  const relEdges = _edges.filter(e => e.s === p.id || e.d === p.id);
  const conf: Record<string, number> = { c: 0, i: 0, u: 0 };
  const rel: Record<string, number> = { parent: 0, sibling: 0, spouse: 0, kin: 0 };
  relEdges.forEach(e => {
    if (conf[e.c] != null) conf[e.c]! += 1;
    if (rel[e.t] != null) rel[e.t]! += 1;
  });
  const relSummary = Object.entries(rel)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${relationTypeShortLabel(k)}: ${v}`)
    .join(' \u00b7 ');
  const refs = collectSourceRefs(p);
  const sourceRows = sourceRowsFromRefs(refs);
  const strong = sourceRows.filter(r => r.quality === 'A' || r.quality === 'B').length;
  const sourceWord = pluralLabel(sourceRows.length, 'source_word', 'sources_word');
  const relWord = pluralLabel(relEdges.length, 'relationship_link_word', 'relationship_links_word');
  const uncertain = relEdges
    .filter(e => e.c !== 'c')
    .slice(0, 8)
    .map(e => {
      const otherId = e.s === p.id ? e.d : e.s;
      const other = _byId.get(otherId);
      return `<li>${_esc(relationTypeLabel(e.t))} \u00b7 ${_esc(_personName(other || otherId))} ${confidenceBadge(e.c)}</li>`;
    })
    .join('');
  const leadSources = sourceRows.slice(0, 3).map(s => `<li>${_esc(s.title)} <span class="rt">${_esc(s.quality)}</span></li>`).join('');
  const tailSources = sourceRows.slice(3).map(s => `<li>${_esc(s.title)} <span class="rt">${_esc(s.quality)}</span></li>`).join('');
  return `
    <div class="pcs">
      <div class="sl">${_esc(_t('evidence_narrative'))}</div>
      <div class="nt">${_esc(_t('profile_evidence_basis'))} ${sourceRows.length} ${_esc(sourceWord)} ${_esc(_t('and_word'))} ${relEdges.length} ${_esc(relWord)}.</div>
      <div class="rs">${_esc(_t('confidence_mix'))} \u00b7 ${_esc(_t('confirmed'))}: ${conf.c} \u00b7 ${_esc(_t('inferred'))}: ${conf.i} \u00b7 ${_esc(_t('uncertain'))}: ${conf.u}</div>
      <div class="rs">${_esc(_t('source_strength_label'))} \u00b7 A/B ${_esc(_t('grade_word'))} ${_esc(_t('sources_word'))}: ${strong}${sourceRows.length ? ` ${_esc(_t('of_word'))} ${sourceRows.length}` : ''}</div>
      ${relSummary ? `<div class="rs">${_esc(_t('relation_distribution_label'))} \u00b7 ${_esc(relSummary)}</div>` : `<div class="rs">${_esc(_t('no_modeled_relation_links'))}</div>`}
    </div>
    <div class="pcs">
      <div class="sl">${_esc(_t('key_sources'))}</div>
      ${leadSources ? `<ul class="pfl">${leadSources}</ul>` : `<div class="nt" style="color:var(--tx3)">${_esc(_t('no_sources'))}</div>`}
      ${tailSources ? `<details class="odt"><summary>${_esc(_t('show_more'))} ${sourceRows.length - 3} ${_esc(sourceRows.length - 3 === 1 ? _t('more_source') : _t('more_sources'))}</summary><ul class="pfl">${tailSources}</ul></details>` : ''}
    </div>
    <div class="pcs">
      <div class="sl">${_esc(_t('uncertainty_watchlist'))}</div>
      ${uncertain ? `<ul class="pfl">${uncertain}</ul>` : `<div class="nt" style="color:var(--tx3)">${_esc(_t('no_inferred_uncertain_links'))}</div>`}
    </div>
  `;
}

function mapPanel(p: PersonNode): string {
  const lang = _getLang();
  const birth = _resolvePlace(p.pb);
  const death = _resolvePlace(p.pd);
  const edgeContext = _edges
    .filter(e => e.s === p.id || e.d === p.id)
    .map(e => `${e.event_context || ''} ${e.l || ''}`)
    .join(' ');
  const officeText = (p.offices_held || []).map(o => `${o.label || ''} ${o.note || ''}`).join(' ');
  const contextText = [p.no || '', ...(p.facts || []), officeText, edgeContext].join(' ');
  const context = _extractPlaceMentions(contextText);
  const points = new Map<string, { anchor: PlaceAnchor; role: Set<string> }>();

  const pushPoint = (anchor: PlaceAnchor | null, role: string) => {
    if (!anchor) return;
    const cur = points.get(anchor.id);
    if (!cur) {
      points.set(anchor.id, { anchor, role: new Set([role]) });
      return;
    }
    cur.role.add(role);
  };

  pushPoint(birth, 'birth');
  pushPoint(death, 'death');
  context.forEach(anchor => pushPoint(anchor, 'ctx'));

  const routes: Array<{ from: PlaceAnchor; to: PlaceAnchor; kind: string }> = [];
  if (birth && death && birth.id !== death.id) routes.push({ from: birth, to: death, kind: 'life' });
  context.forEach(anchor => {
    if (!birth || anchor.id === birth.id) return;
    routes.push({ from: birth, to: anchor, kind: 'ctx' });
  });
  const routeDedup = new Set<string>();
  const routeRows = routes.filter(r => {
    const key = `${r.from.id}|${r.to.id}|${r.kind}`;
    if (routeDedup.has(key)) return false;
    routeDedup.add(key);
    return true;
  }).slice(0, 6);

  const pointRows = [...points.values()];
  const mapSvg = `
    <div class="mvw">
      <svg class="mv" viewBox="0 0 420 240" aria-label="${_esc(_t('map_context'))}">
        <path class="mv-chain" d="M214 14 C190 42 250 70 218 100 C182 130 244 160 214 190 C190 214 226 226 214 236" />
        ${routeRows.map(r => `<line class="mv-route ${r.kind}" x1="${r.from.x}" y1="${r.from.y}" x2="${r.to.x}" y2="${r.to.y}" />`).join('')}
        ${pointRows.map(({ anchor, role }) => {
          let cls = 'ctx';
          if (role.has('birth')) cls = 'birth';
          else if (role.has('death')) cls = 'death';
          const lbl = _placeLabelForLang(anchor, lang);
          return `<g><circle class="mv-dot ${cls}" cx="${anchor.x}" cy="${anchor.y}" r="4.3"/><text class="mv-lbl" x="${anchor.x + 6}" y="${anchor.y - 6}">${_esc(lbl)}</text></g>`;
        }).join('')}
      </svg>
    </div>`;

  const birthRow = birth ? _esc(_placeLabelForLang(birth, lang)) : _esc(_t('unknown'));
  const deathRow = death ? _esc(_placeLabelForLang(death, lang)) : _esc(_t('unknown'));
  const contextRows = context
    .filter(a => (!birth || a.id !== birth.id) && (!death || a.id !== death.id))
    .slice(0, 6)
    .map(a => `<span class="pn">${_esc(_placeLabelForLang(a, lang))}</span>`)
    .join('');
  const routeHints = routeRows
    .map(r => `${_placeLabelForLang(r.from, lang)} \u2192 ${_placeLabelForLang(r.to, lang)}`)
    .join(' \u00b7 ');

  return `
    <div class="pcs">
      <div class="sl">${_esc(_t('map_context'))}</div>
      ${mapSvg}
      <div class="rs">${_esc(_t('map_birth'))}: ${birthRow}</div>
      <div class="rs">${_esc(_t('map_death'))}: ${deathRow}</div>
      <div class="rs">${_esc(_t('map_context_nodes'))}: ${contextRows || `<span class="pn">${_esc(_t('unknown'))}</span>`}</div>
      ${routeHints ? `<div class="rs">${_esc(_t('map_routes'))}: ${_esc(routeHints)}</div>` : ''}
    </div>
  `;
}

function profileCard(p: PersonNode): string {
  const life = estLife(p);
  const display = _personName(p);
  const names = uniq([p.nm, display, p.rg, ...(p.regnal_names || []), ...(p.aliases || [])]);
  const facts = p.facts?.length ? p.facts : (p.no ? [p.no] : []);
  const birthPlace = p.pb || _t('unknown');
  const deathPlace = p.pd || _t('unknown');
  const lifeText = `${life.yb != null ? life.yb : _t('unknown')}${life.ybEst ? ' (est.)' : ''} \u2192 ${life.yd != null ? life.yd : _t('unknown')}${life.ydEst ? ' (est.)' : ''}`;
  const royal = royalLinkInfo(p);
  const statusText: Record<string, string> = {
    sovereign: _t('royal_sovereign'),
    descent: _t('royal_descent'),
    collateral: _t('royal_collateral'),
    affinal: _t('royal_affinal'),
    uncertain: _t('royal_uncertain'),
    documented: _t('royal_documented'),
    none: _t('royal_none')
  };
  const statusLabel = statusText[royal.status] || _t('royal_documented');
  const dyColor = `var(--dy-${(p.dy || 'unknown').toLowerCase()})`;
  const reignText = _fR(p.re || []) || _t('unknown');
  const femaleIcon = p.g === 'F' ? '<span class="pc-female" aria-label="Female">\u2640</span> ' : '';
  const connCount = _edges.filter(e => e.s === p.id || e.d === p.id).length;
  const srcCount = collectSourceRefs(p).length;

  return `
    <section class="pc" data-person-card style="--dy-color:${dyColor}">
      <div class="pch">
        <div class="pcn">${femaleIcon}${_esc(display)}</div>
        <div class="pcd">${_esc(p.dy || _t('unknown_dynasty'))}</div>
        <div class="pc-reign-pill">${_esc(reignText)}</div>
      </div>
      <div class="pcg">
        <div class="pcl"><span>${_esc(_t('reign'))}</span><b>${_esc(reignText)}</b></div>
        <div class="pcl"><span>${_esc(_t('life'))}</span><b>${_esc(lifeText)}</b></div>
        <div class="pcl"><span>${_esc(_t('connections'))}</span><b>${connCount}</b></div>
        <div class="pcl"><span>${_esc(_t('sources_word'))}</span><b>${srcCount}</b></div>
      </div>
      <div class="ptabs">
        <button class="ptab${p.bio ? '' : ' on'}" data-tab="overview"><svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm1 12H7V7h2v5zm0-7H7V3h2v2z"/></svg> ${_esc(_t('profile'))}</button>
        <button class="ptab${p.bio ? ' on' : ''}" data-tab="bio"><svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M2 1h9l3 3v11a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zm1 3h5v1H3V4zm0 3h8v1H3V7zm0 3h8v1H3v-1zm0 3h5v1H3v-1z"/></svg> ${_esc(_t('bio'))}</button>
        <button class="ptab" data-tab="offices"><svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M2 2h12v2H2zm0 4h12v2H2zm0 4h12v2H2z"/></svg> ${_esc(_t('offices'))}</button>
        <button class="ptab" data-tab="evidence"><svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm-1 12H3V3h10v10z"/></svg> ${_esc(_t('evidence'))}</button>
        <button class="ptab" data-tab="map"><svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C5.2 0 3 2.2 3 5c0 4 5 11 5 11s5-7 5-11c0-2.8-2.2-5-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg> ${_esc(_t('map'))}</button>
      </div>
      <div class="ptpanel${p.bio ? '' : ' on'}" data-panel="overview">
        <div class="pcs">
          <div class="sl">${_esc(_t('known_names'))}</div>
          <div class="pnl">${names.length ? names.map(n => `<button class="pn pn-b" data-q="${_esc(n)}">${_esc(n)}</button>`).join('') : `<span class="pn">${_esc(_t('unknown'))}</span>`}</div>
        </div>
        <div class="pcs">
          <div class="sl">${_esc(_t('known_by'))}</div>
          ${knownAsRows(p)}
        </div>
        ${p.titles?.length ? `<div class="pcs"><div class="sl">${_esc(_t('titles'))}</div><div class="pnl">${p.titles.map(title => `<button class="pn pn-b" data-q="${_esc(title)}">${_esc(title)}</button>`).join('')}</div></div>` : ''}
        <div class="pcs">
          <div class="sl">${_esc(_t('royal_links'))}</div>
          <div class="rli"><span class="pn">${_esc(statusLabel)}</span></div>
          <div class="rs">${_esc(royal.summary)}</div>
          ${royal.pathText ? `<div class="rs">${_esc(_t('path'))}: ${_esc(royal.pathText)}</div>` : ''}
        </div>
        <div class="pcs">
          <div class="sl">${_esc(_t('compare'))}</div>
          <div class="pnl">
            <button class="gb" onclick="setCmpA('${p.id}')">${_esc(_t('set_a'))}</button>
            <button class="gb" onclick="setCmpB('${p.id}')">${_esc(_t('set_b'))}</button>
            <button class="gb" onclick="armCmp('${p.id}')">${_esc(_t('compare_next'))}</button>
          </div>
        </div>
        ${factsPanelHtml(facts)}
      </div>
      <div class="ptpanel${p.bio ? ' on' : ''}" data-panel="bio">
        ${p.bio
          ? `<div class="bio-text">${p.bio.split('\n\n').map((para, i) => `<p${i === 0 ? ' class="bio-lead"' : ''}>${_esc(para)}</p>`).join('')}</div>`
          : `<p class="nt">${_esc(_t('no_bio'))}</p>`
        }
      </div>
      <div class="ptpanel" data-panel="offices">
        ${officePanel(p)}
      </div>
      <div class="ptpanel" data-panel="evidence">
        ${personEvidencePanel(p)}
      </div>
      <div class="ptpanel" data-panel="map">
        ${mapPanel(p)}
      </div>
    </section>
  `;
}

function srcH(refs: string[]): string {
  if (!refs || !refs.length) return `<div class="nt" style="color:var(--tx3)">${_esc(_t('no_sources'))}</div>`;
  const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
  const archiveLink = `<div class="nt" style="margin:4px 0 8px;color:var(--tx3)">${_esc(_t('local_archive'))}: <a href="docs/offline-research-archive.json" target="_blank" rel="noopener noreferrer">docs/offline-research-archive.json</a>${offline ? ` \u00b7 ${_esc(_t('external_links_offline_notice'))}` : ''}</div>`;
  const rows = refs.map(id => {
    const s = _sourceById.get(id);
    if (!s) return null;
    const title = _esc(s.title || s.url || '');
    const linkHtml = offline
      ? `<span>${title}</span>`
      : `<a href="${_esc(s.url || '')}" target="_blank" rel="noopener noreferrer">${title}</a>`;
    const note = s.notes ? `<div class="rs">${_esc(s.notes)}</div>` : '';
    return `<li class="ri"><div class="rlf"><div class="rn">${linkHtml} <span class="rt">${_esc(s.quality || '?')}</span> <span class="rt">${_esc(s.id)}</span></div><div class="rs">${_esc(s.publisher || '')}${s.access_date ? ' \u00b7 ' + _esc(s.access_date) : ''}</div>${note}</div></li>`;
  }).filter(Boolean) as string[];
  if (!rows.length) return `<div class="nt" style="color:var(--tx3)">${_esc(_t('no_sources'))}</div>`;
  const cut = rows.length > 4 ? 3 : rows.length;
  const lead = rows.slice(0, cut).join('');
  const tail = rows.slice(cut).join('');
  const more = rows.length - cut;
  return `<div class="sl">${_esc(_t('evidence'))}</div>${archiveLink}<ul class="rl">${lead}</ul>${tail ? `<details class="odt"><summary>${_esc(_t('show_more'))} ${more} ${_esc(more === 1 ? _t('more_source') : _t('more_sources'))}</summary><ul class="rl">${tail}</ul></details>` : ''}`;
}

function personLabelWithId(id: string): string {
  const p = _byId.get(id);
  if (!p) return id;
  return `${_personName(p)} (${id})`;
}

function edgeStepText(step: { s?: string; d?: string; t?: string } | null | undefined): string {
  if (!step?.s || !step?.d) return '';
  const rel = step.t || 'kin';
  return `${personLabelWithId(step.s)} \u2192 ${personLabelWithId(step.d)} [${relationTypeLabel(rel)}]`;
}

function derivedRuleLabel(rule: string): string {
  if (rule === 'shared-parent-sibling') return _t('inference_rule_shared_parent');
  if (rule === 'parent-of-parent-grandparent') return _t('inference_rule_parent_of_parent');
  if (rule === 'parent-sibling-aunt-uncle') return _t('inference_rule_parent_sibling');
  if (rule === 'children-of-siblings-cousin') return _t('inference_rule_children_of_siblings');
  return _t('inference_rule_derived');
}

function derivedInferenceDetail(e: EdgeRecord): InferenceDetail | null {
  const basis = (e.inference_basis || {}) as InferenceBasis;
  const sid = e.s;
  const did = e.d;
  if (e.inference_rule === 'shared-parent-sibling') {
    const parent = basis.shared_parent;
    return {
      ruleLabel: derivedRuleLabel(e.inference_rule),
      summary: parent
        ? `${personLabelWithId(sid)} and ${personLabelWithId(did)} are inferred as siblings because both are modeled as children of ${personLabelWithId(parent)}.`
        : `This sibling edge is derived from shared-parent logic in the current model.`,
      logic: [
        ...(basis.parent_edges || []).map(edgeStepText).filter(Boolean),
        `Rule application: two child edges with the same parent yield an inferred sibling edge between the children.`
      ],
      verification: [
        `Check whether primary or higher-grade secondary sources explicitly state sibling wording for this pair.`,
        `If one child is reassigned to a different parent, remove or revise this inferred edge.`
      ]
    };
  }

  if (e.inference_rule === 'parent-of-parent-grandparent') {
    const via = basis.via_parent;
    return {
      ruleLabel: derivedRuleLabel(e.inference_rule),
      summary: via
        ? `${personLabelWithId(sid)} is inferred as a grandparent-line relative of ${personLabelWithId(did)} through ${personLabelWithId(via)}.`
        : `This kin edge is derived by parent-of-parent traversal.`,
      logic: [
        ...(basis.parent_edges || []).map(edgeStepText).filter(Boolean),
        `Rule application: if A is parent of B and B is parent of C, then A is inferred as a grandparent-line kin of C.`
      ],
      verification: [
        `Verify whether sources provide an explicit grandparent or ancestor phrase for this exact pair.`,
        `Upgrade relation type if direct wording is found.`
      ]
    };
  }

  if (e.inference_rule === 'parent-sibling-aunt-uncle') {
    const viaParent = basis.via_parent;
    const viaSib = basis.via_parent_sibling;
    return {
      ruleLabel: derivedRuleLabel(e.inference_rule),
      summary: viaParent && viaSib
        ? `${personLabelWithId(sid)} is inferred as aunt/uncle-line kin of ${personLabelWithId(did)} via sibling relation with ${personLabelWithId(viaParent)}.`
        : `This kin edge is derived from parent + sibling composition.`,
      logic: [
        ...(basis.supporting_edges || []).map(edgeStepText).filter(Boolean),
        `Rule application: sibling(parent, X) + parent(parent, child) implies aunt/uncle-line kin(X, child).`
      ],
      verification: [
        `Confirm whether the sibling basis edge is itself direct or inferred.`,
        `Promote this edge only when direct aunt/uncle wording is found; otherwise keep inferred.`
      ]
    };
  }

  if (e.inference_rule === 'children-of-siblings-cousin') {
    const pair = basis.via_parent_siblings || [];
    return {
      ruleLabel: derivedRuleLabel(e.inference_rule),
      summary: pair.length === 2
        ? `${personLabelWithId(sid)} and ${personLabelWithId(did)} are inferred as cousin-line kin because their parents (${personLabelWithId(pair[0]!)}, ${personLabelWithId(pair[1]!)}) are modeled as siblings.`
        : `This kin edge is derived by children-of-siblings cousin logic.`,
      logic: [
        ...(basis.child_parent_edges || []).map(edgeStepText).filter(Boolean),
        edgeStepText(basis.parent_sibling_edge),
        `Rule application: children of sibling parents are inferred as cousins.`
      ].filter(Boolean),
      verification: [
        `Confirm parent assignments for both endpoints before treating this as stronger than inferred.`,
        `If either parent edge changes, recompute or remove this cousin inference.`
      ]
    };
  }

  return null;
}

function inferenceDetailForEdge(e: EdgeRecord): InferenceDetail | null {
  if (!e || e.c !== 'i') return null;
  const note = _getInferenceNote(e as unknown as Record<string, unknown>);
  if (note) {
    return {
      ruleLabel: _t('inference_rule_manual'),
      summary: note.summary || _t('inference_no_detail'),
      dossier: '',
      logic: note.logic || [],
      verification: note.verification || []
    };
  }
  if (_isDerivedInferenceEdge(e as unknown as Record<string, unknown>)) {
    const derived = derivedInferenceDetail(e);
    if (derived) return derived;
  }
  return {
    ruleLabel: _t('inference_rule_unknown'),
    summary: _t('inference_no_detail'),
    dossier: '',
    logic: [],
    verification: []
  };
}

function localDocHref(path: string | null | undefined): string {
  if (!path) return '';
  return String(path)
    .split('/')
    .map(seg => encodeURIComponent(seg))
    .join('/');
}

function inferencePanel(e: EdgeRecord): string {
  if (!e || e.c !== 'i') return '';
  const info = inferenceDetailForEdge(e);
  if (!info) return '';
  const eAsRecord = e as unknown as Record<string, unknown>;
  const dossierPath = info.dossier || _getInferenceDossierPath(eAsRecord);
  const dossierHref = localDocHref(dossierPath);
  const edgeKey = _inferenceEdgeKey(eAsRecord);
  const gradeChip = e.confidence_grade
    ? `<span class="rt">${_esc(_t('confidence_grade'))} ${_esc(e.confidence_grade)}</span>`
    : '';
  const trackerHref = 'docs/research-program/ledgers/inference-dossier-tracker.csv';
  const refs = (e.evidence_refs || [])
    .filter(id => _sourceById.has(id))
    .map(id => {
      const src = _sourceById.get(id);
      return `${src?.title || id} (${id})`;
    });
  const logic = (info.logic || []).filter(Boolean);
  const checks = (info.verification || []).filter(Boolean);
  const basisHtml = refs.length
    ? refs.map(row => `<span class="infp-tag">${_esc(row)}</span>`).join('')
    : '';
  return `
    <div class="pcs infp">
      <div class="infp-top">
        <div class="sl">${_esc(_t('inference_logic'))}</div>
        <div class="infp-meta">
          <span class="rt rt-i">${_esc(_t('inferred'))}</span>
          ${gradeChip}
          <span class="rt">${_esc(info.ruleLabel)}</span>
        </div>
      </div>
      <div class="infp-summary">${_esc(info.summary)}</div>
      <div class="infp-actions">
        ${dossierHref ? `<a class="doc-link doc-pill" href="${_esc(dossierHref)}" target="_blank" rel="noopener noreferrer">${_esc(_t('inference_open_dossier'))}</a>` : `<span class="infp-missing">${_esc(_t('inference_dossier_unavailable'))}</span>`}
        <a class="doc-link doc-pill" href="docs/confidence-grade-explainer.md" target="_blank" rel="noopener noreferrer">${_esc(_t('inference_open_explainer'))}</a>
        <a class="doc-link doc-pill" href="${trackerHref}" target="_blank" rel="noopener noreferrer">${_esc(_t('inference_open_tracker'))}</a>
      </div>
      <div class="infp-path"><span>${_esc(_t('inference_edge_key'))}</span><code>${_esc(edgeKey || '-')}</code></div>
      ${dossierPath ? `<div class="infp-path"><span>${_esc(_t('inference_dossier_path'))}</span><code>${_esc(dossierPath)}</code></div>` : ''}
      ${logic.length ? `<details class="odt infp-det" open><summary>${_esc(_t('inference_logic_steps'))}</summary><ul class="pfl">${logic.map(row => `<li>${_esc(row)}</li>`).join('')}</ul></details>` : ''}
      ${checks.length ? `<details class="odt infp-det"><summary>${_esc(_t('inference_verification_checklist'))}</summary><ul class="pfl">${checks.map(row => `<li>${_esc(row)}</li>`).join('')}</ul></details>` : ''}
      ${refs.length ? `<div class="infp-bases"><div class="sl">${_esc(_t('inference_bases'))}</div><div class="infp-tags">${basisHtml}</div></div>` : `<div class="rs">${_esc(_t('inference_no_bases'))}</div>`}
    </div>
  `;
}

function edgeEvidencePanel(e: EdgeRecord, s: PersonNode, targetPerson: PersonNode): string {
  const refs = sourceRowsFromRefs(e.evidence_refs || []);
  const uncertainty = e.c === 'c'
    ? _t('link_confirmed_text')
    : e.c === 'i'
      ? _t('link_inferred_text')
      : _t('link_uncertain_text');
  const lead = refs.slice(0, 3).map(r => `<li>${_esc(r.title)} <span class="rt">${_esc(r.quality)}</span></li>`).join('');
  const tail = refs.slice(3).map(r => `<li>${_esc(r.title)} <span class="rt">${_esc(r.quality)}</span></li>`).join('');
  const claim = e.claim_type ? `${_t('claim_type')}: ${e.claim_type}.` : '';
  const band = e.confidence_grade ? `${_t('confidence_grade')}: ${e.confidence_grade}.` : '';
  return `
    <div class="pcs">
      <div class="sl">${_esc(_t('evidence_narrative'))}</div>
      <div class="nt">${_esc(_personName(s))} ${_esc(_t('and_word'))} ${_esc(_personName(targetPerson))} ${_esc(_t('are_connected_as'))} ${_esc(relationTypeLabel(e.t || 'kin'))}. ${uncertainty}</div>
      <div class="rs">${_esc(claim)} ${_esc(band)}</div>
      <div class="rs">${_esc(_t('edge_sources_count'))}: ${refs.length}</div>
    </div>
    <div class="pcs">
      <div class="sl">${_esc(_t('edge_source_stack'))}</div>
      ${lead ? `<ul class="pfl">${lead}</ul>` : `<div class="nt" style="color:var(--tx3)">${_esc(_t('no_edge_sources'))}</div>`}
      ${tail ? `<details class="odt"><summary>${_esc(_t('show_more'))} ${refs.length - 3} ${_esc(refs.length - 3 === 1 ? _t('more_source') : _t('more_sources'))}</summary><ul class="pfl">${tail}</ul></details>` : ''}
    </div>
  `;
}

function relationCard(link: LinkDatum): string {
  const sid = typeof link.source === 'object' ? link.source.id : link.source;
  const tid = typeof link.target === 'object' ? link.target.id : link.target;
  const s = _byId.get(sid);
  const targetPerson = _byId.get(tid);
  if (!s || !targetPerson) return '';
  const e = link._e || {} as EdgeRecord;
  const c = e.c || 'u';
  const confClass = c === 'i' ? 'rt-i' : c === 'u' ? 'rt-u' : '';
  const confTag = confClass ? `<span class="rt ${confClass}">${confidenceLabel(c)}</span>` : `<span class="rt">${_esc(_t('confirmed'))}</span>`;
  return `
    <section class="pc">
      <div class="pch">
        <div class="pcn">${_esc(_t('relationship'))}</div>
        <div class="pcd">${_esc(relationTypeLabel(e.t || 'kin'))}</div>
      </div>
      <div class="pcg">
        <div class="pcl"><span>${_esc(_t('edge_type'))}</span><b>${_esc(relationTypeLabel(e.t || 'kin'))}</b></div>
        <div class="pcl"><span>${_esc(_t('edge_confidence'))}</span><b>${_esc(confidenceLabel(c))}${e.confidence_grade ? ` (${_esc(_t('confidence_grade'))} ${_esc(e.confidence_grade)})` : ''}</b></div>
        <div class="pcl"><span>${_esc(_t('edge_source'))}</span><b>${_esc(_personName(s))}</b></div>
        <div class="pcl"><span>${_esc(_t('edge_target'))}</span><b>${_esc(_personName(targetPerson))}</b></div>
      </div>
      ${e.l ? `<div class="pcs"><div class="sl">${_esc(_t('edge_label'))}</div><div class="nt">${_esc(e.l)}</div></div>` : ''}
      ${e.event_context ? `<div class="pcs"><div class="sl">${_esc(_t('edge_context'))}</div><div class="nt">${_esc(e.event_context)}</div></div>` : ''}
      ${inferencePanel(e)}
      ${edgeEvidencePanel(e, s, targetPerson)}
      <div class="pcs">
        <div class="sl">${_esc(_t('explore_endpoints'))}</div>
        <div class="pnl">
          <button class="gb" onclick="goF('${s.id}')">${_esc(_personName(s))}</button>
          <button class="gb" onclick="goF('${targetPerson.id}')">${_esc(_personName(targetPerson))}</button>
          ${confTag}
        </div>
      </div>
    </section>
  `;
}

// ---------------------------------------------------------------------------
// DOM interaction helpers
// ---------------------------------------------------------------------------

function bindQueryButtons(root: Element | null): void {
  if (!root) return;
  root.querySelectorAll('[data-q]').forEach(el => {
    el.addEventListener('click', () => {
      const q = el.getAttribute('data-q');
      if (!q) return;
      const input = document.getElementById('si') as HTMLInputElement | null;
      if (!input) return;
      input.value = q;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
    });
  });
}

function bindProfileTabs(root: Element | null): void {
  if (!root) return;
  root.querySelectorAll('[data-person-card]').forEach(card => {
    const tabs = card.querySelectorAll('.ptab');
    const panels = card.querySelectorAll('.ptpanel');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = (tab as HTMLElement).dataset.tab;
        tabs.forEach(tt => tt.classList.toggle('on', tt === tab));
        panels.forEach(p => p.classList.toggle('on', (p as HTMLElement).dataset.panel === target));
      });
    });
  });
  bindQueryButtons(root);
}

function shouldUseBottomSheet(): boolean {
  return window.innerWidth <= 1024 || document.body.classList.contains('sidebar-collapsed');
}

const _fadePending = new WeakMap<HTMLElement, number>();

function crossFadeContent(el: HTMLElement | null, newHtml: string, callback?: () => void): void {
  if (!el) return;

  // Cancel any in-flight fade on this element
  const prev = _fadePending.get(el);
  if (prev) {
    clearTimeout(prev);
    _fadePending.delete(el);
  }

  const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || prev) {
    // Skip animation if reduced-motion OR if we interrupted a pending fade
    el.style.transition = '';
    el.style.opacity = '1';
    el.innerHTML = newHtml;
    if (callback) callback();
    return;
  }
  el.style.transition = 'opacity 120ms ease-out';
  el.style.opacity = '0';
  const tid = window.setTimeout(() => {
    _fadePending.delete(el);
    el.innerHTML = newHtml;
    if (callback) callback();
    el.style.opacity = '1';
    setTimeout(() => { el.style.transition = ''; }, 140);
  }, 130);
  _fadePending.set(el, tid);
}

function officeSourceRows(refs: string[]): Array<{ id: string; title: string; quality: string }> {
  return uniq((refs || []).filter(id => _sourceById.has(id)))
    .map(id => {
      const s = _sourceById.get(id);
      return {
        id,
        title: s?.title || id,
        quality: s?.quality || '?'
      };
    })
    .sort((a, b) => sourceQualityWeight(b.quality) - sourceQualityWeight(a.quality) || a.title.localeCompare(b.title));
}

function officeSourceBlock(refs: string[] | undefined): string {
  const rows = officeSourceRows(refs || []);
  if (!rows.length) return '';
  const lead = rows.slice(0, 4)
    .map(r => `<div class="srcrow"><div class="srcn">${_esc(r.title)}</div><span class="rt">${_esc(r.quality)}</span><span class="rt">${_esc(r.id)}</span></div>`)
    .join('');
  const more = rows.length - 4;
  return `
    <div class="srcb">
      <div class="sl">${_esc(_t('sources_label'))}</div>
      ${lead}
      ${more > 0 ? `<div class="rs">+${more} ${_esc(more === 1 ? _t('more_source') : _t('more_sources'))}</div>` : ''}
    </div>
  `;
}

function institutionsOverviewHtml(): string {
  const rows = _officeById.size
    ? [..._officeById.values()].map(o => {
      const aliases = (o.alt_names || []).map(x => `<button class="pn pn-b" data-q="${_esc(x)}">${_esc(x)}</button>`).join('');
      const srcBlock = officeSourceBlock(o.source_refs);
      return `
        <li class="ri">
          <div class="rlf">
            <div class="rn"><button class="pn pn-b" data-q="${_esc(o.name)}">${_esc(o.name)}</button> <span class="rt">${_esc(o.kind || _t('office_generic'))}</span></div>
            <div class="rs">${_esc(o.summary || _t('role_summary_unavailable'))}</div>
            ${aliases ? `<div class="pnl" style="margin-top:4px">${aliases}</div>` : ''}
            ${srcBlock}
          </div>
        </li>
      `;
    }).join('')
    : `<div class="nt" style="color:var(--tx3)">${_esc(_t('no_institutions_loaded'))}</div>`;
  return `
    <section class="pc">
      <div class="pch">
        <div class="pcn">${_esc(_t('institutions'))}</div>
        <div class="pcd">${_esc(_t('office_title_glossary'))}</div>
      </div>
      <div class="pcs">
        <div class="sl">${_esc(_t('office_catalog'))}</div>
        <ul class="rl">${rows}</ul>
      </div>
    </section>
  `;
}

function institutionsTimelineHtml(): string {
  const rows = (_officeTimeline || []).map(period => {
    const officeNames = (period.offices || [])
      .map(id => _officeById.get(id)?.name || id)
      .map(name => `<button class="pn pn-b" data-q="${_esc(name)}">${_esc(name)}</button>`)
      .join('');
    const srcBlock = officeSourceBlock(period.source_refs);
    return `
      <li class="ri">
        <div class="rlf">
          <div class="rn">${_esc(period.label || _t('period_word'))}</div>
          <div class="rs">${_esc(period.period || '')}</div>
          <div class="rs">${_esc(period.summary || '')}</div>
          ${officeNames ? `<div class="pnl" style="margin-top:4px">${officeNames}</div>` : ''}
          ${srcBlock}
        </div>
      </li>
    `;
  }).join('');
  return `
    <section class="pc">
      <div class="pch">
        <div class="pcn">${_esc(_t('institution_timeline'))}</div>
        <div class="pcd">${_officeTimeline.length} ${_esc(_t('periods_word'))}</div>
      </div>
      <div class="pcs">
        <div class="sl">${_esc(_t('periodized_view'))}</div>
        <ul class="rl">${rows}</ul>
      </div>
    </section>
  `;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function rlH(title: string, items: RelNeighbor[]): string {
  if (!items.length) return '';
  return `<div class="sl">${_esc(title)}</div><ul class="rl">${items.map(it => {
    const p = _byId.get(it.id);
    if (!p) return '';
    const tag = it.c && it.c !== 'c' ? `<span class="rt ${it.c === 'i' ? 'rt-i' : 'rt-u'}">${it.c === 'i' ? _t('inferred') : _t('uncertain')}</span>` : '';
    const srcMeta = it.srcCount
      ? ` \u00b7 ${it.srcCount} ${it.srcCount === 1 ? _t('source_word') : _t('sources_word')}${it.cg ? ` \u00b7 ${_t('grade_word')} ${it.cg}` : ''}`
      : '';
    return `<li class="ri"><div class="rlf"><div class="rn">${p.g === 'F' ? '\u2640 ' : ''}${_esc(_personName(p))} ${tag}</div><div class="rs">${p.re ? _esc(_fR(p.re)) : ''} \u00b7 ${_esc(p.dy || '?')}${p.n ? ` \u00b7 ${p.n.map(x => '#' + x).join(', ')}` : ''}${srcMeta}</div></div><button class="gb" onclick="goF('${p.id}')">${_esc(_t('go'))}</button></li>`;
  }).join('')}</ul>`;
}

export function showLinkDetail(link: LinkDatum): void {
  _currentPersonId = null;
  if (!link) return;
  const sid = typeof link.source === 'object' ? link.source.id : link.source;
  const tid = typeof link.target === 'object' ? link.target.id : link.target;
  const s = _byId.get(sid);
  const targetPerson = _byId.get(tid);
  if (!s || !targetPerson) return;
  const e = link._e || {} as EdgeRecord;
  const m = [
    `<span class="bg">${_esc(relationTypeLabel(e.t || 'kin'))}</span>`,
    `<span class="bg">${_esc(confidenceLabel(e.c || 'u'))}</span>`,
    e.confidence_grade ? `<span class="bg">${_esc(_t('confidence_grade'))} ${_esc(e.confidence_grade)}</span>` : '',
    e.claim_type ? `<span class="bg">${_esc(e.claim_type)}</span>` : ''
  ].join('');
  const refs = uniq((e.evidence_refs || []).filter(id => _sourceById.has(id)));
  const card = relationCard(link);
  const cmp = _compareSummaryHtml();
  const evi = srcH(refs);
  const relRows = `
    <div class="sl">${_esc(_t('connected_people'))}</div>
    <ul class="rl">
      <li class="ri"><div class="rlf"><div class="rn">${_esc(_personName(s))}</div><div class="rs">${_esc(_fR(s.re || []))} \u00b7 ${_esc(s.dy || '?')}</div></div><button class="gb" onclick="goF('${s.id}')">${_esc(_t('go'))}</button></li>
      <li class="ri"><div class="rlf"><div class="rn">${_esc(_personName(targetPerson))}</div><div class="rs">${_esc(_fR(targetPerson.re || []))} \u00b7 ${_esc(targetPerson.dy || '?')}</div></div><button class="gb" onclick="goF('${targetPerson.id}')">${_esc(_t('go'))}</button></li>
    </ul>
  `;
  const sT = document.getElementById('sT');
  if (sT) sT.textContent = _t('relationship');
  document.getElementById('vmi')?.classList.remove('on');
  document.getElementById('vmi')?.setAttribute('aria-pressed', 'false');
  sT?.classList.remove('emp');
  const sM = document.getElementById('sM');
  if (sM) sM.innerHTML = m;
  const sN = document.getElementById('sN');
  if (sN) sN.innerHTML = `${card}${cmp}${evi}`;
  const sR = document.getElementById('sR');
  if (sR) sR.innerHTML = relRows;
  _recordEdge(link);
  window.dispatchEvent(new CustomEvent('selection-changed', { detail: { type: 'edge', s: sid, d: tid, rel: e.t || 'kin' } }));
  if (shouldUseBottomSheet()) {
    const bT = document.getElementById('bT');
    if (bT) bT.textContent = _t('relationship');
    const bB = document.getElementById('bB');
    if (bB) bB.innerHTML = `<div class="mr">${m}</div>${card}${cmp}${evi}<div class="dv"></div>${relRows}`;
    _oS();
  }
}

export function showD(id: string): void {
  const p = _byId.get(id);
  if (!p) return;
  const samePerson = _currentPersonId === id;
  _currentPersonId = id;
  _handlePersonViewed(id);
  const dyC = `var(--dy-${(p.dy || 'unknown').toLowerCase()})`;
  let m = `<span class="bg"><span class="bdd" style="background:${dyC}"></span>${_esc(p.dy || _t('unknown'))}</span>`;
  if (p.re) m += `<span class="bg">${_esc(_fR(p.re))}</span>`;
  if (p.n) m += `<span class="bg">${p.n.map(x => '#' + x).join(', ')}</span>`;
  if (p.g === 'F') m += '<span class="bg">\u2640</span>';
  if (p.regnal_names?.length) m += `<span class="bg">${_esc(_t('regnal'))} ${_esc(p.regnal_names[0]!)}</span>`;
  const refs = collectSourceRefs(p);
  const card = profileCard(p);
  const cmp = _compareSummaryHtml();
  const evi = srcH(refs);
  const rels = rlH(_t('parents'), _parOf(id)) + rlH(_t('children'), _chOf(id)) + rlH(_t('siblings'), _gNb(id, 'sibling')) + rlH(_t('spouses'), _gNb(id, 'spouse')) + rlH(_t('other_kin'), _gNb(id, 'kin'));
  const sT = document.getElementById('sT');
  if (sT) sT.textContent = (p.g === 'F' ? '\u2640 ' : '') + _personName(p);
  document.getElementById('vmi')?.classList.remove('on');
  document.getElementById('vmi')?.setAttribute('aria-pressed', 'false');
  sT?.classList.remove('emp');
  const sM = document.getElementById('sM');
  if (sM) sM.innerHTML = m;
  if (samePerson) {
    // Same person: skip cross-fade, just replace content in place
    const sN = document.getElementById('sN');
    if (sN) { sN.innerHTML = `${card}${cmp}${evi}`; bindProfileTabs(sN); }
    const sR = document.getElementById('sR');
    if (sR) sR.innerHTML = rels || `<div class="nt" style="color:var(--tx3)">${_esc(_t('no_connections'))}</div>`;
  } else {
    crossFadeContent(document.getElementById('sN'), `${card}${cmp}${evi}`, () => {
      bindProfileTabs(document.getElementById('sN'));
    });
    crossFadeContent(document.getElementById('sR'), rels || `<div class="nt" style="color:var(--tx3)">${_esc(_t('no_connections'))}</div>`);
  }
  _recordPerson(id);
  window.dispatchEvent(new CustomEvent('selection-changed', { detail: { type: 'person', id } }));
  if (shouldUseBottomSheet()) {
    const bT = document.getElementById('bT');
    if (bT) bT.textContent = (p.g === 'F' ? '\u2640 ' : '') + _personName(p);
    const bB = document.getElementById('bB');
    if (bB) {
      bB.innerHTML = `<div class="mr">${m}</div>${card}${cmp}${evi}<div class="dv"></div>${rels}`;
      bindProfileTabs(bB);
    }
    _oS();
  }
}

export function showInstitutionsPane(): void {
  _currentPersonId = null;
  document.getElementById('vmi')?.classList.add('on');
  document.getElementById('vmi')?.setAttribute('aria-pressed', 'true');
  const sT = document.getElementById('sT');
  if (sT) {
    sT.textContent = _t('institutions');
    sT.classList.remove('emp');
  }
  const sM = document.getElementById('sM');
  if (sM) sM.innerHTML = `<span class="bg">${_officeById.size} ${_esc(_t('offices_word'))}</span><span class="bg">${_officeTimeline.length} ${_esc(_t('periods_word'))}</span>`;
  const nHtml = institutionsOverviewHtml();
  const rHtml = institutionsTimelineHtml();
  const sN = document.getElementById('sN');
  if (sN) sN.innerHTML = nHtml;
  const sR = document.getElementById('sR');
  if (sR) sR.innerHTML = rHtml;
  bindQueryButtons(sN);
  bindQueryButtons(sR);
  window.dispatchEvent(new CustomEvent('selection-changed', { detail: { type: 'institutions' } }));
  if (shouldUseBottomSheet()) {
    const bT = document.getElementById('bT');
    if (bT) bT.textContent = _t('institutions');
    const bB = document.getElementById('bB');
    if (bB) {
      bB.innerHTML = `${nHtml}<div class="dv"></div>${rHtml}`;
      bindQueryButtons(bB);
    }
    _oS();
  }
}

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------

export interface SidebarDeps {
  byId: Map<string, PersonNode>;
  people: PersonNode[];
  edges: EdgeRecord[];
  sourceById: Map<string, SourceEntry>;
  officeById: Map<string, OfficeCatalogEntry>;
  officeTimeline: OfficeTimelinePeriod[];
  fR: (re: Array<[number, number?]>) => string;
  esc: (s: string) => string;
  personName: (p: PersonNode | string, byId?: Map<string, PersonNode>) => string;
  relationLabel: (t: string) => string;
  t: (key: string) => string;
  getLang: () => string;
  gNb: (id: string, type: string) => RelNeighbor[];
  parOf: (id: string) => RelNeighbor[];
  chOf: (id: string) => RelNeighbor[];
  recordPerson: (id: string) => void;
  recordEdge: (link: LinkDatum) => void;
  compareSummaryHtml: () => string;
  handlePersonViewed: (id: string) => void;
  oS: (prefer?: string) => void;
  resolvePlace: (text: string | undefined | null) => PlaceAnchor | null;
  extractPlaceMentions: (text: string) => PlaceAnchor[];
  placeLabelForLang: (anchor: PlaceAnchor, lang: string) => string;
  getInferenceNote: (edge: Record<string, unknown>) => { summary?: string; dossier?: string; logic?: string[]; verification?: string[] } | null;
  getInferenceDossierPath: (edge: Record<string, unknown>) => string | null;
  inferenceEdgeKey: (edge: Record<string, unknown>) => string;
  isDerivedInferenceEdge: (edge: Record<string, unknown>) => boolean;
}

export function initSidebar(deps: SidebarDeps): void {
  _byId = deps.byId;
  _people = deps.people;
  _edges = deps.edges;
  _sourceById = deps.sourceById;
  _officeById = deps.officeById;
  _officeTimeline = deps.officeTimeline;
  _fR = deps.fR;
  _esc = deps.esc;
  _personName = deps.personName;
  _relationLabel = deps.relationLabel;
  _t = deps.t;
  _getLang = deps.getLang;
  _gNb = deps.gNb;
  _parOf = deps.parOf;
  _chOf = deps.chOf;
  _recordPerson = deps.recordPerson;
  _recordEdge = deps.recordEdge;
  _compareSummaryHtml = deps.compareSummaryHtml;
  _handlePersonViewed = deps.handlePersonViewed;
  _oS = deps.oS;
  _resolvePlace = deps.resolvePlace;
  _extractPlaceMentions = deps.extractPlaceMentions;
  _placeLabelForLang = deps.placeLabelForLang;
  _getInferenceNote = deps.getInferenceNote;
  _getInferenceDossierPath = deps.getInferenceDossierPath;
  _inferenceEdgeKey = deps.inferenceEdgeKey;
  _isDerivedInferenceEdge = deps.isDerivedInferenceEdge;

  // Pre-compute royal adjacency
  RULER_IDS = new Set(_people.filter(p => (p.n || []).length > 0).map(p => p.id));
  ROYAL_ADJ = new Map(_people.map(p => [p.id, [] as RoyalAdj[]]));
  _edges.forEach(e => {
    ROYAL_ADJ.get(e.s)?.push({ to: e.d, t: e.t, c: e.c, evidence_refs: e.evidence_refs || [] });
    ROYAL_ADJ.get(e.d)?.push({ to: e.s, t: e.t, c: e.c, evidence_refs: e.evidence_refs || [] });
  });
}

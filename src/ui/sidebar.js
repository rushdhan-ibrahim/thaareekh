import { byId, people, edges } from '../data/sovereigns.merge.js';
import { sourceById } from '../data/sources.js';
import { officeById, officeTimeline } from '../data/offices.js';
import { fR, esc } from '../utils/format.js';
import { gNb, parOf, chOf } from '../graph/relationships.js';
import { oS } from './modal.js';
import { recordPerson, recordEdge } from './history.js';
import { compareSummaryHtml, handlePersonViewed } from './compare.js';
import { extractPlaceMentions, placeLabelForLang, resolvePlace } from '../data/geo.js';
import { getLang, personName, relationLabel, t } from './i18n.js';
import { getInferenceNote, getInferenceDossierPath, inferenceEdgeKey, isDerivedInferenceEdge } from '../data/inference-notes.js';

const RULER_IDS = new Set(people.filter(p => (p.n || []).length > 0).map(p => p.id));
const ROYAL_ADJ = new Map(people.map(p => [p.id, []]));
edges.forEach(e => {
  ROYAL_ADJ.get(e.s)?.push({ to: e.d, t: e.t, c: e.c, evidence_refs: e.evidence_refs || [] });
  ROYAL_ADJ.get(e.d)?.push({ to: e.s, t: e.t, c: e.c, evidence_refs: e.evidence_refs || [] });
});

export function rlH(title, items) {
  if (!items.length) return '';
  return `<div class="sl">${esc(title)}</div><ul class="rl">${items.map(it => {
    const p = byId.get(it.id);
    if (!p) return '';
    const tag = it.c && it.c !== 'c' ? `<span class="rt ${it.c === 'i' ? 'rt-i' : 'rt-u'}">${it.c === 'i' ? t('inferred') : t('uncertain')}</span>` : '';
    const srcMeta = it.srcCount
      ? ` \u00b7 ${it.srcCount} ${it.srcCount === 1 ? t('source_word') : t('sources_word')}${it.cg ? ` \u00b7 ${t('grade_word')} ${it.cg}` : ''}`
      : '';
    return `<li class="ri"><div class="rlf"><div class="rn">${p.g === 'F' ? '\u2640 ' : ''}${esc(personName(p))} ${tag}</div><div class="rs">${p.re ? esc(fR(p.re)) : ''} \u00b7 ${esc(p.dy || '?')}${p.n ? ` \u00b7 ${p.n.map(x => '#' + x).join(', ')}` : ''}${srcMeta}</div></div><button class="gb" onclick="goF('${p.id}')">${esc(t('go'))}</button></li>`;
  }).join('')}</ul>`;
}

function uniq(arr) {
  return [...new Set((arr || []).filter(Boolean))];
}

function estLife(p) {
  const yrs = (p.re || []).flat();
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

function confidenceLabel(c) {
  if (c === 'c') return t('confirmed');
  if (c === 'i') return t('inferred');
  return t('uncertain');
}

function confidenceBadge(c) {
  if (!c || c === 'c') return '';
  const cls = c === 'i' ? 'rt-i' : 'rt-u';
  return `<span class="rt ${cls}">${confidenceLabel(c)}</span>`;
}

function pluralLabel(count, singularKey, pluralKey) {
  return count === 1 ? t(singularKey) : t(pluralKey);
}

function relationTypeShortLabel(type) {
  if (type === 'parent') return t('edge_parent');
  if (type === 'sibling') return t('edge_sibling');
  if (type === 'spouse') return t('edge_spouse');
  return t('edge_kin');
}

function sourceQualityWeight(q) {
  if (q === 'A') return 4;
  if (q === 'B') return 3;
  if (q === 'C') return 2;
  if (q === 'D') return 1;
  return 0;
}

function sourceRowsFromRefs(refs) {
  return uniq(refs)
    .filter(id => sourceById.has(id))
    .map(id => {
      const src = sourceById.get(id);
      return {
        id,
        title: src?.title || src?.url || id,
        quality: src?.quality || '?',
        publisher: src?.publisher || ''
      };
    })
    .sort((a, b) => sourceQualityWeight(b.quality) - sourceQualityWeight(a.quality) || a.title.localeCompare(b.title));
}

function factsPanelHtml(facts) {
  if (!facts.length) return '';
  const lead = facts.slice(0, 3).map(f => `<li>${esc(f)}</li>`).join('');
  const tail = facts.slice(3).map(f => `<li>${esc(f)}</li>`).join('');
  const more = facts.length - 3;
  return `
    <div class="pcs">
      <div class="sl">${esc(t('interesting_facts'))}</div>
      <ul class="pfl">${lead}</ul>
      ${tail ? `<details class="odt"><summary>${esc(t('show_more'))} ${more} ${esc(more === 1 ? t('more_fact') : t('more_facts'))}</summary><ul class="pfl">${tail}</ul></details>` : ''}
    </div>
  `;
}

function personEvidencePanel(p) {
  const relEdges = edges.filter(e => e.s === p.id || e.d === p.id);
  const conf = { c: 0, i: 0, u: 0 };
  const rel = { parent: 0, sibling: 0, spouse: 0, kin: 0 };
  relEdges.forEach(e => {
    if (conf[e.c] != null) conf[e.c] += 1;
    if (rel[e.t] != null) rel[e.t] += 1;
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
      const other = byId.get(otherId);
      return `<li>${esc(relationTypeLabel(e.t))} \u00b7 ${esc(personName(other || otherId))} ${confidenceBadge(e.c)}</li>`;
    })
    .join('');
  const leadSources = sourceRows.slice(0, 3).map(s => `<li>${esc(s.title)} <span class="rt">${esc(s.quality)}</span></li>`).join('');
  const tailSources = sourceRows.slice(3).map(s => `<li>${esc(s.title)} <span class="rt">${esc(s.quality)}</span></li>`).join('');
  return `
    <div class="pcs">
      <div class="sl">${esc(t('evidence_narrative'))}</div>
      <div class="nt">${esc(t('profile_evidence_basis'))} ${sourceRows.length} ${esc(sourceWord)} ${esc(t('and_word'))} ${relEdges.length} ${esc(relWord)}.</div>
      <div class="rs">${esc(t('confidence_mix'))} \u00b7 ${esc(t('confirmed'))}: ${conf.c} \u00b7 ${esc(t('inferred'))}: ${conf.i} \u00b7 ${esc(t('uncertain'))}: ${conf.u}</div>
      <div class="rs">${esc(t('source_strength_label'))} \u00b7 A/B ${esc(t('grade_word'))} ${esc(t('sources_word'))}: ${strong}${sourceRows.length ? ` ${esc(t('of_word'))} ${sourceRows.length}` : ''}</div>
      ${relSummary ? `<div class="rs">${esc(t('relation_distribution_label'))} \u00b7 ${esc(relSummary)}</div>` : `<div class="rs">${esc(t('no_modeled_relation_links'))}</div>`}
    </div>
    <div class="pcs">
      <div class="sl">${esc(t('key_sources'))}</div>
      ${leadSources ? `<ul class="pfl">${leadSources}</ul>` : `<div class="nt" style="color:var(--tx3)">${esc(t('no_sources'))}</div>`}
      ${tailSources ? `<details class="odt"><summary>${esc(t('show_more'))} ${sourceRows.length - 3} ${esc(sourceRows.length - 3 === 1 ? t('more_source') : t('more_sources'))}</summary><ul class="pfl">${tailSources}</ul></details>` : ''}
    </div>
    <div class="pcs">
      <div class="sl">${esc(t('uncertainty_watchlist'))}</div>
      ${uncertain ? `<ul class="pfl">${uncertain}</ul>` : `<div class="nt" style="color:var(--tx3)">${esc(t('no_inferred_uncertain_links'))}</div>`}
    </div>
  `;
}

function mapPanel(p) {
  const lang = getLang();
  const birth = resolvePlace(p.pb);
  const death = resolvePlace(p.pd);
  const edgeContext = edges
    .filter(e => e.s === p.id || e.d === p.id)
    .map(e => `${e.event_context || ''} ${e.l || ''}`)
    .join(' ');
  const officeText = (p.offices_held || []).map(o => `${o.label || ''} ${o.note || ''}`).join(' ');
  const contextText = [p.no || '', ...(p.facts || []), officeText, edgeContext].join(' ');
  const context = extractPlaceMentions(contextText);
  const points = new Map();

  const pushPoint = (anchor, role) => {
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

  const routes = [];
  if (birth && death && birth.id !== death.id) routes.push({ from: birth, to: death, kind: 'life' });
  context.forEach(anchor => {
    if (!birth || anchor.id === birth.id) return;
    routes.push({ from: birth, to: anchor, kind: 'ctx' });
  });
  const routeDedup = new Set();
  const routeRows = routes.filter(r => {
    const key = `${r.from.id}|${r.to.id}|${r.kind}`;
    if (routeDedup.has(key)) return false;
    routeDedup.add(key);
    return true;
  }).slice(0, 6);

  const pointRows = [...points.values()];
  const mapSvg = `
    <div class="mvw">
      <svg class="mv" viewBox="0 0 420 240" aria-label="${esc(t('map_context'))}">
        <path class="mv-chain" d="M214 14 C190 42 250 70 218 100 C182 130 244 160 214 190 C190 214 226 226 214 236" />
        ${routeRows.map(r => `<line class="mv-route ${r.kind}" x1="${r.from.x}" y1="${r.from.y}" x2="${r.to.x}" y2="${r.to.y}" />`).join('')}
        ${pointRows.map(({ anchor, role }) => {
          let cls = 'ctx';
          if (role.has('birth')) cls = 'birth';
          else if (role.has('death')) cls = 'death';
          const lbl = placeLabelForLang(anchor, lang);
          return `<g><circle class="mv-dot ${cls}" cx="${anchor.x}" cy="${anchor.y}" r="4.3"/><text class="mv-lbl" x="${anchor.x + 6}" y="${anchor.y - 6}">${esc(lbl)}</text></g>`;
        }).join('')}
      </svg>
    </div>`;

  const birthRow = birth ? esc(placeLabelForLang(birth, lang)) : esc(t('unknown'));
  const deathRow = death ? esc(placeLabelForLang(death, lang)) : esc(t('unknown'));
  const contextRows = context
    .filter(a => (!birth || a.id !== birth.id) && (!death || a.id !== death.id))
    .slice(0, 6)
    .map(a => `<span class="pn">${esc(placeLabelForLang(a, lang))}</span>`)
    .join('');
  const routeHints = routeRows
    .map(r => `${placeLabelForLang(r.from, lang)} \u2192 ${placeLabelForLang(r.to, lang)}`)
    .join(' \u00b7 ');

  return `
    <div class="pcs">
      <div class="sl">${esc(t('map_context'))}</div>
      ${mapSvg}
      <div class="rs">${esc(t('map_birth'))}: ${birthRow}</div>
      <div class="rs">${esc(t('map_death'))}: ${deathRow}</div>
      <div class="rs">${esc(t('map_context_nodes'))}: ${contextRows || `<span class="pn">${esc(t('unknown'))}</span>`}</div>
      ${routeHints ? `<div class="rs">${esc(t('map_routes'))}: ${esc(routeHints)}</div>` : ''}
    </div>
  `;
}

function periodLabel(start, end) {
  if (start == null && end == null) return t('period_unknown');
  if (start != null && end == null) return `${start}\u2013`;
  if (start == null && end != null) return `\u2013${end}`;
  return start === end ? String(start) : `${start}\u2013${end}`;
}

function rankEdge(a, b) {
  const tRank = t => (t === 'parent' ? 0 : t === 'sibling' ? 1 : t === 'kin' ? 2 : 3);
  const cRank = c => (c === 'c' ? 0 : c === 'i' ? 1 : 2);
  return tRank(a.t) - tRank(b.t) || cRank(a.c) - cRank(b.c);
}

function findRoyalPath(start, maxDepth = 8) {
  if (RULER_IDS.has(start)) return { ids: [start], hops: [] };
  const q = [start];
  const seen = new Set([start]);
  const prev = new Map();
  const depth = new Map([[start, 0]]);

  while (q.length) {
    const cur = q.shift();
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
        const hops = [];
        let ptr = next.to;
        while (ptr !== start) {
          const step = prev.get(ptr);
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

function royalLinkInfo(p) {
  if (p.royal_link?.status && p.royal_link?.summary) {
    let summary = p.royal_link.summary;
    if (getLang() === 'dv') {
      if (p.royal_link.status === 'sovereign') summary = t('royal_summary_sovereign');
      else if (p.royal_link.status === 'none') summary = t('royal_summary_none');
      else if (p.royal_link.status === 'descent') summary = t('royal_summary_documented_descent');
      else summary = t('royal_summary_documented_link_prefix');
    }
    return {
      status: p.royal_link.status,
      summary,
      source_refs: p.royal_link.source_refs || [],
      pathText: ''
    };
  }
  if (RULER_IDS.has(p.id)) {
    return {
      status: 'sovereign',
      summary: t('royal_summary_sovereign'),
      source_refs: p.source_refs || [],
      pathText: ''
    };
  }
  const path = findRoyalPath(p.id);
  if (!path) {
    return {
      status: 'none',
      summary: t('royal_summary_none'),
      source_refs: [],
      pathText: ''
    };
  }
  const hasSpouse = path.hops.some(h => h.t === 'spouse');
  const allParent = path.hops.every(h => h.t === 'parent');
  const hasUncertain = path.hops.some(h => h.c === 'u');
  let status = allParent ? 'descent' : hasSpouse ? 'affinal' : 'collateral';
  if (hasUncertain) status = 'uncertain';
  const target = byId.get(path.ids[path.ids.length - 1]);
  const edgeSet = new Set(path.hops.map(h => relationTypeShortLabel(h.t)));
  const rel = [...edgeSet].join(', ');
  const pathText = path.ids.map(id => personName(byId.get(id) || id)).join(' \u2192 ');
  const prefix = status === 'descent' ? t('royal_summary_documented_descent') : t('royal_summary_documented_link_prefix');
  return {
    status,
    summary: `${prefix}${target ? `: ${personName(target)}` : ''} ${t('royal_summary_via')} ${rel || t('family_links')}.`.trim(),
    source_refs: uniq(path.hops.flatMap(h => h.evidence_refs || [])),
    pathText
  };
}

function knownAsRows(p) {
  const rows = (p.known_as || [])
    .map(k => (typeof k === 'string' ? { name: k } : k))
    .filter(k => k?.name);
  if (!rows.length) return `<div class="nt" style="color:var(--tx3)">${esc(t('no_known_by_names'))}</div>`;
  return `<ul class="pfl">${rows.map(k => `<li><button class="pn pn-b" data-q="${esc(k.name)}">${esc(k.name)}</button> ${k.type ? `<span class="rt">${esc(k.type)}</span>` : ''} ${confidenceBadge(k.c)}${k.note ? `<div class="rs">${esc(k.note)}</div>` : ''}</li>`).join('')}</ul>`;
}

function sovereignOfficeLabel(p) {
  if (p?.g === 'F') return t('queen_title');
  if (p?.g === 'M') return t('sultan_title');
  return t('sovereign_title');
}

function inferredSovereignOffice(p) {
  if (!(p.n || []).length) return null;
  const years = (p.re || []).flat().filter(y => Number.isFinite(y));
  if (!years.length) return null;
  return {
    office_id: 'OFF-SOVEREIGN',
    label: sovereignOfficeLabel(p),
    start: Math.min(...years),
    end: Math.max(...years),
    c: 'c',
    note: t('derived_from_reign_record'),
    source_refs: p.source_refs || []
  };
}

function officeRows(p) {
  const explicit = (p.offices_held || []).map(x => ({ ...x }));
  const sovereign = inferredSovereignOffice(p);
  if (sovereign && !explicit.some(x => x.office_id === 'OFF-SOVEREIGN')) explicit.unshift(sovereign);
  return explicit;
}

function officePanel(p) {
  const rows = officeRows(p);
  const held = rows.length
    ? `<ul class="rl">${rows.map(o => {
      const def = officeById.get(o.office_id);
      const nm = o.label || (o.office_id === 'OFF-SOVEREIGN' ? sovereignOfficeLabel(p) : (def?.name || o.office_id || t('office_generic')));
      const role = def?.summary || '';
      const y = periodLabel(o.start, o.end);
      return `<li class="ri"><div class="rlf"><div class="rn">${esc(nm)} ${confidenceBadge(o.c)}</div><div class="rs">${esc(y)}${o.note ? ` \u00b7 ${esc(o.note)}` : ''}</div>${role ? `<div class="rs">${esc(role)}</div>` : ''}</div></li>`;
    }).join('')}</ul>`
    : `<div class="nt" style="color:var(--tx3)">${esc(t('no_office_records'))}</div>`;

  const timeline = `<details class="odt"><summary>${esc(t('historical_office_timeline'))}</summary><ul class="rl">${officeTimeline.map(period => {
    const officeNames = (period.offices || []).map(id => officeById.get(id)?.name || id);
    return `<li class="ri"><div class="rlf"><div class="rn">${esc(period.label)}</div><div class="rs">${esc(period.period || '')} \u00b7 ${esc(officeNames.join(', '))}</div><div class="rs">${esc(period.summary || '')}</div></div></li>`;
  }).join('')}</ul></details>`;

  return `<div class="pcs"><div class="sl">${esc(t('held_offices_titles'))}</div>${held}</div>${timeline}`;
}

function profileCard(p) {
  const life = estLife(p);
  const display = personName(p);
  const names = uniq([p.nm, display, p.rg, ...(p.regnal_names || []), ...(p.aliases || [])]);
  const facts = p.facts?.length ? p.facts : (p.no ? [p.no] : []);
  const birthPlace = p.pb || t('unknown');
  const deathPlace = p.pd || t('unknown');
  const lifeText = `${life.yb != null ? life.yb : t('unknown')}${life.ybEst ? ' (est.)' : ''} \u2192 ${life.yd != null ? life.yd : t('unknown')}${life.ydEst ? ' (est.)' : ''}`;
  const royal = royalLinkInfo(p);
  const statusText = {
    sovereign: t('royal_sovereign'),
    descent: t('royal_descent'),
    collateral: t('royal_collateral'),
    affinal: t('royal_affinal'),
    uncertain: t('royal_uncertain'),
    documented: t('royal_documented'),
    none: t('royal_none')
  }[royal.status] || t('royal_documented');
  const dyColor = `var(--dy-${(p.dy || 'unknown').toLowerCase()})`;
  const reignText = fR(p.re || []) || t('unknown');
  const femaleIcon = p.g === 'F' ? '<span class="pc-female" aria-label="Female">\u2640</span> ' : '';
  // Connection count for stats
  const connCount = edges.filter(e => e.s === p.id || e.d === p.id).length;
  const srcCount = collectSourceRefs(p).length;

  return `
    <section class="pc" data-person-card style="--dy-color:${dyColor}">
      <div class="pch">
        <div class="pcn">${femaleIcon}${esc(display)}</div>
        <div class="pcd">${esc(p.dy || t('unknown_dynasty'))}</div>
        <div class="pc-reign-pill">${esc(reignText)}</div>
      </div>
      <div class="pcg">
        <div class="pcl"><span>${esc(t('reign'))}</span><b>${esc(reignText)}</b></div>
        <div class="pcl"><span>${esc(t('life'))}</span><b>${esc(lifeText)}</b></div>
        <div class="pcl"><span>${esc(t('connections'))}</span><b>${connCount}</b></div>
        <div class="pcl"><span>${esc(t('sources_word'))}</span><b>${srcCount}</b></div>
      </div>
      <div class="ptabs">
        <button class="ptab${p.bio ? '' : ' on'}" data-tab="overview"><svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm1 12H7V7h2v5zm0-7H7V3h2v2z"/></svg> ${esc(t('profile'))}</button>
        <button class="ptab${p.bio ? ' on' : ''}" data-tab="bio"><svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M2 1h9l3 3v11a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zm1 3h5v1H3V4zm0 3h8v1H3V7zm0 3h8v1H3v-1zm0 3h5v1H3v-1z"/></svg> ${esc(t('bio'))}</button>
        <button class="ptab" data-tab="offices"><svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M2 2h12v2H2zm0 4h12v2H2zm0 4h12v2H2z"/></svg> ${esc(t('offices'))}</button>
        <button class="ptab" data-tab="evidence"><svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm-1 12H3V3h10v10z"/></svg> ${esc(t('evidence'))}</button>
        <button class="ptab" data-tab="map"><svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C5.2 0 3 2.2 3 5c0 4 5 11 5 11s5-7 5-11c0-2.8-2.2-5-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg> ${esc(t('map'))}</button>
      </div>
      <div class="ptpanel${p.bio ? '' : ' on'}" data-panel="overview">
        <div class="pcs">
          <div class="sl">${esc(t('known_names'))}</div>
          <div class="pnl">${names.length ? names.map(n => `<button class="pn pn-b" data-q="${esc(n)}">${esc(n)}</button>`).join('') : `<span class="pn">${esc(t('unknown'))}</span>`}</div>
        </div>
        <div class="pcs">
          <div class="sl">${esc(t('known_by'))}</div>
          ${knownAsRows(p)}
        </div>
        ${p.titles?.length ? `<div class="pcs"><div class="sl">${esc(t('titles'))}</div><div class="pnl">${p.titles.map(t => `<button class="pn pn-b" data-q="${esc(t)}">${esc(t)}</button>`).join('')}</div></div>` : ''}
        <div class="pcs">
          <div class="sl">${esc(t('royal_links'))}</div>
          <div class="rli"><span class="pn">${esc(statusText)}</span></div>
          <div class="rs">${esc(royal.summary)}</div>
          ${royal.pathText ? `<div class="rs">${esc(t('path'))}: ${esc(royal.pathText)}</div>` : ''}
        </div>
        <div class="pcs">
          <div class="sl">${esc(t('compare'))}</div>
          <div class="pnl">
            <button class="gb" onclick="setCmpA('${p.id}')">${esc(t('set_a'))}</button>
            <button class="gb" onclick="setCmpB('${p.id}')">${esc(t('set_b'))}</button>
            <button class="gb" onclick="armCmp('${p.id}')">${esc(t('compare_next'))}</button>
          </div>
        </div>
        ${factsPanelHtml(facts)}
      </div>
      <div class="ptpanel${p.bio ? ' on' : ''}" data-panel="bio">
        ${p.bio
          ? `<div class="bio-text">${p.bio.split('\n\n').map((para, i) => `<p${i === 0 ? ' class="bio-lead"' : ''}>${esc(para)}</p>`).join('')}</div>`
          : `<p class="nt">${esc(t('no_bio'))}</p>`
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

function collectSourceRefs(p) {
  const refs = [];
  refs.push(...(p.source_refs || []));
  (p.known_as || []).forEach(k => refs.push(...((k && k.source_refs) || [])));
  (p.offices_held || []).forEach(o => refs.push(...((o && o.source_refs) || [])));
  if (p.royal_link?.source_refs) refs.push(...p.royal_link.source_refs);
  const royal = royalLinkInfo(p);
  refs.push(...(royal.source_refs || []));
  return uniq(refs).filter(id => sourceById.has(id));
}

function srcH(refs) {
  if (!refs || !refs.length) return `<div class="nt" style="color:var(--tx3)">${esc(t('no_sources'))}</div>`;
  const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
  const archiveLink = `<div class="nt" style="margin:4px 0 8px;color:var(--tx3)">${esc(t('local_archive'))}: <a href="docs/offline-research-archive.json" target="_blank" rel="noopener noreferrer">docs/offline-research-archive.json</a>${offline ? ` \u00b7 ${esc(t('external_links_offline_notice'))}` : ''}</div>`;
  const rows = refs.map(id => {
    const s = sourceById.get(id);
    if (!s) return null;
    const title = esc(s.title || s.url);
    const linkHtml = offline
      ? `<span>${title}</span>`
      : `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${title}</a>`;
    const note = s.notes ? `<div class="rs">${esc(s.notes)}</div>` : '';
    return `<li class="ri"><div class="rlf"><div class="rn">${linkHtml} <span class="rt">${esc(s.quality || '?')}</span> <span class="rt">${esc(s.id)}</span></div><div class="rs">${esc(s.publisher || '')}${s.access_date ? ' \u00b7 ' + esc(s.access_date) : ''}</div>${note}</div></li>`;
  }).filter(Boolean);
  if (!rows.length) return `<div class="nt" style="color:var(--tx3)">${esc(t('no_sources'))}</div>`;
  const cut = rows.length > 4 ? 3 : rows.length;
  const lead = rows.slice(0, cut).join('');
  const tail = rows.slice(cut).join('');
  const more = rows.length - cut;
  return `<div class="sl">${esc(t('evidence'))}</div>${archiveLink}<ul class="rl">${lead}</ul>${tail ? `<details class="odt"><summary>${esc(t('show_more'))} ${more} ${esc(more === 1 ? t('more_source') : t('more_sources'))}</summary><ul class="rl">${tail}</ul></details>` : ''}`;
}

function bindQueryButtons(root) {
  if (!root) return;
  root.querySelectorAll('[data-q]').forEach(el => {
    el.addEventListener('click', () => {
      const q = el.getAttribute('data-q');
      if (!q) return;
      const input = document.getElementById('si');
      if (!input) return;
      input.value = q;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
    });
  });
}

function bindProfileTabs(root) {
  if (!root) return;
  root.querySelectorAll('[data-person-card]').forEach(card => {
    const tabs = card.querySelectorAll('.ptab');
    const panels = card.querySelectorAll('.ptpanel');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => t.classList.toggle('on', t === tab));
        panels.forEach(p => p.classList.toggle('on', p.dataset.panel === target));
      });
    });
  });
  bindQueryButtons(root);
}

function shouldUseBottomSheet() {
  return window.innerWidth <= 1024 || document.body.classList.contains('sidebar-collapsed');
}

function crossFadeContent(el, newHtml, callback) {
  if (!el) return;
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    el.innerHTML = newHtml;
    if (callback) callback();
    return;
  }
  el.style.transition = 'opacity 120ms ease-out';
  el.style.opacity = '0';
  setTimeout(() => {
    el.innerHTML = newHtml;
    if (callback) callback();
    el.style.opacity = '1';
    setTimeout(() => { el.style.transition = ''; }, 140);
  }, 130);
}

function relationTypeLabel(t) {
  return relationLabel(t);
}

function personLabelWithId(id) {
  const p = byId.get(id);
  if (!p) return id;
  return `${personName(p)} (${id})`;
}

function edgeStepText(step) {
  if (!step?.s || !step?.d) return '';
  const rel = step.t || 'kin';
  return `${personLabelWithId(step.s)} \u2192 ${personLabelWithId(step.d)} [${relationTypeLabel(rel)}]`;
}

function derivedRuleLabel(rule) {
  if (rule === 'shared-parent-sibling') return t('inference_rule_shared_parent');
  if (rule === 'parent-of-parent-grandparent') return t('inference_rule_parent_of_parent');
  if (rule === 'parent-sibling-aunt-uncle') return t('inference_rule_parent_sibling');
  if (rule === 'children-of-siblings-cousin') return t('inference_rule_children_of_siblings');
  return t('inference_rule_derived');
}

function derivedInferenceDetail(e) {
  const basis = e.inference_basis || {};
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
        ? `${personLabelWithId(sid)} and ${personLabelWithId(did)} are inferred as cousin-line kin because their parents (${personLabelWithId(pair[0])}, ${personLabelWithId(pair[1])}) are modeled as siblings.`
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

function inferenceDetailForEdge(e) {
  if (!e || e.c !== 'i') return null;
  const note = getInferenceNote(e);
  if (note) {
    return {
      ruleLabel: t('inference_rule_manual'),
      summary: note.summary || t('inference_no_detail'),
      dossier: note.dossier || '',
      logic: note.logic || [],
      verification: note.verification || []
    };
  }
  if (isDerivedInferenceEdge(e)) {
    const derived = derivedInferenceDetail(e);
    if (derived) return derived;
  }
  return {
    ruleLabel: t('inference_rule_unknown'),
    summary: t('inference_no_detail'),
    dossier: '',
    logic: [],
    verification: []
  };
}

function localDocHref(path) {
  if (!path) return '';
  return String(path)
    .split('/')
    .map(seg => encodeURIComponent(seg))
    .join('/');
}

function inferencePanel(e) {
  if (!e || e.c !== 'i') return '';
  const info = inferenceDetailForEdge(e);
  if (!info) return '';
  const dossierPath = info.dossier || getInferenceDossierPath(e);
  const dossierHref = localDocHref(dossierPath);
  const edgeKey = inferenceEdgeKey(e);
  const gradeChip = e.confidence_grade
    ? `<span class="rt">${esc(t('confidence_grade'))} ${esc(e.confidence_grade)}</span>`
    : '';
  const trackerHref = 'docs/research-program/ledgers/inference-dossier-tracker.csv';
  const refs = (e.evidence_refs || [])
    .filter(id => sourceById.has(id))
    .map(id => {
      const src = sourceById.get(id);
      return `${src?.title || id} (${id})`;
    });
  const logic = (info.logic || []).filter(Boolean);
  const checks = (info.verification || []).filter(Boolean);
  const basisHtml = refs.length
    ? refs.map(row => `<span class="infp-tag">${esc(row)}</span>`).join('')
    : '';
  return `
    <div class="pcs infp">
      <div class="infp-top">
        <div class="sl">${esc(t('inference_logic'))}</div>
        <div class="infp-meta">
          <span class="rt rt-i">${esc(t('inferred'))}</span>
          ${gradeChip}
          <span class="rt">${esc(info.ruleLabel)}</span>
        </div>
      </div>
      <div class="infp-summary">${esc(info.summary)}</div>
      <div class="infp-actions">
        ${dossierHref ? `<a class="doc-link doc-pill" href="${esc(dossierHref)}" target="_blank" rel="noopener noreferrer">${esc(t('inference_open_dossier'))}</a>` : `<span class="infp-missing">${esc(t('inference_dossier_unavailable'))}</span>`}
        <a class="doc-link doc-pill" href="docs/confidence-grade-explainer.md" target="_blank" rel="noopener noreferrer">${esc(t('inference_open_explainer'))}</a>
        <a class="doc-link doc-pill" href="${trackerHref}" target="_blank" rel="noopener noreferrer">${esc(t('inference_open_tracker'))}</a>
      </div>
      <div class="infp-path"><span>${esc(t('inference_edge_key'))}</span><code>${esc(edgeKey || '-')}</code></div>
      ${dossierPath ? `<div class="infp-path"><span>${esc(t('inference_dossier_path'))}</span><code>${esc(dossierPath)}</code></div>` : ''}
      ${logic.length ? `<details class="odt infp-det" open><summary>${esc(t('inference_logic_steps'))}</summary><ul class="pfl">${logic.map(row => `<li>${esc(row)}</li>`).join('')}</ul></details>` : ''}
      ${checks.length ? `<details class="odt infp-det"><summary>${esc(t('inference_verification_checklist'))}</summary><ul class="pfl">${checks.map(row => `<li>${esc(row)}</li>`).join('')}</ul></details>` : ''}
      ${refs.length ? `<div class="infp-bases"><div class="sl">${esc(t('inference_bases'))}</div><div class="infp-tags">${basisHtml}</div></div>` : `<div class="rs">${esc(t('inference_no_bases'))}</div>`}
    </div>
  `;
}

function edgeEvidencePanel(e, s, targetPerson) {
  const refs = sourceRowsFromRefs(e.evidence_refs || []);
  const uncertainty = e.c === 'c'
    ? t('link_confirmed_text')
    : e.c === 'i'
      ? t('link_inferred_text')
      : t('link_uncertain_text');
  const lead = refs.slice(0, 3).map(r => `<li>${esc(r.title)} <span class="rt">${esc(r.quality)}</span></li>`).join('');
  const tail = refs.slice(3).map(r => `<li>${esc(r.title)} <span class="rt">${esc(r.quality)}</span></li>`).join('');
  const claim = e.claim_type ? `${t('claim_type')}: ${e.claim_type}.` : '';
  const band = e.confidence_grade ? `${t('confidence_grade')}: ${e.confidence_grade}.` : '';
  return `
    <div class="pcs">
      <div class="sl">${esc(t('evidence_narrative'))}</div>
      <div class="nt">${esc(personName(s))} ${esc(t('and_word'))} ${esc(personName(targetPerson))} ${esc(t('are_connected_as'))} ${esc(relationTypeLabel(e.t || 'kin'))}. ${uncertainty}</div>
      <div class="rs">${esc(claim)} ${esc(band)}</div>
      <div class="rs">${esc(t('edge_sources_count'))}: ${refs.length}</div>
    </div>
    <div class="pcs">
      <div class="sl">${esc(t('edge_source_stack'))}</div>
      ${lead ? `<ul class="pfl">${lead}</ul>` : `<div class="nt" style="color:var(--tx3)">${esc(t('no_edge_sources'))}</div>`}
      ${tail ? `<details class="odt"><summary>${esc(t('show_more'))} ${refs.length - 3} ${esc(refs.length - 3 === 1 ? t('more_source') : t('more_sources'))}</summary><ul class="pfl">${tail}</ul></details>` : ''}
    </div>
  `;
}

function relationCard(link) {
  const sid = typeof link.source === 'object' ? link.source.id : link.source;
  const tid = typeof link.target === 'object' ? link.target.id : link.target;
  const s = byId.get(sid);
  const targetPerson = byId.get(tid);
  if (!s || !targetPerson) return '';
  const e = link._e || {};
  const c = e.c || 'u';
  const confClass = c === 'i' ? 'rt-i' : c === 'u' ? 'rt-u' : '';
  const confTag = confClass ? `<span class="rt ${confClass}">${confidenceLabel(c)}</span>` : `<span class="rt">${esc(t('confirmed'))}</span>`;
  return `
    <section class="pc">
      <div class="pch">
        <div class="pcn">${esc(t('relationship'))}</div>
        <div class="pcd">${esc(relationTypeLabel(e.t || 'kin'))}</div>
      </div>
      <div class="pcg">
        <div class="pcl"><span>${esc(t('edge_type'))}</span><b>${esc(relationTypeLabel(e.t || 'kin'))}</b></div>
        <div class="pcl"><span>${esc(t('edge_confidence'))}</span><b>${esc(confidenceLabel(c))}${e.confidence_grade ? ` (${esc(t('confidence_grade'))} ${esc(e.confidence_grade)})` : ''}</b></div>
        <div class="pcl"><span>${esc(t('edge_source'))}</span><b>${esc(personName(s))}</b></div>
        <div class="pcl"><span>${esc(t('edge_target'))}</span><b>${esc(personName(targetPerson))}</b></div>
      </div>
      ${e.l ? `<div class="pcs"><div class="sl">${esc(t('edge_label'))}</div><div class="nt">${esc(e.l)}</div></div>` : ''}
      ${e.event_context ? `<div class="pcs"><div class="sl">${esc(t('edge_context'))}</div><div class="nt">${esc(e.event_context)}</div></div>` : ''}
      ${inferencePanel(e)}
      ${edgeEvidencePanel(e, s, targetPerson)}
      <div class="pcs">
        <div class="sl">${esc(t('explore_endpoints'))}</div>
        <div class="pnl">
          <button class="gb" onclick="goF('${s.id}')">${esc(personName(s))}</button>
          <button class="gb" onclick="goF('${targetPerson.id}')">${esc(personName(targetPerson))}</button>
          ${confTag}
        </div>
      </div>
    </section>
  `;
}

export function showLinkDetail(link) {
  if (!link) return;
  const sid = typeof link.source === 'object' ? link.source.id : link.source;
  const tid = typeof link.target === 'object' ? link.target.id : link.target;
  const s = byId.get(sid);
  const targetPerson = byId.get(tid);
  if (!s || !targetPerson) return;
  const e = link._e || {};
  const m = [
    `<span class="bg">${esc(relationTypeLabel(e.t || 'kin'))}</span>`,
    `<span class="bg">${esc(confidenceLabel(e.c || 'u'))}</span>`,
    e.confidence_grade ? `<span class="bg">${esc(t('confidence_grade'))} ${esc(e.confidence_grade)}</span>` : '',
    e.claim_type ? `<span class="bg">${esc(e.claim_type)}</span>` : ''
  ].join('');
  const refs = uniq((e.evidence_refs || []).filter(id => sourceById.has(id)));
  const card = relationCard(link);
  const cmp = compareSummaryHtml();
  const evi = srcH(refs);
  const relRows = `
    <div class="sl">${esc(t('connected_people'))}</div>
    <ul class="rl">
      <li class="ri"><div class="rlf"><div class="rn">${esc(personName(s))}</div><div class="rs">${esc(fR(s.re))} \u00b7 ${esc(s.dy || '?')}</div></div><button class="gb" onclick="goF('${s.id}')">${esc(t('go'))}</button></li>
      <li class="ri"><div class="rlf"><div class="rn">${esc(personName(targetPerson))}</div><div class="rs">${esc(fR(targetPerson.re))} \u00b7 ${esc(targetPerson.dy || '?')}</div></div><button class="gb" onclick="goF('${targetPerson.id}')">${esc(t('go'))}</button></li>
    </ul>
  `;
  document.getElementById('sT').textContent = t('relationship');
  document.getElementById('vmi')?.classList.remove('on');
  document.getElementById('vmi')?.setAttribute('aria-pressed', 'false');
  document.getElementById('sT').classList.remove('emp');
  document.getElementById('sM').innerHTML = m;
  document.getElementById('sN').innerHTML = `${card}${cmp}${evi}`;
  document.getElementById('sR').innerHTML = relRows;
  recordEdge(link);
  window.dispatchEvent(new CustomEvent('selection-changed', { detail: { type: 'edge', s: sid, d: tid, rel: e.t || 'kin' } }));
  if (shouldUseBottomSheet()) {
    document.getElementById('bT').textContent = t('relationship');
    document.getElementById('bB').innerHTML = `<div class="mr">${m}</div>${card}${cmp}${evi}<div class="dv"></div>${relRows}`;
    oS();
  }
}

export function showD(id) {
  const p = byId.get(id);
  if (!p) return;
  handlePersonViewed(id);
  const dyC = `var(--dy-${(p.dy || 'unknown').toLowerCase()})`;
  let m = `<span class="bg"><span class="bdd" style="background:${dyC}"></span>${esc(p.dy || t('unknown'))}</span>`;
  if (p.re) m += `<span class="bg">${esc(fR(p.re))}</span>`;
  if (p.n) m += `<span class="bg">${p.n.map(x => '#' + x).join(', ')}</span>`;
  if (p.g === 'F') m += '<span class="bg">\u2640</span>';
  if (p.regnal_names?.length) m += `<span class="bg">${esc(t('regnal'))} ${esc(p.regnal_names[0])}</span>`;
  const refs = collectSourceRefs(p);
  const card = profileCard(p);
  const cmp = compareSummaryHtml();
  const evi = srcH(refs);
  const rels = rlH(t('parents'), parOf(id)) + rlH(t('children'), chOf(id)) + rlH(t('siblings'), gNb(id, 'sibling')) + rlH(t('spouses'), gNb(id, 'spouse')) + rlH(t('other_kin'), gNb(id, 'kin'));
  document.getElementById('sT').textContent = (p.g === 'F' ? '\u2640 ' : '') + personName(p);
  document.getElementById('vmi')?.classList.remove('on');
  document.getElementById('vmi')?.setAttribute('aria-pressed', 'false');
  document.getElementById('sT').classList.remove('emp');
  document.getElementById('sM').innerHTML = m;
  crossFadeContent(document.getElementById('sN'), `${card}${cmp}${evi}`, () => {
    bindProfileTabs(document.getElementById('sN'));
  });
  crossFadeContent(document.getElementById('sR'), rels || `<div class="nt" style="color:var(--tx3)">${esc(t('no_connections'))}</div>`);
  recordPerson(id);
  window.dispatchEvent(new CustomEvent('selection-changed', { detail: { type: 'person', id } }));
  if (shouldUseBottomSheet()) {
    document.getElementById('bT').textContent = (p.g === 'F' ? '\u2640 ' : '') + personName(p);
    document.getElementById('bB').innerHTML = `<div class="mr">${m}</div>${card}${cmp}${evi}<div class="dv"></div>${rels}`;
    bindProfileTabs(document.getElementById('bB'));
    oS();
  }
}

function officeSourceRows(refs) {
  return uniq((refs || []).filter(id => sourceById.has(id)))
    .map(id => {
      const s = sourceById.get(id);
      return {
        id,
        title: s?.title || id,
        quality: s?.quality || '?'
      };
    })
    .sort((a, b) => sourceQualityWeight(b.quality) - sourceQualityWeight(a.quality) || a.title.localeCompare(b.title));
}

function officeSourceBlock(refs) {
  const rows = officeSourceRows(refs);
  if (!rows.length) return '';
  const lead = rows.slice(0, 4)
    .map(r => `<div class="srcrow"><div class="srcn">${esc(r.title)}</div><span class="rt">${esc(r.quality)}</span><span class="rt">${esc(r.id)}</span></div>`)
    .join('');
  const more = rows.length - 4;
  return `
    <div class="srcb">
      <div class="sl">${esc(t('sources_label'))}</div>
      ${lead}
      ${more > 0 ? `<div class="rs">+${more} ${esc(more === 1 ? t('more_source') : t('more_sources'))}</div>` : ''}
    </div>
  `;
}

function institutionsOverviewHtml() {
  const rows = officeById.size
    ? [...officeById.values()].map(o => {
      const aliases = (o.alt_names || []).map(x => `<button class="pn pn-b" data-q="${esc(x)}">${esc(x)}</button>`).join('');
      const srcBlock = officeSourceBlock(o.source_refs);
      return `
        <li class="ri">
          <div class="rlf">
            <div class="rn"><button class="pn pn-b" data-q="${esc(o.name)}">${esc(o.name)}</button> <span class="rt">${esc(o.kind || t('office_generic'))}</span></div>
            <div class="rs">${esc(o.summary || t('role_summary_unavailable'))}</div>
            ${aliases ? `<div class="pnl" style="margin-top:4px">${aliases}</div>` : ''}
            ${srcBlock}
          </div>
        </li>
      `;
    }).join('')
    : `<div class="nt" style="color:var(--tx3)">${esc(t('no_institutions_loaded'))}</div>`;
  return `
    <section class="pc">
      <div class="pch">
        <div class="pcn">${esc(t('institutions'))}</div>
        <div class="pcd">${esc(t('office_title_glossary'))}</div>
      </div>
      <div class="pcs">
        <div class="sl">${esc(t('office_catalog'))}</div>
        <ul class="rl">${rows}</ul>
      </div>
    </section>
  `;
}

function institutionsTimelineHtml() {
  const rows = (officeTimeline || []).map(period => {
    const officeNames = (period.offices || [])
      .map(id => officeById.get(id)?.name || id)
      .map(name => `<button class="pn pn-b" data-q="${esc(name)}">${esc(name)}</button>`)
      .join('');
    const srcBlock = officeSourceBlock(period.source_refs);
    return `
      <li class="ri">
        <div class="rlf">
          <div class="rn">${esc(period.label || t('period_word'))}</div>
          <div class="rs">${esc(period.period || '')}</div>
          <div class="rs">${esc(period.summary || '')}</div>
          ${officeNames ? `<div class="pnl" style="margin-top:4px">${officeNames}</div>` : ''}
          ${srcBlock}
        </div>
      </li>
    `;
  }).join('');
  return `
    <section class="pc">
      <div class="pch">
        <div class="pcn">${esc(t('institution_timeline'))}</div>
        <div class="pcd">${officeTimeline.length} ${esc(t('periods_word'))}</div>
      </div>
      <div class="pcs">
        <div class="sl">${esc(t('periodized_view'))}</div>
        <ul class="rl">${rows}</ul>
      </div>
    </section>
  `;
}

export function showInstitutionsPane() {
  document.getElementById('vmi')?.classList.add('on');
  document.getElementById('vmi')?.setAttribute('aria-pressed', 'true');
  document.getElementById('sT').textContent = t('institutions');
  document.getElementById('sT').classList.remove('emp');
  document.getElementById('sM').innerHTML = `<span class="bg">${officeById.size} ${esc(t('offices_word'))}</span><span class="bg">${officeTimeline.length} ${esc(t('periods_word'))}</span>`;
  const nHtml = institutionsOverviewHtml();
  const rHtml = institutionsTimelineHtml();
  document.getElementById('sN').innerHTML = nHtml;
  document.getElementById('sR').innerHTML = rHtml;
  bindQueryButtons(document.getElementById('sN'));
  bindQueryButtons(document.getElementById('sR'));
  window.dispatchEvent(new CustomEvent('selection-changed', { detail: { type: 'institutions' } }));
  if (shouldUseBottomSheet()) {
    document.getElementById('bT').textContent = t('institutions');
    document.getElementById('bB').innerHTML = `${nHtml}<div class="dv"></div>${rHtml}`;
    bindQueryButtons(document.getElementById('bB'));
    oS();
  }
}

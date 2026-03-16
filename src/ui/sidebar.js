import { byId, people, edges } from '../data/sovereigns.merge.js';
import { sourceById } from '../data/sources.js';
import { officeById, officeTimeline, officeFunctionForYear, buildOfficeHolders } from '../data/offices.js';
import { fR, esc } from '../utils/format.js';
import { gNb, parOf, chOf } from '../graph/relationships.js';
import { oS } from './modal.js';
import { recordPerson, recordEdge, recordOffice } from './history.js';
import { compareSummaryHtml, handlePersonViewed } from './compare.js';
import { extractPlaceMentions, placeLabelForLang, resolvePlace } from '../data/geo.js';
import { getLang, personName, relationLabel, t } from './i18n.js';
import { getInferenceNote, getInferenceDossierPath, inferenceEdgeKey, isDerivedInferenceEdge } from '../data/inference-notes.js';

let currentOfficeId = null;
let currentRelationLink = null;
let currentPersonId = null;
export function getCurrentOfficeId() { return currentOfficeId; }

const DEFAULT_VERIFICATION_DOCS = {
  relationship_ledger_path: 'docs/research-program/ledgers/relationship-evidence-ledger.csv',
  inference_tracker_path: 'docs/research-program/ledgers/inference-dossier-tracker.csv',
  confidence_explainer_path: 'docs/confidence-grade-explainer.md'
};
let verificationModule = null;
let verificationModulePromise = null;
let verificationModuleFailed = false;
let verificationRefreshQueued = false;

function verificationDocs() {
  if (verificationModule?.getRelationshipVerificationDocs) {
    return verificationModule.getRelationshipVerificationDocs() || DEFAULT_VERIFICATION_DOCS;
  }
  return DEFAULT_VERIFICATION_DOCS;
}

function verificationEdgeKey(edge) {
  if (verificationModule?.relationshipEdgeKey) {
    return verificationModule.relationshipEdgeKey(edge);
  }
  return inferenceEdgeKey(edge);
}

function verificationMeta(edge) {
  if (verificationModule?.getRelationshipVerification) {
    return verificationModule.getRelationshipVerification(edge);
  }
  return null;
}

function queueVerificationRefresh() {
  if (verificationRefreshQueued || (!currentRelationLink && !currentPersonId)) return;
  verificationRefreshQueued = true;
  Promise.resolve().then(() => {
    verificationRefreshQueued = false;
    if (!verificationModule) return;
    if (currentRelationLink) {
      showLinkDetail(currentRelationLink, { skipHistory: true });
      return;
    }
    if (currentPersonId) {
      showD(currentPersonId);
    }
  });
}

function ensureVerificationModuleLoaded() {
  if (verificationModule || verificationModulePromise || verificationModuleFailed) return;
  verificationModulePromise = import('../data/relationship-verification.js')
    .then(mod => {
      verificationModule = mod;
      queueVerificationRefresh();
      return mod;
    })
    .catch(() => {
      verificationModuleFailed = true;
      return null;
    })
    .finally(() => {
      verificationModulePromise = null;
    });
}

const RULER_IDS = new Set(people.filter(p => (p.n || []).length > 0).map(p => p.id));
const ROYAL_ADJ = new Map(people.map(p => [p.id, []]));
edges.forEach(e => {
  ROYAL_ADJ.get(e.s)?.push({ to: e.d, t: e.t, c: e.c, evidence_refs: e.evidence_refs || [] });
  ROYAL_ADJ.get(e.d)?.push({ to: e.s, t: e.t, c: e.c, evidence_refs: e.evidence_refs || [] });
});

function edgeConfidenceRank(c) {
  if (c === 'c') return 0;
  if (c === 'i') return 1;
  return 2;
}

function confidenceGradeAudienceLabel(grade) {
  if (grade === 'A') return t('inference_grade_audience_a');
  if (grade === 'B') return t('inference_grade_audience_b');
  if (grade === 'C') return t('inference_grade_audience_c');
  if (grade === 'D') return t('inference_grade_audience_d');
  return t('inference_grade_audience_unknown');
}

function personLabel(id) {
  if (!id) return t('unknown');
  const p = byId.get(id);
  return p ? personName(p) : id;
}

function cleanInferencePerson(raw) {
  return String(raw || '')
    .replace(/\s*\(P\d+\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseSupportingEdgeStep(step) {
  if (!step) return null;
  const compact = String(step)
    .replace(/; excerpt:.*/i, '')
    .trim();
  const support = compact.match(/^Supporting edge:\s*(parent|sibling|spouse|kin)\s+P\d+\s+(.+?)\s*(?:<->|->)\s*P\d+\s+(.+?)(?:\s+\((?:CLM-|SRC-|grade)[^)]+\).*)?$/i);
  if (!support) return null;
  return {
    rel: (support[1] || '').toLowerCase(),
    lhs: cleanInferencePerson(support[2]),
    rhs: cleanInferencePerson(support[3])
  };
}

function layRelationNarrative(edge, sourceName, targetName, relationText) {
  const basis = edge.inference_basis || {};
  const rule = edge.inference_rule;
  const rel = (relationText || '').toLowerCase();
  if (rule === 'parent-of-parent-grandparent' && basis.via_parent) {
    return t('inference_narrative_grandparent_via')
      .replaceAll('{source}', sourceName)
      .replaceAll('{target}', targetName)
      .replace('{via}', personLabel(basis.via_parent));
  }
  if (rule === 'shared-parent-sibling' && basis.shared_parent) {
    return t('inference_narrative_sibling_shared_parent')
      .replaceAll('{source}', sourceName)
      .replaceAll('{target}', targetName)
      .replace('{parent}', personLabel(basis.shared_parent));
  }
  if (rule === 'parent-sibling-aunt-uncle' && basis.via_parent) {
    return t('inference_narrative_aunt_uncle_via')
      .replaceAll('{source}', sourceName)
      .replaceAll('{target}', targetName)
      .replace('{via}', personLabel(basis.via_parent));
  }
  if (rule === 'children-of-siblings-cousin' && (basis.via_parent_siblings || []).length === 2) {
    const pair = basis.via_parent_siblings || [];
    return t('inference_narrative_cousin_via_parents')
      .replaceAll('{source}', sourceName)
      .replaceAll('{target}', targetName)
      .replace('{p1}', personLabel(pair[0]))
      .replace('{p2}', personLabel(pair[1]));
  }
  if (rule === 'parent-of-parent-grandparent' || rel.includes('grandparent')) {
    return t('inference_narrative_grandparent')
      .replaceAll('{source}', sourceName)
      .replaceAll('{target}', targetName);
  }
  if (rule === 'children-of-siblings-cousin' || rel.includes('cousin')) {
    return t('inference_narrative_cousin')
      .replaceAll('{source}', sourceName)
      .replaceAll('{target}', targetName);
  }
  if (rule === 'parent-sibling-aunt-uncle' || rel.includes('aunt') || rel.includes('uncle')) {
    return t('inference_narrative_aunt_uncle')
      .replaceAll('{source}', sourceName)
      .replaceAll('{target}', targetName);
  }
  if (rule === 'shared-parent-sibling' || rel.includes('sibling')) {
    return t('inference_narrative_sibling')
      .replaceAll('{source}', sourceName)
      .replaceAll('{target}', targetName);
  }
  return t('inference_narrative_generic')
    .replaceAll('{source}', sourceName)
    .replaceAll('{target}', targetName);
}

function simplifyInferenceStep(step, rule) {
  if (!step) return '';

  const support = parseSupportingEdgeStep(step);
  if (support) {
    const rel = support.rel;
    const lhs = support.lhs;
    const rhs = support.rhs;
    if (rel === 'parent') return t('inference_step_parent').replace('{a}', lhs).replace('{b}', rhs);
    if (rel === 'sibling') return t('inference_step_sibling').replace('{a}', lhs).replace('{b}', rhs);
    if (rel === 'spouse') return t('inference_step_spouse').replace('{a}', lhs).replace('{b}', rhs);
    return t('inference_step_kin').replace('{a}', lhs).replace('{b}', rhs);
  }

  const pathStep = step.match(/^(.+?)\s+\u2192\s+(.+?)\s+\[(.+)\]$/);
  if (pathStep) {
    const lhs = pathStep[1].replace(/\s*\(P\d+\)\s*/g, '').trim();
    const rhs = pathStep[2].replace(/\s*\(P\d+\)\s*/g, '').trim();
    const rel = pathStep[3].toLowerCase();
    if (rel.includes('parent')) return t('inference_step_parent').replace('{a}', lhs).replace('{b}', rhs);
    if (rel.includes('sibling')) return t('inference_step_sibling').replace('{a}', lhs).replace('{b}', rhs);
    return t('inference_step_kin').replace('{a}', lhs).replace('{b}', rhs);
  }

  let out = step;
  out = out.replace(/^Support set for rule .+ resolved as follows\.?$/i, t('inference_step_start'));
  out = out.replace(/^Supporting edge:\s*/i, '');
  out = out.replace(/^Rule application \([^)]+\):\s*/i, '');
  out = out.replace(/^Current modeling remains inferred because /i, t('inference_step_still_inferred'));
  out = out.replace(/\bP\d+\s+/g, '');
  out = out.replace(/\s*\(CLM-[^)]+\)/g, '');
  out = out.replace(/\bSRC-[A-Z0-9-]+\b/g, '');
  out = out.replace(/\bgrade\s+[ABCD]\b/gi, '');
  out = out.replace(/; excerpt:.*/i, '');
  out = out.replace(/`[^`]+`/g, '');
  out = out.replace(/\s+/g, ' ').trim().replace(/^[,.;:\s]+|[,.;:\s]+$/g, '');
  if (/^rule application/i.test(step)) {
    if (rule === 'parent-of-parent-grandparent') return t('inference_rule_parent_of_parent_plain');
    if (rule === 'parent-sibling-aunt-uncle') return t('inference_rule_parent_sibling_plain');
    if (rule === 'children-of-siblings-cousin') return t('inference_rule_children_of_siblings_plain');
    if (rule === 'shared-parent-sibling') return t('inference_rule_shared_parent_plain');
  }
  if (!out || /\b(CL[A-Z]-\d+|SRC-|parent-of-parent-grandparent|shared-parent-sibling|parent-sibling-aunt-uncle|children-of-siblings-cousin)\b/i.test(out)) {
    return t('inference_step_sources_support');
  }
  if (out.length > 220) return `${out.slice(0, 216)}...`;
  return out;
}

function audienceInferenceSteps(edge, info) {
  const basis = edge.inference_basis || {};
  const sid = personLabel(edge.s);
  const did = personLabel(edge.d);
  const rule = edge.inference_rule;
  if (rule === 'parent-of-parent-grandparent') {
    const rows = (basis.parent_edges || [])
      .filter(r => r.s && r.d)
      .map(r => t('inference_step_parent').replace('{a}', personLabel(r.s)).replace('{b}', personLabel(r.d)))
      .slice(0, 2);
    const fallbackRows = (info?.logic || [])
      .map(r => parseSupportingEdgeStep(r))
      .filter(r => !!r && r.rel === 'parent')
      .map(r => t('inference_step_parent').replace('{a}', r.lhs).replace('{b}', r.rhs))
      .slice(0, 2);
    const supportRows = rows.length ? rows : fallbackRows;
    return [...supportRows, t('inference_rule_parent_of_parent_plain_named').replace('{a}', sid).replace('{b}', did)];
  }
  if (rule === 'parent-sibling-aunt-uncle') {
    const rows = (basis.supporting_edges || [])
      .map(r => simplifyInferenceStep(edgeStepText(r), rule))
      .filter(Boolean)
      .slice(0, 3);
    const fallbackRows = (info?.logic || [])
      .map(r => simplifyInferenceStep(r, rule))
      .filter(Boolean)
      .slice(0, 3);
    const supportRows = rows.length ? rows : fallbackRows;
    return [...supportRows, t('inference_rule_parent_sibling_plain_named').replace('{a}', sid).replace('{b}', did)];
  }
  if (rule === 'children-of-siblings-cousin') {
    const parentRows = (basis.child_parent_edges || [])
      .map(r => simplifyInferenceStep(edgeStepText(r), rule))
      .filter(Boolean);
    const siblingRow = simplifyInferenceStep(edgeStepText(basis.parent_sibling_edge), rule);
    const rows = [...parentRows, siblingRow].filter(Boolean).slice(0, 4);
    const fallbackRows = (info?.logic || [])
      .map(r => simplifyInferenceStep(r, rule))
      .filter(Boolean)
      .slice(0, 4);
    const supportRows = rows.length ? rows : fallbackRows;
    return [...supportRows, t('inference_rule_children_of_siblings_plain_named').replace('{a}', sid).replace('{b}', did)];
  }
  if (rule === 'shared-parent-sibling') {
    const parent = personLabel(basis.shared_parent);
    const rows = (basis.parent_edges || [])
      .map(r => simplifyInferenceStep(edgeStepText(r), rule))
      .filter(Boolean)
      .slice(0, 2);
    const fallbackRows = (info?.logic || [])
      .map(r => simplifyInferenceStep(r, rule))
      .filter(Boolean)
      .slice(0, 2);
    const supportRows = rows.length ? rows : fallbackRows;
    return [
      ...supportRows,
      t('inference_rule_shared_parent_plain_named')
        .replace('{parent}', parent)
        .replace('{a}', sid)
        .replace('{b}', did)
    ];
  }
  return (info?.logic || []).map(row => simplifyInferenceStep(row, edge.inference_rule)).filter(Boolean);
}

function bestEdgeBetween(a, b, relType) {
  const matches = edges.filter(e =>
    e.t === relType
      && ((e.s === a && e.d === b) || (e.s === b && e.d === a))
  );
  if (!matches.length) return null;
  matches.sort((lhs, rhs) =>
    edgeConfidenceRank(lhs.c) - edgeConfidenceRank(rhs.c)
      || sourceQualityWeight(rhs.confidence_grade || '') - sourceQualityWeight(lhs.confidence_grade || '')
      || (rhs.evidence_refs?.length || 0) - (lhs.evidence_refs?.length || 0)
  );
  return matches[0] || null;
}

function kinStoryBlock(ownerId, it, edge) {
  const relType = it.t || edge?.t || 'kin';
  if (relType !== 'kin') return '';
  const relationText = (edge?.l || it.l || '').trim();
  const relationLine = relationText
    ? `<div class="rs">${esc(t('edge_label'))}: ${esc(relationText)}</div>`
    : '';
  if (!edge || edge.c === 'c') return relationLine;

  const openBtn = `<button class="tb" data-rel-open="1" data-rel-s="${esc(edge.s)}" data-rel-d="${esc(edge.d)}" data-rel-t="${esc(edge.t || 'kin')}">${esc(t('relationship'))} \u00b7 ${esc(t('go'))}</button>`;
  if (edge.c === 'u') {
    return `${relationLine}<details class="odt"><summary>${esc(t('uncertain'))}</summary><div class="rs">${esc(t('link_uncertain_text'))}</div><div class="pnl">${openBtn}</div></details>`;
  }

  const info = inferenceDetailForEdge(edge);
  const summary = info?.summary || t('inference_no_detail');
  const verification = verificationMeta(edge);
  const steps = audienceInferenceSteps(edge, info);
  const leadLogic = steps.slice(0, 2);
  const tailLogic = steps.slice(2);
  const dossierPath = info?.dossier || verification?.dossier_file || getInferenceDossierPath(edge);
  const dossierHref = localDocHref(dossierPath);
  const owner = byId.get(ownerId);
  const other = byId.get(it.id);
  const ownerName = personName(owner || ownerId);
  const otherName = personName(other || it.id);
  const narrative = layRelationNarrative(edge, ownerName, otherName, relationText);
  const confidenceText = confidenceGradeAudienceLabel(edge.confidence_grade);
  const moreCount = tailLogic.length;
  return `
    ${relationLine}
    <details class="odt" open>
      <summary>${esc(t('inference_why_relation'))}</summary>
      <div class="rs">${esc(narrative)}</div>
      <div class="rs">${esc(t('inference_support_level'))}: ${esc(confidenceText)}${edge.confidence_grade ? ` (${esc(t('confidence_grade'))} ${esc(edge.confidence_grade)})` : ''}.</div>
      <div class="rs">${esc(t('inference_direct_claim_missing'))}</div>
      ${leadLogic.length ? `<ul class="pfl">${leadLogic.map(row => `<li>${esc(row)}</li>`).join('')}</ul>` : ''}
      ${moreCount ? `<details class="odt"><summary>${esc(t('show_more'))} ${moreCount} ${esc(moreCount === 1 ? t('more_fact') : t('more_facts'))}</summary><ul class="pfl">${tailLogic.map(row => `<li>${esc(row)}</li>`).join('')}</ul></details>` : ''}
      <div class="infp-actions">
        ${dossierHref ? `<a class="doc-link doc-pill" href="${esc(dossierHref)}" target="_blank" rel="noopener noreferrer">${esc(t('inference_open_dossier'))}</a>` : ''}
        ${openBtn}
      </div>
      <details class="odt">
        <summary>${esc(t('inference_technical_trace'))}</summary>
        <div class="rs">${esc(summary)}</div>
        ${info?.ruleLabel ? `<div class="pnl"><span class="rt">${esc(info.ruleLabel)}</span>${verification?.claim_id ? `<span class="rt">${esc(verification.claim_id)}</span>` : ''}${verification?.review_status ? `<span class="rt">${esc(verification.review_status)}</span>` : ''}</div>` : ''}
      </details>
    </details>
  `;
}

export function rlH(title, items) {
  if (!items.length) return '';
  const ownerId = currentPersonId;
  return `<div class="sl">${esc(title)}</div><ul class="rl">${items.map(it => {
    const p = byId.get(it.id);
    if (!p) return '';
    const relType = it.t || 'kin';
    const edge = ownerId ? bestEdgeBetween(ownerId, it.id, relType) : null;
    const tag = it.c && it.c !== 'c' ? `<span class="rt ${it.c === 'i' ? 'rt-i' : 'rt-u'}">${it.c === 'i' ? t('inferred') : t('uncertain')}</span>` : '';
    const srcMeta = it.srcCount
      ? ` \u00b7 ${it.srcCount} ${it.srcCount === 1 ? t('source_word') : t('sources_word')}${it.cg ? ` \u00b7 ${t('grade_word')} ${it.cg}` : ''}`
      : '';
    const kinStory = ownerId ? kinStoryBlock(ownerId, it, edge) : '';
    return `<li class="ri" data-rel="${esc(relType)}"><div class="rlf"><div class="rn">${p.g === 'F' ? '\u2640 ' : ''}${esc(personName(p))} ${tag}</div><div class="rs">${p.re ? esc(fR(p.re)) : ''} \u00b7 ${esc(p.dy || '?')}${p.n ? ` \u00b7 ${p.n.map(x => '#' + x).join(', ')}` : ''}${srcMeta}</div>${kinStory}</div><button class="gb" onclick="goF('${p.id}')">${esc(t('go'))}</button></li>`;
  }).join('')}</ul>`;
}

function uniq(arr) {
  return [...new Set((arr || []).filter(Boolean))];
}

function firstYear(text) {
  const m = text.match(/\b(9\d{2}|1\d{3}|20\d{2})\b/);
  return m ? Number(m[1]) : null;
}

function extractBioLifeYears(bio) {
  if (!bio) return { yb: null, yd: null };
  const text = String(bio);
  const leadParagraph = text.split(/\n\s*\n/)[0] || text;
  const scope = leadParagraph.length >= 80 ? leadParagraph : text.slice(0, 700);
  const birthPatterns = [
    /\b(?:was\s+)?born(?:\s+(?:around|circa|c\.?|before|after|in|on))?[\s\S]{0,40}?(\d{3,4})\b/i
  ];
  const deathPatterns = [
    /\b(?:he|she|they|sultan|queen|king|dom)\s+died(?:\s+(?:before|after|around|circa|c\.?|in|on))?[\s\S]{0,40}?(\d{3,4})\b/i,
    /\bdied(?:\s+(?:before|after|around|circa|c\.?|in|on))?[\s\S]{0,40}?(\d{3,4})\b/i
  ];

  const pick = (patterns) => {
    for (const pattern of patterns) {
      const match = scope.match(pattern);
      if (match?.[1]) return firstYear(match[1]);
    }
    return null;
  };

  return {
    yb: pick(birthPatterns),
    yd: pick(deathPatterns)
  };
}

function estLife(p) {
  const yrs = (p.re || []).flat();
  const from = yrs.length ? Math.min(...yrs) : null;
  const to = yrs.length ? Math.max(...yrs) : null;
  const bio = extractBioLifeYears(p.bio);
  const yb = p.yb ?? bio.yb ?? (from != null ? from - 30 : null);
  const yd = p.yd ?? bio.yd ?? (to != null ? to + 10 : null);
  const ybBioConflict = p.yb != null && bio.yb != null && Math.abs(p.yb - bio.yb) >= 2 ? bio.yb : null;
  const ydBioConflict = p.yd != null && bio.yd != null && Math.abs(p.yd - bio.yd) >= 2 ? bio.yd : null;
  return {
    yb,
    yd,
    ybEst: p.yb == null && bio.yb == null && yb != null,
    ydEst: p.yd == null && bio.yd == null && yd != null,
    ybFromBio: p.yb == null && bio.yb != null,
    ydFromBio: p.yd == null && bio.yd != null,
    ybBioConflict,
    ydBioConflict
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
  relEdges.forEach(e => {
    if (conf[e.c] != null) conf[e.c] += 1;
  });
  const total = relEdges.length || 1;
  const refs = collectSourceRefs(p);
  const sourceRows = sourceRowsFromRefs(refs);
  const strong = sourceRows.filter(r => r.quality === 'A' || r.quality === 'B').length;

  // Visual confidence bar
  const pctC = Math.round(((conf.c || 0) / total) * 100);
  const pctI = Math.round(((conf.i || 0) / total) * 100);
  const pctU = 100 - pctC - pctI;
  const bar = `<div class="evi-bar">
    ${conf.c ? `<span class="evi-seg evi-c" style="width:${pctC}%"></span>` : ''}
    ${conf.i ? `<span class="evi-seg evi-i" style="width:${pctI}%"></span>` : ''}
    ${conf.u ? `<span class="evi-seg evi-u" style="width:${pctU}%"></span>` : ''}
  </div>
  <div class="evi-legend">
    <span>\u25A0 ${esc(t('confirmed'))}: ${conf.c}</span>
    <span>\u25E7 ${esc(t('inferred'))}: ${conf.i}</span>
    <span>\u25CB ${esc(t('uncertain'))}: ${conf.u}</span>
  </div>`;

  const sourceLabel = `${esc(t('evidence_sources_total'))}: ${sourceRows.length} \u00b7 A/B: ${strong}`;
  const leadSources = sourceRows.slice(0, 3).map(s => `<li>${esc(s.title)} <span class="rt">${esc(s.quality)}</span></li>`).join('');
  const tailSources = sourceRows.slice(3).map(s => `<li>${esc(s.title)} <span class="rt">${esc(s.quality)}</span></li>`).join('');

  // Uncertainty watchlist — uncapped
  const uncertain = relEdges
    .filter(e => e.c !== 'c')
    .map(e => {
      const otherId = e.s === p.id ? e.d : e.s;
      const other = byId.get(otherId);
      return `<li>${esc(relationTypeLabel(e.t))} \u00b7 ${esc(personName(other || otherId))} ${confidenceBadge(e.c)}</li>`;
    })
    .join('');

  // Map section
  const mapHtml = mapPanel(p);

  return `
    <div class="pcs">
      <div class="sl">${esc(t('evidence_strength'))}</div>
      ${bar}
      <div class="rs">${relEdges.length} ${esc(t('evidence_links_total'))}</div>
      <div class="rs">${sourceLabel}</div>
    </div>
    <div class="pcs">
      <div class="sl">${esc(t('key_sources'))}</div>
      ${leadSources ? `<ul class="pfl">${leadSources}</ul>` : `<div class="nt nt-empty">${esc(t('no_sources'))}</div>`}
      ${tailSources ? `<details class="odt"><summary>${esc(t('show_more'))} ${sourceRows.length - 3} ${esc(sourceRows.length - 3 === 1 ? t('more_source') : t('more_sources'))}</summary><ul class="pfl">${tailSources}</ul></details>` : ''}
    </div>
    <div class="pcs">
      <div class="sl">${esc(t('uncertainty_watchlist'))}</div>
      ${uncertain ? `<ul class="pfl">${uncertain}</ul>` : `<div class="nt nt-empty">${esc(t('no_inferred_uncertain_links'))}</div>`}
    </div>
    <div class="pcs">
      <div class="sl">${esc(t('geographic_context'))}</div>
      ${mapHtml}
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
    ${mapSvg}
    <div class="rs">${esc(t('map_birth'))}: ${birthRow}</div>
    <div class="rs">${esc(t('map_death'))}: ${deathRow}</div>
    <div class="rs">${esc(t('map_context_nodes'))}: ${contextRows || `<span class="pn">${esc(t('unknown'))}</span>`}</div>
    ${routeHints ? `<div class="rs">${esc(t('map_routes'))}: ${esc(routeHints)}</div>` : ''}
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
  if (!rows.length) return `<div class="nt nt-empty">${esc(t('no_known_by_names'))}</div>`;
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

// Kind icons & border colors for office cards
const KIND_ICON = {
  crown: '\u265B', judicial: '\u2696', ministerial: '\uD83C\uDFDB',
  deputy: '\u2691', executive: '\u25C6', institution: '\u2699',
  peerage: '\u2654', furadaana: '\u2605', military: '\u2694'
};
const KIND_BORDER = {
  crown: 'var(--ac)', judicial: 'var(--dy-dhiyamigili)', ministerial: 'var(--tx2)',
  deputy: 'var(--dy-huraagey)', executive: 'var(--ac2)', institution: 'var(--bd2)',
  peerage: 'var(--ac2)', furadaana: 'var(--dy-hilaaly)', military: 'var(--dy-theemuge)'
};
function kindLabel(kind) {
  const map = { crown: 'crown_office', judicial: 'judicial_office', ministerial: 'ministerial_office',
    deputy: 'deputy_office', executive: 'executive_office', institution: 'institution_office',
    peerage: 'peerage_office', furadaana: 'furadaana_office', military: 'military_office' };
  return t(map[kind] || 'office_generic');
}

function officeCardHtml(o, p) {
  const def = officeById.get(o.office_id);
  const nm = o.label || (o.office_id === 'OFF-SOVEREIGN' ? sovereignOfficeLabel(p) : (def?.name || o.office_id || t('office_generic')));
  const kind = def?.kind || '';
  const icon = KIND_ICON[kind] || '\u25CB';
  const border = KIND_BORDER[kind] || 'var(--bd)';
  const y = periodLabel(o.start, o.end);
  const conf = confidenceBadge(o.c);
  const confText = confidenceLabel(o.c || 'c');
  // Era-aware description: use person's start year to find closest function description
  const personYear = o.start ?? (p.re?.[0]?.[0]) ?? null;
  const summary = (personYear && def ? officeFunctionForYear(def.id, personYear) : '') || def?.summary || '';
  const note = o.note ? `<div class="ofc-note">${esc(o.note)}</div>` : '';
  const srcRefs = o.source_refs || [];
  const srcPills = srcRefs.length
    ? `<div class="ofc-srcs">${srcRefs.slice(0, 4).map(id => `<span class="rt">${esc(id)}</span>`).join(' ')}</div>`
    : '';
  // Make office name clickable (link to office detail) if we have a catalog definition
  const nameHtml = def
    ? `<span class="ofc-name ofc-link" data-office-id="${esc(def.id)}">${esc(nm)}</span>`
    : `<span class="ofc-name">${esc(nm)}</span>`;
  return `<div class="ofc" style="--ofc-border:${border}">
    <div class="ofc-head"><span class="ofc-icon">${icon}</span>${nameHtml}<span class="ofc-period">${esc(y)}</span></div>
    <div class="ofc-meta">${esc(kindLabel(kind))} \u00b7 ${esc(confText)} ${conf}</div>
    ${summary ? `<div class="ofc-summary">${esc(summary)}</div>` : ''}
    ${note}${srcPills}
  </div>`;
}

function eraContextHtml(p) {
  if (!officeTimeline.length) return '';
  const yrs = (p.re || []).flat().filter(v => v != null);
  const personYear = yrs.length ? Math.min(...yrs) : (p.yb ?? p.yd ?? null);
  let closestIdx = 0;
  if (personYear != null) {
    let bestDist = Infinity;
    officeTimeline.forEach((period, i) => {
      const m = (period.period || '').match(/\d{3,4}/);
      if (m) {
        const dist = Math.abs(parseInt(m[0], 10) - personYear);
        if (dist < bestDist) { bestDist = dist; closestIdx = i; }
      }
    });
  }
  const markers = officeTimeline.map((period, i) => {
    const shortLabel = (period.period || period.label).replace(/\([^)]*\)/g, '').trim().split(/\s+/)[0] || '?';
    const active = i === closestIdx ? ' era-active' : '';
    return `<span class="era-marker${active}" data-era-idx="${i}">${esc(shortLabel)}</span>`;
  }).join('');
  const strip = `<div class="era-strip">${markers}</div>`;
  const cards = officeTimeline.map((period, i) => {
    const pills = (period.offices || []).map(id => {
      const ofc = officeById.get(id);
      const lbl = ofc?.name || id;
      return `<span class="pn ofc-link" data-office-id="${esc(id)}">${esc(lbl)}</span>`;
    }).join('');
    const content = `<div class="era-card-body">
      <div class="ofc-summary">${esc(period.summary || '')}</div>
      ${pills ? `<div class="era-offices"><span class="ofc-meta">${esc(t('offices_in_era'))}:</span><div class="pnl">${pills}</div></div>` : ''}
    </div>`;
    if (i === closestIdx) {
      return `<div class="era-card era-card-open"><div class="era-card-head">${esc(period.label)} <span class="rs">${esc(period.period || '')}</span></div>${content}</div>`;
    }
    return `<details class="era-card"><summary class="era-card-head">${esc(period.label)} <span class="rs">${esc(period.period || '')}</span></summary>${content}</details>`;
  }).join('');
  return `<div class="pcs"><div class="sl">${esc(t('historical_context'))}</div>${strip}${cards}</div>`;
}

function officePanel(p) {
  const rows = officeRows(p);
  const held = rows.length
    ? `<div class="ofc-list">${rows.map(o => officeCardHtml(o, p)).join('')}</div>`
    : `<div class="nt nt-empty">${esc(t('no_held_offices'))}</div>`;
  return `<div class="pcs"><div class="sl">${esc(t('held_offices'))}</div>${held}</div>${eraContextHtml(p)}`;
}

function profileCard(p) {
  const life = estLife(p);
  const display = personName(p);
  const names = uniq([p.nm, display, p.rg, ...(p.regnal_names || []), ...(p.aliases || [])]);
  const facts = p.facts?.length ? p.facts : (p.no ? [p.no] : []);
  const birthSuffix = life.ybFromBio ? ` (${t('life_marker_bio')})` : life.ybEst ? ` (${t('life_marker_est')})` : '';
  const deathSuffix = life.ydFromBio ? ` (${t('life_marker_bio')})` : life.ydEst ? ` (${t('life_marker_est')})` : '';
  const lifeText = `${life.yb != null ? life.yb : t('unknown')}${birthSuffix} \u2192 ${life.yd != null ? life.yd : t('unknown')}${deathSuffix}`;
  const lifeWarnings = [];
  if (life.ybBioConflict != null && life.yb != null) {
    lifeWarnings.push(t('life_birth_conflict')
      .replace('{bio}', String(life.ybBioConflict))
      .replace('{life}', String(life.yb)));
  }
  if (life.ydBioConflict != null && life.yd != null) {
    lifeWarnings.push(t('life_death_conflict')
      .replace('{bio}', String(life.ydBioConflict))
      .replace('{life}', String(life.yd)));
  }
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
  const connCount = edges.filter(e => e.s === p.id || e.d === p.id).length;
  const srcCount = collectSourceRefs(p).length;

  // Sovereign ordinal
  const ordinal = (p.n || []).length ? `<span class="pcd">#${p.n[0]}</span>` : '';

  // Dynasty + reign merged into subtitle
  const subtitleParts = [p.dy || t('unknown_dynasty')];
  if (reignText !== t('unknown')) subtitleParts.push(reignText);
  const subtitle = subtitleParts.join(' \u00b7 ');

  // Story tab content
  const storyContent = `
    <div class="pcs">
      <div class="sl">${esc(t('known_names'))}</div>
      <div class="pnl">${names.length ? names.map(n => `<button class="pn pn-b" data-q="${esc(n)}">${esc(n)}</button>`).join('') : `<span class="pn">${esc(t('unknown'))}</span>`}</div>
    </div>
    <div class="pcs">
      <div class="sl">${esc(t('known_by'))}</div>
      ${knownAsRows(p)}
    </div>
    ${p.titles?.length ? `<div class="pcs"><div class="sl">${esc(t('titles'))}</div><div class="pnl">${p.titles.map(ti => `<button class="pn pn-b" data-q="${esc(ti)}">${esc(ti)}</button>`).join('')}</div></div>` : ''}
    ${p.bio
      ? `<div class="pcs"><div class="sl">${esc(t('bio'))}</div><div class="bio-text">${p.bio.split('\n\n').map((para, i) => `<p${i === 0 ? ' class="bio-lead"' : ''}>${esc(para)}</p>`).join('')}</div></div>`
      : ''
    }
    <div class="pcs">
      <div class="sl">${esc(t('life_consistency'))}</div>
      <div class="rs">${esc(t('life_consistency_hint'))}</div>
      ${lifeWarnings.length
        ? `<ul class="pfl">${lifeWarnings.map(row => `<li>${esc(row)}</li>`).join('')}</ul>`
        : `<div class="rs">${esc(t('life_consistency_ok'))}</div>`
      }
    </div>
    <div class="pcs">
      <div class="sl">${esc(t('royal_links'))}</div>
      <div class="rli"><span class="pn">${esc(statusText)}</span> ${confidenceBadge(royal.status === 'uncertain' ? 'u' : royal.status === 'none' ? 'u' : undefined)}</div>
      <div class="rs">${esc(royal.summary)}</div>
      ${royal.pathText ? `<div class="rs">${esc(t('path'))}: ${esc(royal.pathText)}</div>` : ''}
    </div>
    ${factsPanelHtml(facts)}
    <div class="pcs">
      <div class="sl">${esc(t('compare'))}</div>
      <div class="pnl">
        <button class="gb" onclick="setCmpA('${p.id}')">${esc(t('set_a'))}</button>
        <button class="gb" onclick="setCmpB('${p.id}')">${esc(t('set_b'))}</button>
        <button class="gb" onclick="armCmp('${p.id}')">${esc(t('compare_next'))}</button>
      </div>
    </div>
  `;

  return `
    <section class="pc" data-person-card style="--dy-color:${dyColor}">
      <div class="pch">
        <div class="pcn">${femaleIcon}${esc(display)}</div>
        <div class="pcd">${esc(subtitle)}</div>
        ${ordinal}
      </div>
      <div class="pcg">
        <div class="pcl"><span>${esc(t('life'))}</span><b>${esc(lifeText)}</b></div>
        <div class="pcl"><span>${esc(t('connections'))}</span><b>${connCount}</b></div>
      </div>
      <div class="ptabs">
        <button class="ptab on" data-tab="story"><svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M2 1h9l3 3v11a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zm1 3h5v1H3V4zm0 3h8v1H3V7zm0 3h8v1H3v-1zm0 3h5v1H3v-1z"/></svg> ${esc(t('story'))}</button>
        <button class="ptab" data-tab="offices"><svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M2 2h12v2H2zm0 4h12v2H2zm0 4h12v2H2z"/></svg> ${esc(t('offices_roles'))}</button>
        <button class="ptab" data-tab="evidence"><svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm-1 12H3V3h10v10z"/></svg> ${esc(t('evidence'))} <span class="rt">${srcCount}</span></button>
      </div>
      <div class="ptpanel on" data-panel="story">
        ${storyContent}
      </div>
      <div class="ptpanel" data-panel="offices">
        ${officePanel(p)}
      </div>
      <div class="ptpanel" data-panel="evidence">
        ${personEvidencePanel(p)}
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
  if (!refs || !refs.length) return `<div class="nt nt-empty">${esc(t('no_sources'))}</div>`;
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
  if (!rows.length) return `<div class="nt nt-empty">${esc(t('no_sources'))}</div>`;
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
  const edgeKey = inferenceEdgeKey(e);

  if (edgeKey === 'kin|P46|P50|grandparent') {
    return {
      ruleLabel: t('inference_rule_parent_of_parent'),
      summary: `${personLabelWithId(sid)} is modeled as a grandparent-line relative of ${personLabelWithId(did)} via ${personLabelWithId('P47')}.`,
      logic: [
        `Supporting edge: parent P46 Omar -> P47 Hassan (CLM-0341, SRC-MRF-KINGS, grade B).`,
        `Supporting edge: parent P47 Hassan -> P50 Ibrahim (CLM-0601, SRC-ROYALARK-MALDIVES, grade B).`,
        `Rule application: if A is parent of B and B is parent of C, A is inferred as grandparent-line kin of C.`
      ],
      verification: [
        `Promotion target: direct A/B wording that explicitly names P46 Omar and P50 Ibrahim as grandparent-line kin.`,
        `Downgrade trigger: source-backed revision to either supporting parent edge in this chain.`
      ]
    };
  }

  if (edgeKey === 'kin|P40|P41|aunt/uncle↔niece/nephew') {
    return {
      ruleLabel: t('inference_rule_parent_sibling'),
      summary: `${personLabelWithId(sid)} is modeled as aunt/uncle-line kin of ${personLabelWithId(did)} through parent-sibling composition anchored on ${personLabelWithId('P39')}.`,
      logic: [
        `Supporting edge: parent P39 Yoosuf -> P41 Hadi Hassan (CLM-0596, SRC-ROYALARK-MALDIVES, grade B).`,
        `Supporting edge: sibling P39 Yoosuf <-> P40 Aboobakuru [half-brothers] (CLM-0432, SRC-MRF-KINGS, grade B).`,
        `Rule application: sibling(parent, X) + parent(parent, child) implies inferred aunt/uncle-line kin(X, child).`
      ],
      verification: [
        `Promotion target: explicit A/B source wording naming P40 Aboobakuru and P41 Hadi Hassan as aunt/uncle-line kin.`,
        `Downgrade trigger: contradiction or reassignment in either the parent edge or the sibling basis edge.`
      ]
    };
  }

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
  ensureVerificationModuleLoaded();
  const info = inferenceDetailForEdge(e);
  if (!info) return '';
  const verification = verificationMeta(e);
  const docs = verificationDocs();
  const dossierPath = info.dossier || verification?.dossier_file || getInferenceDossierPath(e);
  const dossierHref = localDocHref(dossierPath);
  const edgeKey = inferenceEdgeKey(e);
  const supportLevel = confidenceGradeAudienceLabel(e.confidence_grade);
  const gradeChip = `<span class="rt">${esc(t('inference_support_level'))}: ${esc(supportLevel)}${e.confidence_grade ? ` (${esc(e.confidence_grade)})` : ''}</span>`;
  const trackerHref = localDocHref(docs?.inference_tracker_path || 'docs/research-program/ledgers/inference-dossier-tracker.csv');
  const explainerHref = localDocHref(docs?.confidence_explainer_path || 'docs/confidence-grade-explainer.md');
  const refs = (e.evidence_refs || [])
    .filter(id => sourceById.has(id))
    .map(id => {
      const src = sourceById.get(id);
      return `${src?.title || id} (${id})`;
    });
  const audienceSummary = layRelationNarrative(e, personLabel(e.s), personLabel(e.d), e.l || relationTypeLabel(e.t || 'kin'));
  const logic = audienceInferenceSteps(e, info);
  const checks = (info.verification || []).filter(Boolean);
  const verificationStatus = verification
    ? `${verification.review_status || '-'} / ${verification.canonical_decision || '-'}`
    : '';
  const basisHtml = refs.length
    ? refs.map(row => `<span class="infp-tag">${esc(row)}</span>`).join('')
    : '';
  return `
    <div class="pcs infp">
      <div class="infp-top">
        <div class="sl">${esc(t('inference_how_link'))}</div>
        <div class="infp-meta">
          <span class="rt rt-i">${esc(t('inferred'))}</span>
          ${gradeChip}
        </div>
      </div>
      <div class="infp-summary">${esc(audienceSummary)}</div>
      <div class="rs">${esc(t('inference_support_level'))}: ${esc(supportLevel)}${e.confidence_grade ? ` (${esc(t('confidence_grade'))} ${esc(e.confidence_grade)})` : ''}.</div>
      <div class="rs">${esc(t('inference_direct_claim_missing'))}</div>
      ${logic.length ? `<details class="odt infp-det" open><summary>${esc(t('inference_logic_steps'))}</summary><ul class="pfl">${logic.map(row => `<li>${esc(row)}</li>`).join('')}</ul></details>` : ''}
      ${checks.length ? `<details class="odt infp-det"><summary>${esc(t('inference_verification_checklist'))}</summary><ul class="pfl">${checks.map(row => `<li>${esc(row)}</li>`).join('')}</ul></details>` : ''}
      <div class="infp-actions">
        ${dossierHref ? `<a class="doc-link doc-pill" href="${esc(dossierHref)}" target="_blank" rel="noopener noreferrer">${esc(t('inference_open_dossier'))}</a>` : `<span class="infp-missing">${esc(t('inference_dossier_unavailable'))}</span>`}
        <a class="doc-link doc-pill" href="${esc(explainerHref)}" target="_blank" rel="noopener noreferrer">${esc(t('inference_open_explainer'))}</a>
        <a class="doc-link doc-pill" href="${esc(trackerHref)}" target="_blank" rel="noopener noreferrer">${esc(t('inference_open_tracker'))}</a>
      </div>
      <details class="odt infp-det">
        <summary>${esc(t('inference_technical_trace'))}</summary>
        <div class="rs">${esc(info.summary)}</div>
        <div class="infp-meta"><span class="rt">${esc(info.ruleLabel)}</span></div>
        <div class="infp-path"><span>${esc(t('inference_edge_key'))}</span><code>${esc(edgeKey || '-')}</code></div>
        ${verificationStatus ? `<div class="infp-path"><span>${esc(t('verification_status'))}</span><code>${esc(verificationStatus)}</code></div>` : ''}
        ${dossierPath ? `<div class="infp-path"><span>${esc(t('inference_dossier_path'))}</span><code>${esc(dossierPath)}</code></div>` : ''}
        ${refs.length ? `<div class="infp-bases"><div class="sl">${esc(t('inference_bases'))}</div><div class="infp-tags">${basisHtml}</div></div>` : `<div class="rs">${esc(t('inference_no_bases'))}</div>`}
      </details>
    </div>
  `;
}

function edgeVerificationPanel(e) {
  if (!e) return '';
  ensureVerificationModuleLoaded();
  const docs = verificationDocs();
  const relLedgerHref = localDocHref(docs?.relationship_ledger_path || 'docs/research-program/ledgers/relationship-evidence-ledger.csv');
  const trackerHref = localDocHref(docs?.inference_tracker_path || 'docs/research-program/ledgers/inference-dossier-tracker.csv');
  const explainerHref = localDocHref(docs?.confidence_explainer_path || 'docs/confidence-grade-explainer.md');
  const edgeKey = verificationEdgeKey(e) || '-';
  const meta = verificationMeta(e);
  const loading = !verificationModule && !verificationModuleFailed;

  if (loading) {
    return `
      <div class="pcs">
        <div class="sl">${esc(t('verification_panel'))}</div>
        <div class="rs">${esc(t('verification_loading'))}</div>
        <div class="infp-path"><span>${esc(t('inference_edge_key'))}</span><code>${esc(edgeKey)}</code></div>
      </div>
    `;
  }

  if (!meta) {
    return `
      <div class="pcs">
        <div class="sl">${esc(t('verification_panel'))}</div>
        <div class="rs">${esc(t('verification_not_indexed'))}</div>
        <div class="infp-path"><span>${esc(t('inference_edge_key'))}</span><code>${esc(edgeKey)}</code></div>
        <div class="infp-actions">
          <a class="doc-link doc-pill" href="${esc(relLedgerHref)}" target="_blank" rel="noopener noreferrer">${esc(t('verification_open_relationship_ledger'))}</a>
          ${e.c === 'i' ? `<a class="doc-link doc-pill" href="${esc(trackerHref)}" target="_blank" rel="noopener noreferrer">${esc(t('verification_open_inference_tracker'))}</a>` : ''}
          <a class="doc-link doc-pill" href="${esc(explainerHref)}" target="_blank" rel="noopener noreferrer">${esc(t('inference_open_explainer'))}</a>
        </div>
      </div>
    `;
  }

  const chips = [
    meta.review_status ? `<span class="rt">${esc(t('verification_review_status'))}: ${esc(meta.review_status)}</span>` : '',
    meta.canonical_decision ? `<span class="rt">${esc(t('verification_canonical_decision'))}: ${esc(meta.canonical_decision)}</span>` : ''
  ].filter(Boolean).join('');
  const reviewerLine = [meta.reviewer, meta.last_reviewed].filter(Boolean).join(' · ');
  const dossierHref = localDocHref(meta.dossier_file);
  const claimMeta = [
    meta.claim_id ? `${t('verification_claim_id')}: ${meta.claim_id}` : '',
    meta.primary_source_id ? `${t('verification_primary_source')}: ${meta.primary_source_id}` : ''
  ].filter(Boolean).join(' · ');

  return `
    <div class="pcs">
      <div class="sl">${esc(t('verification_panel'))}</div>
      <div class="pnl">${chips}</div>
      ${claimMeta ? `<div class="rs">${esc(claimMeta)}</div>` : ''}
      ${reviewerLine ? `<div class="rs">${esc(t('verification_reviewer'))}: ${esc(reviewerLine)}</div>` : ''}
      <div class="infp-path"><span>${esc(t('inference_edge_key'))}</span><code>${esc(edgeKey)}</code></div>
      <div class="infp-actions">
        <a class="doc-link doc-pill" href="${esc(relLedgerHref)}" target="_blank" rel="noopener noreferrer">${esc(t('verification_open_relationship_ledger'))}</a>
        ${e.c === 'i' ? `<a class="doc-link doc-pill" href="${esc(trackerHref)}" target="_blank" rel="noopener noreferrer">${esc(t('verification_open_inference_tracker'))}</a>` : ''}
        ${dossierHref ? `<a class="doc-link doc-pill" href="${esc(dossierHref)}" target="_blank" rel="noopener noreferrer">${esc(t('inference_open_dossier'))}</a>` : ''}
        <a class="doc-link doc-pill" href="${esc(explainerHref)}" target="_blank" rel="noopener noreferrer">${esc(t('inference_open_explainer'))}</a>
      </div>
      ${meta.claim_excerpt_short ? `<details class="odt"><summary>${esc(t('verification_claim_excerpt'))}</summary><div class="rs">${esc(meta.claim_excerpt_short)}</div></details>` : ''}
      ${meta.citation_locator_short ? `<details class="odt"><summary>${esc(t('verification_citation_locator'))}</summary><div class="rs">${esc(meta.citation_locator_short)}</div></details>` : ''}
      ${meta.notes ? `<details class="odt"><summary>${esc(t('verification_notes'))}</summary><div class="rs">${esc(meta.notes)}</div></details>` : ''}
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
      ${lead ? `<ul class="pfl">${lead}</ul>` : `<div class="nt nt-empty">${esc(t('no_edge_sources'))}</div>`}
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
      ${edgeVerificationPanel(e)}
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

export function showLinkDetail(link, opts = {}) {
  if (!link) return;
  currentPersonId = null;
  currentRelationLink = link;
  ensureVerificationModuleLoaded();
  currentOfficeId = null;
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
  if (!opts.skipHistory) recordEdge(link);
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
  ensureVerificationModuleLoaded();
  currentPersonId = id;
  currentRelationLink = null;
  currentOfficeId = null;
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
  crossFadeContent(document.getElementById('sR'), rels || `<div class="nt nt-empty">${esc(t('no_connections'))}</div>`);
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
            <div class="rn"><button class="pn pn-b ofc-link" data-office-id="${esc(o.id)}">${esc(o.name)}</button> <span class="rt">${esc(kindLabel(o.kind))}</span></div>
            <div class="rs">${esc(o.summary || t('role_summary_unavailable'))}</div>
            ${aliases ? `<div class="pnl" style="margin-top:4px">${aliases}</div>` : ''}
            ${srcBlock}
          </div>
        </li>
      `;
    }).join('')
    : `<div class="nt nt-empty">${esc(t('no_institutions_loaded'))}</div>`;
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
      .map(id => {
        const ofc = officeById.get(id);
        const lbl = ofc?.name || id;
        return `<button class="pn pn-b ofc-link" data-office-id="${esc(id)}">${esc(lbl)}</button>`;
      })
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

// Lazy-built holder map
let _holderMap = null;
function getHolderMap() {
  if (!_holderMap) _holderMap = buildOfficeHolders(people);
  return _holderMap;
}

function officeDetailCard(office) {
  const kind = office.kind || '';
  const icon = KIND_ICON[kind] || '\u25CB';
  const border = KIND_BORDER[kind] || 'var(--bd)';
  const holders = getHolderMap().get(office.id) || [];
  const funcs = office.functions || [];
  const altNames = office.alt_names || [];
  const srcRefs = office.source_refs || [];
  const srcRows = officeSourceRows(srcRefs);

  // 3-cell grid: kind, holders, documented eras
  const grid = `<div class="pcg">
    <div class="pcl"><span>${esc(t('edge_type'))}</span><b>${esc(kindLabel(kind))}</b></div>
    <div class="pcl"><span>${esc(t('office_holders'))}</span><b>${holders.length}</b></div>
    <div class="pcl"><span>${esc(t('periods_documented'))}</span><b>${funcs.length}</b></div>
  </div>`;

  // Summary
  const summaryHtml = office.summary
    ? `<div class="pcs"><div class="sl">${esc(t('office_summary'))}</div><div class="ofc-summary">${esc(office.summary)}</div></div>`
    : '';

  // Function evolution
  let funcHtml = '';
  if (funcs.length) {
    const rows = funcs.map(fn => {
      const period = officeTimeline.find(p => p.id === fn.period_id);
      const label = period ? `${period.label} (${period.period})` : fn.period_id;
      return `<div class="ofc-func-row"><div class="ofc-func-period">${esc(label)}</div><div class="ofc-func-desc">${esc(fn.description)}</div></div>`;
    }).join('');
    funcHtml = `<div class="pcs"><div class="sl">${esc(t('office_function_evolution'))}</div><div class="ofc-func-list">${rows}</div></div>`;
  }

  // Alt names
  const altHtml = altNames.length
    ? `<div class="pcs"><div class="sl">${esc(t('office_alt_names'))}</div><div class="pnl">${altNames.map(n => `<span class="pn">${esc(n)}</span>`).join('')}</div></div>`
    : '';

  // Sources
  const srcHtmlBlock = srcRows.length
    ? `<div class="pcs"><div class="sl">${esc(t('sources_label'))}</div><div class="pnl">${srcRows.slice(0, 6).map(r => `<span class="rt">${esc(r.id)}</span>`).join(' ')}</div></div>`
    : '';

  return `
    <section class="pc" style="--dy-color:${border}">
      <div class="pch">
        <div class="pcn">${icon} ${esc(office.name)}</div>
        <div class="pcd">${esc(kindLabel(kind))}</div>
      </div>
      ${grid}
      ${summaryHtml}
      ${funcHtml}
      ${altHtml}
      ${srcHtmlBlock}
    </section>
  `;
}

function officeHolderListHtml(officeId) {
  const holders = getHolderMap().get(officeId) || [];
  if (!holders.length) return `<div class="nt nt-empty">${esc(t('no_holders'))}</div>`;
  return `<div class="sl">${esc(t('office_holders'))}</div><ul class="rl">${holders.map(h => {
    const p = byId.get(h.personId);
    if (!p) return '';
    const yLabel = h.start != null ? String(h.start) : '';
    const conf = confidenceBadge(h.c);
    return `<li class="ri"><div class="rlf"><div class="rn">${p.g === 'F' ? '\u2640 ' : ''}${esc(personName(p))} ${conf}</div><div class="rs">${esc(yLabel)} \u00b7 ${esc(p.dy || '?')}</div></div><button class="gb" onclick="goF('${p.id}')">${esc(t('go'))}</button></li>`;
  }).join('')}</ul>`;
}

export function showOfficeDetail(officeId) {
  const office = officeById.get(officeId);
  if (!office) return;
  currentPersonId = null;
  currentRelationLink = null;
  currentOfficeId = officeId;
  const kind = office.kind || '';
  const holders = getHolderMap().get(officeId) || [];
  const m = `<span class="bg">${esc(kindLabel(kind))}</span><span class="bg">${holders.length} ${esc(t('holders_word'))}</span>`;
  const card = officeDetailCard(office);
  const holderHtml = officeHolderListHtml(officeId);

  document.getElementById('sT').textContent = office.name;
  document.getElementById('vmi')?.classList.remove('on');
  document.getElementById('vmi')?.setAttribute('aria-pressed', 'false');
  document.getElementById('sT').classList.remove('emp');
  document.getElementById('sM').innerHTML = m;
  crossFadeContent(document.getElementById('sN'), card);
  crossFadeContent(document.getElementById('sR'), holderHtml);
  recordOffice(officeId);
  window.dispatchEvent(new CustomEvent('selection-changed', { detail: { type: 'office', officeId } }));
  if (shouldUseBottomSheet()) {
    document.getElementById('bT').textContent = office.name;
    document.getElementById('bB').innerHTML = `<div class="mr">${m}</div>${card}<div class="dv"></div>${holderHtml}`;
    oS();
  }
}

// Delegated click handler for all [data-office-id] elements
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-office-id]');
  if (btn) {
    e.preventDefault();
    e.stopPropagation();
    showOfficeDetail(btn.dataset.officeId);
    window.dispatchEvent(new CustomEvent('request-sidebar-open'));
  }
});

document.addEventListener('click', e => {
  const btn = e.target.closest('[data-rel-open]');
  if (!btn) return;
  const s = btn.dataset.relS || '';
  const d = btn.dataset.relD || '';
  const relType = btn.dataset.relT || 'kin';
  if (!s || !d) return;
  const edge = bestEdgeBetween(s, d, relType);
  if (!edge) return;
  e.preventDefault();
  e.stopPropagation();
  showLinkDetail({ source: edge.s, target: edge.d, _e: edge });
  window.dispatchEvent(new CustomEvent('request-sidebar-open'));
});

export function showInstitutionsPane() {
  currentPersonId = null;
  currentRelationLink = null;
  currentOfficeId = null;
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

#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDataset } from '../src/data/sovereigns.merge.js';
import { sourceById } from '../src/data/sources.js';

const inputDate = process.argv.slice(2).find(v => /^\d{4}-\d{2}-\d{2}$/.test(v));
const DATE = inputDate || new Date().toISOString().slice(0, 10);
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const peopleDir = join(rootDir, 'docs', 'research-program', 'people');
const ledgerPath = join(rootDir, 'docs', 'research-program', 'ledgers', 'person-coverage.csv');
const relationshipLedgerPath = join(rootDir, 'docs', 'research-program', 'ledgers', 'relationship-evidence-ledger.csv');
const inferenceTrackerPath = join(rootDir, 'docs', 'research-program', 'ledgers', 'inference-dossier-tracker.csv');

const dynastyFallbackSources = {
  Lunar: ['SRC-TUFS-TARIKH-DIBA-MAHALL-FACSIMILE', 'SRC-SARUNA-RAADHAVALHI-1985', 'SRC-MRF-KINGS'],
  Hilaaly: ['SRC-TUFS-TARIKH-DIBA-MAHALL-FACSIMILE', 'SRC-MRF-HILAALY', 'SRC-MRF-KINGS'],
  Utheemu: ['SRC-MRF-UTHEEM', 'SRC-WIKI-MONARCHS', 'SRC-TUFS-TARIKH-DIBA-MAHALL-FACSIMILE'],
  Dhiyamigili: ['SRC-WIKI-DHIYAMIGILI', 'SRC-MRF-KINGS', 'SRC-WIKI-MONARCHS'],
  Huraagey: ['SRC-MRF-KINGS', 'SRC-WIKI-MONARCHS', 'SRC-WIKI-HURAA'],
  Isdu: ['SRC-MRF-KINGS', 'SRC-WIKI-MONARCHS', 'SRC-MRF-MIDU-ROYAL'],
  Devadu: ['SRC-MRF-KINGS', 'SRC-WIKI-MONARCHS', 'SRC-MRF-MIDU-ROYAL'],
  Modern: ['SRC-PO-MUIZZU', 'SRC-PO-SOLIH', 'SRC-PO-NASHEED']
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === ',') {
      row.push(field);
      field = '';
      continue;
    }
    if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      continue;
    }
    if (ch !== '\r') field += ch;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function csvEscape(v) {
  const s = String(v ?? '');
  if (s.includes('"') || s.includes(',') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCsv(rows) {
  return `${rows.map(r => r.map(csvEscape).join(',')).join('\n')}\n`;
}

function byIdMap(list) {
  return new Map(list.map(item => [item.id, item]));
}

function unique(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function formatDateRange(reignRanges) {
  if (!Array.isArray(reignRanges) || !reignRanges.length) return 'Unknown';
  return reignRanges.map(r => `${r[0]}-${r[1]}`).join('; ');
}

function formatList(items) {
  if (!items.length) return '- no modeled entries yet';
  return items.map(v => `- ${v}`).join('\n');
}

function personLabel(byId, id) {
  const p = byId.get(id);
  if (!p) return id;
  const name = p.nm || '(unnamed)';
  const reg = p.rg ? ` (${p.rg})` : '';
  return `${id} ${name}${reg}`;
}

function relationText(edge, byId) {
  const source = personLabel(byId, edge.s);
  const target = personLabel(byId, edge.d);
  const label = edge.l ? ` [${edge.l}]` : '';
  const connector = edge.t === 'parent' ? '->' : '<->';
  return `${edge.t} ${source} ${connector} ${target}${label} (${edge.c})`;
}

function edgeKey(edge) {
  return `${edge.t}|${edge.s}|${edge.d}|${edge.l || ''}`;
}

function reverseEdgeKey(edge) {
  return `${edge.t}|${edge.d}|${edge.s}|${edge.l || ''}`;
}

function shortText(text, max = 220) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 3)}...`;
}

function gradeRank(grade) {
  if (grade === 'A') return 1;
  if (grade === 'B') return 2;
  if (grade === 'C') return 3;
  if (grade === 'D') return 4;
  return 9;
}

function sourceConcentration(relEdges) {
  const counts = new Map();
  for (const edge of relEdges) {
    for (const sourceId of edge.evidence_refs || []) {
      counts.set(sourceId, (counts.get(sourceId) || 0) + 1);
    }
  }
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const totalMentions = ranked.reduce((sum, [, count]) => sum + count, 0);
  return { ranked, totalMentions };
}

function claimAnchorText(claim, edge, byPersonId) {
  const source = claim.primary_source_id || 'source-unassigned';
  const grade = edge.confidence_grade || '?';
  const rel = `${edge.t} ${personLabel(byPersonId, edge.s)} ${edge.t === 'parent' ? '->' : '<->'} ${personLabel(byPersonId, edge.d)}`;
  const label = edge.l ? ` [${edge.l}]` : '';
  const excerpt = shortText(claim.claim_excerpt, 200);
  const locator = shortText(claim.citation_locator, 180);
  return `${claim.claim_id || '(claim id missing)'} | ${rel}${label} | ${source} [${grade}] | ${excerpt} | locator: ${locator}`;
}

function evidenceAnchorsForPerson(person, relEdges, claimsByEdgeKey, byPersonId) {
  const anchors = [];
  for (const edge of relEdges) {
    if (edge.c !== 'c') continue;
    const key = edgeKey(edge);
    let claim = claimsByEdgeKey.get(key);
    if (!claim && edge.t !== 'parent') {
      claim = claimsByEdgeKey.get(reverseEdgeKey(edge)) || null;
    }
    if (!claim) continue;
    anchors.push({ edge, text: claimAnchorText(claim, edge, byPersonId) });
  }
  anchors.sort((a, b) => {
    const gradeDelta = gradeRank(a.edge.confidence_grade) - gradeRank(b.edge.confidence_grade);
    if (gradeDelta !== 0) return gradeDelta;
    return a.text.localeCompare(b.text);
  });
  return anchors.map(item => item.text);
}

function inferenceLinksForPerson(person, relEdges, inferenceByEdgeKey) {
  const links = [];
  for (const edge of relEdges) {
    if (edge.c !== 'i') continue;
    const key = edgeKey(edge);
    let tracker = inferenceByEdgeKey.get(key);
    let matchMode = 'direct';
    if (!tracker && edge.t !== 'parent') {
      tracker = inferenceByEdgeKey.get(reverseEdgeKey(edge));
      if (tracker) matchMode = 'reversed';
    }
    if (tracker) {
      const modeSuffix = matchMode === 'reversed' ? ' [matched as reversed pair]' : '';
      links.push(`${key} -> ${tracker.dossier_file || '(dossier path missing)'} (${tracker.dossier_status || 'status unknown'})${modeSuffix}`);
      continue;
    }
    links.push(`${key} -> dossier tracker entry missing`);
  }
  return unique(links);
}

async function loadRelationshipClaims() {
  const csv = parseCsv(await readFile(relationshipLedgerPath, 'utf8'));
  const idx = Object.fromEntries(csv[0].map((h, i) => [h, i]));
  const map = new Map();
  for (const row of csv.slice(1)) {
    const key = row[idx.edge_key];
    if (!key) continue;
    if (!map.has(key)) {
      map.set(key, {
        claim_id: row[idx.claim_id],
        edge_key: key,
        claim_excerpt: row[idx.claim_excerpt],
        citation_locator: row[idx.citation_locator],
        primary_source_id: row[idx.primary_source_id],
        review_status: row[idx.review_status],
        canonical_decision: row[idx.canonical_decision]
      });
    }
  }
  return map;
}

async function loadInferenceTracker() {
  const csv = parseCsv(await readFile(inferenceTrackerPath, 'utf8'));
  const idx = Object.fromEntries(csv[0].map((h, i) => [h, i]));
  const map = new Map();
  for (const row of csv.slice(1)) {
    const key = row[idx.edge_key];
    if (!key) continue;
    map.set(key, {
      dossier_file: row[idx.dossier_file],
      dossier_status: row[idx.dossier_status],
      confidence_grade: row[idx.confidence_grade]
    });
  }
  return map;
}

function sourceListForPerson(person, relEdges) {
  const personRefs = unique(person.source_refs || []);
  const relationRefs = unique(relEdges.flatMap(e => e.evidence_refs || []));
  let sourceIds = unique([...personRefs, ...relationRefs]);
  if (!sourceIds.length) {
    sourceIds = dynastyFallbackSources[person.dy] || ['SRC-WIKI-MONARCHS', 'SRC-MRF-KINGS'];
  }
  return sourceIds.map(id => {
    const source = sourceById.get(id);
    const tags = [];
    if (personRefs.includes(id)) tags.push('person');
    if (relationRefs.includes(id)) tags.push('edge');
    if (!personRefs.includes(id) && !relationRefs.includes(id)) tags.push('priority');
    const tagText = tags.length ? ` (${tags.join('+')})` : '';
    if (!source) return `- \`${id}\`${tagText}`;
    return `- \`${id}\`${tagText}: ${source.title} [${source.quality}]`;
  }).join('\n');
}

function makeOpenQuestions(person, relEdges, parentEdges, aliases, sourceCount) {
  const open = [];
  const inferred = relEdges.filter(e => e.c === 'i').length;
  const direct = relEdges.filter(e => e.c === 'c').length;
  const lowGradeDirect = relEdges.filter(e => e.c === 'c' && ['C', 'D'].includes(e.confidence_grade || '')).length;
  const uncertain = relEdges.filter(e => e.c === 'u').length;
  const { ranked, totalMentions } = sourceConcentration(relEdges);
  const topShare = totalMentions && ranked.length ? ranked[0][1] / totalMentions : 0;

  if (!(person.source_refs || []).length) {
    open.push('Node-level source_refs are missing; current provenance is relation-led and needs direct person-level anchoring.');
  }
  if (sourceCount <= 1) {
    open.push('Source diversity is low for this node; add at least one independent corroborative source before promotion decisions.');
  }
  if (!aliases.length) {
    open.push('No transliteration or alternate naming set is documented yet.');
  }
  if (!parentEdges.length) {
    open.push('Parentage remains incomplete in the current model and should be prioritized in extraction.');
  }
  if (inferred > direct && inferred > 0) {
    open.push('Inferred relations outnumber direct relations; prioritize direct kinship wording for high-impact ties.');
  }
  if (lowGradeDirect > 0) {
    open.push(`This node has ${lowGradeDirect} direct claims still graded C/D; prioritize stronger corroboration before promotion.`);
  }
  if (uncertain > 0) {
    open.push(`This node has ${uncertain} uncertain claim(s); resolve contradiction pathways before canonical changes.`);
  }
  if (topShare >= 0.6 && ranked[0]) {
    open.push(`Source concentration is high (${Math.round(topShare * 100)}% of evidence mentions from ${ranked[0][0]}); diversify citations for resiliency.`);
  }
  if (!(person.offices_held || []).length && person.dy !== 'Modern') {
    open.push('Office/style semantics are still under-specified for this period and require title-source mapping.');
  }
  return open;
}

function makePersonDossier(person, allEdges, byPersonId, claimsByEdgeKey, inferenceByEdgeKey) {
  const relEdges = allEdges.filter(e => e.s === person.id || e.d === person.id);
  const parentEdges = relEdges.filter(e => e.t === 'parent' && e.d === person.id);
  const childEdges = relEdges.filter(e => e.t === 'parent' && e.s === person.id);
  const siblingEdges = relEdges.filter(e => e.t === 'sibling');
  const spouseEdges = relEdges.filter(e => e.t === 'spouse');
  const kinEdges = relEdges.filter(e => e.t === 'kin');

  const direct = relEdges.filter(e => e.c === 'c');
  const inferred = relEdges.filter(e => e.c === 'i');
  const uncertain = relEdges.filter(e => e.c === 'u');

  const gradeCounts = relEdges.reduce((acc, edge) => {
    const grade = edge.confidence_grade || '?';
    acc[grade] = (acc[grade] || 0) + 1;
    return acc;
  }, {});

  const aliases = unique([
    ...(person.aliases || []),
    ...((person.known_as || []).map(k => k.name))
  ]);

  const officeText = (person.offices_held || []).map(o => {
    const years = [o.start, o.end].filter(Boolean).join('-');
    const yearsText = years ? ` (${years})` : '';
    return `${o.office_id || o.label || 'office'}${yearsText}`;
  });

  const sourceList = sourceListForPerson(person, relEdges);
  const sourceCount = sourceList ? sourceList.split('\n').filter(Boolean).length : 0;
  const openQuestions = makeOpenQuestions(person, relEdges, parentEdges, aliases, sourceCount);
  const anchors = evidenceAnchorsForPerson(person, relEdges, claimsByEdgeKey, byPersonId);
  const inferenceLinks = inferenceLinksForPerson(person, relEdges, inferenceByEdgeKey);
  const concentration = sourceConcentration(relEdges);
  const concentrationList = concentration.ranked
    .slice(0, 5)
    .map(([id, count]) => `${id} (${count})`);

  const highPriorityPromotion = relEdges
    .filter(edge => edge.c === 'c' && ['A', 'B'].includes(edge.confidence_grade || ''))
    .map(edge => {
      const claim = claimsByEdgeKey.get(edgeKey(edge));
      if (!claim) return null;
      if ((claim.review_status || '').toLowerCase() === 'in_progress' && (claim.canonical_decision || '').toLowerCase() === 'pending') {
        return claim.claim_id || null;
      }
      return null;
    })
    .filter(Boolean);

  return `# Person Dossier

Person ID: \`${person.id}\`  
Last updated: \`${DATE}\`  
Research status: \`in_progress\`

## 1) Identity
- Canonical display name: ${person.nm || 'Unknown'}
- Regnal name(s): ${person.rg || 'Unknown'}
- Throne number / sovereign ordinal (if applicable): ${(person.n || []).join(', ') || 'Unknown'}
- Dynasty / house: ${person.dy || 'Unknown'}
- Gender: ${person.g || 'Unknown'}
- Language/script variants:
${formatList(aliases)}

## 2) Titles, styles, and offices
- Titles/styles (with period notes):
${formatList(person.titles || [])}
- Offices held:
${formatList(officeText)}
- Institution links:
- pending institution-link extraction

## 3) Timeline anchors
- Birth (date/place/source): ${person.yb || 'Unknown'} / ${person.pb || 'Unknown'}
- Accession or elevation events: reign ${formatDateRange(person.re)}
- Deposition/transition events: extraction pending explicit transition statements
- Death (date/place/source): ${person.yd || 'Unknown'} / ${person.pd || 'Unknown'}

## 4) Family and relationships
- Parents:
${formatList(parentEdges.map(e => relationText(e, byPersonId)))}
- Siblings:
${formatList(siblingEdges.map(e => relationText(e, byPersonId)))}
- Spouse(s)/consorts:
${formatList(spouseEdges.map(e => relationText(e, byPersonId)))}
- Children:
${formatList(childEdges.map(e => relationText(e, byPersonId)))}
- Collateral branch links:
${formatList(kinEdges.map(e => relationText(e, byPersonId)))}

## 5) Evidence summary
- Direct claims (\`c\`): ${direct.length}
- Inferred claims (\`i\`): ${inferred.length}
- Uncertain claims (\`u\`): ${uncertain.length}
- Grade distribution: A=${gradeCounts.A || 0}, B=${gradeCounts.B || 0}, C=${gradeCounts.C || 0}, D=${gradeCounts.D || 0}
- Evidence footprint: ${sourceCount} source IDs currently linked to this node/its relations.
- Source concentration (top 5 by evidence mention count):
${formatList(concentrationList)}
- Direct claim anchors (claim ID + locator):
${formatList(anchors.slice(0, 12))}
- Inference dossiers touching this node:
${formatList(inferenceLinks)}

## 6) Source list
${sourceList}

## 7) Open questions
${formatList(openQuestions)}

## 8) Notes for graph integration
- Required node field updates: source_refs completion, alias/transliteration normalization, and title/style enrichment.
- Required edge updates: promote verified direct A/B claims with explicit locators; keep i/u claims in research until corroboration hardening completes.
- Promotion-ready direct claim IDs (A/B with pending canonical decision): ${highPriorityPromotion.length ? highPriorityPromotion.join(', ') : 'none flagged in this pass'}.
`;
}

async function refreshPersonCoverageLedger(dataset) {
  const csv = parseCsv(await readFile(ledgerPath, 'utf8'));
  const header = csv[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  const dataIds = new Set(dataset.people.map(p => p.id));

  for (let i = 1; i < csv.length; i++) {
    const row = csv[i];
    const personId = row[idx.person_id];
    if (!dataIds.has(personId)) continue;
    row[idx.dossier_status] = 'in_progress';
    row[idx.last_updated] = DATE;
    row[idx.notes] = 'Phase 2 depth refresh completed: claim anchors, source concentration, and inference links added.';
  }
  await writeFile(ledgerPath, toCsv(csv), 'utf8');
}

async function main() {
  const dataset = getDataset('research');
  const byPersonId = byIdMap(dataset.people);
  const claimsByEdgeKey = await loadRelationshipClaims();
  const inferenceByEdgeKey = await loadInferenceTracker();
  await mkdir(peopleDir, { recursive: true });

  for (const person of dataset.people) {
    const content = makePersonDossier(person, dataset.edges, byPersonId, claimsByEdgeKey, inferenceByEdgeKey);
    await writeFile(join(peopleDir, `${person.id}.md`), content, 'utf8');
  }
  await refreshPersonCoverageLedger(dataset);
  console.log(`Person dossier refresh complete: ${dataset.people.length} files rewritten.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

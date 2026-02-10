#!/usr/bin/env node

import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDataset } from '../src/data/sovereigns.merge.js';
import { sourceById } from '../src/data/sources.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const researchDir = join(rootDir, 'docs', 'research-program');
const ledgerDir = join(researchDir, 'ledgers');
const peopleDir = join(researchDir, 'people');
const conceptDir = join(researchDir, 'concepts');
const archiveDir = join(ledgerDir, 'archive');

const UNDIRECTED_TYPES = new Set(['sibling', 'spouse', 'kin']);

const PERSON_HEADER = [
  'person_id',
  'display_name',
  'dynasty',
  'reign_or_role',
  'person_confidence',
  'source_refs_count',
  'aliases_count',
  'titles_count',
  'dossier_status',
  'dossier_file',
  'last_updated',
  'notes'
];

const RELATIONSHIP_HEADER = [
  'claim_id',
  'edge_key',
  'relation_type',
  'source_id',
  'target_id',
  'label',
  'confidence',
  'claim_type',
  'confidence_grade',
  'evidence_refs',
  'primary_source_id',
  'claim_excerpt',
  'citation_locator',
  'access_date',
  'review_status',
  'canonical_decision',
  'reviewer',
  'last_reviewed',
  'notes'
];

const INFERENCE_HEADER = [
  'edge_key',
  'relation_type',
  'source_id',
  'target_id',
  'label',
  'inference_class',
  'inference_rule',
  'confidence_grade',
  'evidence_refs',
  'dossier_status',
  'dossier_file',
  'last_updated',
  'notes'
];

const CONCEPT_HEADER = [
  'concept_id',
  'canonical_label',
  'category',
  'period_scope',
  'linked_people_count',
  'linked_sources_count',
  'status',
  'entry_file',
  'last_updated',
  'notes'
];

function parseDateArg(args) {
  const argDate = args.find(v => /^\d{4}-\d{2}-\d{2}$/.test(v));
  return argDate || new Date().toISOString().slice(0, 10);
}

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

function toCsv(header, rows) {
  const all = [header, ...rows.map(row => header.map(h => row[h] ?? ''))];
  return `${all.map(r => r.map(csvEscape).join(',')).join('\n')}\n`;
}

function isEmptyRow(row) {
  return !Object.values(row).some(v => String(v || '').trim() !== '');
}

function rowsFromCsv(csvRows, headerFallback) {
  if (!csvRows.length) return { header: headerFallback, rows: [] };
  const header = csvRows[0].length ? csvRows[0] : headerFallback;
  const rows = csvRows
    .slice(1)
    .map(r => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])))
    .filter(r => !isEmptyRow(r));
  return { header, rows };
}

async function readLedger(path, headerFallback) {
  try {
    const text = await readFile(path, 'utf8');
    return rowsFromCsv(parseCsv(text), headerFallback);
  } catch {
    return { header: headerFallback, rows: [] };
  }
}

function personIdNumber(id) {
  const n = Number(String(id || '').replace(/^P/, ''));
  return Number.isFinite(n) ? n : Number.MAX_SAFE_INTEGER;
}

function conceptIdNumber(id) {
  const n = Number(String(id || '').replace(/^CONCEPT-/, ''));
  return Number.isFinite(n) ? n : Number.MAX_SAFE_INTEGER;
}

function edgeKey(edge) {
  return `${edge.t}|${edge.s}|${edge.d}|${(edge.l || '').trim()}`;
}

function normalizedEdgeKey(type, sourceId, targetId, label = '') {
  if (UNDIRECTED_TYPES.has(type)) {
    const [a, b] = [sourceId, targetId].sort();
    return `${type}|${a}|${b}|${String(label || '').trim()}`;
  }
  return `${type}|${sourceId}|${targetId}|${String(label || '').trim()}`;
}

function stableEdgeSortKey(edge) {
  const label = (edge.l || '').trim();
  let s = edge.s;
  let d = edge.d;
  if (UNDIRECTED_TYPES.has(edge.t)) {
    [s, d] = [s, d].sort();
  }
  return `${edge.t}|${s}|${d}|${label}|${edge.c || ''}|${edge.claim_type || ''}|${edge.confidence_grade || ''}`;
}

function indexRows(rows, keyFn) {
  const map = new Map();
  rows.forEach(row => {
    const key = keyFn(row);
    if (!key) return;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(row);
  });
  return map;
}

function takeRow(map, key, used) {
  const list = map.get(key);
  if (!list || !list.length) return null;
  while (list.length) {
    const row = list.shift();
    if (!used.has(row)) {
      used.add(row);
      return row;
    }
  }
  return null;
}

function normalizeRefs(valueOrList) {
  if (Array.isArray(valueOrList)) {
    return [...new Set(valueOrList.filter(Boolean))];
  }
  if (!valueOrList) return [];
  return [...new Set(String(valueOrList).split('|').map(v => v.trim()).filter(Boolean))];
}

function parseClaimId(claimId) {
  const m = /^CLM-(\d+)$/.exec(String(claimId || ''));
  return m ? Number(m[1]) : null;
}

function toInferenceSlug(edge) {
  const key = normalizedEdgeKey(edge.t, edge.s, edge.d, edge.l || '');
  return key
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 140);
}

function relationText(edge, byId) {
  const src = byId.get(edge.s)?.nm || edge.s;
  const dst = byId.get(edge.d)?.nm || edge.d;
  if (edge.t === 'parent') return `${src} as parent of ${dst}`;
  return `${src} and ${dst}`;
}

function defaultClaimExcerpt(edge, byId) {
  const relText = relationText(edge, byId);
  const labelText = edge.l ? ` (${edge.l})` : '';
  if (edge.c === 'i') {
    return `Inferred ${edge.t}${labelText} relation modeled between ${relText}.`;
  }
  if (edge.c === 'u') {
    return `Contested ${edge.t}${labelText} relation retained for research comparison between ${relText}.`;
  }
  return `Direct ${edge.t}${labelText} relation recorded between ${relText}.`;
}

function defaultClaimType(edge) {
  if (edge.c === 'i') return 'inferred';
  if (edge.c === 'u') return 'contested';
  return 'direct';
}

function defaultGrade(edge) {
  if (edge.c === 'u') return 'D';
  if (edge.c === 'i') return 'C';
  return 'B';
}

function defaultReviewStatus(edge) {
  if (edge.c === 'c') return 'todo';
  return 'in_progress';
}

function defaultCanonicalDecision() {
  return 'pending';
}

function isRuleDerived(edge) {
  return normalizeRefs(edge.evidence_refs).includes('SRC-DERIVED-RULES')
    || String(edge.event_context || '').startsWith('derived:');
}

function parseConceptMeta(text) {
  const canonicalLabel = (text.match(/^- Primary label:\s*(.+)$/m)?.[1] || '').trim();
  const category = (text.match(/^Category:\s*`?([^`\n]+)`?/m)?.[1] || '').trim();
  const periodScopeLine = (text.match(/^- Historical scope and periodization:\s*(.*)$/m)?.[1] || '').trim();
  const lastUpdated = (text.match(/^Last updated:\s*`?(\d{4}-\d{2}-\d{2})`?/m)?.[1] || '').trim();

  const people = new Set();
  for (const m of text.matchAll(/`P\d+`/g)) people.add(m[0].slice(1, -1));

  const sources = new Set();
  for (const m of text.matchAll(/`SRC-[A-Z0-9-]+`/g)) sources.add(m[0].slice(1, -1));

  return {
    canonicalLabel,
    category,
    periodScopeLine,
    lastUpdated,
    linkedPeopleCount: people.size,
    linkedSourcesCount: sources.size
  };
}

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function makePersonDossierStub(person, date) {
  const sourceRefs = normalizeRefs(person.source_refs || []);
  const titleList = (person.titles || []).map(v => `- ${v}`).join('\n') || '- none recorded yet';
  const aliasList = (person.aliases || []).map(v => `- ${v}`).join('\n') || '- none recorded yet';
  const bio = String(person.bio || '').trim();
  return `# Person Dossier

Person ID: \`${person.id}\`  
Last updated: \`${date}\`  
Research status: \`in_progress\`

## 1) Identity
- Canonical display name: ${person.nm || person.id}
- Regnal name(s): ${person.rg || 'Unknown'}
- Dynasty / house: ${person.dy || 'Unknown'}
- Gender: ${person.g || 'Unknown'}
- Throne number(s): ${(person.n || []).join(', ') || 'Unknown'}

## 2) Titles and aliases
- Titles/styles:
${titleList}
- Alias/transliteration set:
${aliasList}

## 3) Timeline and notes
- Reign/rule windows: ${Array.isArray(person.re) && person.re.length ? person.re.map(r => `${r[0]}-${r[1]}`).join('; ') : 'Unknown'}
- Birth: ${person.yb || 'Unknown'} (${person.pb || 'Unknown'})
- Death: ${person.yd || 'Unknown'} (${person.pd || 'Unknown'})
- Biography summary:
${bio ? `- ${bio}` : '- Narrative summary pending expansion.'}

## 4) Evidence footprint
- Node-level source refs (${sourceRefs.length}):
${sourceRefs.length ? sourceRefs.map(id => {
  const src = sourceById.get(id);
  if (!src) return `- \`${id}\``;
  return `- \`${id}\`: ${src.title} [${src.quality}]`;
}).join('\n') : '- none recorded yet'}

## 5) Open research tasks
- Add claim-level anchors and locator excerpts for high-impact relationships.
- Expand title/office semantics and known-as variants.
- Confirm chronology with independent corroboration where current support is single-source.
`;
}

async function writeArchiveIfNeeded(filename, header, rows) {
  if (!rows.length) return '';
  await mkdir(archiveDir, { recursive: true });
  const path = join(archiveDir, filename);
  await writeFile(path, toCsv(header, rows), 'utf8');
  return path;
}

async function main() {
  const date = parseDateArg(process.argv.slice(2));
  const dataset = getDataset('research');
  const byId = new Map(dataset.people.map(p => [p.id, p]));

  await mkdir(ledgerDir, { recursive: true });
  await mkdir(peopleDir, { recursive: true });

  const personPath = join(ledgerDir, 'person-coverage.csv');
  const relationPath = join(ledgerDir, 'relationship-evidence-ledger.csv');
  const inferencePath = join(ledgerDir, 'inference-dossier-tracker.csv');
  const conceptPath = join(ledgerDir, 'concept-coverage.csv');

  const [personExisting, relationExisting, inferenceExisting, conceptExisting] = await Promise.all([
    readLedger(personPath, PERSON_HEADER),
    readLedger(relationPath, RELATIONSHIP_HEADER),
    readLedger(inferencePath, INFERENCE_HEADER),
    readLedger(conceptPath, CONCEPT_HEADER)
  ]);

  const personById = new Map(personExisting.rows.map(r => [r.person_id, r]));
  const sortedPeople = [...dataset.people].sort((a, b) => personIdNumber(a.id) - personIdNumber(b.id));
  const personRows = [];
  const createdPersonDossiers = [];
  for (const person of sortedPeople) {
    const prev = personById.get(person.id) || {};
    const row = {
      person_id: person.id,
      display_name: person.nm || prev.display_name || person.n || '',
      dynasty: person.dy || prev.dynasty || '',
      reign_or_role: person.rg || prev.reign_or_role || '',
      person_confidence: person.person_confidence || prev.person_confidence || '',
      source_refs_count: String(normalizeRefs(person.source_refs || []).length),
      aliases_count: String((person.aliases || []).length),
      titles_count: String((person.titles || []).length),
      dossier_status: prev.dossier_status || 'in_progress',
      dossier_file: prev.dossier_file || `docs/research-program/people/${person.id}.md`,
      last_updated: prev.last_updated || date,
      notes: prev.notes || 'Row reconciled with current research graph.'
    };
    personRows.push(row);

    const dossierPath = join(rootDir, row.dossier_file);
    if (!(await fileExists(dossierPath))) {
      await mkdir(dirname(dossierPath), { recursive: true });
      await writeFile(dossierPath, makePersonDossierStub(person, date), 'utf8');
      createdPersonDossiers.push(row.dossier_file);
      row.last_updated = date;
      row.notes = 'Auto-created dossier stub during graph↔ledger reconciliation.';
    }
  }

  // Inference tracker reconciliation first so relationship rows can point to dossier paths.
  const inferenceUsed = new Set();
  const inferenceExact = indexRows(inferenceExisting.rows, row => row.edge_key);
  const inferenceNorm = indexRows(inferenceExisting.rows, row => normalizedEdgeKey(
    row.relation_type,
    row.source_id,
    row.target_id,
    row.label
  ));

  const inferredEdges = dataset.edges
    .filter(edge => edge.c === 'i')
    .sort((a, b) => stableEdgeSortKey(a).localeCompare(stableEdgeSortKey(b)));

  const inferenceRows = [];
  for (const edge of inferredEdges) {
    const ek = edgeKey(edge);
    let prev = takeRow(inferenceExact, ek, inferenceUsed);
    if (!prev && UNDIRECTED_TYPES.has(edge.t)) {
      prev = takeRow(inferenceNorm, normalizedEdgeKey(edge.t, edge.s, edge.d, edge.l || ''), inferenceUsed);
    }
    const derived = isRuleDerived(edge);
    inferenceRows.push({
      edge_key: ek,
      relation_type: edge.t,
      source_id: edge.s,
      target_id: edge.d,
      label: edge.l || '',
      inference_class: prev?.inference_class || (derived ? 'rule-derived' : 'curated'),
      inference_rule: edge.inference_rule || prev?.inference_rule || '',
      confidence_grade: edge.confidence_grade || prev?.confidence_grade || defaultGrade(edge),
      evidence_refs: normalizeRefs(edge.evidence_refs).join('|'),
      dossier_status: prev?.dossier_status || 'in_progress',
      dossier_file: prev?.dossier_file || `docs/research-program/inferences/${toInferenceSlug(edge)}.md`,
      last_updated: prev?.last_updated || date,
      notes: prev?.notes || (derived
        ? 'Rule-derived inference tracked for pair-specific dossier verification.'
        : 'Curated inference tracked for pair-specific dossier verification.')
    });
  }
  const inferenceDossierByKey = new Map(inferenceRows.map(r => [r.edge_key, r.dossier_file]));

  // Relationship ledger reconciliation.
  const relationUsed = new Set();
  const relationExact = indexRows(relationExisting.rows, row => row.edge_key);
  const relationNorm = indexRows(relationExisting.rows, row => normalizedEdgeKey(
    row.relation_type,
    row.source_id,
    row.target_id,
    row.label
  ));
  const relationRows = [];
  const sortedEdges = [...dataset.edges].sort((a, b) => stableEdgeSortKey(a).localeCompare(stableEdgeSortKey(b)));

  const usedClaimIds = new Set();
  let claimCounter = relationExisting.rows.reduce((max, row) => {
    const n = parseClaimId(row.claim_id);
    return n && n > max ? n : max;
  }, 0);
  function nextClaimId() {
    claimCounter += 1;
    return `CLM-${String(claimCounter).padStart(4, '0')}`;
  }

  for (const edge of sortedEdges) {
    const ek = edgeKey(edge);
    let prev = takeRow(relationExact, ek, relationUsed);
    if (!prev && UNDIRECTED_TYPES.has(edge.t)) {
      prev = takeRow(relationNorm, normalizedEdgeKey(edge.t, edge.s, edge.d, edge.l || ''), relationUsed);
    }

    let claimId = prev?.claim_id || '';
    if (!parseClaimId(claimId) || usedClaimIds.has(claimId)) {
      claimId = nextClaimId();
    }
    usedClaimIds.add(claimId);

    const refs = normalizeRefs(edge.evidence_refs);
    const inferredDossier = inferenceDossierByKey.get(ek);
    const baseSourceId = refs[0] || prev?.primary_source_id || '';
    const defaultLocator = edge.c === 'i'
      ? inferredDossier
        ? `Inference basis documented in ${inferredDossier}.`
        : 'Inference basis documented in pair dossier (path pending).'
      : baseSourceId
        ? `Primary source ${baseSourceId}; this claim is documented in the relationship ledger row and queued for quote-level locator refinement.`
        : 'Primary source mapping pending for this claim row.';

    relationRows.push({
      claim_id: claimId,
      edge_key: ek,
      relation_type: edge.t,
      source_id: edge.s,
      target_id: edge.d,
      label: edge.l || '',
      confidence: edge.c || '',
      claim_type: edge.claim_type || prev?.claim_type || defaultClaimType(edge),
      confidence_grade: edge.confidence_grade || prev?.confidence_grade || defaultGrade(edge),
      evidence_refs: refs.join('|'),
      primary_source_id: refs.includes(prev?.primary_source_id) ? prev.primary_source_id : (refs[0] || prev?.primary_source_id || ''),
      claim_excerpt: prev?.claim_excerpt || defaultClaimExcerpt(edge, byId),
      citation_locator: prev?.citation_locator || defaultLocator,
      access_date: prev?.access_date || '',
      review_status: prev?.review_status || defaultReviewStatus(edge),
      canonical_decision: prev?.canonical_decision || defaultCanonicalDecision(),
      reviewer: prev?.reviewer || '',
      last_reviewed: prev?.last_reviewed || '',
      notes: prev?.notes || (edge.c === 'u'
        ? 'Conflicting/alternative claim retained in research mode for adjudication.'
        : edge.c === 'i'
          ? 'Inference claim tracked with pair-specific dossier linkage.'
          : 'Direct claim tracked in research ledger.')
    });
  }

  // Concept ledger reconciliation from concept files.
  const conceptById = new Map(conceptExisting.rows.map(r => [r.concept_id, r]));
  const conceptFiles = (await readdir(conceptDir))
    .filter(name => /^CONCEPT-\d+\.md$/.test(name))
    .sort((a, b) => conceptIdNumber(a.replace('.md', '')) - conceptIdNumber(b.replace('.md', '')));
  const conceptRows = [];
  for (const file of conceptFiles) {
    const conceptId = file.replace('.md', '');
    const relPath = `docs/research-program/concepts/${file}`;
    const fullPath = join(conceptDir, file);
    const text = await readFile(fullPath, 'utf8');
    const meta = parseConceptMeta(text);
    const prev = conceptById.get(conceptId) || {};
    conceptRows.push({
      concept_id: conceptId,
      canonical_label: meta.canonicalLabel || prev.canonical_label || conceptId,
      category: meta.category || prev.category || 'concept',
      period_scope: meta.periodScopeLine || prev.period_scope || 'periodization in concept dossier',
      linked_people_count: String(meta.linkedPeopleCount || Number(prev.linked_people_count || 0)),
      linked_sources_count: String(meta.linkedSourcesCount || Number(prev.linked_sources_count || 0)),
      status: prev.status || 'in_progress',
      entry_file: prev.entry_file || relPath,
      last_updated: meta.lastUpdated || prev.last_updated || date,
      notes: prev.notes || 'Row reconciled with concept dossier set.'
    });
  }

  // Archive stale rows for traceability.
  const stalePersonRows = personExisting.rows.filter(r => !byId.has(r.person_id));
  const activeEdgeKeys = new Set(sortedEdges.map(edge => edgeKey(edge)));
  const staleRelationRows = relationExisting.rows.filter(r => !activeEdgeKeys.has(r.edge_key));
  const activeInferenceKeys = new Set(inferredEdges.map(edge => edgeKey(edge)));
  const staleInferenceRows = inferenceExisting.rows.filter(r => !activeInferenceKeys.has(r.edge_key));
  const activeConceptIds = new Set(conceptRows.map(r => r.concept_id));
  const staleConceptRows = conceptExisting.rows.filter(r => !activeConceptIds.has(r.concept_id));

  const archivePaths = [];
  const personArchive = await writeArchiveIfNeeded(`person-coverage-stale-${date}.csv`, PERSON_HEADER, stalePersonRows);
  if (personArchive) archivePaths.push(personArchive);
  const relationArchive = await writeArchiveIfNeeded(`relationship-evidence-ledger-stale-${date}.csv`, RELATIONSHIP_HEADER, staleRelationRows);
  if (relationArchive) archivePaths.push(relationArchive);
  const inferenceArchive = await writeArchiveIfNeeded(`inference-dossier-tracker-stale-${date}.csv`, INFERENCE_HEADER, staleInferenceRows);
  if (inferenceArchive) archivePaths.push(inferenceArchive);
  const conceptArchive = await writeArchiveIfNeeded(`concept-coverage-stale-${date}.csv`, CONCEPT_HEADER, staleConceptRows);
  if (conceptArchive) archivePaths.push(conceptArchive);

  await Promise.all([
    writeFile(personPath, toCsv(PERSON_HEADER, personRows), 'utf8'),
    writeFile(relationPath, toCsv(RELATIONSHIP_HEADER, relationRows), 'utf8'),
    writeFile(inferencePath, toCsv(INFERENCE_HEADER, inferenceRows), 'utf8'),
    writeFile(conceptPath, toCsv(CONCEPT_HEADER, conceptRows), 'utf8')
  ]);

  console.log(`Reconciled ledgers for ${date}:`);
  console.log(`- people: ${personRows.length}`);
  console.log(`- relationships: ${relationRows.length}`);
  console.log(`- inferences: ${inferenceRows.length}`);
  console.log(`- concepts: ${conceptRows.length}`);
  console.log(`- created person dossier stubs: ${createdPersonDossiers.length}`);
  if (archivePaths.length) {
    console.log(`- archived stale ledgers: ${archivePaths.length}`);
    archivePaths.forEach(path => console.log(`  - ${path}`));
  } else {
    console.log('- archived stale ledgers: 0');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

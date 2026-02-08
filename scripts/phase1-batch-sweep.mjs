#!/usr/bin/env node

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDataset } from '../src/data/sovereigns.merge.js';
import { inferenceEdgeKey } from '../src/data/inference-notes.js';
import { sourceById } from '../src/data/sources.js';

const DATE = '2026-02-08';
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const researchDir = join(rootDir, 'docs', 'research-program');
const peopleDir = join(researchDir, 'people');
const conceptsDir = join(researchDir, 'concepts');
const inferenceDir = join(researchDir, 'inferences');
const ledgerDir = join(researchDir, 'ledgers');

const BATCH_OWNER = 'phase1-batch-sweep';
const phase1PrimaryTargets = [
  'SRC-TUFS-TARIKH-DIBA-MAHALL-FACSIMILE',
  'SRC-TUFS-TARIKH-DIBA-MAHALL-ANNOT',
  'SRC-SARUNA-LOAMAAFANU-1982',
  'SRC-SARUNA-RAADHAVALHI-1985',
  'SRC-SARUNA-PYRARD-V2P2-1887',
  'SRC-CORNELL-PYRARD-V1-1887',
  'SRC-HEIDELBERG-BELL-1883',
  'SRC-MRF-KINGS',
  'SRC-MRF-HILAALY',
  'SRC-ARCHIVES-LAW-16-2011',
  'SRC-ARCHIVES-RECORDS-DISPOSAL'
];

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

function personLabel(byId, id) {
  const p = byId.get(id);
  if (!p) return id;
  const name = p.nm || '(unnamed)';
  const reg = p.rg ? ` (${p.rg})` : '';
  return `${id} ${name}${reg}`;
}

function unique(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function formatDateRange(reignRanges) {
  if (!Array.isArray(reignRanges) || !reignRanges.length) return 'Unknown';
  return reignRanges.map(r => `${r[0]}-${r[1]}`).join('; ');
}

function formatList(items) {
  if (!items.length) return '- none recorded';
  return items.map(v => `- ${v}`).join('\n');
}

function relationText(edge, byId) {
  const source = personLabel(byId, edge.s);
  const target = personLabel(byId, edge.d);
  const label = edge.l ? ` [${edge.l}]` : '';
  return `${edge.t} ${source} -> ${target}${label} (${edge.c})`;
}

function makePersonDossier(person, allEdges, byPersonId) {
  const relEdges = allEdges.filter(e => e.s === person.id || e.d === person.id);
  const parentEdges = relEdges.filter(e => e.t === 'parent' && e.d === person.id);
  const childEdges = relEdges.filter(e => e.t === 'parent' && e.s === person.id);
  const siblingEdges = relEdges.filter(e => e.t === 'sibling');
  const spouseEdges = relEdges.filter(e => e.t === 'spouse');
  const kinEdges = relEdges.filter(e => e.t === 'kin');
  const direct = relEdges.filter(e => e.c === 'c');
  const inferred = relEdges.filter(e => e.c === 'i');
  const uncertain = relEdges.filter(e => e.c === 'u');

  const relationSourceIds = unique(relEdges.flatMap(e => e.evidence_refs || []));
  const sourceIds = unique([
    ...(person.source_refs || []),
    ...relationSourceIds,
    ...phase1PrimaryTargets
  ]);

  const officeText = (person.offices_held || []).map(o => {
    const years = [o.start, o.end].filter(Boolean).join('-');
    const yearsText = years ? ` (${years})` : '';
    return `${o.office_id || o.label || 'office'}${yearsText}`;
  });

  const aliases = unique([
    ...(person.aliases || []),
    ...((person.known_as || []).map(k => k.name))
  ]);

  const sourcesList = sourceIds.map(id => {
    const s = sourceById.get(id);
    if (!s) return `- \`${id}\` (not yet in registry notes)`;
    return `- \`${id}\`: ${s.title} [${s.quality}]`;
  }).join('\n');

  const openQuestions = [];
  if (!(person.source_refs || []).length) {
    openQuestions.push('Direct person-level source_refs are still missing and need chronicle corroboration.');
  }
  if (!aliases.length) {
    openQuestions.push('No verified alternate name/transliteration set yet.');
  }
  if (!officeText.length) {
    openQuestions.push('No office/style assignment verified beyond regnal framing.');
  }
  if (!parentEdges.length) {
    openQuestions.push('Parentage is currently incomplete in model and requires source extraction.');
  }

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
- none recorded

## 3) Timeline anchors
- Birth (date/place/source): ${person.yb || 'Unknown'} / ${person.pb || 'Unknown'}
- Accession or elevation events: reign ${formatDateRange(person.re)}
- Deposition/transition events: not yet extracted for this node
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
- High-confidence (\`A/B\`) claims: ${direct.length ? `${direct.length} modeled relations currently marked direct.` : 'No direct relation edges currently attached.'}
- Inferred (\`C\`) claims: ${inferred.length ? `${inferred.length} inferred relations present and require pair-level dossier traceability.` : 'No inferred edges for this node.'}
- Uncertain/contested (\`D\`) claims: ${uncertain.length ? `${uncertain.length} uncertain/contested relations currently modeled.` : 'None currently attached.'}

## 6) Source list
${sourcesList}

## 7) Open questions
${formatList(openQuestions)}

## 8) Notes for graph integration
- Required node field updates: source_refs backfill; aliases/transliteration enrichment; title/style notes.
- Required edge updates: corroborate direct and inferred bridge claims with chronicle-backed locators.
- Promotion readiness: not ready for canonical promotion change this batch.
`;
}

function derivedLogic(edge, byPersonId) {
  const basis = edge.inference_basis || {};
  const lines = [];

  if (edge.inference_rule === 'parent-of-parent-grandparent') {
    const parentEdges = basis.parent_edges || [];
    const via = basis.via_parent ? personLabel(byPersonId, basis.via_parent) : 'an intermediate parent node';
    if (parentEdges[0]) {
      lines.push(`Supporting edge: parent ${personLabel(byPersonId, parentEdges[0].s)} -> ${personLabel(byPersonId, parentEdges[0].d)}.`);
    }
    if (parentEdges[1]) {
      lines.push(`Supporting edge: parent ${personLabel(byPersonId, parentEdges[1].s)} -> ${personLabel(byPersonId, parentEdges[1].d)}.`);
    }
    lines.push(`By the parent-of-parent rule via ${via}, the source node is inferred as grandparent-level kin of the target node.`);
    return lines;
  }

  if (edge.inference_rule === 'parent-sibling-aunt-uncle') {
    const support = basis.supporting_edges || [];
    const viaParent = basis.via_parent ? personLabel(byPersonId, basis.via_parent) : 'the child parent node';
    const viaSib = basis.via_parent_sibling ? personLabel(byPersonId, basis.via_parent_sibling) : 'the parent sibling node';
    if (support[0]) {
      lines.push(`Supporting edge: parent ${personLabel(byPersonId, support[0].s)} -> ${personLabel(byPersonId, support[0].d)}.`);
    }
    if (support[1]) {
      lines.push(`Supporting edge: sibling ${personLabel(byPersonId, support[1].s)} <-> ${personLabel(byPersonId, support[1].d)}.`);
    }
    lines.push(`Because ${viaSib} is sibling to ${viaParent}, the modeled relation to the child branch is inferred as aunt/uncle↔niece/nephew kin.`);
    return lines;
  }

  if (edge.inference_rule === 'children-of-siblings-cousin') {
    const cps = basis.child_parent_edges || [];
    if (cps[0]) lines.push(`Supporting edge: parent ${personLabel(byPersonId, cps[0].s)} -> ${personLabel(byPersonId, cps[0].d)}.`);
    if (cps[1]) lines.push(`Supporting edge: parent ${personLabel(byPersonId, cps[1].s)} -> ${personLabel(byPersonId, cps[1].d)}.`);
    if (basis.parent_sibling_edge) {
      lines.push(`Supporting edge: sibling ${personLabel(byPersonId, basis.parent_sibling_edge.s)} <-> ${personLabel(byPersonId, basis.parent_sibling_edge.d)}.`);
    }
    lines.push('Children of sibling parents are inferred as cousins in this model.');
    return lines;
  }

  if (edge.inference_rule === 'shared-parent-sibling') {
    if (basis.shared_parent) {
      lines.push(`Supporting node: shared parent ${personLabel(byPersonId, basis.shared_parent)}.`);
    }
    const pe = basis.parent_edges || [];
    pe.forEach(e => {
      lines.push(`Supporting edge: parent ${personLabel(byPersonId, e.s)} -> ${personLabel(byPersonId, e.d)}.`);
    });
    lines.push('Children sharing the same parent are inferred as siblings in this model.');
    return lines;
  }

  lines.push('Inference basis metadata indicates a derived family-rule relation for this pair.');
  return lines;
}

function makeDerivedInferenceDossier(edge, byPersonId) {
  const source = personLabel(byPersonId, edge.s);
  const target = personLabel(byPersonId, edge.d);
  const sources = (edge.evidence_refs || []).map(id => {
    const s = sourceById.get(id);
    const title = s ? s.title : 'Unknown source';
    return `- \`${id}\` (${title})`;
  }).join('\n') || '- none';

  const logicLines = derivedLogic(edge, byPersonId)
    .map((line, idx) => `${idx + 1}. ${line}`)
    .join('\n');

  return `# Inference Dossier

Edge key: \`${inferenceEdgeKey(edge)}\`  
Last updated: \`${DATE}\`  
Inference class: \`rule-derived\`

## 1) Edge identity
- Relation type: ${edge.t}
- Source node: ${source}
- Target node: ${target}
- Label: ${edge.l || '(no label)'}
- Current confidence marker (\`c/i/u\`): ${edge.c}
- Current grade (\`A/B/C/D\`): ${edge.confidence_grade || 'C'}

## 2) Why this specific pair is modeled
- Pair summary: This pair is derived from explicit modeled family edges using rule \`${edge.inference_rule || 'derived-rule'}\`.
- Historical/dynastic context: ${byPersonId.get(edge.s)?.dy || 'Unknown'} -> ${byPersonId.get(edge.d)?.dy || 'Unknown'} branch context.

## 3) Logic chain (pair-specific)
${logicLines}
4. Reason this implies the modeled relation for this exact pair: The derived-rule chain currently supports this pair as a reversible inferred relation.

## 4) Alternative interpretations
- Plausible competing relation class: broader \`kin\` with no precise generational label.
- Why current model is preferred: existing direct parent/sibling edges already encode enough structure for this derived relation.
- What evidence would switch interpretation: direct source wording that contradicts one or more supporting parent/sibling edges.

## 5) Verification checklist
- Evidence needed to promote to confirmed: explicit text stating this exact relation class for this exact pair.
- Evidence that would downgrade/remove: changes or contradictions in any supporting source edge in inference basis.
- Re-check interval: every ingest batch that changes parent/sibling edges.

## 6) Source basis
${sources}
- Claim excerpt notes: derived from inference basis metadata in edge object and supporting source-backed parent/sibling edges.

## 7) Integration notes
- \`src/data/inference-notes.js\` summary update needed: no
- Edge label/type update needed: only if direct textual evidence becomes available
- Canonical promotion candidate: no
`;
}

function parseEvidenceRefs(value) {
  if (!value) return [];
  return String(value).split('|').map(v => v.trim()).filter(Boolean);
}

function claimExcerptFor(row, edge, byPersonId, idx) {
  const sourceId = row[idx.source_id];
  const targetId = row[idx.target_id];
  const source = personLabel(byPersonId, sourceId);
  const target = personLabel(byPersonId, targetId);
  const rel = row[idx.relation_type] || edge?.t || 'relation';
  const label = row[idx.label] || edge?.l;
  const labelText = label ? ` (${label})` : '';

  if (edge?.c === 'i') {
    return `Inferred ${rel} relation${labelText} between ${source} and ${target} from modeled rule chain ${edge.inference_rule || 'inference metadata'}.`;
  }
  if (rel === 'parent') return `Modeled parent relation: ${source} -> ${target}.`;
  if (rel === 'sibling') return `Modeled sibling relation${labelText}: ${source} <-> ${target}.`;
  if (rel === 'spouse') return `Modeled spouse relation${labelText}: ${source} <-> ${target}.`;
  if (rel === 'kin') return `Modeled kin relation${labelText}: ${source} <-> ${target}.`;
  return `Modeled ${rel} relation${labelText}: ${source} <-> ${target}.`;
}

function citationLocatorFor(row, edge, idx, inferenceDossierByKey) {
  if (edge?.inference_rule) {
    const dossier = inferenceDossierByKey.get(inferenceEdgeKey(edge));
    return dossier
      ? `Inference basis: ${edge.inference_rule} (see ${dossier}).`
      : `Inference basis: ${edge.inference_rule}.`;
  }
  const primary = row[idx.primary_source_id];
  if (primary) {
    return `${primary} locator extraction pending in source sweep.`;
  }
  const refs = parseEvidenceRefs(row[idx.evidence_refs]);
  if (refs.length) {
    return `${refs[0]} locator extraction pending in source sweep.`;
  }
  return 'Locator pending source assignment.';
}

function claimNoteForType(claimType) {
  if (claimType === 'inferred') {
    return 'Backfilled from inference metadata and queued for pair-specific verification.';
  }
  if (claimType === 'direct') {
    return 'Direct claim moved to in_progress for locator extraction.';
  }
  if (claimType === 'uncertain') {
    return 'Contested claim moved to in_progress for contradiction adjudication and locator extraction.';
  }
  return 'Claim moved to in_progress during batch sweep.';
}

const conceptSourceMap = new Map([
  ['CONCEPT-001', ['SRC-TUFS-TARIKH-DIBA-MAHALL-FACSIMILE', 'SRC-SARUNA-RAADHAVALHI-1985', 'SRC-MRF-KINGS']],
  ['CONCEPT-002', ['SRC-SARUNA-PYRARD-V2P2-1887', 'SRC-CORNELL-PYRARD-V1-1887', 'SRC-MRF-TITLES']],
  ['CONCEPT-003', ['SRC-MRF-TITLES', 'SRC-MRF-KINGS', 'SRC-HEIDELBERG-BELL-1883']],
  ['CONCEPT-004', ['SRC-WIKI-MAUMOON', 'SRC-WIKI-NASHEED', 'SRC-WIKI-MUIZZU']],
  ['CONCEPT-005', ['SRC-SARUNA-LOAMAAFANU-1982', 'SRC-TUFS-TARIKH-DIBA-MAHALL-FACSIMILE', 'SRC-SARUNA-RAADHAVALHI-1985']],
  ['CONCEPT-006', ['SRC-SARUNA-PYRARD-V2P2-1887', 'SRC-CORNELL-PYRARD-V1-1887', 'SRC-HEIDELBERG-BELL-1883']],
  ['CONCEPT-007', ['SRC-MRF-TITLES', 'SRC-SARUNA-PYRARD-V2P2-1887', 'SRC-CORNELL-PYRARD-V1-1887']],
  ['CONCEPT-008', ['SRC-TUFS-TARIKH-DIBA-MAHALL-FACSIMILE', 'SRC-SARUNA-RAADHAVALHI-1985', 'SRC-MRF-KINGS']]
]);

function makeConceptEntry(row, idx, sourceIds) {
  const sourceLines = sourceIds.map(id => {
    const s = sourceById.get(id);
    if (!s) return `- \`${id}\``;
    return `- \`${id}\`: ${s.title} [${s.quality}]`;
  }).join('\n') || '- none assigned';

  return `# Concept Entry

Concept ID: \`${row[idx.concept_id]}\`  
Last updated: \`${DATE}\`  
Category: \`${row[idx.category]}\`

## 1) Canonical label
- Primary label: ${row[idx.canonical_label] || 'Unknown'}
- Alternate labels/spellings: to be expanded during extraction
- Language/script forms: to be expanded during extraction

## 2) Definition
- Short definition: Working definition drafted for Phase 1; refine after locator extraction.
- Historical scope and periodization: ${row[idx.period_scope] || 'Unknown'}
- Why it matters in this genealogy graph: This concept affects relation interpretation, title semantics, and confidence adjudication.

## 3) Semantic and historical notes
- Functional meaning by period: Pending primary-source extraction and periodized notes.
- Rank/status implications: Pending office and title evidence mapping.
- Known changes in role or usage: Pending contradiction and terminology pass.

## 4) Person and event links
- Linked people (\`P...\`): to be mapped in Phase 3 concept deep pass.
- Linked offices/institutions: to be mapped in concept-office reconciliation.
- Linked transitions/events: to be mapped in contradiction and promotion queue pass.

## 5) Evidence
- Primary sources: listed below.
- Secondary/specialist sources: listed below where applicable.
- Conflicting definitions: unresolved; track in contradiction log when encountered.

## 6) Source list
${sourceLines}

## 7) Open questions
- Missing evidence: exact locator-level excerpts are still pending.
- Etymology uncertainty: term-history and language-shift notes pending.
- Terminology ambiguity: rank/function overlap requires period-specific disambiguation.
`;
}

async function sweepPersonCoverageAndDossiers(dataset) {
  const path = join(ledgerDir, 'person-coverage.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  const byPersonId = byIdMap(dataset.people);
  await mkdir(peopleDir, { recursive: true });

  let updated = 0;
  let missing = 0;
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row[idx.dossier_status] !== 'todo') continue;
    const person = byPersonId.get(row[idx.person_id]);
    if (!person) {
      missing += 1;
      row[idx.last_updated] = DATE;
      row[idx.notes] = 'Batch sweep: person not found in dataset.';
      continue;
    }
    const content = makePersonDossier(person, dataset.edges, byPersonId);
    const target = row[idx.dossier_file] ? join(rootDir, row[idx.dossier_file]) : join(peopleDir, `${row[idx.person_id]}.md`);
    await writeFile(target, content, 'utf8');
    row[idx.dossier_status] = 'in_progress';
    row[idx.last_updated] = DATE;
    row[idx.notes] = 'Phase 1 batch sweep dossier draft created.';
    updated += 1;
  }
  await writeFile(path, toCsv(rows), 'utf8');
  return { updated, missing };
}

async function sweepInferenceTrackerAndDossiers(dataset) {
  const path = join(ledgerDir, 'inference-dossier-tracker.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  const byPersonId = byIdMap(dataset.people);
  const keyToEdge = new Map(dataset.edges.map(e => [inferenceEdgeKey(e), e]));
  await mkdir(inferenceDir, { recursive: true });

  let updated = 0;
  let missingEdges = 0;
  const inferenceDossierByKey = new Map();
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const key = row[idx.edge_key];
    if (row[idx.dossier_file]) {
      inferenceDossierByKey.set(key, row[idx.dossier_file]);
    }
    if (row[idx.dossier_status] !== 'todo') continue;
    const edge = keyToEdge.get(key);
    if (!edge) {
      missingEdges += 1;
      row[idx.last_updated] = DATE;
      row[idx.notes] = 'Batch sweep: edge key missing from dataset.';
      continue;
    }
    const content = makeDerivedInferenceDossier(edge, byPersonId);
    const target = row[idx.dossier_file] ? join(rootDir, row[idx.dossier_file]) : join(inferenceDir, `${key.replace(/[|/]+/g, '-').toLowerCase()}.md`);
    await writeFile(target, content, 'utf8');
    row[idx.dossier_status] = 'in_progress';
    row[idx.last_updated] = DATE;
    row[idx.notes] = 'Phase 1 batch sweep derived dossier drafted.';
    if (!row[idx.dossier_file]) {
      row[idx.dossier_file] = target.replace(`${rootDir}/`, '');
      inferenceDossierByKey.set(key, row[idx.dossier_file]);
    }
    updated += 1;
  }
  await writeFile(path, toCsv(rows), 'utf8');
  return { updated, missingEdges, inferenceDossierByKey };
}

async function sweepRelationshipLedger(dataset, inferenceDossierByKey) {
  const path = join(ledgerDir, 'relationship-evidence-ledger.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  const byPersonId = byIdMap(dataset.people);
  const keyToEdge = new Map(dataset.edges.map(e => [inferenceEdgeKey(e), e]));

  let updated = 0;
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row[idx.review_status] !== 'todo') continue;
    const edge = keyToEdge.get(row[idx.edge_key]);
    row[idx.claim_excerpt] = row[idx.claim_excerpt] || claimExcerptFor(row, edge, byPersonId, idx);
    row[idx.citation_locator] = row[idx.citation_locator] || citationLocatorFor(row, edge, idx, inferenceDossierByKey);
    row[idx.access_date] = DATE;
    row[idx.review_status] = 'in_progress';
    row[idx.canonical_decision] = 'pending';
    row[idx.reviewer] = BATCH_OWNER;
    row[idx.last_reviewed] = DATE;
    row[idx.notes] = row[idx.notes] || claimNoteForType(row[idx.claim_type]);
    updated += 1;
  }
  await writeFile(path, toCsv(rows), 'utf8');
  return { updated };
}

async function sweepConceptCoverage() {
  const path = join(ledgerDir, 'concept-coverage.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  await mkdir(conceptsDir, { recursive: true });

  let updated = 0;
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row[idx.status] !== 'todo') continue;
    const sourceIds = conceptSourceMap.get(row[idx.concept_id]) || phase1PrimaryTargets.slice(0, 3);
    const content = makeConceptEntry(row, idx, sourceIds);
    const target = row[idx.entry_file] ? join(rootDir, row[idx.entry_file]) : join(conceptsDir, `${row[idx.concept_id]}.md`);
    await writeFile(target, content, 'utf8');
    row[idx.status] = 'in_progress';
    row[idx.linked_sources_count] = String(sourceIds.length);
    row[idx.last_updated] = DATE;
    row[idx.notes] = 'Phase 1 batch sweep concept entry draft created.';
    updated += 1;
  }
  await writeFile(path, toCsv(rows), 'utf8');
  return { updated };
}

async function sweepSourceQueue() {
  const path = join(ledgerDir, 'source-expansion-queue.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));

  let updated = 0;
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row[idx.status] !== 'pending') continue;
    row[idx.status] = 'in_progress';
    row[idx.last_updated] = DATE;
    row[idx.owner] = BATCH_OWNER;
    row[idx.notes] = row[idx.notes]
      ? `${row[idx.notes]} Batch sweep moved this queue row to active.`
      : 'Batch sweep moved this queue row to active.';
    updated += 1;
  }
  await writeFile(path, toCsv(rows), 'utf8');
  return { updated };
}

async function sweepSourceExtractLog() {
  const path = join(ledgerDir, 'source-extract-log.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));

  let updated = 0;
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row[idx.extract_status] !== 'pending') continue;
    row[idx.extract_status] = 'in_progress';
    row[idx.date] = DATE;
    row[idx.researcher] = BATCH_OWNER;
    row[idx.notes] = row[idx.notes]
      ? `${row[idx.notes]} Batch sweep moved this extract row to active.`
      : 'Batch sweep moved this extract row to active.';
    updated += 1;
  }
  await writeFile(path, toCsv(rows), 'utf8');
  return { updated };
}

async function main() {
  const dataset = getDataset('research');
  const peopleResult = await sweepPersonCoverageAndDossiers(dataset);
  const inferenceResult = await sweepInferenceTrackerAndDossiers(dataset);
  const relationshipResult = await sweepRelationshipLedger(dataset, inferenceResult.inferenceDossierByKey);
  const conceptResult = await sweepConceptCoverage();
  const queueResult = await sweepSourceQueue();
  const extractResult = await sweepSourceExtractLog();

  console.log(`Phase 1 batch sweep complete:
- people dossiers advanced: ${peopleResult.updated} (missing people: ${peopleResult.missing})
- inference dossiers advanced: ${inferenceResult.updated} (missing edges: ${inferenceResult.missingEdges})
- relationship claims advanced: ${relationshipResult.updated}
- concept entries advanced: ${conceptResult.updated}
- source queue rows activated: ${queueResult.updated}
- source extract rows activated: ${extractResult.updated}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

#!/usr/bin/env node

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDataset } from '../src/data/sovereigns.merge.js';
import { getCuratedInferenceNote, inferenceEdgeKey } from '../src/data/inference-notes.js';
import { sourceById } from '../src/data/sources.js';

const DATE = '2026-02-08';
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const researchDir = join(rootDir, 'docs', 'research-program');
const peopleDir = join(researchDir, 'people');
const inferenceDir = join(researchDir, 'inferences');
const ledgerDir = join(researchDir, 'ledgers');

const personIds = ['P11', 'P12', 'P13', 'P14', 'P15', 'P16', 'P17', 'P18', 'P19', 'P20'];
const phase1PrimaryTargets = [
  'SRC-TUFS-TARIKH-DIBA-MAHALL-FACSIMILE',
  'SRC-SARUNA-LOAMAAFANU-1982',
  'SRC-SARUNA-RAADHAVALHI-1985',
  'SRC-SARUNA-PYRARD-V2P2-1887',
  'SRC-CORNELL-PYRARD-V1-1887'
];

const inferenceTargetKeys = new Set([
  'sibling|P16|P17|brothers',
  'sibling|P19|P25|half-siblings',
  'sibling|P6|P8|brothers',
  'sibling|P31|P39|brothers',
  'sibling|P31|P40|brothers',
  'kin|P31|P32|uncle→nephew',
  'sibling|P47|P50|brothers',
  'sibling|P47|P51|brothers',
  'sibling|P47|P52|brothers',
  'sibling|P50|P51|brothers',
  'sibling|P50|P52|brothers',
  'sibling|P78|P79|brothers'
]);

const relationshipUpdates = new Map([
  ['CLM-0263', {
    claim_excerpt: 'Kings list gives P14 as son of P13 in the early Lunar succession sequence.',
    citation_locator: 'SRC-MRF-KINGS entries #13-#14 lineage note',
    notes: 'Direct edge pending chronicle corroboration.'
  }],
  ['CLM-0264', {
    claim_excerpt: 'P13 to P15 parent edge is inferred from explicit P13->P14 plus brother relation P14-P15.',
    citation_locator: 'Inference synthesis from SRC-MRF-KINGS entries #13-#15',
    notes: 'Pair-specific inference dossier exists for this edge.'
  }],
  ['CLM-0285', {
    claim_excerpt: 'Kings list states P16 as son of P15.',
    citation_locator: 'SRC-MRF-KINGS entries #15-#16 parentage note',
    notes: 'Direct edge; corroboration target in P0 chronicle extraction.'
  }],
  ['CLM-0286', {
    claim_excerpt: 'Kings list states P17 as son of P15.',
    citation_locator: 'SRC-MRF-KINGS entries #15-#17 parentage note',
    notes: 'Direct edge; corroboration target in P0 chronicle extraction.'
  }],
  ['CLM-0294', {
    claim_excerpt: "Kings list contains ambiguous wording around P18 as 'son of P16' versus maternal half-brother framing.",
    citation_locator: 'SRC-MRF-KINGS entries #16-#18 contested parentage wording',
    notes: 'Kept as contested (u/D) until stronger corroboration resolves direction.'
  }],
  ['CLM-0316', {
    claim_excerpt: 'Kings list gives P19 as child of P18.',
    citation_locator: 'SRC-MRF-KINGS entries #18-#19 lineage note',
    notes: 'Direct edge; supports Khadijah-era sibling cluster mapping.'
  }],
  ['CLM-0317', {
    claim_excerpt: 'Kings list gives P20 (Khadijah) as child of P18.',
    citation_locator: 'SRC-MRF-KINGS entries #18-#20 lineage note',
    notes: 'Direct edge; used in multi-accession monarch cluster.'
  }],
  ['CLM-0318', {
    claim_excerpt: 'Kings list gives P25 as child of P18 in the same household branch.',
    citation_locator: 'SRC-MRF-KINGS entries #18 and #25 lineage note',
    notes: 'Supports sibling/half-sibling subgraph for P19/P20/P25.'
  }],
  ['CLM-0374', {
    claim_excerpt: 'Kings list marks P11 and P12 as sharing the same mother.',
    citation_locator: 'SRC-MRF-KINGS entries #11-#12 maternal note',
    notes: 'Direct sibling edge with maternal qualifier.'
  }],
  ['CLM-0386', {
    claim_excerpt: 'Kings list marks P14 and P15 as brothers.',
    citation_locator: 'SRC-MRF-KINGS entries #14-#15 kin annotation',
    notes: 'Used as support for inferred parent P13->P15.'
  }],
  ['CLM-0407', {
    claim_excerpt: 'P16 to P17 sibling edge is inferred from shared parent P15.',
    citation_locator: 'Inference synthesis from SRC-MRF-KINGS parent edges P15->P16 and P15->P17',
    notes: 'Pair-specific inference dossier created in batch B.'
  }],
  ['CLM-0408', {
    claim_excerpt: 'Kings list marks P16 and P18 as half-brothers (maternal).',
    citation_locator: 'SRC-MRF-KINGS entries #16-#18 kin annotation',
    notes: 'Direct sibling edge retained with maternal qualifier.'
  }],
  ['CLM-0417', {
    claim_excerpt: 'Kings list marks P19 and P20 as siblings.',
    citation_locator: 'SRC-MRF-KINGS entries #19-#20 kin annotation',
    notes: 'Direct sibling edge in Khadijah branch cluster.'
  }],
  ['CLM-0418', {
    claim_excerpt: 'P19 to P25 half-sibling edge is inferred from shared father P18 and differentiated maternal lines in cluster notes.',
    citation_locator: 'Inference synthesis from SRC-MRF-KINGS entries #19/#20/#25',
    notes: 'Pair-specific inference dossier created in batch B.'
  }],
  ['CLM-0427', {
    claim_excerpt: 'Kings list marks P20 and P25 as half-sisters.',
    citation_locator: 'SRC-MRF-KINGS entries #20 and #25 kin annotation',
    notes: 'Direct half-sibling edge in Lunar late cluster.'
  }],
  ['CLM-0468', {
    claim_excerpt: 'Kings list records P20 marriage to P21.',
    citation_locator: 'SRC-MRF-KINGS entry #20 spouse note (first consort)',
    notes: 'Spousal edge supports accession-cycle context.'
  }],
  ['CLM-0469', {
    claim_excerpt: 'Kings list records P20 marriage to P23.',
    citation_locator: 'SRC-MRF-KINGS entry #20 spouse note (second consort)',
    notes: 'Spousal edge supports accession-cycle context.'
  }]
]);

const queueUpdates = new Map([
  ['SRCQ-006', {
    status: 'in_progress',
    owner: 'phase1-batch-b',
    notes: 'Extract office and protocol terminology with chapter/page locators; see EXT-006.'
  }],
  ['SRCQ-007', {
    status: 'in_progress',
    owner: 'phase1-batch-b',
    notes: 'Pair with volume II claims before promoting; see EXT-007.'
  }],
  ['SRCQ-008', {
    status: 'in_progress',
    owner: 'phase1-batch-b',
    notes: 'Treat as corroborative; not sole genealogical authority; see EXT-008.'
  }],
  ['SRCQ-009', {
    status: 'in_progress',
    owner: 'phase1-batch-b',
    notes: 'Use for interpretation layer and contradiction adjudication notes; see EXT-009.'
  }]
]);

const sourceExtractEntries = [
  {
    extract_id: 'EXT-006',
    source_id: 'SRC-SARUNA-PYRARD-V2P2-1887',
    date: DATE,
    extract_status: 'in_progress',
    target_scope: 'Court offices and governance terminology',
    claim_or_context_note: 'Travel narrative extraction started for office/title semantics and protocol vocabulary.',
    locator: 'saruna item 47e32876-8c1b-4f3d-91e8-75c6779d7eca metadata page',
    researcher: 'phase1-batch-b',
    notes: 'Feeds concept lexicon and office-role corroboration.'
  },
  {
    extract_id: 'EXT-007',
    source_id: 'SRC-CORNELL-PYRARD-V1-1887',
    date: DATE,
    extract_status: 'in_progress',
    target_scope: 'Early-modern institutional context',
    claim_or_context_note: 'Volume I extraction started for governance and social-order terminology index mapping.',
    locator: 'cornell catalog sea103a metadata page',
    researcher: 'phase1-batch-b',
    notes: 'To be paired with EXT-006 before promotion decisions.'
  },
  {
    extract_id: 'EXT-008',
    source_id: 'SRC-HEIDELBERG-BELL-1883',
    date: DATE,
    extract_status: 'in_progress',
    target_scope: 'Toponym/chronology corroboration',
    claim_or_context_note: 'Bell facsimile queued for corroborative chronology checks and title-style usage.',
    locator: 'heidelberg diglit bell1883 entry page',
    researcher: 'phase1-batch-b',
    notes: 'Corroborative layer only; not sole genealogical basis.'
  },
  {
    extract_id: 'EXT-009',
    source_id: 'SRC-STANDREWS-PEACOCK-2020',
    date: DATE,
    extract_status: 'in_progress',
    target_scope: 'Chronicle historiography and factional context',
    claim_or_context_note: 'Scholarly interpretation extraction started for contradiction adjudication context.',
    locator: 'st-andrews research portal publication record',
    researcher: 'phase1-batch-b',
    notes: 'Interpretive support for evidence narrative and conflict log.'
  }
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
- Required edge updates: corroborate direct and contested edges with chronicle or inscription-backed wording.
- Promotion readiness: not ready for canonical promotion change this batch.
`;
}

function makeInferenceDossier(edge, note, byPersonId) {
  const source = personLabel(byPersonId, edge.s);
  const target = personLabel(byPersonId, edge.d);
  const sources = (edge.evidence_refs || []).map(id => {
    const s = sourceById.get(id);
    const title = s ? s.title : 'Unknown source';
    return `- \`${id}\` (${title})`;
  }).join('\n') || '- none';

  const logicLines = (note?.logic || [
    'Pair-specific logic extraction pending.'
  ]).map((line, idx) => `${idx + 1}. ${line}`).join('\n');

  const verificationLines = (note?.verification || [
    'Gather direct relation wording for this pair.'
  ]).map(v => `- ${v}`).join('\n');

  const summary = note?.summary || 'Inference rationale pending detailed write-up.';
  const relationLabel = edge.l || '(no label)';

  return `# Inference Dossier

Edge key: \`${inferenceEdgeKey(edge)}\`  
Last updated: \`${DATE}\`  
Inference class: \`curated\`

## 1) Edge identity
- Relation type: ${edge.t}
- Source node: ${source}
- Target node: ${target}
- Label: ${relationLabel}
- Current confidence marker (\`c/i/u\`): ${edge.c}
- Current grade (\`A/B/C/D\`): ${edge.confidence_grade || 'C'}

## 2) Why this specific pair is modeled
- Pair summary: ${summary}
- Historical/dynastic context: ${byPersonId.get(edge.s)?.dy || 'Unknown'} -> ${byPersonId.get(edge.d)?.dy || 'Unknown'} branch continuity context.

## 3) Logic chain (pair-specific)
${logicLines}
4. Reason this implies the modeled relation for this exact pair: The current model supports this specific pair as the narrowest defensible relation without overstating direct lineage.

## 4) Alternative interpretations
- Plausible competing relation class: generic collateral \`kin\` or unresolved branch proximity.
- Why current model is preferred: It preserves the continuity signal while flagging uncertainty explicitly.
- What evidence would switch interpretation: direct source wording naming a specific relation class between these exact nodes.

## 5) Verification checklist
- Evidence needed to promote to confirmed: at least one explicit relation statement in an A/B source with locator.
- Evidence that would downgrade/remove: contradictory parentage or branch assignment in stronger sources.
- Re-check interval: every major source-ingestion batch.

## 6) Source basis
${sources}
- Claim excerpt notes: ledger claim row should include precise locator text in relationship evidence ledger.

## 7) Integration notes
- \`src/data/inference-notes.js\` summary update needed: no
- Edge label/type update needed: pending source extraction outcome
- Canonical promotion candidate: no

## 8) Verification actions
${verificationLines}
`;
}

async function updatePersonCoverageCsv() {
  const path = join(ledgerDir, 'person-coverage.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!personIds.includes(row[idx.person_id])) continue;
    row[idx.dossier_status] = 'in_progress';
    row[idx.last_updated] = DATE;
    row[idx.notes] = 'Phase 1 batch B dossier draft created.';
  }
  await writeFile(path, toCsv(rows), 'utf8');
}

async function updateInferenceTrackerCsv() {
  const path = join(ledgerDir, 'inference-dossier-tracker.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const key = row[idx.edge_key];
    if (!inferenceTargetKeys.has(key)) continue;
    row[idx.dossier_status] = 'in_progress';
    row[idx.last_updated] = DATE;
    row[idx.notes] = 'Phase 1 batch B dossier drafted.';
  }
  await writeFile(path, toCsv(rows), 'utf8');
}

async function updateRelationshipLedgerCsv() {
  const path = join(ledgerDir, 'relationship-evidence-ledger.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const claimId = row[idx.claim_id];
    const u = relationshipUpdates.get(claimId);
    if (!u) continue;
    row[idx.claim_excerpt] = u.claim_excerpt;
    row[idx.citation_locator] = u.citation_locator;
    row[idx.access_date] = DATE;
    row[idx.review_status] = 'in_progress';
    row[idx.canonical_decision] = 'pending';
    row[idx.reviewer] = 'phase1-batch-b';
    row[idx.last_reviewed] = DATE;
    row[idx.notes] = u.notes;
  }
  await writeFile(path, toCsv(rows), 'utf8');
}

async function updateSourceQueueCsv() {
  const path = join(ledgerDir, 'source-expansion-queue.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const id = row[idx.queue_id];
    const u = queueUpdates.get(id);
    if (!u) continue;
    row[idx.status] = u.status;
    row[idx.last_updated] = DATE;
    row[idx.owner] = u.owner;
    row[idx.notes] = u.notes;
  }
  await writeFile(path, toCsv(rows), 'utf8');
}

async function upsertSourceExtractLog() {
  const path = join(ledgerDir, 'source-extract-log.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  const byId = new Map();
  for (let i = 1; i < rows.length; i++) {
    byId.set(rows[i][idx.extract_id], i);
  }
  for (const entry of sourceExtractEntries) {
    const rowData = header.map(col => entry[col] ?? '');
    if (byId.has(entry.extract_id)) {
      rows[byId.get(entry.extract_id)] = rowData;
    } else {
      rows.push(rowData);
    }
  }
  const body = rows.slice(1).sort((a, b) => a[idx.extract_id].localeCompare(b[idx.extract_id], undefined, { numeric: true }));
  await writeFile(path, toCsv([header, ...body]), 'utf8');
}

async function writePersonDossiers(dataset) {
  const byPersonId = byIdMap(dataset.people);
  await mkdir(peopleDir, { recursive: true });
  for (const id of personIds) {
    const person = byPersonId.get(id);
    if (!person) continue;
    const content = makePersonDossier(person, dataset.edges, byPersonId);
    await writeFile(join(peopleDir, `${id}.md`), content, 'utf8');
  }
}

async function writeInferenceDossiers(dataset) {
  const byPersonId = byIdMap(dataset.people);
  await mkdir(inferenceDir, { recursive: true });
  const keyToEdge = new Map(dataset.edges.map(e => [inferenceEdgeKey(e), e]));
  const trackerRows = parseCsv(await readFile(join(ledgerDir, 'inference-dossier-tracker.csv'), 'utf8'));
  const trackerHeader = trackerRows[0];
  const idx = Object.fromEntries(trackerHeader.map((h, i) => [h, i]));

  for (let i = 1; i < trackerRows.length; i++) {
    const row = trackerRows[i];
    const key = row[idx.edge_key];
    if (!inferenceTargetKeys.has(key)) continue;
    const edge = keyToEdge.get(key);
    if (!edge) continue;
    const note = getCuratedInferenceNote(edge);
    const file = row[idx.dossier_file];
    const content = makeInferenceDossier(edge, note, byPersonId);
    await writeFile(join(rootDir, file), content, 'utf8');
  }
}

async function main() {
  const dataset = getDataset('research');
  await writePersonDossiers(dataset);
  await updatePersonCoverageCsv();
  await updateRelationshipLedgerCsv();
  await updateInferenceTrackerCsv();
  await writeInferenceDossiers(dataset);
  await updateSourceQueueCsv();
  await upsertSourceExtractLog();
  console.log('Phase 1 batch B complete: dossiers and ledgers updated.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

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

const personIds = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10'];
const phase1PrimaryTargets = [
  'SRC-TUFS-TARIKH-DIBA-MAHALL-FACSIMILE',
  'SRC-SARUNA-LOAMAAFANU-1982',
  'SRC-SARUNA-RAADHAVALHI-1985'
];

const inferenceTargetKeys = new Set([
  'kin|P104|P68|reported shared Utheemu lineage branch',
  'kin|P130|P132|possible southern-branch continuity (Addu/Fuvahmulah)',
  'kin|P132|P182|reported Addu/Meedhoo branch continuity',
  'kin|P110|P115|reported kin relation in elite Didi line',
  'kin|P111|P115|reported extended Didi lineage',
  'kin|P122|P168|reported first-cousin relation',
  'kin|P87|P92|uncle/nephew',
  'parent|P87|P129|',
  'parent|P80|P84|',
  'parent|P13|P15|',
  'sibling|P5|P7|brothers',
  'sibling|P5|P8|brothers'
]);

const relationshipUpdates = new Map([
  ['CLM-0001', {
    claim_excerpt: "Kings list marks P2 as nephew of Koimala P1 via Koimala's sister.",
    citation_locator: 'SRC-MRF-KINGS early sequence entries #1-#3 relationship notes',
    notes: 'Phase 1 extraction pending direct quote capture.'
  }],
  ['CLM-0141', {
    claim_excerpt: 'Kings list identifies P2 and P3 as cousin relation in succession chain.',
    citation_locator: 'SRC-MRF-KINGS early sequence entries #2-#3 relation annotation',
    notes: 'Cross-check against Tarikh and Raadhavalhi sources required.'
  }],
  ['CLM-0290', {
    claim_excerpt: 'Kings list gives P4 as son of Rekeihiriya Maava Kilege.',
    citation_locator: 'SRC-MRF-KINGS entry #4 parentage annotation',
    notes: 'Parent node P156 naming normalization still pending.'
  }],
  ['CLM-0291', {
    claim_excerpt: 'Kings list gives P9 as son of Hiriya Maava Kilege.',
    citation_locator: 'SRC-MRF-KINGS entry #9 parentage annotation',
    notes: 'Parent node P157 title parsing pending.'
  }],
  ['CLM-0292', {
    claim_excerpt: 'Kings list gives P10 as son of Volumidi Bodu Kilege.',
    citation_locator: 'SRC-MRF-KINGS entry #10 parentage annotation',
    notes: 'Parent node P158 title parsing pending.'
  }],
  ['CLM-0352', {
    claim_excerpt: 'Kings list sequence indicates P7 as father of P13.',
    citation_locator: 'SRC-MRF-KINGS entries #7 and #13 lineage note',
    notes: 'Should be corroborated with chronicle-based primary source.'
  }],
  ['CLM-0436', {
    claim_excerpt: 'Kings list explicitly notes P5 and P6 as brothers.',
    citation_locator: 'SRC-MRF-KINGS entries #5-#6 kin annotation',
    notes: 'Candidate for A/B corroboration upgrade after chronicle extraction.'
  }],
  ['CLM-0437', {
    claim_excerpt: 'P5 to P7 sibling edge is inferred from adjacent explicit brother links P5-P6 and P6-P7.',
    citation_locator: 'Inference synthesis from SRC-MRF-KINGS sibling chain entries #5-#7',
    notes: 'Pair-specific inference dossier created.'
  }],
  ['CLM-0438', {
    claim_excerpt: 'P5 to P8 sibling edge is inferred from sequenced brother chain P5-P6-P7-P8.',
    citation_locator: 'Inference synthesis from SRC-MRF-KINGS sibling chain entries #5-#8',
    notes: 'Pair-specific inference dossier created.'
  }],
  ['CLM-0442', {
    claim_excerpt: 'Kings list explicitly notes P6 and P7 as brothers.',
    citation_locator: 'SRC-MRF-KINGS entries #6-#7 kin annotation',
    notes: 'Candidate for corroboration with chronicle extracts.'
  }],
  ['CLM-0443', {
    claim_excerpt: 'P6 to P8 sibling edge is inferred from explicit P6-P7 and P7-P8 brother relations.',
    citation_locator: 'Inference synthesis from SRC-MRF-KINGS sibling chain entries #6-#8',
    notes: 'Inference remains C until pairwise explicit wording is found.'
  }],
  ['CLM-0446', {
    claim_excerpt: 'Kings list explicitly notes P7 and P8 as brothers.',
    citation_locator: 'SRC-MRF-KINGS entries #7-#8 kin annotation',
    notes: 'Supports transitive sibling inference completion across early Lunar cluster.'
  }]
]);

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
  const kinEdges = relEdges.filter(e => e.t === 'kin');
  const direct = relEdges.filter(e => e.c === 'c');
  const inferred = relEdges.filter(e => e.c === 'i');
  const uncertain = relEdges.filter(e => e.c === 'u');

  const relationSourceIds = unique(
    relEdges.flatMap(e => e.evidence_refs || [])
  );
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
- none recorded
- Children:
${formatList(childEdges.map(e => relationText(e, byPersonId)))}
- Collateral branch links:
${formatList(kinEdges.map(e => relationText(e, byPersonId)))}

## 5) Evidence summary
- High-confidence (\`A/B\`) claims: ${direct.length ? `${direct.length} modeled relations currently marked direct.` : 'No direct relation edges currently attached.'}
- Inferred (\`C\`) claims: ${inferred.length ? `${inferred.length} inferred relations present and require pair-level dossier traceability.` : 'No inferred edges for this node.'}
- Uncertain/contested (\`D\`) claims: ${uncertain.length ? `${uncertain.length} uncertain relations currently modeled.` : 'None currently attached.'}

## 6) Source list
${sourcesList}

## 7) Open questions
${formatList(openQuestions)}

## 8) Notes for graph integration
- Required node field updates: source_refs backfill; aliases/transliteration enrichment; title/style notes.
- Required edge updates: corroborate direct edges with primary chronicle or inscription-backed wording.
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
    row[idx.notes] = 'Phase 1 batch A dossier draft created.';
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
    row[idx.notes] = 'Phase 1 batch A dossier drafted.';
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
    row[idx.reviewer] = 'phase1-batch-a';
    row[idx.last_reviewed] = DATE;
    row[idx.notes] = u.notes;
  }
  await writeFile(path, toCsv(rows), 'utf8');
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

async function ensureSourceExtractLog() {
  const path = join(ledgerDir, 'source-extract-log.csv');
  const header = [
    'extract_id',
    'source_id',
    'date',
    'extract_status',
    'target_scope',
    'claim_or_context_note',
    'locator',
    'researcher',
    'notes'
  ];
  const rows = [
    [
      'EXT-001',
      'SRC-TUFS-TARIKH-DIBA-MAHALL-FACSIMILE',
      DATE,
      'in_progress',
      'Early dynastic succession narratives',
      'Source identified as core Arabic chronicle facsimile with continuations; extraction of named kinship lines pending.',
      'tufs.repo record 7457 metadata page',
      'phase1-batch-a',
      'Priority P0 source for Lunar/Hilaaly/Utheemu corroboration.'
    ],
    [
      'EXT-002',
      'SRC-TUFS-TARIKH-DIBA-MAHALL-ANNOT',
      DATE,
      'in_progress',
      'Name variants and annotation support',
      'Annotation volume identified; use for variant names and index-guided locator mapping.',
      'tufs.repo record 7433 metadata page',
      'phase1-batch-a',
      'Supports conflict resolution and normalization.'
    ],
    [
      'EXT-003',
      'SRC-SARUNA-LOAMAAFANU-1982',
      DATE,
      'in_progress',
      'Inscription-backed early ruler anchors',
      'Loamaafaanu publication queued for extraction of inscriptional names and chronology anchors.',
      'saruna item 3c1c8b78-4aea-480e-95fd-484f3134a881',
      'phase1-batch-a',
      'Priority P0 source for early chain hardening.'
    ],
    [
      'EXT-004',
      'SRC-SARUNA-LOAMAAFANU-2003',
      DATE,
      'pending',
      'Secondary interpretation cross-check',
      'Article queued as contextual support after primary inscription extraction.',
      'saruna item 4826d37f-f293-4576-b4df-a5220d9e2f3f',
      'phase1-batch-a',
      'Use with primary source corroboration only.'
    ],
    [
      'EXT-005',
      'SRC-SARUNA-RAADHAVALHI-1985',
      DATE,
      'in_progress',
      'Raadhavalhi manuscript tradition',
      'Source queued to map ruler-order framing and lineage terminology into claim ledger.',
      'saruna item 41a49f76-3727-45ef-8156-7a3119262adf',
      'phase1-batch-a',
      'Priority P0 source for early sequence corroboration.'
    ]
  ];
  await writeFile(path, toCsv([header, ...rows]), 'utf8');
}

async function main() {
  const dataset = getDataset('research');
  await writePersonDossiers(dataset);
  await updatePersonCoverageCsv();
  await updateRelationshipLedgerCsv();
  await updateInferenceTrackerCsv();
  await writeInferenceDossiers(dataset);
  await ensureSourceExtractLog();
  console.log('Phase 1 batch A complete: dossiers and ledgers updated.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

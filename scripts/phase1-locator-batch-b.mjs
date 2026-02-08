#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDataset } from '../src/data/sovereigns.merge.js';

const DATE = '2026-02-08';
const OWNER = 'phase1-locator-b';
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const ledgerDir = join(rootDir, 'docs', 'research-program', 'ledgers');

const claimUpdates = new Map([
  ['CLM-0238', {
    claim_excerpt: 'Wikipedia raw infobox issue field lists Ali Nasir as child of Ibrahim Nasir.',
    citation_locator: 'SRC-WIKI-IBRAHIM-NASIR raw page (w/index.php?title=Ibrahim_Nasir&action=raw), infobox issue line 78 snapshot.',
    notes: 'Locator extraction completed from raw infobox issue field.'
  }],
  ['CLM-0239', {
    claim_excerpt: 'Wikipedia raw infobox issue field lists Ahmed Nasir as child of Ibrahim Nasir.',
    citation_locator: 'SRC-WIKI-IBRAHIM-NASIR raw page (w/index.php?title=Ibrahim_Nasir&action=raw), infobox issue line 78 snapshot.',
    notes: 'Locator extraction completed from raw infobox issue field.'
  }],
  ['CLM-0240', {
    claim_excerpt: 'Wikipedia raw infobox issue field lists Mohamed Nasir as child of Ibrahim Nasir.',
    citation_locator: 'SRC-WIKI-IBRAHIM-NASIR raw page (w/index.php?title=Ibrahim_Nasir&action=raw), infobox issue line 78 snapshot.',
    notes: 'Locator extraction completed from raw infobox issue field.'
  }],
  ['CLM-0241', {
    claim_excerpt: 'Wikipedia raw infobox issue field lists Ibrahim Nasir (junior) as child of Ibrahim Nasir.',
    citation_locator: 'SRC-WIKI-IBRAHIM-NASIR raw page (w/index.php?title=Ibrahim_Nasir&action=raw), infobox issue line 78 snapshot.',
    notes: 'Locator extraction completed from raw infobox issue field.'
  }],
  ['CLM-0242', {
    claim_excerpt: 'Wikipedia raw infobox issue field lists Ismail Nasir as child of Ibrahim Nasir.',
    citation_locator: 'SRC-WIKI-IBRAHIM-NASIR raw page (w/index.php?title=Ibrahim_Nasir&action=raw), infobox issue line 78 snapshot.',
    notes: 'Locator extraction completed from raw infobox issue field.'
  }],
  ['CLM-0243', {
    claim_excerpt: 'Wikipedia raw infobox issue field lists Aishath Nasir as child of Ibrahim Nasir.',
    citation_locator: 'SRC-WIKI-IBRAHIM-NASIR raw page (w/index.php?title=Ibrahim_Nasir&action=raw), infobox issue line 78 snapshot.',
    notes: 'Locator extraction completed from raw infobox issue field.'
  }],
  ['CLM-0246', {
    claim_excerpt: 'Wikipedia raw infobox spouse and issue fields place Mariyam Saeeda Didi as spouse in the child-bearing set that includes Ali Nasir.',
    citation_locator: 'SRC-WIKI-IBRAHIM-NASIR raw page, infobox spouse line 76 with issue grouping at line 78 (2026-02-08 snapshot).',
    notes: 'Locator extraction completed from spouse+issue infobox grouping.'
  }],
  ['CLM-0247', {
    claim_excerpt: 'Wikipedia raw infobox spouse and issue fields place Mariyam Saeeda Didi as spouse in the child-bearing set that includes Ibrahim Nasir (junior).',
    citation_locator: 'SRC-WIKI-IBRAHIM-NASIR raw page, infobox spouse line 76 with issue grouping at line 78 (2026-02-08 snapshot).',
    notes: 'Locator extraction completed from spouse+issue infobox grouping.'
  }],
  ['CLM-0276', {
    claim_excerpt: 'Wikipedia raw infobox issue field explicitly groups Ahmed Nasir under the “With Aisha Zubair” subsection.',
    citation_locator: 'SRC-WIKI-IBRAHIM-NASIR raw page, infobox issue line 78 “With Aisha Zubair” subgroup (2026-02-08 snapshot).',
    notes: 'Locator extraction completed from spouse-specific issue subgroup.'
  }],
  ['CLM-0277', {
    claim_excerpt: 'Wikipedia raw infobox issue field explicitly groups Mohamed Nasir under the “With Aisha Zubair” subsection.',
    citation_locator: 'SRC-WIKI-IBRAHIM-NASIR raw page, infobox issue line 78 “With Aisha Zubair” subgroup (2026-02-08 snapshot).',
    notes: 'Locator extraction completed from spouse-specific issue subgroup.'
  }],
  ['CLM-0278', {
    claim_excerpt: 'Wikipedia raw infobox issue field explicitly groups Ismail Nasir under the “With Naseema Mohamed” subsection.',
    citation_locator: 'SRC-WIKI-IBRAHIM-NASIR raw page, infobox issue line 78 “With Naseema Mohamed” subgroup (2026-02-08 snapshot).',
    notes: 'Locator extraction completed from spouse-specific issue subgroup.'
  }],
  ['CLM-0279', {
    claim_excerpt: 'Wikipedia raw infobox issue field explicitly groups Aishath Nasir under the “With Naseema Mohamed” subsection.',
    citation_locator: 'SRC-WIKI-IBRAHIM-NASIR raw page, infobox issue line 78 “With Naseema Mohamed” subgroup (2026-02-08 snapshot).',
    notes: 'Locator extraction completed from spouse-specific issue subgroup.'
  }],
  ['CLM-0453', {
    claim_excerpt: 'Wikipedia raw infobox spouse field lists Mariyam Saeeda Didi as spouse of Ibrahim Nasir.',
    citation_locator: 'SRC-WIKI-IBRAHIM-NASIR raw page, infobox spouse line 76 (2026-02-08 snapshot).',
    notes: 'Locator extraction completed from raw infobox spouse field.'
  }],
  ['CLM-0454', {
    claim_excerpt: 'Wikipedia raw infobox spouse field lists Aisha Zubair as spouse of Ibrahim Nasir.',
    citation_locator: 'SRC-WIKI-IBRAHIM-NASIR raw page, infobox spouse line 76 (2026-02-08 snapshot).',
    notes: 'Locator extraction completed from raw infobox spouse field.'
  }],
  ['CLM-0455', {
    claim_excerpt: 'Wikipedia raw infobox spouse field lists Naseema Mohamed as spouse of Ibrahim Nasir.',
    citation_locator: 'SRC-WIKI-IBRAHIM-NASIR raw page, infobox spouse line 76 (2026-02-08 snapshot).',
    notes: 'Locator extraction completed from raw infobox spouse field.'
  }],
  ['CLM-0248', {
    claim_excerpt: 'Wikipedia raw infobox issue field lists Dunya Maumoon as child of Maumoon Abdul Gayoom.',
    citation_locator: 'SRC-WIKI-MAUMOON raw page (w/index.php?title=Maumoon_Abdul_Gayoom&action=raw), issue line 35 snapshot.',
    notes: 'Locator extraction completed from raw infobox issue field.'
  }],
  ['CLM-0249', {
    claim_excerpt: 'Wikipedia raw infobox issue field lists Yumna Maumoon as child of Maumoon Abdul Gayoom.',
    citation_locator: 'SRC-WIKI-MAUMOON raw page, issue line 35 snapshot.',
    notes: 'Locator extraction completed from raw infobox issue field.'
  }],
  ['CLM-0250', {
    claim_excerpt: 'Wikipedia raw infobox issue field lists Faris Maumoon as child of Maumoon Abdul Gayoom.',
    citation_locator: 'SRC-WIKI-MAUMOON raw page, issue line 35 snapshot.',
    notes: 'Locator extraction completed from raw infobox issue field.'
  }],
  ['CLM-0251', {
    claim_excerpt: 'Wikipedia raw infobox issue field lists Ghassan Maumoon as child of Maumoon Abdul Gayoom.',
    citation_locator: 'SRC-WIKI-MAUMOON raw page, issue line 35 snapshot.',
    notes: 'Locator extraction completed from raw infobox issue field.'
  }],
  ['CLM-0252', {
    claim_excerpt: 'Wikipedia raw infobox father field names Abdul Gayoom Ibrahim as father of Maumoon Abdul Gayoom.',
    citation_locator: 'SRC-WIKI-MAUMOON raw page, father line 37 snapshot.',
    notes: 'Locator extraction completed from raw infobox father field.'
  }],
  ['CLM-0280', {
    claim_excerpt: 'Wikipedia raw infobox mother field names Khadheeja Ibrahim Didi as mother of Maumoon Abdul Gayoom.',
    citation_locator: 'SRC-WIKI-MAUMOON raw page, mother line 38 snapshot.',
    notes: 'Locator extraction completed from raw infobox mother field.'
  }],
  ['CLM-0281', {
    claim_excerpt: 'Wikipedia raw infobox spouse and issue fields support Nasreena Ibrahim as spouse in the child list including Dunya Maumoon.',
    citation_locator: 'SRC-WIKI-MAUMOON raw page, spouse line 33 and issue line 35 snapshot.',
    notes: 'Locator extraction completed from spouse+issue infobox fields.'
  }],
  ['CLM-0282', {
    claim_excerpt: 'Wikipedia raw infobox spouse and issue fields support Nasreena Ibrahim as spouse in the child list including Yumna Maumoon.',
    citation_locator: 'SRC-WIKI-MAUMOON raw page, spouse line 33 and issue line 35 snapshot.',
    notes: 'Locator extraction completed from spouse+issue infobox fields.'
  }],
  ['CLM-0283', {
    claim_excerpt: 'Wikipedia raw infobox spouse and issue fields support Nasreena Ibrahim as spouse in the child list including Faris Maumoon.',
    citation_locator: 'SRC-WIKI-MAUMOON raw page, spouse line 33 and issue line 35 snapshot.',
    notes: 'Locator extraction completed from spouse+issue infobox fields.'
  }],
  ['CLM-0284', {
    claim_excerpt: 'Wikipedia raw infobox spouse and issue fields support Nasreena Ibrahim as spouse in the child list including Ghassan Maumoon.',
    citation_locator: 'SRC-WIKI-MAUMOON raw page, spouse line 33 and issue line 35 snapshot.',
    notes: 'Locator extraction completed from spouse+issue infobox fields.'
  }],
  ['CLM-0254', {
    claim_excerpt: 'Wikipedia raw infobox issue field lists Meera Laila Nasheed as child of Mohamed Nasheed.',
    citation_locator: 'SRC-WIKI-NASHEED raw page (w/index.php?title=Mohamed_Nasheed&action=raw), issue line 35 snapshot.',
    notes: 'Locator extraction completed from raw infobox issue field.'
  }],
  ['CLM-0255', {
    claim_excerpt: 'Wikipedia raw infobox issue field lists Zaya Laila Nasheed as child of Mohamed Nasheed.',
    citation_locator: 'SRC-WIKI-NASHEED raw page, issue line 35 snapshot.',
    notes: 'Locator extraction completed from raw infobox issue field.'
  }],
  ['CLM-0256', {
    claim_excerpt: 'Wikipedia raw infobox spouse and issue fields support Laila Ali Abdulla as spouse in the child list including Meera Laila Nasheed.',
    citation_locator: 'SRC-WIKI-NASHEED raw page, spouse line 32 and issue line 35 snapshot.',
    notes: 'Locator extraction completed from spouse+issue infobox fields.'
  }],
  ['CLM-0257', {
    claim_excerpt: 'Wikipedia raw infobox spouse and issue fields support Laila Ali Abdulla as spouse in the child list including Zaya Laila Nasheed.',
    citation_locator: 'SRC-WIKI-NASHEED raw page, spouse line 32 and issue line 35 snapshot.',
    notes: 'Locator extraction completed from spouse+issue infobox fields.'
  }],
  ['CLM-0308', {
    claim_excerpt: 'Wikipedia raw infobox issue field lists Yasmin Muizzu as child of Mohamed Muizzu.',
    citation_locator: 'SRC-WIKI-MUIZZU raw page (w/index.php?title=Mohamed_Muizzu&action=raw), issue line 38 snapshot.',
    notes: 'Locator extraction completed from raw infobox issue field.'
  }],
  ['CLM-0309', {
    claim_excerpt: 'Wikipedia raw infobox issue field lists Umair Muizzu as child of Mohamed Muizzu.',
    citation_locator: 'SRC-WIKI-MUIZZU raw page, issue line 38 snapshot.',
    notes: 'Locator extraction completed from raw infobox issue field.'
  }],
  ['CLM-0310', {
    claim_excerpt: 'Wikipedia raw infobox issue field lists Zaid Muizzu as child of Mohamed Muizzu.',
    citation_locator: 'SRC-WIKI-MUIZZU raw page, issue line 38 snapshot.',
    notes: 'Locator extraction completed from raw infobox issue field.'
  }],
  ['CLM-0311', {
    claim_excerpt: 'Wikipedia raw infobox spouse and issue fields support Sajidha Mohamed as spouse in the child list including Yasmin Muizzu.',
    citation_locator: 'SRC-WIKI-MUIZZU raw page, spouse line 35 and issue line 38 snapshot.',
    notes: 'Locator extraction completed from spouse+issue infobox fields.'
  }],
  ['CLM-0312', {
    claim_excerpt: 'Wikipedia raw infobox spouse and issue fields support Sajidha Mohamed as spouse in the child list including Umair Muizzu.',
    citation_locator: 'SRC-WIKI-MUIZZU raw page, spouse line 35 and issue line 38 snapshot.',
    notes: 'Locator extraction completed from spouse+issue infobox fields.'
  }],
  ['CLM-0313', {
    claim_excerpt: 'Wikipedia raw infobox spouse and issue fields support Sajidha Mohamed as spouse in the child list including Zaid Muizzu.',
    citation_locator: 'SRC-WIKI-MUIZZU raw page, spouse line 35 and issue line 38 snapshot.',
    notes: 'Locator extraction completed from spouse+issue infobox fields.'
  }],
  ['CLM-0303', {
    claim_excerpt: 'Wikipedia raw infobox issue field lists Sarah Ibrahim Solih as child of Ibrahim Mohamed Solih.',
    citation_locator: 'SRC-WIKI-SOLIH raw page (w/index.php?title=Ibrahim_Mohamed_Solih&action=raw), issue line 37 snapshot.',
    notes: 'Locator extraction completed from raw infobox issue field.'
  }],
  ['CLM-0305', {
    claim_excerpt: 'Wikipedia raw infobox spouse and issue fields support Fazna Ahmed as spouse in the child list including Sarah Ibrahim Solih.',
    citation_locator: 'SRC-WIKI-SOLIH raw page, spouse line 35 and issue line 37 snapshot.',
    notes: 'Locator extraction completed from spouse+issue infobox fields.'
  }]
]);

const extractEntries = [
  {
    extract_id: 'EXT-026',
    source_id: 'SRC-WIKI-IBRAHIM-NASIR',
    date: DATE,
    extract_status: 'in_progress',
    target_scope: 'Raw infobox spouse and issue extraction',
    claim_or_context_note: 'Extracted spouse and issue template structure for Ibrahim Nasir page to map parent/spouse claims.',
    locator: 'Wikipedia raw lines 76 and 78 snapshot',
    researcher: OWNER,
    notes: 'Supports CLM-0238..0243, CLM-0246..0247, CLM-0276..0279, CLM-0453..0455.'
  },
  {
    extract_id: 'EXT-022',
    source_id: 'SRC-WIKI-SOLIH',
    date: DATE,
    extract_status: 'in_progress',
    target_scope: 'Raw infobox plus lead family extraction',
    claim_or_context_note: 'Expanded extraction to include spouse and issue template fields (Sarah/Yaman) with cousin statement.',
    locator: 'Wikipedia raw lines 35,37 plus lead line 34 snapshot',
    researcher: OWNER,
    notes: 'Supports CLM-0049, CLM-0303..0306, CLM-0460.'
  },
  {
    extract_id: 'EXT-023',
    source_id: 'SRC-WIKI-MUIZZU',
    date: DATE,
    extract_status: 'in_progress',
    target_scope: 'Raw infobox parent/spouse/issue extraction',
    claim_or_context_note: 'Expanded extraction to include issue names and spouse linkage for parent claims.',
    locator: 'Wikipedia raw lines 35 and 38 plus parent lines 40-41 snapshot',
    researcher: OWNER,
    notes: 'Supports CLM-0308..0315 and CLM-0461.'
  },
  {
    extract_id: 'EXT-024',
    source_id: 'SRC-WIKI-NASHEED',
    date: DATE,
    extract_status: 'in_progress',
    target_scope: 'Raw infobox spouse/issue extraction',
    claim_or_context_note: 'Expanded extraction to include child names Meera and Zaya in issue field.',
    locator: 'Wikipedia raw lines 32 and 35 snapshot',
    researcher: OWNER,
    notes: 'Supports CLM-0254..0257 and CLM-0457.'
  },
  {
    extract_id: 'EXT-025',
    source_id: 'SRC-WIKI-MAUMOON',
    date: DATE,
    extract_status: 'in_progress',
    target_scope: 'Raw infobox parent/spouse/issue extraction',
    claim_or_context_note: 'Expanded extraction to include father, mother, spouse, and issue fields for family mapping.',
    locator: 'Wikipedia raw lines 33,35,37,38 snapshot',
    researcher: OWNER,
    notes: 'Supports CLM-0248..0252, CLM-0280..0284, CLM-0456.'
  }
];

const queueEntries = [
  {
    queue_id: 'SRCQ-017',
    priority: 'P1',
    track: 'Modern family corroboration',
    dynasty_or_topic: 'Modern nodes P115-P173 cluster',
    target_claim_scope: 'Spouse, parent, and cousin statements with explicit lead/personal-life locators',
    candidate_source_id: 'SRC-WIKI-WAHEED|SRC-WIKI-SOLIH|SRC-WIKI-MUIZZU|SRC-WIKI-NASHEED|SRC-WIKI-MAUMOON',
    source_url: '',
    publisher: 'Wikipedia',
    source_type: 'secondary synthesis',
    expected_grade: 'B',
    status: 'in_progress',
    last_updated: DATE,
    owner: OWNER,
    notes: 'Batch B expanded to raw infobox extraction for spouse/issue/parent fields (EXT-022..025).'
  },
  {
    queue_id: 'SRCQ-019',
    priority: 'P1',
    track: 'Modern family corroboration',
    dynasty_or_topic: 'Ibrahim Nasir lineage cluster',
    target_claim_scope: 'Spouse and issue template mapping for P115 branch claims',
    candidate_source_id: 'SRC-WIKI-IBRAHIM-NASIR',
    source_url: '',
    publisher: 'Wikipedia',
    source_type: 'secondary synthesis',
    expected_grade: 'B',
    status: 'in_progress',
    last_updated: DATE,
    owner: OWNER,
    notes: 'Raw infobox extraction completed for spouse/issue subgroup claims; see EXT-026.'
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
  return `${id} ${p.nm || '(unnamed)'}`;
}

async function updateRelationshipLedger(dataset) {
  const path = join(ledgerDir, 'relationship-evidence-ledger.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  const byPersonId = byIdMap(dataset.people);

  let changed = 0;
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const claimId = row[idx.claim_id];
    const update = claimUpdates.get(claimId);
    if (!update) continue;
    row[idx.claim_excerpt] = `${update.claim_excerpt} (pair: ${personLabel(byPersonId, row[idx.source_id])} -> ${personLabel(byPersonId, row[idx.target_id])}).`;
    row[idx.citation_locator] = update.citation_locator;
    row[idx.review_status] = 'in_progress';
    row[idx.canonical_decision] = 'pending';
    row[idx.reviewer] = OWNER;
    row[idx.last_reviewed] = DATE;
    row[idx.access_date] = DATE;
    row[idx.notes] = update.notes;
    changed += 1;
  }

  await writeFile(path, toCsv(rows), 'utf8');
  return changed;
}

async function upsertSourceExtractLog() {
  const path = join(ledgerDir, 'source-extract-log.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  const byId = new Map();
  for (let i = 1; i < rows.length; i++) byId.set(rows[i][idx.extract_id], i);

  for (const entry of extractEntries) {
    const row = header.map(col => entry[col] ?? '');
    if (byId.has(entry.extract_id)) rows[byId.get(entry.extract_id)] = row;
    else rows.push(row);
  }

  const body = rows.slice(1).sort((a, b) => a[idx.extract_id].localeCompare(b[idx.extract_id], undefined, { numeric: true }));
  await writeFile(path, toCsv([header, ...body]), 'utf8');
  return extractEntries.length;
}

async function upsertSourceQueue() {
  const path = join(ledgerDir, 'source-expansion-queue.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  const byId = new Map();
  for (let i = 1; i < rows.length; i++) byId.set(rows[i][idx.queue_id], i);

  for (const entry of queueEntries) {
    const row = header.map(col => entry[col] ?? '');
    if (byId.has(entry.queue_id)) rows[byId.get(entry.queue_id)] = row;
    else rows.push(row);
  }

  const body = rows.slice(1).sort((a, b) => a[idx.queue_id].localeCompare(b[idx.queue_id], undefined, { numeric: true }));
  await writeFile(path, toCsv([header, ...body]), 'utf8');
  return queueEntries.length;
}

async function main() {
  const dataset = getDataset('research');
  const claimCount = await updateRelationshipLedger(dataset);
  const extractCount = await upsertSourceExtractLog();
  const queueCount = await upsertSourceQueue();
  console.log(`Phase 1 locator batch B complete:
- relationship claims updated: ${claimCount}
- source extract entries upserted: ${extractCount}
- source queue entries upserted: ${queueCount}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

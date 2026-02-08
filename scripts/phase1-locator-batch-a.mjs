#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDataset } from '../src/data/sovereigns.merge.js';
import { sourceById } from '../src/data/sources.js';

const DATE = '2026-02-08';
const OWNER = 'phase1-locator-a';
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const ledgerDir = join(rootDir, 'docs', 'research-program', 'ledgers');

const claimUpdates = new Map([
  ['CLM-0236', {
    claim_excerpt: 'Official former-president profile states Mohamed Amin was born as son of Ahmed Didi and Nayaage Aishath Didi.',
    citation_locator: 'SRC-PO-AMIN profile (presidency.gov.mv/PO/FormerPresident/7), lines 49-52 in 2026-02-08 extraction snapshot.',
    notes: 'Locator extraction completed from official profile text.'
  }],
  ['CLM-0271', {
    claim_excerpt: 'Official former-president profile states Mohamed Amin was born as son of Ahmed Didi and Nayaage Aishath Didi.',
    citation_locator: 'SRC-PO-AMIN profile (presidency.gov.mv/PO/FormerPresident/7), lines 49-52 in 2026-02-08 extraction snapshot.',
    notes: 'Locator extraction completed from official profile text.'
  }],
  ['CLM-0244', {
    claim_excerpt: 'Official former-president profile states Ibrahim Nasir was son of Ahmed Didi and Nayaage Aishath Didi.',
    citation_locator: 'SRC-PO-NASIR profile (presidency.gov.mv/PO/FormerPresident/6), lines 48-50 in 2026-02-08 extraction snapshot.',
    notes: 'Locator extraction completed from official profile text.'
  }],
  ['CLM-0245', {
    claim_excerpt: 'Official former-president profile states Ibrahim Nasir was son of Ahmed Didi and Nayaage Aishath Didi.',
    citation_locator: 'SRC-PO-NASIR profile (presidency.gov.mv/PO/FormerPresident/6), lines 48-50 in 2026-02-08 extraction snapshot.',
    notes: 'Locator extraction completed from official profile text.'
  }],
  ['CLM-0253', {
    claim_excerpt: 'Official former-president profile states Abdulla Yameen is son of Abdul Gayoom Ibrahim.',
    citation_locator: 'SRC-PO-YAMEEN profile (presidency.gov.mv/PO/FormerPresident/1), lines 43-44 in 2026-02-08 extraction snapshot.',
    notes: 'Locator extraction completed from official profile text.'
  }],
  ['CLM-0375', {
    claim_excerpt: 'Official former-president profile identifies Abdulla Yameen as younger brother of former President Maumoon Abdul Gayoom.',
    citation_locator: 'SRC-PO-YAMEEN profile (presidency.gov.mv/PO/FormerPresident/1), lines 44-45 in 2026-02-08 extraction snapshot.',
    notes: 'Locator extraction completed from official profile text.'
  }],
  ['CLM-0258', {
    claim_excerpt: 'Atoll Times report names Mohamed Nasheed’s father as Abdul Sattar Umar.',
    citation_locator: 'SRC-ATOLL-NASHEED-PARENTS article (atolltimes.mv/post/news/3844), lines 27-28 in 2026-02-08 extraction snapshot.',
    notes: 'Locator extraction completed from named parent statement in news report.'
  }],
  ['CLM-0259', {
    claim_excerpt: 'Atoll Times report names Mohamed Nasheed’s mother as Abida Mohamed.',
    citation_locator: 'SRC-ATOLL-NASHEED-PARENTS article (atolltimes.mv/post/news/3844), lines 27-28 in 2026-02-08 extraction snapshot.',
    notes: 'Locator extraction completed from named parent statement in news report.'
  }],
  ['CLM-0307', {
    claim_excerpt: 'Edition obituary report identifies Aishath Khadheeja as mother of former President Ibrahim Mohamed Solih.',
    citation_locator: 'SRC-EDITION-SOLIH-MOTHER report (edition.mv/ibrahim_muaz_mua/34704), line 31 in 2026-02-08 extraction snapshot.',
    notes: 'Locator extraction completed from obituary identification text.'
  }],
  ['CLM-0297', {
    claim_excerpt: 'Wikipedia personal-life section lists Widhadh Waheed among Dr Mohamed Waheed Hassan’s children.',
    citation_locator: 'SRC-WIKI-WAHEED page (en.wikipedia.org/wiki/Mohamed_Waheed_Hassan), lines 56-57 in 2026-02-08 extraction snapshot.',
    notes: 'Locator extraction completed from personal-life child listing.'
  }],
  ['CLM-0298', {
    claim_excerpt: 'Wikipedia personal-life section lists Fidha Waheed among Dr Mohamed Waheed Hassan’s children.',
    citation_locator: 'SRC-WIKI-WAHEED page (en.wikipedia.org/wiki/Mohamed_Waheed_Hassan), lines 56-57 in 2026-02-08 extraction snapshot.',
    notes: 'Locator extraction completed from personal-life child listing.'
  }],
  ['CLM-0299', {
    claim_excerpt: 'Wikipedia personal-life section lists Jeffrey Salim Waheed among Dr Mohamed Waheed Hassan’s children.',
    citation_locator: 'SRC-WIKI-WAHEED page (en.wikipedia.org/wiki/Mohamed_Waheed_Hassan), lines 56-57 in 2026-02-08 extraction snapshot.',
    notes: 'Locator extraction completed from personal-life child listing.'
  }],
  ['CLM-0300', {
    claim_excerpt: 'Wikipedia personal-life section lists Widhadh Waheed among Dr Mohamed Waheed Hassan and Ilham Hussain’s children.',
    citation_locator: 'SRC-WIKI-WAHEED page (en.wikipedia.org/wiki/Mohamed_Waheed_Hassan), lines 48 and 56-57 in 2026-02-08 extraction snapshot.',
    notes: 'Locator extraction completed from spouse and child listing.'
  }],
  ['CLM-0301', {
    claim_excerpt: 'Wikipedia personal-life section lists Fidha Waheed among Dr Mohamed Waheed Hassan and Ilham Hussain’s children.',
    citation_locator: 'SRC-WIKI-WAHEED page (en.wikipedia.org/wiki/Mohamed_Waheed_Hassan), lines 48 and 56-57 in 2026-02-08 extraction snapshot.',
    notes: 'Locator extraction completed from spouse and child listing.'
  }],
  ['CLM-0302', {
    claim_excerpt: 'Wikipedia personal-life section lists Jeffrey Salim Waheed among Dr Mohamed Waheed Hassan and Ilham Hussain’s children.',
    citation_locator: 'SRC-WIKI-WAHEED page (en.wikipedia.org/wiki/Mohamed_Waheed_Hassan), lines 48 and 56-57 in 2026-02-08 extraction snapshot.',
    notes: 'Locator extraction completed from spouse and child listing.'
  }],
  ['CLM-0049', {
    claim_excerpt: 'Wikipedia lead text identifies Ibrahim Mohamed Solih as first cousin of former President Mohamed Nasheed.',
    citation_locator: 'SRC-WIKI-SOLIH page (en.wikipedia.org/wiki/Ibrahim_Mohamed_Solih), line 34 in 2026-02-08 extraction snapshot.',
    notes: 'Locator extraction completed from lead relationship statement.'
  }],
  ['CLM-0304', {
    claim_excerpt: 'Wikipedia lead text states Ibrahim Mohamed Solih and his wife have a son named Yaman.',
    citation_locator: 'SRC-WIKI-SOLIH page (en.wikipedia.org/wiki/Ibrahim_Mohamed_Solih), lines 43-45 in 2026-02-08 extraction snapshot.',
    notes: 'Locator extraction completed from lead family statement.'
  }],
  ['CLM-0306', {
    claim_excerpt: 'Wikipedia lead text states Ibrahim Mohamed Solih and his wife have a son named Yaman.',
    citation_locator: 'SRC-WIKI-SOLIH page (en.wikipedia.org/wiki/Ibrahim_Mohamed_Solih), lines 43-45 in 2026-02-08 extraction snapshot.',
    notes: 'Locator extraction completed from lead family statement.'
  }],
  ['CLM-0460', {
    claim_excerpt: 'Wikipedia lead text names Fazeena Ahmed as spouse of Ibrahim Mohamed Solih.',
    citation_locator: 'SRC-WIKI-SOLIH page (en.wikipedia.org/wiki/Ibrahim_Mohamed_Solih), lines 43-45 in 2026-02-08 extraction snapshot.',
    notes: 'Locator extraction completed from lead family statement.'
  }],
  ['CLM-0314', {
    claim_excerpt: 'Wikipedia lead text states Mohamed Muizzu was born to Husna Adam Ismail and Hussain Abdul Rahman.',
    citation_locator: 'SRC-WIKI-MUIZZU page (en.wikipedia.org/wiki/Mohamed_Muizzu), lines 53-54 in 2026-02-08 extraction snapshot.',
    notes: 'Locator extraction completed from lead parentage statement.'
  }],
  ['CLM-0315', {
    claim_excerpt: 'Wikipedia lead text states Mohamed Muizzu was born to Husna Adam Ismail and Hussain Abdul Rahman.',
    citation_locator: 'SRC-WIKI-MUIZZU page (en.wikipedia.org/wiki/Mohamed_Muizzu), lines 53-54 in 2026-02-08 extraction snapshot.',
    notes: 'Locator extraction completed from lead parentage statement.'
  }],
  ['CLM-0461', {
    claim_excerpt: 'Wikipedia lead text names Laila (Sajidha Mohamed) as spouse of Mohamed Muizzu.',
    citation_locator: 'SRC-WIKI-MUIZZU page (en.wikipedia.org/wiki/Mohamed_Muizzu), line 56 in 2026-02-08 extraction snapshot.',
    notes: 'Locator extraction completed from lead spouse statement.'
  }],
  ['CLM-0457', {
    claim_excerpt: 'Wikipedia lead text states Mohamed Nasheed is married to Laila Ali Abdulla.',
    citation_locator: 'SRC-WIKI-NASHEED page (en.wikipedia.org/wiki/Mohamed_Nasheed), line 50 in 2026-02-08 extraction snapshot.',
    notes: 'Locator extraction completed from lead spouse statement.'
  }],
  ['CLM-0456', {
    claim_excerpt: 'Wikipedia lead text states Maumoon Abdul Gayoom is married to Nasreena Ibrahim.',
    citation_locator: 'SRC-WIKI-MAUMOON page (en.wikipedia.org/wiki/Maumoon_Abdul_Gayoom), line 29 in 2026-02-08 extraction snapshot.',
    notes: 'Locator extraction completed from lead spouse statement.'
  }]
]);

const sourceExtractEntries = [
  {
    extract_id: 'EXT-016',
    source_id: 'SRC-PO-AMIN',
    date: DATE,
    extract_status: 'in_progress',
    target_scope: 'Official parentage statement extraction',
    claim_or_context_note: 'Extracted parentage phrasing for Mohamed Amin profile and mapped to parent claims.',
    locator: 'presidency FormerPresident/7 lines 49-52 snapshot',
    researcher: OWNER,
    notes: 'Supports CLM-0236 and CLM-0271.'
  },
  {
    extract_id: 'EXT-017',
    source_id: 'SRC-PO-NASIR',
    date: DATE,
    extract_status: 'in_progress',
    target_scope: 'Official parentage statement extraction',
    claim_or_context_note: 'Extracted parentage phrasing for Ibrahim Nasir profile and mapped to parent claims.',
    locator: 'presidency FormerPresident/6 lines 48-50 snapshot',
    researcher: OWNER,
    notes: 'Supports CLM-0244 and CLM-0245.'
  },
  {
    extract_id: 'EXT-018',
    source_id: 'SRC-PO-YAMEEN',
    date: DATE,
    extract_status: 'in_progress',
    target_scope: 'Official parent/sibling statement extraction',
    claim_or_context_note: 'Extracted father and sibling wording for Yameen profile.',
    locator: 'presidency FormerPresident/1 lines 43-45 snapshot',
    researcher: OWNER,
    notes: 'Supports CLM-0253 and CLM-0375.'
  },
  {
    extract_id: 'EXT-019',
    source_id: 'SRC-ATOLL-NASHEED-PARENTS',
    date: DATE,
    extract_status: 'in_progress',
    target_scope: 'Named parent statement extraction',
    claim_or_context_note: 'Extracted explicit naming of Nasheed father and mother from report text.',
    locator: 'atolltimes article lines 27-28 snapshot',
    researcher: OWNER,
    notes: 'Supports CLM-0258 and CLM-0259.'
  },
  {
    extract_id: 'EXT-020',
    source_id: 'SRC-EDITION-SOLIH-MOTHER',
    date: DATE,
    extract_status: 'in_progress',
    target_scope: 'Maternal identity statement extraction',
    claim_or_context_note: 'Extracted obituary phrasing identifying former President Solih’s mother.',
    locator: 'edition report line 31 snapshot',
    researcher: OWNER,
    notes: 'Supports CLM-0307.'
  },
  {
    extract_id: 'EXT-021',
    source_id: 'SRC-WIKI-WAHEED',
    date: DATE,
    extract_status: 'in_progress',
    target_scope: 'Personal-life family listing extraction',
    claim_or_context_note: 'Extracted spouse and children listing for Waheed family claims.',
    locator: 'Wikipedia lines 48,56-57 snapshot',
    researcher: OWNER,
    notes: 'Supports CLM-0297 through CLM-0302.'
  },
  {
    extract_id: 'EXT-022',
    source_id: 'SRC-WIKI-SOLIH',
    date: DATE,
    extract_status: 'in_progress',
    target_scope: 'Lead family relation extraction',
    claim_or_context_note: 'Extracted first-cousin and spouse/son statements for Solih.',
    locator: 'Wikipedia lines 34,43-45 snapshot',
    researcher: OWNER,
    notes: 'Supports CLM-0049, CLM-0304, CLM-0306, CLM-0460.'
  },
  {
    extract_id: 'EXT-023',
    source_id: 'SRC-WIKI-MUIZZU',
    date: DATE,
    extract_status: 'in_progress',
    target_scope: 'Lead parentage and spouse extraction',
    claim_or_context_note: 'Extracted parent names and spouse naming from Muizzu lead text.',
    locator: 'Wikipedia lines 53-54 and 56 snapshot',
    researcher: OWNER,
    notes: 'Supports CLM-0314, CLM-0315, CLM-0461.'
  },
  {
    extract_id: 'EXT-024',
    source_id: 'SRC-WIKI-NASHEED',
    date: DATE,
    extract_status: 'in_progress',
    target_scope: 'Lead spouse extraction',
    claim_or_context_note: 'Extracted spouse naming from Nasheed lead text.',
    locator: 'Wikipedia line 50 snapshot',
    researcher: OWNER,
    notes: 'Supports CLM-0457.'
  },
  {
    extract_id: 'EXT-025',
    source_id: 'SRC-WIKI-MAUMOON',
    date: DATE,
    extract_status: 'in_progress',
    target_scope: 'Lead spouse extraction',
    claim_or_context_note: 'Extracted spouse naming from Maumoon lead text.',
    locator: 'Wikipedia line 29 snapshot',
    researcher: OWNER,
    notes: 'Supports CLM-0456.'
  }
];

const queueEntries = [
  {
    queue_id: 'SRCQ-016',
    priority: 'P1',
    track: 'Official profiles',
    dynasty_or_topic: 'Modern political lineage anchors',
    target_claim_scope: 'Parent and sibling claims from official presidential profiles',
    candidate_source_id: 'SRC-PO-AMIN|SRC-PO-NASIR|SRC-PO-YAMEEN',
    source_url: '',
    publisher: "President's Office Maldives",
    source_type: 'official profile',
    expected_grade: 'A',
    status: 'in_progress',
    last_updated: DATE,
    owner: OWNER,
    notes: 'Locator extraction batch A completed for selected parent/sibling statements (EXT-016..018).'
  },
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
    notes: 'Locator extraction batch A completed for explicit lead/personal-life statements (EXT-021..025).'
  },
  {
    queue_id: 'SRCQ-018',
    priority: 'P1',
    track: 'News corroboration',
    dynasty_or_topic: 'Modern family parentage claims',
    target_claim_scope: 'Named parent statements in contemporary reports',
    candidate_source_id: 'SRC-ATOLL-NASHEED-PARENTS|SRC-EDITION-SOLIH-MOTHER',
    source_url: '',
    publisher: 'Atoll Times / The Edition',
    source_type: 'news report',
    expected_grade: 'B',
    status: 'in_progress',
    last_updated: DATE,
    owner: OWNER,
    notes: 'Locator extraction batch A completed for explicit named-parent statements (EXT-019..020).'
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

function applyRelationshipUpdates(dataset) {
  const path = join(ledgerDir, 'relationship-evidence-ledger.csv');
  return readFile(path, 'utf8').then(text => {
    const rows = parseCsv(text);
    const header = rows[0];
    const idx = Object.fromEntries(header.map((h, i) => [h, i]));
    const byPersonId = byIdMap(dataset.people);
    let changed = 0;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const claimId = row[idx.claim_id];
      const update = claimUpdates.get(claimId);
      if (!update) continue;

      row[idx.claim_excerpt] = update.claim_excerpt;
      row[idx.citation_locator] = update.citation_locator;
      row[idx.review_status] = 'in_progress';
      row[idx.canonical_decision] = 'pending';
      row[idx.reviewer] = OWNER;
      row[idx.last_reviewed] = DATE;
      row[idx.access_date] = DATE;
      row[idx.notes] = update.notes;

      const sid = row[idx.source_id];
      const tid = row[idx.target_id];
      row[idx.claim_excerpt] = `${update.claim_excerpt} (pair: ${personLabel(byPersonId, sid)} -> ${personLabel(byPersonId, tid)}).`;
      changed += 1;
    }
    return writeFile(path, toCsv(rows), 'utf8').then(() => changed);
  });
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
    const row = header.map(col => entry[col] ?? '');
    if (byId.has(entry.extract_id)) {
      rows[byId.get(entry.extract_id)] = row;
    } else {
      rows.push(row);
    }
  }

  const body = rows.slice(1).sort((a, b) => a[idx.extract_id].localeCompare(b[idx.extract_id], undefined, { numeric: true }));
  await writeFile(path, toCsv([header, ...body]), 'utf8');
  return sourceExtractEntries.length;
}

async function upsertSourceQueue() {
  const path = join(ledgerDir, 'source-expansion-queue.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  const byId = new Map();
  for (let i = 1; i < rows.length; i++) {
    byId.set(rows[i][idx.queue_id], i);
  }

  for (const entry of queueEntries) {
    const row = header.map(col => entry[col] ?? '');
    if (byId.has(entry.queue_id)) {
      rows[byId.get(entry.queue_id)] = row;
    } else {
      rows.push(row);
    }
  }

  const body = rows.slice(1).sort((a, b) => a[idx.queue_id].localeCompare(b[idx.queue_id], undefined, { numeric: true }));
  await writeFile(path, toCsv([header, ...body]), 'utf8');
  return queueEntries.length;
}

async function checkSources() {
  const missing = [];
  for (const entry of sourceExtractEntries) {
    if (!sourceById.get(entry.source_id)) missing.push(entry.source_id);
  }
  if (missing.length) {
    throw new Error(`Missing source IDs in registry: ${missing.join(', ')}`);
  }
}

async function main() {
  await checkSources();
  const dataset = getDataset('research');
  const claimCount = await applyRelationshipUpdates(dataset);
  const extractCount = await upsertSourceExtractLog();
  const queueCount = await upsertSourceQueue();
  console.log(`Phase 1 locator batch A complete:
- relationship claims updated: ${claimCount}
- source extract entries upserted: ${extractCount}
- source queue entries upserted: ${queueCount}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

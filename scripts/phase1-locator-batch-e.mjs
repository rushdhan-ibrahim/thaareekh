#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDataset } from '../src/data/sovereigns.merge.js';
import { sources as sourceRegistry } from '../src/data/sources.js';

const DATE = '2026-02-08';
const OWNER = 'phase1-locator-e';
const HAS_URL_RE = /(https?:\/\/|r\.jina\.ai|w\/index\.php|en\.wikipedia\.org|presidency\.gov\.mv|maldivesroyalfamily\.com)/i;

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const ledgerDir = join(rootDir, 'docs', 'research-program', 'ledgers');

const RAW_URL_BY_SOURCE = {
  'SRC-WIKI-IBRAHIM-NASIR': 'https://en.wikipedia.org/w/index.php?title=Ibrahim_Nasir&action=raw',
  'SRC-WIKI-MAUMOON': 'https://en.wikipedia.org/w/index.php?title=Maumoon_Abdul_Gayoom&action=raw',
  'SRC-WIKI-NASHEED': 'https://en.wikipedia.org/w/index.php?title=Mohamed_Nasheed&action=raw',
  'SRC-WIKI-MUIZZU': 'https://en.wikipedia.org/w/index.php?title=Mohamed_Muizzu&action=raw',
  'SRC-WIKI-SOLIH': 'https://en.wikipedia.org/w/index.php?title=Ibrahim_Mohamed_Solih&action=raw',
  'SRC-WIKI-WAHEED': 'https://en.wikipedia.org/w/index.php?title=Mohamed_Waheed_Hassan&action=raw',
  'SRC-WIKI-MONARCHS': 'https://en.wikipedia.org/wiki/List_of_Maldivian_monarchs'
};

const RJINA_BY_SOURCE = {
  'SRC-MRF-KINGS': 'https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml',
  'SRC-MRF-HILAALY': 'https://r.jina.ai/http://maldivesroyalfamily.com/maldives_hilaaly.shtml',
  'SRC-MRF-HURAA': 'https://r.jina.ai/http://maldivesroyalfamily.com/maldives_royal_huraagey.shtml',
  'SRC-MRF-UTHEEM': 'https://r.jina.ai/http://maldivesroyalfamily.com/maldives_utheem.shtml',
  'SRC-MRF-MIDU-ROYAL': 'https://r.jina.ai/http://maldivesroyalfamily.com/maldives_midu.shtml'
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

function personLabel(byPersonId, id) {
  const p = byPersonId.get(id);
  if (!p) return id;
  return `${id} ${p.nm || '(unnamed)'}`;
}

function cleanSentence(text) {
  const t = String(text || '').trim();
  if (!t) return '';
  return t.endsWith('.') ? t.slice(0, -1) : t;
}

function sourceUrl(sourceId, sourceById) {
  return RJINA_BY_SOURCE[sourceId] || RAW_URL_BY_SOURCE[sourceId] || sourceById.get(sourceId)?.url || '';
}

async function normalizeRelationshipLocators(dataset, sourceById) {
  const path = join(ledgerDir, 'relationship-evidence-ledger.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  const byPersonId = byIdMap(dataset.people);

  let updated = 0;
  const bySource = new Map();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row[idx.claim_type] !== 'direct') continue;

    const current = row[idx.citation_locator] || '';
    if (!current.trim() || HAS_URL_RE.test(current)) continue;

    const primary = row[idx.primary_source_id] || '';
    const url = sourceUrl(primary, sourceById);
    if (!url) continue;

    const src = personLabel(byPersonId, row[idx.source_id]);
    const dst = personLabel(byPersonId, row[idx.target_id]);
    const relation = row[idx.relation_type] || 'kin';
    const label = row[idx.label] ? ` (${row[idx.label]})` : '';
    const base = cleanSentence(current);

    row[idx.citation_locator] = `${base}. URL anchor: ${url}. Node pair: ${src} <-> ${dst} (${relation}${label}), ${DATE} snapshot.`;
    row[idx.reviewer] = OWNER;
    row[idx.last_reviewed] = DATE;
    row[idx.access_date] = DATE;

    const priorNotes = row[idx.notes] || '';
    const normalizedNote = 'Locator URL-normalized in Phase 1 batch E for explicit source anchorability.';
    row[idx.notes] = priorNotes ? `${priorNotes} ${normalizedNote}` : normalizedNote;

    updated += 1;
    bySource.set(primary, (bySource.get(primary) || 0) + 1);
  }

  await writeFile(path, toCsv(rows), 'utf8');
  return { updated, bySource };
}

function nextNumericId(rows, index, prefix) {
  let max = 0;
  for (let i = 1; i < rows.length; i++) {
    const m = String(rows[i][index] || '').match(new RegExp(`^${prefix}-(\\d+)$`));
    if (!m) continue;
    const n = Number(m[1]);
    if (Number.isFinite(n) && n > max) max = n;
  }
  return max + 1;
}

function idWithPrefix(prefix, n) {
  return `${prefix}-${String(n).padStart(3, '0')}`;
}

async function upsertExtractRollup(updated, bySource) {
  const path = join(ledgerDir, 'source-extract-log.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));

  const targetSource = '(locator-url-normalization)';
  const existingIndex = rows.findIndex((r, i) => i > 0 && r[idx.source_id] === targetSource && r[idx.researcher] === OWNER);
  const nextId = nextNumericId(rows, idx.extract_id, 'EXT');

  const noteParts = [...bySource.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([source, count]) => `${source}:${count}`)
    .join('; ');

  const entry = {
    extract_id: existingIndex >= 0 ? rows[existingIndex][idx.extract_id] : idWithPrefix('EXT', nextId),
    source_id: targetSource,
    date: DATE,
    extract_status: 'in_progress',
    target_scope: 'Locator URL normalization for direct claims',
    claim_or_context_note: `Batch E added explicit URL anchors to ${updated} direct-claim locators that previously lacked source URLs.`,
    locator: 'relationship-evidence-ledger.csv direct rows by primary_source_id',
    researcher: OWNER,
    notes: noteParts || 'No rows updated.'
  };

  const rowData = header.map(col => entry[col] ?? '');
  if (existingIndex >= 0) rows[existingIndex] = rowData;
  else rows.push(rowData);

  const body = rows
    .slice(1)
    .sort((a, b) => a[idx.extract_id].localeCompare(b[idx.extract_id], undefined, { numeric: true }));
  await writeFile(path, toCsv([header, ...body]), 'utf8');
  return entry.extract_id;
}

async function upsertQueueRollup(updated) {
  const path = join(ledgerDir, 'source-expansion-queue.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));

  const entry = {
    queue_id: 'SRCQ-022',
    priority: 'P1',
    track: 'Locator quality normalization',
    dynasty_or_topic: 'Direct-claim URL anchor standardization',
    target_claim_scope: 'Normalize direct relationship locators to include explicit source URL anchors',
    candidate_source_id: '(multi-source direct-claim locators)',
    source_url: '(multi)',
    publisher: 'Mixed',
    source_type: 'quality normalization pass',
    expected_grade: 'B',
    status: 'in_progress',
    last_updated: DATE,
    owner: OWNER,
    notes: `Batch E URL-normalized ${updated} direct-claim locators.`
  };

  const existingIndex = rows.findIndex((r, i) => i > 0 && r[idx.queue_id] === entry.queue_id);
  const rowData = header.map(col => entry[col] ?? '');
  if (existingIndex >= 0) rows[existingIndex] = rowData;
  else rows.push(rowData);

  const body = rows
    .slice(1)
    .sort((a, b) => a[idx.queue_id].localeCompare(b[idx.queue_id], undefined, { numeric: true }));
  await writeFile(path, toCsv([header, ...body]), 'utf8');
  return entry.queue_id;
}

async function main() {
  const dataset = getDataset('research');
  const sourceById = new Map(sourceRegistry.map(source => [source.id, source]));

  const { updated, bySource } = await normalizeRelationshipLocators(dataset, sourceById);
  const extractId = await upsertExtractRollup(updated, bySource);
  const queueId = await upsertQueueRollup(updated);

  console.log(`Phase 1 locator batch E complete:\n- direct locators URL-normalized: ${updated}\n- source extract upserted: ${extractId}\n- source queue upserted: ${queueId}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

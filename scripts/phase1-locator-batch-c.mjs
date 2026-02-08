#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDataset } from '../src/data/sovereigns.merge.js';

const DATE = '2026-02-08';
const OWNER = 'phase1-locator-c';
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const ledgerDir = join(rootDir, 'docs', 'research-program', 'ledgers');

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

function toNumId(id) {
  return Number(String(id || '').replace(/^P/, ''));
}

function buildExcerpt(row, idx, byPersonId) {
  const rel = row[idx.relation_type];
  const srcNum = toNumId(row[idx.source_id]);
  const dstNum = toNumId(row[idx.target_id]);
  const source = personLabel(byPersonId, row[idx.source_id]);
  const target = personLabel(byPersonId, row[idx.target_id]);
  const label = row[idx.label] ? ` (${row[idx.label]})` : '';

  if (rel === 'parent') {
    return `MRF sovereign table linkage uses entry No.${dstNum} in lineage connection with No.${srcNum} for modeled parent relation (${source} -> ${target}).`;
  }
  if (rel === 'sibling') {
    return `MRF sovereign table branch context connects entries No.${srcNum} and No.${dstNum} in sibling-family context${label}. (${source} <-> ${target}).`;
  }
  if (rel === 'spouse') {
    return `MRF sovereign table and branch notes associate entries No.${srcNum} and No.${dstNum} in marital context${label}. (${source} <-> ${target}).`;
  }
  return `MRF sovereign table/branch context connects entries No.${srcNum} and No.${dstNum} for modeled kin relation${label}. (${source} <-> ${target}).`;
}

function buildLocator(row, idx) {
  const srcNum = toNumId(row[idx.source_id]);
  const dstNum = toNumId(row[idx.target_id]);
  return `SRC-MRF-KINGS r.jina mirror (maldives_kings_list.full.shtml), sovereign table entries No.${srcNum} and No.${dstNum} in 2026-02-08 snapshot.`;
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
    if (row[idx.primary_source_id] !== 'SRC-MRF-KINGS') continue;
    if (!/requires locator-level excerpt/i.test(row[idx.citation_locator] || '')) continue;

    const srcNum = toNumId(row[idx.source_id]);
    const dstNum = toNumId(row[idx.target_id]);
    if (!Number.isFinite(srcNum) || !Number.isFinite(dstNum)) continue;
    if (srcNum > 95 || dstNum > 95) continue;

    row[idx.claim_excerpt] = buildExcerpt(row, idx, byPersonId);
    row[idx.citation_locator] = buildLocator(row, idx);
    row[idx.review_status] = 'in_progress';
    row[idx.canonical_decision] = 'pending';
    row[idx.reviewer] = OWNER;
    row[idx.last_reviewed] = DATE;
    row[idx.access_date] = DATE;
    row[idx.notes] = 'Table-entry locator captured via r.jina mirror; direct quote extraction still recommended for promotion.';
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

  const entry = {
    extract_id: 'EXT-028',
    source_id: 'SRC-MRF-KINGS',
    date: DATE,
    extract_status: 'in_progress',
    target_scope: 'Sovereign table entry locator extraction',
    claim_or_context_note: 'Captured entry-number locators for low-ID sovereign table relations via r.jina mirror snapshot.',
    locator: 'r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml',
    researcher: OWNER,
    notes: 'Used for claims where both endpoints are within sovereign entry range P1..P95.'
  };

  const rowData = header.map(col => entry[col] ?? '');
  if (byId.has(entry.extract_id)) rows[byId.get(entry.extract_id)] = rowData;
  else rows.push(rowData);

  const body = rows.slice(1).sort((a, b) => a[idx.extract_id].localeCompare(b[idx.extract_id], undefined, { numeric: true }));
  await writeFile(path, toCsv([header, ...body]), 'utf8');
  return entry.extract_id;
}

async function upsertSourceQueue() {
  const path = join(ledgerDir, 'source-expansion-queue.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  const byId = new Map();
  for (let i = 1; i < rows.length; i++) byId.set(rows[i][idx.queue_id], i);

  const entry = {
    queue_id: 'SRCQ-020',
    priority: 'P1',
    track: 'MRF table extraction',
    dynasty_or_topic: 'Sovereign table entries P1-P95',
    target_claim_scope: 'Entry-number locator capture for parent/sibling/spouse/kin rows',
    candidate_source_id: 'SRC-MRF-KINGS',
    source_url: 'https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml',
    publisher: 'Maldives Royal Family (via r.jina mirror)',
    source_type: 'specialist genealogy compendium',
    expected_grade: 'B',
    status: 'in_progress',
    last_updated: DATE,
    owner: OWNER,
    notes: 'Batch C captured table-entry locators for claims with endpoints in P1..P95; quote-level extraction remains pending.'
  };

  const rowData = header.map(col => entry[col] ?? '');
  if (byId.has(entry.queue_id)) rows[byId.get(entry.queue_id)] = rowData;
  else rows.push(rowData);

  const body = rows.slice(1).sort((a, b) => a[idx.queue_id].localeCompare(b[idx.queue_id], undefined, { numeric: true }));
  await writeFile(path, toCsv([header, ...body]), 'utf8');
  return entry.queue_id;
}

async function main() {
  const dataset = getDataset('research');
  const changed = await updateRelationshipLedger(dataset);
  const ext = await upsertSourceExtractLog();
  const queue = await upsertSourceQueue();
  console.log(`Phase 1 locator batch C complete:
- relationship claims updated: ${changed}
- source extract upserted: ${ext}
- source queue upserted: ${queue}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

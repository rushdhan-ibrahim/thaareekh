#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DATE = '2026-02-08';
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

function splitRefs(value) {
  if (!value) return [];
  return String(value).split('|').map(v => v.trim()).filter(Boolean);
}

async function main() {
  const extractCsv = parseCsv(await readFile(join(ledgerDir, 'source-extract-log.csv'), 'utf8'));
  const extractIdx = Object.fromEntries(extractCsv[0].map((h, i) => [h, i]));
  const extractBySource = new Map();
  for (let i = 1; i < extractCsv.length; i++) {
    const row = extractCsv[i];
    const sourceId = row[extractIdx.source_id];
    const extractId = row[extractIdx.extract_id];
    if (sourceId && extractId && !extractBySource.has(sourceId)) {
      extractBySource.set(sourceId, extractId);
    }
  }

  const inferenceCsv = parseCsv(await readFile(join(ledgerDir, 'inference-dossier-tracker.csv'), 'utf8'));
  const inferenceIdx = Object.fromEntries(inferenceCsv[0].map((h, i) => [h, i]));
  const inferenceDossierByKey = new Map();
  for (let i = 1; i < inferenceCsv.length; i++) {
    const row = inferenceCsv[i];
    inferenceDossierByKey.set(row[inferenceIdx.edge_key], row[inferenceIdx.dossier_file]);
  }

  const relPath = join(ledgerDir, 'relationship-evidence-ledger.csv');
  const relCsv = parseCsv(await readFile(relPath, 'utf8'));
  const relIdx = Object.fromEntries(relCsv[0].map((h, i) => [h, i]));

  let touched = 0;
  for (let i = 1; i < relCsv.length; i++) {
    const row = relCsv[i];
    const sourceId = row[relIdx.primary_source_id] || splitRefs(row[relIdx.evidence_refs])[0];
    const extractId = extractBySource.get(sourceId);
    const edgeKey = row[relIdx.edge_key];
    const claimType = row[relIdx.claim_type];

    const locator = row[relIdx.citation_locator] || '';
    if (/locator extraction pending/i.test(locator)) {
      row[relIdx.citation_locator] = extractId
        ? `Primary source ${sourceId} requires locator-level excerpt; tracked in ${extractId}.`
        : `Primary source ${sourceId || '(unassigned)'} requires locator-level excerpt; tracked in source-expansion queue.`;
      touched += 1;
    }

    const note = row[relIdx.notes] || '';
    if (/Backfilled from inference metadata/i.test(note)) {
      const dossier = inferenceDossierByKey.get(edgeKey);
      row[relIdx.notes] = dossier
        ? `Inference claim prepared for verification; pair dossier: ${dossier}.`
        : 'Inference claim prepared for verification; pair dossier mapping pending.';
      touched += 1;
    } else if (/Direct claim moved to in_progress/i.test(note)) {
      row[relIdx.notes] = extractId
        ? `Direct claim queued for locator extraction and corroboration in ${extractId}.`
        : 'Direct claim queued for locator extraction; extraction tracker mapping pending.';
      touched += 1;
    } else if (/Contested claim moved to in_progress/i.test(note)) {
      row[relIdx.notes] = extractId
        ? `Contested claim queued for locator extraction and contradiction adjudication in ${extractId}.`
        : 'Contested claim queued for contradiction adjudication; extraction tracker mapping pending.';
      touched += 1;
    }

    if (row[relIdx.review_status] === 'in_progress') {
      row[relIdx.last_reviewed] = DATE;
    }
    if (row[relIdx.review_status] === 'in_progress' && !row[relIdx.reviewer]) {
      row[relIdx.reviewer] = 'phase1-quality-refresh';
      touched += 1;
    }
    if (row[relIdx.review_status] === 'in_progress' && !row[relIdx.access_date]) {
      row[relIdx.access_date] = DATE;
      touched += 1;
    }
    if (claimType === 'inferred' && !row[relIdx.citation_locator]) {
      const dossier = inferenceDossierByKey.get(edgeKey);
      if (dossier) {
        row[relIdx.citation_locator] = `Inference basis documented in ${dossier}.`;
        touched += 1;
      }
    }
  }

  await writeFile(relPath, toCsv(relCsv), 'utf8');
  console.log(`Relationship ledger quality refresh complete: ${touched} field updates.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

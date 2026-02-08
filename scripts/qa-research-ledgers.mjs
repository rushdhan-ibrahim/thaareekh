#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDataset } from '../src/data/sovereigns.merge.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const ledgerDir = join(rootDir, 'docs', 'research-program', 'ledgers');

async function read(path) {
  return readFile(path, 'utf8');
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

function dataRows(parsed) {
  if (parsed.length <= 1) return 0;
  return parsed.length - 1;
}

function invalidColumnRows(parsed) {
  if (!parsed.length) return [];
  const width = parsed[0].length;
  const bad = [];
  for (let i = 1; i < parsed.length; i++) {
    if (parsed[i].length !== width) bad.push(i + 1);
  }
  return bad;
}

async function main() {
  const dataset = getDataset('research');
  const inferredCount = dataset.edges.filter(e => e.c === 'i').length;

  const personCsv = await read(join(ledgerDir, 'person-coverage.csv'));
  const edgeCsv = await read(join(ledgerDir, 'relationship-evidence-ledger.csv'));
  const inferenceCsv = await read(join(ledgerDir, 'inference-dossier-tracker.csv'));
  const conceptCsv = await read(join(ledgerDir, 'concept-coverage.csv'));
  const sourceQueueCsv = await read(join(ledgerDir, 'source-expansion-queue.csv'));
  const sourceExtractCsv = await read(join(ledgerDir, 'source-extract-log.csv'));

  const issues = [];
  const personParsed = parseCsv(personCsv);
  const edgeParsed = parseCsv(edgeCsv);
  const inferenceParsed = parseCsv(inferenceCsv);
  const conceptParsed = parseCsv(conceptCsv);
  const sourceQueueParsed = parseCsv(sourceQueueCsv);
  const sourceExtractParsed = parseCsv(sourceExtractCsv);

  const personRows = dataRows(personParsed);
  const edgeRows = dataRows(edgeParsed);
  const inferenceRows = dataRows(inferenceParsed);
  const conceptRows = dataRows(conceptParsed);
  const sourceQueueRows = dataRows(sourceQueueParsed);
  const sourceExtractRows = dataRows(sourceExtractParsed);

  if (personRows !== dataset.people.length) {
    issues.push(`Person ledger rows (${personRows}) != people in research mode (${dataset.people.length}).`);
  }
  if (edgeRows !== dataset.edges.length) {
    issues.push(`Relationship ledger rows (${edgeRows}) != edges in research mode (${dataset.edges.length}).`);
  }
  if (inferenceRows !== inferredCount) {
    issues.push(`Inference tracker rows (${inferenceRows}) != inferred edges (${inferredCount}).`);
  }
  if (conceptRows === 0) {
    issues.push('Concept coverage ledger has no rows.');
  }
  if (sourceQueueRows === 0) {
    issues.push('Source expansion queue has no rows.');
  }
  if (sourceExtractRows === 0) {
    issues.push('Source extract log has no rows.');
  }

  const csvChecks = [
    ['person-coverage.csv', personParsed],
    ['relationship-evidence-ledger.csv', edgeParsed],
    ['inference-dossier-tracker.csv', inferenceParsed],
    ['concept-coverage.csv', conceptParsed],
    ['source-expansion-queue.csv', sourceQueueParsed],
    ['source-extract-log.csv', sourceExtractParsed]
  ];
  csvChecks.forEach(([name, parsed]) => {
    const badRows = invalidColumnRows(parsed);
    if (badRows.length) {
      issues.push(`${name} has inconsistent column counts at rows: ${badRows.join(', ')}`);
    }
  });

  if (issues.length) {
    console.error(`Research ledger QA failed (${issues.length}):`);
    issues.forEach(msg => console.error(`- ${msg}`));
    process.exit(1);
  }

  console.log(`Research ledger QA passed:
- people: ${personRows}
- edges: ${edgeRows}
- inferred edges: ${inferenceRows}
- concept rows: ${conceptRows}
- source queue rows: ${sourceQueueRows}
- source extract rows: ${sourceExtractRows}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

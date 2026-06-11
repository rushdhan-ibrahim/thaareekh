#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const inputDate = process.argv.slice(2).find(v => /^\d{4}-\d{2}-\d{2}$/.test(v));
const DATE = inputDate || new Date().toISOString().slice(0, 10);

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const relationshipPath = join(rootDir, 'docs', 'research-program', 'ledgers', 'relationship-evidence-ledger.csv');
const inferencePath = join(rootDir, 'docs', 'research-program', 'ledgers', 'inference-dossier-tracker.csv');
const outputPath = join(rootDir, 'src', 'data', 'relationship-verification.js');

const RELATIONSHIP_LEDGER_PATH = 'docs/research-program/ledgers/relationship-evidence-ledger.csv';
const INFERENCE_TRACKER_PATH = 'docs/research-program/ledgers/inference-dossier-tracker.csv';
const CONFIDENCE_EXPLAINER_PATH = 'docs/confidence-grade-explainer.md';
const UNDIRECTED_TYPES = new Set(['sibling', 'spouse', 'kin']);

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

function headerIndex(row) {
  return Object.fromEntries((row || []).map((h, i) => [h, i]));
}

function rowCell(row, idx, key) {
  const pos = idx[key];
  return pos == null ? '' : String(row[pos] || '');
}

function normalizeLabel(v) {
  return String(v || '').trim();
}

function keyParts(t, s, d, l = '') {
  const label = normalizeLabel(l);
  if (UNDIRECTED_TYPES.has(t)) {
    const [a, b] = [s, d].sort();
    return { t, s: a, d: b, l: label };
  }
  return { t, s, d, l: label };
}

function edgeKeyFromParts(t, s, d, l = '') {
  const p = keyParts(t, s, d, l);
  return `${p.t}|${p.s}|${p.d}|${p.l}`;
}

function splitEdgeKey(edgeKey) {
  const parts = String(edgeKey || '').split('|');
  return {
    t: parts[0] || '',
    s: parts[1] || '',
    d: parts[2] || '',
    l: parts.slice(3).join('|')
  };
}

function normalizeEdgeKey(edgeKey) {
  const p = splitEdgeKey(edgeKey);
  return edgeKeyFromParts(p.t, p.s, p.d, p.l);
}

function jsStr(value) {
  return JSON.stringify(String(value ?? ''));
}

function mapEntryCode(item) {
  const p = splitEdgeKey(item.edgeKey);
  return `  [k(${jsStr(p.t)}, ${jsStr(p.s)}, ${jsStr(p.d)}, ${jsStr(p.l)}), {\n    claim_id: ${jsStr(item.claim_id)},\n    confidence: ${jsStr(item.confidence)},\n    claim_type: ${jsStr(item.claim_type)},\n    confidence_grade: ${jsStr(item.confidence_grade)},\n    primary_source_id: ${jsStr(item.primary_source_id)},\n    review_status: ${jsStr(item.review_status)},\n    canonical_decision: ${jsStr(item.canonical_decision)},\n    reviewer: ${jsStr(item.reviewer)},\n    last_reviewed: ${jsStr(item.last_reviewed)},\n    inference_class: ${jsStr(item.inference_class)},\n    inference_rule: ${jsStr(item.inference_rule)},\n    dossier_status: ${jsStr(item.dossier_status)},\n    dossier_file: ${jsStr(item.dossier_file)},\n    tracker_last_updated: ${jsStr(item.tracker_last_updated)}\n  }]`;
}

async function main() {
  const relationshipCsv = parseCsv(await readFile(relationshipPath, 'utf8'));
  const inferenceCsv = parseCsv(await readFile(inferencePath, 'utf8'));

  if (!relationshipCsv.length) {
    throw new Error(`relationship ledger is empty: ${relationshipPath}`);
  }
  if (!inferenceCsv.length) {
    throw new Error(`inference tracker is empty: ${inferencePath}`);
  }

  const relIdx = headerIndex(relationshipCsv[0]);
  const infIdx = headerIndex(inferenceCsv[0]);

  const entriesByKey = new Map();

  for (const row of relationshipCsv.slice(1)) {
    const edgeKey = normalizeEdgeKey(rowCell(row, relIdx, 'edge_key'));
    if (!edgeKey) continue;

    const base = {
      edgeKey,
      claim_id: rowCell(row, relIdx, 'claim_id'),
      confidence: rowCell(row, relIdx, 'confidence'),
      claim_type: rowCell(row, relIdx, 'claim_type'),
      confidence_grade: rowCell(row, relIdx, 'confidence_grade'),
      primary_source_id: rowCell(row, relIdx, 'primary_source_id'),
      review_status: rowCell(row, relIdx, 'review_status'),
      canonical_decision: rowCell(row, relIdx, 'canonical_decision'),
      reviewer: rowCell(row, relIdx, 'reviewer'),
      last_reviewed: rowCell(row, relIdx, 'last_reviewed'),
      inference_class: '',
      inference_rule: '',
      dossier_status: '',
      dossier_file: '',
      tracker_last_updated: '',
    };

    entriesByKey.set(edgeKey, base);
  }

  for (const row of inferenceCsv.slice(1)) {
    const edgeKey = normalizeEdgeKey(rowCell(row, infIdx, 'edge_key'));
    if (!edgeKey) continue;

    const entry = entriesByKey.get(edgeKey) || {
      edgeKey,
      claim_id: '',
      confidence: '',
      claim_type: 'inferred',
      confidence_grade: rowCell(row, infIdx, 'confidence_grade'),
      primary_source_id: '',
      review_status: '',
      canonical_decision: '',
      reviewer: '',
      last_reviewed: '',
      inference_class: '',
      inference_rule: '',
      dossier_status: '',
      dossier_file: '',
      tracker_last_updated: '',
    };

    entry.inference_class = rowCell(row, infIdx, 'inference_class');
    entry.inference_rule = rowCell(row, infIdx, 'inference_rule');
    entry.dossier_status = rowCell(row, infIdx, 'dossier_status');
    entry.dossier_file = rowCell(row, infIdx, 'dossier_file');
    entry.tracker_last_updated = rowCell(row, infIdx, 'last_updated');
    entriesByKey.set(edgeKey, entry);
  }

  const entries = [...entriesByKey.values()].sort((a, b) => a.edgeKey.localeCompare(b.edgeKey));
  const body = entries.map(mapEntryCode).join(',\n');

  const fileContent = `const UNDIRECTED_TYPES = new Set(['sibling', 'spouse', 'kin']);

function normalizeLabel(v) {
  return (v || '').trim();
}

function keyParts(t, s, d, l = '') {
  const label = normalizeLabel(l);
  if (UNDIRECTED_TYPES.has(t)) {
    const [a, b] = [s, d].sort();
    return { t, s: a, d: b, l: label };
  }
  return { t, s, d, l: label };
}

export function relationshipEdgeKey(edge) {
  if (!edge) return '';
  const p = keyParts(edge.t, edge.s, edge.d, edge.l || '');
  return p.t + '|' + p.s + '|' + p.d + '|' + p.l;
}

function k(t, s, d, l = '') {
  const p = keyParts(t, s, d, l);
  return p.t + '|' + p.s + '|' + p.d + '|' + p.l;
}

const RELATIONSHIP_LEDGER_PATH = ${jsStr(RELATIONSHIP_LEDGER_PATH)};
const INFERENCE_TRACKER_PATH = ${jsStr(INFERENCE_TRACKER_PATH)};
const CONFIDENCE_EXPLAINER_PATH = ${jsStr(CONFIDENCE_EXPLAINER_PATH)};

// Auto-synced from relationship + inference ledgers on ${DATE}.
const VERIFICATION_INDEX = new Map([
${body}
]);

export function getRelationshipVerification(edge) {
  return VERIFICATION_INDEX.get(relationshipEdgeKey(edge)) || null;
}

export function getRelationshipVerificationByEdgeKey(edgeKey) {
  if (!edgeKey) return null;
  const parts = String(edgeKey).split('|');
  const t = parts[0] || '';
  const s = parts[1] || '';
  const d = parts[2] || '';
  const l = parts.slice(3).join('|');
  return VERIFICATION_INDEX.get(k(t, s, d, l)) || null;
}

export function getRelationshipVerificationDocs() {
  return {
    relationship_ledger_path: RELATIONSHIP_LEDGER_PATH,
    inference_tracker_path: INFERENCE_TRACKER_PATH,
    confidence_explainer_path: CONFIDENCE_EXPLAINER_PATH
  };
}
`;

  await writeFile(outputPath, fileContent, 'utf8');
  console.log(`Synced relationship verification index: ${entries.length} edges.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

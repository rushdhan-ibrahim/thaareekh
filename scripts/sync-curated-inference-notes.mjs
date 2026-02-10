#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const inputDate = process.argv.slice(2).find(v => /^\d{4}-\d{2}-\d{2}$/.test(v));
const DATE = inputDate || new Date().toISOString().slice(0, 10);

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const trackerPath = join(rootDir, 'docs', 'research-program', 'ledgers', 'inference-dossier-tracker.csv');
const outputPath = join(rootDir, 'src', 'data', 'inference-notes.js');

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

function splitKey(edgeKey) {
  const parts = String(edgeKey || '').split('|');
  return {
    t: parts[0] || '',
    s: parts[1] || '',
    d: parts[2] || '',
    l: parts.slice(3).join('|')
  };
}

function between(text, startHeading, endHeading) {
  const start = text.indexOf(startHeading);
  if (start < 0) return '';
  const from = start + startHeading.length;
  const tail = text.slice(from);
  const end = tail.indexOf(endHeading);
  if (end < 0) return tail.trim();
  return tail.slice(0, end).trim();
}

function extractSummary(dossierText) {
  const m = dossierText.match(/^- Pair summary:\s*(.+)$/m);
  return m ? m[1].trim() : 'Pair-specific inference rationale documented in dossier.';
}

function extractLogic(dossierText) {
  const block = between(dossierText, '## 3) Logic chain (pair-specific)', '## 4) Alternative interpretations');
  const lines = block
    .split('\n')
    .map(line => line.trim())
    .filter(line => /^\d+\.\s+/.test(line))
    .map(line => line.replace(/^\d+\.\s+/, '').replace(/^-\s+/, '').trim())
    .filter(Boolean);
  return lines.length ? lines : ['Pair-specific logic chain is recorded in the dossier.'];
}

function extractVerification(dossierText) {
  const block = between(dossierText, '## 5) Verification checklist', '## 6) Source basis');
  const lines = block
    .split('\n')
    .map(line => line.trim())
    .filter(line => /^-\s+/.test(line))
    .map(line => line.replace(/^-\s+/, '').trim())
    .filter(Boolean);
  return lines.length ? lines : ['Use dossier verification checklist for upgrade/downgrade criteria.'];
}

function jsStr(value) {
  return JSON.stringify(String(value ?? ''));
}

function mapEntryCode(item) {
  const { t, s, d, l } = splitKey(item.edgeKey);
  const summary = jsStr(item.summary);
  const dossier = jsStr(item.dossier);
  const logic = item.logic.map(v => `      ${jsStr(v)}`).join(',\n');
  const verification = item.verification.map(v => `      ${jsStr(v)}`).join(',\n');
  return `  [k(${jsStr(t)}, ${jsStr(s)}, ${jsStr(d)}, ${jsStr(l)}), {\n    summary: ${summary},\n    dossier: ${dossier},\n    logic: [\n${logic}\n    ],\n    verification: [\n${verification}\n    ]\n  }]`;
}

async function main() {
  const trackerCsv = parseCsv(await readFile(trackerPath, 'utf8'));
  const idx = Object.fromEntries(trackerCsv[0].map((h, i) => [h, i]));

  const inferenceRows = trackerCsv
    .slice(1)
    .filter(row => (row[idx.edge_key] || '').trim() && (row[idx.dossier_file] || '').trim());
  const entries = [];

  for (const row of inferenceRows) {
    const edgeKey = row[idx.edge_key];
    const dossierRelPath = row[idx.dossier_file];
    const dossierPath = join(rootDir, dossierRelPath);
    const dossierText = await readFile(dossierPath, 'utf8');

    entries.push({
      edgeKey,
      dossier: dossierRelPath,
      summary: extractSummary(dossierText),
      logic: extractLogic(dossierText),
      verification: extractVerification(dossierText)
    });
  }

  entries.sort((a, b) => a.edgeKey.localeCompare(b.edgeKey));

  const body = entries.map(mapEntryCode).join(',\n');
  const fileContent = `const UNDIRECTED_TYPES = new Set(['sibling', 'spouse', 'kin']);

function normalizeLabel(v) {
  return (v || '').trim();
}

function keyParts(t, s, d, l = '') {
  const label = normalizeLabel(l);
  if (UNDIRECTED_TYPES.has(t)) {
    const [a, b] = [s, d].sort();
    return \`${'${t}|${a}|${b}|${label}'}\`;
  }
  return \`${'${t}|${s}|${d}|${label}'}\`;
}

export function inferenceEdgeKey(edge) {
  if (!edge) return '';
  return keyParts(edge.t, edge.s, edge.d, edge.l || '');
}

function k(t, s, d, l = '') {
  return keyParts(t, s, d, l);
}

// Auto-synced from inference dossiers on ${DATE}.
const INFERENCE_NOTES = new Map([
${body}
]);

export function getInferenceNote(edge) {
  return INFERENCE_NOTES.get(inferenceEdgeKey(edge)) || null;
}

export function getCuratedInferenceNote(edge) {
  return getInferenceNote(edge);
}

export function getInferenceDossierPath(edge) {
  return getInferenceNote(edge)?.dossier || '';
}

export function isDerivedInferenceEdge(edge) {
  if (!edge) return false;
  if (edge.c !== 'i') return false;
  return (edge.evidence_refs || []).includes('SRC-DERIVED-RULES')
    || String(edge.event_context || '').startsWith('derived:');
}
`;

  await writeFile(outputPath, fileContent, 'utf8');
  console.log(`Synced inference notes from dossiers: ${entries.length} entries.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

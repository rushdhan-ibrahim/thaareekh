#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { access } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const researchDir = join(rootDir, 'docs', 'research-program');
const ledgerDir = join(researchDir, 'ledgers');

const PERSON_REQUIRED_HEADINGS = [
  '## 1) Identity',
  '## 2) Titles, styles, and offices',
  '## 3) Timeline anchors',
  '## 4) Family and relationships',
  '## 5) Evidence summary',
  '## 6) Source list',
  '## 7) Open questions',
  '## 8) Notes for graph integration'
];

const INFERENCE_REQUIRED_HEADINGS = [
  '## 1) Edge identity',
  '## 2) Why this specific pair is modeled',
  '## 3) Logic chain (pair-specific)',
  '## 4) Alternative interpretations',
  '## 5) Verification checklist',
  '## 6) Source basis',
  '## 7) Integration notes'
];

const CONCEPT_REQUIRED_HEADINGS = [
  '## 1) Canonical label',
  '## 2) Definition',
  '## 3) Semantic and historical notes',
  '## 4) Person and event links',
  '## 5) Evidence',
  '## 6) Source list',
  '## 7) Open questions'
];

const LOW_DEPTH_PATTERNS = [
  /to be expanded/gi,
  /working definition drafted/gi,
  /not yet extracted/gi,
  /none recorded/gi,
  /locator extraction pending/gi,
  /pending source assignment/gi
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

function rowIndex(header) {
  return Object.fromEntries(header.map((h, i) => [h, i]));
}

async function fileExists(path) {
  try {
    await access(path, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function countPatternHits(text) {
  return LOW_DEPTH_PATTERNS.reduce((sum, pattern) => {
    const matches = text.match(pattern);
    return sum + (matches ? matches.length : 0);
  }, 0);
}

function missingHeadings(text, required) {
  return required.filter(h => !text.includes(h));
}

async function auditPersonDossiers() {
  const csv = parseCsv(await readFile(join(ledgerDir, 'person-coverage.csv'), 'utf8'));
  const idx = rowIndex(csv[0]);
  const rows = csv.slice(1);

  let missingFiles = 0;
  let headingIssues = 0;
  let lowDepthFiles = 0;
  const worst = [];

  for (const row of rows) {
    const relPath = row[idx.dossier_file];
    if (!relPath) {
      missingFiles += 1;
      continue;
    }
    const path = join(rootDir, relPath);
    if (!(await fileExists(path))) {
      missingFiles += 1;
      continue;
    }
    const text = await readFile(path, 'utf8');
    const missing = missingHeadings(text, PERSON_REQUIRED_HEADINGS);
    if (missing.length) headingIssues += 1;

    const hits = countPatternHits(text);
    if (hits >= 8) {
      lowDepthFiles += 1;
      worst.push({ id: row[idx.person_id], hits });
    }
  }

  worst.sort((a, b) => b.hits - a.hits);
  return {
    total: rows.length,
    missingFiles,
    headingIssues,
    lowDepthFiles,
    worst: worst.slice(0, 12)
  };
}

async function auditInferenceDossiers() {
  const csv = parseCsv(await readFile(join(ledgerDir, 'inference-dossier-tracker.csv'), 'utf8'));
  const idx = rowIndex(csv[0]);
  const rows = csv.slice(1);

  let missingFiles = 0;
  let headingIssues = 0;
  let weakLogic = 0;
  const weakSamples = [];

  for (const row of rows) {
    const relPath = row[idx.dossier_file];
    if (!relPath) {
      missingFiles += 1;
      continue;
    }
    const path = join(rootDir, relPath);
    if (!(await fileExists(path))) {
      missingFiles += 1;
      continue;
    }
    const text = await readFile(path, 'utf8');
    const missing = missingHeadings(text, INFERENCE_REQUIRED_HEADINGS);
    if (missing.length) headingIssues += 1;

    const supportCount = (text.match(/Supporting edge:/g) || []).length;
    const supportNodeCount = (text.match(/Supporting node:/g) || []).length;
    if (row[idx.inference_class] === 'rule-derived' && supportCount + supportNodeCount === 0) {
      weakLogic += 1;
      weakSamples.push(row[idx.edge_key]);
    }
  }

  return {
    total: rows.length,
    missingFiles,
    headingIssues,
    weakLogic,
    weakSamples: weakSamples.slice(0, 12)
  };
}

async function auditConceptEntries() {
  const csv = parseCsv(await readFile(join(ledgerDir, 'concept-coverage.csv'), 'utf8'));
  const idx = rowIndex(csv[0]);
  const rows = csv.slice(1);

  let missingFiles = 0;
  let headingIssues = 0;
  let lowDepthFiles = 0;
  const worst = [];

  for (const row of rows) {
    const relPath = row[idx.entry_file];
    if (!relPath) {
      missingFiles += 1;
      continue;
    }
    const path = join(rootDir, relPath);
    if (!(await fileExists(path))) {
      missingFiles += 1;
      continue;
    }
    const text = await readFile(path, 'utf8');
    const missing = missingHeadings(text, CONCEPT_REQUIRED_HEADINGS);
    if (missing.length) headingIssues += 1;
    const hits = countPatternHits(text);
    if (hits >= 6) {
      lowDepthFiles += 1;
      worst.push({ id: row[idx.concept_id], hits });
    }
  }

  worst.sort((a, b) => b.hits - a.hits);
  return {
    total: rows.length,
    missingFiles,
    headingIssues,
    lowDepthFiles,
    worst: worst.slice(0, 8)
  };
}

async function auditRelationshipLedger() {
  const csv = parseCsv(await readFile(join(ledgerDir, 'relationship-evidence-ledger.csv'), 'utf8'));
  const idx = rowIndex(csv[0]);
  const rows = csv.slice(1);
  const unresolvedLocatorPatterns = [
    /locator extraction pending/i,
    /requires locator-level excerpt/i,
    /tracked in source-expansion queue/i
  ];

  let missingExcerpt = 0;
  let missingLocator = 0;
  let genericLocator = 0;
  let genericBackfillNote = 0;

  for (const row of rows) {
    const excerpt = row[idx.claim_excerpt] || '';
    const locator = row[idx.citation_locator] || '';
    const notes = row[idx.notes] || '';
    const hasPlaceholderLocator = unresolvedLocatorPatterns.some(pattern => pattern.test(locator));
    if (!excerpt.trim()) missingExcerpt += 1;
    if (!locator.trim() || hasPlaceholderLocator) missingLocator += 1;
    if (hasPlaceholderLocator) genericLocator += 1;
    if (/Backfilled from inference metadata/i.test(notes)) genericBackfillNote += 1;
  }

  return {
    total: rows.length,
    missingExcerpt,
    missingLocator,
    genericLocator,
    genericBackfillNote
  };
}

async function main() {
  const person = await auditPersonDossiers();
  const inference = await auditInferenceDossiers();
  const concept = await auditConceptEntries();
  const relationship = await auditRelationshipLedger();

  const report = {
    person,
    inference,
    concept,
    relationship
  };

  console.log(JSON.stringify(report, null, 2));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

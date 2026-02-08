#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DATE = '2026-02-08';
const OWNER = 'phase5-conflict-c';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const relationshipLedgerPath = join(rootDir, 'docs', 'research-program', 'ledgers', 'relationship-evidence-ledger.csv');
const promotionQueuePath = join(rootDir, 'docs', 'research-program', 'promotion-queue.md');
const contradictionLogPath = join(rootDir, 'docs', 'research-program', 'contradiction-log.md');

const QUEUE_START = '<!-- PROMOTION-BATCH-C-START -->';
const QUEUE_END = '<!-- PROMOTION-BATCH-C-END -->';
const CONTRA_START = '<!-- CONTRADICTION-BATCH-C-START -->';
const CONTRA_END = '<!-- CONTRADICTION-BATCH-C-END -->';

const FOCUS_CLAIM_IDS = new Set([
  'CLM-0209', // P86 -> P95 ancestor?
  'CLM-0212', // P87 -> P95 grandfather(via daughter)
  'CLM-0215', // P88 -> P95 grandfather?
  'CLM-0217', // P90 -> P95 inferred aunt/uncle
  'CLM-0219', // P91 -> P95 inferred aunt/uncle
  'CLM-0262', // P129 -> P95 parent
  'CLM-0363', // P86 -> P87 parent
  'CLM-0364', // P87 -> P129 parent (currently inferred)
  'CLM-0365', // P87 -> P90 parent
  'CLM-0366', // P87 -> P91 parent
  'CLM-0382', // P129 <-> P90 inferred sibling
  'CLM-0383', // P129 <-> P91 inferred sibling
  'CLM-0450'  // P90 <-> P91 half-brothers
]);

const DEFERRED_CLAIM_IDS = new Set([
  'CLM-0209',
  'CLM-0215'
]);

const CLASSIFICATION_REVIEW_IDS = new Set([
  'CLM-0364'
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

function replaceSection(text, start, end, section) {
  if (text.includes(start) && text.includes(end)) {
    const a = text.indexOf(start);
    const b = text.indexOf(end);
    return `${text.slice(0, a)}${section}${text.slice(b + end.length)}`;
  }
  return `${text.trimEnd()}\n\n${section}\n`;
}

function appendNote(row, idx, message) {
  const prev = row[idx.notes] || '';
  if (prev.includes(message)) return;
  row[idx.notes] = prev ? `${prev} ${message}` : message;
}

async function main() {
  const relCsv = parseCsv(await readFile(relationshipLedgerPath, 'utf8'));
  const relHeader = relCsv[0];
  const idx = Object.fromEntries(relHeader.map((h, i) => [h, i]));

  let reviewed = 0;
  let deferred = 0;
  let classificationFlagged = 0;

  for (let i = 1; i < relCsv.length; i++) {
    const row = relCsv[i];
    const claimId = row[idx.claim_id];
    if (!FOCUS_CLAIM_IDS.has(claimId)) continue;

    reviewed += 1;
    row[idx.reviewer] = OWNER;
    row[idx.last_reviewed] = DATE;
    row[idx.access_date] = DATE;
    appendNote(row, idx, `Phase 5 conflict batch C reviewed ${DATE} for P87/P90/P91/P95/P129 corridor.`);

    if (DEFERRED_CLAIM_IDS.has(claimId)) {
      row[idx.canonical_decision] = 'deferred';
      deferred += 1;
      appendNote(
        row,
        idx,
        'Deferred in Phase 5 batch C: ambiguous late-monarchy ancestor wording conflicts with stronger direct lineage scaffold; keep out of canonical promotion.'
      );
    }

    if (CLASSIFICATION_REVIEW_IDS.has(claimId)) {
      classificationFlagged += 1;
      appendNote(
        row,
        idx,
        'Phase 5 batch C classification review: excerpt uses direct parent wording but edge remains inferred; require quote-level extraction and one independent corroboration before promotion.'
      );
    }
  }

  await writeFile(relationshipLedgerPath, toCsv(relCsv), 'utf8');

  const queueSection = `${QUEUE_START}
## Batch 3 (2026-02-08): High-Impact Bridge Adjudication (P87/P90/P91/P95/P129)

### 1. \`parent|P87|P129|\`
1. Claim/edge: \`parent|P87|P129|\` (CLM-0364)
2. Proposed change: Keep edge as inferred for now, but prioritize immediate promotion review because current excerpt wording is direct parent language.
3. Evidence summary: Current ledger excerpt states direct parent wording from \`SRC-MRF-KINGS\` while model state remains inferred; this is a classification mismatch requiring quote-level confirmation and independent corroboration.
4. Source IDs: SRC-MRF-KINGS (+ target corroboration source to be added from queue)
5. Risk notes: High-visibility bridge into modern Didi descendants; misclassification would propagate to sibling and avuncular inference chains.
6. Reviewer: ${OWNER}
7. Status: pending

### 2. \`kin|P86|P95|ancestor?\` and \`kin|P88|P95|grandfather?\`
1. Claim/edge: \`kin|P86|P95|ancestor?\` (CLM-0209), \`kin|P88|P95|grandfather?\` (CLM-0215)
2. Proposed change: Defer canonical promotion and explicitly treat both as contested placeholders pending stronger source wording.
3. Evidence summary: Both claims remain question-mark labels from the same specialist source family, while stronger direct scaffold claims in the same corridor identify \`P87 -> P95\` as the explicit grandparent relation.
4. Source IDs: SRC-MRF-KINGS
5. Risk notes: These labels can be true only at broader generational depth, but current phrasing is too ambiguous for canonical edge semantics.
6. Reviewer: ${OWNER}
7. Status: deferred

### 3. \`kin|P90|P95|aunt/uncle↔niece/nephew\` and \`kin|P91|P95|aunt/uncle↔niece/nephew\`
1. Claim/edge: \`kin|P90|P95|aunt/uncle↔niece/nephew\` (CLM-0217), \`kin|P91|P95|aunt/uncle↔niece/nephew\` (CLM-0219)
2. Proposed change: Retain as inferred with no promotion change.
3. Evidence summary: Derived logic remains coherent via \`P87 -> P90/P91\` plus \`P87 -> P129 -> P95\`, but direct pairwise aunt/uncle wording is not captured yet.
4. Source IDs: SRC-DERIVED-RULES (+ support chain from SRC-MRF-KINGS and SRC-WIKI-MUHAMMAD-FAREED)
5. Risk notes: Safe as inferred; should only be promoted after pair-explicit wording is captured.
6. Reviewer: ${OWNER}
7. Status: pending

${QUEUE_END}`;
  const queueOld = await readFile(promotionQueuePath, 'utf8');
  const queueNew = replaceSection(queueOld, QUEUE_START, QUEUE_END, queueSection);
  await writeFile(promotionQueuePath, queueNew, 'utf8');

  const contradictionSection = `${CONTRA_START}
### Batch Review (2026-02-08) — Bridge Corridor Adjudication
- \`ID\`: CLOG-2026-02-08-C1
- \`Topic\`: Late-monarchy to modern bridge contradiction handling around P95
- \`Entities\`: P86, P87, P88, P90, P91, P95, P129
- \`Claim A\`: Direct scaffold claims indicate \`P87 -> P95\` (grandfather via daughter) and \`P129 -> P95\` parent linkage, supported by parent claims \`P87 -> P90/P91\`.
- \`Claim B\`: Contested labels \`P86 -> P95 ancestor?\` and \`P88 -> P95 grandfather?\` remain ambiguous and are currently D-grade placeholders.
- \`Sources\`: CLM-0212, CLM-0262, CLM-0363, CLM-0365, CLM-0366, CLM-0450 vs CLM-0209, CLM-0215; SRC-MRF-KINGS, SRC-WIKI-MUHAMMAD-FAREED, SRC-DERIVED-RULES
- \`Current stance\`: Keep direct scaffold claims active; defer ambiguous D-grade ancestor labels from canonical promotion.
- \`Adjudication rationale\`: The corridor has a coherent and explicit direct backbone for immediate relations; ambiguous question-mark labels do not meet canonical specificity standards.
- \`Next verification action\`: Capture quote-level excerpts for CLM-0209/0215 and add one independent corroboration source before revisiting.
- \`Last reviewed\`: ${DATE}

- \`ID\`: CLOG-2026-02-08-C2
- \`Topic\`: Classification mismatch on \`parent|P87|P129|\`
- \`Entities\`: P87, P129
- \`Claim A\`: CLM-0364 excerpt currently states direct parent wording from \`SRC-MRF-KINGS\`.
- \`Claim B\`: Edge remains marked inferred in dataset/ledger modeling.
- \`Sources\`: CLM-0364, docs/research-program/inferences/parent-p87-p129.md, SRC-MRF-KINGS
- \`Current stance\`: Treat as high-priority promotion candidate, but do not auto-promote until quote-level extraction and one independent corroboration check are complete.
- \`Adjudication rationale\`: This edge sits on a high-impact monarchy-to-modern bridge; strict promotion standards require explicit quote-level capture and corroboration to avoid overfitting to one source stream.
- \`Next verification action\`: Run targeted deep-source extraction pass for CLM-0364 and queue corroboration source assignment.
- \`Last reviewed\`: ${DATE}
${CONTRA_END}`;
  const contradictionOld = await readFile(contradictionLogPath, 'utf8');
  const contradictionNew = replaceSection(contradictionOld, CONTRA_START, CONTRA_END, contradictionSection);
  await writeFile(contradictionLogPath, contradictionNew, 'utf8');

  console.log(
    `Phase 5 conflict batch C complete:\n`
    + `- focus claims reviewed: ${reviewed}\n`
    + `- contested claims deferred: ${deferred}\n`
    + `- classification mismatches flagged: ${classificationFlagged}\n`
    + `- relationship ledger updated: ${relationshipLedgerPath}\n`
    + `- promotion queue updated: ${promotionQueuePath}\n`
    + `- contradiction log updated: ${contradictionLogPath}`
  );
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});


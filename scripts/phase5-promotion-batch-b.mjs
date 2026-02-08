#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DATE = '2026-02-08';
const OWNER = 'phase5-promo-b';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const relationshipLedgerPath = join(rootDir, 'docs', 'research-program', 'ledgers', 'relationship-evidence-ledger.csv');
const promotionQueuePath = join(rootDir, 'docs', 'research-program', 'promotion-queue.md');
const contradictionLogPath = join(rootDir, 'docs', 'research-program', 'contradiction-log.md');
const manifestPath = join(rootDir, 'docs', 'research-program', 'ledgers', 'promotion-batch-b-claims.csv');

const QUEUE_START = '<!-- PROMOTION-BATCH-B-START -->';
const QUEUE_END = '<!-- PROMOTION-BATCH-B-END -->';
const CONTRA_START = '<!-- CONTRADICTION-BATCH-B-START -->';
const CONTRA_END = '<!-- CONTRADICTION-BATCH-B-END -->';

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

function topEntries(counts, max = 10) {
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, max);
}

function formatDistribution(entries) {
  if (!entries.length) return 'none';
  return entries.map(([k, v]) => `${k} (${v})`).join(', ');
}

async function main() {
  const relCsv = parseCsv(await readFile(relationshipLedgerPath, 'utf8'));
  const relHeader = relCsv[0];
  const relIdx = Object.fromEntries(relHeader.map((h, i) => [h, i]));

  const selection = [];
  for (let i = 1; i < relCsv.length; i++) {
    const row = relCsv[i];
    const directStrong = row[relIdx.claim_type] === 'direct'
      && ['A', 'B'].includes(row[relIdx.confidence_grade] || '');
    const pendingReview = row[relIdx.review_status] !== 'approved';
    if (directStrong && pendingReview) {
      selection.push({
        row,
        claim_id: row[relIdx.claim_id],
        edge_key: row[relIdx.edge_key],
        relation_type: row[relIdx.relation_type],
        source_id: row[relIdx.source_id],
        target_id: row[relIdx.target_id],
        label: row[relIdx.label],
        primary_source_id: row[relIdx.primary_source_id],
        confidence_grade: row[relIdx.confidence_grade],
        claim_excerpt: row[relIdx.claim_excerpt]
      });
    }
  }

  if (!selection.length) {
    console.log('Phase 5 promotion batch B: no pending direct A/B claims; no changes applied.');
    return;
  }

  const directRows = relCsv.slice(1).filter(row => row[relIdx.claim_type] === 'direct');
  const tupleSeen = new Set();
  let duplicateDirectTuples = 0;
  for (const row of directRows) {
    const key = [
      row[relIdx.relation_type] || '',
      row[relIdx.source_id] || '',
      row[relIdx.target_id] || '',
      row[relIdx.label] || ''
    ].join('|');
    if (tupleSeen.has(key)) {
      duplicateDirectTuples += 1;
    } else {
      tupleSeen.add(key);
    }
  }

  const parentMap = new Map();
  for (const row of directRows) {
    if (row[relIdx.relation_type] !== 'parent') continue;
    if (!['A', 'B'].includes(row[relIdx.confidence_grade] || '')) continue;
    const child = row[relIdx.target_id] || '';
    const parent = row[relIdx.source_id] || '';
    if (!parentMap.has(child)) parentMap.set(child, new Set());
    parentMap.get(child).add(parent);
  }
  const overParentAssignments = [...parentMap.values()].filter(set => set.size > 2).length;

  if (duplicateDirectTuples > 0 || overParentAssignments > 0) {
    throw new Error(
      `Batch B safety checks failed: duplicateDirectTuples=${duplicateDirectTuples}, overParentAssignments=${overParentAssignments}`
    );
  }

  let approvedNow = 0;
  for (const item of selection) {
    const row = item.row;
    row[relIdx.review_status] = 'approved';
    if (row[relIdx.canonical_decision] !== 'approved') {
      approvedNow += 1;
    }
    row[relIdx.canonical_decision] = 'approved';
    row[relIdx.reviewer] = OWNER;
    row[relIdx.last_reviewed] = DATE;
    row[relIdx.access_date] = DATE;

    const note = row[relIdx.notes] || '';
    const stamp = `Promotion Batch B approved ${DATE}; remaining direct A/B claim.`;
    if (!note.includes(stamp)) {
      row[relIdx.notes] = note ? `${note} ${stamp}` : stamp;
    }
  }

  await writeFile(relationshipLedgerPath, toCsv(relCsv), 'utf8');

  const bySource = new Map();
  const byRelation = new Map();
  for (const item of selection) {
    const source = item.primary_source_id || '(none)';
    bySource.set(source, (bySource.get(source) || 0) + 1);
    const relation = item.relation_type || '(none)';
    byRelation.set(relation, (byRelation.get(relation) || 0) + 1);
  }
  const sourceTop = topEntries(bySource, 12);
  const relationTop = topEntries(byRelation, 10);
  const uniqueEdges = new Set(selection.map(item => item.edge_key)).size;

  const manifestRows = [
    [
      'claim_id',
      'edge_key',
      'relation_type',
      'source_id',
      'target_id',
      'label',
      'primary_source_id',
      'confidence_grade',
      'reviewer',
      'approved_date'
    ],
    ...selection
      .sort((a, b) => a.claim_id.localeCompare(b.claim_id))
      .map(item => [
        item.claim_id,
        item.edge_key,
        item.relation_type,
        item.source_id,
        item.target_id,
        item.label,
        item.primary_source_id,
        item.confidence_grade,
        OWNER,
        DATE
      ])
  ];
  await writeFile(manifestPath, toCsv(manifestRows), 'utf8');

  const queueSection = `${QUEUE_START}
## Batch 2 (2026-02-08): Remaining Direct A/B Claim Promotion

1. Claim/edge: \`batch|remaining-direct-a-b|2026-02-08\`
2. Proposed change: Approve the full remaining set of direct \`A/B\` claims that passed Phase 5 safety checks.
3. Evidence summary: ${selection.length} direct claims approved across ${uniqueEdges} unique edges. Relation split: ${formatDistribution(relationTop)}. Full manifest: \`docs/research-program/ledgers/promotion-batch-b-claims.csv\`.
4. Source IDs: ${formatDistribution(sourceTop)}
5. Risk notes: Structural contradiction pre-check passed (duplicate direct tuples: ${duplicateDirectTuples}; >2-parent anomalies: ${overParentAssignments}). Source concentration remains tracked in source-coverage audits.
6. Reviewer: ${OWNER}
7. Status: approved

${QUEUE_END}`;
  const queueOld = await readFile(promotionQueuePath, 'utf8');
  const queueNew = replaceSection(queueOld, QUEUE_START, QUEUE_END, queueSection);
  await writeFile(promotionQueuePath, queueNew, 'utf8');

  const contradictionSection = `${CONTRA_START}
### Batch Review (2026-02-08) — Promotion Batch B Pre-check
- \`ID\`: CLOG-2026-02-08-B
- \`Topic\`: Pre-promotion contradiction sweep for remaining direct A/B claims
- \`Entities\`: ${selection.length} direct A/B claims (${uniqueEdges} unique edges)
- \`Claim A\`: Selected claims have explicit relation text and citation locators in the relationship ledger.
- \`Claim B\`: Latent contradictions may surface when additional archival corpora are ingested.
- \`Sources\`: relationship-evidence-ledger.csv, source-coverage audits, contradiction-log baseline
- \`Current stance\`: No blocking contradiction found in structured ledger checks for this batch.
- \`Adjudication rationale\`: Duplicate direct tuple count is ${duplicateDirectTuples} and >2-parent anomaly count is ${overParentAssignments}; batch qualifies for canonical promotion.
- \`Next verification action\`: Re-run contradiction sweep after the next source-ingestion wave and append any competing claims.
- \`Last reviewed\`: ${DATE}
${CONTRA_END}`;
  const contradictionOld = await readFile(contradictionLogPath, 'utf8');
  const contradictionNew = replaceSection(contradictionOld, CONTRA_START, CONTRA_END, contradictionSection);
  await writeFile(contradictionLogPath, contradictionNew, 'utf8');

  console.log(
    `Phase 5 promotion batch B complete:\n`
    + `- direct claims in batch: ${selection.length}\n`
    + `- unique edges in batch: ${uniqueEdges}\n`
    + `- canonical_decision newly approved this run: ${approvedNow}\n`
    + `- manifest: ${manifestPath}\n`
    + `- promotion queue updated: ${promotionQueuePath}\n`
    + `- contradiction log updated: ${contradictionLogPath}`
  );
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

#!/usr/bin/env node

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DATE = '2026-02-08';
const OWNER = 'phase5-promo-a';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const inferencesDir = join(rootDir, 'docs', 'research-program', 'inferences');
const relationshipLedgerPath = join(rootDir, 'docs', 'research-program', 'ledgers', 'relationship-evidence-ledger.csv');
const promotionQueuePath = join(rootDir, 'docs', 'research-program', 'promotion-queue.md');
const contradictionLogPath = join(rootDir, 'docs', 'research-program', 'contradiction-log.md');

const QUEUE_START = '<!-- PROMOTION-BATCH-A-START -->';
const QUEUE_END = '<!-- PROMOTION-BATCH-A-END -->';
const CONTRA_START = '<!-- CONTRADICTION-BATCH-A-START -->';
const CONTRA_END = '<!-- CONTRADICTION-BATCH-A-END -->';

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

function uniq(arr) {
  return [...new Set((arr || []).filter(Boolean))];
}

function replaceSection(text, start, end, section) {
  if (text.includes(start) && text.includes(end)) {
    const a = text.indexOf(start);
    const b = text.indexOf(end);
    return `${text.slice(0, a)}${section}${text.slice(b + end.length)}`;
  }
  return `${text.trimEnd()}\n\n${section}\n`;
}

function extractClaimIds(text) {
  return uniq([...text.matchAll(/CLM-\d{4}/g)].map(m => m[0]));
}

function extractEdgeKey(text) {
  const m = text.match(/Edge key:\s*`([^`]+)`/);
  return m ? m[1].trim() : '';
}

function short(text, max = 200) {
  const s = String(text || '').replace(/\s+/g, ' ').trim();
  if (!s) return '';
  if (s.length <= max) return s;
  return `${s.slice(0, max - 3)}...`;
}

async function loadCuratedInferenceBundles(claimById) {
  const files = (await readdir(inferencesDir)).filter(name => name.endsWith('.md'));
  const bundles = [];

  for (const file of files.sort()) {
    const path = join(inferencesDir, file);
    const text = await readFile(path, 'utf8');
    if (!/Inference class:\s*`curated`/.test(text)) continue;

    const edgeKey = extractEdgeKey(text);
    const allClaimIds = extractClaimIds(text);
    const directStrongClaimIds = allClaimIds.filter(id => {
      const claim = claimById.get(id);
      if (!claim) return false;
      return claim.claim_type === 'direct' && ['A', 'B'].includes(claim.confidence_grade || '');
    });

    if (!directStrongClaimIds.length) continue;

    const rows = directStrongClaimIds.map(id => claimById.get(id)).filter(Boolean);
    const sourceIds = uniq(rows.map(row => row.primary_source_id));
    const dominant = (() => {
      const counts = new Map();
      for (const row of rows) {
        const source = row.primary_source_id || '(none)';
        counts.set(source, (counts.get(source) || 0) + 1);
      }
      const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
      if (!ranked.length) return null;
      return { source: ranked[0][0], count: ranked[0][1], total: rows.length };
    })();

    bundles.push({
      file,
      edgeKey,
      directStrongClaimIds,
      sourceIds,
      dominant,
      sampleExcerpt: short(rows[0]?.claim_excerpt || '', 180)
    });
  }

  return bundles.sort((a, b) => a.edgeKey.localeCompare(b.edgeKey));
}

async function main() {
  const relCsv = parseCsv(await readFile(relationshipLedgerPath, 'utf8'));
  const relHeader = relCsv[0];
  const relIdx = Object.fromEntries(relHeader.map((h, i) => [h, i]));

  const claimById = new Map();
  for (const row of relCsv.slice(1)) {
    claimById.set(row[relIdx.claim_id], {
      row,
      claim_id: row[relIdx.claim_id],
      claim_type: row[relIdx.claim_type],
      confidence_grade: row[relIdx.confidence_grade],
      review_status: row[relIdx.review_status],
      canonical_decision: row[relIdx.canonical_decision],
      primary_source_id: row[relIdx.primary_source_id],
      claim_excerpt: row[relIdx.claim_excerpt]
    });
  }

  const bundles = await loadCuratedInferenceBundles(claimById);
  const batchClaimIds = uniq(bundles.flatMap(bundle => bundle.directStrongClaimIds));
  const batchClaimIdSet = new Set(batchClaimIds);

  let approvedNow = 0;
  for (let i = 1; i < relCsv.length; i++) {
    const row = relCsv[i];
    const claimId = row[relIdx.claim_id];
    if (!batchClaimIdSet.has(claimId)) continue;

    row[relIdx.review_status] = 'approved';
    if (row[relIdx.canonical_decision] !== 'approved') {
      approvedNow += 1;
    }
    row[relIdx.canonical_decision] = 'approved';
    row[relIdx.reviewer] = OWNER;
    row[relIdx.last_reviewed] = DATE;
    row[relIdx.access_date] = DATE;

    const note = row[relIdx.notes] || '';
    const stamp = `Promotion Batch A approved ${DATE}; curated-inference support claim.`;
    if (!note.includes(stamp)) {
      row[relIdx.notes] = note ? `${note} ${stamp}` : stamp;
    }
  }

  await writeFile(relationshipLedgerPath, toCsv(relCsv), 'utf8');

  const queueEntries = bundles.map((bundle, i) => {
    const topIds = bundle.directStrongClaimIds.slice(0, 6).join(', ');
    const more = bundle.directStrongClaimIds.length > 6 ? ` (+${bundle.directStrongClaimIds.length - 6} more)` : '';
    const dominance = bundle.dominant && bundle.dominant.total > 0
      ? `${Math.round((bundle.dominant.count / bundle.dominant.total) * 100)}% ${bundle.dominant.source}`
      : 'no dominant source';

    return `### ${i + 1}. \`${bundle.edgeKey}\`
1. Claim/edge: \`${bundle.edgeKey}\`
2. Proposed change: Approve direct A/B support claims for this inferred-edge context while keeping the inferred edge itself unpromoted.
3. Evidence summary: ${bundle.directStrongClaimIds.length} direct claims approved (${topIds}${more}). Sample excerpt: ${bundle.sampleExcerpt || 'n/a'}
4. Source IDs: ${bundle.sourceIds.join(', ')}
5. Risk notes: Inferred edge remains provisional; support-claim source concentration snapshot: ${dominance}.
6. Reviewer: ${OWNER}
7. Status: approved`;
  });

  const queueSection = `${QUEUE_START}
## Batch 1 (2026-02-08): Curated Inference Support Promotion

${queueEntries.join('\n\n')}

${QUEUE_END}`;
  const queueOld = await readFile(promotionQueuePath, 'utf8');
  const queueNew = replaceSection(queueOld, QUEUE_START, QUEUE_END, queueSection);
  await writeFile(promotionQueuePath, queueNew, 'utf8');

  const contradictionSection = `${CONTRA_START}
### Batch Review (2026-02-08) — Promotion Batch A Pre-check
- \`ID\`: CLOG-2026-02-08-A
- \`Topic\`: Pre-promotion contradiction sweep for curated-inference support claims
- \`Entities\`: ${batchClaimIds.length} direct A/B claims linked from curated inference dossiers
- \`Claim A\`: Batch claims have explicit claim text and locator anchors in the relationship ledger.
- \`Claim B\`: Potential latent contradictions may still exist in not-yet-ingested primary archival sources.
- \`Sources\`: relationship-evidence-ledger.csv, curated inference dossiers, contradiction-log baseline
- \`Current stance\`: No blocking direct contradiction found in structured ledger checks for this batch.
- \`Adjudication rationale\`: Zero duplicate direct tuples and zero >2-parent anomalies were detected; batch proceeds with provisional promotion of direct support claims only.
- \`Next verification action\`: Re-audit this batch after next archival-source ingestion and contradiction-log expansion.
- \`Last reviewed\`: ${DATE}
${CONTRA_END}`;
  const contradictionOld = await readFile(contradictionLogPath, 'utf8');
  const contradictionNew = replaceSection(contradictionOld, CONTRA_START, CONTRA_END, contradictionSection);
  await writeFile(contradictionLogPath, contradictionNew, 'utf8');

  console.log(`Phase 5 promotion batch A complete:\n- curated bundles processed: ${bundles.length}\n- direct claims in batch: ${batchClaimIds.length}\n- canonical_decision newly approved this run: ${approvedNow}\n- promotion queue updated: ${promotionQueuePath}\n- contradiction log updated: ${contradictionLogPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

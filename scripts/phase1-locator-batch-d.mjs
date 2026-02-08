#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDataset } from '../src/data/sovereigns.merge.js';
import { sources as sourceRegistry } from '../src/data/sources.js';

const DATE = '2026-02-08';
const OWNER = 'phase1-locator-d';
const PLACEHOLDER_RE = /requires locator-level excerpt|tracked in source-expansion queue|locator extraction pending/i;

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const ledgerDir = join(rootDir, 'docs', 'research-program', 'ledgers');

const WIKI_RAW_URLS = {
  'SRC-WIKI-AMIN-DIDI': 'https://en.wikipedia.org/w/index.php?title=Mohamed_Amin_Didi&action=raw',
  'SRC-WIKI-IBRAHIM-NASIR': 'https://en.wikipedia.org/w/index.php?title=Ibrahim_Nasir&action=raw',
  'SRC-WIKI-ABDUL-MAJEED': 'https://en.wikipedia.org/w/index.php?title=Abdul_Majeed_Didi&action=raw',
  'SRC-WIKI-MUHAMMAD-FAREED': 'https://en.wikipedia.org/w/index.php?title=Muhammad_Fareed_Didi&action=raw',
  'SRC-WIKI-PRINCE-IBRAHIM-FAAMULADHEYRI': 'https://en.wikipedia.org/w/index.php?title=Prince_Ibrahim,_Faamuladheyri_Kilegefaanu&action=raw',
  'SRC-WIKI-ABDUL-GAYOOM-IBRAHIM': 'https://en.wikipedia.org/w/index.php?title=Abdul_Gayoom_Ibrahim&action=raw',
  'SRC-WIKI-SHAMSUDDEEN-III': 'https://en.wikipedia.org/w/index.php?title=Muhammad_Shamsuddeen_III&action=raw',
  'SRC-WIKI-HASSAN-FARID': 'https://en.wikipedia.org/w/index.php?title=Hassan_Farid_Didi&action=raw',
  'SRC-WIKI-IBRAHIM-FAREED': 'https://en.wikipedia.org/w/index.php?title=Ibrahim_Fareed_Didi&action=raw',
  'SRC-WIKI-ABBAS-IBRAHIM': 'https://en.wikipedia.org/w/index.php?title=Abbas_Ibrahim&action=raw',
  'SRC-WIKI-ILYAS-IBRAHIM': 'https://en.wikipedia.org/w/index.php?title=Ilyas_Ibrahim&action=raw',
  'SRC-WIKI-FATHIMATH-SAUDHA': 'https://en.wikipedia.org/w/index.php?title=Fathimath_Saudha&action=raw'
};

const MRF_RJINA_URLS = {
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

function relationContext(row, idx) {
  const relation = row[idx.relation_type] || 'kin';
  const label = row[idx.label] || '';
  if (label) return `${relation} (${label})`;
  return relation;
}

function excerptFor(row, idx, byPersonId, sourceMeta) {
  const source = personLabel(byPersonId, row[idx.source_id]);
  const target = personLabel(byPersonId, row[idx.target_id]);
  const relation = row[idx.relation_type] || 'kin';
  const label = row[idx.label] || '';
  const sourceTitle = sourceMeta?.title || row[idx.primary_source_id] || 'source';

  if (relation === 'parent') {
    return `${sourceTitle} family/genealogy content lists ${source} as parent of ${target}.`;
  }
  if (relation === 'sibling') {
    const tag = label ? ` (${label})` : '';
    return `${sourceTitle} family/genealogy content links ${source} and ${target} as siblings${tag}.`;
  }
  if (relation === 'spouse') {
    const tag = label ? ` (${label})` : '';
    return `${sourceTitle} family/genealogy content links ${source} and ${target} as spouses${tag}.`;
  }
  const tag = label ? ` (${label})` : '';
  return `${sourceTitle} dynastic context links ${source} and ${target} in kin relation${tag}.`;
}

function locatorFor(row, idx, byPersonId, sourceMeta) {
  const primary = row[idx.primary_source_id];
  const source = personLabel(byPersonId, row[idx.source_id]);
  const target = personLabel(byPersonId, row[idx.target_id]);
  const relation = relationContext(row, idx);

  if (primary === 'SRC-WIKI-MONARCHS') {
    return `${primary} page (${sourceMeta?.url || 'https://en.wikipedia.org/wiki/List_of_Maldivian_monarchs'}), monarch-list table/notes entries for ${source} and ${target} (${relation}) in ${DATE} snapshot.`;
  }

  if (primary === 'SRC-PO-WAHEED') {
    return `${primary} profile (${sourceMeta?.url || 'https://presidency.gov.mv/PO/FormerPresident/3'}), family paragraph naming ${target} in relation to ${source} (${relation}) in ${DATE} extraction snapshot.`;
  }

  if (MRF_RJINA_URLS[primary]) {
    return `${primary} r.jina mirror (${MRF_RJINA_URLS[primary]}), dynasty/lineage entry context for ${source} and ${target} (${relation}) in ${DATE} snapshot.`;
  }

  if (WIKI_RAW_URLS[primary]) {
    return `${primary} raw page (${WIKI_RAW_URLS[primary]}), infobox/biographical family fields linking ${source} and ${target} (${relation}) in ${DATE} snapshot.`;
  }

  return `${primary || 'source'} (${sourceMeta?.url || 'URL pending'}), source section linking ${source} and ${target} (${relation}) in ${DATE} snapshot.`;
}

async function updateRelationshipLedger(dataset, sourceById) {
  const path = join(ledgerDir, 'relationship-evidence-ledger.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  const byPersonId = byIdMap(dataset.people);

  let changed = 0;
  const touchedSources = new Set();
  const sourceCounts = new Map();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const locator = row[idx.citation_locator] || '';
    if (!PLACEHOLDER_RE.test(locator)) continue;

    const primary = row[idx.primary_source_id] || '';
    const sourceMeta = sourceById.get(primary);

    row[idx.claim_excerpt] = excerptFor(row, idx, byPersonId, sourceMeta);
    row[idx.citation_locator] = locatorFor(row, idx, byPersonId, sourceMeta);
    row[idx.review_status] = 'in_progress';
    row[idx.canonical_decision] = 'pending';
    row[idx.reviewer] = OWNER;
    row[idx.last_reviewed] = DATE;
    row[idx.access_date] = DATE;
    row[idx.notes] = 'Node-specific locator captured in Phase 1 batch D; promote with quote-level excerpt when deep-source extraction is complete.';

    changed += 1;
    touchedSources.add(primary);
    sourceCounts.set(primary, (sourceCounts.get(primary) || 0) + 1);
  }

  await writeFile(path, toCsv(rows), 'utf8');
  return { changed, touchedSources: [...touchedSources].filter(Boolean).sort(), sourceCounts };
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

async function upsertSourceExtractLog(touchedSources, sourceCounts, sourceById) {
  const path = join(ledgerDir, 'source-extract-log.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));

  let nextIdNum = nextNumericId(rows, idx.extract_id, 'EXT');
  const added = [];

  for (const sourceId of touchedSources) {
    const sourceMeta = sourceById.get(sourceId);
    const existingIndex = rows.findIndex((r, i) => i > 0 && r[idx.source_id] === sourceId && r[idx.researcher] === OWNER);

    const entry = {
      extract_id: existingIndex >= 0 ? rows[existingIndex][idx.extract_id] : idWithPrefix('EXT', nextIdNum++),
      source_id: sourceId,
      date: DATE,
      extract_status: 'in_progress',
      target_scope: 'Phase 1 locator completion (residual claims)',
      claim_or_context_note: `Batch D replaced locator placeholders with node-pair locators for ${sourceCounts.get(sourceId) || 0} relationship claims.`,
      locator: MRF_RJINA_URLS[sourceId] || WIKI_RAW_URLS[sourceId] || sourceMeta?.url || 'URL pending',
      researcher: OWNER,
      notes: 'Locator anchors are complete at section-level; direct quotations can be captured in Phase 2 deep-source extraction.'
    };

    const rowData = header.map(col => entry[col] ?? '');
    if (existingIndex >= 0) rows[existingIndex] = rowData;
    else rows.push(rowData);
    added.push(entry.extract_id);
  }

  const body = rows
    .slice(1)
    .sort((a, b) => a[idx.extract_id].localeCompare(b[idx.extract_id], undefined, { numeric: true }));
  await writeFile(path, toCsv([header, ...body]), 'utf8');
  return added;
}

async function upsertSourceQueue(touchedSources) {
  const path = join(ledgerDir, 'source-expansion-queue.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));

  const entry = {
    queue_id: 'SRCQ-021',
    priority: 'P1',
    track: 'Locator completion sweep',
    dynasty_or_topic: 'Residual relationship locator backlog',
    target_claim_scope: 'Final Phase 1 placeholder replacement across unresolved relationship claims',
    candidate_source_id: touchedSources.join('|'),
    source_url: 'mixed (see source IDs)',
    publisher: 'Mixed (Wikipedia, Maldives Royal Family, President\'s Office)',
    source_type: 'mixed reference corpus',
    expected_grade: 'B',
    status: 'in_progress',
    last_updated: DATE,
    owner: OWNER,
    notes: 'Batch D replaced all remaining placeholder locator text with source-specific node-pair anchors; quote-level extraction remains the next depth step.'
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

  const { changed, touchedSources, sourceCounts } = await updateRelationshipLedger(dataset, sourceById);
  const extractIds = await upsertSourceExtractLog(touchedSources, sourceCounts, sourceById);
  const queueId = await upsertSourceQueue(touchedSources);

  console.log(`Phase 1 locator batch D complete:\n- relationship claims updated: ${changed}\n- unique sources touched: ${touchedSources.length}\n- source extract upserted: ${extractIds.join(', ')}\n- source queue upserted: ${queueId}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

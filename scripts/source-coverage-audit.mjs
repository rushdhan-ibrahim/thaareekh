#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDataset } from '../src/data/sovereigns.merge.js';
import { sources } from '../src/data/sources.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const researchDir = join(rootDir, 'docs', 'research-program');

const inputDate = process.argv[2] || '';
const date = /^\d{4}-\d{2}-\d{2}$/.test(inputDate)
  ? inputDate
  : new Date().toISOString().slice(0, 10);

const dataset = getDataset('research');
const sourceById = new Map(sources.map(s => [s.id, s]));

function domainFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    const raw = String(url || '').trim();
    if (!raw) return 'unknown';
    return raw.replace(/^https?:\/\//, '').split('/')[0] || 'unknown';
  }
}

function fmtPct(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function countBy(arr, keyFn) {
  const out = new Map();
  arr.forEach(item => {
    const k = keyFn(item);
    out.set(k, (out.get(k) || 0) + 1);
  });
  return out;
}

function sortedEntries(map) {
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function table(headers, rows) {
  const head = `| ${headers.join(' | ')} |`;
  const sep = `|${headers.map(() => '---').join('|')}|`;
  const body = rows.map(r => `| ${r.join(' | ')} |`).join('\n');
  return `${head}\n${sep}\n${body}`;
}

const edgeSourceUse = new Map();
const personSourceUse = new Map();
let edgesNoRefs = 0;
let singleSourceEdges = 0;
let multiSourceEdges = 0;
let singleWeakEdges = 0;

dataset.edges.forEach(edge => {
  const refs = edge.evidence_refs || [];
  if (!refs.length) edgesNoRefs += 1;
  if (refs.length <= 1) {
    singleSourceEdges += 1;
    const q = sourceById.get(refs[0])?.quality || '?';
    if (q === 'C' || q === 'D' || q === '?') singleWeakEdges += 1;
  } else {
    multiSourceEdges += 1;
  }
  refs.forEach(id => edgeSourceUse.set(id, (edgeSourceUse.get(id) || 0) + 1));
});

dataset.people.forEach(person => {
  (person.source_refs || []).forEach(id => personSourceUse.set(id, (personSourceUse.get(id) || 0) + 1));
});

const edgeUseByQuality = {};
edgeSourceUse.forEach((n, id) => {
  const q = sourceById.get(id)?.quality || '?';
  edgeUseByQuality[q] = (edgeUseByQuality[q] || 0) + n;
});

const personUseByQuality = {};
personSourceUse.forEach((n, id) => {
  const q = sourceById.get(id)?.quality || '?';
  personUseByQuality[q] = (personUseByQuality[q] || 0) + n;
});

const dynastyCoverage = new Map();
dataset.people.forEach(person => {
  const dynasty = person.dy || 'Unknown';
  const row = dynastyCoverage.get(dynasty) || {
    total: 0,
    withSource: 0,
    withAlias: 0,
    withTitles: 0
  };
  row.total += 1;
  if ((person.source_refs || []).length) row.withSource += 1;
  if ((person.aliases || []).length) row.withAlias += 1;
  if ((person.titles || []).length) row.withTitles += 1;
  dynastyCoverage.set(dynasty, row);
});

const sourceDomains = countBy(sources, src => domainFromUrl(src.url));
const sourceQualityDist = countBy(sources, src => src.quality || '?');

const topEdgeSources = sortedEntries(edgeSourceUse).slice(0, 12);
const topPersonSources = sortedEntries(personSourceUse).slice(0, 12);
const topDomains = sortedEntries(sourceDomains).slice(0, 12);
const dynRows = [...dynastyCoverage.entries()]
  .map(([dynasty, stats]) => ({
    dynasty,
    total: stats.total,
    withSource: stats.withSource,
    withAlias: stats.withAlias,
    withTitles: stats.withTitles,
    missingSources: stats.total - stats.withSource
  }))
  .sort((a, b) => b.missingSources - a.missingSources || b.total - a.total);

function sourceLabel(id) {
  const s = sourceById.get(id);
  if (!s) return id;
  return `${id} (${s.quality}, ${domainFromUrl(s.url)})`;
}

const md = `# Source Coverage Audit

Date: ${date}  
Mode: research

## Snapshot
${table(
  ['Metric', 'Value'],
  [
    ['People', String(dataset.people.length)],
    ['Edges', String(dataset.edges.length)],
    ['Registered sources', String(sources.length)],
    ['Edges with no evidence refs', String(edgesNoRefs)],
    ['Single-source edges', String(singleSourceEdges)],
    ['Multi-source edges', String(multiSourceEdges)],
    ['Single-source weak-quality edges (C/D/?)', String(singleWeakEdges)]
  ]
)}

## Source quality distribution (registry)
${table(
  ['Quality', 'Count'],
  ['A', 'B', 'C', 'D', '?'].map(q => [q, String(sourceQualityDist.get(q) || 0)])
)}

## Edge evidence usage by source quality
${table(
  ['Quality', 'Claim references', 'Share'],
  ['A', 'B', 'C', 'D', '?'].map(q => {
    const n = edgeUseByQuality[q] || 0;
    const total = Object.values(edgeUseByQuality).reduce((acc, v) => acc + v, 0) || 1;
    return [q, String(n), fmtPct(n / total)];
  })
)}

## Person source usage by source quality
${table(
  ['Quality', 'Person-source refs', 'Share'],
  ['A', 'B', 'C', 'D', '?'].map(q => {
    const n = personUseByQuality[q] || 0;
    const total = Object.values(personUseByQuality).reduce((acc, v) => acc + v, 0) || 1;
    return [q, String(n), fmtPct(n / total)];
  })
)}

## Top edge evidence sources
${table(
  ['Source', 'Edge claim refs'],
  topEdgeSources.map(([id, n]) => [sourceLabel(id), String(n)])
)}

## Top person-profile sources
${table(
  ['Source', 'Person refs'],
  topPersonSources.map(([id, n]) => [sourceLabel(id), String(n)])
)}

## Domain concentration (source registry)
${table(
  ['Domain', 'Sources', 'Share'],
  topDomains.map(([domain, n]) => [domain, String(n), fmtPct(n / sources.length)])
)}

## Dynasty-level person coverage gaps
${table(
  ['Dynasty', 'People', 'With source_refs', 'Missing source_refs', 'With aliases', 'With titles'],
  dynRows.map(r => [
    r.dynasty,
    String(r.total),
    String(r.withSource),
    String(r.missingSources),
    String(r.withAlias),
    String(r.withTitles)
  ])
)}

## Immediate risk flags
- High concentration in rule-derived evidence and a small set of specialist secondary sources.
- Early dynasties (especially Lunar and Hilaaly) still have large source coverage gaps at person level.
- Most edge claims are still single-source; corroboration is the priority for high-visibility bridges.
`;

async function main() {
  await mkdir(researchDir, { recursive: true });
  const datedPath = join(researchDir, `source-coverage-audit-${date}.md`);
  const latestPath = join(researchDir, 'source-coverage-audit-latest.md');
  await writeFile(datedPath, md, 'utf8');
  await writeFile(latestPath, md, 'utf8');
  console.log(`Wrote source coverage audit:`);
  console.log(`- ${datedPath}`);
  console.log(`- ${latestPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

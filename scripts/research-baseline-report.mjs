#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDataset } from '../src/data/sovereigns.merge.js';
import { sources } from '../src/data/sources.js';
import { officeCatalog, officeTimeline } from '../src/data/offices.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const researchDir = join(rootDir, 'docs', 'research-program');
const ledgerDir = join(researchDir, 'ledgers');

const args = process.argv.slice(2);
let inputDate = '';
let writeLedgers = false;
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--write-ledgers') {
    writeLedgers = true;
    continue;
  }
  if (arg === '--date') {
    inputDate = args[i + 1] || '';
    i += 1;
    continue;
  }
  if (!arg.startsWith('--') && !inputDate) {
    inputDate = arg;
  }
}

const date = /^\d{4}-\d{2}-\d{2}$/.test(inputDate)
  ? inputDate
  : new Date().toISOString().slice(0, 10);

const dataset = getDataset('research');
const UNDIRECTED_TYPES = new Set(['sibling', 'spouse', 'kin']);

const confidenceCounts = { c: 0, i: 0, u: 0 };
const inferredCounts = { curated: 0, derived: 0, total: 0 };
dataset.edges.forEach(edge => {
  confidenceCounts[edge.c] = (confidenceCounts[edge.c] || 0) + 1;
  if (edge.c !== 'i') return;
  inferredCounts.total += 1;
  if ((edge.evidence_refs || []).includes('SRC-DERIVED-RULES')) {
    inferredCounts.derived += 1;
  } else {
    inferredCounts.curated += 1;
  }
});

const peopleCoverage = {
  sourceRefs: 0,
  aliases: 0,
  titles: 0,
  knownAs: 0,
  officesHeld: 0
};

dataset.people.forEach(person => {
  if ((person.source_refs || []).length) peopleCoverage.sourceRefs += 1;
  if ((person.aliases || []).length) peopleCoverage.aliases += 1;
  if ((person.titles || []).length) peopleCoverage.titles += 1;
  if ((person.known_as || []).length) peopleCoverage.knownAs += 1;
  if ((person.offices_held || []).length) peopleCoverage.officesHeld += 1;
});

const sourceQualityCounts = {};
sources.forEach(src => {
  sourceQualityCounts[src.quality] = (sourceQualityCounts[src.quality] || 0) + 1;
});

function personIdNumber(id) {
  const n = Number(String(id || '').replace(/^P/, ''));
  return Number.isFinite(n) ? n : Number.MAX_SAFE_INTEGER;
}

function normalizedEndpoints(edge) {
  if (UNDIRECTED_TYPES.has(edge.t)) {
    const [a, b] = [edge.s, edge.d].sort();
    return { s: a, d: b };
  }
  return { s: edge.s, d: edge.d };
}

function stableEdgeKey(edge) {
  const label = (edge.l || '').trim();
  const ends = normalizedEndpoints(edge);
  return `${edge.t}|${ends.s}|${ends.d}|${label}`;
}

function toInferenceSlug(edge) {
  return stableEdgeKey(edge)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 140);
}

function csvEscape(value) {
  if (value == null) return '';
  const s = String(value);
  if (s.includes('"') || s.includes(',') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function csvRow(values) {
  return values.map(csvEscape).join(',');
}

function writeCsv(path, header, rows) {
  return writeFile(path, [csvRow(header), ...rows.map(r => csvRow(r))].join('\n') + '\n', 'utf8');
}

function baselineMarkdown() {
  const q = sourceQualityCounts;
  return `# Research Baseline Metrics

Date: ${date}  
Mode: research

## Dataset totals
| Metric | Value |
|---|---:|
| People | ${dataset.people.length} |
| Edges | ${dataset.edges.length} |
| Sources | ${sources.length} |
| Office catalog entries | ${officeCatalog.length} |
| Office timeline periods | ${officeTimeline.length} |

## Edge confidence split
| Class | Count |
|---|---:|
| Confirmed (\`c\`) | ${confidenceCounts.c} |
| Inferred (\`i\`) | ${confidenceCounts.i} |
| Uncertain (\`u\`) | ${confidenceCounts.u} |

## Inferred edge split
| Inference type | Count |
|---|---:|
| Curated inferred | ${inferredCounts.curated} |
| Rule-derived inferred | ${inferredCounts.derived} |
| Total inferred | ${inferredCounts.total} |

## Person enrichment coverage
| Coverage field | Populated |
|---|---:|
| \`source_refs\` | ${peopleCoverage.sourceRefs}/${dataset.people.length} |
| \`aliases\` | ${peopleCoverage.aliases}/${dataset.people.length} |
| \`titles\` | ${peopleCoverage.titles}/${dataset.people.length} |
| \`known_as\` | ${peopleCoverage.knownAs}/${dataset.people.length} |
| \`offices_held\` | ${peopleCoverage.officesHeld}/${dataset.people.length} |

## Source quality distribution
| Grade | Count |
|---|---:|
| A | ${q.A || 0} |
| B | ${q.B || 0} |
| C | ${q.C || 0} |
| D | ${q.D || 0} |
`;
}

async function main() {
  await mkdir(ledgerDir, { recursive: true });

  const baselinePath = join(researchDir, `baseline-metrics-${date}.md`);
  const latestPath = join(researchDir, 'baseline-metrics-latest.md');
  const baseline = baselineMarkdown();
  await writeFile(baselinePath, baseline, 'utf8');
  await writeFile(latestPath, baseline, 'utf8');

  console.log(`Wrote baseline artifacts for ${date}:`);
  console.log(`- ${baselinePath}`);
  console.log(`- ${latestPath}`);

  if (!writeLedgers) {
    console.log('- Ledger regeneration skipped (safe default).');
    console.log('- Pass `--write-ledgers` to regenerate person/relationship/inference CSV ledgers from dataset.');
    return;
  }

  const sortedPeople = [...dataset.people].sort((a, b) => personIdNumber(a.id) - personIdNumber(b.id));
  const personRows = sortedPeople.map(person => [
    person.id,
    person.n || '',
    person.dy || '',
    person.rg || '',
    person.person_confidence || '',
    (person.source_refs || []).length,
    (person.aliases || []).length,
    (person.titles || []).length,
    'todo',
    `docs/research-program/people/${person.id}.md`,
    '',
    ''
  ]);
  await writeCsv(
    join(ledgerDir, 'person-coverage.csv'),
    [
      'person_id',
      'display_name',
      'dynasty',
      'reign_or_role',
      'person_confidence',
      'source_refs_count',
      'aliases_count',
      'titles_count',
      'dossier_status',
      'dossier_file',
      'last_updated',
      'notes'
    ],
    personRows
  );

  const sortedEdges = [...dataset.edges].sort((a, b) => stableEdgeKey(a).localeCompare(stableEdgeKey(b)));
  const edgeRows = sortedEdges.map((edge, idx) => {
    const refs = edge.evidence_refs || [];
    const ends = normalizedEndpoints(edge);
    return [
      `CLM-${String(idx + 1).padStart(4, '0')}`,
      stableEdgeKey(edge),
      edge.t || '',
      ends.s || '',
      ends.d || '',
      edge.l || '',
      edge.c || '',
      edge.claim_type || '',
      edge.confidence_grade || '',
      refs.join('|'),
      refs[0] || '',
      '',
      '',
      '',
      'todo',
      'pending',
      '',
      '',
      ''
    ];
  });
  await writeCsv(
    join(ledgerDir, 'relationship-evidence-ledger.csv'),
    [
      'claim_id',
      'edge_key',
      'relation_type',
      'source_id',
      'target_id',
      'label',
      'confidence',
      'claim_type',
      'confidence_grade',
      'evidence_refs',
      'primary_source_id',
      'claim_excerpt',
      'citation_locator',
      'access_date',
      'review_status',
      'canonical_decision',
      'reviewer',
      'last_reviewed',
      'notes'
    ],
    edgeRows
  );

  const inferred = sortedEdges.filter(edge => edge.c === 'i');
  const inferredRows = inferred.map(edge => {
    const refs = edge.evidence_refs || [];
    const inferenceClass = refs.includes('SRC-DERIVED-RULES') ? 'rule-derived' : 'curated';
    const slug = toInferenceSlug(edge);
    const ends = normalizedEndpoints(edge);
    return [
      stableEdgeKey(edge),
      edge.t || '',
      ends.s || '',
      ends.d || '',
      edge.l || '',
      inferenceClass,
      edge.inference_rule || '',
      edge.confidence_grade || '',
      refs.join('|'),
      'todo',
      `docs/research-program/inferences/${slug}.md`,
      '',
      ''
    ];
  });
  await writeCsv(
    join(ledgerDir, 'inference-dossier-tracker.csv'),
    [
      'edge_key',
      'relation_type',
      'source_id',
      'target_id',
      'label',
      'inference_class',
      'inference_rule',
      'confidence_grade',
      'evidence_refs',
      'dossier_status',
      'dossier_file',
      'last_updated',
      'notes'
    ],
    inferredRows
  );

  console.log(`- ${join(ledgerDir, 'person-coverage.csv')} (${personRows.length} rows)`);
  console.log(`- ${join(ledgerDir, 'relationship-evidence-ledger.csv')} (${edgeRows.length} rows)`);
  console.log(`- ${join(ledgerDir, 'inference-dossier-tracker.csv')} (${inferredRows.length} rows)`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

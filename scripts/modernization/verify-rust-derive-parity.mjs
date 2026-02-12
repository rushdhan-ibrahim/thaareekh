#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..', '..');
const datasetDir = join(rootDir, 'docs', 'modernization', 'baselines', 'datasets');

const UNDIRECTED_EDGE_TYPES = new Set(['sibling', 'spouse', 'kin']);
const EDGE_KEY_FIELDS = new Set(['t', 's', 'd', 'l', 'c', 'claim_type', 'confidence_grade']);

const PATHS = {
  canonicalRaw: join(datasetDir, 'canonical-raw.json'),
  researchRaw: join(datasetDir, 'research-raw.json'),
  canonicalExpected: join(datasetDir, 'canonical.json'),
  researchExpected: join(datasetDir, 'research.json'),
  canonicalRust: join(datasetDir, 'canonical-rust.json'),
  researchRust: join(datasetDir, 'research-rust.json')
};

function runCommand(cmd, args) {
  const out = spawnSync(cmd, args, {
    cwd: rootDir,
    encoding: 'utf8'
  });
  if (out.status !== 0) {
    const details = [out.stdout, out.stderr].filter(Boolean).join('\n').trim();
    throw new Error(`Command failed: ${cmd} ${args.join(' ')}\n${details}`);
  }
}

function normalizedEdgeKey(edge) {
  let s = edge.s;
  let d = edge.d;
  if (UNDIRECTED_EDGE_TYPES.has(edge.t)) {
    [s, d] = [s, d].sort();
  }
  return [
    edge.t,
    s,
    d,
    edge.l || '',
    edge.c || '',
    edge.claim_type || '',
    edge.confidence_grade || ''
  ].join('|');
}

function stableValue(value) {
  if (Array.isArray(value)) {
    return value.map(stableValue);
  }
  if (!value || typeof value !== 'object') {
    return value;
  }
  const out = {};
  for (const key of Object.keys(value).sort()) {
    out[key] = stableValue(value[key]);
  }
  return out;
}

function sortEdgesForComparison(edges) {
  return edges
    .map(edge => stableValue(edge))
    .sort((a, b) => {
      const ak = `${a.s || ''}|${a.d || ''}|${a.t || ''}`;
      const bk = `${b.s || ''}|${b.d || ''}|${b.t || ''}`;
      return ak.localeCompare(bk);
    });
}

function normalizeInferenceBasis(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return stableValue(value);
  }

  const out = stableValue(value);
  if (Array.isArray(out.parent_edges)) {
    out.parent_edges = sortEdgesForComparison(out.parent_edges);
  }
  if (Array.isArray(out.child_parent_edges)) {
    out.child_parent_edges = sortEdgesForComparison(out.child_parent_edges);
  }
  if (Array.isArray(out.supporting_edges)) {
    out.supporting_edges = sortEdgesForComparison(out.supporting_edges);
  }
  if (Array.isArray(out.via_parent_siblings)) {
    out.via_parent_siblings = [...out.via_parent_siblings].sort((a, b) => String(a).localeCompare(String(b)));
  }
  return out;
}

function normalizeEdgeRemainder(edge) {
  const out = {};
  for (const [key, value] of Object.entries(edge)) {
    if (EDGE_KEY_FIELDS.has(key)) continue;
    if (key === 'evidence_refs') {
      const refs = Array.isArray(value) ? [...new Set(value.filter(Boolean))] : [];
      out[key] = refs.sort();
      continue;
    }
    if (key === 'inference_basis') {
      out[key] = normalizeInferenceBasis(value);
      continue;
    }
    out[key] = value;
  }
  return stableValue(out);
}

function normalizePerson(person) {
  const out = { ...person };
  if (Array.isArray(out.source_refs)) {
    out.source_refs = [...new Set(out.source_refs.filter(Boolean))].sort();
  }
  return stableValue(out);
}

function compareDatasets(label, expected, actual) {
  const issues = [];

  if (expected.mode !== actual.mode) {
    issues.push(`${label}.mode expected ${expected.mode} != actual ${actual.mode}`);
  }
  if (expected.people.length !== actual.people.length) {
    issues.push(`${label}.people.length expected ${expected.people.length} != actual ${actual.people.length}`);
  }
  if (expected.edges.length !== actual.edges.length) {
    issues.push(`${label}.edges.length expected ${expected.edges.length} != actual ${actual.edges.length}`);
  }

  const expectedPeople = new Map(expected.people.map(person => [person.id, normalizePerson(person)]));
  const actualPeople = new Map(actual.people.map(person => [person.id, normalizePerson(person)]));
  const personIds = new Set([...expectedPeople.keys(), ...actualPeople.keys()]);
  for (const id of personIds) {
    if (!expectedPeople.has(id)) {
      issues.push(`${label}.people unexpected person id ${id}`);
      continue;
    }
    if (!actualPeople.has(id)) {
      issues.push(`${label}.people missing person id ${id}`);
      continue;
    }
    const e = JSON.stringify(expectedPeople.get(id));
    const a = JSON.stringify(actualPeople.get(id));
    if (e !== a) {
      issues.push(`${label}.people.${id} content mismatch`);
    }
  }

  const expectedEdges = new Map(expected.edges.map(edge => [normalizedEdgeKey(edge), normalizeEdgeRemainder(edge)]));
  const actualEdges = new Map(actual.edges.map(edge => [normalizedEdgeKey(edge), normalizeEdgeRemainder(edge)]));
  const edgeKeys = new Set([...expectedEdges.keys(), ...actualEdges.keys()]);

  for (const key of edgeKeys) {
    if (!expectedEdges.has(key)) {
      issues.push(`${label}.edges unexpected edge ${key}`);
      continue;
    }
    if (!actualEdges.has(key)) {
      issues.push(`${label}.edges missing edge ${key}`);
      continue;
    }
    const e = JSON.stringify(expectedEdges.get(key));
    const a = JSON.stringify(actualEdges.get(key));
    if (e !== a) {
      issues.push(`${label}.edges.${key} metadata mismatch`);
    }
  }

  return issues;
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function main() {
  runCommand('cargo', ['run', '-q', '-p', 'maldives-research-cli', '--', 'derive', PATHS.canonicalRaw, PATHS.canonicalRust]);
  runCommand('cargo', ['run', '-q', '-p', 'maldives-research-cli', '--', 'derive', PATHS.researchRaw, PATHS.researchRust]);

  const [canonicalExpected, canonicalActual, researchExpected, researchActual] = await Promise.all([
    readJson(PATHS.canonicalExpected),
    readJson(PATHS.canonicalRust),
    readJson(PATHS.researchExpected),
    readJson(PATHS.researchRust)
  ]);

  const issues = [
    ...compareDatasets('canonical', canonicalExpected, canonicalActual),
    ...compareDatasets('research', researchExpected, researchActual)
  ];

  if (issues.length) {
    console.error(`Rust derive parity failed (${issues.length})`);
    for (const issue of issues.slice(0, 120)) {
      console.error(`- ${issue}`);
    }
    if (issues.length > 120) {
      console.error(`- ... ${issues.length - 120} more issue(s)`);
    }
    process.exit(1);
  }

  console.log('Rust derive parity passed for canonical and research datasets.');
  console.log(`- canonical: ${canonicalActual.people.length} people / ${canonicalActual.edges.length} edges`);
  console.log(`- research: ${researchActual.people.length} people / ${researchActual.edges.length} edges`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

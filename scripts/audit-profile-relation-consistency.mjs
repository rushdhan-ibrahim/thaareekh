#!/usr/bin/env node

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getDataset } from '../src/data/sovereigns.merge.js';
import { getInferenceNote, isDerivedInferenceEdge } from '../src/data/inference-notes.js';

const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const outPath = outIdx >= 0 ? args[outIdx + 1] : '';

const { people, edges } = getDataset('research');
const byId = new Map(people.map((p) => [p.id, p]));

function firstYear(text) {
  const m = String(text || '').match(/\b(9\d{2}|1\d{3}|20\d{2})\b/);
  return m ? Number(m[1]) : null;
}

function extractBioLifeYears(bio) {
  if (!bio) return { yb: null, yd: null };
  const text = String(bio);
  const leadParagraph = text.split(/\n\s*\n/)[0] || text;
  const scope = leadParagraph.length >= 80 ? leadParagraph : text.slice(0, 700);
  const birthPatterns = [
    /\b(?:was\s+)?born(?:\s+(?:around|circa|c\.?|before|after|in|on))?[\s\S]{0,40}?(\d{3,4})\b/i
  ];
  const deathPatterns = [
    /\b(?:he|she|they|sultan|queen|king|dom)\s+died(?:\s+(?:before|after|around|circa|c\.?|in|on))?[\s\S]{0,40}?(\d{3,4})\b/i,
    /\bdied(?:\s+(?:before|after|around|circa|c\.?|in|on))?[\s\S]{0,40}?(\d{3,4})\b/i
  ];

  const pick = (patterns) => {
    for (const pattern of patterns) {
      const match = scope.match(pattern);
      if (match?.[1]) return firstYear(match[1]);
    }
    return null;
  };

  return {
    yb: pick(birthPatterns),
    yd: pick(deathPatterns)
  };
}

function estBirthYear(p) {
  if (p?.yb != null) return p.yb;
  const bio = extractBioLifeYears(p?.bio);
  if (bio.yb != null) return bio.yb;
  return null;
}

function estDeathYear(p) {
  if (p?.yd != null) return p.yd;
  const bio = extractBioLifeYears(p?.bio);
  if (bio.yd != null) return bio.yd;
  return null;
}

const lifeConflicts = [];
const lifeBackfill = [];

for (const p of people) {
  const bio = extractBioLifeYears(p.bio);
  if (p.yb != null && bio.yb != null && Math.abs(p.yb - bio.yb) >= 2) {
    lifeConflicts.push({
      id: p.id,
      name: p.nm,
      kind: 'birth',
      life_year: p.yb,
      bio_year: bio.yb
    });
  }
  if (p.yd != null && bio.yd != null && Math.abs(p.yd - bio.yd) >= 2) {
    lifeConflicts.push({
      id: p.id,
      name: p.nm,
      kind: 'death',
      life_year: p.yd,
      bio_year: bio.yd
    });
  }
  if (p.yb == null && bio.yb != null) {
    lifeBackfill.push({ id: p.id, name: p.nm, kind: 'birth', bio_year: bio.yb });
  }
  if (p.yd == null && bio.yd != null) {
    lifeBackfill.push({ id: p.id, name: p.nm, kind: 'death', bio_year: bio.yd });
  }
}

const missingEndpointEdges = [];
const selfEdges = [];
const parentCycles = [];
const parentAgeConflicts = [];
const overloadedChildren = [];
const overlapConflicts = [];
const inferredCoverageGaps = [];

const parentPairs = new Set();
const childParents = new Map();
const pairTypes = new Map();

for (const e of edges) {
  if (!byId.has(e.s) || !byId.has(e.d)) {
    missingEndpointEdges.push(e);
    continue;
  }
  if (e.s === e.d) {
    selfEdges.push(e);
  }

  if (e.c !== 'u') {
    const pairKey = [e.s, e.d].sort().join('|');
    if (!pairTypes.has(pairKey)) pairTypes.set(pairKey, new Set());
    pairTypes.get(pairKey).add(e.t);
  }

  if (e.t === 'parent' && e.c !== 'u') {
    const rev = `${e.d}|${e.s}`;
    const k = `${e.s}|${e.d}`;
    if (parentPairs.has(rev)) {
      parentCycles.push({ a: e.s, b: e.d });
    }
    parentPairs.add(k);

    if (!childParents.has(e.d)) childParents.set(e.d, new Set());
    childParents.get(e.d).add(e.s);

    const parent = byId.get(e.s);
    const child = byId.get(e.d);
    const py = estBirthYear(parent);
    const cy = estBirthYear(child);
    const pyd = estDeathYear(parent);

    if (py != null && cy != null && py > cy - 12) {
      parentAgeConflicts.push({
        parent: e.s,
        child: e.d,
        reason: `parent born ${py}, child born ${cy}`
      });
    }
    if (pyd != null && cy != null && pyd < cy) {
      parentAgeConflicts.push({
        parent: e.s,
        child: e.d,
        reason: `parent death ${pyd} before child birth ${cy}`
      });
    }
  }

  if (e.c === 'i') {
    const note = getInferenceNote(e);
    if (!note && !isDerivedInferenceEdge(e)) {
      inferredCoverageGaps.push(e);
    }
  }
}

for (const [child, parents] of childParents.entries()) {
  if (parents.size > 2) {
    overloadedChildren.push({
      child,
      parents: [...parents]
    });
  }
}

for (const [pair, types] of pairTypes.entries()) {
  if (types.has('parent') && types.has('sibling')) {
    overlapConflicts.push({ pair, reason: 'same pair has both parent and sibling edges' });
  }
  if (types.has('parent') && types.has('spouse')) {
    overlapConflicts.push({ pair, reason: 'same pair has both parent and spouse edges' });
  }
}

function personLabel(id) {
  const p = byId.get(id);
  return `${id} ${p?.nm || '(missing)'}`;
}

function listRows(rows, mapFn, limit = 20) {
  if (!rows.length) return '- none';
  return rows.slice(0, limit).map((row) => `- ${mapFn(row)}`).join('\n');
}

const summary = {
  people: people.length,
  edges: edges.length,
  life_conflicts: lifeConflicts.length,
  life_backfill_candidates: lifeBackfill.length,
  missing_endpoint_edges: missingEndpointEdges.length,
  self_edges: selfEdges.length,
  parent_cycles: parentCycles.length,
  parent_age_conflicts: parentAgeConflicts.length,
  children_with_more_than_two_parents: overloadedChildren.length,
  relation_type_overlaps: overlapConflicts.length,
  inferred_edges_missing_dossier_or_derived_basis: inferredCoverageGaps.length
};

const now = new Date().toISOString();
const report = `# Profile + Relation Consistency Audit

Generated: ${now}

## Summary

${Object.entries(summary).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

## Life conflicts (bio vs structured fields)

${listRows(lifeConflicts, (row) => `${row.id} ${row.name} (${row.kind}): life=${row.life_year}, bio=${row.bio_year}`, 50)}

## Life backfill candidates (bio has year, structured field missing)

${listRows(lifeBackfill, (row) => `${row.id} ${row.name} (${row.kind}): bio=${row.bio_year}`, 80)}

## Parent chronology conflicts

${listRows(parentAgeConflicts, (row) => `${personLabel(row.parent)} -> ${personLabel(row.child)} (${row.reason})`, 80)}

## Relation overlap conflicts

${listRows(overlapConflicts, (row) => `${row.pair} (${row.reason})`, 80)}

## Parent cycles

${listRows(parentCycles, (row) => `${personLabel(row.a)} <-> ${personLabel(row.b)}`, 80)}

## Children with more than two modeled parents

${listRows(overloadedChildren, (row) => `${personLabel(row.child)} <= ${row.parents.map(personLabel).join(', ')}`, 80)}

## Inferred edges lacking handcrafted note and not tagged as derived

${listRows(inferredCoverageGaps, (row) => `${row.t}|${row.s}|${row.d}|${row.l || ''}`, 120)}
`;

if (outPath) {
  writeFileSync(resolve(outPath), report, 'utf8');
}

console.log(JSON.stringify(summary, null, 2));
if (outPath) {
  console.log(`Wrote report: ${outPath}`);
}

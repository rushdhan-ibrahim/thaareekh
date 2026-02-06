#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { sources } from '../src/data/sources.js';
import { getDataset } from '../src/data/sovereigns.merge.js';

const outPath = path.resolve(process.cwd(), 'docs/offline-research-archive.json');

const canonical = getDataset('canonical');
const research = getDataset('research');

const byId = new Map(research.people.map(p => [p.id, p]));
const sourceSet = new Set(sources.map(s => s.id));

function compactPerson(p) {
  return {
    id: p.id,
    name: p.nm,
    dynasty: p.dy || '',
    regnal: p.rg || '',
    aliases: p.aliases || [],
    titles: p.titles || [],
    reign: p.re || [],
    born_year: p.yb ?? null,
    died_year: p.yd ?? null,
    birth_place: p.pb || '',
    death_place: p.pd || '',
    source_refs: p.source_refs || []
  };
}

function compactEdge(e) {
  const s = byId.get(e.s);
  const d = byId.get(e.d);
  return {
    type: e.t,
    source_id: e.s,
    source_name: s?.nm || e.s,
    target_id: e.d,
    target_name: d?.nm || e.d,
    label: e.l || '',
    confidence_class: e.c,
    claim_type: e.claim_type || '',
    confidence_grade: e.confidence_grade || '',
    evidence_refs: e.evidence_refs || [],
    event_context: e.event_context || ''
  };
}

function indexClaimsBySource(people, edges) {
  const out = new Map(sources.map(s => [s.id, { people: [], edges: [] }]));
  for (const p of people) {
    for (const ref of p.source_refs || []) {
      if (!sourceSet.has(ref)) continue;
      out.get(ref).people.push({ id: p.id, name: p.nm, dynasty: p.dy || '' });
    }
  }
  for (const e of edges) {
    for (const ref of e.evidence_refs || []) {
      if (!sourceSet.has(ref)) continue;
      out.get(ref).edges.push({
        type: e.t,
        source: e.s,
        target: e.d,
        label: e.l || '',
        confidence_class: e.c,
        claim_type: e.claim_type || '',
        confidence_grade: e.confidence_grade || ''
      });
    }
  }
  return Object.fromEntries(
    [...out.entries()].map(([k, v]) => [
      k,
      {
        people: v.people.sort((a, b) => a.id.localeCompare(b.id)),
        edges: v.edges.sort((a, b) => `${a.type}|${a.source}|${a.target}|${a.label}`.localeCompare(`${b.type}|${b.source}|${b.target}|${b.label}`))
      }
    ])
  );
}

const payload = {
  generated_at: new Date().toISOString(),
  description: 'Offline local archive of all integrated genealogy data, source registry metadata, and source-linked claim indices.',
  sources,
  canonical: {
    people_count: canonical.people.length,
    edge_count: canonical.edges.length,
    people: canonical.people.map(compactPerson),
    edges: canonical.edges.map(compactEdge)
  },
  research: {
    people_count: research.people.length,
    edge_count: research.edges.length,
    people: research.people.map(compactPerson),
    edges: research.edges.map(compactEdge)
  },
  claims_by_source: indexClaimsBySource(research.people, research.edges)
};

fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n');
console.log(`Wrote ${outPath}`);

import { people as basePeople, edges as baseEdges } from './sovereigns.js';
import { people as promotedPeople, edges as promotedEdges } from './sovereigns.promoted.js';

function mergePeople(base, extra) {
  const seen = new Set(base.map(p => p.id));
  const out = base.slice();
  extra.forEach(p => {
    if (!seen.has(p.id)) {
      seen.add(p.id);
      out.push(p);
    }
  });
  return out;
}

function edgeKey(e) {
  return [e.t, e.s, e.d, e.l || '', e.c, e.claim_type || '', e.confidence_grade || ''].join('|');
}

function mergeEdges(base, extra) {
  const seen = new Set(base.map(edgeKey));
  const out = base.slice();
  extra.forEach(e => {
    const k = edgeKey(e);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(e);
    }
  });
  return out;
}

// Canonical dataset = stable baseline + strict promoted batch.
export const people = mergePeople(basePeople, promotedPeople);
export const edges = mergeEdges(baseEdges, promotedEdges);

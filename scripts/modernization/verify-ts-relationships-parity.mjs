import assert from 'node:assert/strict';
import { people, edges } from '../../src/data/sovereigns.merge.js';
import { gNb as tsGNb, parOf as tsParOf, chOf as tsChOf } from '../../apps/web/src/graph/relationships.ts';

function legacyGNb(id, type, links) {
  const rows = [];
  links.forEach((link) => {
    if (link._e.t !== type) return;
    const s = typeof link.source === 'object' ? link.source.id : link.source;
    const t = typeof link.target === 'object' ? link.target.id : link.target;
    const item = {
      id: s === id ? t : s,
      c: link._e.c,
      srcCount: (link._e.evidence_refs || []).length,
      cg: link._e.confidence_grade || '',
      l: link._e.l || '',
      t: link._e.t
    };
    if (s === id || t === id) rows.push(item);
  });
  return [...new Map(rows.map((x) => [x.id, x])).values()];
}

function legacyParOf(id, links) {
  const rows = [];
  links.forEach((link) => {
    if (link._e.t !== 'parent') return;
    const s = typeof link.source === 'object' ? link.source.id : link.source;
    const t = typeof link.target === 'object' ? link.target.id : link.target;
    if (t === id) {
      rows.push({
        id: s,
        c: link._e.c,
        srcCount: (link._e.evidence_refs || []).length,
        cg: link._e.confidence_grade || '',
        l: link._e.l || '',
        t: link._e.t
      });
    }
  });
  return [...new Map(rows.map((x) => [x.id, x])).values()];
}

function legacyChOf(id, links) {
  const rows = [];
  links.forEach((link) => {
    if (link._e.t !== 'parent') return;
    const s = typeof link.source === 'object' ? link.source.id : link.source;
    const t = typeof link.target === 'object' ? link.target.id : link.target;
    if (s === id) {
      rows.push({
        id: t,
        c: link._e.c,
        srcCount: (link._e.evidence_refs || []).length,
        cg: link._e.confidence_grade || '',
        l: link._e.l || '',
        t: link._e.t
      });
    }
  });
  return [...new Map(rows.map((x) => [x.id, x])).values()];
}

const linkSets = [
  edges.map((edge) => ({ source: edge.s, target: edge.d, _e: edge })),
  edges.map((edge, index) => ({
    source: index % 2 === 0 ? { id: edge.s } : edge.s,
    target: index % 3 === 0 ? { id: edge.d } : edge.d,
    _e: edge
  }))
];

const types = ['parent', 'sibling', 'spouse', 'kin'];
const ids = people.slice(0, 75).map((person) => person.id);

for (const links of linkSets) {
  for (const id of ids) {
    for (const type of types) {
      assert.deepStrictEqual(
        tsGNb(id, type, links),
        legacyGNb(id, type, links),
        `gNb mismatch for ${id} type=${type}`
      );
    }

    assert.deepStrictEqual(
      tsParOf(id, links),
      legacyParOf(id, links),
      `parOf mismatch for ${id}`
    );

    assert.deepStrictEqual(
      tsChOf(id, links),
      legacyChOf(id, links),
      `chOf mismatch for ${id}`
    );
  }
}

console.log('TypeScript relationships parity passed (reference == TS).');

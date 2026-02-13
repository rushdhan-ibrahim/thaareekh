import assert from 'node:assert/strict';
import { edges } from '../../src/data/sovereigns.merge.js';
import { linkIds, linkKey, ancestralEdgeKeys } from '../../apps/web/src/graph/highlight.ts';

// Build link data in the same shape as d3 force simulation produces
const links = edges.map(e => ({
  source: e.s,
  target: e.d,
  _e: e
}));

// Also test with object-form source/target (as d3 mutates during simulation)
const linksObj = edges.map(e => ({
  source: { id: e.s },
  target: { id: e.d },
  _e: e
}));

// --- Test 1: linkIds with string source/target ---
for (const l of links.slice(0, 50)) {
  const { s, t } = linkIds(l);
  assert.equal(s, l._e.s, `linkIds string: source should be ${l._e.s}`);
  assert.equal(t, l._e.d, `linkIds string: target should be ${l._e.d}`);
}

// --- Test 2: linkIds with object source/target ---
for (const l of linksObj.slice(0, 50)) {
  const { s, t } = linkIds(l);
  assert.equal(s, l._e.s, `linkIds object: source should be ${l._e.s}`);
  assert.equal(t, l._e.d, `linkIds object: target should be ${l._e.d}`);
}

// --- Test 3: linkKey format ---
{
  const testLink = { source: 'P1', target: 'P2', _e: { s: 'P1', d: 'P2', t: 'parent', c: 'c' } };
  assert.equal(linkKey(testLink), 'P1|P2|parent');
  const testLink2 = { source: { id: 'P3' }, target: { id: 'P4' }, _e: { s: 'P3', d: 'P4', t: 'sibling', c: 'i' } };
  assert.equal(linkKey(testLink2), 'P3|P4|sibling');
}

// --- Test 4: ancestralEdgeKeys - basic ---
{
  // Build a simple chain: P1 ← parent ← P2 ← parent ← P3
  const testLinks = [
    { source: 'P2', target: 'P1', _e: { s: 'P2', d: 'P1', t: 'parent', c: 'c' } },
    { source: 'P3', target: 'P2', _e: { s: 'P3', d: 'P2', t: 'parent', c: 'c' } }
  ];
  const keys = ancestralEdgeKeys('P1', testLinks, 14);
  assert.ok(keys.has('P2|P1|parent'), 'Should include direct parent edge');
  assert.ok(keys.has('P3|P2|parent'), 'Should include grandparent edge');
  assert.equal(keys.size, 2, 'Should have exactly 2 ancestral edges');
}

// --- Test 5: ancestralEdgeKeys - non-parent edges ignored ---
{
  const testLinks = [
    { source: 'P2', target: 'P1', _e: { s: 'P2', d: 'P1', t: 'parent', c: 'c' } },
    { source: 'P3', target: 'P2', _e: { s: 'P3', d: 'P2', t: 'sibling', c: 'c' } }
  ];
  const keys = ancestralEdgeKeys('P1', testLinks, 14);
  assert.ok(keys.has('P2|P1|parent'), 'Should include parent edge');
  assert.equal(keys.size, 1, 'Sibling edge should not be included');
}

// --- Test 6: ancestralEdgeKeys - depth limit ---
{
  // Chain of 5: P5→P4→P3→P2→P1
  const testLinks = [
    { source: 'P2', target: 'P1', _e: { s: 'P2', d: 'P1', t: 'parent', c: 'c' } },
    { source: 'P3', target: 'P2', _e: { s: 'P3', d: 'P2', t: 'parent', c: 'c' } },
    { source: 'P4', target: 'P3', _e: { s: 'P4', d: 'P3', t: 'parent', c: 'c' } },
    { source: 'P5', target: 'P4', _e: { s: 'P5', d: 'P4', t: 'parent', c: 'c' } }
  ];
  const keys = ancestralEdgeKeys('P1', testLinks, 2);
  assert.ok(keys.has('P2|P1|parent'), 'Should include depth 1');
  assert.ok(keys.has('P3|P2|parent'), 'Should include depth 2');
  assert.ok(!keys.has('P4|P3|parent'), 'Should NOT include depth 3 (limit=2)');
}

// --- Test 7: ancestralEdgeKeys with real dataset ---
{
  const keys = ancestralEdgeKeys('P1', links);
  // P1 (Koimala) is first sovereign, may not have parents
  // This just ensures no crash
  assert.ok(keys instanceof Set, 'Should return a Set');
}

console.log('TypeScript highlight parity passed (7 tests).');

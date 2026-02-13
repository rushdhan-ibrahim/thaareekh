#!/usr/bin/env node
/**
 * Parity harness: rebuild module pure helpers (degreeRank, earliestYear, chronoPostProcess).
 */
import assert from 'node:assert/strict';

// Minimal DOM shim
if (typeof globalThis.document === 'undefined') {
  globalThis.document = {
    getElementById() { return null; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    addEventListener() {},
    createElement() { return {}; },
    createElementNS() { return {}; },
    documentElement: { dataset: {}, style: { getPropertyValue() { return ''; } } }
  };
}
if (typeof globalThis.window === 'undefined') {
  globalThis.window = {
    dispatchEvent() {},
    addEventListener() {},
    matchMedia() { return { matches: false }; }
  };
}
if (typeof globalThis.CustomEvent === 'undefined') {
  globalThis.CustomEvent = class CustomEvent extends Event {
    constructor(type, opts) { super(type); this.detail = opts?.detail; }
  };
}

const { degreeRank, earliestYear, chronoPostProcess } = await import('../../apps/web/src/graph/rebuild.ts');

let passed = 0;

// ── degreeRank() ──
{
  const nodes = [
    { id: 'A', nm: 'A', re: [[1100]] },
    { id: 'B', nm: 'B', re: [[1200]] },
    { id: 'C', nm: 'C', re: [[1150]] },
    { id: 'D', nm: 'D' }
  ];
  const links = [
    { source: 'A', target: 'B', _e: { s: 'A', d: 'B', t: 'parent', c: 'c' } },
    { source: 'A', target: 'C', _e: { s: 'A', d: 'C', t: 'parent', c: 'c' } },
    { source: 'B', target: 'C', _e: { s: 'B', d: 'C', t: 'sibling', c: 'c' } },
  ];

  const result = degreeRank(nodes, links);

  // A has degree 2, B has degree 2, C has degree 2, D has degree 0
  assert.strictEqual(result.degree.get('A'), 2, 'A degree=2');
  assert.strictEqual(result.degree.get('B'), 2, 'B degree=2');
  assert.strictEqual(result.degree.get('C'), 2, 'C degree=2');
  assert.strictEqual(result.degree.get('D'), 0, 'D degree=0');
  passed += 4;

  // ranked: A,B,C have degree 2 — tiebreak by re[0][0] (1100, 1200, 1150)
  // So A(1100) < C(1150) < B(1200), then D(0 degree, 99999) last
  assert.strictEqual(result.ranked[0].id, 'A', 'ranked[0] = A (degree=2, year=1100)');
  assert.strictEqual(result.ranked[1].id, 'C', 'ranked[1] = C (degree=2, year=1150)');
  assert.strictEqual(result.ranked[2].id, 'B', 'ranked[2] = B (degree=2, year=1200)');
  assert.strictEqual(result.ranked[3].id, 'D', 'ranked[3] = D (degree=0)');
  passed += 4;

  // Empty inputs
  const empty = degreeRank([], []);
  assert.strictEqual(empty.degree.size, 0, 'empty degree map');
  assert.strictEqual(empty.ranked.length, 0, 'empty ranked array');
  passed += 2;
}

// ── earliestYear() ──
{
  // Person with re
  assert.strictEqual(earliestYear({ data: { re: [[1153, 1166]], yb: 1120, yd: 1170 } }), 1153, 'earliestYear prefers re');
  assert.strictEqual(earliestYear({ data: { yb: 1120, yd: 1170 } }), 1120, 'earliestYear falls back to yb');
  assert.strictEqual(earliestYear({ data: { yd: 1170 } }), 1120, 'earliestYear infers from yd - 50');
  assert.strictEqual(earliestYear({ data: {} }), null, 'earliestYear returns null when no dates');

  // Without .data wrapper (raw node)
  assert.strictEqual(earliestYear({ re: [[1200]] }), 1200, 'earliestYear raw node with re');
  assert.strictEqual(earliestYear({ yb: 1100 }), 1100, 'earliestYear raw node with yb');
  assert.strictEqual(earliestYear({}), null, 'earliestYear raw empty');
  passed += 7;
}

// ── chronoPostProcess() ──
{
  /**
   * Build a mock d3-like hierarchy for testing:
   *
   *        root (1100)
   *       /          \
   *   child1 (1130)   child2 (no date)
   *     |
   *   grandchild (1160)
   */
  function makeNode(data, parent, children) {
    const node = { data, parent: parent || null, children: children || null, chronoY: 0 };
    return node;
  }

  // Create hierarchy bottom-up so we can wire children
  const root = makeNode({ id: 'root', nm: 'R', re: [[1100]] }, null, null);
  const child1 = makeNode({ id: 'c1', nm: 'C1', re: [[1130]] }, root, null);
  const child2 = makeNode({ id: 'c2', nm: 'C2' }, root, null);
  const grandchild = makeNode({ id: 'gc', nm: 'GC', re: [[1160]] }, child1, null);

  child1.children = [grandchild];
  root.children = [child1, child2];

  // Add .each() method (d3 hierarchy iterates depth-first)
  function addEach(node) {
    node.each = function(fn) {
      fn(this);
      if (this.children) this.children.forEach(c => { addEach(c); c.each(fn); });
    };
    // Also need to traverse children for addEach
    if (node.children) node.children.forEach(c => addEach(c));
  }
  addEach(root);

  const PX_PER_YEAR = 2;
  const TREE_MIN_YEAR = 1100;
  const TREE_DEPTH_Y = 60; // fallback spacing for undated nodes
  const MIN_GAP = 20;

  chronoPostProcess(root, PX_PER_YEAR, TREE_MIN_YEAR, TREE_DEPTH_Y, MIN_GAP);

  // Root should be normalized to 0
  assert.strictEqual(root.chronoY, 0, 'root chronoY normalized to 0');
  passed += 1;

  // child1 at 1130: (1130-1100)*2 = 60, then normalized by subtracting root's pre-norm value
  // Before normalization: root = (1100-1100)*2 = 0, child1 = (1130-1100)*2 = 60
  // After normalization: child1.chronoY = 60 - 0 = 60
  assert.strictEqual(child1.chronoY, 60, 'child1 chronoY = (1130-1100)*2 = 60');
  passed += 1;

  // grandchild at 1160: (1160-1100)*2 = 120, must be >= child1.chronoY + minGap = 80
  // 120 >= 80, so 120
  assert.strictEqual(grandchild.chronoY, 120, 'grandchild chronoY = (1160-1100)*2 = 120');
  passed += 1;

  // child2 has no date — gets treeDepthY (60) spacing from parent
  // Before normalization: child2.chronoY = root.chronoY + treeDepthY = 0 + 60 = 60
  // But then interpolation may adjust: it has parent (root, dated) — look for datedDesc.
  // child2 has no children, so findDated returns null → no interpolation
  // After normalization stays at 60
  assert.strictEqual(child2.chronoY, 60, 'child2 undated gets treeDepthY spacing');
  passed += 1;

  // Verify minGap enforcement: no child should be closer than minGap to parent
  assert.ok(child1.chronoY - root.chronoY >= MIN_GAP, 'child1 minGap from root');
  assert.ok(grandchild.chronoY - child1.chronoY >= MIN_GAP, 'grandchild minGap from child1');
  assert.ok(child2.chronoY - root.chronoY >= MIN_GAP, 'child2 minGap from root');
  passed += 3;
}

// ── chronoPostProcess with close dates (minGap enforcement) ──
{
  // Two nodes very close in time should be pushed apart
  const root = { data: { id: 'r', nm: 'R', re: [[1100]] }, parent: null, children: null, chronoY: 0 };
  const child = { data: { id: 'c', nm: 'C', re: [[1105]] }, parent: root, children: null, chronoY: 0 };
  root.children = [child];

  function addEach(node) {
    node.each = function(fn) {
      fn(this);
      if (this.children) this.children.forEach(c => { addEach(c); c.each(fn); });
    };
    if (node.children) node.children.forEach(c => addEach(c));
  }
  addEach(root);

  // PX_PER_YEAR = 2 → ideal gap = (1105-1100)*2 = 10, but minGap is 20
  chronoPostProcess(root, 2, 1100, 60, 20);

  assert.strictEqual(root.chronoY, 0, 'close: root at 0');
  assert.ok(child.chronoY >= 20, 'close: child pushed to at least minGap');
  passed += 2;
}

console.log(`\n✅ verify-ts-rebuild-parity: ${passed}/${passed} tests passed`);

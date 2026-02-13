#!/usr/bin/env node
/**
 * Parity harness: tree-options linkedTreeIndices pure function.
 */
import assert from 'node:assert/strict';

const { linkedTreeIndices } = await import('../../apps/web/src/ui/tree-options.ts');

let passed = 0;

// ── empty input ──
{
  assert.deepStrictEqual(linkedTreeIndices([], []), new Set(), 'empty meta');
  assert.deepStrictEqual(linkedTreeIndices(null, []), new Set(), 'null meta');
  passed += 2;
}

// ── no cross-tree edges ──
{
  const meta = [
    { index: 0, ids: ['P1', 'P2'], size: 2, repId: 'P1', repName: 'A', dynasty: 'X', year: 1100 },
    { index: 1, ids: ['P3', 'P4'], size: 2, repId: 'P3', repName: 'B', dynasty: 'Y', year: 1200 }
  ];
  const edges = [
    { s: 'P1', d: 'P2' },
    { s: 'P3', d: 'P4' }
  ];
  assert.deepStrictEqual(linkedTreeIndices(meta, edges), new Set(), 'no cross edges');
  passed++;
}

// ── one cross-tree edge ──
{
  const meta = [
    { index: 0, ids: ['P1', 'P2'], size: 2, repId: 'P1', repName: 'A', dynasty: 'X', year: 1100 },
    { index: 1, ids: ['P3', 'P4'], size: 2, repId: 'P3', repName: 'B', dynasty: 'Y', year: 1200 },
    { index: 2, ids: ['P5'], size: 1, repId: 'P5', repName: 'C', dynasty: 'Z', year: 1300 }
  ];
  const edges = [
    { s: 'P1', d: 'P2' },
    { s: 'P2', d: 'P3' },  // cross-tree
    { s: 'P3', d: 'P4' }
  ];
  const result = linkedTreeIndices(meta, edges);
  assert.ok(result.has(0), 'tree 0 linked');
  assert.ok(result.has(1), 'tree 1 linked');
  assert.ok(!result.has(2), 'tree 2 not linked');
  passed += 3;
}

// ── edge referencing unknown nodes ──
{
  const meta = [
    { index: 0, ids: ['P1'], size: 1, repId: 'P1', repName: 'A', dynasty: 'X', year: 1100 }
  ];
  const edges = [
    { s: 'P1', d: 'UNKNOWN' },
    { s: 'UNKNOWN2', d: 'P1' }
  ];
  assert.deepStrictEqual(linkedTreeIndices(meta, edges), new Set(), 'unknown nodes ignored');
  passed++;
}

console.log(`\n✅ verify-ts-tree-options-parity: ${passed}/${passed} tests passed`);

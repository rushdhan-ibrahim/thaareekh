#!/usr/bin/env node
/**
 * Parity harness: minimap getNodeBounds pure function.
 */
import assert from 'node:assert/strict';

const { getNodeBounds } = await import('../../apps/web/src/ui/minimap.ts');

let passed = 0;

// ── empty array ──
{
  assert.strictEqual(getNodeBounds([]), null, 'empty array');
  passed++;
}

// ── single node ──
{
  const b = getNodeBounds([{ x: 10, y: 20 }]);
  assert.ok(b !== null, 'single node not null');
  assert.strictEqual(b.minX, 10);
  assert.strictEqual(b.maxX, 10);
  assert.strictEqual(b.minY, 20);
  assert.strictEqual(b.maxY, 20);
  assert.strictEqual(b.w, 1, 'min width clamped to 1');
  assert.strictEqual(b.h, 1, 'min height clamped to 1');
  passed += 7;
}

// ── multiple nodes ──
{
  const nodes = [
    { x: -50, y: 0 },
    { x: 100, y: -30 },
    { x: 25, y: 80 }
  ];
  const b = getNodeBounds(nodes);
  assert.ok(b !== null);
  assert.strictEqual(b.minX, -50);
  assert.strictEqual(b.maxX, 100);
  assert.strictEqual(b.minY, -30);
  assert.strictEqual(b.maxY, 80);
  assert.strictEqual(b.w, 150);
  assert.strictEqual(b.h, 110);
  passed += 7;
}

// ── nodes with missing coords ──
{
  const nodes = [
    { x: 10 },           // no y
    { y: 20 },           // no x
    { x: 5, y: 15 },    // valid
    {}                    // no coords
  ];
  const b = getNodeBounds(nodes);
  assert.ok(b !== null, 'partial nodes not null');
  assert.strictEqual(b.minX, 5, 'only valid node counted');
  assert.strictEqual(b.minY, 15);
  passed += 3;
}

// ── all nodes invalid ──
{
  const nodes = [{ x: NaN, y: 0 }, { x: 0, y: Infinity }];
  assert.strictEqual(getNodeBounds(nodes), null, 'all invalid');
  passed++;
}

console.log(`\n✅ verify-ts-minimap-parity: ${passed}/${passed} tests passed`);

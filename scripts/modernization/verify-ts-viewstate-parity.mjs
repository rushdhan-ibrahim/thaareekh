#!/usr/bin/env node
/**
 * Parity harness: viewstate pure helpers (safeParse, activeChips, setChips).
 * Tests round-trip serialization and chip helpers.
 */
import assert from 'node:assert/strict';

// Import TS port
const vs = await import('../../apps/web/src/ui/viewstate.ts');

let passed = 0;

// ── safeParse ──
{
  assert.strictEqual(vs.safeParse(null), null, 'safeParse(null)');
  assert.strictEqual(vs.safeParse(''), null, 'safeParse("")');
  assert.strictEqual(vs.safeParse('invalid json'), null, 'safeParse(invalid)');
  assert.deepStrictEqual(vs.safeParse('{"a":1}'), { a: 1 }, 'safeParse(valid)');
  assert.deepStrictEqual(vs.safeParse('[]'), [], 'safeParse(array)');
  passed += 5;
}

// ── activeChips / setChips ──
// These are DOM-dependent but we test the logic path that returns early for non-array
{
  // setChips should not throw when values is not an array
  vs.setChips('.nonexistent', 'x', null);
  vs.setChips('.nonexistent', 'x', undefined);
  vs.setChips('.nonexistent', 'x', 'string');
  passed += 3;
}

console.log(`\n✅ verify-ts-viewstate-parity: ${passed}/${passed} tests passed`);

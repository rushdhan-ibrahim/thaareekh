#!/usr/bin/env node
/**
 * Parity harness: sidebar module pure helpers (estLife, sourceQualityWeight).
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

const { estLife, sourceQualityWeight } = await import('../../apps/web/src/ui/sidebar.ts');

let passed = 0;

// ── estLife() ──
{
  // Person with both yb and yd — use exact values, not estimated
  const r1 = estLife({ id: 'P1', nm: 'T', yb: 1100, yd: 1160 });
  assert.strictEqual(r1.yb, 1100, 'yb exact');
  assert.strictEqual(r1.yd, 1160, 'yd exact');
  assert.strictEqual(r1.ybEst, false, 'ybEst false when yb present');
  assert.strictEqual(r1.ydEst, false, 'ydEst false when yd present');
  passed += 4;

  // Person with only re — estimate both yb and yd
  const r2 = estLife({ id: 'P2', nm: 'T', re: [[1153, 1166]] });
  assert.strictEqual(r2.yb, 1153 - 30, 'yb estimated from re start - 30');
  assert.strictEqual(r2.yd, 1166 + 10, 'yd estimated from re end + 10');
  assert.strictEqual(r2.ybEst, true, 'ybEst true when yb missing');
  assert.strictEqual(r2.ydEst, true, 'ydEst true when yd missing');
  passed += 4;

  // Person with yb but no yd and re — yd estimated from re end
  const r3 = estLife({ id: 'P3', nm: 'T', yb: 1120, re: [[1153, 1166]] });
  assert.strictEqual(r3.yb, 1120, 'yb used over re start');
  assert.strictEqual(r3.yd, 1166 + 10, 'yd estimated from re end');
  assert.strictEqual(r3.ybEst, false, 'ybEst false');
  assert.strictEqual(r3.ydEst, true, 'ydEst true');
  passed += 4;

  // Person with yd but no yb and re — yb estimated from re start
  const r4 = estLife({ id: 'P4', nm: 'T', yd: 1170, re: [[1153, 1166]] });
  assert.strictEqual(r4.yb, 1153 - 30, 'yb estimated from re');
  assert.strictEqual(r4.yd, 1170, 'yd exact');
  assert.strictEqual(r4.ybEst, true, 'ybEst true');
  assert.strictEqual(r4.ydEst, false, 'ydEst false');
  passed += 4;

  // Person with no dates at all
  const r5 = estLife({ id: 'P5', nm: 'T' });
  assert.strictEqual(r5.yb, null, 'yb null when no data');
  assert.strictEqual(r5.yd, null, 'yd null when no data');
  assert.strictEqual(r5.ybEst, false, 'ybEst false when null');
  assert.strictEqual(r5.ydEst, false, 'ydEst false when null');
  passed += 4;

  // Person with multiple reign spans — use min/max across all spans
  const r6 = estLife({ id: 'P6', nm: 'T', re: [[1153, 1166], [1174, 1176]] });
  assert.strictEqual(r6.yb, 1153 - 30, 'yb from earliest reign');
  assert.strictEqual(r6.yd, 1176 + 10, 'yd from latest reign');
  passed += 2;

  // Person with single-element reign array
  const r7 = estLife({ id: 'P7', nm: 'T', re: [[1200]] });
  assert.strictEqual(r7.yb, 1200 - 30, 'yb single reign');
  assert.strictEqual(r7.yd, 1200 + 10, 'yd single reign');
  passed += 2;
}

// ── sourceQualityWeight() ──
{
  assert.strictEqual(sourceQualityWeight('A'), 4, 'A = 4');
  assert.strictEqual(sourceQualityWeight('B'), 3, 'B = 3');
  assert.strictEqual(sourceQualityWeight('C'), 2, 'C = 2');
  assert.strictEqual(sourceQualityWeight('D'), 1, 'D = 1');
  assert.strictEqual(sourceQualityWeight('?'), 0, 'unknown = 0');
  assert.strictEqual(sourceQualityWeight(''), 0, 'empty = 0');
  passed += 6;
}

console.log(`\n✅ verify-ts-sidebar-parity: ${passed}/${passed} tests passed`);

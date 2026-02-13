#!/usr/bin/env node
/**
 * Parity harness: compare module pure helpers (life, confidenceBadge, state mutations).
 */
import assert from 'node:assert/strict';

// Minimal DOM shim for renderCompareBadge() inside emitChange()
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

const {
  life, confidenceBadge, getCompareState, setCompareState,
  clearCompare, swapCompare, setCompareA, setCompareB,
  armCompareFrom, handlePersonViewed
} = await import('../../apps/web/src/ui/compare.ts');

let passed = 0;

// ── life() ──
{
  assert.strictEqual(life(null), 'unknown_short', 'life(null)');
  assert.strictEqual(life(undefined), 'unknown_short', 'life(undefined)');
  assert.strictEqual(life({ id: 'P1', nm: 'Test', yb: 1153, yd: 1176 }), '1153\u20131176', 'life with yb/yd');
  assert.strictEqual(life({ id: 'P2', nm: 'Test', yb: 1153 }), '1153\u2013', 'life with yb only');
  assert.strictEqual(life({ id: 'P3', nm: 'Test', yd: 1176 }), '\u20131176', 'life with yd only');
  assert.strictEqual(
    life({ id: 'P4', nm: 'Test', re: [[1153, 1166], [1174, 1176]] }),
    '1153\u20131176',
    'life with re'
  );
  assert.strictEqual(
    life({ id: 'P5', nm: 'Test', re: [[1153]] }),
    '1153\u20131153',
    'life with single reign entry'
  );
  assert.strictEqual(
    life({ id: 'P6', nm: 'Test', yb: 1100, re: [[1153, 1166]] }),
    '1100\u20131166',
    'life prefers yb over re start'
  );
  passed += 8;
}

// ── confidenceBadge ──
{
  const cBadge = confidenceBadge('c');
  assert.ok(cBadge.includes('class="rt"'), 'confirmed badge class');
  const iBadge = confidenceBadge('i');
  assert.ok(iBadge.includes('rt-i'), 'inferred badge class');
  const uBadge = confidenceBadge('u');
  assert.ok(uBadge.includes('rt-u'), 'uncertain badge class');
  const nullBadge = confidenceBadge(undefined);
  assert.ok(nullBadge.includes('class="rt"'), 'undefined => confirmed');
  passed += 4;
}

// ── state mutations ──
{
  clearCompare();
  assert.deepStrictEqual(getCompareState(), { a: null, b: null, armed: false }, 'clear');

  setCompareA('P1');
  assert.strictEqual(getCompareState().a, 'P1', 'setA');

  setCompareB('P2');
  assert.strictEqual(getCompareState().b, 'P2', 'setB');

  swapCompare();
  assert.strictEqual(getCompareState().a, 'P2', 'swap a');
  assert.strictEqual(getCompareState().b, 'P1', 'swap b');

  armCompareFrom('P3');
  assert.strictEqual(getCompareState().a, 'P3', 'arm a');
  assert.strictEqual(getCompareState().armed, true, 'arm flag');

  handlePersonViewed('P4');
  assert.strictEqual(getCompareState().b, 'P4', 'armed capture');
  assert.strictEqual(getCompareState().armed, false, 'armed cleared');

  setCompareState({ a: 'P10', b: 'P20', armed: true });
  const st = getCompareState();
  assert.strictEqual(st.a, 'P10', 'setState a');
  assert.strictEqual(st.b, 'P20', 'setState b');
  assert.strictEqual(st.armed, true, 'setState armed');

  clearCompare();
  assert.deepStrictEqual(getCompareState(), { a: null, b: null, armed: false }, 'final clear');
  passed += 13;
}

console.log(`\n✅ verify-ts-compare-parity: ${passed}/${passed} tests passed`);

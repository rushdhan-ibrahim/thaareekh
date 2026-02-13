#!/usr/bin/env node
/**
 * Parity harness: history pure helpers (keyOf, isSame, trimLabel).
 */
import assert from 'node:assert/strict';

const hist = await import('../../apps/web/src/ui/history.ts');

let passed = 0;

// ── keyOf ──
{
  assert.strictEqual(hist.keyOf(null), '', 'keyOf(null)');
  assert.strictEqual(hist.keyOf({ type: 'person', id: 'P1' }), 'p|P1', 'keyOf person');
  assert.strictEqual(
    hist.keyOf({ type: 'edge', s: 'P1', d: 'P2', rel: 'parent', label: 'test' }),
    'e|P1|P2|parent|test',
    'keyOf edge full'
  );
  assert.strictEqual(
    hist.keyOf({ type: 'edge', s: 'P1', d: 'P2' }),
    'e|P1|P2||',
    'keyOf edge minimal'
  );
  passed += 4;
}

// ── isSame ──
{
  assert.ok(hist.isSame(null, null), 'isSame null null');
  assert.ok(
    hist.isSame(
      { type: 'person', id: 'P5' },
      { type: 'person', id: 'P5' }
    ),
    'isSame same person'
  );
  assert.ok(
    !hist.isSame(
      { type: 'person', id: 'P5' },
      { type: 'person', id: 'P6' }
    ),
    'isSame different person'
  );
  assert.ok(
    !hist.isSame(
      { type: 'person', id: 'P5' },
      null
    ),
    'isSame person vs null'
  );
  assert.ok(
    hist.isSame(
      { type: 'edge', s: 'P1', d: 'P2', rel: 'spouse' },
      { type: 'edge', s: 'P1', d: 'P2', rel: 'spouse' }
    ),
    'isSame same edge'
  );
  passed += 5;
}

// ── trimLabel ──
{
  assert.strictEqual(hist.trimLabel(undefined), '', 'trimLabel undefined');
  assert.strictEqual(hist.trimLabel(''), '', 'trimLabel empty');
  assert.strictEqual(hist.trimLabel('short'), 'short', 'trimLabel short');
  assert.strictEqual(
    hist.trimLabel('a'.repeat(40)),
    'a'.repeat(33) + '\u2026',
    'trimLabel long default'
  );
  assert.strictEqual(
    hist.trimLabel('abcdefghij', 5),
    'abcd\u2026',
    'trimLabel custom n'
  );
  assert.strictEqual(
    hist.trimLabel('12345', 5),
    '12345',
    'trimLabel exact length'
  );
  passed += 6;
}

console.log(`\n✅ verify-ts-history-parity: ${passed}/${passed} tests passed`);

#!/usr/bin/env node
/**
 * Parity harness: keyboard-nav directionScore pure function.
 */
import assert from 'node:assert/strict';

const { directionScore } = await import('../../apps/web/src/ui/keyboard-nav.ts');

let passed = 0;
const origin = { x: 0, y: 0 };

// ── directionScore basics ──
{
  // Node directly to the right
  const right = { x: 100, y: 0 };
  assert.ok(directionScore(origin, right, 'right') > 0, 'right positive for right');
  assert.ok(directionScore(origin, right, 'left') < 0, 'right negative for left');
  passed += 2;
}

{
  // Node directly below
  const below = { x: 0, y: 100 };
  assert.ok(directionScore(origin, below, 'down') > 0, 'below positive for down');
  assert.ok(directionScore(origin, below, 'up') < 0, 'below negative for up');
  passed += 2;
}

{
  // Node directly above
  const above = { x: 0, y: -100 };
  assert.ok(directionScore(origin, above, 'up') > 0, 'above positive for up');
  assert.ok(directionScore(origin, above, 'down') < 0, 'above negative for down');
  passed += 2;
}

{
  // Node directly to the left
  const left = { x: -100, y: 0 };
  assert.ok(directionScore(origin, left, 'left') > 0, 'left positive for left');
  assert.ok(directionScore(origin, left, 'right') < 0, 'left negative for right');
  passed += 2;
}

{
  // Same position returns -Infinity
  assert.strictEqual(directionScore(origin, { x: 0, y: 0 }, 'right'), -Infinity, 'same pos');
  passed += 1;
}

{
  // Diagonal favors primary axis
  const diag = { x: 100, y: 10 };
  const scoreRight = directionScore(origin, diag, 'right');
  const scoreDown = directionScore(origin, diag, 'down');
  assert.ok(scoreRight > scoreDown, 'diagonal favors primary axis');
  passed += 1;
}

{
  // Perpendicular penalty
  const rightPure = { x: 100, y: 0 };
  const rightDiag = { x: 100, y: 80 };
  assert.ok(
    directionScore(origin, rightPure, 'right') > directionScore(origin, rightDiag, 'right'),
    'perpendicular penalty'
  );
  passed += 1;
}

console.log(`\n✅ verify-ts-keyboard-nav-parity: ${passed}/${passed} tests passed`);

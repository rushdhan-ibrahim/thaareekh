import assert from 'node:assert/strict';
import * as js from '../../src/ui/era-scrubber-core.js';
import * as ts from '../../apps/web/src/ui/era-scrubber-core.ts';

assert.deepEqual(ts.DYNASTY_BANDS, js.DYNASTY_BANDS, 'DYNASTY_BANDS table');

for (const v of [-1, 0, 0.4, 1, 2]) {
  assert.equal(ts.clamp01(v), js.clamp01(v), `clamp01(${v})`);
}

for (const [y, a, b] of [[1117, 1117, 1968], [1500, 1117, 1968], [1968, 1117, 1968], [900, 1117, 1968], [2050, 1117, 1968], [1500, 1500, 1500]]) {
  assert.equal(ts.scrubProgress(y, a, b), js.scrubProgress(y, a, b), `scrubProgress(${y},${a},${b})`);
}

for (const [a, b] of [[1117, 1968], [1117, 2026], [1300, 1700], [1968, 2026]]) {
  assert.deepEqual(ts.dynastyBandStops(a, b), js.dynastyBandStops(a, b), `dynastyBandStops(${a},${b})`);
}

const people = [
  { id: 'P2', nm: 'B', re: [[1573, 1585]] },
  { id: 'P1', nm: 'A', n: [12], re: [[1573, 1602]] },
  { id: 'P3', nm: 'C', re: [[1400, 1420]] },
  { id: 'P4', nm: 'D' }
];
for (const y of [1574, 1585, 1600, 1410, 1700]) {
  assert.deepEqual(
    ts.reigningAt(y, people).map(p => p.id),
    js.reigningAt(y, people).map(p => p.id),
    `reigningAt(${y})`
  );
}
assert.deepEqual(ts.reigningAt(1580, people).map(p => p.id), ['P1', 'P2'], 'sovereign ordinal sorts first');

console.log('TypeScript era-scrubber-core parity passed (bands, progress, stops, reigningAt).');

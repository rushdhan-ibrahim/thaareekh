import assert from 'node:assert/strict';
import * as js from '../../src/ui/marginalia.js';
import * as ts from '../../apps/web/src/ui/marginalia.ts';

const reignFixtures = [
  undefined,
  [],
  [1573, 1585],
  [[1573, 1585]],
  [[1573, 1585], [1588, 1593]],
  [[1700]],
  ['x', [1800, 1810]]
];

for (const re of reignFixtures) {
  assert.deepEqual(ts.normalizeReigns(re), js.normalizeReigns(re), `normalizeReigns(${JSON.stringify(re)})`);
}

for (const n of [0, 1, 3, 5, 7, 12, 25, 26, 40, -2, 2.7]) {
  assert.equal(ts.tallyMarks(n), js.tallyMarks(n), `tallyMarks(${n})`);
}

for (const g of ['A', 'b', ' C ', 'D', '', null, undefined, 'Z']) {
  assert.equal(ts.sealHtml(g), js.sealHtml(g), `sealHtml(${g})`);
}

const people = [
  { yb: 1540, yd: 1610, re: [[1573, 1585]] },
  { yb: null, yd: null, re: [[1692, 1701], [1705, 1720]] },
  { yb: 1900, yd: 1980, re: [] },
  { re: [1117, 1141] },
  {}
];
for (const p of people) {
  assert.equal(ts.reignArcSvg(p), js.reignArcSvg(p), `reignArcSvg(${JSON.stringify(p)})`);
  assert.equal(ts.reignArcSvg(p, 1100, 2026, 80, 14), js.reignArcSvg(p, 1100, 2026, 80, 14), 'reignArcSvg custom range');
}

assert.equal(ts.reignArcSvg({}), '', 'empty person yields empty string');
assert.ok(ts.reignArcSvg(people[0]).includes('ra-reign'), 'reign segment rendered');
assert.ok(ts.tallyMarks(26).includes('tgmore'), 'overflow marker rendered');

console.log('TypeScript marginalia parity passed (normalizeReigns, tallyMarks, sealHtml, reignArcSvg).');

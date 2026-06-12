import assert from 'node:assert/strict';
import * as js from '../../src/audio/audio-maps.js';
import * as ts from '../../apps/web/src/audio/audio-maps.ts';

assert.deepEqual(ts.DYNASTY_PITCH, js.DYNASTY_PITCH, 'DYNASTY_PITCH table');
assert.equal(ts.DEFAULT_PITCH, js.DEFAULT_PITCH, 'DEFAULT_PITCH');

for (const k of ['lunar', 'Hilaaly', 'UTHEEMU', 'dhiyamigili', 'huraagey', 'isdu', '', null, undefined]) {
  assert.equal(ts.dynastyPitch(k), js.dynastyPitch(k), `dynastyPitch(${k})`);
  assert.equal(ts.bellPitch(k), js.bellPitch(k), `bellPitch(${k})`);
}

for (const p of [-0.5, 0, 0.25, 0.5, 0.99, 1, 3]) {
  assert.equal(ts.tickPitch(p), js.tickPitch(p), `tickPitch(${p})`);
  assert.equal(ts.clamp01(p), js.clamp01(p), `clamp01(${p})`);
}

assert.equal(ts.tickPitch(0), 3200, 'tick floor');
assert.equal(ts.tickPitch(1), 4600, 'tick ceiling');
assert.equal(ts.bellPitch('lunar'), 196, 'bell is a dark octave');

console.log('TypeScript audio-maps parity passed (pitch tables, ticks, bells).');

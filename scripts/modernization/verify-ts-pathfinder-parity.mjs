import assert from 'node:assert/strict';
import { people, edges } from '../../src/data/sovereigns.merge.js';
import {
  findRelationshipPath as findLegacyRelationshipPath,
  relationStepLabel as legacyRelationStepLabel,
  confidenceText as legacyConfidenceText
} from '../../src/graph/pathfinder.js';
import {
  createPathfinder,
  relationStepLabel as tsRelationStepLabel,
  confidenceText as tsConfidenceText
} from '../../apps/web/src/graph/pathfinder.ts';

const tsPathfinder = createPathfinder(edges);

function normalizePath(path) {
  if (!path) return null;
  return {
    ids: path.ids,
    depth: path.depth,
    cost: path.cost == null ? null : Number(path.cost.toFixed(8)),
    hops: path.hops.map((step) => ({
      id: step.id,
      from: step.from,
      to: step.to,
      edge: {
        s: step.edge.s,
        d: step.edge.d,
        t: step.edge.t,
        c: step.edge.c,
        l: step.edge.l
      }
    }))
  };
}

const personIds = people.map((person) => person.id);
const pairs = [];
for (let i = 0; i < Math.min(personIds.length, 45); i++) {
  for (let j = i + 1; j < Math.min(personIds.length, i + 10); j++) {
    pairs.push([personIds[i], personIds[j]]);
  }
}

const maxDepths = [2, 4, 6, 10, 12];
for (const [aId, bId] of pairs) {
  for (const maxDepth of maxDepths) {
    const legacy = normalizePath(findLegacyRelationshipPath(aId, bId, { maxDepth }));
    const ts = normalizePath(tsPathfinder.findRelationshipPath(aId, bId, { maxDepth }));
    assert.deepStrictEqual(
      ts,
      legacy,
      `Path mismatch for ${aId} -> ${bId} @ maxDepth=${maxDepth}`
    );
  }
}

assert.deepStrictEqual(
  tsPathfinder.findRelationshipPath(null, 'P1'),
  findLegacyRelationshipPath(null, 'P1'),
  'Null source behavior mismatch'
);

assert.deepStrictEqual(
  tsPathfinder.findRelationshipPath('P1', null),
  findLegacyRelationshipPath('P1', null),
  'Null target behavior mismatch'
);

assert.deepStrictEqual(
  normalizePath(tsPathfinder.findRelationshipPath('P1', 'P1')),
  normalizePath(findLegacyRelationshipPath('P1', 'P1')),
  'Same-node behavior mismatch'
);

const labelSamples = [
  { edge: { t: 'parent', s: 'A', d: 'B' }, from: 'A', to: 'B' },
  { edge: { t: 'parent', s: 'A', d: 'B' }, from: 'B', to: 'A' },
  { edge: { t: 'sibling' } },
  { edge: { t: 'spouse' } },
  { edge: { t: 'kin', l: 'cousin' } },
  { edge: { t: 'kin' } }
];

for (const sample of labelSamples) {
  assert.equal(
    tsRelationStepLabel(sample),
    legacyRelationStepLabel(sample),
    'relationStepLabel mismatch'
  );
}

for (const confidence of ['c', 'i', 'u', undefined]) {
  assert.equal(
    tsConfidenceText(confidence),
    legacyConfidenceText(confidence),
    `confidenceText mismatch for ${String(confidence)}`
  );
}

console.log('TypeScript pathfinder parity passed (legacy JS == TS).');

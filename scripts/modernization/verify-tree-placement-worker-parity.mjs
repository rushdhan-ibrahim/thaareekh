#!/usr/bin/env node
import assert from 'node:assert/strict';
import { people, edges } from '../../src/data/sovereigns.merge.js';
import { computeTreePlacement as computeLegacyTreePlacement } from '../../src/graph/tree-placement-core.js';
import { computeTreePlacement as computeTsTreePlacement } from '../../apps/web/src/graph/tree-placement-core.ts';

const DENSITY_PROFILES = {
  compact: {
    padMale: 8,
    padFemale: 11,
    treeDepthY: 58,
    treeSiblingX: 130,
    treeSectionGap: 40,
    treeCharW: 6.5,
    maxLabelChars: 18
  },
  normal: {
    padMale: 9,
    padFemale: 13,
    treeDepthY: 68,
    treeSiblingX: 150,
    treeSectionGap: 48,
    treeCharW: 7.1,
    maxLabelChars: 22
  },
  presentation: {
    padMale: 11,
    padFemale: 15,
    treeDepthY: 86,
    treeSiblingX: 180,
    treeSectionGap: 60,
    treeCharW: 8,
    maxLabelChars: 28
  }
};

function toPlacementNode(person) {
  const out = {
    id: person.id,
    label: person.nm || person.id,
    n: (person.n || []).map((value) => String(value)),
    re: person.re || []
  };
  if (person.g !== undefined) out.g = person.g;
  if (person.dy !== undefined) out.dy = person.dy;
  if (person.yb !== undefined) out.yb = person.yb;
  if (person.yd !== undefined) out.yd = person.yd;
  return out;
}

function toPlacementEdge(edge) {
  const out = {
    s: edge.s,
    d: edge.d,
    t: edge.t,
    c: edge.c
  };
  if (edge.confidence_grade !== undefined) out.confidence_grade = edge.confidence_grade;
  if (edge.l !== undefined) out.l = edge.l;
  return out;
}

function makePayload(nodes, links, density) {
  return {
    nodes: nodes.map(toPlacementNode),
    links: links.map(toPlacementEdge),
    dens: density,
    labels: {
      earlySovereigns: 'Early Sovereigns',
      unconnected: 'Unconnected'
    }
  };
}

function roundNumber(value) {
  return Number(value.toFixed(6));
}

function entries(value) {
  if (value instanceof Map) return [...value.entries()];
  return Array.isArray(value) ? value : [];
}

function normalizePlacement(output) {
  const pos = entries(output.pos)
    .map(([id, p]) => [id, { x: roundNumber(p.x), y: roundNumber(p.y), depth: p.depth }])
    .sort((a, b) => String(a[0]).localeCompare(String(b[0])));

  const depthMap = entries(output.depthMap)
    .map(([id, depth]) => [id, depth])
    .sort((a, b) => String(a[0]).localeCompare(String(b[0])));

  const sections = (output.sections || []).map((section) => ({
    y: roundNumber(section.y),
    dynasty: section.dynasty ?? null,
    label: section.label,
    count: section.count
  }));

  return {
    pos,
    depthMap,
    sections,
    yOffset: roundNumber(output.yOffset),
    treeMinYear: roundNumber(output.treeMinYear),
    treePxPerYear: roundNumber(output.treePxPerYear),
    treeBaseY: roundNumber(output.treeBaseY),
    treeMaxColX: roundNumber(output.treeMaxColX)
  };
}

function pickSubsetByIds(nodes, links, ids) {
  const idSet = new Set(ids);
  return {
    nodes: nodes.filter((person) => idSet.has(person.id)),
    links: links.filter((edge) => idSet.has(edge.s) && idSet.has(edge.d))
  };
}

function buildFixtures() {
  const earliestSorted = [...people].sort((a, b) => {
    const ay = a.re?.[0]?.[0] ?? a.yb ?? (a.yd ? a.yd - 50 : 9999);
    const by = b.re?.[0]?.[0] ?? b.yb ?? (b.yd ? b.yd - 50 : 9999);
    return ay - by;
  });

  const dynastyCounts = new Map();
  for (const person of people) {
    if (!person.dy) continue;
    dynastyCounts.set(person.dy, (dynastyCounts.get(person.dy) || 0) + 1);
  }
  const topDynasties = [...dynastyCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([dynasty]) => dynasty);

  const topDynastyPeople = topDynasties.length
    ? people.filter((person) => topDynasties.includes(person.dy))
    : [];

  const full = makePayload(people, edges, DENSITY_PROFILES.normal);
  const earlySubset = pickSubsetByIds(
    people,
    edges,
    earliestSorted.slice(0, 90).map((person) => person.id)
  );
  const dynastySubset = pickSubsetByIds(
    people,
    edges,
    (topDynastyPeople.length ? topDynastyPeople : earliestSorted).slice(0, 120).map((person) => person.id)
  );

  return [
    { name: 'full-normal', payload: full },
    {
      name: 'early-compact',
      payload: makePayload(earlySubset.nodes, earlySubset.links, DENSITY_PROFILES.compact)
    },
    {
      name: 'dynasty-presentation',
      payload: makePayload(dynastySubset.nodes, dynastySubset.links, DENSITY_PROFILES.presentation)
    }
  ];
}

let importCounter = 0;
async function runWorkerFixture(workerModuleUrl, fixtureName, payload) {
  importCounter += 1;
  const listeners = new Map();
  const posted = [];
  const originalSelf = globalThis.self;

  globalThis.self = {
    addEventListener(type, handler) {
      listeners.set(type, handler);
    },
    postMessage(message) {
      posted.push(message);
    }
  };

  try {
    await import(`${workerModuleUrl}?parity_case=${importCounter}`);
    const onMessage = listeners.get('message');
    assert.equal(typeof onMessage, 'function', `${fixtureName}: worker did not register message listener`);

    const runOnce = (keySuffix) => {
      posted.length = 0;
      onMessage({
        data: {
          type: 'tree-placement-request',
          key: `${fixtureName}-${keySuffix}`,
          payload
        }
      });
      assert.equal(posted.length, 1, `${fixtureName}: worker should post exactly one message`);
      return posted[0];
    };

    return {
      first: runOnce('first'),
      second: runOnce('second')
    };
  } finally {
    if (originalSelf === undefined) {
      delete globalThis.self;
    } else {
      globalThis.self = originalSelf;
    }
  }
}

function assertWorkerMatchesSync(workerMessage, expected, label) {
  assert.equal(workerMessage.type, 'tree-placement-result', `${label}: worker returned non-result message`);
  assert.ok(typeof workerMessage.elapsedMs === 'number' && workerMessage.elapsedMs >= 0, `${label}: invalid elapsedMs`);
  assert.deepStrictEqual(
    normalizePlacement(workerMessage.result),
    expected,
    `${label}: worker result mismatch against sync output`
  );
}

const jsWorkerUrl = new URL('../../src/graph/tree-placement-worker.js', import.meta.url).href;
const tsWorkerUrl = new URL('../../apps/web/src/graph/tree-placement-worker.ts', import.meta.url).href;

const fixtures = buildFixtures();
let assertions = 0;

for (const fixture of fixtures) {
  const syncLegacy = normalizePlacement(computeLegacyTreePlacement(fixture.payload));
  const syncTs = normalizePlacement(computeTsTreePlacement(fixture.payload));

  assert.deepStrictEqual(syncTs, syncLegacy, `${fixture.name}: TypeScript core differs from legacy core`);
  assertions += 1;

  const jsWorker = await runWorkerFixture(jsWorkerUrl, `${fixture.name}-legacy-worker`, fixture.payload);
  assertWorkerMatchesSync(jsWorker.first, syncLegacy, `${fixture.name}: legacy worker run #1`);
  assertWorkerMatchesSync(jsWorker.second, syncLegacy, `${fixture.name}: legacy worker run #2`);
  assert.deepStrictEqual(
    normalizePlacement(jsWorker.first.result),
    normalizePlacement(jsWorker.second.result),
    `${fixture.name}: legacy worker result not deterministic`
  );
  assertions += 3;

  const tsWorker = await runWorkerFixture(tsWorkerUrl, `${fixture.name}-ts-worker`, fixture.payload);
  assertWorkerMatchesSync(tsWorker.first, syncTs, `${fixture.name}: TS worker run #1`);
  assertWorkerMatchesSync(tsWorker.second, syncTs, `${fixture.name}: TS worker run #2`);
  assert.deepStrictEqual(
    normalizePlacement(tsWorker.first.result),
    normalizePlacement(tsWorker.second.result),
    `${fixture.name}: TS worker result not deterministic`
  );
  assertions += 3;
}

console.log(`Tree placement worker parity passed (${fixtures.length} fixtures, ${assertions} assertions).`);
process.exit(0);

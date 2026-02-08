import { edges } from '../data/sovereigns.merge.js';

const ADJ = new Map();

function addAdj(from, to, edge) {
  if (!ADJ.has(from)) ADJ.set(from, []);
  ADJ.get(from).push({ to, edge });
}

edges.forEach(edge => {
  addAdj(edge.s, edge.d, edge);
  addAdj(edge.d, edge.s, edge);
});

function relationBaseCost(t) {
  if (t === 'parent') return 1.0;
  if (t === 'sibling') return 1.1;
  if (t === 'spouse') return 1.25;
  return 1.6;
}

function confidencePenalty(c) {
  if (c === 'c') return 0;
  if (c === 'i') return 0.45;
  return 0.95;
}

function edgeCost(edge) {
  return relationBaseCost(edge.t) + confidencePenalty(edge.c);
}

function popBest(queue) {
  if (!queue.length) return null;
  let bestIdx = 0;
  for (let i = 1; i < queue.length; i++) {
    const a = queue[i];
    const b = queue[bestIdx];
    if (a.cost < b.cost || (a.cost === b.cost && a.depth < b.depth)) bestIdx = i;
  }
  return queue.splice(bestIdx, 1)[0];
}

export function findRelationshipPath(aId, bId, { maxDepth = 10 } = {}) {
  if (!aId || !bId) return null;
  if (aId === bId) {
    return { ids: [aId], hops: [], depth: 0, cost: 0 };
  }

  const dist = new Map([[aId, 0]]);
  const bestDepth = new Map([[aId, 0]]);
  const prev = new Map();
  const queue = [{ id: aId, cost: 0, depth: 0 }];
  const settled = new Set();

  while (queue.length) {
    const cur = popBest(queue);
    if (!cur || settled.has(cur.id)) continue;
    settled.add(cur.id);
    if (cur.id === bId) break;
    if (cur.depth >= maxDepth) continue;

    const nexts = ADJ.get(cur.id) || [];
    for (const next of nexts) {
      const depth = cur.depth + 1;
      if (depth > maxDepth) continue;
      const cost = cur.cost + edgeCost(next.edge);
      const prevCost = dist.get(next.to);
      const prevDepth = bestDepth.get(next.to);
      if (
        prevCost == null ||
        cost < prevCost - 1e-9 ||
        (Math.abs(cost - prevCost) <= 1e-9 && depth < (prevDepth ?? Infinity))
      ) {
        dist.set(next.to, cost);
        bestDepth.set(next.to, depth);
        prev.set(next.to, { id: cur.id, from: cur.id, to: next.to, edge: next.edge });
        queue.push({ id: next.to, cost, depth });
      }
    }
  }

  if (!prev.has(bId)) return null;
  const ids = [bId];
  const hops = [];
  let cur = bId;
  while (cur !== aId) {
    const step = prev.get(cur);
    if (!step) return null;
    hops.push(step);
    ids.push(step.id);
    cur = step.id;
  }
  ids.reverse();
  hops.reverse();
  return {
    ids,
    hops,
    depth: hops.length,
    cost: dist.get(bId) ?? null
  };
}

export function relationStepLabel(step) {
  const e = step?.edge || {};
  if (e.t === 'parent') {
    if (e.s === step.from && e.d === step.to) return 'parent -> child';
    return 'child -> parent';
  }
  if (e.t === 'sibling') return 'sibling';
  if (e.t === 'spouse') return 'spouse';
  if (e.l) return `kin (${e.l})`;
  return 'kin';
}

export function confidenceText(c) {
  if (c === 'c') return 'confirmed';
  if (c === 'i') return 'inferred';
  return 'uncertain';
}

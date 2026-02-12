function addAdj(adj, from, to, edge) {
    if (!adj.has(from))
        adj.set(from, []);
    adj.get(from).push({ to, edge });
}
function relationBaseCost(type) {
    if (type === 'parent')
        return 1.0;
    if (type === 'sibling')
        return 1.1;
    if (type === 'spouse')
        return 1.25;
    return 1.6;
}
function confidencePenalty(confidence) {
    if (confidence === 'c')
        return 0;
    if (confidence === 'i')
        return 0.45;
    return 0.95;
}
function edgeCost(edge) {
    return relationBaseCost(edge.t) + confidencePenalty(edge.c);
}
function popBest(queue) {
    if (!queue.length)
        return null;
    let bestIndex = 0;
    for (let i = 1; i < queue.length; i++) {
        const a = queue[i];
        const b = queue[bestIndex];
        if (a.cost < b.cost || (a.cost === b.cost && a.depth < b.depth))
            bestIndex = i;
    }
    return queue.splice(bestIndex, 1)[0] ?? null;
}
export function relationStepLabel(step) {
    const edge = step?.edge ?? {};
    if (edge.t === 'parent') {
        if (edge.s === step?.from && edge.d === step?.to)
            return 'parent -> child';
        return 'child -> parent';
    }
    if (edge.t === 'sibling')
        return 'sibling';
    if (edge.t === 'spouse')
        return 'spouse';
    if (edge.l)
        return `kin (${edge.l})`;
    return 'kin';
}
export function confidenceText(confidence) {
    if (confidence === 'c')
        return 'confirmed';
    if (confidence === 'i')
        return 'inferred';
    return 'uncertain';
}
export function createPathfinder(edges) {
    const adj = new Map();
    edges.forEach((edge) => {
        addAdj(adj, edge.s, edge.d, edge);
        addAdj(adj, edge.d, edge.s, edge);
    });
    function findRelationshipPath(aId, bId, { maxDepth = 10 } = {}) {
        if (!aId || !bId)
            return null;
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
            if (!cur || settled.has(cur.id))
                continue;
            settled.add(cur.id);
            if (cur.id === bId)
                break;
            if (cur.depth >= maxDepth)
                continue;
            const nexts = adj.get(cur.id) ?? [];
            for (const next of nexts) {
                const depth = cur.depth + 1;
                if (depth > maxDepth)
                    continue;
                const cost = cur.cost + edgeCost(next.edge);
                const prevCost = dist.get(next.to);
                const prevDepth = bestDepth.get(next.to);
                if (prevCost == null ||
                    cost < prevCost - 1e-9 ||
                    (Math.abs(cost - prevCost) <= 1e-9 && depth < (prevDepth ?? Infinity))) {
                    dist.set(next.to, cost);
                    bestDepth.set(next.to, depth);
                    prev.set(next.to, { id: cur.id, from: cur.id, to: next.to, edge: next.edge });
                    queue.push({ id: next.to, cost, depth });
                }
            }
        }
        if (!prev.has(bId))
            return null;
        const ids = [bId];
        const hops = [];
        let cur = bId;
        while (cur !== aId) {
            const step = prev.get(cur);
            if (!step)
                return null;
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
    return { findRelationshipPath };
}

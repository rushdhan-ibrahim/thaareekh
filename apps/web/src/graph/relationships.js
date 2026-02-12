function endpointId(node) {
    return typeof node === 'object' ? node.id : node;
}
function dedupeById(rows) {
    return [...new Map(rows.map((row) => [row.id, row])).values()];
}
function toNeighbor(link, id) {
    const s = endpointId(link.source);
    const t = endpointId(link.target);
    return {
        id: s === id ? t : s,
        c: link._e.c,
        srcCount: (link._e.evidence_refs ?? []).length,
        cg: link._e.confidence_grade ?? '',
        l: link._e.l ?? '',
        t: link._e.t
    };
}
export function gNb(id, type, links) {
    const rows = [];
    links.forEach((link) => {
        if (link._e.t !== type)
            return;
        const s = endpointId(link.source);
        const t = endpointId(link.target);
        if (s === id || t === id)
            rows.push(toNeighbor(link, id));
    });
    return dedupeById(rows);
}
export function parOf(id, links) {
    const rows = [];
    links.forEach((link) => {
        if (link._e.t !== 'parent')
            return;
        const s = endpointId(link.source);
        const t = endpointId(link.target);
        if (t === id)
            rows.push(toNeighbor(link, id));
    });
    return dedupeById(rows);
}
export function chOf(id, links) {
    const rows = [];
    links.forEach((link) => {
        if (link._e.t !== 'parent')
            return;
        const s = endpointId(link.source);
        if (s === id)
            rows.push(toNeighbor(link, id));
    });
    return dedupeById(rows);
}

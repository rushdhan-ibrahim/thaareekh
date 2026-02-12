export interface RelationshipEdgeRecord {
  t?: string;
  c?: string;
  confidence_grade?: string;
  l?: string;
  evidence_refs?: unknown[];
}

export interface LinkLike {
  source: string | { id: string };
  target: string | { id: string };
  _e: RelationshipEdgeRecord;
}

export interface RelationshipNeighbor {
  id: string;
  c: string | undefined;
  srcCount: number;
  cg: string;
  l: string;
  t: string | undefined;
}

function endpointId(node: string | { id: string }): string {
  return typeof node === 'object' ? node.id : node;
}

function dedupeById(rows: RelationshipNeighbor[]): RelationshipNeighbor[] {
  return [...new Map(rows.map((row) => [row.id, row])).values()];
}

function toNeighbor(link: LinkLike, id: string): RelationshipNeighbor {
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

export function gNb(id: string, type: string, links: LinkLike[]): RelationshipNeighbor[] {
  const rows: RelationshipNeighbor[] = [];
  links.forEach((link) => {
    if (link._e.t !== type) return;
    const s = endpointId(link.source);
    const t = endpointId(link.target);
    if (s === id || t === id) rows.push(toNeighbor(link, id));
  });
  return dedupeById(rows);
}

export function parOf(id: string, links: LinkLike[]): RelationshipNeighbor[] {
  const rows: RelationshipNeighbor[] = [];
  links.forEach((link) => {
    if (link._e.t !== 'parent') return;
    const s = endpointId(link.source);
    const t = endpointId(link.target);
    if (t === id) rows.push(toNeighbor(link, id));
  });
  return dedupeById(rows);
}

export function chOf(id: string, links: LinkLike[]): RelationshipNeighbor[] {
  const rows: RelationshipNeighbor[] = [];
  links.forEach((link) => {
    if (link._e.t !== 'parent') return;
    const s = endpointId(link.source);
    if (s === id) rows.push(toNeighbor(link, id));
  });
  return dedupeById(rows);
}

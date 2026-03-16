import * as d3 from 'd3';

export interface TreePlacementNode {
  id: string;
  label: string;
  g?: string;
  dy?: string;
  n?: string[];
  re?: Array<[number, number?]>;
  yb?: number;
  yd?: number;
}

export interface TreePlacementEdge {
  s: string;
  d: string;
  t: string;
  c?: string;
  confidence_grade?: string;
  l?: string;
}

export interface TreePlacementDensity {
  padMale: number;
  padFemale: number;
  treeDepthY: number;
  treeSiblingX: number;
  treeSectionGap: number;
  treeCharW: number;
  maxLabelChars: number;
}

export interface TreePlacementLabels {
  earlySovereigns: string;
  unconnected: string;
}

export interface TreePlacementInput {
  nodes: TreePlacementNode[];
  links: TreePlacementEdge[];
  dens: TreePlacementDensity;
  labels: TreePlacementLabels;
}

export interface TreePlacementSection {
  y: number;
  dynasty: string | null;
  label: string;
  count: number;
}

export interface TreePlacementOutput {
  pos: Array<[string, { x: number; y: number; depth: number }]>;
  depthMap: Array<[string, number]>;
  sections: TreePlacementSection[];
  yOffset: number;
  treeMinYear: number;
  treePxPerYear: number;
  treeBaseY: number;
  treeMaxColX: number;
}

interface TreeDim {
  tr: { hierarchy: any; size: number; dominantDy: string; rootName: string; earliestYear: number };
  desc: any[];
  minNodeX: number;
  maxNodeX: number;
  width: number;
  earliestYear: number;
  latestYear: number;
  isMajor: boolean;
  height?: number;
  trueWidth?: number;
  assignedCol?: number;
  assignedY?: number;
}

function nodeYear(node: TreePlacementNode): number | null {
  return node.re?.[0]?.[0] || node.yb || (node.yd ? node.yd - 50 : null);
}

function estimateNodeWidth(node: TreePlacementNode, dens: TreePlacementDensity): number {
  const labelLen = Math.min((node.label || '').length + (node.g === 'F' ? 2 : 0), dens.maxLabelChars);
  const pad = node.g === 'F' ? dens.padFemale : dens.padMale;
  return labelLen * dens.treeCharW + pad * 2;
}

function chronoPostProcess(
  hierarchy: any,
  pxPerYear: number,
  treeMinYear: number,
  treeDepthY: number,
  minGap: number
): void {
  function hYear(d: any): number | null {
    return nodeYear(d.data);
  }

  const queue = [hierarchy];
  hierarchy.chronoY = 0;
  const rootYear = hYear(hierarchy);
  if (rootYear) hierarchy.chronoY = (rootYear - treeMinYear) * pxPerYear;

  while (queue.length) {
    const node = queue.shift();
    if (!node?.children) continue;
    for (const child of node.children) {
      const yr = hYear(child);
      if (yr) {
        const idealY = (yr - treeMinYear) * pxPerYear;
        child.chronoY = Math.max(idealY, node.chronoY + minGap);
      } else {
        child.chronoY = node.chronoY + treeDepthY;
      }
      queue.push(child);
    }
  }

  hierarchy.each((node: any) => {
    if (hYear(node)) return;
    if (!node.parent) return;
    let datedAncestor = node.parent;
    while (datedAncestor && !hYear(datedAncestor)) datedAncestor = datedAncestor.parent;
    if (!datedAncestor) return;
    let datedDesc: any = null;
    let descDepth = 0;
    const findDated = (n: any, depth: number) => {
      if (datedDesc) return;
      if (hYear(n) && n !== node) { datedDesc = n; descDepth = depth; return; }
      if (n.children) n.children.forEach((c: any) => findDated(c, depth + 1));
    };
    findDated(node, 0);
    if (!datedDesc) return;
    let ancestorDepth = 0;
    let walk = node;
    while (walk && walk !== datedAncestor) { ancestorDepth += 1; walk = walk.parent; }
    const totalSteps = ancestorDepth + descDepth;
    if (totalSteps <= 0) return;
    const frac = ancestorDepth / totalSteps;
    node.chronoY = datedAncestor.chronoY + frac * (datedDesc.chronoY - datedAncestor.chronoY);
    node.chronoY = Math.max(node.chronoY, node.parent.chronoY + minGap);
  });

  const leaves: any[] = [];
  hierarchy.each((n: any) => { if (!n.children || !n.children.length) leaves.push(n); });
  const visited = new Set<any>();
  const stack = [...leaves];
  while (stack.length) {
    const node = stack.shift();
    if (!node || visited.has(node)) continue;
    visited.add(node);
    if (node.parent) {
      const deficit = minGap - (node.chronoY - node.parent.chronoY);
      if (deficit > 0) {
        const pushDown = (n: any) => {
          n.chronoY += deficit;
          if (n.children) n.children.forEach(pushDown);
        };
        pushDown(node);
      }
      if (!visited.has(node.parent)) stack.push(node.parent);
    }
  }

  const rootCY = hierarchy.chronoY;
  hierarchy.each((n: any) => { n.chronoY -= rootCY; });
}

export function computeTreePlacement(input: TreePlacementInput): TreePlacementOutput {
  const { nodes, links, dens, labels } = input;
  const byId = new Map<string, TreePlacementNode>(nodes.map(n => [n.id, n]));
  const pLinks = links.filter(l => l.t === 'parent');
  const rankC = (c: string | undefined) => c === 'c' ? 0 : c === 'i' ? 1 : 2;
  const sy = (id: string) => nodeYear(byId.get(id) || ({ id, label: id } as TreePlacementNode)) ?? 9999;
  const parentByChild = new Map<string, { p: string; e: TreePlacementEdge }>();
  pLinks.forEach(l => {
    const cur = parentByChild.get(l.d);
    if (!cur) { parentByChild.set(l.d, { p: l.s, e: l }); return; }
    const better = rankC(l.c) < rankC(cur.e.c) || (rankC(l.c) === rankC(cur.e.c) && sy(l.s) < sy(cur.p));
    if (better) parentByChild.set(l.d, { p: l.s, e: l });
  });

  const pos = new Map<string, { x: number; y: number; depth: number }>();
  const depthMap = new Map<string, number>();
  const sections: TreePlacementSection[] = [];
  let yOffset = 60;
  let treeMinYear = 1100;
  let treePxPerYear = 3;
  const treeBaseY = yOffset;
  let treeMaxColX = 80;

  const children = new Map<string, string[]>(nodes.map(n => [n.id, []]));
  parentByChild.forEach((v, c) => children.get(v.p)?.push(c));
  children.forEach(arr => arr.sort((a, b) => sy(a) - sy(b)));

  const roots = nodes.filter(n => !parentByChild.has(n.id)).sort((a, b) => sy(a.id) - sy(b.id));
  const isolatedNodes: TreePlacementNode[] = [];
  const treeRoots: Array<{ hierarchy: any; size: number; dominantDy: string; rootName: string; earliestYear: number }> = [];
  roots.forEach(r => {
    const childList = children.get(r.id) || [];
    if (childList.length === 0) {
      isolatedNodes.push(r);
    } else {
      const h = (d3 as any).hierarchy(
        r,
        (d: TreePlacementNode) => (children.get(d.id) || []).map((id: string) => byId.get(id)).filter(Boolean)
      );
      const dyCounts: Record<string, number> = {};
      h.each((node: any) => {
        const dy = node.data.dy || 'unknown';
        dyCounts[dy] = (dyCounts[dy] || 0) + 1;
      });
      let dominantDy = 'unknown';
      let maxCount = 0;
      for (const [dy, cnt] of Object.entries(dyCounts)) {
        if (cnt > maxCount) { dominantDy = dy; maxCount = cnt; }
      }
      let earliest = 9999;
      h.each((node: any) => {
        const dd = node.data as TreePlacementNode;
        const reignStart = dd.re?.[0]?.[0];
        if (reignStart && reignStart < earliest) earliest = reignStart;
        if (dd.yb && dd.yb < earliest) earliest = dd.yb;
        if (dd.yd && dd.yd - 50 < earliest) earliest = dd.yd - 50;
      });
      treeRoots.push({
        hierarchy: h,
        size: h.descendants().length,
        dominantDy,
        rootName: r.label,
        earliestYear: earliest
      });
    }
  });

  const undatedTrees = treeRoots.filter(tr => tr.earliestYear >= 9000);
  if (undatedTrees.length) {
    const nodeYearCache = new Map<string, number>();
    nodes.forEach(n => {
      const y = nodeYear(n);
      if (y) nodeYearCache.set(n.id, y);
    });
    undatedTrees.forEach(tr => {
      const treeIds = new Set<string>();
      tr.hierarchy.each((node: any) => treeIds.add(node.data.id));
      let bestYear = 9999;
      links.forEach(l => {
        if (treeIds.has(l.s) && !treeIds.has(l.d) && nodeYearCache.has(l.d)) {
          bestYear = Math.min(bestYear, nodeYearCache.get(l.d)!);
        }
        if (treeIds.has(l.d) && !treeIds.has(l.s) && nodeYearCache.has(l.s)) {
          bestYear = Math.min(bestYear, nodeYearCache.get(l.s)!);
        }
      });
      if (bestYear < 9000) tr.earliestYear = bestYear;
    });
    const datedYears = treeRoots
      .filter(tr => tr.earliestYear < 9000)
      .map(tr => tr.earliestYear)
      .sort((a, b) => a - b);
    const median = datedYears.length ? datedYears[Math.floor(datedYears.length / 2)]! : 1400;
    treeRoots.forEach(tr => {
      if (tr.earliestYear >= 9000) tr.earliestYear = median;
    });
  }

  treeRoots.sort((a, b) => a.earliestYear - b.earliestYear || b.size - a.size);
  const earlySovereignIsolated = isolatedNodes
    .filter(n => (n.n || []).length > 0 && sy(n.id) < 9999)
    .sort((a, b) => sy(a.id) - sy(b.id));
  const undatedIsolated = isolatedNodes.filter(n => !((n.n || []).length > 0 && sy(n.id) < 9999));

  const placedTrees = treeRoots;
  const treeLayout = (d3 as any).tree()
    .nodeSize([dens.treeSiblingX, dens.treeDepthY])
    .separation((a: any, b: any) => {
      const wA = estimateNodeWidth(a.data, dens);
      const wB = estimateNodeWidth(b.data, dens);
      return Math.max(1, (wA / 2 + wB / 2 + 24) / dens.treeSiblingX);
    });

  if (placedTrees.length) {
    const treeDims: TreeDim[] = placedTrees.map(tr => {
      treeLayout(tr.hierarchy);
      const desc = tr.hierarchy.descendants();
      const minNodeX = (d3 as any).min(desc, (d: any) => d.x) ?? 0;
      const maxNodeX = (d3 as any).max(desc, (d: any) => d.x) ?? 0;
      let latestYear = tr.earliestYear;
      tr.hierarchy.each((node: any) => {
        const dd = node.data as TreePlacementNode;
        if (dd.re?.[0]?.[1] && dd.re[0][1] > latestYear) latestYear = dd.re[0][1];
        if (dd.re?.[0]?.[0] && dd.re[0][0] > latestYear) latestYear = dd.re[0][0];
        if (dd.yd && dd.yd > latestYear) latestYear = dd.yd;
        if (dd.yb && dd.yb + 50 > latestYear) latestYear = dd.yb + 50;
      });
      return {
        tr,
        desc,
        minNodeX,
        maxNodeX,
        width: (maxNodeX - minNodeX) + dens.treeSiblingX,
        earliestYear: tr.earliestYear,
        latestYear,
        isMajor: tr.size >= 5
      };
    });
    treeDims.sort((a, b) => a.earliestYear - b.earliestYear || b.tr.size - a.tr.size);

    const earlySovYears = earlySovereignIsolated.map(n => sy(n.id)).filter(y => y < 9999);
    const minYear = Math.min((d3 as any).min(treeDims, (d: any) => d.earliestYear) ?? 1100, (d3 as any).min(earlySovYears) ?? Infinity);
    const maxYear = Math.max((d3 as any).max(treeDims, (d: any) => d.latestYear) ?? 1968, (d3 as any).max(earlySovYears) ?? -Infinity);
    const tallestStructH = (d3 as any).max(treeDims, (d: any) => (d3 as any).max(d.desc, (n: any) => n.y) ?? 0) ?? 300;
    const tallestSpan = (d3 as any).max(treeDims, (d: any) => d.latestYear - d.earliestYear) || 100;
    const pxPerYear = Math.max(3, Math.min(6, tallestStructH / tallestSpan * 1.2));
    treeMinYear = minYear;
    treePxPerYear = pxPerYear;

    const minGap = dens.treeDepthY * 0.55;
    treeDims.forEach(td => {
      chronoPostProcess(td.tr.hierarchy, pxPerYear, td.earliestYear, dens.treeDepthY, minGap);
      td.height = (d3 as any).max(td.desc, (d: any) => d.chronoY) ?? 0;
    });

    const MAX_COLS = 3;
    const columns: Array<{ nextY: number; maxWidth: number }> = [];
    treeDims.forEach(td => {
      const idealY = yOffset + (td.earliestYear - minYear) * pxPerYear;
      let bestCol = -1;
      let bestGap = Infinity;
      for (let c = 0; c < columns.length; c += 1) {
        if (columns[c]!.nextY <= idealY) {
          const gap = idealY - columns[c]!.nextY;
          if (gap < bestGap) { bestGap = gap; bestCol = c; }
        }
      }
      if (bestCol === -1) {
        if (columns.length < MAX_COLS) {
          bestCol = columns.length;
          columns.push({ nextY: yOffset, maxWidth: 0 });
        } else {
          let minNext = Infinity;
          for (let c = 0; c < columns.length; c += 1) {
            if (columns[c]!.nextY < minNext) { minNext = columns[c]!.nextY; bestCol = c; }
          }
        }
      }
      const treeY = Math.max(idealY, columns[bestCol]!.nextY);
      td.assignedCol = bestCol;
      td.assignedY = treeY;
      columns[bestCol]!.nextY = treeY + (td.height || 0) + dens.treeSectionGap;
      columns[bestCol]!.maxWidth = Math.max(columns[bestCol]!.maxWidth, td.width);
    });

    treeDims.forEach(td => {
      let trueWidth = 0;
      td.desc.forEach((d: any) => {
        const nodeW = estimateNodeWidth(d.data, dens);
        const rightExtent = (d.x - td.minNodeX) + nodeW / 2;
        trueWidth = Math.max(trueWidth, rightExtent);
      });
      td.trueWidth = trueWidth;
    });
    const colTrueWidth = new Array(columns.length).fill(0) as number[];
    treeDims.forEach(td => {
      colTrueWidth[td.assignedCol!] = Math.max(colTrueWidth[td.assignedCol!]!, td.trueWidth || 0);
    });

    const colGap = 60;
    const colX: number[] = [];
    const earlySovColWidth = earlySovereignIsolated.length
      ? ((d3 as any).max(earlySovereignIsolated, (n: any) => estimateNodeWidth(n, dens)) ?? 0) + 40
      : 0;
    let cx = 80 + earlySovColWidth;
    for (let c = 0; c < columns.length; c += 1) {
      colX.push(cx);
      cx += (colTrueWidth[c] || 0) + colGap;
    }
    treeMaxColX = cx;

    treeDims.forEach(td => {
      const baseX = colX[td.assignedCol!]!;
      const baseY = td.assignedY!;
      td.desc.forEach((d: any) => {
        const px = d.x - td.minNodeX + baseX;
        const py = (d.chronoY ?? d.y) + baseY;
        pos.set(d.data.id, { x: px, y: py, depth: d.depth });
        depthMap.set(d.data.id, d.depth);
      });
      sections.push({
        y: baseY,
        dynasty: td.tr.dominantDy,
        label: td.tr.rootName || td.tr.dominantDy,
        count: td.tr.size
      });
    });
    yOffset = Math.max(...columns.map(c => c.nextY));
    void maxYear;
  }

  if (earlySovereignIsolated.length) {
    const earlyColX = 80;
    const minGapSov = 34;
    let prevSovY = -Infinity;
    sections.push({
      y: treeBaseY,
      dynasty: 'lunar',
      label: labels.earlySovereigns || 'Early Sovereigns',
      count: earlySovereignIsolated.length
    });
    earlySovereignIsolated.forEach(n => {
      const yr = sy(n.id);
      const idealY = yr < 9999 ? treeBaseY + (yr - treeMinYear) * treePxPerYear : treeBaseY;
      const nodeY = Math.max(idealY, prevSovY + minGapSov);
      const w = estimateNodeWidth(n, dens);
      pos.set(n.id, { x: earlyColX + w / 2, y: nodeY, depth: 0 });
      depthMap.set(n.id, 0);
      prevSovY = nodeY;
    });
  }

  const attachedIds = new Set<string>();
  const prio: Record<string, number> = { spouse: 4, parent: 3, sibling: 2, kin: 1 };

  const CELL = 50;
  const gridMap = new Map<string, Array<{ id: string; x: number; y: number; hw: number }>>();
  const gridKey = (x: number, y: number) => `${Math.floor(x / CELL)},${Math.floor(y / CELL)}`;
  const gridInsert = (id: string, x: number, y: number, hw: number) => {
    const key = gridKey(x, y);
    const arr = gridMap.get(key) ?? [];
    arr.push({ id, x, y, hw });
    gridMap.set(key, arr);
  };
  for (const [id, p] of pos) {
    const nd = byId.get(id);
    if (!nd) continue;
    gridInsert(id, p.x, p.y, estimateNodeWidth(nd, dens) / 2);
  }

  const hasCollision = (cx: number, cy: number, halfW: number, excludeId: string): boolean => {
    const margin = 8;
    const gx = Math.floor(cx / CELL);
    const gy = Math.floor(cy / CELL);
    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) {
        const cell = gridMap.get(`${gx + dx},${gy + dy}`);
        if (!cell) continue;
        for (const e of cell) {
          if (e.id === excludeId) continue;
          if (Math.abs(cx - e.x) < (halfW + e.hw + margin) && Math.abs(cy - e.y) < 28) return true;
        }
      }
    }
    return false;
  };

  const attachPass = (candidates: TreePlacementNode[]): number => {
    let attached = 0;
    candidates.forEach(n => {
      if (pos.has(n.id)) return;
      let bestPartner: string | null = null;
      let bestType: string | null = null;
      for (const l of links) {
        const partnerId = l.s === n.id ? l.d : l.d === n.id ? l.s : null;
        if (!partnerId || !pos.has(partnerId)) continue;
        const thisPrio = prio[l.t] || 0;
        if (!bestPartner || thisPrio > (prio[bestType || ''] || 0)) {
          bestPartner = partnerId;
          bestType = l.t;
        }
      }
      if (bestPartner && byId.get(bestPartner)) {
        const sp = pos.get(bestPartner)!;
        const pw = estimateNodeWidth(byId.get(bestPartner)!, dens);
        const nw = estimateNodeWidth(n, dens);
        const halfW = nw / 2;
        const candidatesPos = [
          { x: sp.x + pw / 2 + halfW + 16, y: sp.y },
          { x: sp.x, y: sp.y + 34 },
          { x: sp.x - pw / 2 - halfW - 16, y: sp.y },
          { x: sp.x + pw / 2 + halfW + 16, y: sp.y + 34 },
          { x: sp.x - pw / 2 - halfW - 16, y: sp.y + 34 }
        ];
        let placed = false;
        for (const c of candidatesPos) {
          if (hasCollision(c.x, c.y, halfW, n.id)) continue;
          pos.set(n.id, { x: c.x, y: c.y, depth: sp.depth });
          gridInsert(n.id, c.x, c.y, halfW);
          depthMap.set(n.id, 0);
          attachedIds.add(n.id);
          attached += 1;
          placed = true;
          break;
        }
        if (!placed) {
          let fy = sp.y + 34;
          while (hasCollision(sp.x, fy, halfW, n.id) && fy < sp.y + 200) fy += 34;
          pos.set(n.id, { x: sp.x, y: fy, depth: sp.depth });
          gridInsert(n.id, sp.x, fy, halfW);
          depthMap.set(n.id, 0);
          attachedIds.add(n.id);
          attached += 1;
        }
      }
    });
    return attached;
  };

  for (let pass = 0; pass < 3; pass += 1) {
    const remaining = undatedIsolated.filter(n => !pos.has(n.id));
    if (!remaining.length || !attachPass(remaining)) break;
  }

  const remainingIsolated = undatedIsolated.filter(n => !attachedIds.has(n.id));
  if (remainingIsolated.length) {
    remainingIsolated.sort((a, b) => (nodeYear(a) ?? 9999) - (nodeYear(b) ?? 9999));
    const unconnectedX = treeMaxColX + 40;
    let prevY = -Infinity;
    const minGapIso = 34;
    let rowX = unconnectedX;
    sections.push({
      y: treeBaseY,
      dynasty: null,
      label: labels.unconnected || 'Unconnected',
      count: remainingIsolated.length
    });
    remainingIsolated.forEach(n => {
      const yr = nodeYear(n);
      const idealY = yr ? treeBaseY + (yr - treeMinYear) * treePxPerYear : yOffset;
      const nodeY = Math.max(idealY, prevY + minGapIso);
      const w = estimateNodeWidth(n, dens);
      pos.set(n.id, { x: rowX + w / 2, y: nodeY, depth: 0 });
      depthMap.set(n.id, 0);
      prevY = nodeY;
      rowX = unconnectedX;
    });
    yOffset = Math.max(yOffset, prevY + 50);
  }

  return {
    pos: Array.from(pos.entries()),
    depthMap: Array.from(depthMap.entries()),
    sections,
    yOffset,
    treeMinYear,
    treePxPerYear,
    treeBaseY,
    treeMaxColX
  };
}

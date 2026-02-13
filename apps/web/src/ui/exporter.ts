import type { AppState, PersonNode, LinkDatum, EdgeRecord } from '../types/state.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SourceEntry {
  id: string;
  [key: string]: unknown;
}

interface SvgMarkup {
  xml: string;
  w: number;
  h: number;
}

// Module-level deps
let _state: AppState;
let _byId: Map<string, PersonNode> = new Map();
let _sourceById: Map<string, SourceEntry> = new Map();
let _getLang: () => string = () => 'en';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function linkIds(l: LinkDatum): { s: string; t: string } {
  return {
    s: typeof l.source === 'object' ? l.source.id : l.source,
    t: typeof l.target === 'object' ? l.target.id : l.target
  };
}

function todayStamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function triggerDownload(href: string, name: string): void {
  const a = document.createElement('a');
  a.href = href;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function seedIds(): string[] {
  if (_state.selId) return [_state.selId];
  if (_state.selEdge) {
    const { s, t } = linkIds(_state.selEdge);
    return [s, t].filter(Boolean);
  }
  return _state.nodes.map(n => n.id);
}

// ---------------------------------------------------------------------------
// Pure helpers (testable)
// ---------------------------------------------------------------------------

export function deriveSubtree(state: AppState): { ids: Set<string>; links: LinkDatum[] } {
  const seeds = state.selId
    ? [state.selId]
    : state.selEdge
      ? (() => { const { s, t } = linkIds(state.selEdge); return [s, t].filter(Boolean); })()
      : state.nodes.map(n => n.id);

  const parentOnly = state.viewMode === 'tree';
  const maxDepth = state.selId || state.selEdge ? (parentOnly ? 16 : 2) : 99;
  const links = state.links.filter(l => !parentOnly || l._e?.t === 'parent');
  const adj = new Map<string, string[]>(state.nodes.map(n => [n.id, []]));
  links.forEach(l => {
    const { s, t } = linkIds(l);
    if (!adj.has(s) || !adj.has(t)) return;
    adj.get(s)!.push(t);
    adj.get(t)!.push(s);
  });
  const keep = new Set<string>();
  const q: Array<{ id: string; d: number }> = [];
  seeds.forEach(id => {
    if (!adj.has(id) || keep.has(id)) return;
    keep.add(id);
    q.push({ id, d: 0 });
  });
  while (q.length) {
    const cur = q.shift()!;
    if (cur.d >= maxDepth) continue;
    (adj.get(cur.id) || []).forEach(nx => {
      if (keep.has(nx)) return;
      keep.add(nx);
      q.push({ id: nx, d: cur.d + 1 });
    });
  }
  if (!keep.size) state.nodes.forEach(n => keep.add(n.id));
  const outLinks = state.links.filter(l => {
    const { s, t } = linkIds(l);
    return keep.has(s) && keep.has(t);
  });
  return { ids: keep, links: outLinks };
}

function collectSourceRefsForPerson(p: PersonNode): Set<string> {
  const refs = new Set<string>(p.source_refs || []);
  (p.known_as || []).forEach(k => {
    if (k && typeof k === 'object' && 'source_refs' in k) {
      ((k as { source_refs?: string[] }).source_refs || []).forEach(r => refs.add(r));
    }
  });
  (p.offices_held || []).forEach(o => {
    ((o && o.source_refs) || []).forEach(r => refs.add(r));
  });
  if (p.royal_link && 'source_refs' in (p.royal_link as Record<string, unknown>)) {
    const rl = p.royal_link as unknown as { source_refs?: string[] };
    (rl.source_refs || []).forEach(r => refs.add(r));
  }
  return refs;
}

export function buildCitationBundle(
  state: AppState,
  byId: Map<string, PersonNode>,
  sourceById: Map<string, SourceEntry>,
  getLang: () => string
): Record<string, unknown> {
  const { ids, links } = deriveSubtree(state);
  const nodes = [...ids].map(id => byId.get(id)).filter((p): p is PersonNode => p !== undefined);
  const edgeRows = links.map(l => {
    const { s, t: tgt } = linkIds(l);
    return { ...(l._e || {}), s, d: tgt };
  });
  const refs = new Set<string>();
  nodes.forEach(p => {
    collectSourceRefsForPerson(p).forEach(r => refs.add(r));
  });
  edgeRows.forEach(e => ((e as EdgeRecord).evidence_refs || []).forEach(r => refs.add(r)));
  const sources = [...refs].map(id => sourceById.get(id)).filter((s): s is SourceEntry => s !== undefined);

  const selEdge = state.selEdge;
  return {
    exported_at: new Date().toISOString(),
    lang: getLang(),
    view_mode: state.viewMode,
    density: state.density,
    focus_mode: Boolean(state.focusMode),
    selection: state.selId
      ? { type: 'person', id: state.selId }
      : selEdge
        ? { type: 'edge', ...linkIds(selEdge), rel: selEdge._e?.t || 'kin' }
        : { type: 'none' },
    filters: {
      dynasty: (document.getElementById('df') as HTMLSelectElement | null)?.value || '__all__',
      tree: (document.getElementById('tf') as HTMLSelectElement | null)?.value || '__all__',
      source_grade: (document.getElementById('sqf') as HTMLSelectElement | null)?.value || '__all__',
      overlay: state.overlayMode
    },
    counts: {
      nodes: nodes.length,
      edges: edgeRows.length,
      sources: sources.length
    },
    nodes,
    edges: edgeRows,
    sources
  };
}

// ---------------------------------------------------------------------------
// SVG / Canvas export
// ---------------------------------------------------------------------------

function svgMarkupForExport(): SvgMarkup | null {
  const svg = document.getElementById('sv') as SVGSVGElement | null;
  if (!svg) return null;
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const w = svg.clientWidth || 1200;
  const h = svg.clientHeight || 780;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', String(w));
  clone.setAttribute('height', String(h));
  clone.setAttribute('viewBox', `0 0 ${w} ${h}`);
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('x', '0');
  bg.setAttribute('y', '0');
  bg.setAttribute('width', String(w));
  bg.setAttribute('height', String(h));
  bg.setAttribute('fill', getComputedStyle(document.documentElement).getPropertyValue('--bg') || '#1b1512');
  clone.insertBefore(bg, clone.firstChild);
  const xml = new XMLSerializer().serializeToString(clone);
  return { xml, w, h };
}

function renderSvgToCanvas(markup: SvgMarkup): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([markup.xml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = markup.w;
      canvas.height = markup.h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, markup.w, markup.h);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
    img.onerror = err => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

async function exportPng(): Promise<void> {
  const markup = svgMarkupForExport();
  if (!markup) return;
  const canvas = await renderSvgToCanvas(markup);
  const href = canvas.toDataURL('image/png');
  triggerDownload(href, `maldives-subtree-${todayStamp()}.png`);
}

function printPdfFallback(markup: SvgMarkup): void {
  const win = window.open('', '_blank', 'noopener,noreferrer,width=980,height=760');
  if (!win) return;
  const body = `
    <!doctype html>
    <html><head><meta charset="utf-8"/><title>Maldives Genealogy Export</title>
    <style>body{margin:0;background:#111;padding:12px}svg{width:100%;height:auto;background:#111}</style>
    </head><body>${markup.xml}
    <script>window.onload=()=>{setTimeout(()=>window.print(),120)};</script>
    </body></html>`;
  win.document.open();
  win.document.write(body);
  win.document.close();
}

async function exportPdf(): Promise<void> {
  const markup = svgMarkupForExport();
  if (!markup) return;
  try {
    const [jsPdfModule, canvas] = await Promise.all([
      import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm' as string) as Promise<{ jsPDF: new (opts: Record<string, unknown>) => { internal: { pageSize: { getWidth(): number; getHeight(): number } }; addImage: (...args: unknown[]) => void; save: (name: string) => void } }>,
      renderSvgToCanvas(markup)
    ]);
    const { jsPDF } = jsPdfModule;
    const img = canvas.toDataURL('image/png');
    const landscape = markup.w > markup.h;
    const doc = new jsPDF({
      orientation: landscape ? 'landscape' : 'portrait',
      unit: 'pt',
      format: 'a4'
    });
    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();
    const ratio = Math.min((pw - 48) / markup.w, (ph - 48) / markup.h);
    const rw = markup.w * ratio;
    const rh = markup.h * ratio;
    const x = (pw - rw) / 2;
    const y = (ph - rh) / 2;
    doc.addImage(img, 'PNG', x, y, rw, rh, undefined, 'FAST');
    doc.save(`maldives-subtree-${todayStamp()}.pdf`);
  } catch {
    printPdfFallback(markup);
  }
}

function exportJsonBundle(): void {
  const payload = buildCitationBundle(_state, _byId, _sourceById, _getLang);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, `maldives-subtree-citations-${todayStamp()}.json`);
  setTimeout(() => URL.revokeObjectURL(url), 400);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface ExporterDeps {
  state: AppState;
  byId: Map<string, PersonNode>;
  sourceById: Map<string, SourceEntry>;
  getLang: () => string;
}

export function initExporter(deps: ExporterDeps): void {
  _state = deps.state;
  _byId = deps.byId;
  _sourceById = deps.sourceById;
  _getLang = deps.getLang;

  const sel = document.getElementById('exf') as HTMLSelectElement | null;
  if (!sel) return;
  sel.addEventListener('change', async () => {
    const v = sel.value;
    sel.value = '';
    if (!v) return;
    if (v === 'png') {
      await exportPng();
      return;
    }
    if (v === 'pdf') {
      await exportPdf();
      return;
    }
    if (v === 'json') {
      exportJsonBundle();
    }
  });
}

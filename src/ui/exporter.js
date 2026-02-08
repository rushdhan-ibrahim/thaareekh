import state from '../state.js';
import { byId } from '../data/sovereigns.merge.js';
import { sourceById } from '../data/sources.js';
import { getLang } from './i18n.js';

function linkIds(l) {
  return {
    s: typeof l.source === 'object' ? l.source.id : l.source,
    t: typeof l.target === 'object' ? l.target.id : l.target
  };
}

function todayStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function triggerDownload(href, name) {
  const a = document.createElement('a');
  a.href = href;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function seedIds() {
  if (state.selId) return [state.selId];
  if (state.selEdge) {
    const { s, t } = linkIds(state.selEdge);
    return [s, t].filter(Boolean);
  }
  return state.nodes.map(n => n.id);
}

function deriveSubtree() {
  const seeds = seedIds();
  const parentOnly = state.viewMode === 'tree';
  const maxDepth = state.selId || state.selEdge ? (parentOnly ? 16 : 2) : 99;
  const links = state.links.filter(l => !parentOnly || l._e?.t === 'parent');
  const adj = new Map(state.nodes.map(n => [n.id, []]));
  links.forEach(l => {
    const { s, t } = linkIds(l);
    if (!adj.has(s) || !adj.has(t)) return;
    adj.get(s).push(t);
    adj.get(t).push(s);
  });
  const keep = new Set();
  const q = [];
  seeds.forEach(id => {
    if (!adj.has(id) || keep.has(id)) return;
    keep.add(id);
    q.push({ id, d: 0 });
  });
  while (q.length) {
    const cur = q.shift();
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

function collectSourceRefsForPerson(p) {
  const refs = new Set(p.source_refs || []);
  (p.known_as || []).forEach(k => ((k && k.source_refs) || []).forEach(r => refs.add(r)));
  (p.offices_held || []).forEach(o => ((o && o.source_refs) || []).forEach(r => refs.add(r)));
  (p.royal_link?.source_refs || []).forEach(r => refs.add(r));
  return refs;
}

function buildCitationBundle() {
  const { ids, links } = deriveSubtree();
  const nodes = [...ids].map(id => byId.get(id)).filter(Boolean);
  const edgeRows = links.map(l => {
    const { s, t } = linkIds(l);
    return { s, d: t, ...(l._e || {}) };
  });
  const refs = new Set();
  nodes.forEach(p => {
    collectSourceRefsForPerson(p).forEach(r => refs.add(r));
  });
  edgeRows.forEach(e => (e.evidence_refs || []).forEach(r => refs.add(r)));
  const sources = [...refs].map(id => sourceById.get(id)).filter(Boolean);
  return {
    exported_at: new Date().toISOString(),
    lang: getLang(),
    view_mode: state.viewMode,
    density: state.density,
    focus_mode: Boolean(state.focusMode),
    selection: state.selId
      ? { type: 'person', id: state.selId }
      : state.selEdge
        ? { type: 'edge', ...linkIds(state.selEdge), rel: state.selEdge?._e?.t || 'kin' }
        : { type: 'none' },
    filters: {
      dynasty: document.getElementById('df')?.value || '__all__',
      tree: document.getElementById('tf')?.value || '__all__',
      source_grade: document.getElementById('sqf')?.value || '__all__',
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

function svgMarkupForExport() {
  const svg = document.getElementById('sv');
  if (!svg) return null;
  const clone = svg.cloneNode(true);
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

function renderSvgToCanvas(markup) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([markup.xml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = markup.w;
      canvas.height = markup.h;
      const ctx = canvas.getContext('2d');
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

async function exportPng() {
  const markup = svgMarkupForExport();
  if (!markup) return;
  const canvas = await renderSvgToCanvas(markup);
  const href = canvas.toDataURL('image/png');
  triggerDownload(href, `maldives-subtree-${todayStamp()}.png`);
}

function printPdfFallback(markup) {
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

async function exportPdf() {
  const markup = svgMarkupForExport();
  if (!markup) return;
  try {
    const [{ jsPDF }, canvas] = await Promise.all([
      import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm'),
      renderSvgToCanvas(markup)
    ]);
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

function exportJsonBundle() {
  const payload = buildCitationBundle();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, `maldives-subtree-citations-${todayStamp()}.json`);
  setTimeout(() => URL.revokeObjectURL(url), 400);
}

export function initExporter() {
  const sel = document.getElementById('exf');
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

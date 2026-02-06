import { byId } from '../data/sovereigns.merge.js';
import { sourceById } from '../data/sources.js';
import { fR, esc } from '../utils/format.js';
import { gNb, parOf, chOf } from '../graph/relationships.js';
import { oS } from './modal.js';

export function rlH(title, items) {
  if (!items.length) return "";
  return `<div class="sl">${esc(title)}</div><ul class="rl">${items.map(it => {
    const p = byId.get(it.id);
    if (!p) return "";
    const tag = it.c && it.c !== "c" ? `<span class="rt ${it.c === "i" ? "rt-i" : "rt-u"}">${it.c === "i" ? "inferred" : "uncertain"}</span>` : "";
    const srcMeta = it.srcCount ? ` \u00b7 ${it.srcCount} source${it.srcCount > 1 ? "s" : ""}${it.cg ? " \u00b7 grade " + it.cg : ""}` : "";
    return `<li class="ri"><div class="rlf"><div class="rn">${p.g === "F" ? "\u2640 " : ""}${esc(p.nm)} ${tag}</div><div class="rs">${esc(fR(p.re))} \u00b7 ${esc(p.dy || "?")} \u00b7 ${p.n.map(x => "#" + x).join(", ")}${srcMeta}</div></div><button class="gb" onclick="goF('${p.id}')">Go</button></li>`;
  }).join("")}</ul>`;
}

function srcH(refs) {
  if (!refs || !refs.length) return '<div class="nt" style="color:var(--tx3)">No sources attached.</div>';
  const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
  const archiveLink = `<div class="nt" style="margin:4px 0 8px;color:var(--tx3)">Local archive: <a href="docs/offline-research-archive.json" target="_blank" rel="noopener noreferrer">docs/offline-research-archive.json</a>${offline ? ' \u00b7 external links may be unavailable offline' : ''}</div>`;
  const rows = refs.map(id => {
    const s = sourceById.get(id);
    if (!s) return "";
    const title = esc(s.title || s.url);
    const linkHtml = offline
      ? `<span>${title}</span>`
      : `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${title}</a>`;
    const note = s.notes ? `<div class="rs">${esc(s.notes)}</div>` : "";
    return `<li class="ri"><div class="rlf"><div class="rn">${linkHtml} <span class="rt">${esc(s.quality || "?")}</span> <span class="rt">${esc(s.id)}</span></div><div class="rs">${esc(s.publisher || "")}${s.access_date ? " \u00b7 " + esc(s.access_date) : ""}</div>${note}</div></li>`;
  }).join("");
  if (!rows) return '<div class="nt" style="color:var(--tx3)">No sources attached.</div>';
  return `<div class="sl">Evidence</div>${archiveLink}<ul class="rl">${rows}</ul>`;
}

function estLife(p) {
  const yrs = (p.re || []).flat();
  const from = yrs.length ? Math.min(...yrs) : null;
  const to = yrs.length ? Math.max(...yrs) : null;
  const yb = p.yb ?? (from != null ? from - 30 : null);
  const yd = p.yd ?? (to != null ? to + 10 : null);
  return {
    yb, yd,
    ybEst: p.yb == null && yb != null,
    ydEst: p.yd == null && yd != null
  };
}

function uniq(arr) {
  return [...new Set((arr || []).filter(Boolean))];
}

function profileCard(p) {
  const life = estLife(p);
  const names = uniq([p.nm, p.rg, ...(p.regnal_names || []), ...(p.aliases || [])]);
  const facts = p.facts?.length ? p.facts : (p.no ? [p.no] : []);
  const birthPlace = p.pb || "Unknown";
  const deathPlace = p.pd || "Unknown";
  const lifeText = `${life.yb != null ? life.yb : "Unknown"}${life.ybEst ? " (est.)" : ""} \u2192 ${life.yd != null ? life.yd : "Unknown"}${life.ydEst ? " (est.)" : ""}`;
  return `
    <section class="pc">
      <div class="pch">
        <div class="pcn">${p.g === "F" ? "\u2640 " : ""}${esc(p.nm)}</div>
        <div class="pcd">${esc(p.dy || "Unknown Dynasty")}</div>
      </div>
      <div class="pcg">
        <div class="pcl"><span>Reign</span><b>${esc(fR(p.re || [])) || "Unknown"}</b></div>
        <div class="pcl"><span>Life</span><b>${esc(lifeText)}</b></div>
        <div class="pcl"><span>Born</span><b>${esc(birthPlace)}</b></div>
        <div class="pcl"><span>Died</span><b>${esc(deathPlace)}</b></div>
      </div>
      <div class="pcs">
        <div class="sl">Known Names</div>
        <div class="pnl">${names.length ? names.map(n => `<span class="pn">${esc(n)}</span>`).join("") : '<span class="pn">Unknown</span>'}</div>
      </div>
      ${p.titles?.length ? `<div class="pcs"><div class="sl">Titles</div><div class="pnl">${p.titles.map(t => `<span class="pn">${esc(t)}</span>`).join("")}</div></div>` : ""}
      ${facts.length ? `<div class="pcs"><div class="sl">Interesting Facts</div><ul class="pfl">${facts.slice(0, 4).map(f => `<li>${esc(f)}</li>`).join("")}</ul></div>` : ""}
    </section>
  `;
}

export function showD(id) {
  const p = byId.get(id);
  if (!p) return;
  const dyC = `var(--dy-${(p.dy || "unknown").toLowerCase()})`;
  let m = `<span class="bg"><span class="bdd" style="background:${dyC}"></span>${esc(p.dy || "Unknown")}</span>`;
  m += `<span class="bg">${esc(fR(p.re))}</span><span class="bg">${p.n.map(x => "#" + x).join(", ")}</span>`;
  if (p.g === "F") m += `<span class="bg">\u2640</span>`;
  if (p.regnal_names?.length) m += `<span class="bg">Regnal ${esc(p.regnal_names[0])}</span>`;
  const card = profileCard(p);
  const evi = srcH(p.source_refs || []);
  const rels = rlH("Parents", parOf(id)) + rlH("Children", chOf(id)) + rlH("Siblings", gNb(id, "sibling")) + rlH("Spouses", gNb(id, "spouse")) + rlH("Other Kin", gNb(id, "kin"));
  document.getElementById("sT").textContent = (p.g === "F" ? "\u2640 " : "") + p.nm;
  document.getElementById("sT").classList.remove("emp");
  document.getElementById("sM").innerHTML = m;
  document.getElementById("sN").innerHTML = `${card}${evi}`;
  document.getElementById("sR").innerHTML = rels || '<div class="nt" style="color:var(--tx3)">No connections.</div>';
  if (window.innerWidth <= 1024) {
    document.getElementById("bT").textContent = (p.g === "F" ? "\u2640 " : "") + p.nm;
    document.getElementById("bB").innerHTML = `<div class="mr">${m}</div>${card}${evi}<div class="dv"></div>${rels}`;
    oS();
  }
}

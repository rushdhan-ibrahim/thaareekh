/**
 * Manuscript marginalia — pure helpers for the profile folio.
 * No DOM access; mirror of apps/web/src/ui/marginalia.ts.
 */

/** Normalize a reign field (`[s,e]` or `[[s,e],...]`) into pairs. */
export function normalizeReigns(re) {
  if (!Array.isArray(re) || re.length === 0) return [];
  if (typeof re[0] === 'number') {
    const s = Number(re[0]);
    const e = Number(re[1] ?? re[0]);
    return Number.isFinite(s) ? [[s, Number.isFinite(e) ? e : s]] : [];
  }
  const out = [];
  for (const seg of re) {
    if (!Array.isArray(seg) || seg.length === 0) continue;
    const s = Number(seg[0]);
    const e = Number(seg[1] ?? seg[0]);
    if (Number.isFinite(s)) out.push([s, Number.isFinite(e) ? e : s]);
  }
  return out;
}

/** Inked tally marks: groups of five, capped with a "+" beyond 25. */
export function tallyMarks(n) {
  const count = Math.max(0, Math.floor(Number(n) || 0));
  if (count === 0) return '';
  const capped = Math.min(count, 25);
  const groups = [];
  let left = capped;
  while (left > 0) {
    const g = Math.min(5, left);
    groups.push(`<i class="${g === 5 ? 'tg tg5' : 'tg'}">${'❘'.repeat(g)}</i>`);
    left -= g;
  }
  const more = count > 25 ? '<i class="tg tgmore">+</i>' : '';
  return `<span class="tally" aria-label="${count} sources">${groups.join('')}${more}</span>`;
}

/** Wax-seal stamp for an evidence grade (A/B/C/D); unknown grades get a blank seal. */
export function sealHtml(grade) {
  const g = String(grade ?? '').trim().toUpperCase();
  const known = g === 'A' || g === 'B' || g === 'C' || g === 'D';
  const cls = known ? `wax-${g.toLowerCase()}` : 'wax-x';
  const label = known ? `Evidence grade ${g}` : 'Ungraded evidence';
  return `<span class="wax-seal ${cls}" role="img" aria-label="${label}" title="${label}">${known ? g : '·'}</span>`;
}

/**
 * Reign-arc sparkline: a life span set against the full chronicle
 * (1117–1968 by default), reign segments emphasized. Returns an SVG string.
 */
export function reignArcSvg(p, minY = 1117, maxY = 1968, w = 64, h = 12) {
  const span = Math.max(1, maxY - minY);
  const x = year =>
    Math.round(((Math.min(Math.max(year, minY), maxY) - minY) / span) * (w - 2) * 10) / 10 + 1;
  const reigns = normalizeReigns(p.re);
  const yb = Number.isFinite(Number(p.yb)) ? Number(p.yb) : (reigns.length ? reigns[0][0] : null);
  const ydRaw = Number.isFinite(Number(p.yd)) ? Number(p.yd) : (reigns.length ? reigns[reigns.length - 1][1] : null);
  if (yb == null && ydRaw == null && reigns.length === 0) return '';
  const yd = ydRaw == null ? yb : ydRaw;
  const yLife = h - 3;
  const yReign = 3;
  const parts = [];
  parts.push(`<line class="ra-rule" x1="1" y1="${yLife}" x2="${w - 1}" y2="${yLife}"/>`);
  if (yb != null) {
    parts.push(`<line class="ra-life" x1="${x(yb)}" y1="${yLife}" x2="${x(yd)}" y2="${yLife}"/>`);
    parts.push(`<circle class="ra-dot" cx="${x(yb)}" cy="${yLife}" r="1.4"/>`);
    parts.push(`<circle class="ra-dot" cx="${x(yd)}" cy="${yLife}" r="1.4"/>`);
  }
  for (const [s, e] of reigns) {
    const x1 = x(s);
    const x2 = Math.max(x(e), x1 + 1.5);
    parts.push(`<rect class="ra-reign" x="${x1}" y="${yReign}" width="${Math.round((x2 - x1) * 10) / 10}" height="3" rx="1.5"/>`);
  }
  return `<svg class="reign-arc" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true">${parts.join('')}</svg>`;
}

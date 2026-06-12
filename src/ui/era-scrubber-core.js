/**
 * Era scrubber core — pure chronology math for the illuminated timeline.
 * Mirror of apps/web/src/ui/era-scrubber-core.ts.
 */
import { normalizeReigns } from './marginalia.js';

/** Visual dynasty bands (matches the orrery's reckoning, closed by a modern band). */
export const DYNASTY_BANDS = [
  { key: 'lunar', start: 1117, end: 1388 },
  { key: 'hilaaly', start: 1388, end: 1573 },
  { key: 'utheemu', start: 1573, end: 1692 },
  { key: 'dhiyamigili', start: 1692, end: 1759 },
  { key: 'huraagey', start: 1759, end: 1968 },
  { key: 'modern', start: 1968, end: 2026 }
];

/** Clamp a value into [0, 1]. */
export function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** Scrub progress of a year across [minY, maxY]. */
export function scrubProgress(year, minY, maxY) {
  const span = Math.max(1, maxY - minY);
  return clamp01((year - minY) / span);
}

/** Percent stops for dynasty bands across the scrubber track. */
export function dynastyBandStops(minY, maxY, bands = DYNASTY_BANDS) {
  const out = [];
  for (const b of bands) {
    const from = clamp01(scrubProgress(Math.max(b.start, minY), minY, maxY));
    const to = clamp01(scrubProgress(Math.min(b.end, maxY), minY, maxY));
    if (to <= from) continue;
    out.push({
      key: b.key,
      fromPct: Math.round(from * 1000) / 10,
      toPct: Math.round(to * 1000) / 10
    });
  }
  return out;
}

/** People whose reign covers the given year (sovereigns first by ordinal presence). */
export function reigningAt(year, people) {
  const out = [];
  for (const p of people) {
    const reigns = normalizeReigns(p.re);
    for (const [s, e] of reigns) {
      if (year >= s && year <= e) {
        out.push(p);
        break;
      }
    }
  }
  out.sort((a, b) => {
    const an = Array.isArray(a.n) && a.n.length ? 0 : 1;
    const bn = Array.isArray(b.n) && b.n.length ? 0 : 1;
    return an - bn || String(a.id).localeCompare(String(b.id));
  });
  return out;
}

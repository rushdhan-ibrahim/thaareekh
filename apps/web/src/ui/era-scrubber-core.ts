/**
 * Era scrubber core — pure chronology math for the illuminated timeline.
 * No DOM access; parity-tested against the JS mirror.
 */
import { normalizeReigns } from './marginalia.ts';

export interface DynastyBand {
  key: string;
  start: number;
  end: number;
}

/** Visual dynasty bands (matches the orrery's reckoning, closed by a modern band). */
export const DYNASTY_BANDS: DynastyBand[] = [
  { key: 'lunar', start: 1117, end: 1388 },
  { key: 'hilaaly', start: 1388, end: 1573 },
  { key: 'utheemu', start: 1573, end: 1692 },
  { key: 'dhiyamigili', start: 1692, end: 1759 },
  { key: 'huraagey', start: 1759, end: 1968 },
  { key: 'modern', start: 1968, end: 2026 }
];

export interface BandStop {
  key: string;
  fromPct: number;
  toPct: number;
}

/** Clamp a value into [0, 1]. */
export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** Scrub progress of a year across [minY, maxY]. */
export function scrubProgress(year: number, minY: number, maxY: number): number {
  const span = Math.max(1, maxY - minY);
  return clamp01((year - minY) / span);
}

/** Percent stops for dynasty bands across the scrubber track. */
export function dynastyBandStops(
  minY: number,
  maxY: number,
  bands: DynastyBand[] = DYNASTY_BANDS
): BandStop[] {
  const out: BandStop[] = [];
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

export interface ReigningPerson {
  id: string;
  nm?: string;
  n?: unknown[];
  re?: unknown;
}

/** People whose reign covers the given year (sovereigns first by ordinal presence). */
export function reigningAt<T extends ReigningPerson>(year: number, people: T[]): T[] {
  const out: T[] = [];
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

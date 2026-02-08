import { people } from './sovereigns.merge.js';

function knownYears(p) {
  return (p.re || []).flat().filter(Number.isFinite);
}

export function personSpan(p) {
  const yrs = knownYears(p);
  const reStart = yrs.length ? Math.min(...yrs) : null;
  const reEnd = yrs.length ? Math.max(...yrs) : null;
  const start = Number.isFinite(p.yb) ? p.yb : (reStart != null ? reStart - 30 : null);
  const end = Number.isFinite(p.yd) ? p.yd : (reEnd != null ? reEnd + 10 : null);
  return {
    start,
    end
  };
}

const spanById = new Map(people.map(p => [p.id, personSpan(p)]));

export function spanForId(id) {
  return spanById.get(id) || null;
}

export function activeInYearById(id, year) {
  const span = spanById.get(id);
  if (!span) return false;
  if (!Number.isFinite(year)) return true;
  if (span.start != null && year < span.start) return false;
  if (span.end != null && year > span.end) return false;
  return true;
}

export function timelineExtent() {
  let min = Infinity;
  let max = -Infinity;
  spanById.forEach(span => {
    if (span.start != null) min = Math.min(min, span.start);
    if (span.end != null) max = Math.max(max, span.end);
  });
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { min: 1000, max: 2026 };
  }
  return { min, max };
}

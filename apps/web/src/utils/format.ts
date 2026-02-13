/** Format reign spans [[start, end], ...] → "start–end; start–end". */
export function fR(r: Array<[number, number?]> | undefined | null): string {
  if (!r) return '';
  return r.map(x => x[0] + '\u2013' + (x[1] ?? '?')).join('; ');
}

const ESC_MAP: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };

/** Escape HTML special characters. */
export function esc(s: string | undefined | null): string {
  return (s ?? '').replace(/[&<>"]/g, c => ESC_MAP[c] ?? c);
}

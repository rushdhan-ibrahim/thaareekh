/** Read a CSS custom property value from :root. */
export function cs(v: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(v).trim();
}

/** Edge color by confidence/type. */
export function eC(e: { c?: string; t?: string }): string {
  if (e.c === 'i') return cs('--ei');
  if (e.c === 'u') return cs('--eu');
  const map: Record<string, string> = { parent: '--ep', sibling: '--es', spouse: '--esp', kin: '--ek' };
  return cs(map[e.t ?? ''] ?? '--ep');
}

/** Node color by dynasty. */
export function nC(dy: string | undefined): string {
  return cs('--dy-' + (dy ?? 'unknown').toLowerCase()) || cs('--dy-unknown');
}

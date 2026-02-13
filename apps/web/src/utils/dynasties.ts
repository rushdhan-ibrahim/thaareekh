import type { PersonNode } from '../types/state';

/** Sorted unique dynasty names from the people dataset. */
export function buildDynastySet(people: PersonNode[]): string[] {
  return [...new Set(people.map(p => p.dy ?? 'Unknown'))].sort();
}

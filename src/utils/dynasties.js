import { people } from '../data/sovereigns.merge.js';

export const dyS = [...new Set(people.map(p => p.dy || "Unknown"))].sort();

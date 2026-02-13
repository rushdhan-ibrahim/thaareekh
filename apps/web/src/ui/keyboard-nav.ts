import type { AppState, LinkDatum } from '../types/state.js';

// ---------------------------------------------------------------------------
// Pure helpers (testable)
// ---------------------------------------------------------------------------

function linkIds(l: LinkDatum): { s: string; t: string } {
  return {
    s: typeof l.source === 'object' ? l.source.id : l.source,
    t: typeof l.target === 'object' ? l.target.id : l.target
  };
}

function connectedIds(id: string, links: LinkDatum[]): string[] {
  const ids = new Set<string>();
  links.forEach(l => {
    const { s, t } = linkIds(l);
    if (s === id) ids.add(t);
    if (t === id) ids.add(s);
  });
  return [...ids];
}

export type Direction = 'left' | 'right' | 'up' | 'down';

export function directionScore(
  from: { x: number; y: number },
  to: { x: number; y: number },
  dir: Direction
): number {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 1) return -Infinity;
  switch (dir) {
    case 'left': return -dx / dist - Math.abs(dy / dist) * 0.5;
    case 'right': return dx / dist - Math.abs(dy / dist) * 0.5;
    case 'up': return -dy / dist - Math.abs(dx / dist) * 0.5;
    case 'down': return dy / dist - Math.abs(dx / dist) * 0.5;
    default: return 0;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface KeyboardNavDeps {
  state: AppState;
  showD: (id: string) => void;
  hiN: (id: string) => void;
  fitToContent?: () => void;
}

export function initKeyboardNav(deps: KeyboardNavDeps): void {
  const { state, showD, hiN, fitToContent } = deps;
  const svg = document.getElementById('sv');
  if (!svg) return;

  let tabIdx = 0;
  let tabNeighbors: string[] = [];

  function nodeById(id: string): (typeof state.nodes)[number] | undefined {
    return state.nodes.find(n => n.id === id);
  }

  function selectNode(id: string): void {
    state.selId = id;
    state.selEdge = null;
    showD(id);
    hiN(id);
  }

  svg.addEventListener('keydown', e => {
    if (!state.selId) return;
    const current = nodeById(state.selId);
    if (!current) return;

    const dirMap: Record<string, Direction> = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowUp: 'up',
      ArrowDown: 'down'
    };

    const dir = dirMap[e.key];
    if (dir) {
      e.preventDefault();
      const neighbors = connectedIds(state.selId, state.links);
      let best: string | null = null;
      let bestScore = -Infinity;
      neighbors.forEach(id => {
        const n = nodeById(id);
        if (!n) return;
        const s = directionScore(
          current as unknown as { x: number; y: number },
          n as unknown as { x: number; y: number },
          dir
        );
        if (s > bestScore) { bestScore = s; best = id; }
      });
      if (best) selectNode(best);
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const neighbors = connectedIds(state.selId, state.links);
      if (!neighbors.length) return;
      if (tabNeighbors.length === 0 || tabNeighbors[0] !== neighbors[0]) {
        tabNeighbors = neighbors;
        tabIdx = 0;
      } else {
        tabIdx = (tabIdx + (e.shiftKey ? -1 : 1) + tabNeighbors.length) % tabNeighbors.length;
      }
      selectNode(tabNeighbors[tabIdx]!);
      return;
    }

    if (e.key === 'Home') {
      e.preventDefault();
      if (typeof fitToContent === 'function') fitToContent();
    }
  });
}

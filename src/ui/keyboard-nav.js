/**
 * Keyboard graph navigation.
 * Arrow keys select nearest connected neighbor in that direction.
 * Tab cycles through connected nodes. Home fits graph.
 */
import state from '../state.js';
import { hiN } from '../graph/highlight.js';
import { showD } from './sidebar.js';

function linkIds(l) {
  return {
    s: typeof l.source === 'object' ? l.source.id : l.source,
    t: typeof l.target === 'object' ? l.target.id : l.target
  };
}

function connectedIds(id) {
  const ids = new Set();
  state.links.forEach(l => {
    const { s, t } = linkIds(l);
    if (s === id) ids.add(t);
    if (t === id) ids.add(s);
  });
  return [...ids];
}

function nodeById(id) {
  return state.nodes.find(n => n.id === id);
}

function selectNode(id) {
  state.selId = id;
  state.selEdge = null;
  showD(id);
  hiN(id);
}

function directionScore(from, to, dir) {
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

export function initKeyboardNav(fitToContent) {
  const svg = document.getElementById('sv');
  if (!svg) return;

  let tabIdx = 0;
  let tabNeighbors = [];

  svg.addEventListener('keydown', e => {
    if (!state.selId) return;
    const current = nodeById(state.selId);
    if (!current) return;

    const dirMap = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowUp: 'up',
      ArrowDown: 'down'
    };

    const dir = dirMap[e.key];
    if (dir) {
      e.preventDefault();
      const neighbors = connectedIds(state.selId);
      let best = null;
      let bestScore = -Infinity;
      neighbors.forEach(id => {
        const n = nodeById(id);
        if (!n) return;
        const s = directionScore(current, n, dir);
        if (s > bestScore) { bestScore = s; best = id; }
      });
      if (best) selectNode(best);
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const neighbors = connectedIds(state.selId);
      if (!neighbors.length) return;
      // Reset tab list if selection changed
      if (tabNeighbors.length === 0 || tabNeighbors[0] !== neighbors[0]) {
        tabNeighbors = neighbors;
        tabIdx = 0;
      } else {
        tabIdx = (tabIdx + (e.shiftKey ? -1 : 1) + tabNeighbors.length) % tabNeighbors.length;
      }
      selectNode(tabNeighbors[tabIdx]);
      return;
    }

    if (e.key === 'Home') {
      e.preventDefault();
      if (typeof fitToContent === 'function') fitToContent();
    }
  });
}

import * as d3 from 'd3';
import state from '../state.js';
import { showD } from './sidebar.js';
import { hiN } from '../graph/highlight.js';
import { cS } from './modal.js';

export function goF(id) {
  cS();
  state.selId = id;
  const n = state.nodes.find(x => x.id === id);
  if (n) {
    const t = d3.zoomIdentity.translate(state.W / 2 - n.x * 1.2, state.H / 2 - n.y * 1.2).scale(1.2);
    state.svgEl.transition().duration(400).call(state.zoomBehavior.transform, t);
  }
  showD(id);
  hiN(id);
}

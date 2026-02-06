import state from '../state.js';

export function hiN(id) {
  const cn = new Set([id]);
  state.links.forEach(l => {
    const s = typeof l.source === "object" ? l.source.id : l.source;
    const t = typeof l.target === "object" ? l.target.id : l.target;
    if (s === id) cn.add(t);
    if (t === id) cn.add(s);
  });
  state.gN.select("rect").attr("opacity", d => cn.has(d.id) ? 1 : .15);
  state.gN.select("text").attr("opacity", d => cn.has(d.id) ? 1 : .15);
  state.gL.attr("stroke-opacity", d => {
    const s = typeof d.source === "object" ? d.source.id : d.source;
    const t = typeof d.target === "object" ? d.target.id : d.target;
    return (s === id || t === id) ? 1 : .06;
  });
}

export function clH() {
  state.gN?.select("rect").attr("opacity", 1);
  state.gN?.select("text").attr("opacity", 1);
  state.gL?.attr("stroke-opacity", .8);
}

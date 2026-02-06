import * as d3 from 'd3';
import state from './state.js';
import { people, edges, mode } from './data/sovereigns.merge.js';
import { dyS } from './utils/dynasties.js';
import { rebuild } from './graph/rebuild.js';
import { clH } from './graph/highlight.js';
import { cS } from './ui/modal.js';
import { goF } from './ui/navigation.js';
import { initSearch } from './ui/search.js';
import { initTheme } from './ui/theme.js';

// Expose goF globally for inline onclick handlers in sidebar HTML
window.goF = goF;

// Initialize zoom behavior
state.zoomBehavior = d3.zoom().scaleExtent([0.12, 4]).on("zoom", e => {
  state.tr = e.transform;
  d3.select(".gg").attr("transform", e.transform);
});

// Theme toggle
initTheme();

// Bottom sheet close buttons
document.getElementById("bX").addEventListener("click", cS);
document.getElementById("ov").addEventListener("click", cS);

// Search
initSearch();

// Edge type chip toggles
document.querySelectorAll(".chip[data-e]").forEach(c => c.addEventListener("click", () => {
  c.classList.toggle("on"); state.tr = d3.zoomIdentity; rebuild();
}));

// Confidence chip toggles
document.querySelectorAll(".chip[data-cf]").forEach(c => c.addEventListener("click", () => {
  c.classList.toggle("on"); state.tr = d3.zoomIdentity; rebuild();
}));

// Dynasty filter
document.getElementById("df").addEventListener("change", () => { state.tr = d3.zoomIdentity; rebuild(); });

// Tree filter
document.getElementById("tf").addEventListener("change", () => { state.tr = d3.zoomIdentity; rebuild(); });

// Source quality filter
document.getElementById("sqf").addEventListener("change", () => { state.tr = d3.zoomIdentity; rebuild(); });

// View mode toggles
document.getElementById("vmg").addEventListener("click", () => {
  state.viewMode = "graph";
  document.getElementById("vmg").classList.add("on");
  document.getElementById("vmt").classList.remove("on");
  state.tr = d3.zoomIdentity;
  rebuild();
});
document.getElementById("vmt").addEventListener("click", () => {
  state.viewMode = "tree";
  document.getElementById("vmt").classList.add("on");
  document.getElementById("vmg").classList.remove("on");
  const parentChip = document.querySelector('.chip[data-e="parent"]');
  if (parentChip && !parentChip.classList.contains("on")) parentChip.classList.add("on");
  state.tr = d3.zoomIdentity;
  rebuild();
});

// Fit button
document.getElementById("bf").addEventListener("click", () => {
  state.svgEl.transition().duration(400).call(state.zoomBehavior.transform, d3.zoomIdentity);
});

// Reset button
document.getElementById("br").addEventListener("click", () => {
  document.getElementById("si").value = "";
  document.getElementById("dd").classList.remove("open");
  document.getElementById("df").value = "__all__";
  document.getElementById("tf").value = "__all__";
  document.getElementById("sqf").value = "__all__";
  document.querySelectorAll(".chip[data-e]").forEach(c => c.classList.add("on"));
  document.querySelectorAll(".chip[data-cf]").forEach(c => c.classList.add("on"));
  state.viewMode = "graph";
  document.getElementById("vmg").classList.add("on");
  document.getElementById("vmt").classList.remove("on");
  state.selId = null; clH(); cS();
  document.getElementById("sT").textContent = "Select a sovereign";
  document.getElementById("sT").classList.add("emp");
  document.getElementById("sM").innerHTML = "";
  document.getElementById("sN").innerHTML = 'Click any node to view details and connections.';
  document.getElementById("sR").innerHTML = "";
  state.tr = d3.zoomIdentity; rebuild();
});

// Populate dynasty dropdown
dyS.forEach(d => {
  const o = document.createElement("option");
  o.value = d; o.textContent = d;
  document.getElementById("df").appendChild(o);
});

// Initial stats & render
document.getElementById("st").textContent = people.length + " \u00b7 " + edges.length + (mode === "research" ? " \u00b7 research" : "");
rebuild();

// Handle window resize
window.addEventListener("resize", () => {
  state.W = document.getElementById("ga").clientWidth;
  state.H = document.getElementById("ga").clientHeight;
});

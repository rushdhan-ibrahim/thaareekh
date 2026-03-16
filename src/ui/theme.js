import { rebuild as defaultRebuild } from '../graph/rebuild.js';

export function initTheme(rebuildFn = defaultRebuild) {
  document.getElementById("bt").addEventListener("click", () => {
    const n = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = n;
    document.getElementById("bt").textContent = n === "dark" ? "\u2600" : "\u263E";
    rebuildFn();
  });
}

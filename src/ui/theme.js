import { rebuild } from '../graph/rebuild.js';

export function initTheme() {
  document.getElementById("bt").addEventListener("click", () => {
    const n = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = n;
    document.getElementById("bt").textContent = n === "dark" ? "\u2600" : "\u263E";
    rebuild();
  });
}

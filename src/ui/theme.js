import { rebuild } from '../graph/rebuild.js';

export function initTheme() {
  document.getElementById("bt").addEventListener("click", () => {
    const n = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    const apply = () => {
      document.documentElement.dataset.theme = n;
      document.getElementById("bt").textContent = n === "dark" ? "\u2600" : "\u263E";
      rebuild();
    };
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!reduced && typeof document.startViewTransition === 'function') {
      // Candle-lighting: the whole page cross-fades between themes.
      document.startViewTransition(apply);
    } else {
      apply();
    }
  });
}

export function initTheme(rebuildFn: () => void): void {
  document.getElementById('bt')?.addEventListener('click', () => {
    const n = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    const apply = (): void => {
      document.documentElement.dataset.theme = n;
      const btn = document.getElementById('bt');
      if (btn) btn.textContent = n === 'dark' ? '☀' : '☾';
      rebuildFn();
    };
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (!reduced && typeof doc.startViewTransition === 'function') {
      // Candle-lighting: the whole page cross-fades between themes.
      doc.startViewTransition(apply);
    } else {
      apply();
    }
  });
}

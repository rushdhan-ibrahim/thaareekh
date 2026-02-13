export function initTheme(rebuildFn: () => void): void {
  document.getElementById('bt')?.addEventListener('click', () => {
    const n = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = n;
    const btn = document.getElementById('bt');
    if (btn) btn.textContent = n === 'dark' ? '\u2600' : '\u263E';
    rebuildFn();
  });
}

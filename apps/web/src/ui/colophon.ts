/**
 * The Colophon — the keyboard map set like a manuscript's closing page.
 * Toggled with "?", closed with Escape or a click on the veil.
 */

interface ShortcutRow {
  keys: string;
  what: string;
}

const ROWS: ShortcutRow[] = [
  { keys: '/', what: 'Open the command palette' },
  { keys: '?', what: 'This colophon' },
  { keys: 'F', what: 'Toggle the filter panel' },
  { keys: 'D', what: 'Toggle the details sidebar' },
  { keys: '0', what: 'Reset the view to fit' },
  { keys: '← ↑ ↓ →', what: 'Walk to a neighbouring person' },
  { keys: 'Tab', what: 'Cycle through connections' },
  { keys: 'Home', what: 'Fit the whole chronicle' },
  { keys: 'Esc', what: 'Close panels and selections' },
  { keys: 'Alt+←  Alt+→', what: 'Back / forward through history' }
];

let veil: HTMLElement | null = null;

function close(): void {
  if (!veil) return;
  veil.classList.remove('show');
  const v = veil;
  window.setTimeout(() => v.remove(), 250);
  veil = null;
}

function open(): void {
  if (veil) return;
  veil = document.createElement('div');
  veil.className = 'colophon';
  veil.setAttribute('role', 'dialog');
  veil.setAttribute('aria-modal', 'true');
  veil.setAttribute('aria-label', 'Keyboard shortcuts');
  const rows = ROWS.map(
    r =>
      `<tr><td class="co-keys">${r.keys
        .split(/\s+/)
        .map(k => `<kbd>${k}</kbd>`)
        .join(' ')}</td><td class="co-what">${r.what}</td></tr>`
  ).join('');
  veil.innerHTML =
    '<div class="co-card"><h2 class="co-title">Colophon</h2>' +
    '<p class="co-sub">the instruments of this chronicle</p>' +
    `<table class="co-table"><tbody>${rows}</tbody></table>` +
    '<p class="co-foot">Set in EB Garamond &amp; Cormorant — drawn with d3 — counted without cookies</p></div>';
  document.body.appendChild(veil);
  requestAnimationFrame(() => veil?.classList.add('show'));
  veil.addEventListener('click', e => {
    if (e.target === veil) close();
  });
}

export function initColophon(): void {
  document.addEventListener('keydown', e => {
    const el = document.activeElement;
    const typing =
      el instanceof HTMLInputElement ||
      el instanceof HTMLTextAreaElement ||
      el instanceof HTMLSelectElement ||
      (el instanceof HTMLElement && el.isContentEditable);
    if (typing) return;
    if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      if (veil) close();
      else open();
    } else if (e.key === 'Escape' && veil) {
      e.preventDefault();
      e.stopPropagation();
      close();
    }
  });
}

export function inEditable(el: Element | null): boolean {
  if (!el) return false;
  const tag = (el.tagName ?? '').toLowerCase();
  return tag === 'input' || tag === 'textarea' || (el as HTMLElement).isContentEditable;
}

export function appendToken(input: HTMLInputElement, token: string): void {
  const cur = input.value.trim();
  if (!token || cur.includes(token)) return;
  input.value = `${cur}${cur ? ' ' : ''}${token} `;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.focus();
}

export function initCommandBar(): void {
  const input = document.getElementById('si') as HTMLInputElement | null;
  const clearBtn = document.getElementById('sc');
  const chips = document.querySelectorAll('[data-token]');

  clearBtn?.addEventListener('click', () => {
    if (input) {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
    }
  });

  chips.forEach(ch => {
    ch.addEventListener('click', () => {
      if (input) appendToken(input, (ch as HTMLElement).dataset.token ?? '');
    });
  });

  window.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      input?.focus();
      input?.select();
      return;
    }
    if (e.key === '/' && !inEditable(document.activeElement)) {
      e.preventDefault();
      input?.focus();
      return;
    }
    if (e.key === 'Escape' && document.activeElement === input) {
      input?.blur();
    }
  });
}

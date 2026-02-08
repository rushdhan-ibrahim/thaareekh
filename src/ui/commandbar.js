function inEditable(el) {
  if (!el) return false;
  const tag = (el.tagName || '').toLowerCase();
  return tag === 'input' || tag === 'textarea' || el.isContentEditable;
}

function appendToken(input, token) {
  const cur = input.value.trim();
  if (!token || cur.includes(token)) return;
  input.value = `${cur}${cur ? ' ' : ''}${token} `;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.focus();
}

export function initCommandBar() {
  const input = document.getElementById('si');
  const clearBtn = document.getElementById('sc');
  const chips = document.querySelectorAll('[data-token]');

  clearBtn?.addEventListener('click', () => {
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
  });

  chips.forEach(ch => {
    ch.addEventListener('click', () => {
      appendToken(input, ch.dataset.token || '');
    });
  });

  window.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      input.focus();
      input.select();
      return;
    }
    if (e.key === '/' && !inEditable(document.activeElement)) {
      e.preventDefault();
      input.focus();
      return;
    }
    if (e.key === 'Escape' && document.activeElement === input) {
      input.blur();
    }
  });
}

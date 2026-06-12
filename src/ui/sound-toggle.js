/**
 * Sound toggle + one-time invitation. The chronicle stays silent until asked.
 * Mirror of apps/web/src/ui/sound-toggle.ts.
 */
import { audioEvent, isAudioEnabled, setAudioEnabled } from '../audio/scriptorium-audio.js';

const INVITE_KEY = 'maldives-genealogy:sound-invite-done';
const STORE_KEY = 'maldives-genealogy:sound';

function btn() {
  return document.getElementById('snd');
}

function renderBtn() {
  const b = btn();
  if (!b) return;
  const on = isAudioEnabled();
  b.classList.toggle('on', on);
  b.setAttribute('aria-pressed', on ? 'true' : 'false');
  b.title = on ? 'Sound on — click to silence' : 'Sound off — click to let the chronicle whisper';
  b.textContent = on ? '♪' : '♪';
}

function dismissInvite(card) {
  card.classList.remove('show');
  window.setTimeout(() => card.remove(), 400);
  try {
    localStorage.setItem(INVITE_KEY, '1');
  } catch {
    /* fine */
  }
}

function maybeShowInvite() {
  try {
    if (localStorage.getItem(INVITE_KEY)) return;
    if (localStorage.getItem(STORE_KEY) !== null) return; // user already chose
  } catch {
    return;
  }
  window.setTimeout(() => {
    if (document.querySelector('.sound-invite')) return;
    const card = document.createElement('div');
    card.className = 'sound-invite';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-label', 'Sound invitation');
    card.innerHTML =
      '<span class="si-note">♪</span><p>This chronicle can whisper — faint ocean, ink, and bells.</p>' +
      '<div class="si-actions"><button class="si-yes" type="button">Enable sound</button>' +
      '<button class="si-no" type="button">Not now</button></div>';
    document.body.appendChild(card);
    requestAnimationFrame(() => card.classList.add('show'));
    card.querySelector('.si-yes')?.addEventListener('click', () => {
      setAudioEnabled(true);
      audioEvent('enable-confirm');
      dismissInvite(card);
    });
    card.querySelector('.si-no')?.addEventListener('click', () => dismissInvite(card));
  }, 14000);
}

export function initSoundToggle() {
  const b = btn();
  if (b) {
    b.addEventListener('click', () => {
      const next = !isAudioEnabled();
      setAudioEnabled(next);
      if (next) audioEvent('enable-confirm');
      renderBtn();
    });
  }
  document.addEventListener('sound-changed', renderBtn);
  renderBtn();
  maybeShowInvite();
}

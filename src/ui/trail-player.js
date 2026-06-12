/**
 * Trail performances — lets a story trail play itself. Drives the existing
 * story-rail controls (#stl select, #stn next) from the outside, so the
 * storytrails module stays untouched. Pauses on any graph interaction.
 * Mirror of apps/web/src/ui/trail-player.ts.
 */
import { audioEvent } from '../audio/scriptorium-audio.js';

const STEP_MS = 5200;

export function initTrailPlayer() {
  const stl = document.getElementById('stl');
  const stn = document.getElementById('stn');
  const stp = document.getElementById('stp');
  const rail = document.querySelector('.storyrail');
  if (!stl || !stn || !rail) return;

  const play = document.createElement('button');
  play.id = 'stplay';
  play.className = 'tb';
  play.type = 'button';
  play.title = 'Let this trail perform itself';
  play.setAttribute('aria-pressed', 'false');
  play.textContent = '▶';
  stn.parentElement?.insertBefore(play, stn.nextSibling);

  const progress = document.createElement('div');
  progress.className = 'str-progress';
  rail.appendChild(progress);

  let timer = 0;
  let playing = false;

  const render = () => {
    play.classList.toggle('playing', playing);
    play.setAttribute('aria-pressed', playing ? 'true' : 'false');
    play.textContent = playing ? '❚❚' : '▶';
    play.disabled = !stl.value;
  };

  const stop = finished => {
    if (!playing) return;
    playing = false;
    window.clearInterval(timer);
    if (finished) {
      audioEvent('palette');
      progress.style.width = '100%';
      window.setTimeout(() => {
        progress.style.width = '0';
      }, 1200);
    }
    render();
  };

  const advance = () => {
    if (stn.disabled) {
      stop(true);
      return;
    }
    stn.click();
    audioEvent('step', {});
  };

  const start = () => {
    if (playing || !stl.value) return;
    playing = true;
    render();
    advance();
    timer = window.setInterval(advance, STEP_MS);
  };

  play.addEventListener('click', () => {
    if (playing) stop(false);
    else start();
  });
  stl.addEventListener('change', () => {
    stop(false);
    progress.style.width = '0';
    render();
  });
  stp?.addEventListener('click', () => stop(false));
  document.getElementById('sv')?.addEventListener('pointerdown', () => stop(false), true);

  document.addEventListener('storytrail-step-changed', e => {
    const detail = e.detail;
    if (detail && typeof detail.index === 'number' && typeof detail.total === 'number' && detail.total > 0) {
      progress.style.width = `${Math.round(((detail.index + 1) / detail.total) * 100)}%`;
    }
  });

  render();
}

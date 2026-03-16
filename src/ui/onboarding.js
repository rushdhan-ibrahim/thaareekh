/**
 * First-time onboarding spotlight tour.
 */

const STORAGE_KEY = 'maldives-genealogy:onboarding-done';

const STEPS = [
  {
    title: 'Welcome to Rannavaaru',
    body: 'Explore 850 years of Maldivian royal genealogy across 8 dynasties, 160+ individuals, and 300+ connections. This is an evolving research project — entries are continually refined as new sources surface and existing claims are re-examined.',
    target: null // centered
  },
  {
    title: 'The Graph',
    body: 'This interactive graph shows family relationships. Zoom, pan, and click nodes to explore. Colored edges show relationship types.',
    target: '#sv'
  },
  {
    title: 'Click Any Node',
    body: 'Clicking a person reveals their profile, reign details, known names, offices held, and family connections in the sidebar.',
    target: '.side'
  },
  {
    title: 'Search & Command Palette',
    body: 'Press / or click the search bar to find anyone by name, dynasty, title, or office. Use filters like dy:hilaaly or c:u.',
    target: '#cmdTrigger'
  },
  {
    title: 'Filters & Timeline',
    body: 'Click the filter button to filter by dynasty, edge type, confidence level, and scrub through history with the era timeline.',
    target: '#fp'
  }
];

let currentStep = 0;
let overlay = null;

function isComplete() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return true;
  }
}

function markComplete() {
  try {
    localStorage.setItem(STORAGE_KEY, '1');
  } catch {}
}

function renderStep() {
  if (!overlay) return;
  const step = STEPS[currentStep];
  if (!step) { dismiss(); return; }

  const target = step.target ? document.querySelector(step.target) : null;
  const dots = STEPS.map((_, i) =>
    `<div class="onboarding-dot${i === currentStep ? ' active' : ''}"></div>`
  ).join('');

  let clipPath = 'none';
  if (target) {
    const rect = target.getBoundingClientRect();
    const p = 8;
    clipPath = `polygon(
      0% 0%, 0% 100%, ${rect.left - p}px 100%,
      ${rect.left - p}px ${rect.top - p}px,
      ${rect.right + p}px ${rect.top - p}px,
      ${rect.right + p}px ${rect.bottom + p}px,
      ${rect.left - p}px ${rect.bottom + p}px,
      ${rect.left - p}px 100%, 100% 100%, 100% 0%
    )`;
  }

  const isLast = currentStep === STEPS.length - 1;
  const tooltipStyle = target
    ? (() => {
        const rect = target.getBoundingClientRect();
        const left = Math.min(rect.left, window.innerWidth - 340);
        const top = rect.bottom + 16;
        return `left:${Math.max(12, left)}px;top:${Math.min(top, window.innerHeight - 200)}px`;
      })()
    : 'left:50%;top:50%;transform:translate(-50%,-50%)';

  overlay.innerHTML = `
    <div class="onboarding-backdrop" style="clip-path:${clipPath}"></div>
    <div class="onboarding-tooltip" style="${tooltipStyle}">
      <h3>${step.title}</h3>
      <p>${step.body}</p>
      <div class="onboarding-actions">
        <button class="onboarding-skip" id="ob-skip">Skip tour</button>
        <div class="onboarding-step-indicator">${dots}</div>
        <button class="onboarding-btn${isLast ? ' onboarding-btn-primary' : ''}" id="ob-next">
          ${isLast ? 'Get started' : 'Next'}
        </button>
      </div>
    </div>
  `;
  overlay.classList.add('active');

  document.getElementById('ob-next')?.addEventListener('click', () => {
    if (isLast) dismiss();
    else { currentStep++; renderStep(); }
  });
  document.getElementById('ob-skip')?.addEventListener('click', dismiss);
}

function dismiss() {
  if (overlay) {
    overlay.classList.remove('active');
    overlay.innerHTML = '';
  }
  markComplete();
}

export function initOnboarding() {
  if (isComplete()) return;
  overlay = document.getElementById('onboarding');
  if (!overlay) return;
  // Delay to let graph render first
  setTimeout(() => {
    currentStep = 0;
    renderStep();
  }, 2000);
}

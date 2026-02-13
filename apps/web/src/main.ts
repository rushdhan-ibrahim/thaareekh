import { initSearchRuntime } from './ui/search-runtime';

const mount = document.querySelector<HTMLDivElement>('#app');

if (!mount) {
  throw new Error('Missing app mount node.');
}

mount.innerHTML = `
  <section class="mx-shell">
    <header class="mx-head">
      <div>
        <h1 id="mx-title">Modernization Runtime: Search Cutover</h1>
        <p id="mx-intro">
          TypeScript search and command-palette controllers are wired to shared runtime adapters, with locale/reason-label hooks and research-dataset-backed ranking.
        </p>
      </div>
      <label class="mx-locale">
        <span id="mx-locale-label">Locale</span>
        <select id="mx-locale-select">
          <option value="en" selected>English</option>
          <option value="dv">Dhivehi</option>
        </select>
      </label>
    </header>
    <button id="cmdTrigger" class="mx-trigger" type="button"><span id="mx-trigger-label">Open command palette</span> <kbd>/</kbd></button>
    <div class="swrap">
      <span class="si">⌕</span>
      <input id="si" type="text" aria-label="Search people" aria-controls="dd" aria-autocomplete="list" />
      <button id="sc" class="sc" type="button" aria-label="Clear search">×</button>
      <div id="dd" class="dd"></div>
    </div>
    <div id="cmdPalette" class="cmd-palette">
      <div class="cmd-palette-box">
        <input id="cmdInput" class="cmd-palette-input" type="text" autocomplete="off" spellcheck="false" />
        <div id="cmdResults" class="cmd-palette-results"></div>
        <div class="cmd-palette-hint">
          <span><kbd>↑↓</kbd> <span id="mx-hint-navigate">navigate</span></span>
          <span><kbd>↵</kbd> <span id="mx-hint-select">select</span></span>
          <span><kbd>esc</kbd> <span id="mx-hint-close">close</span></span>
        </div>
      </div>
    </div>
    <p id="search-selected" class="mx-selected" data-person-id="">Focused person: none</p>
    <p id="mx-note" class="mx-note">
      Migration guardrail: <code>no functionality or knowledge loss</code>
    </p>
  </section>
`;

const runtime = initSearchRuntime(document);
const localeSelect = document.getElementById('mx-locale-select');
if (localeSelect instanceof HTMLSelectElement) {
  localeSelect.addEventListener('change', () => {
    const next = localeSelect.value === 'dv' ? 'dv' : 'en';
    runtime.setLocale(next);
  });
}

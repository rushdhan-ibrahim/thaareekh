import assert from 'node:assert/strict';
import {
  isEditableTarget as isEditableTargetTs,
  nextPaletteActiveIndex as nextPaletteActiveIndexTs,
  renderCommandPaletteHtml as renderCommandPaletteHtmlTs
} from '../../apps/web/src/ui/command-palette.ts';

function legacyInEditable(tagName, isContentEditable) {
  const tag = (tagName || '').toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select' || Boolean(isContentEditable);
}

function legacyNextPaletteActiveIndex(active, rowCount, key) {
  if (rowCount <= 0) return -1;
  if (key === 'ArrowDown') return (active + 1) % rowCount;
  return (active - 1 + rowCount) % rowCount;
}

function legacyRenderCommandPaletteHtml(query, results, active, deps) {
  if (!results.length) {
    if (query.trim()) {
      return `<div class="cmd-palette-empty">${deps.escapeHtml(deps.t('no_matches'))}</div>`;
    }
    return `<div class="cmd-palette-empty">${deps.escapeHtml(deps.t('command_empty_hint'))}</div>`;
  }

  return results
    .map((row, index) => {
      const person = row.person;
      return `<div class="cmd-result${index === active ? ' active' : ''}" data-idx="${index}">
      <div class="cmd-result-dot" style="background:${deps.dynastyColor(person.dy)}"></div>
      <div class="cmd-result-info">
        <div class="cmd-result-name">${person.g === 'F' ? '\u2640 ' : ''}${deps.escapeHtml(deps.personName(person))}</div>
        <div class="cmd-result-meta">${deps.escapeHtml(deps.formatReign(person.re))} · ${deps.escapeHtml(person.dy || '?')}</div>
      </div>
      <span class="cmd-result-badge">${deps.escapeHtml(deps.reasonLabel(row.reason))}</span>
    </div>`;
    })
    .join('');
}

const deps = {
  escapeHtml: (value) =>
    String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;'),
  personName: (person) => person.nm,
  formatReign: (reign) => {
    if (!Array.isArray(reign) || !reign.length || !Array.isArray(reign[0])) return '?';
    return `${reign[0][0]}-${reign[0][1] ?? '?'}`;
  },
  reasonLabel: (reason) => `reason:${reason}`,
  dynastyColor: (dy) => `var(--dy-${(dy || 'unknown').toLowerCase()})`,
  t: (key) => (key === 'no_matches' ? 'No matches' : key === 'command_empty_hint' ? 'Hint' : key)
};

const targets = [
  [null, false],
  ['INPUT', false],
  ['TEXTAREA', false],
  ['SELECT', false],
  ['DIV', true],
  ['DIV', false]
];
for (const [tag, editable] of targets) {
  assert.equal(
    isEditableTargetTs(tag, editable),
    legacyInEditable(tag, editable),
    `isEditableTarget mismatch for tag=${String(tag)} editable=${String(editable)}`
  );
}

const indexCases = [
  [0, 0, 'ArrowDown'],
  [0, 4, 'ArrowDown'],
  [3, 4, 'ArrowDown'],
  [0, 4, 'ArrowUp'],
  [2, 4, 'ArrowUp']
];
for (const [active, rowCount, key] of indexCases) {
  assert.equal(
    nextPaletteActiveIndexTs(active, rowCount, key),
    legacyNextPaletteActiveIndex(active, rowCount, key),
    `nextPaletteActiveIndex mismatch for active=${active} rowCount=${rowCount} key=${key}`
  );
}

const rows = [
  {
    person: { id: 'P5', nm: 'Ali', g: 'M', dy: 'Hilaaly', re: [[1510, 1520]] },
    score: 100,
    reason: 'name'
  },
  {
    person: { id: 'P6', nm: 'Amina', g: 'F', dy: '', re: [[1521, 1530]] },
    score: 90,
    reason: 'alias'
  }
];

for (const active of [-1, 0, 1, 2]) {
  assert.equal(
    renderCommandPaletteHtmlTs('ali', rows, active, deps),
    legacyRenderCommandPaletteHtml('ali', rows, active, deps),
    `renderCommandPaletteHtml mismatch at active=${active}`
  );
}

assert.equal(
  renderCommandPaletteHtmlTs('ali', [], -1, deps),
  legacyRenderCommandPaletteHtml('ali', [], -1, deps),
  'renderCommandPaletteHtml mismatch (no matches branch)'
);
assert.equal(
  renderCommandPaletteHtmlTs('   ', [], -1, deps),
  legacyRenderCommandPaletteHtml('   ', [], -1, deps),
  'renderCommandPaletteHtml mismatch (empty hint branch)'
);

console.log('TypeScript command-palette parity passed (reference == TS helpers).');

import assert from 'node:assert/strict';
import {
  evaluateKeydown as evaluateTsKeydown,
  nextActiveIndex as nextTsActiveIndex,
  renderSearchDropdownHtml as renderTsSearchDropdownHtml,
  shouldRenderOnArrowKey as shouldTsRenderOnArrowKey
} from '../../apps/web/src/ui/search-controller.ts';

function legacyShouldRenderOnArrowKey(isOpen, key) {
  return !isOpen && (key === 'ArrowDown' || key === 'ArrowUp');
}

function legacyNextActiveIndex(active, rowCount, key) {
  if (rowCount <= 0) return -1;
  if (key === 'ArrowDown') return (active + 1) % rowCount;
  return (active - 1 + rowCount) % rowCount;
}

function legacyEvaluateKeydown(input) {
  const shouldRender = legacyShouldRenderOnArrowKey(input.isOpen, input.key);
  if (input.rowCount <= 0 && input.key !== 'Escape') {
    return {
      shouldRender,
      ignore: true,
      preventDefault: false,
      nextActive: input.active,
      chooseIndex: null,
      shouldClose: false
    };
  }

  if (input.key === 'ArrowDown') {
    return {
      shouldRender,
      ignore: false,
      preventDefault: true,
      nextActive: legacyNextActiveIndex(input.active, input.rowCount, 'ArrowDown'),
      chooseIndex: null,
      shouldClose: false
    };
  }

  if (input.key === 'ArrowUp') {
    return {
      shouldRender,
      ignore: false,
      preventDefault: true,
      nextActive: legacyNextActiveIndex(input.active, input.rowCount, 'ArrowUp'),
      chooseIndex: null,
      shouldClose: false
    };
  }

  if (input.key === 'Enter') {
    return {
      shouldRender,
      ignore: false,
      preventDefault: true,
      nextActive: input.active,
      chooseIndex: input.active >= 0 ? input.active : 0,
      shouldClose: false
    };
  }

  if (input.key === 'Escape') {
    return {
      shouldRender,
      ignore: false,
      preventDefault: false,
      nextActive: -1,
      chooseIndex: null,
      shouldClose: true
    };
  }

  return {
    shouldRender,
    ignore: true,
    preventDefault: false,
    nextActive: input.active,
    chooseIndex: null,
    shouldClose: false
  };
}

function legacyRenderSearchDropdownHtml(rows, active, deps) {
  if (!rows.length) {
    return `<div class="dde">${deps.escapeHtml(deps.t('no_matches'))}</div>`;
  }
  return rows
    .map((row, index) => {
      const person = row.person;
      return `<div class="ddi${index === active ? ' act' : ''}" id="sr-opt-${index}" role="option" aria-selected="${
        index === active ? 'true' : 'false'
      }" data-id="${person.id}" data-idx="${index}">
        <b>${person.g === 'F' ? '\u2640 ' : ''}${deps.escapeHtml(deps.personName(person))}</b>
        <em>${deps.escapeHtml(deps.formatReign(person.re))} · ${deps.escapeHtml(person.dy || '?')} · ${deps.escapeHtml(
          deps.reasonLabel(row.reason)
        )}</em>
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
  t: (key) => (key === 'no_matches' ? 'No matches' : key)
};

const rows = [
  {
    person: { id: 'P7', nm: 'Dhon<Ali>', g: 'F', dy: 'Hilaaly', re: [[1550, 1560]] },
    score: 120,
    reason: 'name'
  },
  {
    person: { id: 'P8', nm: 'Hassan "Kabir"', g: 'M', dy: '', re: [[1561, 1570]] },
    score: 90,
    reason: 'alias'
  }
];

for (const active of [-1, 0, 1, 2]) {
  assert.equal(
    renderTsSearchDropdownHtml(rows, active, deps),
    legacyRenderSearchDropdownHtml(rows, active, deps),
    `renderSearchDropdownHtml mismatch at active=${active}`
  );
}

assert.equal(
  renderTsSearchDropdownHtml([], -1, deps),
  legacyRenderSearchDropdownHtml([], -1, deps),
  'renderSearchDropdownHtml mismatch for no-results state'
);

const renderInputs = [
  [true, 'ArrowDown'],
  [false, 'ArrowDown'],
  [false, 'ArrowUp'],
  [false, 'Enter'],
  [true, 'Escape']
];
for (const [isOpen, key] of renderInputs) {
  assert.equal(
    shouldTsRenderOnArrowKey(isOpen, key),
    legacyShouldRenderOnArrowKey(isOpen, key),
    `shouldRenderOnArrowKey mismatch for isOpen=${String(isOpen)} key=${String(key)}`
  );
}

const nextInputs = [
  [0, 0, 'ArrowDown'],
  [0, 3, 'ArrowDown'],
  [2, 3, 'ArrowDown'],
  [0, 3, 'ArrowUp'],
  [1, 3, 'ArrowUp']
];
for (const [active, rowCount, key] of nextInputs) {
  assert.equal(
    nextTsActiveIndex(active, rowCount, key),
    legacyNextActiveIndex(active, rowCount, key),
    `nextActiveIndex mismatch for active=${active} rowCount=${rowCount} key=${key}`
  );
}

const keydownCases = [
  { isOpen: false, rowCount: 0, active: -1, key: 'ArrowDown' },
  { isOpen: false, rowCount: 4, active: 0, key: 'ArrowDown' },
  { isOpen: true, rowCount: 4, active: 0, key: 'ArrowUp' },
  { isOpen: true, rowCount: 4, active: -1, key: 'Enter' },
  { isOpen: true, rowCount: 4, active: 2, key: 'Enter' },
  { isOpen: true, rowCount: 0, active: -1, key: 'Escape' },
  { isOpen: true, rowCount: 0, active: -1, key: 'a' }
];
for (const input of keydownCases) {
  assert.deepEqual(
    evaluateTsKeydown(input),
    legacyEvaluateKeydown(input),
    `evaluateKeydown mismatch for input=${JSON.stringify(input)}`
  );
}

console.log('TypeScript search-controller parity passed (reference == TS helpers).');

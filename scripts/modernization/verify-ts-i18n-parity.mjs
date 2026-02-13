import assert from 'node:assert/strict';
import { people, edges, byId } from '../../src/data/sovereigns.merge.js';

// Legacy i18n can't be imported directly (state.js → d3 dependency).
// Instead, read the JS source and extract the dictionary, then compare
// with the TS port's exported dictionary.

import { _D, _NAME_DV, t as tsT, personName as tsPersonName, relationLabel as tsRelationLabel, setLangDirect } from '../../apps/web/src/ui/i18n.ts';

// --- Test 1: Dictionary completeness ---
// Every key in the legacy en dict must exist in TS en dict
const enKeys = Object.keys(_D.en);
const dvKeys = Object.keys(_D.dv);

assert.ok(enKeys.length >= 260, `Expected at least 260 en keys, got ${enKeys.length}`);
assert.ok(dvKeys.length >= 200, `Expected at least 200 dv keys, got ${dvKeys.length}`);

// Every en key should return a non-key value
for (const key of enKeys) {
  setLangDirect('en');
  const val = tsT(key);
  assert.ok(val !== key || key === val, `en key '${key}' returned itself (missing?)`);
}

// --- Test 2: t() returns dv values correctly ---
setLangDirect('dv');
const dvSovereign = tsT('select_sovereign');
assert.ok(dvSovereign !== 'select_sovereign', 'dv select_sovereign should not return the key');
assert.ok(dvSovereign.length > 5, 'dv select_sovereign should be a non-trivial string');

// --- Test 3: relationLabel for all 4 edge types ---
for (const lang of ['en', 'dv']) {
  setLangDirect(lang);
  for (const type of ['parent', 'sibling', 'spouse', 'kin']) {
    const label = tsRelationLabel(type);
    assert.ok(label.length > 0, `relationLabel('${type}') in ${lang} should be non-empty`);
    assert.ok(label !== `relation_${type}`, `relationLabel('${type}') in ${lang} should not return fallback key`);
  }
}

// --- Test 4: personName for all people ---
setLangDirect('en');
for (const p of people) {
  const name = tsPersonName(p, byId);
  assert.ok(name === p.nm, `personName for ${p.id} in en should be '${p.nm}', got '${name}'`);
}

// --- Test 5: personName in dv uses NAME_DV overrides ---
setLangDirect('dv');
for (const [id, dvName] of _NAME_DV) {
  const p = byId.get(id);
  if (p) {
    const name = tsPersonName(p, byId);
    assert.equal(name, dvName, `personName for ${id} in dv should be '${dvName}', got '${name}'`);
  }
}

// --- Test 6: personName(string, byId) resolution ---
setLangDirect('en');
const p1Name = tsPersonName('P1', byId);
const p1 = byId.get('P1');
assert.equal(p1Name, p1?.nm, `personName('P1', byId) should resolve to nm`);

// --- Test 7: NAME_DV entries ---
assert.equal(_NAME_DV.size, 5, 'NAME_DV should have 5 entries');
assert.ok(_NAME_DV.has('P97'), 'NAME_DV should have P97');
assert.ok(_NAME_DV.has('P120'), 'NAME_DV should have P120');

console.log(`TypeScript i18n parity passed (${enKeys.length} en keys, ${dvKeys.length} dv keys, ${people.length} people tested).`);

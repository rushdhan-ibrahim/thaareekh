import assert from 'node:assert/strict';
import { people, edges } from '../../src/data/sovereigns.merge.js';
import { filterCore, applyTreeDynastyFilter } from '../../apps/web/src/graph/filter.ts';

// Stub personName: just return nm
function personNameFn(p) { return p.nm; }

// Build era ok: all people pass
const allPeopleOk = new Set(people.map(p => p.id));

// --- Test 1: All filters active, no era → all people + edges ---
{
  const input = {
    activeEdgeTypes: new Set(['parent', 'sibling', 'spouse', 'kin']),
    activeConfidence: new Set(['c', 'i', 'u']),
    dynastyValue: '__all__',
    sourceGradeValue: '__all__',
    eraEnabled: false,
    eraYear: NaN,
    eraPersonOk: allPeopleOk
  };
  const result = filterCore(people, edges, input, personNameFn);
  assert.equal(result.nodes.length, people.length, 'All people should pass with all filters active');
  assert.equal(result.links.length, edges.length, 'All edges should pass with all filters active');
  assert.ok(result.treesMeta.length > 0, 'Should have at least one tree');
  assert.ok(result.components.length > 0, 'Should have at least one component');
}

// --- Test 2: Only parent edges ---
{
  const input = {
    activeEdgeTypes: new Set(['parent']),
    activeConfidence: new Set(['c', 'i', 'u']),
    dynastyValue: '__all__',
    sourceGradeValue: '__all__',
    eraEnabled: false,
    eraYear: NaN,
    eraPersonOk: allPeopleOk
  };
  const result = filterCore(people, edges, input, personNameFn);
  assert.ok(result.links.length < edges.length, 'Fewer edges with only parent type');
  result.links.forEach(e => assert.equal(e.t, 'parent', 'All edges should be parent'));
}

// --- Test 3: Only confirmed confidence ---
{
  const input = {
    activeEdgeTypes: new Set(['parent', 'sibling', 'spouse', 'kin']),
    activeConfidence: new Set(['c']),
    dynastyValue: '__all__',
    sourceGradeValue: '__all__',
    eraEnabled: false,
    eraYear: NaN,
    eraPersonOk: allPeopleOk
  };
  const result = filterCore(people, edges, input, personNameFn);
  result.links.forEach(e => assert.equal(e.c, 'c', 'All edges should be confirmed'));
}

// --- Test 4: Dynasty filter via applyTreeDynastyFilter ---
{
  const input = {
    activeEdgeTypes: new Set(['parent', 'sibling', 'spouse', 'kin']),
    activeConfidence: new Set(['c', 'i', 'u']),
    dynastyValue: '__all__',
    sourceGradeValue: '__all__',
    eraEnabled: false,
    eraYear: NaN,
    eraPersonOk: allPeopleOk
  };
  const result = filterCore(people, edges, input, personNameFn);
  const filtered = applyTreeDynastyFilter(result, 'Hilaaly', '__all__');
  filtered.nodes.forEach(p =>
    assert.equal(p.dy, 'Hilaaly', `Node ${p.id} should be Hilaaly dynasty`)
  );
  assert.ok(filtered.nodes.length > 0, 'Should have some Hilaaly nodes');
}

// --- Test 5: Tree selection ---
{
  const input = {
    activeEdgeTypes: new Set(['parent', 'sibling', 'spouse', 'kin']),
    activeConfidence: new Set(['c', 'i', 'u']),
    dynastyValue: '__all__',
    sourceGradeValue: '__all__',
    eraEnabled: false,
    eraYear: NaN,
    eraPersonOk: allPeopleOk
  };
  const result = filterCore(people, edges, input, personNameFn);
  if (result.components.length > 1) {
    const filtered = applyTreeDynastyFilter(result, '__all__', '0');
    const treeIds = new Set(result.components[0]);
    filtered.nodes.forEach(p =>
      assert.ok(treeIds.has(p.id), `Node ${p.id} should be in tree 0`)
    );
  }
}

// --- Test 6: treesMeta shape ---
{
  const input = {
    activeEdgeTypes: new Set(['parent', 'sibling', 'spouse', 'kin']),
    activeConfidence: new Set(['c', 'i', 'u']),
    dynastyValue: '__all__',
    sourceGradeValue: '__all__',
    eraEnabled: false,
    eraYear: NaN,
    eraPersonOk: allPeopleOk
  };
  const result = filterCore(people, edges, input, personNameFn);
  for (const tm of result.treesMeta) {
    assert.equal(typeof tm.index, 'number', 'index should be number');
    assert.ok(Array.isArray(tm.ids), 'ids should be array');
    assert.equal(typeof tm.size, 'number', 'size should be number');
    assert.equal(tm.size, tm.ids.length, 'size should match ids.length');
    assert.equal(typeof tm.repName, 'string', 'repName should be string');
    assert.equal(typeof tm.dynasty, 'string', 'dynasty should be string');
  }
}

console.log('TypeScript filter parity passed (6 configurations tested).');

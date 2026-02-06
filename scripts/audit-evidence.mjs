#!/usr/bin/env node

const args = process.argv.slice(2);
const arg = (name, fallback = null) => {
  const i = args.indexOf(name);
  if (i === -1) return fallback;
  return args[i + 1] ?? fallback;
};
const has = name => args.includes(name);

const mode = arg('--mode', 'canonical');
const limit = Number(arg('--limit', '30'));
const onlyInterDynasty = has('--inter-dynasty-only');
const json = has('--json');

const [merge, sources] = await Promise.all([
  import('../src/data/sovereigns.merge.js'),
  import('../src/data/sources.js')
]);

const data = merge.getDataset(mode);
const sourceIds = new Set(sources.sources.map(s => s.id));
const byId = new Map(data.people.map(p => [p.id, p]));

const unknownEdgeSourceRefs = [];
const unknownPersonSourceRefs = [];
const missingEvidence = [];

data.edges.forEach((e, idx) => {
  const refs = e.evidence_refs || [];
  refs.forEach(r => {
    if (!sourceIds.has(r)) unknownEdgeSourceRefs.push({ idx, edge: e, ref: r });
  });

  const sP = byId.get(e.s);
  const dP = byId.get(e.d);
  const sDy = sP?.dy || 'Unknown';
  const dDy = dP?.dy || 'Unknown';
  const interDynasty = sDy !== dDy;

  if (refs.length === 0 || !e.confidence_grade) {
    if (!onlyInterDynasty || interDynasty) {
      missingEvidence.push({
        idx,
        edge: e,
        interDynasty,
        sourceDynasty: sDy,
        targetDynasty: dDy,
        missingRefs: refs.length === 0,
        missingGrade: !e.confidence_grade
      });
    }
  }
});

data.people.forEach((p, idx) => {
  (p.source_refs || []).forEach(r => {
    if (!sourceIds.has(r)) unknownPersonSourceRefs.push({ idx, person: p, ref: r });
  });
});

const gradedEdges = data.edges.filter(e => e.confidence_grade).length;
const sourcedEdges = data.edges.filter(e => (e.evidence_refs || []).length > 0).length;
const byC = { c: 0, i: 0, u: 0 };
for (const e of data.edges) byC[e.c] = (byC[e.c] || 0) + 1;

const payload = {
  mode,
  totals: {
    people: data.people.length,
    edges: data.edges.length,
    sourcedEdges,
    gradedEdges,
    byConfidenceClass: byC
  },
  issues: {
    unknownEdgeSourceRefs: unknownEdgeSourceRefs.length,
    unknownPersonSourceRefs: unknownPersonSourceRefs.length,
    missingEvidenceOrGrade: missingEvidence.length
  },
  sampleMissing: missingEvidence.slice(0, Math.max(0, limit)).map(x => ({
    idx: x.idx,
    t: x.edge.t,
    s: x.edge.s,
    d: x.edge.d,
    l: x.edge.l || '',
    c: x.edge.c,
    sourceDynasty: x.sourceDynasty,
    targetDynasty: x.targetDynasty,
    interDynasty: x.interDynasty,
    missingRefs: x.missingRefs,
    missingGrade: x.missingGrade
  }))
};

if (json) {
  process.stdout.write(JSON.stringify(payload, null, 2) + '\n');
} else {
  console.log(`Mode: ${mode}`);
  console.log(`People: ${payload.totals.people}`);
  console.log(`Edges: ${payload.totals.edges}`);
  console.log(`Sourced edges: ${sourcedEdges}`);
  console.log(`Graded edges: ${gradedEdges}`);
  console.log(`Confidence split: c=${byC.c || 0} i=${byC.i || 0} u=${byC.u || 0}`);
  console.log(`Unknown edge source refs: ${unknownEdgeSourceRefs.length}`);
  console.log(`Unknown person source refs: ${unknownPersonSourceRefs.length}`);
  console.log(`Missing evidence or grade: ${missingEvidence.length}`);
  if (onlyInterDynasty) console.log('Filter: inter-dynasty only');
  if (payload.sampleMissing.length) {
    console.log('\nSample missing rows:');
    payload.sampleMissing.forEach(r => {
      console.log(
        `#${r.idx} ${r.t} ${r.s}->${r.d} [${r.sourceDynasty} -> ${r.targetDynasty}] c=${r.c}` +
        `${r.missingRefs ? ' missing_refs' : ''}${r.missingGrade ? ' missing_grade' : ''}` +
        `${r.l ? ` label="${r.l}"` : ''}`
      );
    });
  }
}

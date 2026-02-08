#!/usr/bin/env node

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDataset } from '../src/data/sovereigns.merge.js';
import { inferenceEdgeKey } from '../src/data/inference-notes.js';
import { sourceById } from '../src/data/sources.js';

const DATE = '2026-02-08';
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const researchDir = join(rootDir, 'docs', 'research-program');
const peopleDir = join(researchDir, 'people');
const inferenceDir = join(researchDir, 'inferences');
const ledgerDir = join(researchDir, 'ledgers');

const personIds = ['P31', 'P32', 'P33', 'P34', 'P35', 'P36', 'P37', 'P38', 'P39', 'P40'];
const phase1PrimaryTargets = [
  'SRC-TUFS-TARIKH-DIBA-MAHALL-FACSIMILE',
  'SRC-TUFS-TARIKH-DIBA-MAHALL-ANNOT',
  'SRC-SARUNA-RAADHAVALHI-1985',
  'SRC-SARUNA-PYRARD-V2P2-1887',
  'SRC-MRF-HILAALY',
  'SRC-MRF-KINGS',
  'SRC-CORNELL-PYRARD-V1-1887',
  'SRC-HEIDELBERG-BELL-1883'
];

const inferenceTargetKeys = new Set([
  'kin|P108|P39|grandparent',
  'kin|P108|P40|grandparent',
  'kin|P109|P30|grandparent',
  'kin|P112|P114|grandparent',
  'kin|P114|P136|grandparent',
  'kin|P115|P137|grandparent',
  'kin|P116|P124|grandparent',
  'kin|P116|P143|grandparent',
  'kin|P116|P144|grandparent',
  'kin|P116|P145|grandparent',
  'kin|P116|P146|grandparent',
  'kin|P116|P147|grandparent'
]);

const relationshipUpdates = new Map([
  ['CLM-0017', {
    claim_excerpt: 'Derived grandparent relation between P108 and P39 follows an explicit two-step parent chain encoded in edge inference metadata.',
    citation_locator: 'Inference basis: parent-of-parent-grandparent rule from edge metadata',
    notes: 'Derived inference dossier drafted in batch D.'
  }],
  ['CLM-0018', {
    claim_excerpt: 'Derived grandparent relation between P108 and P40 follows an explicit two-step parent chain encoded in edge inference metadata.',
    citation_locator: 'Inference basis: parent-of-parent-grandparent rule from edge metadata',
    notes: 'Derived inference dossier drafted in batch D.'
  }],
  ['CLM-0019', {
    claim_excerpt: 'Derived grandparent relation between P109 and P30 follows an explicit two-step parent chain encoded in edge inference metadata.',
    citation_locator: 'Inference basis: parent-of-parent-grandparent rule from edge metadata',
    notes: 'Derived inference dossier drafted in batch D.'
  }],
  ['CLM-0022', {
    claim_excerpt: 'Derived grandparent relation between P112 and P114 follows an explicit two-step parent chain encoded in edge inference metadata.',
    citation_locator: 'Inference basis: parent-of-parent-grandparent rule from edge metadata',
    notes: 'Derived inference dossier drafted in batch D.'
  }],
  ['CLM-0023', {
    claim_excerpt: 'Derived grandparent relation between P114 and P136 follows an explicit two-step parent chain encoded in edge inference metadata.',
    citation_locator: 'Inference basis: parent-of-parent-grandparent rule from edge metadata',
    notes: 'Derived inference dossier drafted in batch D.'
  }],
  ['CLM-0024', {
    claim_excerpt: 'Derived grandparent relation between P115 and P137 follows an explicit two-step parent chain encoded in edge inference metadata.',
    citation_locator: 'Inference basis: parent-of-parent-grandparent rule from edge metadata',
    notes: 'Derived inference dossier drafted in batch D.'
  }],
  ['CLM-0025', {
    claim_excerpt: 'Derived grandparent relation between P116 and P124 follows an explicit two-step parent chain encoded in edge inference metadata.',
    citation_locator: 'Inference basis: parent-of-parent-grandparent rule from edge metadata',
    notes: 'Derived inference dossier drafted in batch D.'
  }],
  ['CLM-0026', {
    claim_excerpt: 'Derived grandparent relation between P116 and P143 follows an explicit two-step parent chain encoded in edge inference metadata.',
    citation_locator: 'Inference basis: parent-of-parent-grandparent rule from edge metadata',
    notes: 'Derived inference dossier drafted in batch D.'
  }],
  ['CLM-0027', {
    claim_excerpt: 'Derived grandparent relation between P116 and P144 follows an explicit two-step parent chain encoded in edge inference metadata.',
    citation_locator: 'Inference basis: parent-of-parent-grandparent rule from edge metadata',
    notes: 'Derived inference dossier drafted in batch D.'
  }],
  ['CLM-0028', {
    claim_excerpt: 'Derived grandparent relation between P116 and P145 follows an explicit two-step parent chain encoded in edge inference metadata.',
    citation_locator: 'Inference basis: parent-of-parent-grandparent rule from edge metadata',
    notes: 'Derived inference dossier drafted in batch D.'
  }],
  ['CLM-0029', {
    claim_excerpt: 'Derived grandparent relation between P116 and P146 follows an explicit two-step parent chain encoded in edge inference metadata.',
    citation_locator: 'Inference basis: parent-of-parent-grandparent rule from edge metadata',
    notes: 'Derived inference dossier drafted in batch D.'
  }],
  ['CLM-0030', {
    claim_excerpt: 'Derived grandparent relation between P116 and P147 follows an explicit two-step parent chain encoded in edge inference metadata.',
    citation_locator: 'Inference basis: parent-of-parent-grandparent rule from edge metadata',
    notes: 'Derived inference dossier drafted in batch D.'
  }],
  ['CLM-0129', {
    claim_excerpt: 'Hilaaly branch source context records P192 and P32 with an uncle-nephew relation.',
    citation_locator: 'SRC-MRF-HILAALY founder-branch collateral annotations',
    notes: 'Direct collateral claim in the P31-P40 cluster.'
  }],
  ['CLM-0145', {
    claim_excerpt: 'Hilaaly source context gives P31 and P32 as uncle-nephew relation in succession cluster notes.',
    citation_locator: 'SRC-MRF-HILAALY relation annotation for P31-P32 pair',
    notes: 'Curated inferred relation linked to founder branch context.'
  }],
  ['CLM-0148', {
    claim_excerpt: 'Sequence notes connect P32 to P33 as succession-transition context.',
    citation_locator: 'SRC-WIKI-MONARCHS with SRC-MRF-KINGS cross-check around P32-P33 transition',
    notes: 'Transition-context relation pending stronger chronicle corroboration.'
  }],
  ['CLM-0151', {
    claim_excerpt: 'Kings list branch notes characterize P32 as ancestor-level relation to P53.',
    citation_locator: 'SRC-MRF-KINGS transition-era branch annotation',
    notes: 'Ancestor framing retained as broad kin context.'
  }],
  ['CLM-0152', {
    claim_excerpt: 'Sequence notes connect P33 to P34 as succession-transition context.',
    citation_locator: 'SRC-WIKI-MONARCHS with SRC-MRF-KINGS cross-check around P33-P34 transition',
    notes: 'Transition-context relation pending stronger chronicle corroboration.'
  }],
  ['CLM-0160', {
    claim_excerpt: 'Kings list branch notes identify P40 as grandfather of P49.',
    citation_locator: 'SRC-MRF-KINGS branch annotation around P40 and P49',
    notes: 'Direct grandparent wording in Hilaaly branch chain.'
  }],
  ['CLM-0161', {
    claim_excerpt: 'Kings list branch notes identify P40 as grandfather of P57.',
    citation_locator: 'SRC-MRF-KINGS branch annotation around P40 and P57',
    notes: 'Direct grandparent wording in Hilaaly branch chain.'
  }],
  ['CLM-0326', {
    claim_excerpt: 'Hilaaly branch source gives parent edge P192 to P38.',
    citation_locator: 'SRC-MRF-HILAALY founder-era parentage annotation; compare SRC-MRF-KINGS',
    notes: 'Direct parent edge in collateral founder branch.'
  }],
  ['CLM-0336', {
    claim_excerpt: 'Kings list records parent edge P39 to P46.',
    citation_locator: 'SRC-MRF-KINGS entries for P39 and P46 parentage linkage',
    notes: 'Direct parent edge supporting downstream inferred cousin links.'
  }],
  ['CLM-0337', {
    claim_excerpt: 'Kings list and Hilaaly branch notes together support parent edge P40 to P193.',
    citation_locator: 'SRC-MRF-KINGS with SRC-MRF-HILAALY cross-reference for P40-P193 branch',
    notes: 'Bridge-sensitive parent claim with dual-source support.'
  }],
  ['CLM-0338', {
    claim_excerpt: 'Kings list records parent edge P40 to P41.',
    citation_locator: 'SRC-MRF-KINGS entries for P40 and P41 parentage linkage',
    notes: 'Direct parent edge for central Hilaaly descendant branch.'
  }],
  ['CLM-0429', {
    claim_excerpt: 'P31 and P39 sibling relation is inferred from shared-parent structure in founder-branch sources.',
    citation_locator: 'Inference synthesis from SRC-MRF-HILAALY with corroborative sequence context',
    notes: 'Sibling inference remains C until explicit pairwise statement is extracted.'
  }],
  ['CLM-0430', {
    claim_excerpt: 'P31 and P40 sibling relation is inferred from shared-parent structure in founder-branch sources.',
    citation_locator: 'Inference synthesis from SRC-MRF-HILAALY with corroborative sequence context',
    notes: 'Sibling inference remains C until explicit pairwise statement is extracted.'
  }],
  ['CLM-0431', {
    claim_excerpt: 'Kings list marks P34 and P35 as brothers.',
    citation_locator: 'SRC-MRF-KINGS entries for P34-P35 kin annotation',
    notes: 'Direct sibling claim in immediate post-founder sequence.'
  }],
  ['CLM-0432', {
    claim_excerpt: 'Kings list marks P39 and P40 as half-brothers.',
    citation_locator: 'SRC-MRF-KINGS entries for P39-P40 kin annotation',
    notes: 'Direct sibling claim with half-sibling qualifier.'
  }],
]);

const queueUpdates = new Map([
  ['SRCQ-013', {
    status: 'in_progress',
    owner: 'phase1-batch-d',
    notes: 'Discovery sprint started for primary Lunar corroboration set; see EXT-013.'
  }],
  ['SRCQ-014', {
    status: 'in_progress',
    owner: 'phase1-batch-d',
    notes: 'Discovery sprint started for Hilaaly bridge corroboration sources; see EXT-014.'
  }],
  ['SRCQ-015', {
    status: 'in_progress',
    owner: 'phase1-batch-d',
    notes: 'Discovery sprint started for Dhiyamigili and southern-branch corroboration sources; see EXT-015.'
  }]
]);

const sourceExtractEntries = [
  {
    extract_id: 'EXT-013',
    source_id: '(new-primary-lunar)',
    date: DATE,
    extract_status: 'in_progress',
    target_scope: 'Lunar dynasty corroboration source discovery',
    claim_or_context_note: 'Discovery pass started to identify manuscript and inscriptional sources that can independently corroborate P1-P29 chains.',
    locator: 'phase1 batch D discovery log for SRCQ-013',
    researcher: 'phase1-batch-d',
    notes: 'Prioritize sources capable of A/B grade evidence and precise locator extraction.'
  },
  {
    extract_id: 'EXT-014',
    source_id: '(new-primary-hilaaly)',
    date: DATE,
    extract_status: 'in_progress',
    target_scope: 'Hilaaly bridge corroboration source discovery',
    claim_or_context_note: 'Discovery pass started to identify independent chronicles and scholarship for P30-P40 bridge-critical links.',
    locator: 'phase1 batch D discovery log for SRCQ-014',
    researcher: 'phase1-batch-d',
    notes: 'Targets direct parent/sibling statements and contradiction adjudication material.'
  },
  {
    extract_id: 'EXT-015',
    source_id: '(new-primary-dhiyamigili-south)',
    date: DATE,
    extract_status: 'in_progress',
    target_scope: 'Dhiyamigili and southern branch corroboration source discovery',
    claim_or_context_note: 'Discovery pass started for branch-focused records and local-history publications to resolve contested continuity claims.',
    locator: 'phase1 batch D discovery log for SRCQ-015',
    researcher: 'phase1-batch-d',
    notes: 'Use to reduce dependence on single-source continuity narratives before promotion decisions.'
  }
];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === ',') {
      row.push(field);
      field = '';
      continue;
    }
    if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      continue;
    }
    if (ch !== '\r') field += ch;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function csvEscape(v) {
  const s = String(v ?? '');
  if (s.includes('"') || s.includes(',') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCsv(rows) {
  return `${rows.map(r => r.map(csvEscape).join(',')).join('\n')}\n`;
}

function byIdMap(list) {
  return new Map(list.map(item => [item.id, item]));
}

function personLabel(byId, id) {
  const p = byId.get(id);
  if (!p) return id;
  const name = p.nm || '(unnamed)';
  const reg = p.rg ? ` (${p.rg})` : '';
  return `${id} ${name}${reg}`;
}

function unique(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function formatDateRange(reignRanges) {
  if (!Array.isArray(reignRanges) || !reignRanges.length) return 'Unknown';
  return reignRanges.map(r => `${r[0]}-${r[1]}`).join('; ');
}

function formatList(items) {
  if (!items.length) return '- none recorded';
  return items.map(v => `- ${v}`).join('\n');
}

function relationText(edge, byId) {
  const source = personLabel(byId, edge.s);
  const target = personLabel(byId, edge.d);
  const label = edge.l ? ` [${edge.l}]` : '';
  return `${edge.t} ${source} -> ${target}${label} (${edge.c})`;
}

function makePersonDossier(person, allEdges, byPersonId) {
  const relEdges = allEdges.filter(e => e.s === person.id || e.d === person.id);
  const parentEdges = relEdges.filter(e => e.t === 'parent' && e.d === person.id);
  const childEdges = relEdges.filter(e => e.t === 'parent' && e.s === person.id);
  const siblingEdges = relEdges.filter(e => e.t === 'sibling');
  const spouseEdges = relEdges.filter(e => e.t === 'spouse');
  const kinEdges = relEdges.filter(e => e.t === 'kin');
  const direct = relEdges.filter(e => e.c === 'c');
  const inferred = relEdges.filter(e => e.c === 'i');
  const uncertain = relEdges.filter(e => e.c === 'u');

  const relationSourceIds = unique(relEdges.flatMap(e => e.evidence_refs || []));
  const sourceIds = unique([
    ...(person.source_refs || []),
    ...relationSourceIds,
    ...phase1PrimaryTargets
  ]);

  const officeText = (person.offices_held || []).map(o => {
    const years = [o.start, o.end].filter(Boolean).join('-');
    const yearsText = years ? ` (${years})` : '';
    return `${o.office_id || o.label || 'office'}${yearsText}`;
  });

  const aliases = unique([
    ...(person.aliases || []),
    ...((person.known_as || []).map(k => k.name))
  ]);

  const sourcesList = sourceIds.map(id => {
    const s = sourceById.get(id);
    if (!s) return `- \`${id}\` (not yet in registry notes)`;
    return `- \`${id}\`: ${s.title} [${s.quality}]`;
  }).join('\n');

  const openQuestions = [];
  if (!(person.source_refs || []).length) {
    openQuestions.push('Direct person-level source_refs are still missing and need chronicle corroboration.');
  }
  if (!aliases.length) {
    openQuestions.push('No verified alternate name/transliteration set yet.');
  }
  if (!officeText.length) {
    openQuestions.push('No office/style assignment verified beyond regnal framing.');
  }
  if (!parentEdges.length) {
    openQuestions.push('Parentage is currently incomplete in model and requires source extraction.');
  }

  return `# Person Dossier

Person ID: \`${person.id}\`  
Last updated: \`${DATE}\`  
Research status: \`in_progress\`

## 1) Identity
- Canonical display name: ${person.nm || 'Unknown'}
- Regnal name(s): ${person.rg || 'Unknown'}
- Throne number / sovereign ordinal (if applicable): ${(person.n || []).join(', ') || 'Unknown'}
- Dynasty / house: ${person.dy || 'Unknown'}
- Gender: ${person.g || 'Unknown'}
- Language/script variants:
${formatList(aliases)}

## 2) Titles, styles, and offices
- Titles/styles (with period notes):
${formatList(person.titles || [])}
- Offices held:
${formatList(officeText)}
- Institution links:
- none recorded

## 3) Timeline anchors
- Birth (date/place/source): ${person.yb || 'Unknown'} / ${person.pb || 'Unknown'}
- Accession or elevation events: reign ${formatDateRange(person.re)}
- Deposition/transition events: not yet extracted for this node
- Death (date/place/source): ${person.yd || 'Unknown'} / ${person.pd || 'Unknown'}

## 4) Family and relationships
- Parents:
${formatList(parentEdges.map(e => relationText(e, byPersonId)))}
- Siblings:
${formatList(siblingEdges.map(e => relationText(e, byPersonId)))}
- Spouse(s)/consorts:
${formatList(spouseEdges.map(e => relationText(e, byPersonId)))}
- Children:
${formatList(childEdges.map(e => relationText(e, byPersonId)))}
- Collateral branch links:
${formatList(kinEdges.map(e => relationText(e, byPersonId)))}

## 5) Evidence summary
- High-confidence (\`A/B\`) claims: ${direct.length ? `${direct.length} modeled relations currently marked direct.` : 'No direct relation edges currently attached.'}
- Inferred (\`C\`) claims: ${inferred.length ? `${inferred.length} inferred relations present and require pair-level dossier traceability.` : 'No inferred edges for this node.'}
- Uncertain/contested (\`D\`) claims: ${uncertain.length ? `${uncertain.length} uncertain/contested relations currently modeled.` : 'None currently attached.'}

## 6) Source list
${sourcesList}

## 7) Open questions
${formatList(openQuestions)}

## 8) Notes for graph integration
- Required node field updates: source_refs backfill; aliases/transliteration enrichment; title/style notes.
- Required edge updates: corroborate direct and inferred bridge claims with chronicle-backed locators.
- Promotion readiness: not ready for canonical promotion change this batch.
`;
}

function derivedLogic(edge, byPersonId) {
  const basis = edge.inference_basis || {};
  const lines = [];

  if (edge.inference_rule === 'parent-of-parent-grandparent') {
    const parentEdges = basis.parent_edges || [];
    const via = basis.via_parent ? personLabel(byPersonId, basis.via_parent) : 'an intermediate parent node';
    if (parentEdges[0]) {
      lines.push(`Supporting edge: parent ${personLabel(byPersonId, parentEdges[0].s)} -> ${personLabel(byPersonId, parentEdges[0].d)}.`);
    }
    if (parentEdges[1]) {
      lines.push(`Supporting edge: parent ${personLabel(byPersonId, parentEdges[1].s)} -> ${personLabel(byPersonId, parentEdges[1].d)}.`);
    }
    lines.push(`By the parent-of-parent rule via ${via}, the source node is inferred as grandparent-level kin of the target node.`);
    return lines;
  }

  if (edge.inference_rule === 'parent-sibling-aunt-uncle') {
    const support = basis.supporting_edges || [];
    const viaParent = basis.via_parent ? personLabel(byPersonId, basis.via_parent) : 'the child parent node';
    const viaSib = basis.via_parent_sibling ? personLabel(byPersonId, basis.via_parent_sibling) : 'the parent sibling node';
    if (support[0]) {
      lines.push(`Supporting edge: parent ${personLabel(byPersonId, support[0].s)} -> ${personLabel(byPersonId, support[0].d)}.`);
    }
    if (support[1]) {
      lines.push(`Supporting edge: sibling ${personLabel(byPersonId, support[1].s)} <-> ${personLabel(byPersonId, support[1].d)}.`);
    }
    lines.push(`Because ${viaSib} is sibling to ${viaParent}, the modeled relation to the child branch is inferred as aunt/uncle↔niece/nephew kin.`);
    return lines;
  }

  if (edge.inference_rule === 'children-of-siblings-cousin') {
    const cps = basis.child_parent_edges || [];
    if (cps[0]) lines.push(`Supporting edge: parent ${personLabel(byPersonId, cps[0].s)} -> ${personLabel(byPersonId, cps[0].d)}.`);
    if (cps[1]) lines.push(`Supporting edge: parent ${personLabel(byPersonId, cps[1].s)} -> ${personLabel(byPersonId, cps[1].d)}.`);
    if (basis.parent_sibling_edge) {
      lines.push(`Supporting edge: sibling ${personLabel(byPersonId, basis.parent_sibling_edge.s)} <-> ${personLabel(byPersonId, basis.parent_sibling_edge.d)}.`);
    }
    lines.push('Children of sibling parents are inferred as cousins in this model.');
    return lines;
  }

  if (edge.inference_rule === 'shared-parent-sibling') {
    if (basis.shared_parent) {
      lines.push(`Supporting node: shared parent ${personLabel(byPersonId, basis.shared_parent)}.`);
    }
    const pe = basis.parent_edges || [];
    pe.forEach(e => {
      lines.push(`Supporting edge: parent ${personLabel(byPersonId, e.s)} -> ${personLabel(byPersonId, e.d)}.`);
    });
    lines.push('Children sharing the same parent are inferred as siblings in this model.');
    return lines;
  }

  lines.push('Inference basis metadata indicates a derived family-rule relation for this pair.');
  return lines;
}

function makeDerivedInferenceDossier(edge, byPersonId) {
  const source = personLabel(byPersonId, edge.s);
  const target = personLabel(byPersonId, edge.d);
  const sources = (edge.evidence_refs || []).map(id => {
    const s = sourceById.get(id);
    const title = s ? s.title : 'Unknown source';
    return `- \`${id}\` (${title})`;
  }).join('\n') || '- none';

  const logicLines = derivedLogic(edge, byPersonId)
    .map((line, idx) => `${idx + 1}. ${line}`)
    .join('\n');

  return `# Inference Dossier

Edge key: \`${inferenceEdgeKey(edge)}\`  
Last updated: \`${DATE}\`  
Inference class: \`rule-derived\`

## 1) Edge identity
- Relation type: ${edge.t}
- Source node: ${source}
- Target node: ${target}
- Label: ${edge.l || '(no label)'}
- Current confidence marker (\`c/i/u\`): ${edge.c}
- Current grade (\`A/B/C/D\`): ${edge.confidence_grade || 'C'}

## 2) Why this specific pair is modeled
- Pair summary: This pair is derived from explicit modeled family edges using rule \`${edge.inference_rule || 'derived-rule'}\`.
- Historical/dynastic context: ${byPersonId.get(edge.s)?.dy || 'Unknown'} -> ${byPersonId.get(edge.d)?.dy || 'Unknown'} branch context.

## 3) Logic chain (pair-specific)
${logicLines}
4. Reason this implies the modeled relation for this exact pair: The derived-rule chain currently supports this pair as a reversible inferred relation.

## 4) Alternative interpretations
- Plausible competing relation class: broader \`kin\` with no precise generational label.
- Why current model is preferred: existing direct parent/sibling edges already encode enough structure for this derived relation.
- What evidence would switch interpretation: direct source wording that contradicts one or more supporting parent/sibling edges.

## 5) Verification checklist
- Evidence needed to promote to confirmed: explicit text stating this exact relation class for this exact pair.
- Evidence that would downgrade/remove: changes or contradictions in any supporting source edge in inference basis.
- Re-check interval: every ingest batch that changes parent/sibling edges.

## 6) Source basis
${sources}
- Claim excerpt notes: derived from inference basis metadata in edge object and supporting source-backed parent/sibling edges.

## 7) Integration notes
- \`src/data/inference-notes.js\` summary update needed: no
- Edge label/type update needed: only if direct textual evidence becomes available
- Canonical promotion candidate: no
`;
}

async function updatePersonCoverageCsv() {
  const path = join(ledgerDir, 'person-coverage.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!personIds.includes(row[idx.person_id])) continue;
    row[idx.dossier_status] = 'in_progress';
    row[idx.last_updated] = DATE;
    row[idx.notes] = 'Phase 1 batch D dossier draft created.';
  }
  await writeFile(path, toCsv(rows), 'utf8');
}

async function updateInferenceTrackerCsv() {
  const path = join(ledgerDir, 'inference-dossier-tracker.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const key = row[idx.edge_key];
    if (!inferenceTargetKeys.has(key)) continue;
    row[idx.dossier_status] = 'in_progress';
    row[idx.last_updated] = DATE;
    row[idx.notes] = 'Phase 1 batch D derived dossier drafted.';
  }
  await writeFile(path, toCsv(rows), 'utf8');
}

async function updateRelationshipLedgerCsv() {
  const path = join(ledgerDir, 'relationship-evidence-ledger.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const claimId = row[idx.claim_id];
    const u = relationshipUpdates.get(claimId);
    if (!u) continue;
    row[idx.claim_excerpt] = u.claim_excerpt;
    row[idx.citation_locator] = u.citation_locator;
    row[idx.access_date] = DATE;
    row[idx.review_status] = 'in_progress';
    row[idx.canonical_decision] = 'pending';
    row[idx.reviewer] = 'phase1-batch-d';
    row[idx.last_reviewed] = DATE;
    row[idx.notes] = u.notes;
  }
  await writeFile(path, toCsv(rows), 'utf8');
}

async function updateSourceQueueCsv() {
  const path = join(ledgerDir, 'source-expansion-queue.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const id = row[idx.queue_id];
    const u = queueUpdates.get(id);
    if (!u) continue;
    row[idx.status] = u.status;
    row[idx.last_updated] = DATE;
    row[idx.owner] = u.owner;
    row[idx.notes] = u.notes;
  }
  await writeFile(path, toCsv(rows), 'utf8');
}

async function upsertSourceExtractLog() {
  const path = join(ledgerDir, 'source-extract-log.csv');
  const rows = parseCsv(await readFile(path, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  const byId = new Map();
  for (let i = 1; i < rows.length; i++) {
    byId.set(rows[i][idx.extract_id], i);
  }
  for (const entry of sourceExtractEntries) {
    const rowData = header.map(col => entry[col] ?? '');
    if (byId.has(entry.extract_id)) {
      rows[byId.get(entry.extract_id)] = rowData;
    } else {
      rows.push(rowData);
    }
  }
  const body = rows.slice(1).sort((a, b) => a[idx.extract_id].localeCompare(b[idx.extract_id], undefined, { numeric: true }));
  await writeFile(path, toCsv([header, ...body]), 'utf8');
}

async function writePersonDossiers(dataset) {
  const byPersonId = byIdMap(dataset.people);
  await mkdir(peopleDir, { recursive: true });
  for (const id of personIds) {
    const person = byPersonId.get(id);
    if (!person) continue;
    const content = makePersonDossier(person, dataset.edges, byPersonId);
    await writeFile(join(peopleDir, `${id}.md`), content, 'utf8');
  }
}

async function writeDerivedInferenceDossiers(dataset) {
  const byPersonId = byIdMap(dataset.people);
  await mkdir(inferenceDir, { recursive: true });
  const keyToEdge = new Map(dataset.edges.map(e => [inferenceEdgeKey(e), e]));
  const trackerRows = parseCsv(await readFile(join(ledgerDir, 'inference-dossier-tracker.csv'), 'utf8'));
  const trackerHeader = trackerRows[0];
  const idx = Object.fromEntries(trackerHeader.map((h, i) => [h, i]));

  for (let i = 1; i < trackerRows.length; i++) {
    const row = trackerRows[i];
    const key = row[idx.edge_key];
    if (!inferenceTargetKeys.has(key)) continue;
    const edge = keyToEdge.get(key);
    if (!edge) continue;
    const content = makeDerivedInferenceDossier(edge, byPersonId);
    await writeFile(join(rootDir, row[idx.dossier_file]), content, 'utf8');
  }
}

async function main() {
  const dataset = getDataset('research');
  await writePersonDossiers(dataset);
  await updatePersonCoverageCsv();
  await updateRelationshipLedgerCsv();
  await updateInferenceTrackerCsv();
  await writeDerivedInferenceDossiers(dataset);
  await updateSourceQueueCsv();
  await upsertSourceExtractLog();
  console.log('Phase 1 batch D complete: dossiers and ledgers updated.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

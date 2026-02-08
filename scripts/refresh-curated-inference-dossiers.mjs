#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDataset } from '../src/data/sovereigns.merge.js';
import { sourceById } from '../src/data/sources.js';

const DATE = '2026-02-08';
const OWNER_NOTE = 'Phase 2 curated dossier hardening: pair-specific support chains, claim IDs, and verification criteria added.';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const ledgersDir = join(rootDir, 'docs', 'research-program', 'ledgers');

const relationshipLedgerPath = join(ledgersDir, 'relationship-evidence-ledger.csv');
const trackerPath = join(ledgersDir, 'inference-dossier-tracker.csv');

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

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function edgeKey(edge) {
  return `${edge.t}|${edge.s}|${edge.d}|${edge.l || ''}`;
}

function reverseEdgeKey(edge) {
  return `${edge.t}|${edge.d}|${edge.s}|${edge.l || ''}`;
}

function personLabel(byPersonId, id) {
  const person = byPersonId.get(id);
  if (!person) return id;
  const regnal = person.rg ? ` (${person.rg})` : '';
  return `${id} ${person.nm || '(unnamed)'}${regnal}`;
}

function short(text, max = 220) {
  const cleaned = String(text || '').replace(/\s+/g, ' ').trim();
  if (!cleaned) return '';
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 3)}...`;
}

function claimForEdge(edge, claimByEdgeKey) {
  const key = edgeKey(edge);
  if (claimByEdgeKey.has(key)) return claimByEdgeKey.get(key);
  if (edge.t !== 'parent') {
    const reversed = reverseEdgeKey(edge);
    if (claimByEdgeKey.has(reversed)) return claimByEdgeKey.get(reversed);
  }
  return null;
}

function buildAdjacency(directEdges) {
  const map = new Map();
  function push(from, to, edge) {
    if (!map.has(from)) map.set(from, []);
    map.get(from).push({ to, edge });
  }

  for (const edge of directEdges) {
    if (edge.t === 'parent') {
      push(edge.s, edge.d, edge);
      push(edge.d, edge.s, edge);
      continue;
    }
    push(edge.s, edge.d, edge);
    push(edge.d, edge.s, edge);
  }
  return map;
}

function findShortestPathUndirected(sourceId, targetId, adjacency, maxDepth = 4) {
  if (sourceId === targetId) return [];
  const queue = [{ node: sourceId, path: [] }];
  const seen = new Set([sourceId]);

  while (queue.length) {
    const current = queue.shift();
    if ((current.path || []).length >= maxDepth) continue;
    const neighbors = adjacency.get(current.node) || [];
    for (const neighbor of neighbors) {
      if (seen.has(neighbor.to)) continue;
      const nextPath = [...current.path, { from: current.node, to: neighbor.to, edge: neighbor.edge }];
      if (neighbor.to === targetId) return nextPath;
      seen.add(neighbor.to);
      queue.push({ node: neighbor.to, path: nextPath });
    }
  }
  return null;
}

function findDirectedParentPath(sourceId, targetId, directEdges, maxDepth = 4) {
  const parentAdj = new Map();
  for (const edge of directEdges) {
    if (edge.t !== 'parent') continue;
    if (!parentAdj.has(edge.s)) parentAdj.set(edge.s, []);
    parentAdj.get(edge.s).push(edge);
  }

  const queue = [{ node: sourceId, path: [] }];
  const seen = new Set([sourceId]);

  while (queue.length) {
    const current = queue.shift();
    if (current.path.length >= maxDepth) continue;
    const nextEdges = parentAdj.get(current.node) || [];
    for (const edge of nextEdges) {
      const child = edge.d;
      if (seen.has(child)) continue;
      const nextPath = [...current.path, { from: current.node, to: child, edge }];
      if (child === targetId) return nextPath;
      seen.add(child);
      queue.push({ node: child, path: nextPath });
    }
  }

  return null;
}

function edgeStepText(step, byPersonId, claimByEdgeKey) {
  const claim = claimForEdge(step.edge, claimByEdgeKey);
  const relLabel = step.edge.l ? ` [${step.edge.l}]` : '';
  const arrow = step.edge.t === 'parent' ? '->' : '<->';
  const claimId = claim?.claim_id || 'claim-id-missing';
  const source = claim?.primary_source_id || step.edge.evidence_refs?.[0] || 'source-missing';
  return `${step.edge.t} ${personLabel(byPersonId, step.from)} ${arrow} ${personLabel(byPersonId, step.to)}${relLabel} (${claimId}, ${source})`;
}

function localAnchorLines(edge, directEdges, byPersonId, claimByEdgeKey) {
  const candidates = directEdges
    .filter(d => d.s === edge.s || d.d === edge.s || d.s === edge.d || d.d === edge.d)
    .map(d => {
      const claim = claimForEdge(d, claimByEdgeKey);
      return {
        edge: d,
        claim,
        claimId: claim?.claim_id || 'claim-id-missing',
        grade: d.confidence_grade || '?'
      };
    })
    .sort((a, b) => {
      const rank = { A: 1, B: 2, C: 3, D: 4, '?': 9 };
      const delta = (rank[a.grade] || 9) - (rank[b.grade] || 9);
      if (delta !== 0) return delta;
      return a.claimId.localeCompare(b.claimId);
    });

  return unique(candidates.slice(0, 6).map(item => {
    const d = item.edge;
    const relLabel = d.l ? ` [${d.l}]` : '';
    const arrow = d.t === 'parent' ? '->' : '<->';
    const sourceId = item.claim?.primary_source_id || d.evidence_refs?.[0] || 'source-missing';
    return `${item.claimId}: ${d.t} ${personLabel(byPersonId, d.s)} ${arrow} ${personLabel(byPersonId, d.d)}${relLabel} (${sourceId}, grade ${d.confidence_grade || '?'})`;
  }));
}

function relationAlternativeHints(edge) {
  if (edge.t === 'sibling') {
    return [
      'Possible competing interpretation: half-sibling or cousin if shared-parent evidence is partial rather than full.',
      'Competing interpretation trigger: direct wording that uses non-sibling kin terminology for this pair.'
    ];
  }
  if (edge.t === 'parent') {
    return [
      'Possible competing interpretation: grandparent or older collateral guardian-line relation instead of direct parent.',
      'Competing interpretation trigger: explicit source naming a different immediate parent for the target node.'
    ];
  }
  return [
    'Possible competing interpretation: broader political/dynastic proximity without blood-kin specificity.',
    'Competing interpretation trigger: explicit source that either gives a narrower relation or denies direct family continuity.'
  ];
}

function buildSourceBasis(edge, inferredClaim) {
  const sourceIds = unique(edge.evidence_refs || []);
  const lines = sourceIds.map(id => {
    const src = sourceById.get(id);
    if (!src) return `- \`${id}\` (source metadata not found)`;
    return `- \`${id}\` (${src.title})`;
  });

  if (inferredClaim) {
    lines.push(`- Primary inferred claim row: ${inferredClaim.claim_id || '(id missing)'}`);
    lines.push(`- Inferred claim locator: ${short(inferredClaim.citation_locator, 260) || 'locator missing'}`);
  } else {
    lines.push('- Primary inferred claim row: not found in relationship ledger (requires reconciliation).');
  }

  return lines;
}

function makeDossier(edge, trackerKey, inferredClaim, path, anchors, byPersonId) {
  const src = personLabel(byPersonId, edge.s);
  const dst = personLabel(byPersonId, edge.d);
  const label = edge.l || '(no label)';
  const dyn = `${byPersonId.get(edge.s)?.dy || 'Unknown'} -> ${byPersonId.get(edge.d)?.dy || 'Unknown'}`;

  const altHints = relationAlternativeHints(edge);
  const pathLines = path && path.length
    ? path.map(step => edgeStepText(step, byPersonId, claimByEdgeKeyGlobal))
    : [];

  const logicLines = [];
  if (pathLines.length) {
    logicLines.push(`Shortest direct-claim support path (${pathLines.length} step${pathLines.length === 1 ? '' : 's'}) linking this pair:`);
    for (const line of pathLines) logicLines.push(`- ${line}`);
    logicLines.push('This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.');
  } else {
    logicLines.push('No short direct-claim path (<=4 steps) was found in the current direct-edge set for this exact node pair.');
    logicLines.push('Inference currently rests on curated branch-context interpretation plus source-level continuity wording, not a direct named relation statement.');
  }

  logicLines.push(`Current modeling choice remains \`inferred\` because explicit source wording that names \`${edge.t}\` for ${src} and ${dst} is still absent.`);

  const verificationItems = [
    `Promotion requirement: an A/B source statement explicitly naming ${src} and ${dst} with relation class \`${edge.t}\`${edge.l ? ` (${edge.l})` : ''}.`,
    'Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.',
    'Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster.'
  ];

  const integrationItems = [
    '`src/data/inference-notes.js` summary should be synced if relation wording changes after verification.',
    'Canonical promotion candidate: no (remains inferred until explicit pairwise wording is captured).',
    `Verification priority level: ${['B', 'C'].includes(edge.confidence_grade || '') ? 'high' : 'moderate'} (current grade ${edge.confidence_grade || '?'})`
  ];

  return `# Inference Dossier

Edge key: \`${trackerKey}\`  
Last updated: \`${DATE}\`  
Inference class: \`curated\`

## 1) Edge identity
- Relation type: ${edge.t}
- Source node: ${src}
- Target node: ${dst}
- Label: ${label}
- Current confidence marker (\`c/i/u\`): ${edge.c || 'i'}
- Current grade (\`A/B/C/D\`): ${edge.confidence_grade || '?'}

## 2) Why this specific pair is modeled
- Pair summary: ${src} and ${dst} are modeled as \`${edge.t}\`${edge.l ? ` with label \`${edge.l}\`` : ''} to preserve a targeted continuity claim without over-promoting certainty.
- Historical/dynastic context: ${dyn}
- Immediate direct-claim anchors around these nodes:
${anchors.length ? anchors.map(line => `- ${line}`).join('\n') : '- No direct local anchors found in current ledger rows.'}

## 3) Logic chain (pair-specific)
${logicLines.map((line, i) => `${i + 1}. ${line}`).join('\n')}

## 4) Alternative interpretations
- ${altHints[0]}
- ${altHints[1]}
- Model-retention rationale: keep the edge as inferred until explicit pairwise wording is located.

## 5) Verification checklist
- ${verificationItems.join('\n- ')}

## 6) Source basis
${buildSourceBasis(edge, inferredClaim).join('\n')}

## 7) Integration notes
- ${integrationItems.join('\n- ')}
`;
}

let claimByEdgeKeyGlobal = new Map();

async function main() {
  const dataset = getDataset('research');
  const byPersonId = new Map(dataset.people.map(person => [person.id, person]));

  const relationshipCsv = parseCsv(await readFile(relationshipLedgerPath, 'utf8'));
  const relationshipIdx = Object.fromEntries(relationshipCsv[0].map((h, i) => [h, i]));
  const claimByEdgeKey = new Map();
  for (const row of relationshipCsv.slice(1)) {
    const key = row[relationshipIdx.edge_key];
    if (!key || claimByEdgeKey.has(key)) continue;
    claimByEdgeKey.set(key, {
      claim_id: row[relationshipIdx.claim_id],
      edge_key: key,
      claim_type: row[relationshipIdx.claim_type],
      claim_excerpt: row[relationshipIdx.claim_excerpt],
      citation_locator: row[relationshipIdx.citation_locator],
      primary_source_id: row[relationshipIdx.primary_source_id],
      review_status: row[relationshipIdx.review_status],
      canonical_decision: row[relationshipIdx.canonical_decision]
    });
  }
  claimByEdgeKeyGlobal = claimByEdgeKey;

  const trackerCsv = parseCsv(await readFile(trackerPath, 'utf8'));
  const trackerHeader = trackerCsv[0];
  const trackerIdx = Object.fromEntries(trackerHeader.map((h, i) => [h, i]));

  const directEdges = dataset.edges.filter(edge => edge.c === 'c');
  const adjacency = buildAdjacency(directEdges);

  let rewritten = 0;
  for (let i = 1; i < trackerCsv.length; i++) {
    const row = trackerCsv[i];
    if (row[trackerIdx.inference_class] !== 'curated') continue;

    const key = row[trackerIdx.edge_key];
    const [relationType, sourceId, targetId, label = ''] = key.split('|');
    let inferredEdge = dataset.edges.find(edge => edgeKey(edge) === key);
    if (!inferredEdge) {
      if (relationType && sourceId && targetId && relationType !== 'parent') {
        inferredEdge = dataset.edges.find(
          edge => edge.t === relationType && edge.s === targetId && edge.d === sourceId && (edge.l || '') === label
        );
      }
    }
    if (!inferredEdge) continue;

    const canonicalEdge = {
      ...inferredEdge,
      t: relationType || inferredEdge.t,
      s: sourceId || inferredEdge.s,
      d: targetId || inferredEdge.d,
      l: label
    };

    const inferredClaim = claimByEdgeKey.get(key) || claimForEdge(canonicalEdge, claimByEdgeKey) || null;
    const anchors = localAnchorLines(canonicalEdge, directEdges, byPersonId, claimByEdgeKey);

    let path = null;
    if (canonicalEdge.t === 'parent') {
      path = findDirectedParentPath(canonicalEdge.s, canonicalEdge.d, directEdges, 4);
      if (!path) {
        path = findShortestPathUndirected(canonicalEdge.s, canonicalEdge.d, adjacency, 4);
      }
    } else {
      path = findShortestPathUndirected(canonicalEdge.s, canonicalEdge.d, adjacency, 4);
    }

    const dossierRelPath = row[trackerIdx.dossier_file];
    const dossierPath = join(rootDir, dossierRelPath);
    await mkdir(dirname(dossierPath), { recursive: true });
    await writeFile(dossierPath, makeDossier(canonicalEdge, key, inferredClaim, path, anchors, byPersonId), 'utf8');

    row[trackerIdx.last_updated] = DATE;
    row[trackerIdx.notes] = OWNER_NOTE;
    rewritten += 1;
  }

  await writeFile(trackerPath, toCsv(trackerCsv), 'utf8');
  console.log(`Curated inference dossier refresh complete: ${rewritten} files updated.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

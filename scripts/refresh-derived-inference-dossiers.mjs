#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDataset } from '../src/data/sovereigns.merge.js';
import { sourceById } from '../src/data/sources.js';

const inputDate = process.argv.slice(2).find(v => /^\d{4}-\d{2}-\d{2}$/.test(v));
const DATE = inputDate || new Date().toISOString().slice(0, 10);
const OWNER_NOTE = 'Phase 2 rule-derived dossier hardening: pair-specific support chain, supporting claim IDs, and explicit rule verification criteria added.';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const ledgersDir = join(rootDir, 'docs', 'research-program', 'ledgers');
const relationshipLedgerPath = join(ledgersDir, 'relationship-evidence-ledger.csv');
const trackerPath = join(ledgersDir, 'inference-dossier-tracker.csv');

const UNDIRECTED_TYPES = new Set(['sibling', 'spouse', 'kin']);

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

function unique(arr) {
  return [...new Set((arr || []).filter(Boolean))];
}

function edgeKey(edge) {
  return `${edge.t}|${edge.s}|${edge.d}|${edge.l || ''}`;
}

function reverseEdgeKey(edge) {
  return `${edge.t}|${edge.d}|${edge.s}|${edge.l || ''}`;
}

function short(text, max = 220) {
  const cleaned = String(text || '').replace(/\s+/g, ' ').trim();
  if (!cleaned) return '';
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 3)}...`;
}

function personLabel(byPersonId, id) {
  const person = byPersonId.get(id);
  if (!person) return id;
  const reg = person.rg ? ` (${person.rg})` : '';
  return `${id} ${person.nm || '(unnamed)'}${reg}`;
}

function splitTrackerKey(key) {
  const parts = String(key || '').split('|');
  return {
    t: parts[0] || '',
    s: parts[1] || '',
    d: parts[2] || '',
    l: parts.slice(3).join('|')
  };
}

function confidenceRank(grade) {
  if (grade === 'A') return 1;
  if (grade === 'B') return 2;
  if (grade === 'C') return 3;
  if (grade === 'D') return 4;
  return 9;
}

function edgeClaimFor(edge, claimByEdgeKey) {
  if (!edge) return null;
  const key = edgeKey(edge);
  if (claimByEdgeKey.has(key)) return claimByEdgeKey.get(key);
  if (UNDIRECTED_TYPES.has(edge.t)) {
    const rev = reverseEdgeKey(edge);
    if (claimByEdgeKey.has(rev)) return claimByEdgeKey.get(rev);
  }
  return null;
}

function findBestDatasetEdge(refEdge, datasetEdges) {
  if (!refEdge?.t || !refEdge?.s || !refEdge?.d) return null;

  const primary = datasetEdges.filter(edge => edge.t === refEdge.t && edge.s === refEdge.s && edge.d === refEdge.d);
  const reversed = UNDIRECTED_TYPES.has(refEdge.t)
    ? datasetEdges.filter(edge => edge.t === refEdge.t && edge.s === refEdge.d && edge.d === refEdge.s)
    : [];

  const candidates = [...primary, ...reversed]
    .filter(edge => edge.c === 'c')
    .sort((a, b) => confidenceRank(a.confidence_grade) - confidenceRank(b.confidence_grade));

  return candidates[0] || null;
}

function supportEdgesForRule(rule, basis) {
  if (!basis || typeof basis !== 'object') return [];
  if (rule === 'shared-parent-sibling') return (basis.parent_edges || []).filter(Boolean);
  if (rule === 'parent-of-parent-grandparent') return (basis.parent_edges || []).filter(Boolean);
  if (rule === 'parent-sibling-aunt-uncle') return (basis.supporting_edges || []).filter(Boolean);
  if (rule === 'children-of-siblings-cousin') {
    const list = [...(basis.child_parent_edges || [])];
    if (basis.parent_sibling_edge) list.push(basis.parent_sibling_edge);
    return list.filter(Boolean);
  }
  return [];
}

function ruleLabel(rule) {
  if (rule === 'shared-parent-sibling') return 'shared-parent-sibling';
  if (rule === 'parent-of-parent-grandparent') return 'parent-of-parent-grandparent';
  if (rule === 'parent-sibling-aunt-uncle') return 'parent-sibling-aunt-uncle';
  if (rule === 'children-of-siblings-cousin') return 'children-of-siblings-cousin';
  return 'derived-rule';
}

function ruleApplicationText(edge, rule, basis, byPersonId) {
  const src = personLabel(byPersonId, edge.s);
  const dst = personLabel(byPersonId, edge.d);

  if (rule === 'shared-parent-sibling') {
    const parent = basis?.shared_parent ? personLabel(byPersonId, basis.shared_parent) : 'the same parent node';
    return `Rule application (${ruleLabel(rule)}): because both endpoints share parent ${parent}, ${src} and ${dst} are modeled as inferred sibling-line kin.`;
  }
  if (rule === 'parent-of-parent-grandparent') {
    const via = basis?.via_parent ? personLabel(byPersonId, basis.via_parent) : 'an intermediate parent node';
    return `Rule application (${ruleLabel(rule)}): with source -> ${via} and ${via} -> target parent links, ${src} is modeled as inferred grandparent-line kin of ${dst}.`;
  }
  if (rule === 'parent-sibling-aunt-uncle') {
    const viaParent = basis?.via_parent ? personLabel(byPersonId, basis.via_parent) : 'a parent anchor';
    const viaSib = basis?.via_parent_sibling ? personLabel(byPersonId, basis.via_parent_sibling) : src;
    return `Rule application (${ruleLabel(rule)}): sibling(${viaParent}, ${viaSib}) plus parent(${viaParent}, child) yields inferred aunt/uncle-line kin between ${src} and ${dst}.`;
  }
  if (rule === 'children-of-siblings-cousin') {
    const pair = Array.isArray(basis?.via_parent_siblings) ? basis.via_parent_siblings : [];
    if (pair.length === 2) {
      return `Rule application (${ruleLabel(rule)}): children of sibling parents ${personLabel(byPersonId, pair[0])} and ${personLabel(byPersonId, pair[1])} are modeled as inferred cousin-line kin (${src} <-> ${dst}).`;
    }
    return `Rule application (${ruleLabel(rule)}): children of sibling parents are modeled as inferred cousin-line kin for this pair.`;
  }

  return `Rule application (${ruleLabel(rule)}): this inferred edge is derived from structured support edges and remains provisional until directly sourced wording is found.`;
}

function supportLine(supportEdge, claim, byPersonId) {
  const arrow = supportEdge.t === 'parent' ? '->' : '<->';
  const relationLabel = supportEdge.l ? ` [${supportEdge.l}]` : '';
  const claimId = claim?.claim_id || 'claim-id-missing';
  const source = claim?.primary_source_id || supportEdge.evidence_refs?.[0] || 'source-missing';
  const grade = supportEdge.confidence_grade || '?';
  const excerpt = short(claim?.claim_excerpt, 150);
  return `${supportEdge.t} ${personLabel(byPersonId, supportEdge.s)} ${arrow} ${personLabel(byPersonId, supportEdge.d)}${relationLabel} (${claimId}, ${source}, grade ${grade})${excerpt ? `; excerpt: ${excerpt}` : ''}`;
}

function alternativeLines(rule) {
  if (rule === 'shared-parent-sibling') {
    return [
      'Possible competing interpretation: half-sibling or cousin if one supporting parent edge is revised.',
      'Contradiction trigger: direct sources assigning a different parent to one endpoint.'
    ];
  }
  if (rule === 'parent-of-parent-grandparent') {
    return [
      'Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.',
      'Contradiction trigger: updated parent edges that break the two-step parent chain.'
    ];
  }
  if (rule === 'parent-sibling-aunt-uncle') {
    return [
      'Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.',
      'Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.'
    ];
  }
  if (rule === 'children-of-siblings-cousin') {
    return [
      'Possible competing interpretation: more distant collateral kin if parent-sibling linkage weakens.',
      'Contradiction trigger: changes to either child-parent edge or the parent-sibling edge.'
    ];
  }
  return [
    'Possible competing interpretation: broad kin proximity without the current derived label.',
    'Contradiction trigger: any revision that invalidates the support-edge rule chain.'
  ];
}

function verificationLines(edge, rule, byPersonId) {
  const src = personLabel(byPersonId, edge.s);
  const dst = personLabel(byPersonId, edge.d);
  const labelSuffix = edge.l ? ` (${edge.l})` : '';
  return [
    `Promotion requirement: explicit A/B source wording naming ${src} and ${dst} as ${edge.t}${labelSuffix}.`,
    `Downgrade/removal trigger: source-backed changes to any support edge used by rule ${ruleLabel(rule)}.`,
    'Review cadence: recompute after any parent/sibling edge change in this local branch.'
  ];
}

function sourceBasisLines(supportClaims, inferredClaim) {
  const sourceIds = unique([
    'SRC-DERIVED-RULES',
    ...supportClaims.map(c => c?.primary_source_id).filter(Boolean),
    inferredClaim?.primary_source_id
  ]);

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

function buildDossier(edge, trackerKey, rule, supportLines, inferredClaim, supportClaims, byPersonId, dynContext) {
  const src = personLabel(byPersonId, edge.s);
  const dst = personLabel(byPersonId, edge.d);
  const label = edge.l || '(no label)';
  const alternatives = alternativeLines(rule);
  const verifications = verificationLines(edge, rule, byPersonId);
  const sourceBasis = sourceBasisLines(supportClaims, inferredClaim);

  const logicLines = [];
  if (supportLines.length) {
    logicLines.push(`Support set for rule ${ruleLabel(rule)} resolved as follows.`);
    supportLines.forEach(line => logicLines.push(`Supporting edge: ${line}`));
    logicLines.push(ruleApplicationText(edge, rule, edge.inference_basis || {}, byPersonId));
  } else {
    logicLines.push(`Supporting edge: unresolved from inference basis metadata for rule ${ruleLabel(rule)}.`);
    logicLines.push('This dossier should be re-generated after edge-basis reconciliation.');
  }
  logicLines.push(`Current modeling remains inferred because direct source text naming ${edge.t}${edge.l ? ` (${edge.l})` : ''} for this exact pair is not yet captured.`);

  return `# Inference Dossier

Edge key: \`${trackerKey}\`  
Last updated: \`${DATE}\`  
Inference class: \`rule-derived\`

## 1) Edge identity
- Relation type: ${edge.t}
- Source node: ${src}
- Target node: ${dst}
- Label: ${label}
- Current confidence marker (\`c/i/u\`): ${edge.c || 'i'}
- Current grade (\`A/B/C/D\`): ${edge.confidence_grade || '?'}

## 2) Why this specific pair is modeled
- Pair summary: ${src} and ${dst} are modeled as inferred ${edge.t}${edge.l ? ` (${edge.l})` : ''} through rule \`${ruleLabel(rule)}\`.
- Historical/dynastic context: ${dynContext}
- Rule basis status: ${supportLines.length ? `resolved (${supportLines.length} supporting edge${supportLines.length === 1 ? '' : 's'})` : 'unresolved support edges'}.

## 3) Logic chain (pair-specific)
${logicLines.map((line, i) => `${i + 1}. ${line}`).join('\n')}

## 4) Alternative interpretations
- ${alternatives[0]}
- ${alternatives[1]}
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- ${verifications.join('\n- ')}

## 6) Source basis
${sourceBasis.join('\n')}

## 7) Integration notes
- Rule metadata source: \`edge.inference_basis\` + \`edge.inference_rule\` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.
`;
}

async function main() {
  const dataset = getDataset('research');
  const byPersonId = new Map(dataset.people.map(person => [person.id, person]));

  const relationshipCsv = parseCsv(await readFile(relationshipLedgerPath, 'utf8'));
  const relIdx = Object.fromEntries(relationshipCsv[0].map((h, i) => [h, i]));
  const claimByEdgeKey = new Map();
  for (const row of relationshipCsv.slice(1)) {
    const key = row[relIdx.edge_key];
    if (!key || claimByEdgeKey.has(key)) continue;
    claimByEdgeKey.set(key, {
      claim_id: row[relIdx.claim_id],
      edge_key: key,
      claim_type: row[relIdx.claim_type],
      claim_excerpt: row[relIdx.claim_excerpt],
      citation_locator: row[relIdx.citation_locator],
      primary_source_id: row[relIdx.primary_source_id],
      review_status: row[relIdx.review_status],
      canonical_decision: row[relIdx.canonical_decision]
    });
  }

  const trackerCsv = parseCsv(await readFile(trackerPath, 'utf8'));
  const trackerHeader = trackerCsv[0];
  const trackerIdx = Object.fromEntries(trackerHeader.map((h, i) => [h, i]));

  let rewritten = 0;
  for (let i = 1; i < trackerCsv.length; i++) {
    const row = trackerCsv[i];
    if (row[trackerIdx.inference_class] !== 'rule-derived') continue;

    const key = row[trackerIdx.edge_key];
    const parsed = splitTrackerKey(key);
    const rule = row[trackerIdx.inference_rule] || '';

    let edge = dataset.edges.find(e => edgeKey(e) === key);
    if (!edge && parsed.t && parsed.s && parsed.d && parsed.t !== 'parent') {
      edge = dataset.edges.find(e => e.t === parsed.t && e.s === parsed.d && e.d === parsed.s && (e.l || '') === parsed.l);
    }
    if (!edge) continue;

    const canonicalEdge = {
      ...edge,
      t: parsed.t || edge.t,
      s: parsed.s || edge.s,
      d: parsed.d || edge.d,
      l: parsed.l
    };

    const basisEdges = supportEdgesForRule(rule, edge.inference_basis || {});
    const supportResolved = basisEdges
      .map(ref => findBestDatasetEdge(ref, dataset.edges))
      .filter(Boolean);

    const supportClaims = supportResolved.map(support => edgeClaimFor(support, claimByEdgeKey));
    const supportLines = supportResolved.map((support, idx) => supportLine(support, supportClaims[idx], byPersonId));

    const inferredClaim = claimByEdgeKey.get(key) || edgeClaimFor(canonicalEdge, claimByEdgeKey) || null;
    const dynContext = `${byPersonId.get(canonicalEdge.s)?.dy || 'Unknown'} -> ${byPersonId.get(canonicalEdge.d)?.dy || 'Unknown'}`;

    const dossierRelPath = row[trackerIdx.dossier_file];
    const dossierPath = join(rootDir, dossierRelPath);
    await mkdir(dirname(dossierPath), { recursive: true });
    await writeFile(
      dossierPath,
      buildDossier(canonicalEdge, key, rule, supportLines, inferredClaim, supportClaims, byPersonId, dynContext),
      'utf8'
    );

    row[trackerIdx.last_updated] = DATE;
    row[trackerIdx.notes] = OWNER_NOTE;
    rewritten += 1;
  }

  await writeFile(trackerPath, toCsv(trackerCsv), 'utf8');
  console.log(`Derived inference dossier refresh complete: ${rewritten} files updated.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

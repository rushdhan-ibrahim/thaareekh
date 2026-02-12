#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { cp, mkdtemp, mkdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..', '..');
const FIXED_DATE = '2026-02-12';

function run(cmd, args, cwd = projectRoot) {
  const out = spawnSync(cmd, args, {
    cwd,
    encoding: 'utf8'
  });
  if (out.status !== 0) {
    const details = [out.stdout, out.stderr].filter(Boolean).join('\n').trim();
    throw new Error(`Command failed: ${cmd} ${args.join(' ')}\n${details}`);
  }
  return out.stdout.trim();
}

async function prepareWorkspace(dest) {
  await mkdir(dest, { recursive: true });
  await cp(join(projectRoot, 'package.json'), join(dest, 'package.json'));
  await mkdir(join(dest, 'scripts'), { recursive: true });
  await cp(
    join(projectRoot, 'scripts', 'sync-curated-inference-notes.mjs'),
    join(dest, 'scripts', 'sync-curated-inference-notes.mjs')
  );
  await cp(
    join(projectRoot, 'docs', 'research-program', 'ledgers', 'inference-dossier-tracker.csv'),
    join(dest, 'docs', 'research-program', 'ledgers', 'inference-dossier-tracker.csv')
  );
  await cp(
    join(projectRoot, 'docs', 'research-program', 'inferences'),
    join(dest, 'docs', 'research-program', 'inferences'),
    { recursive: true }
  );
  await mkdir(join(dest, 'src', 'data'), { recursive: true });
  await cp(
    join(projectRoot, 'src', 'data', 'inference-notes.js'),
    join(dest, 'src', 'data', 'inference-notes.js')
  );
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
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

function splitKey(edgeKey) {
  const parts = String(edgeKey || '').split('|');
  return {
    t: parts[0] || '',
    s: parts[1] || '',
    d: parts[2] || '',
    l: parts.slice(3).join('|')
  };
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.keys(value)
      .sort((a, b) => a.localeCompare(b))
      .map(key => [key, stableValue(value[key])])
  );
}

async function main() {
  const tempRoot = await mkdtemp(join(tmpdir(), 'maldives-sync-inference-notes-parity-'));
  const nodeWorkspace = join(tempRoot, 'node-workspace');
  const rustWorkspace = join(tempRoot, 'rust-workspace');
  let keepTemp = false;

  try {
    await Promise.all([prepareWorkspace(nodeWorkspace), prepareWorkspace(rustWorkspace)]);

    run('node', ['scripts/sync-curated-inference-notes.mjs', FIXED_DATE], nodeWorkspace);
    run(
      'cargo',
      [
        'run',
        '-q',
        '-p',
        'maldives-research-cli',
        '--',
        'sync-inference-notes',
        rustWorkspace,
        FIXED_DATE
      ],
      projectRoot
    );

    const trackerPath = join(
      nodeWorkspace,
      'docs',
      'research-program',
      'ledgers',
      'inference-dossier-tracker.csv'
    );
    const trackerCsv = parseCsv(await readFile(trackerPath, 'utf8'));
    const trackerIdx = Object.fromEntries(trackerCsv[0].map((h, i) => [h, i]));
    const keys = [...new Set(
      trackerCsv
        .slice(1)
        .filter(row => (row[trackerIdx.edge_key] || '').trim() && (row[trackerIdx.dossier_file] || '').trim())
        .map(row => row[trackerIdx.edge_key])
    )];

    const nodeModule = await import(pathToFileURL(join(nodeWorkspace, 'src', 'data', 'inference-notes.js')).href);
    const rustModule = await import(pathToFileURL(join(rustWorkspace, 'src', 'data', 'inference-notes.js')).href);

    const issues = [];
    for (const key of keys) {
      const edge = splitKey(key);
      const nodeNote = stableValue(nodeModule.getInferenceNote(edge));
      const rustNote = stableValue(rustModule.getInferenceNote(edge));
      if (JSON.stringify(nodeNote) !== JSON.stringify(rustNote)) {
        issues.push(`note mismatch for key ${key}`);
      }
      const nodePath = nodeModule.getInferenceDossierPath(edge);
      const rustPath = rustModule.getInferenceDossierPath(edge);
      if (nodePath !== rustPath) {
        issues.push(`dossier path mismatch for key ${key}`);
      }
    }

    if (issues.length) {
      keepTemp = true;
      console.error(`Sync inference notes parity failed (${issues.length})`);
      for (const issue of issues.slice(0, 40)) {
        console.error(`- ${issue}`);
      }
      if (issues.length > 40) {
        console.error(`- ... ${issues.length - 40} more issue(s)`);
      }
      console.error(`Node workspace: ${nodeWorkspace}`);
      console.error(`Rust workspace: ${rustWorkspace}`);
      process.exit(1);
    }

    console.log('Sync inference notes parity passed (Node == Rust semantic output).');
  } finally {
    if (!keepTemp) {
      await rm(tempRoot, { recursive: true, force: true });
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

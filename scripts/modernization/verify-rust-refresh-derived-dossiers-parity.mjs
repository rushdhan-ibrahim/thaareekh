#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { cp, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDataset } from '../../src/data/sovereigns.merge.js';
import { sources } from '../../src/data/sources.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..', '..');

function parseDateArg(args) {
  const idx = args.indexOf('--date');
  if (idx >= 0 && args[idx + 1] && /^\d{4}-\d{2}-\d{2}$/.test(args[idx + 1])) {
    return args[idx + 1];
  }
  return '2026-02-12';
}

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

async function prepareWorkspace(dest) {
  await mkdir(dest, { recursive: true });
  await cp(join(projectRoot, 'package.json'), join(dest, 'package.json'));
  await mkdir(join(dest, 'scripts'), { recursive: true });
  await cp(
    join(projectRoot, 'scripts', 'refresh-derived-inference-dossiers.mjs'),
    join(dest, 'scripts', 'refresh-derived-inference-dossiers.mjs')
  );
  await mkdir(join(dest, 'src'), { recursive: true });
  await cp(join(projectRoot, 'src', 'data'), join(dest, 'src', 'data'), { recursive: true });
  await cp(
    join(projectRoot, 'docs', 'research-program', 'ledgers'),
    join(dest, 'docs', 'research-program', 'ledgers'),
    { recursive: true }
  );
  await cp(
    join(projectRoot, 'docs', 'research-program', 'inferences'),
    join(dest, 'docs', 'research-program', 'inferences'),
    { recursive: true }
  );
}

async function writeFixtures(tempRoot) {
  const ds = getDataset('research');
  const datasetPayload = {
    generated_at: new Date().toISOString(),
    mode: ds.mode,
    people: ds.people,
    edges: ds.edges
  };

  const fixtureDir = join(tempRoot, 'fixtures');
  await mkdir(fixtureDir, { recursive: true });
  const datasetPath = join(fixtureDir, 'research.json');
  const sourcesPath = join(fixtureDir, 'sources.json');
  await Promise.all([
    writeFile(datasetPath, `${JSON.stringify(datasetPayload, null, 2)}\n`, 'utf8'),
    writeFile(sourcesPath, `${JSON.stringify(sources, null, 2)}\n`, 'utf8')
  ]);
  return { datasetPath, sourcesPath };
}

async function main() {
  const date = parseDateArg(process.argv.slice(2));
  const tempRoot = await mkdtemp(join(tmpdir(), 'maldives-derived-dossiers-parity-'));
  const nodeWorkspace = join(tempRoot, 'node-workspace');
  const rustWorkspace = join(tempRoot, 'rust-workspace');
  let keepTemp = false;

  try {
    await Promise.all([prepareWorkspace(nodeWorkspace), prepareWorkspace(rustWorkspace)]);
    const { datasetPath, sourcesPath } = await writeFixtures(tempRoot);

    run('node', ['scripts/refresh-derived-inference-dossiers.mjs', date], nodeWorkspace);
    run(
      'cargo',
      [
        'run',
        '-q',
        '-p',
        'maldives-research-cli',
        '--',
        'refresh-derived-inference-dossiers',
        datasetPath,
        sourcesPath,
        rustWorkspace,
        date
      ],
      projectRoot
    );

    const trackerNodePath = join(
      nodeWorkspace,
      'docs',
      'research-program',
      'ledgers',
      'inference-dossier-tracker.csv'
    );
    const trackerRustPath = join(
      rustWorkspace,
      'docs',
      'research-program',
      'ledgers',
      'inference-dossier-tracker.csv'
    );
    const [trackerNode, trackerRust] = await Promise.all([
      readFile(trackerNodePath, 'utf8'),
      readFile(trackerRustPath, 'utf8')
    ]);

    const issues = [];
    if (trackerNode !== trackerRust) {
      issues.push('inference-dossier-tracker.csv mismatch');
    }

    const parsed = parseCsv(trackerNode);
    const idx = Object.fromEntries((parsed[0] || []).map((h, i) => [h, i]));
    const dossierFiles = parsed
      .slice(1)
      .filter(row => row[idx.inference_class] === 'rule-derived' && (row[idx.dossier_file] || '').trim())
      .map(row => row[idx.dossier_file]);

    for (const relPath of dossierFiles) {
      const nodePath = join(nodeWorkspace, relPath);
      const rustPath = join(rustWorkspace, relPath);
      const [nodeText, rustText] = await Promise.all([
        readFile(nodePath, 'utf8'),
        readFile(rustPath, 'utf8')
      ]);
      if (nodeText !== rustText) {
        issues.push(`dossier mismatch: ${relPath}`);
      }
    }

    if (issues.length) {
      keepTemp = true;
      console.error(`Refresh derived dossiers parity failed (${issues.length})`);
      for (const issue of issues.slice(0, 120)) {
        console.error(`- ${issue}`);
      }
      if (issues.length > 120) {
        console.error(`- ... ${issues.length - 120} more issue(s)`);
      }
      console.error(`Node workspace: ${nodeWorkspace}`);
      console.error(`Rust workspace: ${rustWorkspace}`);
      process.exit(1);
    }

    console.log('Refresh derived dossiers parity passed (Node == Rust outputs).');
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

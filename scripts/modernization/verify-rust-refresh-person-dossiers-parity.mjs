#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, mkdtemp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
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

async function prepareWorkspace(dest) {
  await mkdir(dest, { recursive: true });
  await cp(join(projectRoot, 'package.json'), join(dest, 'package.json'));
  await mkdir(join(dest, 'scripts'), { recursive: true });
  await cp(
    join(projectRoot, 'scripts', 'refresh-person-dossiers.mjs'),
    join(dest, 'scripts', 'refresh-person-dossiers.mjs')
  );
  await mkdir(join(dest, 'src'), { recursive: true });
  await cp(join(projectRoot, 'src', 'data'), join(dest, 'src', 'data'), { recursive: true });
  await cp(
    join(projectRoot, 'docs', 'research-program', 'ledgers'),
    join(dest, 'docs', 'research-program', 'ledgers'),
    { recursive: true }
  );
  await cp(
    join(projectRoot, 'docs', 'research-program', 'people'),
    join(dest, 'docs', 'research-program', 'people'),
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

async function walkFiles(root) {
  try {
    const st = await stat(root);
    if (!st.isDirectory()) return [];
  } catch {
    return [];
  }

  const files = [];
  const stack = [root];
  while (stack.length) {
    const current = stack.pop();
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.isFile()) files.push(full);
    }
  }
  files.sort((a, b) => a.localeCompare(b));
  return files;
}

async function treeDigestMap(base) {
  const files = await walkFiles(base);
  const map = new Map();
  for (const file of files) {
    const rel = relative(base, file);
    const payload = await readFile(file);
    const hash = createHash('sha256').update(payload).digest('hex');
    map.set(rel, hash);
  }
  return map;
}

function compareDigestMaps(label, nodeMap, rustMap, issues) {
  const keys = new Set([...nodeMap.keys(), ...rustMap.keys()]);
  for (const key of keys) {
    if (!nodeMap.has(key)) {
      issues.push(`${label}: rust-only file ${key}`);
      continue;
    }
    if (!rustMap.has(key)) {
      issues.push(`${label}: node-only file ${key}`);
      continue;
    }
    if (nodeMap.get(key) !== rustMap.get(key)) {
      issues.push(`${label}: content mismatch ${key}`);
    }
  }
}

async function main() {
  const date = parseDateArg(process.argv.slice(2));
  const tempRoot = await mkdtemp(join(tmpdir(), 'maldives-person-dossiers-parity-'));
  const nodeWorkspace = join(tempRoot, 'node-workspace');
  const rustWorkspace = join(tempRoot, 'rust-workspace');
  let keepTemp = false;

  try {
    await Promise.all([prepareWorkspace(nodeWorkspace), prepareWorkspace(rustWorkspace)]);
    const { datasetPath, sourcesPath } = await writeFixtures(tempRoot);

    run('node', ['scripts/refresh-person-dossiers.mjs', date], nodeWorkspace);
    run(
      'cargo',
      [
        'run',
        '-q',
        '-p',
        'maldives-research-cli',
        '--',
        'refresh-person-dossiers',
        datasetPath,
        sourcesPath,
        rustWorkspace,
        date
      ],
      projectRoot
    );

    const issues = [];
    const [nodeLedger, rustLedger] = await Promise.all([
      readFile(
        join(nodeWorkspace, 'docs', 'research-program', 'ledgers', 'person-coverage.csv'),
        'utf8'
      ),
      readFile(
        join(rustWorkspace, 'docs', 'research-program', 'ledgers', 'person-coverage.csv'),
        'utf8'
      )
    ]);
    if (nodeLedger !== rustLedger) {
      issues.push('person-coverage.csv mismatch');
    }

    const peopleNode = await treeDigestMap(join(nodeWorkspace, 'docs', 'research-program', 'people'));
    const peopleRust = await treeDigestMap(join(rustWorkspace, 'docs', 'research-program', 'people'));
    compareDigestMaps('people', peopleNode, peopleRust, issues);

    if (issues.length) {
      keepTemp = true;
      console.error(`Refresh person dossiers parity failed (${issues.length})`);
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

    console.log('Refresh person dossiers parity passed (Node == Rust outputs).');
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

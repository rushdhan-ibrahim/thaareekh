#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, mkdtemp, mkdir, readFile, readdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..', '..');

function parseDateArg(args) {
  const idx = args.indexOf('--date');
  if (idx >= 0 && args[idx + 1] && /^\d{4}-\d{2}-\d{2}$/.test(args[idx + 1])) {
    return args[idx + 1];
  }
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function run(cmd, args, cwd) {
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
  await cp(join(projectRoot, 'src', 'data'), join(dest, 'src', 'data'), { recursive: true });
  await cp(
    join(projectRoot, 'docs', 'research-program'),
    join(dest, 'docs', 'research-program'),
    { recursive: true }
  );
  await mkdir(join(dest, 'scripts'), { recursive: true });
  await cp(
    join(projectRoot, 'scripts', 'reconcile-research-ledgers.mjs'),
    join(dest, 'scripts', 'reconcile-research-ledgers.mjs')
  );
}

async function generateDataset(workspaceRoot) {
  const code = `
import { mkdirSync, writeFileSync } from 'node:fs';
import { getDataset } from './src/data/sovereigns.merge.js';
const ds = getDataset('research');
mkdirSync('./docs/modernization/baselines/datasets', { recursive: true });
const out = {
  generated_at: new Date().toISOString(),
  mode: ds.mode,
  people: ds.people,
  edges: ds.edges
};
writeFileSync('./docs/modernization/baselines/datasets/research.json', JSON.stringify(out, null, 2) + '\\n', 'utf8');
`;

  run('node', ['--input-type=module', '-e', code], workspaceRoot);
}

async function walkFiles(root) {
  try {
    const st = await stat(root);
    if (!st.isDirectory()) {
      return [];
    }
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
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile()) {
        files.push(full);
      }
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

async function compareCsvIgnoringOrder(label, nodeFile, rustFile, issues) {
  const [nodeText, rustText] = await Promise.all([readFile(nodeFile, 'utf8'), readFile(rustFile, 'utf8')]);
  const nodeRows = parseCsv(nodeText);
  const rustRows = parseCsv(rustText);

  const nodeHeader = nodeRows[0] || [];
  const rustHeader = rustRows[0] || [];
  if (JSON.stringify(nodeHeader) !== JSON.stringify(rustHeader)) {
    issues.push(`${label}: header mismatch`);
    return;
  }

  const nodeData = nodeRows
    .slice(1)
    .map(row => row.join('\u001f'))
    .sort((a, b) => a.localeCompare(b));
  const rustData = rustRows
    .slice(1)
    .map(row => row.join('\u001f'))
    .sort((a, b) => a.localeCompare(b));

  if (nodeData.length !== rustData.length) {
    issues.push(`${label}: row count mismatch ${nodeData.length} != ${rustData.length}`);
    return;
  }

  for (let i = 0; i < nodeData.length; i += 1) {
    if (nodeData[i] !== rustData[i]) {
      issues.push(`${label}: row content mismatch`);
      return;
    }
  }
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
    const nodeHash = nodeMap.get(key);
    const rustHash = rustMap.get(key);
    if (nodeHash !== rustHash) {
      issues.push(`${label}: content mismatch ${key}`);
    }
  }
}

async function main() {
  const date = parseDateArg(process.argv.slice(2));
  const tempRoot = await mkdtemp(join(tmpdir(), 'maldives-reconcile-parity-'));
  const nodeWorkspace = join(tempRoot, 'node-workspace');
  const rustWorkspace = join(tempRoot, 'rust-workspace');
  let keepTemp = false;

  try {
    await Promise.all([prepareWorkspace(nodeWorkspace), prepareWorkspace(rustWorkspace)]);

    run('node', ['scripts/reconcile-research-ledgers.mjs', date], nodeWorkspace);

    await generateDataset(rustWorkspace);
    run(
      'cargo',
      [
        'run',
        '-q',
        '-p',
        'maldives-research-cli',
        '--',
        'reconcile-ledgers',
        join(rustWorkspace, 'docs', 'modernization', 'baselines', 'datasets', 'research.json'),
        rustWorkspace,
        date
      ],
      projectRoot
    );

    const issues = [];

    const ledgersBaseNode = join(nodeWorkspace, 'docs', 'research-program', 'ledgers');
    const ledgersBaseRust = join(rustWorkspace, 'docs', 'research-program', 'ledgers');
    const ledgersNode = await treeDigestMap(ledgersBaseNode);
    const ledgersRust = await treeDigestMap(ledgersBaseRust);
    const ledgerKeys = new Set([...ledgersNode.keys(), ...ledgersRust.keys()]);
    for (const key of ledgerKeys) {
      if (!ledgersNode.has(key)) {
        issues.push(`ledgers: rust-only file ${key}`);
        continue;
      }
      if (!ledgersRust.has(key)) {
        issues.push(`ledgers: node-only file ${key}`);
        continue;
      }
      const nodeFile = join(ledgersBaseNode, key);
      const rustFile = join(ledgersBaseRust, key);
      if (key.endsWith('.csv')) {
        await compareCsvIgnoringOrder(`ledgers:${key}`, nodeFile, rustFile, issues);
      } else if (ledgersNode.get(key) !== ledgersRust.get(key)) {
        issues.push(`ledgers: content mismatch ${key}`);
      }
    }

    const peopleNode = await treeDigestMap(join(nodeWorkspace, 'docs', 'research-program', 'people'));
    const peopleRust = await treeDigestMap(join(rustWorkspace, 'docs', 'research-program', 'people'));
    compareDigestMaps('people', peopleNode, peopleRust, issues);

    if (issues.length) {
      keepTemp = true;
      console.error(`Reconcile parity failed (${issues.length})`);
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

    console.log('Reconcile parity passed (Node == Rust outputs for ledgers and people).');
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

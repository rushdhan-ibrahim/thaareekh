#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { cp, mkdtemp, mkdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..', '..');
const FIXED_DATE = '2026-02-12';

function run(cmd, args, cwd) {
  const out = spawnSync(cmd, args, { cwd, encoding: 'utf8' });
  return {
    status: out.status ?? 1,
    stdout: out.stdout || '',
    stderr: out.stderr || ''
  };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeOutput(text, rootPath) {
  return text
    .replace(new RegExp(escapeRegExp(`/private${rootPath}`), 'g'), '<ROOT>')
    .replace(new RegExp(escapeRegExp(rootPath), 'g'), '<ROOT>')
    .replace(/\r\n/g, '\n')
    .trim();
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
    join(projectRoot, 'scripts', 'research-baseline-report.mjs'),
    join(dest, 'scripts', 'research-baseline-report.mjs')
  );
}

async function generateFixtures(workspaceRoot) {
  const code = `
import { mkdirSync, writeFileSync } from 'node:fs';
import { getDataset } from './src/data/sovereigns.merge.js';
import { sources } from './src/data/sources.js';
import { officeCatalog, officeTimeline } from './src/data/offices.js';
import { storyTrails } from './src/data/storytrails.js';
mkdirSync('./docs/modernization/baselines/datasets', { recursive: true });
const ds = getDataset('research');
writeFileSync('./docs/modernization/baselines/datasets/research.json', JSON.stringify({
  generated_at: new Date().toISOString(),
  mode: ds.mode,
  people: ds.people,
  edges: ds.edges
}, null, 2) + '\\n', 'utf8');
writeFileSync('./docs/modernization/baselines/datasets/sources.json', JSON.stringify({
  generated_at: new Date().toISOString(),
  mode: 'research',
  sources
}, null, 2) + '\\n', 'utf8');
writeFileSync('./docs/modernization/baselines/datasets/ui-reference.json', JSON.stringify({
  generated_at: new Date().toISOString(),
  officeCatalog,
  officeTimeline,
  officeByIdSize: officeCatalog.length,
  storyTrails
}, null, 2) + '\\n', 'utf8');
`;

  const out = run('node', ['--input-type=module', '-e', code], workspaceRoot);
  if (out.status !== 0) {
    const details = [out.stdout, out.stderr].filter(Boolean).join('\n');
    throw new Error(`Fixture generation failed:\n${details}`);
  }
}

async function readText(path) {
  return readFile(path, 'utf8');
}

function firstDiffDetail(a, b) {
  const aLines = a.replace(/\r\n/g, '\n').split('\n');
  const bLines = b.replace(/\r\n/g, '\n').split('\n');
  const max = Math.max(aLines.length, bLines.length);
  for (let i = 0; i < max; i += 1) {
    if ((aLines[i] ?? '') !== (bLines[i] ?? '')) {
      return {
        line: i + 1,
        node: aLines[i] ?? '<EOF>',
        rust: bLines[i] ?? '<EOF>'
      };
    }
  }
  return null;
}

async function runScenario(tempRoot, withLedgers) {
  const name = withLedgers ? 'with-ledgers' : 'no-ledgers';
  const nodeWorkspace = join(tempRoot, `${name}-node`);
  const rustWorkspace = join(tempRoot, `${name}-rust`);
  await prepareWorkspace(nodeWorkspace);
  await prepareWorkspace(rustWorkspace);
  await generateFixtures(nodeWorkspace);
  await generateFixtures(rustWorkspace);

  const nodeArgs = [
    'scripts/research-baseline-report.mjs',
    '--date',
    FIXED_DATE,
    ...(withLedgers ? ['--write-ledgers'] : [])
  ];
  const rustArgs = [
    'run',
    '-q',
    '-p',
    'maldives-research-cli',
    '--',
    'research-baseline-report',
    join(rustWorkspace, 'docs', 'modernization', 'baselines', 'datasets', 'research.json'),
    join(rustWorkspace, 'docs', 'modernization', 'baselines', 'datasets', 'sources.json'),
    join(rustWorkspace, 'docs', 'modernization', 'baselines', 'datasets', 'ui-reference.json'),
    rustWorkspace,
    FIXED_DATE,
    ...(withLedgers ? ['--write-ledgers'] : [])
  ];

  const nodeOut = run('node', nodeArgs, nodeWorkspace);
  if (nodeOut.status !== 0) {
    const details = [nodeOut.stdout, nodeOut.stderr].filter(Boolean).join('\n');
    throw new Error(`Node scenario (${name}) failed:\n${details}`);
  }

  const rustOut = run('cargo', rustArgs, projectRoot);
  if (rustOut.status !== 0) {
    const details = [rustOut.stdout, rustOut.stderr].filter(Boolean).join('\n');
    throw new Error(`Rust scenario (${name}) failed:\n${details}`);
  }

  const nodeStdout = normalizeOutput(nodeOut.stdout, nodeWorkspace);
  const rustStdout = normalizeOutput(rustOut.stdout, rustWorkspace);
  if (nodeStdout !== rustStdout) {
    throw new Error(
      `stdout mismatch in scenario (${name}):\n--- node ---\n${nodeStdout}\n--- rust ---\n${rustStdout}`
    );
  }

  const baselineRel = `docs/research-program/baseline-metrics-${FIXED_DATE}.md`;
  const latestRel = 'docs/research-program/baseline-metrics-latest.md';
  const files = [baselineRel, latestRel];
  if (withLedgers) {
    files.push(
      'docs/research-program/ledgers/person-coverage.csv',
      'docs/research-program/ledgers/relationship-evidence-ledger.csv',
      'docs/research-program/ledgers/inference-dossier-tracker.csv'
    );
  }

  for (const rel of files) {
    const [nodeText, rustText] = await Promise.all([
      readText(join(nodeWorkspace, rel)),
      readText(join(rustWorkspace, rel))
    ]);
    if (nodeText !== rustText) {
      const detail = firstDiffDetail(nodeText, rustText);
      throw new Error(
        `content mismatch in scenario (${name}): ${rel}\n` +
          (detail
            ? `line ${detail.line}\n--- node ---\n${detail.node}\n--- rust ---\n${detail.rust}`
            : 'files differ but no line diff detail found')
      );
    }
  }
}

async function main() {
  const tempRoot = await mkdtemp(join(tmpdir(), 'maldives-baseline-report-parity-'));
  try {
    await runScenario(tempRoot, false);
    await runScenario(tempRoot, true);
    console.log('Research baseline report parity passed (Node == Rust outputs).');
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

await main();

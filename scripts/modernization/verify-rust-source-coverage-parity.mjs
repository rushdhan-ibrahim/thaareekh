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
  const now = new Date();
  const yyyy = String(now.getUTCFullYear());
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
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

async function prepareNodeWorkspace(dest) {
  await mkdir(dest, { recursive: true });
  await cp(join(projectRoot, 'package.json'), join(dest, 'package.json'));
  await cp(join(projectRoot, 'src', 'data'), join(dest, 'src', 'data'), { recursive: true });
  await mkdir(join(dest, 'scripts'), { recursive: true });
  await cp(
    join(projectRoot, 'scripts', 'source-coverage-audit.mjs'),
    join(dest, 'scripts', 'source-coverage-audit.mjs')
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

  const datasetPath = join(tempRoot, 'research.json');
  const sourcesPath = join(tempRoot, 'sources.json');

  await Promise.all([
    writeFile(datasetPath, `${JSON.stringify(datasetPayload, null, 2)}\n`, 'utf8'),
    writeFile(sourcesPath, `${JSON.stringify(sources, null, 2)}\n`, 'utf8')
  ]);

  return { datasetPath, sourcesPath };
}

async function assertEqualText(label, aPath, bPath, issues) {
  const [a, b] = await Promise.all([readFile(aPath, 'utf8'), readFile(bPath, 'utf8')]);
  if (a !== b) {
    issues.push(label);
  }
}

async function main() {
  const date = parseDateArg(process.argv.slice(2));
  const tempRoot = await mkdtemp(join(tmpdir(), 'maldives-source-coverage-parity-'));
  const nodeWorkspace = join(tempRoot, 'node-workspace');
  const rustWorkspace = join(tempRoot, 'rust-workspace');
  let keepTemp = false;

  try {
    await Promise.all([prepareNodeWorkspace(nodeWorkspace), mkdir(rustWorkspace, { recursive: true })]);
    const { datasetPath, sourcesPath } = await writeFixtures(tempRoot);

    run('node', ['scripts/source-coverage-audit.mjs', date], nodeWorkspace);

    const rustResearchDir = join(rustWorkspace, 'docs', 'research-program');
    run('cargo', [
      'run',
      '-q',
      '-p',
      'maldives-research-cli',
      '--',
      'source-coverage-audit',
      datasetPath,
      sourcesPath,
      rustResearchDir,
      date
    ]);

    const issues = [];
    const nodeDated = join(nodeWorkspace, 'docs', 'research-program', `source-coverage-audit-${date}.md`);
    const nodeLatest = join(nodeWorkspace, 'docs', 'research-program', 'source-coverage-audit-latest.md');
    const rustDated = join(rustResearchDir, `source-coverage-audit-${date}.md`);
    const rustLatest = join(rustResearchDir, 'source-coverage-audit-latest.md');

    await Promise.all([
      assertEqualText('dated audit markdown mismatch', nodeDated, rustDated, issues),
      assertEqualText('latest audit markdown mismatch', nodeLatest, rustLatest, issues)
    ]);

    if (issues.length) {
      keepTemp = true;
      console.error(`Source coverage parity failed (${issues.length})`);
      for (const issue of issues) {
        console.error(`- ${issue}`);
      }
      console.error(`Node workspace: ${nodeWorkspace}`);
      console.error(`Rust workspace: ${rustWorkspace}`);
      process.exit(1);
    }

    console.log('Source coverage parity passed (Node == Rust markdown outputs).');
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

#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { cp, mkdtemp, mkdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..', '..');

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
    join(projectRoot, 'scripts', 'refresh-relationship-ledger-quality.mjs'),
    join(dest, 'scripts', 'refresh-relationship-ledger-quality.mjs')
  );
  await cp(
    join(projectRoot, 'docs', 'research-program', 'ledgers'),
    join(dest, 'docs', 'research-program', 'ledgers'),
    { recursive: true }
  );
}

async function main() {
  const tempRoot = await mkdtemp(join(tmpdir(), 'maldives-rel-quality-parity-'));
  const nodeWorkspace = join(tempRoot, 'node-workspace');
  const rustWorkspace = join(tempRoot, 'rust-workspace');
  let keepTemp = false;

  try {
    await Promise.all([prepareWorkspace(nodeWorkspace), prepareWorkspace(rustWorkspace)]);

    run('node', ['scripts/refresh-relationship-ledger-quality.mjs'], nodeWorkspace);
    run(
      'cargo',
      [
        'run',
        '-q',
        '-p',
        'maldives-research-cli',
        '--',
        'refresh-relationship-ledger-quality',
        rustWorkspace
      ],
      projectRoot
    );

    const nodeFile = join(
      nodeWorkspace,
      'docs',
      'research-program',
      'ledgers',
      'relationship-evidence-ledger.csv'
    );
    const rustFile = join(
      rustWorkspace,
      'docs',
      'research-program',
      'ledgers',
      'relationship-evidence-ledger.csv'
    );

    const [nodeText, rustText] = await Promise.all([
      readFile(nodeFile, 'utf8'),
      readFile(rustFile, 'utf8')
    ]);

    if (nodeText !== rustText) {
      keepTemp = true;
      console.error('Relationship ledger quality parity failed (Node output != Rust output).');
      console.error(`Node workspace: ${nodeWorkspace}`);
      console.error(`Rust workspace: ${rustWorkspace}`);
      process.exit(1);
    }

    console.log('Relationship ledger quality parity passed (Node == Rust output).');
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

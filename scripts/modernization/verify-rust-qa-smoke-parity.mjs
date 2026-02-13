#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..', '..');

function run(cmd, args) {
  const out = spawnSync(cmd, args, { cwd: projectRoot, encoding: 'utf8' });
  return {
    status: out.status ?? 1,
    stdout: (out.stdout || '').trimEnd(),
    stderr: (out.stderr || '').trimEnd()
  };
}

function normalize(text) {
  return text
    .replace(/\r\n/g, '\n')
    .trim();
}

const nodeQa = run('node', ['scripts/qa-smoke.mjs']);
if (nodeQa.status !== 0) {
  const details = [nodeQa.stdout, nodeQa.stderr].filter(Boolean).join('\n');
  throw new Error(`Node QA smoke failed unexpectedly:\n${details}`);
}

for (const cmd of [
  ['node', ['scripts/modernization/export-datasets.mjs']],
  ['node', ['scripts/modernization/export-ui-reference.mjs']]
]) {
  const out = run(cmd[0], cmd[1]);
  if (out.status !== 0) {
    const details = [out.stdout, out.stderr].filter(Boolean).join('\n');
    throw new Error(`Command failed: ${cmd[0]} ${cmd[1].join(' ')}\n${details}`);
  }
}

const rustQa = run('cargo', [
  'run',
  '-q',
  '-p',
  'maldives-research-cli',
  '--',
  'qa-smoke',
  'docs/modernization/baselines/datasets/canonical.json',
  'docs/modernization/baselines/datasets/ui-reference.json'
]);
if (rustQa.status !== 0) {
  const details = [rustQa.stdout, rustQa.stderr].filter(Boolean).join('\n');
  throw new Error(`Rust QA smoke failed unexpectedly:\n${details}`);
}

if (normalize(nodeQa.stdout) !== normalize(rustQa.stdout)) {
  throw new Error(
    `QA smoke output mismatch:\n--- node ---\n${nodeQa.stdout}\n--- rust ---\n${rustQa.stdout}`
  );
}

console.log('QA smoke parity passed (Node == Rust output).');

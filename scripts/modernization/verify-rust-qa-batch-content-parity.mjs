#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..', '..');

function run(cmd, args, cwd = rootDir) {
  const out = spawnSync(cmd, args, { cwd, encoding: 'utf8' });
  if (out.status !== 0) {
    const details = [out.stdout, out.stderr].filter(Boolean).join('\n').trim();
    throw new Error(`Command failed: ${cmd} ${args.join(' ')}\n${details}`);
  }
  return out.stdout.trim();
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.keys(value)
      .sort((a, b) => a.localeCompare(b))
      .map(k => [k, stableValue(value[k])])
  );
}

function parseJson(label, text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`${label} output is not valid JSON:\n${text}`);
  }
}

function main() {
  const nodeRaw = run('node', ['scripts/qa-batch-content.mjs']);
  const rustRaw = run('cargo', [
    'run',
    '-q',
    '-p',
    'maldives-research-cli',
    '--',
    'qa-batch-content',
    rootDir
  ]);

  const nodeReport = stableValue(parseJson('Node QA batch content', nodeRaw));
  const rustReport = stableValue(parseJson('Rust QA batch content', rustRaw));

  if (JSON.stringify(nodeReport) !== JSON.stringify(rustReport)) {
    console.error('QA batch-content parity failed between Node and Rust outputs.');
    console.error('Node output:');
    console.error(JSON.stringify(nodeReport, null, 2));
    console.error('Rust output:');
    console.error(JSON.stringify(rustReport, null, 2));
    process.exit(1);
  }

  console.log('QA batch-content parity passed (Node == Rust).');
}

main();

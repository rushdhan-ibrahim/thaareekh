#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDataset } from '../../src/data/sovereigns.merge.js';
import { sources } from '../../src/data/sources.js';

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
      .map(key => [key, stableValue(value[key])])
  );
}

function parseJson(label, text) {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${label} output is not valid JSON:\n${text}`);
  }
}

async function writeFixtureDatasets(tempDir) {
  const wrap = mode => {
    const ds = getDataset(mode);
    return {
      generated_at: new Date().toISOString(),
      mode: ds.mode,
      people: ds.people,
      edges: ds.edges
    };
  };

  const canonicalPath = join(tempDir, 'canonical.json');
  const researchPath = join(tempDir, 'research.json');
  const sourcesPath = join(tempDir, 'sources.json');

  await Promise.all([
    writeFile(canonicalPath, `${JSON.stringify(wrap('canonical'), null, 2)}\n`, 'utf8'),
    writeFile(researchPath, `${JSON.stringify(wrap('research'), null, 2)}\n`, 'utf8'),
    writeFile(sourcesPath, `${JSON.stringify(sources, null, 2)}\n`, 'utf8')
  ]);

  return { canonicalPath, researchPath, sourcesPath };
}

async function main() {
  const tempDir = await mkdtemp(join(tmpdir(), 'maldives-audit-parity-'));
  try {
    const { canonicalPath, researchPath, sourcesPath } = await writeFixtureDatasets(tempDir);

    const cases = [
      {
        label: 'canonical-default',
        mode: 'canonical',
        datasetPath: canonicalPath,
        extraFlags: []
      },
      {
        label: 'research-limit-15',
        mode: 'research',
        datasetPath: researchPath,
        extraFlags: ['--limit', '15']
      },
      {
        label: 'research-inter-dynasty',
        mode: 'research',
        datasetPath: researchPath,
        extraFlags: ['--inter-dynasty-only', '--limit', '25']
      }
    ];

    for (const testCase of cases) {
      const nodeRaw = run('node', [
        'scripts/audit-evidence.mjs',
        '--mode',
        testCase.mode,
        '--json',
        ...testCase.extraFlags
      ]);

      const rustRaw = run('cargo', [
        'run',
        '-q',
        '-p',
        'maldives-research-cli',
        '--',
        'audit-evidence',
        testCase.datasetPath,
        sourcesPath,
        '--mode',
        testCase.mode,
        '--json',
        ...testCase.extraFlags
      ]);

      const nodeValue = stableValue(parseJson(`Node (${testCase.label})`, nodeRaw));
      const rustValue = stableValue(parseJson(`Rust (${testCase.label})`, rustRaw));

      if (JSON.stringify(nodeValue) !== JSON.stringify(rustValue)) {
        console.error(`Audit evidence parity failed for case: ${testCase.label}`);
        console.error('Node output:');
        console.error(JSON.stringify(nodeValue, null, 2));
        console.error('Rust output:');
        console.error(JSON.stringify(rustValue, null, 2));
        process.exit(1);
      }
    }

    console.log('Audit evidence parity passed (Node == Rust for all audited cases).');
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

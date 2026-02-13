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

function run(cmd, args, cwd = projectRoot) {
  const out = spawnSync(cmd, args, {
    cwd,
    encoding: 'utf8'
  });
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

async function prepareWorkspace(dest, scriptName) {
  await mkdir(dest, { recursive: true });
  await cp(join(projectRoot, 'package.json'), join(dest, 'package.json'));
  await mkdir(join(dest, 'scripts'), { recursive: true });
  await cp(join(projectRoot, 'scripts', scriptName), join(dest, 'scripts', scriptName));
  await mkdir(join(dest, 'src'), { recursive: true });
  await cp(join(projectRoot, 'src', 'data'), join(dest, 'src', 'data'), { recursive: true });
  await cp(
    join(projectRoot, 'docs', 'research-program'),
    join(dest, 'docs', 'research-program'),
    { recursive: true }
  );
}

async function writeFixtures(workspace) {
  const datasetPath = join(workspace, 'dataset.research.json');
  const sourcesPath = join(workspace, 'sources.registry.json');
  const dataset = getDataset('research');
  await writeFile(datasetPath, `${JSON.stringify(dataset, null, 2)}\n`, 'utf8');
  await writeFile(sourcesPath, `${JSON.stringify(sources, null, 2)}\n`, 'utf8');
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

function compareDigestMaps(nodeMap, rustMap) {
  const issues = [];
  const keys = new Set([...nodeMap.keys(), ...rustMap.keys()]);
  for (const key of keys) {
    if (!nodeMap.has(key)) {
      issues.push(`rust-only file ${key}`);
      continue;
    }
    if (!rustMap.has(key)) {
      issues.push(`node-only file ${key}`);
      continue;
    }
    if (nodeMap.get(key) !== rustMap.get(key)) {
      issues.push(`content mismatch ${key}`);
    }
  }
  return issues;
}

async function runScenario(tempRoot, scenario) {
  const nodeWorkspace = join(tempRoot, `${scenario.name}-node`);
  const rustWorkspace = join(tempRoot, `${scenario.name}-rust`);
  await prepareWorkspace(nodeWorkspace, scenario.scriptName);
  await prepareWorkspace(rustWorkspace, scenario.scriptName);

  const nodeOut = run('node', [`scripts/${scenario.scriptName}`], nodeWorkspace);
  const { datasetPath, sourcesPath } = await writeFixtures(rustWorkspace);
  const rustOut = run(
    'cargo',
    [
      'run',
      '-q',
      '-p',
      'maldives-research-cli',
      '--',
      scenario.rustCommand,
      datasetPath,
      sourcesPath,
      rustWorkspace
    ],
    projectRoot
  );

  const nodeCombined = [nodeOut.stdout, nodeOut.stderr].filter(Boolean).join('\n');
  const rustCombined = [rustOut.stdout, rustOut.stderr].filter(Boolean).join('\n');
  if (nodeOut.status !== rustOut.status) {
    throw new Error(
      `status mismatch (${scenario.name}): node=${nodeOut.status}, rust=${rustOut.status}\n` +
        `--- node ---\n${nodeCombined}\n--- rust ---\n${rustCombined}`
    );
  }
  if (nodeOut.status !== 0) {
    throw new Error(`scenario failed (${scenario.name})\n--- node ---\n${nodeCombined}\n--- rust ---\n${rustCombined}`);
  }

  const nodeStdout = normalizeOutput(nodeOut.stdout, nodeWorkspace);
  const rustStdout = normalizeOutput(rustOut.stdout, rustWorkspace);
  if (nodeStdout !== rustStdout) {
    throw new Error(
      `stdout mismatch (${scenario.name})\n--- node ---\n${nodeStdout}\n--- rust ---\n${rustStdout}`
    );
  }

  const [nodeTree, rustTree] = await Promise.all([
    treeDigestMap(join(nodeWorkspace, 'docs', 'research-program')),
    treeDigestMap(join(rustWorkspace, 'docs', 'research-program'))
  ]);
  const issues = compareDigestMaps(nodeTree, rustTree);
  if (issues.length) {
    throw new Error(
      `content mismatch (${scenario.name}) count=${issues.length}\n` +
        issues.slice(0, 80).map(issue => `- ${issue}`).join('\n')
    );
  }
}

async function main() {
  const tempRoot = await mkdtemp(join(tmpdir(), 'maldives-phase1-batches-parity-'));
  let keepTemp = false;
  try {
    await runScenario(tempRoot, {
      name: 'phase1-batch-a',
      scriptName: 'phase1-batch-a.mjs',
      rustCommand: 'phase1-batch-a'
    });
    await runScenario(tempRoot, {
      name: 'phase1-batch-b',
      scriptName: 'phase1-batch-b.mjs',
      rustCommand: 'phase1-batch-b'
    });
    await runScenario(tempRoot, {
      name: 'phase1-batch-c',
      scriptName: 'phase1-batch-c.mjs',
      rustCommand: 'phase1-batch-c'
    });
    await runScenario(tempRoot, {
      name: 'phase1-batch-d',
      scriptName: 'phase1-batch-d.mjs',
      rustCommand: 'phase1-batch-d'
    });
    await runScenario(tempRoot, {
      name: 'phase1-batch-sweep',
      scriptName: 'phase1-batch-sweep.mjs',
      rustCommand: 'phase1-batch-sweep'
    });
    console.log('Phase 1 batch driver parity passed (Node == Rust outputs).');
  } catch (error) {
    keepTemp = true;
    console.error(error instanceof Error ? error.message : String(error));
    console.error(`Temp root kept for inspection: ${tempRoot}`);
    process.exit(1);
  } finally {
    if (!keepTemp) {
      await rm(tempRoot, { recursive: true, force: true });
    }
  }
}

await main();

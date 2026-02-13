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

async function runScenario(tempRoot, scenario) {
  const nodeWorkspace = join(tempRoot, `${scenario.name}-node`);
  const rustWorkspace = join(tempRoot, `${scenario.name}-rust`);
  await prepareWorkspace(nodeWorkspace, scenario.scriptName);
  await prepareWorkspace(rustWorkspace, scenario.scriptName);

  const nodeOut = run('node', [`scripts/${scenario.scriptName}`], nodeWorkspace);
  const { datasetPath, sourcesPath } = await writeFixtures(rustWorkspace);
  const rustArgs = ['run', '-q', '-p', 'maldives-research-cli', '--', scenario.rustCommand, datasetPath];
  if (scenario.needsSources) {
    rustArgs.push(sourcesPath);
  }
  rustArgs.push(rustWorkspace);
  const rustOut = run('cargo', rustArgs, projectRoot);

  const nodeCombined = [nodeOut.stdout, nodeOut.stderr].filter(Boolean).join('\n');
  const rustCombined = [rustOut.stdout, rustOut.stderr].filter(Boolean).join('\n');
  if (nodeOut.status !== rustOut.status) {
    throw new Error(
      `status mismatch in scenario (${scenario.name}): node=${nodeOut.status}, rust=${rustOut.status}\n` +
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
      `stdout mismatch in scenario (${scenario.name}):\n--- node ---\n${nodeStdout}\n--- rust ---\n${rustStdout}`
    );
  }

  for (const relPath of scenario.compareFiles) {
    const [nodeText, rustText] = await Promise.all([
      readFile(join(nodeWorkspace, relPath), 'utf8'),
      readFile(join(rustWorkspace, relPath), 'utf8')
    ]);
    if (nodeText !== rustText) {
      const detail = firstDiffDetail(nodeText, rustText);
      throw new Error(
        `content mismatch in scenario (${scenario.name}): ${relPath}\n` +
          (detail
            ? `line ${detail.line}\n--- node ---\n${detail.node}\n--- rust ---\n${detail.rust}`
            : 'files differ but no line diff detail found')
      );
    }
  }
}

async function main() {
  const tempRoot = await mkdtemp(join(tmpdir(), 'maldives-phase1-locator-parity-'));
  let keepTemp = false;
  try {
    const compareFiles = [
      'docs/research-program/ledgers/relationship-evidence-ledger.csv',
      'docs/research-program/ledgers/source-extract-log.csv',
      'docs/research-program/ledgers/source-expansion-queue.csv'
    ];
    await runScenario(tempRoot, {
      name: 'phase1-locator-batch-a',
      scriptName: 'phase1-locator-batch-a.mjs',
      rustCommand: 'phase1-locator-batch-a',
      needsSources: true,
      compareFiles
    });
    await runScenario(tempRoot, {
      name: 'phase1-locator-batch-b',
      scriptName: 'phase1-locator-batch-b.mjs',
      rustCommand: 'phase1-locator-batch-b',
      needsSources: false,
      compareFiles
    });
    await runScenario(tempRoot, {
      name: 'phase1-locator-batch-c',
      scriptName: 'phase1-locator-batch-c.mjs',
      rustCommand: 'phase1-locator-batch-c',
      needsSources: false,
      compareFiles
    });
    await runScenario(tempRoot, {
      name: 'phase1-locator-batch-d',
      scriptName: 'phase1-locator-batch-d.mjs',
      rustCommand: 'phase1-locator-batch-d',
      needsSources: true,
      compareFiles
    });
    await runScenario(tempRoot, {
      name: 'phase1-locator-batch-e',
      scriptName: 'phase1-locator-batch-e.mjs',
      rustCommand: 'phase1-locator-batch-e',
      needsSources: true,
      compareFiles
    });
    console.log('Phase 1 locator batch parity passed (Node == Rust outputs).');
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

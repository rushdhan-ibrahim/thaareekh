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
  await mkdir(join(dest, 'scripts'), { recursive: true });
  await cp(join(projectRoot, 'scripts', scriptName), join(dest, 'scripts', scriptName));
  await cp(
    join(projectRoot, 'docs', 'research-program'),
    join(dest, 'docs', 'research-program'),
    { recursive: true }
  );
}

async function runScenario(tempRoot, scenario) {
  const nodeWorkspace = join(tempRoot, `${scenario.name}-node`);
  const rustWorkspace = join(tempRoot, `${scenario.name}-rust`);
  await prepareWorkspace(nodeWorkspace, scenario.scriptName);
  await prepareWorkspace(rustWorkspace, scenario.scriptName);

  const nodeOut = run('node', [`scripts/${scenario.scriptName}`], nodeWorkspace);
  const rustOut = run(
    'cargo',
    [
      'run',
      '-q',
      '-p',
      'maldives-research-cli',
      '--',
      scenario.rustCommand,
      rustWorkspace
    ],
    projectRoot
  );

  const nodeCombined = [nodeOut.stdout, nodeOut.stderr].filter(Boolean).join('\n');
  const rustCombined = [rustOut.stdout, rustOut.stderr].filter(Boolean).join('\n');
  if (nodeOut.status !== rustOut.status) {
    throw new Error(
      `status mismatch in scenario (${scenario.name}): node=${nodeOut.status}, rust=${rustOut.status}\n` +
        `--- node ---\n${nodeCombined}\n--- rust ---\n${rustCombined}`
    );
  }

  if (nodeOut.status !== 0) {
    if (!scenario.failureContains) {
      throw new Error(`Node scenario (${scenario.name}) failed:\n${nodeCombined}`);
    }
    if (!nodeCombined.includes(scenario.failureContains)) {
      throw new Error(
        `Node failure output mismatch in scenario (${scenario.name}). Missing expected fragment: ${scenario.failureContains}\n${nodeCombined}`
      );
    }
    if (!rustCombined.includes(scenario.failureContains)) {
      throw new Error(
        `Rust failure output mismatch in scenario (${scenario.name}). Missing expected fragment: ${scenario.failureContains}\n${rustCombined}`
      );
    }
    return;
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
  const tempRoot = await mkdtemp(join(tmpdir(), 'maldives-phase5-parity-'));
  let keepTemp = false;
  try {
    const common = [
      'docs/research-program/ledgers/relationship-evidence-ledger.csv',
      'docs/research-program/promotion-queue.md',
      'docs/research-program/contradiction-log.md'
    ];
    await runScenario(tempRoot, {
      name: 'phase5-conflict-batch-c',
      scriptName: 'phase5-conflict-batch-c.mjs',
      rustCommand: 'phase5-conflict-batch-c',
      compareFiles: common
    });
    await runScenario(tempRoot, {
      name: 'phase5-promotion-batch-a',
      scriptName: 'phase5-promotion-batch-a.mjs',
      rustCommand: 'phase5-promotion-batch-a',
      compareFiles: common
    });
    await runScenario(tempRoot, {
      name: 'phase5-promotion-batch-b',
      scriptName: 'phase5-promotion-batch-b.mjs',
      rustCommand: 'phase5-promotion-batch-b',
      compareFiles: [...common, 'docs/research-program/ledgers/promotion-batch-b-claims.csv'],
      failureContains: 'Batch B safety checks failed: duplicateDirectTuples=0, overParentAssignments=4'
    });
    console.log('Phase 5 batch parity passed (Node == Rust outputs).');
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

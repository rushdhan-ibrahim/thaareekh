#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { cp, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDataset } from '../../src/data/sovereigns.merge.js';
import { sources } from '../../src/data/sources.js';
import { officeCatalog, officeTimeline } from '../../src/data/offices.js';

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

function normalizeJson(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeJson);
  }
  if (!value || typeof value !== 'object') {
    return value;
  }
  const out = {};
  for (const key of Object.keys(value).sort((a, b) => a.localeCompare(b))) {
    out[key] = normalizeJson(value[key]);
  }
  return out;
}

async function prepareWorkspace(dest) {
  await mkdir(dest, { recursive: true });
  await cp(join(projectRoot, 'package.json'), join(dest, 'package.json'));
  await mkdir(join(dest, 'scripts'), { recursive: true });
  await cp(
    join(projectRoot, 'scripts', 'build-offline-archive.mjs'),
    join(dest, 'scripts', 'build-offline-archive.mjs')
  );
  await mkdir(join(dest, 'src'), { recursive: true });
  await cp(join(projectRoot, 'src', 'data'), join(dest, 'src', 'data'), { recursive: true });
  await mkdir(join(dest, 'docs'), { recursive: true });
}

async function writeFixtures(tempRoot) {
  const canonical = getDataset('canonical');
  const research = getDataset('research');
  const canonicalPayload = {
    generated_at: new Date().toISOString(),
    mode: canonical.mode,
    people: canonical.people,
    edges: canonical.edges
  };
  const researchPayload = {
    generated_at: new Date().toISOString(),
    mode: research.mode,
    people: research.people,
    edges: research.edges
  };

  const fixtureDir = join(tempRoot, 'fixtures');
  await mkdir(fixtureDir, { recursive: true });
  const canonicalPath = join(fixtureDir, 'canonical.json');
  const researchPath = join(fixtureDir, 'research.json');
  const sourcesPath = join(fixtureDir, 'sources.json');
  const uiReferencePath = join(fixtureDir, 'ui-reference.json');

  await Promise.all([
    writeFile(canonicalPath, `${JSON.stringify(canonicalPayload, null, 2)}\n`, 'utf8'),
    writeFile(researchPath, `${JSON.stringify(researchPayload, null, 2)}\n`, 'utf8'),
    writeFile(sourcesPath, `${JSON.stringify(sources, null, 2)}\n`, 'utf8'),
    writeFile(
      uiReferencePath,
      `${JSON.stringify({ officeCatalog, officeTimeline }, null, 2)}\n`,
      'utf8'
    )
  ]);

  return { canonicalPath, researchPath, sourcesPath, uiReferencePath };
}

async function main() {
  const tempRoot = await mkdtemp(join(tmpdir(), 'maldives-build-archive-parity-'));
  const nodeWorkspace = join(tempRoot, 'node-workspace');
  const rustWorkspace = join(tempRoot, 'rust-workspace');
  let keepTemp = false;

  try {
    await Promise.all([prepareWorkspace(nodeWorkspace), prepareWorkspace(rustWorkspace)]);
    const { canonicalPath, researchPath, sourcesPath, uiReferencePath } = await writeFixtures(
      tempRoot
    );

    const nodeOutput = run('node', ['scripts/build-offline-archive.mjs'], nodeWorkspace);
    const rustOutput = run(
      'cargo',
      [
        'run',
        '-q',
        '-p',
        'maldives-research-cli',
        '--',
        'build-offline-archive',
        canonicalPath,
        researchPath,
        sourcesPath,
        uiReferencePath,
        join(rustWorkspace, 'docs', 'offline-research-archive.json')
      ],
      projectRoot
    );

    const normalizedNodeOutput = normalizeOutput(nodeOutput, nodeWorkspace);
    const normalizedRustOutput = normalizeOutput(rustOutput, rustWorkspace);

    const issues = [];
    if (normalizedNodeOutput !== normalizedRustOutput) {
      issues.push(
        `stdout mismatch\nnode: ${normalizedNodeOutput}\nrust: ${normalizedRustOutput}`
      );
    }

    const [nodeArchiveRaw, rustArchiveRaw] = await Promise.all([
      readFile(join(nodeWorkspace, 'docs', 'offline-research-archive.json'), 'utf8'),
      readFile(join(rustWorkspace, 'docs', 'offline-research-archive.json'), 'utf8')
    ]);

    const nodeArchive = JSON.parse(nodeArchiveRaw);
    const rustArchive = JSON.parse(rustArchiveRaw);
    if (typeof nodeArchive.generated_at !== 'string' || typeof rustArchive.generated_at !== 'string') {
      issues.push('generated_at field missing or non-string in archive payload');
    }
    delete nodeArchive.generated_at;
    delete rustArchive.generated_at;

    const normalizedNodeArchive = normalizeJson(nodeArchive);
    const normalizedRustArchive = normalizeJson(rustArchive);
    if (JSON.stringify(normalizedNodeArchive) !== JSON.stringify(normalizedRustArchive)) {
      issues.push('offline-research-archive.json semantic mismatch');
    }

    if (issues.length) {
      keepTemp = true;
      console.error(`Build offline archive parity failed (${issues.length})`);
      for (const issue of issues.slice(0, 50)) {
        console.error(`- ${issue}`);
      }
      if (issues.length > 50) {
        console.error(`- ... ${issues.length - 50} more issue(s)`);
      }
      console.error(`Node workspace: ${nodeWorkspace}`);
      console.error(`Rust workspace: ${rustWorkspace}`);
      process.exit(1);
    }

    console.log('Build offline archive parity passed (Node == Rust outputs).');
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

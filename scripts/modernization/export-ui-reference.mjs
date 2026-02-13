#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { officeCatalog, officeTimeline, officeById } from '../../src/data/offices.js';
import { storyTrails } from '../../src/data/storytrails.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..', '..');
const outputPath = join(
  projectRoot,
  'docs',
  'modernization',
  'baselines',
  'datasets',
  'ui-reference.json'
);

const payload = {
  generated_at: new Date().toISOString(),
  officeCatalog,
  officeTimeline,
  officeByIdSize: officeById.size,
  storyTrails
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

console.log(`UI reference export written:`);
console.log(`- ${outputPath} (${officeCatalog.length} offices / ${officeTimeline.length} periods / ${storyTrails.length} trails)`);

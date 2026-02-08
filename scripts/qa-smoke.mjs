#!/usr/bin/env node

import { people, edges } from '../src/data/sovereigns.merge.js';
import { officeCatalog, officeTimeline, officeById } from '../src/data/offices.js';
import { storyTrails } from '../src/data/storytrails.js';
import { timelineExtent } from '../src/data/timeline.js';

const issues = [];

function issue(msg) {
  issues.push(msg);
}

const personIds = new Set(people.map(p => p.id));
if (personIds.size !== people.length) {
  issue(`Duplicate person IDs detected (${people.length - personIds.size} duplicates).`);
}

edges.forEach((e, i) => {
  if (!personIds.has(e.s)) issue(`Edge[${i}] has unknown source: ${e.s}`);
  if (!personIds.has(e.d)) issue(`Edge[${i}] has unknown target: ${e.d}`);
  if (!e.t) issue(`Edge[${i}] missing relation type.`);
  if (!e.c) issue(`Edge[${i}] missing confidence marker.`);
});

const officeIds = new Set(officeCatalog.map(o => o.id));
if (officeIds.size !== officeCatalog.length) {
  issue(`Duplicate office IDs detected (${officeCatalog.length - officeIds.size} duplicates).`);
}
if (officeById.size !== officeCatalog.length) {
  issue('officeById map size mismatch with officeCatalog.');
}

officeTimeline.forEach((row, i) => {
  (row.offices || []).forEach(id => {
    if (!officeIds.has(id)) issue(`officeTimeline[${i}] references unknown office: ${id}`);
  });
});

const era = timelineExtent();
storyTrails.forEach((trail, i) => {
  if (!trail.id) issue(`storyTrails[${i}] missing id.`);
  if (!Array.isArray(trail.steps) || !trail.steps.length) {
    issue(`storyTrails[${i}] has no steps.`);
    return;
  }
  trail.steps.forEach((raw, j) => {
    const step = typeof raw === 'string' ? { id: raw } : raw;
    if (!step?.id) {
      issue(`storyTrails[${i}].steps[${j}] missing person id.`);
      return;
    }
    if (!personIds.has(step.id)) issue(`storyTrails[${i}].steps[${j}] references unknown person: ${step.id}`);
    if (Number.isFinite(step.year) && (step.year < era.min || step.year > era.max)) {
      issue(`storyTrails[${i}].steps[${j}] year ${step.year} is outside timeline extent ${era.min}-${era.max}.`);
    }
  });
});

if (issues.length) {
  console.error(`QA smoke checks failed (${issues.length}):`);
  issues.forEach(m => console.error(`- ${m}`));
  process.exit(1);
}

console.log(`QA smoke checks passed:
- ${people.length} people
- ${edges.length} edges
- ${officeCatalog.length} offices
- ${officeTimeline.length} office periods
- ${storyTrails.length} story trails`);

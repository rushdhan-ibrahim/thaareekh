import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function nowIso() {
  return new Date().toISOString();
}

export async function countFilesRecursive(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  let total = 0;
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      total += await countFilesRecursive(full);
    } else {
      total += 1;
    }
  }
  return total;
}

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === ',') {
      row.push(field);
      field = '';
      continue;
    }
    if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      continue;
    }
    if (ch !== '\r') field += ch;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

export async function csvRowCount(path) {
  const text = await readFile(path, 'utf8');
  const parsed = parseCsv(text);
  if (parsed.length <= 1) return 0;
  return parsed.length - 1;
}

export function normalizeRefs(refs) {
  if (Array.isArray(refs)) return refs.filter(Boolean);
  if (!refs) return [];
  return String(refs)
    .split('|')
    .map(s => s.trim())
    .filter(Boolean);
}

export function countBy(items, keyFn) {
  const out = {};
  for (const item of items) {
    const key = keyFn(item);
    out[key] = (out[key] || 0) + 1;
  }
  return out;
}

export function sortObjectByKey(input) {
  return Object.fromEntries(
    Object.entries(input)
      .sort(([a], [b]) => a.localeCompare(b))
  );
}

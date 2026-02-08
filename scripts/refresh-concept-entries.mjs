#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sourceById } from '../src/data/sources.js';

const DATE = '2026-02-08';
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const conceptDir = join(rootDir, 'docs', 'research-program', 'concepts');
const ledgerPath = join(rootDir, 'docs', 'research-program', 'ledgers', 'concept-coverage.csv');

const conceptContent = {
  'CONCEPT-001': {
    short_definition: 'A legitimacy framework where succession can move through paternal, maternal, collateral, and marriage-linked lines rather than strict primogeniture.',
    historical_scope: 'Used across pre-modern dynastic transitions, especially when reign interruptions, deposal, or restorations occurred.',
    why_matters: 'Many modeled kin edges use broad continuity language because succession logic was political and negotiated, not purely genealogical.',
    semantic_notes: [
      'Early chronicles often emphasize legitimacy claims through prominent ancestors or branch proximity rather than formal inheritance formulas.',
      'Competing claimant narratives can coexist across sources, requiring contradiction tracking instead of forced single-line ancestry.',
      'The graph should separate succession legitimacy from strict biological parentage when evidence is ambiguous.'
    ],
    links: {
      people: ['P1', 'P30', 'P68', 'P77', 'P80', 'P104'],
      offices: ['OFF-CROWN', 'OFF-NAIB'],
      events: ['dynastic transitions', 'depositions', 'restorations']
    },
    sources: ['SRC-TUFS-TARIKH-DIBA-MAHALL-FACSIMILE', 'SRC-SARUNA-RAADHAVALHI-1985', 'SRC-MRF-KINGS']
  },
  'CONCEPT-002': {
    short_definition: 'A court-office term tied to high-ranking state service and political authority in monarchical governance.',
    historical_scope: 'Appears in pre-modern and early-modern court structures with role-shifts by period and ruler.',
    why_matters: 'Office-holding can explain why non-sovereign nodes have strong political importance and relation influence.',
    semantic_notes: [
      'Office usage may blend administrative, military, and court-protocol authority depending on period context.',
      'Role meaning likely changed between chronicle period, early modern observer accounts, and later historiography.',
      'Term-level extraction should capture whether usage denotes rank, function, or honorific status in each source.'
    ],
    links: {
      people: ['P132', 'P182', 'P191'],
      offices: ['OFF-FURADAANA', 'OFF-NAIB'],
      events: ['court administration', 'regency-style governance episodes']
    },
    sources: ['SRC-SARUNA-PYRARD-V2P2-1887', 'SRC-CORNELL-PYRARD-V1-1887', 'SRC-MRF-TITLES']
  },
  'CONCEPT-003': {
    short_definition: 'A high-status title marker used in elite naming and office contexts, often signaling rank, household standing, or political status.',
    historical_scope: 'Monarchical periods through later elite lineages, with significant variation in practical meaning.',
    why_matters: 'Many nodes include Kilege/Kilegefaanu-type forms; misreading them can distort relation and institution interpretation.',
    semantic_notes: [
      'In some contexts it behaves like a rank-bearing office marker; in others it is a lineage/style honorific.',
      'Chronicle and later compendia may normalize spelling differently, so transliteration harmonization is required.',
      'The graph should avoid treating title-bearing names as direct kinship evidence without corroborative wording.'
    ],
    links: {
      people: ['P4', 'P9', 'P10', 'P130', 'P158'],
      offices: ['OFF-KILEGE'],
      events: ['succession-era elite household transitions']
    },
    sources: ['SRC-MRF-TITLES', 'SRC-MRF-KINGS', 'SRC-HEIDELBERG-BELL-1883']
  },
  'CONCEPT-004': {
    short_definition: 'A style/title associated with elite and political families, including modern political lineages.',
    historical_scope: 'Late monarchy into modern republican era, with continuity in social-political naming conventions.',
    why_matters: 'Several modern nodes and inferred edges use Didi-line continuity framing; title interpretation affects confidence grading.',
    semantic_notes: [
      'Modern public records and biographies may use Didi as part of inherited naming rather than a current office marker.',
      'Branch continuity claims should distinguish between name-style continuity and demonstrable genealogical continuity.',
      'The graph should keep title-derived continuity claims at inferred grade until direct kinship evidence is captured.'
    ],
    links: {
      people: ['P110', 'P111', 'P115', 'P116', 'P117', 'P121'],
      offices: ['OFF-CROWN'],
      events: ['modern elite lineage consolidation']
    },
    sources: ['SRC-WIKI-MAUMOON', 'SRC-WIKI-NASHEED', 'SRC-WIKI-MUIZZU']
  },
  'CONCEPT-005': {
    short_definition: 'A long-term shift in naming systems following Islamization, including Arabic-derived personal and regnal forms.',
    historical_scope: 'From medieval period onward, with layered continuity into later dynastic naming patterns.',
    why_matters: 'Name-form shifts are necessary to map variants across chronicles, inscriptions, and modern transliterations.',
    semantic_notes: [
      'Equivalent persons may appear under different Arabic/Dhivehi/Latinized forms across sources.',
      'Chronicle-era names and regnal labels should be normalized cautiously to avoid false node merges.',
      'Terminology differences should be logged as alias evidence, not silently collapsed.'
    ],
    links: {
      people: ['P1', 'P30', 'P61', 'P68', 'P77'],
      offices: ['OFF-CROWN'],
      events: ['Islamization-era naming normalization']
    },
    sources: ['SRC-SARUNA-LOAMAAFANU-1982', 'SRC-TUFS-TARIKH-DIBA-MAHALL-FACSIMILE', 'SRC-SARUNA-RAADHAVALHI-1985']
  },
  'CONCEPT-006': {
    short_definition: 'Portuguese-era Christian naming overlays within Maldivian elite lineages and transitional political episodes.',
    historical_scope: 'Primarily sixteenth to seventeenth century contact and post-contact narrative layers.',
    why_matters: 'Mixed naming forms can obscure continuity between nodes if Christian and Islamic names are treated as unrelated identities.',
    semantic_notes: [
      'European narrative sources may record names through phonetic approximations or translated forms.',
      'Identity matching must combine chronology, branch context, and relationship statements, not names alone.',
      'Alias sets should preserve both local and external naming forms with explicit provenance.'
    ],
    links: {
      people: ['P61', 'P66', 'P97', 'P101'],
      offices: ['OFF-CROWN'],
      events: ['Portuguese influence period', 'restoration-era identity framing']
    },
    sources: ['SRC-SARUNA-PYRARD-V2P2-1887', 'SRC-CORNELL-PYRARD-V1-1887', 'SRC-HEIDELBERG-BELL-1883']
  },
  'CONCEPT-007': {
    short_definition: 'A deputy-style office designation (Naib/Naibu/Al-Naib) associated with delegated governance authority.',
    historical_scope: 'Monarchical governance periods with local variation in office scope and authority.',
    why_matters: 'Naib-labeled nodes are central to branch continuity claims and should be interpreted as office-bearing actors, not merely name variants.',
    semantic_notes: [
      'The term can indicate formal administrative delegation, judicial authority, or political intermediary roles by period.',
      'Office title presence strengthens context but does not alone establish blood relation certainty.',
      'Office-role extraction should map whether Naib references are contemporaneous records or later historical framing.'
    ],
    links: {
      people: ['P132', 'P182', 'P191'],
      offices: ['OFF-NAIB'],
      events: ['regional branch governance', 'southern branch continuity narratives']
    },
    sources: ['SRC-MRF-TITLES', 'SRC-SARUNA-PYRARD-V2P2-1887', 'SRC-CORNELL-PYRARD-V1-1887']
  },
  'CONCEPT-008': {
    short_definition: 'A recurrent political pattern where rulers are removed and later restored, often with contested legitimacy narratives.',
    historical_scope: 'Observed across multiple dynastic transitions and factional episodes.',
    why_matters: 'This concept explains why some edges remain broad kin context rather than strict parentage in periods of political turbulence.',
    semantic_notes: [
      'Source traditions may differ on whether a transition is framed as lawful succession, usurpation, or restoration.',
      'Graph confidence should remain conservative when chronology is clear but kin wording is inconsistent.',
      'Contradiction log entries should explicitly connect restoration narratives to affected claim IDs.'
    ],
    links: {
      people: ['P61', 'P66', 'P67', 'P104', 'P159'],
      offices: ['OFF-CROWN', 'OFF-NAIB'],
      events: ['deposition cycles', 'restoration episodes']
    },
    sources: ['SRC-TUFS-TARIKH-DIBA-MAHALL-FACSIMILE', 'SRC-SARUNA-RAADHAVALHI-1985', 'SRC-MRF-KINGS']
  }
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
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

function csvEscape(v) {
  const s = String(v ?? '');
  if (s.includes('"') || s.includes(',') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCsv(rows) {
  return `${rows.map(r => r.map(csvEscape).join(',')).join('\n')}\n`;
}

function sourceLine(id) {
  const source = sourceById.get(id);
  if (!source) return `- \`${id}\``;
  return `- \`${id}\`: ${source.title} [${source.quality}]`;
}

function formatList(items) {
  if (!items.length) return '- none';
  return items.map(item => `- ${item}`).join('\n');
}

function buildConceptContent(row, idx) {
  const id = row[idx.concept_id];
  const c = conceptContent[id];
  if (!c) return null;

  const sourceList = c.sources.map(sourceLine).join('\n');
  return {
    text: `# Concept Entry

Concept ID: \`${id}\`  
Last updated: \`${DATE}\`  
Category: \`${row[idx.category]}\`

## 1) Canonical label
- Primary label: ${row[idx.canonical_label]}
- Alternate labels/spellings: normalization set pending transliteration pass.
- Language/script forms: Dhivehi, Arabic-influenced forms, and English transliteration variants should be tracked.

## 2) Definition
- Short definition: ${c.short_definition}
- Historical scope and periodization: ${c.historical_scope}
- Why it matters in this genealogy graph: ${c.why_matters}

## 3) Semantic and historical notes
${formatList(c.semantic_notes)}

## 4) Person and event links
- Linked people (\`P...\`):
${formatList(c.links.people.map(v => `\`${v}\``))}
- Linked offices/institutions:
${formatList(c.links.offices.map(v => `\`${v}\``))}
- Linked transitions/events:
${formatList(c.links.events)}

## 5) Evidence
- Primary sources: source list includes baseline primary or quasi-primary anchors where available.
- Secondary/specialist sources: source list includes compendia/summaries used for triangulation.
- Conflicting definitions: contradictions should be recorded in \`docs/research-program/contradiction-log.md\` with claim IDs.

## 6) Source list
${sourceList}

## 7) Open questions
- What is the period-specific operational meaning versus ceremonial/nominal use?
- Which sources provide direct phrasing with stable locator anchors suitable for A/B claim promotion?
- Where do source traditions conflict, and which interpretation is currently preferred in the model?
`,
    sourceCount: c.sources.length
  };
}

async function main() {
  await mkdir(conceptDir, { recursive: true });
  const csv = parseCsv(await readFile(ledgerPath, 'utf8'));
  const header = csv[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));

  let updated = 0;
  for (let i = 1; i < csv.length; i++) {
    const row = csv[i];
    const content = buildConceptContent(row, idx);
    if (!content) continue;
    const target = row[idx.entry_file] ? join(rootDir, row[idx.entry_file]) : join(conceptDir, `${row[idx.concept_id]}.md`);
    await writeFile(target, content.text, 'utf8');
    row[idx.status] = 'in_progress';
    row[idx.linked_sources_count] = String(content.sourceCount);
    row[idx.last_updated] = DATE;
    row[idx.notes] = 'Quality refresh pass completed for concept entry.';
    updated += 1;
  }

  await writeFile(ledgerPath, toCsv(csv), 'utf8');
  console.log(`Concept entry refresh complete: ${updated} files rewritten.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

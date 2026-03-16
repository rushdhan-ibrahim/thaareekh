const UNDIRECTED_TYPES = new Set(['sibling', 'spouse', 'kin']);

function normalizeLabel(v) {
  return (v || '').trim();
}

function keyParts(t, s, d, l = '') {
  const label = normalizeLabel(l);
  if (UNDIRECTED_TYPES.has(t)) {
    const [a, b] = [s, d].sort();
    return `${t}|${a}|${b}|${label}`;
  }
  return `${t}|${s}|${d}|${label}`;
}

export function inferenceEdgeKey(edge) {
  if (!edge) return '';
  return keyParts(edge.t, edge.s, edge.d, edge.l || '');
}

function k(t, s, d, l = '') {
  return keyParts(t, s, d, l);
}

// Auto-synced from inference dossiers on 2026-02-21.
const INFERENCE_NOTES = new Map([
  [k("kin", "P100", "P83", "grandparent"), {
    summary: "P100 Mohamed Faamuladeyri Thakurufan and P83 Mohamed Muizzuddine (Keerithi Maha Radun) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p100-p83-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P100 Mohamed Faamuladeyri Thakurufan -> P80 Hassan Izzuddine (Kula Ran Meeba Audha) (CLM-0223, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P100 Mohamed Faamuladeyri Thakurufan as parent of P80 Hassan Izzuddine.",
      "Supporting edge: parent P80 Hassan Izzuddine (Kula Ran Meeba Audha) -> P83 Mohamed Muizzuddine (Keerithi Maha Radun) (CLM-0357, SRC-WIKI-MONARCHS, grade B); excerpt: List of Maldivian monarchs family/genealogy content lists P80 Hassan Izzuddine as parent of P83 Mohamed Muizzuddine.",
      "Rule application (parent-of-parent-grandparent): with source -> P80 Hassan Izzuddine (Kula Ran Meeba Audha) and P80 Hassan Izzuddine (Kula Ran Meeba Audha) -> target parent links, P100 Mohamed Faamuladeyri Thakurufan is modeled as inferred grandparent-line kin of P83 Mohamed Muizzuddine (Keerithi Maha Radun).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P100 Mohamed Faamuladeyri Thakurufan and P83 Mohamed Muizzuddine (Keerithi Maha Radun) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P100", "P84", "grandparent"), {
    summary: "P100 Mohamed Faamuladeyri Thakurufan and P84 Hassan Nooredine (Keerithi Maha Radun) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p100-p84-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P100 Mohamed Faamuladeyri Thakurufan -> P80 Hassan Izzuddine (Kula Ran Meeba Audha) (CLM-0223, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P100 Mohamed Faamuladeyri Thakurufan as parent of P80 Hassan Izzuddine.",
      "Rule application (parent-of-parent-grandparent): with source -> P80 Hassan Izzuddine (Kula Ran Meeba Audha) and P80 Hassan Izzuddine (Kula Ran Meeba Audha) -> target parent links, P100 Mohamed Faamuladeyri Thakurufan is modeled as inferred grandparent-line kin of P84 Hassan Nooredine (Keerithi Maha Radun).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P100 Mohamed Faamuladeyri Thakurufan and P84 Hassan Nooredine (Keerithi Maha Radun) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P102", "P104", "grandparent"), {
    summary: "P102 Kalhu Ali Thakurufan of Utheemu and P104 Mohamed Thakurufaanu al-Auzam are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p102-p104-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P102 Kalhu Ali Thakurufan of Utheemu -> P103 Hussain Thakurufan (CLM-0226, SRC-MRF-HILAALY, grade B); excerpt: Royal House of Hilaaly family/genealogy content lists P102 Kalhu Ali Thakurufan of Utheemu as parent of P103 Hussain Thakurufan.",
      "Supporting edge: parent P103 Hussain Thakurufan -> P104 Mohamed Thakurufaanu al-Auzam (CLM-0227, SRC-MRF-UTHEEM, grade A); excerpt: Utheem Dynasty family/genealogy content lists P103 Hussain Thakurufan as parent of P104 Mohamed Thakurufaanu al-Auzam.",
      "Rule application (parent-of-parent-grandparent): with source -> P103 Hussain Thakurufan and P103 Hussain Thakurufan -> target parent links, P102 Kalhu Ali Thakurufan of Utheemu is modeled as inferred grandparent-line kin of P104 Mohamed Thakurufaanu al-Auzam.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P102 Kalhu Ali Thakurufan of Utheemu and P104 Mohamed Thakurufaanu al-Auzam as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P103", "P106", "grandparent"), {
    summary: "P103 Hussain Thakurufan and P106 Ibrahim Kalaafaan are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p103-p106-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P103 Hussain Thakurufan -> P104 Mohamed Thakurufaanu al-Auzam (CLM-0227, SRC-MRF-UTHEEM, grade A); excerpt: Utheem Dynasty family/genealogy content lists P103 Hussain Thakurufan as parent of P104 Mohamed Thakurufaanu al-Auzam.",
      "Supporting edge: parent P104 Mohamed Thakurufaanu al-Auzam -> P106 Ibrahim Kalaafaan (CLM-0228, SRC-MRF-UTHEEM, grade B); excerpt: Utheem Dynasty family/genealogy content lists P104 Mohamed Thakurufaanu al-Auzam as parent of P106 Ibrahim Kalaafaan.",
      "Rule application (parent-of-parent-grandparent): with source -> P104 Mohamed Thakurufaanu al-Auzam and P104 Mohamed Thakurufaanu al-Auzam -> target parent links, P103 Hussain Thakurufan is modeled as inferred grandparent-line kin of P106 Ibrahim Kalaafaan.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P103 Hussain Thakurufan and P106 Ibrahim Kalaafaan as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P104", "P68", "reported shared Utheemu lineage branch"), {
    summary: "P104 Mohamed Thakurufaanu al-Auzam and P68 Mohamed Imaduddine (Kula Sundhura Katthiri Bavana) are modeled as `kin` with label `reported shared Utheemu lineage branch` to preserve a targeted continuity claim without over-promoting certainty.",
    dossier: "docs/research-program/inferences/kin-p104-p68-reported-shared-utheemu-lineage-branch.md",
    logic: [
      "No short direct-claim path (<=4 steps) was found in the current direct-edge set for this exact node pair.",
      "Inference currently rests on curated branch-context interpretation plus source-level continuity wording, not a direct named relation statement.",
      "Current modeling choice remains `inferred` because explicit source wording that names `kin` for P104 Mohamed Thakurufaanu al-Auzam and P68 Mohamed Imaduddine (Kula Sundhura Katthiri Bavana) is still absent."
    ],
    verification: [
      "Promotion requirement: an A/B source statement explicitly naming P104 Mohamed Thakurufaanu al-Auzam and P68 Mohamed Imaduddine (Kula Sundhura Katthiri Bavana) with relation class `kin` (reported shared Utheemu lineage branch).",
      "Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.",
      "Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster."
    ]
  }],
  [k("kin", "P107", "P31", "grandparent"), {
    summary: "P107 Golaavahi Kambulo and P31 Ibrahim (Dhammaru Veeru) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p107-p31-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P107 Golaavahi Kambulo -> P30 Hassan (Bavana) (CLM-0229, SRC-MRF-HILAALY, grade B); excerpt: Royal House of Hilaaly family/genealogy content lists P107 Golaavahi Kambulo as parent of P30 Hassan.",
      "Supporting edge: parent P30 Hassan (Bavana) -> P31 Ibrahim (Dhammaru Veeru) (CLM-0333, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P31 Ibrahim.",
      "Rule application (parent-of-parent-grandparent): with source -> P30 Hassan (Bavana) and P30 Hassan (Bavana) -> target parent links, P107 Golaavahi Kambulo is modeled as inferred grandparent-line kin of P31 Ibrahim (Dhammaru Veeru).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P107 Golaavahi Kambulo and P31 Ibrahim (Dhammaru Veeru) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P107", "P39", "grandparent"), {
    summary: "P107 Golaavahi Kambulo and P39 Yoosuf (Loka Aananadha) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p107-p39-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P107 Golaavahi Kambulo -> P30 Hassan (Bavana) (CLM-0229, SRC-MRF-HILAALY, grade B); excerpt: Royal House of Hilaaly family/genealogy content lists P107 Golaavahi Kambulo as parent of P30 Hassan.",
      "Supporting edge: parent P30 Hassan (Bavana) -> P39 Yoosuf (Loka Aananadha) (CLM-0334, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P39 Yoosuf.",
      "Rule application (parent-of-parent-grandparent): with source -> P30 Hassan (Bavana) and P30 Hassan (Bavana) -> target parent links, P107 Golaavahi Kambulo is modeled as inferred grandparent-line kin of P39 Yoosuf (Loka Aananadha).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P107 Golaavahi Kambulo and P39 Yoosuf (Loka Aananadha) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P107", "P40", "grandparent"), {
    summary: "P107 Golaavahi Kambulo and P40 Aboobakuru (Bavana Sooja) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p107-p40-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P107 Golaavahi Kambulo -> P30 Hassan (Bavana) (CLM-0229, SRC-MRF-HILAALY, grade B); excerpt: Royal House of Hilaaly family/genealogy content lists P107 Golaavahi Kambulo as parent of P30 Hassan.",
      "Supporting edge: parent P30 Hassan (Bavana) -> P40 Aboobakuru (Bavana Sooja) (CLM-0335, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P40 Aboobakuru.",
      "Rule application (parent-of-parent-grandparent): with source -> P30 Hassan (Bavana) and P30 Hassan (Bavana) -> target parent links, P107 Golaavahi Kambulo is modeled as inferred grandparent-line kin of P40 Aboobakuru (Bavana Sooja).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P107 Golaavahi Kambulo and P40 Aboobakuru (Bavana Sooja) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P110", "P115", "reported kin relation in elite Didi line"), {
    summary: "P110 Mohamed Amin Didi and P115 Ibrahim Nasir are modeled as `kin` with label `reported kin relation in elite Didi line` to preserve a targeted continuity claim without over-promoting certainty.",
    dossier: "docs/research-program/inferences/kin-p110-p115-reported-kin-relation-in-elite-didi-line.md",
    logic: [
      "No short direct-claim path (<=4 steps) was found in the current direct-edge set for this exact node pair.",
      "Inference currently rests on curated branch-context interpretation plus source-level continuity wording, not a direct named relation statement.",
      "Current modeling choice remains `inferred` because explicit source wording that names `kin` for P110 Mohamed Amin Didi and P115 Ibrahim Nasir is still absent."
    ],
    verification: [
      "Promotion requirement: an A/B source statement explicitly naming P110 Mohamed Amin Didi and P115 Ibrahim Nasir with relation class `kin` (reported kin relation in elite Didi line).",
      "Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.",
      "Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster."
    ]
  }],
  [k("kin", "P111", "P115", "reported extended Didi lineage"), {
    summary: "P111 Prince Abdul Majeed Didi and P115 Ibrahim Nasir are modeled as `kin` with label `reported extended Didi lineage` to preserve a targeted continuity claim without over-promoting certainty.",
    dossier: "docs/research-program/inferences/kin-p111-p115-reported-extended-didi-lineage.md",
    logic: [
      "No short direct-claim path (<=4 steps) was found in the current direct-edge set for this exact node pair.",
      "Inference currently rests on curated branch-context interpretation plus source-level continuity wording, not a direct named relation statement.",
      "Current modeling choice remains `inferred` because explicit source wording that names `kin` for P111 Prince Abdul Majeed Didi and P115 Ibrahim Nasir is still absent."
    ],
    verification: [
      "Promotion requirement: an A/B source statement explicitly naming P111 Prince Abdul Majeed Didi and P115 Ibrahim Nasir with relation class `kin` (reported extended Didi lineage).",
      "Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.",
      "Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster."
    ]
  }],
  [k("kin", "P112", "P114", "grandparent"), {
    summary: "P112 Roanugey Aishath Didi and P114 Ameena Mohamed Amin are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p112-p114-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P112 Roanugey Aishath Didi -> P110 Mohamed Amin Didi (CLM-0236, SRC-PO-AMIN, grade A); excerpt: Official former-president profile states Mohamed Amin was born as son of Ahmed Didi and Nayaage Aishath Didi. (pair: P112 Roanugey Aishath Didi -> ...",
      "Supporting edge: parent P110 Mohamed Amin Didi -> P114 Ameena Mohamed Amin (CLM-0232, SRC-WIKI-AMIN-DIDI, grade B); excerpt: Mohamed Amin Didi family/genealogy content lists P110 Mohamed Amin Didi as parent of P114 Ameena Mohamed Amin.",
      "Rule application (parent-of-parent-grandparent): with source -> P110 Mohamed Amin Didi and P110 Mohamed Amin Didi -> target parent links, P112 Roanugey Aishath Didi is modeled as inferred grandparent-line kin of P114 Ameena Mohamed Amin.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P112 Roanugey Aishath Didi and P114 Ameena Mohamed Amin as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P116", "P124", "grandparent"), {
    summary: "P116 Ahmed Didi and P124 Ali Nasir are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p116-p124-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P116 Ahmed Didi -> P115 Ibrahim Nasir (CLM-0244, SRC-PO-NASIR, grade A); excerpt: Official former-president profile states Ibrahim Nasir was son of Ahmed Didi and Nayaage Aishath Didi. (pair: P116 Ahmed Didi -> P115 Ibrahim Nasir).",
      "Supporting edge: parent P115 Ibrahim Nasir -> P124 Ali Nasir (CLM-0238, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ali Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P124 Ali Nasir).",
      "Rule application (parent-of-parent-grandparent): with source -> P115 Ibrahim Nasir and P115 Ibrahim Nasir -> target parent links, P116 Ahmed Didi is modeled as inferred grandparent-line kin of P124 Ali Nasir.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P116 Ahmed Didi and P124 Ali Nasir as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P116", "P143", "grandparent"), {
    summary: "P116 Ahmed Didi and P143 Ahmed Nasir are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p116-p143-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P116 Ahmed Didi -> P115 Ibrahim Nasir (CLM-0244, SRC-PO-NASIR, grade A); excerpt: Official former-president profile states Ibrahim Nasir was son of Ahmed Didi and Nayaage Aishath Didi. (pair: P116 Ahmed Didi -> P115 Ibrahim Nasir).",
      "Supporting edge: parent P115 Ibrahim Nasir -> P143 Ahmed Nasir (CLM-0239, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ahmed Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P143 Ahmed Nasir).",
      "Rule application (parent-of-parent-grandparent): with source -> P115 Ibrahim Nasir and P115 Ibrahim Nasir -> target parent links, P116 Ahmed Didi is modeled as inferred grandparent-line kin of P143 Ahmed Nasir.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P116 Ahmed Didi and P143 Ahmed Nasir as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P116", "P144", "grandparent"), {
    summary: "P116 Ahmed Didi and P144 Mohamed Nasir are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p116-p144-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P116 Ahmed Didi -> P115 Ibrahim Nasir (CLM-0244, SRC-PO-NASIR, grade A); excerpt: Official former-president profile states Ibrahim Nasir was son of Ahmed Didi and Nayaage Aishath Didi. (pair: P116 Ahmed Didi -> P115 Ibrahim Nasir).",
      "Supporting edge: parent P115 Ibrahim Nasir -> P144 Mohamed Nasir (CLM-0240, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Mohamed Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P144 Mohamed Nasir).",
      "Rule application (parent-of-parent-grandparent): with source -> P115 Ibrahim Nasir and P115 Ibrahim Nasir -> target parent links, P116 Ahmed Didi is modeled as inferred grandparent-line kin of P144 Mohamed Nasir.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P116 Ahmed Didi and P144 Mohamed Nasir as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P116", "P145", "grandparent"), {
    summary: "P116 Ahmed Didi and P145 Ibrahim Nasir (son of President Ibrahim Nasir) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p116-p145-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P116 Ahmed Didi -> P115 Ibrahim Nasir (CLM-0244, SRC-PO-NASIR, grade A); excerpt: Official former-president profile states Ibrahim Nasir was son of Ahmed Didi and Nayaage Aishath Didi. (pair: P116 Ahmed Didi -> P115 Ibrahim Nasir).",
      "Supporting edge: parent P115 Ibrahim Nasir -> P145 Ibrahim Nasir (son of President Ibrahim Nasir) (CLM-0241, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ibrahim Nasir (junior) as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P145 Ibrahim Nasir (son of P...",
      "Rule application (parent-of-parent-grandparent): with source -> P115 Ibrahim Nasir and P115 Ibrahim Nasir -> target parent links, P116 Ahmed Didi is modeled as inferred grandparent-line kin of P145 Ibrahim Nasir (son of President Ibrahim Nasir).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P116 Ahmed Didi and P145 Ibrahim Nasir (son of President Ibrahim Nasir) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P116", "P146", "grandparent"), {
    summary: "P116 Ahmed Didi and P146 Ismail Nasir are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p116-p146-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P116 Ahmed Didi -> P115 Ibrahim Nasir (CLM-0244, SRC-PO-NASIR, grade A); excerpt: Official former-president profile states Ibrahim Nasir was son of Ahmed Didi and Nayaage Aishath Didi. (pair: P116 Ahmed Didi -> P115 Ibrahim Nasir).",
      "Supporting edge: parent P115 Ibrahim Nasir -> P146 Ismail Nasir (CLM-0242, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ismail Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P146 Ismail Nasir).",
      "Rule application (parent-of-parent-grandparent): with source -> P115 Ibrahim Nasir and P115 Ibrahim Nasir -> target parent links, P116 Ahmed Didi is modeled as inferred grandparent-line kin of P146 Ismail Nasir.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P116 Ahmed Didi and P146 Ismail Nasir as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P116", "P147", "grandparent"), {
    summary: "P116 Ahmed Didi and P147 Aishath Nasir are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p116-p147-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P116 Ahmed Didi -> P115 Ibrahim Nasir (CLM-0244, SRC-PO-NASIR, grade A); excerpt: Official former-president profile states Ibrahim Nasir was son of Ahmed Didi and Nayaage Aishath Didi. (pair: P116 Ahmed Didi -> P115 Ibrahim Nasir).",
      "Supporting edge: parent P115 Ibrahim Nasir -> P147 Aishath Nasir (CLM-0243, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Aishath Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P147 Aishath Nasir).",
      "Rule application (parent-of-parent-grandparent): with source -> P115 Ibrahim Nasir and P115 Ibrahim Nasir -> target parent links, P116 Ahmed Didi is modeled as inferred grandparent-line kin of P147 Aishath Nasir.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P116 Ahmed Didi and P147 Aishath Nasir as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P117", "P124", "grandparent"), {
    summary: "P117 Nayaage Aishath Didi and P124 Ali Nasir are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p117-p124-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P117 Nayaage Aishath Didi -> P115 Ibrahim Nasir (CLM-0245, SRC-PO-NASIR, grade A); excerpt: Official former-president profile states Ibrahim Nasir was son of Ahmed Didi and Nayaage Aishath Didi. (pair: P117 Nayaage Aishath Didi -> P115 Ibr...",
      "Supporting edge: parent P115 Ibrahim Nasir -> P124 Ali Nasir (CLM-0238, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ali Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P124 Ali Nasir).",
      "Rule application (parent-of-parent-grandparent): with source -> P115 Ibrahim Nasir and P115 Ibrahim Nasir -> target parent links, P117 Nayaage Aishath Didi is modeled as inferred grandparent-line kin of P124 Ali Nasir.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P117 Nayaage Aishath Didi and P124 Ali Nasir as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P117", "P143", "grandparent"), {
    summary: "P117 Nayaage Aishath Didi and P143 Ahmed Nasir are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p117-p143-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P117 Nayaage Aishath Didi -> P115 Ibrahim Nasir (CLM-0245, SRC-PO-NASIR, grade A); excerpt: Official former-president profile states Ibrahim Nasir was son of Ahmed Didi and Nayaage Aishath Didi. (pair: P117 Nayaage Aishath Didi -> P115 Ibr...",
      "Supporting edge: parent P115 Ibrahim Nasir -> P143 Ahmed Nasir (CLM-0239, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ahmed Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P143 Ahmed Nasir).",
      "Rule application (parent-of-parent-grandparent): with source -> P115 Ibrahim Nasir and P115 Ibrahim Nasir -> target parent links, P117 Nayaage Aishath Didi is modeled as inferred grandparent-line kin of P143 Ahmed Nasir.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P117 Nayaage Aishath Didi and P143 Ahmed Nasir as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P117", "P144", "grandparent"), {
    summary: "P117 Nayaage Aishath Didi and P144 Mohamed Nasir are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p117-p144-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P117 Nayaage Aishath Didi -> P115 Ibrahim Nasir (CLM-0245, SRC-PO-NASIR, grade A); excerpt: Official former-president profile states Ibrahim Nasir was son of Ahmed Didi and Nayaage Aishath Didi. (pair: P117 Nayaage Aishath Didi -> P115 Ibr...",
      "Supporting edge: parent P115 Ibrahim Nasir -> P144 Mohamed Nasir (CLM-0240, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Mohamed Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P144 Mohamed Nasir).",
      "Rule application (parent-of-parent-grandparent): with source -> P115 Ibrahim Nasir and P115 Ibrahim Nasir -> target parent links, P117 Nayaage Aishath Didi is modeled as inferred grandparent-line kin of P144 Mohamed Nasir.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P117 Nayaage Aishath Didi and P144 Mohamed Nasir as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P117", "P145", "grandparent"), {
    summary: "P117 Nayaage Aishath Didi and P145 Ibrahim Nasir (son of President Ibrahim Nasir) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p117-p145-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P117 Nayaage Aishath Didi -> P115 Ibrahim Nasir (CLM-0245, SRC-PO-NASIR, grade A); excerpt: Official former-president profile states Ibrahim Nasir was son of Ahmed Didi and Nayaage Aishath Didi. (pair: P117 Nayaage Aishath Didi -> P115 Ibr...",
      "Supporting edge: parent P115 Ibrahim Nasir -> P145 Ibrahim Nasir (son of President Ibrahim Nasir) (CLM-0241, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ibrahim Nasir (junior) as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P145 Ibrahim Nasir (son of P...",
      "Rule application (parent-of-parent-grandparent): with source -> P115 Ibrahim Nasir and P115 Ibrahim Nasir -> target parent links, P117 Nayaage Aishath Didi is modeled as inferred grandparent-line kin of P145 Ibrahim Nasir (son of President Ibrahim Nasir).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P117 Nayaage Aishath Didi and P145 Ibrahim Nasir (son of President Ibrahim Nasir) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P117", "P146", "grandparent"), {
    summary: "P117 Nayaage Aishath Didi and P146 Ismail Nasir are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p117-p146-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P117 Nayaage Aishath Didi -> P115 Ibrahim Nasir (CLM-0245, SRC-PO-NASIR, grade A); excerpt: Official former-president profile states Ibrahim Nasir was son of Ahmed Didi and Nayaage Aishath Didi. (pair: P117 Nayaage Aishath Didi -> P115 Ibr...",
      "Supporting edge: parent P115 Ibrahim Nasir -> P146 Ismail Nasir (CLM-0242, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ismail Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P146 Ismail Nasir).",
      "Rule application (parent-of-parent-grandparent): with source -> P115 Ibrahim Nasir and P115 Ibrahim Nasir -> target parent links, P117 Nayaage Aishath Didi is modeled as inferred grandparent-line kin of P146 Ismail Nasir.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P117 Nayaage Aishath Didi and P146 Ismail Nasir as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P117", "P147", "grandparent"), {
    summary: "P117 Nayaage Aishath Didi and P147 Aishath Nasir are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p117-p147-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P117 Nayaage Aishath Didi -> P115 Ibrahim Nasir (CLM-0245, SRC-PO-NASIR, grade A); excerpt: Official former-president profile states Ibrahim Nasir was son of Ahmed Didi and Nayaage Aishath Didi. (pair: P117 Nayaage Aishath Didi -> P115 Ibr...",
      "Supporting edge: parent P115 Ibrahim Nasir -> P147 Aishath Nasir (CLM-0243, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Aishath Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P147 Aishath Nasir).",
      "Rule application (parent-of-parent-grandparent): with source -> P115 Ibrahim Nasir and P115 Ibrahim Nasir -> target parent links, P117 Nayaage Aishath Didi is modeled as inferred grandparent-line kin of P147 Aishath Nasir.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P117 Nayaage Aishath Didi and P147 Aishath Nasir as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P120", "P150", "grandparent"), {
    summary: "P120 Abdul Gayoom Ibrahim and P150 Dunya Maumoon are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p120-p150-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P120 Abdul Gayoom Ibrahim -> P119 Maumoon Abdul Gayoom (CLM-0252, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox father field names Abdul Gayoom Ibrahim as father of Maumoon Abdul Gayoom. (pair: P120 Abdul Gayoom Ibrahim -> P119 Maumoon A...",
      "Supporting edge: parent P119 Maumoon Abdul Gayoom -> P150 Dunya Maumoon (CLM-0248, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Dunya Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P150 Dunya Maumoon).",
      "Rule application (parent-of-parent-grandparent): with source -> P119 Maumoon Abdul Gayoom and P119 Maumoon Abdul Gayoom -> target parent links, P120 Abdul Gayoom Ibrahim is modeled as inferred grandparent-line kin of P150 Dunya Maumoon.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P120 Abdul Gayoom Ibrahim and P150 Dunya Maumoon as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P120", "P151", "grandparent"), {
    summary: "P120 Abdul Gayoom Ibrahim and P151 Yumna Maumoon are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p120-p151-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P120 Abdul Gayoom Ibrahim -> P119 Maumoon Abdul Gayoom (CLM-0252, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox father field names Abdul Gayoom Ibrahim as father of Maumoon Abdul Gayoom. (pair: P120 Abdul Gayoom Ibrahim -> P119 Maumoon A...",
      "Supporting edge: parent P119 Maumoon Abdul Gayoom -> P151 Yumna Maumoon (CLM-0249, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Yumna Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P151 Yumna Maumoon).",
      "Rule application (parent-of-parent-grandparent): with source -> P119 Maumoon Abdul Gayoom and P119 Maumoon Abdul Gayoom -> target parent links, P120 Abdul Gayoom Ibrahim is modeled as inferred grandparent-line kin of P151 Yumna Maumoon.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P120 Abdul Gayoom Ibrahim and P151 Yumna Maumoon as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P120", "P152", "grandparent"), {
    summary: "P120 Abdul Gayoom Ibrahim and P152 Faris Maumoon are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p120-p152-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P120 Abdul Gayoom Ibrahim -> P119 Maumoon Abdul Gayoom (CLM-0252, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox father field names Abdul Gayoom Ibrahim as father of Maumoon Abdul Gayoom. (pair: P120 Abdul Gayoom Ibrahim -> P119 Maumoon A...",
      "Supporting edge: parent P119 Maumoon Abdul Gayoom -> P152 Faris Maumoon (CLM-0250, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Faris Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P152 Faris Maumoon).",
      "Rule application (parent-of-parent-grandparent): with source -> P119 Maumoon Abdul Gayoom and P119 Maumoon Abdul Gayoom -> target parent links, P120 Abdul Gayoom Ibrahim is modeled as inferred grandparent-line kin of P152 Faris Maumoon.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P120 Abdul Gayoom Ibrahim and P152 Faris Maumoon as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P120", "P153", "grandparent"), {
    summary: "P120 Abdul Gayoom Ibrahim and P153 Ghassan Maumoon are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p120-p153-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P120 Abdul Gayoom Ibrahim -> P119 Maumoon Abdul Gayoom (CLM-0252, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox father field names Abdul Gayoom Ibrahim as father of Maumoon Abdul Gayoom. (pair: P120 Abdul Gayoom Ibrahim -> P119 Maumoon A...",
      "Supporting edge: parent P119 Maumoon Abdul Gayoom -> P153 Ghassan Maumoon (CLM-0251, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Ghassan Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P153 Ghassan Maumoon).",
      "Rule application (parent-of-parent-grandparent): with source -> P119 Maumoon Abdul Gayoom and P119 Maumoon Abdul Gayoom -> target parent links, P120 Abdul Gayoom Ibrahim is modeled as inferred grandparent-line kin of P153 Ghassan Maumoon.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P120 Abdul Gayoom Ibrahim and P153 Ghassan Maumoon as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P121", "P150", "aunt/uncle↔niece/nephew"), {
    summary: "P121 Abdulla Yameen Abdul Gayoom and P150 Dunya Maumoon are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p121-p150-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P119 Maumoon Abdul Gayoom -> P150 Dunya Maumoon (CLM-0248, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Dunya Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P150 Dunya Maumoon).",
      "Supporting edge: sibling P119 Maumoon Abdul Gayoom <-> P121 Abdulla Yameen Abdul Gayoom [half-brothers] (CLM-0375, SRC-PO-YAMEEN, grade A); excerpt: Official former-president profile identifies Abdulla Yameen as younger brother of former President Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul ...",
      "Rule application (parent-sibling-aunt-uncle): sibling(P119 Maumoon Abdul Gayoom, P121 Abdulla Yameen Abdul Gayoom) plus parent(P119 Maumoon Abdul Gayoom, child) yields inferred aunt/uncle-line kin between P121 Abdulla Yameen Abdul Gayoom and P150 Dunya Maumoon.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P121 Abdulla Yameen Abdul Gayoom and P150 Dunya Maumoon as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P121", "P151", "aunt/uncle↔niece/nephew"), {
    summary: "P121 Abdulla Yameen Abdul Gayoom and P151 Yumna Maumoon are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p121-p151-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P119 Maumoon Abdul Gayoom -> P151 Yumna Maumoon (CLM-0249, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Yumna Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P151 Yumna Maumoon).",
      "Supporting edge: sibling P119 Maumoon Abdul Gayoom <-> P121 Abdulla Yameen Abdul Gayoom [half-brothers] (CLM-0375, SRC-PO-YAMEEN, grade A); excerpt: Official former-president profile identifies Abdulla Yameen as younger brother of former President Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul ...",
      "Rule application (parent-sibling-aunt-uncle): sibling(P119 Maumoon Abdul Gayoom, P121 Abdulla Yameen Abdul Gayoom) plus parent(P119 Maumoon Abdul Gayoom, child) yields inferred aunt/uncle-line kin between P121 Abdulla Yameen Abdul Gayoom and P151 Yumna Maumoon.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P121 Abdulla Yameen Abdul Gayoom and P151 Yumna Maumoon as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P121", "P152", "aunt/uncle↔niece/nephew"), {
    summary: "P121 Abdulla Yameen Abdul Gayoom and P152 Faris Maumoon are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p121-p152-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P119 Maumoon Abdul Gayoom -> P152 Faris Maumoon (CLM-0250, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Faris Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P152 Faris Maumoon).",
      "Supporting edge: sibling P119 Maumoon Abdul Gayoom <-> P121 Abdulla Yameen Abdul Gayoom [half-brothers] (CLM-0375, SRC-PO-YAMEEN, grade A); excerpt: Official former-president profile identifies Abdulla Yameen as younger brother of former President Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul ...",
      "Rule application (parent-sibling-aunt-uncle): sibling(P119 Maumoon Abdul Gayoom, P121 Abdulla Yameen Abdul Gayoom) plus parent(P119 Maumoon Abdul Gayoom, child) yields inferred aunt/uncle-line kin between P121 Abdulla Yameen Abdul Gayoom and P152 Faris Maumoon.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P121 Abdulla Yameen Abdul Gayoom and P152 Faris Maumoon as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P121", "P153", "aunt/uncle↔niece/nephew"), {
    summary: "P121 Abdulla Yameen Abdul Gayoom and P153 Ghassan Maumoon are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p121-p153-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P119 Maumoon Abdul Gayoom -> P153 Ghassan Maumoon (CLM-0251, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Ghassan Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P153 Ghassan Maumoon).",
      "Supporting edge: sibling P119 Maumoon Abdul Gayoom <-> P121 Abdulla Yameen Abdul Gayoom [half-brothers] (CLM-0375, SRC-PO-YAMEEN, grade A); excerpt: Official former-president profile identifies Abdulla Yameen as younger brother of former President Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul ...",
      "Rule application (parent-sibling-aunt-uncle): sibling(P119 Maumoon Abdul Gayoom, P121 Abdulla Yameen Abdul Gayoom) plus parent(P119 Maumoon Abdul Gayoom, child) yields inferred aunt/uncle-line kin between P121 Abdulla Yameen Abdul Gayoom and P153 Ghassan Maumoon.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P121 Abdulla Yameen Abdul Gayoom and P153 Ghassan Maumoon as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P122", "P168", "reported first-cousin relation"), {
    summary: "P122 Mohamed Nasheed and P168 Fazna Ahmed are modeled as `kin` with label `reported first-cousin relation` to preserve a targeted continuity claim without over-promoting certainty.",
    dossier: "docs/research-program/inferences/kin-p122-p168-reported-first-cousin-relation.md",
    logic: [
      "No short direct-claim path (<=4 steps) was found in the current direct-edge set for this exact node pair.",
      "Inference currently rests on curated branch-context interpretation plus source-level continuity wording, not a direct named relation statement.",
      "Current modeling choice remains `inferred` because explicit source wording that names `kin` for P122 Mohamed Nasheed and P168 Fazna Ahmed is still absent."
    ],
    verification: [
      "Promotion requirement: an A/B source statement explicitly naming P122 Mohamed Nasheed and P168 Fazna Ahmed with relation class `kin` (reported first-cousin relation).",
      "Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.",
      "Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster."
    ]
  }],
  [k("kin", "P127", "P125", "grandparent"), {
    summary: "P127 Abdul Sattar Umar and P125 Meera Laila Nasheed are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p125-p127-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P127 Abdul Sattar Umar -> P122 Mohamed Nasheed (CLM-0258, SRC-ATOLL-NASHEED-PARENTS, grade B); excerpt: Atoll Times report names Mohamed Nasheed’s father as Abdul Sattar Umar. (pair: P127 Abdul Sattar Umar -> P122 Mohamed Nasheed).",
      "Supporting edge: parent P122 Mohamed Nasheed -> P125 Meera Laila Nasheed (CLM-0254, SRC-WIKI-NASHEED, grade B); excerpt: Wikipedia raw infobox issue field lists Meera Laila Nasheed as child of Mohamed Nasheed. (pair: P122 Mohamed Nasheed -> P125 Meera Laila Nasheed).",
      "Rule application (parent-of-parent-grandparent): with source -> P122 Mohamed Nasheed and P122 Mohamed Nasheed -> target parent links, P127 Abdul Sattar Umar is modeled as inferred grandparent-line kin of P125 Meera Laila Nasheed.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P127 Abdul Sattar Umar and P125 Meera Laila Nasheed as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P127", "P126", "grandparent"), {
    summary: "P127 Abdul Sattar Umar and P126 Zaya Laila Nasheed are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p126-p127-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P127 Abdul Sattar Umar -> P122 Mohamed Nasheed (CLM-0258, SRC-ATOLL-NASHEED-PARENTS, grade B); excerpt: Atoll Times report names Mohamed Nasheed’s father as Abdul Sattar Umar. (pair: P127 Abdul Sattar Umar -> P122 Mohamed Nasheed).",
      "Supporting edge: parent P122 Mohamed Nasheed -> P126 Zaya Laila Nasheed (CLM-0255, SRC-WIKI-NASHEED, grade B); excerpt: Wikipedia raw infobox issue field lists Zaya Laila Nasheed as child of Mohamed Nasheed. (pair: P122 Mohamed Nasheed -> P126 Zaya Laila Nasheed).",
      "Rule application (parent-of-parent-grandparent): with source -> P122 Mohamed Nasheed and P122 Mohamed Nasheed -> target parent links, P127 Abdul Sattar Umar is modeled as inferred grandparent-line kin of P126 Zaya Laila Nasheed.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P127 Abdul Sattar Umar and P126 Zaya Laila Nasheed as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P128", "P125", "grandparent"), {
    summary: "P128 Abida Mohamed and P125 Meera Laila Nasheed are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p125-p128-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P128 Abida Mohamed -> P122 Mohamed Nasheed (CLM-0259, SRC-ATOLL-NASHEED-PARENTS, grade B); excerpt: Atoll Times report names Mohamed Nasheed’s mother as Abida Mohamed. (pair: P128 Abida Mohamed -> P122 Mohamed Nasheed).",
      "Supporting edge: parent P122 Mohamed Nasheed -> P125 Meera Laila Nasheed (CLM-0254, SRC-WIKI-NASHEED, grade B); excerpt: Wikipedia raw infobox issue field lists Meera Laila Nasheed as child of Mohamed Nasheed. (pair: P122 Mohamed Nasheed -> P125 Meera Laila Nasheed).",
      "Rule application (parent-of-parent-grandparent): with source -> P122 Mohamed Nasheed and P122 Mohamed Nasheed -> target parent links, P128 Abida Mohamed is modeled as inferred grandparent-line kin of P125 Meera Laila Nasheed.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P128 Abida Mohamed and P125 Meera Laila Nasheed as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P128", "P126", "grandparent"), {
    summary: "P128 Abida Mohamed and P126 Zaya Laila Nasheed are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p126-p128-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P128 Abida Mohamed -> P122 Mohamed Nasheed (CLM-0259, SRC-ATOLL-NASHEED-PARENTS, grade B); excerpt: Atoll Times report names Mohamed Nasheed’s mother as Abida Mohamed. (pair: P128 Abida Mohamed -> P122 Mohamed Nasheed).",
      "Supporting edge: parent P122 Mohamed Nasheed -> P126 Zaya Laila Nasheed (CLM-0255, SRC-WIKI-NASHEED, grade B); excerpt: Wikipedia raw infobox issue field lists Zaya Laila Nasheed as child of Mohamed Nasheed. (pair: P122 Mohamed Nasheed -> P126 Zaya Laila Nasheed).",
      "Rule application (parent-of-parent-grandparent): with source -> P122 Mohamed Nasheed and P122 Mohamed Nasheed -> target parent links, P128 Abida Mohamed is modeled as inferred grandparent-line kin of P126 Zaya Laila Nasheed.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P128 Abida Mohamed and P126 Zaya Laila Nasheed as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P130", "P132", "possible southern-branch continuity (Addu/Fuvahmulah)"), {
    summary: "P130 Prince Ibrahim Faamuladheyri Kilegefaanu and P132 Al-Naib Muhammad Thakurufaanu of Addu are modeled as `kin` with label `possible southern-branch continuity (Addu/Fuvahmulah)` to preserve a targeted continuity claim without over-promoting certainty.",
    dossier: "docs/research-program/inferences/kin-p130-p132-possible-southern-branch-continuity-addu-fuvahmulah.md",
    logic: [
      "No short direct-claim path (<=4 steps) was found in the current direct-edge set for this exact node pair.",
      "Inference currently rests on curated branch-context interpretation plus source-level continuity wording, not a direct named relation statement.",
      "Current modeling choice remains `inferred` because explicit source wording that names `kin` for P130 Prince Ibrahim Faamuladheyri Kilegefaanu and P132 Al-Naib Muhammad Thakurufaanu of Addu is still absent."
    ],
    verification: [
      "Promotion requirement: an A/B source statement explicitly naming P130 Prince Ibrahim Faamuladheyri Kilegefaanu and P132 Al-Naib Muhammad Thakurufaanu of Addu with relation class `kin` (possible southern-branch continuity (Addu/Fuvahmulah)).",
      "Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.",
      "Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster."
    ]
  }],
  [k("kin", "P130", "P139", "grandparent"), {
    summary: "P130 Prince Ibrahim Faamuladheyri Kilegefaanu and P139 Hussain Didi are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p130-p139-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P130 Prince Ibrahim Faamuladheyri Kilegefaanu -> P140 Al-Nabeel Karayye Hassan Didi (CLM-0266, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P130 Prince Ibrahim Faamuladheyri Kilegefaanu as parent of P140 Al-Nabeel Karayye Hassan Didi.",
      "Supporting edge: parent P140 Al-Nabeel Karayye Hassan Didi -> P139 Hussain Didi (CLM-0275, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P140 Al-Nabeel Karayye Hassan Didi as parent of P139 Hussain Didi.",
      "Rule application (parent-of-parent-grandparent): with source -> P140 Al-Nabeel Karayye Hassan Didi and P140 Al-Nabeel Karayye Hassan Didi -> target parent links, P130 Prince Ibrahim Faamuladheyri Kilegefaanu is modeled as inferred grandparent-line kin of P139 Hussain Didi.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P130 Prince Ibrahim Faamuladheyri Kilegefaanu and P139 Hussain Didi as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P130", "P183", "grandparent"), {
    summary: "P130 Prince Ibrahim Faamuladheyri Kilegefaanu and P183 Ganduvaru Hassan Didi are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p130-p183-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P130 Prince Ibrahim Faamuladheyri Kilegefaanu -> P180 Princess Aishath Didi (CLM-0267, SRC-MRF-MIDU-ROYAL, grade B); excerpt: Midu Royal Family Branch (Addu/Meedhoo records) family/genealogy content lists P130 Prince Ibrahim Faamuladheyri Kilegefaanu as parent of P180 Prin...",
      "Supporting edge: parent P180 Princess Aishath Didi -> P183 Ganduvaru Hassan Didi (CLM-0319, SRC-MRF-MIDU-ROYAL, grade B); excerpt: Midu Royal Family Branch (Addu/Meedhoo records) family/genealogy content lists P180 Princess Aishath Didi as parent of P183 Ganduvaru Hassan Didi.",
      "Rule application (parent-of-parent-grandparent): with source -> P180 Princess Aishath Didi and P180 Princess Aishath Didi -> target parent links, P130 Prince Ibrahim Faamuladheyri Kilegefaanu is modeled as inferred grandparent-line kin of P183 Ganduvaru Hassan Didi.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P130 Prince Ibrahim Faamuladheyri Kilegefaanu and P183 Ganduvaru Hassan Didi as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P131", "P139", "aunt/uncle↔niece/nephew"), {
    summary: "P131 Mohamed Didi and P139 Hussain Didi are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p131-p139-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P140 Al-Nabeel Karayye Hassan Didi -> P139 Hussain Didi (CLM-0275, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P140 Al-Nabeel Karayye Hassan Didi as parent of P139 Hussain Didi.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P140 Al-Nabeel Karayye Hassan Didi, P131 Mohamed Didi) plus parent(P140 Al-Nabeel Karayye Hassan Didi, child) yields inferred aunt/uncle-line kin between P131 Mohamed Didi and P139 Hussain Didi.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P131 Mohamed Didi and P139 Hussain Didi as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P131", "P183", "aunt/uncle↔niece/nephew"), {
    summary: "P131 Mohamed Didi and P183 Ganduvaru Hassan Didi are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p131-p183-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P180 Princess Aishath Didi -> P183 Ganduvaru Hassan Didi (CLM-0319, SRC-MRF-MIDU-ROYAL, grade B); excerpt: Midu Royal Family Branch (Addu/Meedhoo records) family/genealogy content lists P180 Princess Aishath Didi as parent of P183 Ganduvaru Hassan Didi.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P180 Princess Aishath Didi, P131 Mohamed Didi) plus parent(P180 Princess Aishath Didi, child) yields inferred aunt/uncle-line kin between P131 Mohamed Didi and P183 Ganduvaru Hassan Didi.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P131 Mohamed Didi and P183 Ganduvaru Hassan Didi as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P133", "P135", "grandparent"), {
    summary: "P133 Ibrahim Al-Husainee and P135 Galolhu Sitti are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p133-p135-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P133 Ibrahim Al-Husainee -> P134 Galolhu Seedhi (CLM-0268, SRC-WIKI-ABDUL-GAYOOM-IBRAHIM, grade B); excerpt: Abdul Gayoom Ibrahim family/genealogy content lists P133 Ibrahim Al-Husainee as parent of P134 Galolhu Seedhi.",
      "Supporting edge: parent P134 Galolhu Seedhi -> P135 Galolhu Sitti (CLM-0269, SRC-WIKI-ABDUL-GAYOOM-IBRAHIM, grade B); excerpt: Abdul Gayoom Ibrahim family/genealogy content lists P134 Galolhu Seedhi as parent of P135 Galolhu Sitti.",
      "Rule application (parent-of-parent-grandparent): with source -> P134 Galolhu Seedhi and P134 Galolhu Seedhi -> target parent links, P133 Ibrahim Al-Husainee is modeled as inferred grandparent-line kin of P135 Galolhu Sitti.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P133 Ibrahim Al-Husainee and P135 Galolhu Sitti as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P134", "P120", "grandparent"), {
    summary: "P134 Galolhu Seedhi and P120 Abdul Gayoom Ibrahim are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p120-p134-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P134 Galolhu Seedhi -> P135 Galolhu Sitti (CLM-0269, SRC-WIKI-ABDUL-GAYOOM-IBRAHIM, grade B); excerpt: Abdul Gayoom Ibrahim family/genealogy content lists P134 Galolhu Seedhi as parent of P135 Galolhu Sitti.",
      "Supporting edge: parent P135 Galolhu Sitti -> P120 Abdul Gayoom Ibrahim (CLM-0270, SRC-WIKI-ABDUL-GAYOOM-IBRAHIM, grade B); excerpt: Abdul Gayoom Ibrahim family/genealogy content lists P135 Galolhu Sitti as parent of P120 Abdul Gayoom Ibrahim.",
      "Rule application (parent-of-parent-grandparent): with source -> P135 Galolhu Sitti and P135 Galolhu Sitti -> target parent links, P134 Galolhu Seedhi is modeled as inferred grandparent-line kin of P120 Abdul Gayoom Ibrahim.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P134 Galolhu Seedhi and P120 Abdul Gayoom Ibrahim as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P135", "P119", "grandparent"), {
    summary: "P135 Galolhu Sitti and P119 Maumoon Abdul Gayoom are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p119-p135-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P135 Galolhu Sitti -> P120 Abdul Gayoom Ibrahim (CLM-0270, SRC-WIKI-ABDUL-GAYOOM-IBRAHIM, grade B); excerpt: Abdul Gayoom Ibrahim family/genealogy content lists P135 Galolhu Sitti as parent of P120 Abdul Gayoom Ibrahim.",
      "Supporting edge: parent P120 Abdul Gayoom Ibrahim -> P119 Maumoon Abdul Gayoom (CLM-0252, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox father field names Abdul Gayoom Ibrahim as father of Maumoon Abdul Gayoom. (pair: P120 Abdul Gayoom Ibrahim -> P119 Maumoon A...",
      "Rule application (parent-of-parent-grandparent): with source -> P120 Abdul Gayoom Ibrahim and P120 Abdul Gayoom Ibrahim -> target parent links, P135 Galolhu Sitti is modeled as inferred grandparent-line kin of P119 Maumoon Abdul Gayoom.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P135 Galolhu Sitti and P119 Maumoon Abdul Gayoom as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P135", "P121", "grandparent"), {
    summary: "P135 Galolhu Sitti and P121 Abdulla Yameen Abdul Gayoom are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p121-p135-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P135 Galolhu Sitti -> P120 Abdul Gayoom Ibrahim (CLM-0270, SRC-WIKI-ABDUL-GAYOOM-IBRAHIM, grade B); excerpt: Abdul Gayoom Ibrahim family/genealogy content lists P135 Galolhu Sitti as parent of P120 Abdul Gayoom Ibrahim.",
      "Supporting edge: parent P120 Abdul Gayoom Ibrahim -> P121 Abdulla Yameen Abdul Gayoom (CLM-0253, SRC-PO-YAMEEN, grade A); excerpt: Official former-president profile states Abdulla Yameen is son of Abdul Gayoom Ibrahim. (pair: P120 Abdul Gayoom Ibrahim -> P121 Abdulla Yameen Abd...",
      "Rule application (parent-of-parent-grandparent): with source -> P120 Abdul Gayoom Ibrahim and P120 Abdul Gayoom Ibrahim -> target parent links, P135 Galolhu Sitti is modeled as inferred grandparent-line kin of P121 Abdulla Yameen Abdul Gayoom.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P135 Galolhu Sitti and P121 Abdulla Yameen Abdul Gayoom as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P136", "P114", "grandparent"), {
    summary: "P136 Ahmed Dhoshimeynaa Kilegefaanu and P114 Ameena Mohamed Amin are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p114-p136-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P136 Ahmed Dhoshimeynaa Kilegefaanu -> P110 Mohamed Amin Didi (CLM-0271, SRC-PO-AMIN, grade A); excerpt: Official former-president profile states Mohamed Amin was born as son of Ahmed Didi and Nayaage Aishath Didi. (pair: P136 Ahmed Dhoshimeynaa Kilege...",
      "Supporting edge: parent P110 Mohamed Amin Didi -> P114 Ameena Mohamed Amin (CLM-0232, SRC-WIKI-AMIN-DIDI, grade B); excerpt: Mohamed Amin Didi family/genealogy content lists P110 Mohamed Amin Didi as parent of P114 Ameena Mohamed Amin.",
      "Rule application (parent-of-parent-grandparent): with source -> P110 Mohamed Amin Didi and P110 Mohamed Amin Didi -> target parent links, P136 Ahmed Dhoshimeynaa Kilegefaanu is modeled as inferred grandparent-line kin of P114 Ameena Mohamed Amin.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P136 Ahmed Dhoshimeynaa Kilegefaanu and P114 Ameena Mohamed Amin as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P137", "P115", "grandparent"), {
    summary: "P137 Moosa Didi and P115 Ibrahim Nasir are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p115-p137-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P137 Moosa Didi -> P117 Nayaage Aishath Didi (CLM-0272, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P137 Moosa Didi as parent of P117 Nayaage Aishath Didi.",
      "Supporting edge: parent P117 Nayaage Aishath Didi -> P115 Ibrahim Nasir (CLM-0245, SRC-PO-NASIR, grade A); excerpt: Official former-president profile states Ibrahim Nasir was son of Ahmed Didi and Nayaage Aishath Didi. (pair: P117 Nayaage Aishath Didi -> P115 Ibr...",
      "Rule application (parent-of-parent-grandparent): with source -> P117 Nayaage Aishath Didi and P117 Nayaage Aishath Didi -> target parent links, P137 Moosa Didi is modeled as inferred grandparent-line kin of P115 Ibrahim Nasir.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P137 Moosa Didi and P115 Ibrahim Nasir as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P138", "P117", "grandparent"), {
    summary: "P138 Dhadimagu Ganduvaru Maryam Didi and P117 Nayaage Aishath Didi are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p117-p138-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P138 Dhadimagu Ganduvaru Maryam Didi -> P137 Moosa Didi (CLM-0273, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P138 Dhadimagu Ganduvaru Maryam Didi as parent of P137 Moosa Didi.",
      "Supporting edge: parent P137 Moosa Didi -> P117 Nayaage Aishath Didi (CLM-0272, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P137 Moosa Didi as parent of P117 Nayaage Aishath Didi.",
      "Rule application (parent-of-parent-grandparent): with source -> P137 Moosa Didi and P137 Moosa Didi -> target parent links, P138 Dhadimagu Ganduvaru Maryam Didi is modeled as inferred grandparent-line kin of P117 Nayaage Aishath Didi.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P138 Dhadimagu Ganduvaru Maryam Didi and P117 Nayaage Aishath Didi as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P139", "P137", "grandparent"), {
    summary: "P139 Hussain Didi and P137 Moosa Didi are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p137-p139-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P139 Hussain Didi -> P138 Dhadimagu Ganduvaru Maryam Didi (CLM-0274, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P139 Hussain Didi as parent of P138 Dhadimagu Ganduvaru Maryam Didi.",
      "Supporting edge: parent P138 Dhadimagu Ganduvaru Maryam Didi -> P137 Moosa Didi (CLM-0273, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P138 Dhadimagu Ganduvaru Maryam Didi as parent of P137 Moosa Didi.",
      "Rule application (parent-of-parent-grandparent): with source -> P138 Dhadimagu Ganduvaru Maryam Didi and P138 Dhadimagu Ganduvaru Maryam Didi -> target parent links, P139 Hussain Didi is modeled as inferred grandparent-line kin of P137 Moosa Didi.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P139 Hussain Didi and P137 Moosa Didi as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P139", "P183", "cousins"), {
    summary: "P139 Hussain Didi and P183 Ganduvaru Hassan Didi are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p139-p183-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P140 Al-Nabeel Karayye Hassan Didi -> P139 Hussain Didi (CLM-0275, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P140 Al-Nabeel Karayye Hassan Didi as parent of P139 Hussain Didi.",
      "Supporting edge: parent P180 Princess Aishath Didi -> P183 Ganduvaru Hassan Didi (CLM-0319, SRC-MRF-MIDU-ROYAL, grade B); excerpt: Midu Royal Family Branch (Addu/Meedhoo records) family/genealogy content lists P180 Princess Aishath Didi as parent of P183 Ganduvaru Hassan Didi.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P140 Al-Nabeel Karayye Hassan Didi and P180 Princess Aishath Didi are modeled as inferred cousin-line kin (P139 Hussain Didi <-> P183 Ganduvaru Hassan Didi).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P139 Hussain Didi and P183 Ganduvaru Hassan Didi as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P13", "P16", "grandparent"), {
    summary: "P13 Audha (Areedha Suvara) and P16 Salis (Meesuvvara) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p13-p16-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P15 Yoosuf (Bavanaadheeththa) -> P16 Salis (Meesuvvara) (CLM-0285, SRC-MRF-KINGS, grade B); excerpt: Kings list states P16 as son of P15.",
      "Rule application (parent-of-parent-grandparent): with source -> P15 Yoosuf (Bavanaadheeththa) and P15 Yoosuf (Bavanaadheeththa) -> target parent links, P13 Audha (Areedha Suvara) is modeled as inferred grandparent-line kin of P16 Salis (Meesuvvara).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P13 Audha (Areedha Suvara) and P16 Salis (Meesuvvara) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P13", "P17", "grandparent"), {
    summary: "P13 Audha (Areedha Suvara) and P17 Davud (Sundhura Bavana) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p13-p17-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P15 Yoosuf (Bavanaadheeththa) -> P17 Davud (Sundhura Bavana) (CLM-0286, SRC-MRF-KINGS, grade B); excerpt: Kings list states P17 as son of P15.",
      "Rule application (parent-of-parent-grandparent): with source -> P15 Yoosuf (Bavanaadheeththa) and P15 Yoosuf (Bavanaadheeththa) -> target parent links, P13 Audha (Areedha Suvara) is modeled as inferred grandparent-line kin of P17 Davud (Sundhura Bavana).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P13 Audha (Areedha Suvara) and P17 Davud (Sundhura Bavana) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P140", "P138", "grandparent"), {
    summary: "P140 Al-Nabeel Karayye Hassan Didi and P138 Dhadimagu Ganduvaru Maryam Didi are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p138-p140-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P140 Al-Nabeel Karayye Hassan Didi -> P139 Hussain Didi (CLM-0275, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P140 Al-Nabeel Karayye Hassan Didi as parent of P139 Hussain Didi.",
      "Supporting edge: parent P139 Hussain Didi -> P138 Dhadimagu Ganduvaru Maryam Didi (CLM-0274, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P139 Hussain Didi as parent of P138 Dhadimagu Ganduvaru Maryam Didi.",
      "Rule application (parent-of-parent-grandparent): with source -> P139 Hussain Didi and P139 Hussain Didi -> target parent links, P140 Al-Nabeel Karayye Hassan Didi is modeled as inferred grandparent-line kin of P138 Dhadimagu Ganduvaru Maryam Didi.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P140 Al-Nabeel Karayye Hassan Didi and P138 Dhadimagu Ganduvaru Maryam Didi as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P140", "P183", "aunt/uncle↔niece/nephew"), {
    summary: "P140 Al-Nabeel Karayye Hassan Didi and P183 Ganduvaru Hassan Didi are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p140-p183-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P180 Princess Aishath Didi -> P183 Ganduvaru Hassan Didi (CLM-0319, SRC-MRF-MIDU-ROYAL, grade B); excerpt: Midu Royal Family Branch (Addu/Meedhoo records) family/genealogy content lists P180 Princess Aishath Didi as parent of P183 Ganduvaru Hassan Didi.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P180 Princess Aishath Didi, P140 Al-Nabeel Karayye Hassan Didi) plus parent(P180 Princess Aishath Didi, child) yields inferred aunt/uncle-line kin between P140 Al-Nabeel Karayye Hassan Didi and P183 Ganduvaru Hassan Didi.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P140 Al-Nabeel Karayye Hassan Didi and P183 Ganduvaru Hassan Didi as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P148", "P150", "grandparent"), {
    summary: "P148 Khadheeja Moosa and P150 Dunya Maumoon are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p148-p150-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P148 Khadheeja Moosa -> P119 Maumoon Abdul Gayoom (CLM-0280, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox mother field names Khadheeja Ibrahim Didi as mother of Maumoon Abdul Gayoom. (pair: P148 Khadheeja Moosa -> P119 Maumoon Abdu...",
      "Supporting edge: parent P119 Maumoon Abdul Gayoom -> P150 Dunya Maumoon (CLM-0248, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Dunya Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P150 Dunya Maumoon).",
      "Rule application (parent-of-parent-grandparent): with source -> P119 Maumoon Abdul Gayoom and P119 Maumoon Abdul Gayoom -> target parent links, P148 Khadheeja Moosa is modeled as inferred grandparent-line kin of P150 Dunya Maumoon.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P148 Khadheeja Moosa and P150 Dunya Maumoon as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P148", "P151", "grandparent"), {
    summary: "P148 Khadheeja Moosa and P151 Yumna Maumoon are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p148-p151-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P148 Khadheeja Moosa -> P119 Maumoon Abdul Gayoom (CLM-0280, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox mother field names Khadheeja Ibrahim Didi as mother of Maumoon Abdul Gayoom. (pair: P148 Khadheeja Moosa -> P119 Maumoon Abdu...",
      "Supporting edge: parent P119 Maumoon Abdul Gayoom -> P151 Yumna Maumoon (CLM-0249, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Yumna Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P151 Yumna Maumoon).",
      "Rule application (parent-of-parent-grandparent): with source -> P119 Maumoon Abdul Gayoom and P119 Maumoon Abdul Gayoom -> target parent links, P148 Khadheeja Moosa is modeled as inferred grandparent-line kin of P151 Yumna Maumoon.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P148 Khadheeja Moosa and P151 Yumna Maumoon as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P148", "P152", "grandparent"), {
    summary: "P148 Khadheeja Moosa and P152 Faris Maumoon are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p148-p152-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P148 Khadheeja Moosa -> P119 Maumoon Abdul Gayoom (CLM-0280, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox mother field names Khadheeja Ibrahim Didi as mother of Maumoon Abdul Gayoom. (pair: P148 Khadheeja Moosa -> P119 Maumoon Abdu...",
      "Supporting edge: parent P119 Maumoon Abdul Gayoom -> P152 Faris Maumoon (CLM-0250, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Faris Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P152 Faris Maumoon).",
      "Rule application (parent-of-parent-grandparent): with source -> P119 Maumoon Abdul Gayoom and P119 Maumoon Abdul Gayoom -> target parent links, P148 Khadheeja Moosa is modeled as inferred grandparent-line kin of P152 Faris Maumoon.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P148 Khadheeja Moosa and P152 Faris Maumoon as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P148", "P153", "grandparent"), {
    summary: "P148 Khadheeja Moosa and P153 Ghassan Maumoon are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p148-p153-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P148 Khadheeja Moosa -> P119 Maumoon Abdul Gayoom (CLM-0280, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox mother field names Khadheeja Ibrahim Didi as mother of Maumoon Abdul Gayoom. (pair: P148 Khadheeja Moosa -> P119 Maumoon Abdu...",
      "Supporting edge: parent P119 Maumoon Abdul Gayoom -> P153 Ghassan Maumoon (CLM-0251, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Ghassan Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P153 Ghassan Maumoon).",
      "Rule application (parent-of-parent-grandparent): with source -> P119 Maumoon Abdul Gayoom and P119 Maumoon Abdul Gayoom -> target parent links, P148 Khadheeja Moosa is modeled as inferred grandparent-line kin of P153 Ghassan Maumoon.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P148 Khadheeja Moosa and P153 Ghassan Maumoon as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P14", "P16", "aunt/uncle↔niece/nephew"), {
    summary: "P14 Hali (Areedha Suvara) and P16 Salis (Meesuvvara) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p14-p16-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P15 Yoosuf (Bavanaadheeththa) -> P16 Salis (Meesuvvara) (CLM-0285, SRC-MRF-KINGS, grade B); excerpt: Kings list states P16 as son of P15.",
      "Supporting edge: sibling P14 Hali (Areedha Suvara) <-> P15 Yoosuf (Bavanaadheeththa) [brothers] (CLM-0386, SRC-MRF-KINGS, grade B); excerpt: Kings list marks P14 and P15 as brothers.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P15 Yoosuf (Bavanaadheeththa), P14 Hali (Areedha Suvara)) plus parent(P15 Yoosuf (Bavanaadheeththa), child) yields inferred aunt/uncle-line kin between P14 Hali (Areedha Suvara) and P16 Salis (Meesuvvara).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P14 Hali (Areedha Suvara) and P16 Salis (Meesuvvara) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P14", "P17", "aunt/uncle↔niece/nephew"), {
    summary: "P14 Hali (Areedha Suvara) and P17 Davud (Sundhura Bavana) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p14-p17-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P15 Yoosuf (Bavanaadheeththa) -> P17 Davud (Sundhura Bavana) (CLM-0286, SRC-MRF-KINGS, grade B); excerpt: Kings list states P17 as son of P15.",
      "Supporting edge: sibling P14 Hali (Areedha Suvara) <-> P15 Yoosuf (Bavanaadheeththa) [brothers] (CLM-0386, SRC-MRF-KINGS, grade B); excerpt: Kings list marks P14 and P15 as brothers.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P15 Yoosuf (Bavanaadheeththa), P14 Hali (Areedha Suvara)) plus parent(P15 Yoosuf (Bavanaadheeththa), child) yields inferred aunt/uncle-line kin between P14 Hali (Areedha Suvara) and P17 Davud (Sundhura Bavana).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P14 Hali (Areedha Suvara) and P17 Davud (Sundhura Bavana) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P159", "P71", "grandparent"), {
    summary: "P159 Hussain Faamuladeyri Kilege and P71 Mohamed Mohyedine (Naakiree Sundhura) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p159-p71-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P159 Hussain Faamuladeyri Kilege -> P160 Abu Naibu Hassan Dorhimeyna Kilege (CLM-0293, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P159 Hussain Faamuladeyri Kilege as parent of P160 Abu Naibu Hassan Dorhimeyna Kilege.",
      "Supporting edge: parent P160 Abu Naibu Hassan Dorhimeyna Kilege -> P71 Mohamed Mohyedine (Naakiree Sundhura) (CLM-0295, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P160 Abu Naibu Hassan Dorhimeyna Kilege as parent of P71 Mohamed Mohyedine.",
      "Rule application (parent-of-parent-grandparent): with source -> P160 Abu Naibu Hassan Dorhimeyna Kilege and P160 Abu Naibu Hassan Dorhimeyna Kilege -> target parent links, P159 Hussain Faamuladeyri Kilege is modeled as inferred grandparent-line kin of P71 Mohamed Mohyedine (Naakiree Sundhura).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P159 Hussain Faamuladeyri Kilege and P71 Mohamed Mohyedine (Naakiree Sundhura) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P15", "P18", "grandparent"), {
    summary: "P15 Yoosuf (Bavanaadheeththa) and P18 Omar Veeru (Loka Abarana) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p15-p18-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P15 Yoosuf (Bavanaadheeththa) -> P16 Salis (Meesuvvara) (CLM-0285, SRC-MRF-KINGS, grade B); excerpt: Kings list states P16 as son of P15.",
      "Supporting edge: parent P16 Salis (Meesuvvara) -> P18 Omar Veeru (Loka Abarana) (CLM-0571, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Salis as parent of Omar Veeru.",
      "Rule application (parent-of-parent-grandparent): with source -> P16 Salis (Meesuvvara) and P16 Salis (Meesuvvara) -> target parent links, P15 Yoosuf (Bavanaadheeththa) is modeled as inferred grandparent-line kin of P18 Omar Veeru (Loka Abarana).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P15 Yoosuf (Bavanaadheeththa) and P18 Omar Veeru (Loka Abarana) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P16", "P19", "grandparent"), {
    summary: "P16 Salis (Meesuvvara) and P19 Ahmed Shihabuddine (Loka Aadheeththa) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p16-p19-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P16 Salis (Meesuvvara) -> P18 Omar Veeru (Loka Abarana) (CLM-0571, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Salis as parent of Omar Veeru.",
      "Supporting edge: parent P18 Omar Veeru (Loka Abarana) -> P19 Ahmed Shihabuddine (Loka Aadheeththa) (CLM-0316, SRC-IBN-BATTUTA-RIHLA, grade A); excerpt: Ibn Battuta identifies Sultan Ahmad Shihab al-Din as son of Sultan Omar and brother of Khadijah, corroborating the P18->P19 parent edge.",
      "Rule application (parent-of-parent-grandparent): with source -> P18 Omar Veeru (Loka Abarana) and P18 Omar Veeru (Loka Abarana) -> target parent links, P16 Salis (Meesuvvara) is modeled as inferred grandparent-line kin of P19 Ahmed Shihabuddine (Loka Aadheeththa).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P16 Salis (Meesuvvara) and P19 Ahmed Shihabuddine (Loka Aadheeththa) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P16", "P20", "grandparent"), {
    summary: "P16 Salis (Meesuvvara) and P20 Khadijah (Raadha Abarana) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p16-p20-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P16 Salis (Meesuvvara) -> P18 Omar Veeru (Loka Abarana) (CLM-0571, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Salis as parent of Omar Veeru.",
      "Supporting edge: parent P18 Omar Veeru (Loka Abarana) -> P20 Khadijah (Raadha Abarana) (CLM-0317, SRC-IBN-BATTUTA-RIHLA, grade A); excerpt: Ibn Battuta identifies Khadijah as daughter of Sultan Omar, corroborating the P18->P20 parent edge.",
      "Rule application (parent-of-parent-grandparent): with source -> P18 Omar Veeru (Loka Abarana) and P18 Omar Veeru (Loka Abarana) -> target parent links, P16 Salis (Meesuvvara) is modeled as inferred grandparent-line kin of P20 Khadijah (Raadha Abarana).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P16 Salis (Meesuvvara) and P20 Khadijah (Raadha Abarana) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P16", "P25", "grandparent"), {
    summary: "P16 Salis (Meesuvvara) and P25 Raadhaafathi (Suvama Abarana) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p16-p25-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P16 Salis (Meesuvvara) -> P18 Omar Veeru (Loka Abarana) (CLM-0571, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Salis as parent of Omar Veeru.",
      "Supporting edge: parent P18 Omar Veeru (Loka Abarana) -> P25 Raadhaafathi (Suvama Abarana) (CLM-0318, SRC-MRF-KINGS, grade B); excerpt: Kings list gives P25 as child of P18 in the same household branch.",
      "Rule application (parent-of-parent-grandparent): with source -> P18 Omar Veeru (Loka Abarana) and P18 Omar Veeru (Loka Abarana) -> target parent links, P16 Salis (Meesuvvara) is modeled as inferred grandparent-line kin of P25 Raadhaafathi (Suvama Abarana).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P16 Salis (Meesuvvara) and P25 Raadhaafathi (Suvama Abarana) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P171", "P169", "grandparent"), {
    summary: "P171 Moomina Hassanfulhu and P169 Sarah Ibrahim Solih are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p169-p171-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P171 Moomina Hassanfulhu -> P167 Ibrahim Mohamed Solih (CLM-0307, SRC-EDITION-SOLIH-MOTHER, grade B); excerpt: Edition obituary report identifies Aishath Khadheeja as mother of former President Ibrahim Mohamed Solih. (pair: P171 Moomina Hassanfulhu -> P167 I...",
      "Supporting edge: parent P167 Ibrahim Mohamed Solih -> P169 Sarah Ibrahim Solih (CLM-0303, SRC-WIKI-SOLIH, grade B); excerpt: Wikipedia raw infobox issue field lists Sarah Ibrahim Solih as child of Ibrahim Mohamed Solih. (pair: P167 Ibrahim Mohamed Solih -> P169 Sarah Ibra...",
      "Rule application (parent-of-parent-grandparent): with source -> P167 Ibrahim Mohamed Solih and P167 Ibrahim Mohamed Solih -> target parent links, P171 Moomina Hassanfulhu is modeled as inferred grandparent-line kin of P169 Sarah Ibrahim Solih.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P171 Moomina Hassanfulhu and P169 Sarah Ibrahim Solih as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P171", "P170", "grandparent"), {
    summary: "P171 Moomina Hassanfulhu and P170 Yaman Ibrahim Solih are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p170-p171-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P171 Moomina Hassanfulhu -> P167 Ibrahim Mohamed Solih (CLM-0307, SRC-EDITION-SOLIH-MOTHER, grade B); excerpt: Edition obituary report identifies Aishath Khadheeja as mother of former President Ibrahim Mohamed Solih. (pair: P171 Moomina Hassanfulhu -> P167 I...",
      "Supporting edge: parent P167 Ibrahim Mohamed Solih -> P170 Yaman Ibrahim Solih (CLM-0304, SRC-WIKI-SOLIH, grade B); excerpt: Wikipedia lead text states Ibrahim Mohamed Solih and his wife have a son named Yaman. (pair: P167 Ibrahim Mohamed Solih -> P170 Yaman Ibrahim Solih).",
      "Rule application (parent-of-parent-grandparent): with source -> P167 Ibrahim Mohamed Solih and P167 Ibrahim Mohamed Solih -> target parent links, P171 Moomina Hassanfulhu is modeled as inferred grandparent-line kin of P170 Yaman Ibrahim Solih.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P171 Moomina Hassanfulhu and P170 Yaman Ibrahim Solih as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P174", "P177", "grandparent"), {
    summary: "P174 Hussain Abdul Rahman and P177 Yasmin Muizzu are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p174-p177-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P174 Hussain Abdul Rahman -> P172 Mohamed Muizzu (CLM-0314, SRC-WIKI-MUIZZU, grade B); excerpt: Wikipedia lead text states Mohamed Muizzu was born to Husna Adam Ismail and Hussain Abdul Rahman. (pair: P174 Hussain Abdul Rahman -> P172 Mohamed ...",
      "Supporting edge: parent P172 Mohamed Muizzu -> P177 Yasmin Muizzu (CLM-0308, SRC-WIKI-MUIZZU, grade B); excerpt: Wikipedia raw infobox issue field lists Yasmin Muizzu as child of Mohamed Muizzu. (pair: P172 Mohamed Muizzu -> P177 Yasmin Muizzu).",
      "Rule application (parent-of-parent-grandparent): with source -> P172 Mohamed Muizzu and P172 Mohamed Muizzu -> target parent links, P174 Hussain Abdul Rahman is modeled as inferred grandparent-line kin of P177 Yasmin Muizzu.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P174 Hussain Abdul Rahman and P177 Yasmin Muizzu as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P174", "P178", "grandparent"), {
    summary: "P174 Hussain Abdul Rahman and P178 Umair Muizzu are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p174-p178-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P174 Hussain Abdul Rahman -> P172 Mohamed Muizzu (CLM-0314, SRC-WIKI-MUIZZU, grade B); excerpt: Wikipedia lead text states Mohamed Muizzu was born to Husna Adam Ismail and Hussain Abdul Rahman. (pair: P174 Hussain Abdul Rahman -> P172 Mohamed ...",
      "Supporting edge: parent P172 Mohamed Muizzu -> P178 Umair Muizzu (CLM-0309, SRC-WIKI-MUIZZU, grade B); excerpt: Wikipedia raw infobox issue field lists Umair Muizzu as child of Mohamed Muizzu. (pair: P172 Mohamed Muizzu -> P178 Umair Muizzu).",
      "Rule application (parent-of-parent-grandparent): with source -> P172 Mohamed Muizzu and P172 Mohamed Muizzu -> target parent links, P174 Hussain Abdul Rahman is modeled as inferred grandparent-line kin of P178 Umair Muizzu.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P174 Hussain Abdul Rahman and P178 Umair Muizzu as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P174", "P179", "grandparent"), {
    summary: "P174 Hussain Abdul Rahman and P179 Zaid Muizzu are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p174-p179-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P174 Hussain Abdul Rahman -> P172 Mohamed Muizzu (CLM-0314, SRC-WIKI-MUIZZU, grade B); excerpt: Wikipedia lead text states Mohamed Muizzu was born to Husna Adam Ismail and Hussain Abdul Rahman. (pair: P174 Hussain Abdul Rahman -> P172 Mohamed ...",
      "Supporting edge: parent P172 Mohamed Muizzu -> P179 Zaid Muizzu (CLM-0310, SRC-WIKI-MUIZZU, grade B); excerpt: Wikipedia raw infobox issue field lists Zaid Muizzu as child of Mohamed Muizzu. (pair: P172 Mohamed Muizzu -> P179 Zaid Muizzu).",
      "Rule application (parent-of-parent-grandparent): with source -> P172 Mohamed Muizzu and P172 Mohamed Muizzu -> target parent links, P174 Hussain Abdul Rahman is modeled as inferred grandparent-line kin of P179 Zaid Muizzu.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P174 Hussain Abdul Rahman and P179 Zaid Muizzu as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P175", "P177", "grandparent"), {
    summary: "P175 Husna Adam Ismail Manik and P177 Yasmin Muizzu are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p175-p177-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P175 Husna Adam Ismail Manik -> P172 Mohamed Muizzu (CLM-0315, SRC-WIKI-MUIZZU, grade B); excerpt: Wikipedia lead text states Mohamed Muizzu was born to Husna Adam Ismail and Hussain Abdul Rahman. (pair: P175 Husna Adam Ismail Manik -> P172 Moham...",
      "Supporting edge: parent P172 Mohamed Muizzu -> P177 Yasmin Muizzu (CLM-0308, SRC-WIKI-MUIZZU, grade B); excerpt: Wikipedia raw infobox issue field lists Yasmin Muizzu as child of Mohamed Muizzu. (pair: P172 Mohamed Muizzu -> P177 Yasmin Muizzu).",
      "Rule application (parent-of-parent-grandparent): with source -> P172 Mohamed Muizzu and P172 Mohamed Muizzu -> target parent links, P175 Husna Adam Ismail Manik is modeled as inferred grandparent-line kin of P177 Yasmin Muizzu.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P175 Husna Adam Ismail Manik and P177 Yasmin Muizzu as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P175", "P178", "grandparent"), {
    summary: "P175 Husna Adam Ismail Manik and P178 Umair Muizzu are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p175-p178-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P175 Husna Adam Ismail Manik -> P172 Mohamed Muizzu (CLM-0315, SRC-WIKI-MUIZZU, grade B); excerpt: Wikipedia lead text states Mohamed Muizzu was born to Husna Adam Ismail and Hussain Abdul Rahman. (pair: P175 Husna Adam Ismail Manik -> P172 Moham...",
      "Supporting edge: parent P172 Mohamed Muizzu -> P178 Umair Muizzu (CLM-0309, SRC-WIKI-MUIZZU, grade B); excerpt: Wikipedia raw infobox issue field lists Umair Muizzu as child of Mohamed Muizzu. (pair: P172 Mohamed Muizzu -> P178 Umair Muizzu).",
      "Rule application (parent-of-parent-grandparent): with source -> P172 Mohamed Muizzu and P172 Mohamed Muizzu -> target parent links, P175 Husna Adam Ismail Manik is modeled as inferred grandparent-line kin of P178 Umair Muizzu.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P175 Husna Adam Ismail Manik and P178 Umair Muizzu as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P175", "P179", "grandparent"), {
    summary: "P175 Husna Adam Ismail Manik and P179 Zaid Muizzu are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p175-p179-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P175 Husna Adam Ismail Manik -> P172 Mohamed Muizzu (CLM-0315, SRC-WIKI-MUIZZU, grade B); excerpt: Wikipedia lead text states Mohamed Muizzu was born to Husna Adam Ismail and Hussain Abdul Rahman. (pair: P175 Husna Adam Ismail Manik -> P172 Moham...",
      "Supporting edge: parent P172 Mohamed Muizzu -> P179 Zaid Muizzu (CLM-0310, SRC-WIKI-MUIZZU, grade B); excerpt: Wikipedia raw infobox issue field lists Zaid Muizzu as child of Mohamed Muizzu. (pair: P172 Mohamed Muizzu -> P179 Zaid Muizzu).",
      "Rule application (parent-of-parent-grandparent): with source -> P172 Mohamed Muizzu and P172 Mohamed Muizzu -> target parent links, P175 Husna Adam Ismail Manik is modeled as inferred grandparent-line kin of P179 Zaid Muizzu.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P175 Husna Adam Ismail Manik and P179 Zaid Muizzu as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P176", "P177", "aunt/uncle↔niece/nephew"), {
    summary: "P176 Fathimath Saudha and P177 Yasmin Muizzu are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p176-p177-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P172 Mohamed Muizzu -> P177 Yasmin Muizzu (CLM-0308, SRC-WIKI-MUIZZU, grade B); excerpt: Wikipedia raw infobox issue field lists Yasmin Muizzu as child of Mohamed Muizzu. (pair: P172 Mohamed Muizzu -> P177 Yasmin Muizzu).",
      "Supporting edge: sibling P172 Mohamed Muizzu <-> P176 Fathimath Saudha [siblings] (CLM-0413, SRC-WIKI-FATHIMATH-SAUDHA, grade B); excerpt: Fathimath Saudha family/genealogy content links P172 Mohamed Muizzu and P176 Fathimath Saudha as siblings (siblings).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P172 Mohamed Muizzu, P176 Fathimath Saudha) plus parent(P172 Mohamed Muizzu, child) yields inferred aunt/uncle-line kin between P176 Fathimath Saudha and P177 Yasmin Muizzu.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P176 Fathimath Saudha and P177 Yasmin Muizzu as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P176", "P178", "aunt/uncle↔niece/nephew"), {
    summary: "P176 Fathimath Saudha and P178 Umair Muizzu are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p176-p178-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P172 Mohamed Muizzu -> P178 Umair Muizzu (CLM-0309, SRC-WIKI-MUIZZU, grade B); excerpt: Wikipedia raw infobox issue field lists Umair Muizzu as child of Mohamed Muizzu. (pair: P172 Mohamed Muizzu -> P178 Umair Muizzu).",
      "Supporting edge: sibling P172 Mohamed Muizzu <-> P176 Fathimath Saudha [siblings] (CLM-0413, SRC-WIKI-FATHIMATH-SAUDHA, grade B); excerpt: Fathimath Saudha family/genealogy content links P172 Mohamed Muizzu and P176 Fathimath Saudha as siblings (siblings).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P172 Mohamed Muizzu, P176 Fathimath Saudha) plus parent(P172 Mohamed Muizzu, child) yields inferred aunt/uncle-line kin between P176 Fathimath Saudha and P178 Umair Muizzu.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P176 Fathimath Saudha and P178 Umair Muizzu as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P176", "P179", "aunt/uncle↔niece/nephew"), {
    summary: "P176 Fathimath Saudha and P179 Zaid Muizzu are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p176-p179-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P172 Mohamed Muizzu -> P179 Zaid Muizzu (CLM-0310, SRC-WIKI-MUIZZU, grade B); excerpt: Wikipedia raw infobox issue field lists Zaid Muizzu as child of Mohamed Muizzu. (pair: P172 Mohamed Muizzu -> P179 Zaid Muizzu).",
      "Supporting edge: sibling P172 Mohamed Muizzu <-> P176 Fathimath Saudha [siblings] (CLM-0413, SRC-WIKI-FATHIMATH-SAUDHA, grade B); excerpt: Fathimath Saudha family/genealogy content links P172 Mohamed Muizzu and P176 Fathimath Saudha as siblings (siblings).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P172 Mohamed Muizzu, P176 Fathimath Saudha) plus parent(P172 Mohamed Muizzu, child) yields inferred aunt/uncle-line kin between P176 Fathimath Saudha and P179 Zaid Muizzu.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P176 Fathimath Saudha and P179 Zaid Muizzu as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P17", "P18", "aunt/uncle↔niece/nephew"), {
    summary: "P17 Davud (Sundhura Bavana) and P18 Omar Veeru (Loka Abarana) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p17-p18-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P16 Salis (Meesuvvara) -> P18 Omar Veeru (Loka Abarana) (CLM-0571, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Salis as parent of Omar Veeru.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P16 Salis (Meesuvvara), P17 Davud (Sundhura Bavana)) plus parent(P16 Salis (Meesuvvara), child) yields inferred aunt/uncle-line kin between P17 Davud (Sundhura Bavana) and P18 Omar Veeru (Loka Abarana).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P17 Davud (Sundhura Bavana) and P18 Omar Veeru (Loka Abarana) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P180", "P139", "aunt/uncle↔niece/nephew"), {
    summary: "P180 Princess Aishath Didi and P139 Hussain Didi are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p139-p180-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P140 Al-Nabeel Karayye Hassan Didi -> P139 Hussain Didi (CLM-0275, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P140 Al-Nabeel Karayye Hassan Didi as parent of P139 Hussain Didi.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P140 Al-Nabeel Karayye Hassan Didi, P180 Princess Aishath Didi) plus parent(P140 Al-Nabeel Karayye Hassan Didi, child) yields inferred aunt/uncle-line kin between P180 Princess Aishath Didi and P139 Hussain Didi.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P180 Princess Aishath Didi and P139 Hussain Didi as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P182", "P132", "reported Addu/Meedhoo branch continuity"), {
    summary: "P182 El-Naib Ganduvaru Mohamed Thakurufan and P132 Al-Naib Muhammad Thakurufaanu of Addu are modeled as `kin` with label `reported Addu/Meedhoo branch continuity` to preserve a targeted continuity claim without over-promoting certainty.",
    dossier: "docs/research-program/inferences/kin-p132-p182-reported-addu-meedhoo-branch-continuity.md",
    logic: [
      "No short direct-claim path (<=4 steps) was found in the current direct-edge set for this exact node pair.",
      "Inference currently rests on curated branch-context interpretation plus source-level continuity wording, not a direct named relation statement.",
      "Current modeling choice remains `inferred` because explicit source wording that names `kin` for P182 El-Naib Ganduvaru Mohamed Thakurufan and P132 Al-Naib Muhammad Thakurufaanu of Addu is still absent."
    ],
    verification: [
      "Promotion requirement: an A/B source statement explicitly naming P182 El-Naib Ganduvaru Mohamed Thakurufan and P132 Al-Naib Muhammad Thakurufaanu of Addu with relation class `kin` (reported Addu/Meedhoo branch continuity).",
      "Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.",
      "Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster."
    ]
  }],
  [k("kin", "P185", "P190", "grandparent"), {
    summary: "P185 Kakaagey Dhon Goma and P190 Hassan Fareed Didi are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p185-p190-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P185 Kakaagey Dhon Goma -> P129 Princess Veyogey Dhon Goma (CLM-0322, SRC-WIKI-MUHAMMAD-FAREED, grade B); excerpt: Muhammad Fareed Didi family/genealogy content lists P185 Kakaagey Dhon Goma as parent of P129 Princess Veyogey Dhon Goma.",
      "Supporting edge: parent P129 Princess Veyogey Dhon Goma -> P190 Hassan Fareed Didi (CLM-0260, SRC-WIKI-HASSAN-FARID, grade B); excerpt: Hassan Farid Didi family/genealogy content lists P129 Princess Veyogey Dhon Goma as parent of P190 Hassan Fareed Didi.",
      "Rule application (parent-of-parent-grandparent): with source -> P129 Princess Veyogey Dhon Goma and P129 Princess Veyogey Dhon Goma -> target parent links, P185 Kakaagey Dhon Goma is modeled as inferred grandparent-line kin of P190 Hassan Fareed Didi.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P185 Kakaagey Dhon Goma and P190 Hassan Fareed Didi as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P185", "P191", "grandparent"), {
    summary: "P185 Kakaagey Dhon Goma and P191 Ibrahim Fareed Didi are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p185-p191-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P185 Kakaagey Dhon Goma -> P129 Princess Veyogey Dhon Goma (CLM-0322, SRC-WIKI-MUHAMMAD-FAREED, grade B); excerpt: Muhammad Fareed Didi family/genealogy content lists P185 Kakaagey Dhon Goma as parent of P129 Princess Veyogey Dhon Goma.",
      "Supporting edge: parent P129 Princess Veyogey Dhon Goma -> P191 Ibrahim Fareed Didi (CLM-0261, SRC-WIKI-IBRAHIM-FAREED, grade B); excerpt: Ibrahim Fareed Didi family/genealogy content lists P129 Princess Veyogey Dhon Goma as parent of P191 Ibrahim Fareed Didi.",
      "Rule application (parent-of-parent-grandparent): with source -> P129 Princess Veyogey Dhon Goma and P129 Princess Veyogey Dhon Goma -> target parent links, P185 Kakaagey Dhon Goma is modeled as inferred grandparent-line kin of P191 Ibrahim Fareed Didi.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P185 Kakaagey Dhon Goma and P191 Ibrahim Fareed Didi as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P185", "P95", "grandparent"), {
    summary: "P185 Kakaagey Dhon Goma and P95 Mohamed Farid (Keerithi Maha Radun) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p185-p95-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P185 Kakaagey Dhon Goma -> P129 Princess Veyogey Dhon Goma (CLM-0322, SRC-WIKI-MUHAMMAD-FAREED, grade B); excerpt: Muhammad Fareed Didi family/genealogy content lists P185 Kakaagey Dhon Goma as parent of P129 Princess Veyogey Dhon Goma.",
      "Supporting edge: parent P129 Princess Veyogey Dhon Goma -> P95 Mohamed Farid (Keerithi Maha Radun) (CLM-0262, SRC-WIKI-MUHAMMAD-FAREED, grade B); excerpt: Muhammad Fareed Didi family/genealogy content lists P129 Princess Veyogey Dhon Goma as parent of P95 Mohamed Farid.",
      "Rule application (parent-of-parent-grandparent): with source -> P129 Princess Veyogey Dhon Goma and P129 Princess Veyogey Dhon Goma -> target parent links, P185 Kakaagey Dhon Goma is modeled as inferred grandparent-line kin of P95 Mohamed Farid (Keerithi Maha Radun).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P185 Kakaagey Dhon Goma and P95 Mohamed Farid (Keerithi Maha Radun) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P189", "P94", "grandparent"), {
    summary: "P189 Handeygirigey Didi and P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p189-p94-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P189 Handeygirigey Didi -> P88 Mohamed Mueenuddine (Keerithi Maha Radun) (CLM-0325, SRC-MRF-HURAA, grade B); excerpt: Royal House of Hilaaly-Huraa family/genealogy content lists P189 Handeygirigey Didi as parent of P88 Mohamed Mueenuddine.",
      "Supporting edge: parent P88 Mohamed Mueenuddine (Keerithi Maha Radun) -> P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka) (CLM-0367, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P88 Mohamed Mueenuddine as parent of P94 Hassan Nooredine II.",
      "Rule application (parent-of-parent-grandparent): with source -> P88 Mohamed Mueenuddine (Keerithi Maha Radun) and P88 Mohamed Mueenuddine (Keerithi Maha Radun) -> target parent links, P189 Handeygirigey Didi is modeled as inferred grandparent-line kin of P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P189 Handeygirigey Didi and P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P18", "P27", "grandparent"), {
    summary: "P18 Omar Veeru (Loka Abarana) and P27 Dhaain (Keerithi Maha Rehendi) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p18-p27-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P18 Omar Veeru (Loka Abarana) -> P25 Raadhaafathi (Suvama Abarana) (CLM-0318, SRC-MRF-KINGS, grade B); excerpt: Kings list gives P25 as child of P18 in the same household branch.",
      "Supporting edge: parent P25 Raadhaafathi (Suvama Abarana) -> P27 Dhaain (Keerithi Maha Rehendi) (CLM-0595, SRC-ROYALARK-MALDIVES, grade B); excerpt: RoyalArk Maldives lineage reconstruction treats Dhaain (P27) as daughter of Raadhaafathi/Malika Fatima (P25), alongside parent linkage through P26.",
      "Rule application (parent-of-parent-grandparent): with source -> P25 Raadhaafathi (Suvama Abarana) and P25 Raadhaafathi (Suvama Abarana) -> target parent links, P18 Omar Veeru (Loka Abarana) is modeled as inferred grandparent-line kin of P27 Dhaain (Keerithi Maha Rehendi).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P18 Omar Veeru (Loka Abarana) and P27 Dhaain (Keerithi Maha Rehendi) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P193", "P49", "aunt/uncle↔niece/nephew"), {
    summary: "P193 Princess Recca and P49 Sheikh Hassan (Raadha Fanaveeru) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p193-p49-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P202 Kamba Dio -> P49 Sheikh Hassan (Raadha Fanaveeru) (CLM-0572, SRC-MRF-HILAALY, grade B); excerpt: Direct parent relation recorded between Kamba Dio as parent of Sheikh Hassan.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P202 Kamba Dio, P193 Princess Recca) plus parent(P202 Kamba Dio, child) yields inferred aunt/uncle-line kin between P193 Princess Recca and P49 Sheikh Hassan (Raadha Fanaveeru).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P193 Princess Recca and P49 Sheikh Hassan (Raadha Fanaveeru) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P198", "P150", "aunt/uncle↔niece/nephew"), {
    summary: "P198 Ilyas Ibrahim and P150 Dunya Maumoon are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p150-p198-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P149 Nasreena Ibrahim -> P150 Dunya Maumoon (CLM-0281, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox spouse and issue fields support Nasreena Ibrahim as spouse in the child list including Dunya Maumoon. (pair: P149 Nasreena Ib...",
      "Supporting edge: sibling P149 Nasreena Ibrahim <-> P198 Ilyas Ibrahim [siblings] (CLM-0398, SRC-WIKI-ILYAS-IBRAHIM, grade B); excerpt: Ilyas Ibrahim family/genealogy content links P149 Nasreena Ibrahim and P198 Ilyas Ibrahim as siblings (siblings).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P149 Nasreena Ibrahim, P198 Ilyas Ibrahim) plus parent(P149 Nasreena Ibrahim, child) yields inferred aunt/uncle-line kin between P198 Ilyas Ibrahim and P150 Dunya Maumoon.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P198 Ilyas Ibrahim and P150 Dunya Maumoon as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P198", "P151", "aunt/uncle↔niece/nephew"), {
    summary: "P198 Ilyas Ibrahim and P151 Yumna Maumoon are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p151-p198-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P149 Nasreena Ibrahim -> P151 Yumna Maumoon (CLM-0282, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox spouse and issue fields support Nasreena Ibrahim as spouse in the child list including Yumna Maumoon. (pair: P149 Nasreena Ib...",
      "Supporting edge: sibling P149 Nasreena Ibrahim <-> P198 Ilyas Ibrahim [siblings] (CLM-0398, SRC-WIKI-ILYAS-IBRAHIM, grade B); excerpt: Ilyas Ibrahim family/genealogy content links P149 Nasreena Ibrahim and P198 Ilyas Ibrahim as siblings (siblings).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P149 Nasreena Ibrahim, P198 Ilyas Ibrahim) plus parent(P149 Nasreena Ibrahim, child) yields inferred aunt/uncle-line kin between P198 Ilyas Ibrahim and P151 Yumna Maumoon.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P198 Ilyas Ibrahim and P151 Yumna Maumoon as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P198", "P152", "aunt/uncle↔niece/nephew"), {
    summary: "P198 Ilyas Ibrahim and P152 Faris Maumoon are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p152-p198-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P149 Nasreena Ibrahim -> P152 Faris Maumoon (CLM-0283, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox spouse and issue fields support Nasreena Ibrahim as spouse in the child list including Faris Maumoon. (pair: P149 Nasreena Ib...",
      "Supporting edge: sibling P149 Nasreena Ibrahim <-> P198 Ilyas Ibrahim [siblings] (CLM-0398, SRC-WIKI-ILYAS-IBRAHIM, grade B); excerpt: Ilyas Ibrahim family/genealogy content links P149 Nasreena Ibrahim and P198 Ilyas Ibrahim as siblings (siblings).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P149 Nasreena Ibrahim, P198 Ilyas Ibrahim) plus parent(P149 Nasreena Ibrahim, child) yields inferred aunt/uncle-line kin between P198 Ilyas Ibrahim and P152 Faris Maumoon.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P198 Ilyas Ibrahim and P152 Faris Maumoon as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P198", "P153", "aunt/uncle↔niece/nephew"), {
    summary: "P198 Ilyas Ibrahim and P153 Ghassan Maumoon are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p153-p198-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P149 Nasreena Ibrahim -> P153 Ghassan Maumoon (CLM-0284, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox spouse and issue fields support Nasreena Ibrahim as spouse in the child list including Ghassan Maumoon. (pair: P149 Nasreena ...",
      "Supporting edge: sibling P149 Nasreena Ibrahim <-> P198 Ilyas Ibrahim [siblings] (CLM-0398, SRC-WIKI-ILYAS-IBRAHIM, grade B); excerpt: Ilyas Ibrahim family/genealogy content links P149 Nasreena Ibrahim and P198 Ilyas Ibrahim as siblings (siblings).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P149 Nasreena Ibrahim, P198 Ilyas Ibrahim) plus parent(P149 Nasreena Ibrahim, child) yields inferred aunt/uncle-line kin between P198 Ilyas Ibrahim and P153 Ghassan Maumoon.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P198 Ilyas Ibrahim and P153 Ghassan Maumoon as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P199", "P150", "aunt/uncle↔niece/nephew"), {
    summary: "P199 Abbas Ibrahim and P150 Dunya Maumoon are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p150-p199-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P149 Nasreena Ibrahim -> P150 Dunya Maumoon (CLM-0281, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox spouse and issue fields support Nasreena Ibrahim as spouse in the child list including Dunya Maumoon. (pair: P149 Nasreena Ib...",
      "Supporting edge: sibling P149 Nasreena Ibrahim <-> P199 Abbas Ibrahim [siblings] (CLM-0399, SRC-WIKI-ABBAS-IBRAHIM, grade B); excerpt: Abbas Ibrahim family/genealogy content links P149 Nasreena Ibrahim and P199 Abbas Ibrahim as siblings (siblings).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P149 Nasreena Ibrahim, P199 Abbas Ibrahim) plus parent(P149 Nasreena Ibrahim, child) yields inferred aunt/uncle-line kin between P199 Abbas Ibrahim and P150 Dunya Maumoon.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P199 Abbas Ibrahim and P150 Dunya Maumoon as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P199", "P151", "aunt/uncle↔niece/nephew"), {
    summary: "P199 Abbas Ibrahim and P151 Yumna Maumoon are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p151-p199-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P149 Nasreena Ibrahim -> P151 Yumna Maumoon (CLM-0282, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox spouse and issue fields support Nasreena Ibrahim as spouse in the child list including Yumna Maumoon. (pair: P149 Nasreena Ib...",
      "Supporting edge: sibling P149 Nasreena Ibrahim <-> P199 Abbas Ibrahim [siblings] (CLM-0399, SRC-WIKI-ABBAS-IBRAHIM, grade B); excerpt: Abbas Ibrahim family/genealogy content links P149 Nasreena Ibrahim and P199 Abbas Ibrahim as siblings (siblings).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P149 Nasreena Ibrahim, P199 Abbas Ibrahim) plus parent(P149 Nasreena Ibrahim, child) yields inferred aunt/uncle-line kin between P199 Abbas Ibrahim and P151 Yumna Maumoon.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P199 Abbas Ibrahim and P151 Yumna Maumoon as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P199", "P152", "aunt/uncle↔niece/nephew"), {
    summary: "P199 Abbas Ibrahim and P152 Faris Maumoon are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p152-p199-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P149 Nasreena Ibrahim -> P152 Faris Maumoon (CLM-0283, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox spouse and issue fields support Nasreena Ibrahim as spouse in the child list including Faris Maumoon. (pair: P149 Nasreena Ib...",
      "Supporting edge: sibling P149 Nasreena Ibrahim <-> P199 Abbas Ibrahim [siblings] (CLM-0399, SRC-WIKI-ABBAS-IBRAHIM, grade B); excerpt: Abbas Ibrahim family/genealogy content links P149 Nasreena Ibrahim and P199 Abbas Ibrahim as siblings (siblings).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P149 Nasreena Ibrahim, P199 Abbas Ibrahim) plus parent(P149 Nasreena Ibrahim, child) yields inferred aunt/uncle-line kin between P199 Abbas Ibrahim and P152 Faris Maumoon.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P199 Abbas Ibrahim and P152 Faris Maumoon as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P199", "P153", "aunt/uncle↔niece/nephew"), {
    summary: "P199 Abbas Ibrahim and P153 Ghassan Maumoon are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p153-p199-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P149 Nasreena Ibrahim -> P153 Ghassan Maumoon (CLM-0284, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox spouse and issue fields support Nasreena Ibrahim as spouse in the child list including Ghassan Maumoon. (pair: P149 Nasreena ...",
      "Supporting edge: sibling P149 Nasreena Ibrahim <-> P199 Abbas Ibrahim [siblings] (CLM-0399, SRC-WIKI-ABBAS-IBRAHIM, grade B); excerpt: Abbas Ibrahim family/genealogy content links P149 Nasreena Ibrahim and P199 Abbas Ibrahim as siblings (siblings).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P149 Nasreena Ibrahim, P199 Abbas Ibrahim) plus parent(P149 Nasreena Ibrahim, child) yields inferred aunt/uncle-line kin between P199 Abbas Ibrahim and P153 Ghassan Maumoon.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P199 Abbas Ibrahim and P153 Ghassan Maumoon as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P19", "P27", "aunt/uncle↔niece/nephew"), {
    summary: "P19 Ahmed Shihabuddine (Loka Aadheeththa) and P27 Dhaain (Keerithi Maha Rehendi) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p19-p27-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P25 Raadhaafathi (Suvama Abarana) -> P27 Dhaain (Keerithi Maha Rehendi) (CLM-0595, SRC-ROYALARK-MALDIVES, grade B); excerpt: RoyalArk Maldives lineage reconstruction treats Dhaain (P27) as daughter of Raadhaafathi/Malika Fatima (P25), alongside parent linkage through P26.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P25 Raadhaafathi (Suvama Abarana), P19 Ahmed Shihabuddine (Loka Aadheeththa)) plus parent(P25 Raadhaafathi (Suvama Abarana), child) yields inferred aunt/uncle-line kin between P19 Ahmed Shihabuddine (Loka Aadheeththa) and P27 Dhaain (Keerithi Maha Rehendi).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P19 Ahmed Shihabuddine (Loka Aadheeththa) and P27 Dhaain (Keerithi Maha Rehendi) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P200", "P106", "aunt/uncle↔niece/nephew"), {
    summary: "P200 Ali Thakurufaanu and P106 Ibrahim Kalaafaan are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p106-p200-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P104 Mohamed Thakurufaanu al-Auzam -> P106 Ibrahim Kalaafaan (CLM-0228, SRC-MRF-UTHEEM, grade B); excerpt: Utheem Dynasty family/genealogy content lists P104 Mohamed Thakurufaanu al-Auzam as parent of P106 Ibrahim Kalaafaan.",
      "Supporting edge: sibling P200 Ali Thakurufaanu <-> P104 Mohamed Thakurufaanu al-Auzam [brothers] (CLM-0612, SRC-MRF-UTHEEM, grade B); excerpt: Direct sibling (brothers) relation recorded between Ali Thakurufaanu and Mohamed Thakurufaanu al-Auzam.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P104 Mohamed Thakurufaanu al-Auzam, P200 Ali Thakurufaanu) plus parent(P104 Mohamed Thakurufaanu al-Auzam, child) yields inferred aunt/uncle-line kin between P200 Ali Thakurufaanu and P106 Ibrahim Kalaafaan.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P200 Ali Thakurufaanu and P106 Ibrahim Kalaafaan as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P201", "P106", "aunt/uncle↔niece/nephew"), {
    summary: "P201 Hassan Thakurufaanu and P106 Ibrahim Kalaafaan are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p106-p201-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P104 Mohamed Thakurufaanu al-Auzam -> P106 Ibrahim Kalaafaan (CLM-0228, SRC-MRF-UTHEEM, grade B); excerpt: Utheem Dynasty family/genealogy content lists P104 Mohamed Thakurufaanu al-Auzam as parent of P106 Ibrahim Kalaafaan.",
      "Supporting edge: sibling P201 Hassan Thakurufaanu <-> P104 Mohamed Thakurufaanu al-Auzam [brothers] (CLM-0613, SRC-MRF-UTHEEM, grade B); excerpt: Direct sibling (brothers) relation recorded between Hassan Thakurufaanu and Mohamed Thakurufaanu al-Auzam.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P104 Mohamed Thakurufaanu al-Auzam, P201 Hassan Thakurufaanu) plus parent(P104 Mohamed Thakurufaanu al-Auzam, child) yields inferred aunt/uncle-line kin between P201 Hassan Thakurufaanu and P106 Ibrahim Kalaafaan.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P201 Hassan Thakurufaanu and P106 Ibrahim Kalaafaan as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P202", "P194", "aunt/uncle↔niece/nephew"), {
    summary: "P202 Kamba Dio and P194 Burecca are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p194-p202-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P193 Princess Recca -> P194 Burecca (CLM-0327, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P193 Princess Recca as parent of P194 Burecca.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P193 Princess Recca, P202 Kamba Dio) plus parent(P193 Princess Recca, child) yields inferred aunt/uncle-line kin between P202 Kamba Dio and P194 Burecca.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P202 Kamba Dio and P194 Burecca as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P202", "P196", "aunt/uncle↔niece/nephew"), {
    summary: "P202 Kamba Dio and P196 Reccy are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p196-p202-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P193 Princess Recca -> P196 Reccy (CLM-0328, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P193 Princess Recca as parent of P196 Reccy.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P193 Princess Recca, P202 Kamba Dio) plus parent(P193 Princess Recca, child) yields inferred aunt/uncle-line kin between P202 Kamba Dio and P196 Reccy.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P202 Kamba Dio and P196 Reccy as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P202", "P57", "aunt/uncle↔niece/nephew"), {
    summary: "P202 Kamba Dio and P57 Ali (Aanandha) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p202-p57-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P193 Princess Recca -> P57 Ali (Aanandha) (CLM-0329, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P193 Princess Recca as parent of P57 Ali.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P193 Princess Recca, P202 Kamba Dio) plus parent(P193 Princess Recca, child) yields inferred aunt/uncle-line kin between P202 Kamba Dio and P57 Ali (Aanandha).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P202 Kamba Dio and P57 Ali (Aanandha) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P208", "P50", "cousins"), {
    summary: "P208 Princess Aysha Rani Kilege and P50 Ibrahim (Bavana Furasuddha) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p208-p50-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P208 Princess Aysha Rani Kilege (CLM-0602, SRC-MRF-KINGS, grade B); excerpt: Direct parent relation recorded in the supporting source lane.",
      "Supporting edge: parent P47 Hassan (Raadha Aanandha) -> P50 Ibrahim (Bavana Furasuddha) (CLM-0601, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded in the supporting source lane.",
      "Supporting edge: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P47 Hassan (Raadha Aanandha) [half-brothers] (CLM-0639, SRC-ROYALARK-MALDIVES, grade B); excerpt: Sibling relation for the two parents recorded in the supporting source lane.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P51 Kalu Mohamed (Dhammaru Bavana) and P47 Hassan (Raadha Aanandha) are modeled as inferred cousin-line kin (P208 Princess Aysha Rani Kilege <-> P50 Ibrahim (Bavana Furasuddha)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P208 Princess Aysha Rani Kilege and P50 Ibrahim (Bavana Furasuddha) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P208", "P55", "cousins"), {
    summary: "P208 Princess Aysha Rani Kilege and P55 Hassan (Singa Veeru) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p208-p55-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P208 Princess Aysha Rani Kilege (CLM-0602, SRC-MRF-KINGS, grade B); excerpt: Direct parent relation recorded between Kalu Mohamed as parent of Princess Aysha Rani Kilege.",
      "Supporting edge: parent P52 Yoosuf (Veeru Aanandha) -> P55 Hassan (Singa Veeru) (CLM-0346, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P52 Yoosuf as parent of P55 Hassan.",
      "Supporting edge: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P52 Yoosuf (Veeru Aanandha) [brothers] (CLM-0441, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P51 Kalu Mohamed and P52 Yoosuf as siblings (brothers).",
      "Rule application (children-of-siblings-cousin): children of sibling parents P51 Kalu Mohamed (Dhammaru Bavana) and P52 Yoosuf (Veeru Aanandha) are modeled as inferred cousin-line kin (P208 Princess Aysha Rani Kilege <-> P55 Hassan (Singa Veeru)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P208 Princess Aysha Rani Kilege and P55 Hassan (Singa Veeru) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P208", "P60", "aunt/uncle↔niece/nephew"), {
    summary: "P208 Princess Aysha Rani Kilege and P60 Mohamed (Singa Bavana) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p208-p60-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P219 Umar Ma'afai Kilege -> P60 Mohamed (Singa Bavana) (CLM-0587, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Umar Ma'afai Kilege as parent of Mohamed.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P219 Umar Ma'afai Kilege, P208 Princess Aysha Rani Kilege) plus parent(P219 Umar Ma'afai Kilege, child) yields inferred aunt/uncle-line kin between P208 Princess Aysha Rani Kilege and P60 Mohamed (Singa Bavana).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P208 Princess Aysha Rani Kilege and P60 Mohamed (Singa Bavana) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P208", "P61", "aunt/uncle↔niece/nephew"), {
    summary: "P208 Princess Aysha Rani Kilege and P61 Hassan IX / Dom Manoel (Dhirikusa Loka) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p208-p61-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P220 Ahmad Manikufa'anu Kalaminja -> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) (CLM-0588, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Ahmad Manikufa'anu Kalaminja as parent of Hassan IX / Dom Manoel.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P220 Ahmad Manikufa'anu Kalaminja, P208 Princess Aysha Rani Kilege) plus parent(P220 Ahmad Manikufa'anu Kalaminja, child) yields inferred aunt/uncle-line kin between P208 Princess Aysha Rani Kilege and P61 Hassan IX / Dom Manoel (Dhirikusa Loka).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P208 Princess Aysha Rani Kilege and P61 Hassan IX / Dom Manoel (Dhirikusa Loka) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P209", "P213", "aunt/uncle↔niece/nephew"), {
    summary: "P209 Dom Francisco de Malvidas and P213 Infanta Dona Ines de Malvidas are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p209-p213-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P66 Joao’ (Keerithi Maha Radun) -> P213 Infanta Dona Ines de Malvidas (CLM-0609, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry under Dom Joao lists Infanta Dona Ines de Malvidas as daughter of Dom Joao and Dona Francisca de Vasconcelos.",
      "Supporting edge: sibling P209 Dom Francisco de Malvidas <-> P66 Joao’ (Keerithi Maha Radun) [brothers (same parents: Dom Manoel + Dona Leonor)] (CLM-0625, SRC-ROYALARK-M16, grade A); excerpt: Direct sibling (brothers (same parents: Dom Manoel + Dona Leonor)) relation recorded between Dom Francisco de Malvidas and Joao’.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P66 Joao’ (Keerithi Maha Radun), P209 Dom Francisco de Malvidas) plus parent(P66 Joao’ (Keerithi Maha Radun), child) yields inferred aunt/uncle-line kin between P209 Dom Francisco de Malvidas and P213 Infanta Dona Ines de Malvidas.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P209 Dom Francisco de Malvidas and P213 Infanta Dona Ines de Malvidas as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P209", "P67", "aunt/uncle↔niece/nephew"), {
    summary: "P209 Dom Francisco de Malvidas and P67 Philippe’ (Keerithi Maha Radun) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p209-p67-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P66 Joao’ (Keerithi Maha Radun) -> P67 Philippe’ (Keerithi Maha Radun) (CLM-0348, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P66 Joao’ as parent of P67 Philippe’.",
      "Supporting edge: sibling P209 Dom Francisco de Malvidas <-> P66 Joao’ (Keerithi Maha Radun) [brothers (same parents: Dom Manoel + Dona Leonor)] (CLM-0625, SRC-ROYALARK-M16, grade A); excerpt: Direct sibling (brothers (same parents: Dom Manoel + Dona Leonor)) relation recorded between Dom Francisco de Malvidas and Joao’.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P66 Joao’ (Keerithi Maha Radun), P209 Dom Francisco de Malvidas) plus parent(P66 Joao’ (Keerithi Maha Radun), child) yields inferred aunt/uncle-line kin between P209 Dom Francisco de Malvidas and P67 Philippe’ (Keerithi Maha Radun).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P209 Dom Francisco de Malvidas and P67 Philippe’ (Keerithi Maha Radun) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P20", "P27", "aunt/uncle↔niece/nephew"), {
    summary: "P20 Khadijah (Raadha Abarana) and P27 Dhaain (Keerithi Maha Rehendi) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p20-p27-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P25 Raadhaafathi (Suvama Abarana) -> P27 Dhaain (Keerithi Maha Rehendi) (CLM-0595, SRC-ROYALARK-MALDIVES, grade B); excerpt: RoyalArk Maldives lineage reconstruction treats Dhaain (P27) as daughter of Raadhaafathi/Malika Fatima (P25), alongside parent linkage through P26.",
      "Supporting edge: sibling P20 Khadijah (Raadha Abarana) <-> P25 Raadhaafathi (Suvama Abarana) [half-sisters] (CLM-0427, SRC-MRF-KINGS, grade B); excerpt: Kings list marks P20 and P25 as half-sisters.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P25 Raadhaafathi (Suvama Abarana), P20 Khadijah (Raadha Abarana)) plus parent(P25 Raadhaafathi (Suvama Abarana), child) yields inferred aunt/uncle-line kin between P20 Khadijah (Raadha Abarana) and P27 Dhaain (Keerithi Maha Rehendi).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P20 Khadijah (Raadha Abarana) and P27 Dhaain (Keerithi Maha Rehendi) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P210", "P213", "aunt/uncle↔niece/nephew"), {
    summary: "P210 Dom Pedro de Malvidas and P213 Infanta Dona Ines de Malvidas are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p210-p213-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P66 Joao’ (Keerithi Maha Radun) -> P213 Infanta Dona Ines de Malvidas (CLM-0609, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry under Dom Joao lists Infanta Dona Ines de Malvidas as daughter of Dom Joao and Dona Francisca de Vasconcelos.",
      "Supporting edge: sibling P210 Dom Pedro de Malvidas <-> P66 Joao’ (Keerithi Maha Radun) [brothers (same parents: Dom Manoel + Dona Leonor)] (CLM-0628, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry lists Dom Joao and Dom Pedro as sons in the same Dom Manoel and Dona Leonor de Ataide sibling set.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P66 Joao’ (Keerithi Maha Radun), P210 Dom Pedro de Malvidas) plus parent(P66 Joao’ (Keerithi Maha Radun), child) yields inferred aunt/uncle-line kin between P210 Dom Pedro de Malvidas and P213 Infanta Dona Ines de Malvidas.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P210 Dom Pedro de Malvidas and P213 Infanta Dona Ines de Malvidas as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P210", "P67", "aunt/uncle↔niece/nephew"), {
    summary: "P210 Dom Pedro de Malvidas and P67 Philippe’ (Keerithi Maha Radun) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p210-p67-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P66 Joao’ (Keerithi Maha Radun) -> P67 Philippe’ (Keerithi Maha Radun) (CLM-0348, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P66 Joao’ as parent of P67 Philippe’.",
      "Supporting edge: sibling P210 Dom Pedro de Malvidas <-> P66 Joao’ (Keerithi Maha Radun) [brothers (same parents: Dom Manoel + Dona Leonor)] (CLM-0628, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry lists Dom Joao and Dom Pedro as sons in the same Dom Manoel and Dona Leonor de Ataide sibling set.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P66 Joao’ (Keerithi Maha Radun), P210 Dom Pedro de Malvidas) plus parent(P66 Joao’ (Keerithi Maha Radun), child) yields inferred aunt/uncle-line kin between P210 Dom Pedro de Malvidas and P67 Philippe’ (Keerithi Maha Radun).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P210 Dom Pedro de Malvidas and P67 Philippe’ (Keerithi Maha Radun) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P211", "P213", "aunt/uncle↔niece/nephew"), {
    summary: "P211 Dona Leonor de Malvidas and P213 Infanta Dona Ines de Malvidas are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p211-p213-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P66 Joao’ (Keerithi Maha Radun) -> P213 Infanta Dona Ines de Malvidas (CLM-0609, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry under Dom Joao lists Infanta Dona Ines de Malvidas as daughter of Dom Joao and Dona Francisca de Vasconcelos.",
      "Supporting edge: sibling P211 Dona Leonor de Malvidas <-> P66 Joao’ (Keerithi Maha Radun) [siblings (same parents: Dom Manoel + Dona Leonor)] (CLM-0630, SRC-ROYALARK-M16, grade B); excerpt: RoyalArk lineage entry lists Dona Leonor de Malvidas and Dom Joao under the same parents (Dom Manoel and Dona Leonor de Ataide).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P66 Joao’ (Keerithi Maha Radun), P211 Dona Leonor de Malvidas) plus parent(P66 Joao’ (Keerithi Maha Radun), child) yields inferred aunt/uncle-line kin between P211 Dona Leonor de Malvidas and P213 Infanta Dona Ines de Malvidas.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P211 Dona Leonor de Malvidas and P213 Infanta Dona Ines de Malvidas as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P211", "P67", "aunt/uncle↔niece/nephew"), {
    summary: "P211 Dona Leonor de Malvidas and P67 Philippe’ (Keerithi Maha Radun) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p211-p67-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P66 Joao’ (Keerithi Maha Radun) -> P67 Philippe’ (Keerithi Maha Radun) (CLM-0348, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P66 Joao’ as parent of P67 Philippe’.",
      "Supporting edge: sibling P211 Dona Leonor de Malvidas <-> P66 Joao’ (Keerithi Maha Radun) [siblings (same parents: Dom Manoel + Dona Leonor)] (CLM-0630, SRC-ROYALARK-M16, grade B); excerpt: RoyalArk lineage entry lists Dona Leonor de Malvidas and Dom Joao under the same parents (Dom Manoel and Dona Leonor de Ataide).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P66 Joao’ (Keerithi Maha Radun), P211 Dona Leonor de Malvidas) plus parent(P66 Joao’ (Keerithi Maha Radun), child) yields inferred aunt/uncle-line kin between P211 Dona Leonor de Malvidas and P67 Philippe’ (Keerithi Maha Radun).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P211 Dona Leonor de Malvidas and P67 Philippe’ (Keerithi Maha Radun) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P212", "P213", "aunt/uncle↔niece/nephew"), {
    summary: "P212 Dona Catarina de Malvidas and P213 Infanta Dona Ines de Malvidas are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p212-p213-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P66 Joao’ (Keerithi Maha Radun) -> P213 Infanta Dona Ines de Malvidas (CLM-0609, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry under Dom Joao lists Infanta Dona Ines de Malvidas as daughter of Dom Joao and Dona Francisca de Vasconcelos.",
      "Supporting edge: sibling P212 Dona Catarina de Malvidas <-> P66 Joao’ (Keerithi Maha Radun) [siblings (same parents: Dom Manoel + Dona Leonor)] (CLM-0631, SRC-ROYALARK-M16, grade B); excerpt: RoyalArk lineage entry lists Dona Catarina de Malvidas and Dom Joao under the same parents (Dom Manoel and Dona Leonor de Ataide).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P66 Joao’ (Keerithi Maha Radun), P212 Dona Catarina de Malvidas) plus parent(P66 Joao’ (Keerithi Maha Radun), child) yields inferred aunt/uncle-line kin between P212 Dona Catarina de Malvidas and P213 Infanta Dona Ines de Malvidas.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P212 Dona Catarina de Malvidas and P213 Infanta Dona Ines de Malvidas as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P212", "P67", "aunt/uncle↔niece/nephew"), {
    summary: "P212 Dona Catarina de Malvidas and P67 Philippe’ (Keerithi Maha Radun) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p212-p67-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P66 Joao’ (Keerithi Maha Radun) -> P67 Philippe’ (Keerithi Maha Radun) (CLM-0348, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P66 Joao’ as parent of P67 Philippe’.",
      "Supporting edge: sibling P212 Dona Catarina de Malvidas <-> P66 Joao’ (Keerithi Maha Radun) [siblings (same parents: Dom Manoel + Dona Leonor)] (CLM-0631, SRC-ROYALARK-M16, grade B); excerpt: RoyalArk lineage entry lists Dona Catarina de Malvidas and Dom Joao under the same parents (Dom Manoel and Dona Leonor de Ataide).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P66 Joao’ (Keerithi Maha Radun), P212 Dona Catarina de Malvidas) plus parent(P66 Joao’ (Keerithi Maha Radun), child) yields inferred aunt/uncle-line kin between P212 Dona Catarina de Malvidas and P67 Philippe’ (Keerithi Maha Radun).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P212 Dona Catarina de Malvidas and P67 Philippe’ (Keerithi Maha Radun) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P213", "P98", "grandparent"), {
    summary: "P213 Infanta Dona Ines de Malvidas and P98 Dom Maraduru Fandiaiy Thakurufan are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p213-p98-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P213 Infanta Dona Ines de Malvidas -> P97 Dom Luis de Sousa (CLM-0580, SRC-ROYALARK-M16, grade A); excerpt: Direct parent relation recorded between Infanta Dona Ines de Malvidas as parent of Dom Luis de Sousa.",
      "Supporting edge: parent P97 Dom Luis de Sousa -> P98 Dom Maraduru Fandiaiy Thakurufan (CLM-0369, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P97 Dom Luis de Sousa as parent of P98 Dom Maraduru Fandiaiy Thakurufan.",
      "Rule application (parent-of-parent-grandparent): with source -> P97 Dom Luis de Sousa and P97 Dom Luis de Sousa -> target parent links, P213 Infanta Dona Ines de Malvidas is modeled as inferred grandparent-line kin of P98 Dom Maraduru Fandiaiy Thakurufan.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P213 Infanta Dona Ines de Malvidas and P98 Dom Maraduru Fandiaiy Thakurufan as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P216", "P13", "grandparent"), {
    summary: "P216 Fahi Hiriya Maava Kilage and P13 Audha (Areedha Suvara) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p13-p216-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P216 Fahi Hiriya Maava Kilage -> P7 Wadi (Dhagathaa Suvara) (CLM-0583, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Fahi Hiriya Maava Kilage as parent of Wadi.",
      "Supporting edge: parent P7 Wadi (Dhagathaa Suvara) -> P13 Audha (Areedha Suvara) (CLM-0352, SRC-MRF-KINGS, grade B); excerpt: Kings list sequence indicates P7 as father of P13.",
      "Rule application (parent-of-parent-grandparent): with source -> P7 Wadi (Dhagathaa Suvara) and P7 Wadi (Dhagathaa Suvara) -> target parent links, P216 Fahi Hiriya Maava Kilage is modeled as inferred grandparent-line kin of P13 Audha (Areedha Suvara).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P216 Fahi Hiriya Maava Kilage and P13 Audha (Areedha Suvara) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P217", "P31", "grandparent"), {
    summary: "P217 Dori Kuja and P31 Ibrahim (Dhammaru Veeru) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p217-p31-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P217 Dori Kuja -> P30 Hassan (Bavana) (CLM-0585, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Dori Kuja as parent of Hassan.",
      "Supporting edge: parent P30 Hassan (Bavana) -> P31 Ibrahim (Dhammaru Veeru) (CLM-0333, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P31 Ibrahim.",
      "Rule application (parent-of-parent-grandparent): with source -> P30 Hassan (Bavana) and P30 Hassan (Bavana) -> target parent links, P217 Dori Kuja is modeled as inferred grandparent-line kin of P31 Ibrahim (Dhammaru Veeru).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P217 Dori Kuja and P31 Ibrahim (Dhammaru Veeru) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P217", "P39", "grandparent"), {
    summary: "P217 Dori Kuja and P39 Yoosuf (Loka Aananadha) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p217-p39-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P217 Dori Kuja -> P30 Hassan (Bavana) (CLM-0585, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Dori Kuja as parent of Hassan.",
      "Supporting edge: parent P30 Hassan (Bavana) -> P39 Yoosuf (Loka Aananadha) (CLM-0334, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P39 Yoosuf.",
      "Rule application (parent-of-parent-grandparent): with source -> P30 Hassan (Bavana) and P30 Hassan (Bavana) -> target parent links, P217 Dori Kuja is modeled as inferred grandparent-line kin of P39 Yoosuf (Loka Aananadha).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P217 Dori Kuja and P39 Yoosuf (Loka Aananadha) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P217", "P40", "grandparent"), {
    summary: "P217 Dori Kuja and P40 Aboobakuru (Bavana Sooja) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p217-p40-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P217 Dori Kuja -> P30 Hassan (Bavana) (CLM-0585, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Dori Kuja as parent of Hassan.",
      "Supporting edge: parent P30 Hassan (Bavana) -> P40 Aboobakuru (Bavana Sooja) (CLM-0335, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P40 Aboobakuru.",
      "Rule application (parent-of-parent-grandparent): with source -> P30 Hassan (Bavana) and P30 Hassan (Bavana) -> target parent links, P217 Dori Kuja is modeled as inferred grandparent-line kin of P40 Aboobakuru (Bavana Sooja).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P217 Dori Kuja and P40 Aboobakuru (Bavana Sooja) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P218", "P31", "grandparent"), {
    summary: "P218 Golavehi Kabulo and P31 Ibrahim (Dhammaru Veeru) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p218-p31-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P218 Golavehi Kabulo -> P30 Hassan (Bavana) (CLM-0654, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Golavehi Kabulo as parent of Hassan.",
      "Supporting edge: parent P30 Hassan (Bavana) -> P31 Ibrahim (Dhammaru Veeru) (CLM-0333, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P31 Ibrahim.",
      "Rule application (parent-of-parent-grandparent): with source -> P30 Hassan (Bavana) and P30 Hassan (Bavana) -> target parent links, P218 Golavehi Kabulo is modeled as inferred grandparent-line kin of P31 Ibrahim (Dhammaru Veeru).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P218 Golavehi Kabulo and P31 Ibrahim (Dhammaru Veeru) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P218", "P39", "grandparent"), {
    summary: "P218 Golavehi Kabulo and P39 Yoosuf (Loka Aananadha) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p218-p39-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P218 Golavehi Kabulo -> P30 Hassan (Bavana) (CLM-0654, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Golavehi Kabulo as parent of Hassan.",
      "Supporting edge: parent P30 Hassan (Bavana) -> P39 Yoosuf (Loka Aananadha) (CLM-0334, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P39 Yoosuf.",
      "Rule application (parent-of-parent-grandparent): with source -> P30 Hassan (Bavana) and P30 Hassan (Bavana) -> target parent links, P218 Golavehi Kabulo is modeled as inferred grandparent-line kin of P39 Yoosuf (Loka Aananadha).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P218 Golavehi Kabulo and P39 Yoosuf (Loka Aananadha) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P218", "P40", "grandparent"), {
    summary: "P218 Golavehi Kabulo and P40 Aboobakuru (Bavana Sooja) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p218-p40-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P218 Golavehi Kabulo -> P30 Hassan (Bavana) (CLM-0654, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Golavehi Kabulo as parent of Hassan.",
      "Supporting edge: parent P30 Hassan (Bavana) -> P40 Aboobakuru (Bavana Sooja) (CLM-0335, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P40 Aboobakuru.",
      "Rule application (parent-of-parent-grandparent): with source -> P30 Hassan (Bavana) and P30 Hassan (Bavana) -> target parent links, P218 Golavehi Kabulo is modeled as inferred grandparent-line kin of P40 Aboobakuru (Bavana Sooja).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P218 Golavehi Kabulo and P40 Aboobakuru (Bavana Sooja) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P219", "P50", "cousins"), {
    summary: "P219 Umar Ma'afai Kilege and P50 Ibrahim (Bavana Furasuddha) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p219-p50-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P219 Umar Ma'afai Kilege (CLM-0603, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded in the supporting source lane.",
      "Supporting edge: parent P47 Hassan (Raadha Aanandha) -> P50 Ibrahim (Bavana Furasuddha) (CLM-0601, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded in the supporting source lane.",
      "Supporting edge: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P47 Hassan (Raadha Aanandha) [half-brothers] (CLM-0639, SRC-ROYALARK-MALDIVES, grade B); excerpt: Sibling relation for the two parents recorded in the supporting source lane.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P51 Kalu Mohamed (Dhammaru Bavana) and P47 Hassan (Raadha Aanandha) are modeled as inferred cousin-line kin (P219 Umar Ma'afai Kilege <-> P50 Ibrahim (Bavana Furasuddha)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P219 Umar Ma'afai Kilege and P50 Ibrahim (Bavana Furasuddha) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P219", "P55", "cousins"), {
    summary: "P219 Umar Ma'afai Kilege and P55 Hassan (Singa Veeru) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p219-p55-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P219 Umar Ma'afai Kilege (CLM-0603, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Kalu Mohamed as parent of Umar Ma'afai Kilege.",
      "Supporting edge: parent P52 Yoosuf (Veeru Aanandha) -> P55 Hassan (Singa Veeru) (CLM-0346, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P52 Yoosuf as parent of P55 Hassan.",
      "Supporting edge: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P52 Yoosuf (Veeru Aanandha) [brothers] (CLM-0441, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P51 Kalu Mohamed and P52 Yoosuf as siblings (brothers).",
      "Rule application (children-of-siblings-cousin): children of sibling parents P51 Kalu Mohamed (Dhammaru Bavana) and P52 Yoosuf (Veeru Aanandha) are modeled as inferred cousin-line kin (P219 Umar Ma'afai Kilege <-> P55 Hassan (Singa Veeru)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P219 Umar Ma'afai Kilege and P55 Hassan (Singa Veeru) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P219", "P61", "aunt/uncle↔niece/nephew"), {
    summary: "P219 Umar Ma'afai Kilege and P61 Hassan IX / Dom Manoel (Dhirikusa Loka) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p219-p61-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P220 Ahmad Manikufa'anu Kalaminja -> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) (CLM-0588, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Ahmad Manikufa'anu Kalaminja as parent of Hassan IX / Dom Manoel.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P220 Ahmad Manikufa'anu Kalaminja, P219 Umar Ma'afai Kilege) plus parent(P220 Ahmad Manikufa'anu Kalaminja, child) yields inferred aunt/uncle-line kin between P219 Umar Ma'afai Kilege and P61 Hassan IX / Dom Manoel (Dhirikusa Loka).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P219 Umar Ma'afai Kilege and P61 Hassan IX / Dom Manoel (Dhirikusa Loka) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P220", "P209", "grandparent"), {
    summary: "P220 Ahmad Manikufa'anu Kalaminja and P209 Dom Francisco de Malvidas are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p209-p220-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P220 Ahmad Manikufa'anu Kalaminja -> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) (CLM-0588, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Ahmad Manikufa'anu Kalaminja as parent of Hassan IX / Dom Manoel.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P209 Dom Francisco de Malvidas (CLM-0605, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry under Dom Manoel lists Dom Francisco de Malvidas among the children of Dom Manoel and Dona Leonor de Ataide.",
      "Rule application (parent-of-parent-grandparent): with source -> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) and P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> target parent links, P220 Ahmad Manikufa'anu Kalaminja is modeled as inferred grandparent-line kin of P209 Dom Francisco de Malvidas.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P220 Ahmad Manikufa'anu Kalaminja and P209 Dom Francisco de Malvidas as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P220", "P210", "grandparent"), {
    summary: "P220 Ahmad Manikufa'anu Kalaminja and P210 Dom Pedro de Malvidas are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p210-p220-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P220 Ahmad Manikufa'anu Kalaminja -> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) (CLM-0588, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Ahmad Manikufa'anu Kalaminja as parent of Hassan IX / Dom Manoel.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P210 Dom Pedro de Malvidas (CLM-0606, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry under Dom Manoel lists Dom Pedro de Malvidas among the children of Dom Manoel and Dona Leonor de Ataide.",
      "Rule application (parent-of-parent-grandparent): with source -> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) and P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> target parent links, P220 Ahmad Manikufa'anu Kalaminja is modeled as inferred grandparent-line kin of P210 Dom Pedro de Malvidas.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P220 Ahmad Manikufa'anu Kalaminja and P210 Dom Pedro de Malvidas as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P220", "P211", "grandparent"), {
    summary: "P220 Ahmad Manikufa'anu Kalaminja and P211 Dona Leonor de Malvidas are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p211-p220-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P220 Ahmad Manikufa'anu Kalaminja -> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) (CLM-0588, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Ahmad Manikufa'anu Kalaminja as parent of Hassan IX / Dom Manoel.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P211 Dona Leonor de Malvidas (CLM-0607, SRC-ROYALARK-M16, grade B); excerpt: RoyalArk lineage entry under Dom Manoel lists Dona Leonor de Malvidas as a daughter in the same Dom Manoel and Dona Leonor de Ataide branch.",
      "Rule application (parent-of-parent-grandparent): with source -> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) and P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> target parent links, P220 Ahmad Manikufa'anu Kalaminja is modeled as inferred grandparent-line kin of P211 Dona Leonor de Malvidas.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P220 Ahmad Manikufa'anu Kalaminja and P211 Dona Leonor de Malvidas as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P220", "P212", "grandparent"), {
    summary: "P220 Ahmad Manikufa'anu Kalaminja and P212 Dona Catarina de Malvidas are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p212-p220-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P220 Ahmad Manikufa'anu Kalaminja -> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) (CLM-0588, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Ahmad Manikufa'anu Kalaminja as parent of Hassan IX / Dom Manoel.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P212 Dona Catarina de Malvidas (CLM-0608, SRC-ROYALARK-M16, grade B); excerpt: RoyalArk lineage entry under Dom Manoel lists Dona Catarina de Malvidas as a daughter in the same Dom Manoel and Dona Leonor de Ataide branch.",
      "Rule application (parent-of-parent-grandparent): with source -> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) and P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> target parent links, P220 Ahmad Manikufa'anu Kalaminja is modeled as inferred grandparent-line kin of P212 Dona Catarina de Malvidas.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P220 Ahmad Manikufa'anu Kalaminja and P212 Dona Catarina de Malvidas as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P220", "P50", "cousins"), {
    summary: "P220 Ahmad Manikufa'anu Kalaminja and P50 Ibrahim (Bavana Furasuddha) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p220-p50-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P220 Ahmad Manikufa'anu Kalaminja (CLM-0604, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded in the supporting source lane.",
      "Supporting edge: parent P47 Hassan (Raadha Aanandha) -> P50 Ibrahim (Bavana Furasuddha) (CLM-0601, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded in the supporting source lane.",
      "Supporting edge: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P47 Hassan (Raadha Aanandha) [half-brothers] (CLM-0639, SRC-ROYALARK-MALDIVES, grade B); excerpt: Sibling relation for the two parents recorded in the supporting source lane.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P51 Kalu Mohamed (Dhammaru Bavana) and P47 Hassan (Raadha Aanandha) are modeled as inferred cousin-line kin (P220 Ahmad Manikufa'anu Kalaminja <-> P50 Ibrahim (Bavana Furasuddha)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P220 Ahmad Manikufa'anu Kalaminja and P50 Ibrahim (Bavana Furasuddha) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P220", "P55", "cousins"), {
    summary: "P220 Ahmad Manikufa'anu Kalaminja and P55 Hassan (Singa Veeru) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p220-p55-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P220 Ahmad Manikufa'anu Kalaminja (CLM-0604, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Kalu Mohamed as parent of Ahmad Manikufa'anu Kalaminja.",
      "Supporting edge: parent P52 Yoosuf (Veeru Aanandha) -> P55 Hassan (Singa Veeru) (CLM-0346, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P52 Yoosuf as parent of P55 Hassan.",
      "Supporting edge: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P52 Yoosuf (Veeru Aanandha) [brothers] (CLM-0441, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P51 Kalu Mohamed and P52 Yoosuf as siblings (brothers).",
      "Rule application (children-of-siblings-cousin): children of sibling parents P51 Kalu Mohamed (Dhammaru Bavana) and P52 Yoosuf (Veeru Aanandha) are modeled as inferred cousin-line kin (P220 Ahmad Manikufa'anu Kalaminja <-> P55 Hassan (Singa Veeru)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P220 Ahmad Manikufa'anu Kalaminja and P55 Hassan (Singa Veeru) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P220", "P60", "aunt/uncle↔niece/nephew"), {
    summary: "P220 Ahmad Manikufa'anu Kalaminja and P60 Mohamed (Singa Bavana) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p220-p60-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P219 Umar Ma'afai Kilege -> P60 Mohamed (Singa Bavana) (CLM-0587, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Umar Ma'afai Kilege as parent of Mohamed.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P219 Umar Ma'afai Kilege, P220 Ahmad Manikufa'anu Kalaminja) plus parent(P219 Umar Ma'afai Kilege, child) yields inferred aunt/uncle-line kin between P220 Ahmad Manikufa'anu Kalaminja and P60 Mohamed (Singa Bavana).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P220 Ahmad Manikufa'anu Kalaminja and P60 Mohamed (Singa Bavana) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P220", "P66", "grandparent"), {
    summary: "P220 Ahmad Manikufa'anu Kalaminja and P66 Joao’ (Keerithi Maha Radun) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p220-p66-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P220 Ahmad Manikufa'anu Kalaminja -> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) (CLM-0588, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Ahmad Manikufa'anu Kalaminja as parent of Hassan IX / Dom Manoel.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P66 Joao’ (Keerithi Maha Radun) (CLM-0347, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P61 Hassan IX / Dom Manoel as parent of P66 Joao’.",
      "Rule application (parent-of-parent-grandparent): with source -> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) and P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> target parent links, P220 Ahmad Manikufa'anu Kalaminja is modeled as inferred grandparent-line kin of P66 Joao’ (Keerithi Maha Radun).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P220 Ahmad Manikufa'anu Kalaminja and P66 Joao’ (Keerithi Maha Radun) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P221", "P209", "grandparent"), {
    summary: "P221 Golavehi Aisha Rani Kilege and P209 Dom Francisco de Malvidas are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p209-p221-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P221 Golavehi Aisha Rani Kilege -> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) (CLM-0590, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Golavehi Aisha Rani Kilege as parent of Hassan IX / Dom Manoel.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P209 Dom Francisco de Malvidas (CLM-0605, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry under Dom Manoel lists Dom Francisco de Malvidas among the children of Dom Manoel and Dona Leonor de Ataide.",
      "Rule application (parent-of-parent-grandparent): with source -> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) and P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> target parent links, P221 Golavehi Aisha Rani Kilege is modeled as inferred grandparent-line kin of P209 Dom Francisco de Malvidas.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P221 Golavehi Aisha Rani Kilege and P209 Dom Francisco de Malvidas as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P221", "P210", "grandparent"), {
    summary: "P221 Golavehi Aisha Rani Kilege and P210 Dom Pedro de Malvidas are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p210-p221-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P221 Golavehi Aisha Rani Kilege -> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) (CLM-0590, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Golavehi Aisha Rani Kilege as parent of Hassan IX / Dom Manoel.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P210 Dom Pedro de Malvidas (CLM-0606, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry under Dom Manoel lists Dom Pedro de Malvidas among the children of Dom Manoel and Dona Leonor de Ataide.",
      "Rule application (parent-of-parent-grandparent): with source -> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) and P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> target parent links, P221 Golavehi Aisha Rani Kilege is modeled as inferred grandparent-line kin of P210 Dom Pedro de Malvidas.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P221 Golavehi Aisha Rani Kilege and P210 Dom Pedro de Malvidas as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P221", "P211", "grandparent"), {
    summary: "P221 Golavehi Aisha Rani Kilege and P211 Dona Leonor de Malvidas are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p211-p221-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P221 Golavehi Aisha Rani Kilege -> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) (CLM-0590, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Golavehi Aisha Rani Kilege as parent of Hassan IX / Dom Manoel.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P211 Dona Leonor de Malvidas (CLM-0607, SRC-ROYALARK-M16, grade B); excerpt: RoyalArk lineage entry under Dom Manoel lists Dona Leonor de Malvidas as a daughter in the same Dom Manoel and Dona Leonor de Ataide branch.",
      "Rule application (parent-of-parent-grandparent): with source -> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) and P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> target parent links, P221 Golavehi Aisha Rani Kilege is modeled as inferred grandparent-line kin of P211 Dona Leonor de Malvidas.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P221 Golavehi Aisha Rani Kilege and P211 Dona Leonor de Malvidas as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P221", "P212", "grandparent"), {
    summary: "P221 Golavehi Aisha Rani Kilege and P212 Dona Catarina de Malvidas are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p212-p221-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P221 Golavehi Aisha Rani Kilege -> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) (CLM-0590, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Golavehi Aisha Rani Kilege as parent of Hassan IX / Dom Manoel.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P212 Dona Catarina de Malvidas (CLM-0608, SRC-ROYALARK-M16, grade B); excerpt: RoyalArk lineage entry under Dom Manoel lists Dona Catarina de Malvidas as a daughter in the same Dom Manoel and Dona Leonor de Ataide branch.",
      "Rule application (parent-of-parent-grandparent): with source -> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) and P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> target parent links, P221 Golavehi Aisha Rani Kilege is modeled as inferred grandparent-line kin of P212 Dona Catarina de Malvidas.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P221 Golavehi Aisha Rani Kilege and P212 Dona Catarina de Malvidas as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P221", "P66", "grandparent"), {
    summary: "P221 Golavehi Aisha Rani Kilege and P66 Joao’ (Keerithi Maha Radun) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p221-p66-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P221 Golavehi Aisha Rani Kilege -> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) (CLM-0590, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Golavehi Aisha Rani Kilege as parent of Hassan IX / Dom Manoel.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P66 Joao’ (Keerithi Maha Radun) (CLM-0347, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P61 Hassan IX / Dom Manoel as parent of P66 Joao’.",
      "Rule application (parent-of-parent-grandparent): with source -> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) and P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> target parent links, P221 Golavehi Aisha Rani Kilege is modeled as inferred grandparent-line kin of P66 Joao’ (Keerithi Maha Radun).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P221 Golavehi Aisha Rani Kilege and P66 Joao’ (Keerithi Maha Radun) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P222", "P90", "aunt/uncle↔niece/nephew"), {
    summary: "P222 Hassan Izz ud-din and P90 Mohamed Imaduddine V (Keerithi Maha Radun) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p222-p90-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P87 Ibrahim Nooredine (Keerithi Maha Radun) -> P90 Mohamed Imaduddine V (Keerithi Maha Radun) (CLM-0365, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P87 Ibrahim Nooredine as parent of P90 Mohamed Imaduddine V.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P87 Ibrahim Nooredine (Keerithi Maha Radun), P222 Hassan Izz ud-din) plus parent(P87 Ibrahim Nooredine (Keerithi Maha Radun), child) yields inferred aunt/uncle-line kin between P222 Hassan Izz ud-din and P90 Mohamed Imaduddine V (Keerithi Maha Radun).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P222 Hassan Izz ud-din and P90 Mohamed Imaduddine V (Keerithi Maha Radun) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P222", "P91", "aunt/uncle↔niece/nephew"), {
    summary: "P222 Hassan Izz ud-din and P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p222-p91-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P87 Ibrahim Nooredine (Keerithi Maha Radun) -> P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) (CLM-0366, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P87 Ibrahim Nooredine as parent of P91 Mohamed Shamsuddine III.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P87 Ibrahim Nooredine (Keerithi Maha Radun), P222 Hassan Izz ud-din) plus parent(P87 Ibrahim Nooredine (Keerithi Maha Radun), child) yields inferred aunt/uncle-line kin between P222 Hassan Izz ud-din and P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P222 Hassan Izz ud-din and P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P222", "P94", "grandparent"), {
    summary: "P222 Hassan Izz ud-din and P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p222-p94-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P222 Hassan Izz ud-din -> P88 Mohamed Mueenuddine (Keerithi Maha Radun) (CLM-0591, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Hassan Izz ud-din as parent of Mohamed Mueenuddine.",
      "Supporting edge: parent P88 Mohamed Mueenuddine (Keerithi Maha Radun) -> P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka) (CLM-0367, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P88 Mohamed Mueenuddine as parent of P94 Hassan Nooredine II.",
      "Rule application (parent-of-parent-grandparent): with source -> P88 Mohamed Mueenuddine (Keerithi Maha Radun) and P88 Mohamed Mueenuddine (Keerithi Maha Radun) -> target parent links, P222 Hassan Izz ud-din is modeled as inferred grandparent-line kin of P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P222 Hassan Izz ud-din and P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P30", "P193", "grandparent"), {
    summary: "P30 Hassan (Bavana) and P193 Princess Recca are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p193-p30-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P30 Hassan (Bavana) -> P40 Aboobakuru (Bavana Sooja) (CLM-0335, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P40 Aboobakuru.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P193 Princess Recca (CLM-0337, SRC-MRF-KINGS, grade B); excerpt: Kings list and Hilaaly branch notes together support parent edge P40 to P193.",
      "Rule application (parent-of-parent-grandparent): with source -> P40 Aboobakuru (Bavana Sooja) and P40 Aboobakuru (Bavana Sooja) -> target parent links, P30 Hassan (Bavana) is modeled as inferred grandparent-line kin of P193 Princess Recca.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P30 Hassan (Bavana) and P193 Princess Recca as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P30", "P202", "grandparent"), {
    summary: "P30 Hassan (Bavana) and P202 Kamba Dio are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p202-p30-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P30 Hassan (Bavana) -> P40 Aboobakuru (Bavana Sooja) (CLM-0335, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P40 Aboobakuru.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P202 Kamba Dio (CLM-0597, SRC-MRF-HILAALY, grade B); excerpt: Direct parent relation recorded between Aboobakuru as parent of Kamba Dio.",
      "Rule application (parent-of-parent-grandparent): with source -> P40 Aboobakuru (Bavana Sooja) and P40 Aboobakuru (Bavana Sooja) -> target parent links, P30 Hassan (Bavana) is modeled as inferred grandparent-line kin of P202 Kamba Dio.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P30 Hassan (Bavana) and P202 Kamba Dio as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P30", "P41", "grandparent"), {
    summary: "P30 Hassan (Bavana) and P41 Hadi Hassan (Raadha Veeru) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p30-p41-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P30 Hassan (Bavana) -> P39 Yoosuf (Loka Aananadha) (CLM-0334, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P39 Yoosuf.",
      "Supporting edge: parent P39 Yoosuf (Loka Aananadha) -> P41 Hadi Hassan (Raadha Veeru) (CLM-0596, SRC-ROYALARK-MALDIVES, grade B); excerpt: RoyalArk Maldives lineage reconstruction gives Yoosuf (P39) as father of Hadi Hassan (P41), which aligns with current canonical parent selection.",
      "Rule application (parent-of-parent-grandparent): with source -> P39 Yoosuf (Loka Aananadha) and P39 Yoosuf (Loka Aananadha) -> target parent links, P30 Hassan (Bavana) is modeled as inferred grandparent-line kin of P41 Hadi Hassan (Raadha Veeru).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P30 Hassan (Bavana) and P41 Hadi Hassan (Raadha Veeru) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P30", "P46", "grandparent"), {
    summary: "P30 Hassan (Bavana) and P46 Omar (Loka Sundhura) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p30-p46-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P30 Hassan (Bavana) -> P39 Yoosuf (Loka Aananadha) (CLM-0334, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P39 Yoosuf.",
      "Supporting edge: parent P39 Yoosuf (Loka Aananadha) -> P46 Omar (Loka Sundhura) (CLM-0336, SRC-MRF-KINGS, grade B); excerpt: Kings list records parent edge P39 to P46.",
      "Rule application (parent-of-parent-grandparent): with source -> P39 Yoosuf (Loka Aananadha) and P39 Yoosuf (Loka Aananadha) -> target parent links, P30 Hassan (Bavana) is modeled as inferred grandparent-line kin of P46 Omar (Loka Sundhura).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P30 Hassan (Bavana) and P46 Omar (Loka Sundhura) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P31", "P193", "aunt/uncle↔niece/nephew"), {
    summary: "P31 Ibrahim (Dhammaru Veeru) and P193 Princess Recca are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p193-p31-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P193 Princess Recca (CLM-0337, SRC-MRF-KINGS, grade B); excerpt: Kings list and Hilaaly branch notes together support parent edge P40 to P193.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P40 Aboobakuru (Bavana Sooja), P31 Ibrahim (Dhammaru Veeru)) plus parent(P40 Aboobakuru (Bavana Sooja), child) yields inferred aunt/uncle-line kin between P31 Ibrahim (Dhammaru Veeru) and P193 Princess Recca.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P31 Ibrahim (Dhammaru Veeru) and P193 Princess Recca as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P31", "P202", "aunt/uncle↔niece/nephew"), {
    summary: "P31 Ibrahim (Dhammaru Veeru) and P202 Kamba Dio are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p202-p31-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P202 Kamba Dio (CLM-0597, SRC-MRF-HILAALY, grade B); excerpt: Direct parent relation recorded between Aboobakuru as parent of Kamba Dio.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P40 Aboobakuru (Bavana Sooja), P31 Ibrahim (Dhammaru Veeru)) plus parent(P40 Aboobakuru (Bavana Sooja), child) yields inferred aunt/uncle-line kin between P31 Ibrahim (Dhammaru Veeru) and P202 Kamba Dio.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P31 Ibrahim (Dhammaru Veeru) and P202 Kamba Dio as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P31", "P41", "aunt/uncle↔niece/nephew"), {
    summary: "P31 Ibrahim (Dhammaru Veeru) and P41 Hadi Hassan (Raadha Veeru) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p31-p41-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P39 Yoosuf (Loka Aananadha) -> P41 Hadi Hassan (Raadha Veeru) (CLM-0596, SRC-ROYALARK-MALDIVES, grade B); excerpt: RoyalArk Maldives lineage reconstruction gives Yoosuf (P39) as father of Hadi Hassan (P41), which aligns with current canonical parent selection.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P39 Yoosuf (Loka Aananadha), P31 Ibrahim (Dhammaru Veeru)) plus parent(P39 Yoosuf (Loka Aananadha), child) yields inferred aunt/uncle-line kin between P31 Ibrahim (Dhammaru Veeru) and P41 Hadi Hassan (Raadha Veeru).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P31 Ibrahim (Dhammaru Veeru) and P41 Hadi Hassan (Raadha Veeru) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P31", "P46", "aunt/uncle↔niece/nephew"), {
    summary: "P31 Ibrahim (Dhammaru Veeru) and P46 Omar (Loka Sundhura) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p31-p46-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P39 Yoosuf (Loka Aananadha) -> P46 Omar (Loka Sundhura) (CLM-0336, SRC-MRF-KINGS, grade B); excerpt: Kings list records parent edge P39 to P46.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P39 Yoosuf (Loka Aananadha), P31 Ibrahim (Dhammaru Veeru)) plus parent(P39 Yoosuf (Loka Aananadha), child) yields inferred aunt/uncle-line kin between P31 Ibrahim (Dhammaru Veeru) and P46 Omar (Loka Sundhura).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P31 Ibrahim (Dhammaru Veeru) and P46 Omar (Loka Sundhura) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P32", "P31", "uncle→nephew"), {
    summary: "P32 Hussain (Loka Veeru) and P31 Ibrahim (Dhammaru Veeru) are modeled as `kin` with label `uncle→nephew` to preserve a targeted continuity claim without over-promoting certainty.",
    dossier: "docs/research-program/inferences/kin-p31-p32-uncle-nephew.md",
    logic: [
      "Shortest direct-claim support path (2 steps) linking this pair:",
      "sibling P32 Hussain (Loka Veeru) <-> P30 Hassan (Bavana) [twins] (CLM-0428, SRC-MRF-KINGS)",
      "parent P30 Hassan (Bavana) -> P31 Ibrahim (Dhammaru Veeru) (CLM-0333, SRC-MRF-KINGS)",
      "This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.",
      "Current modeling choice remains `inferred` because explicit source wording that names `kin` for P32 Hussain (Loka Veeru) and P31 Ibrahim (Dhammaru Veeru) is still absent."
    ],
    verification: [
      "Promotion requirement: an A/B source statement explicitly naming P32 Hussain (Loka Veeru) and P31 Ibrahim (Dhammaru Veeru) with relation class `kin` (uncle→nephew).",
      "Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.",
      "Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster."
    ]
  }],
  [k("kin", "P32", "P39", "aunt/uncle↔niece/nephew"), {
    summary: "P32 Hussain (Loka Veeru) and P39 Yoosuf (Loka Aananadha) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p32-p39-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P30 Hassan (Bavana) -> P39 Yoosuf (Loka Aananadha) (CLM-0334, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P39 Yoosuf.",
      "Supporting edge: sibling P30 Hassan (Bavana) <-> P32 Hussain (Loka Veeru) [twins] (CLM-0428, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P30 Hassan and P32 Hussain as siblings (twins).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P30 Hassan (Bavana), P32 Hussain (Loka Veeru)) plus parent(P30 Hassan (Bavana), child) yields inferred aunt/uncle-line kin between P32 Hussain (Loka Veeru) and P39 Yoosuf (Loka Aananadha).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P32 Hussain (Loka Veeru) and P39 Yoosuf (Loka Aananadha) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P32", "P40", "aunt/uncle↔niece/nephew"), {
    summary: "P32 Hussain (Loka Veeru) and P40 Aboobakuru (Bavana Sooja) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p32-p40-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P30 Hassan (Bavana) -> P40 Aboobakuru (Bavana Sooja) (CLM-0335, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P40 Aboobakuru.",
      "Supporting edge: sibling P30 Hassan (Bavana) <-> P32 Hussain (Loka Veeru) [twins] (CLM-0428, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P30 Hassan and P32 Hussain as siblings (twins).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P30 Hassan (Bavana), P32 Hussain (Loka Veeru)) plus parent(P30 Hassan (Bavana), child) yields inferred aunt/uncle-line kin between P32 Hussain (Loka Veeru) and P40 Aboobakuru (Bavana Sooja).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P32 Hussain (Loka Veeru) and P40 Aboobakuru (Bavana Sooja) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P39", "P193", "aunt/uncle↔niece/nephew"), {
    summary: "P39 Yoosuf (Loka Aananadha) and P193 Princess Recca are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p193-p39-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P193 Princess Recca (CLM-0337, SRC-MRF-KINGS, grade B); excerpt: Kings list and Hilaaly branch notes together support parent edge P40 to P193.",
      "Supporting edge: sibling P39 Yoosuf (Loka Aananadha) <-> P40 Aboobakuru (Bavana Sooja) [half-brothers] (CLM-0432, SRC-MRF-KINGS, grade B); excerpt: Kings list marks P39 and P40 as half-brothers.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P40 Aboobakuru (Bavana Sooja), P39 Yoosuf (Loka Aananadha)) plus parent(P40 Aboobakuru (Bavana Sooja), child) yields inferred aunt/uncle-line kin between P39 Yoosuf (Loka Aananadha) and P193 Princess Recca.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P39 Yoosuf (Loka Aananadha) and P193 Princess Recca as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P39", "P202", "aunt/uncle↔niece/nephew"), {
    summary: "P39 Yoosuf (Loka Aananadha) and P202 Kamba Dio are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p202-p39-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P202 Kamba Dio (CLM-0597, SRC-MRF-HILAALY, grade B); excerpt: Direct parent relation recorded between Aboobakuru as parent of Kamba Dio.",
      "Supporting edge: sibling P39 Yoosuf (Loka Aananadha) <-> P40 Aboobakuru (Bavana Sooja) [half-brothers] (CLM-0432, SRC-MRF-KINGS, grade B); excerpt: Kings list marks P39 and P40 as half-brothers.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P40 Aboobakuru (Bavana Sooja), P39 Yoosuf (Loka Aananadha)) plus parent(P40 Aboobakuru (Bavana Sooja), child) yields inferred aunt/uncle-line kin between P39 Yoosuf (Loka Aananadha) and P202 Kamba Dio.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P39 Yoosuf (Loka Aananadha) and P202 Kamba Dio as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P39", "P44", "grandparent"), {
    summary: "P39 Yoosuf (Loka Aananadha) and P44 Mohamed (Bavana Abarana) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p39-p44-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P39 Yoosuf (Loka Aananadha) -> P41 Hadi Hassan (Raadha Veeru) (CLM-0596, SRC-ROYALARK-MALDIVES, grade B); excerpt: RoyalArk Maldives lineage reconstruction gives Yoosuf (P39) as father of Hadi Hassan (P41), which aligns with current canonical parent selection.",
      "Supporting edge: parent P41 Hadi Hassan (Raadha Veeru) -> P44 Mohamed (Bavana Abarana) (CLM-0339, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P41 Hadi Hassan as parent of P44 Mohamed.",
      "Rule application (parent-of-parent-grandparent): with source -> P41 Hadi Hassan (Raadha Veeru) and P41 Hadi Hassan (Raadha Veeru) -> target parent links, P39 Yoosuf (Loka Aananadha) is modeled as inferred grandparent-line kin of P44 Mohamed (Bavana Abarana).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P39 Yoosuf (Loka Aananadha) and P44 Mohamed (Bavana Abarana) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P39", "P47", "grandparent"), {
    summary: "P39 Yoosuf (Loka Aananadha) and P47 Hassan (Raadha Aanandha) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p39-p47-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P39 Yoosuf (Loka Aananadha) -> P46 Omar (Loka Sundhura) (CLM-0336, SRC-MRF-KINGS, grade B); excerpt: Kings list records parent edge P39 to P46.",
      "Supporting edge: parent P46 Omar (Loka Sundhura) -> P47 Hassan (Raadha Aanandha) (CLM-0341, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P47 Hassan.",
      "Rule application (parent-of-parent-grandparent): with source -> P46 Omar (Loka Sundhura) and P46 Omar (Loka Sundhura) -> target parent links, P39 Yoosuf (Loka Aananadha) is modeled as inferred grandparent-line kin of P47 Hassan (Raadha Aanandha).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P39 Yoosuf (Loka Aananadha) and P47 Hassan (Raadha Aanandha) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P39", "P51", "grandparent"), {
    summary: "P39 Yoosuf (Loka Aananadha) and P51 Kalu Mohamed (Dhammaru Bavana) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p39-p51-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P39 Yoosuf (Loka Aananadha) -> P46 Omar (Loka Sundhura) (CLM-0336, SRC-MRF-KINGS, grade B); excerpt: Kings list records parent edge P39 to P46.",
      "Supporting edge: parent P46 Omar (Loka Sundhura) -> P51 Kalu Mohamed (Dhammaru Bavana) (CLM-0343, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P51 Kalu Mohamed.",
      "Rule application (parent-of-parent-grandparent): with source -> P46 Omar (Loka Sundhura) and P46 Omar (Loka Sundhura) -> target parent links, P39 Yoosuf (Loka Aananadha) is modeled as inferred grandparent-line kin of P51 Kalu Mohamed (Dhammaru Bavana).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P39 Yoosuf (Loka Aananadha) and P51 Kalu Mohamed (Dhammaru Bavana) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P39", "P52", "grandparent"), {
    summary: "P39 Yoosuf (Loka Aananadha) and P52 Yoosuf (Veeru Aanandha) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p39-p52-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P39 Yoosuf (Loka Aananadha) -> P46 Omar (Loka Sundhura) (CLM-0336, SRC-MRF-KINGS, grade B); excerpt: Kings list records parent edge P39 to P46.",
      "Supporting edge: parent P46 Omar (Loka Sundhura) -> P52 Yoosuf (Veeru Aanandha) (CLM-0344, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P52 Yoosuf.",
      "Rule application (parent-of-parent-grandparent): with source -> P46 Omar (Loka Sundhura) and P46 Omar (Loka Sundhura) -> target parent links, P39 Yoosuf (Loka Aananadha) is modeled as inferred grandparent-line kin of P52 Yoosuf (Veeru Aanandha).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P39 Yoosuf (Loka Aananadha) and P52 Yoosuf (Veeru Aanandha) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P40", "P194", "grandparent"), {
    summary: "P40 Aboobakuru (Bavana Sooja) and P194 Burecca are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p194-p40-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P193 Princess Recca (CLM-0337, SRC-MRF-KINGS, grade B); excerpt: Kings list and Hilaaly branch notes together support parent edge P40 to P193.",
      "Supporting edge: parent P193 Princess Recca -> P194 Burecca (CLM-0327, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P193 Princess Recca as parent of P194 Burecca.",
      "Rule application (parent-of-parent-grandparent): with source -> P193 Princess Recca and P193 Princess Recca -> target parent links, P40 Aboobakuru (Bavana Sooja) is modeled as inferred grandparent-line kin of P194 Burecca.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P40 Aboobakuru (Bavana Sooja) and P194 Burecca as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P40", "P196", "grandparent"), {
    summary: "P40 Aboobakuru (Bavana Sooja) and P196 Reccy are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p196-p40-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P193 Princess Recca (CLM-0337, SRC-MRF-KINGS, grade B); excerpt: Kings list and Hilaaly branch notes together support parent edge P40 to P193.",
      "Supporting edge: parent P193 Princess Recca -> P196 Reccy (CLM-0328, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P193 Princess Recca as parent of P196 Reccy.",
      "Rule application (parent-of-parent-grandparent): with source -> P193 Princess Recca and P193 Princess Recca -> target parent links, P40 Aboobakuru (Bavana Sooja) is modeled as inferred grandparent-line kin of P196 Reccy.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P40 Aboobakuru (Bavana Sooja) and P196 Reccy as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P40", "P46", "aunt/uncle↔niece/nephew"), {
    summary: "P40 Aboobakuru (Bavana Sooja) and P46 Omar (Loka Sundhura) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p40-p46-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P39 Yoosuf (Loka Aananadha) -> P46 Omar (Loka Sundhura) (CLM-0336, SRC-MRF-KINGS, grade B); excerpt: Kings list records parent edge P39 to P46.",
      "Supporting edge: sibling P39 Yoosuf (Loka Aananadha) <-> P40 Aboobakuru (Bavana Sooja) [half-brothers] (CLM-0432, SRC-MRF-KINGS, grade B); excerpt: Kings list marks P39 and P40 as half-brothers.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P39 Yoosuf (Loka Aananadha), P40 Aboobakuru (Bavana Sooja)) plus parent(P39 Yoosuf (Loka Aananadha), child) yields inferred aunt/uncle-line kin between P40 Aboobakuru (Bavana Sooja) and P46 Omar (Loka Sundhura).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P40 Aboobakuru (Bavana Sooja) and P46 Omar (Loka Sundhura) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P41", "P193", "cousins"), {
    summary: "P41 Hadi Hassan (Raadha Veeru) and P193 Princess Recca are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p193-p41-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P39 Yoosuf (Loka Aananadha) -> P41 Hadi Hassan (Raadha Veeru) (CLM-0596, SRC-ROYALARK-MALDIVES, grade B); excerpt: RoyalArk Maldives lineage reconstruction gives Yoosuf (P39) as father of Hadi Hassan (P41), which aligns with current canonical parent selection.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P193 Princess Recca (CLM-0337, SRC-MRF-KINGS, grade B); excerpt: Kings list and Hilaaly branch notes together support parent edge P40 to P193.",
      "Supporting edge: sibling P39 Yoosuf (Loka Aananadha) <-> P40 Aboobakuru (Bavana Sooja) [half-brothers] (CLM-0432, SRC-MRF-KINGS, grade B); excerpt: Kings list marks P39 and P40 as half-brothers.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P39 Yoosuf (Loka Aananadha) and P40 Aboobakuru (Bavana Sooja) are modeled as inferred cousin-line kin (P41 Hadi Hassan (Raadha Veeru) <-> P193 Princess Recca).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P41 Hadi Hassan (Raadha Veeru) and P193 Princess Recca as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P41", "P202", "cousins"), {
    summary: "P41 Hadi Hassan (Raadha Veeru) and P202 Kamba Dio are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p202-p41-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P39 Yoosuf (Loka Aananadha) -> P41 Hadi Hassan (Raadha Veeru) (CLM-0596, SRC-ROYALARK-MALDIVES, grade B); excerpt: RoyalArk Maldives lineage reconstruction gives Yoosuf (P39) as father of Hadi Hassan (P41), which aligns with current canonical parent selection.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P202 Kamba Dio (CLM-0597, SRC-MRF-HILAALY, grade B); excerpt: Direct parent relation recorded between Aboobakuru as parent of Kamba Dio.",
      "Supporting edge: sibling P39 Yoosuf (Loka Aananadha) <-> P40 Aboobakuru (Bavana Sooja) [half-brothers] (CLM-0432, SRC-MRF-KINGS, grade B); excerpt: Kings list marks P39 and P40 as half-brothers.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P39 Yoosuf (Loka Aananadha) and P40 Aboobakuru (Bavana Sooja) are modeled as inferred cousin-line kin (P41 Hadi Hassan (Raadha Veeru) <-> P202 Kamba Dio).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P41 Hadi Hassan (Raadha Veeru) and P202 Kamba Dio as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P41", "P45", "grandparent"), {
    summary: "P41 Hadi Hassan (Raadha Veeru) and P45 Hassan (Raadha Loka) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p41-p45-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P41 Hadi Hassan (Raadha Veeru) -> P44 Mohamed (Bavana Abarana) (CLM-0339, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P41 Hadi Hassan as parent of P44 Mohamed.",
      "Supporting edge: parent P44 Mohamed (Bavana Abarana) -> P45 Hassan (Raadha Loka) (CLM-0340, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P44 Mohamed as parent of P45 Hassan.",
      "Rule application (parent-of-parent-grandparent): with source -> P44 Mohamed (Bavana Abarana) and P44 Mohamed (Bavana Abarana) -> target parent links, P41 Hadi Hassan (Raadha Veeru) is modeled as inferred grandparent-line kin of P45 Hassan (Raadha Loka).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P41 Hadi Hassan (Raadha Veeru) and P45 Hassan (Raadha Loka) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P41", "P47", "aunt/uncle↔niece/nephew"), {
    summary: "P41 Hadi Hassan (Raadha Veeru) and P47 Hassan (Raadha Aanandha) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p41-p47-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P46 Omar (Loka Sundhura) -> P47 Hassan (Raadha Aanandha) (CLM-0341, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P47 Hassan.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P46 Omar (Loka Sundhura), P41 Hadi Hassan (Raadha Veeru)) plus parent(P46 Omar (Loka Sundhura), child) yields inferred aunt/uncle-line kin between P41 Hadi Hassan (Raadha Veeru) and P47 Hassan (Raadha Aanandha).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P41 Hadi Hassan (Raadha Veeru) and P47 Hassan (Raadha Aanandha) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P41", "P51", "aunt/uncle↔niece/nephew"), {
    summary: "P41 Hadi Hassan (Raadha Veeru) and P51 Kalu Mohamed (Dhammaru Bavana) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p41-p51-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P46 Omar (Loka Sundhura) -> P51 Kalu Mohamed (Dhammaru Bavana) (CLM-0343, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P51 Kalu Mohamed.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P46 Omar (Loka Sundhura), P41 Hadi Hassan (Raadha Veeru)) plus parent(P46 Omar (Loka Sundhura), child) yields inferred aunt/uncle-line kin between P41 Hadi Hassan (Raadha Veeru) and P51 Kalu Mohamed (Dhammaru Bavana).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P41 Hadi Hassan (Raadha Veeru) and P51 Kalu Mohamed (Dhammaru Bavana) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P41", "P52", "aunt/uncle↔niece/nephew"), {
    summary: "P41 Hadi Hassan (Raadha Veeru) and P52 Yoosuf (Veeru Aanandha) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p41-p52-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P46 Omar (Loka Sundhura) -> P52 Yoosuf (Veeru Aanandha) (CLM-0344, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P52 Yoosuf.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P46 Omar (Loka Sundhura), P41 Hadi Hassan (Raadha Veeru)) plus parent(P46 Omar (Loka Sundhura), child) yields inferred aunt/uncle-line kin between P41 Hadi Hassan (Raadha Veeru) and P52 Yoosuf (Veeru Aanandha).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P41 Hadi Hassan (Raadha Veeru) and P52 Yoosuf (Veeru Aanandha) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P44", "P47", "cousins"), {
    summary: "P44 Mohamed (Bavana Abarana) and P47 Hassan (Raadha Aanandha) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p44-p47-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P41 Hadi Hassan (Raadha Veeru) -> P44 Mohamed (Bavana Abarana) (CLM-0339, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P41 Hadi Hassan as parent of P44 Mohamed.",
      "Supporting edge: parent P46 Omar (Loka Sundhura) -> P47 Hassan (Raadha Aanandha) (CLM-0341, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P47 Hassan.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P41 Hadi Hassan (Raadha Veeru) and P46 Omar (Loka Sundhura) are modeled as inferred cousin-line kin (P44 Mohamed (Bavana Abarana) <-> P47 Hassan (Raadha Aanandha)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P44 Mohamed (Bavana Abarana) and P47 Hassan (Raadha Aanandha) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P44", "P51", "cousins"), {
    summary: "P44 Mohamed (Bavana Abarana) and P51 Kalu Mohamed (Dhammaru Bavana) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p44-p51-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P41 Hadi Hassan (Raadha Veeru) -> P44 Mohamed (Bavana Abarana) (CLM-0339, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P41 Hadi Hassan as parent of P44 Mohamed.",
      "Supporting edge: parent P46 Omar (Loka Sundhura) -> P51 Kalu Mohamed (Dhammaru Bavana) (CLM-0343, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P51 Kalu Mohamed.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P41 Hadi Hassan (Raadha Veeru) and P46 Omar (Loka Sundhura) are modeled as inferred cousin-line kin (P44 Mohamed (Bavana Abarana) <-> P51 Kalu Mohamed (Dhammaru Bavana)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P44 Mohamed (Bavana Abarana) and P51 Kalu Mohamed (Dhammaru Bavana) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P44", "P52", "cousins"), {
    summary: "P44 Mohamed (Bavana Abarana) and P52 Yoosuf (Veeru Aanandha) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p44-p52-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P41 Hadi Hassan (Raadha Veeru) -> P44 Mohamed (Bavana Abarana) (CLM-0339, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P41 Hadi Hassan as parent of P44 Mohamed.",
      "Supporting edge: parent P46 Omar (Loka Sundhura) -> P52 Yoosuf (Veeru Aanandha) (CLM-0344, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P52 Yoosuf.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P41 Hadi Hassan (Raadha Veeru) and P46 Omar (Loka Sundhura) are modeled as inferred cousin-line kin (P44 Mohamed (Bavana Abarana) <-> P52 Yoosuf (Veeru Aanandha)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P44 Mohamed (Bavana Abarana) and P52 Yoosuf (Veeru Aanandha) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P46", "P193", "cousins"), {
    summary: "P46 Omar (Loka Sundhura) and P193 Princess Recca are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p193-p46-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P39 Yoosuf (Loka Aananadha) -> P46 Omar (Loka Sundhura) (CLM-0336, SRC-MRF-KINGS, grade B); excerpt: Kings list records parent edge P39 to P46.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P193 Princess Recca (CLM-0337, SRC-MRF-KINGS, grade B); excerpt: Kings list and Hilaaly branch notes together support parent edge P40 to P193.",
      "Supporting edge: sibling P39 Yoosuf (Loka Aananadha) <-> P40 Aboobakuru (Bavana Sooja) [half-brothers] (CLM-0432, SRC-MRF-KINGS, grade B); excerpt: Kings list marks P39 and P40 as half-brothers.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P39 Yoosuf (Loka Aananadha) and P40 Aboobakuru (Bavana Sooja) are modeled as inferred cousin-line kin (P46 Omar (Loka Sundhura) <-> P193 Princess Recca).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P46 Omar (Loka Sundhura) and P193 Princess Recca as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P46", "P202", "cousins"), {
    summary: "P46 Omar (Loka Sundhura) and P202 Kamba Dio are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p202-p46-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P39 Yoosuf (Loka Aananadha) -> P46 Omar (Loka Sundhura) (CLM-0336, SRC-MRF-KINGS, grade B); excerpt: Kings list records parent edge P39 to P46.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P202 Kamba Dio (CLM-0597, SRC-MRF-HILAALY, grade B); excerpt: Direct parent relation recorded between Aboobakuru as parent of Kamba Dio.",
      "Supporting edge: sibling P39 Yoosuf (Loka Aananadha) <-> P40 Aboobakuru (Bavana Sooja) [half-brothers] (CLM-0432, SRC-MRF-KINGS, grade B); excerpt: Kings list marks P39 and P40 as half-brothers.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P39 Yoosuf (Loka Aananadha) and P40 Aboobakuru (Bavana Sooja) are modeled as inferred cousin-line kin (P46 Omar (Loka Sundhura) <-> P202 Kamba Dio).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P46 Omar (Loka Sundhura) and P202 Kamba Dio as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P46", "P208", "grandparent"), {
    summary: "P46 Omar (Loka Sundhura) and P208 Princess Aysha Rani Kilege are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p208-p46-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P46 Omar (Loka Sundhura) -> P51 Kalu Mohamed (Dhammaru Bavana) (CLM-0343, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P51 Kalu Mohamed.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P208 Princess Aysha Rani Kilege (CLM-0602, SRC-MRF-KINGS, grade B); excerpt: Direct parent relation recorded between Kalu Mohamed as parent of Princess Aysha Rani Kilege.",
      "Rule application (parent-of-parent-grandparent): with source -> P51 Kalu Mohamed (Dhammaru Bavana) and P51 Kalu Mohamed (Dhammaru Bavana) -> target parent links, P46 Omar (Loka Sundhura) is modeled as inferred grandparent-line kin of P208 Princess Aysha Rani Kilege.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P46 Omar (Loka Sundhura) and P208 Princess Aysha Rani Kilege as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P46", "P219", "grandparent"), {
    summary: "P46 Omar (Loka Sundhura) and P219 Umar Ma'afai Kilege are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p219-p46-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P46 Omar (Loka Sundhura) -> P51 Kalu Mohamed (Dhammaru Bavana) (CLM-0343, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P51 Kalu Mohamed.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P219 Umar Ma'afai Kilege (CLM-0603, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Kalu Mohamed as parent of Umar Ma'afai Kilege.",
      "Rule application (parent-of-parent-grandparent): with source -> P51 Kalu Mohamed (Dhammaru Bavana) and P51 Kalu Mohamed (Dhammaru Bavana) -> target parent links, P46 Omar (Loka Sundhura) is modeled as inferred grandparent-line kin of P219 Umar Ma'afai Kilege.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P46 Omar (Loka Sundhura) and P219 Umar Ma'afai Kilege as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P46", "P220", "grandparent"), {
    summary: "P46 Omar (Loka Sundhura) and P220 Ahmad Manikufa'anu Kalaminja are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p220-p46-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P46 Omar (Loka Sundhura) -> P51 Kalu Mohamed (Dhammaru Bavana) (CLM-0343, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P51 Kalu Mohamed.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P220 Ahmad Manikufa'anu Kalaminja (CLM-0604, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Kalu Mohamed as parent of Ahmad Manikufa'anu Kalaminja.",
      "Rule application (parent-of-parent-grandparent): with source -> P51 Kalu Mohamed (Dhammaru Bavana) and P51 Kalu Mohamed (Dhammaru Bavana) -> target parent links, P46 Omar (Loka Sundhura) is modeled as inferred grandparent-line kin of P220 Ahmad Manikufa'anu Kalaminja.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P46 Omar (Loka Sundhura) and P220 Ahmad Manikufa'anu Kalaminja as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P46", "P44", "aunt/uncle↔niece/nephew"), {
    summary: "P46 Omar (Loka Sundhura) and P44 Mohamed (Bavana Abarana) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p44-p46-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P41 Hadi Hassan (Raadha Veeru) -> P44 Mohamed (Bavana Abarana) (CLM-0339, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P41 Hadi Hassan as parent of P44 Mohamed.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P41 Hadi Hassan (Raadha Veeru), P46 Omar (Loka Sundhura)) plus parent(P41 Hadi Hassan (Raadha Veeru), child) yields inferred aunt/uncle-line kin between P46 Omar (Loka Sundhura) and P44 Mohamed (Bavana Abarana).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P46 Omar (Loka Sundhura) and P44 Mohamed (Bavana Abarana) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P46", "P55", "grandparent"), {
    summary: "P46 Omar (Loka Sundhura) and P55 Hassan (Singa Veeru) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p46-p55-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P46 Omar (Loka Sundhura) -> P52 Yoosuf (Veeru Aanandha) (CLM-0344, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P52 Yoosuf.",
      "Supporting edge: parent P52 Yoosuf (Veeru Aanandha) -> P55 Hassan (Singa Veeru) (CLM-0346, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P52 Yoosuf as parent of P55 Hassan.",
      "Rule application (parent-of-parent-grandparent): with source -> P52 Yoosuf (Veeru Aanandha) and P52 Yoosuf (Veeru Aanandha) -> target parent links, P46 Omar (Loka Sundhura) is modeled as inferred grandparent-line kin of P55 Hassan (Singa Veeru).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P46 Omar (Loka Sundhura) and P55 Hassan (Singa Veeru) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P46", "P59", "grandparent"), {
    summary: "P46 Omar (Loka Sundhura) and P59 Hassan of Shiraz (Ram Mani Loka) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p46-p59-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P46 Omar (Loka Sundhura) -> P51 Kalu Mohamed (Dhammaru Bavana) (CLM-0343, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P51 Kalu Mohamed.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P59 Hassan of Shiraz (Ram Mani Loka) (CLM-0345, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P51 Kalu Mohamed as parent of P59 Hassan of Shiraz.",
      "Rule application (parent-of-parent-grandparent): with source -> P51 Kalu Mohamed (Dhammaru Bavana) and P51 Kalu Mohamed (Dhammaru Bavana) -> target parent links, P46 Omar (Loka Sundhura) is modeled as inferred grandparent-line kin of P59 Hassan of Shiraz (Ram Mani Loka).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P46 Omar (Loka Sundhura) and P59 Hassan of Shiraz (Ram Mani Loka) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P47", "P208", "aunt/uncle↔niece/nephew"), {
    summary: "P47 Hassan (Raadha Aanandha) and P208 Princess Aysha Rani Kilege are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p208-p47-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P208 Princess Aysha Rani Kilege (CLM-0602, SRC-MRF-KINGS, grade B); excerpt: Direct parent relation recorded between Kalu Mohamed as parent of Princess Aysha Rani Kilege.",
      "Supporting edge: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P47 Hassan (Raadha Aanandha) [half-brothers] (CLM-0639, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct sibling (half-brothers) relation recorded between Kalu Mohamed and Hassan.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P51 Kalu Mohamed (Dhammaru Bavana), P47 Hassan (Raadha Aanandha)) plus parent(P51 Kalu Mohamed (Dhammaru Bavana), child) yields inferred aunt/uncle-line kin between P47 Hassan (Raadha Aanandha) and P208 Princess Aysha Rani Kilege.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P47 Hassan (Raadha Aanandha) and P208 Princess Aysha Rani Kilege as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P47", "P219", "aunt/uncle↔niece/nephew"), {
    summary: "P47 Hassan (Raadha Aanandha) and P219 Umar Ma'afai Kilege are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p219-p47-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P219 Umar Ma'afai Kilege (CLM-0603, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Kalu Mohamed as parent of Umar Ma'afai Kilege.",
      "Supporting edge: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P47 Hassan (Raadha Aanandha) [half-brothers] (CLM-0639, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct sibling (half-brothers) relation recorded between Kalu Mohamed and Hassan.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P51 Kalu Mohamed (Dhammaru Bavana), P47 Hassan (Raadha Aanandha)) plus parent(P51 Kalu Mohamed (Dhammaru Bavana), child) yields inferred aunt/uncle-line kin between P47 Hassan (Raadha Aanandha) and P219 Umar Ma'afai Kilege.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P47 Hassan (Raadha Aanandha) and P219 Umar Ma'afai Kilege as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P47", "P220", "aunt/uncle↔niece/nephew"), {
    summary: "P47 Hassan (Raadha Aanandha) and P220 Ahmad Manikufa'anu Kalaminja are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p220-p47-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P220 Ahmad Manikufa'anu Kalaminja (CLM-0604, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Kalu Mohamed as parent of Ahmad Manikufa'anu Kalaminja.",
      "Supporting edge: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P47 Hassan (Raadha Aanandha) [half-brothers] (CLM-0639, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct sibling (half-brothers) relation recorded between Kalu Mohamed and Hassan.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P51 Kalu Mohamed (Dhammaru Bavana), P47 Hassan (Raadha Aanandha)) plus parent(P51 Kalu Mohamed (Dhammaru Bavana), child) yields inferred aunt/uncle-line kin between P47 Hassan (Raadha Aanandha) and P220 Ahmad Manikufa'anu Kalaminja.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P47 Hassan (Raadha Aanandha) and P220 Ahmad Manikufa'anu Kalaminja as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P47", "P55", "aunt/uncle↔niece/nephew"), {
    summary: "P47 Hassan (Raadha Aanandha) and P55 Hassan (Singa Veeru) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p47-p55-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P52 Yoosuf (Veeru Aanandha) -> P55 Hassan (Singa Veeru) (CLM-0346, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P52 Yoosuf as parent of P55 Hassan.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P52 Yoosuf (Veeru Aanandha), P47 Hassan (Raadha Aanandha)) plus parent(P52 Yoosuf (Veeru Aanandha), child) yields inferred aunt/uncle-line kin between P47 Hassan (Raadha Aanandha) and P55 Hassan (Singa Veeru).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P47 Hassan (Raadha Aanandha) and P55 Hassan (Singa Veeru) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P47", "P59", "aunt/uncle↔niece/nephew"), {
    summary: "P47 Hassan (Raadha Aanandha) and P59 Hassan of Shiraz (Ram Mani Loka) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p47-p59-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P59 Hassan of Shiraz (Ram Mani Loka) (CLM-0345, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P51 Kalu Mohamed as parent of P59 Hassan of Shiraz.",
      "Supporting edge: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P47 Hassan (Raadha Aanandha) [half-brothers] (CLM-0639, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct sibling (half-brothers) relation recorded between Kalu Mohamed and Hassan.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P51 Kalu Mohamed (Dhammaru Bavana), P47 Hassan (Raadha Aanandha)) plus parent(P51 Kalu Mohamed (Dhammaru Bavana), child) yields inferred aunt/uncle-line kin between P47 Hassan (Raadha Aanandha) and P59 Hassan of Shiraz (Ram Mani Loka).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P47 Hassan (Raadha Aanandha) and P59 Hassan of Shiraz (Ram Mani Loka) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P49", "P194", "cousins"), {
    summary: "P49 Sheikh Hassan (Raadha Fanaveeru) and P194 Burecca are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p194-p49-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P202 Kamba Dio -> P49 Sheikh Hassan (Raadha Fanaveeru) (CLM-0572, SRC-MRF-HILAALY, grade B); excerpt: Direct parent relation recorded between Kamba Dio as parent of Sheikh Hassan.",
      "Supporting edge: parent P193 Princess Recca -> P194 Burecca (CLM-0327, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P193 Princess Recca as parent of P194 Burecca.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P202 Kamba Dio and P193 Princess Recca are modeled as inferred cousin-line kin (P49 Sheikh Hassan (Raadha Fanaveeru) <-> P194 Burecca).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P49 Sheikh Hassan (Raadha Fanaveeru) and P194 Burecca as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P49", "P196", "cousins"), {
    summary: "P49 Sheikh Hassan (Raadha Fanaveeru) and P196 Reccy are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p196-p49-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P202 Kamba Dio -> P49 Sheikh Hassan (Raadha Fanaveeru) (CLM-0572, SRC-MRF-HILAALY, grade B); excerpt: Direct parent relation recorded between Kamba Dio as parent of Sheikh Hassan.",
      "Supporting edge: parent P193 Princess Recca -> P196 Reccy (CLM-0328, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P193 Princess Recca as parent of P196 Reccy.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P202 Kamba Dio and P193 Princess Recca are modeled as inferred cousin-line kin (P49 Sheikh Hassan (Raadha Fanaveeru) <-> P196 Reccy).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P49 Sheikh Hassan (Raadha Fanaveeru) and P196 Reccy as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P49", "P57", "cousins"), {
    summary: "P49 Sheikh Hassan (Raadha Fanaveeru) and P57 Ali (Aanandha) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p49-p57-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P202 Kamba Dio -> P49 Sheikh Hassan (Raadha Fanaveeru) (CLM-0572, SRC-MRF-HILAALY, grade B); excerpt: Direct parent relation recorded between Kamba Dio as parent of Sheikh Hassan.",
      "Supporting edge: parent P193 Princess Recca -> P57 Ali (Aanandha) (CLM-0329, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P193 Princess Recca as parent of P57 Ali.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P202 Kamba Dio and P193 Princess Recca are modeled as inferred cousin-line kin (P49 Sheikh Hassan (Raadha Fanaveeru) <-> P57 Ali (Aanandha)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P49 Sheikh Hassan (Raadha Fanaveeru) and P57 Ali (Aanandha) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P51", "P50", "aunt/uncle↔niece/nephew"), {
    summary: "P51 Kalu Mohamed (Dhammaru Bavana) and P50 Ibrahim (Bavana Furasuddha) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p50-p51-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P47 Hassan (Raadha Aanandha) -> P50 Ibrahim (Bavana Furasuddha) (CLM-0601, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Hassan as parent of Ibrahim.",
      "Supporting edge: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P47 Hassan (Raadha Aanandha) [half-brothers] (CLM-0639, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct sibling (half-brothers) relation recorded between Kalu Mohamed and Hassan.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P47 Hassan (Raadha Aanandha), P51 Kalu Mohamed (Dhammaru Bavana)) plus parent(P47 Hassan (Raadha Aanandha), child) yields inferred aunt/uncle-line kin between P51 Kalu Mohamed (Dhammaru Bavana) and P50 Ibrahim (Bavana Furasuddha).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P51 Kalu Mohamed (Dhammaru Bavana) and P50 Ibrahim (Bavana Furasuddha) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P51", "P55", "aunt/uncle↔niece/nephew"), {
    summary: "P51 Kalu Mohamed (Dhammaru Bavana) and P55 Hassan (Singa Veeru) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p51-p55-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P52 Yoosuf (Veeru Aanandha) -> P55 Hassan (Singa Veeru) (CLM-0346, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P52 Yoosuf as parent of P55 Hassan.",
      "Supporting edge: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P52 Yoosuf (Veeru Aanandha) [brothers] (CLM-0441, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P51 Kalu Mohamed and P52 Yoosuf as siblings (brothers).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P52 Yoosuf (Veeru Aanandha), P51 Kalu Mohamed (Dhammaru Bavana)) plus parent(P52 Yoosuf (Veeru Aanandha), child) yields inferred aunt/uncle-line kin between P51 Kalu Mohamed (Dhammaru Bavana) and P55 Hassan (Singa Veeru).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P51 Kalu Mohamed (Dhammaru Bavana) and P55 Hassan (Singa Veeru) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P52", "P208", "aunt/uncle↔niece/nephew"), {
    summary: "P52 Yoosuf (Veeru Aanandha) and P208 Princess Aysha Rani Kilege are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p208-p52-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P208 Princess Aysha Rani Kilege (CLM-0602, SRC-MRF-KINGS, grade B); excerpt: Direct parent relation recorded between Kalu Mohamed as parent of Princess Aysha Rani Kilege.",
      "Supporting edge: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P52 Yoosuf (Veeru Aanandha) [brothers] (CLM-0441, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P51 Kalu Mohamed and P52 Yoosuf as siblings (brothers).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P51 Kalu Mohamed (Dhammaru Bavana), P52 Yoosuf (Veeru Aanandha)) plus parent(P51 Kalu Mohamed (Dhammaru Bavana), child) yields inferred aunt/uncle-line kin between P52 Yoosuf (Veeru Aanandha) and P208 Princess Aysha Rani Kilege.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P52 Yoosuf (Veeru Aanandha) and P208 Princess Aysha Rani Kilege as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P52", "P219", "aunt/uncle↔niece/nephew"), {
    summary: "P52 Yoosuf (Veeru Aanandha) and P219 Umar Ma'afai Kilege are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p219-p52-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P219 Umar Ma'afai Kilege (CLM-0603, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Kalu Mohamed as parent of Umar Ma'afai Kilege.",
      "Supporting edge: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P52 Yoosuf (Veeru Aanandha) [brothers] (CLM-0441, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P51 Kalu Mohamed and P52 Yoosuf as siblings (brothers).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P51 Kalu Mohamed (Dhammaru Bavana), P52 Yoosuf (Veeru Aanandha)) plus parent(P51 Kalu Mohamed (Dhammaru Bavana), child) yields inferred aunt/uncle-line kin between P52 Yoosuf (Veeru Aanandha) and P219 Umar Ma'afai Kilege.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P52 Yoosuf (Veeru Aanandha) and P219 Umar Ma'afai Kilege as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P52", "P220", "aunt/uncle↔niece/nephew"), {
    summary: "P52 Yoosuf (Veeru Aanandha) and P220 Ahmad Manikufa'anu Kalaminja are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p220-p52-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P220 Ahmad Manikufa'anu Kalaminja (CLM-0604, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Kalu Mohamed as parent of Ahmad Manikufa'anu Kalaminja.",
      "Supporting edge: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P52 Yoosuf (Veeru Aanandha) [brothers] (CLM-0441, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P51 Kalu Mohamed and P52 Yoosuf as siblings (brothers).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P51 Kalu Mohamed (Dhammaru Bavana), P52 Yoosuf (Veeru Aanandha)) plus parent(P51 Kalu Mohamed (Dhammaru Bavana), child) yields inferred aunt/uncle-line kin between P52 Yoosuf (Veeru Aanandha) and P220 Ahmad Manikufa'anu Kalaminja.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P52 Yoosuf (Veeru Aanandha) and P220 Ahmad Manikufa'anu Kalaminja as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P52", "P50", "aunt/uncle↔niece/nephew"), {
    summary: "P52 Yoosuf (Veeru Aanandha) and P50 Ibrahim (Bavana Furasuddha) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p50-p52-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P47 Hassan (Raadha Aanandha) -> P50 Ibrahim (Bavana Furasuddha) (CLM-0601, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Hassan as parent of Ibrahim.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P47 Hassan (Raadha Aanandha), P52 Yoosuf (Veeru Aanandha)) plus parent(P47 Hassan (Raadha Aanandha), child) yields inferred aunt/uncle-line kin between P52 Yoosuf (Veeru Aanandha) and P50 Ibrahim (Bavana Furasuddha).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P52 Yoosuf (Veeru Aanandha) and P50 Ibrahim (Bavana Furasuddha) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P52", "P59", "aunt/uncle↔niece/nephew"), {
    summary: "P52 Yoosuf (Veeru Aanandha) and P59 Hassan of Shiraz (Ram Mani Loka) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p52-p59-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P59 Hassan of Shiraz (Ram Mani Loka) (CLM-0345, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P51 Kalu Mohamed as parent of P59 Hassan of Shiraz.",
      "Supporting edge: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P52 Yoosuf (Veeru Aanandha) [brothers] (CLM-0441, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P51 Kalu Mohamed and P52 Yoosuf as siblings (brothers).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P51 Kalu Mohamed (Dhammaru Bavana), P52 Yoosuf (Veeru Aanandha)) plus parent(P51 Kalu Mohamed (Dhammaru Bavana), child) yields inferred aunt/uncle-line kin between P52 Yoosuf (Veeru Aanandha) and P59 Hassan of Shiraz (Ram Mani Loka).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P52 Yoosuf (Veeru Aanandha) and P59 Hassan of Shiraz (Ram Mani Loka) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P55", "P50", "cousins"), {
    summary: "P55 Hassan (Singa Veeru) and P50 Ibrahim (Bavana Furasuddha) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p50-p55-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P52 Yoosuf (Veeru Aanandha) -> P55 Hassan (Singa Veeru) (CLM-0346, SRC-MRF-KINGS, grade B); excerpt: Direct parent relation recorded in the supporting source lane.",
      "Supporting edge: parent P47 Hassan (Raadha Aanandha) -> P50 Ibrahim (Bavana Furasuddha) (CLM-0601, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded in the supporting source lane.",
      "Supporting edge: sibling P47 Hassan (Raadha Aanandha) <-> P52 Yoosuf (Veeru Aanandha) [brothers] (CLM-0435, SRC-MRF-KINGS, grade C inferred); excerpt: Sibling relation for the two parents recorded in the supporting source lane.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P52 Yoosuf (Veeru Aanandha) and P47 Hassan (Raadha Aanandha) are modeled as inferred cousin-line kin (P55 Hassan (Singa Veeru) <-> P50 Ibrahim (Bavana Furasuddha)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P55 Hassan (Singa Veeru) and P50 Ibrahim (Bavana Furasuddha) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P59", "P50", "cousins"), {
    summary: "P59 Hassan of Shiraz (Ram Mani Loka) and P50 Ibrahim (Bavana Furasuddha) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p50-p59-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P59 Hassan of Shiraz (Ram Mani Loka) (CLM-0345, SRC-MRF-KINGS, grade B); excerpt: Direct parent relation recorded in the supporting source lane.",
      "Supporting edge: parent P47 Hassan (Raadha Aanandha) -> P50 Ibrahim (Bavana Furasuddha) (CLM-0601, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded in the supporting source lane.",
      "Supporting edge: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P47 Hassan (Raadha Aanandha) [half-brothers] (CLM-0639, SRC-ROYALARK-MALDIVES, grade B); excerpt: Sibling relation for the two parents recorded in the supporting source lane.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P51 Kalu Mohamed (Dhammaru Bavana) and P47 Hassan (Raadha Aanandha) are modeled as inferred cousin-line kin (P59 Hassan of Shiraz (Ram Mani Loka) <-> P50 Ibrahim (Bavana Furasuddha)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P59 Hassan of Shiraz (Ram Mani Loka) and P50 Ibrahim (Bavana Furasuddha) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P59", "P55", "cousins"), {
    summary: "P59 Hassan of Shiraz (Ram Mani Loka) and P55 Hassan (Singa Veeru) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p55-p59-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P59 Hassan of Shiraz (Ram Mani Loka) (CLM-0345, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P51 Kalu Mohamed as parent of P59 Hassan of Shiraz.",
      "Supporting edge: parent P52 Yoosuf (Veeru Aanandha) -> P55 Hassan (Singa Veeru) (CLM-0346, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P52 Yoosuf as parent of P55 Hassan.",
      "Supporting edge: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P52 Yoosuf (Veeru Aanandha) [brothers] (CLM-0441, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P51 Kalu Mohamed and P52 Yoosuf as siblings (brothers).",
      "Rule application (children-of-siblings-cousin): children of sibling parents P51 Kalu Mohamed (Dhammaru Bavana) and P52 Yoosuf (Veeru Aanandha) are modeled as inferred cousin-line kin (P59 Hassan of Shiraz (Ram Mani Loka) <-> P55 Hassan (Singa Veeru)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P59 Hassan of Shiraz (Ram Mani Loka) and P55 Hassan (Singa Veeru) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P59", "P60", "aunt/uncle↔niece/nephew"), {
    summary: "P59 Hassan of Shiraz (Ram Mani Loka) and P60 Mohamed (Singa Bavana) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p59-p60-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P219 Umar Ma'afai Kilege -> P60 Mohamed (Singa Bavana) (CLM-0587, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Umar Ma'afai Kilege as parent of Mohamed.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P219 Umar Ma'afai Kilege, P59 Hassan of Shiraz (Ram Mani Loka)) plus parent(P219 Umar Ma'afai Kilege, child) yields inferred aunt/uncle-line kin between P59 Hassan of Shiraz (Ram Mani Loka) and P60 Mohamed (Singa Bavana).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P59 Hassan of Shiraz (Ram Mani Loka) and P60 Mohamed (Singa Bavana) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P59", "P61", "aunt/uncle↔niece/nephew"), {
    summary: "P59 Hassan of Shiraz (Ram Mani Loka) and P61 Hassan IX / Dom Manoel (Dhirikusa Loka) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p59-p61-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P220 Ahmad Manikufa'anu Kalaminja -> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) (CLM-0588, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Ahmad Manikufa'anu Kalaminja as parent of Hassan IX / Dom Manoel.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P220 Ahmad Manikufa'anu Kalaminja, P59 Hassan of Shiraz (Ram Mani Loka)) plus parent(P220 Ahmad Manikufa'anu Kalaminja, child) yields inferred aunt/uncle-line kin between P59 Hassan of Shiraz (Ram Mani Loka) and P61 Hassan IX / Dom Manoel (Dhirikusa Loka).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P59 Hassan of Shiraz (Ram Mani Loka) and P61 Hassan IX / Dom Manoel (Dhirikusa Loka) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P5", "P13", "aunt/uncle↔niece/nephew"), {
    summary: "P5 Dhinei (Fennaadheeththa) and P13 Audha (Areedha Suvara) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p13-p5-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P7 Wadi (Dhagathaa Suvara) -> P13 Audha (Areedha Suvara) (CLM-0352, SRC-MRF-KINGS, grade B); excerpt: Kings list sequence indicates P7 as father of P13.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P7 Wadi (Dhagathaa Suvara), P5 Dhinei (Fennaadheeththa)) plus parent(P7 Wadi (Dhagathaa Suvara), child) yields inferred aunt/uncle-line kin between P5 Dhinei (Fennaadheeththa) and P13 Audha (Areedha Suvara).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P5 Dhinei (Fennaadheeththa) and P13 Audha (Areedha Suvara) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P60", "P209", "aunt/uncle↔niece/nephew"), {
    summary: "P60 Mohamed (Singa Bavana) and P209 Dom Francisco de Malvidas are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p209-p60-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P209 Dom Francisco de Malvidas (CLM-0605, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry under Dom Manoel lists Dom Francisco de Malvidas among the children of Dom Manoel and Dona Leonor de Ataide.",
      "Supporting edge: sibling P60 Mohamed (Singa Bavana) <-> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) [half-brothers (maternal, same mother Golavehi Aisha Rani Kilege)] (CLM-0640, SRC-ROYALARK-MALDIVES, grade B); excerpt: RoyalArk and Kings-list lineage context support P60 and P61 as maternal half-brothers via shared mother Golavehi Aisha Rani Kilege and different fa...",
      "Rule application (parent-sibling-aunt-uncle): sibling(P61 Hassan IX / Dom Manoel (Dhirikusa Loka), P60 Mohamed (Singa Bavana)) plus parent(P61 Hassan IX / Dom Manoel (Dhirikusa Loka), child) yields inferred aunt/uncle-line kin between P60 Mohamed (Singa Bavana) and P209 Dom Francisco de Malvidas.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P60 Mohamed (Singa Bavana) and P209 Dom Francisco de Malvidas as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P60", "P210", "aunt/uncle↔niece/nephew"), {
    summary: "P60 Mohamed (Singa Bavana) and P210 Dom Pedro de Malvidas are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p210-p60-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P210 Dom Pedro de Malvidas (CLM-0606, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry under Dom Manoel lists Dom Pedro de Malvidas among the children of Dom Manoel and Dona Leonor de Ataide.",
      "Supporting edge: sibling P60 Mohamed (Singa Bavana) <-> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) [half-brothers (maternal, same mother Golavehi Aisha Rani Kilege)] (CLM-0640, SRC-ROYALARK-MALDIVES, grade B); excerpt: RoyalArk and Kings-list lineage context support P60 and P61 as maternal half-brothers via shared mother Golavehi Aisha Rani Kilege and different fa...",
      "Rule application (parent-sibling-aunt-uncle): sibling(P61 Hassan IX / Dom Manoel (Dhirikusa Loka), P60 Mohamed (Singa Bavana)) plus parent(P61 Hassan IX / Dom Manoel (Dhirikusa Loka), child) yields inferred aunt/uncle-line kin between P60 Mohamed (Singa Bavana) and P210 Dom Pedro de Malvidas.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P60 Mohamed (Singa Bavana) and P210 Dom Pedro de Malvidas as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P60", "P211", "aunt/uncle↔niece/nephew"), {
    summary: "P60 Mohamed (Singa Bavana) and P211 Dona Leonor de Malvidas are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p211-p60-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P211 Dona Leonor de Malvidas (CLM-0607, SRC-ROYALARK-M16, grade B); excerpt: RoyalArk lineage entry under Dom Manoel lists Dona Leonor de Malvidas as a daughter in the same Dom Manoel and Dona Leonor de Ataide branch.",
      "Supporting edge: sibling P60 Mohamed (Singa Bavana) <-> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) [half-brothers (maternal, same mother Golavehi Aisha Rani Kilege)] (CLM-0640, SRC-ROYALARK-MALDIVES, grade B); excerpt: RoyalArk and Kings-list lineage context support P60 and P61 as maternal half-brothers via shared mother Golavehi Aisha Rani Kilege and different fa...",
      "Rule application (parent-sibling-aunt-uncle): sibling(P61 Hassan IX / Dom Manoel (Dhirikusa Loka), P60 Mohamed (Singa Bavana)) plus parent(P61 Hassan IX / Dom Manoel (Dhirikusa Loka), child) yields inferred aunt/uncle-line kin between P60 Mohamed (Singa Bavana) and P211 Dona Leonor de Malvidas.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P60 Mohamed (Singa Bavana) and P211 Dona Leonor de Malvidas as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P60", "P212", "aunt/uncle↔niece/nephew"), {
    summary: "P60 Mohamed (Singa Bavana) and P212 Dona Catarina de Malvidas are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p212-p60-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P212 Dona Catarina de Malvidas (CLM-0608, SRC-ROYALARK-M16, grade B); excerpt: RoyalArk lineage entry under Dom Manoel lists Dona Catarina de Malvidas as a daughter in the same Dom Manoel and Dona Leonor de Ataide branch.",
      "Supporting edge: sibling P60 Mohamed (Singa Bavana) <-> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) [half-brothers (maternal, same mother Golavehi Aisha Rani Kilege)] (CLM-0640, SRC-ROYALARK-MALDIVES, grade B); excerpt: RoyalArk and Kings-list lineage context support P60 and P61 as maternal half-brothers via shared mother Golavehi Aisha Rani Kilege and different fa...",
      "Rule application (parent-sibling-aunt-uncle): sibling(P61 Hassan IX / Dom Manoel (Dhirikusa Loka), P60 Mohamed (Singa Bavana)) plus parent(P61 Hassan IX / Dom Manoel (Dhirikusa Loka), child) yields inferred aunt/uncle-line kin between P60 Mohamed (Singa Bavana) and P212 Dona Catarina de Malvidas.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P60 Mohamed (Singa Bavana) and P212 Dona Catarina de Malvidas as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P60", "P66", "aunt/uncle↔niece/nephew"), {
    summary: "P60 Mohamed (Singa Bavana) and P66 Joao’ (Keerithi Maha Radun) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p60-p66-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P66 Joao’ (Keerithi Maha Radun) (CLM-0347, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P61 Hassan IX / Dom Manoel as parent of P66 Joao’.",
      "Supporting edge: sibling P60 Mohamed (Singa Bavana) <-> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) [half-brothers (maternal, same mother Golavehi Aisha Rani Kilege)] (CLM-0640, SRC-ROYALARK-MALDIVES, grade B); excerpt: RoyalArk and Kings-list lineage context support P60 and P61 as maternal half-brothers via shared mother Golavehi Aisha Rani Kilege and different fa...",
      "Rule application (parent-sibling-aunt-uncle): sibling(P61 Hassan IX / Dom Manoel (Dhirikusa Loka), P60 Mohamed (Singa Bavana)) plus parent(P61 Hassan IX / Dom Manoel (Dhirikusa Loka), child) yields inferred aunt/uncle-line kin between P60 Mohamed (Singa Bavana) and P66 Joao’ (Keerithi Maha Radun).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P60 Mohamed (Singa Bavana) and P66 Joao’ (Keerithi Maha Radun) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P61", "P213", "grandparent"), {
    summary: "P61 Hassan IX / Dom Manoel (Dhirikusa Loka) and P213 Infanta Dona Ines de Malvidas are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p213-p61-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P66 Joao’ (Keerithi Maha Radun) (CLM-0347, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P61 Hassan IX / Dom Manoel as parent of P66 Joao’.",
      "Supporting edge: parent P66 Joao’ (Keerithi Maha Radun) -> P213 Infanta Dona Ines de Malvidas (CLM-0609, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry under Dom Joao lists Infanta Dona Ines de Malvidas as daughter of Dom Joao and Dona Francisca de Vasconcelos.",
      "Rule application (parent-of-parent-grandparent): with source -> P66 Joao’ (Keerithi Maha Radun) and P66 Joao’ (Keerithi Maha Radun) -> target parent links, P61 Hassan IX / Dom Manoel (Dhirikusa Loka) is modeled as inferred grandparent-line kin of P213 Infanta Dona Ines de Malvidas.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P61 Hassan IX / Dom Manoel (Dhirikusa Loka) and P213 Infanta Dona Ines de Malvidas as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P61", "P67", "grandparent"), {
    summary: "P61 Hassan IX / Dom Manoel (Dhirikusa Loka) and P67 Philippe’ (Keerithi Maha Radun) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p61-p67-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P66 Joao’ (Keerithi Maha Radun) (CLM-0347, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P61 Hassan IX / Dom Manoel as parent of P66 Joao’.",
      "Supporting edge: parent P66 Joao’ (Keerithi Maha Radun) -> P67 Philippe’ (Keerithi Maha Radun) (CLM-0348, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P66 Joao’ as parent of P67 Philippe’.",
      "Rule application (parent-of-parent-grandparent): with source -> P66 Joao’ (Keerithi Maha Radun) and P66 Joao’ (Keerithi Maha Radun) -> target parent links, P61 Hassan IX / Dom Manoel (Dhirikusa Loka) is modeled as inferred grandparent-line kin of P67 Philippe’ (Keerithi Maha Radun).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P61 Hassan IX / Dom Manoel (Dhirikusa Loka) and P67 Philippe’ (Keerithi Maha Radun) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P66", "P97", "grandparent"), {
    summary: "P66 Joao’ (Keerithi Maha Radun) and P97 Dom Luis de Sousa are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p66-p97-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P66 Joao’ (Keerithi Maha Radun) -> P213 Infanta Dona Ines de Malvidas (CLM-0609, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry under Dom Joao lists Infanta Dona Ines de Malvidas as daughter of Dom Joao and Dona Francisca de Vasconcelos.",
      "Supporting edge: parent P213 Infanta Dona Ines de Malvidas -> P97 Dom Luis de Sousa (CLM-0580, SRC-ROYALARK-M16, grade A); excerpt: Direct parent relation recorded between Infanta Dona Ines de Malvidas as parent of Dom Luis de Sousa.",
      "Rule application (parent-of-parent-grandparent): with source -> P213 Infanta Dona Ines de Malvidas and P213 Infanta Dona Ines de Malvidas -> target parent links, P66 Joao’ (Keerithi Maha Radun) is modeled as inferred grandparent-line kin of P97 Dom Luis de Sousa.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P66 Joao’ (Keerithi Maha Radun) and P97 Dom Luis de Sousa as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P67", "P97", "aunt/uncle↔niece/nephew"), {
    summary: "P67 Philippe’ (Keerithi Maha Radun) and P97 Dom Luis de Sousa are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p67-p97-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P213 Infanta Dona Ines de Malvidas -> P97 Dom Luis de Sousa (CLM-0580, SRC-ROYALARK-M16, grade A); excerpt: Direct parent relation recorded between Infanta Dona Ines de Malvidas as parent of Dom Luis de Sousa.",
      "Supporting edge: sibling P213 Infanta Dona Ines de Malvidas <-> P67 Philippe’ (Keerithi Maha Radun) [siblings (same parents: Dom Joao + Dona Francisca)] (CLM-0632, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry for Dom Joao and Dona Francisca lists both Dom Felipe (P67) and Infanta Dona Ines (P213), supporting a direct sibling relation.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P213 Infanta Dona Ines de Malvidas, P67 Philippe’ (Keerithi Maha Radun)) plus parent(P213 Infanta Dona Ines de Malvidas, child) yields inferred aunt/uncle-line kin between P67 Philippe’ (Keerithi Maha Radun) and P97 Dom Luis de Sousa.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P67 Philippe’ (Keerithi Maha Radun) and P97 Dom Luis de Sousa as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P68", "P70", "grandparent"), {
    summary: "P68 Mohamed Imaduddine (Kula Sundhura Katthiri Bavana) and P70 Kuda Mohamed (Maniranna Loka) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p68-p70-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P68 Mohamed Imaduddine (Kula Sundhura Katthiri Bavana) -> P69 Iskander Ibrahim (Kula Ran Meeba Katthiri) (CLM-0350, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P68 Mohamed Imaduddine as parent of P69 Iskander Ibrahim.",
      "Supporting edge: parent P69 Iskander Ibrahim (Kula Ran Meeba Katthiri) -> P70 Kuda Mohamed (Maniranna Loka) (CLM-0351, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P69 Iskander Ibrahim as parent of P70 Kuda Mohamed.",
      "Rule application (parent-of-parent-grandparent): with source -> P69 Iskander Ibrahim (Kula Ran Meeba Katthiri) and P69 Iskander Ibrahim (Kula Ran Meeba Katthiri) -> target parent links, P68 Mohamed Imaduddine (Kula Sundhura Katthiri Bavana) is modeled as inferred grandparent-line kin of P70 Kuda Mohamed (Maniranna Loka).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P68 Mohamed Imaduddine (Kula Sundhura Katthiri Bavana) and P70 Kuda Mohamed (Maniranna Loka) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P6", "P13", "aunt/uncle↔niece/nephew"), {
    summary: "P6 Dhilhel (Dhagathaa Abarana) and P13 Audha (Areedha Suvara) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p13-p6-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P7 Wadi (Dhagathaa Suvara) -> P13 Audha (Areedha Suvara) (CLM-0352, SRC-MRF-KINGS, grade B); excerpt: Kings list sequence indicates P7 as father of P13.",
      "Supporting edge: sibling P6 Dhilhel (Dhagathaa Abarana) <-> P7 Wadi (Dhagathaa Suvara) [brothers] (CLM-0442, SRC-MRF-KINGS, grade B); excerpt: Kings list explicitly notes P6 and P7 as brothers.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P7 Wadi (Dhagathaa Suvara), P6 Dhilhel (Dhagathaa Abarana)) plus parent(P7 Wadi (Dhagathaa Suvara), child) yields inferred aunt/uncle-line kin between P6 Dhilhel (Dhagathaa Abarana) and P13 Audha (Areedha Suvara).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P6 Dhilhel (Dhagathaa Abarana) and P13 Audha (Areedha Suvara) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P77", "P81", "grandparent"), {
    summary: "P77 Mohamed Imaduddine (Kula Sundhura Siyaaaka) and P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p77-p81-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P77 Mohamed Imaduddine (Kula Sundhura Siyaaaka) -> P78 Ibrahim Iskander (Rannava Loka) (CLM-0354, SRC-WIKI-MONARCHS, grade B); excerpt: List of Maldivian monarchs family/genealogy content lists P77 Mohamed Imaduddine as parent of P78 Ibrahim Iskander.",
      "Supporting edge: parent P78 Ibrahim Iskander (Rannava Loka) -> P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) (CLM-0356, SRC-WIKI-MONARCHS, grade B); excerpt: List of Maldivian monarchs family/genealogy content lists P78 Ibrahim Iskander as parent of P81 Mohamed Ghiyathuddine.",
      "Rule application (parent-of-parent-grandparent): with source -> P78 Ibrahim Iskander (Rannava Loka) and P78 Ibrahim Iskander (Rannava Loka) -> target parent links, P77 Mohamed Imaduddine (Kula Sundhura Siyaaaka) is modeled as inferred grandparent-line kin of P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P77 Mohamed Imaduddine (Kula Sundhura Siyaaaka) and P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P78", "P130", "grandparent"), {
    summary: "P78 Ibrahim Iskander (Rannava Loka) and P130 Prince Ibrahim Faamuladheyri Kilegefaanu are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p130-p78-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P78 Ibrahim Iskander (Rannava Loka) -> P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) (CLM-0356, SRC-WIKI-MONARCHS, grade B); excerpt: List of Maldivian monarchs family/genealogy content lists P78 Ibrahim Iskander as parent of P81 Mohamed Ghiyathuddine.",
      "Supporting edge: parent P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) -> P130 Prince Ibrahim Faamuladheyri Kilegefaanu (CLM-0359, SRC-WIKI-PRINCE-IBRAHIM-FAAMULADHEYRI, grade B); excerpt: Prince Ibrahim, Faamuladheyri Kilegefaanu family/genealogy content lists P81 Mohamed Ghiyathuddine as parent of P130 Prince Ibrahim Faamuladheyri K...",
      "Rule application (parent-of-parent-grandparent): with source -> P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) and P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) -> target parent links, P78 Ibrahim Iskander (Rannava Loka) is modeled as inferred grandparent-line kin of P130 Prince Ibrahim Faamuladheyri Kilegefaanu.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P78 Ibrahim Iskander (Rannava Loka) and P130 Prince Ibrahim Faamuladheyri Kilegefaanu as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P79", "P81", "aunt/uncle↔niece/nephew"), {
    summary: "P79 Mohamed Imaduddine (Navaranna Keerithi) and P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p79-p81-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P78 Ibrahim Iskander (Rannava Loka) -> P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) (CLM-0356, SRC-WIKI-MONARCHS, grade B); excerpt: List of Maldivian monarchs family/genealogy content lists P78 Ibrahim Iskander as parent of P81 Mohamed Ghiyathuddine.",
      "Supporting edge: sibling P78 Ibrahim Iskander (Rannava Loka) <-> P79 Mohamed Imaduddine (Navaranna Keerithi) [brothers] (CLM-0447, SRC-WIKI-MONARCHS, grade B); excerpt: List of Maldivian monarchs family/genealogy content links P78 Ibrahim Iskander and P79 Mohamed Imaduddine as siblings (brothers).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P78 Ibrahim Iskander (Rannava Loka), P79 Mohamed Imaduddine (Navaranna Keerithi)) plus parent(P78 Ibrahim Iskander (Rannava Loka), child) yields inferred aunt/uncle-line kin between P79 Mohamed Imaduddine (Navaranna Keerithi) and P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P79 Mohamed Imaduddine (Navaranna Keerithi) and P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P7", "P14", "grandparent"), {
    summary: "P7 Wadi (Dhagathaa Suvara) and P14 Hali (Areedha Suvara) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p14-p7-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P7 Wadi (Dhagathaa Suvara) -> P13 Audha (Areedha Suvara) (CLM-0352, SRC-MRF-KINGS, grade B); excerpt: Kings list sequence indicates P7 as father of P13.",
      "Supporting edge: parent P13 Audha (Areedha Suvara) -> P14 Hali (Areedha Suvara) (CLM-0263, SRC-MRF-KINGS, grade B); excerpt: Kings list gives P14 as son of P13 in the early Lunar succession sequence.",
      "Rule application (parent-of-parent-grandparent): with source -> P13 Audha (Areedha Suvara) and P13 Audha (Areedha Suvara) -> target parent links, P7 Wadi (Dhagathaa Suvara) is modeled as inferred grandparent-line kin of P14 Hali (Areedha Suvara).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P7 Wadi (Dhagathaa Suvara) and P14 Hali (Areedha Suvara) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P7", "P15", "grandparent"), {
    summary: "P7 Wadi (Dhagathaa Suvara) and P15 Yoosuf (Bavanaadheeththa) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p15-p7-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P7 Wadi (Dhagathaa Suvara) -> P13 Audha (Areedha Suvara) (CLM-0352, SRC-MRF-KINGS, grade B); excerpt: Kings list sequence indicates P7 as father of P13.",
      "Rule application (parent-of-parent-grandparent): with source -> P13 Audha (Areedha Suvara) and P13 Audha (Areedha Suvara) -> target parent links, P7 Wadi (Dhagathaa Suvara) is modeled as inferred grandparent-line kin of P15 Yoosuf (Bavanaadheeththa).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P7 Wadi (Dhagathaa Suvara) and P15 Yoosuf (Bavanaadheeththa) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P80", "P85", "grandparent"), {
    summary: "P80 Hassan Izzuddine (Kula Ran Meeba Audha) and P85 Mohamed Mueenuddine (Keerithi Maha Radun) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p80-p85-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P84 Hassan Nooredine (Keerithi Maha Radun) -> P85 Mohamed Mueenuddine (Keerithi Maha Radun) (CLM-0360, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P84 Hassan Nooredine as parent of P85 Mohamed Mueenuddine.",
      "Rule application (parent-of-parent-grandparent): with source -> P84 Hassan Nooredine (Keerithi Maha Radun) and P84 Hassan Nooredine (Keerithi Maha Radun) -> target parent links, P80 Hassan Izzuddine (Kula Ran Meeba Audha) is modeled as inferred grandparent-line kin of P85 Mohamed Mueenuddine (Keerithi Maha Radun).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P80 Hassan Izzuddine (Kula Ran Meeba Audha) and P85 Mohamed Mueenuddine (Keerithi Maha Radun) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P81", "P131", "grandparent"), {
    summary: "P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) and P131 Mohamed Didi are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p131-p81-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) -> P130 Prince Ibrahim Faamuladheyri Kilegefaanu (CLM-0359, SRC-WIKI-PRINCE-IBRAHIM-FAAMULADHEYRI, grade B); excerpt: Prince Ibrahim, Faamuladheyri Kilegefaanu family/genealogy content lists P81 Mohamed Ghiyathuddine as parent of P130 Prince Ibrahim Faamuladheyri K...",
      "Supporting edge: parent P130 Prince Ibrahim Faamuladheyri Kilegefaanu -> P131 Mohamed Didi (CLM-0265, SRC-WIKI-PRINCE-IBRAHIM-FAAMULADHEYRI, grade B); excerpt: Prince Ibrahim, Faamuladheyri Kilegefaanu family/genealogy content lists P130 Prince Ibrahim Faamuladheyri Kilegefaanu as parent of P131 Mohamed Didi.",
      "Rule application (parent-of-parent-grandparent): with source -> P130 Prince Ibrahim Faamuladheyri Kilegefaanu and P130 Prince Ibrahim Faamuladheyri Kilegefaanu -> target parent links, P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) is modeled as inferred grandparent-line kin of P131 Mohamed Didi.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) and P131 Mohamed Didi as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P81", "P140", "grandparent"), {
    summary: "P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) and P140 Al-Nabeel Karayye Hassan Didi are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p140-p81-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) -> P130 Prince Ibrahim Faamuladheyri Kilegefaanu (CLM-0359, SRC-WIKI-PRINCE-IBRAHIM-FAAMULADHEYRI, grade B); excerpt: Prince Ibrahim, Faamuladheyri Kilegefaanu family/genealogy content lists P81 Mohamed Ghiyathuddine as parent of P130 Prince Ibrahim Faamuladheyri K...",
      "Supporting edge: parent P130 Prince Ibrahim Faamuladheyri Kilegefaanu -> P140 Al-Nabeel Karayye Hassan Didi (CLM-0266, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P130 Prince Ibrahim Faamuladheyri Kilegefaanu as parent of P140 Al-Nabeel Karayye Hassan Didi.",
      "Rule application (parent-of-parent-grandparent): with source -> P130 Prince Ibrahim Faamuladheyri Kilegefaanu and P130 Prince Ibrahim Faamuladheyri Kilegefaanu -> target parent links, P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) is modeled as inferred grandparent-line kin of P140 Al-Nabeel Karayye Hassan Didi.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) and P140 Al-Nabeel Karayye Hassan Didi as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P81", "P180", "grandparent"), {
    summary: "P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) and P180 Princess Aishath Didi are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p180-p81-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) -> P130 Prince Ibrahim Faamuladheyri Kilegefaanu (CLM-0359, SRC-WIKI-PRINCE-IBRAHIM-FAAMULADHEYRI, grade B); excerpt: Prince Ibrahim, Faamuladheyri Kilegefaanu family/genealogy content lists P81 Mohamed Ghiyathuddine as parent of P130 Prince Ibrahim Faamuladheyri K...",
      "Supporting edge: parent P130 Prince Ibrahim Faamuladheyri Kilegefaanu -> P180 Princess Aishath Didi (CLM-0267, SRC-MRF-MIDU-ROYAL, grade B); excerpt: Midu Royal Family Branch (Addu/Meedhoo records) family/genealogy content lists P130 Prince Ibrahim Faamuladheyri Kilegefaanu as parent of P180 Prin...",
      "Rule application (parent-of-parent-grandparent): with source -> P130 Prince Ibrahim Faamuladheyri Kilegefaanu and P130 Prince Ibrahim Faamuladheyri Kilegefaanu -> target parent links, P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) is modeled as inferred grandparent-line kin of P180 Princess Aishath Didi.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) and P180 Princess Aishath Didi as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P83", "P85", "aunt/uncle↔niece/nephew"), {
    summary: "P83 Mohamed Muizzuddine (Keerithi Maha Radun) and P85 Mohamed Mueenuddine (Keerithi Maha Radun) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p83-p85-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P84 Hassan Nooredine (Keerithi Maha Radun) -> P85 Mohamed Mueenuddine (Keerithi Maha Radun) (CLM-0360, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P84 Hassan Nooredine as parent of P85 Mohamed Mueenuddine.",
      "Supporting edge: sibling P83 Mohamed Muizzuddine (Keerithi Maha Radun) <-> P84 Hassan Nooredine (Keerithi Maha Radun) [brothers] (CLM-0448, SRC-WIKI-MONARCHS, grade B); excerpt: List of Maldivian monarchs family/genealogy content links P83 Mohamed Muizzuddine and P84 Hassan Nooredine as siblings (brothers).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P84 Hassan Nooredine (Keerithi Maha Radun), P83 Mohamed Muizzuddine (Keerithi Maha Radun)) plus parent(P84 Hassan Nooredine (Keerithi Maha Radun), child) yields inferred aunt/uncle-line kin between P83 Mohamed Muizzuddine (Keerithi Maha Radun) and P85 Mohamed Mueenuddine (Keerithi Maha Radun).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P83 Mohamed Muizzuddine (Keerithi Maha Radun) and P85 Mohamed Mueenuddine (Keerithi Maha Radun) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P84", "P86", "grandparent"), {
    summary: "P84 Hassan Nooredine (Keerithi Maha Radun) and P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p84-p86-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P84 Hassan Nooredine (Keerithi Maha Radun) -> P85 Mohamed Mueenuddine (Keerithi Maha Radun) (CLM-0360, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P84 Hassan Nooredine as parent of P85 Mohamed Mueenuddine.",
      "Supporting edge: parent P85 Mohamed Mueenuddine (Keerithi Maha Radun) -> P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) (CLM-0361, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P85 Mohamed Mueenuddine as parent of P86 Mohamed Imaduddine.",
      "Rule application (parent-of-parent-grandparent): with source -> P85 Mohamed Mueenuddine (Keerithi Maha Radun) and P85 Mohamed Mueenuddine (Keerithi Maha Radun) -> target parent links, P84 Hassan Nooredine (Keerithi Maha Radun) is modeled as inferred grandparent-line kin of P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P84 Hassan Nooredine (Keerithi Maha Radun) and P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P85", "P222", "grandparent"), {
    summary: "P85 Mohamed Mueenuddine (Keerithi Maha Radun) and P222 Hassan Izz ud-din are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p222-p85-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P85 Mohamed Mueenuddine (Keerithi Maha Radun) -> P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) (CLM-0361, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P85 Mohamed Mueenuddine as parent of P86 Mohamed Imaduddine.",
      "Supporting edge: parent P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) -> P222 Hassan Izz ud-din (CLM-0610, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Mohamed Imaduddine as parent of Hassan Izz ud-din.",
      "Rule application (parent-of-parent-grandparent): with source -> P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) and P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) -> target parent links, P85 Mohamed Mueenuddine (Keerithi Maha Radun) is modeled as inferred grandparent-line kin of P222 Hassan Izz ud-din.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P85 Mohamed Mueenuddine (Keerithi Maha Radun) and P222 Hassan Izz ud-din as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P85", "P87", "grandparent"), {
    summary: "P85 Mohamed Mueenuddine (Keerithi Maha Radun) and P87 Ibrahim Nooredine (Keerithi Maha Radun) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p85-p87-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P85 Mohamed Mueenuddine (Keerithi Maha Radun) -> P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) (CLM-0361, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P85 Mohamed Mueenuddine as parent of P86 Mohamed Imaduddine.",
      "Supporting edge: parent P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) -> P87 Ibrahim Nooredine (Keerithi Maha Radun) (CLM-0363, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P86 Mohamed Imaduddine as parent of P87 Ibrahim Nooredine.",
      "Rule application (parent-of-parent-grandparent): with source -> P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) and P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) -> target parent links, P85 Mohamed Mueenuddine (Keerithi Maha Radun) is modeled as inferred grandparent-line kin of P87 Ibrahim Nooredine (Keerithi Maha Radun).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P85 Mohamed Mueenuddine (Keerithi Maha Radun) and P87 Ibrahim Nooredine (Keerithi Maha Radun) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P86", "P90", "grandparent"), {
    summary: "P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) and P90 Mohamed Imaduddine V (Keerithi Maha Radun) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p86-p90-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) -> P87 Ibrahim Nooredine (Keerithi Maha Radun) (CLM-0363, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P86 Mohamed Imaduddine as parent of P87 Ibrahim Nooredine.",
      "Supporting edge: parent P87 Ibrahim Nooredine (Keerithi Maha Radun) -> P90 Mohamed Imaduddine V (Keerithi Maha Radun) (CLM-0365, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P87 Ibrahim Nooredine as parent of P90 Mohamed Imaduddine V.",
      "Rule application (parent-of-parent-grandparent): with source -> P87 Ibrahim Nooredine (Keerithi Maha Radun) and P87 Ibrahim Nooredine (Keerithi Maha Radun) -> target parent links, P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) is modeled as inferred grandparent-line kin of P90 Mohamed Imaduddine V (Keerithi Maha Radun).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) and P90 Mohamed Imaduddine V (Keerithi Maha Radun) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P86", "P91", "grandparent"), {
    summary: "P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) and P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p86-p91-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) -> P87 Ibrahim Nooredine (Keerithi Maha Radun) (CLM-0363, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P86 Mohamed Imaduddine as parent of P87 Ibrahim Nooredine.",
      "Supporting edge: parent P87 Ibrahim Nooredine (Keerithi Maha Radun) -> P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) (CLM-0366, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P87 Ibrahim Nooredine as parent of P91 Mohamed Shamsuddine III.",
      "Rule application (parent-of-parent-grandparent): with source -> P87 Ibrahim Nooredine (Keerithi Maha Radun) and P87 Ibrahim Nooredine (Keerithi Maha Radun) -> target parent links, P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) is modeled as inferred grandparent-line kin of P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) and P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P87", "P92", "uncle/nephew"), {
    summary: "P87 Ibrahim Nooredine (Keerithi Maha Radun) and P92 Mohamed Imaduddine VI (Keerithi Maha Radun) are modeled as `kin` with label `uncle/nephew` to preserve a targeted continuity claim without over-promoting certainty.",
    dossier: "docs/research-program/inferences/kin-p87-p92-uncle-nephew.md",
    logic: [
      "Shortest direct-claim support path (2 steps) linking this pair:",
      "parent P87 Ibrahim Nooredine (Keerithi Maha Radun) -> P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) (CLM-0363, SRC-MRF-KINGS)",
      "kin P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) <-> P92 Mohamed Imaduddine VI (Keerithi Maha Radun) [grandfather] (CLM-0208, SRC-MRF-KINGS)",
      "This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.",
      "Current modeling choice remains `inferred` because explicit source wording that names `kin` for P87 Ibrahim Nooredine (Keerithi Maha Radun) and P92 Mohamed Imaduddine VI (Keerithi Maha Radun) is still absent."
    ],
    verification: [
      "Promotion requirement: an A/B source statement explicitly naming P87 Ibrahim Nooredine (Keerithi Maha Radun) and P92 Mohamed Imaduddine VI (Keerithi Maha Radun) with relation class `kin` (uncle/nephew).",
      "Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.",
      "Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster."
    ]
  }],
  [k("kin", "P8", "P13", "aunt/uncle↔niece/nephew"), {
    summary: "P8 Valla Dio (Raa-Araa Desyara) and P13 Audha (Areedha Suvara) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p13-p8-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P7 Wadi (Dhagathaa Suvara) -> P13 Audha (Areedha Suvara) (CLM-0352, SRC-MRF-KINGS, grade B); excerpt: Kings list sequence indicates P7 as father of P13.",
      "Supporting edge: sibling P7 Wadi (Dhagathaa Suvara) <-> P8 Valla Dio (Raa-Araa Desyara) [brothers] (CLM-0446, SRC-MRF-KINGS, grade B); excerpt: Kings list explicitly notes P7 and P8 as brothers.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P7 Wadi (Dhagathaa Suvara), P8 Valla Dio (Raa-Araa Desyara)) plus parent(P7 Wadi (Dhagathaa Suvara), child) yields inferred aunt/uncle-line kin between P8 Valla Dio (Raa-Araa Desyara) and P13 Audha (Areedha Suvara).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P8 Valla Dio (Raa-Araa Desyara) and P13 Audha (Areedha Suvara) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P90", "P88", "cousins"), {
    summary: "P90 Mohamed Imaduddine V (Keerithi Maha Radun) and P88 Mohamed Mueenuddine (Keerithi Maha Radun) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p88-p90-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P87 Ibrahim Nooredine (Keerithi Maha Radun) -> P90 Mohamed Imaduddine V (Keerithi Maha Radun) (CLM-0365, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P87 Ibrahim Nooredine as parent of P90 Mohamed Imaduddine V.",
      "Supporting edge: parent P222 Hassan Izz ud-din -> P88 Mohamed Mueenuddine (Keerithi Maha Radun) (CLM-0591, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Hassan Izz ud-din as parent of Mohamed Mueenuddine.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P87 Ibrahim Nooredine (Keerithi Maha Radun) and P222 Hassan Izz ud-din are modeled as inferred cousin-line kin (P90 Mohamed Imaduddine V (Keerithi Maha Radun) <-> P88 Mohamed Mueenuddine (Keerithi Maha Radun)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P90 Mohamed Imaduddine V (Keerithi Maha Radun) and P88 Mohamed Mueenuddine (Keerithi Maha Radun) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P90", "P92", "cousins"), {
    summary: "P90 Mohamed Imaduddine V (Keerithi Maha Radun) and P92 Mohamed Imaduddine VI (Keerithi Maha Radun) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p90-p92-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P87 Ibrahim Nooredine (Keerithi Maha Radun) -> P90 Mohamed Imaduddine V (Keerithi Maha Radun) (CLM-0365, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P87 Ibrahim Nooredine as parent of P90 Mohamed Imaduddine V.",
      "Supporting edge: parent P222 Hassan Izz ud-din -> P92 Mohamed Imaduddine VI (Keerithi Maha Radun) (CLM-0592, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Hassan Izz ud-din as parent of Mohamed Imaduddine VI.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P87 Ibrahim Nooredine (Keerithi Maha Radun) and P222 Hassan Izz ud-din are modeled as inferred cousin-line kin (P90 Mohamed Imaduddine V (Keerithi Maha Radun) <-> P92 Mohamed Imaduddine VI (Keerithi Maha Radun)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P90 Mohamed Imaduddine V (Keerithi Maha Radun) and P92 Mohamed Imaduddine VI (Keerithi Maha Radun) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P91", "P190", "aunt/uncle↔niece/nephew"), {
    summary: "P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) and P190 Hassan Fareed Didi are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p190-p91-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P129 Princess Veyogey Dhon Goma -> P190 Hassan Fareed Didi (CLM-0260, SRC-WIKI-HASSAN-FARID, grade B); excerpt: Hassan Farid Didi family/genealogy content lists P129 Princess Veyogey Dhon Goma as parent of P190 Hassan Fareed Didi.",
      "Supporting edge: sibling P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) <-> P129 Princess Veyogey Dhon Goma [half-siblings (shared mother P185)] (CLM-0649, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct sibling (half-siblings (shared mother P185)) relation recorded between Mohamed Shamsuddine III and Princess Veyogey Dhon Goma.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P129 Princess Veyogey Dhon Goma, P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri)) plus parent(P129 Princess Veyogey Dhon Goma, child) yields inferred aunt/uncle-line kin between P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) and P190 Hassan Fareed Didi.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) and P190 Hassan Fareed Didi as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P91", "P191", "aunt/uncle↔niece/nephew"), {
    summary: "P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) and P191 Ibrahim Fareed Didi are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p191-p91-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P129 Princess Veyogey Dhon Goma -> P191 Ibrahim Fareed Didi (CLM-0261, SRC-WIKI-IBRAHIM-FAREED, grade B); excerpt: Ibrahim Fareed Didi family/genealogy content lists P129 Princess Veyogey Dhon Goma as parent of P191 Ibrahim Fareed Didi.",
      "Supporting edge: sibling P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) <-> P129 Princess Veyogey Dhon Goma [half-siblings (shared mother P185)] (CLM-0649, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct sibling (half-siblings (shared mother P185)) relation recorded between Mohamed Shamsuddine III and Princess Veyogey Dhon Goma.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P129 Princess Veyogey Dhon Goma, P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri)) plus parent(P129 Princess Veyogey Dhon Goma, child) yields inferred aunt/uncle-line kin between P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) and P191 Ibrahim Fareed Didi.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) and P191 Ibrahim Fareed Didi as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P91", "P88", "cousins"), {
    summary: "P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) and P88 Mohamed Mueenuddine (Keerithi Maha Radun) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p88-p91-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P87 Ibrahim Nooredine (Keerithi Maha Radun) -> P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) (CLM-0366, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P87 Ibrahim Nooredine as parent of P91 Mohamed Shamsuddine III.",
      "Supporting edge: parent P222 Hassan Izz ud-din -> P88 Mohamed Mueenuddine (Keerithi Maha Radun) (CLM-0591, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Hassan Izz ud-din as parent of Mohamed Mueenuddine.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P87 Ibrahim Nooredine (Keerithi Maha Radun) and P222 Hassan Izz ud-din are modeled as inferred cousin-line kin (P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) <-> P88 Mohamed Mueenuddine (Keerithi Maha Radun)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) and P88 Mohamed Mueenuddine (Keerithi Maha Radun) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P91", "P92", "cousins"), {
    summary: "P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) and P92 Mohamed Imaduddine VI (Keerithi Maha Radun) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p91-p92-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P87 Ibrahim Nooredine (Keerithi Maha Radun) -> P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) (CLM-0366, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P87 Ibrahim Nooredine as parent of P91 Mohamed Shamsuddine III.",
      "Supporting edge: parent P222 Hassan Izz ud-din -> P92 Mohamed Imaduddine VI (Keerithi Maha Radun) (CLM-0592, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Hassan Izz ud-din as parent of Mohamed Imaduddine VI.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P87 Ibrahim Nooredine (Keerithi Maha Radun) and P222 Hassan Izz ud-din are modeled as inferred cousin-line kin (P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) <-> P92 Mohamed Imaduddine VI (Keerithi Maha Radun)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) and P92 Mohamed Imaduddine VI (Keerithi Maha Radun) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P91", "P95", "aunt/uncle↔niece/nephew"), {
    summary: "P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) and P95 Mohamed Farid (Keerithi Maha Radun) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p91-p95-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P129 Princess Veyogey Dhon Goma -> P95 Mohamed Farid (Keerithi Maha Radun) (CLM-0262, SRC-WIKI-MUHAMMAD-FAREED, grade B); excerpt: Muhammad Fareed Didi family/genealogy content lists P129 Princess Veyogey Dhon Goma as parent of P95 Mohamed Farid.",
      "Supporting edge: sibling P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) <-> P129 Princess Veyogey Dhon Goma [half-siblings (shared mother P185)] (CLM-0649, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct sibling (half-siblings (shared mother P185)) relation recorded between Mohamed Shamsuddine III and Princess Veyogey Dhon Goma.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P129 Princess Veyogey Dhon Goma, P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri)) plus parent(P129 Princess Veyogey Dhon Goma, child) yields inferred aunt/uncle-line kin between P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) and P95 Mohamed Farid (Keerithi Maha Radun).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) and P95 Mohamed Farid (Keerithi Maha Radun) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P92", "P94", "aunt/uncle↔niece/nephew"), {
    summary: "P92 Mohamed Imaduddine VI (Keerithi Maha Radun) and P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p92-p94-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P88 Mohamed Mueenuddine (Keerithi Maha Radun) -> P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka) (CLM-0367, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P88 Mohamed Mueenuddine as parent of P94 Hassan Nooredine II.",
      "Supporting edge: sibling P88 Mohamed Mueenuddine (Keerithi Maha Radun) <-> P92 Mohamed Imaduddine VI (Keerithi Maha Radun) [half-brothers (same father)] (CLM-0449, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P88 Mohamed Mueenuddine and P92 Mohamed Imaduddine VI as siblings (half-brothers (same father)).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P88 Mohamed Mueenuddine (Keerithi Maha Radun), P92 Mohamed Imaduddine VI (Keerithi Maha Radun)) plus parent(P88 Mohamed Mueenuddine (Keerithi Maha Radun), child) yields inferred aunt/uncle-line kin between P92 Mohamed Imaduddine VI (Keerithi Maha Radun) and P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P92 Mohamed Imaduddine VI (Keerithi Maha Radun) and P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P97", "P99", "grandparent"), {
    summary: "P97 Dom Luis de Sousa and P99 Hussain Daharadha Thakurufan are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p97-p99-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P97 Dom Luis de Sousa -> P98 Dom Maraduru Fandiaiy Thakurufan (CLM-0369, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P97 Dom Luis de Sousa as parent of P98 Dom Maraduru Fandiaiy Thakurufan.",
      "Supporting edge: parent P98 Dom Maraduru Fandiaiy Thakurufan -> P99 Hussain Daharadha Thakurufan (CLM-0370, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P98 Dom Maraduru Fandiaiy Thakurufan as parent of P99 Hussain Daharadha Thakurufan.",
      "Rule application (parent-of-parent-grandparent): with source -> P98 Dom Maraduru Fandiaiy Thakurufan and P98 Dom Maraduru Fandiaiy Thakurufan -> target parent links, P97 Dom Luis de Sousa is modeled as inferred grandparent-line kin of P99 Hussain Daharadha Thakurufan.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P97 Dom Luis de Sousa and P99 Hussain Daharadha Thakurufan as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P98", "P100", "grandparent"), {
    summary: "P98 Dom Maraduru Fandiaiy Thakurufan and P100 Mohamed Faamuladeyri Thakurufan are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p100-p98-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P98 Dom Maraduru Fandiaiy Thakurufan -> P99 Hussain Daharadha Thakurufan (CLM-0370, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P98 Dom Maraduru Fandiaiy Thakurufan as parent of P99 Hussain Daharadha Thakurufan.",
      "Supporting edge: parent P99 Hussain Daharadha Thakurufan -> P100 Mohamed Faamuladeyri Thakurufan (CLM-0371, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P99 Hussain Daharadha Thakurufan as parent of P100 Mohamed Faamuladeyri Thakurufan.",
      "Rule application (parent-of-parent-grandparent): with source -> P99 Hussain Daharadha Thakurufan and P99 Hussain Daharadha Thakurufan -> target parent links, P98 Dom Maraduru Fandiaiy Thakurufan is modeled as inferred grandparent-line kin of P100 Mohamed Faamuladeyri Thakurufan.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P98 Dom Maraduru Fandiaiy Thakurufan and P100 Mohamed Faamuladeyri Thakurufan as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P99", "P80", "grandparent"), {
    summary: "P99 Hussain Daharadha Thakurufan and P80 Hassan Izzuddine (Kula Ran Meeba Audha) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p80-p99-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P99 Hussain Daharadha Thakurufan -> P100 Mohamed Faamuladeyri Thakurufan (CLM-0371, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P99 Hussain Daharadha Thakurufan as parent of P100 Mohamed Faamuladeyri Thakurufan.",
      "Supporting edge: parent P100 Mohamed Faamuladeyri Thakurufan -> P80 Hassan Izzuddine (Kula Ran Meeba Audha) (CLM-0223, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P100 Mohamed Faamuladeyri Thakurufan as parent of P80 Hassan Izzuddine.",
      "Rule application (parent-of-parent-grandparent): with source -> P100 Mohamed Faamuladeyri Thakurufan and P100 Mohamed Faamuladeyri Thakurufan -> target parent links, P99 Hussain Daharadha Thakurufan is modeled as inferred grandparent-line kin of P80 Hassan Izzuddine (Kula Ran Meeba Audha).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P99 Hussain Daharadha Thakurufan and P80 Hassan Izzuddine (Kula Ran Meeba Audha) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("parent", "P13", "P15", ""), {
    summary: "P13 Audha (Areedha Suvara) and P15 Yoosuf (Bavanaadheeththa) are modeled as `parent` to preserve a targeted continuity claim without over-promoting certainty.",
    dossier: "docs/research-program/inferences/parent-p13-p15.md",
    logic: [
      "Shortest direct-claim support path (2 steps) linking this pair:",
      "parent P13 Audha (Areedha Suvara) -> P14 Hali (Areedha Suvara) (CLM-0263, SRC-MRF-KINGS)",
      "sibling P14 Hali (Areedha Suvara) <-> P15 Yoosuf (Bavanaadheeththa) [brothers] (CLM-0386, SRC-MRF-KINGS)",
      "This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.",
      "Current modeling choice remains `inferred` because explicit source wording that names `parent` for P13 Audha (Areedha Suvara) and P15 Yoosuf (Bavanaadheeththa) is still absent."
    ],
    verification: [
      "Promotion requirement: an A/B source statement explicitly naming P13 Audha (Areedha Suvara) and P15 Yoosuf (Bavanaadheeththa) with relation class `parent`.",
      "Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.",
      "Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster."
    ]
  }],
  [k("parent", "P80", "P84", ""), {
    summary: "P80 Hassan Izzuddine (Kula Ran Meeba Audha) and P84 Hassan Nooredine (Keerithi Maha Radun) are modeled as `parent` to preserve a targeted continuity claim without over-promoting certainty.",
    dossier: "docs/research-program/inferences/parent-p80-p84.md",
    logic: [
      "Shortest direct-claim support path (2 steps) linking this pair:",
      "parent P80 Hassan Izzuddine (Kula Ran Meeba Audha) -> P83 Mohamed Muizzuddine (Keerithi Maha Radun) (CLM-0357, SRC-WIKI-MONARCHS)",
      "sibling P83 Mohamed Muizzuddine (Keerithi Maha Radun) <-> P84 Hassan Nooredine (Keerithi Maha Radun) [brothers] (CLM-0448, SRC-WIKI-MONARCHS)",
      "This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.",
      "Current modeling choice remains `inferred` because explicit source wording that names `parent` for P80 Hassan Izzuddine (Kula Ran Meeba Audha) and P84 Hassan Nooredine (Keerithi Maha Radun) is still absent."
    ],
    verification: [
      "Promotion requirement: an A/B source statement explicitly naming P80 Hassan Izzuddine (Kula Ran Meeba Audha) and P84 Hassan Nooredine (Keerithi Maha Radun) with relation class `parent`.",
      "Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.",
      "Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster."
    ]
  }],
  [k("sibling", "P124", "P143", "siblings (shared parent)"), {
    summary: "P124 Ali Nasir and P143 Ahmed Nasir are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p124-p143-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P115 Ibrahim Nasir -> P124 Ali Nasir (CLM-0238, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ali Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P124 Ali Nasir).",
      "Supporting edge: parent P115 Ibrahim Nasir -> P143 Ahmed Nasir (CLM-0239, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ahmed Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P143 Ahmed Nasir).",
      "Rule application (shared-parent-sibling): because both endpoints share parent P115 Ibrahim Nasir, P124 Ali Nasir and P143 Ahmed Nasir are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P124 Ali Nasir and P143 Ahmed Nasir as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P124", "P144", "siblings (shared parent)"), {
    summary: "P124 Ali Nasir and P144 Mohamed Nasir are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p124-p144-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P115 Ibrahim Nasir -> P124 Ali Nasir (CLM-0238, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ali Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P124 Ali Nasir).",
      "Supporting edge: parent P115 Ibrahim Nasir -> P144 Mohamed Nasir (CLM-0240, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Mohamed Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P144 Mohamed Nasir).",
      "Rule application (shared-parent-sibling): because both endpoints share parent P115 Ibrahim Nasir, P124 Ali Nasir and P144 Mohamed Nasir are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P124 Ali Nasir and P144 Mohamed Nasir as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P124", "P145", "siblings (shared parent)"), {
    summary: "P124 Ali Nasir and P145 Ibrahim Nasir (son of President Ibrahim Nasir) are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p124-p145-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P115 Ibrahim Nasir -> P124 Ali Nasir (CLM-0238, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ali Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P124 Ali Nasir).",
      "Supporting edge: parent P115 Ibrahim Nasir -> P145 Ibrahim Nasir (son of President Ibrahim Nasir) (CLM-0241, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ibrahim Nasir (junior) as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P145 Ibrahim Nasir (son of P...",
      "Rule application (shared-parent-sibling): because both endpoints share parent P115 Ibrahim Nasir, P124 Ali Nasir and P145 Ibrahim Nasir (son of President Ibrahim Nasir) are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P124 Ali Nasir and P145 Ibrahim Nasir (son of President Ibrahim Nasir) as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P124", "P146", "siblings (shared parent)"), {
    summary: "P124 Ali Nasir and P146 Ismail Nasir are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p124-p146-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P115 Ibrahim Nasir -> P124 Ali Nasir (CLM-0238, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ali Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P124 Ali Nasir).",
      "Supporting edge: parent P115 Ibrahim Nasir -> P146 Ismail Nasir (CLM-0242, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ismail Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P146 Ismail Nasir).",
      "Rule application (shared-parent-sibling): because both endpoints share parent P115 Ibrahim Nasir, P124 Ali Nasir and P146 Ismail Nasir are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P124 Ali Nasir and P146 Ismail Nasir as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P124", "P147", "siblings (shared parent)"), {
    summary: "P124 Ali Nasir and P147 Aishath Nasir are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p124-p147-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P115 Ibrahim Nasir -> P124 Ali Nasir (CLM-0238, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ali Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P124 Ali Nasir).",
      "Supporting edge: parent P115 Ibrahim Nasir -> P147 Aishath Nasir (CLM-0243, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Aishath Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P147 Aishath Nasir).",
      "Rule application (shared-parent-sibling): because both endpoints share parent P115 Ibrahim Nasir, P124 Ali Nasir and P147 Aishath Nasir are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P124 Ali Nasir and P147 Aishath Nasir as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P125", "P126", "siblings (shared parent)"), {
    summary: "P125 Meera Laila Nasheed and P126 Zaya Laila Nasheed are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p125-p126-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P122 Mohamed Nasheed -> P125 Meera Laila Nasheed (CLM-0254, SRC-WIKI-NASHEED, grade B); excerpt: Wikipedia raw infobox issue field lists Meera Laila Nasheed as child of Mohamed Nasheed. (pair: P122 Mohamed Nasheed -> P125 Meera Laila Nasheed).",
      "Supporting edge: parent P122 Mohamed Nasheed -> P126 Zaya Laila Nasheed (CLM-0255, SRC-WIKI-NASHEED, grade B); excerpt: Wikipedia raw infobox issue field lists Zaya Laila Nasheed as child of Mohamed Nasheed. (pair: P122 Mohamed Nasheed -> P126 Zaya Laila Nasheed).",
      "Rule application (shared-parent-sibling): because both endpoints share parent P122 Mohamed Nasheed, P125 Meera Laila Nasheed and P126 Zaya Laila Nasheed are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P125 Meera Laila Nasheed and P126 Zaya Laila Nasheed as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P131", "P140", "siblings (shared parent)"), {
    summary: "P131 Mohamed Didi and P140 Al-Nabeel Karayye Hassan Didi are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p131-p140-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P130 Prince Ibrahim Faamuladheyri Kilegefaanu -> P131 Mohamed Didi (CLM-0265, SRC-WIKI-PRINCE-IBRAHIM-FAAMULADHEYRI, grade B); excerpt: Prince Ibrahim, Faamuladheyri Kilegefaanu family/genealogy content lists P130 Prince Ibrahim Faamuladheyri Kilegefaanu as parent of P131 Mohamed Didi.",
      "Supporting edge: parent P130 Prince Ibrahim Faamuladheyri Kilegefaanu -> P140 Al-Nabeel Karayye Hassan Didi (CLM-0266, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P130 Prince Ibrahim Faamuladheyri Kilegefaanu as parent of P140 Al-Nabeel Karayye Hassan Didi.",
      "Rule application (shared-parent-sibling): because both endpoints share parent P130 Prince Ibrahim Faamuladheyri Kilegefaanu, P131 Mohamed Didi and P140 Al-Nabeel Karayye Hassan Didi are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P131 Mohamed Didi and P140 Al-Nabeel Karayye Hassan Didi as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P131", "P180", "siblings (shared parent)"), {
    summary: "P131 Mohamed Didi and P180 Princess Aishath Didi are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p131-p180-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P130 Prince Ibrahim Faamuladheyri Kilegefaanu -> P131 Mohamed Didi (CLM-0265, SRC-WIKI-PRINCE-IBRAHIM-FAAMULADHEYRI, grade B); excerpt: Prince Ibrahim, Faamuladheyri Kilegefaanu family/genealogy content lists P130 Prince Ibrahim Faamuladheyri Kilegefaanu as parent of P131 Mohamed Didi.",
      "Supporting edge: parent P130 Prince Ibrahim Faamuladheyri Kilegefaanu -> P180 Princess Aishath Didi (CLM-0267, SRC-MRF-MIDU-ROYAL, grade B); excerpt: Midu Royal Family Branch (Addu/Meedhoo records) family/genealogy content lists P130 Prince Ibrahim Faamuladheyri Kilegefaanu as parent of P180 Prin...",
      "Rule application (shared-parent-sibling): because both endpoints share parent P130 Prince Ibrahim Faamuladheyri Kilegefaanu, P131 Mohamed Didi and P180 Princess Aishath Didi are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P131 Mohamed Didi and P180 Princess Aishath Didi as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P140", "P180", "siblings (shared parent)"), {
    summary: "P140 Al-Nabeel Karayye Hassan Didi and P180 Princess Aishath Didi are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p140-p180-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P130 Prince Ibrahim Faamuladheyri Kilegefaanu -> P140 Al-Nabeel Karayye Hassan Didi (CLM-0266, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P130 Prince Ibrahim Faamuladheyri Kilegefaanu as parent of P140 Al-Nabeel Karayye Hassan Didi.",
      "Supporting edge: parent P130 Prince Ibrahim Faamuladheyri Kilegefaanu -> P180 Princess Aishath Didi (CLM-0267, SRC-MRF-MIDU-ROYAL, grade B); excerpt: Midu Royal Family Branch (Addu/Meedhoo records) family/genealogy content lists P130 Prince Ibrahim Faamuladheyri Kilegefaanu as parent of P180 Prin...",
      "Rule application (shared-parent-sibling): because both endpoints share parent P130 Prince Ibrahim Faamuladheyri Kilegefaanu, P140 Al-Nabeel Karayye Hassan Didi and P180 Princess Aishath Didi are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P140 Al-Nabeel Karayye Hassan Didi and P180 Princess Aishath Didi as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P143", "P144", "siblings (shared parent)"), {
    summary: "P143 Ahmed Nasir and P144 Mohamed Nasir are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p143-p144-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P115 Ibrahim Nasir -> P143 Ahmed Nasir (CLM-0239, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ahmed Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P143 Ahmed Nasir).",
      "Supporting edge: parent P115 Ibrahim Nasir -> P144 Mohamed Nasir (CLM-0240, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Mohamed Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P144 Mohamed Nasir).",
      "Rule application (shared-parent-sibling): because both endpoints share parent P115 Ibrahim Nasir, P143 Ahmed Nasir and P144 Mohamed Nasir are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P143 Ahmed Nasir and P144 Mohamed Nasir as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P143", "P145", "siblings (shared parent)"), {
    summary: "P143 Ahmed Nasir and P145 Ibrahim Nasir (son of President Ibrahim Nasir) are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p143-p145-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P115 Ibrahim Nasir -> P143 Ahmed Nasir (CLM-0239, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ahmed Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P143 Ahmed Nasir).",
      "Supporting edge: parent P115 Ibrahim Nasir -> P145 Ibrahim Nasir (son of President Ibrahim Nasir) (CLM-0241, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ibrahim Nasir (junior) as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P145 Ibrahim Nasir (son of P...",
      "Rule application (shared-parent-sibling): because both endpoints share parent P115 Ibrahim Nasir, P143 Ahmed Nasir and P145 Ibrahim Nasir (son of President Ibrahim Nasir) are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P143 Ahmed Nasir and P145 Ibrahim Nasir (son of President Ibrahim Nasir) as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P143", "P146", "siblings (shared parent)"), {
    summary: "P143 Ahmed Nasir and P146 Ismail Nasir are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p143-p146-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P115 Ibrahim Nasir -> P143 Ahmed Nasir (CLM-0239, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ahmed Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P143 Ahmed Nasir).",
      "Supporting edge: parent P115 Ibrahim Nasir -> P146 Ismail Nasir (CLM-0242, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ismail Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P146 Ismail Nasir).",
      "Rule application (shared-parent-sibling): because both endpoints share parent P115 Ibrahim Nasir, P143 Ahmed Nasir and P146 Ismail Nasir are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P143 Ahmed Nasir and P146 Ismail Nasir as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P143", "P147", "siblings (shared parent)"), {
    summary: "P143 Ahmed Nasir and P147 Aishath Nasir are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p143-p147-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P115 Ibrahim Nasir -> P143 Ahmed Nasir (CLM-0239, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ahmed Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P143 Ahmed Nasir).",
      "Supporting edge: parent P115 Ibrahim Nasir -> P147 Aishath Nasir (CLM-0243, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Aishath Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P147 Aishath Nasir).",
      "Rule application (shared-parent-sibling): because both endpoints share parent P115 Ibrahim Nasir, P143 Ahmed Nasir and P147 Aishath Nasir are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P143 Ahmed Nasir and P147 Aishath Nasir as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P144", "P145", "siblings (shared parent)"), {
    summary: "P144 Mohamed Nasir and P145 Ibrahim Nasir (son of President Ibrahim Nasir) are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p144-p145-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P115 Ibrahim Nasir -> P144 Mohamed Nasir (CLM-0240, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Mohamed Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P144 Mohamed Nasir).",
      "Supporting edge: parent P115 Ibrahim Nasir -> P145 Ibrahim Nasir (son of President Ibrahim Nasir) (CLM-0241, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ibrahim Nasir (junior) as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P145 Ibrahim Nasir (son of P...",
      "Rule application (shared-parent-sibling): because both endpoints share parent P115 Ibrahim Nasir, P144 Mohamed Nasir and P145 Ibrahim Nasir (son of President Ibrahim Nasir) are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P144 Mohamed Nasir and P145 Ibrahim Nasir (son of President Ibrahim Nasir) as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P144", "P146", "siblings (shared parent)"), {
    summary: "P144 Mohamed Nasir and P146 Ismail Nasir are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p144-p146-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P115 Ibrahim Nasir -> P144 Mohamed Nasir (CLM-0240, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Mohamed Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P144 Mohamed Nasir).",
      "Supporting edge: parent P115 Ibrahim Nasir -> P146 Ismail Nasir (CLM-0242, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ismail Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P146 Ismail Nasir).",
      "Rule application (shared-parent-sibling): because both endpoints share parent P115 Ibrahim Nasir, P144 Mohamed Nasir and P146 Ismail Nasir are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P144 Mohamed Nasir and P146 Ismail Nasir as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P144", "P147", "siblings (shared parent)"), {
    summary: "P144 Mohamed Nasir and P147 Aishath Nasir are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p144-p147-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P115 Ibrahim Nasir -> P144 Mohamed Nasir (CLM-0240, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Mohamed Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P144 Mohamed Nasir).",
      "Supporting edge: parent P115 Ibrahim Nasir -> P147 Aishath Nasir (CLM-0243, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Aishath Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P147 Aishath Nasir).",
      "Rule application (shared-parent-sibling): because both endpoints share parent P115 Ibrahim Nasir, P144 Mohamed Nasir and P147 Aishath Nasir are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P144 Mohamed Nasir and P147 Aishath Nasir as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P145", "P146", "siblings (shared parent)"), {
    summary: "P145 Ibrahim Nasir (son of President Ibrahim Nasir) and P146 Ismail Nasir are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p145-p146-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P115 Ibrahim Nasir -> P145 Ibrahim Nasir (son of President Ibrahim Nasir) (CLM-0241, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ibrahim Nasir (junior) as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P145 Ibrahim Nasir (son of P...",
      "Supporting edge: parent P115 Ibrahim Nasir -> P146 Ismail Nasir (CLM-0242, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ismail Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P146 Ismail Nasir).",
      "Rule application (shared-parent-sibling): because both endpoints share parent P115 Ibrahim Nasir, P145 Ibrahim Nasir (son of President Ibrahim Nasir) and P146 Ismail Nasir are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P145 Ibrahim Nasir (son of President Ibrahim Nasir) and P146 Ismail Nasir as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P145", "P147", "siblings (shared parent)"), {
    summary: "P145 Ibrahim Nasir (son of President Ibrahim Nasir) and P147 Aishath Nasir are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p145-p147-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P115 Ibrahim Nasir -> P145 Ibrahim Nasir (son of President Ibrahim Nasir) (CLM-0241, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ibrahim Nasir (junior) as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P145 Ibrahim Nasir (son of P...",
      "Supporting edge: parent P115 Ibrahim Nasir -> P147 Aishath Nasir (CLM-0243, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Aishath Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P147 Aishath Nasir).",
      "Rule application (shared-parent-sibling): because both endpoints share parent P115 Ibrahim Nasir, P145 Ibrahim Nasir (son of President Ibrahim Nasir) and P147 Aishath Nasir are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P145 Ibrahim Nasir (son of President Ibrahim Nasir) and P147 Aishath Nasir as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P146", "P147", "siblings (shared parent)"), {
    summary: "P146 Ismail Nasir and P147 Aishath Nasir are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p146-p147-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P115 Ibrahim Nasir -> P146 Ismail Nasir (CLM-0242, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Ismail Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P146 Ismail Nasir).",
      "Supporting edge: parent P115 Ibrahim Nasir -> P147 Aishath Nasir (CLM-0243, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Wikipedia raw infobox issue field lists Aishath Nasir as child of Ibrahim Nasir. (pair: P115 Ibrahim Nasir -> P147 Aishath Nasir).",
      "Rule application (shared-parent-sibling): because both endpoints share parent P115 Ibrahim Nasir, P146 Ismail Nasir and P147 Aishath Nasir are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P146 Ismail Nasir and P147 Aishath Nasir as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P150", "P151", "siblings (shared parent)"), {
    summary: "P150 Dunya Maumoon and P151 Yumna Maumoon are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p150-p151-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P119 Maumoon Abdul Gayoom -> P150 Dunya Maumoon (CLM-0248, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Dunya Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P150 Dunya Maumoon).",
      "Supporting edge: parent P119 Maumoon Abdul Gayoom -> P151 Yumna Maumoon (CLM-0249, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Yumna Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P151 Yumna Maumoon).",
      "Rule application (shared-parent-sibling): because both endpoints share parent P119 Maumoon Abdul Gayoom, P150 Dunya Maumoon and P151 Yumna Maumoon are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P150 Dunya Maumoon and P151 Yumna Maumoon as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P150", "P152", "siblings (shared parent)"), {
    summary: "P150 Dunya Maumoon and P152 Faris Maumoon are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p150-p152-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P119 Maumoon Abdul Gayoom -> P150 Dunya Maumoon (CLM-0248, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Dunya Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P150 Dunya Maumoon).",
      "Supporting edge: parent P119 Maumoon Abdul Gayoom -> P152 Faris Maumoon (CLM-0250, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Faris Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P152 Faris Maumoon).",
      "Rule application (shared-parent-sibling): because both endpoints share parent P119 Maumoon Abdul Gayoom, P150 Dunya Maumoon and P152 Faris Maumoon are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P150 Dunya Maumoon and P152 Faris Maumoon as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P150", "P153", "siblings (shared parent)"), {
    summary: "P150 Dunya Maumoon and P153 Ghassan Maumoon are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p150-p153-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P119 Maumoon Abdul Gayoom -> P150 Dunya Maumoon (CLM-0248, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Dunya Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P150 Dunya Maumoon).",
      "Supporting edge: parent P119 Maumoon Abdul Gayoom -> P153 Ghassan Maumoon (CLM-0251, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Ghassan Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P153 Ghassan Maumoon).",
      "Rule application (shared-parent-sibling): because both endpoints share parent P119 Maumoon Abdul Gayoom, P150 Dunya Maumoon and P153 Ghassan Maumoon are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P150 Dunya Maumoon and P153 Ghassan Maumoon as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P151", "P152", "siblings (shared parent)"), {
    summary: "P151 Yumna Maumoon and P152 Faris Maumoon are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p151-p152-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P119 Maumoon Abdul Gayoom -> P151 Yumna Maumoon (CLM-0249, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Yumna Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P151 Yumna Maumoon).",
      "Supporting edge: parent P119 Maumoon Abdul Gayoom -> P152 Faris Maumoon (CLM-0250, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Faris Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P152 Faris Maumoon).",
      "Rule application (shared-parent-sibling): because both endpoints share parent P119 Maumoon Abdul Gayoom, P151 Yumna Maumoon and P152 Faris Maumoon are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P151 Yumna Maumoon and P152 Faris Maumoon as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P151", "P153", "siblings (shared parent)"), {
    summary: "P151 Yumna Maumoon and P153 Ghassan Maumoon are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p151-p153-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P119 Maumoon Abdul Gayoom -> P151 Yumna Maumoon (CLM-0249, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Yumna Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P151 Yumna Maumoon).",
      "Supporting edge: parent P119 Maumoon Abdul Gayoom -> P153 Ghassan Maumoon (CLM-0251, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Ghassan Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P153 Ghassan Maumoon).",
      "Rule application (shared-parent-sibling): because both endpoints share parent P119 Maumoon Abdul Gayoom, P151 Yumna Maumoon and P153 Ghassan Maumoon are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P151 Yumna Maumoon and P153 Ghassan Maumoon as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P152", "P153", "siblings (shared parent)"), {
    summary: "P152 Faris Maumoon and P153 Ghassan Maumoon are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p152-p153-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P119 Maumoon Abdul Gayoom -> P152 Faris Maumoon (CLM-0250, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Faris Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P152 Faris Maumoon).",
      "Supporting edge: parent P119 Maumoon Abdul Gayoom -> P153 Ghassan Maumoon (CLM-0251, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Ghassan Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P153 Ghassan Maumoon).",
      "Rule application (shared-parent-sibling): because both endpoints share parent P119 Maumoon Abdul Gayoom, P152 Faris Maumoon and P153 Ghassan Maumoon are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P152 Faris Maumoon and P153 Ghassan Maumoon as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P164", "P165", "siblings (shared parent)"), {
    summary: "P164 Widhadh Waheed and P165 Fidha Waheed are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p164-p165-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P162 Mohamed Waheed Hassan -> P164 Widhadh Waheed (CLM-0297, SRC-WIKI-WAHEED, grade B); excerpt: Wikipedia personal-life section lists Widhadh Waheed among Dr Mohamed Waheed Hassan’s children. (pair: P162 Mohamed Waheed Hassan -> P164 Widhadh W...",
      "Supporting edge: parent P162 Mohamed Waheed Hassan -> P165 Fidha Waheed (CLM-0298, SRC-WIKI-WAHEED, grade B); excerpt: Wikipedia personal-life section lists Fidha Waheed among Dr Mohamed Waheed Hassan’s children. (pair: P162 Mohamed Waheed Hassan -> P165 Fidha Waheed).",
      "Rule application (shared-parent-sibling): because both endpoints share parent P162 Mohamed Waheed Hassan, P164 Widhadh Waheed and P165 Fidha Waheed are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P164 Widhadh Waheed and P165 Fidha Waheed as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P164", "P166", "siblings (shared parent)"), {
    summary: "P164 Widhadh Waheed and P166 Jeffrey Salim Waheed are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p164-p166-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P162 Mohamed Waheed Hassan -> P164 Widhadh Waheed (CLM-0297, SRC-WIKI-WAHEED, grade B); excerpt: Wikipedia personal-life section lists Widhadh Waheed among Dr Mohamed Waheed Hassan’s children. (pair: P162 Mohamed Waheed Hassan -> P164 Widhadh W...",
      "Supporting edge: parent P162 Mohamed Waheed Hassan -> P166 Jeffrey Salim Waheed (CLM-0299, SRC-WIKI-WAHEED, grade B); excerpt: Wikipedia personal-life section lists Jeffrey Salim Waheed among Dr Mohamed Waheed Hassan’s children. (pair: P162 Mohamed Waheed Hassan -> P166 Jef...",
      "Rule application (shared-parent-sibling): because both endpoints share parent P162 Mohamed Waheed Hassan, P164 Widhadh Waheed and P166 Jeffrey Salim Waheed are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P164 Widhadh Waheed and P166 Jeffrey Salim Waheed as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P165", "P166", "siblings (shared parent)"), {
    summary: "P165 Fidha Waheed and P166 Jeffrey Salim Waheed are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p165-p166-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P162 Mohamed Waheed Hassan -> P165 Fidha Waheed (CLM-0298, SRC-WIKI-WAHEED, grade B); excerpt: Wikipedia personal-life section lists Fidha Waheed among Dr Mohamed Waheed Hassan’s children. (pair: P162 Mohamed Waheed Hassan -> P165 Fidha Waheed).",
      "Supporting edge: parent P162 Mohamed Waheed Hassan -> P166 Jeffrey Salim Waheed (CLM-0299, SRC-WIKI-WAHEED, grade B); excerpt: Wikipedia personal-life section lists Jeffrey Salim Waheed among Dr Mohamed Waheed Hassan’s children. (pair: P162 Mohamed Waheed Hassan -> P166 Jef...",
      "Rule application (shared-parent-sibling): because both endpoints share parent P162 Mohamed Waheed Hassan, P165 Fidha Waheed and P166 Jeffrey Salim Waheed are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P165 Fidha Waheed and P166 Jeffrey Salim Waheed as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P169", "P170", "siblings (shared parent)"), {
    summary: "P169 Sarah Ibrahim Solih and P170 Yaman Ibrahim Solih are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p169-p170-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P167 Ibrahim Mohamed Solih -> P169 Sarah Ibrahim Solih (CLM-0303, SRC-WIKI-SOLIH, grade B); excerpt: Wikipedia raw infobox issue field lists Sarah Ibrahim Solih as child of Ibrahim Mohamed Solih. (pair: P167 Ibrahim Mohamed Solih -> P169 Sarah Ibra...",
      "Supporting edge: parent P167 Ibrahim Mohamed Solih -> P170 Yaman Ibrahim Solih (CLM-0304, SRC-WIKI-SOLIH, grade B); excerpt: Wikipedia lead text states Ibrahim Mohamed Solih and his wife have a son named Yaman. (pair: P167 Ibrahim Mohamed Solih -> P170 Yaman Ibrahim Solih).",
      "Rule application (shared-parent-sibling): because both endpoints share parent P167 Ibrahim Mohamed Solih, P169 Sarah Ibrahim Solih and P170 Yaman Ibrahim Solih are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P169 Sarah Ibrahim Solih and P170 Yaman Ibrahim Solih as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P16", "P17", "brothers"), {
    summary: "P16 Salis (Meesuvvara) and P17 Davud (Sundhura Bavana) are modeled as `sibling` with label `brothers` to preserve a targeted continuity claim without over-promoting certainty.",
    dossier: "docs/research-program/inferences/sibling-p16-p17-brothers.md",
    logic: [
      "Shortest direct-claim support path (2 steps) linking this pair:",
      "parent P16 Salis (Meesuvvara) -> P15 Yoosuf (Bavanaadheeththa) (CLM-0285, SRC-MRF-KINGS)",
      "parent P15 Yoosuf (Bavanaadheeththa) -> P17 Davud (Sundhura Bavana) (CLM-0286, SRC-MRF-KINGS)",
      "This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.",
      "Current modeling choice remains `inferred` because explicit source wording that names `sibling` for P16 Salis (Meesuvvara) and P17 Davud (Sundhura Bavana) is still absent."
    ],
    verification: [
      "Promotion requirement: an A/B source statement explicitly naming P16 Salis (Meesuvvara) and P17 Davud (Sundhura Bavana) with relation class `sibling` (brothers).",
      "Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.",
      "Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster."
    ]
  }],
  [k("sibling", "P177", "P178", "siblings (shared parent)"), {
    summary: "P177 Yasmin Muizzu and P178 Umair Muizzu are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p177-p178-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P172 Mohamed Muizzu -> P177 Yasmin Muizzu (CLM-0308, SRC-WIKI-MUIZZU, grade B); excerpt: Wikipedia raw infobox issue field lists Yasmin Muizzu as child of Mohamed Muizzu. (pair: P172 Mohamed Muizzu -> P177 Yasmin Muizzu).",
      "Supporting edge: parent P172 Mohamed Muizzu -> P178 Umair Muizzu (CLM-0309, SRC-WIKI-MUIZZU, grade B); excerpt: Wikipedia raw infobox issue field lists Umair Muizzu as child of Mohamed Muizzu. (pair: P172 Mohamed Muizzu -> P178 Umair Muizzu).",
      "Rule application (shared-parent-sibling): because both endpoints share parent P172 Mohamed Muizzu, P177 Yasmin Muizzu and P178 Umair Muizzu are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P177 Yasmin Muizzu and P178 Umair Muizzu as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P177", "P179", "siblings (shared parent)"), {
    summary: "P177 Yasmin Muizzu and P179 Zaid Muizzu are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p177-p179-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P172 Mohamed Muizzu -> P177 Yasmin Muizzu (CLM-0308, SRC-WIKI-MUIZZU, grade B); excerpt: Wikipedia raw infobox issue field lists Yasmin Muizzu as child of Mohamed Muizzu. (pair: P172 Mohamed Muizzu -> P177 Yasmin Muizzu).",
      "Supporting edge: parent P172 Mohamed Muizzu -> P179 Zaid Muizzu (CLM-0310, SRC-WIKI-MUIZZU, grade B); excerpt: Wikipedia raw infobox issue field lists Zaid Muizzu as child of Mohamed Muizzu. (pair: P172 Mohamed Muizzu -> P179 Zaid Muizzu).",
      "Rule application (shared-parent-sibling): because both endpoints share parent P172 Mohamed Muizzu, P177 Yasmin Muizzu and P179 Zaid Muizzu are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P177 Yasmin Muizzu and P179 Zaid Muizzu as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P178", "P179", "siblings (shared parent)"), {
    summary: "P178 Umair Muizzu and P179 Zaid Muizzu are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p178-p179-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P172 Mohamed Muizzu -> P178 Umair Muizzu (CLM-0309, SRC-WIKI-MUIZZU, grade B); excerpt: Wikipedia raw infobox issue field lists Umair Muizzu as child of Mohamed Muizzu. (pair: P172 Mohamed Muizzu -> P178 Umair Muizzu).",
      "Supporting edge: parent P172 Mohamed Muizzu -> P179 Zaid Muizzu (CLM-0310, SRC-WIKI-MUIZZU, grade B); excerpt: Wikipedia raw infobox issue field lists Zaid Muizzu as child of Mohamed Muizzu. (pair: P172 Mohamed Muizzu -> P179 Zaid Muizzu).",
      "Rule application (shared-parent-sibling): because both endpoints share parent P172 Mohamed Muizzu, P178 Umair Muizzu and P179 Zaid Muizzu are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P178 Umair Muizzu and P179 Zaid Muizzu as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P190", "P191", "siblings (shared parent)"), {
    summary: "P190 Hassan Fareed Didi and P191 Ibrahim Fareed Didi are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p190-p191-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P111 Prince Abdul Majeed Didi -> P190 Hassan Fareed Didi (CLM-0233, SRC-WIKI-HASSAN-FARID, grade B); excerpt: Hassan Farid Didi family/genealogy content lists P111 Prince Abdul Majeed Didi as parent of P190 Hassan Fareed Didi.",
      "Supporting edge: parent P111 Prince Abdul Majeed Didi -> P191 Ibrahim Fareed Didi (CLM-0234, SRC-WIKI-IBRAHIM-FAREED, grade B); excerpt: Ibrahim Fareed Didi family/genealogy content lists P111 Prince Abdul Majeed Didi as parent of P191 Ibrahim Fareed Didi.",
      "Rule application (shared-parent-sibling): because both endpoints share parent P111 Prince Abdul Majeed Didi, P190 Hassan Fareed Didi and P191 Ibrahim Fareed Didi are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P190 Hassan Fareed Didi and P191 Ibrahim Fareed Didi as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P190", "P95", "siblings (shared parent)"), {
    summary: "P190 Hassan Fareed Didi and P95 Mohamed Farid (Keerithi Maha Radun) are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p190-p95-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P111 Prince Abdul Majeed Didi -> P190 Hassan Fareed Didi (CLM-0233, SRC-WIKI-HASSAN-FARID, grade B); excerpt: Hassan Farid Didi family/genealogy content lists P111 Prince Abdul Majeed Didi as parent of P190 Hassan Fareed Didi.",
      "Supporting edge: parent P111 Prince Abdul Majeed Didi -> P95 Mohamed Farid (Keerithi Maha Radun) (CLM-0235, SRC-WIKI-ABDUL-MAJEED, grade B); excerpt: Abdul Majeed Didi family/genealogy content lists P111 Prince Abdul Majeed Didi as parent of P95 Mohamed Farid.",
      "Rule application (shared-parent-sibling): because both endpoints share parent P111 Prince Abdul Majeed Didi, P190 Hassan Fareed Didi and P95 Mohamed Farid (Keerithi Maha Radun) are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P190 Hassan Fareed Didi and P95 Mohamed Farid (Keerithi Maha Radun) as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P191", "P95", "siblings (shared parent)"), {
    summary: "P191 Ibrahim Fareed Didi and P95 Mohamed Farid (Keerithi Maha Radun) are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p191-p95-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P111 Prince Abdul Majeed Didi -> P191 Ibrahim Fareed Didi (CLM-0234, SRC-WIKI-IBRAHIM-FAREED, grade B); excerpt: Ibrahim Fareed Didi family/genealogy content lists P111 Prince Abdul Majeed Didi as parent of P191 Ibrahim Fareed Didi.",
      "Supporting edge: parent P111 Prince Abdul Majeed Didi -> P95 Mohamed Farid (Keerithi Maha Radun) (CLM-0235, SRC-WIKI-ABDUL-MAJEED, grade B); excerpt: Abdul Majeed Didi family/genealogy content lists P111 Prince Abdul Majeed Didi as parent of P95 Mohamed Farid.",
      "Rule application (shared-parent-sibling): because both endpoints share parent P111 Prince Abdul Majeed Didi, P191 Ibrahim Fareed Didi and P95 Mohamed Farid (Keerithi Maha Radun) are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P191 Ibrahim Fareed Didi and P95 Mohamed Farid (Keerithi Maha Radun) as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P19", "P25", "half-siblings"), {
    summary: "P19 Ahmed Shihabuddine (Loka Aadheeththa) and P25 Raadhaafathi (Suvama Abarana) are modeled as `sibling` with label `half-siblings` to preserve a targeted continuity claim without over-promoting certainty.",
    dossier: "docs/research-program/inferences/sibling-p19-p25-half-siblings.md",
    logic: [
      "Shortest direct-claim support path (2 steps) linking this pair:",
      "parent P19 Ahmed Shihabuddine (Loka Aadheeththa) -> P18 Omar Veeru (Loka Abarana) (CLM-0316, SRC-IBN-BATTUTA-RIHLA)",
      "parent P18 Omar Veeru (Loka Abarana) -> P25 Raadhaafathi (Suvama Abarana) (CLM-0318, SRC-MRF-KINGS)",
      "This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.",
      "Current modeling choice remains `inferred` because explicit source wording that names `sibling` for P19 Ahmed Shihabuddine (Loka Aadheeththa) and P25 Raadhaafathi (Suvama Abarana) is still absent."
    ],
    verification: [
      "Promotion requirement: an A/B source statement explicitly naming P19 Ahmed Shihabuddine (Loka Aadheeththa) and P25 Raadhaafathi (Suvama Abarana) with relation class `sibling` (half-siblings).",
      "Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.",
      "Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster."
    ]
  }],
  [k("sibling", "P202", "P193", "siblings (shared parent)"), {
    summary: "P202 Kamba Dio and P193 Princess Recca are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p193-p202-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P202 Kamba Dio (CLM-0597, SRC-MRF-HILAALY, grade B); excerpt: Direct parent relation recorded between Aboobakuru as parent of Kamba Dio.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P193 Princess Recca (CLM-0337, SRC-MRF-KINGS, grade B); excerpt: Kings list and Hilaaly branch notes together support parent edge P40 to P193.",
      "Rule application (shared-parent-sibling): because both endpoints share parent P40 Aboobakuru (Bavana Sooja), P202 Kamba Dio and P193 Princess Recca are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P202 Kamba Dio and P193 Princess Recca as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P208", "P219", "siblings (shared parent)"), {
    summary: "P208 Princess Aysha Rani Kilege and P219 Umar Ma'afai Kilege are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p208-p219-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P208 Princess Aysha Rani Kilege (CLM-0602, SRC-MRF-KINGS, grade B); excerpt: Direct parent relation recorded between Kalu Mohamed as parent of Princess Aysha Rani Kilege.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P219 Umar Ma'afai Kilege (CLM-0603, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Kalu Mohamed as parent of Umar Ma'afai Kilege.",
      "Rule application (shared-parent-sibling): because both endpoints share parent P51 Kalu Mohamed (Dhammaru Bavana), P208 Princess Aysha Rani Kilege and P219 Umar Ma'afai Kilege are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P208 Princess Aysha Rani Kilege and P219 Umar Ma'afai Kilege as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P208", "P220", "siblings (shared parent)"), {
    summary: "P208 Princess Aysha Rani Kilege and P220 Ahmad Manikufa'anu Kalaminja are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p208-p220-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P208 Princess Aysha Rani Kilege (CLM-0602, SRC-MRF-KINGS, grade B); excerpt: Direct parent relation recorded between Kalu Mohamed as parent of Princess Aysha Rani Kilege.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P220 Ahmad Manikufa'anu Kalaminja (CLM-0604, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Kalu Mohamed as parent of Ahmad Manikufa'anu Kalaminja.",
      "Rule application (shared-parent-sibling): because both endpoints share parent P51 Kalu Mohamed (Dhammaru Bavana), P208 Princess Aysha Rani Kilege and P220 Ahmad Manikufa'anu Kalaminja are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P208 Princess Aysha Rani Kilege and P220 Ahmad Manikufa'anu Kalaminja as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P209", "P210", "siblings (shared parent)"), {
    summary: "P209 Dom Francisco de Malvidas and P210 Dom Pedro de Malvidas are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p209-p210-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P209 Dom Francisco de Malvidas (CLM-0605, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry under Dom Manoel lists Dom Francisco de Malvidas among the children of Dom Manoel and Dona Leonor de Ataide.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P210 Dom Pedro de Malvidas (CLM-0606, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry under Dom Manoel lists Dom Pedro de Malvidas among the children of Dom Manoel and Dona Leonor de Ataide.",
      "Rule application (shared-parent-sibling): because both endpoints share parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka), P209 Dom Francisco de Malvidas and P210 Dom Pedro de Malvidas are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P209 Dom Francisco de Malvidas and P210 Dom Pedro de Malvidas as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P209", "P211", "siblings (shared parent)"), {
    summary: "P209 Dom Francisco de Malvidas and P211 Dona Leonor de Malvidas are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p209-p211-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P209 Dom Francisco de Malvidas (CLM-0605, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry under Dom Manoel lists Dom Francisco de Malvidas among the children of Dom Manoel and Dona Leonor de Ataide.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P211 Dona Leonor de Malvidas (CLM-0607, SRC-ROYALARK-M16, grade B); excerpt: RoyalArk lineage entry under Dom Manoel lists Dona Leonor de Malvidas as a daughter in the same Dom Manoel and Dona Leonor de Ataide branch.",
      "Rule application (shared-parent-sibling): because both endpoints share parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka), P209 Dom Francisco de Malvidas and P211 Dona Leonor de Malvidas are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P209 Dom Francisco de Malvidas and P211 Dona Leonor de Malvidas as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P209", "P212", "siblings (shared parent)"), {
    summary: "P209 Dom Francisco de Malvidas and P212 Dona Catarina de Malvidas are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p209-p212-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P209 Dom Francisco de Malvidas (CLM-0605, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry under Dom Manoel lists Dom Francisco de Malvidas among the children of Dom Manoel and Dona Leonor de Ataide.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P212 Dona Catarina de Malvidas (CLM-0608, SRC-ROYALARK-M16, grade B); excerpt: RoyalArk lineage entry under Dom Manoel lists Dona Catarina de Malvidas as a daughter in the same Dom Manoel and Dona Leonor de Ataide branch.",
      "Rule application (shared-parent-sibling): because both endpoints share parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka), P209 Dom Francisco de Malvidas and P212 Dona Catarina de Malvidas are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P209 Dom Francisco de Malvidas and P212 Dona Catarina de Malvidas as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P210", "P211", "siblings (shared parent)"), {
    summary: "P210 Dom Pedro de Malvidas and P211 Dona Leonor de Malvidas are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p210-p211-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P210 Dom Pedro de Malvidas (CLM-0606, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry under Dom Manoel lists Dom Pedro de Malvidas among the children of Dom Manoel and Dona Leonor de Ataide.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P211 Dona Leonor de Malvidas (CLM-0607, SRC-ROYALARK-M16, grade B); excerpt: RoyalArk lineage entry under Dom Manoel lists Dona Leonor de Malvidas as a daughter in the same Dom Manoel and Dona Leonor de Ataide branch.",
      "Rule application (shared-parent-sibling): because both endpoints share parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka), P210 Dom Pedro de Malvidas and P211 Dona Leonor de Malvidas are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P210 Dom Pedro de Malvidas and P211 Dona Leonor de Malvidas as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P210", "P212", "siblings (shared parent)"), {
    summary: "P210 Dom Pedro de Malvidas and P212 Dona Catarina de Malvidas are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p210-p212-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P210 Dom Pedro de Malvidas (CLM-0606, SRC-ROYALARK-M16, grade A); excerpt: RoyalArk lineage entry under Dom Manoel lists Dom Pedro de Malvidas among the children of Dom Manoel and Dona Leonor de Ataide.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P212 Dona Catarina de Malvidas (CLM-0608, SRC-ROYALARK-M16, grade B); excerpt: RoyalArk lineage entry under Dom Manoel lists Dona Catarina de Malvidas as a daughter in the same Dom Manoel and Dona Leonor de Ataide branch.",
      "Rule application (shared-parent-sibling): because both endpoints share parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka), P210 Dom Pedro de Malvidas and P212 Dona Catarina de Malvidas are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P210 Dom Pedro de Malvidas and P212 Dona Catarina de Malvidas as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P211", "P212", "siblings (shared parent)"), {
    summary: "P211 Dona Leonor de Malvidas and P212 Dona Catarina de Malvidas are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p211-p212-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P211 Dona Leonor de Malvidas (CLM-0607, SRC-ROYALARK-M16, grade B); excerpt: RoyalArk lineage entry under Dom Manoel lists Dona Leonor de Malvidas as a daughter in the same Dom Manoel and Dona Leonor de Ataide branch.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P212 Dona Catarina de Malvidas (CLM-0608, SRC-ROYALARK-M16, grade B); excerpt: RoyalArk lineage entry under Dom Manoel lists Dona Catarina de Malvidas as a daughter in the same Dom Manoel and Dona Leonor de Ataide branch.",
      "Rule application (shared-parent-sibling): because both endpoints share parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka), P211 Dona Leonor de Malvidas and P212 Dona Catarina de Malvidas are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P211 Dona Leonor de Malvidas and P212 Dona Catarina de Malvidas as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P219", "P220", "siblings (shared parent)"), {
    summary: "P219 Umar Ma'afai Kilege and P220 Ahmad Manikufa'anu Kalaminja are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p219-p220-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P219 Umar Ma'afai Kilege (CLM-0603, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Kalu Mohamed as parent of Umar Ma'afai Kilege.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P220 Ahmad Manikufa'anu Kalaminja (CLM-0604, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Kalu Mohamed as parent of Ahmad Manikufa'anu Kalaminja.",
      "Rule application (shared-parent-sibling): because both endpoints share parent P51 Kalu Mohamed (Dhammaru Bavana), P219 Umar Ma'afai Kilege and P220 Ahmad Manikufa'anu Kalaminja are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P219 Umar Ma'afai Kilege and P220 Ahmad Manikufa'anu Kalaminja as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P31", "P39", "brothers"), {
    summary: "P31 Ibrahim (Dhammaru Veeru) and P39 Yoosuf (Loka Aananadha) are modeled as `sibling` with label `brothers` to preserve a targeted continuity claim without over-promoting certainty.",
    dossier: "docs/research-program/inferences/sibling-p31-p39-brothers.md",
    logic: [
      "Shortest direct-claim support path (2 steps) linking this pair:",
      "parent P31 Ibrahim (Dhammaru Veeru) -> P30 Hassan (Bavana) (CLM-0333, SRC-MRF-KINGS)",
      "parent P30 Hassan (Bavana) -> P39 Yoosuf (Loka Aananadha) (CLM-0334, SRC-MRF-KINGS)",
      "This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.",
      "Current modeling choice remains `inferred` because explicit source wording that names `sibling` for P31 Ibrahim (Dhammaru Veeru) and P39 Yoosuf (Loka Aananadha) is still absent."
    ],
    verification: [
      "Promotion requirement: an A/B source statement explicitly naming P31 Ibrahim (Dhammaru Veeru) and P39 Yoosuf (Loka Aananadha) with relation class `sibling` (brothers).",
      "Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.",
      "Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster."
    ]
  }],
  [k("sibling", "P31", "P40", "brothers"), {
    summary: "P31 Ibrahim (Dhammaru Veeru) and P40 Aboobakuru (Bavana Sooja) are modeled as `sibling` with label `brothers` to preserve a targeted continuity claim without over-promoting certainty.",
    dossier: "docs/research-program/inferences/sibling-p31-p40-brothers.md",
    logic: [
      "Shortest direct-claim support path (2 steps) linking this pair:",
      "parent P31 Ibrahim (Dhammaru Veeru) -> P30 Hassan (Bavana) (CLM-0333, SRC-MRF-KINGS)",
      "parent P30 Hassan (Bavana) -> P40 Aboobakuru (Bavana Sooja) (CLM-0335, SRC-MRF-KINGS)",
      "This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.",
      "Current modeling choice remains `inferred` because explicit source wording that names `sibling` for P31 Ibrahim (Dhammaru Veeru) and P40 Aboobakuru (Bavana Sooja) is still absent."
    ],
    verification: [
      "Promotion requirement: an A/B source statement explicitly naming P31 Ibrahim (Dhammaru Veeru) and P40 Aboobakuru (Bavana Sooja) with relation class `sibling` (brothers).",
      "Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.",
      "Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster."
    ]
  }],
  [k("sibling", "P41", "P46", "siblings (shared parent)"), {
    summary: "P41 Hadi Hassan (Raadha Veeru) and P46 Omar (Loka Sundhura) are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p41-p46-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P39 Yoosuf (Loka Aananadha) -> P41 Hadi Hassan (Raadha Veeru) (CLM-0596, SRC-ROYALARK-MALDIVES, grade B); excerpt: RoyalArk Maldives lineage reconstruction gives Yoosuf (P39) as father of Hadi Hassan (P41), which aligns with current canonical parent selection.",
      "Supporting edge: parent P39 Yoosuf (Loka Aananadha) -> P46 Omar (Loka Sundhura) (CLM-0336, SRC-MRF-KINGS, grade B); excerpt: Kings list records parent edge P39 to P46.",
      "Rule application (shared-parent-sibling): because both endpoints share parent P39 Yoosuf (Loka Aananadha), P41 Hadi Hassan (Raadha Veeru) and P46 Omar (Loka Sundhura) are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P41 Hadi Hassan (Raadha Veeru) and P46 Omar (Loka Sundhura) as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P47", "P51", "brothers"), {
    summary: "P47 Hassan (Raadha Aanandha) and P51 Kalu Mohamed (Dhammaru Bavana) are modeled as `sibling` with label `brothers` to preserve a targeted continuity claim without over-promoting certainty.",
    dossier: "docs/research-program/inferences/sibling-p47-p51-brothers.md",
    logic: [
      "Shortest direct-claim support path (1 step) linking this pair:",
      "sibling P47 Hassan (Raadha Aanandha) <-> P51 Kalu Mohamed (Dhammaru Bavana) [half-brothers] (CLM-0639, SRC-ROYALARK-MALDIVES)",
      "This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.",
      "Current modeling choice remains `inferred` because explicit source wording that names `sibling` for P47 Hassan (Raadha Aanandha) and P51 Kalu Mohamed (Dhammaru Bavana) is still absent."
    ],
    verification: [
      "Promotion requirement: an A/B source statement explicitly naming P47 Hassan (Raadha Aanandha) and P51 Kalu Mohamed (Dhammaru Bavana) with relation class `sibling` (brothers).",
      "Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.",
      "Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster."
    ]
  }],
  [k("sibling", "P47", "P52", "brothers"), {
    summary: "P47 Hassan (Raadha Aanandha) and P52 Yoosuf (Veeru Aanandha) are modeled as `sibling` with label `brothers` to preserve a targeted continuity claim without over-promoting certainty.",
    dossier: "docs/research-program/inferences/sibling-p47-p52-brothers.md",
    logic: [
      "Shortest direct-claim support path (2 steps) linking this pair:",
      "parent P47 Hassan (Raadha Aanandha) -> P46 Omar (Loka Sundhura) (CLM-0341, SRC-MRF-KINGS)",
      "parent P46 Omar (Loka Sundhura) -> P52 Yoosuf (Veeru Aanandha) (CLM-0344, SRC-MRF-KINGS)",
      "This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.",
      "Current modeling choice remains `inferred` because explicit source wording that names `sibling` for P47 Hassan (Raadha Aanandha) and P52 Yoosuf (Veeru Aanandha) is still absent."
    ],
    verification: [
      "Promotion requirement: an A/B source statement explicitly naming P47 Hassan (Raadha Aanandha) and P52 Yoosuf (Veeru Aanandha) with relation class `sibling` (brothers).",
      "Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.",
      "Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster."
    ]
  }],
  [k("sibling", "P59", "P208", "siblings (shared parent)"), {
    summary: "P59 Hassan of Shiraz (Ram Mani Loka) and P208 Princess Aysha Rani Kilege are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p208-p59-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P59 Hassan of Shiraz (Ram Mani Loka) (CLM-0345, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P51 Kalu Mohamed as parent of P59 Hassan of Shiraz.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P208 Princess Aysha Rani Kilege (CLM-0602, SRC-MRF-KINGS, grade B); excerpt: Direct parent relation recorded between Kalu Mohamed as parent of Princess Aysha Rani Kilege.",
      "Rule application (shared-parent-sibling): because both endpoints share parent P51 Kalu Mohamed (Dhammaru Bavana), P59 Hassan of Shiraz (Ram Mani Loka) and P208 Princess Aysha Rani Kilege are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P59 Hassan of Shiraz (Ram Mani Loka) and P208 Princess Aysha Rani Kilege as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P59", "P219", "siblings (shared parent)"), {
    summary: "P59 Hassan of Shiraz (Ram Mani Loka) and P219 Umar Ma'afai Kilege are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p219-p59-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P59 Hassan of Shiraz (Ram Mani Loka) (CLM-0345, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P51 Kalu Mohamed as parent of P59 Hassan of Shiraz.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P219 Umar Ma'afai Kilege (CLM-0603, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Kalu Mohamed as parent of Umar Ma'afai Kilege.",
      "Rule application (shared-parent-sibling): because both endpoints share parent P51 Kalu Mohamed (Dhammaru Bavana), P59 Hassan of Shiraz (Ram Mani Loka) and P219 Umar Ma'afai Kilege are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P59 Hassan of Shiraz (Ram Mani Loka) and P219 Umar Ma'afai Kilege as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P59", "P220", "siblings (shared parent)"), {
    summary: "P59 Hassan of Shiraz (Ram Mani Loka) and P220 Ahmad Manikufa'anu Kalaminja are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p220-p59-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P59 Hassan of Shiraz (Ram Mani Loka) (CLM-0345, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P51 Kalu Mohamed as parent of P59 Hassan of Shiraz.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P220 Ahmad Manikufa'anu Kalaminja (CLM-0604, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Kalu Mohamed as parent of Ahmad Manikufa'anu Kalaminja.",
      "Rule application (shared-parent-sibling): because both endpoints share parent P51 Kalu Mohamed (Dhammaru Bavana), P59 Hassan of Shiraz (Ram Mani Loka) and P220 Ahmad Manikufa'anu Kalaminja are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P59 Hassan of Shiraz (Ram Mani Loka) and P220 Ahmad Manikufa'anu Kalaminja as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P5", "P7", "brothers"), {
    summary: "P5 Dhinei (Fennaadheeththa) and P7 Wadi (Dhagathaa Suvara) are modeled as `sibling` with label `brothers` to preserve a targeted continuity claim without over-promoting certainty.",
    dossier: "docs/research-program/inferences/sibling-p5-p7-brothers.md",
    logic: [
      "Shortest direct-claim support path (2 steps) linking this pair:",
      "sibling P5 Dhinei (Fennaadheeththa) <-> P6 Dhilhel (Dhagathaa Abarana) [brothers] (CLM-0436, SRC-MRF-KINGS)",
      "sibling P6 Dhilhel (Dhagathaa Abarana) <-> P7 Wadi (Dhagathaa Suvara) [brothers] (CLM-0442, SRC-MRF-KINGS)",
      "This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.",
      "Current modeling choice remains `inferred` because explicit source wording that names `sibling` for P5 Dhinei (Fennaadheeththa) and P7 Wadi (Dhagathaa Suvara) is still absent."
    ],
    verification: [
      "Promotion requirement: an A/B source statement explicitly naming P5 Dhinei (Fennaadheeththa) and P7 Wadi (Dhagathaa Suvara) with relation class `sibling` (brothers).",
      "Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.",
      "Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster."
    ]
  }],
  [k("sibling", "P5", "P8", "brothers"), {
    summary: "P5 Dhinei (Fennaadheeththa) and P8 Valla Dio (Raa-Araa Desyara) are modeled as `sibling` with label `brothers` to preserve a targeted continuity claim without over-promoting certainty.",
    dossier: "docs/research-program/inferences/sibling-p5-p8-brothers.md",
    logic: [
      "Shortest direct-claim support path (2 steps) linking this pair:",
      "parent P5 Dhinei (Fennaadheeththa) -> P216 Fahi Hiriya Maava Kilage (CLM-0581, SRC-ROYALARK-MALDIVES)",
      "parent P216 Fahi Hiriya Maava Kilage -> P8 Valla Dio (Raa-Araa Desyara) (CLM-0584, SRC-ROYALARK-MALDIVES)",
      "This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.",
      "Current modeling choice remains `inferred` because explicit source wording that names `sibling` for P5 Dhinei (Fennaadheeththa) and P8 Valla Dio (Raa-Araa Desyara) is still absent."
    ],
    verification: [
      "Promotion requirement: an A/B source statement explicitly naming P5 Dhinei (Fennaadheeththa) and P8 Valla Dio (Raa-Araa Desyara) with relation class `sibling` (brothers).",
      "Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.",
      "Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster."
    ]
  }],
  [k("sibling", "P6", "P8", "brothers"), {
    summary: "P6 Dhilhel (Dhagathaa Abarana) and P8 Valla Dio (Raa-Araa Desyara) are modeled as `sibling` with label `brothers` to preserve a targeted continuity claim without over-promoting certainty.",
    dossier: "docs/research-program/inferences/sibling-p6-p8-brothers.md",
    logic: [
      "Shortest direct-claim support path (2 steps) linking this pair:",
      "sibling P6 Dhilhel (Dhagathaa Abarana) <-> P7 Wadi (Dhagathaa Suvara) [brothers] (CLM-0442, SRC-MRF-KINGS)",
      "sibling P7 Wadi (Dhagathaa Suvara) <-> P8 Valla Dio (Raa-Araa Desyara) [brothers] (CLM-0446, SRC-MRF-KINGS)",
      "This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.",
      "Current modeling choice remains `inferred` because explicit source wording that names `sibling` for P6 Dhilhel (Dhagathaa Abarana) and P8 Valla Dio (Raa-Araa Desyara) is still absent."
    ],
    verification: [
      "Promotion requirement: an A/B source statement explicitly naming P6 Dhilhel (Dhagathaa Abarana) and P8 Valla Dio (Raa-Araa Desyara) with relation class `sibling` (brothers).",
      "Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.",
      "Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster."
    ]
  }],
  [k("sibling", "P87", "P222", "siblings (shared parent)"), {
    summary: "P87 Ibrahim Nooredine (Keerithi Maha Radun) and P222 Hassan Izz ud-din are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p222-p87-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) -> P87 Ibrahim Nooredine (Keerithi Maha Radun) (CLM-0363, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P86 Mohamed Imaduddine as parent of P87 Ibrahim Nooredine.",
      "Supporting edge: parent P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) -> P222 Hassan Izz ud-din (CLM-0610, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Mohamed Imaduddine as parent of Hassan Izz ud-din.",
      "Rule application (shared-parent-sibling): because both endpoints share parent P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka), P87 Ibrahim Nooredine (Keerithi Maha Radun) and P222 Hassan Izz ud-din are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P87 Ibrahim Nooredine (Keerithi Maha Radun) and P222 Hassan Izz ud-din as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }]
]);

export function getInferenceNote(edge) {
  return INFERENCE_NOTES.get(inferenceEdgeKey(edge)) || null;
}

export function getCuratedInferenceNote(edge) {
  return getInferenceNote(edge);
}

export function getInferenceDossierPath(edge) {
  return getInferenceNote(edge)?.dossier || '';
}

export function isDerivedInferenceEdge(edge) {
  if (!edge) return false;
  if (edge.c !== 'i') return false;
  return (edge.evidence_refs || []).includes('SRC-DERIVED-RULES')
    || String(edge.event_context || '').startsWith('derived:');
}

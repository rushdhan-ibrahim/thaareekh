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

// Auto-synced from inference dossiers on 2026-02-08.
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
  [k("kin", "P100", "P98", "grandparent"), {
    summary: "P100 Mohamed Faamuladeyri Thakurufan and P98 Dom Maraduru Fandiaiy Thakurufan are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p100-p98-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P98 Dom Maraduru Fandiaiy Thakurufan -> P99 Hussain Daharadha Thakurufan (CLM-0370, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P98 Dom Maraduru Fandiaiy Thakurufan as parent of P99 Hussain Daharadha Thakurufan.",
      "Supporting edge: parent P99 Hussain Daharadha Thakurufan -> P100 Mohamed Faamuladeyri Thakurufan (CLM-0371, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P99 Hussain Daharadha Thakurufan as parent of P100 Mohamed Faamuladeyri Thakurufan.",
      "Rule application (parent-of-parent-grandparent): with source -> P99 Hussain Daharadha Thakurufan and P99 Hussain Daharadha Thakurufan -> target parent links, P100 Mohamed Faamuladeyri Thakurufan is modeled as inferred grandparent-line kin of P98 Dom Maraduru Fandiaiy Thakurufan.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P100 Mohamed Faamuladeyri Thakurufan and P98 Dom Maraduru Fandiaiy Thakurufan as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P101", "P97", "grandparent"), {
    summary: "P101 Donna Francisca Vasconcellos and P97 Dom Luis de Sousa are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p101-p97-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P101 Donna Francisca Vasconcellos -> P96 Donna Ines (CLM-0225, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P101 Donna Francisca Vasconcellos as parent of P96 Donna Ines.",
      "Supporting edge: parent P96 Donna Ines -> P97 Dom Luis de Sousa (CLM-0368, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P96 Donna Ines as parent of P97 Dom Luis de Sousa.",
      "Rule application (parent-of-parent-grandparent): with source -> P96 Donna Ines and P96 Donna Ines -> target parent links, P101 Donna Francisca Vasconcellos is modeled as inferred grandparent-line kin of P97 Dom Luis de Sousa.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P101 Donna Francisca Vasconcellos and P97 Dom Luis de Sousa as kin (grandparent).",
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
    summary: "This edge preserves a narrow lineage-continuity hypothesis between Mohamed Thakurufaanu al-Auzam and a later Utheemu sovereign node without overstating a proven direct blood line.",
    dossier: "docs/research-program/inferences/kin-p104-p68-reported-shared-utheemu-lineage-branch.md",
    logic: [
      "This pair is retained as inferred kin (reported shared Utheemu lineage branch) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.",
      "Supporting claim CLM-0227: parent Hussain Thakurufan (P103) -> Mohamed Thakurufaanu al-Auzam (P104) (SRC-MRF-UTHEEM, grade A); excerpt: Utheem Dynasty family/genealogy content lists P103 Hussain Thakurufan as parent of P104 Mohamed Thakurufaanu al-Auzam.",
      "Supporting claim CLM-0228: parent Mohamed Thakurufaanu al-Auzam (P104) -> Ibrahim Kalaafaan (P106) (SRC-MRF-UTHEEM, grade B); excerpt: Utheem Dynasty family/genealogy content lists P104 Mohamed Thakurufaanu al-Auzam as parent of P106 Ibrahim Kalaafaan.",
      "Supporting claim CLM-0372: sibling Mohamed Thakurufaanu al-Auzam (P104) -> Hassan Thakurufan (P105) [brothers] (SRC-MRF-UTHEEM, grade B); excerpt: Utheem Dynasty family/genealogy content links P104 Mohamed Thakurufaanu al-Auzam and P105 Hassan Thakurufan as siblings (brothers).",
      "Supporting claim CLM-0350: parent Mohamed Imaduddine (P68) -> Iskander Ibrahim (P69) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P68 Mohamed Imaduddine as parent of P69 Iskander Ibrahim.",
      "Combined interpretation: these anchors keep the pair in-model as inferred kin (reported shared Utheemu lineage branch), but not promoted to confirmed until explicit pairwise wording is found.",
      "Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement."
    ],
    verification: [
      "Promotion requirement: A/B wording that explicitly names P104 and P68 in one statement with a concrete kin class.",
      "Downgrade/removal trigger: Primary-source branch evidence that separates P104 and P68 into non-overlapping lines.",
      "Review cadence: Re-check after each Utheemu chronicle/manuscript extraction batch."
    ]
  }],
  [k("kin", "P105", "P106", "aunt/uncle↔niece/nephew"), {
    summary: "P105 Hassan Thakurufan and P106 Ibrahim Kalaafaan are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p105-p106-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P104 Mohamed Thakurufaanu al-Auzam -> P106 Ibrahim Kalaafaan (CLM-0228, SRC-MRF-UTHEEM, grade B); excerpt: Utheem Dynasty family/genealogy content lists P104 Mohamed Thakurufaanu al-Auzam as parent of P106 Ibrahim Kalaafaan.",
      "Supporting edge: sibling P104 Mohamed Thakurufaanu al-Auzam <-> P105 Hassan Thakurufan [brothers] (CLM-0372, SRC-MRF-UTHEEM, grade B); excerpt: Utheem Dynasty family/genealogy content links P104 Mohamed Thakurufaanu al-Auzam and P105 Hassan Thakurufan as siblings (brothers).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P104 Mohamed Thakurufaanu al-Auzam, P105 Hassan Thakurufan) plus parent(P104 Mohamed Thakurufaanu al-Auzam, child) yields inferred aunt/uncle-line kin between P105 Hassan Thakurufan and P106 Ibrahim Kalaafaan.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P105 Hassan Thakurufan and P106 Ibrahim Kalaafaan as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
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
  [k("kin", "P108", "P31", "grandparent"), {
    summary: "P108 Kulhiveri Hilaal Kaiulhanna Kaloge and P31 Ibrahim (Dhammaru Veeru) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p108-p31-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P108 Kulhiveri Hilaal Kaiulhanna Kaloge -> P30 Hassan (Bavana) (CLM-0230, SRC-MRF-HILAALY, grade B); excerpt: Royal House of Hilaaly family/genealogy content lists P108 Kulhiveri Hilaal Kaiulhanna Kaloge as parent of P30 Hassan.",
      "Supporting edge: parent P30 Hassan (Bavana) -> P31 Ibrahim (Dhammaru Veeru) (CLM-0333, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P31 Ibrahim.",
      "Rule application (parent-of-parent-grandparent): with source -> P30 Hassan (Bavana) and P30 Hassan (Bavana) -> target parent links, P108 Kulhiveri Hilaal Kaiulhanna Kaloge is modeled as inferred grandparent-line kin of P31 Ibrahim (Dhammaru Veeru).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P108 Kulhiveri Hilaal Kaiulhanna Kaloge and P31 Ibrahim (Dhammaru Veeru) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P108", "P38", "aunt/uncle↔niece/nephew"), {
    summary: "P108 Kulhiveri Hilaal Kaiulhanna Kaloge and P38 Danna Mohamed (Raadha Bavana) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p108-p38-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P192 Yusuf Handeygirin -> P38 Danna Mohamed (Raadha Bavana) (CLM-0326, SRC-MRF-HILAALY, grade B); excerpt: Hilaaly branch source gives parent edge P192 to P38.",
      "Supporting edge: sibling P108 Kulhiveri Hilaal Kaiulhanna Kaloge <-> P192 Yusuf Handeygirin [brothers] (CLM-0373, SRC-MRF-HILAALY, grade B); excerpt: Royal House of Hilaaly family/genealogy content links P108 Kulhiveri Hilaal Kaiulhanna Kaloge and P192 Yusuf Handeygirin as siblings (brothers).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P192 Yusuf Handeygirin, P108 Kulhiveri Hilaal Kaiulhanna Kaloge) plus parent(P192 Yusuf Handeygirin, child) yields inferred aunt/uncle-line kin between P108 Kulhiveri Hilaal Kaiulhanna Kaloge and P38 Danna Mohamed (Raadha Bavana).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P108 Kulhiveri Hilaal Kaiulhanna Kaloge and P38 Danna Mohamed (Raadha Bavana) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P108", "P39", "grandparent"), {
    summary: "P108 Kulhiveri Hilaal Kaiulhanna Kaloge and P39 Yoosuf (Loka Aananadha) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p108-p39-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P108 Kulhiveri Hilaal Kaiulhanna Kaloge -> P30 Hassan (Bavana) (CLM-0230, SRC-MRF-HILAALY, grade B); excerpt: Royal House of Hilaaly family/genealogy content lists P108 Kulhiveri Hilaal Kaiulhanna Kaloge as parent of P30 Hassan.",
      "Supporting edge: parent P30 Hassan (Bavana) -> P39 Yoosuf (Loka Aananadha) (CLM-0334, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P39 Yoosuf.",
      "Rule application (parent-of-parent-grandparent): with source -> P30 Hassan (Bavana) and P30 Hassan (Bavana) -> target parent links, P108 Kulhiveri Hilaal Kaiulhanna Kaloge is modeled as inferred grandparent-line kin of P39 Yoosuf (Loka Aananadha).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P108 Kulhiveri Hilaal Kaiulhanna Kaloge and P39 Yoosuf (Loka Aananadha) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P108", "P40", "grandparent"), {
    summary: "P108 Kulhiveri Hilaal Kaiulhanna Kaloge and P40 Aboobakuru (Bavana Sooja) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p108-p40-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P108 Kulhiveri Hilaal Kaiulhanna Kaloge -> P30 Hassan (Bavana) (CLM-0230, SRC-MRF-HILAALY, grade B); excerpt: Royal House of Hilaaly family/genealogy content lists P108 Kulhiveri Hilaal Kaiulhanna Kaloge as parent of P30 Hassan.",
      "Supporting edge: parent P30 Hassan (Bavana) -> P40 Aboobakuru (Bavana Sooja) (CLM-0335, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P40 Aboobakuru.",
      "Rule application (parent-of-parent-grandparent): with source -> P30 Hassan (Bavana) and P30 Hassan (Bavana) -> target parent links, P108 Kulhiveri Hilaal Kaiulhanna Kaloge is modeled as inferred grandparent-line kin of P40 Aboobakuru (Bavana Sooja).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P108 Kulhiveri Hilaal Kaiulhanna Kaloge and P40 Aboobakuru (Bavana Sooja) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P109", "P30", "grandparent"), {
    summary: "P109 Muslim Abbas of Hilaal and P30 Hassan (Bavana) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p109-p30-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P109 Muslim Abbas of Hilaal -> P108 Kulhiveri Hilaal Kaiulhanna Kaloge (CLM-0231, SRC-MRF-HILAALY, grade B); excerpt: Royal House of Hilaaly family/genealogy content lists P109 Muslim Abbas of Hilaal as parent of P108 Kulhiveri Hilaal Kaiulhanna Kaloge.",
      "Supporting edge: parent P108 Kulhiveri Hilaal Kaiulhanna Kaloge -> P30 Hassan (Bavana) (CLM-0230, SRC-MRF-HILAALY, grade B); excerpt: Royal House of Hilaaly family/genealogy content lists P108 Kulhiveri Hilaal Kaiulhanna Kaloge as parent of P30 Hassan.",
      "Rule application (parent-of-parent-grandparent): with source -> P108 Kulhiveri Hilaal Kaiulhanna Kaloge and P108 Kulhiveri Hilaal Kaiulhanna Kaloge -> target parent links, P109 Muslim Abbas of Hilaal is modeled as inferred grandparent-line kin of P30 Hassan (Bavana).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P109 Muslim Abbas of Hilaal and P30 Hassan (Bavana) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P110", "P115", "reported kin relation in elite Didi line"), {
    summary: "This edge holds a conservative elite-line kin claim between Mohamed Amin Didi and Ibrahim Nasir where profile evidence supports overlapping family networks but not explicit pairwise wording.",
    dossier: "docs/research-program/inferences/kin-p110-p115-reported-kin-relation-in-elite-didi-line.md",
    logic: [
      "This pair is retained as inferred kin (reported kin relation in elite Didi line) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.",
      "Supporting claim CLM-0236: parent Roanugey Aishath Didi (P112) -> Mohamed Amin Didi (P110) (SRC-PO-AMIN, grade A); excerpt: Official former-president profile states Mohamed Amin was born as son of Ahmed Didi and Nayaage Aishath Didi. (pair: P112 Roanugey Aishath Didi -> P110 Mohamed Amin Didi).",
      "Supporting claim CLM-0244: parent Ahmed Didi (P116) -> Ibrahim Nasir (P115) (SRC-PO-NASIR, grade A); excerpt: Official former-president profile states Ibrahim Nasir was son of Ahmed Didi and Nayaage Aishath Didi. (pair: P116 Ahmed Didi -> P115 Ibrahim Nasir).",
      "Supporting claim CLM-0245: parent Nayaage Aishath Didi (P117) -> Ibrahim Nasir (P115) (SRC-PO-NASIR, grade A); excerpt: Official former-president profile states Ibrahim Nasir was son of Ahmed Didi and Nayaage Aishath Didi. (pair: P117 Nayaage Aishath Didi -> P115 Ibrahim Nasir).",
      "Supporting claim CLM-0232: parent Mohamed Amin Didi (P110) -> Ameena Mohamed Amin (P114) (SRC-WIKI-AMIN-DIDI, grade B); excerpt: Mohamed Amin Didi family/genealogy content lists P110 Mohamed Amin Didi as parent of P114 Ameena Mohamed Amin.",
      "Combined interpretation: these anchors keep the pair in-model as inferred kin (reported kin relation in elite Didi line), but not promoted to confirmed until explicit pairwise wording is found.",
      "Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement."
    ],
    verification: [
      "Promotion requirement: Official or scholarly A/B source explicitly stating the exact relationship between P110 and P115.",
      "Downgrade/removal trigger: Contradictory official lineage statements that place the two in distinct non-kin family lines.",
      "Review cadence: Re-check after each modern-profile corroboration wave and archival family registry pass."
    ]
  }],
  [k("kin", "P111", "P115", "reported extended Didi lineage"), {
    summary: "This edge captures an extended Didi-line continuity claim between Prince Abdul Majeed Didi and Ibrahim Nasir while keeping the relation class broad until direct pairwise evidence is found.",
    dossier: "docs/research-program/inferences/kin-p111-p115-reported-extended-didi-lineage.md",
    logic: [
      "This pair is retained as inferred kin (reported extended Didi lineage) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.",
      "Supporting claim CLM-0233: parent Prince Abdul Majeed Didi (P111) -> Hassan Fareed Didi (P190) (SRC-WIKI-HASSAN-FARID, grade B); excerpt: Hassan Farid Didi family/genealogy content lists P111 Prince Abdul Majeed Didi as parent of P190 Hassan Fareed Didi.",
      "Supporting claim CLM-0234: parent Prince Abdul Majeed Didi (P111) -> Ibrahim Fareed Didi (P191) (SRC-WIKI-IBRAHIM-FAREED, grade B); excerpt: Ibrahim Fareed Didi family/genealogy content lists P111 Prince Abdul Majeed Didi as parent of P191 Ibrahim Fareed Didi.",
      "Supporting claim CLM-0235: parent Prince Abdul Majeed Didi (P111) -> Mohamed Farid (P95) (SRC-WIKI-ABDUL-MAJEED, grade B); excerpt: Abdul Majeed Didi family/genealogy content lists P111 Prince Abdul Majeed Didi as parent of P95 Mohamed Farid.",
      "Supporting claim CLM-0244: parent Ahmed Didi (P116) -> Ibrahim Nasir (P115) (SRC-PO-NASIR, grade A); excerpt: Official former-president profile states Ibrahim Nasir was son of Ahmed Didi and Nayaage Aishath Didi. (pair: P116 Ahmed Didi -> P115 Ibrahim Nasir).",
      "Combined interpretation: these anchors keep the pair in-model as inferred kin (reported extended Didi lineage), but not promoted to confirmed until explicit pairwise wording is found.",
      "Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement."
    ],
    verification: [
      "Promotion requirement: A/B source sentence that directly names P111 and P115 with explicit kin wording.",
      "Downgrade/removal trigger: High-quality genealogical source assigning non-overlapping parentage that breaks the implied continuity.",
      "Review cadence: Re-check after each modern Didi branch-source ingestion batch."
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
  [k("kin", "P114", "P136", "grandparent"), {
    summary: "P114 Ameena Mohamed Amin and P136 Ahmed Dhoshimeynaa Kilegefaanu are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p114-p136-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P136 Ahmed Dhoshimeynaa Kilegefaanu -> P110 Mohamed Amin Didi (CLM-0271, SRC-PO-AMIN, grade A); excerpt: Official former-president profile states Mohamed Amin was born as son of Ahmed Didi and Nayaage Aishath Didi. (pair: P136 Ahmed Dhoshimeynaa Kilege...",
      "Supporting edge: parent P110 Mohamed Amin Didi -> P114 Ameena Mohamed Amin (CLM-0232, SRC-WIKI-AMIN-DIDI, grade B); excerpt: Mohamed Amin Didi family/genealogy content lists P110 Mohamed Amin Didi as parent of P114 Ameena Mohamed Amin.",
      "Rule application (parent-of-parent-grandparent): with source -> P110 Mohamed Amin Didi and P110 Mohamed Amin Didi -> target parent links, P114 Ameena Mohamed Amin is modeled as inferred grandparent-line kin of P136 Ahmed Dhoshimeynaa Kilegefaanu.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P114 Ameena Mohamed Amin and P136 Ahmed Dhoshimeynaa Kilegefaanu as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P115", "P137", "grandparent"), {
    summary: "P115 Ibrahim Nasir and P137 Moosa Didi are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p115-p137-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P137 Moosa Didi -> P117 Nayaage Aishath Didi (CLM-0272, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P137 Moosa Didi as parent of P117 Nayaage Aishath Didi.",
      "Supporting edge: parent P117 Nayaage Aishath Didi -> P115 Ibrahim Nasir (CLM-0245, SRC-PO-NASIR, grade A); excerpt: Official former-president profile states Ibrahim Nasir was son of Ahmed Didi and Nayaage Aishath Didi. (pair: P117 Nayaage Aishath Didi -> P115 Ibr...",
      "Rule application (parent-of-parent-grandparent): with source -> P117 Nayaage Aishath Didi and P117 Nayaage Aishath Didi -> target parent links, P115 Ibrahim Nasir is modeled as inferred grandparent-line kin of P137 Moosa Didi.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P115 Ibrahim Nasir and P137 Moosa Didi as kin (grandparent).",
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
  [k("kin", "P117", "P138", "grandparent"), {
    summary: "P117 Nayaage Aishath Didi and P138 Dhadimagu Ganduvaru Maryam Didi are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p117-p138-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P138 Dhadimagu Ganduvaru Maryam Didi -> P137 Moosa Didi (CLM-0273, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P138 Dhadimagu Ganduvaru Maryam Didi as parent of P137 Moosa Didi.",
      "Supporting edge: parent P137 Moosa Didi -> P117 Nayaage Aishath Didi (CLM-0272, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P137 Moosa Didi as parent of P117 Nayaage Aishath Didi.",
      "Rule application (parent-of-parent-grandparent): with source -> P137 Moosa Didi and P137 Moosa Didi -> target parent links, P117 Nayaage Aishath Didi is modeled as inferred grandparent-line kin of P138 Dhadimagu Ganduvaru Maryam Didi.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P117 Nayaage Aishath Didi and P138 Dhadimagu Ganduvaru Maryam Didi as kin (grandparent).",
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
  [k("kin", "P119", "P135", "grandparent"), {
    summary: "P119 Maumoon Abdul Gayoom and P135 Galolhu Sitti are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p119-p135-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P135 Galolhu Sitti -> P120 Abdul Gayoom Ibrahim (CLM-0270, SRC-WIKI-ABDUL-GAYOOM-IBRAHIM, grade B); excerpt: Abdul Gayoom Ibrahim family/genealogy content lists P135 Galolhu Sitti as parent of P120 Abdul Gayoom Ibrahim.",
      "Supporting edge: parent P120 Abdul Gayoom Ibrahim -> P119 Maumoon Abdul Gayoom (CLM-0252, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox father field names Abdul Gayoom Ibrahim as father of Maumoon Abdul Gayoom. (pair: P120 Abdul Gayoom Ibrahim -> P119 Maumoon A...",
      "Rule application (parent-of-parent-grandparent): with source -> P120 Abdul Gayoom Ibrahim and P120 Abdul Gayoom Ibrahim -> target parent links, P119 Maumoon Abdul Gayoom is modeled as inferred grandparent-line kin of P135 Galolhu Sitti.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P119 Maumoon Abdul Gayoom and P135 Galolhu Sitti as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P120", "P134", "grandparent"), {
    summary: "P120 Abdul Gayoom Ibrahim and P134 Galolhu Seedhi are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p120-p134-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P134 Galolhu Seedhi -> P135 Galolhu Sitti (CLM-0269, SRC-WIKI-ABDUL-GAYOOM-IBRAHIM, grade B); excerpt: Abdul Gayoom Ibrahim family/genealogy content lists P134 Galolhu Seedhi as parent of P135 Galolhu Sitti.",
      "Supporting edge: parent P135 Galolhu Sitti -> P120 Abdul Gayoom Ibrahim (CLM-0270, SRC-WIKI-ABDUL-GAYOOM-IBRAHIM, grade B); excerpt: Abdul Gayoom Ibrahim family/genealogy content lists P135 Galolhu Sitti as parent of P120 Abdul Gayoom Ibrahim.",
      "Rule application (parent-of-parent-grandparent): with source -> P135 Galolhu Sitti and P135 Galolhu Sitti -> target parent links, P120 Abdul Gayoom Ibrahim is modeled as inferred grandparent-line kin of P134 Galolhu Seedhi.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P120 Abdul Gayoom Ibrahim and P134 Galolhu Seedhi as kin (grandparent).",
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
  [k("kin", "P121", "P135", "grandparent"), {
    summary: "P121 Abdulla Yameen Abdul Gayoom and P135 Galolhu Sitti are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p121-p135-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P135 Galolhu Sitti -> P120 Abdul Gayoom Ibrahim (CLM-0270, SRC-WIKI-ABDUL-GAYOOM-IBRAHIM, grade B); excerpt: Abdul Gayoom Ibrahim family/genealogy content lists P135 Galolhu Sitti as parent of P120 Abdul Gayoom Ibrahim.",
      "Supporting edge: parent P120 Abdul Gayoom Ibrahim -> P121 Abdulla Yameen Abdul Gayoom (CLM-0253, SRC-PO-YAMEEN, grade A); excerpt: Official former-president profile states Abdulla Yameen is son of Abdul Gayoom Ibrahim. (pair: P120 Abdul Gayoom Ibrahim -> P121 Abdulla Yameen Abd...",
      "Rule application (parent-of-parent-grandparent): with source -> P120 Abdul Gayoom Ibrahim and P120 Abdul Gayoom Ibrahim -> target parent links, P121 Abdulla Yameen Abdul Gayoom is modeled as inferred grandparent-line kin of P135 Galolhu Sitti.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P121 Abdulla Yameen Abdul Gayoom and P135 Galolhu Sitti as kin (grandparent).",
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
    summary: "This edge preserves reported first-cousin framing between Mohamed Nasheed and Fazna Ahmed while current claims mostly document spouses and parent nodes around them rather than a direct cousin statement.",
    dossier: "docs/research-program/inferences/kin-p122-p168-reported-first-cousin-relation.md",
    logic: [
      "This pair is retained as inferred kin (reported first-cousin relation) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.",
      "Supporting claim CLM-0258: parent Abdul Sattar Umar (P127) -> Mohamed Nasheed (P122) (SRC-ATOLL-NASHEED-PARENTS, grade B); excerpt: Atoll Times report names Mohamed Nasheed’s father as Abdul Sattar Umar. (pair: P127 Abdul Sattar Umar -> P122 Mohamed Nasheed).",
      "Supporting claim CLM-0259: parent Abida Mohamed (P128) -> Mohamed Nasheed (P122) (SRC-ATOLL-NASHEED-PARENTS, grade B); excerpt: Atoll Times report names Mohamed Nasheed’s mother as Abida Mohamed. (pair: P128 Abida Mohamed -> P122 Mohamed Nasheed).",
      "Supporting claim CLM-0305: parent Fazna Ahmed (P168) -> Sarah Ibrahim Solih (P169) (SRC-WIKI-SOLIH, grade B); excerpt: Wikipedia raw infobox spouse and issue fields support Fazna Ahmed as spouse in the child list including Sarah Ibrahim Solih. (pair: P168 Fazna Ahmed -> P169 Sarah Ibrahim Solih).",
      "Supporting claim CLM-0306: parent Fazna Ahmed (P168) -> Yaman Ibrahim Solih (P170) (SRC-WIKI-SOLIH, grade B); excerpt: Wikipedia lead text states Ibrahim Mohamed Solih and his wife have a son named Yaman. (pair: P168 Fazna Ahmed -> P170 Yaman Ibrahim Solih).",
      "Supporting claim CLM-0460: spouse Ibrahim Mohamed Solih (P167) -> Fazna Ahmed (P168) [married] (SRC-WIKI-SOLIH, grade B); excerpt: Wikipedia lead text names Fazeena Ahmed as spouse of Ibrahim Mohamed Solih. (pair: P167 Ibrahim Mohamed Solih -> P168 Fazna Ahmed).",
      "Combined interpretation: these anchors keep the pair in-model as inferred kin (reported first-cousin relation), but not promoted to confirmed until explicit pairwise wording is found.",
      "Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement."
    ],
    verification: [
      "Promotion requirement: A/B source explicitly naming P122 and P168 as first cousins (or another exact cousin degree).",
      "Downgrade/removal trigger: Reliable family-tree evidence that contradicts shared ancestor assumptions.",
      "Review cadence: Re-check after modern civil-record corroboration and profile-source expansion."
    ]
  }],
  [k("kin", "P125", "P127", "grandparent"), {
    summary: "P125 Meera Laila Nasheed and P127 Abdul Sattar Umar are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p125-p127-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P127 Abdul Sattar Umar -> P122 Mohamed Nasheed (CLM-0258, SRC-ATOLL-NASHEED-PARENTS, grade B); excerpt: Atoll Times report names Mohamed Nasheed’s father as Abdul Sattar Umar. (pair: P127 Abdul Sattar Umar -> P122 Mohamed Nasheed).",
      "Supporting edge: parent P122 Mohamed Nasheed -> P125 Meera Laila Nasheed (CLM-0254, SRC-WIKI-NASHEED, grade B); excerpt: Wikipedia raw infobox issue field lists Meera Laila Nasheed as child of Mohamed Nasheed. (pair: P122 Mohamed Nasheed -> P125 Meera Laila Nasheed).",
      "Rule application (parent-of-parent-grandparent): with source -> P122 Mohamed Nasheed and P122 Mohamed Nasheed -> target parent links, P125 Meera Laila Nasheed is modeled as inferred grandparent-line kin of P127 Abdul Sattar Umar.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P125 Meera Laila Nasheed and P127 Abdul Sattar Umar as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P125", "P128", "grandparent"), {
    summary: "P125 Meera Laila Nasheed and P128 Abida Mohamed are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p125-p128-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P128 Abida Mohamed -> P122 Mohamed Nasheed (CLM-0259, SRC-ATOLL-NASHEED-PARENTS, grade B); excerpt: Atoll Times report names Mohamed Nasheed’s mother as Abida Mohamed. (pair: P128 Abida Mohamed -> P122 Mohamed Nasheed).",
      "Supporting edge: parent P122 Mohamed Nasheed -> P125 Meera Laila Nasheed (CLM-0254, SRC-WIKI-NASHEED, grade B); excerpt: Wikipedia raw infobox issue field lists Meera Laila Nasheed as child of Mohamed Nasheed. (pair: P122 Mohamed Nasheed -> P125 Meera Laila Nasheed).",
      "Rule application (parent-of-parent-grandparent): with source -> P122 Mohamed Nasheed and P122 Mohamed Nasheed -> target parent links, P125 Meera Laila Nasheed is modeled as inferred grandparent-line kin of P128 Abida Mohamed.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P125 Meera Laila Nasheed and P128 Abida Mohamed as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P126", "P127", "grandparent"), {
    summary: "P126 Zaya Laila Nasheed and P127 Abdul Sattar Umar are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p126-p127-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P127 Abdul Sattar Umar -> P122 Mohamed Nasheed (CLM-0258, SRC-ATOLL-NASHEED-PARENTS, grade B); excerpt: Atoll Times report names Mohamed Nasheed’s father as Abdul Sattar Umar. (pair: P127 Abdul Sattar Umar -> P122 Mohamed Nasheed).",
      "Supporting edge: parent P122 Mohamed Nasheed -> P126 Zaya Laila Nasheed (CLM-0255, SRC-WIKI-NASHEED, grade B); excerpt: Wikipedia raw infobox issue field lists Zaya Laila Nasheed as child of Mohamed Nasheed. (pair: P122 Mohamed Nasheed -> P126 Zaya Laila Nasheed).",
      "Rule application (parent-of-parent-grandparent): with source -> P122 Mohamed Nasheed and P122 Mohamed Nasheed -> target parent links, P126 Zaya Laila Nasheed is modeled as inferred grandparent-line kin of P127 Abdul Sattar Umar.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P126 Zaya Laila Nasheed and P127 Abdul Sattar Umar as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P126", "P128", "grandparent"), {
    summary: "P126 Zaya Laila Nasheed and P128 Abida Mohamed are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p126-p128-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P128 Abida Mohamed -> P122 Mohamed Nasheed (CLM-0259, SRC-ATOLL-NASHEED-PARENTS, grade B); excerpt: Atoll Times report names Mohamed Nasheed’s mother as Abida Mohamed. (pair: P128 Abida Mohamed -> P122 Mohamed Nasheed).",
      "Supporting edge: parent P122 Mohamed Nasheed -> P126 Zaya Laila Nasheed (CLM-0255, SRC-WIKI-NASHEED, grade B); excerpt: Wikipedia raw infobox issue field lists Zaya Laila Nasheed as child of Mohamed Nasheed. (pair: P122 Mohamed Nasheed -> P126 Zaya Laila Nasheed).",
      "Rule application (parent-of-parent-grandparent): with source -> P122 Mohamed Nasheed and P122 Mohamed Nasheed -> target parent links, P126 Zaya Laila Nasheed is modeled as inferred grandparent-line kin of P128 Abida Mohamed.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P126 Zaya Laila Nasheed and P128 Abida Mohamed as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P129", "P155", "aunt/uncle↔niece/nephew"), {
    summary: "P129 Princess Veyogey Dhon Goma and P155 Maandhoogey Bodu Dhorhy Manippulu are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p129-p155-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P87 Ibrahim Nooredine (Keerithi Maha Radun) -> P129 Princess Veyogey Dhon Goma (CLM-0364, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P87 Ibrahim Nooredine as parent of P129 Princess Veyogey Dhon Goma.",
      "Supporting edge: sibling P155 Maandhoogey Bodu Dhorhy Manippulu <-> P87 Ibrahim Nooredine (Keerithi Maha Radun) [siblings (shared parent)] (CLM-0406, SRC-DERIVED-RULES, grade C); excerpt: inferred sibling relation between P155 Maandhoogey Bodu Dhorhy Manippulu and P87 Ibrahim Nooredine from shared-parent rule chain.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P155 Maandhoogey Bodu Dhorhy Manippulu, P87 Ibrahim Nooredine) plus parent(P87 Ibrahim Nooredine, P129 Princess Veyogey Dhon Goma) yields inferred aunt/uncle-line kin between P129 Princess Veyogey Dhon Goma and P155 Maandhoogey Bodu Dhorhy Manippulu.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured, and one support edge is itself inferred."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P129 Princess Veyogey Dhon Goma and P155 Maandhoogey Bodu Dhorhy Manippulu as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P129", "P86", "grandparent"), {
    summary: "P129 Princess Veyogey Dhon Goma and P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p129-p86-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) -> P87 Ibrahim Nooredine (Keerithi Maha Radun) (CLM-0363, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P86 Mohamed Imaduddine as parent of P87 Ibrahim Nooredine.",
      "Rule application (parent-of-parent-grandparent): with source -> P87 Ibrahim Nooredine (Keerithi Maha Radun) and P87 Ibrahim Nooredine (Keerithi Maha Radun) -> target parent links, P129 Princess Veyogey Dhon Goma is modeled as inferred grandparent-line kin of P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P129 Princess Veyogey Dhon Goma and P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P129", "P88", "cousins"), {
    summary: "P129 Princess Veyogey Dhon Goma and P88 Mohamed Mueenuddine (Keerithi Maha Radun) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p129-p88-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P155 Maandhoogey Bodu Dhorhy Manippulu -> P88 Mohamed Mueenuddine (Keerithi Maha Radun) (CLM-0288, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P155 Maandhoogey Bodu Dhorhy Manippulu as parent of P88 Mohamed Mueenuddine.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P87 Ibrahim Nooredine (Keerithi Maha Radun) and P155 Maandhoogey Bodu Dhorhy Manippulu are modeled as inferred cousin-line kin (P129 Princess Veyogey Dhon Goma <-> P88 Mohamed Mueenuddine (Keerithi Maha Radun)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P129 Princess Veyogey Dhon Goma and P88 Mohamed Mueenuddine (Keerithi Maha Radun) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P129", "P92", "cousins"), {
    summary: "P129 Princess Veyogey Dhon Goma and P92 Mohamed Imaduddine VI (Keerithi Maha Radun) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p129-p92-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P155 Maandhoogey Bodu Dhorhy Manippulu -> P92 Mohamed Imaduddine VI (Keerithi Maha Radun) (CLM-0289, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P155 Maandhoogey Bodu Dhorhy Manippulu as parent of P92 Mohamed Imaduddine VI.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P87 Ibrahim Nooredine (Keerithi Maha Radun) and P155 Maandhoogey Bodu Dhorhy Manippulu are modeled as inferred cousin-line kin (P129 Princess Veyogey Dhon Goma <-> P92 Mohamed Imaduddine VI (Keerithi Maha Radun)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P129 Princess Veyogey Dhon Goma and P92 Mohamed Imaduddine VI (Keerithi Maha Radun) as kin (cousins).",
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
  [k("kin", "P13", "P5", "aunt/uncle↔niece/nephew"), {
    summary: "P13 Audha (Areedha Suvara) and P5 Dhinei (Fennaadheeththa) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p13-p5-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P7 Wadi (Dhagathaa Suvara) -> P13 Audha (Areedha Suvara) (CLM-0352, SRC-MRF-KINGS, grade B); excerpt: Kings list sequence indicates P7 as father of P13.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P7 Wadi (Dhagathaa Suvara), P5 Dhinei (Fennaadheeththa)) plus parent(P7 Wadi (Dhagathaa Suvara), child) yields inferred aunt/uncle-line kin between P13 Audha (Areedha Suvara) and P5 Dhinei (Fennaadheeththa).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P13 Audha (Areedha Suvara) and P5 Dhinei (Fennaadheeththa) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P13", "P6", "aunt/uncle↔niece/nephew"), {
    summary: "P13 Audha (Areedha Suvara) and P6 Dhilhel (Dhagathaa Abarana) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p13-p6-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P7 Wadi (Dhagathaa Suvara) -> P13 Audha (Areedha Suvara) (CLM-0352, SRC-MRF-KINGS, grade B); excerpt: Kings list sequence indicates P7 as father of P13.",
      "Supporting edge: sibling P6 Dhilhel (Dhagathaa Abarana) <-> P7 Wadi (Dhagathaa Suvara) [brothers] (CLM-0442, SRC-MRF-KINGS, grade B); excerpt: Kings list explicitly notes P6 and P7 as brothers.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P7 Wadi (Dhagathaa Suvara), P6 Dhilhel (Dhagathaa Abarana)) plus parent(P7 Wadi (Dhagathaa Suvara), child) yields inferred aunt/uncle-line kin between P13 Audha (Areedha Suvara) and P6 Dhilhel (Dhagathaa Abarana).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P13 Audha (Areedha Suvara) and P6 Dhilhel (Dhagathaa Abarana) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P13", "P8", "aunt/uncle↔niece/nephew"), {
    summary: "P13 Audha (Areedha Suvara) and P8 Valla Dio (Raa-Araa Desyara) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p13-p8-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P7 Wadi (Dhagathaa Suvara) -> P13 Audha (Areedha Suvara) (CLM-0352, SRC-MRF-KINGS, grade B); excerpt: Kings list sequence indicates P7 as father of P13.",
      "Supporting edge: sibling P7 Wadi (Dhagathaa Suvara) <-> P8 Valla Dio (Raa-Araa Desyara) [brothers] (CLM-0446, SRC-MRF-KINGS, grade B); excerpt: Kings list explicitly notes P7 and P8 as brothers.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P7 Wadi (Dhagathaa Suvara), P8 Valla Dio (Raa-Araa Desyara)) plus parent(P7 Wadi (Dhagathaa Suvara), child) yields inferred aunt/uncle-line kin between P13 Audha (Areedha Suvara) and P8 Valla Dio (Raa-Araa Desyara).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P13 Audha (Areedha Suvara) and P8 Valla Dio (Raa-Araa Desyara) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P130", "P132", "possible southern-branch continuity (Addu/Fuvahmulah)"), {
    summary: "This edge holds a cautious southern-branch continuity hypothesis between Prince Ibrahim Faamuladheyri Kilegefaanu and the Addu Naib line, pending direct documentary lineage phrasing.",
    dossier: "docs/research-program/inferences/kin-p130-p132-possible-southern-branch-continuity-addu-fuvahmulah.md",
    logic: [
      "This pair is retained as inferred kin (possible southern-branch continuity (Addu/Fuvahmulah)) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.",
      "Supporting claim CLM-0359: parent Mohamed Ghiyathuddine (P81) -> Prince Ibrahim Faamuladheyri Kilegefaanu (P130) (SRC-WIKI-PRINCE-IBRAHIM-FAAMULADHEYRI, grade B); excerpt: Prince Ibrahim, Faamuladheyri Kilegefaanu family/genealogy content lists P81 Mohamed Ghiyathuddine as parent of P130 Prince Ibrahim Faamuladheyri Kilegefaanu.",
      "Supporting claim CLM-0265: parent Prince Ibrahim Faamuladheyri Kilegefaanu (P130) -> Mohamed Didi (P131) (SRC-WIKI-PRINCE-IBRAHIM-FAAMULADHEYRI, grade B); excerpt: Prince Ibrahim, Faamuladheyri Kilegefaanu family/genealogy content lists P130 Prince Ibrahim Faamuladheyri Kilegefaanu as parent of P131 Mohamed Didi.",
      "Supporting claim CLM-0266: parent Prince Ibrahim Faamuladheyri Kilegefaanu (P130) -> Al-Nabeel Karayye Hassan Didi (P140) (SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P130 Prince Ibrahim Faamuladheyri Kilegefaanu as parent of P140 Al-Nabeel Karayye Hassan Didi.",
      "Supporting claim CLM-0267: parent Prince Ibrahim Faamuladheyri Kilegefaanu (P130) -> Princess Aishath Didi (P180) (SRC-MRF-MIDU-ROYAL, grade B); excerpt: Midu Royal Family Branch (Addu/Meedhoo records) family/genealogy content lists P130 Prince Ibrahim Faamuladheyri Kilegefaanu as parent of P180 Princess Aishath Didi.",
      "Supporting claim CLM-0070: kin Al-Naib Muhammad Thakurufaanu of Addu (P132) -> Ibrahim Al-Husainee (P133) [grandparental line context] (SRC-WIKI-ABDUL-GAYOOM-IBRAHIM, grade B); excerpt: Abdul Gayoom Ibrahim dynastic context links P132 Al-Naib Muhammad Thakurufaanu of Addu and P133 Ibrahim Al-Husainee in kin relation (grandparental line context).",
      "Combined interpretation: these anchors keep the pair in-model as inferred kin (possible southern-branch continuity (Addu/Fuvahmulah)), but not promoted to confirmed until explicit pairwise wording is found.",
      "Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement."
    ],
    verification: [
      "Promotion requirement: A/B branch record or chronicle passage explicitly naming P130 and P132 as related with relation class.",
      "Downgrade/removal trigger: Primary southern records that assign separate non-overlapping descent lines.",
      "Review cadence: Re-check whenever Addu/Fuvahmulah corroboration queue items are completed."
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
  [k("kin", "P130", "P78", "grandparent"), {
    summary: "P130 Prince Ibrahim Faamuladheyri Kilegefaanu and P78 Ibrahim Iskander (Rannava Loka) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p130-p78-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P78 Ibrahim Iskander (Rannava Loka) -> P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) (CLM-0356, SRC-WIKI-MONARCHS, grade B); excerpt: List of Maldivian monarchs family/genealogy content lists P78 Ibrahim Iskander as parent of P81 Mohamed Ghiyathuddine.",
      "Supporting edge: parent P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) -> P130 Prince Ibrahim Faamuladheyri Kilegefaanu (CLM-0359, SRC-WIKI-PRINCE-IBRAHIM-FAAMULADHEYRI, grade B); excerpt: Prince Ibrahim, Faamuladheyri Kilegefaanu family/genealogy content lists P81 Mohamed Ghiyathuddine as parent of P130 Prince Ibrahim Faamuladheyri K...",
      "Rule application (parent-of-parent-grandparent): with source -> P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) and P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) -> target parent links, P130 Prince Ibrahim Faamuladheyri Kilegefaanu is modeled as inferred grandparent-line kin of P78 Ibrahim Iskander (Rannava Loka).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P130 Prince Ibrahim Faamuladheyri Kilegefaanu and P78 Ibrahim Iskander (Rannava Loka) as kin (grandparent).",
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
  [k("kin", "P131", "P81", "grandparent"), {
    summary: "P131 Mohamed Didi and P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p131-p81-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) -> P130 Prince Ibrahim Faamuladheyri Kilegefaanu (CLM-0359, SRC-WIKI-PRINCE-IBRAHIM-FAAMULADHEYRI, grade B); excerpt: Prince Ibrahim, Faamuladheyri Kilegefaanu family/genealogy content lists P81 Mohamed Ghiyathuddine as parent of P130 Prince Ibrahim Faamuladheyri K...",
      "Supporting edge: parent P130 Prince Ibrahim Faamuladheyri Kilegefaanu -> P131 Mohamed Didi (CLM-0265, SRC-WIKI-PRINCE-IBRAHIM-FAAMULADHEYRI, grade B); excerpt: Prince Ibrahim, Faamuladheyri Kilegefaanu family/genealogy content lists P130 Prince Ibrahim Faamuladheyri Kilegefaanu as parent of P131 Mohamed Didi.",
      "Rule application (parent-of-parent-grandparent): with source -> P130 Prince Ibrahim Faamuladheyri Kilegefaanu and P130 Prince Ibrahim Faamuladheyri Kilegefaanu -> target parent links, P131 Mohamed Didi is modeled as inferred grandparent-line kin of P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P131 Mohamed Didi and P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P132", "P182", "reported Addu/Meedhoo branch continuity"), {
    summary: "This edge records a reported continuity link between Al-Naib Muhammad Thakurufaanu of Addu and El-Naib Ganduvaru Mohamed Thakurufan where the current basis is branch-context and spouse/descendant adjacency.",
    dossier: "docs/research-program/inferences/kin-p132-p182-reported-addu-meedhoo-branch-continuity.md",
    logic: [
      "This pair is retained as inferred kin (reported Addu/Meedhoo branch continuity) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.",
      "Supporting claim CLM-0070: kin Al-Naib Muhammad Thakurufaanu of Addu (P132) -> Ibrahim Al-Husainee (P133) [grandparental line context] (SRC-WIKI-ABDUL-GAYOOM-IBRAHIM, grade B); excerpt: Abdul Gayoom Ibrahim dynastic context links P132 Al-Naib Muhammad Thakurufaanu of Addu and P133 Ibrahim Al-Husainee in kin relation (grandparental line context).",
      "Supporting claim CLM-0320: parent El-Naib Ganduvaru Mohamed Thakurufan (P182) -> Ganduvaru Hassan Didi (P183) (SRC-MRF-MIDU-ROYAL, grade B); excerpt: Midu Royal Family Branch (Addu/Meedhoo records) family/genealogy content lists P182 El-Naib Ganduvaru Mohamed Thakurufan as parent of P183 Ganduvaru Hassan Didi.",
      "Supporting claim CLM-0463: spouse Princess Aishath Didi (P180) -> El-Naib Ganduvaru Mohamed Thakurufan (P182) [married] (SRC-MRF-MIDU-ROYAL, grade B); excerpt: Midu Royal Family Branch (Addu/Meedhoo records) family/genealogy content links P180 Princess Aishath Didi and P182 El-Naib Ganduvaru Mohamed Thakurufan as spouses (married).",
      "Combined interpretation: these anchors keep the pair in-model as inferred kin (reported Addu/Meedhoo branch continuity), but not promoted to confirmed until explicit pairwise wording is found.",
      "Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement."
    ],
    verification: [
      "Promotion requirement: A/B source line explicitly connecting P132 and P182 by named kin relation.",
      "Downgrade/removal trigger: Higher-grade branch documentation that separates the two lineages.",
      "Review cadence: Re-check after each Addu/Meedhoo source extraction increment."
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
  [k("kin", "P137", "P139", "grandparent"), {
    summary: "P137 Moosa Didi and P139 Hussain Didi are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p137-p139-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P139 Hussain Didi -> P138 Dhadimagu Ganduvaru Maryam Didi (CLM-0274, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P139 Hussain Didi as parent of P138 Dhadimagu Ganduvaru Maryam Didi.",
      "Supporting edge: parent P138 Dhadimagu Ganduvaru Maryam Didi -> P137 Moosa Didi (CLM-0273, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P138 Dhadimagu Ganduvaru Maryam Didi as parent of P137 Moosa Didi.",
      "Rule application (parent-of-parent-grandparent): with source -> P138 Dhadimagu Ganduvaru Maryam Didi and P138 Dhadimagu Ganduvaru Maryam Didi -> target parent links, P137 Moosa Didi is modeled as inferred grandparent-line kin of P139 Hussain Didi.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P137 Moosa Didi and P139 Hussain Didi as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P138", "P140", "grandparent"), {
    summary: "P138 Dhadimagu Ganduvaru Maryam Didi and P140 Al-Nabeel Karayye Hassan Didi are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p138-p140-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P140 Al-Nabeel Karayye Hassan Didi -> P139 Hussain Didi (CLM-0275, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P140 Al-Nabeel Karayye Hassan Didi as parent of P139 Hussain Didi.",
      "Supporting edge: parent P139 Hussain Didi -> P138 Dhadimagu Ganduvaru Maryam Didi (CLM-0274, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P139 Hussain Didi as parent of P138 Dhadimagu Ganduvaru Maryam Didi.",
      "Rule application (parent-of-parent-grandparent): with source -> P139 Hussain Didi and P139 Hussain Didi -> target parent links, P138 Dhadimagu Ganduvaru Maryam Didi is modeled as inferred grandparent-line kin of P140 Al-Nabeel Karayye Hassan Didi.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P138 Dhadimagu Ganduvaru Maryam Didi and P140 Al-Nabeel Karayye Hassan Didi as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P139", "P180", "aunt/uncle↔niece/nephew"), {
    summary: "P139 Hussain Didi and P180 Princess Aishath Didi are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p139-p180-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P140 Al-Nabeel Karayye Hassan Didi -> P139 Hussain Didi (CLM-0275, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P140 Al-Nabeel Karayye Hassan Didi as parent of P139 Hussain Didi.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P140 Al-Nabeel Karayye Hassan Didi, P180 Princess Aishath Didi) plus parent(P140 Al-Nabeel Karayye Hassan Didi, child) yields inferred aunt/uncle-line kin between P139 Hussain Didi and P180 Princess Aishath Didi.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P139 Hussain Didi and P180 Princess Aishath Didi as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
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
  [k("kin", "P14", "P7", "grandparent"), {
    summary: "P14 Hali (Areedha Suvara) and P7 Wadi (Dhagathaa Suvara) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p14-p7-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P7 Wadi (Dhagathaa Suvara) -> P13 Audha (Areedha Suvara) (CLM-0352, SRC-MRF-KINGS, grade B); excerpt: Kings list sequence indicates P7 as father of P13.",
      "Supporting edge: parent P13 Audha (Areedha Suvara) -> P14 Hali (Areedha Suvara) (CLM-0263, SRC-MRF-KINGS, grade B); excerpt: Kings list gives P14 as son of P13 in the early Lunar succession sequence.",
      "Rule application (parent-of-parent-grandparent): with source -> P13 Audha (Areedha Suvara) and P13 Audha (Areedha Suvara) -> target parent links, P14 Hali (Areedha Suvara) is modeled as inferred grandparent-line kin of P7 Wadi (Dhagathaa Suvara).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P14 Hali (Areedha Suvara) and P7 Wadi (Dhagathaa Suvara) as kin (grandparent).",
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
  [k("kin", "P140", "P81", "grandparent"), {
    summary: "P140 Al-Nabeel Karayye Hassan Didi and P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p140-p81-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) -> P130 Prince Ibrahim Faamuladheyri Kilegefaanu (CLM-0359, SRC-WIKI-PRINCE-IBRAHIM-FAAMULADHEYRI, grade B); excerpt: Prince Ibrahim, Faamuladheyri Kilegefaanu family/genealogy content lists P81 Mohamed Ghiyathuddine as parent of P130 Prince Ibrahim Faamuladheyri K...",
      "Supporting edge: parent P130 Prince Ibrahim Faamuladheyri Kilegefaanu -> P140 Al-Nabeel Karayye Hassan Didi (CLM-0266, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P130 Prince Ibrahim Faamuladheyri Kilegefaanu as parent of P140 Al-Nabeel Karayye Hassan Didi.",
      "Rule application (parent-of-parent-grandparent): with source -> P130 Prince Ibrahim Faamuladheyri Kilegefaanu and P130 Prince Ibrahim Faamuladheyri Kilegefaanu -> target parent links, P140 Al-Nabeel Karayye Hassan Didi is modeled as inferred grandparent-line kin of P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P140 Al-Nabeel Karayye Hassan Didi and P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
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
  [k("kin", "P15", "P7", "grandparent"), {
    summary: "P15 Yoosuf (Bavanaadheeththa) and P7 Wadi (Dhagathaa Suvara) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p15-p7-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P7 Wadi (Dhagathaa Suvara) -> P13 Audha (Areedha Suvara) (CLM-0352, SRC-MRF-KINGS, grade B); excerpt: Kings list sequence indicates P7 as father of P13.",
      "Rule application (parent-of-parent-grandparent): with source -> P13 Audha (Areedha Suvara) and P13 Audha (Areedha Suvara) -> target parent links, P15 Yoosuf (Bavanaadheeththa) is modeled as inferred grandparent-line kin of P7 Wadi (Dhagathaa Suvara).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P15 Yoosuf (Bavanaadheeththa) and P7 Wadi (Dhagathaa Suvara) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P150", "P198", "aunt/uncle↔niece/nephew"), {
    summary: "P150 Dunya Maumoon and P198 Ilyas Ibrahim are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p150-p198-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P149 Nasreena Ibrahim -> P150 Dunya Maumoon (CLM-0281, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox spouse and issue fields support Nasreena Ibrahim as spouse in the child list including Dunya Maumoon. (pair: P149 Nasreena Ib...",
      "Supporting edge: sibling P149 Nasreena Ibrahim <-> P198 Ilyas Ibrahim [siblings] (CLM-0398, SRC-WIKI-ILYAS-IBRAHIM, grade B); excerpt: Ilyas Ibrahim family/genealogy content links P149 Nasreena Ibrahim and P198 Ilyas Ibrahim as siblings (siblings).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P149 Nasreena Ibrahim, P198 Ilyas Ibrahim) plus parent(P149 Nasreena Ibrahim, child) yields inferred aunt/uncle-line kin between P150 Dunya Maumoon and P198 Ilyas Ibrahim.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P150 Dunya Maumoon and P198 Ilyas Ibrahim as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P150", "P199", "aunt/uncle↔niece/nephew"), {
    summary: "P150 Dunya Maumoon and P199 Abbas Ibrahim are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p150-p199-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P149 Nasreena Ibrahim -> P150 Dunya Maumoon (CLM-0281, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox spouse and issue fields support Nasreena Ibrahim as spouse in the child list including Dunya Maumoon. (pair: P149 Nasreena Ib...",
      "Supporting edge: sibling P149 Nasreena Ibrahim <-> P199 Abbas Ibrahim [siblings] (CLM-0399, SRC-WIKI-ABBAS-IBRAHIM, grade B); excerpt: Abbas Ibrahim family/genealogy content links P149 Nasreena Ibrahim and P199 Abbas Ibrahim as siblings (siblings).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P149 Nasreena Ibrahim, P199 Abbas Ibrahim) plus parent(P149 Nasreena Ibrahim, child) yields inferred aunt/uncle-line kin between P150 Dunya Maumoon and P199 Abbas Ibrahim.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P150 Dunya Maumoon and P199 Abbas Ibrahim as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P151", "P198", "aunt/uncle↔niece/nephew"), {
    summary: "P151 Yumna Maumoon and P198 Ilyas Ibrahim are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p151-p198-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P149 Nasreena Ibrahim -> P151 Yumna Maumoon (CLM-0282, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox spouse and issue fields support Nasreena Ibrahim as spouse in the child list including Yumna Maumoon. (pair: P149 Nasreena Ib...",
      "Supporting edge: sibling P149 Nasreena Ibrahim <-> P198 Ilyas Ibrahim [siblings] (CLM-0398, SRC-WIKI-ILYAS-IBRAHIM, grade B); excerpt: Ilyas Ibrahim family/genealogy content links P149 Nasreena Ibrahim and P198 Ilyas Ibrahim as siblings (siblings).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P149 Nasreena Ibrahim, P198 Ilyas Ibrahim) plus parent(P149 Nasreena Ibrahim, child) yields inferred aunt/uncle-line kin between P151 Yumna Maumoon and P198 Ilyas Ibrahim.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P151 Yumna Maumoon and P198 Ilyas Ibrahim as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P151", "P199", "aunt/uncle↔niece/nephew"), {
    summary: "P151 Yumna Maumoon and P199 Abbas Ibrahim are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p151-p199-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P149 Nasreena Ibrahim -> P151 Yumna Maumoon (CLM-0282, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox spouse and issue fields support Nasreena Ibrahim as spouse in the child list including Yumna Maumoon. (pair: P149 Nasreena Ib...",
      "Supporting edge: sibling P149 Nasreena Ibrahim <-> P199 Abbas Ibrahim [siblings] (CLM-0399, SRC-WIKI-ABBAS-IBRAHIM, grade B); excerpt: Abbas Ibrahim family/genealogy content links P149 Nasreena Ibrahim and P199 Abbas Ibrahim as siblings (siblings).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P149 Nasreena Ibrahim, P199 Abbas Ibrahim) plus parent(P149 Nasreena Ibrahim, child) yields inferred aunt/uncle-line kin between P151 Yumna Maumoon and P199 Abbas Ibrahim.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P151 Yumna Maumoon and P199 Abbas Ibrahim as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P152", "P198", "aunt/uncle↔niece/nephew"), {
    summary: "P152 Faris Maumoon and P198 Ilyas Ibrahim are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p152-p198-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P149 Nasreena Ibrahim -> P152 Faris Maumoon (CLM-0283, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox spouse and issue fields support Nasreena Ibrahim as spouse in the child list including Faris Maumoon. (pair: P149 Nasreena Ib...",
      "Supporting edge: sibling P149 Nasreena Ibrahim <-> P198 Ilyas Ibrahim [siblings] (CLM-0398, SRC-WIKI-ILYAS-IBRAHIM, grade B); excerpt: Ilyas Ibrahim family/genealogy content links P149 Nasreena Ibrahim and P198 Ilyas Ibrahim as siblings (siblings).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P149 Nasreena Ibrahim, P198 Ilyas Ibrahim) plus parent(P149 Nasreena Ibrahim, child) yields inferred aunt/uncle-line kin between P152 Faris Maumoon and P198 Ilyas Ibrahim.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P152 Faris Maumoon and P198 Ilyas Ibrahim as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P152", "P199", "aunt/uncle↔niece/nephew"), {
    summary: "P152 Faris Maumoon and P199 Abbas Ibrahim are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p152-p199-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P149 Nasreena Ibrahim -> P152 Faris Maumoon (CLM-0283, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox spouse and issue fields support Nasreena Ibrahim as spouse in the child list including Faris Maumoon. (pair: P149 Nasreena Ib...",
      "Supporting edge: sibling P149 Nasreena Ibrahim <-> P199 Abbas Ibrahim [siblings] (CLM-0399, SRC-WIKI-ABBAS-IBRAHIM, grade B); excerpt: Abbas Ibrahim family/genealogy content links P149 Nasreena Ibrahim and P199 Abbas Ibrahim as siblings (siblings).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P149 Nasreena Ibrahim, P199 Abbas Ibrahim) plus parent(P149 Nasreena Ibrahim, child) yields inferred aunt/uncle-line kin between P152 Faris Maumoon and P199 Abbas Ibrahim.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P152 Faris Maumoon and P199 Abbas Ibrahim as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P153", "P198", "aunt/uncle↔niece/nephew"), {
    summary: "P153 Ghassan Maumoon and P198 Ilyas Ibrahim are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p153-p198-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P149 Nasreena Ibrahim -> P153 Ghassan Maumoon (CLM-0284, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox spouse and issue fields support Nasreena Ibrahim as spouse in the child list including Ghassan Maumoon. (pair: P149 Nasreena ...",
      "Supporting edge: sibling P149 Nasreena Ibrahim <-> P198 Ilyas Ibrahim [siblings] (CLM-0398, SRC-WIKI-ILYAS-IBRAHIM, grade B); excerpt: Ilyas Ibrahim family/genealogy content links P149 Nasreena Ibrahim and P198 Ilyas Ibrahim as siblings (siblings).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P149 Nasreena Ibrahim, P198 Ilyas Ibrahim) plus parent(P149 Nasreena Ibrahim, child) yields inferred aunt/uncle-line kin between P153 Ghassan Maumoon and P198 Ilyas Ibrahim.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P153 Ghassan Maumoon and P198 Ilyas Ibrahim as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P153", "P199", "aunt/uncle↔niece/nephew"), {
    summary: "P153 Ghassan Maumoon and P199 Abbas Ibrahim are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p153-p199-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P149 Nasreena Ibrahim -> P153 Ghassan Maumoon (CLM-0284, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox spouse and issue fields support Nasreena Ibrahim as spouse in the child list including Ghassan Maumoon. (pair: P149 Nasreena ...",
      "Supporting edge: sibling P149 Nasreena Ibrahim <-> P199 Abbas Ibrahim [siblings] (CLM-0399, SRC-WIKI-ABBAS-IBRAHIM, grade B); excerpt: Abbas Ibrahim family/genealogy content links P149 Nasreena Ibrahim and P199 Abbas Ibrahim as siblings (siblings).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P149 Nasreena Ibrahim, P199 Abbas Ibrahim) plus parent(P149 Nasreena Ibrahim, child) yields inferred aunt/uncle-line kin between P153 Ghassan Maumoon and P199 Abbas Ibrahim.",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P153 Ghassan Maumoon and P199 Abbas Ibrahim as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P155", "P85", "grandparent"), {
    summary: "P155 Maandhoogey Bodu Dhorhy Manippulu and P85 Mohamed Mueenuddine (Keerithi Maha Radun) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p155-p85-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P85 Mohamed Mueenuddine (Keerithi Maha Radun) -> P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) (CLM-0361, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P85 Mohamed Mueenuddine as parent of P86 Mohamed Imaduddine.",
      "Supporting edge: parent P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) -> P155 Maandhoogey Bodu Dhorhy Manippulu (CLM-0362, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P86 Mohamed Imaduddine as parent of P155 Maandhoogey Bodu Dhorhy Manippulu.",
      "Rule application (parent-of-parent-grandparent): with source -> P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) and P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) -> target parent links, P155 Maandhoogey Bodu Dhorhy Manippulu is modeled as inferred grandparent-line kin of P85 Mohamed Mueenuddine (Keerithi Maha Radun).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P155 Maandhoogey Bodu Dhorhy Manippulu and P85 Mohamed Mueenuddine (Keerithi Maha Radun) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P155", "P90", "aunt/uncle↔niece/nephew"), {
    summary: "P155 Maandhoogey Bodu Dhorhy Manippulu and P90 Mohamed Imaduddine V (Keerithi Maha Radun) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p155-p90-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P87 Ibrahim Nooredine (Keerithi Maha Radun) -> P90 Mohamed Imaduddine V (Keerithi Maha Radun) (CLM-0365, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P87 Ibrahim Nooredine as parent of P90 Mohamed Imaduddine V.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P87 Ibrahim Nooredine (Keerithi Maha Radun), P155 Maandhoogey Bodu Dhorhy Manippulu) plus parent(P87 Ibrahim Nooredine (Keerithi Maha Radun), child) yields inferred aunt/uncle-line kin between P155 Maandhoogey Bodu Dhorhy Manippulu and P90 Mohamed Imaduddine V (Keerithi Maha Radun).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P155 Maandhoogey Bodu Dhorhy Manippulu and P90 Mohamed Imaduddine V (Keerithi Maha Radun) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P155", "P91", "aunt/uncle↔niece/nephew"), {
    summary: "P155 Maandhoogey Bodu Dhorhy Manippulu and P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p155-p91-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P87 Ibrahim Nooredine (Keerithi Maha Radun) -> P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) (CLM-0366, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P87 Ibrahim Nooredine as parent of P91 Mohamed Shamsuddine III.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P87 Ibrahim Nooredine (Keerithi Maha Radun), P155 Maandhoogey Bodu Dhorhy Manippulu) plus parent(P87 Ibrahim Nooredine (Keerithi Maha Radun), child) yields inferred aunt/uncle-line kin between P155 Maandhoogey Bodu Dhorhy Manippulu and P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P155 Maandhoogey Bodu Dhorhy Manippulu and P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P155", "P94", "grandparent"), {
    summary: "P155 Maandhoogey Bodu Dhorhy Manippulu and P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p155-p94-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P155 Maandhoogey Bodu Dhorhy Manippulu -> P88 Mohamed Mueenuddine (Keerithi Maha Radun) (CLM-0288, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P155 Maandhoogey Bodu Dhorhy Manippulu as parent of P88 Mohamed Mueenuddine.",
      "Supporting edge: parent P88 Mohamed Mueenuddine (Keerithi Maha Radun) -> P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka) (CLM-0367, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P88 Mohamed Mueenuddine as parent of P94 Hassan Nooredine II.",
      "Rule application (parent-of-parent-grandparent): with source -> P88 Mohamed Mueenuddine (Keerithi Maha Radun) and P88 Mohamed Mueenuddine (Keerithi Maha Radun) -> target parent links, P155 Maandhoogey Bodu Dhorhy Manippulu is modeled as inferred grandparent-line kin of P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P155 Maandhoogey Bodu Dhorhy Manippulu and P94 Hassan Nooredine II (Kula Sudha Ira Siyaaaka) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
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
  [k("kin", "P16", "P19", "aunt/uncle↔niece/nephew"), {
    summary: "P16 Salis (Meesuvvara) and P19 Ahmed Shihabuddine (Loka Aadheeththa) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p16-p19-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P18 Omar Veeru (Loka Abarana) -> P19 Ahmed Shihabuddine (Loka Aadheeththa) (CLM-0316, SRC-MRF-KINGS, grade B); excerpt: Kings list gives P19 as child of P18.",
      "Supporting edge: sibling P16 Salis (Meesuvvara) <-> P18 Omar Veeru (Loka Abarana) [half-brothers] (CLM-0408, SRC-MRF-KINGS, grade B); excerpt: Kings list marks P16 and P18 as half-brothers (maternal).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P18 Omar Veeru (Loka Abarana), P16 Salis (Meesuvvara)) plus parent(P18 Omar Veeru (Loka Abarana), child) yields inferred aunt/uncle-line kin between P16 Salis (Meesuvvara) and P19 Ahmed Shihabuddine (Loka Aadheeththa).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P16 Salis (Meesuvvara) and P19 Ahmed Shihabuddine (Loka Aadheeththa) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P16", "P20", "aunt/uncle↔niece/nephew"), {
    summary: "P16 Salis (Meesuvvara) and P20 Khadijah (Raadha Abarana) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p16-p20-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P18 Omar Veeru (Loka Abarana) -> P20 Khadijah (Raadha Abarana) (CLM-0317, SRC-MRF-KINGS, grade B); excerpt: Kings list gives P20 (Khadijah) as child of P18.",
      "Supporting edge: sibling P16 Salis (Meesuvvara) <-> P18 Omar Veeru (Loka Abarana) [half-brothers] (CLM-0408, SRC-MRF-KINGS, grade B); excerpt: Kings list marks P16 and P18 as half-brothers (maternal).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P18 Omar Veeru (Loka Abarana), P16 Salis (Meesuvvara)) plus parent(P18 Omar Veeru (Loka Abarana), child) yields inferred aunt/uncle-line kin between P16 Salis (Meesuvvara) and P20 Khadijah (Raadha Abarana).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P16 Salis (Meesuvvara) and P20 Khadijah (Raadha Abarana) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P16", "P25", "aunt/uncle↔niece/nephew"), {
    summary: "P16 Salis (Meesuvvara) and P25 Raadhaafathi (Suvama Abarana) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p16-p25-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P18 Omar Veeru (Loka Abarana) -> P25 Raadhaafathi (Suvama Abarana) (CLM-0318, SRC-MRF-KINGS, grade B); excerpt: Kings list gives P25 as child of P18 in the same household branch.",
      "Supporting edge: sibling P16 Salis (Meesuvvara) <-> P18 Omar Veeru (Loka Abarana) [half-brothers] (CLM-0408, SRC-MRF-KINGS, grade B); excerpt: Kings list marks P16 and P18 as half-brothers (maternal).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P18 Omar Veeru (Loka Abarana), P16 Salis (Meesuvvara)) plus parent(P18 Omar Veeru (Loka Abarana), child) yields inferred aunt/uncle-line kin between P16 Salis (Meesuvvara) and P25 Raadhaafathi (Suvama Abarana).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P16 Salis (Meesuvvara) and P25 Raadhaafathi (Suvama Abarana) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P169", "P171", "grandparent"), {
    summary: "P169 Sarah Ibrahim Solih and P171 Moomina Hassanfulhu are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p169-p171-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P171 Moomina Hassanfulhu -> P167 Ibrahim Mohamed Solih (CLM-0307, SRC-EDITION-SOLIH-MOTHER, grade B); excerpt: Edition obituary report identifies Aishath Khadheeja as mother of former President Ibrahim Mohamed Solih. (pair: P171 Moomina Hassanfulhu -> P167 I...",
      "Supporting edge: parent P167 Ibrahim Mohamed Solih -> P169 Sarah Ibrahim Solih (CLM-0303, SRC-WIKI-SOLIH, grade B); excerpt: Wikipedia raw infobox issue field lists Sarah Ibrahim Solih as child of Ibrahim Mohamed Solih. (pair: P167 Ibrahim Mohamed Solih -> P169 Sarah Ibra...",
      "Rule application (parent-of-parent-grandparent): with source -> P167 Ibrahim Mohamed Solih and P167 Ibrahim Mohamed Solih -> target parent links, P169 Sarah Ibrahim Solih is modeled as inferred grandparent-line kin of P171 Moomina Hassanfulhu.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P169 Sarah Ibrahim Solih and P171 Moomina Hassanfulhu as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P170", "P171", "grandparent"), {
    summary: "P170 Yaman Ibrahim Solih and P171 Moomina Hassanfulhu are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p170-p171-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P171 Moomina Hassanfulhu -> P167 Ibrahim Mohamed Solih (CLM-0307, SRC-EDITION-SOLIH-MOTHER, grade B); excerpt: Edition obituary report identifies Aishath Khadheeja as mother of former President Ibrahim Mohamed Solih. (pair: P171 Moomina Hassanfulhu -> P167 I...",
      "Supporting edge: parent P167 Ibrahim Mohamed Solih -> P170 Yaman Ibrahim Solih (CLM-0304, SRC-WIKI-SOLIH, grade B); excerpt: Wikipedia lead text states Ibrahim Mohamed Solih and his wife have a son named Yaman. (pair: P167 Ibrahim Mohamed Solih -> P170 Yaman Ibrahim Solih).",
      "Rule application (parent-of-parent-grandparent): with source -> P167 Ibrahim Mohamed Solih and P167 Ibrahim Mohamed Solih -> target parent links, P170 Yaman Ibrahim Solih is modeled as inferred grandparent-line kin of P171 Moomina Hassanfulhu.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P170 Yaman Ibrahim Solih and P171 Moomina Hassanfulhu as kin (grandparent).",
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
  [k("kin", "P180", "P81", "grandparent"), {
    summary: "P180 Princess Aishath Didi and P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p180-p81-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) -> P130 Prince Ibrahim Faamuladheyri Kilegefaanu (CLM-0359, SRC-WIKI-PRINCE-IBRAHIM-FAAMULADHEYRI, grade B); excerpt: Prince Ibrahim, Faamuladheyri Kilegefaanu family/genealogy content lists P81 Mohamed Ghiyathuddine as parent of P130 Prince Ibrahim Faamuladheyri K...",
      "Supporting edge: parent P130 Prince Ibrahim Faamuladheyri Kilegefaanu -> P180 Princess Aishath Didi (CLM-0267, SRC-MRF-MIDU-ROYAL, grade B); excerpt: Midu Royal Family Branch (Addu/Meedhoo records) family/genealogy content lists P130 Prince Ibrahim Faamuladheyri Kilegefaanu as parent of P180 Prin...",
      "Rule application (parent-of-parent-grandparent): with source -> P130 Prince Ibrahim Faamuladheyri Kilegefaanu and P130 Prince Ibrahim Faamuladheyri Kilegefaanu -> target parent links, P180 Princess Aishath Didi is modeled as inferred grandparent-line kin of P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P180 Princess Aishath Didi and P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
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
  [k("kin", "P190", "P87", "grandparent"), {
    summary: "P190 Hassan Fareed Didi and P87 Ibrahim Nooredine (Keerithi Maha Radun) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p190-p87-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P129 Princess Veyogey Dhon Goma -> P190 Hassan Fareed Didi (CLM-0260, SRC-WIKI-HASSAN-FARID, grade B); excerpt: Hassan Farid Didi family/genealogy content lists P129 Princess Veyogey Dhon Goma as parent of P190 Hassan Fareed Didi.",
      "Rule application (parent-of-parent-grandparent): with source -> P129 Princess Veyogey Dhon Goma and P129 Princess Veyogey Dhon Goma -> target parent links, P190 Hassan Fareed Didi is modeled as inferred grandparent-line kin of P87 Ibrahim Nooredine (Keerithi Maha Radun).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P190 Hassan Fareed Didi and P87 Ibrahim Nooredine (Keerithi Maha Radun) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P190", "P90", "aunt/uncle↔niece/nephew"), {
    summary: "P190 Hassan Fareed Didi and P90 Mohamed Imaduddine V (Keerithi Maha Radun) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p190-p90-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P129 Princess Veyogey Dhon Goma -> P190 Hassan Fareed Didi (CLM-0260, SRC-WIKI-HASSAN-FARID, grade B); excerpt: Hassan Farid Didi family/genealogy content lists P129 Princess Veyogey Dhon Goma as parent of P190 Hassan Fareed Didi.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P129 Princess Veyogey Dhon Goma, P90 Mohamed Imaduddine V (Keerithi Maha Radun)) plus parent(P129 Princess Veyogey Dhon Goma, child) yields inferred aunt/uncle-line kin between P190 Hassan Fareed Didi and P90 Mohamed Imaduddine V (Keerithi Maha Radun).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P190 Hassan Fareed Didi and P90 Mohamed Imaduddine V (Keerithi Maha Radun) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P190", "P91", "aunt/uncle↔niece/nephew"), {
    summary: "P190 Hassan Fareed Didi and P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p190-p91-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P129 Princess Veyogey Dhon Goma -> P190 Hassan Fareed Didi (CLM-0260, SRC-WIKI-HASSAN-FARID, grade B); excerpt: Hassan Farid Didi family/genealogy content lists P129 Princess Veyogey Dhon Goma as parent of P190 Hassan Fareed Didi.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P129 Princess Veyogey Dhon Goma, P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri)) plus parent(P129 Princess Veyogey Dhon Goma, child) yields inferred aunt/uncle-line kin between P190 Hassan Fareed Didi and P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P190 Hassan Fareed Didi and P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P191", "P87", "grandparent"), {
    summary: "P191 Ibrahim Fareed Didi and P87 Ibrahim Nooredine (Keerithi Maha Radun) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p191-p87-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P129 Princess Veyogey Dhon Goma -> P191 Ibrahim Fareed Didi (CLM-0261, SRC-WIKI-IBRAHIM-FAREED, grade B); excerpt: Ibrahim Fareed Didi family/genealogy content lists P129 Princess Veyogey Dhon Goma as parent of P191 Ibrahim Fareed Didi.",
      "Rule application (parent-of-parent-grandparent): with source -> P129 Princess Veyogey Dhon Goma and P129 Princess Veyogey Dhon Goma -> target parent links, P191 Ibrahim Fareed Didi is modeled as inferred grandparent-line kin of P87 Ibrahim Nooredine (Keerithi Maha Radun).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P191 Ibrahim Fareed Didi and P87 Ibrahim Nooredine (Keerithi Maha Radun) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P191", "P90", "aunt/uncle↔niece/nephew"), {
    summary: "P191 Ibrahim Fareed Didi and P90 Mohamed Imaduddine V (Keerithi Maha Radun) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p191-p90-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P129 Princess Veyogey Dhon Goma -> P191 Ibrahim Fareed Didi (CLM-0261, SRC-WIKI-IBRAHIM-FAREED, grade B); excerpt: Ibrahim Fareed Didi family/genealogy content lists P129 Princess Veyogey Dhon Goma as parent of P191 Ibrahim Fareed Didi.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P129 Princess Veyogey Dhon Goma, P90 Mohamed Imaduddine V (Keerithi Maha Radun)) plus parent(P129 Princess Veyogey Dhon Goma, child) yields inferred aunt/uncle-line kin between P191 Ibrahim Fareed Didi and P90 Mohamed Imaduddine V (Keerithi Maha Radun).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P191 Ibrahim Fareed Didi and P90 Mohamed Imaduddine V (Keerithi Maha Radun) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P191", "P91", "aunt/uncle↔niece/nephew"), {
    summary: "P191 Ibrahim Fareed Didi and P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p191-p91-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P129 Princess Veyogey Dhon Goma -> P191 Ibrahim Fareed Didi (CLM-0261, SRC-WIKI-IBRAHIM-FAREED, grade B); excerpt: Ibrahim Fareed Didi family/genealogy content lists P129 Princess Veyogey Dhon Goma as parent of P191 Ibrahim Fareed Didi.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P129 Princess Veyogey Dhon Goma, P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri)) plus parent(P129 Princess Veyogey Dhon Goma, child) yields inferred aunt/uncle-line kin between P191 Ibrahim Fareed Didi and P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P191 Ibrahim Fareed Didi and P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P193", "P30", "grandparent"), {
    summary: "P193 Princess Recca and P30 Hassan (Bavana) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p193-p30-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P30 Hassan (Bavana) -> P40 Aboobakuru (Bavana Sooja) (CLM-0335, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P40 Aboobakuru.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P193 Princess Recca (CLM-0337, SRC-MRF-KINGS, grade B); excerpt: Kings list and Hilaaly branch notes together support parent edge P40 to P193.",
      "Rule application (parent-of-parent-grandparent): with source -> P40 Aboobakuru (Bavana Sooja) and P40 Aboobakuru (Bavana Sooja) -> target parent links, P193 Princess Recca is modeled as inferred grandparent-line kin of P30 Hassan (Bavana).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P193 Princess Recca and P30 Hassan (Bavana) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P193", "P31", "aunt/uncle↔niece/nephew"), {
    summary: "P193 Princess Recca and P31 Ibrahim (Dhammaru Veeru) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p193-p31-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P193 Princess Recca (CLM-0337, SRC-MRF-KINGS, grade B); excerpt: Kings list and Hilaaly branch notes together support parent edge P40 to P193.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P40 Aboobakuru (Bavana Sooja), P31 Ibrahim (Dhammaru Veeru)) plus parent(P40 Aboobakuru (Bavana Sooja), child) yields inferred aunt/uncle-line kin between P193 Princess Recca and P31 Ibrahim (Dhammaru Veeru).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P193 Princess Recca and P31 Ibrahim (Dhammaru Veeru) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P193", "P39", "aunt/uncle↔niece/nephew"), {
    summary: "P193 Princess Recca and P39 Yoosuf (Loka Aananadha) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p193-p39-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P193 Princess Recca (CLM-0337, SRC-MRF-KINGS, grade B); excerpt: Kings list and Hilaaly branch notes together support parent edge P40 to P193.",
      "Supporting edge: sibling P39 Yoosuf (Loka Aananadha) <-> P40 Aboobakuru (Bavana Sooja) [half-brothers] (CLM-0432, SRC-MRF-KINGS, grade B); excerpt: Kings list marks P39 and P40 as half-brothers.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P40 Aboobakuru (Bavana Sooja), P39 Yoosuf (Loka Aananadha)) plus parent(P40 Aboobakuru (Bavana Sooja), child) yields inferred aunt/uncle-line kin between P193 Princess Recca and P39 Yoosuf (Loka Aananadha).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P193 Princess Recca and P39 Yoosuf (Loka Aananadha) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P193", "P44", "aunt/uncle↔niece/nephew"), {
    summary: "P193 Princess Recca and P44 Mohamed (Bavana Abarana) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p193-p44-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P41 Hadi Hassan (Raadha Veeru) -> P44 Mohamed (Bavana Abarana) (CLM-0339, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P41 Hadi Hassan as parent of P44 Mohamed.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P41 Hadi Hassan (Raadha Veeru), P193 Princess Recca) plus parent(P41 Hadi Hassan (Raadha Veeru), child) yields inferred aunt/uncle-line kin between P193 Princess Recca and P44 Mohamed (Bavana Abarana).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P193 Princess Recca and P44 Mohamed (Bavana Abarana) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P193", "P46", "cousins"), {
    summary: "P193 Princess Recca and P46 Omar (Loka Sundhura) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p193-p46-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P39 Yoosuf (Loka Aananadha) -> P46 Omar (Loka Sundhura) (CLM-0336, SRC-MRF-KINGS, grade B); excerpt: Kings list records parent edge P39 to P46.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P193 Princess Recca (CLM-0337, SRC-MRF-KINGS, grade B); excerpt: Kings list and Hilaaly branch notes together support parent edge P40 to P193.",
      "Supporting edge: sibling P39 Yoosuf (Loka Aananadha) <-> P40 Aboobakuru (Bavana Sooja) [half-brothers] (CLM-0432, SRC-MRF-KINGS, grade B); excerpt: Kings list marks P39 and P40 as half-brothers.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P39 Yoosuf (Loka Aananadha) and P40 Aboobakuru (Bavana Sooja) are modeled as inferred cousin-line kin (P193 Princess Recca <-> P46 Omar (Loka Sundhura)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P193 Princess Recca and P46 Omar (Loka Sundhura) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P194", "P40", "grandparent"), {
    summary: "P194 Burecca and P40 Aboobakuru (Bavana Sooja) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p194-p40-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P193 Princess Recca (CLM-0337, SRC-MRF-KINGS, grade B); excerpt: Kings list and Hilaaly branch notes together support parent edge P40 to P193.",
      "Supporting edge: parent P193 Princess Recca -> P194 Burecca (CLM-0327, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P193 Princess Recca as parent of P194 Burecca.",
      "Rule application (parent-of-parent-grandparent): with source -> P193 Princess Recca and P193 Princess Recca -> target parent links, P194 Burecca is modeled as inferred grandparent-line kin of P40 Aboobakuru (Bavana Sooja).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P194 Burecca and P40 Aboobakuru (Bavana Sooja) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P194", "P41", "aunt/uncle↔niece/nephew"), {
    summary: "P194 Burecca and P41 Hadi Hassan (Raadha Veeru) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p194-p41-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P193 Princess Recca -> P194 Burecca (CLM-0327, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P193 Princess Recca as parent of P194 Burecca.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P193 Princess Recca, P41 Hadi Hassan (Raadha Veeru)) plus parent(P193 Princess Recca, child) yields inferred aunt/uncle-line kin between P194 Burecca and P41 Hadi Hassan (Raadha Veeru).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P194 Burecca and P41 Hadi Hassan (Raadha Veeru) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P194", "P44", "cousins"), {
    summary: "P194 Burecca and P44 Mohamed (Bavana Abarana) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p194-p44-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P41 Hadi Hassan (Raadha Veeru) -> P44 Mohamed (Bavana Abarana) (CLM-0339, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P41 Hadi Hassan as parent of P44 Mohamed.",
      "Supporting edge: parent P193 Princess Recca -> P194 Burecca (CLM-0327, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P193 Princess Recca as parent of P194 Burecca.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P41 Hadi Hassan (Raadha Veeru) and P193 Princess Recca are modeled as inferred cousin-line kin (P194 Burecca <-> P44 Mohamed (Bavana Abarana)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P194 Burecca and P44 Mohamed (Bavana Abarana) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P196", "P40", "grandparent"), {
    summary: "P196 Reccy and P40 Aboobakuru (Bavana Sooja) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p196-p40-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P193 Princess Recca (CLM-0337, SRC-MRF-KINGS, grade B); excerpt: Kings list and Hilaaly branch notes together support parent edge P40 to P193.",
      "Supporting edge: parent P193 Princess Recca -> P196 Reccy (CLM-0328, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P193 Princess Recca as parent of P196 Reccy.",
      "Rule application (parent-of-parent-grandparent): with source -> P193 Princess Recca and P193 Princess Recca -> target parent links, P196 Reccy is modeled as inferred grandparent-line kin of P40 Aboobakuru (Bavana Sooja).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P196 Reccy and P40 Aboobakuru (Bavana Sooja) as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P196", "P41", "aunt/uncle↔niece/nephew"), {
    summary: "P196 Reccy and P41 Hadi Hassan (Raadha Veeru) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p196-p41-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P193 Princess Recca -> P196 Reccy (CLM-0328, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P193 Princess Recca as parent of P196 Reccy.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P193 Princess Recca, P41 Hadi Hassan (Raadha Veeru)) plus parent(P193 Princess Recca, child) yields inferred aunt/uncle-line kin between P196 Reccy and P41 Hadi Hassan (Raadha Veeru).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P196 Reccy and P41 Hadi Hassan (Raadha Veeru) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P196", "P44", "cousins"), {
    summary: "P196 Reccy and P44 Mohamed (Bavana Abarana) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p196-p44-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P41 Hadi Hassan (Raadha Veeru) -> P44 Mohamed (Bavana Abarana) (CLM-0339, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P41 Hadi Hassan as parent of P44 Mohamed.",
      "Supporting edge: parent P193 Princess Recca -> P196 Reccy (CLM-0328, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P193 Princess Recca as parent of P196 Reccy.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P41 Hadi Hassan (Raadha Veeru) and P193 Princess Recca are modeled as inferred cousin-line kin (P196 Reccy <-> P44 Mohamed (Bavana Abarana)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P196 Reccy and P44 Mohamed (Bavana Abarana) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P30", "P41", "grandparent"), {
    summary: "P30 Hassan (Bavana) and P41 Hadi Hassan (Raadha Veeru) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p30-p41-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P30 Hassan (Bavana) -> P40 Aboobakuru (Bavana Sooja) (CLM-0335, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P40 Aboobakuru.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P41 Hadi Hassan (Raadha Veeru) (CLM-0338, SRC-MRF-KINGS, grade B); excerpt: Kings list records parent edge P40 to P41.",
      "Rule application (parent-of-parent-grandparent): with source -> P40 Aboobakuru (Bavana Sooja) and P40 Aboobakuru (Bavana Sooja) -> target parent links, P30 Hassan (Bavana) is modeled as inferred grandparent-line kin of P41 Hadi Hassan (Raadha Veeru).",
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
  [k("kin", "P31", "P32", "uncle→nephew"), {
    summary: "This edge models an avuncular relation between P31 and P32 to preserve a collateral interpretation supported by adjacent sibling and parent links in the same branch segment.",
    dossier: "docs/research-program/inferences/kin-p31-p32-uncle-nephew.md",
    logic: [
      "This pair is retained as inferred kin (uncle→nephew) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.",
      "Supporting claim CLM-0428: sibling Hassan (P30) -> Hussain (P32) [twins] (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P30 Hassan and P32 Hussain as siblings (twins).",
      "Supporting claim CLM-0333: parent Hassan (P30) -> Ibrahim (P31) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P31 Ibrahim.",
      "Supporting claim CLM-0129: kin Yusuf Handeygirin (P192) -> Hussain (P32) [uncle/nephew] (SRC-MRF-HILAALY, grade B); excerpt: Hilaaly branch source context records P192 and P32 with an uncle-nephew relation.",
      "Supporting claim CLM-0148: kin Hussain (P32) -> Nasiruddine (P33) [succession transition context] (SRC-WIKI-MONARCHS, grade B); excerpt: Sequence notes connect P32 to P33 as succession-transition context.",
      "Combined interpretation: these anchors keep the pair in-model as inferred kin (uncle→nephew), but not promoted to confirmed until explicit pairwise wording is found.",
      "Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement."
    ],
    verification: [
      "Promotion requirement: A/B source wording explicitly saying P31 and P32 are uncle/nephew.",
      "Downgrade/removal trigger: Direct statement identifying them as siblings or non-avuncular collateral kin.",
      "Review cadence: Re-check after each Hilaaly bridge-source extraction pass."
    ]
  }],
  [k("kin", "P31", "P41", "aunt/uncle↔niece/nephew"), {
    summary: "P31 Ibrahim (Dhammaru Veeru) and P41 Hadi Hassan (Raadha Veeru) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p31-p41-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P41 Hadi Hassan (Raadha Veeru) (CLM-0338, SRC-MRF-KINGS, grade B); excerpt: Kings list records parent edge P40 to P41.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P40 Aboobakuru (Bavana Sooja), P31 Ibrahim (Dhammaru Veeru)) plus parent(P40 Aboobakuru (Bavana Sooja), child) yields inferred aunt/uncle-line kin between P31 Ibrahim (Dhammaru Veeru) and P41 Hadi Hassan (Raadha Veeru).",
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
  [k("kin", "P39", "P41", "aunt/uncle↔niece/nephew"), {
    summary: "P39 Yoosuf (Loka Aananadha) and P41 Hadi Hassan (Raadha Veeru) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p39-p41-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P41 Hadi Hassan (Raadha Veeru) (CLM-0338, SRC-MRF-KINGS, grade B); excerpt: Kings list records parent edge P40 to P41.",
      "Supporting edge: sibling P39 Yoosuf (Loka Aananadha) <-> P40 Aboobakuru (Bavana Sooja) [half-brothers] (CLM-0432, SRC-MRF-KINGS, grade B); excerpt: Kings list marks P39 and P40 as half-brothers.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P40 Aboobakuru (Bavana Sooja), P39 Yoosuf (Loka Aananadha)) plus parent(P40 Aboobakuru (Bavana Sooja), child) yields inferred aunt/uncle-line kin between P39 Yoosuf (Loka Aananadha) and P41 Hadi Hassan (Raadha Veeru).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P39 Yoosuf (Loka Aananadha) and P41 Hadi Hassan (Raadha Veeru) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
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
  [k("kin", "P39", "P50", "grandparent"), {
    summary: "P39 Yoosuf (Loka Aananadha) and P50 Ibrahim (Bavana Furasuddha) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p39-p50-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P39 Yoosuf (Loka Aananadha) -> P46 Omar (Loka Sundhura) (CLM-0336, SRC-MRF-KINGS, grade B); excerpt: Kings list records parent edge P39 to P46.",
      "Supporting edge: parent P46 Omar (Loka Sundhura) -> P50 Ibrahim (Bavana Furasuddha) (CLM-0342, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P50 Ibrahim.",
      "Rule application (parent-of-parent-grandparent): with source -> P46 Omar (Loka Sundhura) and P46 Omar (Loka Sundhura) -> target parent links, P39 Yoosuf (Loka Aananadha) is modeled as inferred grandparent-line kin of P50 Ibrahim (Bavana Furasuddha).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P39 Yoosuf (Loka Aananadha) and P50 Ibrahim (Bavana Furasuddha) as kin (grandparent).",
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
  [k("kin", "P40", "P44", "grandparent"), {
    summary: "P40 Aboobakuru (Bavana Sooja) and P44 Mohamed (Bavana Abarana) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p40-p44-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P41 Hadi Hassan (Raadha Veeru) (CLM-0338, SRC-MRF-KINGS, grade B); excerpt: Kings list records parent edge P40 to P41.",
      "Supporting edge: parent P41 Hadi Hassan (Raadha Veeru) -> P44 Mohamed (Bavana Abarana) (CLM-0339, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P41 Hadi Hassan as parent of P44 Mohamed.",
      "Rule application (parent-of-parent-grandparent): with source -> P41 Hadi Hassan (Raadha Veeru) and P41 Hadi Hassan (Raadha Veeru) -> target parent links, P40 Aboobakuru (Bavana Sooja) is modeled as inferred grandparent-line kin of P44 Mohamed (Bavana Abarana).",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P40 Aboobakuru (Bavana Sooja) and P44 Mohamed (Bavana Abarana) as kin (grandparent).",
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
  [k("kin", "P41", "P46", "cousins"), {
    summary: "P41 Hadi Hassan (Raadha Veeru) and P46 Omar (Loka Sundhura) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p41-p46-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P39 Yoosuf (Loka Aananadha) -> P46 Omar (Loka Sundhura) (CLM-0336, SRC-MRF-KINGS, grade B); excerpt: Kings list records parent edge P39 to P46.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P41 Hadi Hassan (Raadha Veeru) (CLM-0338, SRC-MRF-KINGS, grade B); excerpt: Kings list records parent edge P40 to P41.",
      "Supporting edge: sibling P39 Yoosuf (Loka Aananadha) <-> P40 Aboobakuru (Bavana Sooja) [half-brothers] (CLM-0432, SRC-MRF-KINGS, grade B); excerpt: Kings list marks P39 and P40 as half-brothers.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P39 Yoosuf (Loka Aananadha) and P40 Aboobakuru (Bavana Sooja) are modeled as inferred cousin-line kin (P41 Hadi Hassan (Raadha Veeru) <-> P46 Omar (Loka Sundhura)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P41 Hadi Hassan (Raadha Veeru) and P46 Omar (Loka Sundhura) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P41", "P57", "aunt/uncle↔niece/nephew"), {
    summary: "P41 Hadi Hassan (Raadha Veeru) and P57 Ali (Aanandha) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p41-p57-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P193 Princess Recca -> P57 Ali (Aanandha) (CLM-0329, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P193 Princess Recca as parent of P57 Ali.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P193 Princess Recca, P41 Hadi Hassan (Raadha Veeru)) plus parent(P193 Princess Recca, child) yields inferred aunt/uncle-line kin between P41 Hadi Hassan (Raadha Veeru) and P57 Ali (Aanandha).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P41 Hadi Hassan (Raadha Veeru) and P57 Ali (Aanandha) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P44", "P57", "cousins"), {
    summary: "P44 Mohamed (Bavana Abarana) and P57 Ali (Aanandha) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p44-p57-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P41 Hadi Hassan (Raadha Veeru) -> P44 Mohamed (Bavana Abarana) (CLM-0339, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P41 Hadi Hassan as parent of P44 Mohamed.",
      "Supporting edge: parent P193 Princess Recca -> P57 Ali (Aanandha) (CLM-0329, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P193 Princess Recca as parent of P57 Ali.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P41 Hadi Hassan (Raadha Veeru) and P193 Princess Recca are modeled as inferred cousin-line kin (P44 Mohamed (Bavana Abarana) <-> P57 Ali (Aanandha)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P44 Mohamed (Bavana Abarana) and P57 Ali (Aanandha) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
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
      "Rule application (parent-sibling-aunt-uncle): sibling(P51 Kalu Mohamed (Dhammaru Bavana), P47 Hassan (Raadha Aanandha)) plus parent(P51 Kalu Mohamed (Dhammaru Bavana), child) yields inferred aunt/uncle-line kin between P47 Hassan (Raadha Aanandha) and P59 Hassan of Shiraz (Ram Mani Loka).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P47 Hassan (Raadha Aanandha) and P59 Hassan of Shiraz (Ram Mani Loka) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P50", "P55", "aunt/uncle↔niece/nephew"), {
    summary: "P50 Ibrahim (Bavana Furasuddha) and P55 Hassan (Singa Veeru) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p50-p55-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P52 Yoosuf (Veeru Aanandha) -> P55 Hassan (Singa Veeru) (CLM-0346, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P52 Yoosuf as parent of P55 Hassan.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P52 Yoosuf (Veeru Aanandha), P50 Ibrahim (Bavana Furasuddha)) plus parent(P52 Yoosuf (Veeru Aanandha), child) yields inferred aunt/uncle-line kin between P50 Ibrahim (Bavana Furasuddha) and P55 Hassan (Singa Veeru).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P50 Ibrahim (Bavana Furasuddha) and P55 Hassan (Singa Veeru) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P50", "P59", "aunt/uncle↔niece/nephew"), {
    summary: "P50 Ibrahim (Bavana Furasuddha) and P59 Hassan of Shiraz (Ram Mani Loka) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p50-p59-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P59 Hassan of Shiraz (Ram Mani Loka) (CLM-0345, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P51 Kalu Mohamed as parent of P59 Hassan of Shiraz.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P51 Kalu Mohamed (Dhammaru Bavana), P50 Ibrahim (Bavana Furasuddha)) plus parent(P51 Kalu Mohamed (Dhammaru Bavana), child) yields inferred aunt/uncle-line kin between P50 Ibrahim (Bavana Furasuddha) and P59 Hassan of Shiraz (Ram Mani Loka).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P50 Ibrahim (Bavana Furasuddha) and P59 Hassan of Shiraz (Ram Mani Loka) as kin (aunt/uncle↔niece/nephew).",
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
  [k("kin", "P55", "P59", "cousins"), {
    summary: "P55 Hassan (Singa Veeru) and P59 Hassan of Shiraz (Ram Mani Loka) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p55-p59-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P59 Hassan of Shiraz (Ram Mani Loka) (CLM-0345, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P51 Kalu Mohamed as parent of P59 Hassan of Shiraz.",
      "Supporting edge: parent P52 Yoosuf (Veeru Aanandha) -> P55 Hassan (Singa Veeru) (CLM-0346, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P52 Yoosuf as parent of P55 Hassan.",
      "Supporting edge: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P52 Yoosuf (Veeru Aanandha) [brothers] (CLM-0441, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P51 Kalu Mohamed and P52 Yoosuf as siblings (brothers).",
      "Rule application (children-of-siblings-cousin): children of sibling parents P51 Kalu Mohamed (Dhammaru Bavana) and P52 Yoosuf (Veeru Aanandha) are modeled as inferred cousin-line kin (P55 Hassan (Singa Veeru) <-> P59 Hassan of Shiraz (Ram Mani Loka)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P55 Hassan (Singa Veeru) and P59 Hassan of Shiraz (Ram Mani Loka) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P60", "P66", "aunt/uncle↔niece/nephew"), {
    summary: "P60 Mohamed (Singa Bavana) and P66 Joao’ (Keerithi Maha Radun) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p60-p66-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P66 Joao’ (Keerithi Maha Radun) (CLM-0347, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P61 Hassan IX / Dom Manoel as parent of P66 Joao’.",
      "Supporting edge: sibling P60 Mohamed (Singa Bavana) <-> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) [full brothers] (CLM-0444, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P60 Mohamed and P61 Hassan IX / Dom Manoel as siblings (full brothers).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P61 Hassan IX / Dom Manoel (Dhirikusa Loka), P60 Mohamed (Singa Bavana)) plus parent(P61 Hassan IX / Dom Manoel (Dhirikusa Loka), child) yields inferred aunt/uncle-line kin between P60 Mohamed (Singa Bavana) and P66 Joao’ (Keerithi Maha Radun).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P60 Mohamed (Singa Bavana) and P66 Joao’ (Keerithi Maha Radun) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
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
  [k("kin", "P61", "P96", "grandparent"), {
    summary: "P61 Hassan IX / Dom Manoel (Dhirikusa Loka) and P96 Donna Ines are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p61-p96-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P61 Hassan IX / Dom Manoel (Dhirikusa Loka) -> P66 Joao’ (Keerithi Maha Radun) (CLM-0347, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P61 Hassan IX / Dom Manoel as parent of P66 Joao’.",
      "Supporting edge: parent P66 Joao’ (Keerithi Maha Radun) -> P96 Donna Ines (CLM-0349, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P66 Joao’ as parent of P96 Donna Ines.",
      "Rule application (parent-of-parent-grandparent): with source -> P66 Joao’ (Keerithi Maha Radun) and P66 Joao’ (Keerithi Maha Radun) -> target parent links, P61 Hassan IX / Dom Manoel (Dhirikusa Loka) is modeled as inferred grandparent-line kin of P96 Donna Ines.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P61 Hassan IX / Dom Manoel (Dhirikusa Loka) and P96 Donna Ines as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P66", "P97", "grandparent"), {
    summary: "P66 Joao’ (Keerithi Maha Radun) and P97 Dom Luis de Sousa are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p66-p97-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P66 Joao’ (Keerithi Maha Radun) -> P96 Donna Ines (CLM-0349, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P66 Joao’ as parent of P96 Donna Ines.",
      "Supporting edge: parent P96 Donna Ines -> P97 Dom Luis de Sousa (CLM-0368, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P96 Donna Ines as parent of P97 Dom Luis de Sousa.",
      "Rule application (parent-of-parent-grandparent): with source -> P96 Donna Ines and P96 Donna Ines -> target parent links, P66 Joao’ (Keerithi Maha Radun) is modeled as inferred grandparent-line kin of P97 Dom Luis de Sousa.",
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
      "Supporting edge: parent P96 Donna Ines -> P97 Dom Luis de Sousa (CLM-0368, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P96 Donna Ines as parent of P97 Dom Luis de Sousa.",
      "Supporting edge: sibling P67 Philippe’ (Keerithi Maha Radun) <-> P96 Donna Ines [siblings] (CLM-0445, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content links P67 Philippe’ and P96 Donna Ines as siblings (siblings).",
      "Rule application (parent-sibling-aunt-uncle): sibling(P96 Donna Ines, P67 Philippe’ (Keerithi Maha Radun)) plus parent(P96 Donna Ines, child) yields inferred aunt/uncle-line kin between P67 Philippe’ (Keerithi Maha Radun) and P97 Dom Luis de Sousa.",
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
  [k("kin", "P79", "P81", "aunt/uncle↔niece/nephew"), {
    summary: "P79 Mohamed Imaduddine (Navaranna Keerithi) and P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p79-p81-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P78 Ibrahim Iskander (Rannava Loka) -> P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) (CLM-0356, SRC-WIKI-MONARCHS, grade B); excerpt: List of Maldivian monarchs family/genealogy content lists P78 Ibrahim Iskander as parent of P81 Mohamed Ghiyathuddine.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P78 Ibrahim Iskander (Rannava Loka), P79 Mohamed Imaduddine (Navaranna Keerithi)) plus parent(P78 Ibrahim Iskander (Rannava Loka), child) yields inferred aunt/uncle-line kin between P79 Mohamed Imaduddine (Navaranna Keerithi) and P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P79 Mohamed Imaduddine (Navaranna Keerithi) and P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
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
  [k("kin", "P80", "P99", "grandparent"), {
    summary: "P80 Hassan Izzuddine (Kula Ran Meeba Audha) and P99 Hussain Daharadha Thakurufan are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p80-p99-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P99 Hussain Daharadha Thakurufan -> P100 Mohamed Faamuladeyri Thakurufan (CLM-0371, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P99 Hussain Daharadha Thakurufan as parent of P100 Mohamed Faamuladeyri Thakurufan.",
      "Supporting edge: parent P100 Mohamed Faamuladeyri Thakurufan -> P80 Hassan Izzuddine (Kula Ran Meeba Audha) (CLM-0223, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P100 Mohamed Faamuladeyri Thakurufan as parent of P80 Hassan Izzuddine.",
      "Rule application (parent-of-parent-grandparent): with source -> P100 Mohamed Faamuladeyri Thakurufan and P100 Mohamed Faamuladeyri Thakurufan -> target parent links, P80 Hassan Izzuddine (Kula Ran Meeba Audha) is modeled as inferred grandparent-line kin of P99 Hussain Daharadha Thakurufan.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P80 Hassan Izzuddine (Kula Ran Meeba Audha) and P99 Hussain Daharadha Thakurufan as kin (grandparent).",
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
    summary: "This edge keeps an uncle-nephew interpretation between P87 and P92 by combining the P86->P87 parent line with documented P86->P92 grandparent framing.",
    dossier: "docs/research-program/inferences/kin-p87-p92-uncle-nephew.md",
    logic: [
      "This pair is retained as inferred kin (uncle/nephew) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.",
      "Supporting claim CLM-0363: parent Mohamed Imaduddine (P86) -> Ibrahim Nooredine (P87) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P86 Mohamed Imaduddine as parent of P87 Ibrahim Nooredine.",
      "Supporting claim CLM-0208: kin Mohamed Imaduddine (P86) -> Mohamed Imaduddine VI (P92) [grandfather] (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List dynastic context links P86 Mohamed Imaduddine and P92 Mohamed Imaduddine VI in kin relation (grandfather).",
      "Supporting claim CLM-0365: parent Ibrahim Nooredine (P87) -> Mohamed Imaduddine V (P90) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P87 Ibrahim Nooredine as parent of P90 Mohamed Imaduddine V.",
      "Supporting claim CLM-0366: parent Ibrahim Nooredine (P87) -> Mohamed Shamsuddine III (P91) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P87 Ibrahim Nooredine as parent of P91 Mohamed Shamsuddine III.",
      "Combined interpretation: these anchors keep the pair in-model as inferred kin (uncle/nephew), but not promoted to confirmed until explicit pairwise wording is found.",
      "Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement."
    ],
    verification: [
      "Promotion requirement: A/B source explicitly naming P87 and P92 as uncle/nephew.",
      "Downgrade/removal trigger: Revised parentage that breaks the avuncular interpretation.",
      "Review cadence: Re-check after each Huraagey late-period corroboration batch."
    ]
  }],
  [k("kin", "P88", "P90", "cousins"), {
    summary: "P88 Mohamed Mueenuddine (Keerithi Maha Radun) and P90 Mohamed Imaduddine V (Keerithi Maha Radun) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p88-p90-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P87 Ibrahim Nooredine (Keerithi Maha Radun) -> P90 Mohamed Imaduddine V (Keerithi Maha Radun) (CLM-0365, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P87 Ibrahim Nooredine as parent of P90 Mohamed Imaduddine V.",
      "Supporting edge: parent P155 Maandhoogey Bodu Dhorhy Manippulu -> P88 Mohamed Mueenuddine (Keerithi Maha Radun) (CLM-0288, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P155 Maandhoogey Bodu Dhorhy Manippulu as parent of P88 Mohamed Mueenuddine.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P87 Ibrahim Nooredine (Keerithi Maha Radun) and P155 Maandhoogey Bodu Dhorhy Manippulu are modeled as inferred cousin-line kin (P88 Mohamed Mueenuddine (Keerithi Maha Radun) <-> P90 Mohamed Imaduddine V (Keerithi Maha Radun)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P88 Mohamed Mueenuddine (Keerithi Maha Radun) and P90 Mohamed Imaduddine V (Keerithi Maha Radun) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P88", "P91", "cousins"), {
    summary: "P88 Mohamed Mueenuddine (Keerithi Maha Radun) and P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p88-p91-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P87 Ibrahim Nooredine (Keerithi Maha Radun) -> P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) (CLM-0366, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P87 Ibrahim Nooredine as parent of P91 Mohamed Shamsuddine III.",
      "Supporting edge: parent P155 Maandhoogey Bodu Dhorhy Manippulu -> P88 Mohamed Mueenuddine (Keerithi Maha Radun) (CLM-0288, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P155 Maandhoogey Bodu Dhorhy Manippulu as parent of P88 Mohamed Mueenuddine.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P87 Ibrahim Nooredine (Keerithi Maha Radun) and P155 Maandhoogey Bodu Dhorhy Manippulu are modeled as inferred cousin-line kin (P88 Mohamed Mueenuddine (Keerithi Maha Radun) <-> P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P88 Mohamed Mueenuddine (Keerithi Maha Radun) and P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) as kin (cousins).",
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
      "Supporting edge: parent P155 Maandhoogey Bodu Dhorhy Manippulu -> P92 Mohamed Imaduddine VI (Keerithi Maha Radun) (CLM-0289, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P155 Maandhoogey Bodu Dhorhy Manippulu as parent of P92 Mohamed Imaduddine VI.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P87 Ibrahim Nooredine (Keerithi Maha Radun) and P155 Maandhoogey Bodu Dhorhy Manippulu are modeled as inferred cousin-line kin (P90 Mohamed Imaduddine V (Keerithi Maha Radun) <-> P92 Mohamed Imaduddine VI (Keerithi Maha Radun)).",
      "Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P90 Mohamed Imaduddine V (Keerithi Maha Radun) and P92 Mohamed Imaduddine VI (Keerithi Maha Radun) as kin (cousins).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P90", "P95", "aunt/uncle↔niece/nephew"), {
    summary: "P90 Mohamed Imaduddine V (Keerithi Maha Radun) and P95 Mohamed Farid (Keerithi Maha Radun) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.",
    dossier: "docs/research-program/inferences/kin-p90-p95-aunt-uncle-niece-nephew.md",
    logic: [
      "Support set for rule parent-sibling-aunt-uncle resolved as follows.",
      "Supporting edge: parent P129 Princess Veyogey Dhon Goma -> P95 Mohamed Farid (Keerithi Maha Radun) (CLM-0262, SRC-WIKI-MUHAMMAD-FAREED, grade B); excerpt: Muhammad Fareed Didi family/genealogy content lists P129 Princess Veyogey Dhon Goma as parent of P95 Mohamed Farid.",
      "Rule application (parent-sibling-aunt-uncle): sibling(P129 Princess Veyogey Dhon Goma, P90 Mohamed Imaduddine V (Keerithi Maha Radun)) plus parent(P129 Princess Veyogey Dhon Goma, child) yields inferred aunt/uncle-line kin between P90 Mohamed Imaduddine V (Keerithi Maha Radun) and P95 Mohamed Farid (Keerithi Maha Radun).",
      "Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P90 Mohamed Imaduddine V (Keerithi Maha Radun) and P95 Mohamed Farid (Keerithi Maha Radun) as kin (aunt/uncle↔niece/nephew).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("kin", "P91", "P92", "cousins"), {
    summary: "P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) and P92 Mohamed Imaduddine VI (Keerithi Maha Radun) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.",
    dossier: "docs/research-program/inferences/kin-p91-p92-cousins.md",
    logic: [
      "Support set for rule children-of-siblings-cousin resolved as follows.",
      "Supporting edge: parent P87 Ibrahim Nooredine (Keerithi Maha Radun) -> P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) (CLM-0366, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P87 Ibrahim Nooredine as parent of P91 Mohamed Shamsuddine III.",
      "Supporting edge: parent P155 Maandhoogey Bodu Dhorhy Manippulu -> P92 Mohamed Imaduddine VI (Keerithi Maha Radun) (CLM-0289, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P155 Maandhoogey Bodu Dhorhy Manippulu as parent of P92 Mohamed Imaduddine VI.",
      "Rule application (children-of-siblings-cousin): children of sibling parents P87 Ibrahim Nooredine (Keerithi Maha Radun) and P155 Maandhoogey Bodu Dhorhy Manippulu are modeled as inferred cousin-line kin (P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) <-> P92 Mohamed Imaduddine VI (Keerithi Maha Radun)).",
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
  [k("kin", "P96", "P98", "grandparent"), {
    summary: "P96 Donna Ines and P98 Dom Maraduru Fandiaiy Thakurufan are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.",
    dossier: "docs/research-program/inferences/kin-p96-p98-grandparent.md",
    logic: [
      "Support set for rule parent-of-parent-grandparent resolved as follows.",
      "Supporting edge: parent P96 Donna Ines -> P97 Dom Luis de Sousa (CLM-0368, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P96 Donna Ines as parent of P97 Dom Luis de Sousa.",
      "Supporting edge: parent P97 Dom Luis de Sousa -> P98 Dom Maraduru Fandiaiy Thakurufan (CLM-0369, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P97 Dom Luis de Sousa as parent of P98 Dom Maraduru Fandiaiy Thakurufan.",
      "Rule application (parent-of-parent-grandparent): with source -> P97 Dom Luis de Sousa and P97 Dom Luis de Sousa -> target parent links, P96 Donna Ines is modeled as inferred grandparent-line kin of P98 Dom Maraduru Fandiaiy Thakurufan.",
      "Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P96 Donna Ines and P98 Dom Maraduru Fandiaiy Thakurufan as kin (grandparent).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.",
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
  [k("parent", "P13", "P15", ""), {
    summary: "This edge preserves a provisional parent claim from P13 to P15 based on surrounding lineage statements (P13->P14 and sibling P14<->P15) without direct wording for P13->P15 itself.",
    dossier: "docs/research-program/inferences/parent-p13-p15.md",
    logic: [
      "This pair is retained as inferred parent because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.",
      "Supporting claim CLM-0263: parent Audha (P13) -> Hali (P14) (SRC-MRF-KINGS, grade B); excerpt: Kings list gives P14 as son of P13 in the early Lunar succession sequence.",
      "Supporting claim CLM-0386: sibling Hali (P14) -> Yoosuf (P15) [brothers] (SRC-MRF-KINGS, grade B); excerpt: Kings list marks P14 and P15 as brothers.",
      "Supporting claim CLM-0285: parent Yoosuf (P15) -> Salis (P16) (SRC-MRF-KINGS, grade B); excerpt: Kings list states P16 as son of P15.",
      "Combined interpretation: these anchors keep the pair in-model as inferred parent, but not promoted to confirmed until explicit pairwise wording is found.",
      "Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement."
    ],
    verification: [
      "Promotion requirement: Direct A/B source phrase naming P13 as parent of P15.",
      "Downgrade/removal trigger: Primary chronicle sequence assigning P15 to another parent.",
      "Review cadence: Re-check after Lunar manuscript corroboration queue completion."
    ]
  }],
  [k("parent", "P80", "P84", ""), {
    summary: "This edge keeps a provisional parent model from P80 to P84 using nearby explicit links (P80->P83 and sibling P83<->P84) pending direct parent wording for P80->P84.",
    dossier: "docs/research-program/inferences/parent-p80-p84.md",
    logic: [
      "This pair is retained as inferred parent because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.",
      "Supporting claim CLM-0223: parent Mohamed Faamuladeyri Thakurufan (P100) -> Hassan Izzuddine (P80) (SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P100 Mohamed Faamuladeyri Thakurufan as parent of P80 Hassan Izzuddine.",
      "Supporting claim CLM-0357: parent Hassan Izzuddine (P80) -> Mohamed Muizzuddine (P83) (SRC-WIKI-MONARCHS, grade B); excerpt: List of Maldivian monarchs family/genealogy content lists P80 Hassan Izzuddine as parent of P83 Mohamed Muizzuddine.",
      "Supporting claim CLM-0448: sibling Mohamed Muizzuddine (P83) -> Hassan Nooredine (P84) [brothers] (SRC-WIKI-MONARCHS, grade B); excerpt: List of Maldivian monarchs family/genealogy content links P83 Mohamed Muizzuddine and P84 Hassan Nooredine as siblings (brothers).",
      "Supporting claim CLM-0360: parent Hassan Nooredine (P84) -> Mohamed Mueenuddine (P85) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P84 Hassan Nooredine as parent of P85 Mohamed Mueenuddine.",
      "Combined interpretation: these anchors keep the pair in-model as inferred parent, but not promoted to confirmed until explicit pairwise wording is found.",
      "Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement."
    ],
    verification: [
      "Promotion requirement: A/B source explicitly stating P80 is parent of P84.",
      "Downgrade/removal trigger: Direct genealogical source assigning P84 to a different parent.",
      "Review cadence: Re-check after Huraagey eighteenth-century source expansion."
    ]
  }],
  [k("parent", "P87", "P129", ""), {
    summary: "This edge models P87 as parent of P129 by combining documented P87->P95 grandparent framing with P129->P95 parent evidence; it remains inferred pending explicit P87->P129 wording.",
    dossier: "docs/research-program/inferences/parent-p87-p129.md",
    logic: [
      "This pair is retained as inferred parent because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.",
      "Supporting claim CLM-0212: kin Ibrahim Nooredine (P87) -> Mohamed Farid (P95) [grandfather (via daughter)] (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List dynastic context links P87 Ibrahim Nooredine and P95 Mohamed Farid in kin relation (grandfather (via daughter)).",
      "Supporting claim CLM-0262: parent Princess Veyogey Dhon Goma (P129) -> Mohamed Farid (P95) (SRC-WIKI-MUHAMMAD-FAREED, grade B); excerpt: Muhammad Fareed Didi family/genealogy content lists P129 Princess Veyogey Dhon Goma as parent of P95 Mohamed Farid.",
      "Supporting claim CLM-0260: parent Princess Veyogey Dhon Goma (P129) -> Hassan Fareed Didi (P190) (SRC-WIKI-HASSAN-FARID, grade B); excerpt: Hassan Farid Didi family/genealogy content lists P129 Princess Veyogey Dhon Goma as parent of P190 Hassan Fareed Didi.",
      "Supporting claim CLM-0261: parent Princess Veyogey Dhon Goma (P129) -> Ibrahim Fareed Didi (P191) (SRC-WIKI-IBRAHIM-FAREED, grade B); excerpt: Ibrahim Fareed Didi family/genealogy content lists P129 Princess Veyogey Dhon Goma as parent of P191 Ibrahim Fareed Didi.",
      "Combined interpretation: these anchors keep the pair in-model as inferred parent, but not promoted to confirmed until explicit pairwise wording is found.",
      "Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement."
    ],
    verification: [
      "Promotion requirement: A/B source directly naming P87 as parent of P129.",
      "Downgrade/removal trigger: Confirmed alternate parentage for P129 inconsistent with P87 parent role.",
      "Review cadence: Re-check after modern-late-royal corroboration batches."
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
  [k("sibling", "P129", "P90", "siblings (shared parent)"), {
    summary: "P129 Princess Veyogey Dhon Goma and P90 Mohamed Imaduddine V (Keerithi Maha Radun) are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p129-p90-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P87 Ibrahim Nooredine (Keerithi Maha Radun) -> P90 Mohamed Imaduddine V (Keerithi Maha Radun) (CLM-0365, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P87 Ibrahim Nooredine as parent of P90 Mohamed Imaduddine V.",
      "Rule application (shared-parent-sibling): because both endpoints share parent P87 Ibrahim Nooredine (Keerithi Maha Radun), P129 Princess Veyogey Dhon Goma and P90 Mohamed Imaduddine V (Keerithi Maha Radun) are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P129 Princess Veyogey Dhon Goma and P90 Mohamed Imaduddine V (Keerithi Maha Radun) as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P129", "P91", "siblings (shared parent)"), {
    summary: "P129 Princess Veyogey Dhon Goma and P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p129-p91-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P87 Ibrahim Nooredine (Keerithi Maha Radun) -> P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) (CLM-0366, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P87 Ibrahim Nooredine as parent of P91 Mohamed Shamsuddine III.",
      "Rule application (shared-parent-sibling): because both endpoints share parent P87 Ibrahim Nooredine (Keerithi Maha Radun), P129 Princess Veyogey Dhon Goma and P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P129 Princess Veyogey Dhon Goma and P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) as sibling (siblings (shared parent)).",
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
  [k("sibling", "P155", "P87", "siblings (shared parent)"), {
    summary: "P155 Maandhoogey Bodu Dhorhy Manippulu and P87 Ibrahim Nooredine (Keerithi Maha Radun) are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p155-p87-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) -> P87 Ibrahim Nooredine (Keerithi Maha Radun) (CLM-0363, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P86 Mohamed Imaduddine as parent of P87 Ibrahim Nooredine.",
      "Supporting edge: parent P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) -> P155 Maandhoogey Bodu Dhorhy Manippulu (CLM-0362, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P86 Mohamed Imaduddine as parent of P155 Maandhoogey Bodu Dhorhy Manippulu.",
      "Rule application (shared-parent-sibling): because both endpoints share parent P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka), P155 Maandhoogey Bodu Dhorhy Manippulu and P87 Ibrahim Nooredine (Keerithi Maha Radun) are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P155 Maandhoogey Bodu Dhorhy Manippulu and P87 Ibrahim Nooredine (Keerithi Maha Radun) as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P16", "P17", "brothers"), {
    summary: "This edge keeps P16 and P17 as brothers because both are explicitly modeled as children of P15, but direct sibling wording for this exact pair is still not captured.",
    dossier: "docs/research-program/inferences/sibling-p16-p17-brothers.md",
    logic: [
      "This pair is retained as inferred sibling (brothers) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.",
      "Supporting claim CLM-0285: parent Yoosuf (P15) -> Salis (P16) (SRC-MRF-KINGS, grade B); excerpt: Kings list states P16 as son of P15.",
      "Supporting claim CLM-0286: parent Yoosuf (P15) -> Davud (P17) (SRC-MRF-KINGS, grade B); excerpt: Kings list states P17 as son of P15.",
      "Supporting claim CLM-0408: sibling Salis (P16) -> Omar Veeru (P18) [half-brothers] (SRC-MRF-KINGS, grade B); excerpt: Kings list marks P16 and P18 as half-brothers (maternal).",
      "Combined interpretation: these anchors keep the pair in-model as inferred sibling (brothers), but not promoted to confirmed until explicit pairwise wording is found.",
      "Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement."
    ],
    verification: [
      "Promotion requirement: A/B statement explicitly naming P16 and P17 as brothers.",
      "Downgrade/removal trigger: Source text assigning only one of them to P15 or assigning different parentage.",
      "Review cadence: Re-check after early Lunar manuscript extraction updates."
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
  [k("sibling", "P19", "P25", "half-siblings"), {
    summary: "This edge preserves a half-sibling interpretation for P19 and P25 because both are linked to P18 and nearby sibling notes indicate mixed full/half sibling patterns in the same household cluster.",
    dossier: "docs/research-program/inferences/sibling-p19-p25-half-siblings.md",
    logic: [
      "This pair is retained as inferred sibling (half-siblings) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.",
      "Supporting claim CLM-0316: parent Omar Veeru (P18) -> Ahmed Shihabuddine (P19) (SRC-MRF-KINGS, grade B); excerpt: Kings list gives P19 as child of P18.",
      "Supporting claim CLM-0318: parent Omar Veeru (P18) -> Raadhaafathi (P25) (SRC-MRF-KINGS, grade B); excerpt: Kings list gives P25 as child of P18 in the same household branch.",
      "Supporting claim CLM-0427: sibling Khadijah (P20) -> Raadhaafathi (P25) [half-sisters] (SRC-MRF-KINGS, grade B); excerpt: Kings list marks P20 and P25 as half-sisters.",
      "Combined interpretation: these anchors keep the pair in-model as inferred sibling (half-siblings), but not promoted to confirmed until explicit pairwise wording is found.",
      "Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement."
    ],
    verification: [
      "Promotion requirement: Direct A/B wording naming P19 and P25 as half-siblings (or explicit sibling class).",
      "Downgrade/removal trigger: Evidence that one endpoint is not child of P18 or that sibling class is incompatible.",
      "Review cadence: Re-check when Lunar family-structure citations are expanded with line-level extracts."
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
  [k("sibling", "P193", "P41", "siblings (shared parent)"), {
    summary: "P193 Princess Recca and P41 Hadi Hassan (Raadha Veeru) are modeled as inferred sibling (siblings (shared parent)) through rule `shared-parent-sibling`.",
    dossier: "docs/research-program/inferences/sibling-p193-p41-siblings-shared-parent.md",
    logic: [
      "Support set for rule shared-parent-sibling resolved as follows.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P41 Hadi Hassan (Raadha Veeru) (CLM-0338, SRC-MRF-KINGS, grade B); excerpt: Kings list records parent edge P40 to P41.",
      "Supporting edge: parent P40 Aboobakuru (Bavana Sooja) -> P193 Princess Recca (CLM-0337, SRC-MRF-KINGS, grade B); excerpt: Kings list and Hilaaly branch notes together support parent edge P40 to P193.",
      "Rule application (shared-parent-sibling): because both endpoints share parent P40 Aboobakuru (Bavana Sooja), P193 Princess Recca and P41 Hadi Hassan (Raadha Veeru) are modeled as inferred sibling-line kin.",
      "Current modeling remains inferred because direct source text naming sibling (siblings (shared parent)) for this exact pair is not yet captured."
    ],
    verification: [
      "Promotion requirement: explicit A/B source wording naming P193 Princess Recca and P41 Hadi Hassan (Raadha Veeru) as sibling (siblings (shared parent)).",
      "Downgrade/removal trigger: source-backed changes to any support edge used by rule shared-parent-sibling.",
      "Review cadence: recompute after any parent/sibling edge change in this local branch."
    ]
  }],
  [k("sibling", "P31", "P39", "brothers"), {
    summary: "This edge models P31 and P39 as brothers because both are anchored as children of P30; the pair remains inferred until a source line names them together as brothers.",
    dossier: "docs/research-program/inferences/sibling-p31-p39-brothers.md",
    logic: [
      "This pair is retained as inferred sibling (brothers) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.",
      "Supporting claim CLM-0333: parent Hassan (P30) -> Ibrahim (P31) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P31 Ibrahim.",
      "Supporting claim CLM-0334: parent Hassan (P30) -> Yoosuf (P39) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P39 Yoosuf.",
      "Supporting claim CLM-0432: sibling Yoosuf (P39) -> Aboobakuru (P40) [half-brothers] (SRC-MRF-KINGS, grade B); excerpt: Kings list marks P39 and P40 as half-brothers.",
      "Combined interpretation: these anchors keep the pair in-model as inferred sibling (brothers), but not promoted to confirmed until explicit pairwise wording is found.",
      "Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement."
    ],
    verification: [
      "Promotion requirement: A/B source explicitly identifying P31 and P39 as brothers.",
      "Downgrade/removal trigger: Documented reassignment of either P31 or P39 to a different parent line.",
      "Review cadence: Re-check after Hilaaly high-impact bridge verification cycles."
    ]
  }],
  [k("sibling", "P31", "P40", "brothers"), {
    summary: "This edge keeps P31 and P40 as brothers because both are modeled as children of P30, while existing notes also allow a potential half-brother interpretation pending direct wording.",
    dossier: "docs/research-program/inferences/sibling-p31-p40-brothers.md",
    logic: [
      "This pair is retained as inferred sibling (brothers) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.",
      "Supporting claim CLM-0333: parent Hassan (P30) -> Ibrahim (P31) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P31 Ibrahim.",
      "Supporting claim CLM-0335: parent Hassan (P30) -> Aboobakuru (P40) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P40 Aboobakuru.",
      "Supporting claim CLM-0432: sibling Yoosuf (P39) -> Aboobakuru (P40) [half-brothers] (SRC-MRF-KINGS, grade B); excerpt: Kings list marks P39 and P40 as half-brothers.",
      "Combined interpretation: these anchors keep the pair in-model as inferred sibling (brothers), but not promoted to confirmed until explicit pairwise wording is found.",
      "Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement."
    ],
    verification: [
      "Promotion requirement: A/B source text explicitly naming P31 and P40 as brothers (or half-brothers).",
      "Downgrade/removal trigger: Source-backed parent reassignment removing shared-parent support.",
      "Review cadence: Re-check after each Hilaaly lineage corroboration batch."
    ]
  }],
  [k("sibling", "P47", "P50", "brothers"), {
    summary: "This edge models P47 and P50 as brothers based on shared parent anchors through P46; the model stays inferred until explicit pairwise sibling wording is documented.",
    dossier: "docs/research-program/inferences/sibling-p47-p50-brothers.md",
    logic: [
      "This pair is retained as inferred sibling (brothers) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.",
      "Supporting claim CLM-0341: parent Omar (P46) -> Hassan (P47) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P47 Hassan.",
      "Supporting claim CLM-0342: parent Omar (P46) -> Ibrahim (P50) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P50 Ibrahim.",
      "Combined interpretation: these anchors keep the pair in-model as inferred sibling (brothers), but not promoted to confirmed until explicit pairwise wording is found.",
      "Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement."
    ],
    verification: [
      "Promotion requirement: A/B source naming P47 and P50 explicitly as brothers.",
      "Downgrade/removal trigger: Any corrected parent assignment that breaks shared-parent basis.",
      "Review cadence: Re-check during Hilaaly mid-line parentage audit passes."
    ]
  }],
  [k("sibling", "P47", "P51", "brothers"), {
    summary: "This edge keeps P47 and P51 as brothers due to shared parent support through P46, with downstream P51 descendant claims reinforcing that this branch is genealogically central.",
    dossier: "docs/research-program/inferences/sibling-p47-p51-brothers.md",
    logic: [
      "This pair is retained as inferred sibling (brothers) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.",
      "Supporting claim CLM-0341: parent Omar (P46) -> Hassan (P47) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P47 Hassan.",
      "Supporting claim CLM-0343: parent Omar (P46) -> Kalu Mohamed (P51) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P51 Kalu Mohamed.",
      "Supporting claim CLM-0441: sibling Kalu Mohamed (P51) -> Yoosuf (P52) [brothers] (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P51 Kalu Mohamed and P52 Yoosuf as siblings (brothers).",
      "Combined interpretation: these anchors keep the pair in-model as inferred sibling (brothers), but not promoted to confirmed until explicit pairwise wording is found.",
      "Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement."
    ],
    verification: [
      "Promotion requirement: A/B source explicitly stating P47 and P51 are brothers.",
      "Downgrade/removal trigger: Parent-line correction for either endpoint removing the shared-parent anchor.",
      "Review cadence: Re-check after each mid-Hilaaly branch corroboration update."
    ]
  }],
  [k("sibling", "P47", "P52", "brothers"), {
    summary: "This edge models P47 and P52 as brothers because both are parent-linked to P46 and align with the sibling-rich branch pattern observed in nearby entries.",
    dossier: "docs/research-program/inferences/sibling-p47-p52-brothers.md",
    logic: [
      "This pair is retained as inferred sibling (brothers) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.",
      "Supporting claim CLM-0341: parent Omar (P46) -> Hassan (P47) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P47 Hassan.",
      "Supporting claim CLM-0344: parent Omar (P46) -> Yoosuf (P52) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P52 Yoosuf.",
      "Supporting claim CLM-0441: sibling Kalu Mohamed (P51) -> Yoosuf (P52) [brothers] (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P51 Kalu Mohamed and P52 Yoosuf as siblings (brothers).",
      "Combined interpretation: these anchors keep the pair in-model as inferred sibling (brothers), but not promoted to confirmed until explicit pairwise wording is found.",
      "Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement."
    ],
    verification: [
      "Promotion requirement: A/B source naming P47 and P52 as brothers.",
      "Downgrade/removal trigger: Incompatible parent reassignment for either endpoint.",
      "Review cadence: Re-check after each Hilaaly sibling-cluster verification pass."
    ]
  }],
  [k("sibling", "P5", "P7", "brothers"), {
    summary: "This edge preserves brotherhood between P5 and P7 via transitive sibling support (P5<->P6 and P6<->P7) while awaiting direct pairwise wording for P5<->P7.",
    dossier: "docs/research-program/inferences/sibling-p5-p7-brothers.md",
    logic: [
      "This pair is retained as inferred sibling (brothers) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.",
      "Supporting claim CLM-0436: sibling Dhinei (P5) -> Dhilhel (P6) [brothers] (SRC-MRF-KINGS, grade B); excerpt: Kings list explicitly notes P5 and P6 as brothers.",
      "Supporting claim CLM-0442: sibling Dhilhel (P6) -> Wadi (P7) [brothers] (SRC-MRF-KINGS, grade B); excerpt: Kings list explicitly notes P6 and P7 as brothers.",
      "Combined interpretation: these anchors keep the pair in-model as inferred sibling (brothers), but not promoted to confirmed until explicit pairwise wording is found.",
      "Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement."
    ],
    verification: [
      "Promotion requirement: A/B source line explicitly naming P5 and P7 as brothers.",
      "Downgrade/removal trigger: Any direct claim that one endpoint is not in the same sibling set.",
      "Review cadence: Re-check after primary early-Lunar manuscript corroboration."
    ]
  }],
  [k("sibling", "P5", "P8", "brothers"), {
    summary: "This edge keeps P5 and P8 as brothers by combining short-chain sibling evidence in the same sequence block, but it remains inferred because no direct P5-P8 sibling sentence is captured yet.",
    dossier: "docs/research-program/inferences/sibling-p5-p8-brothers.md",
    logic: [
      "This pair is retained as inferred sibling (brothers) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.",
      "Supporting claim CLM-0436: sibling Dhinei (P5) -> Dhilhel (P6) [brothers] (SRC-MRF-KINGS, grade B); excerpt: Kings list explicitly notes P5 and P6 as brothers.",
      "Supporting claim CLM-0442: sibling Dhilhel (P6) -> Wadi (P7) [brothers] (SRC-MRF-KINGS, grade B); excerpt: Kings list explicitly notes P6 and P7 as brothers.",
      "Supporting claim CLM-0446: sibling Wadi (P7) -> Valla Dio (P8) [brothers] (SRC-MRF-KINGS, grade B); excerpt: Kings list explicitly notes P7 and P8 as brothers.",
      "Combined interpretation: these anchors keep the pair in-model as inferred sibling (brothers), but not promoted to confirmed until explicit pairwise wording is found.",
      "Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement."
    ],
    verification: [
      "Promotion requirement: A/B direct wording naming P5 and P8 as brothers.",
      "Downgrade/removal trigger: Direct evidence that breaks the P5-P6-P7-P8 sibling chain.",
      "Review cadence: Re-check when line-level chronicle extracts are added for early Lunar nodes."
    ]
  }],
  [k("sibling", "P50", "P51", "brothers"), {
    summary: "This edge models P50 and P51 as brothers because both are anchored as children of P46 and occur in the same tightly connected branch segment.",
    dossier: "docs/research-program/inferences/sibling-p50-p51-brothers.md",
    logic: [
      "This pair is retained as inferred sibling (brothers) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.",
      "Supporting claim CLM-0342: parent Omar (P46) -> Ibrahim (P50) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P50 Ibrahim.",
      "Supporting claim CLM-0343: parent Omar (P46) -> Kalu Mohamed (P51) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P51 Kalu Mohamed.",
      "Supporting claim CLM-0441: sibling Kalu Mohamed (P51) -> Yoosuf (P52) [brothers] (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P51 Kalu Mohamed and P52 Yoosuf as siblings (brothers).",
      "Combined interpretation: these anchors keep the pair in-model as inferred sibling (brothers), but not promoted to confirmed until explicit pairwise wording is found.",
      "Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement."
    ],
    verification: [
      "Promotion requirement: A/B source explicitly stating P50 and P51 are brothers.",
      "Downgrade/removal trigger: Updated parent record that removes one endpoint from P46 descent.",
      "Review cadence: Re-check in each Hilaaly branch parentage refresh cycle."
    ]
  }],
  [k("sibling", "P50", "P52", "brothers"), {
    summary: "This edge keeps P50 and P52 as brothers from shared parent support through P46, with neighboring sibling claims reinforcing the cluster but not replacing direct pairwise wording.",
    dossier: "docs/research-program/inferences/sibling-p50-p52-brothers.md",
    logic: [
      "This pair is retained as inferred sibling (brothers) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.",
      "Supporting claim CLM-0342: parent Omar (P46) -> Ibrahim (P50) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P50 Ibrahim.",
      "Supporting claim CLM-0344: parent Omar (P46) -> Yoosuf (P52) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P46 Omar as parent of P52 Yoosuf.",
      "Supporting claim CLM-0441: sibling Kalu Mohamed (P51) -> Yoosuf (P52) [brothers] (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P51 Kalu Mohamed and P52 Yoosuf as siblings (brothers).",
      "Combined interpretation: these anchors keep the pair in-model as inferred sibling (brothers), but not promoted to confirmed until explicit pairwise wording is found.",
      "Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement."
    ],
    verification: [
      "Promotion requirement: Direct A/B wording naming P50 and P52 as brothers.",
      "Downgrade/removal trigger: Parent reassignment that breaks shared-parent basis.",
      "Review cadence: Re-check during each Hilaaly sibling-cluster evidence sweep."
    ]
  }],
  [k("sibling", "P6", "P8", "brothers"), {
    summary: "This edge represents inferred brotherhood between P6 and P8 from the contiguous sibling chain (P6<->P7 and P7<->P8), while direct P6-P8 wording remains absent.",
    dossier: "docs/research-program/inferences/sibling-p6-p8-brothers.md",
    logic: [
      "This pair is retained as inferred sibling (brothers) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.",
      "Supporting claim CLM-0442: sibling Dhilhel (P6) -> Wadi (P7) [brothers] (SRC-MRF-KINGS, grade B); excerpt: Kings list explicitly notes P6 and P7 as brothers.",
      "Supporting claim CLM-0446: sibling Wadi (P7) -> Valla Dio (P8) [brothers] (SRC-MRF-KINGS, grade B); excerpt: Kings list explicitly notes P7 and P8 as brothers.",
      "Supporting claim CLM-0436: sibling Dhinei (P5) -> Dhilhel (P6) [brothers] (SRC-MRF-KINGS, grade B); excerpt: Kings list explicitly notes P5 and P6 as brothers.",
      "Combined interpretation: these anchors keep the pair in-model as inferred sibling (brothers), but not promoted to confirmed until explicit pairwise wording is found.",
      "Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement."
    ],
    verification: [
      "Promotion requirement: A/B source explicitly naming P6 and P8 as brothers.",
      "Downgrade/removal trigger: Evidence invalidating either sibling link used in the chain.",
      "Review cadence: Re-check after early-Lunar manuscript and inscription corroboration."
    ]
  }],
  [k("sibling", "P78", "P79", "brothers"), {
    summary: "This edge models P78 and P79 as brothers because both are explicitly parent-linked to P77, but direct pairwise sibling wording between the two remains to be captured.",
    dossier: "docs/research-program/inferences/sibling-p78-p79-brothers.md",
    logic: [
      "This pair is retained as inferred sibling (brothers) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.",
      "Supporting claim CLM-0354: parent Mohamed Imaduddine (P77) -> Ibrahim Iskander (P78) (SRC-WIKI-MONARCHS, grade B); excerpt: List of Maldivian monarchs family/genealogy content lists P77 Mohamed Imaduddine as parent of P78 Ibrahim Iskander.",
      "Supporting claim CLM-0355: parent Mohamed Imaduddine (P77) -> Mohamed Imaduddine (P79) (SRC-WIKI-MONARCHS, grade B); excerpt: List of Maldivian monarchs family/genealogy content lists P77 Mohamed Imaduddine as parent of P79 Mohamed Imaduddine.",
      "Supporting claim CLM-0356: parent Ibrahim Iskander (P78) -> Mohamed Ghiyathuddine (P81) (SRC-WIKI-MONARCHS, grade B); excerpt: List of Maldivian monarchs family/genealogy content lists P78 Ibrahim Iskander as parent of P81 Mohamed Ghiyathuddine.",
      "Combined interpretation: these anchors keep the pair in-model as inferred sibling (brothers), but not promoted to confirmed until explicit pairwise wording is found.",
      "Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement."
    ],
    verification: [
      "Promotion requirement: A/B source explicitly naming P78 and P79 as brothers.",
      "Downgrade/removal trigger: Source-backed change to either P77 parent link for P78 or P79.",
      "Review cadence: Re-check after Dhiyamigili corroboration queue delivery."
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

# Inference Dossier

Edge key: `sibling|P78|P79|brothers`  
Last updated: `2026-02-08`  
Inference class: `curated`

## 1) Edge identity
- Relation type: sibling
- Source node: Ibrahim Iskander (P78)
- Target node: Mohamed Imaduddine (P79)
- Label: brothers
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: This edge models P78 and P79 as brothers because both are explicitly parent-linked to P77, but direct pairwise sibling wording between the two remains to be captured.
- Historical/dynastic context: Dhiyamigili succession handover from P77 into P78/P79.
- Immediate claim anchors used for this pair review:
- CLM-0354: parent Mohamed Imaduddine (P77) -> Ibrahim Iskander (P78) (SRC-WIKI-MONARCHS, grade B)
- CLM-0355: parent Mohamed Imaduddine (P77) -> Mohamed Imaduddine (P79) (SRC-WIKI-MONARCHS, grade B)
- CLM-0356: parent Ibrahim Iskander (P78) -> Mohamed Ghiyathuddine (P81) (SRC-WIKI-MONARCHS, grade B)

## 3) Logic chain (pair-specific)
1. This pair is retained as inferred sibling (brothers) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.
2. Supporting claim CLM-0354: parent Mohamed Imaduddine (P77) -> Ibrahim Iskander (P78) (SRC-WIKI-MONARCHS, grade B); excerpt: List of Maldivian monarchs family/genealogy content lists P77 Mohamed Imaduddine as parent of P78 Ibrahim Iskander.
3. Supporting claim CLM-0355: parent Mohamed Imaduddine (P77) -> Mohamed Imaduddine (P79) (SRC-WIKI-MONARCHS, grade B); excerpt: List of Maldivian monarchs family/genealogy content lists P77 Mohamed Imaduddine as parent of P79 Mohamed Imaduddine.
4. Supporting claim CLM-0356: parent Ibrahim Iskander (P78) -> Mohamed Ghiyathuddine (P81) (SRC-WIKI-MONARCHS, grade B); excerpt: List of Maldivian monarchs family/genealogy content lists P78 Ibrahim Iskander as parent of P81 Mohamed Ghiyathuddine.
5. Combined interpretation: these anchors keep the pair in-model as inferred sibling (brothers), but not promoted to confirmed until explicit pairwise wording is found.
6. Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement.

## 4) Alternative interpretations
- Half-brother status is possible if maternal branches diverge in stronger records.
- One endpoint could belong to a collateral successor branch under alternate chronicle interpretation.
- If direct wording differs, the label must follow that sourced relation class.

## 5) Verification checklist
- Promotion requirement: A/B source explicitly naming P78 and P79 as brothers.
- Downgrade/removal trigger: Source-backed change to either P77 parent link for P78 or P79.
- Review cadence: Re-check after Dhiyamigili corroboration queue delivery.

## 6) Source basis
- `SRC-WIKI-MONARCHS (List of Maldivian monarchs)`
- Primary inferred claim row: CLM-0447
- Inferred claim locator: SRC-WIKI-MONARCHS page (https://en.wikipedia.org/wiki/List_of_Maldivian_monarchs), monarch-list table/notes entries for P78 Ibrahim Iskander and P79 Mohamed Imaduddine (sibling (brothers)) in 2026-02-08 snapshot.
- Supporting direct-claim locators reviewed:
- CLM-0354: SRC-WIKI-MONARCHS page (https://en.wikipedia.org/wiki/List_of_Maldivian_monarchs), monarch-list table/notes entries for P77 Mohamed Imaduddine and P78 Ibrahim Iskander (parent) in 2026-02-08 snapshot.
- CLM-0355: SRC-WIKI-MONARCHS page (https://en.wikipedia.org/wiki/List_of_Maldivian_monarchs), monarch-list table/notes entries for P77 Mohamed Imaduddine and P79 Mohamed Imaduddine (parent) in 2026-02-08 snapshot.
- CLM-0356: SRC-WIKI-MONARCHS page (https://en.wikipedia.org/wiki/List_of_Maldivian_monarchs), monarch-list table/notes entries for P78 Ibrahim Iskander and P81 Mohamed Ghiyathuddine (parent) in 2026-02-08 snapshot.

## 7) Integration notes
- `src/data/inference-notes.js` summary update needed: yes (keep wording aligned with this curated rationale).
- Edge label/type update needed: no (pending direct pairwise wording).
- Canonical promotion candidate: no (remains inferred).
- Verification priority level: high (Dhiyamigili sequence anchor)

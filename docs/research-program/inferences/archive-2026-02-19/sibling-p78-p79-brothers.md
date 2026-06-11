# Inference Dossier

Edge key: `sibling|P78|P79|brothers`  
Last updated: `2026-02-19`  
Inference class: `curated`

## 1) Edge identity
- Relation type: sibling
- Source node: P78 Ibrahim Iskander (Rannava Loka)
- Target node: P79 Mohamed Imaduddine (Navaranna Keerithi)
- Label: brothers
- Current confidence marker (`c/i/u`): c
- Current grade (`A/B/C/D`): B

## 2) Why this specific pair is modeled
- Pair summary: P78 Ibrahim Iskander (Rannava Loka) and P79 Mohamed Imaduddine (Navaranna Keerithi) are modeled as `sibling` with label `brothers` to preserve a targeted continuity claim without over-promoting certainty.
- Historical/dynastic context: Dhiyamigili -> Dhiyamigili
- Immediate direct-claim anchors around these nodes:
- CLM-0354: parent P77 Mohamed Imaduddine (Kula Sundhura Siyaaaka) -> P78 Ibrahim Iskander (Rannava Loka) (SRC-WIKI-MONARCHS, grade B)
- CLM-0355: parent P77 Mohamed Imaduddine (Kula Sundhura Siyaaaka) -> P79 Mohamed Imaduddine (Navaranna Keerithi) (SRC-WIKI-MONARCHS, grade B)
- CLM-0356: parent P78 Ibrahim Iskander (Rannava Loka) -> P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) (SRC-WIKI-MONARCHS, grade B)
- CLM-0447: sibling P78 Ibrahim Iskander (Rannava Loka) <-> P79 Mohamed Imaduddine (Navaranna Keerithi) [brothers] (SRC-WIKI-MONARCHS, grade B)

## 3) Logic chain (pair-specific)
1. Shortest direct-claim support path (1 step) linking this pair:
2. - sibling P78 Ibrahim Iskander (Rannava Loka) <-> P79 Mohamed Imaduddine (Navaranna Keerithi) [brothers] (CLM-0447, SRC-WIKI-MONARCHS)
3. This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.
4. Current modeling choice remains `inferred` because explicit source wording that names `sibling` for P78 Ibrahim Iskander (Rannava Loka) and P79 Mohamed Imaduddine (Navaranna Keerithi) is still absent.

## 4) Alternative interpretations
- Possible competing interpretation: half-sibling or cousin if shared-parent evidence is partial rather than full.
- Competing interpretation trigger: direct wording that uses non-sibling kin terminology for this pair.
- Model-retention rationale: keep the edge as inferred until explicit pairwise wording is located.

## 5) Verification checklist
- Promotion requirement: an A/B source statement explicitly naming P78 Ibrahim Iskander (Rannava Loka) and P79 Mohamed Imaduddine (Navaranna Keerithi) with relation class `sibling` (brothers).
- Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.
- Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster.

## 6) Source basis
- `SRC-WIKI-MONARCHS` (List of Maldivian monarchs)
- `SRC-ROYALARK-MALDIVES` (RoyalArk Maldives — Complete Genealogical Database (segments 3-16))
- Primary inferred claim row: CLM-0447
- Inferred claim locator: SRC-WIKI-MONARCHS page (https://en.wikipedia.org/wiki/List_of_Maldivian_monarchs), monarch-list table/notes entries for P78 Ibrahim Iskander and P79 Mohamed Imaduddine (sibling (brothers)) in 2026-02-08 snapshot.

## 7) Integration notes
- `src/data/inference-notes.js` summary should be synced if relation wording changes after verification.
- Canonical promotion candidate: no (remains inferred until explicit pairwise wording is captured).
- Verification priority level: high (current grade B)

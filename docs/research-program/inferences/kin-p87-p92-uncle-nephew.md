# Inference Dossier

Edge key: `kin|P87|P92|uncle/nephew`  
Last updated: `2026-02-10`  
Inference class: `curated`

## 1) Edge identity
- Relation type: kin
- Source node: P87 Ibrahim Nooredine (Keerithi Maha Radun)
- Target node: P92 Mohamed Imaduddine VI (Keerithi Maha Radun)
- Label: uncle/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P87 Ibrahim Nooredine (Keerithi Maha Radun) and P92 Mohamed Imaduddine VI (Keerithi Maha Radun) are modeled as `kin` with label `uncle/nephew` to preserve a targeted continuity claim without over-promoting certainty.
- Historical/dynastic context: Huraagey -> Huraagey
- Immediate direct-claim anchors around these nodes:
- CLM-0208: kin P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) <-> P92 Mohamed Imaduddine VI (Keerithi Maha Radun) [grandfather] (SRC-MRF-KINGS, grade B)
- CLM-0210: kin P87 Ibrahim Nooredine (Keerithi Maha Radun) <-> P88 Mohamed Mueenuddine (Keerithi Maha Radun) [uncle/nephew] (SRC-MRF-KINGS, grade B)
- CLM-0212: kin P87 Ibrahim Nooredine (Keerithi Maha Radun) <-> P95 Mohamed Farid (Keerithi Maha Radun) [grandfather (via daughter)] (SRC-MRF-KINGS, grade B)
- CLM-0289: parent P155 Maandhoogey Bodu Dhorhy Manippulu -> P92 Mohamed Imaduddine VI (Keerithi Maha Radun) (SRC-MRF-KINGS, grade B)
- CLM-0324: parent P186 Maandhoogey Don Didi -> P92 Mohamed Imaduddine VI (Keerithi Maha Radun) (SRC-MRF-KINGS, grade B)
- CLM-0363: parent P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) -> P87 Ibrahim Nooredine (Keerithi Maha Radun) (SRC-MRF-KINGS, grade B)

## 3) Logic chain (pair-specific)
1. Shortest direct-claim support path (2 steps) linking this pair:
2. - parent P87 Ibrahim Nooredine (Keerithi Maha Radun) -> P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) (CLM-0363, SRC-MRF-KINGS)
3. - kin P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) <-> P92 Mohamed Imaduddine VI (Keerithi Maha Radun) [grandfather] (CLM-0208, SRC-MRF-KINGS)
4. This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.
5. Current modeling choice remains `inferred` because explicit source wording that names `kin` for P87 Ibrahim Nooredine (Keerithi Maha Radun) and P92 Mohamed Imaduddine VI (Keerithi Maha Radun) is still absent.

## 4) Alternative interpretations
- Possible competing interpretation: broader political/dynastic proximity without blood-kin specificity.
- Competing interpretation trigger: explicit source that either gives a narrower relation or denies direct family continuity.
- Model-retention rationale: keep the edge as inferred until explicit pairwise wording is located.

## 5) Verification checklist
- Promotion requirement: an A/B source statement explicitly naming P87 Ibrahim Nooredine (Keerithi Maha Radun) and P92 Mohamed Imaduddine VI (Keerithi Maha Radun) with relation class `kin` (uncle/nephew).
- Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.
- Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster.

## 6) Source basis
- `SRC-WIKI-MONARCHS` (List of Maldivian monarchs)
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0211
- Inferred claim locator: SRC-WIKI-MONARCHS page (https://en.wikipedia.org/wiki/List_of_Maldivian_monarchs), monarch-list table/notes entries for P87 Ibrahim Nooredine and P92 Mohamed Imaduddine VI (kin (uncle/nephew)) in 2026-02-08 snapshot.

## 7) Integration notes
- `src/data/inference-notes.js` summary should be synced if relation wording changes after verification.
- Canonical promotion candidate: no (remains inferred until explicit pairwise wording is captured).
- Verification priority level: high (current grade C)

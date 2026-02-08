# Inference Dossier

Edge key: `kin|P87|P92|uncle/nephew`  
Last updated: `2026-02-08`  
Inference class: `curated`

## 1) Edge identity
- Relation type: kin
- Source node: Ibrahim Nooredine (P87)
- Target node: Mohamed Imaduddine VI (P92)
- Label: uncle/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: This edge keeps an uncle-nephew interpretation between P87 and P92 by combining the P86->P87 parent line with documented P86->P92 grandparent framing.
- Historical/dynastic context: Late Huraagey branch around Ibrahim Nooredine and Mohamed Imaduddine VI.
- Immediate claim anchors used for this pair review:
- CLM-0363: parent Mohamed Imaduddine (P86) -> Ibrahim Nooredine (P87) (SRC-MRF-KINGS, grade B)
- CLM-0208: kin Mohamed Imaduddine (P86) -> Mohamed Imaduddine VI (P92) [grandfather] (SRC-MRF-KINGS, grade B)
- CLM-0365: parent Ibrahim Nooredine (P87) -> Mohamed Imaduddine V (P90) (SRC-MRF-KINGS, grade B)
- CLM-0366: parent Ibrahim Nooredine (P87) -> Mohamed Shamsuddine III (P91) (SRC-MRF-KINGS, grade B)

## 3) Logic chain (pair-specific)
1. This pair is retained as inferred kin (uncle/nephew) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.
2. Supporting claim CLM-0363: parent Mohamed Imaduddine (P86) -> Ibrahim Nooredine (P87) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P86 Mohamed Imaduddine as parent of P87 Ibrahim Nooredine.
3. Supporting claim CLM-0208: kin Mohamed Imaduddine (P86) -> Mohamed Imaduddine VI (P92) [grandfather] (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List dynastic context links P86 Mohamed Imaduddine and P92 Mohamed Imaduddine VI in kin relation (grandfather).
4. Supporting claim CLM-0365: parent Ibrahim Nooredine (P87) -> Mohamed Imaduddine V (P90) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P87 Ibrahim Nooredine as parent of P90 Mohamed Imaduddine V.
5. Supporting claim CLM-0366: parent Ibrahim Nooredine (P87) -> Mohamed Shamsuddine III (P91) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P87 Ibrahim Nooredine as parent of P91 Mohamed Shamsuddine III.
6. Combined interpretation: these anchors keep the pair in-model as inferred kin (uncle/nephew), but not promoted to confirmed until explicit pairwise wording is found.
7. Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement.

## 4) Alternative interpretations
- The relation may be grand-uncle or another collateral form rather than direct avuncular.
- Conflicting parent assignments could move the relation to cousin-line kin.
- If direct wording appears with a different kin class, reclassify immediately.

## 5) Verification checklist
- Promotion requirement: A/B source explicitly naming P87 and P92 as uncle/nephew.
- Downgrade/removal trigger: Revised parentage that breaks the avuncular interpretation.
- Review cadence: Re-check after each Huraagey late-period corroboration batch.

## 6) Source basis
- `SRC-WIKI-MONARCHS (List of Maldivian monarchs)`
- `SRC-MRF-KINGS (Maldives Kings List)`
- Primary inferred claim row: CLM-0211
- Inferred claim locator: SRC-WIKI-MONARCHS page (https://en.wikipedia.org/wiki/List_of_Maldivian_monarchs), monarch-list table/notes entries for P87 Ibrahim Nooredine and P92 Mohamed Imaduddine VI (kin (uncle/nephew)) in 2026-02-08 snapshot.
- Supporting direct-claim locators reviewed:
- CLM-0363: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P86 Mohamed Imaduddine and P87 Ibrahim Nooredine (parent) in 2026-02-08 sn…
- CLM-0208: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P86 Mohamed Imaduddine and P92 Mohamed Imaduddine VI (kin (grandfather)) i…
- CLM-0365: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P87 Ibrahim Nooredine and P90 Mohamed Imaduddine V (parent) in 2026-02-08…
- CLM-0366: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P87 Ibrahim Nooredine and P91 Mohamed Shamsuddine III (parent) in 2026-02-…

## 7) Integration notes
- `src/data/inference-notes.js` summary update needed: yes (keep wording aligned with this curated rationale).
- Edge label/type update needed: no (pending direct pairwise wording).
- Canonical promotion candidate: no (remains inferred).
- Verification priority level: high (late-monarchy branch interpretation)

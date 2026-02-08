# Inference Dossier

Edge key: `kin|P104|P68|reported shared Utheemu lineage branch`  
Last updated: `2026-02-08`  
Inference class: `curated`

## 1) Edge identity
- Relation type: kin
- Source node: Mohamed Thakurufaanu al-Auzam (P104)
- Target node: Mohamed Imaduddine (P68)
- Label: reported shared Utheemu lineage branch
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): B

## 2) Why this specific pair is modeled
- Pair summary: This edge preserves a narrow lineage-continuity hypothesis between Mohamed Thakurufaanu al-Auzam and a later Utheemu sovereign node without overstating a proven direct blood line.
- Historical/dynastic context: Utheemu-era resistance and succession memory crossing into the later seventeenth-century Utheemu sovereign cluster.
- Immediate claim anchors used for this pair review:
- CLM-0227: parent Hussain Thakurufan (P103) -> Mohamed Thakurufaanu al-Auzam (P104) (SRC-MRF-UTHEEM, grade A)
- CLM-0228: parent Mohamed Thakurufaanu al-Auzam (P104) -> Ibrahim Kalaafaan (P106) (SRC-MRF-UTHEEM, grade B)
- CLM-0372: sibling Mohamed Thakurufaanu al-Auzam (P104) -> Hassan Thakurufan (P105) [brothers] (SRC-MRF-UTHEEM, grade B)
- CLM-0350: parent Mohamed Imaduddine (P68) -> Iskander Ibrahim (P69) (SRC-MRF-KINGS, grade B)

## 3) Logic chain (pair-specific)
1. This pair is retained as inferred kin (reported shared Utheemu lineage branch) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.
2. Supporting claim CLM-0227: parent Hussain Thakurufan (P103) -> Mohamed Thakurufaanu al-Auzam (P104) (SRC-MRF-UTHEEM, grade A); excerpt: Utheem Dynasty family/genealogy content lists P103 Hussain Thakurufan as parent of P104 Mohamed Thakurufaanu al-Auzam.
3. Supporting claim CLM-0228: parent Mohamed Thakurufaanu al-Auzam (P104) -> Ibrahim Kalaafaan (P106) (SRC-MRF-UTHEEM, grade B); excerpt: Utheem Dynasty family/genealogy content lists P104 Mohamed Thakurufaanu al-Auzam as parent of P106 Ibrahim Kalaafaan.
4. Supporting claim CLM-0372: sibling Mohamed Thakurufaanu al-Auzam (P104) -> Hassan Thakurufan (P105) [brothers] (SRC-MRF-UTHEEM, grade B); excerpt: Utheem Dynasty family/genealogy content links P104 Mohamed Thakurufaanu al-Auzam and P105 Hassan Thakurufan as siblings (brothers).
5. Supporting claim CLM-0350: parent Mohamed Imaduddine (P68) -> Iskander Ibrahim (P69) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P68 Mohamed Imaduddine as parent of P69 Iskander Ibrahim.
6. Combined interpretation: these anchors keep the pair in-model as inferred kin (reported shared Utheemu lineage branch), but not promoted to confirmed until explicit pairwise wording is found.
7. Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement.

## 4) Alternative interpretations
- The tie may represent house-level political continuity language rather than a strict genealogical degree.
- The relation may be real but of different granularity (ancestor-branch link rather than close kin).
- If a primary chronicle gives a different Utheemu branch path, this edge should be recast with that exact wording.

## 5) Verification checklist
- Promotion requirement: A/B wording that explicitly names P104 and P68 in one statement with a concrete kin class.
- Downgrade/removal trigger: Primary-source branch evidence that separates P104 and P68 into non-overlapping lines.
- Review cadence: Re-check after each Utheemu chronicle/manuscript extraction batch.

## 6) Source basis
- `SRC-MRF-UTHEEM (Utheem Dynasty)`
- `SRC-WIKI-MONARCHS (List of Maldivian monarchs)`
- `SRC-MRF-KINGS (Maldives Kings List)`
- Primary inferred claim row: CLM-0010
- Inferred claim locator: SRC-MRF-UTHEEM r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_utheem.shtml), dynasty/lineage entry context for P104 Mohamed Thakurufaanu al-Auzam and P68 Mohamed Imaduddine (kin (reported shared Utheemu lineage branch)) in 2026-02-08 snapshot.
- Supporting direct-claim locators reviewed:
- CLM-0227: SRC-MRF-UTHEEM r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_utheem.shtml), dynasty/lineage entry context for P103 Hussain Thakurufan and P104 Mohamed Thakurufaanu al-Auzam (parent) in 2026-02…
- CLM-0228: SRC-MRF-UTHEEM r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_utheem.shtml), dynasty/lineage entry context for P104 Mohamed Thakurufaanu al-Auzam and P106 Ibrahim Kalaafaan (parent) in 2026-02-…
- CLM-0372: SRC-MRF-UTHEEM r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_utheem.shtml), dynasty/lineage entry context for P104 Mohamed Thakurufaanu al-Auzam and P105 Hassan Thakurufan (sibling (brothers))…
- CLM-0350: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P68 Mohamed Imaduddine and P69 Iskander Ibrahim (parent) in 2026-02-08 sna…

## 7) Integration notes
- `src/data/inference-notes.js` summary update needed: yes (keep wording aligned with this curated rationale).
- Edge label/type update needed: no (pending direct pairwise wording).
- Canonical promotion candidate: no (remains inferred).
- Verification priority level: high (bridge edge linking two high-visibility Utheemu clusters)

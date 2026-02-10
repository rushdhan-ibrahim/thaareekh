# Inference Dossier

Edge key: `kin|P104|P68|reported shared Utheemu lineage branch`  
Last updated: `2026-02-10`  
Inference class: `curated`

## 1) Edge identity
- Relation type: kin
- Source node: P104 Mohamed Thakurufaanu al-Auzam
- Target node: P68 Mohamed Imaduddine (Kula Sundhura Katthiri Bavana)
- Label: reported shared Utheemu lineage branch
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): B

## 2) Why this specific pair is modeled
- Pair summary: P104 Mohamed Thakurufaanu al-Auzam and P68 Mohamed Imaduddine (Kula Sundhura Katthiri Bavana) are modeled as `kin` with label `reported shared Utheemu lineage branch` to preserve a targeted continuity claim without over-promoting certainty.
- Historical/dynastic context: Utheemu -> Utheemu
- Immediate direct-claim anchors around these nodes:
- CLM-0227: parent P103 Hussain Thakurufan -> P104 Mohamed Thakurufaanu al-Auzam (SRC-MRF-UTHEEM, grade A)
- CLM-0008: kin P61 Hassan IX / Dom Manoel (Dhirikusa Loka) <-> P104 Mohamed Thakurufaanu al-Auzam [regnal contest context] (SRC-MRF-UTHEEM, grade B)
- CLM-0009: kin P66 Joao’ (Keerithi Maha Radun) <-> P104 Mohamed Thakurufaanu al-Auzam [co-regency framework] (SRC-MRF-UTHEEM, grade B)
- CLM-0228: parent P104 Mohamed Thakurufaanu al-Auzam -> P106 Ibrahim Kalaafaan (SRC-MRF-UTHEEM, grade B)
- CLM-0350: parent P68 Mohamed Imaduddine (Kula Sundhura Katthiri Bavana) -> P69 Iskander Ibrahim (Kula Ran Meeba Katthiri) (SRC-MRF-KINGS, grade B)
- CLM-0372: sibling P104 Mohamed Thakurufaanu al-Auzam <-> P105 Hassan Thakurufan [brothers] (SRC-MRF-UTHEEM, grade B)

## 3) Logic chain (pair-specific)
1. No short direct-claim path (<=4 steps) was found in the current direct-edge set for this exact node pair.
2. Inference currently rests on curated branch-context interpretation plus source-level continuity wording, not a direct named relation statement.
3. Current modeling choice remains `inferred` because explicit source wording that names `kin` for P104 Mohamed Thakurufaanu al-Auzam and P68 Mohamed Imaduddine (Kula Sundhura Katthiri Bavana) is still absent.

## 4) Alternative interpretations
- Possible competing interpretation: broader political/dynastic proximity without blood-kin specificity.
- Competing interpretation trigger: explicit source that either gives a narrower relation or denies direct family continuity.
- Model-retention rationale: keep the edge as inferred until explicit pairwise wording is located.

## 5) Verification checklist
- Promotion requirement: an A/B source statement explicitly naming P104 Mohamed Thakurufaanu al-Auzam and P68 Mohamed Imaduddine (Kula Sundhura Katthiri Bavana) with relation class `kin` (reported shared Utheemu lineage branch).
- Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.
- Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster.

## 6) Source basis
- `SRC-MRF-UTHEEM` (Utheem Dynasty)
- `SRC-WIKI-MONARCHS` (List of Maldivian monarchs)
- Primary inferred claim row: CLM-0010
- Inferred claim locator: SRC-MRF-UTHEEM r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_utheem.shtml), dynasty/lineage entry context for P104 Mohamed Thakurufaanu al-Auzam and P68 Mohamed Imaduddine (kin (reported shared Utheemu lineage branch)) in 2026-02-...

## 7) Integration notes
- `src/data/inference-notes.js` summary should be synced if relation wording changes after verification.
- Canonical promotion candidate: no (remains inferred until explicit pairwise wording is captured).
- Verification priority level: high (current grade B)

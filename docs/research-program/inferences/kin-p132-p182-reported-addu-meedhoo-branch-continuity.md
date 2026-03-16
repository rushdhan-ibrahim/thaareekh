# Inference Dossier

Edge key: `kin|P182|P132|reported Addu/Meedhoo branch continuity`  
Last updated: `2026-02-19`  
Inference class: `curated`

## 1) Edge identity
- Relation type: kin
- Source node: P182 El-Naib Ganduvaru Mohamed Thakurufan
- Target node: P132 Al-Naib Muhammad Thakurufaanu of Addu
- Label: reported Addu/Meedhoo branch continuity
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P182 El-Naib Ganduvaru Mohamed Thakurufan and P132 Al-Naib Muhammad Thakurufaanu of Addu are modeled as `kin` with label `reported Addu/Meedhoo branch continuity` to preserve a targeted continuity claim without over-promoting certainty.
- Historical/dynastic context: Addu Line -> Addu Line
- Immediate direct-claim anchors around these nodes:
- CLM-0070: kin P132 Al-Naib Muhammad Thakurufaanu of Addu <-> P133 Ibrahim Al-Husainee [grandparental line context] (SRC-WIKI-ABDUL-GAYOOM-IBRAHIM, grade B)
- CLM-0320: parent P182 El-Naib Ganduvaru Mohamed Thakurufan -> P183 Ganduvaru Hassan Didi (SRC-MRF-MIDU-ROYAL, grade B)
- CLM-0463: spouse P180 Princess Aishath Didi <-> P182 El-Naib Ganduvaru Mohamed Thakurufan [married] (SRC-MRF-MIDU-ROYAL, grade B)

## 3) Logic chain (pair-specific)
1. No short direct-claim path (<=4 steps) was found in the current direct-edge set for this exact node pair.
2. Inference currently rests on curated branch-context interpretation plus source-level continuity wording, not a direct named relation statement.
3. Current modeling choice remains `inferred` because explicit source wording that names `kin` for P182 El-Naib Ganduvaru Mohamed Thakurufan and P132 Al-Naib Muhammad Thakurufaanu of Addu is still absent.

## 4) Alternative interpretations
- Possible competing interpretation: broader political/dynastic proximity without blood-kin specificity.
- Competing interpretation trigger: explicit source that either gives a narrower relation or denies direct family continuity.
- Model-retention rationale: keep the edge as inferred until explicit pairwise wording is located.

## 5) Verification checklist
- Promotion requirement: an A/B source statement explicitly naming P182 El-Naib Ganduvaru Mohamed Thakurufan and P132 Al-Naib Muhammad Thakurufaanu of Addu with relation class `kin` (reported Addu/Meedhoo branch continuity).
- Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.
- Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster.

## 6) Source basis
- `SRC-MRF-MIDU-ROYAL` (Midu Royal Family Branch (Addu/Meedhoo records))
- `SRC-WIKI-ABDUL-GAYOOM-IBRAHIM` (Abdul Gayoom Ibrahim)
- Primary inferred claim row: CLM-0071
- Inferred claim locator: SRC-MRF-MIDU-ROYAL r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_midu.shtml), dynasty/lineage entry context for P132 Al-Naib Muhammad Thakurufaanu of Addu and P182 El-Naib Ganduvaru Mohamed Thakurufan (kin (reported Addu/Meedhoo b...

## 7) Integration notes
- `src/data/inference-notes.js` summary should be synced if relation wording changes after verification.
- Canonical promotion candidate: no (remains inferred until explicit pairwise wording is captured).
- Verification priority level: high (current grade C)

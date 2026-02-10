# Inference Dossier

Edge key: `kin|P130|P132|possible southern-branch continuity (Addu/Fuvahmulah)`  
Last updated: `2026-02-10`  
Inference class: `curated`

## 1) Edge identity
- Relation type: kin
- Source node: P130 Prince Ibrahim Faamuladheyri Kilegefaanu
- Target node: P132 Al-Naib Muhammad Thakurufaanu of Addu
- Label: possible southern-branch continuity (Addu/Fuvahmulah)
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): B

## 2) Why this specific pair is modeled
- Pair summary: P130 Prince Ibrahim Faamuladheyri Kilegefaanu and P132 Al-Naib Muhammad Thakurufaanu of Addu are modeled as `kin` with label `possible southern-branch continuity (Addu/Fuvahmulah)` to preserve a targeted continuity claim without over-promoting certainty.
- Historical/dynastic context: Dhiyamigili -> Addu Line
- Immediate direct-claim anchors around these nodes:
- CLM-0070: kin P132 Al-Naib Muhammad Thakurufaanu of Addu <-> P133 Ibrahim Al-Husainee [grandparental line context] (SRC-WIKI-ABDUL-GAYOOM-IBRAHIM, grade B)
- CLM-0265: parent P130 Prince Ibrahim Faamuladheyri Kilegefaanu -> P131 Mohamed Didi (SRC-WIKI-PRINCE-IBRAHIM-FAAMULADHEYRI, grade B)
- CLM-0266: parent P130 Prince Ibrahim Faamuladheyri Kilegefaanu -> P140 Al-Nabeel Karayye Hassan Didi (SRC-WIKI-IBRAHIM-NASIR, grade B)
- CLM-0267: parent P130 Prince Ibrahim Faamuladheyri Kilegefaanu -> P180 Princess Aishath Didi (SRC-MRF-MIDU-ROYAL, grade B)
- CLM-0359: parent P81 Mohamed Ghiyathuddine (Kula Rannmani Keerithi) -> P130 Prince Ibrahim Faamuladheyri Kilegefaanu (SRC-WIKI-PRINCE-IBRAHIM-FAAMULADHEYRI, grade B)

## 3) Logic chain (pair-specific)
1. No short direct-claim path (<=4 steps) was found in the current direct-edge set for this exact node pair.
2. Inference currently rests on curated branch-context interpretation plus source-level continuity wording, not a direct named relation statement.
3. Current modeling choice remains `inferred` because explicit source wording that names `kin` for P130 Prince Ibrahim Faamuladheyri Kilegefaanu and P132 Al-Naib Muhammad Thakurufaanu of Addu is still absent.

## 4) Alternative interpretations
- Possible competing interpretation: broader political/dynastic proximity without blood-kin specificity.
- Competing interpretation trigger: explicit source that either gives a narrower relation or denies direct family continuity.
- Model-retention rationale: keep the edge as inferred until explicit pairwise wording is located.

## 5) Verification checklist
- Promotion requirement: an A/B source statement explicitly naming P130 Prince Ibrahim Faamuladheyri Kilegefaanu and P132 Al-Naib Muhammad Thakurufaanu of Addu with relation class `kin` (possible southern-branch continuity (Addu/Fuvahmulah)).
- Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.
- Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster.

## 6) Source basis
- `SRC-WIKI-PRINCE-IBRAHIM-FAAMULADHEYRI` (Prince Ibrahim, Faamuladheyri Kilegefaanu)
- `SRC-WIKI-ABDUL-GAYOOM-IBRAHIM` (Abdul Gayoom Ibrahim)
- Primary inferred claim row: CLM-0063
- Inferred claim locator: SRC-WIKI-PRINCE-IBRAHIM-FAAMULADHEYRI raw page (https://en.wikipedia.org/w/index.php?title=Prince_Ibrahim,_Faamuladheyri_Kilegefaanu&action=raw), infobox/biographical family fields linking P130 Prince Ibrahim Faamuladheyri Kilegefaanu and P132 Al-Naib Muham...

## 7) Integration notes
- `src/data/inference-notes.js` summary should be synced if relation wording changes after verification.
- Canonical promotion candidate: no (remains inferred until explicit pairwise wording is captured).
- Verification priority level: high (current grade B)

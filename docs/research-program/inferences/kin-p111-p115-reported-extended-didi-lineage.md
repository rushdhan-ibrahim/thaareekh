# Inference Dossier

Edge key: `kin|P111|P115|reported extended Didi lineage`  
Last updated: `2026-02-10`  
Inference class: `curated`

## 1) Edge identity
- Relation type: kin
- Source node: P111 Prince Abdul Majeed Didi
- Target node: P115 Ibrahim Nasir
- Label: reported extended Didi lineage
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): B

## 2) Why this specific pair is modeled
- Pair summary: P111 Prince Abdul Majeed Didi and P115 Ibrahim Nasir are modeled as `kin` with label `reported extended Didi lineage` to preserve a targeted continuity claim without over-promoting certainty.
- Historical/dynastic context: Modern -> Modern
- Immediate direct-claim anchors around these nodes:
- CLM-0244: parent P116 Ahmed Didi -> P115 Ibrahim Nasir (SRC-PO-NASIR, grade A)
- CLM-0245: parent P117 Nayaage Aishath Didi -> P115 Ibrahim Nasir (SRC-PO-NASIR, grade A)
- CLM-0233: parent P111 Prince Abdul Majeed Didi -> P190 Hassan Fareed Didi (SRC-WIKI-HASSAN-FARID, grade B)
- CLM-0234: parent P111 Prince Abdul Majeed Didi -> P191 Ibrahim Fareed Didi (SRC-WIKI-IBRAHIM-FAREED, grade B)
- CLM-0235: parent P111 Prince Abdul Majeed Didi -> P95 Mohamed Farid (Keerithi Maha Radun) (SRC-WIKI-ABDUL-MAJEED, grade B)
- CLM-0238: parent P115 Ibrahim Nasir -> P124 Ali Nasir (SRC-WIKI-IBRAHIM-NASIR, grade B)

## 3) Logic chain (pair-specific)
1. No short direct-claim path (<=4 steps) was found in the current direct-edge set for this exact node pair.
2. Inference currently rests on curated branch-context interpretation plus source-level continuity wording, not a direct named relation statement.
3. Current modeling choice remains `inferred` because explicit source wording that names `kin` for P111 Prince Abdul Majeed Didi and P115 Ibrahim Nasir is still absent.

## 4) Alternative interpretations
- Possible competing interpretation: broader political/dynastic proximity without blood-kin specificity.
- Competing interpretation trigger: explicit source that either gives a narrower relation or denies direct family continuity.
- Model-retention rationale: keep the edge as inferred until explicit pairwise wording is located.

## 5) Verification checklist
- Promotion requirement: an A/B source statement explicitly naming P111 Prince Abdul Majeed Didi and P115 Ibrahim Nasir with relation class `kin` (reported extended Didi lineage).
- Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.
- Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster.

## 6) Source basis
- `SRC-WIKI-IBRAHIM-NASIR` (Ibrahim Nasir)
- Primary inferred claim row: CLM-0021
- Inferred claim locator: SRC-WIKI-IBRAHIM-NASIR raw page (https://en.wikipedia.org/w/index.php?title=Ibrahim_Nasir&action=raw), infobox/biographical family fields linking P111 Prince Abdul Majeed Didi and P115 Ibrahim Nasir (kin (reported extended Didi lineage)) in 2026-02-08 snaps...

## 7) Integration notes
- `src/data/inference-notes.js` summary should be synced if relation wording changes after verification.
- Canonical promotion candidate: no (remains inferred until explicit pairwise wording is captured).
- Verification priority level: high (current grade B)

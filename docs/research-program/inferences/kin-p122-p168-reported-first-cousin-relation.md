# Inference Dossier

Edge key: `kin|P122|P168|reported first-cousin relation`  
Last updated: `2026-02-19`  
Inference class: `curated`

## 1) Edge identity
- Relation type: kin
- Source node: P122 Mohamed Nasheed
- Target node: P168 Fazna Ahmed
- Label: reported first-cousin relation
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): B

## 2) Why this specific pair is modeled
- Pair summary: P122 Mohamed Nasheed and P168 Fazna Ahmed are modeled as `kin` with label `reported first-cousin relation` to preserve a targeted continuity claim without over-promoting certainty.
- Historical/dynastic context: Modern -> Modern
- Immediate direct-claim anchors around these nodes:
- CLM-0254: parent P122 Mohamed Nasheed -> P125 Meera Laila Nasheed (SRC-WIKI-NASHEED, grade B)
- CLM-0255: parent P122 Mohamed Nasheed -> P126 Zaya Laila Nasheed (SRC-WIKI-NASHEED, grade B)
- CLM-0258: parent P127 Abdul Sattar Umar -> P122 Mohamed Nasheed (SRC-ATOLL-NASHEED-PARENTS, grade B)
- CLM-0259: parent P128 Abida Mohamed -> P122 Mohamed Nasheed (SRC-ATOLL-NASHEED-PARENTS, grade B)
- CLM-0305: parent P168 Fazna Ahmed -> P169 Sarah Ibrahim Solih (SRC-WIKI-SOLIH, grade B)
- CLM-0306: parent P168 Fazna Ahmed -> P170 Yaman Ibrahim Solih (SRC-WIKI-SOLIH, grade B)

## 3) Logic chain (pair-specific)
1. No short direct-claim path (<=4 steps) was found in the current direct-edge set for this exact node pair.
2. Inference currently rests on curated branch-context interpretation plus source-level continuity wording, not a direct named relation statement.
3. Current modeling choice remains `inferred` because explicit source wording that names `kin` for P122 Mohamed Nasheed and P168 Fazna Ahmed is still absent.

## 4) Alternative interpretations
- Possible competing interpretation: broader political/dynastic proximity without blood-kin specificity.
- Competing interpretation trigger: explicit source that either gives a narrower relation or denies direct family continuity.
- Model-retention rationale: keep the edge as inferred until explicit pairwise wording is located.

## 5) Verification checklist
- Promotion requirement: an A/B source statement explicitly naming P122 Mohamed Nasheed and P168 Fazna Ahmed with relation class `kin` (reported first-cousin relation).
- Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.
- Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster.

## 6) Source basis
- `SRC-WIKI-SOLIH` (Ibrahim Mohamed Solih)
- `SRC-WIKI-NASHEED` (Mohamed Nasheed)
- Primary inferred claim row: CLM-0049
- Inferred claim locator: SRC-WIKI-SOLIH page (en.wikipedia.org/wiki/Ibrahim_Mohamed_Solih), line 34 in 2026-02-08 extraction snapshot.

## 7) Integration notes
- `src/data/inference-notes.js` summary should be synced if relation wording changes after verification.
- Canonical promotion candidate: no (remains inferred until explicit pairwise wording is captured).
- Verification priority level: high (current grade B)

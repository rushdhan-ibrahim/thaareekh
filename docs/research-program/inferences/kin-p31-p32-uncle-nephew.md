# Inference Dossier

Edge key: `kin|P32|P31|uncle→nephew`  
Last updated: `2026-02-19`  
Inference class: `curated`

## 1) Edge identity
- Relation type: kin
- Source node: P32 Hussain (Loka Veeru)
- Target node: P31 Ibrahim (Dhammaru Veeru)
- Label: uncle→nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P32 Hussain (Loka Veeru) and P31 Ibrahim (Dhammaru Veeru) are modeled as `kin` with label `uncle→nephew` to preserve a targeted continuity claim without over-promoting certainty.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Immediate direct-claim anchors around these nodes:
- CLM-0129: kin P192 Yusuf Handeygirin <-> P32 Hussain (Loka Veeru) [uncle/nephew] (SRC-MRF-HILAALY, grade B)
- CLM-0148: kin P32 Hussain (Loka Veeru) <-> P33 Nasiruddine (Veeru Abarana) [succession transition context] (SRC-WIKI-MONARCHS, grade B)
- CLM-0151: kin P32 Hussain (Loka Veeru) <-> P53 Ali (Audha Veeru) [ancestor] (SRC-MRF-KINGS, grade B)
- CLM-0333: parent P30 Hassan (Bavana) -> P31 Ibrahim (Dhammaru Veeru) (SRC-MRF-KINGS, grade B)
- CLM-0428: sibling P30 Hassan (Bavana) <-> P32 Hussain (Loka Veeru) [twins] (SRC-MRF-KINGS, grade B)
- CLM-0586: parent P217 Dori Kuja -> P32 Hussain (Loka Veeru) (SRC-ROYALARK-MALDIVES, grade B)

## 3) Logic chain (pair-specific)
1. Shortest direct-claim support path (2 steps) linking this pair:
2. - sibling P32 Hussain (Loka Veeru) <-> P30 Hassan (Bavana) [twins] (CLM-0428, SRC-MRF-KINGS)
3. - parent P30 Hassan (Bavana) -> P31 Ibrahim (Dhammaru Veeru) (CLM-0333, SRC-MRF-KINGS)
4. This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.
5. Current modeling choice remains `inferred` because explicit source wording that names `kin` for P32 Hussain (Loka Veeru) and P31 Ibrahim (Dhammaru Veeru) is still absent.

## 4) Alternative interpretations
- Possible competing interpretation: broader political/dynastic proximity without blood-kin specificity.
- Competing interpretation trigger: explicit source that either gives a narrower relation or denies direct family continuity.
- Model-retention rationale: keep the edge as inferred until explicit pairwise wording is located.

## 5) Verification checklist
- Promotion requirement: an A/B source statement explicitly naming P32 Hussain (Loka Veeru) and P31 Ibrahim (Dhammaru Veeru) with relation class `kin` (uncle→nephew).
- Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.
- Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster.

## 6) Source basis
- `SRC-MRF-HILAALY` (Royal House of Hilaaly)
- Primary inferred claim row: CLM-0145
- Inferred claim locator: SRC-MRF-HILAALY relation annotation for P31-P32 pair

## 7) Integration notes
- `src/data/inference-notes.js` summary should be synced if relation wording changes after verification.
- Canonical promotion candidate: no (remains inferred until explicit pairwise wording is captured).
- Verification priority level: high (current grade C)

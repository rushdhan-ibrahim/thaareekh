# Inference Dossier

Edge key: `sibling|P19|P25|half-siblings`  
Last updated: `2026-02-19`  
Inference class: `curated`

## 1) Edge identity
- Relation type: sibling
- Source node: P19 Ahmed Shihabuddine (Loka Aadheeththa)
- Target node: P25 Raadhaafathi (Suvama Abarana)
- Label: half-siblings
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P19 Ahmed Shihabuddine (Loka Aadheeththa) and P25 Raadhaafathi (Suvama Abarana) are modeled as `sibling` with label `half-siblings` to preserve a targeted continuity claim without over-promoting certainty.
- Historical/dynastic context: Lunar -> Lunar
- Immediate direct-claim anchors around these nodes:
- CLM-0316: parent P18 Omar Veeru (Loka Abarana) -> P19 Ahmed Shihabuddine (Loka Aadheeththa) (SRC-IBN-BATTUTA-RIHLA, grade A)
- CLM-0318: parent P18 Omar Veeru (Loka Abarana) -> P25 Raadhaafathi (Suvama Abarana) (SRC-MRF-KINGS, grade B)
- CLM-0417: sibling P19 Ahmed Shihabuddine (Loka Aadheeththa) <-> P20 Khadijah (Raadha Abarana) [siblings] (SRC-MRF-KINGS, grade B)
- CLM-0427: sibling P20 Khadijah (Raadha Abarana) <-> P25 Raadhaafathi (Suvama Abarana) [half-sisters] (SRC-MRF-KINGS, grade B)
- CLM-0470: spouse P25 Raadhaafathi (Suvama Abarana) <-> P26 Mohamed of Maakurathu (Sundhura Abarana) [married] (SRC-MRF-KINGS, grade B)
- CLM-0595: parent P25 Raadhaafathi (Suvama Abarana) -> P27 Dhaain (Keerithi Maha Rehendi) (SRC-ROYALARK-MALDIVES, grade B)

## 3) Logic chain (pair-specific)
1. Shortest direct-claim support path (2 steps) linking this pair:
2. - parent P19 Ahmed Shihabuddine (Loka Aadheeththa) -> P18 Omar Veeru (Loka Abarana) (CLM-0316, SRC-IBN-BATTUTA-RIHLA)
3. - parent P18 Omar Veeru (Loka Abarana) -> P25 Raadhaafathi (Suvama Abarana) (CLM-0318, SRC-MRF-KINGS)
4. This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.
5. Current modeling choice remains `inferred` because explicit source wording that names `sibling` for P19 Ahmed Shihabuddine (Loka Aadheeththa) and P25 Raadhaafathi (Suvama Abarana) is still absent.

## 4) Alternative interpretations
- Possible competing interpretation: half-sibling or cousin if shared-parent evidence is partial rather than full.
- Competing interpretation trigger: direct wording that uses non-sibling kin terminology for this pair.
- Model-retention rationale: keep the edge as inferred until explicit pairwise wording is located.

## 5) Verification checklist
- Promotion requirement: an A/B source statement explicitly naming P19 Ahmed Shihabuddine (Loka Aadheeththa) and P25 Raadhaafathi (Suvama Abarana) with relation class `sibling` (half-siblings).
- Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.
- Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster.

## 6) Source basis
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0418
- Inferred claim locator: Inference synthesis from SRC-MRF-KINGS entries #19/#20/#25

## 7) Integration notes
- `src/data/inference-notes.js` summary should be synced if relation wording changes after verification.
- Canonical promotion candidate: no (remains inferred until explicit pairwise wording is captured).
- Verification priority level: high (current grade C)

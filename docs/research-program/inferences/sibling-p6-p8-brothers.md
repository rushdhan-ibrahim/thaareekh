# Inference Dossier

Edge key: `sibling|P6|P8|brothers`  
Last updated: `2026-02-19`  
Inference class: `curated`

## 1) Edge identity
- Relation type: sibling
- Source node: P6 Dhilhel (Dhagathaa Abarana)
- Target node: P8 Valla Dio (Raa-Araa Desyara)
- Label: brothers
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P6 Dhilhel (Dhagathaa Abarana) and P8 Valla Dio (Raa-Araa Desyara) are modeled as `sibling` with label `brothers` to preserve a targeted continuity claim without over-promoting certainty.
- Historical/dynastic context: Lunar -> Lunar
- Immediate direct-claim anchors around these nodes:
- CLM-0436: sibling P5 Dhinei (Fennaadheeththa) <-> P6 Dhilhel (Dhagathaa Abarana) [brothers] (SRC-MRF-KINGS, grade B)
- CLM-0442: sibling P6 Dhilhel (Dhagathaa Abarana) <-> P7 Wadi (Dhagathaa Suvara) [brothers] (SRC-MRF-KINGS, grade B)
- CLM-0446: sibling P7 Wadi (Dhagathaa Suvara) <-> P8 Valla Dio (Raa-Araa Desyara) [brothers] (SRC-MRF-KINGS, grade B)
- CLM-0582: parent P216 Fahi Hiriya Maava Kilage -> P6 Dhilhel (Dhagathaa Abarana) (SRC-ROYALARK-MALDIVES, grade B)
- CLM-0584: parent P216 Fahi Hiriya Maava Kilage -> P8 Valla Dio (Raa-Araa Desyara) (SRC-ROYALARK-MALDIVES, grade B)

## 3) Logic chain (pair-specific)
1. Shortest direct-claim support path (2 steps) linking this pair:
2. - sibling P6 Dhilhel (Dhagathaa Abarana) <-> P7 Wadi (Dhagathaa Suvara) [brothers] (CLM-0442, SRC-MRF-KINGS)
3. - sibling P7 Wadi (Dhagathaa Suvara) <-> P8 Valla Dio (Raa-Araa Desyara) [brothers] (CLM-0446, SRC-MRF-KINGS)
4. This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.
5. Current modeling choice remains `inferred` because explicit source wording that names `sibling` for P6 Dhilhel (Dhagathaa Abarana) and P8 Valla Dio (Raa-Araa Desyara) is still absent.

## 4) Alternative interpretations
- Possible competing interpretation: half-sibling or cousin if shared-parent evidence is partial rather than full.
- Competing interpretation trigger: direct wording that uses non-sibling kin terminology for this pair.
- Model-retention rationale: keep the edge as inferred until explicit pairwise wording is located.

## 5) Verification checklist
- Promotion requirement: an A/B source statement explicitly naming P6 Dhilhel (Dhagathaa Abarana) and P8 Valla Dio (Raa-Araa Desyara) with relation class `sibling` (brothers).
- Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.
- Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster.

## 6) Source basis
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0443
- Inferred claim locator: Inference synthesis from SRC-MRF-KINGS sibling chain entries #6-#8

## 7) Integration notes
- `src/data/inference-notes.js` summary should be synced if relation wording changes after verification.
- Canonical promotion candidate: no (remains inferred until explicit pairwise wording is captured).
- Verification priority level: high (current grade C)

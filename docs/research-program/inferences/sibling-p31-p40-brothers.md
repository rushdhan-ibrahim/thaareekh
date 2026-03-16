# Inference Dossier

Edge key: `sibling|P31|P40|brothers`  
Last updated: `2026-02-19`  
Inference class: `curated`

## 1) Edge identity
- Relation type: sibling
- Source node: P31 Ibrahim (Dhammaru Veeru)
- Target node: P40 Aboobakuru (Bavana Sooja)
- Label: brothers
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P31 Ibrahim (Dhammaru Veeru) and P40 Aboobakuru (Bavana Sooja) are modeled as `sibling` with label `brothers` to preserve a targeted continuity claim without over-promoting certainty.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Immediate direct-claim anchors around these nodes:
- CLM-0160: kin P40 Aboobakuru (Bavana Sooja) <-> P49 Sheikh Hassan (Raadha Fanaveeru) [grandfather] (SRC-MRF-KINGS, grade B)
- CLM-0161: kin P40 Aboobakuru (Bavana Sooja) <-> P57 Ali (Aanandha) [grandfather] (SRC-MRF-KINGS, grade B)
- CLM-0333: parent P30 Hassan (Bavana) -> P31 Ibrahim (Dhammaru Veeru) (SRC-MRF-KINGS, grade B)
- CLM-0335: parent P30 Hassan (Bavana) -> P40 Aboobakuru (Bavana Sooja) (SRC-MRF-KINGS, grade B)
- CLM-0337: parent P40 Aboobakuru (Bavana Sooja) -> P193 Princess Recca (SRC-MRF-KINGS, grade B)
- CLM-0432: sibling P39 Yoosuf (Loka Aananadha) <-> P40 Aboobakuru (Bavana Sooja) [half-brothers] (SRC-MRF-KINGS, grade B)

## 3) Logic chain (pair-specific)
1. Shortest direct-claim support path (2 steps) linking this pair:
2. - parent P31 Ibrahim (Dhammaru Veeru) -> P30 Hassan (Bavana) (CLM-0333, SRC-MRF-KINGS)
3. - parent P30 Hassan (Bavana) -> P40 Aboobakuru (Bavana Sooja) (CLM-0335, SRC-MRF-KINGS)
4. This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.
5. Current modeling choice remains `inferred` because explicit source wording that names `sibling` for P31 Ibrahim (Dhammaru Veeru) and P40 Aboobakuru (Bavana Sooja) is still absent.

## 4) Alternative interpretations
- Possible competing interpretation: half-sibling or cousin if shared-parent evidence is partial rather than full.
- Competing interpretation trigger: direct wording that uses non-sibling kin terminology for this pair.
- Model-retention rationale: keep the edge as inferred until explicit pairwise wording is located.

## 5) Verification checklist
- Promotion requirement: an A/B source statement explicitly naming P31 Ibrahim (Dhammaru Veeru) and P40 Aboobakuru (Bavana Sooja) with relation class `sibling` (brothers).
- Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.
- Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster.

## 6) Source basis
- `SRC-MRF-HILAALY` (Royal House of Hilaaly)
- `SRC-WIKI-MONARCHS` (List of Maldivian monarchs)
- Primary inferred claim row: CLM-0430
- Inferred claim locator: Inference synthesis from SRC-MRF-HILAALY with corroborative sequence context

## 7) Integration notes
- `src/data/inference-notes.js` summary should be synced if relation wording changes after verification.
- Canonical promotion candidate: no (remains inferred until explicit pairwise wording is captured).
- Verification priority level: high (current grade C)

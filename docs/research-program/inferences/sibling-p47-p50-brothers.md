# Inference Dossier

Edge key: `sibling|P47|P50|brothers`  
Last updated: `2026-02-10`  
Inference class: `curated`

## 1) Edge identity
- Relation type: sibling
- Source node: P47 Hassan (Raadha Aanandha)
- Target node: P50 Ibrahim (Bavana Furasuddha)
- Label: brothers
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P47 Hassan (Raadha Aanandha) and P50 Ibrahim (Bavana Furasuddha) are modeled as `sibling` with label `brothers` to preserve a targeted continuity claim without over-promoting certainty.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Immediate direct-claim anchors around these nodes:
- CLM-0341: parent P46 Omar (Loka Sundhura) -> P47 Hassan (Raadha Aanandha) (SRC-MRF-KINGS, grade B)
- CLM-0601: parent P47 Hassan (Raadha Aanandha) -> P50 Ibrahim (Bavana Furasuddha) (SRC-ROYALARK-MALDIVES, grade B)
- CLM-0639: sibling P51 Kalu Mohamed (Dhammaru Bavana) <-> P47 Hassan (Raadha Aanandha) [half-brothers] (SRC-ROYALARK-MALDIVES, grade B)

## 3) Logic chain (pair-specific)
1. Shortest direct-claim support path (1 step) linking this pair:
2. - parent P47 Hassan (Raadha Aanandha) -> P50 Ibrahim (Bavana Furasuddha) (CLM-0601, SRC-ROYALARK-MALDIVES)
3. This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.
4. Current modeling choice remains `inferred` because explicit source wording that names `sibling` for P47 Hassan (Raadha Aanandha) and P50 Ibrahim (Bavana Furasuddha) is still absent.

## 4) Alternative interpretations
- Possible competing interpretation: half-sibling or cousin if shared-parent evidence is partial rather than full.
- Competing interpretation trigger: direct wording that uses non-sibling kin terminology for this pair.
- Model-retention rationale: keep the edge as inferred until explicit pairwise wording is located.

## 5) Verification checklist
- Promotion requirement: an A/B source statement explicitly naming P47 Hassan (Raadha Aanandha) and P50 Ibrahim (Bavana Furasuddha) with relation class `sibling` (brothers).
- Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.
- Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster.

## 6) Source basis
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0433
- Inferred claim locator: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P47 Hassan and P50 Ibrahim (sibling (brothers)) in 2026-02-08 snapshot.

## 7) Integration notes
- `src/data/inference-notes.js` summary should be synced if relation wording changes after verification.
- Canonical promotion candidate: no (remains inferred until explicit pairwise wording is captured).
- Verification priority level: high (current grade C)

# Inference Dossier

Edge key: `sibling|P47|P51|brothers`  
Last updated: `2026-02-19`  
Inference class: `curated`

## 1) Edge identity
- Relation type: sibling
- Source node: P47 Hassan (Raadha Aanandha)
- Target node: P51 Kalu Mohamed (Dhammaru Bavana)
- Label: brothers
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P47 Hassan (Raadha Aanandha) and P51 Kalu Mohamed (Dhammaru Bavana) are modeled as `sibling` with label `brothers` to preserve a targeted continuity claim without over-promoting certainty.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Immediate direct-claim anchors around these nodes:
- CLM-0174: kin P51 Kalu Mohamed (Dhammaru Bavana) <-> P60 Mohamed (Singa Bavana) [grandfather] (SRC-MRF-KINGS, grade B)
- CLM-0175: kin P51 Kalu Mohamed (Dhammaru Bavana) <-> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) [grandfather] (SRC-MRF-KINGS, grade B)
- CLM-0176: kin P51 Kalu Mohamed (Dhammaru Bavana) <-> P63 Ali (Audha Siyaaaka Katthiri) [father-in-law] (SRC-MRF-KINGS, grade B)
- CLM-0341: parent P46 Omar (Loka Sundhura) -> P47 Hassan (Raadha Aanandha) (SRC-MRF-KINGS, grade B)
- CLM-0343: parent P46 Omar (Loka Sundhura) -> P51 Kalu Mohamed (Dhammaru Bavana) (SRC-MRF-KINGS, grade B)
- CLM-0345: parent P51 Kalu Mohamed (Dhammaru Bavana) -> P59 Hassan of Shiraz (Ram Mani Loka) (SRC-MRF-KINGS, grade B)

## 3) Logic chain (pair-specific)
1. Shortest direct-claim support path (1 step) linking this pair:
2. - sibling P47 Hassan (Raadha Aanandha) <-> P51 Kalu Mohamed (Dhammaru Bavana) [half-brothers] (CLM-0639, SRC-ROYALARK-MALDIVES)
3. This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.
4. Current modeling choice remains `inferred` because explicit source wording that names `sibling` for P47 Hassan (Raadha Aanandha) and P51 Kalu Mohamed (Dhammaru Bavana) is still absent.

## 4) Alternative interpretations
- Possible competing interpretation: half-sibling or cousin if shared-parent evidence is partial rather than full.
- Competing interpretation trigger: direct wording that uses non-sibling kin terminology for this pair.
- Model-retention rationale: keep the edge as inferred until explicit pairwise wording is located.

## 5) Verification checklist
- Promotion requirement: an A/B source statement explicitly naming P47 Hassan (Raadha Aanandha) and P51 Kalu Mohamed (Dhammaru Bavana) with relation class `sibling` (brothers).
- Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.
- Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster.

## 6) Source basis
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0434
- Inferred claim locator: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P47 Hassan and P51 Kalu Mohamed (sibling (brothers)) in 2026-02-08 snapshot.

## 7) Integration notes
- `src/data/inference-notes.js` summary should be synced if relation wording changes after verification.
- Canonical promotion candidate: no (remains inferred until explicit pairwise wording is captured).
- Verification priority level: high (current grade C)

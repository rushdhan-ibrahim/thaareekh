# Inference Dossier

Edge key: `parent|P80|P84|`  
Last updated: `2026-02-19`  
Inference class: `curated`

## 1) Edge identity
- Relation type: parent
- Source node: P80 Hassan Izzuddine (Kula Ran Meeba Audha)
- Target node: P84 Hassan Nooredine (Keerithi Maha Radun)
- Label: (no label)
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P80 Hassan Izzuddine (Kula Ran Meeba Audha) and P84 Hassan Nooredine (Keerithi Maha Radun) are modeled as `parent` to preserve a targeted continuity claim without over-promoting certainty.
- Historical/dynastic context: Huraagey -> Huraagey
- Immediate direct-claim anchors around these nodes:
- CLM-0185: kin P66 Joao’ (Keerithi Maha Radun) <-> P80 Hassan Izzuddine (Kula Ran Meeba Audha) [ancestor (5 gen via Dom Luis)] (SRC-MRF-KINGS, grade A)
- CLM-0223: parent P100 Mohamed Faamuladeyri Thakurufan -> P80 Hassan Izzuddine (Kula Ran Meeba Audha) (SRC-MRF-KINGS, grade A)
- CLM-0095: kin P154 Hussain Bodu Dorhimeyna Kilege <-> P80 Hassan Izzuddine (Kula Ran Meeba Audha) [uncle/nephew] (SRC-MRF-KINGS, grade B)
- CLM-0197: kin P80 Hassan Izzuddine (Kula Ran Meeba Audha) <-> P82 Mohamed Shamsuddine (Keerithi Maha Radun) [cousins] (SRC-MRF-KINGS, grade B)
- CLM-0357: parent P80 Hassan Izzuddine (Kula Ran Meeba Audha) -> P83 Mohamed Muizzuddine (Keerithi Maha Radun) (SRC-WIKI-MONARCHS, grade B)
- CLM-0360: parent P84 Hassan Nooredine (Keerithi Maha Radun) -> P85 Mohamed Mueenuddine (Keerithi Maha Radun) (SRC-MRF-KINGS, grade B)

## 3) Logic chain (pair-specific)
1. Shortest direct-claim support path (2 steps) linking this pair:
2. - parent P80 Hassan Izzuddine (Kula Ran Meeba Audha) -> P83 Mohamed Muizzuddine (Keerithi Maha Radun) (CLM-0357, SRC-WIKI-MONARCHS)
3. - sibling P83 Mohamed Muizzuddine (Keerithi Maha Radun) <-> P84 Hassan Nooredine (Keerithi Maha Radun) [brothers] (CLM-0448, SRC-WIKI-MONARCHS)
4. This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.
5. Current modeling choice remains `inferred` because explicit source wording that names `parent` for P80 Hassan Izzuddine (Kula Ran Meeba Audha) and P84 Hassan Nooredine (Keerithi Maha Radun) is still absent.

## 4) Alternative interpretations
- Possible competing interpretation: grandparent or older collateral guardian-line relation instead of direct parent.
- Competing interpretation trigger: explicit source naming a different immediate parent for the target node.
- Model-retention rationale: keep the edge as inferred until explicit pairwise wording is located.

## 5) Verification checklist
- Promotion requirement: an A/B source statement explicitly naming P80 Hassan Izzuddine (Kula Ran Meeba Audha) and P84 Hassan Nooredine (Keerithi Maha Radun) with relation class `parent`.
- Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.
- Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster.

## 6) Source basis
- `SRC-WIKI-MONARCHS` (List of Maldivian monarchs)
- Primary inferred claim row: CLM-0358
- Inferred claim locator: SRC-WIKI-MONARCHS page (https://en.wikipedia.org/wiki/List_of_Maldivian_monarchs), monarch-list table/notes entries for P80 Hassan Izzuddine and P84 Hassan Nooredine (parent) in 2026-02-08 snapshot.

## 7) Integration notes
- `src/data/inference-notes.js` summary should be synced if relation wording changes after verification.
- Canonical promotion candidate: no (remains inferred until explicit pairwise wording is captured).
- Verification priority level: high (current grade C)

# Inference Dossier

Edge key: `kin|P66|P97|grandparent`  
Last updated: `2026-02-08`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P66 Joao’ (Keerithi Maha Radun)
- Target node: P97 Dom Luis de Sousa
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P66 Joao’ (Keerithi Maha Radun) and P97 Dom Luis de Sousa are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P66 Joao’ (Keerithi Maha Radun) -> P96 Donna Ines (CLM-0349, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P66 Joao’ as parent of P96 Donna Ines.
3. Supporting edge: parent P96 Donna Ines -> P97 Dom Luis de Sousa (CLM-0368, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P96 Donna Ines as parent of P97 Dom Luis de Sousa.
4. Rule application (parent-of-parent-grandparent): with source -> P96 Donna Ines and P96 Donna Ines -> target parent links, P66 Joao’ (Keerithi Maha Radun) is modeled as inferred grandparent-line kin of P97 Dom Luis de Sousa.
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P66 Joao’ (Keerithi Maha Radun) and P97 Dom Luis de Sousa as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0186
- Inferred claim locator: Inference basis: parent-of-parent-grandparent (see docs/research-program/inferences/kin-p66-p97-grandparent.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

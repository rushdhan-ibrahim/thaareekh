# Inference Dossier

Edge key: `kin|P96|P98|grandparent`  
Last updated: `2026-02-08`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P96 Donna Ines
- Target node: P98 Dom Maraduru Fandiaiy Thakurufan
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P96 Donna Ines and P98 Dom Maraduru Fandiaiy Thakurufan are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P96 Donna Ines -> P97 Dom Luis de Sousa (CLM-0368, SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P96 Donna Ines as parent of P97 Dom Luis de Sousa.
3. Supporting edge: parent P97 Dom Luis de Sousa -> P98 Dom Maraduru Fandiaiy Thakurufan (CLM-0369, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P97 Dom Luis de Sousa as parent of P98 Dom Maraduru Fandiaiy Thakurufan.
4. Rule application (parent-of-parent-grandparent): with source -> P97 Dom Luis de Sousa and P97 Dom Luis de Sousa -> target parent links, P96 Donna Ines is modeled as inferred grandparent-line kin of P98 Dom Maraduru Fandiaiy Thakurufan.
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P96 Donna Ines and P98 Dom Maraduru Fandiaiy Thakurufan as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0221
- Inferred claim locator: Inference basis: parent-of-parent-grandparent (see docs/research-program/inferences/kin-p96-p98-grandparent.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

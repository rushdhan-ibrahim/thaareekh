# Inference Dossier

Edge key: `kin|P105|P106|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-10`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P105 Hassan Thakurufan
- Target node: P106 Ibrahim Kalaafaan
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P105 Hassan Thakurufan and P106 Ibrahim Kalaafaan are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Utheemu -> Utheemu
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle resolved as follows.
2. Supporting edge: parent P104 Mohamed Thakurufaanu al-Auzam -> P106 Ibrahim Kalaafaan (CLM-0228, SRC-MRF-UTHEEM, grade B); excerpt: Utheem Dynasty family/genealogy content lists P104 Mohamed Thakurufaanu al-Auzam as parent of P106 Ibrahim Kalaafaan.
3. Supporting edge: sibling P104 Mohamed Thakurufaanu al-Auzam <-> P105 Hassan Thakurufan [brothers] (CLM-0372, SRC-MRF-UTHEEM, grade B); excerpt: Utheem Dynasty family/genealogy content links P104 Mohamed Thakurufaanu al-Auzam and P105 Hassan Thakurufan as siblings (brothers).
4. Rule application (parent-sibling-aunt-uncle): sibling(P104 Mohamed Thakurufaanu al-Auzam, P105 Hassan Thakurufan) plus parent(P104 Mohamed Thakurufaanu al-Auzam, child) yields inferred aunt/uncle-line kin between P105 Hassan Thakurufan and P106 Ibrahim Kalaafaan.
5. Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.
- Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P105 Hassan Thakurufan and P106 Ibrahim Kalaafaan as kin (aunt/uncle↔niece/nephew).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-UTHEEM` (Utheem Dynasty)
- Primary inferred claim row: CLM-0011
- Inferred claim locator: Inference basis: parent-sibling-aunt-uncle (see docs/research-program/inferences/kin-p105-p106-aunt-uncle-niece-nephew.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

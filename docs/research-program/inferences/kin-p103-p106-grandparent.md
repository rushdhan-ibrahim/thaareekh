# Inference Dossier

Edge key: `kin|P103|P106|grandparent`  
Last updated: `2026-02-08`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P103 Hussain Thakurufan
- Target node: P106 Ibrahim Kalaafaan
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P103 Hussain Thakurufan and P106 Ibrahim Kalaafaan are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Utheemu -> Utheemu
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P103 Hussain Thakurufan -> P104 Mohamed Thakurufaanu al-Auzam (CLM-0227, SRC-MRF-UTHEEM, grade A); excerpt: Utheem Dynasty family/genealogy content lists P103 Hussain Thakurufan as parent of P104 Mohamed Thakurufaanu al-Auzam.
3. Supporting edge: parent P104 Mohamed Thakurufaanu al-Auzam -> P106 Ibrahim Kalaafaan (CLM-0228, SRC-MRF-UTHEEM, grade B); excerpt: Utheem Dynasty family/genealogy content lists P104 Mohamed Thakurufaanu al-Auzam as parent of P106 Ibrahim Kalaafaan.
4. Rule application (parent-of-parent-grandparent): with source -> P104 Mohamed Thakurufaanu al-Auzam and P104 Mohamed Thakurufaanu al-Auzam -> target parent links, P103 Hussain Thakurufan is modeled as inferred grandparent-line kin of P106 Ibrahim Kalaafaan.
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P103 Hussain Thakurufan and P106 Ibrahim Kalaafaan as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-UTHEEM` (Utheem Dynasty)
- Primary inferred claim row: CLM-0007
- Inferred claim locator: Inference basis: parent-of-parent-grandparent (see docs/research-program/inferences/kin-p103-p106-grandparent.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

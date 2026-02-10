# Inference Dossier

Edge key: `kin|P102|P104|grandparent`  
Last updated: `2026-02-10`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P102 Kalhu Ali Thakurufan of Utheemu
- Target node: P104 Mohamed Thakurufaanu al-Auzam
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P102 Kalhu Ali Thakurufan of Utheemu and P104 Mohamed Thakurufaanu al-Auzam are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Utheemu -> Utheemu
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P102 Kalhu Ali Thakurufan of Utheemu -> P103 Hussain Thakurufan (CLM-0226, SRC-MRF-HILAALY, grade B); excerpt: Royal House of Hilaaly family/genealogy content lists P102 Kalhu Ali Thakurufan of Utheemu as parent of P103 Hussain Thakurufan.
3. Supporting edge: parent P103 Hussain Thakurufan -> P104 Mohamed Thakurufaanu al-Auzam (CLM-0227, SRC-MRF-UTHEEM, grade A); excerpt: Utheem Dynasty family/genealogy content lists P103 Hussain Thakurufan as parent of P104 Mohamed Thakurufaanu al-Auzam.
4. Rule application (parent-of-parent-grandparent): with source -> P103 Hussain Thakurufan and P103 Hussain Thakurufan -> target parent links, P102 Kalhu Ali Thakurufan of Utheemu is modeled as inferred grandparent-line kin of P104 Mohamed Thakurufaanu al-Auzam.
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P102 Kalhu Ali Thakurufan of Utheemu and P104 Mohamed Thakurufaanu al-Auzam as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-HILAALY` (Royal House of Hilaaly)
- `SRC-MRF-UTHEEM` (Utheem Dynasty)
- Primary inferred claim row: CLM-0006
- Inferred claim locator: Inference basis: parent-of-parent-grandparent (see docs/research-program/inferences/kin-p102-p104-grandparent.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

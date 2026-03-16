# Inference Dossier

Edge key: `kin|P86|P91|grandparent`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka)
- Target node: P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri)
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) and P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Huraagey -> Huraagey
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) -> P87 Ibrahim Nooredine (Keerithi Maha Radun) (CLM-0363, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P86 Mohamed Imaduddine as parent of P87 Ibrahim Nooredine.
3. Supporting edge: parent P87 Ibrahim Nooredine (Keerithi Maha Radun) -> P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) (CLM-0366, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P87 Ibrahim Nooredine as parent of P91 Mohamed Shamsuddine III.
4. Rule application (parent-of-parent-grandparent): with source -> P87 Ibrahim Nooredine (Keerithi Maha Radun) and P87 Ibrahim Nooredine (Keerithi Maha Radun) -> target parent links, P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) is modeled as inferred grandparent-line kin of P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri).
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) and P91 Mohamed Shamsuddine III (Kula Sundhura Katthiri) as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0207
- Inferred claim locator: Inference basis: parent-of-parent-grandparent (see docs/research-program/inferences/kin-p86-p91-grandparent.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

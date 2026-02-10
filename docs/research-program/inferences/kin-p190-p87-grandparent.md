# Inference Dossier

Edge key: `kin|P87|P190|grandparent`  
Last updated: `2026-02-10`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P87 Ibrahim Nooredine (Keerithi Maha Radun)
- Target node: P190 Hassan Fareed Didi
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P87 Ibrahim Nooredine (Keerithi Maha Radun) and P190 Hassan Fareed Didi are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Huraagey -> Huraagey
- Rule basis status: resolved (1 supporting edge).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P129 Princess Veyogey Dhon Goma -> P190 Hassan Fareed Didi (CLM-0260, SRC-WIKI-HASSAN-FARID, grade B); excerpt: Hassan Farid Didi family/genealogy content lists P129 Princess Veyogey Dhon Goma as parent of P190 Hassan Fareed Didi.
3. Rule application (parent-of-parent-grandparent): with source -> P129 Princess Veyogey Dhon Goma and P129 Princess Veyogey Dhon Goma -> target parent links, P87 Ibrahim Nooredine (Keerithi Maha Radun) is modeled as inferred grandparent-line kin of P190 Hassan Fareed Didi.
4. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P87 Ibrahim Nooredine (Keerithi Maha Radun) and P190 Hassan Fareed Didi as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-WIKI-HASSAN-FARID` (Hassan Farid Didi)
- Primary inferred claim row: CLM-0122
- Inferred claim locator: Inference basis: parent-of-parent-grandparent (see docs/research-program/inferences/kin-p190-p87-grandparent.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

# Inference Dossier

Edge key: `kin|P175|P177|grandparent`  
Last updated: `2026-02-10`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P175 Husna Adam Ismail Manik
- Target node: P177 Yasmin Muizzu
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P175 Husna Adam Ismail Manik and P177 Yasmin Muizzu are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Modern -> Modern
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P175 Husna Adam Ismail Manik -> P172 Mohamed Muizzu (CLM-0315, SRC-WIKI-MUIZZU, grade B); excerpt: Wikipedia lead text states Mohamed Muizzu was born to Husna Adam Ismail and Hussain Abdul Rahman. (pair: P175 Husna Adam Ismail Manik -> P172 Moham...
3. Supporting edge: parent P172 Mohamed Muizzu -> P177 Yasmin Muizzu (CLM-0308, SRC-WIKI-MUIZZU, grade B); excerpt: Wikipedia raw infobox issue field lists Yasmin Muizzu as child of Mohamed Muizzu. (pair: P172 Mohamed Muizzu -> P177 Yasmin Muizzu).
4. Rule application (parent-of-parent-grandparent): with source -> P172 Mohamed Muizzu and P172 Mohamed Muizzu -> target parent links, P175 Husna Adam Ismail Manik is modeled as inferred grandparent-line kin of P177 Yasmin Muizzu.
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P175 Husna Adam Ismail Manik and P177 Yasmin Muizzu as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-WIKI-MUIZZU` (Mohamed Muizzu)
- Primary inferred claim row: CLM-0110
- Inferred claim locator: Inference basis: parent-of-parent-grandparent (see docs/research-program/inferences/kin-p175-p177-grandparent.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

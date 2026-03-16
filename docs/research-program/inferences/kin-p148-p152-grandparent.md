# Inference Dossier

Edge key: `kin|P148|P152|grandparent`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P148 Khadheeja Moosa
- Target node: P152 Faris Maumoon
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P148 Khadheeja Moosa and P152 Faris Maumoon are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Modern -> Modern
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P148 Khadheeja Moosa -> P119 Maumoon Abdul Gayoom (CLM-0280, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox mother field names Khadheeja Ibrahim Didi as mother of Maumoon Abdul Gayoom. (pair: P148 Khadheeja Moosa -> P119 Maumoon Abdu...
3. Supporting edge: parent P119 Maumoon Abdul Gayoom -> P152 Faris Maumoon (CLM-0250, SRC-WIKI-MAUMOON, grade B); excerpt: Wikipedia raw infobox issue field lists Faris Maumoon as child of Maumoon Abdul Gayoom. (pair: P119 Maumoon Abdul Gayoom -> P152 Faris Maumoon).
4. Rule application (parent-of-parent-grandparent): with source -> P119 Maumoon Abdul Gayoom and P119 Maumoon Abdul Gayoom -> target parent links, P148 Khadheeja Moosa is modeled as inferred grandparent-line kin of P152 Faris Maumoon.
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P148 Khadheeja Moosa and P152 Faris Maumoon as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-WIKI-MAUMOON` (Maumoon Abdul Gayoom)
- Primary inferred claim row: CLM-0084
- Inferred claim locator: Inference basis: parent-of-parent-grandparent (see docs/research-program/inferences/kin-p148-p152-grandparent.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

# Inference Dossier

Edge key: `kin|P59|P61|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-10`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P59 Hassan of Shiraz (Ram Mani Loka)
- Target node: P61 Hassan IX / Dom Manoel (Dhirikusa Loka)
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P59 Hassan of Shiraz (Ram Mani Loka) and P61 Hassan IX / Dom Manoel (Dhirikusa Loka) are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (1 supporting edge).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle resolved as follows.
2. Supporting edge: parent P220 Ahmad Manikufa'anu Kalaminja -> P61 Hassan IX / Dom Manoel (Dhirikusa Loka) (CLM-0588, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Ahmad Manikufa'anu Kalaminja as parent of Hassan IX / Dom Manoel.
3. Rule application (parent-sibling-aunt-uncle): sibling(P220 Ahmad Manikufa'anu Kalaminja, P59 Hassan of Shiraz (Ram Mani Loka)) plus parent(P220 Ahmad Manikufa'anu Kalaminja, child) yields inferred aunt/uncle-line kin between P59 Hassan of Shiraz (Ram Mani Loka) and P61 Hassan IX / Dom Manoel (Dhirikusa Loka).
4. Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.
- Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P59 Hassan of Shiraz (Ram Mani Loka) and P61 Hassan IX / Dom Manoel (Dhirikusa Loka) as kin (aunt/uncle↔niece/nephew).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-ROYALARK-MALDIVES` (RoyalArk Maldives — Complete Genealogical Database (segments 3-16))
- Primary inferred claim row: CLM-0570
- Inferred claim locator: Inference basis documented in docs/research-program/inferences/kin-p59-p61-aunt-uncle-niece-nephew.md.

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

# Inference Dossier

Edge key: `kin|P49|P57|cousins`  
Last updated: `2026-02-19`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P49 Sheikh Hassan (Raadha Fanaveeru)
- Target node: P57 Ali (Aanandha)
- Label: cousins
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P49 Sheikh Hassan (Raadha Fanaveeru) and P57 Ali (Aanandha) are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.
- Historical/dynastic context: Hilaaly -> Hilaaly
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule children-of-siblings-cousin resolved as follows.
2. Supporting edge: parent P202 Kamba Dio -> P49 Sheikh Hassan (Raadha Fanaveeru) (CLM-0572, SRC-MRF-HILAALY, grade B); excerpt: Direct parent relation recorded between Kamba Dio as parent of Sheikh Hassan.
3. Supporting edge: parent P193 Princess Recca -> P57 Ali (Aanandha) (CLM-0329, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P193 Princess Recca as parent of P57 Ali.
4. Rule application (children-of-siblings-cousin): children of sibling parents P202 Kamba Dio and P193 Princess Recca are modeled as inferred cousin-line kin (P49 Sheikh Hassan (Raadha Fanaveeru) <-> P57 Ali (Aanandha)).
5. Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: more distant collateral kin if parent-sibling linkage weakens.
- Contradiction trigger: changes to either child-parent edge or the parent-sibling edge.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P49 Sheikh Hassan (Raadha Fanaveeru) and P57 Ali (Aanandha) as kin (cousins).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-HILAALY` (Royal House of Hilaaly)
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0566
- Inferred claim locator: Inference basis documented in docs/research-program/inferences/kin-p49-p57-cousins.md.

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

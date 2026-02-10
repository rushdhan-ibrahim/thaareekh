# Inference Dossier

Edge key: `kin|P139|P183|cousins`  
Last updated: `2026-02-10`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P139 Hussain Didi
- Target node: P183 Ganduvaru Hassan Didi
- Label: cousins
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P139 Hussain Didi and P183 Ganduvaru Hassan Didi are modeled as inferred kin (cousins) through rule `children-of-siblings-cousin`.
- Historical/dynastic context: Modern -> Addu Line
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule children-of-siblings-cousin resolved as follows.
2. Supporting edge: parent P140 Al-Nabeel Karayye Hassan Didi -> P139 Hussain Didi (CLM-0275, SRC-WIKI-IBRAHIM-NASIR, grade B); excerpt: Ibrahim Nasir family/genealogy content lists P140 Al-Nabeel Karayye Hassan Didi as parent of P139 Hussain Didi.
3. Supporting edge: parent P180 Princess Aishath Didi -> P183 Ganduvaru Hassan Didi (CLM-0319, SRC-MRF-MIDU-ROYAL, grade B); excerpt: Midu Royal Family Branch (Addu/Meedhoo records) family/genealogy content lists P180 Princess Aishath Didi as parent of P183 Ganduvaru Hassan Didi.
4. Rule application (children-of-siblings-cousin): children of sibling parents P140 Al-Nabeel Karayye Hassan Didi and P180 Princess Aishath Didi are modeled as inferred cousin-line kin (P139 Hussain Didi <-> P183 Ganduvaru Hassan Didi).
5. Current modeling remains inferred because direct source text naming kin (cousins) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: more distant collateral kin if parent-sibling linkage weakens.
- Contradiction trigger: changes to either child-parent edge or the parent-sibling edge.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P139 Hussain Didi and P183 Ganduvaru Hassan Didi as kin (cousins).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule children-of-siblings-cousin.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-WIKI-IBRAHIM-NASIR` (Ibrahim Nasir)
- `SRC-MRF-MIDU-ROYAL` (Midu Royal Family Branch (Addu/Meedhoo records))
- Primary inferred claim row: CLM-0076
- Inferred claim locator: Inference basis: children-of-siblings-cousin (see docs/research-program/inferences/kin-p139-p183-cousins.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

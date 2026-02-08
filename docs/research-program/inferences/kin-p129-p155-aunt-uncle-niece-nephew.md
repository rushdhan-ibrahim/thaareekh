# Inference Dossier

Edge key: `kin|P129|P155|aunt/uncle↔niece/nephew`  
Last updated: `2026-02-08`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P129 Princess Veyogey Dhon Goma
- Target node: P155 Maandhoogey Bodu Dhorhy Manippulu
- Label: aunt/uncle↔niece/nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P129 Princess Veyogey Dhon Goma and P155 Maandhoogey Bodu Dhorhy Manippulu are modeled as inferred kin (aunt/uncle↔niece/nephew) through rule `parent-sibling-aunt-uncle`.
- Historical/dynastic context: Huraagey -> Huraagey
- Rule basis status: resolved (2 supporting edges; includes one inferred sibling support edge).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-sibling-aunt-uncle resolved as follows.
2. Supporting edge: parent P87 Ibrahim Nooredine (Keerithi Maha Radun) -> P129 Princess Veyogey Dhon Goma (CLM-0364, SRC-MRF-PHOTO-6|SRC-MRF-KAKAAGE-ALBUM|SRC-MRF-KINGS, grade B); excerpt: MRF photo/family-album wording describes Don Goma as daughter of King Ibrahim Nooreddine.
3. Supporting edge: sibling P155 Maandhoogey Bodu Dhorhy Manippulu <-> P87 Ibrahim Nooredine (Keerithi Maha Radun) [siblings (shared parent)] (CLM-0406, SRC-DERIVED-RULES, grade C); excerpt: inferred sibling relation between P155 Maandhoogey Bodu Dhorhy Manippulu and P87 Ibrahim Nooredine from shared-parent rule chain.
4. Rule application (parent-sibling-aunt-uncle): sibling(P155 Maandhoogey Bodu Dhorhy Manippulu, P87 Ibrahim Nooredine) plus parent(P87 Ibrahim Nooredine, P129 Princess Veyogey Dhon Goma) yields inferred aunt/uncle-line kin between P129 Princess Veyogey Dhon Goma and P155 Maandhoogey Bodu Dhorhy Manippulu.
5. Current modeling remains inferred because direct source text naming kin (aunt/uncle↔niece/nephew) for this exact pair is not yet captured, and one support edge is itself inferred.

## 4) Alternative interpretations
- Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.
- Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P129 Princess Veyogey Dhon Goma and P155 Maandhoogey Bodu Dhorhy Manippulu as kin (aunt/uncle↔niece/nephew).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-sibling-aunt-uncle.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-KINGS` (Maldives Kings List)
- `SRC-MRF-PHOTO-6` (Historic Royal Photo Notes)
- `SRC-MRF-KAKAAGE-ALBUM` (Kakaage Family Album Notes)
- Primary inferred claim row: CLM-0054
- Inferred claim locator: Inference basis: parent-sibling-aunt-uncle (see docs/research-program/inferences/kin-p129-p155-aunt-uncle-niece-nephew.md).

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

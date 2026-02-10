# Inference Dossier

Edge key: `kin|P85|P222|grandparent`  
Last updated: `2026-02-10`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P85 Mohamed Mueenuddine (Keerithi Maha Radun)
- Target node: P222 Hassan Izz ud-din
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P85 Mohamed Mueenuddine (Keerithi Maha Radun) and P222 Hassan Izz ud-din are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Huraagey -> Huraagey
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P85 Mohamed Mueenuddine (Keerithi Maha Radun) -> P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) (CLM-0361, SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P85 Mohamed Mueenuddine as parent of P86 Mohamed Imaduddine.
3. Supporting edge: parent P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) -> P222 Hassan Izz ud-din (CLM-0610, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Mohamed Imaduddine as parent of Hassan Izz ud-din.
4. Rule application (parent-of-parent-grandparent): with source -> P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) and P86 Mohamed Imaduddine (Kula Sudha Ira Siyaaaka) -> target parent links, P85 Mohamed Mueenuddine (Keerithi Maha Radun) is modeled as inferred grandparent-line kin of P222 Hassan Izz ud-din.
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P85 Mohamed Mueenuddine (Keerithi Maha Radun) and P222 Hassan Izz ud-din as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-MRF-KINGS` (Maldives Kings List)
- `SRC-ROYALARK-MALDIVES` (RoyalArk Maldives — Complete Genealogical Database (segments 3-16))
- Primary inferred claim row: CLM-0554
- Inferred claim locator: Inference basis documented in docs/research-program/inferences/kin-p222-p85-grandparent.md.

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

# Inference Dossier

Edge key: `kin|P16|P25|grandparent`  
Last updated: `2026-02-10`  
Inference class: `rule-derived`

## 1) Edge identity
- Relation type: kin
- Source node: P16 Salis (Meesuvvara)
- Target node: P25 Raadhaafathi (Suvama Abarana)
- Label: grandparent
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: P16 Salis (Meesuvvara) and P25 Raadhaafathi (Suvama Abarana) are modeled as inferred kin (grandparent) through rule `parent-of-parent-grandparent`.
- Historical/dynastic context: Lunar -> Lunar
- Rule basis status: resolved (2 supporting edges).

## 3) Logic chain (pair-specific)
1. Support set for rule parent-of-parent-grandparent resolved as follows.
2. Supporting edge: parent P16 Salis (Meesuvvara) -> P18 Omar Veeru (Loka Abarana) (CLM-0571, SRC-ROYALARK-MALDIVES, grade B); excerpt: Direct parent relation recorded between Salis as parent of Omar Veeru.
3. Supporting edge: parent P18 Omar Veeru (Loka Abarana) -> P25 Raadhaafathi (Suvama Abarana) (CLM-0318, SRC-MRF-KINGS, grade B); excerpt: Kings list gives P25 as child of P18 in the same household branch.
4. Rule application (parent-of-parent-grandparent): with source -> P18 Omar Veeru (Loka Abarana) and P18 Omar Veeru (Loka Abarana) -> target parent links, P16 Salis (Meesuvvara) is modeled as inferred grandparent-line kin of P25 Raadhaafathi (Suvama Abarana).
5. Current modeling remains inferred because direct source text naming kin (grandparent) for this exact pair is not yet captured.

## 4) Alternative interpretations
- Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.
- Contradiction trigger: updated parent edges that break the two-step parent chain.
- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.

## 5) Verification checklist
- Promotion requirement: explicit A/B source wording naming P16 Salis (Meesuvvara) and P25 Raadhaafathi (Suvama Abarana) as kin (grandparent).
- Downgrade/removal trigger: source-backed changes to any support edge used by rule parent-of-parent-grandparent.
- Review cadence: recompute after any parent/sibling edge change in this local branch.

## 6) Source basis
- `SRC-DERIVED-RULES` (Derived family relation rules)
- `SRC-ROYALARK-MALDIVES` (RoyalArk Maldives — Complete Genealogical Database (segments 3-16))
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0479
- Inferred claim locator: Inference basis documented in docs/research-program/inferences/kin-p16-p25-grandparent.md.

## 7) Integration notes
- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.
- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).
- If support edges change, re-run derived dossier refresh before any promotion decision.

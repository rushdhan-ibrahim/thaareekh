# Inference Dossier

Edge key: `parent|P87|P129|`  
Last updated: `2026-02-10`  
Inference class: `curated`

## 1) Edge identity
- Relation type: parent
- Source node: P87 Ibrahim Nooredine (Keerithi Maha Radun)
- Target node: P129 Princess Veyogey Dhon Goma
- Label: (no label)
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): B

## 2) Why this specific pair is modeled
- Pair summary: P87 Ibrahim Nooredine (Keerithi Maha Radun) and P129 Princess Veyogey Dhon Goma are modeled as `parent` to preserve a targeted continuity claim without over-promoting certainty.
- Historical/dynastic context: Huraagey -> Huraagey
- Immediate direct-claim anchors around these nodes:
- CLM-0210: kin P87 Ibrahim Nooredine (Keerithi Maha Radun) <-> P88 Mohamed Mueenuddine (Keerithi Maha Radun) [uncle/nephew] (SRC-MRF-KINGS, grade B)
- CLM-0212: kin P87 Ibrahim Nooredine (Keerithi Maha Radun) <-> P95 Mohamed Farid (Keerithi Maha Radun) [grandfather (via daughter)] (SRC-MRF-KINGS, grade B)
- CLM-0260: parent P129 Princess Veyogey Dhon Goma -> P190 Hassan Fareed Didi (SRC-WIKI-HASSAN-FARID, grade B)
- CLM-0261: parent P129 Princess Veyogey Dhon Goma -> P191 Ibrahim Fareed Didi (SRC-WIKI-IBRAHIM-FAREED, grade B)
- CLM-0262: parent P129 Princess Veyogey Dhon Goma -> P95 Mohamed Farid (Keerithi Maha Radun) (SRC-WIKI-MUHAMMAD-FAREED, grade B)
- CLM-0322: parent P185 Kakaagey Dhon Goma -> P129 Princess Veyogey Dhon Goma (SRC-WIKI-MUHAMMAD-FAREED, grade B)

## 3) Logic chain (pair-specific)
1. Shortest direct-claim support path (2 steps) linking this pair:
2. - kin P87 Ibrahim Nooredine (Keerithi Maha Radun) <-> P95 Mohamed Farid (Keerithi Maha Radun) [grandfather (via daughter)] (CLM-0212, SRC-MRF-KINGS)
3. - parent P95 Mohamed Farid (Keerithi Maha Radun) -> P129 Princess Veyogey Dhon Goma (CLM-0262, SRC-WIKI-MUHAMMAD-FAREED)
4. This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.
5. Current modeling choice remains `inferred` because explicit source wording that names `parent` for P87 Ibrahim Nooredine (Keerithi Maha Radun) and P129 Princess Veyogey Dhon Goma is still absent.

## 4) Alternative interpretations
- Possible competing interpretation: grandparent or older collateral guardian-line relation instead of direct parent.
- Competing interpretation trigger: explicit source naming a different immediate parent for the target node.
- Model-retention rationale: keep the edge as inferred until explicit pairwise wording is located.

## 5) Verification checklist
- Promotion requirement: an A/B source statement explicitly naming P87 Ibrahim Nooredine (Keerithi Maha Radun) and P129 Princess Veyogey Dhon Goma with relation class `parent`.
- Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.
- Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster.

## 6) Source basis
- `SRC-MRF-KINGS` (Maldives Kings List)
- Primary inferred claim row: CLM-0364
- Inferred claim locator: SRC-MRF-PHOTO-6 (https://maldivesroyalfamily.com/maldives_photo_6.shtml) and SRC-MRF-KAKAAGE-ALBUM (https://maldivesroyalfamily.com/family_album_kakaage.shtml) include wording: "The Princess Don Goma daughter of the King Ibrahim Nooreddine ..." in 2026-02-0...

## 7) Integration notes
- `src/data/inference-notes.js` summary should be synced if relation wording changes after verification.
- Canonical promotion candidate: no (remains inferred until explicit pairwise wording is captured).
- Verification priority level: high (current grade B)

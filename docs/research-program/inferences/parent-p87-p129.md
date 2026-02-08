# Inference Dossier

Edge key: `parent|P87|P129|`  
Last updated: `2026-02-08`  
Inference class: `curated`

## 1) Edge identity
- Relation type: parent
- Source node: Ibrahim Nooredine (P87)
- Target node: Princess Veyogey Dhon Goma (P129)
- Label: (none)
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): B

## 2) Why this specific pair is modeled
- Pair summary: This edge models P87 as parent of P129 because multiple MRF pages directly call Princess Don Goma the daughter of King Ibrahim Nooreddine and the Don Goma identity maps to canonical node P129 through shared child anchors (P95/P190/P191).
- Historical/dynastic context: Late Huraagey royal household where P129 and P95 links are documented.
- Immediate claim anchors used for this pair review:
- CLM-0364: parent Ibrahim Nooredine (P87) -> Princess Veyogey Dhon Goma (P129) (SRC-MRF-PHOTO-6|SRC-MRF-KAKAAGE-ALBUM|SRC-MRF-KINGS, grade B)
- CLM-0212: kin Ibrahim Nooredine (P87) -> Mohamed Farid (P95) [grandfather (via daughter)] (SRC-MRF-KINGS, grade B)
- CLM-0262: parent Princess Veyogey Dhon Goma (P129) -> Mohamed Farid (P95) (SRC-WIKI-MUHAMMAD-FAREED, grade B)
- CLM-0260: parent Princess Veyogey Dhon Goma (P129) -> Hassan Fareed Didi (P190) (SRC-WIKI-HASSAN-FARID, grade B)
- CLM-0261: parent Princess Veyogey Dhon Goma (P129) -> Ibrahim Fareed Didi (P191) (SRC-WIKI-IBRAHIM-FAREED, grade B)

## 3) Logic chain (pair-specific)
1. Quote-level wording now exists in two MRF pages: both `SRC-MRF-PHOTO-6` and `SRC-MRF-KAKAAGE-ALBUM` contain the phrase that Princess Don Goma is daughter of King Ibrahim Nooreddine.
2. Supporting claim CLM-0212 keeps the same directionality signal inside the same dynasty corridor: P87 is described as grandfather of P95 via daughter.
3. Supporting claims CLM-0262/0260/0261 map Princess Veyogey Dhon Goma (P129) as mother of P95/P190/P191 in independent B-grade profile pages, which stabilizes the node identity mapping for "Don Goma."
4. Pair-specific identity mapping rule: the Don Goma named in MRF narrative is treated as canonical `P129` because the child set and naming cluster match the existing P129 branch model.
5. Ambiguity control: nearby MRF entry wording for P95 uses compressed notation (`daughter of 86/88`) in CLM-0209/0215, demonstrating that this source family can encode relationship shorthand that needs external corroboration.
6. Combined interpretation: the pair has direct wording inside one source family plus consistent downstream child anchors, but independence requirements for canonical promotion are not met.
7. Current state decision: maintain `i` with active verification; do not promote to `c` until one independent non-MRF A/B source directly states P87->P129.

## 4) Alternative interpretations
- P87 may be grandparent or collateral elder rather than direct parent of P129.
- The maternal/paternal side could be misassigned in secondary summaries.
- If direct family records resolve P129 parentage differently, remove this direct-parent model.

## 5) Verification checklist
- Promotion requirement: at least one independent non-MRF A/B source directly naming P87 as parent of P129.
- Downgrade/removal trigger: Confirmed alternate parentage for P129 inconsistent with P87 parent role.
- Review cadence: Re-check after modern-late-royal corroboration batches.

## 6) Source basis
- `SRC-MRF-KINGS (Maldives Kings List)`
- `SRC-MRF-PHOTO-6 (Historic Royal Photo Notes)`
- `SRC-MRF-KAKAAGE-ALBUM (Kakaage Family Album Notes)`
- `SRC-WIKI-MUHAMMAD-FAREED (Muhammad Fareed Didi)`
- `SRC-WIKI-HASSAN-FARID (Hassan Farid Didi)`
- `SRC-WIKI-IBRAHIM-FAREED (Ibrahim Fareed Didi)`
- Primary inferred claim row: CLM-0364
- Inferred claim locator: SRC-MRF-PHOTO-6 (https://maldivesroyalfamily.com/maldives_photo_6.shtml) and SRC-MRF-KAKAAGE-ALBUM (https://maldivesroyalfamily.com/family_album_kakaage.shtml), quote-level wording for Don Goma as daughter of King Ibrahim Nooreddine in 2026-02-08 crawler snapshot.
- Supporting direct-claim locators reviewed:
- CLM-0364: SRC-MRF-PHOTO-6 + SRC-MRF-KAKAAGE-ALBUM quote package (2026-02-08 crawler snapshot).
- CLM-0212: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P87 Ibrahim Nooredine and P95 Mohamed Farid (kin (grandfather (via daughte…
- CLM-0262: SRC-WIKI-MUHAMMAD-FAREED raw page (https://en.wikipedia.org/w/index.php?title=Muhammad_Fareed_Didi&action=raw), infobox/biographical family fields linking P129 Princess Veyogey Dhon Goma and P95 Mohamed Farid (parent) i…
- CLM-0260: SRC-WIKI-HASSAN-FARID raw page (https://en.wikipedia.org/w/index.php?title=Hassan_Farid_Didi&action=raw), infobox/biographical family fields linking P129 Princess Veyogey Dhon Goma and P190 Hassan Fareed Didi (parent) i…
- CLM-0261: SRC-WIKI-IBRAHIM-FAREED raw page (https://en.wikipedia.org/w/index.php?title=Ibrahim_Fareed_Didi&action=raw), infobox/biographical family fields linking P129 Princess Veyogey Dhon Goma and P191 Ibrahim Fareed Didi (pare…

## 7) Integration notes
- `src/data/inference-notes.js` summary update needed: no (aligned in this pass with quote-level rationale).
- Edge label/type update needed: no (pending direct pairwise wording).
- Canonical promotion candidate: no (remains inferred).
- Verification priority level: high (feeds modern Didi descendant mapping)

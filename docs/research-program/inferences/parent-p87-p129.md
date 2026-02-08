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
- Pair summary: This edge models P87 as parent of P129 by combining documented P87->P95 grandparent framing with P129->P95 parent evidence; it remains inferred pending explicit P87->P129 wording.
- Historical/dynastic context: Late Huraagey royal household where P129 and P95 links are documented.
- Immediate claim anchors used for this pair review:
- CLM-0212: kin Ibrahim Nooredine (P87) -> Mohamed Farid (P95) [grandfather (via daughter)] (SRC-MRF-KINGS, grade B)
- CLM-0262: parent Princess Veyogey Dhon Goma (P129) -> Mohamed Farid (P95) (SRC-WIKI-MUHAMMAD-FAREED, grade B)
- CLM-0260: parent Princess Veyogey Dhon Goma (P129) -> Hassan Fareed Didi (P190) (SRC-WIKI-HASSAN-FARID, grade B)
- CLM-0261: parent Princess Veyogey Dhon Goma (P129) -> Ibrahim Fareed Didi (P191) (SRC-WIKI-IBRAHIM-FAREED, grade B)

## 3) Logic chain (pair-specific)
1. This pair is retained as inferred parent because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.
2. Supporting claim CLM-0212: kin Ibrahim Nooredine (P87) -> Mohamed Farid (P95) [grandfather (via daughter)] (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List dynastic context links P87 Ibrahim Nooredine and P95 Mohamed Farid in kin relation (grandfather (via daughter)).
3. Supporting claim CLM-0262: parent Princess Veyogey Dhon Goma (P129) -> Mohamed Farid (P95) (SRC-WIKI-MUHAMMAD-FAREED, grade B); excerpt: Muhammad Fareed Didi family/genealogy content lists P129 Princess Veyogey Dhon Goma as parent of P95 Mohamed Farid.
4. Supporting claim CLM-0260: parent Princess Veyogey Dhon Goma (P129) -> Hassan Fareed Didi (P190) (SRC-WIKI-HASSAN-FARID, grade B); excerpt: Hassan Farid Didi family/genealogy content lists P129 Princess Veyogey Dhon Goma as parent of P190 Hassan Fareed Didi.
5. Supporting claim CLM-0261: parent Princess Veyogey Dhon Goma (P129) -> Ibrahim Fareed Didi (P191) (SRC-WIKI-IBRAHIM-FAREED, grade B); excerpt: Ibrahim Fareed Didi family/genealogy content lists P129 Princess Veyogey Dhon Goma as parent of P191 Ibrahim Fareed Didi.
6. Combined interpretation: these anchors keep the pair in-model as inferred parent, but not promoted to confirmed until explicit pairwise wording is found.
7. Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement.

## 4) Alternative interpretations
- P87 may be grandparent or collateral elder rather than direct parent of P129.
- The maternal/paternal side could be misassigned in secondary summaries.
- If direct family records resolve P129 parentage differently, remove this direct-parent model.

## 5) Verification checklist
- Promotion requirement: A/B source directly naming P87 as parent of P129.
- Downgrade/removal trigger: Confirmed alternate parentage for P129 inconsistent with P87 parent role.
- Review cadence: Re-check after modern-late-royal corroboration batches.

## 6) Source basis
- `SRC-MRF-KINGS (Maldives Kings List)`
- `SRC-WIKI-MUHAMMAD-FAREED (Muhammad Fareed Didi)`
- `SRC-WIKI-HASSAN-FARID (Hassan Farid Didi)`
- `SRC-WIKI-IBRAHIM-FAREED (Ibrahim Fareed Didi)`
- Primary inferred claim row: CLM-0364
- Inferred claim locator: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P87 Ibrahim Nooredine and P129 Princess Veyogey Dhon Goma (parent) in 2026-02-08 snapshot.
- Supporting direct-claim locators reviewed:
- CLM-0212: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P87 Ibrahim Nooredine and P95 Mohamed Farid (kin (grandfather (via daughte…
- CLM-0262: SRC-WIKI-MUHAMMAD-FAREED raw page (https://en.wikipedia.org/w/index.php?title=Muhammad_Fareed_Didi&action=raw), infobox/biographical family fields linking P129 Princess Veyogey Dhon Goma and P95 Mohamed Farid (parent) i…
- CLM-0260: SRC-WIKI-HASSAN-FARID raw page (https://en.wikipedia.org/w/index.php?title=Hassan_Farid_Didi&action=raw), infobox/biographical family fields linking P129 Princess Veyogey Dhon Goma and P190 Hassan Fareed Didi (parent) i…
- CLM-0261: SRC-WIKI-IBRAHIM-FAREED raw page (https://en.wikipedia.org/w/index.php?title=Ibrahim_Fareed_Didi&action=raw), infobox/biographical family fields linking P129 Princess Veyogey Dhon Goma and P191 Ibrahim Fareed Didi (pare…

## 7) Integration notes
- `src/data/inference-notes.js` summary update needed: yes (keep wording aligned with this curated rationale).
- Edge label/type update needed: no (pending direct pairwise wording).
- Canonical promotion candidate: no (remains inferred).
- Verification priority level: high (feeds modern Didi descendant mapping)

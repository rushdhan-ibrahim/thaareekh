# Inference Dossier

Edge key: `kin|P111|P115|reported extended Didi lineage`  
Last updated: `2026-02-08`  
Inference class: `curated`

## 1) Edge identity
- Relation type: kin
- Source node: Prince Abdul Majeed Didi (P111)
- Target node: Ibrahim Nasir (P115)
- Label: reported extended Didi lineage
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): B

## 2) Why this specific pair is modeled
- Pair summary: This edge captures an extended Didi-line continuity claim between Prince Abdul Majeed Didi and Ibrahim Nasir while keeping the relation class broad until direct pairwise evidence is found.
- Historical/dynastic context: Modern Didi dynastic-memory framing across royal and republican descendants.
- Immediate claim anchors used for this pair review:
- CLM-0233: parent Prince Abdul Majeed Didi (P111) -> Hassan Fareed Didi (P190) (SRC-WIKI-HASSAN-FARID, grade B)
- CLM-0234: parent Prince Abdul Majeed Didi (P111) -> Ibrahim Fareed Didi (P191) (SRC-WIKI-IBRAHIM-FAREED, grade B)
- CLM-0235: parent Prince Abdul Majeed Didi (P111) -> Mohamed Farid (P95) (SRC-WIKI-ABDUL-MAJEED, grade B)
- CLM-0244: parent Ahmed Didi (P116) -> Ibrahim Nasir (P115) (SRC-PO-NASIR, grade A)

## 3) Logic chain (pair-specific)
1. This pair is retained as inferred kin (reported extended Didi lineage) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.
2. Supporting claim CLM-0233: parent Prince Abdul Majeed Didi (P111) -> Hassan Fareed Didi (P190) (SRC-WIKI-HASSAN-FARID, grade B); excerpt: Hassan Farid Didi family/genealogy content lists P111 Prince Abdul Majeed Didi as parent of P190 Hassan Fareed Didi.
3. Supporting claim CLM-0234: parent Prince Abdul Majeed Didi (P111) -> Ibrahim Fareed Didi (P191) (SRC-WIKI-IBRAHIM-FAREED, grade B); excerpt: Ibrahim Fareed Didi family/genealogy content lists P111 Prince Abdul Majeed Didi as parent of P191 Ibrahim Fareed Didi.
4. Supporting claim CLM-0235: parent Prince Abdul Majeed Didi (P111) -> Mohamed Farid (P95) (SRC-WIKI-ABDUL-MAJEED, grade B); excerpt: Abdul Majeed Didi family/genealogy content lists P111 Prince Abdul Majeed Didi as parent of P95 Mohamed Farid.
5. Supporting claim CLM-0244: parent Ahmed Didi (P116) -> Ibrahim Nasir (P115) (SRC-PO-NASIR, grade A); excerpt: Official former-president profile states Ibrahim Nasir was son of Ahmed Didi and Nayaage Aishath Didi. (pair: P116 Ahmed Didi -> P115 Ibrahim Nasir).
6. Combined interpretation: these anchors keep the pair in-model as inferred kin (reported extended Didi lineage), but not promoted to confirmed until explicit pairwise wording is found.
7. Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement.

## 4) Alternative interpretations
- The shared Didi framing may indicate broad clan identity rather than direct lineal kinship.
- The tie may pass through intermediate nodes and should be modeled as branch-level kin context only.
- If stronger records specify no blood tie, retain narrative context in notes but remove the edge.

## 5) Verification checklist
- Promotion requirement: A/B source sentence that directly names P111 and P115 with explicit kin wording.
- Downgrade/removal trigger: High-quality genealogical source assigning non-overlapping parentage that breaks the implied continuity.
- Review cadence: Re-check after each modern Didi branch-source ingestion batch.

## 6) Source basis
- `SRC-WIKI-IBRAHIM-NASIR (Ibrahim Nasir)`
- `SRC-WIKI-HASSAN-FARID (Hassan Farid Didi)`
- `SRC-WIKI-IBRAHIM-FAREED (Ibrahim Fareed Didi)`
- `SRC-WIKI-ABDUL-MAJEED (Abdul Majeed Didi)`
- `SRC-PO-NASIR (President Al Ameer Ibrahim Nasir)`
- Primary inferred claim row: CLM-0021
- Inferred claim locator: SRC-WIKI-IBRAHIM-NASIR raw page (https://en.wikipedia.org/w/index.php?title=Ibrahim_Nasir&action=raw), infobox/biographical family fields linking P111 Prince Abdul Majeed Didi and P115 Ibrahim Nasir (kin (reported extended Didi lineage)) in 2026-02-08 snapshot.
- Supporting direct-claim locators reviewed:
- CLM-0233: SRC-WIKI-HASSAN-FARID raw page (https://en.wikipedia.org/w/index.php?title=Hassan_Farid_Didi&action=raw), infobox/biographical family fields linking P111 Prince Abdul Majeed Didi and P190 Hassan Fareed Didi (parent) in…
- CLM-0234: SRC-WIKI-IBRAHIM-FAREED raw page (https://en.wikipedia.org/w/index.php?title=Ibrahim_Fareed_Didi&action=raw), infobox/biographical family fields linking P111 Prince Abdul Majeed Didi and P191 Ibrahim Fareed Didi (parent…
- CLM-0235: SRC-WIKI-ABDUL-MAJEED raw page (https://en.wikipedia.org/w/index.php?title=Abdul_Majeed_Didi&action=raw), infobox/biographical family fields linking P111 Prince Abdul Majeed Didi and P95 Mohamed Farid (parent) in 2026-0…
- CLM-0244: SRC-PO-NASIR profile (presidency.gov.mv/PO/FormerPresident/6), lines 48-50 in 2026-02-08 extraction snapshot.

## 7) Integration notes
- `src/data/inference-notes.js` summary update needed: yes (keep wording aligned with this curated rationale).
- Edge label/type update needed: no (pending direct pairwise wording).
- Canonical promotion candidate: no (remains inferred).
- Verification priority level: high (modern/late-royal bridge)

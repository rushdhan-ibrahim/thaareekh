# Inference Dossier

Edge key: `kin|P132|P182|reported Addu/Meedhoo branch continuity`  
Last updated: `2026-02-08`  
Inference class: `curated`

## 1) Edge identity
- Relation type: kin
- Source node: El-Naib Ganduvaru Mohamed Thakurufan (P182)
- Target node: Al-Naib Muhammad Thakurufaanu of Addu (P132)
- Label: reported Addu/Meedhoo branch continuity
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: This edge records a reported continuity link between Al-Naib Muhammad Thakurufaanu of Addu and El-Naib Ganduvaru Mohamed Thakurufan where the current basis is branch-context and spouse/descendant adjacency.
- Historical/dynastic context: Addu/Meedhoo lineage continuity framing across Naib and Ganduvaru lines.
- Immediate claim anchors used for this pair review:
- CLM-0070: kin Al-Naib Muhammad Thakurufaanu of Addu (P132) -> Ibrahim Al-Husainee (P133) [grandparental line context] (SRC-WIKI-ABDUL-GAYOOM-IBRAHIM, grade B)
- CLM-0320: parent El-Naib Ganduvaru Mohamed Thakurufan (P182) -> Ganduvaru Hassan Didi (P183) (SRC-MRF-MIDU-ROYAL, grade B)
- CLM-0463: spouse Princess Aishath Didi (P180) -> El-Naib Ganduvaru Mohamed Thakurufan (P182) [married] (SRC-MRF-MIDU-ROYAL, grade B)

## 3) Logic chain (pair-specific)
1. This pair is retained as inferred kin (reported Addu/Meedhoo branch continuity) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.
2. Supporting claim CLM-0070: kin Al-Naib Muhammad Thakurufaanu of Addu (P132) -> Ibrahim Al-Husainee (P133) [grandparental line context] (SRC-WIKI-ABDUL-GAYOOM-IBRAHIM, grade B); excerpt: Abdul Gayoom Ibrahim dynastic context links P132 Al-Naib Muhammad Thakurufaanu of Addu and P133 Ibrahim Al-Husainee in kin relation (grandparental line context).
3. Supporting claim CLM-0320: parent El-Naib Ganduvaru Mohamed Thakurufan (P182) -> Ganduvaru Hassan Didi (P183) (SRC-MRF-MIDU-ROYAL, grade B); excerpt: Midu Royal Family Branch (Addu/Meedhoo records) family/genealogy content lists P182 El-Naib Ganduvaru Mohamed Thakurufan as parent of P183 Ganduvaru Hassan Didi.
4. Supporting claim CLM-0463: spouse Princess Aishath Didi (P180) -> El-Naib Ganduvaru Mohamed Thakurufan (P182) [married] (SRC-MRF-MIDU-ROYAL, grade B); excerpt: Midu Royal Family Branch (Addu/Meedhoo records) family/genealogy content links P180 Princess Aishath Didi and P182 El-Naib Ganduvaru Mohamed Thakurufan as spouses (married).
5. Combined interpretation: these anchors keep the pair in-model as inferred kin (reported Addu/Meedhoo branch continuity), but not promoted to confirmed until explicit pairwise wording is found.
6. Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement.

## 4) Alternative interpretations
- The continuity may be political-house affiliation, not direct consanguinity.
- The modeled kin tie may need to be mediated by a documented intermediate ancestor node.
- If local branch records contradict the continuity narrative, keep context in notes and remove edge.

## 5) Verification checklist
- Promotion requirement: A/B source line explicitly connecting P132 and P182 by named kin relation.
- Downgrade/removal trigger: Higher-grade branch documentation that separates the two lineages.
- Review cadence: Re-check after each Addu/Meedhoo source extraction increment.

## 6) Source basis
- `SRC-MRF-MIDU-ROYAL (Midu Royal Family Branch (Addu/Meedhoo records))`
- `SRC-WIKI-ABDUL-GAYOOM-IBRAHIM (Abdul Gayoom Ibrahim)`
- Primary inferred claim row: CLM-0071
- Inferred claim locator: SRC-MRF-MIDU-ROYAL r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_midu.shtml), dynasty/lineage entry context for P132 Al-Naib Muhammad Thakurufaanu of Addu and P182 El-Naib Ganduvaru Mohamed Thakurufan (kin (reported Addu/Meedhoo branch continuity)) in 2026-02-08 snapshot.
- Supporting direct-claim locators reviewed:
- CLM-0070: SRC-WIKI-ABDUL-GAYOOM-IBRAHIM raw page (https://en.wikipedia.org/w/index.php?title=Abdul_Gayoom_Ibrahim&action=raw), infobox/biographical family fields linking P132 Al-Naib Muhammad Thakurufaanu of Addu and P133 Ibrahim…
- CLM-0320: SRC-MRF-MIDU-ROYAL r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_midu.shtml), dynasty/lineage entry context for P182 El-Naib Ganduvaru Mohamed Thakurufan and P183 Ganduvaru Hassan Didi (parent…
- CLM-0463: SRC-MRF-MIDU-ROYAL r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_midu.shtml), dynasty/lineage entry context for P180 Princess Aishath Didi and P182 El-Naib Ganduvaru Mohamed Thakurufan (spouse…

## 7) Integration notes
- `src/data/inference-notes.js` summary update needed: yes (keep wording aligned with this curated rationale).
- Edge label/type update needed: no (pending direct pairwise wording).
- Canonical promotion candidate: no (remains inferred).
- Verification priority level: high (contested southern continuity claim)

# Inference Dossier

Edge key: `kin|P110|P115|reported kin relation in elite Didi line`  
Last updated: `2026-02-08`  
Inference class: `curated`

## 1) Edge identity
- Relation type: kin
- Source node: Mohamed Amin Didi (P110)
- Target node: Ibrahim Nasir (P115)
- Label: reported kin relation in elite Didi line
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): B

## 2) Why this specific pair is modeled
- Pair summary: This edge holds a conservative elite-line kin claim between Mohamed Amin Didi and Ibrahim Nasir where profile evidence supports overlapping family networks but not explicit pairwise wording.
- Historical/dynastic context: Modern Didi-family political elite network in the twentieth century republic transition.
- Immediate claim anchors used for this pair review:
- CLM-0236: parent Roanugey Aishath Didi (P112) -> Mohamed Amin Didi (P110) (SRC-PO-AMIN, grade A)
- CLM-0244: parent Ahmed Didi (P116) -> Ibrahim Nasir (P115) (SRC-PO-NASIR, grade A)
- CLM-0245: parent Nayaage Aishath Didi (P117) -> Ibrahim Nasir (P115) (SRC-PO-NASIR, grade A)
- CLM-0232: parent Mohamed Amin Didi (P110) -> Ameena Mohamed Amin (P114) (SRC-WIKI-AMIN-DIDI, grade B)

## 3) Logic chain (pair-specific)
1. This pair is retained as inferred kin (reported kin relation in elite Didi line) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.
2. Supporting claim CLM-0236: parent Roanugey Aishath Didi (P112) -> Mohamed Amin Didi (P110) (SRC-PO-AMIN, grade A); excerpt: Official former-president profile states Mohamed Amin was born as son of Ahmed Didi and Nayaage Aishath Didi. (pair: P112 Roanugey Aishath Didi -> P110 Mohamed Amin Didi).
3. Supporting claim CLM-0244: parent Ahmed Didi (P116) -> Ibrahim Nasir (P115) (SRC-PO-NASIR, grade A); excerpt: Official former-president profile states Ibrahim Nasir was son of Ahmed Didi and Nayaage Aishath Didi. (pair: P116 Ahmed Didi -> P115 Ibrahim Nasir).
4. Supporting claim CLM-0245: parent Nayaage Aishath Didi (P117) -> Ibrahim Nasir (P115) (SRC-PO-NASIR, grade A); excerpt: Official former-president profile states Ibrahim Nasir was son of Ahmed Didi and Nayaage Aishath Didi. (pair: P117 Nayaage Aishath Didi -> P115 Ibrahim Nasir).
5. Supporting claim CLM-0232: parent Mohamed Amin Didi (P110) -> Ameena Mohamed Amin (P114) (SRC-WIKI-AMIN-DIDI, grade B); excerpt: Mohamed Amin Didi family/genealogy content lists P110 Mohamed Amin Didi as parent of P114 Ameena Mohamed Amin.
6. Combined interpretation: these anchors keep the pair in-model as inferred kin (reported kin relation in elite Didi line), but not promoted to confirmed until explicit pairwise wording is found.
7. Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement.

## 4) Alternative interpretations
- The observed overlap could be social-elite naming continuity rather than demonstrable blood relation.
- The relation might run through spouse-side links and should be affinal, not blood-kin.
- If official biographies explicitly reject a family tie, this claim should be removed.

## 5) Verification checklist
- Promotion requirement: Official or scholarly A/B source explicitly stating the exact relationship between P110 and P115.
- Downgrade/removal trigger: Contradictory official lineage statements that place the two in distinct non-kin family lines.
- Review cadence: Re-check after each modern-profile corroboration wave and archival family registry pass.

## 6) Source basis
- `SRC-WIKI-IBRAHIM-NASIR (Ibrahim Nasir)`
- `SRC-PO-AMIN (President Al Ameer Mohamed Amin)`
- `SRC-PO-NASIR (President Al Ameer Ibrahim Nasir)`
- `SRC-WIKI-AMIN-DIDI (Mohamed Amin Didi)`
- Primary inferred claim row: CLM-0020
- Inferred claim locator: SRC-WIKI-IBRAHIM-NASIR raw page (https://en.wikipedia.org/w/index.php?title=Ibrahim_Nasir&action=raw), infobox/biographical family fields linking P110 Mohamed Amin Didi and P115 Ibrahim Nasir (kin (reported kin relation in elite Didi line)) in 2026-02-08 snapshot.
- Supporting direct-claim locators reviewed:
- CLM-0236: SRC-PO-AMIN profile (presidency.gov.mv/PO/FormerPresident/7), lines 49-52 in 2026-02-08 extraction snapshot.
- CLM-0244: SRC-PO-NASIR profile (presidency.gov.mv/PO/FormerPresident/6), lines 48-50 in 2026-02-08 extraction snapshot.
- CLM-0245: SRC-PO-NASIR profile (presidency.gov.mv/PO/FormerPresident/6), lines 48-50 in 2026-02-08 extraction snapshot.
- CLM-0232: SRC-WIKI-AMIN-DIDI raw page (https://en.wikipedia.org/w/index.php?title=Mohamed_Amin_Didi&action=raw), infobox/biographical family fields linking P110 Mohamed Amin Didi and P114 Ameena Mohamed Amin (parent) in 2026-02-0…

## 7) Integration notes
- `src/data/inference-notes.js` summary update needed: yes (keep wording aligned with this curated rationale).
- Edge label/type update needed: no (pending direct pairwise wording).
- Canonical promotion candidate: no (remains inferred).
- Verification priority level: high (modern presidential lineage visibility)

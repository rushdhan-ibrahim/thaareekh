# Inference Dossier

Edge key: `sibling|P5|P7|brothers`  
Last updated: `2026-02-08`  
Inference class: `curated`

## 1) Edge identity
- Relation type: sibling
- Source node: Dhinei (P5)
- Target node: Wadi (P7)
- Label: brothers
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: This edge preserves brotherhood between P5 and P7 via transitive sibling support (P5<->P6 and P6<->P7) while awaiting direct pairwise wording for P5<->P7.
- Historical/dynastic context: Early Lunar sequence where sibling chains are attested in consecutive entries.
- Immediate claim anchors used for this pair review:
- CLM-0436: sibling Dhinei (P5) -> Dhilhel (P6) [brothers] (SRC-MRF-KINGS, grade B)
- CLM-0442: sibling Dhilhel (P6) -> Wadi (P7) [brothers] (SRC-MRF-KINGS, grade B)

## 3) Logic chain (pair-specific)
1. This pair is retained as inferred sibling (brothers) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.
2. Supporting claim CLM-0436: sibling Dhinei (P5) -> Dhilhel (P6) [brothers] (SRC-MRF-KINGS, grade B); excerpt: Kings list explicitly notes P5 and P6 as brothers.
3. Supporting claim CLM-0442: sibling Dhilhel (P6) -> Wadi (P7) [brothers] (SRC-MRF-KINGS, grade B); excerpt: Kings list explicitly notes P6 and P7 as brothers.
4. Combined interpretation: these anchors keep the pair in-model as inferred sibling (brothers), but not promoted to confirmed until explicit pairwise wording is found.
5. Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement.

## 4) Alternative interpretations
- The pair may be broader sibling-household kin without direct full-brother certainty.
- Sequence compression in early lists might collapse cousin/uncle ties into sibling language.
- If direct wording contradicts, update to the explicit relation class.

## 5) Verification checklist
- Promotion requirement: A/B source line explicitly naming P5 and P7 as brothers.
- Downgrade/removal trigger: Any direct claim that one endpoint is not in the same sibling set.
- Review cadence: Re-check after primary early-Lunar manuscript corroboration.

## 6) Source basis
- `SRC-MRF-KINGS (Maldives Kings List)`
- Primary inferred claim row: CLM-0437
- Inferred claim locator: Inference synthesis from SRC-MRF-KINGS sibling chain entries #5-#7
- Supporting direct-claim locators reviewed:
- CLM-0436: SRC-MRF-KINGS entries #5-#6 kin annotation. URL anchor: https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml. Node pair: P5 Dhinei <-> P6 Dhilhel (sibling (brothers)), 2026-02-08 snapshot.
- CLM-0442: SRC-MRF-KINGS entries #6-#7 kin annotation. URL anchor: https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml. Node pair: P6 Dhilhel <-> P7 Wadi (sibling (brothers)), 2026-02-08 snapshot.

## 7) Integration notes
- `src/data/inference-notes.js` summary update needed: yes (keep wording aligned with this curated rationale).
- Edge label/type update needed: no (pending direct pairwise wording).
- Canonical promotion candidate: no (remains inferred).
- Verification priority level: medium

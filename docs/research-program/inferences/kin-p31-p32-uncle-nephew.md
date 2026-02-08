# Inference Dossier

Edge key: `kin|P31|P32|uncle→nephew`  
Last updated: `2026-02-08`  
Inference class: `curated`

## 1) Edge identity
- Relation type: kin
- Source node: Hussain (P32)
- Target node: Ibrahim (P31)
- Label: uncle→nephew
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: This edge models an avuncular relation between P31 and P32 to preserve a collateral interpretation supported by adjacent sibling and parent links in the same branch segment.
- Historical/dynastic context: Early Hilaaly collateral structure around the P30/P31/P32 cluster.
- Immediate claim anchors used for this pair review:
- CLM-0428: sibling Hassan (P30) -> Hussain (P32) [twins] (SRC-MRF-KINGS, grade B)
- CLM-0333: parent Hassan (P30) -> Ibrahim (P31) (SRC-MRF-KINGS, grade B)
- CLM-0129: kin Yusuf Handeygirin (P192) -> Hussain (P32) [uncle/nephew] (SRC-MRF-HILAALY, grade B)
- CLM-0148: kin Hussain (P32) -> Nasiruddine (P33) [succession transition context] (SRC-WIKI-MONARCHS, grade B)

## 3) Logic chain (pair-specific)
1. This pair is retained as inferred kin (uncle→nephew) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.
2. Supporting claim CLM-0428: sibling Hassan (P30) -> Hussain (P32) [twins] (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content links P30 Hassan and P32 Hussain as siblings (twins).
3. Supporting claim CLM-0333: parent Hassan (P30) -> Ibrahim (P31) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P30 Hassan as parent of P31 Ibrahim.
4. Supporting claim CLM-0129: kin Yusuf Handeygirin (P192) -> Hussain (P32) [uncle/nephew] (SRC-MRF-HILAALY, grade B); excerpt: Hilaaly branch source context records P192 and P32 with an uncle-nephew relation.
5. Supporting claim CLM-0148: kin Hussain (P32) -> Nasiruddine (P33) [succession transition context] (SRC-WIKI-MONARCHS, grade B); excerpt: Sequence notes connect P32 to P33 as succession-transition context.
6. Combined interpretation: these anchors keep the pair in-model as inferred kin (uncle→nephew), but not promoted to confirmed until explicit pairwise wording is found.
7. Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement.

## 4) Alternative interpretations
- The pair could instead be same-generation siblings if branch annotations are interpreted differently.
- The relation may be broader collateral kin without uncle-nephew specificity.
- If direct Hilaaly source text gives a different kin label, this edge should follow that wording exactly.

## 5) Verification checklist
- Promotion requirement: A/B source wording explicitly saying P31 and P32 are uncle/nephew.
- Downgrade/removal trigger: Direct statement identifying them as siblings or non-avuncular collateral kin.
- Review cadence: Re-check after each Hilaaly bridge-source extraction pass.

## 6) Source basis
- `SRC-MRF-HILAALY (Royal House of Hilaaly)`
- `SRC-MRF-KINGS (Maldives Kings List)`
- `SRC-WIKI-MONARCHS (List of Maldivian monarchs)`
- Primary inferred claim row: CLM-0145
- Inferred claim locator: SRC-MRF-HILAALY relation annotation for P31-P32 pair
- Supporting direct-claim locators reviewed:
- CLM-0428: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P30 Hassan and P32 Hussain (sibling (twins)) in 2026-02-08 snapshot.
- CLM-0333: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P30 Hassan and P31 Ibrahim (parent) in 2026-02-08 snapshot.
- CLM-0129: SRC-MRF-HILAALY founder-branch collateral annotations
- CLM-0148: SRC-WIKI-MONARCHS with SRC-MRF-KINGS cross-check around P32-P33 transition

## 7) Integration notes
- `src/data/inference-notes.js` summary update needed: yes (keep wording aligned with this curated rationale).
- Edge label/type update needed: no (pending direct pairwise wording).
- Canonical promotion candidate: no (remains inferred).
- Verification priority level: high (Hilaaly bridge logic)

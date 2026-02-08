# Inference Dossier

Edge key: `parent|P80|P84|`  
Last updated: `2026-02-08`  
Inference class: `curated`

## 1) Edge identity
- Relation type: parent
- Source node: Hassan Izzuddine (P80)
- Target node: Hassan Nooredine (P84)
- Label: (none)
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): C

## 2) Why this specific pair is modeled
- Pair summary: This edge keeps a provisional parent model from P80 to P84 using nearby explicit links (P80->P83 and sibling P83<->P84) pending direct parent wording for P80->P84.
- Historical/dynastic context: Eighteenth-century Huraagey line where sibling and parent anchors exist around P83/P84.
- Immediate claim anchors used for this pair review:
- CLM-0223: parent Mohamed Faamuladeyri Thakurufan (P100) -> Hassan Izzuddine (P80) (SRC-MRF-KINGS, grade A)
- CLM-0357: parent Hassan Izzuddine (P80) -> Mohamed Muizzuddine (P83) (SRC-WIKI-MONARCHS, grade B)
- CLM-0448: sibling Mohamed Muizzuddine (P83) -> Hassan Nooredine (P84) [brothers] (SRC-WIKI-MONARCHS, grade B)
- CLM-0360: parent Hassan Nooredine (P84) -> Mohamed Mueenuddine (P85) (SRC-MRF-KINGS, grade B)

## 3) Logic chain (pair-specific)
1. This pair is retained as inferred parent because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.
2. Supporting claim CLM-0223: parent Mohamed Faamuladeyri Thakurufan (P100) -> Hassan Izzuddine (P80) (SRC-MRF-KINGS, grade A); excerpt: Maldives Kings List family/genealogy content lists P100 Mohamed Faamuladeyri Thakurufan as parent of P80 Hassan Izzuddine.
3. Supporting claim CLM-0357: parent Hassan Izzuddine (P80) -> Mohamed Muizzuddine (P83) (SRC-WIKI-MONARCHS, grade B); excerpt: List of Maldivian monarchs family/genealogy content lists P80 Hassan Izzuddine as parent of P83 Mohamed Muizzuddine.
4. Supporting claim CLM-0448: sibling Mohamed Muizzuddine (P83) -> Hassan Nooredine (P84) [brothers] (SRC-WIKI-MONARCHS, grade B); excerpt: List of Maldivian monarchs family/genealogy content links P83 Mohamed Muizzuddine and P84 Hassan Nooredine as siblings (brothers).
5. Supporting claim CLM-0360: parent Hassan Nooredine (P84) -> Mohamed Mueenuddine (P85) (SRC-MRF-KINGS, grade B); excerpt: Maldives Kings List family/genealogy content lists P84 Hassan Nooredine as parent of P85 Mohamed Mueenuddine.
6. Combined interpretation: these anchors keep the pair in-model as inferred parent, but not promoted to confirmed until explicit pairwise wording is found.
7. Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement.

## 4) Alternative interpretations
- P84 may descend from a sibling branch of P80 rather than directly from P80.
- The relation could represent broader ancestor context rather than immediate parenthood.
- If stronger sources provide different parent assignment, edge should be retyped or removed.

## 5) Verification checklist
- Promotion requirement: A/B source explicitly stating P80 is parent of P84.
- Downgrade/removal trigger: Direct genealogical source assigning P84 to a different parent.
- Review cadence: Re-check after Huraagey eighteenth-century source expansion.

## 6) Source basis
- `SRC-WIKI-MONARCHS (List of Maldivian monarchs)`
- `SRC-MRF-KINGS (Maldives Kings List)`
- Primary inferred claim row: CLM-0358
- Inferred claim locator: SRC-WIKI-MONARCHS page (https://en.wikipedia.org/wiki/List_of_Maldivian_monarchs), monarch-list table/notes entries for P80 Hassan Izzuddine and P84 Hassan Nooredine (parent) in 2026-02-08 snapshot.
- Supporting direct-claim locators reviewed:
- CLM-0223: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P100 Mohamed Faamuladeyri Thakurufan and P80 Hassan Izzuddine (parent) in…
- CLM-0357: SRC-WIKI-MONARCHS page (https://en.wikipedia.org/wiki/List_of_Maldivian_monarchs), monarch-list table/notes entries for P80 Hassan Izzuddine and P83 Mohamed Muizzuddine (parent) in 2026-02-08 snapshot.
- CLM-0448: SRC-WIKI-MONARCHS page (https://en.wikipedia.org/wiki/List_of_Maldivian_monarchs), monarch-list table/notes entries for P83 Mohamed Muizzuddine and P84 Hassan Nooredine (sibling (brothers)) in 2026-02-08 snapshot.
- CLM-0360: SRC-MRF-KINGS r.jina mirror (https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml), dynasty/lineage entry context for P84 Hassan Nooredine and P85 Mohamed Mueenuddine (parent) in 2026-02-08 sn…

## 7) Integration notes
- `src/data/inference-notes.js` summary update needed: yes (keep wording aligned with this curated rationale).
- Edge label/type update needed: no (pending direct pairwise wording).
- Canonical promotion candidate: no (remains inferred).
- Verification priority level: high (pre-modern sovereign succession path)

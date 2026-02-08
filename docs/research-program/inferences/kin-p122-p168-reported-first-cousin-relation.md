# Inference Dossier

Edge key: `kin|P122|P168|reported first-cousin relation`  
Last updated: `2026-02-08`  
Inference class: `curated`

## 1) Edge identity
- Relation type: kin
- Source node: Mohamed Nasheed (P122)
- Target node: Fazna Ahmed (P168)
- Label: reported first-cousin relation
- Current confidence marker (`c/i/u`): i
- Current grade (`A/B/C/D`): B

## 2) Why this specific pair is modeled
- Pair summary: This edge preserves reported first-cousin framing between Mohamed Nasheed and Fazna Ahmed while current claims mostly document spouses and parent nodes around them rather than a direct cousin statement.
- Historical/dynastic context: Contemporary political-family household links around Nasheed and Solih lines.
- Immediate claim anchors used for this pair review:
- CLM-0258: parent Abdul Sattar Umar (P127) -> Mohamed Nasheed (P122) (SRC-ATOLL-NASHEED-PARENTS, grade B)
- CLM-0259: parent Abida Mohamed (P128) -> Mohamed Nasheed (P122) (SRC-ATOLL-NASHEED-PARENTS, grade B)
- CLM-0305: parent Fazna Ahmed (P168) -> Sarah Ibrahim Solih (P169) (SRC-WIKI-SOLIH, grade B)
- CLM-0306: parent Fazna Ahmed (P168) -> Yaman Ibrahim Solih (P170) (SRC-WIKI-SOLIH, grade B)
- CLM-0460: spouse Ibrahim Mohamed Solih (P167) -> Fazna Ahmed (P168) [married] (SRC-WIKI-SOLIH, grade B)

## 3) Logic chain (pair-specific)
1. This pair is retained as inferred kin (reported first-cousin relation) because the model has contextual and adjacency support but lacks a single direct sentence that states this exact pairwise relation class.
2. Supporting claim CLM-0258: parent Abdul Sattar Umar (P127) -> Mohamed Nasheed (P122) (SRC-ATOLL-NASHEED-PARENTS, grade B); excerpt: Atoll Times report names Mohamed Nasheed’s father as Abdul Sattar Umar. (pair: P127 Abdul Sattar Umar -> P122 Mohamed Nasheed).
3. Supporting claim CLM-0259: parent Abida Mohamed (P128) -> Mohamed Nasheed (P122) (SRC-ATOLL-NASHEED-PARENTS, grade B); excerpt: Atoll Times report names Mohamed Nasheed’s mother as Abida Mohamed. (pair: P128 Abida Mohamed -> P122 Mohamed Nasheed).
4. Supporting claim CLM-0305: parent Fazna Ahmed (P168) -> Sarah Ibrahim Solih (P169) (SRC-WIKI-SOLIH, grade B); excerpt: Wikipedia raw infobox spouse and issue fields support Fazna Ahmed as spouse in the child list including Sarah Ibrahim Solih. (pair: P168 Fazna Ahmed -> P169 Sarah Ibrahim Solih).
5. Supporting claim CLM-0306: parent Fazna Ahmed (P168) -> Yaman Ibrahim Solih (P170) (SRC-WIKI-SOLIH, grade B); excerpt: Wikipedia lead text states Ibrahim Mohamed Solih and his wife have a son named Yaman. (pair: P168 Fazna Ahmed -> P170 Yaman Ibrahim Solih).
6. Supporting claim CLM-0460: spouse Ibrahim Mohamed Solih (P167) -> Fazna Ahmed (P168) [married] (SRC-WIKI-SOLIH, grade B); excerpt: Wikipedia lead text names Fazeena Ahmed as spouse of Ibrahim Mohamed Solih. (pair: P167 Ibrahim Mohamed Solih -> P168 Fazna Ahmed).
7. Combined interpretation: these anchors keep the pair in-model as inferred kin (reported first-cousin relation), but not promoted to confirmed until explicit pairwise wording is found.
8. Current state decision: maintain `i` with active verification, because evidence is suggestive and structured but not yet direct for this exact pair statement.

## 4) Alternative interpretations
- The pair may be related at a more distant cousin degree than currently labeled.
- The relation may reflect marital-network shorthand in press summaries rather than strict genealogy.
- If documentary records identify separate grandparent lines, this edge should be downgraded or removed.

## 5) Verification checklist
- Promotion requirement: A/B source explicitly naming P122 and P168 as first cousins (or another exact cousin degree).
- Downgrade/removal trigger: Reliable family-tree evidence that contradicts shared ancestor assumptions.
- Review cadence: Re-check after modern civil-record corroboration and profile-source expansion.

## 6) Source basis
- `SRC-WIKI-SOLIH (Ibrahim Mohamed Solih)`
- `SRC-WIKI-NASHEED (Mohamed Nasheed)`
- `SRC-ATOLL-NASHEED-PARENTS (Nasheed's parents sign up to The Democrats)`
- Primary inferred claim row: CLM-0049
- Inferred claim locator: SRC-WIKI-SOLIH page (en.wikipedia.org/wiki/Ibrahim_Mohamed_Solih), line 34 in 2026-02-08 extraction snapshot.
- Supporting direct-claim locators reviewed:
- CLM-0258: SRC-ATOLL-NASHEED-PARENTS article (atolltimes.mv/post/news/3844), lines 27-28 in 2026-02-08 extraction snapshot. URL anchor: https://atolltimes.mv/post/news/3844. Node pair: P127 Abdul Sattar Umar <-> P122 Mohamed Nashe…
- CLM-0259: SRC-ATOLL-NASHEED-PARENTS article (atolltimes.mv/post/news/3844), lines 27-28 in 2026-02-08 extraction snapshot. URL anchor: https://atolltimes.mv/post/news/3844. Node pair: P128 Abida Mohamed <-> P122 Mohamed Nasheed (…
- CLM-0305: SRC-WIKI-SOLIH raw page, spouse line 35 and issue line 37 snapshot. URL anchor: https://en.wikipedia.org/w/index.php?title=Ibrahim_Mohamed_Solih&action=raw. Node pair: P168 Fazna Ahmed <-> P169 Sarah Ibrahim Solih (pare…
- CLM-0306: SRC-WIKI-SOLIH page (en.wikipedia.org/wiki/Ibrahim_Mohamed_Solih), lines 43-45 in 2026-02-08 extraction snapshot.
- CLM-0460: SRC-WIKI-SOLIH page (en.wikipedia.org/wiki/Ibrahim_Mohamed_Solih), lines 43-45 in 2026-02-08 extraction snapshot.

## 7) Integration notes
- `src/data/inference-notes.js` summary update needed: yes (keep wording aligned with this curated rationale).
- Edge label/type update needed: no (pending direct pairwise wording).
- Canonical promotion candidate: no (remains inferred).
- Verification priority level: high (modern public-facing relationship claim)

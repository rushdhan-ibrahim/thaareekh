# Research Expansion Roadmap

Date: 2026-02-09
Status: Complete — compiled from 4-agent team audit (person, source, concept, evidence)

---

## Executive Summary

The Maldives Royal Genealogy knowledge base (187 people, 471 edges, 72 sources) has a solid structural foundation but severe depth gaps. **166 of 188 persons have zero enrichment data**, early dynasties are near-blank, source diversity is critically low, and the concept/title/etymology layers are skeletal. This roadmap identifies concrete expansion opportunities across five tracks.

---

## Track 1: Person-Level Enrichment (Quick Wins → Systematic Passes)

### 1.1 Quantified Gaps

| Field | Populated | Missing | Coverage |
|-------|-----------|---------|----------|
| source_refs | 110/187 | 77 | 58.8% |
| aliases | 62/187 | 125 | 33.2% |
| titles | 46/187 | 141 | 24.6% |
| known_as | 6/187 | 181 | 3.2% |
| offices_held | 19/187 | 168 | 10.2% |
| Birth/death dates (core sovereigns) | 22/85 | 63 | 25.9% |
| Profile enrichments (any) | 22/188 | 166 | 11.7% |

### 1.2 Dynasty Gap Heat Map

| Dynasty | People | source_refs | aliases | titles | Severity |
|---------|--------|-------------|---------|--------|----------|
| Lunar | 30 | 4 (13%) | 0 (0%) | 3 (10%) | CRITICAL |
| Hilaaly | 40 | 14 (35%) | 13 (33%) | 5 (13%) | CRITICAL |
| Huraagey | 24 | 14 (58%) | 10 (42%) | 10 (42%) | HIGH |
| Utheemu | 12 | 8 (67%) | 6 (50%) | 4 (33%) | HIGH |
| Dhiyamigili | 5 | 2 (40%) | 1 (20%) | 1 (20%) | HIGH |
| Isdu | 3 | 1 (33%) | 0 (0%) | 0 (0%) | MODERATE |
| Devadu | 1 | 0 (0%) | 0 (0%) | 0 (0%) | MODERATE |
| Unknown | 6 | 1 (17%) | 0 (0%) | 0 (0%) | MODERATE |
| Modern | 56 | 56 (100%) | 25 (45%) | 16 (29%) | LOW |

### 1.3 Top 20 Priority Person Expansions

| # | ID | Name | Dynasty | Key Gaps | Why Priority |
|---|-----|------|---------|----------|--------------|
| 1 | P61 | Hassan IX / Dom Manoel | Hilaaly | aliases, titles, offices, Portuguese context | Triple accession, Portuguese conversion, St. Francis Xavier link — most narratively rich pre-modern figure |
| 2 | P20 | Khadijah | Lunar | aliases, titles (Sultana), offices | Most famous female ruler; triple accession; assassinated two husbands |
| 3 | P104 | Mohamed Thakurufaanu | Utheemu | titles (Bodu Thakurufaanu), facts, offices | National hero; most famous Maldivian historical figure |
| 4 | P51 | Kalu Mohamed | Hilaaly | aliases, titles, offices, dates | Triple accession; Hilaaly hinge figure |
| 5 | P80 | Hassan Izzuddine | Huraagey | birth/death verification, spouse data | Huraagey founder (Dhon Bandaarain); already best-enriched but needs spouse expansion |
| 6 | P1 | Koimala | Lunar | aliases (Dhivehi/Sinhala variants), titles | Legendary founder; zero aliases |
| 7 | P30 | Hassan | Hilaaly | aliases, titles, offices, source_refs | Hilaaly dynasty founder; high downstream dependency |
| 8 | P2 | Dhovemi | Lunar | birth/death dates, titles, offices | Islamic conversion figure (1153 CE) |
| 9 | P77 | Mohamed Imaduddine | Dhiyamigili | aliases, titles, offices | Dhiyamigili dynasty founder |
| 10 | P73 | Mohamed | Devadu | aliases, titles, offices, ALL edges | Only Devadu person; completely isolated |
| 11 | P95 | Mohamed Farid | Huraagey | aliases, known_as, spouse, children | Last Sultan; monarchy-to-republic transition |
| 12 | P85 | Mohamed Mueenuddine | Huraagey | birth/death dates, aliases, titles | 36-year reign but no dates |
| 13 | P86 | Mohamed Imaduddine | Huraagey | birth/death dates, aliases, titles | 47-year reign (longest Huraagey) but no dates |
| 14 | P87 | Ibrahim Nooredine | Huraagey | birth/death dates, aliases, titles | Grandfather of last Sultan P95 |
| 15 | P91 | Mohamed Shamsuddine III | Huraagey | aliases, titles, known_as | Constitutional era; 30-year second reign |
| 16 | P68 | Mohamed Imaduddine | Utheemu | aliases, titles, offices | First Utheemu sovereign |
| 17 | P74 | Ali | Isdu | aliases, titles, offices | Isdu founder |
| 18 | P42 | Sayyid Mohamed | Unknown | all fields | "An Arab" — mysterious figure |
| 19 | P56 | Sharif Ahmed | Unknown | all fields | "An Arab from Mecca" — how did an Arab become sultan? |
| 20 | P110 | Mohamed Amin Didi | Modern | expanded facts, reform narrative | First President; monarchy-republic transition |

### 1.4 Missing People to Add as Nodes

These individuals are mentioned in existing data but not yet modeled:

1. **Ali Thakurufaanu** — brother of P104, co-liberator from Portuguese
2. **Hassan Thakurufaanu** — brother of P104, co-liberator
3. **"Kamba Dio"** — daughter of P40, mother of P49
4. **"Aidage Maava Kilege"** — mother of P11/P12
5. **"Vengihi Kalo"** — father of P11
6. **"Hiriya Maava Kilege"** — parent of P9
7. **"Maayin Rannabandeyri Kilege"** — father of P34
8. **"Recca"** — daughter of P40, mother of P57
9. **Wives of late Huraagey sultans P85-P92** — structurally absent
10. **Don Goma** — daughter of P87, mother of P95 (may partially exist as P129)
11. **Dom Luis de Sousa's wife** — needed for P97-P98 bridge
12. **Princess Aysha Rani Kilege** — daughter of P51, wife of P63

### 1.5 Handcrafted Biography Priorities

These persons would benefit most from substantial prose narratives (not just data fields):

1. **P61 — Hassan IX / Dom Manoel**: Portuguese conversion, triple accession, rule from Goa
2. **P20 — Khadijah**: Female sovereign, assassinations, three separate accessions
3. **P104 — Mohamed Thakurufaanu**: Liberation narrative, national hero
4. **P80 — Hassan Izzuddine (Dhon Bandaarain)**: Dynasty founder, regent-to-sovereign
5. **P81 — Mohamed Ghiyathuddine**: First Thaana dictionary, martyr ruler
6. **P29 — Osman of Fehendu**: Last Lunar ruler AND PM — unique dual role
7. **P30 — Hassan**: Hilaaly founder, twin-brother co-ruling
8. **P95 — Mohamed Farid**: Last Sultan, end of 800+ years of monarchy
9. **P91 — Mohamed Shamsuddine III**: Constitutional transformation
10. **P110 — Mohamed Amin Didi**: First President, radical reformer

---

## Track 2: Source Diversification & Multilingual Research

### 2.1 Current Source Concentration Risk

| Domain | Sources | Share | Risk |
|--------|---------|-------|------|
| Wikipedia (English) | 30 | 41.7% | HIGH — secondary, no genealogical authority |
| presidency.gov.mv | 9 | 12.5% | LOW — official but limited family detail |
| maldivesroyalfamily.com | 7 | 9.7% | MODERATE — specialist but single publisher |
| MNU Saruna | 4 | 5.6% | LOW — institutional repository |
| All others | 22 | 30.6% | Fragmented |

**Critical fact**: 214 edges backed ONLY by SRC-DERIVED-RULES (auto-inference). Only 8 of 564 evidence references cite A-grade sources.

### 2.2 Arabic Source Opportunities

| Source | Status | Expected Yield | Priority | Notes |
|--------|--------|----------------|----------|-------|
| Tarikh Islam Diba Mahall (TUFS facsimile) | Registered, extraction pending | HIGH — core chronicle | P0 | Specific genealogical chapters need identification and extraction |
| Tarikh annotations vol. 2 (TUFS) | Registered, extraction pending | MEDIUM — scholarly index | P0 | Variant names and index-guided locator mapping |
| Ibn Battuta's Rihla, Ch. on Maldives | NOT registered | HIGH — 14th century eyewitness | P0 | Specific chapters on Maldivian queen (likely Khadijah P20), court structure, succession |
| Cairo Geniza / Arab trade records | NOT registered | LOW-MEDIUM | P2 | Scattered references, requires specialist access |
| Al-Idrisi's geography | NOT registered | LOW | P2 | Pre-Islamization references possible |

### 2.3 Dhivehi Source Opportunities

| Source | Status | Expected Yield | Priority | Notes |
|--------|--------|----------------|----------|-------|
| Raadhavalhi manuscript tradition | Partially registered (1985 article) | HIGH — king list tradition | P0 | Full manuscript editions may exist beyond the 1985 article |
| Bodu Thakurufaanu narrative tradition | NOT registered | HIGH — liberation-era genealogy | P0 | Multiple Dhivehi retellings with genealogical claims about P102-P106 |
| National Archives holdings | NOT registered | HIGH — official records | P0 | archives.gov.mv has law text registered but not archival holdings catalog |
| Mohamed Nasheed's "Dhe Radhun" | Bibliographic record only | MEDIUM — 1800-1900 polity | P1 | Historical treatise covering Huraagey period; need actual content extraction |
| Dhivehi newspaper archives (Haveeru, Mihaaru) | NOT registered | LOW-MEDIUM — modern genealogy | P2 | Obituaries, family announcements may name parentage |
| Loamaafaanu copper plates (full corpus) | Partially registered (1982, 2003) | HIGH — inscriptional evidence | P0 | Additional plate editions beyond the 2 registered entries |

### 2.4 Sinhalese / Sri Lankan Source Opportunities

| Source | Status | Expected Yield | Priority | Notes |
|--------|--------|----------------|----------|-------|
| Mahavamsa / Culavamsa ("Diva Mahal" refs) | NOT registered | MEDIUM — pre-Islamic context | P1 | Pali chronicles with possible references to early Maldivian connections |
| Portuguese Ceylon colonial records | NOT registered | HIGH — 16th-17th century | P1 | Dom Manoel (P61), Portuguese-era conversions, Goa connections |
| Dutch VOC records (Colombo) | NOT registered | MEDIUM — 17th-18th century | P1 | Trade and administrative references to Maldivian sultans |
| British Ceylon administration | NOT registered | MEDIUM — 19th-20th century | P1 | CO 167 series; Bell was a Ceylon civil servant |

### 2.5 South Indian Source Opportunities

| Source | Status | Expected Yield | Priority | Notes |
|--------|--------|----------------|----------|-------|
| Kerala Mappila Muslim records | NOT registered | MEDIUM — trade/marriage links | P2 | Maldivian-Kerala trade and marriage connections |
| Portuguese Goa archives | NOT registered | HIGH — P61 Dom Manoel era | P1 | Estado da India records; Goa archives may have Maldivian royal correspondence |
| Tamil/Chola trade guild records | NOT registered | LOW — pre-Islamic context | P2 | Possible references to early Maldivian trade rulers |

### 2.6 European Source Opportunities (Beyond Existing)

| Source | Status | Expected Yield | Priority | Notes |
|--------|--------|----------------|----------|-------|
| H.C.P. Bell reports (1879-1922) | Only 1883 registered | HIGH — archaeological + genealogical | P0 | Bell's Maldivian reports span 4+ decades; only the 1883 work is registered |
| British Colonial Office CO 167 | NOT registered | MEDIUM — 19th-20th century | P1 | Administrative records on Maldives from British oversight period |
| Pyrard unextracted chapters | Registered but incomplete | HIGH — offices, court structure | P0 | Specific chapters on governance, succession, offices need section-level extraction |
| Portuguese Estado da India | NOT registered | HIGH — 16th century | P1 | Administrative correspondence mentioning Maldivian royalty |

### 2.7 Immediate New Source Registrations (Recommended)

These 3 sources should be registered in `src/data/sources.js` immediately as they are well-documented, accessible, and high-yield:

1. **Bell 1940 Monograph** (`SRC-BELL-1940`) — *The Maldive Islands: Monograph on the History, Archaeology and Epigraphy* (reprint from 1940 Ceylon reports). Comprehensive genealogical and institutional data; fills major gap since only the 1883 report is currently registered. Grade: A. Priority: P0.
2. **Maldives Heritage Survey manuscripts** (`SRC-HERITAGE-SURVEY`) — Manuscript tradition survey held at National Centre for Linguistic and Historical Research. Contains genealogical references across multiple atoll traditions. Grade: B. Priority: P0.
3. **Ibn Battuta Rihla, Maldives chapters** (`SRC-IBN-BATTUTA`) — 14th-century eyewitness account with detailed descriptions of the Maldivian court, named officials, and queen Khadijah (P20). Multiple English translations available (Gibb, Mackintosh-Smith). Grade: A. Priority: P0.

### 2.8 Additional High-Value Sources for Registration

4. **King Kalaafaan Manuscripts** — Dhivehi manuscript tradition with genealogical claims for Utheemu-era lineages. Priority: P1.
5. **GLOBALISE VOC Database** (globalise.huygens.knaw.nl) — Digitized Dutch East India Company records with Maldives trade/diplomatic references. Priority: P1.
6. **FCO 141 British Colonial Records** (National Archives UK) — Declassified files covering late sultanate and independence transition. Priority: P1.
7. **Dhivehi Thaareekh 1902** — Early Dhivehi historical compilation with genealogical tables. Priority: P1.

### 2.9 Source Expansion Priority Order

1. **P0 Immediate** — Ibn Battuta Rihla (Arabic), Tarikh extraction (Arabic), Bell's other reports (English), Raadhavalhi full manuscript (Dhivehi), Bodu Thakurufaanu narratives (Dhivehi), Loamaafaanu extended corpus (Dhivehi)
2. **P1 Short-term** — Portuguese Goa/Ceylon archives, Dutch VOC, Mahavamsa references, British CO 167, Mohamed Nasheed's Dhe Radhun, Pyrard deep extraction
3. **P2 Medium-term** — Kerala Mappila records, Tamil trade records, Arabic trade/geographic sources, Dhivehi newspaper archives

---

## Track 3: Concept, Title & Etymology Expansion

### 3.1 Planned but Uncreated Concepts (CONCEPT-009 through CONCEPT-014)

These 6 concepts are referenced in the title-style register and etymology register but have no dossier files yet:

- CONCEPT-009: Sovereign style stack
- CONCEPT-010: Fandiyaaru (chief judge institution)
- CONCEPT-011: Bandaarain cluster
- CONCEPT-012: Thakurufaanu honorific complex
- CONCEPT-013: Dom-Donna-Infanta overlay
- CONCEPT-014: Regnal epithet token bank

### 3.2 Additional Missing Concepts (Proposed)

| ID | Topic | Category | Justification |
|----|-------|----------|---------------|
| CONCEPT-015 | Regency and guardianship | system | Multiple sovereigns acceded as minors; regent mechanisms undocumented |
| CONCEPT-016 | Islamic legal succession framework | system | Sharia inheritance vs political succession logic; affects kin-edge interpretation |
| CONCEPT-017 | Marriage alliance patterns | system | Dynastic inter-marriage as political instrument; affects spouse-edge interpretation |
| CONCEPT-018 | Atoll governance (Atholhu Veriyaa) | institution | Atoll-level administration not documented; connects to exile and provincial power |
| CONCEPT-019 | Friday Mosque / Hukuru Miskiiy | institution | Religious institution tied to sovereign legitimacy and coronation |
| CONCEPT-020 | Military/naval institutions | institution | Maritime defense, the liberation wars, Portuguese conflict period |
| CONCEPT-021 | Exile and provincial power | political concept | Exile to atolls as political instrument (P130 Fuvahmulah exile, southern branches) |
| CONCEPT-022 | The Rehendhi / Rani institution | title/system | Female title forms and the institution of queen-consort vs queen-regnant |
| CONCEPT-023 | Pre-Islamic / Buddhist-era continuities | system | Koimala legend, Buddhist-to-Islamic transition, possible Sinhala/South Indian connections |
| CONCEPT-024 | Maldivian numismatic evidence | system | Larin coinage and other numismatic evidence bearing ruler names and titles |
| CONCEPT-025 | Bodu Vizier / Vizier institution | institution | Chief minister role that sometimes held effective power during weak sultans; period-specific evolution |
| CONCEPT-026 | Kateeb (chancery / scribal) office | institution | Record-keeping and correspondence office that shaped documentary survival |
| CONCEPT-027 | Shahbandar (port master) | institution | Trade regulation office critical for understanding Maldivian maritime economy |
| CONCEPT-028 | Arabic laqab / honorific system | title/system | Systematic analysis of Arabic-layer epithets (Imaduddine, Shamsuddine, Nooredine, etc.) — nearly universal in post-Islamic sovereign names |
| CONCEPT-029 | Conversion and religious legitimacy | system | How conversion to Islam and hajj pilgrimage functioned as legitimation mechanisms for sovereign authority |

### 3.3 Regnal Epithet Token Bank (Unresolved)

15+ high-frequency tokens at E4 (unresolved etymology) need systematic linguistic research:

| Token | Frequency | Likely Layer | Research Need |
|-------|-----------|-------------|---------------|
| Keerithi | 17 | Sanskrit/Pali | `kīrti` (glory) — needs Dhivehi phonological pathway confirmation |
| Maha | 15 | Sanskrit/Pali | `mahā` (great) — straightforward but needs attestation |
| Radun | 14 | Unclear | Possibly Dhivehi-specific or Pali-derived; no secure etymology |
| Bavana | 13 | Sanskrit/Pali | Possibly `bhavana` (cultivation/meditation) — needs confirmation |
| Loka | 13 | Sanskrit/Pali | `loka` (world) — likely but needs Dhivehi usage documentation |
| Abarana | 10 | Sanskrit/Pali | `ābharaṇa` (ornament) — needs confirmation |
| Kula | 10 | Sanskrit/Pali | `kula` (family/lineage) — needs confirmation |
| Sundhura | 9 | Sanskrit/Pali | `sundara` (beautiful) — needs confirmation |
| Raadha | 7 | Unclear | Multiple possible origins; needs disambiguation |
| Veeru | 7 | Sanskrit/Pali | `vīra` (hero) — likely but needs attestation |
| Suvara | 6 | Sanskrit/Pali | `suvarna` (gold)? — uncertain |
| Dhammaru | 5 | Sanskrit/Pali | `dhammara` or `dharma`? — uncertain |
| Ran | 5 | Dhivehi/Sanskrit | `ran` (gold in Dhivehi, possibly from `suvarna`) |
| Katthiri | 4 | Arabic? | `kathīr` (much/many)? — uncertain linguistic layer |
| Siyaaaka | 4 | Unclear | No clear etymology identified |

**Key insight**: Most of these tokens are likely resolvable from a single reference — *Hassan Ahmed Maniku's Etymological Vocabulary of Dhivehi* — which provides systematic Sanskrit/Pali→Dhivehi derivation pathways. A focused extraction pass on this work could resolve 10+ of the 15 E4-grade tokens in a single effort.

**Required expertise**: Sanskrit/Pali philologist with Dhivehi linguistic knowledge, or Arabic linguist for potential Arabic-layer tokens.

### 3.4 Title/Style Gaps

- **Female title forms**: Rani, Rehendhi, Kabaidhi, Maava Kilege — only partially documented; need systematic treatment
- **Arabic/Islamic honorific layer**: al-Sultan, al-Adil, Imaduddine, Shamsuddine, Nooredine etc. — these laqab forms appear in almost every sovereign name but are not systematically analyzed. Needs dedicated concept dossier (CONCEPT-028) covering: (a) *laqab* pattern taxonomy (Din-compounds vs. virtue epithets), (b) period when Arabic laqab adoption became standard, (c) whether laqab was chosen at accession or inherited, (d) comparison with broader Islamic world naming conventions
- **Portuguese honorific layer**: Dom, Donna, Infanta — covered in etymology register but needs dedicated concept dossier (CONCEPT-013)

### 3.5 Office Catalog Expansion Needs

Current catalog has 15 offices. Data and sources mention at least 10+ more:

- Velaanaa (court administrator)
- Dhoshimeynaa (household/palace)
- Hakuraa (harbor/customs)
- Handeygiri (mentioned in data as OFF-HANDEYGIRI)
- Maafaiy (mentioned as OFF-MAAFAIY)
- Faashanaa (mentioned as OFF-FAASHANAA)
- Faamuladheyri (mentioned as OFF-FAAMULADHEYRI)
- Atholhu Veriyaa (atoll chief) — not in catalog at all
- Khatib (religious preacher) — not in catalog
- Mudheemu (customs officer) — not in catalog
- Bodu Vizier / Grand Vizier — chief minister role, critical for understanding power dynamics during weak sultans
- Kateeb (chancery/scribal) — record-keeping and correspondence office
- Shahbandar (port master) — trade regulation, critical for maritime economy understanding

---

## Track 4: Inference Quality & Edge Evidence

### 4.1 Inference Dossier Quality

Of 238 inference dossiers:
- **24 curated** — handcrafted with pair-specific reasoning, logic chains, and verification checklists
- **214 rule-derived** — auto-generated from 4 rules; templated stubs with machine-readable basis

**Quality assessment**: The 214 rule-derived dossiers follow an identical template. While structurally complete, they lack:
- Historical context specific to the pair
- Alternative interpretations
- Source-specific reasoning beyond rule labels
- Period-specific analysis

### 4.2 Highest-Priority Inference Dossiers for Handcrafting

These dossiers sit on dynasty-bridge edges or high-visibility nodes and need priority handcrafting:

1. **kin|P104|P61** — Thakurufaanu ↔ Dom Manoel (Utheemu-Hilaaly bridge)
2. **kin|P104|P66** — Thakurufaanu ↔ Joao' (co-regency framework)
3. **kin|P104|P68** — Thakurufaanu ↔ Mohamed Imaduddine (Utheemu lineage)
4. **kin|P110|P115** — Amin Didi ↔ Ibrahim Nasir (Modern political bridge)
5. **kin|P87|P92** — Ibrahim Nooredine ↔ Mohamed Shamsuddine III
6. **parent|P87|P129** — Ibrahim Nooredine → Don Goma (high-impact bridge, active contradiction)
7. **kin|P31|P32** — Ibrahim ↔ Ahmed (Hilaaly uncle-nephew)
8. **kin|P80|P77** — Hassan Izzuddine ↔ Mohamed Imaduddine (Huraagey-Dhiyamigili bridge)

### 4.3 Edge Evidence Gap Priorities

**Single-source edges needing corroboration (390 of 471)**:
- Dynasty-bridge edges should be prioritized — these are the structural backbone
- Lunar→Hilaaly transition edges (P29→P30 area)
- Hilaaly→Utheemu transition edges (P67→P68 area)
- Utheemu→Dhiyamigili transition edges
- Dhiyamigili→Huraagey transition edges (P79→P80 area)
- Huraagey→Modern transition edges (P95→P110 area)

**3 uncertain edges**:
- Need specific evidence to resolve — likely in the P75 (Addu Hassan Manikfan) area and contested late-Huraagey claims

**Active contradictions needing research**:
- CLOG-2026-02-08-C1: P86/P88 → P95 ancestor labels (slash notation ambiguity)
- CLOG-2026-02-08-C2: P87→P129 classification (has quote-level wording but awaits independent corroboration)

### 4.4 Promotion Pipeline Status

The promotion queue has 3 batches:
- **Batch 1**: 18 curated inference support claims — all approved (direct A/B claims supporting inferred edges, edges themselves remain provisional)
- **Batch 2**: 12 remaining direct A/B claims — approved en masse
- **Batch 3**: High-impact bridge adjudication (P87/P90/P91/P95/P129) — mixed status: P87→P129 pending independent corroboration, P86/P88→P95 deferred, P90/P91→P95 pending pair-explicit wording

**Key bottleneck**: The P87→P129 edge (Ibrahim Nooredine → Don Goma) is the single highest-impact promotion candidate. It has quote-level MRF source wording but awaits one independent non-MRF corroboration source. Resolving this unlocks the entire late-monarchy→modern bridge corridor.

### 4.5 Missing Relationship Types

- **Spouse edges**: Extremely rare for pre-Modern persons. Major structural gap for a genealogy project.
- **Regent-to-sovereign edges**: Multiple regencies documented in notes but not encoded
- **Political alliance edges**: Thakurufaanu brothers' alliance, Portuguese-era political relationships

### 4.6 Contradiction Research Backlog

Known historical disputes that should be investigated and logged:

1. **Koimala origin**: Sinhala prince from Ceylon vs. indigenous origin — competing traditions
2. **Dhovemi conversion**: Moroccan saint narrative vs. other Islamization accounts
3. **Khadijah's (P20) family**: competing accounts of her parents and husbands
4. **Portuguese period rulers**: overlap between Dom Manoel (P61) identity and other Hilaaly figures
5. **Thakurufaanu lineage**: competing accounts of P104's ancestry (MRF vs Wikipedia vs oral tradition)
6. **Late Huraagey bridges**: the P86/P87/P88 → P95 corridor (already partially logged)
7. **Modern dynasty Didi lineage**: competing accounts of Amin Didi's (P110) royal connection

---

## Track 5: Implementation Priorities

### 5.1 Quick Wins (1-2 days each)

1. **Create CONCEPT-009 through CONCEPT-014** — planned, templates exist, just need writing
2. **Register 3 immediate sources** (Bell 1940, Heritage Survey, Ibn Battuta) — see Track 2.7
3. **Add known_as enrichments for top 10 priority persons** — data exists in dossiers, just needs encoding in profile.enrichments.js
4. **Backfill birth/death dates for Huraagey P82-P94** — available in secondary sources, currently missing despite documented reigns
5. **Add the 12 missing people** identified by person audit — mentioned in existing data, need node creation
6. **Register Maniku's Etymological Vocabulary** — single reference that could resolve 10+ E4-grade regnal tokens

### 5.2 Medium-Term Systematic Passes (1-2 weeks each)

1. **Lunar dynasty deep pass (P1-P29)**: source_refs, aliases, titles for all 30 persons — requires Tarikh extraction
2. **Hilaaly dynasty deep pass (P30-P67)**: same enrichment sweep — requires MRF deep extraction + corroboration
3. **Spouse edge reconstruction**: systematic pass adding spouse edges from known marriages across all dynasties
4. **Handcrafted biographies**: write the top 10 biographical narratives identified in Track 1
5. **Regnal epithet etymology research**: engage Sanskrit/Pali linguistic analysis for the 15 token bank entries
6. **Office catalog expansion**: add 10+ missing offices with period-specific definitions

### 5.3 Deep Research Requiring Language Expertise

| Language | Key Tasks | Expertise Needed |
|----------|-----------|-----------------|
| **Arabic** | Tarikh chapter-level extraction, Ibn Battuta genealogical claims | Arabic paleography / Islamic history |
| **Dhivehi** | Raadhavalhi manuscript, Bodu Thakurufaanu tradition, National Archives survey | Dhivehi reading fluency, Thaana script |
| **Sanskrit/Pali** | Regnal epithet etymology, pre-Islamic continuities, Mahavamsa references | Indo-Aryan philology |
| **Portuguese** | Goa archives, Ceylon colonial records, Estado da India | Portuguese paleography, colonial history |
| **Sinhalese** | Mahavamsa/Culavamsa Maldivian references, Buddhist-era connections | Sinhalese, Pali |
| **Tamil/Malayalam** | Mappila records, South Indian trade connections | Dravidian languages, Kerala history |

### 5.4 Handcrafted Writing Priorities (by value added)

1. Biographical narratives for P61, P20, P104 (highest narrative impact)
2. Concept dossiers CONCEPT-009 through CONCEPT-029 (21 new concepts)
3. Dynasty transition narratives (Lunar→Hilaaly→Utheemu→Dhiyamigili→Huraagey→Modern)
4. Etymology analysis for top 8 regnal tokens (Keerithi, Maha, Radun, Bavana, Loka, Veeru, Kula, Abarana)
5. Handcrafted inference dossiers for 8 dynasty-bridge edges
6. Contradiction log entries for 7 known historical disputes

---

## Appendix: Source Language Distribution (Current vs Desired)

### Current (72 sources)
- English: ~68 (94.4%)
- Arabic: 2 (2.8%) — TUFS Tarikh only
- Dhivehi: 2 (2.8%) — Loamaafaanu, Raadhavalhi via Saruna
- Portuguese: 0
- Sinhalese: 0
- Tamil/Malayalam: 0

### Target (expanded)
- English: ~75 (maintained + Bell expansion)
- Arabic: 8-12 (Tarikh deep, Ibn Battuta, other chronicles, inscriptions)
- Dhivehi: 8-12 (Raadhavalhi full, Bodu Thakurufaanu, National Archives, newspapers, modern scholarship)
- Portuguese: 3-5 (Goa archives, Ceylon records, Estado da India)
- Sinhalese/Pali: 2-4 (Mahavamsa, colonial records)
- Tamil/Malayalam: 2-3 (trade records, Mappila sources)
- French: 1-2 (Pyrard deep extraction already started)
- Dutch: 1-2 (VOC records)

**Total target: ~100-120 sources across 8 languages**

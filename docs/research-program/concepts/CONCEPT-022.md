# Concept Entry

Concept ID: `CONCEPT-022`
Last updated: `2026-02-09`
Category: `title/system`

## 1) Canonical label
- Primary label: The Rehendhi / Rani institution
- Alternate labels/spellings: Sultana; Queen-regnant; Queen-consort; *Rehendhi* (ރެހެންދި); *Rani* (queen in Indic languages); *Maha Rehendhi*; female sovereign titles.
- Language/script forms: Dhivehi *Rehendhi* (queen/female sovereign); *Maha Rehendhi* (great queen); Arabic *Sultana*; Indic *Rani*; English "Queen".

## 2) Definition
- Short definition: The institutional framework for female royal status in the Maldives, encompassing both queen-regnant (ruling in her own right) and queen-consort (wife of a ruling sultan) roles, with Khadijah (`P20`) as the paradigmatic case of female sovereign power.
- Historical scope and periodization:
  - **Pre-Islamic**: Evidence from Arabic and Persian sources suggests that women served as rulers of the Maldives in the pre-Islamic period, possibly connected to Indian Ocean matrilineal traditions.
  - **Sultana Khadijah (r. 1347-1380)**: The most prominent female ruler, holding the throne across three separate accessions. Her full style was *Al-Sultana Khadeejah Sri Raadha Abaarana Mahaa Rehendhi*. She deposed her brother, married and assassinated at least two husbands, and ruled effectively for approximately thirty years.
  - **Sultana Raadhaafathi (`P25`, r. 1379-1380)**: Half-sister of Khadijah, continued female sovereign tradition briefly.
  - **Sultana Dhaain (`P27`, r. 1385-1388)**: Daughter of `P26`, deposed by her husband, marking the end of female sovereign rule in the Lunar dynasty.
  - **Post-Lunar period**: No further female sovereigns are attested. The Hilaaly and later dynasties were exclusively male-ruled. The 1932 Constitution explicitly required the sovereign to be male.
  - **Modern significance**: The name "Rehendhi" was adopted in the early 2000s by a women's rights group, indicating the enduring cultural significance of female royal power.
- Why it matters in this genealogy graph: The Rehendhi/Rani distinction between queen-regnant and queen-consort is critical for correct graph modeling. A queen-regnant holds the sovereign node directly; a queen-consort is a spouse of a sovereign and should not be confused with a ruler.

## 3) Semantic and historical notes
- The term *Rehendhi* appears in the regnal style of Khadijah: *Maha Rehendhi* (Great Queen). This is the female equivalent of *Maha Radun* (Great King).
- The existence of female sovereigns in a Muslim polity is unusual and may reflect pre-Islamic matrilineal traditions that survived Islamization. Ibn Battuta, visiting during Khadijah's reign, expressed disapproval of a woman ruling a Muslim state.
- Queen-regnant (`P20`, `P25`, `P27`) must be distinguished from queen-consort in the data model. The `g:"F"` field combined with the `re` (reign) field indicates a queen-regnant.
- Khadijah's three accessions demonstrate that female sovereignty was not a one-off event but a sustained institution in the late Lunar period.
- The transition from female-sovereign-possible (Lunar) to exclusively male succession (Hilaaly onwards) represents a significant shift that may reflect increasing Islamization of succession norms (CONCEPT-016).
- Cross-reference with CONCEPT-017 (Marriage alliance patterns) for how Khadijah used marriage as a political tool, and CONCEPT-001 (Dynastic succession logic) for the broader succession framework.

## 4) Person and event links
- Linked people (`P...`):
  - `P20` (Khadijah, Sultana, three accessions, paradigmatic female sovereign)
  - `P21` (Mohamed el-Jameel, first husband of Khadijah, assassinated)
  - `P23` (Abdullah, second husband of Khadijah, assassinated)
  - `P25` (Raadhaafathi, Sultana, half-sister of Khadijah)
  - `P26` (Mohamed of Maakurathu, husband of Raadhaafathi)
  - `P27` (Dhaain, Sultana, daughter of `P26`, deposed by husband)
  - `P28` (Abdullah, husband of Dhaain who deposed her)
  - `P19` (Ahmed Shihabuddine, brother of Khadijah, deposed by her)
- Linked offices/institutions:
  - `OFF-SOVEREIGN` (held by all three female rulers)
- Linked transitions/events:
  - 1347: Khadijah deposes her brother, first female sovereign
  - 1363-1380: Khadijah's second and third accessions
  - 1379-1380: Raadhaafathi's brief reign
  - 1385-1388: Dhaain's reign and deposition by husband
  - Post-1388: End of female sovereignty in the Maldives

## 5) Evidence
- Chronicle sources (Tarikh, Raadhavalhi) record the three female sovereigns with regnal details.
- Ibn Battuta's Rihla provides a contemporary account of Khadijah's reign (he visited c. 1343-1345 and served as qadi).
- The Maldives Royal Family website provides genealogical data for the Lunar dynasty including female sovereigns.
- The *Rehendhi* title in regnal styles is directly attested in king-list sources.

## 6) Source list
- `SRC-TUFS-TARIKH-DIBA-MAHALL-FACSIMILE`: Tarikh Islam Diba Mahall (facsimile edition) [A]
- `SRC-SARUNA-RAADHAVALHI-1985`: Dhivehi Thaareekhaai Raadhavalhi (1985) [B]
- `SRC-MRF-KINGS`: Maldives Kings List [B]
- `SRC-WIKI-MONARCHS`: List of Maldivian monarchs [B]
- `SRC-SSRN-SUOOD-LEGAL`: Ancient and Islamic Foundations of the Law of the Maldives [A]

## 7) Open questions
- Were there female sovereigns or regents in the pre-Islamic period that are not recorded in surviving sources?
- How did Islamic ulama in the Maldives justify female sovereignty? Were there fatwas or legal opinions on this question?
- Did the *Rehendhi* title carry specific legal powers, or was it purely honorific when used for queen-consorts?
- Why did female sovereignty end after the Lunar dynasty? Was this due to Islamization, political consolidation, or other factors?
- Should the graph model distinguish between queen-regnant and queen-consort using a separate field or edge type?

# Arabic & Islamic Source Findings

Date: 2026-02-09
Researcher: arabic-researcher agent
Status: Phase 1 complete

---

## 1. Ibn Battuta Rihla -- Maldives Findings

### 1.1 Historical Context of the Visit

Ibn Battuta (Abu Abdallah Muhammad ibn Battuta, 1304-1368/69) visited the Maldives in approximately 1343-1344 CE, arriving from India after a failed mission to China on behalf of the Delhi Sultan. His account, recorded in the *Rihla* (full title: *Tuhfat al-Nuzzar fi Ghara'ib al-Amsar wa 'Aja'ib al-Asfar*), was dictated to the scholar Ibn Juzayy in Fez. The Maldives chapters appear in Chapter XVII of Volume IV in the Gibb/Beckingham Hakluyt Society translation (1994).

Ibn Battuta spent approximately 18 months (some sources say 9 months) in the Maldives. He arrived at Kannalus island first, then traveled to the capital on Mahal (Male). He served as **chief qadi (judge)** during his residence, the most important judicial office on the islands.

**Key translations:**
- H.A.R. Gibb (vols. I-III, Hakluyt Society, 1958-1971)
- C.F. Beckingham (vol. IV, Hakluyt Society, 1994) -- contains the Maldives chapters
- Tim Mackintosh-Smith, *The Travels of Ibn Battutah* (abridged edition, Picador, 2002)
- Defremery & Sanguinetti, Arabic text edition (1853-1858)

**Source grade: A** -- Contemporary eyewitness account (primary source, 14th century)

### 1.2 Persons Named (with project person ID mapping where possible)

| Person Named by Ibn Battuta | Arabic Form | Role | Project ID | Confidence |
|---|---|---|---|---|
| Khadijah | خديجة | Sultana, ruling queen | **P20** | A |
| Sultan Ahmad Shihab al-Din | أحمد شهاب الدين | Sultan, brother of Khadijah, deposed by her | **P19** | A |
| Sultan Omar (Omar Veeru) | عمر | Father of Khadijah and Ahmad | **P18** | A |
| Wazir Jamal al-Din | جمال الدين | First husband/vizier of Khadijah | **P21** (Mohamed el-Jameel) | B |
| Wazir Abdallah ibn Muhammad al-Hadhrami | عبد الله بن محمد الحضرمي | Second husband/vizier of Khadijah | **P23** (Abdullah) | B |
| Sultan Salahuddin Salih al-Bangali | صلاح الدين صالح البنغالي | Grandfather of Khadijah, described as Bengali dynasty founder | Unmodeled (grandfather of P18?) | C |
| Abu al-Barakat Yusuf al-Barbari | أبو البركات يوسف البربري | Credited by Ibn Battuta with converting the Maldives to Islam | Unmodeled | A |
| Ibn Battuta himself | أبو عبد الله محمد ابن بطوطة | Visiting judge (qadi), married into royal family | Unmodeled | A |

**Important genealogical claim from Ibn Battuta:** He states that Khadijah's grandfather was "Sultan Salahuddin Salih al-Bangali," described as the founder of the dynasty. This Bengali connection is **unique to Ibn Battuta's account** and is not confirmed by other sources (the Tarikh tradition gives different ancestry). This may refer to a maternal grandfather or an in-law.

### 1.3 Offices and Titles Described

Ibn Battuta provides the most detailed medieval description of the Maldivian court structure:

| Office/Title | Arabic | Description per Ibn Battuta | Dhivehi Equivalent |
|---|---|---|---|
| Sultan/Sultana | سلطان / سلطانة | Supreme ruler; orders issued in sultana's name only | Ras(gefaanu) |
| Wazir | وزير | Chief minister; held real executive power; could marry into royal family | Waziru / later merged with PM |
| Qadi | قاضي | Chief judge; enforced sharia; highly respected | Fandiyaaru |
| Naib | نائب | Deputy/viceroy | Naib |

**Key observation:** Ibn Battuta noted that the fandiyaaru/qadi "was the most highly esteemed and respected person among them, with orders like the decrees of the King himself, or even stronger." This confirms the Arabic-derived judicial office was already entrenched by 1343 CE.

**Court protocol:** Orders were issued in Khadijah's name and "written on palm leaves" (ola/cadjan). The wazir managed day-to-day affairs but formal sovereignty resided with the sultana.

### 1.4 Genealogical Claims Extracted

**Claim 1:** Khadijah (P20) is the daughter of Sultan Omar (P18).
- Source: Ibn Battuta, Rihla, Maldives chapters
- Grade: **A** (eyewitness contemporary)
- Status: Already modeled (edge P18->P20, parent, confirmed)

**Claim 2:** Ahmad Shihab al-Din (P19) is the son of Sultan Omar (P18) and brother of Khadijah (P20).
- Source: Ibn Battuta, Rihla
- Grade: **A**
- Status: Already modeled (edge P18->P19, parent; P19<->P20, siblings)

**Claim 3:** Khadijah deposed her brother Ahmad Shihab al-Din and seized the throne (1347).
- Source: Ibn Battuta, Rihla
- Grade: **A**
- Status: Matches existing data (P19 reign ends 1347, P20 first reign begins 1347)

**Claim 4:** Khadijah married Wazir Jamal al-Din (first husband), who helped her seize power.
- Source: Ibn Battuta, Rihla
- Grade: **A**
- Notes: "Jamal al-Din" maps to P21 "Mohamed el-Jameel" (Jameel/Jamal are the same Arabic root جميل/جمال). The "al-Misri" (Egyptian) epithet is sometimes attached. This marriage was political.
- Status: Already modeled (P20<->P21, spouse)

**Claim 5:** After Jamal al-Din's death, Khadijah married Wazir Abdallah ibn Muhammad al-Hadhrami (Abdullah of Hadhramaut).
- Source: Ibn Battuta, Rihla
- Grade: **A**
- Notes: Maps to P23 "Abdullah". The "al-Hadhrami" epithet indicates Yemeni (Hadhramaut) origin -- a key detail not currently in the project data.
- Status: Already modeled (P20<->P23, spouse)

**Claim 6:** Khadijah's grandfather was "Sultan Salahuddin Salih al-Bangali" (a Bengali).
- Source: Ibn Battuta, Rihla
- Grade: **C** (contested -- not confirmed by Tarikh or Raadhavalhi traditions; may be a confusion or may refer to a maternal ancestor)
- Notes: This is the most contested genealogical claim from the Rihla. The Maldivian chronicle tradition does not mention a Bengali founder. Some scholars suggest this was a misunderstanding by Ibn Battuta, or it may refer to a Bengal-connected wazir who married into the dynasty.
- Status: **Not modeled** -- candidate for new person node if deemed significant

**Claim 7:** Sovereignty passed from Khadijah's grandfather to her father (Omar), then to her brother (Ahmad), then to her.
- Source: Ibn Battuta, Rihla
- Grade: **B**
- Notes: Confirms linear succession grandfather->Omar->Ahmad->Khadijah

**Claim 8:** Khadijah had her brother Ahmad assassinated/deposed.
- Source: Multiple (Ibn Battuta + Tarikh tradition)
- Grade: **A**

**Claim 9:** Ibn Battuta married into the royal family of Omar I and had a son in the Maldives.
- Source: Ibn Battuta, Rihla
- Grade: **A** (eyewitness)
- Notes: He married a noblewoman "related to the queen" (Khadijah) and had a male child. He divorced all his Maldivian wives before departing. The son's fate is unknown. This is potentially a genealogical link but the child is not named.
- Status: **Not modeled**

**Claim 10:** Khadijah's half-sister Raadhafathi (P25) succeeded her after her final reign.
- Source: Multiple sources (not directly from Ibn Battuta but confirmed by Tarikh)
- Grade: **B**
- Status: Already modeled

### 1.5 Court and Governance Structure

From Ibn Battuta's account, the Maldivian court in the 1340s had:
- **Sultana** (supreme ruler; Khadijah ruled personally, not through a male proxy)
- **Wazir(s)** (chief ministers; multiple wazirs in the system; real executive power)
- **Qadi/Fandiyaaru** (chief judge; enforced Islamic law; the position Ibn Battuta held)
- **Nuwwab** (deputies/governors of island groups)
- Royal eunuchs and retinue
- Legal experts versed in Shafi'i fiqh

The governance was quasi-constitutional: the sultan/sultana was supreme but the wazir held significant power and could effectively control government. The qadi had extraordinary prestige.

### 1.6 Religious and Legal Institutions

- The Maldives followed the **Shafi'i** school of Islamic jurisprudence (madhhab), as confirmed by Ibn Battuta
- Ibn Battuta enforced strict application of sharia: mandatory Friday prayer attendance (public whipping for absence), amputation for theft, and required women to cover their upper bodies (previously uncustomary)
- These strict measures created conflict with the wazir and local populace, contributing to Ibn Battuta's departure
- The conversion narrative: Ibn Battuta credits **Abu al-Barakat Yusuf al-Barbari** (whom he calls "the Berber") with converting the Maldives. This conflicts with the Tarikh tradition which credits **Yusuf Shams al-Din al-Tabrizi** (a Persian from Tabriz). Both traditions agree the last Buddhist king, Dhovemi (P2), converted in 1153 CE and took the title Sultan Muhammad al-Adil.

---

## 2. Arabic Laqab Analysis

### 2.1 Complete Laqab Inventory (from sovereign data)

Extracted from `src/data/sovereigns.js` -- the following sovereigns carry Arabic laqab (honorific) components in their names:

| Sovereign # | Person ID | Name | Arabic Laqab Component | Arabic Script |
|---|---|---|---|---|
| 19 | P19 | Ahmed Shihabuddine | Shihab al-Din (شهاب الدين) | شهاب الدين |
| 68 | P68 | Mohamed Imaduddine | Imad al-Din (عماد الدين) | عماد الدين |
| 69 | P69 | Iskander Ibrahim | Iskandar (إسكندر) | إسكندر |
| 71 | P71 | Mohamed Mohyedine | Muhyi al-Din (محي الدين) | محيي الدين |
| 72 | P72 | Mohamed Shamsuddine | Shams al-Din (شمس الدين) | شمس الدين |
| 73 | P73 | Mohamed (Devadu) | -- | -- |
| 76 | P76 | Ibrahim Mudzhiruddine | Muzhir al-Din (مظهر الدين) | مظهر الدين |
| 77 | P77 | Mohamed Imaduddine | Imad al-Din (عماد الدين) | عماد الدين |
| 78 | P78 | Ibrahim Iskander | Iskandar (إسكندر) | إسكندر |
| 79 | P79 | Mohamed Imaduddine | Imad al-Din (عماد الدين) | عماد الدين |
| 80 | P80 | Hassan Izzuddine | Izz al-Din (عز الدين) | عز الدين |
| 81 | P81 | Mohamed Ghiyathuddine | Ghiyath al-Din (غياث الدين) | غياث الدين |
| 82 | P82 | Mohamed Shamsuddine | Shams al-Din (شمس الدين) | شمس الدين |
| 83 | P83 | Mohamed Muizzuddine | Muizz al-Din (معز الدين) | معز الدين |
| 84 | P84 | Hassan Nooredine | Nur al-Din (نور الدين) | نور الدين |
| 85 | P85 | Mohamed Mueenuddine | Muin al-Din (معين الدين) | معين الدين |
| 86 | P86 | Mohamed Imaduddine | Imad al-Din (عماد الدين) | عماد الدين |
| 87 | P87 | Ibrahim Nooredine | Nur al-Din (نور الدين) | نور الدين |
| 88 | P88 | Mohamed Mueenuddine | Muin al-Din (معين الدين) | معين الدين |
| 90 | P90 | Mohamed Imaduddine V | Imad al-Din (عماد الدين) | عماد الدين |
| 91 | P91 | Mohamed Shamsuddine III | Shams al-Din (شمس الدين) | شمس الدين |
| 92 | P92 | Mohamed Imaduddine VI | Imad al-Din (عماد الدين) | عماد الدين |
| 94 | P94 | Hassan Nooredine II | Nur al-Din (نور الدين) | نور الدين |

**Non-laqab Arabic names in early period:** P19 (Ahmed/Ahmad), P42 (Sayyid Mohamed), P56 (Sharif Ahmed) carry Arabic personal names or titles (Sayyid, Sharif) without the compound laqab structure.

### 2.2 Meaning and Etymology of Each Laqab

| Laqab (Dhivehi form) | Arabic | Meaning | Root |
|---|---|---|---|
| Imaduddine | عماد الدين (Imad al-Din) | "Pillar of the Faith/Religion" | ع-م-د (to support) |
| Shamsuddine | شمس الدين (Shams al-Din) | "Sun of the Faith/Religion" | ش-م-س (sun) |
| Nooredine | نور الدين (Nur al-Din) | "Light of the Faith/Religion" | ن-و-ر (light) |
| Shihabuddine | شهاب الدين (Shihab al-Din) | "Shooting Star of the Faith" or "Flame of the Faith" | ش-ه-ب (meteor/flame) |
| Ghiyathuddine | غياث الدين (Ghiyath al-Din) | "Succor/Aid of the Faith" | غ-و-ث (to help) |
| Muizzuddine | معز الدين (Muizz al-Din) | "Fortifier/Glorifier of the Faith" | ع-ز-ز (to strengthen) |
| Mueenuddine | معين الدين (Muin al-Din) | "Helper/Supporter of the Faith" | ع-و-ن (to help) |
| Mohyedine | محيي الدين (Muhyi al-Din) | "Reviver of the Faith" | ح-ي-ي (to live/revive) |
| Izzuddine | عز الدين (Izz al-Din) | "Glory/Might of the Faith" | ع-ز-ز (to be mighty) |
| Mudzhiruddine | مظهر الدين (Muzhir al-Din) | "Manifester of the Faith" | ظ-ه-ر (to manifest) |
| Iskandar | إسكندر (Iskandar) | "Alexander" (Hellenistic kingly name) | Greek Alexandros |

All laqab follow the pattern: **[Descriptor] + al-Din** ("of the religion/faith").

The second element **al-Din** (الدين) is invariably "the religion/faith," making these laqab declarations of the bearer's service to Islam. This is the **al-Din** class of laqab, as opposed to the **al-Dawla** (state) class used in some other Islamic polities.

### 2.3 Pattern Analysis (accession vs inheritance, father-son sequences)

**Frequency distribution (from project data, post-Utheemu dynasty onwards):**
- Imad al-Din: 5 uses (P68, P77, P79, P86, P90, P92) -- the MOST common laqab
- Shams al-Din: 3 uses (P72, P82, P91)
- Nur al-Din: 3 uses (P84, P87, P94)
- Muin al-Din: 2 uses (P85, P88)
- Muizz al-Din: 1 use (P83)
- Ghiyath al-Din: 1 use (P81)
- Izz al-Din: 1 use (P80)
- Muhyi al-Din: 1 use (P71)
- Muzhir al-Din: 1 use (P76)
- Shihab al-Din: 1 use (P19, earlier Lunar period)
- Iskandar: 2 uses (P69, P78) -- not a laqab but a throne epithet

**Father-son laqab patterns:**
- P84 Nur al-Din (father) -> P85 Muin al-Din (son): DIFFERENT laqab
- P85 Muin al-Din -> P86 Imad al-Din (son): DIFFERENT
- P86 Imad al-Din -> P87 Nur al-Din (son): DIFFERENT
- P87 Nur al-Din -> P90 Imad al-Din V (son): DIFFERENT
- P87 Nur al-Din -> P91 Shams al-Din III (son): DIFFERENT
- P88 Muin al-Din -> P94 Nur al-Din II (son): DIFFERENT

**Conclusion:** Laqab were **chosen at accession**, not inherited. No father-son pair shares the same laqab in the project data. This confirms that laqab were personal honorifics bestowed upon the new sultan, likely by the chief qadi or ulama at the coronation ceremony.

**Alternation pattern in Huraagey dynasty:**
The late Huraagey period shows a loose **Imad al-Din / Nur al-Din / Muin al-Din / Shams al-Din** rotation, though not strictly systematic. The repeated use of "Imad al-Din" (5 times) suggests it was the most prestigious laqab, perhaps the "default" for a first-born legitimate successor.

### 2.4 Comparison with Broader Islamic World

The Maldivian laqab system closely mirrors the broader Islamic practice:

- **Ayyubids (1171-1260):** Salah al-Din (Saladin), al-Adil, al-Kamil -- used al-Din and al-Dawla forms
- **Delhi Sultanate (1206-1526):** Shams al-Din Iltutmish, Ghiyath al-Din Balban, Muizz al-Din Muhammad -- nearly identical laqab to Maldivian usage
- **Mamluks (1250-1517):** Baybars, Qalawun -- used compound laqab
- **Bengal Sultanate (1352-1576):** Shams al-Din, Ghiyath al-Din -- direct parallels

The Maldivian preference for **al-Din** (religion) over **al-Dawla** (state) compounds suggests the **influence of South Asian Islamic courts** (particularly the Delhi Sultanate and Bengal Sultanate) rather than the Abbasid/Mamluk tradition which used both forms extensively.

The use of **Iskandar** (Alexander) as a throne epithet (P69, P78) also parallels Malay and South Asian Islamic usage, where the Alexander legend (*Iskandarnamah*) was a potent model of ideal kingship.

### 2.5 Period of Adoption in Maldives

- **Earliest attested Arabic laqab:** P19 Ahmed Shihabuddine (r. 1341-1347) -- Lunar dynasty. However, the Dhivehi regnal names (Bavana, Loka, Abarana, etc.) were already in use for all earlier Lunar dynasty rulers.
- **Systematic adoption begins with:** P68 Mohamed Imaduddine (r. 1632-1648) -- Utheemu dynasty. From this point, EVERY sultan carries an Arabic laqab.
- **Transition period:** Between P19 (1341) and P68 (1632), there is a ~290-year gap where Hilaaly rulers used Dhivehi-style regnal names without Arabic laqab. The Arabic laqab system became standard only with the Utheemu dynasty.
- **Implication:** The Arabic laqab adoption correlates with the period of increased contacts with the Mughal Empire and Ottoman influence in the Indian Ocean (17th century), not with the initial Islamic conversion (1153 CE).

---

## 3. Other Arabic/Islamic Sources

### 3.1 Al-Masudi, *Muruj al-Dhahab* (10th century)

Al-Masudi (c. 896-956 CE) mentions the Maldive islands (Dibajat/Dhibat al-Mahal) in his encyclopedic work *Muruj al-Dhahab wa Ma'adin al-Jawahir* ("Meadows of Gold and Mines of Gems"). He describes:
- Numerous low-lying islands in the Indian Ocean near India
- Production of cowrie shells used as currency
- Coconut, ambergris, and marine product exports
- Skilled navigation of local peoples
- Hot, humid climate
- The islands as part of the broader Indian Ocean trade network

**Source grade: B** -- near-contemporary Arab geographer (10th century, pre-Islamic Maldives)
**Genealogical value:** Minimal -- no rulers named, no dynastic information
**Value for project:** Confirms the Arabic designation "Dibajat" and early trade connections

### 3.2 Al-Idrisi, *Nuzhat al-Mushtaq* (1154 CE)

Abu Abdallah Muhammad al-Idrisi (1100-1165) composed his world geography for King Roger II of Sicily. He refers to the Maldives as "Dibadjat" (also rendered "el-Roibahat"):
- Describes the islands as very close to one another and innumerable
- Populated islands growing coconut and sugar cane
- Trade conducted using cowrie shells
- Notes the islands' proximity to India

**Source grade: B** -- near-contemporary to the Islamic conversion (composed 1154, conversion 1153)
**Genealogical value:** Minimal -- no rulers named
**Unique contribution:** The *Nuzhat al-Mushtaq* was composed within one year of the Islamic conversion, making it potentially the earliest Arabic source describing a newly Islamic Maldives.

### 3.3 Abu Zayd al-Hasan al-Sirafi (9th century)

This Iraqi merchant-writer refers to the Maldives as "Diva Kauza" (Islands of Shells), reflecting the cowrie-based economy. He is one of the earliest Arabic writers to describe the archipelago.

**Source grade: C** -- early reference, limited detail
**Genealogical value:** None

### 3.4 Sulaiman al-Tajir (9th century)

Early Arab merchant whose account, preserved by Abu Zayd al-Sirafi, includes references to the Maldive islands and their place in Indian Ocean trade routes.

**Source grade: C**
**Genealogical value:** None

### 3.5 Cairo Geniza Documents (12th century)

A remarkable find: a letter from the Cairo Geniza dated **1141 CE** (twelve years before the Islamic conversion) references Maldivian cowrie shells. Written by merchant Nahray ibn Allan in Aydhab (Red Sea port) to his son in Alexandria, it mentions "two bales of cowrie shells" among goods forwarded to Fustat (Old Cairo).

Key Arabic terminology from the Geniza:
- Cowries called **wadi'/wada'** (ودع/وديع) -- consistent with later usage by al-Idrisi and Ibn Battuta
- The Maldives referred to as **al-Dbihat/al-Dbijat** (الدبيحات/الدبيجات)

**Source grade: A** -- primary document, precisely dated
**Genealogical value:** None directly, but confirms the Maldives' integration into the Arabic-speaking commercial world *before* the 1153 Islamic conversion.
**Significance for project:** Evidence that the Arabic-speaking world was already engaged with the Maldives commercially by the 12th century. This undermines the "sudden conversion by a visitor" narrative and suggests gradual Islamic influence through trade.

### 3.6 Hukuru Miskiy (Male Friday Mosque) Inscriptions

The Male Friday Mosque (Hukuru Miskiy), completed 1658 CE, contains extensive Arabic calligraphy:
- Quranic verses carved into coral stone walls
- The calligrapher was identified as **Chief Justice Al Faqh Al Qazi Jamaaludheen** -- confirming the importance of the qadi office
- The surrounding cemetery contains coral stone tombstones of past sultans, princes, and dignitaries
- These tombstones provide datable Arabic inscriptions with names and titles
- Added to UNESCO tentative World Heritage list in 2008

**Source grade: A** -- primary epigraphic evidence
**Genealogical value:** HIGH -- tombstone inscriptions could provide dates and names for sultans
**Extraction status:** Not yet systematically extracted for this project

### 3.7 Loamaafanu (Copper Plate Grants)

While primarily in Dhivehi script (Eveyla Akuru and Dhives Akuru), the Loamaafanu copper plates contain:
- Names and lineage of the sultan who built/endowed the mosque
- Names of witnesses to the grant
- Dates and location information

**Key examples:**
- Isdhoo Loamaafaanu (1195 CE) -- during reign of Shrimath Gadanaadeetiya (Dinei Kalaminja, r. 1192-1198), this is sovereign #5 (P5)
- Dhan'bidhoo Loamaafaanu (1196 CE) -- same period

**Source grade: A** -- primary inscriptional evidence
**Already registered:** SRC-SARUNA-LOAMAAFANU-1982, SRC-SARUNA-LOAMAAFANU-2003
**Genealogical value:** Significant for early Lunar dynasty confirmation

---

## 4. Tarikh al-Islam Diba Mahall

### 4.1 Known Chapter Structure

The Tarikh (full title: *Ta'rikh al-Islam Dhibat/Diba Mahall*) is the most important Arabic-language chronicle of the Maldives. Key facts:

- **Primary author:** Qadi Hasan Taj al-Din (d. 1139 AH / 1727 CE)
- **First continuation:** Muhammad Muhibb al-Din (1118/1706 - 1199/1785), nephew of Hasan
- **Second continuation:** Ibrahim Siraj al-Din (d. after 1243 AH / 1827 CE), grandson of Muhibb al-Din
- **Language:** Arabic
- **Coverage:** From the Islamic conversion (548 AH / 1153 CE) through approximately 1822 CE
- **Sultans covered:** Approximately 35 dynastic rulers across the full text

**Structure (from Peacock 2020 and TUFS edition):**
1. Preamble situating the Maldives within universal Islamic history (from the Rashidun Caliphs)
2. Conversion narrative (the Abu al-Barakat / Yusuf Shams al-Din al-Tabrizi account)
3. Annalistic coverage of each sultan's reign: regnal years, major events, invasions, successions
4. Ethical/pious commentary on rulers' behavior
5. The continuations by Muhibb al-Din and Siraj al-Din cover the 18th-19th centuries

**Important:** The Tarikh tradition credits the conversion of the Maldives to **Yusuf Shams al-Din al-Tabrizi** (a Persian from Tabriz), contradicting Ibn Battuta's attribution to Abu al-Barakat "the Berber" from the Maghreb. This is a major historiographical debate.

### 4.2 Genealogical Sections Identified

The Tarikh contains:
- Sultan succession lists with patronymic chains
- Regnal years for each sovereign
- Major political events (depositions, assassinations, invasions)
- Names of wazirs and other officials
- Family relationships between rulers

The text draws from earlier Loamaafanu (copper plates) and oral court records.

### 4.3 Scholarly Analyses

**Key scholarly work:**
- A.C.S. Peacock, "History, piety and factional politics in the Arabic chronicle of the Maldives: Hasan Taj al-Din's Ta'rikh and its continuations," *Asiatische Studien* 74(1): 195-220 (2020). [DOI: 10.1515/asia-2020-0015]
  - Published by De Gruyter/Brill
  - Available at University of St Andrews research repository
  - Analyzes the political biases of the authors
  - Notes that the authors were deeply involved in Maldivian factional politics
  - The chronicle is described as "a major but unexploited source"

- Hikoichi Yajima (editor), TUFS editions:
  - Volume 1: Arabic text facsimile (1982) -- registered as SRC-TUFS-TARIKH-DIBA-MAHALL-FACSIMILE
  - Volume 2: Annotations and indices (1984) -- registered as SRC-TUFS-TARIKH-DIBA-MAHALL-ANNOT

### 4.4 Relationship to Raadhavalhi

The Tarikh and the Raadhavalhi are the two main native historical traditions:
- **Tarikh:** Arabic-language, written by court scholars (qadi class), Islamic historiographic framework
- **Raadhavalhi:** Dhivehi-language, royal chronicle tradition
- Both share common source material (oral traditions, Loamaafanu) but differ in emphasis and framing
- The Tarikh situates the Maldives within universal Islamic history; the Raadhavalhi is more locally focused
- Both agree on the conversion date (1153 CE) but disagree on who converted the king (Tabrizi vs. Berber)

---

## 5. Recommended Source Registrations

### 5.1 Ibn Battuta Rihla (Gibb/Beckingham translation)

```
id: SRC-HAKLUYT-IBN-BATTUTA-V4
url: https://archive.org/stream/travels-of-ibn-battuta/The%20Travels%20of%20Ibn%20Battuta-1325%E2%80%931354-Volume-IV_djvu.txt
title: The Travels of Ibn Battuta, A.D. 1325-1354, Vol. IV (Gibb/Beckingham, Hakluyt Society)
publisher: Hakluyt Society
access_date: 2026-02-09
quality: A
notes: Chapter XVII contains the Maldives account. Primary eyewitness source for 1340s Maldives. Archive.org text version.
```

### 5.2 Berkeley ORIAS Ibn Battuta Maldives Summary

```
id: SRC-ORIAS-IBN-BATTUTA-MALDIVES
url: https://orias.berkeley.edu/resources-teachers/travels-ibn-battuta/journey/escape-delhi-maldive-islands-and-sri-lanka-1341-1344
title: Escape from Delhi to the Maldive Islands and Sri Lanka: 1341-1344
publisher: UC Berkeley ORIAS
access_date: 2026-02-09
quality: B
notes: Educational summary of Ibn Battuta's Maldives visit with key events and persons.
```

### 5.3 Peacock 2020 Article

```
id: SRC-PEACOCK-TARIKH-2020
url: https://www.degruyterbrill.com/document/doi/10.1515/asia-2020-0015/html
title: History, piety and factional politics in the Arabic chronicle of the Maldives
publisher: Asiatische Studien / De Gruyter Brill
access_date: 2026-02-09
quality: A
notes: Peer-reviewed analysis of Tarikh textual tradition, authorial biases, and political context. By A.C.S. Peacock, University of St Andrews.
```

**Note:** SRC-STANDREWS-PEACOCK-2020 is already registered in sources.js pointing to the St Andrews repository version.

### 5.4 Cairo Geniza Cowrie Shell Letter

```
id: SRC-GENIZA-COWRIE-1141
url: https://www.lib.cam.ac.uk/collections/departments/taylor-schechter-genizah-research-unit/fragment-month/fotm-2023/fragment-3
title: Cairo Geniza fragment: Cowrie shell trade letter (1141 CE)
publisher: Cambridge University Library / Taylor-Schechter Genizah Research Unit
access_date: 2026-02-09
quality: A
notes: Primary merchant letter from 1141 CE mentioning Maldivian cowrie shells. Pre-conversion evidence of Arabic-world trade connection.
```

### 5.5 UNESCO Coral Stone Mosques

```
id: SRC-UNESCO-CORAL-MOSQUES
url: https://whc.unesco.org/en/tentativelists/5812/
title: Coral Stone Mosques of Maldives (UNESCO Tentative List)
publisher: UNESCO World Heritage Centre
access_date: 2026-02-09
quality: B
notes: Documents the coral stone mosque tradition including Hukuru Miskiy Arabic inscriptions and tombstones.
```

### 5.6 Al Suood: Political System of the Ancient Kingdom

```
id: SRC-SUOOD-POLITICAL-SYSTEM
url: https://justicesuood.com/public/uploads/1611685910668Political_System_of_the_Ancient_Kingdom.pdf
title: Political System of the Ancient Kingdom of Maldives
publisher: A. Husnu Al Suood (author website)
access_date: 2026-02-09
quality: B
notes: Companion to the SSRN legal study. Covers court hierarchy, wazir office, and governance structure.
```

### 5.7 Max van Berchem Foundation Archaeological Project

```
id: SRC-BERCHEM-CORAL-ARCHAEOLOGY
url: https://maxvanberchem.org/en/scientific-activities/projects/archeology/11-archeologie/171-archaeological-investigations-on-the-coral-stone-mosques-of-the-maldives
title: Archaeological Investigations on the Coral Stone Mosques of the Maldives
publisher: Fondation Max van Berchem
access_date: 2026-02-09
quality: B
notes: Archaeological project documenting Arabic inscriptions and architectural evidence in Maldivian mosques.
```

---

## 6. Genealogical Claims for Data Integration

### Priority 1: Confirmed/Strengthened Claims (already modeled, now with Arabic source backing)

| # | Claim | Source | Persons | Type | Grade |
|---|---|---|---|---|---|
| G1 | Khadijah is daughter of Omar | Ibn Battuta Rihla | P18->P20 | parent | A |
| G2 | Ahmad Shihab al-Din is son of Omar | Ibn Battuta Rihla | P18->P19 | parent | A |
| G3 | Khadijah and Ahmad are siblings | Ibn Battuta Rihla | P19<->P20 | sibling | A |
| G4 | Khadijah married Wazir Jamal al-Din (= P21 el-Jameel) | Ibn Battuta Rihla | P20<->P21 | spouse | A |
| G5 | Khadijah married Wazir Abdallah al-Hadhrami (= P23) | Ibn Battuta Rihla | P20<->P23 | spouse | A |
| G6 | Khadijah deposed Ahmad in 1347 | Ibn Battuta Rihla | P19, P20 | succession | A |

### Priority 2: New Claims for Evaluation

| # | Claim | Source | Persons | Type | Grade | Notes |
|---|---|---|---|---|---|---|
| G7 | Khadijah's grandfather was "Sultan Salahuddin Salih al-Bangali" | Ibn Battuta Rihla | P18 (Omar's father), unmodeled | parent (of P18) | C | Contested -- not in Tarikh tradition. May be a misunderstanding. |
| G8 | P23 Abdullah was specifically "ibn Muhammad al-Hadhrami" (from Hadhramaut, Yemen) | Ibn Battuta Rihla | P23 | identity detail | B | Adds geographic origin to P23's profile |
| G9 | P21 "el-Jameel" was also known as "Jamal al-Din" (possibly "al-Misri" -- Egyptian) | Ibn Battuta Rihla | P21 | identity detail | B | Arabic form of the name confirms the connection |
| G10 | Abu al-Barakat Yusuf al-Barbari converted Maldives (1153) | Ibn Battuta Rihla | unmodeled | historical event | B | Contested by Tarikh (Tabrizi claim) |
| G11 | Ibn Battuta had a son in the Maldives (unnamed, fate unknown) | Ibn Battuta Rihla | unmodeled | genealogical | A | Not significant enough to model unless more info emerges |
| G12 | The fandiyaaru/qadi office was already prominent by 1343 | Ibn Battuta Rihla | n/a | institutional | A | Confirms Arabic judicial office integration |
| G13 | Shafi'i madhhab was established in Maldives by 1343 | Ibn Battuta Rihla | n/a | institutional | A | Important for understanding legal framework |

### Priority 3: Enrichment Data for Existing Persons

**P19 (Ahmed Shihabuddine):**
- Arabic name form: Ahmad Shihab al-Din (أحمد شهاب الدين)
- Add to `aliases`: "Ahmad Shihab al-Din"
- Note: Ibn Battuta was present during or shortly after his reign

**P20 (Khadijah):**
- Full Arabic title from Ibn Battuta: "Sultana" (سلطانة)
- He noted: "One of the wonders of these islands is that its ruler is a woman named Khadija"
- Orders written on palm leaves in her name only
- Add to `aliases`: "Al-Sultana Khadijah"
- Full Dhivehi style: "Al-Sultana Khadeejah Sri Raadha Abaarana Mahaa Rehendhi"

**P21 (Mohamed el-Jameel):**
- Arabic name form: Wazir Jamal al-Din (وزير جمال الدين)
- Possibly "al-Misri" (Egyptian)
- Add to `aliases`: "Wazir Jamal al-Din", "Jamal al-Din al-Misri"

**P23 (Abdullah):**
- Arabic name form: Abdallah ibn Muhammad al-Hadhrami (عبد الله بن محمد الحضرمي)
- Origin: Hadhramaut, Yemen
- Add to `aliases`: "Abdallah ibn Muhammad al-Hadhrami"
- Add to `pb`: "Hadhramaut (Yemen)" if applicable

**P2 (Dhovemi):**
- Post-conversion title: Sultan Muhammad al-Adil (سلطان محمد العادل)
- "al-Adil" means "The Just" -- this is the earliest Arabic title in Maldivian sovereignty
- Add to `aliases`: "Sultan Muhammad al-Adil"

---

## 7. Conversion Narrative: Arabic Source Comparison

The conversion of the Maldives to Islam (1153 CE) is narrated differently by the two main source traditions:

| Element | Ibn Battuta (Rihla) | Tarikh / Raadhavalhi |
|---|---|---|
| Converter | Abu al-Barakat Yusuf al-Barbari | Yusuf Shams al-Din al-Tabrizi |
| Origin | Berber/Moroccan (Maghrebi) | Persian (from Tabriz) |
| Method | Recited Quran to banish sea demon Rannamaari | Performed miracles to banish Rannamaari |
| King converted | Last Buddhist king (Dhovemi, P2) | Same (Dhovemi, P2) |
| Title adopted | Sultan Muhammad al-Adil | Sultan Muhammad al-Adil |
| Date | 1153 CE / 548 AH | 1153 CE / 548 AH |

**Scholarly status:** The debate remains unresolved. Some scholars (following the Tarikh) favor the Tabrizi origin. Others follow Ibn Battuta. A third tradition suggests a Somali origin. The Maldivian government officially favors the Tabrizi narrative (following the Tarikh).

---

## 8. Arabic Names for the Maldives in Historical Sources

| Arabic Form | Transliteration | Source | Period |
|---|---|---|---|
| ذيبة المهل / دبيجات | Dhibat al-Mahal / Dibajat | Al-Masudi, Al-Idrisi, Abu Zayd | 10th-12th c. |
| الدبيحات / الدبيجات | al-Dbihat / al-Dbijat | Cairo Geniza | 12th c. |
| جزر المال | Juzur al-Mal (Islands of Wealth) | Various | Medieval |
| ديو كوزا | Diva Kauza (Islands of Shells) | Abu Zayd al-Sirafi | 9th c. |
| محل ديب | Mahal Dib | Ibn Battuta | 14th c. |

The name "Maldives" itself likely derives from Sanskrit *mala-dvipa* ("garland of islands") or from the Arabic compound Mahal-Diba.

---

## 9. Assessment and Gaps

### What Arabic sources confirm:
- The basic succession sequence P18 (Omar) -> P19 (Ahmad) -> P20 (Khadijah) is confirmed by the highest-grade eyewitness source
- The marriage alliances P20<->P21 and P20<->P23 are confirmed
- The Arabic laqab system became standard from the Utheemu dynasty (1632)
- The court structure (sultan, wazir, qadi) was firmly established by 1343

### Critical gaps remaining:
1. **Tarikh text extraction:** The Tarikh has never been systematically extracted for this project despite being the most comprehensive Arabic-language source for Maldivian genealogy. The TUFS facsimile edition needs page-by-page extraction.
2. **Tombstone inscriptions:** The Hukuru Miskiy cemetery tombstones could provide independently dated names and titles for sultans. No systematic extraction exists.
3. **Bell's Arabic epigraphy notes:** H.C.P. Bell documented many Arabic inscriptions in the early 20th century. These need to be located and extracted.
4. **Cairo Geniza:** Only one letter mentioning the Maldives has been identified. A systematic search of Geniza databases could reveal more.
5. **Abu'l-Fida and Yaqut al-Hamawi:** These major Arabic geographers likely mention the Maldives but no extractions were found in this research phase.
6. **Arabic fatwa collections:** Islamic legal opinions related to Maldivian governance may exist in collections from al-Azhar, Mecca, or Hadhramaut but have not been searched.

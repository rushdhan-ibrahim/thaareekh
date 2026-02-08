# Concept Entry

Concept ID: `CONCEPT-014`
Last updated: `2026-02-09`
Category: `lexicon/system`

## 1) Canonical label
- Primary label: Regnal epithet token bank
- Alternate labels/spellings: Epithet-component lexicon; unresolved regnal-token layer; Dhivehi regnal name morpheme catalog.
- Language/script forms: Dhivehi regnal and honorific components represented through transliterated token fragments. Many tokens originate from Sanskrit/Pali (e.g., *Bavana*, *Loka*, *Suvara*, *Abarana*) with additional Arabic-Islamic layers (e.g., *Imaduddine*, *Shamsuddine*).

## 2) Definition
- Short definition: A controlled list of frequently recurring regnal-style token components that are attested across the sovereign list but not yet fully resolved semantically. These form the building blocks of royal names and epithets throughout the monarchical period.
- Historical scope and periodization:
  - **Pre-Islamic/early Buddhist layer**: Tokens like *Bavana* (dwelling/prosperity), *Loka* (world), *Suvara* (gold), *Abarana* (ornament), *Aadheeththa* (sun) derive from Indic languages and reflect the Buddhist-era naming system that persisted after Islamization.
  - **Lunar dynasty (1117-1388)**: Dense use of Indic-origin tokens in regnal names (e.g., *Bavanaadheeththa*, *Fennaadheeththa*, *Dhagathaa Abarana*).
  - **Hilaaly dynasty (1388-1583)**: Mixed Indic and emerging Arabic-layer tokens; transitional naming patterns.
  - **Utheemu onwards (1573+)**: Arabic laqab becomes increasingly standard alongside or replacing Indic tokens (e.g., *Imaduddine*, *Shamsuddine*, *Nooredine*). See CONCEPT-028 for detailed Arabic laqab analysis.
  - **Late monarchy (18th-19th century)**: Formulaic repetition of standard token sets (*Keerithi Maha Radun*, *Kula Sundhura*) across Huraagey rulers.
- Why it matters in this genealogy graph: Token overlap currently supports alias search and clustering, but should not be overused as semantic proof. Shared epithets do not indicate kinship.

## 3) Semantic and historical notes
- Keep unresolved components in tracked lexical state (`E4` in the etymology register) until direct philological evidence is extracted.
- Use token overlap for discovery and normalization only, not for kin promotion.
- Where a component has mixed office/sobriquet use, require period-specific citation before assigning meaning.
- Key token clusters and their approximate meanings:
  - *Bavana* group: prosperity/dwelling (Sanskrit *bhavana*)
  - *Loka* group: world/realm (Sanskrit *loka*)
  - *Suvara/Sundhura*: gold/beauty (Sanskrit *suvarna/sundara*)
  - *Abarana*: ornament (Sanskrit *abharana*)
  - *Keerithi*: glory/fame (Sanskrit *kirti*)
  - *Maha*: great (Sanskrit *maha*)
  - *Radun*: king (Dhivehi form, cf. Sanskrit *rajan*)
  - *Katthiri*: a common regnal component, etymology less certain
  - *Veeru*: hero/brave (Sanskrit *vira*)
- These token meanings remain provisional; the etymology-sobriquet register tracks resolution status.
- The transition from Indic to Arabic-layer naming is not sharp but gradual, with bilayer names appearing through the Hilaaly period.

## 4) Person and event links
- Linked people (`P...`):
  - `P1` (Koimala, regnal *Maanaabarana*)
  - `P2` (Dhovemi, regnal *Bavanaadheeththa*)
  - `P34` (Hassan, regnal *Keerithi Maha Radun*)
  - `P50` (Ibrahim, regnal *Bavana Furasuddha*)
  - `P52` (Yoosuf, regnal *Veeru Aanandha*)
  - `P59` (Hassan of Shiraz, regnal *Ram Mani Loka*)
  - `P66` (Joao, regnal *Keerithi Maha Radun*)
  - `P68` (Mohamed Imaduddine, regnal *Kula Sundhura Katthiri Bavana* -- transitional bilayer name)
  - `P75` (Hassan, regnal *Keerithi Maha Radun*)
  - `P80` (Hassan Izzuddine, regnal *Kula Ran Meeba Audha*)
  - `P83` (Mohamed Muizzuddine, regnal *Keerithi Maha Radun*)
  - `P92` (Mohamed Imaduddine VI, regnal *Keerithi Maha Radun*)
- Linked offices/institutions:
  - `OFF-SOVEREIGN` (regnal names are by definition sovereign-office attributes)
  - `OFF-KILEGE` (some Kilege-bearing names share token components)
  - `OFF-NAIB` (Naib-linked figures may carry regnal-style tokens in branch claims)
- Linked transitions/events:
  - Dynasty-level alias normalization passes
  - Inferred-edge alternative-interpretation reviews
  - Pre-Islamic to Islamic naming transition (gradual, not abrupt)

## 5) Evidence
- Existing token bank is anchored in attested regnal strings from node records in `src/data/sovereigns.js`.
- Chronicle/manuscript extraction is needed to assign stable lexical meanings.
- Etymology and sobriquet register (`docs/research-program/etymology-sobriquet-register.md`) remains the canonical place for confidence grading of token semantics.
- Sanskrit/Pali lexica provide comparative evidence for Indic-layer tokens.

## 6) Source list
- `SRC-TUFS-TARIKH-DIBA-MAHALL-FACSIMILE`: Tarikh Islam Diba Mahall (facsimile edition) [A]
- `SRC-TUFS-TARIKH-DIBA-MAHALL-ANNOT`: Tarikh Islam Diba Mahall, vol.2 (annotations and indices) [B]
- `SRC-SARUNA-RAADHAVALHI-1985`: Dhivehi Thaareekhaai Raadhavalhi (1985) [B]
- `SRC-MRF-KINGS`: Maldives Kings List [B]
- `SRC-WIKI-HEADS-STATE`: List of heads of state of the Maldives [C]
- `SRC-SARUNA-LOAMAAFANU-1982`: Loamaafaanu (Hassan Ahmed Maniku, 1982) [A]

## 7) Open questions
- Which high-frequency tokens should be prioritized first for direct lexicon evidence extraction?
- Should token-level uncertainty be surfaced in UI for node-name inspection and verification workflows?
- Which inferred edges are currently most exposed to false-positive interpretation from token similarity?
- Can the *Katthiri* component be resolved etymologically? It appears in several important regnal names but its meaning remains unclear.
- Is *Keerithi Maha Radun* a formulaic regnal name applied to multiple unrelated rulers, or does its repeated use indicate lineage continuity claims?

# Title and Style Register

Date: 2026-02-08
Status: active working register (Phase 3 deepening)

## 1) Purpose
This register standardizes title/style interpretation across the graph so title-bearing names are not misread as direct kin evidence.

Interpretation policy:
- Treat title/style tokens as identity context, not automatic genealogy proof.
- Separate office-bearing terms from social-style terms.
- Record period shifts explicitly.
- Require direct kin wording for promotion of inferred edges.

## 2) Register Entries

### 2.1 Sovereign styles
- Term(s): `Sultan`, `Queen`, `Sovereign`
- Class: sovereign office style
- Period use: monarchical periods (pre-1968)
- Example nodes: `P20`, `P31`, `P68`, `P80`, `P95`
- Evidence anchors: `SRC-WIKI-MONARCHS`, `SRC-WIKI-HEADS-STATE`
- Graph handling: crown-holder style; does not resolve sibling/parent uncertainty without explicit kin citation.

### 2.2 Republican executive style
- Term(s): `President`
- Class: republican executive office
- Period use: 1968-present
- Example nodes: `P110`, `P115`, `P122`, `P167`, `P173`
- Evidence anchors: `SRC-PO-AMIN`, `SRC-PO-NASIR`, `SRC-PO-NASHEED`, `SRC-PO-SOLIH`, `SRC-PO-MUIZZU`
- Graph handling: institutional office marker only; family inferences require separate claims.

### 2.3 Didi
- Term(s): `Didi`
- Class: elite style / lineage marker
- Period use: late monarchy through republic era
- Example nodes: `P110`, `P111`, `P115`, `P129`, `P190`
- Evidence anchors: `SRC-WIKI-AMIN-DIDI`, `SRC-WIKI-ABDUL-MAJEED`, `SRC-WIKI-IBRAHIM-NASIR`, `SRC-WIKI-MUHAMMAD-FAREED`
- Graph handling: keep style continuity distinct from blood-line proof; avoid promotion based on surname-style alone.

### 2.4 Thakurufaanu / Thakurufan
- Term(s): `Thakurufaanu`, `Thakurufan`
- Class: royal honorific/style
- Period use: pre-modern and early modern elite lines
- Example nodes: `P102`, `P103`, `P104`, `P130`, `P132`
- Evidence anchors: `SRC-MRF-UTHEEM`, `SRC-MRF-KINGS`, `SRC-WIKI-PRINCE-IBRAHIM-FAAMULADHEYRI`
- Graph handling: title-grade marker; relation assertions still require direct pairwise evidence.

### 2.5 Kilege / Kilegefaanu / Kilegefan
- Term(s): `Kilege`, `Kilegefaanu`, `Kilegefan`
- Class: high-status office/style complex
- Period use: monarchical elite administration and naming
- Example nodes: `P130`, `P156`, `P157`, `P158`
- Evidence anchors: `SRC-MRF-TITLES`, `SRC-SSRN-SUOOD-LEGAL`, `SRC-MRF-KINGS`
- Graph handling: model as title/style attribute; do not infer parentage from shared Kilege forms.

### 2.6 Naib / Al-Naib / El-Naib
- Term(s): `Naib`, `Al-Naib`, `El-Naib`
- Class: deputy/viceroy office style
- Period use: monarchical administration, including southern branch records
- Example nodes: `P132`, `P182`, `P191`
- Evidence anchors: `SRC-SSRN-SUOOD-LEGAL`, `SRC-MRF-TITLES`, `SRC-MRF-MIDU-ROYAL`
- Graph handling: office role improves contextual confidence, but kin claims remain evidence-gated.

### 2.7 Bandeyri / Bandaarain-family forms
- Term(s): `Bandeyri`, `Bandaarain`, `Bandaara`
- Class: court office + associated style family
- Period use: monarchical court portfolios; surviving sobriquet usage in later narratives
- Example nodes: `P80` known-as variants (`Dhon Bandaarain`, `Don Bandaara`), `P81` known-as (`Haajee Bandaarain`)
- Evidence anchors: `SRC-SSRN-SUOOD-LEGAL`, `SRC-MRF-TITLES`, `SRC-WIKI-HEADS-STATE`
- Graph handling: distinguish office term from sobriquet usage; avoid collapsing all Bandaarain forms as one lineage signal.

### 2.8 Fandiyaaru
- Term(s): `Fandiyaaru`
- Class: judicial office (chief judge/qadi context)
- Period use: pre-modern and monarchical judicial structures
- Example linkage: office catalog `OFF-FANDIYAARU`
- Evidence anchors: `SRC-SSRN-SUOOD-LEGAL`, office timeline in `src/data/offices.js`
- Graph handling: institutional significance only; no implied kin tie.

### 2.9 Furadaana
- Term(s): `Furadaana`, `Furadhaana`
- Class: ministerial-council institution
- Period use: documented in early-modern and nineteenth-century office descriptions
- Example linkage: office catalog `OFF-FURADHAANA`
- Evidence anchors: `SRC-SSRN-SUOOD-LEGAL`, `SRC-CORNELL-PYRARD-V1-1887`, `SRC-SARUNA-PYRARD-V2P2-1887`
- Graph handling: interpret as governance context, not genealogical evidence.

### 2.10 Handeygiri, Faamuladheyri, Maafaiy, Faashanaa
- Term(s): `Handeygiri`, `Faamuladheyri`, `Maafaiy`, `Faashanaa`
- Class: high offices in later monarchical administration descriptions
- Period use: especially in 19th-century and late-monarchy office reporting
- Example linkage: office IDs `OFF-HANDEYGIRI`, `OFF-FAAMULADHEYRI`, `OFF-MAAFAIY`, `OFF-FAASHANAA`
- Evidence anchors: `SRC-SSRN-SUOOD-LEGAL`, `SRC-MRF-TITLES`, `SRC-WIKI-CASTE-SYSTEM`
- Graph handling: office-role context for node interpretation; does not resolve kin edges directly.

### 2.11 Dom / Donna / Infanta
- Term(s): `Dom`, `Donna`, `Infanta`
- Class: Portuguese-Christian honorific layer
- Period use: contact and post-contact naming overlays
- Example nodes: `P61` (`Dom Manoel`), `P97` (`Dom Luis de Sousa`), `P101` (`Donna Francisca Vasconcellos`), `P194` (`Donna Maria Veloso`)
- Evidence anchors: `SRC-CORNELL-PYRARD-V1-1887`, `SRC-SARUNA-PYRARD-V2P2-1887`, `SRC-MRF-KINGS`
- Graph handling: alias/transliteration bridge tokens; identity matching requires chronology+kin evidence.

### 2.12 Prince / Princess / Al-Nabeel
- Term(s): `Prince`, `Princess`, `Al-Nabeel`
- Class: rank style
- Period use: late monarchy and modern elite line contexts
- Example nodes: `P111`, `P130`, `P140`, `P180`
- Evidence anchors: `SRC-WIKI-PRINCE-IBRAHIM-FAAMULADHEYRI`, `SRC-WIKI-IBRAHIM-NASIR`, `SRC-MRF-MIDU-ROYAL`
- Graph handling: style-level signal; do not convert to kin certainty without explicit relation wording.

## 3) Crosswalk Rules for Data Entry
- If a token denotes office function (for example `Naib`, `Fandiyaaru`), store in office/title semantics before using as lineage evidence.
- If a token is honorific only (for example `Didi`, `Prince`), keep in `titles`/`known_as` and require separate kin claim rows.
- If Portuguese and Dhivehi forms coexist for one person, preserve both forms and attach source-specific citations.
- For ambiguous terms, keep confidence at `C` or lower until source wording disambiguates office vs lineage function.

## 4) Immediate Backlog
1. Add line-level locators from `SRC-SARUNA-PYRARD-V2P2-1887` and `SRC-CORNELL-PYRARD-V1-1887` for office term definitions.
2. Attach explicit title/style source refs to `P1-P29` dossiers during early-Lunar deep pass.
3. Split mixed term rows where one token appears as both office and sobriquet in different periods.

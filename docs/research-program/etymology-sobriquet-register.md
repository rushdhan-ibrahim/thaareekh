# Etymology and Sobriquet Register

Date: 2026-02-08
Status: active working register (Phase 3 deepening)

## 1) Method and Caution Policy
This register separates:
- attested etymological borrowing (high confidence),
- plausible but unconfirmed derivations (medium/low confidence), and
- unresolved sobriquet components (tracked without speculative translation).

Confidence scale used in this register:
- `E1` strong: origin/loan pathway is directly supported by language-historical consensus or explicit source wording.
- `E2` moderate: likely origin is clear but local semantic drift is not yet documented line-by-line.
- `E3` provisional: plausible derivation only; retain as hypothesis.
- `E4` unresolved: attested in names, but no reliable etymological resolution captured in this phase.

## 2) Etymology Entries

### 2.1 Naib / Al-Naib / El-Naib
- Confidence: `E1`
- Proposed origin: Arabic `na'ib` (deputy/substitute), reflected in South Asian and Indian Ocean administrative vocabularies.
- Graph attestations: `P132` (Al-Naib), `P182` (El-Naib), `P191` (Naib-linked branch context).
- Evidence anchors: `SRC-SSRN-SUOOD-LEGAL`, `SRC-MRF-TITLES`, `SRC-MRF-MIDU-ROYAL`.
- Modeling rule: treat as office/deputy designation first; do not infer blood relation from title match alone.

### 2.2 Dom / Donna / Infanta
- Confidence: `E1`
- Proposed origin: Iberian (Portuguese) Christian honorific layer used in contact/post-contact naming records.
- Graph attestations: `P61` (Dom Manoel form), `P97` (Dom Luis de Sousa), `P101` (Donna Francisca Vasconcellos), `P194` (Donna Maria Veloso), `P196` (Infanta Maria).
- Evidence anchors: `SRC-CORNELL-PYRARD-V1-1887`, `SRC-SARUNA-PYRARD-V2P2-1887`, `SRC-MRF-KINGS`.
- Modeling rule: preserve as alias layer; identity resolution must still use chronology and kin claims.

### 2.3 Didi
- Confidence: `E3`
- Proposed origin: unresolved in this phase; securely attested as elite style/surname marker in late-monarchy and republican lineages.
- Graph attestations: `P110`, `P111`, `P115`, `P129`, `P190`, `P191`.
- Evidence anchors: `SRC-WIKI-AMIN-DIDI`, `SRC-WIKI-ABDUL-MAJEED`, `SRC-WIKI-IBRAHIM-NASIR`, `SRC-WIKI-MUHAMMAD-FAREED`.
- Modeling rule: style continuity is not sufficient for kin promotion; keep branch claims inferred until direct pairwise wording appears.

### 2.4 Thakurufaanu / Thakurufan
- Confidence: `E3`
- Proposed origin: unresolved composite royal honorific in Dhivehi historical usage; decomposition remains unverified here.
- Graph attestations: `P102`, `P103`, `P104`, `P130`, `P132`, `P182`.
- Evidence anchors: `SRC-MRF-UTHEEM`, `SRC-MRF-KINGS`, `SRC-WIKI-PRINCE-IBRAHIM-FAAMULADHEYRI`.
- Modeling rule: retain as honorific/style field and avoid deriving kin certainty from token similarity.

### 2.5 Kilege / Kilegefaanu / Kilegefan
- Confidence: `E3`
- Proposed origin: office/style complex in Maldivian court hierarchy; lexical root and semantic shifts still need direct philological extraction.
- Graph attestations: `P130` (Faamuladheyri Kilegefaanu), `P156`, `P157`, `P158` (Kilege-form nodes).
- Evidence anchors: `SRC-MRF-TITLES`, `SRC-SSRN-SUOOD-LEGAL`, `SRC-MRF-KINGS`.
- Modeling rule: interpret as status-office marker, not genealogical proof.

### 2.6 Bandaarain / Bandaara / Manikfan-family sobriquet layer
- Confidence: `E4` (current etymology unresolved)
- Proposed origin: likely borrowed courtly vocabulary stream; exact pathway is not resolved in current source set.
- Graph attestations: known-as rows for `P75`, `P80`, `P81`, `P83`.
- Evidence anchors: `SRC-WIKI-HEADS-STATE`, `SRC-WIKI-IZZUDDIN-I`, `SRC-WIKI-MUHAMMAD-GHIYATH-AL-DIN`, `SRC-HISTORY-MV-GHIYAS`.
- Modeling rule: keep in sobriquet/known-as layer and do not convert to branch certainty without explicit kin claims.

## 3) Sobriquet Register (Node-level)

### 3.1 Confirmed or high-confidence sobriquets
- `P2` Dhovemi: `Dhovemi Kalaminjaa` (historical-name, `c`) and `Dharumavantha Rasgefaanu` (sobriquet, `c`).
  Source anchors: `SRC-WIKI-DHOVEMI`, `SRC-WIKI-HEADS-STATE`.
- `P63` Ali: `Dhevvadhoo Rasgefaanu` (sobriquet, `c`).
  Source anchors: `SRC-WIKI-HEADS-STATE`.
- `P80` Hassan Izzuddine: `Dhon Bandaarain` (sobriquet, `c`), `Muleegey Don Hassan Maniku` (house-name, `c`), `Don Bandaara` (variant, `c`).
  Source anchors: `SRC-WIKI-IZZUDDIN-I`, `SRC-WIKI-HEADS-STATE`.
- `P81` Mohamed Ghiyathuddine: `Muhammadh Manikfaan` (historical-name, `c`), `Haajee Bandaarain` (sobriquet, `c`).
  Source anchors: `SRC-WIKI-MUHAMMAD-GHIYATH-AL-DIN`, `SRC-HISTORY-MV-GHIYAS`.
- `P83` Mohamed Muizzuddine: `Kalhu Bandaarain` (sobriquet, `c`).
  Source anchors: `SRC-WIKI-MUHAMMAD-MUIZZUDDIN`, `SRC-WIKI-HEADS-STATE`.

### 3.2 Uncertain sobriquet requiring hardening
- `P75` Hassan: `Addu Hassan Manikfan` (sobriquet, `u`).
  Source anchor: `SRC-WIKI-HEADS-STATE`.
  Hardening requirement: corroborate with at least one independent historical source before upgrading from uncertain.

## 4) Regnal Epithet Token Bank (Unresolved Lexical Layer)
These are frequent components in `rg` values that currently remain semantic placeholders (`E4`) until direct lexicon evidence is extracted.

High-frequency attested tokens (sample counts in current dataset):
- `Keerithi` (17), `Maha` (15), `Radun` (14)
- `Bavana` (13), `Loka` (13), `Abarana` (10)
- `Kula` (10), `Sundhura` (9)
- `Raadha` (7), `Veeru` (7), `Suvara` (6)
- `Dhammaru` (5), `Ran` (5), `Katthiri` (4), `Siyaaaka` (4)

Examples:
- `Keerithi Maha Radun`: appears in nodes such as `P34`, `P66`, `P75`, `P83`, `P92`.
- `Bavana` cluster: `P3`, `P17`, `P21`, `P30`, `P40`, `P50`.
- `Loka` cluster: `P10`, `P18`, `P19`, `P32`, `P39`, `P59`.
- `Veeru` cluster: `P31`, `P32`, `P41`, `P52`, `P53`, `P55`.

Modeling rule for this bank:
- Keep token components as attested regnal-style forms.
- Do not assign fixed translations until a dedicated lexical source pack is ingested.
- Use these tokens for search/alias normalization only, not kin promotion.

## 5) Next Extraction Tasks
1. Add line-level citations for title and sobriquet definitions from `SRC-SARUNA-PYRARD-V2P2-1887` and `SRC-CORNELL-PYRARD-V1-1887`.
2. Build a Dhivehi/Arabic/Portuguese lexical crosswalk appendix for the unresolved token bank.
3. Re-grade `E3/E4` entries after philological-source ingestion and contradiction review.

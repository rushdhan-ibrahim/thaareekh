# Sprint 1 Bridge Dossier (Online Research)

Date: 2026-02-06
Scope: `Hilaaly -> Huraagey`, `Hilaaly -> Utheemu`, `Lunar -> Hilaaly`

## 1) Method and source quality
- Primary target: chronicle-backed materials (`Tarikh` references) and archival/scholarly material.
- Practical constraint: direct fetch of several Maldives Royal Family pages returned HTTP 406 in this environment; evidence was captured from indexed snapshots/snippets and independent cross-reference pages.
- Confidence labels used below:
  - `A` high (multiple independent sources including specialist genealogy)
  - `B` medium (single strong source or secondary synthesis citing primary)
  - `C` inferred (contextual but plausible)
  - `D` weak/disputed

## 2) Bridge dossier: Hilaaly -> Huraagey

### 2.1 What is strongly supported
Evidence supports that the Huraagey founder line descends from the Christian-period Hilaaly line in Goa, with this chain:
- Dom Manoel (Hassan IX) -> Dom Joao -> Dona Ines -> Dom Luis de Sousa -> Dom Maraduru Fandiaiy Thakurufan -> Hussain Daharadha Thakurufan -> Mohamed Faamuladeyri Thakurufan -> Hassan Izzuddine (#80)

### 2.2 Evidence notes
- Maldives kings-list extracts (indexed) explicitly give #80's paternal chain through `Dom Luis` and `Dona Ines`, identifying Ines as daughter of `#66` and Donna Francisca Vasconcellos.
- Wikipedia `List of Maldivian monarchs` lines around 493 support #80 as son of Amina Dio and Huraa Mohamed Faamuladeyri Thakurufan; lines around 389 mention Dom Joao with children Dom Philippe and Dona Inez.
- Royalark summary (`maldive5`) independently records `Infanta Dona Inez de Malvidas` and her son `Dom Luis de Souza`, reinforcing the Goa branch continuity.

Assessment:
- Bridge existence: `A`
- Intermediate person identities: `A/B` (naming variants remain)

### 2.3 Proposed new people (graph additions)
1. `P96` Donna Ines
- `aliases`: Dona Ines, Dona Inez, Infanta Dona Inez de Malvidas
- `titles`: Infanta
- `confidence`: `A`

2. `P97` Dom Luis de Sousa
- `aliases`: Dom Luis de Souza, Don Louis (legacy mistrendering)
- `titles`: Dom
- `confidence`: `A`

3. `P98` Dom Maraduru Fandiaiy Thakurufan
- `aliases`: Huraa Dom Maraduru Fandiaiy Kaleygefan
- `confidence`: `A/B`

4. `P99` Hussain Daharadha Thakurufan
- `aliases`: Huraa Hussain Daharada Kaleygefan, El-Vazeeru Husain Dhaharadha Kaleyge Faan
- `confidence`: `A/B`

5. `P100` Mohamed Faamuladeyri Thakurufan
- `aliases`: Huraa Mohamed Faamuladeyri Thakurufan
- `confidence`: `A`

6. `P101` Donna Francisca Vasconcellos
- spouse linkage anchor for Dom Joao and mother of Donna Ines / Philippe
- `aliases`: Donna Francisca Vasconelles (variant)
- `confidence`: `B`

### 2.4 Proposed edges (safe batch)
- `parent P66 -> P96` (`c`)
- `spouse P66 <-> P101` (`c`)
- `parent P101 -> P96` (`i`)  
  Rationale: source text states parent pair; current model supports directed parent edges.
- `parent P96 -> P97` (`c`)
- `parent P97 -> P98` (`c`)
- `parent P98 -> P99` (`c`)
- `parent P99 -> P100` (`c`)
- `parent P100 -> P80` (`c`)
- `sibling P67 <-> P96` (`c`)

## 3) Bridge dossier: Hilaaly -> Utheemu

### 3.1 What is supported
Evidence supports a genealogical and political continuity argument that Utheemu contenders emerged from, or were treated as part of, Hilaaly-extended elite lines during/after Portuguese-Christian rule.

### 3.2 Evidence notes
- Utheem page extract states Mohamed Thakurufan was son of Hussain Thakurufan, grandson of Kalhu Ali Thakurufan of Utheem, described as linked to Hilaaly extended family.
- Same extract states succession struggle against Christian Hilaalys involved Hilaalys themselves (branch argument).
- Wikipedia list lines around 384-390 records Kateeb Mohamed Thakurufan as regent/co-regent under Dom Manoel and Dom Joao period, connecting Utheemu actors directly into the late Hilaaly constitutional frame.

Assessment:
- Political-regency connection: `A/B`
- Strict bloodline bridge (exact generational chain back to named Hilaaly sovereign): `B/C` pending stronger primary citation extraction.

### 3.3 Proposed people additions (staging, not all canonical yet)
7. `P102` Kalhu Ali Thakurufan (of Utheem)
- `titles`: Kateeb (if confirmed)
- `confidence`: `B/C`

8. `P103` Hussain Thakurufan (father of Mohamed Thakurufan)
- `confidence`: `B`

9. `P104` Mohamed Thakurufaanu al-Auzam
- `aliases`: Kateeb Mohamed Thakurufan, Bodu Thakurufan
- `titles`: Sultan, Kateeb
- `confidence`: `A`

10. `P105` Hassan Thakurufan (brother/co-regent)
- `confidence`: `B`

11. `P106` Ibrahim Kalaafaan
- `aliases`: Ibrahim Kalaafaanu
- `confidence`: `A/B`

### 3.4 Proposed edges (staged)
- `parent P102 -> P103` (`i`)
- `parent P103 -> P104` (`c`)
- `sibling P104 <-> P105` (`c`)
- `parent P104 -> P106` (`c`)
- `kin P61 <-> P104` label `regnal/contest link during interregnum-goa rule` (`c`)
- `kin P66 <-> P104` label `co-regency framework` (`c`)
- `kin P30 -> P104` label `Hilaaly-extended-family claim` (`i`)  
  Note: keep inferred until direct chronicle quotation is captured.

## 4) Bridge dossier: Lunar -> Hilaaly

### 4.1 What is supported
The claim that Hilaaly founders (especially Hassan I #30) connect maternally to displaced Lunar nobility through Golaavahi Kambulo is present, but in currently accessible material it is framed as likely/probable rather than definitive.

### 4.2 Evidence notes
- Hilaaly genealogy extract describes Hassan I as son of Golhaavahi/Golaavahi Kambulo and Hilaaly Kalo (son of Muslim Abbas).
- Same extract characterizes Golaavahi Kambulo as very likely from the recently displaced Lunar dynasty.
- Wikipedia table for Hilaaly dynasty repeats parentage of Hassan I via Golhaavahi Kambulo and Kulhiveri Hilaalu Kaeulhanna Kaloge.

Assessment:
- Parentage of Hassan I (#30): `A/B`
- Lunar-membership assertion for Golaavahi: `C` (inference/interpretation)

### 4.3 Proposed people additions
12. `P107` Golaavahi Kambulo
- `aliases`: Golhaavahi Kambulo, Kalavahi Kabulo
- `confidence`: `A/B` as mother of #30; `C` for Lunar attribution

13. `P108` Kulhiveri Hilaal Kaiulhanna Kaloge
- `aliases`: Hilaaly Kalo
- `confidence`: `A/B`

14. `P109` Muslim Abbas of Hilaal
- `aliases`: Hulhuley Abbas, Muslim Abbas of Hilaaly
- `confidence`: `B`

### 4.4 Proposed edges
- `parent P107 -> P30` (`c`)
- `parent P108 -> P30` (`c`)
- `spouse P107 <-> P108` (`i`)  
  (relationship implied by parentage narratives)
- `parent P109 -> P108` (`c`)
- `kin P25 <-> P107` label `possible Lunar-house linkage` (`u`)
- `kin P29 <-> P107` label `possible late-Lunar court linkage context` (`u`)

## 5) Identity-variant payload (for your name/title objective)
These should be stored in a sidecar research structure before compacting into display labels:
- Hassan IX: `Sultan Hassan IX`, `King Dom Manoel`, `Siri Dhirikusa Loka`
- Joao: `Dom Joao`, `King Dom Joao`, sometimes with prime/diacritic variants
- Philippe: `Dom Philippe`, `Dom Felipe`
- Ines: `Dona Ines`, `Dona Inez`, `Infanta Dona Inez de Malvidas`
- Luis: `Dom Luis de Sousa`, `Dom Luis de Souza`
- Hassan I (#30): `Sultan Hassan I`, `King Siri Bavana`
- Golaavahi line: `Golaavahi/Golhaavahi/Kalavahi` orthography variants
- Utheemu hero: `Mohamed Thakurufaanu al-Auzam`, `Kateeb Mohamed Thakurufan`, `Bodu Thakurufan`

## 6) Graph patch list (implementation-ready)

### 6.1 Add nodes first
Add `P96..P109` with `nm`, `aliases[]`, `titles[]`, `dy` where known.

Suggested dynasty tags:
- `P96..P101`: `Hilaaly-Huraa Bridge` (or `Hilaaly` if you prefer one dynasty enum)
- `P102..P106`: `Utheemu` (with `name_notes` indicating Hilaaly-extended claim)
- `P107..P109`: `Hilaaly` (with `P107` Lunar-link flag in notes)

### 6.2 Add high-confidence edges (`c`) in batch A
- `P66->P96`, `P96->P97`, `P97->P98`, `P98->P99`, `P99->P100`, `P100->P80`, `P67<->P96`
- `P103->P104`, `P104<->P105`, `P104->P106`
- `P107->P30`, `P108->P30`, `P109->P108`

### 6.3 Add inferred edges (`i`) in batch B
- `P66<->P101` spouse, `P101->P96` parent
- `P102->P103`
- `P107<->P108` spouse
- `P30->P104` (Hilaaly extended-family claim)

### 6.4 Keep unresolved as `u` (do not hardwire as confirmed)
- Direct Lunar sovereign-to-Golaavahi bloodline edge until direct chronicle citation is captured.

## 7) Open verification tasks for Sprint 2
1. Obtain machine-readable access to archived `Tarikh` volumes (`A499`, `A505_1..3`) and extract direct chain citations for:
- Dona Ines/ Dom Luis branch
- Utheemu-Hilaaly descent language
- Golaavahi Lunar-membership claim

2. Confirm orthography standards (Dhivehi/Arabic/Portuguese transliteration policy).

3. Decide dynasty enum policy for bridge persons (`Hilaaly`, `Huraagey`, or dual-tag in notes).

## 8) Additional research: Dhiyamigili links to other dynasties

### 8.1 Confirmed and likely inter-dynasty links
1. `Isdu -> Dhiyamigili` transition by succession overthrow
- Sultan Muhammad Imaduddin II (#77, Dhiyamigili) is documented as having overthrown Sultan Ibrahim Mudzhiruddin (#76, Isdu) in 1704.
- This is a confirmed political/dynastic transition link (not parentage).
- Confidence: `A/B` (consistent in dynasty tables and monarch list).

2. `Dhiyamigili <-> Isdu` via marriage
- Ibrahim Iskandar I (#78, Dhiyamigili) is recorded as married to Amina I of Isdhoo.
- This is a direct marriage bridge between dynasties.
- Confidence: `B` (specialist genealogy; keep as `i` until second independent citation is extracted).

3. `Dhiyamigili -> Huraagey` transition after deposition
- Muhammad Ghiya'as ud-din I (#81, Dhiyamigili), son of #78, was deposed while on Hajj.
- He was replaced by Muhammad Shamsuddeen II (#82, Huraagey), identified as his cousin in genealogical summaries.
- This is a direct dynastic transition link with kin context.
- Confidence: `A/B` for transition, `B` for exact cousin-chain pending chronicle quote.

4. `Hilaaly line -> Dhiyamigili replacement context`
- The political restoration that enabled Huraagey after Dhiyamigili decline is attributed to a descendant of Christian king Dom Joao (#66), connecting Dhiyamigili's fall to the Hilaaly-Huraa lineage resurgence.
- Confidence: `B/C` (retain as contextual `kin` or `event` note, not strict bloodline edge unless person-level chain is explicit).

### 8.2 Dhiyamigili-focused edge proposals

High-confidence (`c`) additions:
- `kin P76 <-> P77` label `dynastic overthrow (Isdu -> Dhiyamigili, 1704)`
- `kin P81 <-> P82` label `succession replacement (Dhiyamigili -> Huraagey, 1774)`

Medium/inferred (`i`) additions:
- `spouse P78 <-> [Amina I of Isdhoo]` (requires adding node; not yet in sovereign graph)
- `kin P81 <-> P82` label refinement `cousins` (upgrade to `c` once chronicle quote is captured)

Uncertain (`u`) / hold:
- Any direct parent-child edge from Dhiyamigili sovereigns to Huraagey sovereigns without explicit source text.
- Any direct bloodline edge from #66 to Dhiyamigili sovereigns (context is political, not established descent).

### 8.3 Suggested new bridge node (optional for completeness)
15. `P110` Amina I of Isdhoo
- role: spouse of #78 in specialist genealogy references
- dynasty tag: `Isdu` (provisional)
- confidence: `B` (pending second source for promotion to `c`)

## Sources used
- https://en.wikipedia.org/wiki/List_of_Maldivian_monarchs
- https://en.wikipedia.org/wiki/Dhiyamigili_dynasty
- https://en.wikipedia.org/wiki/Huraa_dynasty
- https://maldivesroyalfamily.com/maldives_kings_list.full.shtml (indexed snippets)
- https://maldivesroyalfamily.com/maldives_hilaaly.shtml (indexed snippets)
- https://maldivesroyalfamily.com/maldives_royal_huraagey.shtml (indexed snippets)
- https://maldivesroyalfamily.com/maldives_utheem.shtml (indexed snippets)
- https://www.royalark.net/Maldives/maldive13.htm
- https://www.royalark.net/Maldives/maldive5.htm (indexed snippet)
- https://www.persee.fr/doc/arch_0044-8613_2005_num_70_1_3970
- https://www.persee.fr/doc/arch_0044-8613_2005_num_70_1_3972

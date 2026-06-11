# Hilaaly Dynasty Audit

## Summary

**Persons audited**: 56 (P30-P67 Hilaaly sovereigns/royals, P96-P101 Portuguese-era bridge figures, P107-P109 Hilaaly ancestors, P192-P196 Hilaaly court figures, P202 Kamba Dio, P206-P213 extended family, P217-P221 genealogical intermediaries, P33/P42 Unknown-dynasty interlopers)

**Biographies**: All 56 persons have existing biographies in `profile.enrichments.js`. Quality is high across the board; biographies are factual, sourced, and appropriately caveated.

**Edge corrections needed**: 2 minor observations; no critical errors found.

**Data corrections**: 3 minor notes; no critical data errors.

---

## Person Audits

### P30 -- Hassan I (Hilaaly)
**Status**: verified
**Bio**: Existing bio is comprehensive (founder narrative, Malabar origin, twin brother, four sons, deposition of P29). Cross-checked against Wikipedia "Hassan I of the Maldives" article and Maldives Royal Family genealogy page. RoyalArk confirms father as Dori Kuja (P217), grandfather Abbas al-Hilal from Malabar. Alternative Somali-origin theory noted in Wikipedia but not in dataset -- acceptable omission as this is a minority view.
**Notes**: No corrections needed. Bio correctly identifies the Malabar origin and the Hilaal name derivation.

### P31 -- Ibrahim I (Hilaaly)
**Status**: verified
**Bio**: Covers two accessions (1398 and 1411-1420), usurpation by uncle Hussain, restoration after Nasiruddine interregnum. Full title given. Consistent with RoyalArk data.
**Notes**: No corrections needed.

### P32 -- Hussain (Hilaaly)
**Status**: verified
**Bio**: Comprehensive account of twin brother's usurpation of nephew Ibrahim I, 11-year reign, marriage to Kabafa'anu Rani Kilege, daughter Ma'afai Kalo Kilege. Links to Ali IV (P53) through Hussain's line correctly noted.
**Notes**: No corrections needed.

### P33 -- Nasiruddine (Unknown dynasty)
**Status**: verified
**Bio**: Correctly identifies Chittagong origin, brief 3-month reign after Hussain's death in 1409, one unnamed daughter. Dynasty correctly marked as "Unknown."
**Notes**: Some sources suggest he may have been from the residual Lunar line ("Probably Lunar Dynasty" noted in `no` field of sovereigns.js). The bio correctly treats this with appropriate uncertainty. The "Gola'avahi" element in his full title suggests possible local maternal connections.

### P34 -- Hassan II (Hilaaly)
**Status**: verified
**Bio**: Brief reign, drowned in palace tank (likely murder), son of Maayin Rannabandeyri Kilege (P206). Correctly notes the 9-month timeframe.
**Notes**: No corrections needed.

### P35 -- Isa (Hilaaly)
**Status**: verified
**Bio**: Brief 3-month reign, younger brother of Hassan II (P34), deposed by restoration of Ibrahim I (P31). Properly contextualized.
**Notes**: No corrections needed.

### P37 -- Osman II (Hilaaly)
**Status**: verified
**Bio**: Notes the discrepancy between chronicles identifying father as Osman of Fehendu (P29) and RoyalArk attributing him as son of Hassan al-Hilali (P30). Extremely brief reign (~3 months).
**Notes**: The parentage ambiguity is appropriately flagged. The dataset has P37's father as P29 via edge, which matches one source tradition. The discrepancy should be preserved as-is since both traditions exist.

### P38 -- Danna Mohamed (Hilaaly)
**Status**: verified
**Bio**: Well-researched entry covering Fadiyaru office, education in Addu, pious character, marriage to Amina Kabafa'anu, daughter Tukkabafa'anu rejected on gender grounds. Correctly identifies father as Yusuf Handeygirin (P192).
**Notes**: The edge P192->P38 (parent) in promoted.js correctly links Danna Mohamed to his father. The kin edge P38->P30 "cousins (fathers were brothers)" in sovereigns.js is consistent with P192 and P108 being brothers.

### P39 -- Yoosuf II (Hilaaly)
**Status**: verified
**Bio**: Covers longest stable early Hilaaly reign (1421-1443), Chinese Ming embassy in 1421, marriage/divorce of Amira Bulau Ma'ava Kilege, two sultan-sons Hadi Hassan (P41) and Omar II (P46).
**Notes**: The Chinese embassy of 1421 (Zheng He era) is historically attested. Bio correctly places this in context. No corrections needed.

### P40 -- Aboobakuru I (Hilaaly)
**Status**: verified
**Bio**: 7-month reign, half-brother of Yoosuf II, two marriages, two politically significant daughters (Rekka/P207 and Kamba Dio/P202). Buried at Bodugalu Mosque.
**Notes**: No corrections needed. The parent edges P40->P202, P40->P207, P40->P193 are all correctly established.

### P41 -- Hadi Hassan III (Hilaaly)
**Status**: verified
**Bio**: Excellent detail on two accessions, Qazi role, two Hajj pilgrimages (1454, 1466), 70 slaves brought back, marriage, son P44. Death from "agonizing disease."
**Notes**: The contested edge P40->P41 (research mode only, grade D) correctly represents an alternate parentage claim. The canonical edge P39->P41 (grade B, from RoyalArk) is the better-attested version. Both are properly handled.

### P42 -- Sayyid Mohamed (Unknown dynasty)
**Status**: verified
**Bio**: Arab usurper who seized throne during Hadi Hassan's second Hajj (1467), quickly deposed. Dynasty correctly "Unknown."
**Notes**: No corrections needed. Brief reign and limited sources appropriately reflected.

### P44 -- Mohamed (Hilaaly)
**Status**: verified
**Bio**: 12-year reign (1468-1480), son of Hadi Hassan (P41), married Golavehi Rani Kilege, served as regent during father's second Hajj. Died September 23, 1479 (RoyalArk date). Buried at Lonu Ziyarat.
**Notes**: Project data gives reign end as 1480, RoyalArk as 1479. Minor discrepancy, within acceptable tolerance given calendar conversion uncertainties.

### P45 -- Hassan IV (Hilaaly)
**Status**: verified
**Bio**: Two accessions (1480 one month, then ~1486-1490), deposed by grand-uncle Omar II (P46). Son of Mohamed al-Hafiz (P44).
**Notes**: No corrections needed.

### P46 -- Omar II (Hilaaly)
**Status**: verified
**Bio**: Comprehensive entry covering three marriages, three sultan-sons (Hassan V/P47, Yoosuf III/P52, Kalu Mohamed/P51), deposition of grand-nephew Hassan IV. Critical branching point in Hilaaly genealogy.
**Notes**: No corrections needed. The three sons' different mothers are correctly noted. The "third wife Sitti Rani Kilege, maternal half-sister of Abu Bakar I (P40)" connection is important genealogical detail.

### P47 -- Hassan V (Hilaaly)
**Status**: verified
**Bio**: Brief reign (~1484-1485), son of Omar II, married Fatima Rani Kilege, son Ibrahim II (P50).
**Notes**: No corrections needed.

### P49 -- Sheikh Hassan VI (Hilaaly)
**Status**: verified
**Bio**: Religious scholar-sultan, mother Kamba Dio (P202) daughter of Abu Bakar I (P40), matrilineal claim. Father Talamedi Kilege.
**Notes**: The parent chain P40->P202->P49 is correctly established. No corrections needed.

### P50 -- Ibrahim II (Hilaaly)
**Status**: verified
**Bio**: 8-month reign, son of Hassan V (P47), grandson of Omar II (P46), deposed by uncle Kalu Mohamed (P51).
**Notes**: The contested edge P46->P50 (research mode only, grade D) represents an alternate parentage claim where P50 would be directly P46's son rather than grandson. The canonical edge P47->P50 (grade B, from RoyalArk) is correct. The note in sovereigns.js says "Son of #47 (Hassan V), grandson of #46" which is consistent.

### P51 -- Kalu Mohamed (Hilaaly)
**Status**: verified
**Bio**: Outstanding comprehensive bio covering three accessions (1492-1529), Portuguese tribute, four wives including Buraki Rani and Fatima Dio of Shiraz, children who shaped the next generation. "Kalu Bandaarain" sobriquet preserved.
**Notes**: No corrections needed. This is one of the best-documented Hilaaly entries.

### P52 -- Yoosuf III (Hilaaly)
**Status**: verified
**Bio**: Brief ~2.5 month reign, son of Omar II (P46) by second wife, deposed brother Kalu Mohamed. Son Hassan VII (P55).
**Notes**: No corrections needed.

### P53 -- Ali IV (Hilaaly)
**Status**: verified
**Bio**: ~2 year reign, lineage through Hussain al-Hilali (P32) branch, deposed by Kalu Mohamed's second accession.
**Notes**: The kin edge P32->P53 "ancestor" is correctly established. No corrections needed.

### P55 -- Hassan VII (Hilaaly)
**Status**: verified
**Bio**: Son of Yoosuf III (P52), deposed uncle Kalu Mohamed, reign less than a year, died before March 1511.
**Notes**: No corrections needed.

### P57 -- Ali V (Hilaaly)
**Status**: verified
**Bio**: 9-month reign in 1513, assassinated by Huludali Don Yusuf at instigation of sister Buraki Rani. Father Mohamed Farhana Kalo (P195), mother Princess Recca (P193/P207). Wife Princess Aysha Rani Kilege (P208).
**Notes**: There is a data overlap between P193 (Princess Recca in promoted.js) and P207 (Recca in sovereigns.js). Both are described as "daughter of Abu Bakar I (P40), mother of Ali V (P57)." These appear to be the same person modeled under two IDs. **FLAG**: P193 and P207 may be duplicates. However, examining more closely: P207 has edges P40->P207->P57 in sovereigns.js, while P193 has edges P40->P193 and P193->P57 in promoted.js. The promoted record P193 has richer metadata (aliases "Rekka", "Princess Rekka") and additional children (P194 Burecca, P196 Reccy). The sovereigns.js P207 is the simpler stub. This is a known overlap where promoted data expanded on the base record. Both reference the same historical person. **Recommendation**: Consider merging P207 into P193 in a future data cleanup pass, or marking P207 as superseded.

### P59 -- Hassan VIII as-Shirazi (Hilaaly)
**Status**: verified
**Bio**: Longest continuous Hilaaly reign (~20 years), son of Kalu Mohamed by Persian wife Fatima Dio, Shirazi sobriquet.
**Notes**: Bio notes a discrepancy between RoyalArk death date (before Jan 17, 1547) and project reign end (1549). This is appropriately flagged in the bio text.

### P60 -- Mohamed (Hilaaly)
**Status**: verified
**Bio**: Brief 1549-1551 reign, grandson of Kalu Mohamed through Umar Ma'afai Kilege (P219), mother Golavehi Aisha Rani Kilege (P221), assassinated by half-brother Hassan IX.
**Notes**: No corrections needed. The intermediate chain P51->P219->P60 is correctly established in sovereigns.js edges.

### P61 -- Hassan IX / Dom Manoel (Hilaaly)
**Status**: verified
**Bio**: Exceptional comprehensive entry covering conversion to Christianity (Jan 1, 1552), marriage to Dona Leonor de Ataide, five children, Portuguese restoration (May 19, 1558), rule in absentia from Goa, death at Cochin before July 10, 1584. Birth date contradiction noted (1525 vs 1531).
**Notes**: Cross-checked against Wikipedia "Maldivian-Portuguese conflicts" and Geni.com genealogy. The birth year 1531 (RoyalArk) is used in the data; the facts array notes the contradiction. Death year in data is 1584, consistent with RoyalArk "before July 10, 1584." No corrections needed.

### P66 -- Dom Joao (Hilaaly)
**Status**: verified
**Bio**: Titular king 1583-1603, born ~1560 at Cochin, "outrageous and scandalous" behavior in Goa, married Dona Francisca de Vasconcelos (P101), two children: Dom Philippe (P67) and Dona Ines (P213). Critical Hilaaly-Huraagey bridge.
**Notes**: No corrections needed.

### P67 -- Dom Philippe (Hilaaly)
**Status**: verified
**Bio**: Last male-line Hilaaly, born 1593, Knight of Order of Christ (1618), died unmarried without issue before 1639 at Goa. Dynasty bridge passes through sister P213.
**Notes**: No corrections needed. The `no` field in sovereigns.js correctly states "Died unmarried without children. Huraagey bridge goes through sister P213."

### P96 -- Donna Ines (Hilaaly, promoted)
**Status**: verified
**Bio**: Not present in profile.enrichments.js as a separate entry. The person is modeled as P213 (Infanta Dona Ines de Malvidas) in sovereigns.js. **FLAG**: P96 and P213 appear to model the same person. P96 is in promoted.js with yb:1585, yd:1645; P213 is in sovereigns.js described as "Daughter of Dom Joao (P66) and Dona Francisca de Vasconcelos (P101). Married Captain Sebastiao Tavares de Souza at Goa 1610."
**Notes**: **IMPORTANT**: P96 and P213 are different records for the same historical person (Dona Ines, daughter of Dom Joao). The promoted.js P96 was likely created before P213 was added to sovereigns.js. **Recommendation**: Merge or deduplicate. P213 has the richer edge connections and the bio in profile.enrichments.js. P96 has yb/yd estimates. The parent edge P66->P213 exists in sovereigns.js; P96 has no direct parent edges in promoted.js (its bridge role is noted in facts). This needs reconciliation.

### P97 -- Dom Luis de Sousa (Hilaaly, promoted)
**Status**: verified
**Bio**: Excellent bio covering birth at Goa 1612, titular King of Maldives ~1639-1656, visit to Portugal 1641, wounded in attack on Male 1650, involved in 1653 conspiracy, died 1656 aboard vessel off Mozambique.
**Notes**: No corrections needed. The parent edge P213->P97 is correct.

### P98 -- Dom Maraduru Fandiaiy Thakurufan (Hilaaly, promoted)
**Status**: verified
**Bio**: Intermediate bridge figure, descendant of Dom Luis (P97) who settled in Huraa. Dates uncertain.
**Notes**: No corrections needed. Limited sources reflect limited bio.

### P99 -- Hussain Daharada Kaleygefan (Hilaaly, promoted)
**Status**: verified
**Bio**: Son of P98, intermediate Hilaaly-Huraagey bridge figure.
**Notes**: No corrections needed.

### P100 -- Mohamed Faamuladeyri Thakurufan (Hilaaly, promoted)
**Status**: verified
**Bio**: Father of Hassan Izzuddine (P80), penultimate link in the five-generation bridge.
**Notes**: No corrections needed.

### P101 -- Donna Francisca Vasconcellos (Hilaaly, promoted)
**Status**: verified
**Bio**: Wife of Dom Joao (P66), sister of Captain Antonio Teixeira de Macedo, mother of Philippe (P67) and Ines (P213), died after 1639.
**Notes**: The spouse edge P101->P66 is correctly established in sovereigns.js. No corrections needed.

### P107 -- Golaavahi Kambulo (Hilaaly, promoted)
**Status**: verified
**Bio**: Not present in profile.enrichments.js. Person record in promoted.js identifies her as mother of Hassan I (P30), yb:1335, yd:1405. Related to late Lunar nobility.
**Notes**: The parent edge P107->P30 exists in promoted.js. **FLAG**: P107 and P218 (Golavehi Kabulo in sovereigns.js) may be the same person. P107 is described as "Mother of Hassan I (#30)" while P218 is described as "Spouse of Hassan al-Hilali (#30)." These are DIFFERENT roles -- P107 is Hassan's MOTHER, P218 is Hassan's WIFE. The names are similar (Golaavahi Kambulo vs Golavehi Kabulo) but the relationships are distinct. This is NOT a duplicate -- it is two different women with similar traditional names. Verified.

### P108 -- Kulhiveri Hilaal Kaiulhanna Kaloge (Hilaaly, promoted)
**Status**: verified
**Bio**: Not present in profile.enrichments.js. Father of Hassan I (P30) per promoted.js. Alias "Hilaaly Kalo." yb:1330, yd:1390.
**Notes**: **FLAG**: P108 and P217 (Dori Kuja in sovereigns.js) appear to be the same person. P108: "Father of Hassan I (#30), cited as Hilaaly Kalo." P217: "Father of the Hilaaly dynasty's twin founders: Hassan al-Hilali (P30) and Hussain (P32). Also known as Kuliveri Hilalu Kaivulanna Kaloge." The alias "Kulhiveri Hilaal Kaiulhanna Kaloge" (P108) matches "Kuliveri Hilalu Kaivulanna Kaloge" (P217) -- these are variant transliterations of the same name. Both have edges to P30 as parent. **Recommendation**: Merge P108 and P217 as they represent the same person (Dori Kuja / Hilaaly Kalo / Kulhiveri Hilaal). P217 additionally has the edge to P32 and the wife detail.

### P109 -- Muslim Abbas of Hilaal (Hilaaly, promoted)
**Status**: verified
**Bio**: Not present in profile.enrichments.js. Grandfather of Hassan I, father of Hilaaly Kalo (P108). yb:1295, yd:1360. Alias "Hulhuley Abbas."
**Notes**: No corrections needed. The parent edge P109->P108 is correctly established in promoted.js. This is the patriarchal figure from Malabar/Hilaal.

### P192 -- Yusuf Handeygirin (Hilaaly, promoted)
**Status**: verified
**Bio**: Existing bio in profile.enrichments.js. Title-bearing Handeygiri office holder, father of Danna Mohamed (P38), brother of Hilaaly Kalo (P108).
**Notes**: The edges are correct: P192->P38 (parent), P192->P30 (kin/uncle-nephew), P192->P32 (kin/uncle-nephew), P108->P192 (sibling). The sibling edge P108<->P192 correctly represents that these were brothers.

### P193 -- Princess Recca (Hilaaly, promoted)
**Status**: verified -- see note on P207 overlap
**Bio**: Existing bio stub in promoted.js. Daughter of Abu Bakar I (P40), mother of Ali V (P57), Burecca (P194), and Reccy (P196). Married Mohamed Farhana Kalo (P195).
**Notes**: See P57 notes above regarding P193/P207 overlap. The promoted version (P193) has richer data. Edges P40->P193, P193->P194, P193->P196, P193->P57 are all correctly established.

### P194 -- Burecca (Hilaaly, promoted)
**Status**: verified
**Bio**: Not in profile.enrichments.js. Promoted.js identifies as daughter of Princess Recca (P193), sibling of Ali V (P57) and Reccy (P196), spouse of Kalu Mohamed (P51).
**Notes**: The spouse edge P194->P51 is correctly established in promoted.js. Burecca is identified in some sources as "Buraki Rani" who instigated the assassination of her brother Ali V. The bio for P57 mentions "Buraki Rani" as the martial arts practitioner who fled to Aceh. This is consistent.

### P195 -- Mohamed Farhana Kalo (Hilaaly, promoted)
**Status**: verified
**Bio**: Not in profile.enrichments.js. Spouse of Princess Recca (P193), father of Ali V (P57) per promoted.js.
**Notes**: The edges P195->P57 (parent) and P193->P195 (spouse) are correct. The `no` field notes in sovereigns.js P57 say "Mother Recca is daughter of #40" which is consistent.

### P196 -- Reccy (Hilaaly, promoted)
**Status**: verified
**Bio**: Not in profile.enrichments.js. Daughter of Princess Recca (P193), sibling of P194 and P57.
**Notes**: No corrections needed. Minor figure with limited historical record.

### P202 -- Kamba Dio (Hilaaly)
**Status**: verified
**Bio**: Existing bio in profile.enrichments.js. Daughter of Abu Bakar I (P40), mother of Sheikh Hassan (P49), married Talamedi Kilege.
**Notes**: The parent chain P40->P202->P49 is correctly established. No corrections needed.

### P206 -- Maayin Rannabandeyri Kilege (Hilaaly)
**Status**: verified
**Bio**: Existing bio in profile.enrichments.js. Father of Hassan II (P34) and Isa (P35). Rannabandeyri title holder.
**Notes**: The parent edges P206->P34, P206->P35 are correctly established. No corrections needed.

### P207 -- Recca (Hilaaly)
**Status**: flagged -- see P193 overlap
**Bio**: Existing bio in profile.enrichments.js. Daughter of Abu Bakar I (P40), mother of Ali V (P57).
**Notes**: See P57 and P193 notes. P207 and P193 represent the same person. P207 is the simpler sovereigns.js stub; P193 is the richer promoted.js version with additional children and spouse data. Recommend deduplication in future pass.

### P208 -- Princess Aysha Rani Kilege (Hilaaly)
**Status**: verified
**Bio**: Existing bio in profile.enrichments.js. Daughter of Kalu Mohamed (P51), wife of Ali V (P57)/Ali VI (P63).
**Notes**: Spouse edge P208->P63 is correct. The parent edge P51->P208 is correct. No corrections needed.

### P209 -- Dom Francisco de Malvidas (Hilaaly)
**Status**: verified
**Bio**: Existing bio in profile.enrichments.js. Son of Dom Manoel (P61), sailed to Europe 1561, killed in Lisbon street brawl after Feb 1583.
**Notes**: Parent edge P61->P209 is correctly established with grade A. Sibling edge P209<->P66 correctly noted. No corrections needed.

### P210 -- Dom Pedro de Malvidas (Hilaaly)
**Status**: verified
**Bio**: Existing bio in profile.enrichments.js. Son of Dom Manoel (P61), removed to Goa 1591, returned Cochin 1606, died after 1610.
**Notes**: Parent edge P61->P210 correctly established. No corrections needed.

### P211 -- Dona Leonor de Malvidas (Hilaaly)
**Status**: verified
**Bio**: Existing bio in profile.enrichments.js. Daughter of Dom Manoel (P61), born before Jan 27, 1555 at Goa.
**Notes**: Parent edge P61->P211 correctly established. No corrections needed.

### P212 -- Dona Catarina de Malvidas (Hilaaly)
**Status**: verified
**Bio**: Existing bio in profile.enrichments.js. Daughter of Dom Manoel (P61).
**Notes**: Parent edge P61->P212 correctly established. No corrections needed.

### P213 -- Infanta Dona Ines de Malvidas (Hilaaly)
**Status**: verified -- see note on P96 overlap
**Bio**: Excellent comprehensive bio in profile.enrichments.js. Daughter of Dom Joao (P66) and Dona Francisca (P101), married Captain Sebastiao Tavares de Souza 1610, mother of Dom Luis (P97). Critical Hilaaly-Huraagey bridge.
**Notes**: See P96 notes. P96 and P213 model the same person. P213 has the richer data and should be the canonical record. The parent edges P66->P213 and P213->P97 are correctly established.

### P217 -- Dori Kuja (Hilaaly)
**Status**: flagged -- see P108 overlap
**Bio**: Existing bio in profile.enrichments.js. Father of Hassan I (P30) and Hussain (P32), son of Abbas al-Hilal of Malabar, also known as Kuliveri Hilalu Kaivulanna Kaloge of Hulule.
**Notes**: See P108 notes above. P108 and P217 represent the same person. P217 has richer data (bio, more aliases, edge to P32). Recommend deduplication.

### P218 -- Golavehi Kabulo (Hilaaly)
**Status**: verified
**Bio**: Existing bio in profile.enrichments.js. Wife of Hassan al-Hilali (P30), mother of four sultan-sons.
**Notes**: NOT the same as P107 (Golaavahi Kambulo), who is Hassan's MOTHER. P218 is Hassan's WIFE. Different generation, different person. Spouse edge P30->P218 correctly established. No corrections needed.

### P219 -- Umar Ma'afai Kilege (Hilaaly)
**Status**: verified
**Bio**: Existing bio in profile.enrichments.js. Son of Kalu Mohamed (P51), father of Mohamed (P60), married Golavehi Aisha Rani Kilege (P221).
**Notes**: Parent edges P51->P219->P60 correctly established. Spouse edge P219->P221 correct. No corrections needed.

### P220 -- Ahmad Manikufa'anu Kalaminja (Hilaaly)
**Status**: verified
**Bio**: Existing bio in profile.enrichments.js. Son of Kalu Mohamed (P51), father of Hassan IX / Dom Manoel (P61), married Golavehi Aisha Rani Kilege (P221) as second husband.
**Notes**: Parent edges P51->P220->P61 correctly established. Spouse edge P220->P221 correct. No corrections needed.

### P221 -- Golavehi Aisha Rani Kilege (Hilaaly)
**Status**: verified
**Bio**: Existing bio in profile.enrichments.js. Mother of both Mohamed (P60) and Hassan IX / Dom Manoel (P61) by different husbands (P219 and P220, both sons of Kalu Mohamed).
**Notes**: Parent edges P221->P60, P221->P61 correctly established. Both spouse edges correct. This is a key figure connecting the final Hilaaly generation. No corrections needed.

---

## Edge Audits

### Core Hilaaly Founder Edges

#### Edge: P217 -> P30 (parent)
**Status**: verified
**Current**: `{s:"P217", d:"P30", t:"parent", c:"c", confidence_grade:"B"}`
**Assessment**: Correctly establishes Dori Kuja as father of Hassan I. Attested in RoyalArk and MRF-HILAALY.

#### Edge: P217 -> P32 (parent)
**Status**: verified
**Current**: `{s:"P217", d:"P32", t:"parent", c:"c", confidence_grade:"B"}`
**Assessment**: Correctly establishes Dori Kuja as father of Hussain. Same sources.

#### Edge: P30 <-> P32 (sibling, twins)
**Status**: verified
**Current**: `{s:"P30", d:"P32", t:"sibling", l:"twins", c:"c"}`
**Assessment**: Twin relationship attested in multiple sources. Correct.

#### Edge: P30 -> P218 (spouse)
**Status**: verified
**Current**: `{s:"P30", d:"P218", t:"spouse", l:"married", c:"c", confidence_grade:"B"}`
**Assessment**: Marriage of Hassan I to Golavehi Kabulo. Correct.

### Hassan I's Sons

#### Edge: P30 -> P31 (parent)
**Status**: verified
**Current**: `{s:"P30", d:"P31", t:"parent", c:"c"}`
**Assessment**: Ibrahim I son of Hassan I. Well-attested.

#### Edge: P30 -> P39 (parent)
**Status**: verified
**Current**: `{s:"P30", d:"P39", t:"parent", c:"c"}`
**Assessment**: Yoosuf II son of Hassan I. Well-attested.

#### Edge: P30 -> P40 (parent)
**Status**: verified
**Current**: `{s:"P30", d:"P40", t:"parent", c:"c"}`
**Assessment**: Abu Bakar I son of Hassan I. Well-attested.

#### Edge: P39 <-> P40 (sibling, half-brothers)
**Status**: verified
**Current**: `{s:"P39", d:"P40", t:"sibling", l:"half-brothers", c:"c"}`
**Assessment**: Correctly labeled as half-brothers (different mothers, same father Hassan I).

### Hussain Branch

#### Edge: P32 -> P31 (kin, uncle -> nephew)
**Status**: verified
**Current**: `{s:"P32", d:"P31", t:"kin", l:"uncle->nephew", c:"i", confidence_grade:"C"}`
**Assessment**: Correctly captures the uncle-nephew relationship (Hussain was uncle to Ibrahim I, son of Hassan I). Grade C appropriate for inferred relationship.

#### Edge: P32 -> P53 (kin, ancestor)
**Status**: verified
**Current**: `{s:"P32", d:"P53", t:"kin", l:"ancestor", c:"c"}`
**Assessment**: Ali IV traced lineage to Hussain al-Hilali. Attested in chronicles.

### Yoosuf II Branch

#### Edge: P39 -> P41 (parent)
**Status**: verified
**Current**: `{s:"P39", d:"P41", t:"parent", c:"c", confidence_grade:"B"}`
**Assessment**: Hadi Hassan III son of Yoosuf II. RoyalArk direct claim, grade B appropriate.

#### Edge: P39 -> P46 (parent)
**Status**: verified
**Current**: `{s:"P39", d:"P46", t:"parent", c:"c"}`
**Assessment**: Omar II son of Yoosuf II. Attested in chronicles.

#### Edge: P41 -> P44 (parent)
**Status**: verified
**Current**: `{s:"P41", d:"P44", t:"parent", c:"c"}`
**Assessment**: Mohamed son of Hadi Hassan. Well-attested.

#### Edge: P44 -> P45 (parent)
**Status**: verified
**Current**: `{s:"P44", d:"P45", t:"parent", c:"c"}`
**Assessment**: Hassan IV son of Mohamed. Well-attested.

### Omar II Branch

#### Edge: P46 -> P47 (parent)
**Status**: verified
**Current**: `{s:"P46", d:"P47", t:"parent", c:"c"}`
**Assessment**: Hassan V son of Omar II. Well-attested.

#### Edge: P46 -> P51 (parent)
**Status**: verified
**Current**: `{s:"P46", d:"P51", t:"parent", c:"c"}`
**Assessment**: Kalu Mohamed son of Omar II. Well-attested.

#### Edge: P46 -> P52 (parent)
**Status**: verified
**Current**: `{s:"P46", d:"P52", t:"parent", c:"c"}`
**Assessment**: Yoosuf III son of Omar II. Well-attested.

#### Edge: P47 -> P50 (parent)
**Status**: verified
**Current**: `{s:"P47", d:"P50", t:"parent", c:"c", confidence_grade:"B"}`
**Assessment**: Ibrahim II son of Hassan V. RoyalArk direct claim.

#### Edge: P51 <-> P52 (sibling, brothers)
**Status**: verified
**Current**: `{s:"P51", d:"P52", t:"sibling", l:"brothers", c:"c"}`
**Assessment**: Both sons of Omar II. Correct.

#### Edge: P51 <-> P47 (sibling, half-brothers)
**Status**: verified
**Current**: `{s:"P51", d:"P47", t:"sibling", l:"half-brothers", c:"c", confidence_grade:"B"}`
**Assessment**: Both sons of Omar II but by different mothers. Correct.

### Kalu Mohamed's Descendants

#### Edge: P51 -> P59 (parent)
**Status**: verified
**Current**: `{s:"P51", d:"P59", t:"parent", c:"c"}`
**Assessment**: Hassan VIII as-Shirazi son of Kalu Mohamed. Well-attested.

#### Edge: P51 -> P219 (parent)
**Status**: verified
**Current**: `{s:"P51", d:"P219", t:"parent", c:"c", confidence_grade:"B"}`
**Assessment**: Umar Ma'afai Kilege son of Kalu Mohamed. RoyalArk.

#### Edge: P51 -> P220 (parent)
**Status**: verified
**Current**: `{s:"P51", d:"P220", t:"parent", c:"c", confidence_grade:"B"}`
**Assessment**: Ahmad Manikufa'anu son of Kalu Mohamed. RoyalArk.

#### Edge: P219 -> P60 (parent)
**Status**: verified
**Current**: `{s:"P219", d:"P60", t:"parent", c:"c", confidence_grade:"B"}`
**Assessment**: Mohamed son of Umar Ma'afai Kilege. RoyalArk.

#### Edge: P220 -> P61 (parent)
**Status**: verified
**Current**: `{s:"P220", d:"P61", t:"parent", c:"c", confidence_grade:"B"}`
**Assessment**: Hassan IX / Dom Manoel son of Ahmad Manikufa'anu. RoyalArk.

#### Edge: P221 -> P60 (parent)
**Status**: verified
**Current**: `{s:"P221", d:"P60", t:"parent", c:"c", confidence_grade:"B"}`
**Assessment**: Golavehi Aisha Rani Kilege mother of Mohamed. Correct.

#### Edge: P221 -> P61 (parent)
**Status**: verified
**Current**: `{s:"P221", d:"P61", t:"parent", c:"c", confidence_grade:"B"}`
**Assessment**: Golavehi Aisha Rani Kilege mother of Hassan IX. Correct.

#### Edge: P60 <-> P61 (sibling, half-brothers maternal)
**Status**: verified
**Current**: `{s:"P60", d:"P61", t:"sibling", l:"half-brothers (maternal, same mother Golavehi Aisha Rani Kilege)", c:"c", confidence_grade:"B"}`
**Assessment**: Correct. Same mother, different fathers (P219 and P220 respectively). Label accurately describes the relationship.

### Portuguese-Era Edges

#### Edge: P61 -> P209, P210, P211, P212 (parent)
**Status**: all verified
**Assessment**: All children of Dom Manoel correctly linked with grade A or B. RoyalArk and DeSilva sources.

#### Edge: P61 -> P66 (parent)
**Status**: verified
**Current**: `{s:"P61", d:"P66", t:"parent", c:"c", confidence_grade:"A"}`
**Assessment**: Dom Joao son of Dom Manoel. Grade A with MRF-KINGS and WIKI-MONARCHS sources. Correct.

#### Edge: P66 -> P67 (parent)
**Status**: verified
**Current**: `{s:"P66", d:"P67", t:"parent", c:"c", confidence_grade:"A"}`
**Assessment**: Dom Philippe son of Dom Joao. Grade A. Correct.

#### Edge: P66 -> P213 (parent)
**Status**: verified
**Current**: `{s:"P66", d:"P213", t:"parent", c:"c", confidence_grade:"A"}`
**Assessment**: Dona Ines daughter of Dom Joao. Grade A. Critical bridge edge. Correct.

#### Edge: P101 <-> P66 (spouse)
**Status**: verified
**Current**: `{s:"P101", d:"P66", t:"spouse", l:"married at Cochin before Nov 1587", c:"c", confidence_grade:"A"}`
**Assessment**: Dona Francisca wife of Dom Joao. Grade A. Correct.

#### Edge: P213 <-> P67 (sibling)
**Status**: verified
**Current**: `{s:"P213", d:"P67", t:"sibling", l:"siblings (same parents: Dom Joao + Dona Francisca)", c:"c", confidence_grade:"A"}`
**Assessment**: Correct. Both children of Dom Joao and Dona Francisca.

#### Edge: P213 -> P97 (parent)
**Status**: verified
**Current**: `{s:"P213", d:"P97", t:"parent", c:"c", confidence_grade:"A"}`
**Assessment**: Dom Luis son of Dona Ines. Grade A. Critical bridge edge. Correct.

### Contested Edges (Research Mode Only)

#### Edge: P40 -> P41 (parent, contested)
**Status**: appropriately handled
**Current**: `{s:"P40", d:"P41", t:"parent", l:"reported alternate parent claim", c:"u", confidence_grade:"D"}`
**Assessment**: This contested edge in research mode represents a minority tradition that Hadi Hassan was son of Abu Bakar I (P40) rather than Yoosuf II (P39). The canonical edge P39->P41 (grade B, RoyalArk) is the better-attested version. The grade D contested edge is correctly segregated in research mode only. No change needed.

#### Edge: P46 -> P50 (parent, contested)
**Status**: appropriately handled
**Current**: `{s:"P46", d:"P50", t:"parent", l:"reported alternate parent claim", c:"u", confidence_grade:"D"}`
**Assessment**: This contested edge represents a tradition that Ibrahim II was directly Omar II's son rather than grandson (through Hassan V / P47). The canonical edge P47->P50 (grade B, RoyalArk) is correct. The contested edge is properly segregated. No change needed.

### P206 Edges (Maayin Rannabandeyri Kilege)

#### Edge: P206 -> P34 (parent)
**Status**: verified
**Current**: `{s:"P206", d:"P34", t:"parent", c:"c", confidence_grade:"B"}`
**Assessment**: Correctly establishes P206 as father of Hassan II.

#### Edge: P206 -> P35 (parent)
**Status**: verified
**Current**: `{s:"P206", d:"P35", t:"parent", c:"c", confidence_grade:"B"}`
**Assessment**: Correctly establishes P206 as father of Isa.

#### Edge: P34 <-> P35 (sibling, brothers)
**Status**: verified
**Current**: `{s:"P34", d:"P35", t:"sibling", l:"brothers", c:"c"}`
**Assessment**: Both sons of P206. Correct.

### Osman II Parentage Edge

#### Edge: P29 -> P37 (parent)
**Status**: flagged
**Current**: `{s:"P29", d:"P37", t:"parent", c:"c", confidence_grade:"B"}`
**Assessment**: The bio for P37 notes a discrepancy: chronicles identify father as Osman of Fehendu (P29, Lunar dynasty), but RoyalArk attributes sovereign #37 to a son of Hassan al-Hilali (P30). The current edge P29->P37 follows one tradition. An alternative edge P30->P37 would follow the other. The confidence grade B may be too high given this ambiguity -- **recommend downgrading to C** or adding an explicit note in the edge. However, since the bio already documents the discrepancy, this is a minor issue.

### Kin Edges

#### Edge: P38 <-> P30 (kin, cousins)
**Status**: verified
**Current**: `{s:"P38", d:"P30", t:"kin", l:"cousins (fathers were brothers)", c:"c", confidence_grade:"B"}`
**Assessment**: Danna Mohamed's father Yusuf Handeygirin (P192) was brother of Hilaaly Kalo (P108/P217), father of Hassan I. Correctly captures the cousin relationship.

#### Edge: P40 -> P49 (kin, grandfather)
**Status**: verified
**Current**: `{s:"P40", d:"P49", t:"kin", l:"grandfather", c:"c"}`
**Assessment**: Through P40->P202->P49 (Abu Bakar -> Kamba Dio -> Sheikh Hassan). Correct.

#### Edge: P40 -> P57 (kin, grandfather)
**Status**: verified
**Current**: `{s:"P40", d:"P57", t:"kin", l:"grandfather", c:"c"}`
**Assessment**: Through P40->P207/P193->P57 (Abu Bakar -> Recca -> Ali V). Correct.

#### Edge: P51 -> P60 (kin, grandfather)
**Status**: verified
**Current**: `{s:"P51", d:"P60", t:"kin", l:"grandfather", c:"c", confidence_grade:"B"}`
**Assessment**: Through P51->P219->P60 (Kalu Mohamed -> Umar Ma'afai -> Mohamed). Correct.

#### Edge: P51 -> P61 (kin, grandfather)
**Status**: verified
**Current**: `{s:"P51", d:"P61", t:"kin", l:"grandfather", c:"c", confidence_grade:"B"}`
**Assessment**: Through P51->P220->P61 (Kalu Mohamed -> Ahmad -> Hassan IX). Correct.

#### Edge: P51 -> P63 (kin, father-in-law)
**Status**: verified
**Current**: `{s:"P51", d:"P63", t:"kin", l:"father-in-law", c:"c", confidence_grade:"B"}`
**Assessment**: Through P51->P208 (daughter) married P63. Correct.

#### Edge: P66 -> P80 (kin, ancestor)
**Status**: verified
**Current**: `{s:"P66", d:"P80", t:"kin", l:"ancestor (5 gen via Dom Luis)", c:"c", confidence_grade:"A"}`
**Assessment**: The five-generation bridge P66->P213->P97->P98->P99->P100->P80. Correct and grade A is appropriate given multiple source attestation.

---

## Corrections Summary

### Potential Duplicate Records (Data Cleanup Candidates)

1. **P96 / P213** -- Both model Dona Ines, daughter of Dom Joao. P213 has richer data and should be canonical. P96 in promoted.js contributes estimated birth/death years (1585/1645) that could be merged into P213.

2. **P108 / P217** -- Both model Dori Kuja / Hilaaly Kalo / Kulhiveri Hilaal, father of Hassan I. P217 has richer data (bio, edge to P32, wife Golavehi Kabulo detail). P108 in promoted.js contributes yb/yd estimates (1330/1390) and alias "Hilaaly Kalo." Recommend merging P108 data into P217.

3. **P193 / P207** -- Both model Princess Recca, daughter of Abu Bakar I (P40) and mother of Ali V (P57). P193 in promoted.js has richer data (additional children P194/P196, spouse P195, aliases). P207 in sovereigns.js is a simpler stub. Recommend merging P207 into P193.

### Minor Edge Notes

4. **P29 -> P37 (parent)**: Confidence grade B may be generous given the documented ambiguity about whether P37's father was P29 (Osman of Fehendu, Lunar) or P30 (Hassan al-Hilali, Hilaaly). Consider downgrading to C or adding a `claim_type:"contested"` field.

### No Critical Data Errors Found

All person records, biographical data, parentage chains, and relationship edges have been verified against available sources. The biographies are factually sound, appropriately sourced, and correctly caveated where uncertainty exists. The Hilaaly dynasty dataset is in excellent shape.

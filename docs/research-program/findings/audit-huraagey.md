# Huraagey + Line/Addu Dynasties Audit

## Summary

This audit covers 32 persons across the Huraagey Dynasty (26 persons) and Line/Addu Line (6 persons). The Huraagey dynasty (also written "Huraa") ruled the Maldives from 1759 to 1968, making it the longest-ruling dynasty at approximately 200 years. It is the best-documented period due to British colonial records and proximity to modern times.

**Key findings:**
- **Critical duplicate detected**: P155 (Maandhoogey Bodu Dhorhy Manippulu) and P222 (Hassan Izz ud-din) are the SAME person. Both are documented as sons of P86 and fathers of P88 and P92. P155 uses the house-name/title, P222 uses the personal name. This creates duplicate parent edges.
- **Contested edges P88->P95 and P86->P95**: The maternal link is well-documented. P95's mother was Princess Don Goma (P129), daughter of Ibrahim Nooredine II (P87). P87 was son of P86. So P86 IS an ancestor of P95 (great-grandfather via maternal line). P88 is NOT a grandfather of P95. P95's father was Abdul Majeed Didi (P111), whose connection to P88 is not established. The edges should be corrected.
- **P129 bio is wrong**: The existing enrichments bio for P129 describes a different person (Prince Ibrahim Faamuladheyri Kilegefaanu). The actual P129 is Princess Veyogey Dhon Goma, mother of Mohamed Farid.
- **Birth year corrections**: P80 (Hassan Izzuddine) born ~1720 per Wikipedia, dataset has 1728. P91 (Shamsuddeen III) born November 1879 per RoyalArk (dataset corrected in notes). P92 born October 25, 1868 per Wikipedia (dataset notes say "ca. 1863").
- **P190 (Hassan Fareed Didi)**: Birth year should be 1901 (not 1904), death year 1944 (not 1988) -- killed when ship torpedoed by U-boat.
- Most existing biographies are thorough and accurate. A few minor persons lack biographies.

---

## Person Audits

### P80 -- Hassan Izzuddine (Huraagey)
**Status**: verified, minor date correction
**Bio**: (Existing bio in enrichments is thorough and accurate)
Hassan Izzuddine, popularly known as Dhon Bandaarain, was the founder of the Huraagey dynasty and one of the most consequential figures in Maldivian history. Born around 1720 (Wikipedia gives April 14, 1720; dataset has 1728), he was the son of Mohamed Faamuladeyri Thakurufan (P100). He traced his lineage through five generations back to Dom Joao (P66) of the Portuguese-era Hilaaly house. He liberated the Maldives from Malabar (Cannanore) occupation, serving as de facto regent from c.1754 and being installed as sultan on December 7, 1759. He died on February 1, 1767. The Huraagey dynasty he founded ruled until 1968.
**Notes**:
- Birth year: Wikipedia gives 1720, dataset has 1728. The 1720 date appears more reliable (sourced from multiple references). Consider updating.
- Death year: February 1, 1767 per sources vs. dataset yd:1770. Discrepancy. RoyalArk and Wikipedia consistently give 1767.
- Existing enrichment bio is excellent and comprehensive.

### P82 -- Mohamed Shamsuddine II (Huraagey)
**Status**: verified
**Bio**: (Existing bio in enrichments is accurate)
Mohamed Shamsuddine II held the throne for approximately five months in 1774. His father was Hussain Bodu Dorimena Kilegefanu (P154). He seized the throne on December 22, 1773, following the drowning of the Dhiyamigili sultan Mohamed Ghiyathuddine (P81), and abdicated in May 1774 in favor of his cousin Mohamed Muizzuddine (P83), the son of the Huraagey founder. He died on March 31, 1779.
**Notes**: Existing bio is good. Father confirmed as P154 (Hussain Bodu Dorimena Kilegefanu).

### P83 -- Mohamed Muizzuddine (Huraagey)
**Status**: verified
**Bio**: (Existing enrichment bio is accurate)
Mohamed Muizzuddine, popularly known as Kalhu Bandaarain, was the eldest son of the Huraagey founder Hassan Izzuddine (P80) and consolidated the new dynasty. He reigned from 1774 to 1779 after his cousin P82 abdicated. His mother was Amina Bodu Didi (P184). He died September 13, 1779 at Male.
**Notes**: Well-documented. Mother P184 (Kakaagey Aminah Bodu Didi) confirmed in edges.

### P84 -- Hassan Nooredine I (Huraagey)
**Status**: verified
**Bio**: (Existing enrichment bio is thorough)
Hassan Nooredine I, whose birth name was Prince Ali, was the younger son of Huraagey founder Hassan Izzuddine (P80). Born before July 13, 1763 (dataset has yb:1755). He reigned from 1779 to 1799. He died June 2, 1799 at Jeddah from smallpox contracted during the Hajj pilgrimage. His son Mohamed Mueenuddine I (P85) succeeded him.
**Notes**:
- Birth year: dataset has 1755, RoyalArk says "before July 13, 1763." Could update yb to 1763 or keep 1755 as approximate.
- Death year: died 1799, dataset has yd:1805. Discrepancy. Should update to 1799.
- Existing bio is excellent.

### P85 -- Mohamed Mueenuddine I (Huraagey)
**Status**: verified
**Bio**: (Existing enrichment bio is accurate)
Mohamed Mueenuddine I was the son and successor of Hassan Nooredine I (P84). He was appointed regent January 24, 1799 when his father departed for the Hajj, and became sultan upon his father's death at Jeddah. He reigned for 36 years (1799-1835), the longest of the early Huraagey period. He married twice, including Khadija Didi (P187). His son Mohamed Imaduddine IV (P86) succeeded him. He died January 21, 1835.
**Notes**: Existing bio is good. Spouse P187 (Athireegey Khadeeja Didi) confirmed in promoted edges.

### P86 -- Mohamed Imaduddine IV (Huraagey)
**Status**: verified
**Bio**: (Existing enrichment bio is thorough)
Mohamed Imaduddine IV reigned for an extraordinary 47 years from 1835 to 1882, the longest reign of any Huraagey sultan. Wikipedia gives his reign as 1835-1883, so the end date should be verified. He was the son of P85 and his wife Khadija Didi. His first wife was Kudaeduruge Zulaikha Rani Kilege (P188), a commoner elevated to noble rank. His children included Sultan Ibrahim Nooredine II (P87) and a blind son, Hassan Izz ud-din (P222/P155), who was excluded from succession but whose sons P88 and P92 both became sultans. He also had an eldest son, Maandhoogey Bodu Dhorhy Manippulu (P155), though as noted this appears to be the same person as P222.
**Notes**:
- Wikipedia gives his reign ending in 1883, not 1882. The death/end date should be checked.
- See critical note on P155/P222 duplicate below.

### P87 -- Ibrahim Nooredine II (Huraagey)
**Status**: verified
**Bio**: (Existing enrichment bio is thorough)
Ibrahim Nooredine II was the son of Mohamed Imaduddine IV (P86) and his commoner wife Zulaikha Rani Kilege (P188). He held the throne across two accessions: 1882-1886 and 1888-1892. Between his accessions, his nephew P88 briefly ruled. He had five wives, including Kakage Don Goma (P185, mother of P91) and Bodugaluge Don Didi (mother of P90). He died November 29, 1892. Through his daughter Princess Don Goma (P129), he was the maternal grandfather of the last sultan P95.
**Notes**:
- Confirmed: two accessions, 1882-1886 and 1888-1892.
- He established the Maldivian security force during his second reign.
- Existing bio is excellent.

### P88 -- Mohamed Mueenuddine II (Huraagey)
**Status**: verified, edge correction needed
**Bio**: (Existing enrichment bio is accurate)
Mohamed Mueenuddine II reigned from 1886 to 1888 between the two accessions of his uncle Ibrahim Nooredine II (P87). His father was Hassan Izz ud-din (P222), the blind son of P86. His mother was Handeygirige Aisha Bodu Didi (P189). He married twice and fathered Hassan Nooredine II (P94). He died September 23, 1892.
**Notes**:
- The kin edge P88->P95 "grandfather?" (c:"u") is INCORRECT. P88 is the father of P94 (Hassan Nooredine II), but P95's father is Abdul Majeed Didi (P111), NOT a son of P88. P88 has no documented grandfather relationship to P95. The edge should be downgraded or removed.
- He accepted British Protection on December 16, 1887 -- a momentous act.

### P90 -- Mohamed Imaduddine V (Huraagey)
**Status**: verified
**Bio**: (Existing enrichment bio is accurate)
Mohamed Imaduddine V was one of the youngest and shortest-reigning sultans. Born 1884 at Male, son of Ibrahim Nooredine II (P87) and Bodugaluge Don Didi. Placed on the throne as an infant but deposed after three months. He died in June 1920 at Bombay while en route to Mecca.
**Notes**: Bio is good. Dataset re:[[1892,1892]] is correct for his brief reign.

### P91 -- Mohamed Shamsuddine III (Huraagey)
**Status**: verified
**Bio**: (Existing enrichment bio is thorough)
Mohamed Shamsuddine III was the sultan who ushered the Maldives into the modern constitutional era. Born November 1879 (dataset birth year corrected from earlier 1863 confusion). Son of Ibrahim Nooredine II (P87) and Kakage Don Goma (P185). He proclaimed the first Maldivian Constitution on December 22, 1932. He had two accessions: briefly in 1892-1893, then from 1903-1933. Deposed for unconstitutional conduct October 2, 1934. Died March 12, 1935.
**Notes**:
- Dataset re:[[1892,1892],[1903,1933]] is correct.
- Birth year confirmed as November 1879 by RoyalArk.
- His son, Crown Prince Hassan Izzuddine (Henveyru Ganduvaru Manippulu, born 1901, died 1940), was discredited and banished to Fuvahmulah in 1934. This Crown Prince is NOT in our dataset and should NOT be confused with P222 (the blind prince from the previous generation).

### P92 -- Mohamed Imaduddine VI (Huraagey)
**Status**: verified
**Bio**: (Existing enrichment bio is thorough)
Mohamed Imaduddine VI was born October 25, 1868 as Prince Manduge Hassan Nur ud-din. Son of the blind prince Hassan Izz ud-din (P222/P155) and Nabila Manduge Don Didi (P186, "Maandhoogey Don Didi"). Half-brother of P88. He reigned from 1892/1893 to 1903. He was deposed while abroad and went into exile in Egypt, where he died September 30, 1932.
**Notes**:
- Birth year: Wikipedia gives 1868 explicitly. Dataset has no yb but notes say "ca. 1863." Update to 1868.
- Mother P186 (Maandhoogey Don Didi) confirmed through edges.

### P94 -- Hassan Nooredine II (Huraagey)
**Status**: verified
**Bio**: (Existing enrichment bio is thorough)
Hassan Nooredine II was the penultimate sultan. Born April 21, 1887. Son of Mohamed Mueenuddine II (P88). He was invested February 23, 1935 and crowned July 21, 1938. He was awarded KCMG by the British in 1942 for services during WWII. Forced to abdicate April 8, 1943. He died April 15, 1967.
**Notes**:
- Dataset dates confirmed: yb:1887, yd:1967, re:[[1933,1943]].
- His son Muhammad Nur ud-din became Head of the Royal House after the monarchy's abolition.
- Existing bio is excellent.

### P95 -- Mohamed Farid (Huraagey)
**Status**: verified, contested edges need correction
**Bio**: (Existing enrichment bio is thorough and accurate)
Mohamed Farid was the last sultan of the Maldives. Born January 11, 1901. Son of Abdul Majeed Didi (P111) and Princess Veyogey Don Goma (P129, daughter of P87). He was educated at Royal College Colombo for 7 years. He served as Prime Minister under Sultan Hassan Nooredine II from December 16, 1932. Elected as the 84th Sultan on January 22, 1954 (formally proclaimed March 6/7, 1954). When the British protectorate ended July 26, 1965, he assumed the title "King." The monarchy was abolished by referendum (81.23% voted for republic) on March 15, 1968, and the Republic was declared November 11, 1968. He died May 27, 1969, receiving a state funeral despite the recent establishment of the republic.
**Notes**:
- **P88->P95 edge ("grandfather?", c:"u")**: This is INCORRECT. P95's father was P111 (Abdul Majeed Didi). P95's mother was P129 (Don Goma, daughter of P87). There is no grandfather relationship through P88. This edge should be removed or corrected.
- **P86->P95 edge ("ancestor?", c:"u")**: This IS correct but can be strengthened. P86 -> P87 (parent) -> P129 (daughter via P185) -> P95 (parent). So P86 is P95's great-grandfather via maternal line. The edge should be upgraded from c:"u" to c:"c" with label "great-great-grandfather (maternal line)" and the confidence improved.
- **P87->P95 edge ("grandfather via daughter", c:"c")**: This is CORRECT. P87 -> P129 (daughter) -> P95.
- Existing bio is excellent.

### P129 -- Princess Veyogey Dhon Goma (Huraagey)
**Status**: revised (bio needs correction)
**Bio**:
Princess Veyogey Dhon Goma, also known as Ruqia Don Goma, was a princess of the Huraagey royal house and the mother of the last three Fareed brothers. She was the daughter of Sultan Ibrahim Nooredine II (P87) and Kakage Don Goma (P185). She married Abdul Majeed Didi (P111), and bore him three sons: Mohamed Farid (P95), the last sultan of the Maldives; Hassan Fareed Didi (P190); and Ibrahim Fareed Didi (P191). She was reportedly offered the crown of the Maldives in 1953 at the end of President Amin Didi's republic, but refused after hearing objections from the clergy. A historical photograph shows her receiving medical treatment at a hospital abroad.
**Notes**:
- **CRITICAL**: The existing enrichment bio for P129 is WRONG -- it describes "Prince Ibrahim Faamuladheyri Kilegefaanu" (which is P130, a different person). The bio must be replaced.
- Dataset yb:1880, yd:1955 are reasonable estimates.
- Edges confirmed: P129->P95 (parent), P129->P190 (parent), P129->P191 (parent), P185->P129 (parent from Kakage Don Goma, maternal grandmother of P95).

### P154 -- Hussain Bodu Dorhimeyna Kilege (Huraagey)
**Status**: verified
**Bio**:
Hussain Bodu Dorhimeyna Kilegefaanu was a member of the Huraagey royal family and the father of Sultan Mohamed Shamsuddine II (P82). He was documented as the uncle of Sultan Hassan Izzuddine (P80), placing him as a collateral elder in the founding generation of the Huraagey dynasty. His "Bodu Dorhimeyna Kilege" title designates the senior Dorhimeyna court position paired with the Kilege peerage title. He was born approximately 1710 and died approximately 1785.
**Notes**: Edges confirmed: P154->P82 (parent), P154<->P80 (uncle/nephew kin). Data is consistent.

### P155 -- Maandhoogey Bodu Dhorhy Manippulu (Huraagey)
**Status**: **FLAGGED -- PROBABLE DUPLICATE OF P222**
**Bio**:
Maandhoogey Bodu Dhorhy Manippulu was the eldest son of Sultan Mohamed Imaduddine IV (P86). He is documented as the father of both Sultan Mohamed Mueenuddine II (P88) and Sultan Mohamed Imaduddine VI (P92).
**Notes**:
- **CRITICAL DUPLICATE**: P155 and P222 appear to be the SAME person. Both are:
  - Sons of P86 (Mohamed Imaduddine IV)
  - Fathers of P88 (Mohamed Mueenuddine II)
  - Fathers of P92 (Mohamed Imaduddine VI)
- P155 uses the house-name/title ("Maandhoogey Bodu Dhorhy Manippulu"), while P222 uses the personal name ("Hassan Izz ud-din") with the detail of blindness.
- RoyalArk page (maldive15) likely refers to the same person under both designations.
- Both have identical parent edges to P86, P88, P92, and even to P186 (spouse edge for P155, mother edge via P222).
- **Recommendation**: Merge P155 into P222 (which has the richer personal name and blindness detail). Add aliases "Maandhoogey Bodu Dhorhy Manippulu" and "Bodu Dorhy Manippulu" to P222. Remove P155 and redirect all edges. OR keep P222 as canonical and add P155 as alias.

### P184 -- Kakaagey Aminah Bodu Didi (Huraagey)
**Status**: verified
**Bio**:
Kakaagey Aminah Bodu Didi, also known as Amina Bodu Didi or Amina Manikufa'anu, was the wife of Sultan Hassan Izzuddine (P80), the founder of the Huraagey dynasty. She was the mother of Sultan Mohamed Muizzuddine (P83), the second Huraagey sultan. Through her sons, she became the ancestral matriarch of the Huraagey royal house.
**Notes**:
- Edge P184->P83 (parent) confirmed.
- RoyalArk describes P80's wife as "Amina Manikufa'anu (Bodu Didi)" which matches.
- Dataset yb:1728, yd:1798 are reasonable estimates.

### P185 -- Kakaagey Dhon Goma (Huraagey)
**Status**: verified
**Bio**:
Kakaagey Dhon Goma, also known as Kakage Don Goma, was a wife of Sultan Ibrahim Nooredine II (P87) and the mother of Sultan Mohamed Shamsuddine III (P91). She was also the maternal grandmother of Princess Veyogey Dhon Goma (P129), establishing a female line that connected the Huraagey sultanate to its final ruler. Her name appears in the RoyalArk genealogical record as "Kakage Don Goma."
**Notes**:
- Edges confirmed: P185->P91 (parent), P185->P129 (parent).
- Dataset yb:1845, yd:1910 are reasonable estimates.
- The fact that says she was "maternal ancestor in the Don Goma branch linked to P95" is confirmed: P185->P129->P95.

### P186 -- Maandhoogey Don Didi (Huraagey)
**Status**: verified
**Bio**:
Maandhoogey Don Didi, also known as Nabila Manduge Don Didi, was the wife of the blind prince Hassan Izz ud-din (P222/P155) and the mother of Sultan Mohamed Imaduddine VI (P92). She was from the Maandhoogey household, one of the notable noble houses of Male. Through her son P92, she connected the blind prince's line to the 1892-1903 sultanate.
**Notes**:
- Edges confirmed: P186->P92 (parent), P155<->P186 (spouse).
- Dataset yb:1842, yd:1915 are reasonable estimates.

### P187 -- Athireegey Khadeeja Didi (Huraagey)
**Status**: verified
**Bio**:
Athireegey Khadeeja Didi, also known as Khadija Didi, was a wife of Sultan Mohamed Mueenuddine I (P85). She was from the Athireegey household. Through her marriage to P85, she was the mother of Sultan Mohamed Imaduddine IV (P86), the longest-reigning Huraagey sultan. The RoyalArk record identifies her as "Khadija Didi, second wife."
**Notes**:
- Edge confirmed: P85<->P187 (spouse).
- Dataset yb:1765, yd:1835 are reasonable estimates.
- Note: The enrichment bio for P85 says "second wife Khadija Didi" was P86's mother, confirming this connection.

### P188 -- Kudaedurugey Zulekha Rani Kilegefan (Huraagey)
**Status**: verified
**Bio**:
Kudaedurugey Zulekha Rani Kilegefan, also known as Zulaikha Rani Kilege, was the first wife of Sultan Mohamed Imaduddine IV (P86). She was notable as a commoner whom the sultan elevated to noble rank, a gesture that demonstrated royal prerogative. She was the mother of Sultan Ibrahim Nooredine II (P87), who ruled across two accessions. Her Kilege title was bestowed by her husband.
**Notes**:
- Edge confirmed: P86<->P188 (spouse).
- Confirmed as mother of P87 in the enrichment bio for P86 and P87.
- Dataset yb:1808, yd:1885 are reasonable estimates.

### P189 -- Handeygirigey Didi (Huraagey)
**Status**: verified
**Bio**:
Handeygirigey Didi, also known as Handeygirige Kahambuge Aisha Bodu Didi, was the mother of Sultan Mohamed Mueenuddine II (P88). She was from the Handeygirige household. Her son P88 was fathered by the blind prince Hassan Izz ud-din (P222/P155), who was excluded from the succession due to blindness.
**Notes**:
- Edge confirmed: P189->P88 (parent).
- The enrichment bio for P88 identifies his mother as "Handeygirige Kahambuge Aisha Bodu Didi," which matches.
- Dataset yb:1850, yd:1918 are reasonable estimates.

### P190 -- Hassan Fareed Didi (Huraagey)
**Status**: **REVISED -- birth/death years need correction**
**Bio**:
Prince Hassan Fareed Didi (1901-1944) was a Maldivian royal and statesman, the younger son of Abdul Majeed Didi (P111) and Princess Veyogey Don Goma (P129). He was the brother of King Mohamed Farid (P95, the last sultan) and Ibrahim Fareed Didi (P191). Educated at Royal College Colombo in Ceylon, he returned to Male in the 1920s. He served as treasurer and Minister of Finance (1932-1942), and Minister for Home Affairs (1934-1939). During World War II, he served as the Maldives' Plenipotentiary Representative in Ceylon from 1942. He was killed on March 27, 1944, when his ship, the British naval trawler HMS Maaloy (249 tons), was torpedoed by German submarine U-510 while en route to Colombo.
**Notes**:
- **CRITICAL DATE CORRECTIONS**: Dataset has yb:1904, yd:1988. Wikipedia gives birth 1901, death 1944. Must update.
- Edges confirmed: P111->P190 (parent), P129->P190 (parent).
- His death at sea during WWII is historically significant and well-documented.

### P191 -- Ibrahim Fareed Didi (Huraagey)
**Status**: verified, minor note
**Bio**:
Ibrahim Fareed Didi was the youngest son of Abdul Majeed Didi (P111) and Princess Veyogey Don Goma (P129). He was the brother of King Mohamed Farid (P95) and Hassan Fareed Didi (P190). He served as Minister of Education (Vazeerul Ma'aarif) from 1952 to 1953, Speaker of the People's Majlis from March 1, 1954 to October 3, 1959, and later as acting Minister of Justice (1982-1983) and Deputy Minister of Justice (1984). Unlike his brother Hassan, who died during WWII, Ibrahim survived into old age.
**Notes**:
- Dataset has yb:1906, yd:1987. These appear reasonable given his documented career extending into the 1980s.
- Edges confirmed: P111->P191 (parent), P129->P191 (parent).

### P222 -- Hassan Izz ud-din (Huraagey)
**Status**: verified, duplicate flag (see P155)
**Bio**: (Existing enrichment bio is thorough and accurate)
Hassan Izz ud-din was the blind son of Sultan Mohamed Imaduddine IV (P86). His disability excluded him from the succession according to Maldivian custom. Despite never reigning himself, both of his sons became sultans: Mohamed Mueenuddine II (P88) and Mohamed Imaduddine VI (P92). His wife Handeygirige Aisha Bodu Didi (P189) bore P88, while Nabila Manduge Don Didi (P186) bore P92.
**Notes**:
- **PROBABLE DUPLICATE of P155** (see P155 notes above). The same person is represented twice with different names.
- Existing bio is excellent.
- This figure should NOT be confused with the later Crown Prince Hassan Izzuddine (son of Shamsuddeen III, born 1901, died 1940), who was also removed from succession but for political rather than medical reasons.

---

## Line / Addu Line Persons

### P132 -- Al-Naib Muhammad Thakurufaanu of Addu (Addu Line)
**Status**: verified, limited records
**Bio**:
Al-Naib Muhammad Thakurufaanu was a leading figure from Addu Atoll who held the title of Al-Naib (deputy/representative), indicating a position of local governance authority. He is documented as an ancestor in the maternal line of Abdul Gayoom Ibrahim (P120, President Maumoon Abdul Gayoom's father). The "Thakurufaanu" designation indicates noble rank. His dates (approximately 1835-1910) place him in the period of British protectorate consolidation.
**Notes**:
- Edge: P132->P133 (kin, "grandparental line context"). This is a kin edge, not a parent edge, suggesting the exact generational relationship is uncertain.
- Limited independent sources beyond the Gayoom family genealogy chain.

### P133 -- Ibrahim Al-Husainee (Addu Line)
**Status**: verified, limited records
**Bio**:
Ibrahim Al-Husainee was an intermediate figure in the maternal ancestry chain connecting Addu Atoll to the Gayoom political family. He was the grandchild of Al-Naib Muhammad Thakurufaanu (P132) and the father of Galolhu Seedhi (P134). His "Al-Husainee" nisbah suggests either descent from a family claiming Husaini (Shia) lineage or connection to a Husainee scholarly tradition, though the Maldives is Sunni.
**Notes**:
- Edges: P132->P133 (kin), P133->P134 (parent).
- Dataset yb:1865, yd:1935 are estimated.

### P134 -- Galolhu Seedhi (Addu Line)
**Status**: verified, limited records
**Bio**:
Galolhu Seedhi was the daughter of Ibrahim Al-Husainee (P133) and the mother of Galolhu Sitti (P135). The "Galolhu" prefix indicates her household was in the Galolhu ward of Male, suggesting the family had relocated from Addu to the capital at some point. She is an intermediate maternal node in the Gayoom ancestry chain.
**Notes**:
- Edges: P133->P134 (parent), P134->P135 (parent).
- Dataset yb:1895, yd:1970 are estimated.

### P135 -- Galolhu Sitti (Addu Line)
**Status**: verified, limited records
**Bio**:
Galolhu Sitti was the mother of Abdul Gayoom Ibrahim (P120), the father of President Maumoon Abdul Gayoom (P119) and former President Abdulla Yameen (P121). She was the daughter of Galolhu Seedhi (P134), continuing the maternal line from the Addu-based Al-Naib Muhammad Thakurufaanu. Her position as the direct maternal link to the Gayoom political family gives her genealogical significance in modern Maldivian politics.
**Notes**:
- Edges: P134->P135 (parent), P135->P120 (parent).
- Dataset yb:1920, yd:1990 are estimated.

### P182 -- El-Naib Ganduvaru Mohamed Thakurufan (Addu Line)
**Status**: verified, limited records
**Bio**:
El-Naib Ganduvaru Mohamed Thakurufan was a leading Meedhoo/Addu lineage figure who married Princess Aishath Didi (P180), a member of the Dhiyamigili-South branch. His "El-Naib" title indicates he served as a deputy or local administrator in the southern atolls. He was based in Meedhoo, Addu Atoll, a settlement with deep historical roots in Maldivian history.
**Notes**:
- Edges: P180<->P182 (spouse), P182->P183 (parent).
- The marriage connected the Dhiyamigili exile lineage with the Addu local elite.
- Dataset yb:1796, yd:1865 are estimated.

### P183 -- Ganduvaru Hassan Didi (Addu Line)
**Status**: verified, limited records
**Bio**:
Ganduvaru Hassan Didi was the son of Princess Aishath Didi (P180) and El-Naib Ganduvaru Mohamed Thakurufan (P182). He was an intermediate figure in the Dhiyamigili-South to Addu lineage branch, based in Meedhoo, Addu Atoll. The "Didi" title indicates noble rank.
**Notes**:
- Edges: P180->P183 (parent), P182->P183 (parent). Both parents confirmed.
- Person confidence is "C" (lower than most), reflecting limited documentation.
- Dataset yb:1822, yd:1895 are estimated.

---

## Edge Audits

### Huraagey Core Succession Edges

#### Edge: P80 -> P83 (parent)
**Status**: verified
**Assessment**: Confirmed. P83 (Mohamed Muizzuddine) was the eldest son of P80 (Hassan Izzuddine). Multiple sources agree.

#### Edge: P83 <-> P84 (sibling, brothers)
**Status**: verified
**Assessment**: Confirmed. Both sons of P80. P83 was the elder, P84 the younger.

#### Edge: P80 -> P84 (parent, inferred)
**Status**: verified
**Assessment**: Confirmed. The inferred status is appropriate since the sibling relationship implies parentage, but direct statement of P80 as father of P84 comes from multiple sources.

#### Edge: P82 <-> P83 (kin, cousins)
**Status**: verified
**Assessment**: Confirmed. P82's father was Hussain Bodu Dorimena (P154), who was the uncle of P80 (father of P83). So P82 and P83 are cousins.

#### Edge: P84 -> P85 (parent)
**Status**: verified
**Assessment**: Confirmed.

#### Edge: P85 -> P86 (parent)
**Status**: verified
**Assessment**: Confirmed. P86 was son of P85's second wife Khadija Didi (P187).

#### Edge: P86 -> P87 (parent)
**Status**: verified
**Assessment**: Confirmed. P87 was son of P86 and Zulaikha Rani Kilege (P188).

#### Edge: P87 <-> P88 (kin, uncle/nephew)
**Status**: verified
**Assessment**: Confirmed. P87 was P86's son directly. P88 was P86's grandson through the blind prince P222. So P87 was P88's uncle.

#### Edge: P86 <-> P88 (kin, grandfather)
**Status**: verified
**Assessment**: Confirmed. P86 -> P222 -> P88.

#### Edge: P88 -> P94 (parent)
**Status**: verified
**Assessment**: Confirmed. P94 (Hassan Nooredine II) was the son of P88.

#### Edge: P87 -> P90 (parent)
**Status**: verified
**Assessment**: Confirmed. P90 was infant son of P87.

#### Edge: P87 -> P91 (parent)
**Status**: verified
**Assessment**: Confirmed. P91 was son of P87 and Kakage Don Goma (P185).

#### Edge: P90 <-> P91 (sibling, half-brothers)
**Status**: verified
**Assessment**: Confirmed. Same father (P87), different mothers.

#### Edge: P86 <-> P92 (kin, grandfather)
**Status**: verified
**Assessment**: Confirmed. P86 -> P222 -> P92.

#### Edge: P87 <-> P92 (kin, uncle/nephew, inferred)
**Status**: verified
**Assessment**: Confirmed. P87 was P92's uncle (both grandsons of P86 through different sons).

#### Edge: P88 <-> P92 (sibling, half-brothers same father)
**Status**: verified
**Assessment**: Confirmed. Both sons of the blind prince P222. Different mothers.

### Contested Edges (Critical Investigation)

#### Edge: P88 -> P95 (kin, "grandfather?", c:"u", contested)
**Status**: **CORRECTED -- should be removed or relabeled**
**Assessment**: This edge is NOT supported. P95's father was Abdul Majeed Didi (P111). P95's mother was Princess Don Goma (P129, daughter of P87). There is no documented grandfather relationship through P88.

The confusion may arise from the following:
- P94 (Hassan Nooredine II) was son of P88.
- P95 served as Prime Minister under P94.
- P95's mother was P129 (daughter of P87, NOT P88).
- P95's father P111 (Abdul Majeed Didi) was not a documented descendant of P88.

**Recommendation**: Remove this edge entirely OR downgrade to a label like "no direct ancestor relationship confirmed" with c:"u".

#### Edge: P86 -> P95 (kin, "ancestor?", c:"u", contested)
**Status**: **CORRECTED -- should be upgraded**
**Assessment**: This IS a valid ancestral relationship but through the MATERNAL line:
- P86 -> P87 (parent) -> P129 (daughter, via mother P185) -> P95 (parent)
- P86 is P95's great-grandfather through the maternal line.

**Recommendation**: Upgrade to c:"c" with label "great-grandfather (maternal line via P87->P129)" and confidence_grade "B". Evidence: P86->P87 (confirmed parent), P87 had daughter P129 (confirmed), P129->P95 (confirmed parent).

#### Edge: P87 -> P95 (kin, "grandfather via daughter", c:"c")
**Status**: verified
**Assessment**: Confirmed. P87's daughter P129 was the mother of P95. This is correct.

### Duplicate Person Edges

#### P86 -> P155 (parent) and P86 -> P222 (parent)
**Status**: **FLAGGED -- duplicate**
**Assessment**: Both edges state P86 is the father of P155 and P222 respectively. Since P155 and P222 are the same person, one set of edges should be removed.

#### P155 -> P88 (parent) and P222 -> P88 (parent)
**Status**: **FLAGGED -- duplicate**
**Assessment**: Same issue. Both state the same parentage from different IDs for the same person.

#### P155 -> P92 (parent) and P222 -> P92 (parent)
**Status**: **FLAGGED -- duplicate**
**Assessment**: Same issue.

#### P155 <-> P186 (spouse) and P222 (implied connection to P186)
**Status**: **FLAGGED -- needs merge**
**Assessment**: P155 has a spouse edge to P186 (mother of P92). P222's enrichment bio identifies "Nabila Manduge Don Didi" as mother of P92. If merged, the spouse edge should transfer to P222.

### Promoted File Edges

#### Edge: P154 -> P82 (parent)
**Status**: verified
**Assessment**: Confirmed. P154 (Hussain Bodu Dorhimeyna) was the father of P82 (Mohamed Shamsuddine II).

#### Edge: P154 <-> P80 (kin, uncle/nephew)
**Status**: verified
**Assessment**: Confirmed. P154 was the uncle of P80.

#### Edge: P184 -> P83 (parent)
**Status**: verified
**Assessment**: Confirmed. P184 (Kakaagey Aminah Bodu Didi) was the mother of P83 (Mohamed Muizzuddine).

#### Edge: P185 -> P129 (parent)
**Status**: verified
**Assessment**: Confirmed. P185 (Kakaagey Dhon Goma) was the mother of P129 (Princess Don Goma).

#### Edge: P185 -> P91 (parent)
**Status**: verified
**Assessment**: Confirmed. P185 was also the mother of P91 (Shamsuddine III). This makes P91 and P129 siblings (through their mother).

#### Edge: P186 -> P92 (parent)
**Status**: verified
**Assessment**: Confirmed. P186 (Maandhoogey Don Didi) was the mother of P92.

#### Edge: P189 -> P88 (parent)
**Status**: verified
**Assessment**: Confirmed. P189 (Handeygirigey Didi) was the mother of P88.

#### Edge: P85 <-> P187 (spouse)
**Status**: verified
**Assessment**: Confirmed. P187 (Athireegey Khadeeja Didi) was wife of P85.

#### Edge: P86 <-> P188 (spouse)
**Status**: verified
**Assessment**: Confirmed. P188 (Kudaedurugey Zulekha Rani Kilegefan) was wife of P86.

#### Edge: P86 -> P155 (parent)
**Status**: verified (but duplicate of P86->P222)
**Assessment**: Confirmed. But this is the same relationship as P86->P222.

#### Edge: P155 <-> P186 (spouse)
**Status**: verified (but should be on P222)
**Assessment**: Confirmed. P155/P222 married P186.

#### Edge: P129 -> P95 (parent)
**Status**: verified
**Assessment**: Confirmed. P129 (Princess Don Goma) was the mother of P95 (Mohamed Farid).

#### Edge: P129 -> P190 (parent)
**Status**: verified
**Assessment**: Confirmed. P129 was also the mother of Hassan Fareed Didi (P190).

#### Edge: P129 -> P191 (parent)
**Status**: verified
**Assessment**: Confirmed. P129 was also the mother of Ibrahim Fareed Didi (P191).

#### Edge: P111 -> P95 (parent)
**Status**: verified
**Assessment**: Confirmed. P111 (Abdul Majeed Didi) was the father of P95.

#### Edge: P111 -> P190 (parent)
**Status**: verified
**Assessment**: Confirmed. P111 was the father of P190.

#### Edge: P111 -> P191 (parent)
**Status**: verified
**Assessment**: Confirmed. P111 was the father of P191.

### Addu Line Edges

#### Edge: P132 -> P133 (kin, "grandparental line context")
**Status**: verified
**Assessment**: The kin (rather than parent) type reflects uncertainty about whether the relationship is grandparent-grandchild or spans additional generations. Reasonable for the available evidence.

#### Edge: P133 -> P134 (parent)
**Status**: verified
**Assessment**: Confirmed from Gayoom maternal ancestry reporting.

#### Edge: P134 -> P135 (parent)
**Status**: verified
**Assessment**: Confirmed.

#### Edge: P135 -> P120 (parent)
**Status**: verified
**Assessment**: Confirmed. P135 (Galolhu Sitti) was the mother of P120 (Abdul Gayoom Ibrahim).

#### Edge: P180 -> P183 (parent)
**Status**: verified
**Assessment**: Confirmed. P180 (Princess Aishath Didi) was the mother of P183.

#### Edge: P182 -> P183 (parent)
**Status**: verified
**Assessment**: Confirmed. P182 (El-Naib Mohamed Thakurufan) was the father of P183.

#### Edge: P180 <-> P182 (spouse)
**Status**: verified
**Assessment**: Confirmed.

---

## Corrections Summary

### Critical Issues

1. **P155 / P222 DUPLICATE**: These two person IDs represent the same individual -- the blind son of Sultan Mohamed Imaduddine IV (P86), father of sultans P88 and P92. P155 uses the house-name "Maandhoogey Bodu Dhorhy Manippulu" while P222 uses the personal name "Hassan Izz ud-din." Merge recommended (keep P222 as canonical, add P155 names as aliases). Remove duplicate edges.

2. **P88->P95 contested edge**: Should be REMOVED. No grandfather relationship exists between P88 and P95. P95's parents are P111 (father) and P129 (mother). Neither descends from P88.

3. **P86->P95 contested edge**: Should be UPGRADED from c:"u" to c:"c". P86 IS P95's great-grandfather via maternal line (P86->P87->P129->P95).

4. **P129 enrichment bio**: The current bio text describes the WRONG person (P130). Must be replaced with correct biography of Princess Veyogey Dhon Goma.

### Date Corrections

| ID   | Field | Current | Corrected | Source |
|------|-------|---------|-----------|--------|
| P80  | yb    | 1728    | 1720      | Wikipedia, multiple sources give April 14, 1720 |
| P80  | yd    | 1770    | 1767      | Wikipedia, RoyalArk give February 1, 1767 |
| P84  | yd    | 1805    | 1799      | RoyalArk gives June 2, 1799 (died at Jeddah) |
| P190 | yb    | 1904    | 1901      | Wikipedia "Hassan Farid Didi" article |
| P190 | yd    | 1988    | 1944      | Wikipedia: killed March 27, 1944 when ship torpedoed |

### Minor Issues

5. **P91 yb**: Dataset has yb:1879, which is correct per RoyalArk. No change needed (earlier data had 1863, already corrected in notes).

6. **P92 yb**: Not set in base data. Should add yb:1868 based on Wikipedia (born October 25, 1868).

7. **Missing sibling edge P91<->P129**: P91 and P129 share the same mother (P185, Kakaagey Dhon Goma). A sibling edge should exist but is not present in the data.

8. **P86 reign end**: Dataset has re:[[1835,1882]], but Wikipedia gives 1883 as the end of his reign. Should verify and potentially update to 1883.

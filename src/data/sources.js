// Source registry used by source_refs/evidence_refs in research mode.
export const sources = [
  {
    id: 'SRC-DERIVED-RULES',
    url: 'internal://derived-family-rules',
    title: 'Derived family relation rules',
    publisher: 'Project inference engine',
    access_date: '2026-02-06',
    quality: 'C',
    notes: 'Auto-derived sibling/grandparent/aunt-uncle/cousin relations from parent edges.'
  },
  {
    id: 'SRC-WIKI-MONARCHS',
    url: 'https://en.wikipedia.org/wiki/List_of_Maldivian_monarchs',
    title: 'List of Maldivian monarchs',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Secondary synthesis; used as cross-reference and pointer to archival material.'
  },
  {
    id: 'SRC-MRF-KINGS',
    url: 'https://maldivesroyalfamily.com/maldives_kings_list.full.shtml',
    title: 'Maldives Kings List',
    publisher: 'Maldives Royal Family',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Specialist genealogy compendium; some direct fetches blocked in environment.'
  },
  {
    id: 'SRC-MRF-HILAALY',
    url: 'https://maldivesroyalfamily.com/maldives_hilaaly.shtml',
    title: 'Royal House of Hilaaly',
    publisher: 'Maldives Royal Family',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Used for Hilaaly parentage and lineage bridge context.'
  },
  {
    id: 'SRC-MRF-HURAA',
    url: 'https://maldivesroyalfamily.com/maldives_royal_huraagey.shtml',
    title: 'Royal House of Hilaaly-Huraa',
    publisher: 'Maldives Royal Family',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Used for Hilaaly-Huraagey bridge chain.'
  },
  {
    id: 'SRC-MRF-UTHEEM',
    url: 'https://maldivesroyalfamily.com/maldives_utheem.shtml',
    title: 'Utheem Dynasty',
    publisher: 'Maldives Royal Family',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Used for Utheemu-Hilaaly extended-family claims.'
  },
  {
    id: 'SRC-ROYALARK-M5',
    url: 'https://www.royalark.net/Maldives/maldive5.htm',
    title: 'RoyalArk Maldives (segment 5)',
    publisher: 'RoyalArk',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Independent specialist genealogy cross-check.'
  },
  {
    id: 'SRC-ROYALARK-M13',
    url: 'https://www.royalark.net/Maldives/maldive13.htm',
    title: 'RoyalArk Maldives (segment 13)',
    publisher: 'RoyalArk',
    access_date: '2026-02-06',
    quality: 'C',
    notes: 'Used for Dhiyamigili-era relational cross-checking.'
  },
  {
    id: 'SRC-WIKI-DHIYAMIGILI',
    url: 'https://en.wikipedia.org/wiki/Dhiyamigili_dynasty',
    title: 'Dhiyamigili dynasty',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'C',
    notes: 'Supporting context for dynasty-transition links.'
  },
  {
    id: 'SRC-WIKI-HURAA',
    url: 'https://en.wikipedia.org/wiki/Huraa_dynasty',
    title: 'Huraa dynasty',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'C',
    notes: 'Supporting context for Dhiyamigili-to-Huraa transitions.'
  },
  {
    id: 'SRC-PERSEE-3970',
    url: 'https://www.persee.fr/doc/arch_0044-8613_2005_num_70_1_3970',
    title: 'Archipel article (record 3970)',
    publisher: 'Persee / Archipel',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Scholarly secondary context.'
  },
  {
    id: 'SRC-PERSEE-3972',
    url: 'https://www.persee.fr/doc/arch_0044-8613_2005_num_70_1_3972',
    title: 'Archipel article (record 3972)',
    publisher: 'Persee / Archipel',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Scholarly secondary context.'
  },
  {
    id: 'SRC-PO-AMIN',
    url: 'https://presidency.gov.mv/PO/FormerPresident/7',
    title: 'President Al Ameer Mohamed Amin',
    publisher: "The President's Office (Maldives)",
    access_date: '2026-02-06',
    quality: 'A',
    notes: 'Official former-president profile with parentage and dynasty line note.'
  },
  {
    id: 'SRC-PO-NASIR',
    url: 'https://presidency.gov.mv/PO/FormerPresident/6',
    title: 'President Al Ameer Ibrahim Nasir',
    publisher: "The President's Office (Maldives)",
    access_date: '2026-02-06',
    quality: 'A',
    notes: 'Official former-president profile with parent names.'
  },
  {
    id: 'SRC-PO-NASHEED',
    url: 'https://presidency.gov.mv/PO/FormerPresident/4',
    title: 'President Mohamed Nasheed',
    publisher: "The President's Office (Maldives)",
    access_date: '2026-02-06',
    quality: 'A',
    notes: 'Official profile with education and office timeline; limited family detail.'
  },
  {
    id: 'SRC-PO-YAMEEN',
    url: 'https://presidency.gov.mv/PO/FormerPresident/1',
    title: 'President Abdulla Yameen Abdul Gayoom',
    publisher: "The President's Office (Maldives)",
    access_date: '2026-02-06',
    quality: 'A',
    notes: 'Official profile confirming father and brother relation to Maumoon.'
  },
  {
    id: 'SRC-WIKI-AMIN-DIDI',
    url: 'https://en.wikipedia.org/wiki/Mohamed_Amin_Didi',
    title: 'Mohamed Amin Didi',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Supplementary family details, including spouse/descendants.'
  },
  {
    id: 'SRC-WIKI-IBRAHIM-NASIR',
    url: 'https://en.wikipedia.org/wiki/Ibrahim_Nasir',
    title: 'Ibrahim Nasir',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Supplementary genealogy and spouse/children details.'
  },
  {
    id: 'SRC-WIKI-MAUMOON',
    url: 'https://en.wikipedia.org/wiki/Maumoon_Abdul_Gayoom',
    title: 'Maumoon Abdul Gayoom',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Family and dynastic-descent summary.'
  },
  {
    id: 'SRC-WIKI-NASHEED',
    url: 'https://en.wikipedia.org/wiki/Mohamed_Nasheed',
    title: 'Mohamed Nasheed',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Spouse/children and extended family relation notes.'
  },
  {
    id: 'SRC-WIKI-GAYOOM-FAMILY',
    url: 'https://en.wikipedia.org/wiki/Gayoom_family',
    title: 'Gayoom family',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'C',
    notes: 'Family-cluster page; use only as lead and cross-check.'
  },
  {
    id: 'SRC-WIKI-ABDUL-MAJEED',
    url: 'https://en.wikipedia.org/wiki/Abdul_Majeed_Didi',
    title: 'Abdul Majeed Didi',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Contains issue list including Muhammad Fareed Didi.'
  },
  {
    id: 'SRC-WIKI-MUHAMMAD-FAREED',
    url: 'https://en.wikipedia.org/wiki/Muhammad_Fareed_Didi',
    title: 'Muhammad Fareed Didi',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Contains parentage claim to Sultan Abdul Majeed Didi.'
  },
  {
    id: 'SRC-PO-MAUMOON',
    url: 'https://presidency.gov.mv/PO/FormerPresident/5',
    title: 'President Uz. Maumoon Abdul Gayoom',
    publisher: "The President's Office (Maldives)",
    access_date: '2026-02-06',
    quality: 'A',
    notes: 'Official profile page; limited family details in accessible excerpt.'
  },
  {
    id: 'SRC-ATOLL-NASHEED-PARENTS',
    url: 'https://atolltimes.mv/post/news/3844',
    title: "Nasheed's parents sign up to The Democrats",
    publisher: 'Atoll Times',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Explicitly names mother as Abida Mohamed and father as Abdul Sattar Umar.'
  },
  {
    id: 'SRC-OPENLIB-NASHEED-1800-1900',
    url: 'https://openlibrary.org/works/OL6053026W/Maldives_a_historical_overview_of_traditional_Dhivehi_polity_1800-1900',
    title: 'Maldives, a historical overview of traditional Dhivehi polity, 1800-1900',
    publisher: 'Open Library (catalog record)',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Bibliographic record for Mohamed Nasheed historical work.'
  },
  {
    id: 'SRC-WORLDCAT-NASHEED-1800-1900',
    url: 'https://search.worldcat.org/title/53019345',
    title: 'WorldCat record: Maldives, a historical overview of traditional Dhivehi polity, 1800-1900',
    publisher: 'WorldCat',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Library catalog confirmation of Nasheed history publication metadata.'
  },
  {
    id: 'SRC-EDITION-DHE-RADHUN',
    url: 'https://edition.mv/books/18590',
    title: "Former President Nasheed publishes 'Dhe Radhun' historical treatise",
    publisher: 'The Edition',
    access_date: '2026-02-06',
    quality: 'B',
    notes: "Reports release of Nasheed's historical book covering 1800-1900 Maldivian polity."
  },
  {
    id: 'SRC-AONEWS-DHE-RADHUN',
    url: 'https://aonews.mv/en/post-1058',
    title: "President Nasheed Releases Historical 'Dhe Radhun'",
    publisher: 'AO News',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Independent report on Dhe Radhun publication and topic scope.'
  },
  {
    id: 'SRC-WIKI-PRINCE-IBRAHIM-FAAMULADHEYRI',
    url: 'https://en.wikipedia.org/wiki/Prince_Ibrahim,_Faamuladheyri_Kilegefaanu',
    title: 'Prince Ibrahim, Faamuladheyri Kilegefaanu',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Documents exile to Fuvahmulah and issue list including southern-branch succession.'
  },
  {
    id: 'SRC-WIKI-ABDUL-GAYOOM-IBRAHIM',
    url: 'https://en.wikipedia.org/wiki/Abdul_Gayoom_Ibrahim',
    title: 'Abdul Gayoom Ibrahim',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Contains explicit maternal ancestry chain to Al-Naib Muhammad Thakurufaanu of Addu.'
  },
  {
    id: 'SRC-MRF-MIDU-ROYAL',
    url: 'https://maldivesroyalfamily.com/maldives_midu.shtml',
    title: 'Midu Royal Family Branch (Addu/Meedhoo records)',
    publisher: 'Maldives Royal Family',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Used for Dhiyamigili exile-descendant branches and Meedhoo/Addu link narratives.'
  },
  {
    id: 'SRC-PO-WAHEED',
    url: 'https://presidency.gov.mv/PO/FormerPresident/3',
    title: 'President Dr Mohamed Waheed Hassan',
    publisher: "The President's Office (Maldives)",
    access_date: '2026-02-06',
    quality: 'A',
    notes: 'Official profile with spouse and child-count details.'
  },
  {
    id: 'SRC-WIKI-WAHEED',
    url: 'https://en.wikipedia.org/wiki/Mohamed_Waheed_Hassan',
    title: 'Mohamed Waheed Hassan',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Used for spouse/children names and chronology cross-check.'
  },
  {
    id: 'SRC-PO-SOLIH',
    url: 'https://presidency.gov.mv/PO/FormerPresident/12',
    title: 'President Ibrahim Mohamed Solih',
    publisher: "The President's Office (Maldives)",
    access_date: '2026-02-06',
    quality: 'A',
    notes: 'Official profile for office timeline and canonical identity.'
  },
  {
    id: 'SRC-WIKI-SOLIH',
    url: 'https://en.wikipedia.org/wiki/Ibrahim_Mohamed_Solih',
    title: 'Ibrahim Mohamed Solih',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Used for spouse/children names and Nasheed cousin-context statement.'
  },
  {
    id: 'SRC-EDITION-SOLIH-MOTHER',
    url: 'https://edition.mv/ibrahim_muaz_mua/34704',
    title: 'Mother of former President Ibrahim Mohamed Solih passes away',
    publisher: 'The Edition',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Provides maternal identity reference for Solih family branch.'
  },
  {
    id: 'SRC-PO-MUIZZU',
    url: 'https://presidency.gov.mv/President/156',
    title: 'President Dr Mohamed Muizzu',
    publisher: "The President's Office (Maldives)",
    access_date: '2026-02-06',
    quality: 'A',
    notes: 'Official presidential profile used for office identity baseline.'
  },
  {
    id: 'SRC-WIKI-MUIZZU',
    url: 'https://en.wikipedia.org/wiki/Mohamed_Muizzu',
    title: 'Mohamed Muizzu',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Used for parentage and immediate family details.'
  },
  {
    id: 'SRC-WIKI-MUIZZU-FAMILY',
    url: 'https://en.wikipedia.org/wiki/Family_of_Mohamed_Muizzu',
    title: 'Family of Mohamed Muizzu',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'C',
    notes: 'Secondary family-branch detail page; use with caution for collateral links.'
  },
  {
    id: 'SRC-WIKI-SHAMSUDDEEN-III',
    url: 'https://en.wikipedia.org/wiki/Muhammad_Shamsuddeen_III',
    title: 'Muhammad Shamsuddeen III',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Used for mother-name and household-line details in late Huraagey branch.'
  },
  {
    id: 'SRC-WIKI-HASSAN-FARID',
    url: 'https://en.wikipedia.org/wiki/Hassan_Farid_Didi',
    title: 'Hassan Farid Didi',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Used for Fareed sibling-line parentage under Abdul Majeed and Veyogey Dhon Goma.'
  },
  {
    id: 'SRC-WIKI-IBRAHIM-FAREED',
    url: 'https://en.wikipedia.org/wiki/Ibrahim_Fareed_Didi',
    title: 'Ibrahim Fareed Didi',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Used for Fareed sibling-line parentage under Abdul Majeed and Veyogey Dhon Goma.'
  },
  {
    id: 'SRC-WIKI-ABBAS-IBRAHIM',
    url: 'https://en.wikipedia.org/wiki/Abbas_Ibrahim',
    title: 'Abbas Ibrahim',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Used for modern collateral family context in the Ilyas/Nasreena branch.'
  },
  {
    id: 'SRC-WIKI-ILYAS-IBRAHIM',
    url: 'https://en.wikipedia.org/wiki/Ilyas_Ibrahim',
    title: 'Ilyas Ibrahim',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Used for sibling-context bridge to Nasreena Ibrahim in modern-family branching.'
  },
  {
    id: 'SRC-WIKI-IBRAHIM-ISMAIL',
    url: 'https://en.wikipedia.org/wiki/Ibrahim_Ismail',
    title: 'Ibrahim Ismail',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'C',
    notes: 'Used for immediate-family context in modern political collateral mapping.'
  },
  {
    id: 'SRC-WIKI-BURECCA',
    url: 'https://en.wikipedia.org/wiki/Burecca_of_the_Maldives',
    title: 'Burecca of the Maldives',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Used to corroborate sibling and spouse context for Buraki/Burecca in the Ali V / Kalu Mohamed period.'
  },
  {
    id: 'SRC-WIKI-HEADS-STATE',
    url: 'https://en.wikipedia.org/wiki/List_of_heads_of_state_of_the_Maldives',
    title: 'List of heads of state of the Maldives',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'C',
    notes: 'Used as contextual cross-check for names/titles in Recca-Buraki and Hilaaly-Huraa transition narratives.'
  },
  {
    id: 'SRC-EDITION-NASREENA-SISTER',
    url: 'https://edition.mv/news/3350',
    title: "Former first lady Nasreena's sister passes away",
    publisher: 'The Edition',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Names Fareesha as younger sister of Ilyas and Abbas, corroborating sibling relations in the Nasreena/Ilyas/Abbas branch.'
  },
  {
    id: 'SRC-WIKI-FATHIMATH-SAUDHA',
    url: 'https://en.wikipedia.org/wiki/Fathimath_Saudha',
    title: 'Fathimath Saudha',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Used for documented sibling relation to President Mohamed Muizzu and profile context.'
  },
  {
    id: 'SRC-SUN-SAUDHA-SISTER',
    url: 'https://en.sun.mv/90197',
    title: 'Nilandhoo MP Saudha takes oath as member of parliament',
    publisher: 'Sun Online',
    access_date: '2026-02-06',
    quality: 'B',
    notes: "News report explicitly identifies MP Saudha as the President's younger sister."
  },
  {
    id: 'SRC-MRF-MIDU-ROYAL-CHAIN',
    url: 'https://maldivesroyalfamily.com/maldives_midu_royal.shtml',
    title: 'Midu Royal Genealogical Chain',
    publisher: 'Maldives Royal Family',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Contains the southern branch chain listing Princess Aishath Didi and Kondey Ali Manikfan as spouses with descendants.'
  }
];

export const sourceById = new Map(sources.map(s => [s.id, s]));

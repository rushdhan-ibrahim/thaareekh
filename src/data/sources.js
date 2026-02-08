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
    id: 'SRC-MRF-KAKAAGE-ALBUM',
    url: 'https://maldivesroyalfamily.com/family_album_kakaage.shtml',
    title: 'Kakaage Family Album Notes',
    publisher: 'Maldives Royal Family',
    access_date: '2026-02-08',
    quality: 'B',
    notes: 'Family-album narrative notes used for quote-level Don Goma parentage wording in the P87/P129 verification corridor.'
  },
  {
    id: 'SRC-MRF-PHOTO-6',
    url: 'https://maldivesroyalfamily.com/maldives_photo_6.shtml',
    title: 'Historic Royal Photo Notes (Ibrahim Nooreddine line)',
    publisher: 'Maldives Royal Family',
    access_date: '2026-02-08',
    quality: 'B',
    notes: 'Historic photo-caption narrative used for quote-level Ibrahim Nooreddine -> Don Goma wording.'
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
    url: 'https://presidency.gov.mv/PO/President/',
    title: 'President Dr Mohamed Muizzu',
    publisher: "The President's Office (Maldives)",
    access_date: '2026-02-08',
    quality: 'A',
    notes: 'Official presidential profile used for office identity baseline, oath date, and education anchors.'
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
  },
  {
    id: 'SRC-WIKI-DHOVEMI',
    url: 'https://en.wikipedia.org/wiki/Dhovemi',
    title: 'Dhovemi of the Maldives',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Used for Dhovemi historical-name variants and sobriquet mapping.'
  },
  {
    id: 'SRC-WIKI-IZZUDDIN-I',
    url: 'https://en.wikipedia.org/wiki/Izzuddin_of_the_Maldives',
    title: 'Izzuddin of the Maldives',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Used for Dhon Bandaarain naming and regency-context details.'
  },
  {
    id: 'SRC-WIKI-MUHAMMAD-GHIYATH-AL-DIN',
    url: 'https://en.wikipedia.org/wiki/Muhammed_Ghiya%27as_ud-din',
    title: "Muhammed Ghiya'as ud-din",
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Used for Haajee Bandaarain name-form and reign context.'
  },
  {
    id: 'SRC-HISTORY-MV-GHIYAS',
    url: 'https://historymv.org/articles/55',
    title: "Shaheed Kulha Bandaarain: Sultan Muhammad Ghiyathuddin",
    publisher: 'History Maldives',
    access_date: '2026-02-06',
    quality: 'C',
    notes: 'Secondary historical narrative used as supplemental naming context.'
  },
  {
    id: 'SRC-WIKI-MUHAMMAD-MUIZZUDDIN',
    url: 'https://en.wikipedia.org/wiki/Muhammad_Mu%27iz_ud-din',
    title: "Muhammad Mu'iz ud-din",
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'B',
    notes: 'Used for Kalhu Bandaarain popular-name form and reign chronology.'
  },
  {
    id: 'SRC-SSRN-SUOOD-LEGAL',
    url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3800802',
    title: 'Ancient and Islamic Foundations of the Law of the Maldives',
    publisher: 'SSRN (A. Husnu Al Suood)',
    access_date: '2026-02-06',
    quality: 'A',
    notes: 'Primary legal-historical study used for Furadaana and office-role evolution (Kilege, Bandeyri, Hakuraa, Fandiyaaru, etc.).'
  },
  {
    id: 'SRC-WIKI-CASTE-SYSTEM',
    url: 'https://en.wikipedia.org/wiki/Caste_system_in_Maldives',
    title: 'Caste system in Maldives',
    publisher: 'Wikipedia',
    access_date: '2026-02-06',
    quality: 'C',
    notes: 'Supplementary source for traditional office-title lists and late-monarchy role descriptions.'
  },
  {
    id: 'SRC-MRF-TITLES',
    url: 'https://maldivesroyalfamily.com/maldives_titles.shtml',
    title: 'Maldivian Titles and Offices',
    publisher: 'Maldives Royal Family',
    access_date: '2026-02-06',
    quality: 'C',
    notes: 'Specialist title glossary used as supplemental context; direct fetch blocked in this environment.'
  },
  {
    id: 'SRC-ARCHIVES-LAW-16-2011',
    url: 'https://archives.gov.mv/assets/source/docs/archives_law.pdf',
    title: 'National Archives Act (Law 16/2011)',
    publisher: 'National Archives of Maldives',
    access_date: '2026-02-08',
    quality: 'A',
    notes: 'Official gazetted legal text defining archival mandate and records governance.'
  },
  {
    id: 'SRC-ARCHIVES-RECORDS-DISPOSAL',
    url: 'https://archives.gov.mv/assets/source/docs/disposal_of_records.pdf',
    title: 'Regulation on Disposal of Records',
    publisher: 'National Archives of Maldives',
    access_date: '2026-02-08',
    quality: 'A',
    notes: 'Official archival regulation relevant for records provenance and source lifecycle policy.'
  },
  {
    id: 'SRC-PO-TARIKH-LAUNCH-2021',
    url: 'https://presidency.gov.mv/Press/Article/24486',
    title: "President urges students to study and research Maldives' rich history",
    publisher: "The President's Office (Maldives)",
    access_date: '2026-02-08',
    quality: 'A',
    notes: 'Official statement identifying Tarikh Islam Diba Mahal as the earliest surviving local historical work.'
  },
  {
    id: 'SRC-TUFS-TARIKH-DIBA-MAHALL-FACSIMILE',
    url: 'https://tufs.repo.nii.ac.jp/records/7457',
    title: 'Tarikh Islam Diba Mahall (facsimile edition)',
    publisher: 'Institute for the Study of Languages and Cultures of Asia and Africa, TUFS',
    access_date: '2026-02-08',
    quality: 'A',
    notes: 'Facsimile publication of Hasan Taj al-Din chronicle with continuations by Muhibb al-Din and Siraj al-Din.'
  },
  {
    id: 'SRC-TUFS-TARIKH-DIBA-MAHALL-ANNOT',
    url: 'https://tufs.repo.nii.ac.jp/records/7433',
    title: 'Tarikh Islam Diba Mahall, vol.2 (annotations and indices)',
    publisher: 'Institute for the Study of Languages and Cultures of Asia and Africa, TUFS',
    access_date: '2026-02-08',
    quality: 'B',
    notes: 'Scholarly annotation and indexing companion to the facsimile chronicle.'
  },
  {
    id: 'SRC-STANDREWS-PEACOCK-2020',
    url: 'https://research-portal.st-andrews.ac.uk/en/publications/history-piety-and-factional-politics-in-the-arabic-chronicle-of-t/',
    title: "History, piety and factional politics in the Arabic chronicle of the Maldives",
    publisher: 'University of St Andrews / Asiatische Studien',
    access_date: '2026-02-08',
    quality: 'B',
    notes: 'Peer-reviewed analysis of Tarikh textual tradition and authorial political context.'
  },
  {
    id: 'SRC-SARUNA-LOAMAAFANU-1982',
    url: 'https://saruna.mnu.edu.mv/items/3c1c8b78-4aea-480e-95fd-484f3134a881',
    title: 'Loamaafaanu (Hassan Ahmed Maniku, 1982)',
    publisher: 'National Centre for Linguistic and Historical Research / MNU Saruna repository',
    access_date: '2026-02-08',
    quality: 'A',
    notes: 'Foundational Loamaafaanu publication used for inscriptional and early-Islamization evidence.'
  },
  {
    id: 'SRC-SARUNA-LOAMAAFANU-2003',
    url: 'https://saruna.mnu.edu.mv/items/4826d37f-f293-4576-b4df-a5220d9e2f3f',
    title: 'Loamaafaanu (Naseema Mohamed, 2003)',
    publisher: 'Dhivehibahaai Thareekhah Khidhumaiykuraa Qaumee Marukazu / MNU Saruna repository',
    access_date: '2026-02-08',
    quality: 'B',
    notes: 'Later article-level synthesis and contextualization of copper-plate records.'
  },
  {
    id: 'SRC-SARUNA-RAADHAVALHI-1985',
    url: 'https://saruna.mnu.edu.mv/items/41a49f76-3727-45ef-8156-7a3119262adf',
    title: 'Dhivehi Thaareekhaai Raadhavalhi (1985)',
    publisher: 'Dhivehi Bahaai Thareekhah Khidhumaiy Kuraa Qaumee Marukazu / MNU Saruna repository',
    access_date: '2026-02-08',
    quality: 'B',
    notes: 'Focused discussion of Raadhavalhi manuscript tradition and Dhivehi historical framing.'
  },
  {
    id: 'SRC-SARUNA-PYRARD-V2P2-1887',
    url: 'https://saruna.mnu.edu.mv/items/47e32876-8c1b-4f3d-91e8-75c6779d7eca',
    title: 'Voyage of Francois Pyrard, vol. II part II (1887 edition)',
    publisher: 'The Hakluyt Society / MNU Saruna repository',
    access_date: '2026-02-08',
    quality: 'A',
    notes: 'Historical travel account with governance, court, office, and social-order observations.'
  },
  {
    id: 'SRC-CORNELL-PYRARD-V1-1887',
    url: 'https://digital.library.cornell.edu/catalog/sea103a',
    title: 'Voyage of Francois Pyrard, vol. I (Cornell digital edition)',
    publisher: 'Cornell University Library',
    access_date: '2026-02-08',
    quality: 'A',
    notes: 'Digitized volume with chapter-level index including governance, offices, genealogy, and succession narratives.'
  },
  {
    id: 'SRC-HEIDELBERG-BELL-1883',
    url: 'https://digi.ub.uni-heidelberg.de/diglit/bell1883',
    title: 'The Maldive Islands (Bell, 1883 digital facsimile)',
    publisher: 'Heidelberg University Library',
    access_date: '2026-02-08',
    quality: 'B',
    notes: 'Digitized antiquarian baseline with full-text OCR and stable DOI.'
  },
  {
    id: 'SRC-BELL-1940',
    url: 'https://search.worldcat.org/title/maldive-islands-monograph-on-the-history-archaeology-and-epigraphy/oclc/866581748',
    title: 'The Maldive Islands: Monograph on the History, Archaeology and Epigraphy',
    publisher: 'Ceylon Government Press (reprint from Ceylon sessional papers)',
    access_date: '2026-02-09',
    quality: 'A',
    notes: 'Foundational European academic source on Maldivian history, archaeology and epigraphy. H.C.P. Bell compiled this posthumous monograph from decades of field work (1879-1922). Published 1940 in Colombo.'
  },
  {
    id: 'SRC-IBN-BATTUTA-RIHLA',
    url: 'https://archive.org/stream/TheRehlaOfIbnBattuta/231448482-The-Rehla-of-Ibn-Battuta_djvu.txt',
    title: 'Rihla (The Travels of Ibn Battuta), Maldives chapters',
    publisher: 'Hakluyt Society (Gibb/Beckingham English translation, 4 vols, 1958-1994)',
    access_date: '2026-02-09',
    quality: 'A',
    notes: '14th-century eyewitness account with detailed descriptions of the Maldivian court, named officials, and queen Khadijah. Ibn Battuta served as qadi in the Maldives c. 1343-1345.'
  },
  {
    id: 'SRC-MANIKU-ETYMOLOGY',
    url: 'https://dsal.uchicago.edu/dictionaries/maniku/frontmatter/frontmatter.html',
    title: 'A Concise Etymological Vocabulary of Dhivehi Language',
    publisher: 'Royal Asiatic Society of Sri Lanka, Colombo (2000)',
    access_date: '2026-02-09',
    quality: 'B',
    notes: 'Key reference for regnal token etymology and Sanskrit/Pali-to-Dhivehi derivation pathways. Hassan Ahmed Maniku. Could resolve 10+ E4-grade regnal epithet tokens.'
  },
  {
    id: 'SRC-PYRARD-GRAY-1887',
    url: 'https://archive.org/details/voyagefranoispy01pyragoog',
    title: 'The Voyage of François Pyrard of Laval to the East Indies, the Maldives, the Moluccas and Brazil',
    publisher: 'Hakluyt Society, London (translated by Albert Gray, assisted by H.C.P. Bell, 1887-1890)',
    access_date: '2026-02-09',
    quality: 'A',
    notes: 'Detailed 5-year eyewitness account (1602-1607) of Maldivian court, governance, offices, and society. Gray/Bell English translation of the 1619 French edition. Complements SRC-SARUNA-PYRARD-V2P2-1887 and SRC-CORNELL-PYRARD-V1-1887.'
  },
  {
    id: 'SRC-MALONEY-1980',
    url: 'https://search.worldcat.org/title/people-of-the-maldive-islands/oclc/7462285',
    title: 'People of the Maldive Islands',
    publisher: 'Orient Longman, Bombay (1980)',
    access_date: '2026-02-09',
    quality: 'B',
    notes: 'Comprehensive anthropological study by Clarence Maloney based on 1974-1976 fieldwork. Covers settlement, society, religion, politics, and economy. 441 pp.'
  },
  {
    id: 'SRC-ROMERO-FRIAS',
    url: 'https://openlibrary.org/books/OL3456485M/The_Maldive_Islanders',
    title: 'The Maldive Islanders: A Study of the Popular Culture of an Ancient Ocean Kingdom',
    publisher: 'Nova Ethnographia Indica, Barcelona (1999)',
    access_date: '2026-02-09',
    quality: 'B',
    notes: 'Xavier Romero-Frias ethnography of Maldivian popular culture, folklore, and historical traditions. Based on extensive fieldwork from 1979 onward with fluent Dhivehi.'
  },
  {
    id: 'SRC-GLOBALISE-VOC',
    url: 'https://globalise.huygens.knaw.nl/',
    title: 'GLOBALISE VOC Database',
    publisher: 'Huygens Institute, KNAW (Netherlands)',
    access_date: '2026-02-09',
    quality: 'B',
    notes: 'Digitized Dutch East India Company records (1610-1796). 5 million pages of Overgekomen Brieven en Papieren with AI-assisted transcription. Potential for Maldives trade and diplomatic references.'
  },
  {
    id: 'SRC-DIOGO-COUTO',
    url: 'https://archive.org/details/daasiadediogodec01cout',
    title: 'Décadas da Ásia (Da Asia de Diogo de Couto)',
    publisher: 'Regia Officina Typografica, Lisbon (1778-1788 edition of 16th-17th c. original)',
    access_date: '2026-02-09',
    quality: 'A',
    notes: 'Portuguese chronicle of Asian possessions with Maldives sections. Diogo do Couto continued João de Barros\u2019 Décadas covering Portuguese activities in the Indian Ocean including Maldivian royal contacts.'
  },
  {
    id: 'SRC-HAKLUYT-IBN-BATTUTA-V4',
    url: 'https://archive.org/stream/travels-of-ibn-battuta/The%20Travels%20of%20Ibn%20Battuta-1325%E2%80%931354-Volume-IV_djvu.txt',
    title: 'The Travels of Ibn Battuta, A.D. 1325-1354, Vol. IV (Gibb/Beckingham, Hakluyt Society)',
    publisher: 'Hakluyt Society',
    access_date: '2026-02-09',
    quality: 'A',
    notes: 'Chapter XVII contains the Maldives account. Primary eyewitness source for 1340s Maldives. Complements SRC-IBN-BATTUTA-RIHLA with volume-specific digital text.'
  },
  {
    id: 'SRC-ORIAS-IBN-BATTUTA-MALDIVES',
    url: 'https://orias.berkeley.edu/resources-teachers/travels-ibn-battuta/journey/escape-delhi-maldive-islands-and-sri-lanka-1341-1344',
    title: 'Escape from Delhi to the Maldive Islands and Sri Lanka: 1341-1344',
    publisher: 'UC Berkeley ORIAS',
    access_date: '2026-02-09',
    quality: 'B',
    notes: 'Educational summary of Ibn Battuta\u2019s Maldives visit with key events and persons named.'
  },
  {
    id: 'SRC-GENIZA-COWRIE-1141',
    url: 'https://www.lib.cam.ac.uk/collections/departments/taylor-schechter-genizah-research-unit/fragment-month/fotm-2023/fragment-3',
    title: 'Cairo Geniza fragment: Cowrie shell trade letter (1141 CE)',
    publisher: 'Cambridge University Library / Taylor-Schechter Genizah Research Unit',
    access_date: '2026-02-09',
    quality: 'A',
    notes: 'Primary merchant letter from 1141 CE mentioning Maldivian cowrie shells. Pre-conversion evidence of Arabic-world trade connection.'
  },
  {
    id: 'SRC-UNESCO-CORAL-MOSQUES',
    url: 'https://whc.unesco.org/en/tentativelists/5812/',
    title: 'Coral Stone Mosques of Maldives (UNESCO Tentative List)',
    publisher: 'UNESCO World Heritage Centre',
    access_date: '2026-02-09',
    quality: 'B',
    notes: 'Documents the coral stone mosque tradition including Hukuru Miskiy Arabic inscriptions and tombstones.'
  },
  {
    id: 'SRC-SUOOD-POLITICAL-SYSTEM',
    url: 'https://justicesuood.com/public/uploads/1611685910668Political_System_of_the_Ancient_Kingdom.pdf',
    title: 'Political System of the Ancient Kingdom of Maldives',
    publisher: 'A. Husnu Al Suood (author website)',
    access_date: '2026-02-09',
    quality: 'B',
    notes: 'Companion to SRC-SSRN-SUOOD-LEGAL. Covers court hierarchy, wazir office, and governance structure.'
  },
  {
    id: 'SRC-BERCHEM-CORAL-ARCHAEOLOGY',
    url: 'https://maxvanberchem.org/en/scientific-activities/projects/archeology/11-archeologie/171-archaeological-investigations-on-the-coral-stone-mosques-of-the-maldives',
    title: 'Archaeological Investigations on the Coral Stone Mosques of the Maldives',
    publisher: 'Fondation Max van Berchem',
    access_date: '2026-02-09',
    quality: 'B',
    notes: 'Archaeological project documenting Arabic inscriptions and architectural evidence in Maldivian mosques.'
  },
  {
    id: 'SRC-DESILVA-PORT-ENCOUNTERS',
    url: 'https://www.routledge.com/Portuguese-Encounters-with-Sri-Lanka-and-the-Maldives/Silva/p/book/9781138383388',
    title: 'Portuguese Encounters with Sri Lanka and the Maldives',
    publisher: 'Ashgate/Routledge (ed. Chandra R. de Silva, 2009)',
    access_date: '2026-02-09',
    quality: 'A',
    notes: 'Chapter 7 covers Portuguese-Maldives relations. Contains translated primary Portuguese texts from Barros, Correia, Queiros. ISBN 9780754601869.'
  },
  {
    id: 'SRC-ROYALARK-M16',
    url: 'https://www.royalark.net/Maldives/maldive16.htm',
    title: 'RoyalArk: Maldive Islands - Huraa\u2019gey Dynasty (late period)',
    publisher: 'RoyalArk',
    access_date: '2026-02-09',
    quality: 'B',
    notes: 'Late Huraagey genealogy 1893-1969 including last sultans and monarchy-to-republic transition.'
  },
  {
    id: 'SRC-BELL-EXCERPTA',
    url: 'https://search.worldcat.org/title/excerpta-maldiviana/oclc/7898027',
    title: 'Excerpta Maldiviana',
    publisher: 'Journal of the Ceylon Branch of the Royal Asiatic Society (1922-1926, serialized)',
    access_date: '2026-02-09',
    quality: 'A',
    notes: 'H.C.P. Bell\u2019s comprehensive catalog of translated Divehi historical documents including Portuguese intercourse section and ancient document reproductions. Reprinted by Asian Educational Services (ISBN 8120612213).'
  },
  {
    id: 'SRC-PEACOCK-INTEL-2024',
    url: 'https://www.tandfonline.com/doi/full/10.1080/18335330.2024.2431019',
    title: 'Intelligence in the Sultanate of Maldives: interpreting the Tarikh',
    publisher: 'Taylor & Francis (Intelligence and National Security)',
    access_date: '2026-02-09',
    quality: 'B',
    notes: 'A.C.S. Peacock hermeneutic analysis of Tarikh; identifies intelligence/deception themes; notes Tarikh chronicles reigns 1153-1821.'
  },
  {
    id: 'SRC-NAZIM-KALAAFAAN-2010',
    url: 'https://maritimeasiaheritage.cseas.kyoto-u.ac.jp/wp-content/uploads/2022/03/Sattar-Ahmed-Nazim.-2010.-King-Kalaafaan-Manuscripts-NCLHR-Male.-English-edition.pdf',
    title: 'King Kalaafaan Manuscripts',
    publisher: 'National Centre for Linguistic and Historical Research, Male (2010, English ed.)',
    access_date: '2026-02-09',
    quality: 'B',
    notes: 'Sattar Ahmed Nazim analysis of royal manuscripts tradition. Published via Kyoto Maritime Asia Heritage.'
  },
  {
    id: 'SRC-MALDIVES-HERITAGE-SURVEY',
    url: 'https://www.cambridge.org/core/journals/antiquity/article/maldives-heritage-survey/15F61521DF052F7FEA4CA8AEEEA554FC',
    title: 'The Maldives Heritage Survey',
    publisher: 'Antiquity / Cambridge Core',
    access_date: '2026-02-09',
    quality: 'B',
    notes: 'First comprehensive tangible cultural heritage survey: 152 islands across 6 atolls; 292 sites; 1171 structures; 5761 objects; 410 manuscripts digitized.'
  },
  {
    id: 'SRC-BELL-FAMILY-PAPERS',
    url: 'https://www.s-asian.cam.ac.uk/archive/papers/bell-family-papers/',
    title: 'Bell Family Papers',
    publisher: 'Centre of South Asian Studies, Cambridge University',
    access_date: '2026-02-09',
    quality: 'A',
    notes: 'Primary archival collection: 2 boxes of H.C.P. Bell\u2019s papers including letters, diaries (1916-1937), and Archaeological Survey of Ceylon reports.'
  },
  {
    id: 'SRC-SCROLL-GOA-KINGS',
    url: 'https://scroll.in/magazine/1007554/when-maldives-was-ruled-by-catholic-kings-living-all-the-way-in-goa',
    title: 'When Maldives was ruled by Catholic kings living all the way in Goa',
    publisher: 'Scroll.in',
    access_date: '2026-02-09',
    quality: 'C',
    notes: 'Journalistic summary of Dom Manoel through Dom Philippe; cites RoyalArk and Pietro Della Valle.'
  }
];

export const sourceById = new Map(sources.map(s => [s.id, s]));

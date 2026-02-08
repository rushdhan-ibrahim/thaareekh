export const profileEnrichments = [
  {
    id: 'P2',
    known_as: [
      {
        name: 'Dhovemi Kalaminjaa',
        type: 'historical-name',
        c: 'c',
        note: 'Used in Dhivehi historical naming forms.',
        source_refs: ['SRC-WIKI-DHOVEMI', 'SRC-WIKI-HEADS-STATE']
      },
      {
        name: 'Dharumavantha Rasgefaanu',
        type: 'sobriquet',
        c: 'c',
        note: 'Honorific epithet attached to Prince/Sultan Dhovemi in historical lists.',
        source_refs: ['SRC-WIKI-DHOVEMI', 'SRC-WIKI-HEADS-STATE']
      }
    ],
    extra_facts: [
      'Traditionally remembered as Dharumavantha Rasgefaanu in later chronicles and lists.'
    ],
    source_refs: ['SRC-WIKI-DHOVEMI', 'SRC-WIKI-HEADS-STATE']
  },
  {
    id: 'P63',
    known_as: [
      {
        name: 'Dhevvadhoo Rasgefaanu',
        type: 'sobriquet',
        c: 'c',
        note: 'Listed as an alternate known-by name in head-of-state chronology.',
        source_refs: ['SRC-WIKI-HEADS-STATE']
      }
    ],
    extra_facts: [
      'Head-of-state chronologies describe him as Ali VI (Dhevvadhoo Rasgefaanu).'
    ],
    source_refs: ['SRC-WIKI-HEADS-STATE']
  },
  {
    id: 'P75',
    known_as: [
      {
        name: 'Addu Hassan Manikfan',
        type: 'sobriquet',
        c: 'u',
        note: 'Attributed in secondary chronologies; kept as uncertain pending stronger archival corroboration.',
        source_refs: ['SRC-WIKI-HEADS-STATE']
      }
    ],
    extra_facts: [
      'Secondary chronology describes his reign as very short during the Isdu-Dhiyamigili transition crisis.'
    ],
    source_refs: ['SRC-WIKI-HEADS-STATE']
  },
  {
    id: 'P80',
    known_as: [
      {
        name: 'Dhon Bandaarain',
        type: 'sobriquet',
        c: 'c',
        note: 'Commonly referenced historical name for Hassan Izzuddeen.',
        source_refs: ['SRC-WIKI-IZZUDDIN-I', 'SRC-WIKI-HEADS-STATE']
      },
      {
        name: 'Muleegey Don Hassan Maniku',
        type: 'house-name',
        c: 'c',
        note: 'House-linked historical rendering.',
        source_refs: ['SRC-WIKI-HEADS-STATE']
      },
      {
        name: 'Don Bandaara',
        type: 'variant',
        c: 'c',
        note: 'Variant transliteration tied to the same ruler identity.',
        source_refs: ['SRC-WIKI-HEADS-STATE']
      }
    ],
    offices_held: [
      {
        office_id: 'OFF-SOVEREIGN',
        label: 'Sultan',
        start: 1759,
        end: 1766,
        c: 'c',
        note: 'Founder sovereign of the Huraagey line.',
        source_refs: ['SRC-WIKI-HEADS-STATE', 'SRC-WIKI-IZZUDDIN-I']
      },
      {
        office_id: 'OFF-NAIB',
        label: 'De facto regent',
        start: 1754,
        end: 1759,
        c: 'i',
        note: 'Described as de facto regent before accession.',
        source_refs: ['SRC-WIKI-IZZUDDIN-I']
      }
    ],
    extra_facts: [
      'Widely treated as the founder-figure of the restored Huraagey political line.'
    ],
    source_refs: ['SRC-WIKI-IZZUDDIN-I', 'SRC-WIKI-HEADS-STATE']
  },
  {
    id: 'P81',
    known_as: [
      {
        name: 'Muhammadh Manikfaan',
        type: 'historical-name',
        c: 'c',
        note: 'Name-form recorded in historical summaries.',
        source_refs: ['SRC-WIKI-MUHAMMAD-GHIYATH-AL-DIN']
      },
      {
        name: 'Haajee Bandaarain',
        type: 'sobriquet',
        c: 'c',
        note: 'Historical epithet linked to Sultan Muhammad Ghiyath al-Din.',
        source_refs: ['SRC-WIKI-MUHAMMAD-GHIYATH-AL-DIN', 'SRC-HISTORY-MV-GHIYAS']
      }
    ],
    offices_held: [
      {
        office_id: 'OFF-SOVEREIGN',
        label: 'Sultan',
        start: 1766,
        end: 1774,
        c: 'c',
        note: 'Final Dhiyamigili sovereign in standard succession lists.',
        source_refs: ['SRC-WIKI-MONARCHS', 'SRC-WIKI-MUHAMMAD-GHIYATH-AL-DIN']
      }
    ],
    extra_facts: [
      'Secondary sources credit him with the first known Thaana dictionary compilation.',
      'He is remembered in some narratives as a martyr ruler (Shaheed Kulha Bandaarain).'
    ],
    source_refs: ['SRC-WIKI-MUHAMMAD-GHIYATH-AL-DIN', 'SRC-HISTORY-MV-GHIYAS']
  },
  {
    id: 'P83',
    known_as: [
      {
        name: 'Kalhu Bandaarain',
        type: 'sobriquet',
        c: 'c',
        note: 'Popularly known-by name in royal chronologies.',
        source_refs: ['SRC-WIKI-MUHAMMAD-MUIZZUDDIN', 'SRC-WIKI-HEADS-STATE']
      }
    ],
    offices_held: [
      {
        office_id: 'OFF-SOVEREIGN',
        label: 'Sultan',
        start: 1774,
        end: 1779,
        c: 'c',
        note: 'Early Huraagey reign after Dhiyamigili restoration shift.',
        source_refs: ['SRC-WIKI-MONARCHS', 'SRC-WIKI-MUHAMMAD-MUIZZUDDIN']
      }
    ],
    source_refs: ['SRC-WIKI-MUHAMMAD-MUIZZUDDIN', 'SRC-WIKI-HEADS-STATE']
  },
  {
    id: 'P95',
    offices_held: [
      {
        office_id: 'OFF-SOVEREIGN',
        label: 'Sultan',
        start: 1954,
        end: 1968,
        c: 'c',
        note: 'Final ruling Sultan before abolition of the monarchy.',
        source_refs: ['SRC-WIKI-MUHAMMAD-FAREED', 'SRC-WIKI-HEADS-STATE']
      }
    ],
    source_refs: ['SRC-WIKI-MUHAMMAD-FAREED']
  },
  {
    id: 'P110',
    offices_held: [
      {
        office_id: 'OFF-PRESIDENT',
        label: 'President',
        start: 1953,
        end: 1953,
        c: 'c',
        note: 'First President of the Maldives.',
        source_refs: ['SRC-PO-AMIN', 'SRC-WIKI-AMIN-DIDI']
      }
    ]
  },
  {
    id: 'P111',
    offices_held: [
      {
        office_id: 'OFF-SOVEREIGN',
        label: 'Sultan (elected, non-reigning)',
        start: 1944,
        end: 1952,
        c: 'i',
        note: 'Recognized as Sultan-elect in exile context; did not take the throne in person.',
        source_refs: ['SRC-WIKI-ABDUL-MAJEED', 'SRC-WIKI-MUHAMMAD-FAREED']
      }
    ],
    royal_link: {
      status: 'documented',
      summary: 'Documented direct royal line link as father of Sultan Muhammad Fareed Didi.',
      source_refs: ['SRC-WIKI-ABDUL-MAJEED', 'SRC-WIKI-MUHAMMAD-FAREED']
    }
  },
  {
    id: 'P115',
    offices_held: [
      {
        office_id: 'OFF-PRESIDENT',
        label: 'President',
        start: 1968,
        end: 1978,
        c: 'c',
        note: 'Second President of the Maldives.',
        source_refs: ['SRC-PO-NASIR', 'SRC-WIKI-IBRAHIM-NASIR']
      },
      {
        office_id: 'OFF-BANDEYRI',
        label: 'Rannabandeyri Kilegefan',
        c: 'u',
        note: 'Elite court-office title embedded in documented naming style.',
        source_refs: ['SRC-PO-NASIR', 'SRC-WIKI-IBRAHIM-NASIR']
      }
    ],
    royal_link: {
      status: 'documented',
      summary: 'Connected by documented lineage chain to Dhiyamigili Sultan Muhammad Ghiyathuddine (P81).',
      source_refs: ['SRC-WIKI-IBRAHIM-NASIR', 'SRC-WIKI-ABDUL-GAYOOM-IBRAHIM', 'SRC-MRF-MIDU-ROYAL-CHAIN']
    }
  },
  {
    id: 'P119',
    offices_held: [
      {
        office_id: 'OFF-PRESIDENT',
        label: 'President',
        start: 1978,
        end: 2008,
        c: 'c',
        note: "Official profile states he assumed office on 11 November 1978 and served through 11 November 2008.",
        source_refs: ['SRC-PO-MAUMOON', 'SRC-WIKI-MAUMOON']
      }
    ],
    extra_facts: [
      "Official profile extract currently provides office chronology anchors; detailed biographical lines remain limited in accessible page rendering."
    ],
    source_refs: ['SRC-PO-MAUMOON']
  },
  {
    id: 'P121',
    offices_held: [
      {
        office_id: 'OFF-PRESIDENT',
        label: 'President',
        start: 2013,
        end: 2018,
        c: 'c',
        note: 'Former President of the Maldives.',
        source_refs: ['SRC-PO-YAMEEN']
      }
    ]
  },
  {
    id: 'P122',
    offices_held: [
      {
        office_id: 'OFF-PRESIDENT',
        label: 'President',
        start: 2008,
        end: 2012,
        c: 'c',
        note: 'Official profile records oath-taking on 11 November 2008 and former-president status.',
        source_refs: ['SRC-PO-NASHEED']
      }
    ],
    extra_facts: [
      "Official profile records birth on 17 May 1967 in Malé.",
      'Official profile lists education in Malé and Colombo and further studies in Liverpool, Brighton, and Oxford.',
      'Published historical work on traditional Dhivehi polity (1800-1900) under the title "Dhe Radhun".'
    ],
    source_refs: ['SRC-PO-NASHEED', 'SRC-OPENLIB-NASHEED-1800-1900', 'SRC-WORLDCAT-NASHEED-1800-1900', 'SRC-EDITION-DHE-RADHUN', 'SRC-AONEWS-DHE-RADHUN']
  },
  {
    id: 'P130',
    offices_held: [
      {
        office_id: 'OFF-FAAMULADHEYRI',
        label: 'Faamuladheyri Kilegefaanu',
        c: 'u',
        note: 'Court-office style title in documented personal naming.',
        source_refs: ['SRC-WIKI-PRINCE-IBRAHIM-FAAMULADHEYRI']
      }
    ]
  },
  {
    id: 'P132',
    offices_held: [
      {
        office_id: 'OFF-NAIB',
        label: 'Al-Naib',
        c: 'u',
        note: 'Deputy/viceroy-style office title retained in genealogical naming.',
        source_refs: ['SRC-WIKI-ABDUL-GAYOOM-IBRAHIM', 'SRC-MRF-MIDU-ROYAL']
      }
    ]
  },
  {
    id: 'P136',
    offices_held: [
      {
        office_id: 'OFF-DHOSHIMEYNAA',
        label: 'Dhoshimeynaa Kilegefaanu',
        c: 'u',
        note: 'Military-office linked title present in documented naming for Amin Didi\'s father.',
        source_refs: ['SRC-PO-AMIN']
      }
    ]
  },
  {
    id: 'P162',
    offices_held: [
      {
        office_id: 'OFF-PRESIDENT',
        label: 'President',
        start: 2012,
        end: 2013,
        c: 'c',
        note: 'Former President of the Maldives.',
        source_refs: ['SRC-PO-WAHEED', 'SRC-WIKI-WAHEED']
      }
    ]
  },
  {
    id: 'P167',
    offices_held: [
      {
        office_id: 'OFF-PRESIDENT',
        label: 'President',
        start: 2018,
        end: 2023,
        c: 'c',
        note: 'Official profile states he took oath on 17 November 2018 as the 7th President for a five-year term.',
        source_refs: ['SRC-PO-SOLIH', 'SRC-WIKI-SOLIH']
      }
    ],
    extra_facts: [
      "Official profile records birth on 4 May 1962 in Hinnavaru, Lhaviyani Atoll."
    ],
    source_refs: ['SRC-PO-SOLIH']
  },
  {
    id: 'P172',
    offices_held: [
      {
        office_id: 'OFF-PRESIDENT',
        label: 'President',
        start: 2023,
        end: null,
        c: 'c',
        note: 'Official profile identifies him as the 8th President sworn in on 17 November 2023 (incumbent as of 2026-02-08).',
        source_refs: ['SRC-PO-MUIZZU']
      }
    ],
    extra_facts: [
      "Official profile records birth on 15 June 1978 in Malé.",
      'Official profile lists Masters and PhD-level civil-engineering study at the University of Leeds.'
    ],
    source_refs: ['SRC-PO-MUIZZU']
  },
  {
    id: 'P182',
    offices_held: [
      {
        office_id: 'OFF-NAIB',
        label: 'El-Naib',
        c: 'u',
        note: 'Deputy/viceroy-style title retained in genealogical naming.',
        source_refs: ['SRC-MRF-MIDU-ROYAL-CHAIN', 'SRC-MRF-MIDU-ROYAL']
      }
    ]
  },
  {
    id: 'P189',
    offices_held: [
      {
        office_id: 'OFF-HANDEYGIRI',
        label: 'Handeygiri title-line',
        c: 'u',
        note: 'Family designation tied to the Handeygiri office tradition.',
        source_refs: ['SRC-MRF-HILAALY', 'SRC-MRF-TITLES']
      }
    ]
  },
  {
    id: 'P192',
    offices_held: [
      {
        office_id: 'OFF-HANDEYGIRI',
        label: 'Yusuf Handeygirin',
        c: 'u',
        note: 'Title-bearing elite associated with Handeygiri office lineage naming.',
        source_refs: ['SRC-MRF-HILAALY', 'SRC-MRF-TITLES']
      }
    ]
  }
];

export const profileEnrichmentById = new Map(profileEnrichments.map(p => [p.id, p]));

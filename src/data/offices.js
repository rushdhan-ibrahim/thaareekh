export const officeCatalog = [
  {
    id: 'OFF-SOVEREIGN',
    name: 'Sovereign Crown Office',
    kind: 'crown',
    summary: 'The ruling crown office of the Maldives during monarchical periods (rendered as Sultan or Queen by holder profile).',
    source_refs: ['SRC-WIKI-HEADS-STATE', 'SRC-WIKI-MONARCHS']
  },
  {
    id: 'OFF-PRESIDENT',
    name: 'President',
    kind: 'executive',
    summary: 'Head of state and government in the republican era.',
    source_refs: ['SRC-PO-AMIN', 'SRC-PO-NASIR', 'SRC-PO-MAUMOON', 'SRC-PO-NASHEED', 'SRC-PO-WAHEED', 'SRC-PO-SOLIH', 'SRC-PO-MUIZZU']
  },
  {
    id: 'OFF-FURADHAANA',
    name: 'Furadaana (Furadhaana)',
    kind: 'institution',
    summary: 'Royal ministerial council/cabinet around the sovereign, with office composition changing over time.',
    alt_names: ['Furadaana', 'Furadhaana'],
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-WIKI-CASTE-SYSTEM', 'SRC-MRF-TITLES']
  },
  {
    id: 'OFF-KILEGE',
    name: 'Kilege',
    kind: 'ministerial',
    summary: 'Senior office in the Furadaana, often described as head of ministers/chief ministerial figure.',
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-WIKI-CASTE-SYSTEM']
  },
  {
    id: 'OFF-BANDEYRI',
    name: 'Bandeyri',
    kind: 'ministerial',
    summary: 'Court/palace portfolio tied to royal household and palace personnel, with broad state functions in later periods.',
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-WIKI-CASTE-SYSTEM', 'SRC-MRF-TITLES']
  },
  {
    id: 'OFF-VELAANAA',
    name: 'Velaanaa',
    kind: 'ministerial',
    summary: 'Revenue-linked office associated with fines, duties, and other fiscal collections in early records.',
    source_refs: ['SRC-SSRN-SUOOD-LEGAL']
  },
  {
    id: 'OFF-FAIYLIA',
    name: 'Faiylia',
    kind: 'ministerial',
    summary: 'Office tied to royal stores and custody/receipt of royal goods.',
    source_refs: ['SRC-SSRN-SUOOD-LEGAL']
  },
  {
    id: 'OFF-DHOSHIMEYNAA',
    name: 'Dhoshimeynaa',
    kind: 'ministerial',
    summary: 'Military-linked office; described in different periods as army-general/chief defense portfolio.',
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-WIKI-CASTE-SYSTEM']
  },
  {
    id: 'OFF-HAKURAA',
    name: 'Hakuraa',
    kind: 'ministerial',
    summary: 'Ministerial office associated with court audience/protocol and, in later descriptions, public works.',
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-WIKI-CASTE-SYSTEM']
  },
  {
    id: 'OFF-FANDIYAARU',
    name: 'Fandiyaaru',
    kind: 'judicial',
    summary: 'Chief judge/Qadi office in the pre-modern state and monarchy-era judicial structure.',
    source_refs: ['SRC-SSRN-SUOOD-LEGAL']
  },
  {
    id: 'OFF-HANDEYGIRI',
    name: 'Handeygiri',
    kind: 'ministerial',
    summary: 'High office in later monarchical administration; role descriptions vary from religious portfolio to treasury-central authority.',
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-WIKI-CASTE-SYSTEM', 'SRC-MRF-TITLES']
  },
  {
    id: 'OFF-FAAMULADHEYRI',
    name: 'Faamuladheyri',
    kind: 'ministerial',
    summary: 'Treasury-linked office in descriptions of traditional government portfolios.',
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-WIKI-CASTE-SYSTEM', 'SRC-MRF-TITLES']
  },
  {
    id: 'OFF-MAAFAIY',
    name: 'Maafaiy',
    kind: 'ministerial',
    summary: 'Revenue office identified as receiver-general in historical descriptions.',
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-WIKI-CASTE-SYSTEM', 'SRC-MRF-TITLES']
  },
  {
    id: 'OFF-FAASHANAA',
    name: 'Faashanaa',
    kind: 'ministerial',
    summary: 'Police/security portfolio in late monarchical office descriptions.',
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-WIKI-CASTE-SYSTEM', 'SRC-MRF-TITLES']
  },
  {
    id: 'OFF-NAIB',
    name: 'Naib (Naibu / Al-Naib)',
    kind: 'deputy',
    summary: 'Deputy/viceroy-style court office title; appears in elite genealogical lines and 19th-century cabinet descriptions.',
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-MRF-TITLES']
  }
];

export const officeTimeline = [
  {
    id: 'OT-14C',
    label: '14th century (Ibn Battuta era)',
    period: 'c. 1340s',
    summary: 'Court records point to a structured cabinet around the vizier and a distinct judicial office (Qadi/Fandiyaaru).',
    offices: ['OFF-FURADHAANA', 'OFF-KILEGE', 'OFF-FANDIYAARU'],
    source_refs: ['SRC-SSRN-SUOOD-LEGAL']
  },
  {
    id: 'OT-17C',
    label: 'Early 17th century (Pyrard account)',
    period: 'c. 1602-1607',
    summary: 'Furadaana listed with Kilege, Velaanaa, Hakuraa, Fandiyaaru, Dhoshimeynaa, Faiylia, and Bandeyri among principal offices.',
    offices: ['OFF-FURADHAANA', 'OFF-KILEGE', 'OFF-VELAANAA', 'OFF-HAKURAA', 'OFF-FANDIYAARU', 'OFF-DHOSHIMEYNAA', 'OFF-FAIYLIA', 'OFF-BANDEYRI'],
    source_refs: ['SRC-SSRN-SUOOD-LEGAL']
  },
  {
    id: 'OT-1834',
    label: '1834 (Christopher account)',
    period: '1834',
    summary: 'Cabinet descriptions include Kilege, Faiylia, Hakuraa, Bandeyri, Naibu, and Dhoshimeyna as senior posts, with Fandiyaaru still distinct.',
    offices: ['OFF-FURADHAANA', 'OFF-KILEGE', 'OFF-FAIYLIA', 'OFF-HAKURAA', 'OFF-BANDEYRI', 'OFF-NAIB', 'OFF-DHOSHIMEYNAA', 'OFF-FANDIYAARU'],
    source_refs: ['SRC-SSRN-SUOOD-LEGAL']
  },
  {
    id: 'OT-1879',
    label: '1879 (Bell account)',
    period: '1879',
    summary: 'A compressed model is reported: three key ministers plus the chief judge; Handeygiri and Faashanaa appear among powerful offices.',
    offices: ['OFF-FURADHAANA', 'OFF-HANDEYGIRI', 'OFF-FAASHANAA', 'OFF-FANDIYAARU'],
    source_refs: ['SRC-SSRN-SUOOD-LEGAL']
  },
  {
    id: 'OT-20C',
    label: '20th century transition',
    period: '1932-1968',
    summary: 'Constitutional and legal centralization reduced older court-office autonomy; monarchy ended in 1968 and republican executive offices became dominant.',
    offices: ['OFF-FANDIYAARU', 'OFF-PRESIDENT'],
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-WIKI-HEADS-STATE']
  },
  {
    id: 'OT-REPUBLIC',
    label: 'Republican era',
    period: '1968-present',
    summary: 'Traditional office titles persist in social memory and elite naming, while formal state leadership is under the presidency and modern institutions.',
    offices: ['OFF-PRESIDENT', 'OFF-FURADHAANA', 'OFF-BANDEYRI', 'OFF-HANDEYGIRI'],
    source_refs: ['SRC-PO-AMIN', 'SRC-PO-NASIR', 'SRC-PO-MAUMOON', 'SRC-PO-NASHEED', 'SRC-PO-WAHEED', 'SRC-PO-SOLIH', 'SRC-PO-MUIZZU', 'SRC-WIKI-CASTE-SYSTEM', 'SRC-MRF-TITLES']
  }
];

export const officeById = new Map(officeCatalog.map(o => [o.id, o]));

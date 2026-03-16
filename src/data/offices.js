export const officeCatalog = [
  {
    id: 'OFF-SOVEREIGN',
    name: 'Sovereign Crown Office',
    kind: 'crown',
    summary: 'The ruling crown office of the Maldives during monarchical periods (rendered as Sultan or Queen by holder profile).',
    functions: [
      { period_id: 'OT-14C', description: 'Absolute sovereign presiding over the Furadaana council and appointing ministerial office-holders.' },
      { period_id: 'OT-17C', description: 'Sultan ruling through a seven-office cabinet with Kilege as chief minister; Pyrard describes elaborate court ceremony.' },
      { period_id: 'OT-1834', description: 'Monarch governing through six senior ministers; Christopher describes reduced but still absolute royal authority.' },
      { period_id: 'OT-20C', description: 'Constitutional monarchy (1932-1953, 1954-1968) with powers progressively curtailed by constitutional reform.' }
    ],
    source_refs: ['SRC-WIKI-HEADS-STATE', 'SRC-WIKI-MONARCHS']
  },
  {
    id: 'OFF-PRESIDENT',
    name: 'President',
    kind: 'executive',
    summary: 'Head of state and government in the republican era.',
    functions: [
      { period_id: 'OT-20C', description: 'Head of state during the first republic (1953-1954) and transitional period leading to the second republic.' },
      { period_id: 'OT-REPUBLIC', description: 'Executive president as head of state and government under the 1968 and 2008 constitutions.' }
    ],
    source_refs: ['SRC-PO-AMIN', 'SRC-PO-NASIR', 'SRC-PO-MAUMOON', 'SRC-PO-NASHEED', 'SRC-PO-WAHEED', 'SRC-PO-SOLIH', 'SRC-PO-MUIZZU']
  },
  {
    id: 'OFF-FURADHAANA',
    name: 'Furadaana (Furadhaana)',
    kind: 'institution',
    summary: 'Royal council of Great Officers of State around the sovereign; six Furadaana offices (Faarhanaa, Rannabandeyri, Dhoshimeynaa, Faamuladheyri, Maafaiy, Handeygiri) formed the highest administrative tier below the sovereign and the Uttama Fandiyaaru.',
    functions: [
      { period_id: 'OT-14C', description: 'Inner council of ministers around the vizier/Kilege; Ibn Battuta describes a structured court hierarchy with distinct judicial and ministerial branches.' },
      { period_id: 'OT-17C', description: 'Six Great Officers of State (Faarhanaa, Rannabandeyri, Dorhimeyna, Faamuladeyri, Maafaiy, Handeygirin) with defined portfolios; Pyrard describes elaborate ranked seating and ceremony.' },
      { period_id: 'OT-1834', description: 'Six senior ministerial portfolios under the sovereign; Christopher enumerates specific office-holders with Kilege titles.' },
      { period_id: 'OT-1879', description: 'Compressed cabinet reported by Bell; fewer distinct offices but concentrated ministerial power among Handeygiri and Faashanaa.' },
      { period_id: 'OT-REPUBLIC', description: 'Title persists in social memory; modern cabinet structure replaces traditional Furadaana composition. Office titles abolished by Parliament in 1979.' }
    ],
    alt_names: ['Furadaana', 'Furadhaana'],
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-WIKI-CASTE-SYSTEM', 'SRC-MRF-TITLES']
  },
  {
    id: 'OFF-KILEGE',
    name: 'Kilege',
    kind: 'peerage',
    summary: 'Highest peerage title bestowed by the sovereign; limited to eight males and three females. Not strictly an office but deeply intertwined with Furadaana offices (e.g., Rannabandeyri Kilegefaanu). Before Islamization (1153 CE), "Ras Kilege" was used as a sovereign style.',
    functions: [
      { period_id: 'OT-14C', description: 'Pre-Islamic royal epithet "Ras Kilege" transitioned after Islamization to the highest peerage honor; conferred through the gong ceremony.' },
      { period_id: 'OT-17C', description: 'Head of ministers in the Furadaana cabinet; Kilege titles paired with office names (e.g., Faarhanaa Kilege, Rannabandeyri Kilege). Pyrard documents elaborate investiture protocol.' },
      { period_id: 'OT-1834', description: 'First-ranked peerage among senior portfolios. Male Kilege titles: Ras, Faarhanaa, Rannabandeyri, Dorhimeyna, Faamuladeyri, Maafaiy, Kaulannaa, Oliginaa, Daharada. Female: Rani, Ma\'ava, Kamba\'adi.' },
      { period_id: 'OT-REPUBLIC', description: 'Three additional Kilege titles created in 1976; all peerage titles abolished by Act of Parliament in 1979.' }
    ],
    alt_names: ['Kilegefaanu', 'Kilegefaan', 'Kilegefa\'anu'],
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-WIKI-CASTE-SYSTEM', 'SRC-MRF-TITLES']
  },
  {
    id: 'OFF-FAARHANAA',
    name: 'Faarhanaa',
    kind: 'furadaana',
    summary: 'Premier Furadaana office and one of the three most likely candidates for Prime Minister (Bodu Vazir), alongside Rannabandeyri and Handeygiri.',
    functions: [
      { period_id: 'OT-17C', description: 'First-ranked Great Officer of State in the Furadaana council; Faarhanaa Kilege was the senior male peerage title after Ras Kilege.' },
      { period_id: 'OT-1834', description: 'Premier ministerial portfolio; Faarhanaa Kilege holder served as the senior member of the six-minister cabinet.' },
      { period_id: 'OT-1879', description: 'Continued as one of the Furadaana offices; prime ministerial candidate alongside Rannabandeyri and Handeygiri.' }
    ],
    alt_names: ['Farina', 'Faarhanaa Kilege'],
    source_refs: ['SRC-MRF-TITLES', 'SRC-SSRN-SUOOD-LEGAL']
  },
  {
    id: 'OFF-RANNABANDEYRI',
    name: 'Rannabandeyri',
    kind: 'furadaana',
    summary: 'Furadaana-level Great Officer of State and Keeper of the Crown Jewels; one of the three most likely candidates for Prime Minister. "Ranna" from Sanskrit ratna (jewel). Distinct from the ministerial-level Bodubandeyri and Maabandeyri.',
    functions: [
      { period_id: 'OT-17C', description: 'Minister of State and Keeper of the Crown Jewels within the Furadaana council; ranked among the six Great Officers.' },
      { period_id: 'OT-1834', description: 'Continued as Furadaana office with custody of royal regalia; Rannabandeyri Kilege was a senior male peerage title.' },
      { period_id: 'OT-1879', description: 'One of the premier Furadaana offices; holders could rise to Bodu Vazir (Prime Minister).' },
      { period_id: 'OT-20C', description: 'Ibrahim Nasir Rannabandeyri Kilegefan served as PM (1957-1968) and signed the independence agreement (1965); became first President of the Second Republic.' }
    ],
    alt_names: ['Rannabanderi', 'Rannabandeyri Kilege', 'Rannabandeyri Kilegefaanu'],
    source_refs: ['SRC-MRF-TITLES', 'SRC-SSRN-SUOOD-LEGAL', 'SRC-WIKI-CASTE-SYSTEM']
  },
  {
    id: 'OFF-BANDEYRI',
    name: 'Bandeyri',
    kind: 'ministerial',
    summary: 'Generic court/palace portfolio from Sanskrit bhandagara (treasury/storehouse). Parent term for a family of offices: Rannabandeyri (Furadaana-level), Bodubandeyri and Maabandeyri (Vazierun-level). When unqualified, refers to the palace household administration.',
    functions: [
      { period_id: 'OT-17C', description: 'Palace-household portfolio managing royal residence personnel and court protocol; Pyrard documents it among the principal offices.' },
      { period_id: 'OT-1834', description: 'Broadened state portfolio encompassing palace administration and selected public functions in Christopher\'s cabinet description.' },
      { period_id: 'OT-REPUBLIC', description: 'Title retained in elite family naming and in the modern Ministry of Finance portal (bandeyri.finance.gov.mv); no formal state function in republican governance.' }
    ],
    alt_names: ['Banderi', 'Bandaarain'],
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-WIKI-CASTE-SYSTEM', 'SRC-MRF-TITLES']
  },
  {
    id: 'OFF-BODUBANDEYRI',
    name: 'Bodubandeyri',
    kind: 'ministerial',
    summary: 'Chief Treasurer of the realm, ranking as Vizier (minister-level, below Furadaana). "Bodu" = great/chief in Dhivehi. Managed state treasury, tax collection via atoluverin and kateebs. Distinct from the Furadaana-level Rannabandeyri.',
    functions: [
      { period_id: 'OT-17C', description: 'Chief Treasurer ranking as Vizier; oversaw fiscal collections including vaaru (poll tax) and varuvaa (land tax) through atoll and island administrators.' },
      { period_id: 'OT-1834', description: 'Treasury minister in Christopher\'s cabinet; Bodu Bandeyri Manikufa\'anu held the post of Treasurer and Comptroller of Revenue.' },
      { period_id: 'OT-20C', description: 'Office evolved into the modern Ministry of Finance; the Ministry traces its lineage to the Bodubandeyri in its official history.' }
    ],
    alt_names: ['Bodu Banderi', 'Bodu Bandeyrin', 'Bodubanderi'],
    source_refs: ['SRC-MRF-TITLES', 'SRC-SSRN-SUOOD-LEGAL']
  },
  {
    id: 'OFF-MAABANDEYRI',
    name: 'Maabandeyri',
    kind: 'ministerial',
    summary: 'Chief of Palace Staff, Keeper of the Royal Seal (Kattiri Mudi), and Minister of the Royal Household. Ranked among the Vazierun (ministers). "Maa" = great/senior in Dhivehi.',
    functions: [
      { period_id: 'OT-17C', description: 'Minister of the Royal Household; responsible for palace staff, royal residence maintenance, and custody of the royal seal (Kattiri Mudi).' },
      { period_id: 'OT-1834', description: 'Continued as palace staff chief and royal seal keeper in Christopher\'s account of the cabinet.' }
    ],
    alt_names: ['Ma\'a Banderi', 'Maabanderi', 'Ma\'a Bandeyri'],
    source_refs: ['SRC-MRF-TITLES', 'SRC-WIKI-CASTE-SYSTEM']
  },
  {
    id: 'OFF-VELAANAA',
    name: 'Velaanaa',
    kind: 'military',
    summary: 'Admiral-in-Chief (First Lord of the Admiralty) and Foreign Minister; combined naval and diplomatic portfolio. Ranked among the Vazierun (ministers). Often paired with the Persian-derived title Shahbandar (harbour master).',
    functions: [
      { period_id: 'OT-17C', description: 'Admiral-in-Chief and Foreign Minister; supervised the Miru Baharu (harbour masters) and managed foreign diplomatic affairs. Pyrard documents the combined naval-diplomatic role.' },
      { period_id: 'OT-1834', description: 'Continued as the naval and foreign affairs portfolio in Christopher\'s cabinet; Velaanaa-Shahbandar maintained maritime and diplomatic oversight.' },
      { period_id: 'OT-REPUBLIC', description: 'Name survives in the Nasir family house name Velaanaagey; Velana International Airport renamed in 2017 after Ibrahim Nasir\'s family name.' }
    ],
    alt_names: ['Velana', 'Vela\'ana\'a', 'Velaanaa-Shahbandar'],
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-MRF-TITLES']
  },
  {
    id: 'OFF-FAIYLIA',
    name: 'Faiylia',
    kind: 'ministerial',
    summary: 'Chief Scribe and Keeper of Public Records; managed state documentation, correspondence, and official record-keeping.',
    functions: [
      { period_id: 'OT-17C', description: 'Chief scribe responsible for royal correspondence and state documentation; also managed receipt and custody of state property in some accounts.' },
      { period_id: 'OT-1834', description: 'Senior cabinet post managing public records and state correspondence in Christopher\'s account; office may have encompassed both record-keeping and stores functions.' }
    ],
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-MRF-TITLES']
  },
  {
    id: 'OFF-DHOSHIMEYNAA',
    name: 'Dhoshimeynaa',
    kind: 'furadaana',
    summary: 'Commander-in-Chief of Armed Forces; one of the six Furadaana Great Officers of State. Office created by Sultan Mohamed Thakurufaan (r. 1573-1585) who reorganized the military and appointed a Dhoshimeynaa Wazir as head of the security force.',
    functions: [
      { period_id: 'OT-17C', description: 'Commander-in-Chief and chief military officer in the Furadaana cabinet; Pyrard documents the office as army-general with supreme military authority.' },
      { period_id: 'OT-1834', description: 'Defense portfolio holder among the six Great Officers; Christopher describes military oversight and command authority.' },
      { period_id: 'OT-1879', description: 'Ibrahim Dhoshimeynaa Kilegefaanu served as Prime Minister on three occasions between 1883 and 1925, demonstrating the office\'s political prominence.' }
    ],
    alt_names: ['Dorhimeyna', 'Dorimena', 'Dhorhimeynaa'],
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-WIKI-CASTE-SYSTEM', 'SRC-MRF-TITLES']
  },
  {
    id: 'OFF-HAKURAA',
    name: 'Hakuraa',
    kind: 'ministerial',
    summary: 'Minister of Public Works; ranked among the Vazierun (ministers). Evolved from court audience/protocol management to encompass public works infrastructure oversight.',
    functions: [
      { period_id: 'OT-17C', description: 'Court audience and protocol office; managed formal reception, royal ceremony, and public works.' },
      { period_id: 'OT-1834', description: 'Minister of Public Works alongside traditional court-protocol duties in Christopher\'s cabinet description.' }
    ],
    alt_names: ['Hakura\'a'],
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-WIKI-CASTE-SYSTEM', 'SRC-MRF-TITLES']
  },
  {
    id: 'OFF-FANDIYAARU',
    name: 'Fandiyaaru',
    kind: 'judicial',
    summary: 'Chief Judge (Uttama Fandiyaaru) with civil and ecclesiastical jurisdiction; ranked ABOVE the Furadaana in precedence, making it the highest office after the sovereign. Responsible for justice, mosque maintenance, charitable trusts (waqf), marriage, and state chronicles.',
    functions: [
      { period_id: 'OT-14C', description: 'Qadi/chief judge with supreme judicial authority; Ibn Battuta served as Fandiyaaru (1343-1344) and noted the judge\'s orders were "like the decrees of the King himself, or even stronger." Called "fandiyaaru kaloa."' },
      { period_id: 'OT-17C', description: 'Grand Pandiare (Pyrard\'s Gallicization); supreme in ecclesiastical and judicial affairs, independent of the ministerial cabinet. Criminal justice shared with Bandaara Naibu (Attorney General).' },
      { period_id: 'OT-1834', description: 'Judicial authority maintained alongside the six-minister cabinet; the Uttama Fandiyaaru outranked all Furadaana members in precedence.' },
      { period_id: 'OT-1879', description: 'Chief judge continuing alongside a compressed ministerial model in Bell\'s account; consulted with Naibs when deciding cases.' },
      { period_id: 'OT-20C', description: 'Judicial office transitioning from traditional Qadi to constitutional court system. 1953 Constitution provided for Fandiyaaruge (Court) with Uttama Fandiyaaru and deputies.' }
    ],
    alt_names: ['Uttama Fandiyaaru', 'Pandiare', 'Fandia\'aru'],
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-MRF-TITLES']
  },
  {
    id: 'OFF-HANDEYGIRI',
    name: 'Handeygiri',
    kind: 'furadaana',
    summary: 'Administrator and one of the six Furadaana Great Officers of State; one of the three most likely candidates for Prime Minister alongside Faarhanaa and Rannabandeyri.',
    functions: [
      { period_id: 'OT-1834', description: 'Furadaana-level administrator in the senior cabinet; Handeygirin was among the Great Officers eligible for appointment as Bodu Vazir (Prime Minister).' },
      { period_id: 'OT-1879', description: 'Powerful ministerial office described by Bell as a central authority figure alongside Faashanaa in the compressed late-monarchy cabinet.' },
      { period_id: 'OT-REPUBLIC', description: 'Title survives in elite family naming; historically associated with administrative oversight.' }
    ],
    alt_names: ['Handeygirin', 'Handegiri'],
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-WIKI-CASTE-SYSTEM', 'SRC-MRF-TITLES']
  },
  {
    id: 'OFF-FAAMULADHEYRI',
    name: 'Faamuladheyri',
    kind: 'furadaana',
    summary: 'Minister of State and Royal Treasurer; one of the six Furadaana Great Officers. Before Thakurufaan\'s military reorganization, Faamuladheyri was one of three offices (with Maafaiy and Daharada) responsible for national security.',
    functions: [
      { period_id: 'OT-17C', description: 'Minister of State and Royal Treasurer within the Furadaana council; managed state finances alongside the lower-ranked Bodubandeyri (Chief Treasurer).' },
      { period_id: 'OT-1834', description: 'Senior treasury portfolio among the six Great Officers; Faamuladeyri Kilege holder oversaw royal finances and state budgeting.' },
      { period_id: 'OT-20C', description: 'Ibrahim Faamuladheyri Kilegefaanu (Ibrahim Ali Didi) appointed first Prime Minister when the Sultanate was restored in 1954.' }
    ],
    alt_names: ['Faamuladeyri', 'Fa\'amuladeri'],
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-WIKI-CASTE-SYSTEM', 'SRC-MRF-TITLES']
  },
  {
    id: 'OFF-MAAFAIY',
    name: 'Maafaiy',
    kind: 'furadaana',
    summary: 'Minister of State; one of the six Furadaana Great Officers. Before Thakurufaan\'s military reorganization, Maafaiy was one of three offices (with Faamuladheyri and Daharada) responsible for national security.',
    functions: [
      { period_id: 'OT-17C', description: 'Furadaana-level Minister of State; one of the six Great Officers with broad administrative authority.' },
      { period_id: 'OT-1834', description: 'Continued as Furadaana office in Christopher\'s cabinet; Ma\'afaiy Kilege was a senior male peerage title.' },
      { period_id: 'OT-20C', description: 'Ibrahim Maafaiy Thakurufaanu ("Dhon Thuttu") conducted official survey and cartographic work for historic maps of Male in 1921, suggesting a maritime/harbor association.' }
    ],
    alt_names: ['Ma\'afai', 'Ma\'afaiy'],
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-WIKI-CASTE-SYSTEM', 'SRC-MRF-TITLES']
  },
  {
    id: 'OFF-FAASHANAA',
    name: 'Faashanaa',
    kind: 'ministerial',
    summary: 'Police and security portfolio; ranked among the Vazierun (ministers). Pre-Islamic predecessor was Fithunaayaka (later Fennaa), the Chief Constable. May be related to the office of Fitna\'ayak (Minister for Police).',
    functions: [
      { period_id: 'OT-1879', description: 'Police and security portfolio reported by Bell as one of the powerful late-monarchy offices alongside Handeygiri.' },
      { period_id: 'OT-20C', description: 'Office evolved toward the modern police service; Sultan Muhammad Shamsuddeen III formally established a uniformed police force of 120 officers in 1933.' }
    ],
    alt_names: ['Fitna\'ayak', 'Fennaa', 'Fithunaayaka'],
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-WIKI-CASTE-SYSTEM', 'SRC-MRF-TITLES']
  },
  {
    id: 'OFF-NAIB',
    name: 'Naib (Naibu / Al-Naib)',
    kind: 'deputy',
    summary: 'Deputy/representative office from Arabic na\'ib. Multiple tiers: Bandaara Naibu (Attorney General) at the central level, Bodu Naibu (province leader) at the atoll level, and island Naibu (Fandiyaaru\'s local representative) at each inhabited island.',
    functions: [
      { period_id: 'OT-14C', description: 'Judicial deputies serving as the Fandiyaaru\'s representatives; Naibs heard complaints (sakuvaa) and implemented religious rulings.' },
      { period_id: 'OT-17C', description: 'Pyrard documents 13 Naibs in Male implementing laws; Bandaara Naibu served as Attorney General alongside the Fandiyaaru. In the atolls, Naibs served as judicial representatives.' },
      { period_id: 'OT-1834', description: 'Deputy/viceroy-rank minister in the six-office cabinet described by Christopher; the Naib also functioned as island-level judicial authority.' }
    ],
    alt_names: ['Naibu', 'Al-Naib', 'Bandaara Naibu'],
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-MRF-TITLES']
  }
];

export const officeTimeline = [
  {
    id: 'OT-14C',
    label: '14th century (Ibn Battuta era)',
    period: 'c. 1340s',
    summary: 'Structured court with a Furadaana council around the vizier, a distinct judicial office (Uttama Fandiyaaru) ranked above all ministers, and Naibs as judicial deputies.',
    offices: ['OFF-FURADHAANA', 'OFF-KILEGE', 'OFF-FANDIYAARU', 'OFF-NAIB'],
    source_refs: ['SRC-SSRN-SUOOD-LEGAL']
  },
  {
    id: 'OT-17C',
    label: 'Early 17th century (Pyrard account)',
    period: 'c. 1602-1607',
    summary: 'Full Furadaana council (Faarhanaa, Rannabandeyri, Dhoshimeynaa, Faamuladheyri, Maafaiy, Handeygiri) with Vazierun ministers (Velaanaa, Hakuraa, Bodubandeyri, Maabandeyri) below. Fandiyaaru ranked above all.',
    offices: ['OFF-FURADHAANA', 'OFF-KILEGE', 'OFF-FAARHANAA', 'OFF-RANNABANDEYRI', 'OFF-DHOSHIMEYNAA', 'OFF-FAAMULADHEYRI', 'OFF-MAAFAIY', 'OFF-HANDEYGIRI', 'OFF-VELAANAA', 'OFF-HAKURAA', 'OFF-BODUBANDEYRI', 'OFF-MAABANDEYRI', 'OFF-BANDEYRI', 'OFF-FAIYLIA', 'OFF-FANDIYAARU', 'OFF-NAIB'],
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-MRF-TITLES']
  },
  {
    id: 'OT-1834',
    label: '1834 (Christopher account)',
    period: '1834',
    summary: 'Six-minister cabinet with Furadaana offices (Faarhanaa, Rannabandeyri, Dhoshimeynaa, Faamuladheyri, Maafaiy, Handeygiri) and Vazierun (Velaanaa, Hakuraa, Bodubandeyri, Maabandeyri) documented. Fandiyaaru still distinct.',
    offices: ['OFF-FURADHAANA', 'OFF-KILEGE', 'OFF-FAARHANAA', 'OFF-RANNABANDEYRI', 'OFF-DHOSHIMEYNAA', 'OFF-FAAMULADHEYRI', 'OFF-MAAFAIY', 'OFF-HANDEYGIRI', 'OFF-VELAANAA', 'OFF-HAKURAA', 'OFF-BODUBANDEYRI', 'OFF-MAABANDEYRI', 'OFF-BANDEYRI', 'OFF-FAIYLIA', 'OFF-NAIB', 'OFF-FANDIYAARU'],
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-MRF-TITLES']
  },
  {
    id: 'OT-1879',
    label: '1879 (Bell account)',
    period: '1879',
    summary: 'Compressed cabinet: fewer distinct offices but concentrated power among Handeygiri and Faashanaa alongside the Furadaana. Fandiyaaru continues as chief judge.',
    offices: ['OFF-FURADHAANA', 'OFF-HANDEYGIRI', 'OFF-FAASHANAA', 'OFF-FANDIYAARU', 'OFF-RANNABANDEYRI', 'OFF-FAAMULADHEYRI', 'OFF-MAAFAIY', 'OFF-BODUBANDEYRI'],
    source_refs: ['SRC-SSRN-SUOOD-LEGAL']
  },
  {
    id: 'OT-20C',
    label: '20th century transition',
    period: '1932-1968',
    summary: 'Constitutional and legal centralization reduced older court-office autonomy. Rannabandeyri and Faamuladheyri Kilege holders served as Prime Ministers. Monarchy ended in 1968; all peerage titles abolished in 1979.',
    offices: ['OFF-FANDIYAARU', 'OFF-PRESIDENT', 'OFF-RANNABANDEYRI', 'OFF-FAAMULADHEYRI', 'OFF-DHOSHIMEYNAA', 'OFF-FAASHANAA'],
    source_refs: ['SRC-SSRN-SUOOD-LEGAL', 'SRC-WIKI-HEADS-STATE']
  },
  {
    id: 'OT-REPUBLIC',
    label: 'Republican era',
    period: '1968-present',
    summary: 'Traditional office titles persist in social memory and elite naming; Bodubandeyri legacy continues via the Ministry of Finance. Formal state leadership is under the presidency.',
    offices: ['OFF-PRESIDENT', 'OFF-FURADHAANA', 'OFF-BANDEYRI', 'OFF-HANDEYGIRI', 'OFF-RANNABANDEYRI', 'OFF-BODUBANDEYRI'],
    source_refs: ['SRC-PO-AMIN', 'SRC-PO-NASIR', 'SRC-PO-MAUMOON', 'SRC-PO-NASHEED', 'SRC-PO-WAHEED', 'SRC-PO-SOLIH', 'SRC-PO-MUIZZU', 'SRC-WIKI-CASTE-SYSTEM', 'SRC-MRF-TITLES']
  }
];

export const officeById = new Map(officeCatalog.map(o => [o.id, o]));

const timelineById = new Map(officeTimeline.map(p => [p.id, p]));

/** Extract numeric year from a timeline period string. */
function periodYear(period) {
  const m = (period || '').match(/\d{3,4}/);
  return m ? parseInt(m[0], 10) : null;
}

/** Get function description for office in a specific period. Falls back to summary. */
export function officeFunctionForPeriod(officeId, periodId) {
  const o = officeById.get(officeId);
  if (!o) return '';
  const fn = (o.functions || []).find(f => f.period_id === periodId);
  return fn?.description || o.summary || '';
}

/** Get best-matching function for an office given a year. Finds closest timeline period. */
export function officeFunctionForYear(officeId, year) {
  const o = officeById.get(officeId);
  if (!o || !year) return '';
  const funcs = o.functions || [];
  if (!funcs.length) return '';
  let bestDist = Infinity;
  let bestDesc = '';
  for (const fn of funcs) {
    const p = timelineById.get(fn.period_id);
    const py = p ? periodYear(p.period) : null;
    if (py == null) continue;
    const dist = Math.abs(py - year);
    if (dist < bestDist) {
      bestDist = dist;
      bestDesc = fn.description;
    }
  }
  return bestDesc;
}

/** Build map: officeId -> sorted list of { personId, label, start, end, c }. */
export function buildOfficeHolders(ppl) {
  const map = new Map();
  for (const p of ppl) {
    for (const o of (p.offices_held || [])) {
      const oid = o.office_id;
      if (!oid) continue;
      if (!map.has(oid)) map.set(oid, []);
      map.get(oid).push({
        personId: p.id,
        label: o.label || '',
        start: o.start ?? null,
        end: o.end ?? null,
        c: o.c || 'c'
      });
    }
    // Infer sovereign office from reign record
    if ((p.n || []).length && (p.re || []).length) {
      const years = p.re.flat().filter(y => Number.isFinite(y));
      if (years.length) {
        const oid = 'OFF-SOVEREIGN';
        if (!map.has(oid)) map.set(oid, []);
        const existing = map.get(oid);
        if (!existing.some(h => h.personId === p.id)) {
          existing.push({
            personId: p.id,
            label: '',
            start: Math.min(...years),
            end: Math.max(...years),
            c: 'c'
          });
        }
      }
    }
  }
  // Sort each list by start year
  for (const [, holders] of map) {
    holders.sort((a, b) => (a.start ?? 9999) - (b.start ?? 9999));
  }
  return map;
}

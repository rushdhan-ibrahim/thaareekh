import state from '../state.js';
import { byId } from '../data/sovereigns.merge.js';

const D = {
  en: {
    select_sovereign: 'Select a sovereign',
    click_node_details: 'Click any node to view details and connections.',
    graph: 'Graph',
    tree: 'Tree',
    focus: 'Focus',
    details_panel: 'Details',
    show_sidebar: 'Show details pane',
    hide_sidebar: 'Hide details pane',
    close_sidebar: 'Close sidebar (Esc)',
    institutions: 'Institutions',
    all_dynasties: 'All dynasties',
    all_trees: 'All trees',
    all_source_grades: 'All source grades',
    all_eras: 'All Eras',
    all_years: 'All years',
    era: 'Era',
    relation_colors: 'Relation Colors',
    confidence_overlay: 'Confidence Overlay',
    source_grade_overlay: 'Source Grade Overlay',
    compact: 'Compact',
    comfortable: 'Comfortable',
    presentation: 'Presentation',
    grade_a: 'Grade A',
    grade_b: 'Grade B',
    grade_c: 'Grade C',
    grade_d: 'Grade D',
    export: 'Export',
    export_png: 'PNG Snapshot',
    export_pdf: 'PDF (Print)',
    export_json: 'JSON Citation Bundle',
    profile: 'Profile',
    offices: 'Offices',
    evidence: 'Evidence',
    map: 'Map',
    known_names: 'Known Names',
    known_by: 'Known By / Sobriquets',
    titles: 'Titles',
    royal_links: 'Royal Links',
    compare: 'Compare',
    interesting_facts: 'Interesting Facts',
    reign: 'Reign',
    life: 'Life',
    born: 'Born',
    died: 'Died',
    connections: 'Connections',
    unknown: 'Unknown',
    unknown_dynasty: 'Unknown Dynasty',
    set_a: 'Set A',
    set_b: 'Set B',
    compare_next: 'Compare Next',
    royal_sovereign: 'Sovereign',
    royal_descent: 'Documented Descent',
    royal_collateral: 'Collateral Royal Kin',
    royal_affinal: 'Affinal Link',
    royal_uncertain: 'Uncertain Royal Link',
    royal_documented: 'Documented Royal Link',
    royal_none: 'No Documented Royal Link',
    relation: 'Relationship',
    relation_parent: 'Parent -> Child',
    relation_parent_to_child: 'parent -> child',
    relation_child_to_parent: 'child -> parent',
    relation_sibling: 'Sibling',
    relation_spouse: 'Spouse',
    relation_kin: 'Kin',
    edge_parent: 'Parent',
    edge_sibling: 'Sibling',
    edge_spouse: 'Spouse',
    edge_kin: 'Kin',
    confirmed: 'confirmed',
    inferred: 'inferred',
    uncertain: 'uncertain',
    go: 'Go',
    show_more: 'Show',
    more_fact: 'more fact',
    more_facts: 'more facts',
    more_source: 'more source',
    more_sources: 'more sources',
    no_known_by_names: 'No additional known-by names attached.',
    no_modeled_relation_links: 'No modeled relation links yet for this node.',
    no_inferred_uncertain_links: 'No inferred or uncertain links for this person in the current dataset.',
    path: 'Path',
    period_unknown: 'Period unknown',
    office_generic: 'Office',
    no_office_records: 'No office records attached for this person yet.',
    no_institutions_loaded: 'No institutions loaded.',
    role_summary_unavailable: 'Role summary unavailable.',
    sources_label: 'Sources',
    office_title_glossary: 'Office and title glossary',
    period_word: 'Period',
    periods_word: 'periods',
    offices_word: 'offices',
    regnal: 'Regnal',
    local_archive: 'Local archive',
    external_links_offline_notice: 'external links may be unavailable offline',
    edge_source_stack: 'Edge Source Stack',
    no_edge_sources: 'No edge-level citations attached.',
    edge_sources_count: 'Cited sources for this edge',
    link_confirmed_text: 'This link is currently modeled as confirmed in the working graph.',
    link_inferred_text: 'This link is inferred from compiled sources and should be treated as provisional.',
    link_uncertain_text: 'This link remains uncertain and should be interpreted cautiously pending stronger corroboration.',
    claim_type: 'Claim type',
    confidence_grade: 'Confidence grade',
    edge_type: 'Type',
    edge_confidence: 'Confidence',
    edge_source: 'Source',
    edge_target: 'Target',
    edge_label: 'Label',
    edge_context: 'Context',
    explore_endpoints: 'Explore Endpoints',
    history_empty: 'No exploration history yet.',
    year_unknown: 'Year unknown',
    relationship_path: 'Relationship Path',
    no_relationship_path: 'No represented path found between these two people within 12 hops.',
    same_person: 'Same person.',
    weighted_score: 'weighted score',
    not_available_short: 'n/a',
    compare_title: 'Compare',
    unknown_short: 'Unknown',
    known_names_count: 'Known names',
    go_a: 'Go A',
    go_b: 'Go B',
    swap: 'Swap',
    clear: 'Clear',
    compare_label: 'Compare:',
    versus_short: 'vs',
    select_next_person: 'select next person…',
    no_matches: 'No matches',
    fit: 'Fit',
    reset: 'Reset',
    reset_view: 'Reset view (0)',
    tree_options: 'Tree Options',
    view_tree: 'View tree',
    linked_trees_only: 'Linked trees only',
    linked_trees_desc: 'Show only trees that share connections',
    all_trees_shown: 'All trees shown',
    trees_word: 'trees',
    source_word: 'source',
    sources_word: 'sources',
    grade_word: 'grade',
    relationship_link_word: 'relationship link',
    relationship_links_word: 'relationship links',
    profile_evidence_basis: 'This profile currently rests on',
    confidence_mix: 'Confidence mix',
    source_strength_label: 'Source strength',
    relation_distribution_label: 'Relation distribution',
    and_word: 'and',
    are_connected_as: 'are connected as',
    of_word: 'of',
    royal_summary_sovereign: 'Direct royal status: this person is a sovereign in the monarchy succession.',
    royal_summary_none: 'No documented royal-line connection is currently represented in this dataset.',
    royal_summary_documented_descent: 'Documented descent',
    royal_summary_documented_link_prefix: 'Documented link',
    royal_summary_via: 'via',
    family_links: 'family links',
    derived_from_reign_record: 'Derived from accession/reign record.',
    sultan_queen_regnant: 'Sultan / Queen Regnant',
    sultan_title: 'Sultan',
    queen_title: 'Queen',
    sovereign_title: 'Sovereign',
    filter_year: 'Filter year',
    hop_singular: 'hop',
    hop_plural: 'hops',
    reason_filter: 'filter',
    reason_number: 'number',
    reason_name: 'name',
    reason_alias: 'alias',
    reason_known_as: 'known-as',
    reason_regnal: 'regnal',
    reason_title: 'title',
    reason_office: 'office',
    reason_dynasty: 'dynasty',
    reason_fuzzy: 'fuzzy',
    reason_match: 'match',
    year_word: 'year',
    overlay_confidence: 'overlay: confidence',
    overlay_source: 'overlay: source',
    open_profile_for: 'Open profile for',
    map_context: 'Map Context',
    map_birth: 'Birth location',
    map_death: 'Death location',
    map_context_nodes: 'Context locations',
    map_routes: 'Route hints',
    evidence_narrative: 'Evidence Narrative',
    key_sources: 'Key Sources',
    uncertainty_watchlist: 'Uncertainty Watchlist',
    no_sources: 'No sources attached.',
    no_connections: 'No connections.',
    held_offices_titles: 'Held Offices and Titles',
    historical_office_timeline: 'Historical Office Timeline',
    institution_timeline: 'Institution Timeline',
    office_catalog: 'Office Catalog',
    periodized_view: 'Periodized View',
    relationship: 'Relationship',
    connected_people: 'Connected People',
    parents: 'Parents',
    children: 'Children',
    siblings: 'Siblings',
    spouses: 'Spouses',
    other_kin: 'Other Kin',
    search_placeholder: 'Search name/known-as/title/# · filters: dy:hilaaly c:u o:fandiyaaru',
    early_sovereigns: 'Early Sovereigns',
    minor_trees: 'Minor Trees',
    unconnected: 'Unconnected',
    // --- Filter panel section headings ---
    filter_heading: 'Filters',
    filter_dynasty_tree: 'Dynasty & Tree',
    filter_edge_types: 'Edge Types',
    filter_confidence: 'Confidence',
    filter_sources_overlay: 'Sources & Overlay',
    filter_display: 'Display',
    filter_story_trails: 'Story Trails',
    command_search_placeholder: 'Search names, dynasties\u2026',
    command_empty_hint: 'Type to search people, dynasties, offices\u2026',
    // --- Legend & About ---
    legend: 'Legend',
    legend_parent_child: 'Parent\u2192Child',
    legend_sibling: 'Sibling',
    legend_spouse: 'Spouse',
    legend_kin: 'Kin',
    legend_inferred: 'Inferred',
    legend_uncertain: 'Uncertain',
    about: 'About',
    about_text: 'Nodes = individuals (multiple accessions merged). \u2640 = female sovereigns. Inferred edges are deductions; uncertain edges mark ambiguous sources. Baseline provenance defaults to the kings-list source unless an edge/person has curated citations attached.',
    method_confidence: 'Method & Confidence',
    method_confidence_classes: 'Confidence classes',
    method_source_grades: 'Source grades',
    method_conf_c: 'Confirmed (c): explicitly stated relationship in cited sources.',
    method_conf_i: 'Inferred (i): relationship is modeled from supporting facts, but not directly stated as that exact edge.',
    method_conf_u: 'Uncertain (u): sources conflict or remain ambiguous for this exact relationship.',
    method_grade_a: 'Grade A: official/primary source with direct claim support.',
    method_grade_b: 'Grade B: strong specialist or secondary source support.',
    method_grade_c: 'Grade C: plausible but limited corroboration; keep under active review.',
    method_grade_d: 'Grade D: contested/weak evidence; do not treat as settled.',
    method_inference_hint: 'For inferred edges, open the relationship card to see node-specific inference logic and verification checklist.',
    method_open_explainer: 'Open full confidence & grade explainer',
    method_open_tracker: 'Open inference dossier tracker (edge\u2192file)',
    method_verification_flow: 'Verification flow',
    method_flow_1: 'Open an inferred relationship edge.',
    method_flow_2: 'Review pair-specific inference logic and checklist.',
    method_flow_3: 'Open the pair dossier and source trail before accepting or promoting the claim.',
    inference_logic: 'Inference Logic',
    inference_rule: 'Inference rule',
    inference_rule_manual: 'Handcrafted dossier',
    inference_rule_derived: 'Rule-derived family inference',
    inference_rule_unknown: 'Inference detail pending curation',
    inference_rule_shared_parent: 'Shared-parent sibling rule',
    inference_rule_parent_of_parent: 'Parent-of-parent grandparent rule',
    inference_rule_parent_sibling: 'Parent+sibling aunt/uncle rule',
    inference_rule_children_of_siblings: 'Children-of-siblings cousin rule',
    inference_no_detail: 'No handcrafted explanation is attached yet for this inferred edge.',
    inference_verification_checklist: 'Verification Checklist',
    inference_bases: 'Inference bases',
    inference_open_dossier: 'Open full pair dossier (Markdown)',
    inference_dossier_unavailable: 'No dossier path is attached for this inferred edge yet.',
    inference_open_explainer: 'How confidence and grades are defined',
    inference_open_tracker: 'Open inference dossier tracker',
    inference_edge_key: 'Edge key',
    inference_dossier_path: 'Dossier path',
    inference_logic_steps: 'How this inference is derived',
    inference_no_bases: 'No explicit basis sources are attached to this inferred edge.'
  },
  dv: {
    // --- ނެވިގޭޝަން / ލޭއައުޓް ---
    select_sovereign: 'ރަސްކަލެއް ނުވަތަ މީހެއް ޚިޔާރުކުރައްވާ',
    click_node_details: 'ތަފުޞީލު ބެއްލެވުމަށް ނޯޑެއްގައި ފިއްތަވާ.',
    graph: 'ޖާލަ',
    tree: 'ގަސް',
    focus: 'ފޯކަސް',
    details_panel: 'ތަފުޞީލު',
    show_sidebar: 'ތަފުޞީލު ދައްކާ',
    hide_sidebar: 'ތަފުޞީލު ފޮރުވާ',
    close_sidebar: 'ސައިޑްބާ ބަންދުކުރޭ (Esc)',
    institutions: 'މުއައްސަސާ',
    // --- ފިލްޓަރ ---
    all_dynasties: 'ހުރިހާ ދަރިކޮޅު',
    all_trees: 'ހުރިހާ ޢާއިލާ',
    all_source_grades: 'ހުރިހާ މަސްދަރު ދަރަޖަ',
    all_eras: 'ހުރިހާ ޒަމާން',
    all_years: 'ހުރިހާ އަހަރު',
    era: 'ޒަމާން',
    relation_colors: 'ގުޅުމުގެ ކުލަ',
    confidence_overlay: 'ޔަޤީންކަމުގެ ފަށަލަ',
    source_grade_overlay: 'މަސްދަރު ދަރަޖައިގެ ފަށަލަ',
    compact: 'ކުޑަކޮށް',
    comfortable: 'މެދުމިނަށް',
    presentation: 'ބޮޑުކޮށް',
    grade_a: 'ދަރަޖަ A',
    grade_b: 'ދަރަޖަ B',
    grade_c: 'ދަރަޖަ C',
    grade_d: 'ދަރަޖަ D',
    // --- އެކްސްޕޯޓް ---
    export: 'އެކްސްޕޯޓު',
    export_png: 'PNG ތަޞްވީރު',
    export_pdf: 'PDF (ޗާޕު)',
    export_json: 'JSON ބަންޑެލި',
    // --- ޕްރޮފައިލް ޓެބް ---
    profile: 'ޕްރޮފައިލް',
    offices: 'މަޤާމު',
    evidence: 'ހެކި',
    map: 'ޗާޓު',
    known_names: 'ކިޔައި އުޅޭ ނަންތައް',
    known_by: 'ނަންކިޔުނު ގޮތް',
    titles: 'ލަޤަބު',
    royal_links: 'ރަސްކަމުގެ ގުޅުން',
    compare: 'އަޅާކިޔުން',
    interesting_facts: 'ޝައުޤުވެރި ކަންކަން',
    // --- ތާރީޚީ ---
    reign: 'ރަސްކަން',
    life: 'ޙަޔާތް',
    born: 'އުފަންވީ',
    died: 'ނިޔާވީ',
    connections: 'ގުޅުންތައް',
    unknown: 'އެނގިފައެއް ނެތް',
    unknown_dynasty: 'ނޭނގޭ ދަރިކޮޅު',
    // --- އަޅާކިޔުން ---
    set_a: 'A ކޮޅު',
    set_b: 'B ކޮޅު',
    compare_next: 'ދެން އަޅާކިޔާ',
    compare_title: 'އަޅާކިޔުން',
    compare_label: 'އަޅާކިޔުން:',
    // --- ރަސްކަމުގެ ގުޅުން ---
    royal_sovereign: 'ރަދުން',
    royal_descent: 'ލިޔެކިޔުމުން ސާބިތު ނަސަބު',
    royal_collateral: 'ރަސްކަމާ ގުޅޭ ތިމާގެ ގުޅުން',
    royal_affinal: 'ކައިވެނީގެ ގުޅުން',
    royal_uncertain: 'ޔަޤީން ނޫން ރަސްކަމުގެ ގުޅުން',
    royal_documented: 'ލިޔެކިޔުމުން ސާބިތު ގުޅުން',
    royal_none: 'ރަސްކަމުގެ ގުޅުމެއް ލިޔެކިޔުމުން ފެންނާކަށް ނެތް',
    // --- ގުޅުމުގެ ބާވަތް ---
    relation: 'ގުޅުން',
    relation_parent: 'މައިންބަފައިން → ދަރި',
    relation_parent_to_child: 'މައިންބަފައިން → ދަރި',
    relation_child_to_parent: 'ދަރި → މައިންބަފައިން',
    relation_sibling: 'އެއްބަނޑު',
    relation_spouse: 'ކައިވެނި',
    relation_kin: 'ތިމާގެ',
    edge_parent: 'މައިންބަފައިން',
    edge_sibling: 'އެއްބަނޑު',
    edge_spouse: 'ކައިވެނި',
    edge_kin: 'ތިމާގެ',
    // --- ޔަޤީންކަން ---
    confirmed: 'ޔަޤީން',
    inferred: 'ލަފާކުރެވޭ',
    uncertain: 'ޔަޤީން ނޫން',
    // --- ޢާންމު ބަސް ---
    go: 'ދޭ',
    show_more: 'އިތުރަށް',
    more_fact: 'އިތުރު ކަމެއް',
    more_facts: 'އިތުރު ކަންކަން',
    more_source: 'އިތުރު މަސްދަރެއް',
    more_sources: 'އިތުރު މަސްދަރު',
    no_known_by_names: 'އިތުރު ނަމެއް އެނގޭކަށް ނެތް.',
    no_modeled_relation_links: 'މި ނޯޑަށް ގުޅުމެއް ރެކޯޑު ކުރެވިފައެއް ނެތް.',
    no_inferred_uncertain_links: 'މި މީހާއާ ގުޅޭ ލަފާކުރެވޭ ނުވަތަ ޔަޤީން ނޫން ގުޅުމެއް ނެތް.',
    path: 'މަގު',
    period_unknown: 'ދައުރު އެނގިފައެއް ނެތް',
    office_generic: 'މަޤާމު',
    no_office_records: 'މި މީހާގެ މަޤާމެއްގެ ރެކޯޑެއް ނެތް.',
    no_institutions_loaded: 'މުއައްސަސާގެ މަޢުލޫމާތު ލޯޑެއް ނުވި.',
    role_summary_unavailable: 'ދައުރުގެ ޚުލާޞާ ލިބެން ނެތް.',
    sources_label: 'މަސްދަރު',
    office_title_glossary: 'މަޤާމާއި ލަޤަބުގެ ފިހުރިސްތު',
    period_word: 'ދައުރު',
    periods_word: 'ދައުރުތައް',
    offices_word: 'މަޤާމުތައް',
    regnal: 'ރަސްކަމުގެ ނަން',
    local_archive: 'ލޯކަލް އާކައިވް',
    external_links_offline_notice: 'އޮފްލައިންގައި ބައެއް ލިންކު ނުހުޅުވިދާނެ.',
    // --- ގުޅުމުގެ މަސްދަރު ---
    edge_source_stack: 'ގުޅުމުގެ މަސްދަރުތައް',
    no_edge_sources: 'ގުޅުމުގެ ސައިޓޭޝަނެއް ނެތް.',
    edge_sources_count: 'މި ގުޅުމުގެ މަސްދަރު',
    link_confirmed_text: 'މި ގުޅުން ޔަޤީން ގުޅުމެއްގެ ގޮތުގައި ރެކޯޑު ކުރެވިފައި.',
    link_inferred_text: 'މި ގުޅުމަކީ މަސްދަރުތަކުން ލަފާކުރެވޭ ގުޅުމެއް.',
    link_uncertain_text: 'މި ގުޅުން އަދި ޔަޤީންވެފައެއް ނެތް؛ އިތުރު ހެކި ބޭނުންވޭ.',
    claim_type: 'ދަޢުވާގެ ބާވަތް',
    confidence_grade: 'ޔަޤީންކަމުގެ ދަރަޖަ',
    edge_type: 'ބާވަތް',
    edge_confidence: 'ޔަޤީންކަން',
    edge_source: 'މަސްދަރު',
    edge_target: 'އަމާޒު',
    edge_label: 'ލޭބަލް',
    edge_context: 'ޙާލަތު',
    explore_endpoints: 'ދެކޮޅު ބައްލަވާ',
    history_empty: 'ބެއްލެވުމުގެ ތާރީޚެއް ނެތް.',
    year_unknown: 'އަހަރު ނޭނގޭ',
    // --- ގުޅުން ހޯދުން ---
    relationship_path: 'ގުޅުމުގެ މަގު',
    no_relationship_path: 'މި ދެ މީހުންގެ ދެމެދު 12 ފިޔަވަޅުގެ ތެރޭ ގުޅުމެއް ނުފެނުނު.',
    same_person: 'އެއީ އެއް މީހެއް.',
    weighted_score: 'ބަރުދަނީ މިންގަނޑު',
    not_available_short: 'ނ/އ',
    unknown_short: 'ނޭނގޭ',
    known_names_count: 'ކިޔައި އުޅޭ ނަންތައް',
    go_a: 'A ބައްލަވާ',
    go_b: 'B ބައްލަވާ',
    swap: 'ބަދަލުކުރޭ',
    clear: 'ފޮހެލާ',
    versus_short: 'އާ',
    select_next_person: 'ދެން ޚިޔާރުކުރައްވާ…',
    no_matches: 'ނަތީޖާއެއް ނެތް',
    fit: 'ފިޓް',
    reset: 'ރީސެޓް',
    reset_view: 'ވިއު ރީސެޓް (0)',
    tree_options: 'ގަސް އޮޕްޝަން',
    view_tree: 'ގަސް ބަލާ',
    linked_trees_only: 'ގުޅިފައިވާ ގަސްތައް އެކަނި',
    linked_trees_desc: 'ގުޅުންތައް ހިއްސާކުރާ ގަސްތައް ދައްކާ',
    all_trees_shown: 'ހުރިހާ ގަސްތައް ދައްކާފައި',
    trees_word: 'ގަސްތައް',
    // --- ތަފާސް ހިސާބު ---
    source_word: 'މަސްދަރު',
    sources_word: 'މަސްދަރު',
    grade_word: 'ދަރަޖަ',
    relationship_link_word: 'ގުޅުމެއް',
    relationship_links_word: 'ގުޅުންތައް',
    profile_evidence_basis: 'މި ޕްރޮފައިލް ބިނާވެފައިވަނީ',
    confidence_mix: 'ޔަޤީންކަމުގެ ނިސްބަތް',
    source_strength_label: 'މަސްދަރުގެ ބާރު',
    relation_distribution_label: 'ގުޅުންތައް ބެހިފައިވާ ގޮތް',
    and_word: 'އަދި',
    are_connected_as: 'ގުޅިފައިވަނީ',
    of_word: 'ގެ',
    // --- ރަސްކަމުގެ ޚުލާޞާ ---
    royal_summary_sovereign: 'ސީދާ ރަސްކަމުގެ މަޤާމު: މި ބޭފުޅާއަކީ ރަސްކަމުގެ ސިލްސިލާގެ ރަސްކަލެއް.',
    royal_summary_none: 'މި ޑޭޓާގައި ރަސްކަމާ ގުޅޭ ގުޅުމެއް ލިޔެކިޔުމުން ފެންނާކަށް ނެތް.',
    royal_summary_documented_descent: 'ލިޔެކިޔުމުން ސާބިތު ނަސަބު',
    royal_summary_documented_link_prefix: 'ލިޔެކިޔުމުން ސާބިތު ގުޅުން',
    royal_summary_via: 'މެދުވެރިކޮށް',
    family_links: 'ޢާއިލީ ގުޅުން',
    derived_from_reign_record: 'ރަސްކަމުގެ ރެކޯޑުން ނެގިފައި.',
    // --- ލަޤަބު ---
    sultan_queen_regnant: 'ސުލްޠާން / ރެހެންދި',
    sultan_title: 'ސުލްޠާން',
    queen_title: 'ރެހެންދި',
    sovereign_title: 'ރަދުން',
    filter_year: 'އަހަރު ފިލްޓަރ',
    hop_singular: 'ފިޔަވަޅު',
    hop_plural: 'ފިޔަވަޅު',
    // --- ހޯދުމުގެ ނަތީޖާ ---
    reason_filter: 'ފިލްޓަރ',
    reason_number: 'ނަންބަރު',
    reason_name: 'ނަން',
    reason_alias: 'ނަމުގެ ބަދަލު',
    reason_known_as: 'ކިޔައި އުޅޭ',
    reason_regnal: 'ރަސްކަމުގެ ނަން',
    reason_title: 'ލަޤަބު',
    reason_office: 'މަޤާމު',
    reason_dynasty: 'ދަރިކޮޅު',
    reason_fuzzy: 'ގާތްގަނޑަކަށް',
    reason_match: 'ދިމާވީ',
    year_word: 'އަހަރު',
    overlay_confidence: 'ފަށަލަ: ޔަޤީންކަން',
    overlay_source: 'ފަށަލަ: މަސްދަރު',
    open_profile_for: 'ޕްރޮފައިލް ހުޅުވާ',
    // --- ޗާޓު ---
    map_context: 'ޗާޓުގެ ޙާލަތު',
    map_birth: 'އުފަންވީ ތަން',
    map_death: 'ނިޔާވީ ތަން',
    map_context_nodes: 'ގުޅޭ ތަންތަން',
    map_routes: 'މަގުގެ އިޝާރާ',
    // --- ހެކި ---
    evidence_narrative: 'ހެކީގެ ތަފުޞީލު',
    key_sources: 'މުހިންމު މަސްދަރު',
    uncertainty_watchlist: 'ޔަޤީން ނޫން ގުޅުންތައް',
    no_sources: 'މަސްދަރެއް ނެތް.',
    no_connections: 'ގުޅުމެއް ނެތް.',
    // --- މަޤާމު / މުއައްސަސާ ---
    held_offices_titles: 'ފުރުއްވި މަޤާމާއި ލަޤަބު',
    historical_office_timeline: 'ތާރީޚީ މަޤާމުގެ ޓައިމްލައިން',
    institution_timeline: 'މުއައްސަސާގެ ޓައިމްލައިން',
    office_catalog: 'މަޤާމުގެ ފިހުރިސްތު',
    periodized_view: 'ދައުރުތަކަށް ބެހިފައި',
    // --- ޢާއިލީ ގުޅުން ---
    relationship: 'ގުޅުން',
    connected_people: 'ގުޅިފައިވާ މީހުން',
    parents: 'މައިންބަފައިން',
    children: 'ދަރިން',
    siblings: 'އެއްބަނޑު މީހުން',
    spouses: 'ކައިވެނީގެ ބައިވެރިން',
    other_kin: 'އެހެނިހެން ތިމާގެ މީހުން',
    // --- ހޯދުން ---
    search_placeholder: 'ނަން/ލަޤަބު/# ހޯދާ · dy:hilaaly c:u o:fandiyaaru',
    // --- ގަސް ސެކްޝަން ---
    early_sovereigns: 'ކުރީގެ ރަސްރަސްކަލުން',
    minor_trees: 'ކުދި ޢާއިލާ',
    unconnected: 'ގުޅުމެއް ނެތް',
    // --- ފިލްޓަރ ސެކްޝަން ---
    filter_heading: 'ފިލްޓަރ',
    filter_dynasty_tree: 'ދަރިކޮޅާއި ޢާއިލާ',
    filter_edge_types: 'ގުޅުމުގެ ބާވަތް',
    filter_confidence: 'ޔަޤީންކަން',
    filter_sources_overlay: 'މަސްދަރާއި ފަށަލަ',
    filter_display: 'ޑިސްޕްލޭ',
    filter_story_trails: 'ވާހަކައިގެ މަގު',
    command_search_placeholder: 'ނަން، ދަރިކޮޅު ހޯދާ\u2026',
    command_empty_hint: 'ނަން، ދަރިކޮޅު، މަޤާމު ހޯދާ\u2026',
    // --- ލީޖެންޑް / ތަޢާރަފު ---
    legend: 'ކުލައިގެ މާނަ',
    legend_parent_child: 'މައިންބަފައިން\u2192ދަރި',
    legend_sibling: 'އެއްބަނޑު',
    legend_spouse: 'ކައިވެނި',
    legend_kin: 'ތިމާގެ',
    legend_inferred: 'ލަފާކުރެވޭ',
    legend_uncertain: 'ޔަޤީން ނޫން',
    about: 'ތަޢާރަފު',
    about_text: 'ނޯޑު = ފަރުދީ މީހުން (އެއް ރަސްކަލެއްގެ ތަފާތު އިސްތިލާޙު އެއްކޮށްފައި). \u2640 = އަންހެން ރަދުން (ރެހެންދި). ލަފާކުރެވޭ ގުޅުންތަކީ މަސްދަރުތަކުން ދޭހަވާ ގުޅުން؛ ޔަޤީން ނޫން ގުޅުންތަކީ ފެންނަ ހެކި ކުޑަ ގުޅުން. އެހެން ގޮތަކަށް ބަޔާންކޮށްފައި ނެތް ނަމަ، މަޢުލޫމާތުގެ އަޞްލަކީ ރަސްކަލުންގެ ލިސްޓު.',
    method_open_explainer: 'ޔަޤީންކަމާއި ދަރަޖަގެ ފުރިހަމަ ގައިޑު ހުޅުވާ',
    method_open_tracker: 'އިންފަރެންސް ޑޯސިއަރ ޓްރެކަރ (edge→file) ހުޅުވާ',
    method_verification_flow: 'Verification flow',
    method_flow_1: 'Open an inferred relationship edge.',
    method_flow_2: 'Review pair-specific inference logic and checklist.',
    method_flow_3: 'Open the pair dossier and source trail before accepting or promoting the claim.',
    inference_open_dossier: 'މި ދެ ނޯޑުގެ ފުރިހަމަ ޑޯސިއަރ (Markdown) ހުޅުވާ',
    inference_dossier_unavailable: 'މި inferred edge އަށް ޑޯސިއަރ މަގު ލިންކު ނެތް.',
    inference_open_explainer: 'ޔަޤީންކަމާއި ދަރަޖަ މާނަ ބަލާ',
    inference_open_tracker: 'Open inference dossier tracker',
    inference_edge_key: 'Edge key',
    inference_dossier_path: 'Dossier path',
    inference_logic_steps: 'How this inference is derived',
    inference_no_bases: 'No explicit basis sources are attached to this inferred edge.'
  }
};

const NAME_DV = new Map([
  ['P97', 'މުހައްމަދު އަމީން ދީދީ'],
  ['P98', 'އިބްރާހިމް ނާސިރު'],
  ['P99', 'މުހައްމަދު ފަރީދު ދީދީ'],
  ['P119', 'މައުމޫން ޢަބްދުލް ޤައްޔޫމް'],
  ['P120', 'މުހައްމަދު ނަޝީދު']
]);

function normalizeLang(v) {
  return v === 'dv' ? 'dv' : 'en';
}

export function getLang() {
  return normalizeLang(state.lang);
}

export function t(key) {
  const lang = getLang();
  return D[lang]?.[key] ?? D.en[key] ?? key;
}

export function relationLabel(type) {
  if (type === 'parent') return t('relation_parent');
  if (type === 'sibling') return t('relation_sibling');
  if (type === 'spouse') return t('relation_spouse');
  return t('relation_kin');
}

export function personName(personOrId) {
  const p = typeof personOrId === 'string' ? byId.get(personOrId) : personOrId;
  if (!p) return typeof personOrId === 'string' ? personOrId : '';
  if (getLang() === 'dv') return NAME_DV.get(p.id) || p.name_dv || p.nm;
  return p.nm;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setOptionLabel(sel, value, label) {
  const el = document.getElementById(sel);
  if (!el) return;
  const opt = [...el.options].find(o => o.value === value);
  if (opt) opt.textContent = label;
}

function setChipLabel(sel, label) {
  const el = document.querySelector(sel);
  if (!el) return;
  const dot = el.querySelector('.cd');
  if (!dot) {
    el.textContent = label;
    return;
  }
  [...el.childNodes].forEach(n => {
    if (n !== dot) n.remove();
  });
  el.append(document.createTextNode(label));
}

export function refreshChromeLabels() {
  setText('vmg', t('graph'));
  setText('vmt', t('tree'));
  setText('treeOptBtn', t('tree_options'));
  setText('fm', t('focus'));
  setText('vms', t('details_panel'));
  setText('vmi', t('institutions'));
  setText('bf', t('fit'));
  setText('br', t('reset'));
  const rvBtn = document.getElementById('resetView');
  if (rvBtn) { rvBtn.title = t('reset_view'); rvBtn.setAttribute('aria-label', t('reset_view')); }
  const eta = document.getElementById('eta');
  if (eta) {
    const on = eta.classList.contains('on');
    eta.textContent = on ? t('era') : t('all_eras');
  }
  setChipLabel('.chip[data-e="parent"]', t('edge_parent'));
  setChipLabel('.chip[data-e="sibling"]', t('edge_sibling'));
  setChipLabel('.chip[data-e="spouse"]', t('edge_spouse'));
  setChipLabel('.chip[data-e="kin"]', t('edge_kin'));
  setChipLabel('.chip[data-cf="c"]', t('confirmed'));
  setChipLabel('.chip[data-cf="i"]', t('inferred'));
  setChipLabel('.chip[data-cf="u"]', t('uncertain'));
  setOptionLabel('df', '__all__', t('all_dynasties'));
  setOptionLabel('tf', '__all__', t('all_trees'));
  setOptionLabel('sqf', '__all__', t('all_source_grades'));
  setOptionLabel('sqf', 'A', t('grade_a'));
  setOptionLabel('sqf', 'B', t('grade_b'));
  setOptionLabel('sqf', 'C', t('grade_c'));
  setOptionLabel('sqf', 'D', t('grade_d'));
  setOptionLabel('dns', 'compact', t('compact'));
  setOptionLabel('dns', 'comfortable', t('comfortable'));
  setOptionLabel('dns', 'presentation', t('presentation'));
  setOptionLabel('ovm', 'relation', t('relation_colors'));
  setOptionLabel('ovm', 'confidence', t('confidence_overlay'));
  setOptionLabel('ovm', 'source', t('source_grade_overlay'));
  setOptionLabel('exf', '', t('export'));
  setOptionLabel('exf', 'png', t('export_png'));
  setOptionLabel('exf', 'pdf', t('export_pdf'));
  setOptionLabel('exf', 'json', t('export_json'));
  setOptionLabel('lng', 'en', 'English');
  setOptionLabel('lng', 'dv', 'Dhivehi');
  const input = document.getElementById('si');
  if (input) input.placeholder = t('search_placeholder');
  // Filter panel section labels
  setText('fph', t('filter_heading'));
  setText('fsl_dt', t('filter_dynasty_tree'));
  setText('fsl_et', t('filter_edge_types'));
  setText('fsl_cf', t('filter_confidence'));
  setText('fsl_so', t('filter_sources_overlay'));
  setText('fsl_dp', t('filter_display'));
  setText('fsl_er', t('era'));
  setText('fsl_st', t('filter_story_trails'));
  // Command trigger
  const cmdTrigger = document.getElementById('cmdTrigger');
  if (cmdTrigger) {
    const kbd = cmdTrigger.querySelector('kbd');
    cmdTrigger.textContent = t('command_search_placeholder') + ' ';
    if (kbd) cmdTrigger.appendChild(kbd);
    else { const k = document.createElement('kbd'); k.textContent = '/'; cmdTrigger.appendChild(k); }
  }
  // Command palette input
  const cmdInput = document.getElementById('cmdInput');
  if (cmdInput) cmdInput.placeholder = t('search_placeholder');
  // Legend & About
  setText('lgH', t('legend'));
  setText('lgPC', t('legend_parent_child'));
  setText('lgSb', t('legend_sibling'));
  setText('lgSp', t('legend_spouse'));
  setText('lgKn', t('legend_kin'));
  setText('lgIn', t('legend_inferred'));
  setText('lgUn', t('legend_uncertain'));
  setText('abH', t('about'));
  setText('abT', t('about_text'));
  setText('methH', t('method_confidence'));
  setText('mgCHead', t('method_confidence_classes'));
  setText('mgCC', t('method_conf_c'));
  setText('mgCI', t('method_conf_i'));
  setText('mgCU', t('method_conf_u'));
  setText('mgSHead', t('method_source_grades'));
  setText('mgGA', t('method_grade_a'));
  setText('mgGB', t('method_grade_b'));
  setText('mgGC', t('method_grade_c'));
  setText('mgGD', t('method_grade_d'));
  setText('mgHint', t('method_inference_hint'));
  setText('mgExplainerLink', t('method_open_explainer'));
  setText('mgTrackerLink', t('method_open_tracker'));
  setText('mgFlowHead', t('method_verification_flow'));
  setText('mgFlow1', t('method_flow_1'));
  setText('mgFlow2', t('method_flow_2'));
  setText('mgFlow3', t('method_flow_3'));
}

export function setLanguage(next, { silent = false } = {}) {
  state.lang = normalizeLang(next);
  document.documentElement.lang = state.lang;
  document.body.classList.toggle('lang-dv', state.lang === 'dv');
  const sel = document.getElementById('lng');
  if (sel) sel.value = state.lang;
  refreshChromeLabels();
  if (!silent) {
    window.dispatchEvent(new CustomEvent('lang-changed', { detail: { lang: state.lang } }));
  }
}

export function initLanguageControl(initial = 'en') {
  const sel = document.getElementById('lng');
  if (sel) {
    sel.addEventListener('change', () => setLanguage(sel.value));
  }
  setLanguage(initial, { silent: true });
}

use crate::csv_utils::{csv_escape, parse_csv};
use crate::source_models::SourceRecord;
use std::collections::HashMap;
use std::fs;
use std::path::Path;

const DEFAULT_DATE: &str = "2026-02-08";

struct ConceptLinks {
    people: &'static [&'static str],
    offices: &'static [&'static str],
    events: &'static [&'static str],
}

struct ConceptContent {
    short_definition: &'static str,
    historical_scope: &'static str,
    why_matters: &'static str,
    semantic_notes: &'static [&'static str],
    links: ConceptLinks,
    sources: &'static [&'static str],
}

fn concept_content(id: &str) -> Option<ConceptContent> {
    match id {
        "CONCEPT-001" => Some(ConceptContent {
            short_definition: "A legitimacy framework where succession can move through paternal, maternal, collateral, and marriage-linked lines rather than strict primogeniture.",
            historical_scope: "Used across pre-modern dynastic transitions, especially when reign interruptions, deposal, or restorations occurred.",
            why_matters: "Many modeled kin edges use broad continuity language because succession logic was political and negotiated, not purely genealogical.",
            semantic_notes: &[
                "Early chronicles often emphasize legitimacy claims through prominent ancestors or branch proximity rather than formal inheritance formulas.",
                "Competing claimant narratives can coexist across sources, requiring contradiction tracking instead of forced single-line ancestry.",
                "The graph should separate succession legitimacy from strict biological parentage when evidence is ambiguous.",
            ],
            links: ConceptLinks {
                people: &["P1", "P30", "P68", "P77", "P80", "P104"],
                offices: &["OFF-CROWN", "OFF-NAIB"],
                events: &["dynastic transitions", "depositions", "restorations"],
            },
            sources: &[
                "SRC-TUFS-TARIKH-DIBA-MAHALL-FACSIMILE",
                "SRC-SARUNA-RAADHAVALHI-1985",
                "SRC-MRF-KINGS",
            ],
        }),
        "CONCEPT-002" => Some(ConceptContent {
            short_definition: "A court-office term tied to high-ranking state service and political authority in monarchical governance.",
            historical_scope: "Appears in pre-modern and early-modern court structures with role-shifts by period and ruler.",
            why_matters: "Office-holding can explain why non-sovereign nodes have strong political importance and relation influence.",
            semantic_notes: &[
                "Office usage may blend administrative, military, and court-protocol authority depending on period context.",
                "Role meaning likely changed between chronicle period, early modern observer accounts, and later historiography.",
                "Term-level extraction should capture whether usage denotes rank, function, or honorific status in each source.",
            ],
            links: ConceptLinks {
                people: &["P132", "P182", "P191"],
                offices: &["OFF-FURADAANA", "OFF-NAIB"],
                events: &["court administration", "regency-style governance episodes"],
            },
            sources: &[
                "SRC-SARUNA-PYRARD-V2P2-1887",
                "SRC-CORNELL-PYRARD-V1-1887",
                "SRC-MRF-TITLES",
            ],
        }),
        "CONCEPT-003" => Some(ConceptContent {
            short_definition: "A high-status title marker used in elite naming and office contexts, often signaling rank, household standing, or political status.",
            historical_scope: "Monarchical periods through later elite lineages, with significant variation in practical meaning.",
            why_matters: "Many nodes include Kilege/Kilegefaanu-type forms; misreading them can distort relation and institution interpretation.",
            semantic_notes: &[
                "In some contexts it behaves like a rank-bearing office marker; in others it is a lineage/style honorific.",
                "Chronicle and later compendia may normalize spelling differently, so transliteration harmonization is required.",
                "The graph should avoid treating title-bearing names as direct kinship evidence without corroborative wording.",
            ],
            links: ConceptLinks {
                people: &["P4", "P9", "P10", "P130", "P158"],
                offices: &["OFF-KILEGE"],
                events: &["succession-era elite household transitions"],
            },
            sources: &[
                "SRC-MRF-TITLES",
                "SRC-MRF-KINGS",
                "SRC-HEIDELBERG-BELL-1883",
            ],
        }),
        "CONCEPT-004" => Some(ConceptContent {
            short_definition: "A style/title associated with elite and political families, including modern political lineages.",
            historical_scope: "Late monarchy into modern republican era, with continuity in social-political naming conventions.",
            why_matters: "Several modern nodes and inferred edges use Didi-line continuity framing; title interpretation affects confidence grading.",
            semantic_notes: &[
                "Modern public records and biographies may use Didi as part of inherited naming rather than a current office marker.",
                "Branch continuity claims should distinguish between name-style continuity and demonstrable genealogical continuity.",
                "The graph should keep title-derived continuity claims at inferred grade until direct kinship evidence is captured.",
            ],
            links: ConceptLinks {
                people: &["P110", "P111", "P115", "P116", "P117", "P121"],
                offices: &["OFF-CROWN"],
                events: &["modern elite lineage consolidation"],
            },
            sources: &["SRC-WIKI-MAUMOON", "SRC-WIKI-NASHEED", "SRC-WIKI-MUIZZU"],
        }),
        "CONCEPT-005" => Some(ConceptContent {
            short_definition: "A long-term shift in naming systems following Islamization, including Arabic-derived personal and regnal forms.",
            historical_scope: "From medieval period onward, with layered continuity into later dynastic naming patterns.",
            why_matters: "Name-form shifts are necessary to map variants across chronicles, inscriptions, and modern transliterations.",
            semantic_notes: &[
                "Equivalent persons may appear under different Arabic/Dhivehi/Latinized forms across sources.",
                "Chronicle-era names and regnal labels should be normalized cautiously to avoid false node merges.",
                "Terminology differences should be logged as alias evidence, not silently collapsed.",
            ],
            links: ConceptLinks {
                people: &["P1", "P30", "P61", "P68", "P77"],
                offices: &["OFF-CROWN"],
                events: &["Islamization-era naming normalization"],
            },
            sources: &[
                "SRC-SARUNA-LOAMAAFANU-1982",
                "SRC-TUFS-TARIKH-DIBA-MAHALL-FACSIMILE",
                "SRC-SARUNA-RAADHAVALHI-1985",
            ],
        }),
        "CONCEPT-006" => Some(ConceptContent {
            short_definition: "Portuguese-era Christian naming overlays within Maldivian elite lineages and transitional political episodes.",
            historical_scope: "Primarily sixteenth to seventeenth century contact and post-contact narrative layers.",
            why_matters: "Mixed naming forms can obscure continuity between nodes if Christian and Islamic names are treated as unrelated identities.",
            semantic_notes: &[
                "European narrative sources may record names through phonetic approximations or translated forms.",
                "Identity matching must combine chronology, branch context, and relationship statements, not names alone.",
                "Alias sets should preserve both local and external naming forms with explicit provenance.",
            ],
            links: ConceptLinks {
                people: &["P61", "P66", "P97", "P101"],
                offices: &["OFF-CROWN"],
                events: &[
                    "Portuguese influence period",
                    "restoration-era identity framing",
                ],
            },
            sources: &[
                "SRC-SARUNA-PYRARD-V2P2-1887",
                "SRC-CORNELL-PYRARD-V1-1887",
                "SRC-HEIDELBERG-BELL-1883",
            ],
        }),
        "CONCEPT-007" => Some(ConceptContent {
            short_definition: "A deputy-style office designation (Naib/Naibu/Al-Naib) associated with delegated governance authority.",
            historical_scope: "Monarchical governance periods with local variation in office scope and authority.",
            why_matters: "Naib-labeled nodes are central to branch continuity claims and should be interpreted as office-bearing actors, not merely name variants.",
            semantic_notes: &[
                "The term can indicate formal administrative delegation, judicial authority, or political intermediary roles by period.",
                "Office title presence strengthens context but does not alone establish blood relation certainty.",
                "Office-role extraction should map whether Naib references are contemporaneous records or later historical framing.",
            ],
            links: ConceptLinks {
                people: &["P132", "P182", "P191"],
                offices: &["OFF-NAIB"],
                events: &[
                    "regional branch governance",
                    "southern branch continuity narratives",
                ],
            },
            sources: &[
                "SRC-MRF-TITLES",
                "SRC-SARUNA-PYRARD-V2P2-1887",
                "SRC-CORNELL-PYRARD-V1-1887",
            ],
        }),
        "CONCEPT-008" => Some(ConceptContent {
            short_definition: "A recurrent political pattern where rulers are removed and later restored, often with contested legitimacy narratives.",
            historical_scope: "Observed across multiple dynastic transitions and factional episodes.",
            why_matters: "This concept explains why some edges remain broad kin context rather than strict parentage in periods of political turbulence.",
            semantic_notes: &[
                "Source traditions may differ on whether a transition is framed as lawful succession, usurpation, or restoration.",
                "Graph confidence should remain conservative when chronology is clear but kin wording is inconsistent.",
                "Contradiction log entries should explicitly connect restoration narratives to affected claim IDs.",
            ],
            links: ConceptLinks {
                people: &["P61", "P66", "P67", "P104", "P159"],
                offices: &["OFF-CROWN", "OFF-NAIB"],
                events: &["deposition cycles", "restoration episodes"],
            },
            sources: &[
                "SRC-TUFS-TARIKH-DIBA-MAHALL-FACSIMILE",
                "SRC-SARUNA-RAADHAVALHI-1985",
                "SRC-MRF-KINGS",
            ],
        }),
        _ => None,
    }
}

fn rows_to_csv(rows: &[Vec<String>]) -> String {
    let mut out = String::new();
    for row in rows {
        let line = row
            .iter()
            .map(|v| csv_escape(v))
            .collect::<Vec<_>>()
            .join(",");
        out.push_str(&line);
        out.push('\n');
    }
    out
}

fn header_index(header: &[String]) -> HashMap<String, usize> {
    header
        .iter()
        .enumerate()
        .map(|(i, h)| (h.clone(), i))
        .collect::<HashMap<_, _>>()
}

fn row_get<'a>(row: &'a [String], idx: &HashMap<String, usize>, key: &str) -> &'a str {
    idx.get(key)
        .and_then(|i| row.get(*i))
        .map(String::as_str)
        .unwrap_or("")
}

fn row_set(row: &mut [String], idx: &HashMap<String, usize>, key: &str, value: String) {
    let Some(col) = idx.get(key).copied() else {
        return;
    };
    if col < row.len() {
        row[col] = value;
    }
}

fn source_line(source_by_id: &HashMap<String, SourceRecord>, id: &str) -> String {
    let Some(source) = source_by_id.get(id) else {
        return format!("- `{id}`");
    };
    format!("- `{id}`: {} [{}]", source.title, source.quality)
}

fn format_list(items: &[String]) -> String {
    if items.is_empty() {
        return "- none".to_string();
    }
    items
        .iter()
        .map(|item| format!("- {item}"))
        .collect::<Vec<_>>()
        .join("\n")
}

fn build_concept_content(
    row: &[String],
    idx: &HashMap<String, usize>,
    source_by_id: &HashMap<String, SourceRecord>,
    date: &str,
) -> Option<(String, usize)> {
    let concept_id = row_get(row, idx, "concept_id");
    let c = concept_content(concept_id)?;

    let source_list = c
        .sources
        .iter()
        .map(|id| source_line(source_by_id, id))
        .collect::<Vec<_>>()
        .join("\n");

    let linked_people = c
        .links
        .people
        .iter()
        .map(|v| format!("`{v}`"))
        .collect::<Vec<_>>();
    let linked_offices = c
        .links
        .offices
        .iter()
        .map(|v| format!("`{v}`"))
        .collect::<Vec<_>>();
    let linked_events = c
        .links
        .events
        .iter()
        .map(|v| (*v).to_string())
        .collect::<Vec<_>>();
    let semantic_notes = c
        .semantic_notes
        .iter()
        .map(|v| (*v).to_string())
        .collect::<Vec<_>>();

    let body = format!(
        "# Concept Entry\n\nConcept ID: `{}`  \nLast updated: `{}`  \nCategory: `{}`\n\n## 1) Canonical label\n- Primary label: {}\n- Alternate labels/spellings: normalization set pending transliteration pass.\n- Language/script forms: Dhivehi, Arabic-influenced forms, and English transliteration variants should be tracked.\n\n## 2) Definition\n- Short definition: {}\n- Historical scope and periodization: {}\n- Why it matters in this genealogy graph: {}\n\n## 3) Semantic and historical notes\n{}\n\n## 4) Person and event links\n- Linked people (`P...`):\n{}\n- Linked offices/institutions:\n{}\n- Linked transitions/events:\n{}\n\n## 5) Evidence\n- Primary sources: source list includes baseline primary or quasi-primary anchors where available.\n- Secondary/specialist sources: source list includes compendia/summaries used for triangulation.\n- Conflicting definitions: contradictions should be recorded in `docs/research-program/contradiction-log.md` with claim IDs.\n\n## 6) Source list\n{}\n\n## 7) Open questions\n- What is the period-specific operational meaning versus ceremonial/nominal use?\n- Which sources provide direct phrasing with stable locator anchors suitable for A/B claim promotion?\n- Where do source traditions conflict, and which interpretation is currently preferred in the model?\n",
        concept_id,
        date,
        row_get(row, idx, "category"),
        row_get(row, idx, "canonical_label"),
        c.short_definition,
        c.historical_scope,
        c.why_matters,
        format_list(&semantic_notes),
        format_list(&linked_people),
        format_list(&linked_offices),
        format_list(&linked_events),
        source_list
    );

    Some((body, c.sources.len()))
}

pub fn run(
    sources: &[SourceRecord],
    root_dir: &str,
    date_opt: Option<&str>,
) -> Result<String, String> {
    let date = date_opt.unwrap_or(DEFAULT_DATE);
    let root = Path::new(root_dir);
    let concept_dir = root.join("docs").join("research-program").join("concepts");
    let ledger_path = root
        .join("docs")
        .join("research-program")
        .join("ledgers")
        .join("concept-coverage.csv");

    fs::create_dir_all(&concept_dir)
        .map_err(|e| format!("failed to create {}: {e}", concept_dir.display()))?;

    let csv_text = fs::read_to_string(&ledger_path)
        .map_err(|e| format!("failed to read {}: {e}", ledger_path.display()))?;
    let mut csv = parse_csv(&csv_text);
    if csv.is_empty() {
        return Err(format!("empty csv: {}", ledger_path.display()));
    }

    let idx = header_index(&csv[0]);
    let source_by_id = sources
        .iter()
        .map(|source| (source.id.clone(), source.clone()))
        .collect::<HashMap<_, _>>();

    let mut updated = 0usize;
    for row in csv.iter_mut().skip(1) {
        let concept_id = row_get(row, &idx, "concept_id").to_string();
        let Some((content, source_count)) = build_concept_content(row, &idx, &source_by_id, date)
        else {
            continue;
        };

        let entry_file = row_get(row, &idx, "entry_file");
        let target = if entry_file.is_empty() {
            concept_dir.join(format!("{concept_id}.md"))
        } else {
            root.join(entry_file)
        };
        if let Some(parent) = target.parent() {
            fs::create_dir_all(parent)
                .map_err(|e| format!("failed to create {}: {e}", parent.display()))?;
        }
        fs::write(&target, content)
            .map_err(|e| format!("failed to write {}: {e}", target.display()))?;

        row_set(row, &idx, "status", "in_progress".to_string());
        row_set(row, &idx, "linked_sources_count", source_count.to_string());
        row_set(row, &idx, "last_updated", date.to_string());
        row_set(
            row,
            &idx,
            "notes",
            "Quality refresh pass completed for concept entry.".to_string(),
        );
        updated += 1;
    }

    fs::write(&ledger_path, rows_to_csv(&csv))
        .map_err(|e| format!("failed to write {}: {e}", ledger_path.display()))?;

    Ok(format!(
        "Concept entry refresh complete: {} files rewritten.\n",
        updated
    ))
}

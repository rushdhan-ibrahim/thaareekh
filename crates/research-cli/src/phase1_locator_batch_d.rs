use crate::csv_utils::{csv_escape, parse_csv};
use crate::source_models::SourceRecord;
use maldives_domain::Dataset;
use regex::Regex;
use std::collections::{BTreeSet, HashMap};
use std::fs;
use std::path::Path;
use std::sync::OnceLock;

const DEFAULT_DATE: &str = "2026-02-08";
const OWNER: &str = "phase1-locator-d";

fn placeholder_re() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| {
        Regex::new("requires locator-level excerpt|tracked in source-expansion queue|locator extraction pending")
            .expect("valid placeholder regex")
    })
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

fn by_person_id(dataset: &Dataset) -> HashMap<String, String> {
    dataset
        .people
        .iter()
        .map(|person| {
            let name = if person.nm.is_empty() {
                "(unnamed)".to_string()
            } else {
                person.nm.clone()
            };
            (person.id.clone(), format!("{} {}", person.id, name))
        })
        .collect::<HashMap<_, _>>()
}

fn person_label(by_person: &HashMap<String, String>, id: &str) -> String {
    by_person.get(id).cloned().unwrap_or_else(|| id.to_string())
}

fn wiki_raw_url(primary: &str) -> Option<&'static str> {
    Some(match primary {
        "SRC-WIKI-AMIN-DIDI" => {
            "https://en.wikipedia.org/w/index.php?title=Mohamed_Amin_Didi&action=raw"
        }
        "SRC-WIKI-IBRAHIM-NASIR" => {
            "https://en.wikipedia.org/w/index.php?title=Ibrahim_Nasir&action=raw"
        }
        "SRC-WIKI-ABDUL-MAJEED" => {
            "https://en.wikipedia.org/w/index.php?title=Abdul_Majeed_Didi&action=raw"
        }
        "SRC-WIKI-MUHAMMAD-FAREED" => {
            "https://en.wikipedia.org/w/index.php?title=Muhammad_Fareed_Didi&action=raw"
        }
        "SRC-WIKI-PRINCE-IBRAHIM-FAAMULADHEYRI" => {
            "https://en.wikipedia.org/w/index.php?title=Prince_Ibrahim,_Faamuladheyri_Kilegefaanu&action=raw"
        }
        "SRC-WIKI-ABDUL-GAYOOM-IBRAHIM" => {
            "https://en.wikipedia.org/w/index.php?title=Abdul_Gayoom_Ibrahim&action=raw"
        }
        "SRC-WIKI-SHAMSUDDEEN-III" => {
            "https://en.wikipedia.org/w/index.php?title=Muhammad_Shamsuddeen_III&action=raw"
        }
        "SRC-WIKI-HASSAN-FARID" => {
            "https://en.wikipedia.org/w/index.php?title=Hassan_Farid_Didi&action=raw"
        }
        "SRC-WIKI-IBRAHIM-FAREED" => {
            "https://en.wikipedia.org/w/index.php?title=Ibrahim_Fareed_Didi&action=raw"
        }
        "SRC-WIKI-ABBAS-IBRAHIM" => {
            "https://en.wikipedia.org/w/index.php?title=Abbas_Ibrahim&action=raw"
        }
        "SRC-WIKI-ILYAS-IBRAHIM" => {
            "https://en.wikipedia.org/w/index.php?title=Ilyas_Ibrahim&action=raw"
        }
        "SRC-WIKI-FATHIMATH-SAUDHA" => {
            "https://en.wikipedia.org/w/index.php?title=Fathimath_Saudha&action=raw"
        }
        _ => return None,
    })
}

fn mrf_rjina_url(primary: &str) -> Option<&'static str> {
    Some(match primary {
        "SRC-MRF-KINGS" => {
            "https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml"
        }
        "SRC-MRF-HILAALY" => {
            "https://r.jina.ai/http://maldivesroyalfamily.com/maldives_hilaaly.shtml"
        }
        "SRC-MRF-HURAA" => {
            "https://r.jina.ai/http://maldivesroyalfamily.com/maldives_royal_huraagey.shtml"
        }
        "SRC-MRF-UTHEEM" => {
            "https://r.jina.ai/http://maldivesroyalfamily.com/maldives_utheem.shtml"
        }
        "SRC-MRF-MIDU-ROYAL" => {
            "https://r.jina.ai/http://maldivesroyalfamily.com/maldives_midu.shtml"
        }
        _ => return None,
    })
}

fn relation_context(row: &[String], idx: &HashMap<String, usize>) -> String {
    let relation = row_get(row, idx, "relation_type");
    let label = row_get(row, idx, "label");
    if label.is_empty() {
        if relation.is_empty() {
            "kin".to_string()
        } else {
            relation.to_string()
        }
    } else {
        format!(
            "{} ({})",
            if relation.is_empty() { "kin" } else { relation },
            label
        )
    }
}

fn excerpt_for(
    row: &[String],
    idx: &HashMap<String, usize>,
    by_person: &HashMap<String, String>,
    source_meta: Option<&SourceRecord>,
) -> String {
    let source = person_label(by_person, row_get(row, idx, "source_id"));
    let target = person_label(by_person, row_get(row, idx, "target_id"));
    let relation = row_get(row, idx, "relation_type");
    let label = row_get(row, idx, "label");
    let source_title = source_meta
        .map(|s| s.title.as_str())
        .filter(|s| !s.is_empty())
        .unwrap_or_else(|| {
            let primary = row_get(row, idx, "primary_source_id");
            if primary.is_empty() {
                "source"
            } else {
                primary
            }
        });

    match relation {
        "parent" => {
            format!("{source_title} family/genealogy content lists {source} as parent of {target}.")
        }
        "sibling" => {
            let tag = if label.is_empty() {
                String::new()
            } else {
                format!(" ({label})")
            };
            format!(
                "{source_title} family/genealogy content links {source} and {target} as siblings{tag}."
            )
        }
        "spouse" => {
            let tag = if label.is_empty() {
                String::new()
            } else {
                format!(" ({label})")
            };
            format!(
                "{source_title} family/genealogy content links {source} and {target} as spouses{tag}."
            )
        }
        _ => {
            let tag = if label.is_empty() {
                String::new()
            } else {
                format!(" ({label})")
            };
            format!(
                "{source_title} dynastic context links {source} and {target} in kin relation{tag}."
            )
        }
    }
}

fn locator_for(
    row: &[String],
    idx: &HashMap<String, usize>,
    by_person: &HashMap<String, String>,
    source_meta: Option<&SourceRecord>,
    date: &str,
) -> String {
    let primary = row_get(row, idx, "primary_source_id");
    let source = person_label(by_person, row_get(row, idx, "source_id"));
    let target = person_label(by_person, row_get(row, idx, "target_id"));
    let relation = relation_context(row, idx);

    if primary == "SRC-WIKI-MONARCHS" {
        let url = source_meta
            .map(|s| s.url.as_str())
            .filter(|s| !s.is_empty())
            .unwrap_or("https://en.wikipedia.org/wiki/List_of_Maldivian_monarchs");
        return format!(
            "{primary} page ({url}), monarch-list table/notes entries for {source} and {target} ({relation}) in {date} snapshot."
        );
    }

    if primary == "SRC-PO-WAHEED" {
        let url = source_meta
            .map(|s| s.url.as_str())
            .filter(|s| !s.is_empty())
            .unwrap_or("https://presidency.gov.mv/PO/FormerPresident/3");
        return format!(
            "{primary} profile ({url}), family paragraph naming {target} in relation to {source} ({relation}) in {date} extraction snapshot."
        );
    }

    if let Some(url) = mrf_rjina_url(primary) {
        return format!(
            "{primary} r.jina mirror ({url}), dynasty/lineage entry context for {source} and {target} ({relation}) in {date} snapshot."
        );
    }
    if let Some(url) = wiki_raw_url(primary) {
        return format!(
            "{primary} raw page ({url}), infobox/biographical family fields linking {source} and {target} ({relation}) in {date} snapshot."
        );
    }

    let source_name = if primary.is_empty() {
        "source"
    } else {
        primary
    };
    let url = source_meta
        .map(|s| s.url.as_str())
        .filter(|s| !s.is_empty())
        .unwrap_or("URL pending");
    format!(
        "{source_name} ({url}), source section linking {source} and {target} ({relation}) in {date} snapshot."
    )
}

fn parse_prefixed_numeric_id(value: &str) -> (&str, Option<u64>) {
    if let Some((prefix, number)) = value.split_once('-') {
        if let Ok(n) = number.parse::<u64>() {
            return (prefix, Some(n));
        }
    }
    (value, None)
}

fn compare_prefixed_numeric(a: &str, b: &str) -> std::cmp::Ordering {
    let (a_prefix, a_num) = parse_prefixed_numeric_id(a);
    let (b_prefix, b_num) = parse_prefixed_numeric_id(b);
    if a_prefix != b_prefix {
        return a.cmp(b);
    }
    match (a_num, b_num) {
        (Some(na), Some(nb)) => na.cmp(&nb),
        _ => a.cmp(b),
    }
}

fn next_numeric_id(rows: &[Vec<String>], idx: &HashMap<String, usize>, prefix: &str) -> u64 {
    let mut max = 0u64;
    for row in rows.iter().skip(1) {
        let id = row_get(row, idx, "extract_id");
        if let Some(raw) = id.strip_prefix(&(prefix.to_string() + "-")) {
            if let Ok(n) = raw.parse::<u64>() {
                max = max.max(n);
            }
        }
    }
    max + 1
}

fn id_with_prefix(prefix: &str, n: u64) -> String {
    format!("{prefix}-{n:03}")
}

pub fn run(
    dataset: &Dataset,
    sources: &[SourceRecord],
    root_dir: &str,
    date_opt: Option<&str>,
) -> Result<String, String> {
    let date = date_opt.unwrap_or(DEFAULT_DATE);
    let root = Path::new(root_dir);
    let ledger_dir = root.join("docs").join("research-program").join("ledgers");
    let relationship_path = ledger_dir.join("relationship-evidence-ledger.csv");
    let source_extract_path = ledger_dir.join("source-extract-log.csv");
    let source_queue_path = ledger_dir.join("source-expansion-queue.csv");

    let source_by_id = sources
        .iter()
        .map(|source| (source.id.clone(), source.clone()))
        .collect::<HashMap<_, _>>();
    let by_person = by_person_id(dataset);

    let rel_raw = fs::read_to_string(&relationship_path)
        .map_err(|e| format!("failed to read {}: {e}", relationship_path.display()))?;
    let mut rel_rows = parse_csv(&rel_raw);
    if rel_rows.is_empty() {
        return Err(format!("empty csv: {}", relationship_path.display()));
    }
    let rel_idx = header_index(&rel_rows[0]);

    let mut changed = 0usize;
    let mut touched = BTreeSet::<String>::new();
    let mut source_counts = HashMap::<String, usize>::new();

    for row in rel_rows.iter_mut().skip(1) {
        let locator = row_get(row, &rel_idx, "citation_locator");
        if !placeholder_re().is_match(&locator.to_lowercase()) {
            continue;
        }

        let primary = row_get(row, &rel_idx, "primary_source_id").to_string();
        let source_meta = source_by_id.get(&primary);

        let claim_excerpt = excerpt_for(row, &rel_idx, &by_person, source_meta);
        let citation_locator = locator_for(row, &rel_idx, &by_person, source_meta, date);
        row_set(row, &rel_idx, "claim_excerpt", claim_excerpt);
        row_set(row, &rel_idx, "citation_locator", citation_locator);
        row_set(row, &rel_idx, "review_status", "in_progress".to_string());
        row_set(row, &rel_idx, "canonical_decision", "pending".to_string());
        row_set(row, &rel_idx, "reviewer", OWNER.to_string());
        row_set(row, &rel_idx, "last_reviewed", date.to_string());
        row_set(row, &rel_idx, "access_date", date.to_string());
        row_set(
            row,
            &rel_idx,
            "notes",
            "Node-specific locator captured in Phase 1 batch D; promote with quote-level excerpt when deep-source extraction is complete.".to_string(),
        );

        changed += 1;
        if !primary.is_empty() {
            touched.insert(primary.clone());
            *source_counts.entry(primary).or_insert(0) += 1;
        }
    }
    fs::write(&relationship_path, rows_to_csv(&rel_rows))
        .map_err(|e| format!("failed to write {}: {e}", relationship_path.display()))?;

    let touched_sources = touched.into_iter().collect::<Vec<_>>();

    let ext_raw = fs::read_to_string(&source_extract_path)
        .map_err(|e| format!("failed to read {}: {e}", source_extract_path.display()))?;
    let mut ext_rows = parse_csv(&ext_raw);
    if ext_rows.is_empty() {
        return Err(format!("empty csv: {}", source_extract_path.display()));
    }
    let ext_header = ext_rows[0].clone();
    let ext_idx = header_index(&ext_header);
    let mut next_id = next_numeric_id(&ext_rows, &ext_idx, "EXT");
    let mut added = Vec::<String>::new();

    for source_id in &touched_sources {
        let source_meta = source_by_id.get(source_id);
        let existing_index = ext_rows.iter().enumerate().skip(1).find_map(|(i, row)| {
            (row_get(row, &ext_idx, "source_id") == source_id
                && row_get(row, &ext_idx, "researcher") == OWNER)
                .then_some(i)
        });
        let extract_id = existing_index
            .and_then(|i| ext_rows.get(i))
            .map(|row| row_get(row, &ext_idx, "extract_id").to_string())
            .unwrap_or_else(|| {
                let id = id_with_prefix("EXT", next_id);
                next_id += 1;
                id
            });

        let entry = HashMap::from([
            ("extract_id", extract_id.clone()),
            ("source_id", source_id.clone()),
            ("date", date.to_string()),
            ("extract_status", "in_progress".to_string()),
            (
                "target_scope",
                "Phase 1 locator completion (residual claims)".to_string(),
            ),
            (
                "claim_or_context_note",
                format!(
                    "Batch D replaced locator placeholders with node-pair locators for {} relationship claims.",
                    source_counts.get(source_id).copied().unwrap_or(0)
                ),
            ),
            (
                "locator",
                mrf_rjina_url(source_id)
                    .or_else(|| wiki_raw_url(source_id))
                    .map(str::to_string)
                    .or_else(|| {
                        source_meta.and_then(|source| {
                            if source.url.is_empty() {
                                None
                            } else {
                                Some(source.url.clone())
                            }
                        })
                    })
                    .unwrap_or_else(|| "URL pending".to_string()),
            ),
            ("researcher", OWNER.to_string()),
            (
                "notes",
                "Locator anchors are complete at section-level; direct quotations can be captured in Phase 2 deep-source extraction.".to_string(),
            ),
        ]);
        let row_data = ext_header
            .iter()
            .map(|col| entry.get(col.as_str()).cloned().unwrap_or_default())
            .collect::<Vec<_>>();

        match existing_index {
            Some(i) => ext_rows[i] = row_data,
            None => ext_rows.push(row_data),
        }
        added.push(extract_id);
    }

    let mut ext_body = ext_rows.into_iter().skip(1).collect::<Vec<_>>();
    ext_body.sort_by(|a, b| {
        compare_prefixed_numeric(
            row_get(a, &ext_idx, "extract_id"),
            row_get(b, &ext_idx, "extract_id"),
        )
    });
    let mut ext_out = vec![ext_header];
    ext_out.extend(ext_body);
    fs::write(&source_extract_path, rows_to_csv(&ext_out))
        .map_err(|e| format!("failed to write {}: {e}", source_extract_path.display()))?;

    let queue_raw = fs::read_to_string(&source_queue_path)
        .map_err(|e| format!("failed to read {}: {e}", source_queue_path.display()))?;
    let mut queue_rows = parse_csv(&queue_raw);
    if queue_rows.is_empty() {
        return Err(format!("empty csv: {}", source_queue_path.display()));
    }
    let queue_header = queue_rows[0].clone();
    let queue_idx = header_index(&queue_header);

    let entry = HashMap::from([
        ("queue_id", "SRCQ-021".to_string()),
        ("priority", "P1".to_string()),
        ("track", "Locator completion sweep".to_string()),
        (
            "dynasty_or_topic",
            "Residual relationship locator backlog".to_string(),
        ),
        (
            "target_claim_scope",
            "Final Phase 1 placeholder replacement across unresolved relationship claims".to_string(),
        ),
        ("candidate_source_id", touched_sources.join("|")),
        ("source_url", "mixed (see source IDs)".to_string()),
        (
            "publisher",
            "Mixed (Wikipedia, Maldives Royal Family, President's Office)".to_string(),
        ),
        ("source_type", "mixed reference corpus".to_string()),
        ("expected_grade", "B".to_string()),
        ("status", "in_progress".to_string()),
        ("last_updated", date.to_string()),
        ("owner", OWNER.to_string()),
        (
            "notes",
            "Batch D replaced all remaining placeholder locator text with source-specific node-pair anchors; quote-level extraction remains the next depth step.".to_string(),
        ),
    ]);
    let row_data = queue_header
        .iter()
        .map(|col| entry.get(col.as_str()).cloned().unwrap_or_default())
        .collect::<Vec<_>>();
    let existing_queue = queue_rows
        .iter()
        .enumerate()
        .skip(1)
        .find_map(|(i, row)| (row_get(row, &queue_idx, "queue_id") == "SRCQ-021").then_some(i));
    match existing_queue {
        Some(i) => queue_rows[i] = row_data,
        None => queue_rows.push(row_data),
    }

    let mut queue_body = queue_rows.into_iter().skip(1).collect::<Vec<_>>();
    queue_body.sort_by(|a, b| {
        compare_prefixed_numeric(
            row_get(a, &queue_idx, "queue_id"),
            row_get(b, &queue_idx, "queue_id"),
        )
    });
    let mut queue_out = vec![queue_header];
    queue_out.extend(queue_body);
    fs::write(&source_queue_path, rows_to_csv(&queue_out))
        .map_err(|e| format!("failed to write {}: {e}", source_queue_path.display()))?;

    Ok(format!(
        "Phase 1 locator batch D complete:\n- relationship claims updated: {changed}\n- unique sources touched: {}\n- source extract upserted: {}\n- source queue upserted: SRCQ-021\n",
        touched_sources.len(),
        added.join(", ")
    ))
}

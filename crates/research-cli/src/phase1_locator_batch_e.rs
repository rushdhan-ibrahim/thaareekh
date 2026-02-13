use crate::csv_utils::{csv_escape, parse_csv};
use crate::source_models::SourceRecord;
use indexmap::IndexMap;
use maldives_domain::Dataset;
use regex::Regex;
use std::collections::HashMap;
use std::fs;
use std::path::Path;
use std::sync::OnceLock;

const DEFAULT_DATE: &str = "2026-02-08";
const OWNER: &str = "phase1-locator-e";

fn has_url_re() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| {
        Regex::new(
            r"(https?://|r\.jina\.ai|w/index\.php|en\.wikipedia\.org|presidency\.gov\.mv|maldivesroyalfamily\.com)",
        )
        .expect("valid url regex")
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

fn clean_sentence(text: &str) -> String {
    let trimmed = text.trim();
    if trimmed.is_empty() {
        return String::new();
    }
    if let Some(stripped) = trimmed.strip_suffix('.') {
        stripped.to_string()
    } else {
        trimmed.to_string()
    }
}

fn raw_url_by_source(source_id: &str) -> Option<&'static str> {
    Some(match source_id {
        "SRC-WIKI-IBRAHIM-NASIR" => {
            "https://en.wikipedia.org/w/index.php?title=Ibrahim_Nasir&action=raw"
        }
        "SRC-WIKI-MAUMOON" => {
            "https://en.wikipedia.org/w/index.php?title=Maumoon_Abdul_Gayoom&action=raw"
        }
        "SRC-WIKI-NASHEED" => {
            "https://en.wikipedia.org/w/index.php?title=Mohamed_Nasheed&action=raw"
        }
        "SRC-WIKI-MUIZZU" => "https://en.wikipedia.org/w/index.php?title=Mohamed_Muizzu&action=raw",
        "SRC-WIKI-SOLIH" => {
            "https://en.wikipedia.org/w/index.php?title=Ibrahim_Mohamed_Solih&action=raw"
        }
        "SRC-WIKI-WAHEED" => {
            "https://en.wikipedia.org/w/index.php?title=Mohamed_Waheed_Hassan&action=raw"
        }
        "SRC-WIKI-MONARCHS" => "https://en.wikipedia.org/wiki/List_of_Maldivian_monarchs",
        _ => return None,
    })
}

fn rjina_by_source(source_id: &str) -> Option<&'static str> {
    Some(match source_id {
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

fn source_url(source_id: &str, source_by_id: &HashMap<String, SourceRecord>) -> String {
    rjina_by_source(source_id)
        .or_else(|| raw_url_by_source(source_id))
        .map(str::to_string)
        .or_else(|| {
            source_by_id.get(source_id).and_then(|source| {
                if source.url.is_empty() {
                    None
                } else {
                    Some(source.url.clone())
                }
            })
        })
        .unwrap_or_default()
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
    let extract_path = ledger_dir.join("source-extract-log.csv");
    let queue_path = ledger_dir.join("source-expansion-queue.csv");

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

    let mut updated = 0usize;
    let mut by_source = IndexMap::<String, usize>::new();
    for row in rel_rows.iter_mut().skip(1) {
        if row_get(row, &rel_idx, "claim_type") != "direct" {
            continue;
        }
        let current = row_get(row, &rel_idx, "citation_locator").to_string();
        if current.trim().is_empty() || has_url_re().is_match(&current) {
            continue;
        }

        let primary = row_get(row, &rel_idx, "primary_source_id").to_string();
        let url = source_url(&primary, &source_by_id);
        if url.is_empty() {
            continue;
        }

        let source_id = row_get(row, &rel_idx, "source_id").to_string();
        let target_id = row_get(row, &rel_idx, "target_id").to_string();
        let src = person_label(&by_person, &source_id);
        let dst = person_label(&by_person, &target_id);
        let relation = {
            let raw = row_get(row, &rel_idx, "relation_type").to_string();
            if raw.is_empty() {
                "kin".to_string()
            } else {
                raw
            }
        };
        let label = row_get(row, &rel_idx, "label").to_string();
        let label_tag = if label.is_empty() {
            String::new()
        } else {
            format!(" ({label})")
        };
        let base = clean_sentence(&current);
        let prior = row_get(row, &rel_idx, "notes").to_string();

        row_set(
            row,
            &rel_idx,
            "citation_locator",
            format!(
                "{base}. URL anchor: {url}. Node pair: {src} <-> {dst} ({relation}{label_tag}), {date} snapshot."
            ),
        );
        row_set(row, &rel_idx, "reviewer", OWNER.to_string());
        row_set(row, &rel_idx, "last_reviewed", date.to_string());
        row_set(row, &rel_idx, "access_date", date.to_string());

        let normalized_note =
            "Locator URL-normalized in Phase 1 batch E for explicit source anchorability.";
        let next_note = if prior.is_empty() {
            normalized_note.to_string()
        } else {
            format!("{prior} {normalized_note}")
        };
        row_set(row, &rel_idx, "notes", next_note);

        updated += 1;
        let count = by_source.entry(primary).or_insert(0);
        *count += 1;
    }
    fs::write(&relationship_path, rows_to_csv(&rel_rows))
        .map_err(|e| format!("failed to write {}: {e}", relationship_path.display()))?;

    let ext_raw = fs::read_to_string(&extract_path)
        .map_err(|e| format!("failed to read {}: {e}", extract_path.display()))?;
    let mut ext_rows = parse_csv(&ext_raw);
    if ext_rows.is_empty() {
        return Err(format!("empty csv: {}", extract_path.display()));
    }
    let ext_header = ext_rows[0].clone();
    let ext_idx = header_index(&ext_header);
    let target_source = "(locator-url-normalization)";
    let existing_index = ext_rows.iter().enumerate().skip(1).find_map(|(i, row)| {
        (row_get(row, &ext_idx, "source_id") == target_source
            && row_get(row, &ext_idx, "researcher") == OWNER)
            .then_some(i)
    });
    let next_id = next_numeric_id(&ext_rows, &ext_idx, "EXT");

    let mut note_parts = by_source
        .iter()
        .enumerate()
        .map(|(i, (source, count))| (i, source.clone(), *count))
        .collect::<Vec<_>>();
    note_parts.sort_by(|a, b| b.2.cmp(&a.2).then_with(|| a.0.cmp(&b.0)));
    let notes = note_parts
        .iter()
        .map(|(_, source, count)| format!("{source}:{count}"))
        .collect::<Vec<_>>()
        .join("; ");

    let extract_entry = HashMap::from([
        (
            "extract_id",
            existing_index
                .and_then(|i| ext_rows.get(i))
                .map(|row| row_get(row, &ext_idx, "extract_id").to_string())
                .unwrap_or_else(|| id_with_prefix("EXT", next_id)),
        ),
        ("source_id", target_source.to_string()),
        ("date", date.to_string()),
        ("extract_status", "in_progress".to_string()),
        (
            "target_scope",
            "Locator URL normalization for direct claims".to_string(),
        ),
        (
            "claim_or_context_note",
            format!(
                "Batch E added explicit URL anchors to {updated} direct-claim locators that previously lacked source URLs."
            ),
        ),
        (
            "locator",
            "relationship-evidence-ledger.csv direct rows by primary_source_id".to_string(),
        ),
        ("researcher", OWNER.to_string()),
        (
            "notes",
            if notes.is_empty() {
                "No rows updated.".to_string()
            } else {
                notes
            },
        ),
    ]);
    let extract_row = ext_header
        .iter()
        .map(|col| extract_entry.get(col.as_str()).cloned().unwrap_or_default())
        .collect::<Vec<_>>();
    match existing_index {
        Some(i) => ext_rows[i] = extract_row,
        None => ext_rows.push(extract_row),
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
    fs::write(&extract_path, rows_to_csv(&ext_out))
        .map_err(|e| format!("failed to write {}: {e}", extract_path.display()))?;

    let queue_raw = fs::read_to_string(&queue_path)
        .map_err(|e| format!("failed to read {}: {e}", queue_path.display()))?;
    let mut queue_rows = parse_csv(&queue_raw);
    if queue_rows.is_empty() {
        return Err(format!("empty csv: {}", queue_path.display()));
    }
    let queue_header = queue_rows[0].clone();
    let queue_idx = header_index(&queue_header);
    let queue_entry = HashMap::from([
        ("queue_id", "SRCQ-022".to_string()),
        ("priority", "P1".to_string()),
        ("track", "Locator quality normalization".to_string()),
        (
            "dynasty_or_topic",
            "Direct-claim URL anchor standardization".to_string(),
        ),
        (
            "target_claim_scope",
            "Normalize direct relationship locators to include explicit source URL anchors"
                .to_string(),
        ),
        (
            "candidate_source_id",
            "(multi-source direct-claim locators)".to_string(),
        ),
        ("source_url", "(multi)".to_string()),
        ("publisher", "Mixed".to_string()),
        ("source_type", "quality normalization pass".to_string()),
        ("expected_grade", "B".to_string()),
        ("status", "in_progress".to_string()),
        ("last_updated", date.to_string()),
        ("owner", OWNER.to_string()),
        (
            "notes",
            format!("Batch E URL-normalized {updated} direct-claim locators."),
        ),
    ]);
    let queue_row = queue_header
        .iter()
        .map(|col| queue_entry.get(col.as_str()).cloned().unwrap_or_default())
        .collect::<Vec<_>>();
    let existing_queue = queue_rows
        .iter()
        .enumerate()
        .skip(1)
        .find_map(|(i, row)| (row_get(row, &queue_idx, "queue_id") == "SRCQ-022").then_some(i));
    match existing_queue {
        Some(i) => queue_rows[i] = queue_row,
        None => queue_rows.push(queue_row),
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
    fs::write(&queue_path, rows_to_csv(&queue_out))
        .map_err(|e| format!("failed to write {}: {e}", queue_path.display()))?;

    Ok(format!(
        "Phase 1 locator batch E complete:\n- direct locators URL-normalized: {updated}\n- source extract upserted: {}\n- source queue upserted: SRCQ-022\n",
        extract_entry.get("extract_id").cloned().unwrap_or_default()
    ))
}

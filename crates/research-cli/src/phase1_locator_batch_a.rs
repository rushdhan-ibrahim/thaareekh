use crate::csv_utils::{csv_escape, parse_csv};
use crate::source_models::SourceRecord;
use maldives_domain::Dataset;
use serde::Deserialize;
use std::collections::{HashMap, HashSet};
use std::fs;
use std::path::Path;
use std::sync::OnceLock;

const OWNER: &str = "phase1-locator-a";
const DEFAULT_DATE: &str = "2026-02-08";

#[derive(Clone, Debug, Deserialize)]
struct ClaimUpdate {
    claim_excerpt: String,
    citation_locator: String,
    notes: String,
}

#[derive(Clone, Debug, Deserialize)]
struct Payload {
    claim_updates: HashMap<String, ClaimUpdate>,
    source_extract_entries: Vec<HashMap<String, String>>,
    queue_entries: Vec<HashMap<String, String>>,
}

fn payload() -> &'static Payload {
    static PAYLOAD: OnceLock<Payload> = OnceLock::new();
    PAYLOAD.get_or_init(|| {
        serde_json::from_str(include_str!("../data/phase1_locator_batch_a.payload.json"))
            .expect("valid phase1 locator batch A payload")
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

fn by_id_map(dataset: &Dataset) -> HashMap<String, String> {
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

fn person_label(by_id: &HashMap<String, String>, id: &str) -> String {
    by_id.get(id).cloned().unwrap_or_else(|| id.to_string())
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

fn with_date(value: &str, date: &str) -> String {
    if date == DEFAULT_DATE {
        value.to_string()
    } else {
        value.replace(DEFAULT_DATE, date)
    }
}

fn apply_relationship_updates(dataset: &Dataset, path: &Path, date: &str) -> Result<usize, String> {
    let rel_raw =
        fs::read_to_string(path).map_err(|e| format!("failed to read {}: {e}", path.display()))?;
    let mut rel_rows = parse_csv(&rel_raw);
    if rel_rows.is_empty() {
        return Err(format!("empty csv: {}", path.display()));
    }
    let rel_idx = header_index(&rel_rows[0]);
    let by_person_id = by_id_map(dataset);

    let mut changed = 0usize;
    for row in rel_rows.iter_mut().skip(1) {
        let claim_id = row_get(row, &rel_idx, "claim_id");
        let Some(update) = payload().claim_updates.get(claim_id) else {
            continue;
        };
        let source_id = row_get(row, &rel_idx, "source_id").to_string();
        let target_id = row_get(row, &rel_idx, "target_id").to_string();
        let source = person_label(&by_person_id, &source_id);
        let target = person_label(&by_person_id, &target_id);

        row_set(
            row,
            &rel_idx,
            "claim_excerpt",
            format!("{} (pair: {} -> {}).", update.claim_excerpt, source, target),
        );
        row_set(
            row,
            &rel_idx,
            "citation_locator",
            with_date(&update.citation_locator, date),
        );
        row_set(row, &rel_idx, "review_status", "in_progress".to_string());
        row_set(row, &rel_idx, "canonical_decision", "pending".to_string());
        row_set(row, &rel_idx, "reviewer", OWNER.to_string());
        row_set(row, &rel_idx, "last_reviewed", date.to_string());
        row_set(row, &rel_idx, "access_date", date.to_string());
        row_set(row, &rel_idx, "notes", update.notes.clone());
        changed += 1;
    }

    fs::write(path, rows_to_csv(&rel_rows))
        .map_err(|e| format!("failed to write {}: {e}", path.display()))?;
    Ok(changed)
}

fn upsert_source_extract_log(path: &Path, date: &str) -> Result<usize, String> {
    let ext_raw =
        fs::read_to_string(path).map_err(|e| format!("failed to read {}: {e}", path.display()))?;
    let mut ext_rows = parse_csv(&ext_raw);
    if ext_rows.is_empty() {
        return Err(format!("empty csv: {}", path.display()));
    }
    let ext_header = ext_rows[0].clone();
    let ext_idx = header_index(&ext_header);

    let mut by_id = HashMap::<String, usize>::new();
    for (i, row) in ext_rows.iter().enumerate().skip(1) {
        by_id.insert(row_get(row, &ext_idx, "extract_id").to_string(), i);
    }

    for entry in &payload().source_extract_entries {
        let extract_id = entry.get("extract_id").cloned().unwrap_or_default();
        let row_data = ext_header
            .iter()
            .map(|col| {
                with_date(
                    entry
                        .get(col.as_str())
                        .map(String::as_str)
                        .unwrap_or_default(),
                    date,
                )
            })
            .collect::<Vec<_>>();
        if let Some(i) = by_id.get(&extract_id).copied() {
            ext_rows[i] = row_data;
        } else {
            ext_rows.push(row_data);
        }
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
    fs::write(path, rows_to_csv(&ext_out))
        .map_err(|e| format!("failed to write {}: {e}", path.display()))?;

    Ok(payload().source_extract_entries.len())
}

fn upsert_source_queue(path: &Path, date: &str) -> Result<usize, String> {
    let queue_raw =
        fs::read_to_string(path).map_err(|e| format!("failed to read {}: {e}", path.display()))?;
    let mut queue_rows = parse_csv(&queue_raw);
    if queue_rows.is_empty() {
        return Err(format!("empty csv: {}", path.display()));
    }
    let queue_header = queue_rows[0].clone();
    let queue_idx = header_index(&queue_header);

    let mut by_id = HashMap::<String, usize>::new();
    for (i, row) in queue_rows.iter().enumerate().skip(1) {
        by_id.insert(row_get(row, &queue_idx, "queue_id").to_string(), i);
    }

    for entry in &payload().queue_entries {
        let queue_id = entry.get("queue_id").cloned().unwrap_or_default();
        let row_data = queue_header
            .iter()
            .map(|col| {
                with_date(
                    entry
                        .get(col.as_str())
                        .map(String::as_str)
                        .unwrap_or_default(),
                    date,
                )
            })
            .collect::<Vec<_>>();
        if let Some(i) = by_id.get(&queue_id).copied() {
            queue_rows[i] = row_data;
        } else {
            queue_rows.push(row_data);
        }
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
    fs::write(path, rows_to_csv(&queue_out))
        .map_err(|e| format!("failed to write {}: {e}", path.display()))?;

    Ok(payload().queue_entries.len())
}

fn check_sources(sources: &[SourceRecord]) -> Result<(), String> {
    let source_ids = sources
        .iter()
        .map(|source| source.id.clone())
        .collect::<HashSet<_>>();
    let mut missing = Vec::<String>::new();
    for entry in &payload().source_extract_entries {
        let source_id = entry.get("source_id").cloned().unwrap_or_default();
        if !source_id.is_empty() && !source_ids.contains(&source_id) {
            missing.push(source_id);
        }
    }
    if missing.is_empty() {
        Ok(())
    } else {
        Err(format!(
            "Missing source IDs in registry: {}",
            missing.join(", ")
        ))
    }
}

pub fn run(
    dataset: &Dataset,
    sources: &[SourceRecord],
    root_dir: &str,
    date_opt: Option<&str>,
) -> Result<String, String> {
    let date = date_opt.unwrap_or(DEFAULT_DATE);
    check_sources(sources)?;

    let root = Path::new(root_dir);
    let ledger_dir = root.join("docs").join("research-program").join("ledgers");
    let relationship_path = ledger_dir.join("relationship-evidence-ledger.csv");
    let source_extract_path = ledger_dir.join("source-extract-log.csv");
    let source_queue_path = ledger_dir.join("source-expansion-queue.csv");

    let claim_count = apply_relationship_updates(dataset, &relationship_path, date)?;
    let extract_count = upsert_source_extract_log(&source_extract_path, date)?;
    let queue_count = upsert_source_queue(&source_queue_path, date)?;

    Ok(format!(
        "Phase 1 locator batch A complete:\n- relationship claims updated: {claim_count}\n- source extract entries upserted: {extract_count}\n- source queue entries upserted: {queue_count}\n"
    ))
}

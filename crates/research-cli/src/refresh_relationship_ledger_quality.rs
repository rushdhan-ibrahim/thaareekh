use crate::csv_utils::{csv_escape, parse_csv};
use std::collections::HashMap;
use std::fs;
use std::path::Path;

const DEFAULT_DATE: &str = "2026-02-08";

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
    if let Some(i) = idx.get(key).copied() {
        if i >= row.len() {
            return;
        }
        row[i] = value;
    }
}

fn split_refs(value: &str) -> Vec<String> {
    value
        .split('|')
        .map(str::trim)
        .filter(|v| !v.is_empty())
        .map(ToString::to_string)
        .collect()
}

pub fn run(root_dir: &str, date_opt: Option<&str>) -> Result<String, String> {
    let date = date_opt.unwrap_or(DEFAULT_DATE);
    let root = Path::new(root_dir);
    let ledger_dir = root.join("docs").join("research-program").join("ledgers");

    let extract_path = ledger_dir.join("source-extract-log.csv");
    let inference_path = ledger_dir.join("inference-dossier-tracker.csv");
    let rel_path = ledger_dir.join("relationship-evidence-ledger.csv");

    let extract_csv = parse_csv(
        &fs::read_to_string(&extract_path)
            .map_err(|e| format!("failed to read {}: {e}", extract_path.display()))?,
    );
    if extract_csv.is_empty() {
        return Err(format!("empty csv: {}", extract_path.display()));
    }
    let extract_idx = header_index(&extract_csv[0]);
    let mut extract_by_source = HashMap::<String, String>::new();
    for row in extract_csv.iter().skip(1) {
        let source_id = row_get(row, &extract_idx, "source_id");
        let extract_id = row_get(row, &extract_idx, "extract_id");
        if !source_id.is_empty()
            && !extract_id.is_empty()
            && !extract_by_source.contains_key(source_id)
        {
            extract_by_source.insert(source_id.to_string(), extract_id.to_string());
        }
    }

    let inference_csv = parse_csv(
        &fs::read_to_string(&inference_path)
            .map_err(|e| format!("failed to read {}: {e}", inference_path.display()))?,
    );
    if inference_csv.is_empty() {
        return Err(format!("empty csv: {}", inference_path.display()));
    }
    let inference_idx = header_index(&inference_csv[0]);
    let mut inference_dossier_by_key = HashMap::<String, String>::new();
    for row in inference_csv.iter().skip(1) {
        let key = row_get(row, &inference_idx, "edge_key");
        if key.is_empty() {
            continue;
        }
        inference_dossier_by_key.insert(
            key.to_string(),
            row_get(row, &inference_idx, "dossier_file").to_string(),
        );
    }

    let mut rel_csv = parse_csv(
        &fs::read_to_string(&rel_path)
            .map_err(|e| format!("failed to read {}: {e}", rel_path.display()))?,
    );
    if rel_csv.is_empty() {
        return Err(format!("empty csv: {}", rel_path.display()));
    }
    let rel_idx = header_index(&rel_csv[0]);

    let mut touched = 0usize;
    for row in rel_csv.iter_mut().skip(1) {
        let primary_source_id = row_get(row, &rel_idx, "primary_source_id").to_string();
        let evidence_refs = row_get(row, &rel_idx, "evidence_refs").to_string();
        let source_id = if primary_source_id.trim().is_empty() {
            split_refs(&evidence_refs)
                .into_iter()
                .next()
                .unwrap_or_default()
        } else {
            primary_source_id
        };
        let extract_id = extract_by_source.get(&source_id).cloned();
        let edge_key = row_get(row, &rel_idx, "edge_key").to_string();
        let claim_type = row_get(row, &rel_idx, "claim_type").to_string();

        let locator = row_get(row, &rel_idx, "citation_locator").to_string();
        if locator
            .to_lowercase()
            .contains("locator extraction pending")
        {
            let next = if let Some(ex_id) = &extract_id {
                format!(
                    "Primary source {} requires locator-level excerpt; tracked in {}.",
                    source_id, ex_id
                )
            } else {
                format!(
                    "Primary source {} requires locator-level excerpt; tracked in source-expansion queue.",
                    if source_id.is_empty() {
                        "(unassigned)"
                    } else {
                        source_id.as_str()
                    }
                )
            };
            row_set(row, &rel_idx, "citation_locator", next);
            touched += 1;
        }

        let note = row_get(row, &rel_idx, "notes").to_string();
        let note_lower = note.to_lowercase();
        if note_lower.contains("backfilled from inference metadata") {
            let dossier = inference_dossier_by_key.get(&edge_key).cloned();
            let next = if let Some(dossier_path) = dossier {
                format!(
                    "Inference claim prepared for verification; pair dossier: {}.",
                    dossier_path
                )
            } else {
                "Inference claim prepared for verification; pair dossier mapping pending."
                    .to_string()
            };
            row_set(row, &rel_idx, "notes", next);
            touched += 1;
        } else if note_lower.contains("direct claim moved to in_progress") {
            let next = if let Some(ex_id) = &extract_id {
                format!(
                    "Direct claim queued for locator extraction and corroboration in {}.",
                    ex_id
                )
            } else {
                "Direct claim queued for locator extraction; extraction tracker mapping pending."
                    .to_string()
            };
            row_set(row, &rel_idx, "notes", next);
            touched += 1;
        } else if note_lower.contains("contested claim moved to in_progress") {
            let next = if let Some(ex_id) = &extract_id {
                format!(
                    "Contested claim queued for locator extraction and contradiction adjudication in {}.",
                    ex_id
                )
            } else {
                "Contested claim queued for contradiction adjudication; extraction tracker mapping pending."
                    .to_string()
            };
            row_set(row, &rel_idx, "notes", next);
            touched += 1;
        }

        if row_get(row, &rel_idx, "review_status") == "in_progress" {
            row_set(row, &rel_idx, "last_reviewed", date.to_string());
        }
        if row_get(row, &rel_idx, "review_status") == "in_progress"
            && row_get(row, &rel_idx, "reviewer").is_empty()
        {
            row_set(
                row,
                &rel_idx,
                "reviewer",
                "phase1-quality-refresh".to_string(),
            );
            touched += 1;
        }
        if row_get(row, &rel_idx, "review_status") == "in_progress"
            && row_get(row, &rel_idx, "access_date").is_empty()
        {
            row_set(row, &rel_idx, "access_date", date.to_string());
            touched += 1;
        }
        if claim_type == "inferred" && row_get(row, &rel_idx, "citation_locator").is_empty() {
            if let Some(dossier) = inference_dossier_by_key.get(&edge_key) {
                row_set(
                    row,
                    &rel_idx,
                    "citation_locator",
                    format!("Inference basis documented in {}.", dossier),
                );
                touched += 1;
            }
        }
    }

    fs::write(&rel_path, rows_to_csv(&rel_csv))
        .map_err(|e| format!("failed to write {}: {e}", rel_path.display()))?;

    Ok(format!(
        "Relationship ledger quality refresh complete: {} field updates.\n",
        touched
    ))
}

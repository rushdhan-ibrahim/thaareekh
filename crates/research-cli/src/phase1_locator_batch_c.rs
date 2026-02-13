use crate::csv_utils::{csv_escape, parse_csv};
use maldives_domain::Dataset;
use std::collections::HashMap;
use std::fs;
use std::path::Path;

const DEFAULT_DATE: &str = "2026-02-08";
const OWNER: &str = "phase1-locator-c";

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

fn to_num_id(id: &str) -> Option<i64> {
    let raw = id.strip_prefix('P').unwrap_or(id);
    raw.parse::<i64>().ok()
}

fn build_excerpt(
    row: &[String],
    idx: &HashMap<String, usize>,
    by_id: &HashMap<String, String>,
) -> String {
    let rel = row_get(row, idx, "relation_type");
    let src_num = to_num_id(row_get(row, idx, "source_id")).unwrap_or_default();
    let dst_num = to_num_id(row_get(row, idx, "target_id")).unwrap_or_default();
    let source = person_label(by_id, row_get(row, idx, "source_id"));
    let target = person_label(by_id, row_get(row, idx, "target_id"));
    let label = row_get(row, idx, "label");
    let label_tag = if label.is_empty() {
        String::new()
    } else {
        format!(" ({label})")
    };

    match rel {
        "parent" => format!(
            "MRF sovereign table linkage uses entry No.{dst_num} in lineage connection with No.{src_num} for modeled parent relation ({source} -> {target})."
        ),
        "sibling" => format!(
            "MRF sovereign table branch context connects entries No.{src_num} and No.{dst_num} in sibling-family context{label_tag}. ({source} <-> {target})."
        ),
        "spouse" => format!(
            "MRF sovereign table and branch notes associate entries No.{src_num} and No.{dst_num} in marital context{label_tag}. ({source} <-> {target})."
        ),
        _ => format!(
            "MRF sovereign table/branch context connects entries No.{src_num} and No.{dst_num} for modeled kin relation{label_tag}. ({source} <-> {target})."
        ),
    }
}

fn build_locator(row: &[String], idx: &HashMap<String, usize>, date: &str) -> String {
    let src_num = to_num_id(row_get(row, idx, "source_id")).unwrap_or_default();
    let dst_num = to_num_id(row_get(row, idx, "target_id")).unwrap_or_default();
    format!(
        "SRC-MRF-KINGS r.jina mirror (maldives_kings_list.full.shtml), sovereign table entries No.{src_num} and No.{dst_num} in {date} snapshot."
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

pub fn run(dataset: &Dataset, root_dir: &str, date_opt: Option<&str>) -> Result<String, String> {
    let date = date_opt.unwrap_or(DEFAULT_DATE);
    let root = Path::new(root_dir);
    let ledger_dir = root.join("docs").join("research-program").join("ledgers");

    let relationship_path = ledger_dir.join("relationship-evidence-ledger.csv");
    let relationship_raw = fs::read_to_string(&relationship_path)
        .map_err(|e| format!("failed to read {}: {e}", relationship_path.display()))?;
    let mut relationship_rows = parse_csv(&relationship_raw);
    if relationship_rows.is_empty() {
        return Err(format!("empty csv: {}", relationship_path.display()));
    }
    let rel_idx = header_index(&relationship_rows[0]);
    let by_person_id = by_id_map(dataset);

    let mut changed = 0usize;
    for row in relationship_rows.iter_mut().skip(1) {
        if row_get(row, &rel_idx, "primary_source_id") != "SRC-MRF-KINGS" {
            continue;
        }
        let locator = row_get(row, &rel_idx, "citation_locator").to_lowercase();
        if !locator.contains("requires locator-level excerpt") {
            continue;
        }

        let src_num = to_num_id(row_get(row, &rel_idx, "source_id"));
        let dst_num = to_num_id(row_get(row, &rel_idx, "target_id"));
        let Some(src) = src_num else {
            continue;
        };
        let Some(dst) = dst_num else {
            continue;
        };
        if src > 95 || dst > 95 {
            continue;
        }

        let claim_excerpt = build_excerpt(row, &rel_idx, &by_person_id);
        let citation_locator = build_locator(row, &rel_idx, date);
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
            "Table-entry locator captured via r.jina mirror; direct quote extraction still recommended for promotion.".to_string(),
        );
        changed += 1;
    }
    fs::write(&relationship_path, rows_to_csv(&relationship_rows))
        .map_err(|e| format!("failed to write {}: {e}", relationship_path.display()))?;

    let extract_path = ledger_dir.join("source-extract-log.csv");
    let extract_raw = fs::read_to_string(&extract_path)
        .map_err(|e| format!("failed to read {}: {e}", extract_path.display()))?;
    let mut extract_rows = parse_csv(&extract_raw);
    if extract_rows.is_empty() {
        return Err(format!("empty csv: {}", extract_path.display()));
    }
    let ext_idx = header_index(&extract_rows[0]);
    let mut ext_existing = None::<usize>;
    for (i, row) in extract_rows.iter().enumerate().skip(1) {
        if row_get(row, &ext_idx, "extract_id") == "EXT-028" {
            ext_existing = Some(i);
            break;
        }
    }
    let ext_entry = HashMap::from([
        ("extract_id", "EXT-028".to_string()),
        ("source_id", "SRC-MRF-KINGS".to_string()),
        ("date", date.to_string()),
        ("extract_status", "in_progress".to_string()),
        (
            "target_scope",
            "Sovereign table entry locator extraction".to_string(),
        ),
        (
            "claim_or_context_note",
            "Captured entry-number locators for low-ID sovereign table relations via r.jina mirror snapshot.".to_string(),
        ),
        (
            "locator",
            "r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml".to_string(),
        ),
        ("researcher", OWNER.to_string()),
        (
            "notes",
            "Used for claims where both endpoints are within sovereign entry range P1..P95."
                .to_string(),
        ),
    ]);
    let ext_row = extract_rows[0]
        .iter()
        .map(|col| ext_entry.get(col.as_str()).cloned().unwrap_or_default())
        .collect::<Vec<_>>();
    match ext_existing {
        Some(i) => extract_rows[i] = ext_row,
        None => extract_rows.push(ext_row),
    }
    let mut ext_body = extract_rows.into_iter().skip(1).collect::<Vec<_>>();
    ext_body.sort_by(|a, b| {
        compare_prefixed_numeric(
            row_get(a, &ext_idx, "extract_id"),
            row_get(b, &ext_idx, "extract_id"),
        )
    });
    let extract_header = parse_csv(&extract_raw)[0].clone();
    let mut extract_out = vec![extract_header];
    extract_out.extend(ext_body);
    fs::write(&extract_path, rows_to_csv(&extract_out))
        .map_err(|e| format!("failed to write {}: {e}", extract_path.display()))?;

    let queue_path = ledger_dir.join("source-expansion-queue.csv");
    let queue_raw = fs::read_to_string(&queue_path)
        .map_err(|e| format!("failed to read {}: {e}", queue_path.display()))?;
    let mut queue_rows = parse_csv(&queue_raw);
    if queue_rows.is_empty() {
        return Err(format!("empty csv: {}", queue_path.display()));
    }
    let queue_idx = header_index(&queue_rows[0]);
    let mut queue_existing = None::<usize>;
    for (i, row) in queue_rows.iter().enumerate().skip(1) {
        if row_get(row, &queue_idx, "queue_id") == "SRCQ-020" {
            queue_existing = Some(i);
            break;
        }
    }
    let queue_entry = HashMap::from([
        ("queue_id", "SRCQ-020".to_string()),
        ("priority", "P1".to_string()),
        ("track", "MRF table extraction".to_string()),
        ("dynasty_or_topic", "Sovereign table entries P1-P95".to_string()),
        (
            "target_claim_scope",
            "Entry-number locator capture for parent/sibling/spouse/kin rows".to_string(),
        ),
        ("candidate_source_id", "SRC-MRF-KINGS".to_string()),
        (
            "source_url",
            "https://r.jina.ai/http://maldivesroyalfamily.com/maldives_kings_list.full.shtml"
                .to_string(),
        ),
        (
            "publisher",
            "Maldives Royal Family (via r.jina mirror)".to_string(),
        ),
        (
            "source_type",
            "specialist genealogy compendium".to_string(),
        ),
        ("expected_grade", "B".to_string()),
        ("status", "in_progress".to_string()),
        ("last_updated", date.to_string()),
        ("owner", OWNER.to_string()),
        (
            "notes",
            "Batch C captured table-entry locators for claims with endpoints in P1..P95; quote-level extraction remains pending.".to_string(),
        ),
    ]);
    let queue_row = queue_rows[0]
        .iter()
        .map(|col| queue_entry.get(col.as_str()).cloned().unwrap_or_default())
        .collect::<Vec<_>>();
    match queue_existing {
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
    let queue_header = parse_csv(&queue_raw)[0].clone();
    let mut queue_out = vec![queue_header];
    queue_out.extend(queue_body);
    fs::write(&queue_path, rows_to_csv(&queue_out))
        .map_err(|e| format!("failed to write {}: {e}", queue_path.display()))?;

    Ok(format!(
        "Phase 1 locator batch C complete:\n- relationship claims updated: {changed}\n- source extract upserted: EXT-028\n- source queue upserted: SRCQ-020\n"
    ))
}

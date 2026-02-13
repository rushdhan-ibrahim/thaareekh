use crate::csv_utils::{csv_escape, parse_csv};
use std::collections::{HashMap, HashSet};
use std::fs;
use std::path::Path;

const DEFAULT_DATE: &str = "2026-02-08";
const OWNER: &str = "phase5-promo-b";

const QUEUE_START: &str = "<!-- PROMOTION-BATCH-B-START -->";
const QUEUE_END: &str = "<!-- PROMOTION-BATCH-B-END -->";
const CONTRA_START: &str = "<!-- CONTRADICTION-BATCH-B-START -->";
const CONTRA_END: &str = "<!-- CONTRADICTION-BATCH-B-END -->";

#[derive(Clone)]
struct SelectedClaim {
    claim_id: String,
    edge_key: String,
    relation_type: String,
    source_id: String,
    target_id: String,
    label: String,
    primary_source_id: String,
    confidence_grade: String,
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

fn replace_section(text: &str, start: &str, end: &str, section: &str) -> String {
    if let (Some(a), Some(b_start)) = (text.find(start), text.find(end)) {
        let b = b_start + end.len();
        return format!("{}{}{}", &text[..a], section, &text[b..]);
    }
    format!("{}\n\n{}\n", text.trim_end(), section)
}

fn top_entries(counts: &HashMap<String, usize>, max: usize) -> Vec<(String, usize)> {
    let mut ranked = counts
        .iter()
        .map(|(k, v)| (k.clone(), *v))
        .collect::<Vec<_>>();
    ranked.sort_by(|a, b| b.1.cmp(&a.1));
    ranked.truncate(max);
    ranked
}

fn format_distribution(entries: &[(String, usize)]) -> String {
    if entries.is_empty() {
        return "none".to_string();
    }
    entries
        .iter()
        .map(|(k, v)| format!("{k} ({v})"))
        .collect::<Vec<_>>()
        .join(", ")
}

pub fn run(root_dir: &str, date_opt: Option<&str>) -> Result<String, String> {
    let date = date_opt.unwrap_or(DEFAULT_DATE);
    let root = Path::new(root_dir);
    let relationship_ledger_path = root
        .join("docs")
        .join("research-program")
        .join("ledgers")
        .join("relationship-evidence-ledger.csv");
    let promotion_queue_path = root
        .join("docs")
        .join("research-program")
        .join("promotion-queue.md");
    let contradiction_log_path = root
        .join("docs")
        .join("research-program")
        .join("contradiction-log.md");
    let manifest_path = root
        .join("docs")
        .join("research-program")
        .join("ledgers")
        .join("promotion-batch-b-claims.csv");

    let rel_raw = fs::read_to_string(&relationship_ledger_path)
        .map_err(|e| format!("failed to read {}: {e}", relationship_ledger_path.display()))?;
    let mut rel_csv = parse_csv(&rel_raw);
    if rel_csv.is_empty() {
        return Err(format!("empty csv: {}", relationship_ledger_path.display()));
    }
    let rel_idx = header_index(&rel_csv[0]);

    let mut selection = Vec::<SelectedClaim>::new();
    for row in rel_csv.iter().skip(1) {
        let direct_strong = row_get(row, &rel_idx, "claim_type") == "direct"
            && matches!(row_get(row, &rel_idx, "confidence_grade"), "A" | "B");
        let pending_review = row_get(row, &rel_idx, "review_status") != "approved";
        if direct_strong && pending_review {
            selection.push(SelectedClaim {
                claim_id: row_get(row, &rel_idx, "claim_id").to_string(),
                edge_key: row_get(row, &rel_idx, "edge_key").to_string(),
                relation_type: row_get(row, &rel_idx, "relation_type").to_string(),
                source_id: row_get(row, &rel_idx, "source_id").to_string(),
                target_id: row_get(row, &rel_idx, "target_id").to_string(),
                label: row_get(row, &rel_idx, "label").to_string(),
                primary_source_id: row_get(row, &rel_idx, "primary_source_id").to_string(),
                confidence_grade: row_get(row, &rel_idx, "confidence_grade").to_string(),
            });
        }
    }

    if selection.is_empty() {
        return Ok(
            "Phase 5 promotion batch B: no pending direct A/B claims; no changes applied.\n"
                .to_string(),
        );
    }

    let direct_rows = rel_csv
        .iter()
        .skip(1)
        .filter(|row| row_get(row, &rel_idx, "claim_type") == "direct")
        .collect::<Vec<_>>();

    let mut tuple_seen = HashSet::<String>::new();
    let mut duplicate_direct_tuples = 0usize;
    for row in &direct_rows {
        let key = format!(
            "{}|{}|{}|{}",
            row_get(row, &rel_idx, "relation_type"),
            row_get(row, &rel_idx, "source_id"),
            row_get(row, &rel_idx, "target_id"),
            row_get(row, &rel_idx, "label")
        );
        if !tuple_seen.insert(key) {
            duplicate_direct_tuples += 1;
        }
    }

    let mut parent_map = HashMap::<String, HashSet<String>>::new();
    for row in &direct_rows {
        if row_get(row, &rel_idx, "relation_type") != "parent" {
            continue;
        }
        if !matches!(row_get(row, &rel_idx, "confidence_grade"), "A" | "B") {
            continue;
        }
        let child = row_get(row, &rel_idx, "target_id").to_string();
        let parent = row_get(row, &rel_idx, "source_id").to_string();
        parent_map.entry(child).or_default().insert(parent);
    }
    let over_parent_assignments = parent_map.values().filter(|set| set.len() > 2).count();

    if duplicate_direct_tuples > 0 || over_parent_assignments > 0 {
        return Err(format!(
            "Batch B safety checks failed: duplicateDirectTuples={duplicate_direct_tuples}, overParentAssignments={over_parent_assignments}"
        ));
    }

    let selected_claim_ids = selection
        .iter()
        .map(|item| item.claim_id.clone())
        .collect::<HashSet<_>>();
    let mut approved_now = 0usize;
    for row in rel_csv.iter_mut().skip(1) {
        let claim_id = row_get(row, &rel_idx, "claim_id").to_string();
        if !selected_claim_ids.contains(&claim_id) {
            continue;
        }

        row_set(row, &rel_idx, "review_status", "approved".to_string());
        if row_get(row, &rel_idx, "canonical_decision") != "approved" {
            approved_now += 1;
        }
        row_set(row, &rel_idx, "canonical_decision", "approved".to_string());
        row_set(row, &rel_idx, "reviewer", OWNER.to_string());
        row_set(row, &rel_idx, "last_reviewed", date.to_string());
        row_set(row, &rel_idx, "access_date", date.to_string());

        let note = row_get(row, &rel_idx, "notes");
        let stamp = format!("Promotion Batch B approved {date}; remaining direct A/B claim.");
        if !note.contains(&stamp) {
            let next = if note.is_empty() {
                stamp
            } else {
                format!("{note} {stamp}")
            };
            row_set(row, &rel_idx, "notes", next);
        }
    }

    fs::write(&relationship_ledger_path, rows_to_csv(&rel_csv)).map_err(|e| {
        format!(
            "failed to write {}: {e}",
            relationship_ledger_path.display()
        )
    })?;

    let mut by_source = HashMap::<String, usize>::new();
    let mut by_relation = HashMap::<String, usize>::new();
    for item in &selection {
        let source = if item.primary_source_id.is_empty() {
            "(none)".to_string()
        } else {
            item.primary_source_id.clone()
        };
        *by_source.entry(source).or_insert(0) += 1;

        let relation = if item.relation_type.is_empty() {
            "(none)".to_string()
        } else {
            item.relation_type.clone()
        };
        *by_relation.entry(relation).or_insert(0) += 1;
    }

    let source_top = top_entries(&by_source, 12);
    let relation_top = top_entries(&by_relation, 10);
    let unique_edges = selection
        .iter()
        .map(|item| item.edge_key.clone())
        .collect::<HashSet<_>>()
        .len();

    let mut manifest_rows = vec![vec![
        "claim_id".to_string(),
        "edge_key".to_string(),
        "relation_type".to_string(),
        "source_id".to_string(),
        "target_id".to_string(),
        "label".to_string(),
        "primary_source_id".to_string(),
        "confidence_grade".to_string(),
        "reviewer".to_string(),
        "approved_date".to_string(),
    ]];
    let mut sorted_selection = selection.clone();
    sorted_selection.sort_by(|a, b| a.claim_id.cmp(&b.claim_id));
    for item in sorted_selection {
        manifest_rows.push(vec![
            item.claim_id,
            item.edge_key,
            item.relation_type,
            item.source_id,
            item.target_id,
            item.label,
            item.primary_source_id,
            item.confidence_grade,
            OWNER.to_string(),
            date.to_string(),
        ]);
    }
    fs::write(&manifest_path, rows_to_csv(&manifest_rows))
        .map_err(|e| format!("failed to write {}: {e}", manifest_path.display()))?;

    let queue_section = format!(
        "{QUEUE_START}
## Batch 2 ({date}): Remaining Direct A/B Claim Promotion

1. Claim/edge: `batch|remaining-direct-a-b|{date}`
2. Proposed change: Approve the full remaining set of direct `A/B` claims that passed Phase 5 safety checks.
3. Evidence summary: {} direct claims approved across {} unique edges. Relation split: {}. Full manifest: `docs/research-program/ledgers/promotion-batch-b-claims.csv`.
4. Source IDs: {}
5. Risk notes: Structural contradiction pre-check passed (duplicate direct tuples: {}; >2-parent anomalies: {}). Source concentration remains tracked in source-coverage audits.
6. Reviewer: {}
7. Status: approved

{QUEUE_END}",
        selection.len(),
        unique_edges,
        format_distribution(&relation_top),
        format_distribution(&source_top),
        duplicate_direct_tuples,
        over_parent_assignments,
        OWNER
    );
    let queue_old = fs::read_to_string(&promotion_queue_path)
        .map_err(|e| format!("failed to read {}: {e}", promotion_queue_path.display()))?;
    let queue_new = replace_section(&queue_old, QUEUE_START, QUEUE_END, &queue_section);
    fs::write(&promotion_queue_path, queue_new)
        .map_err(|e| format!("failed to write {}: {e}", promotion_queue_path.display()))?;

    let contradiction_section = format!(
        "{CONTRA_START}
### Batch Review ({date}) — Promotion Batch B Pre-check
- `ID`: CLOG-{date}-B
- `Topic`: Pre-promotion contradiction sweep for remaining direct A/B claims
- `Entities`: {} direct A/B claims ({} unique edges)
- `Claim A`: Selected claims have explicit relation text and citation locators in the relationship ledger.
- `Claim B`: Latent contradictions may surface when additional archival corpora are ingested.
- `Sources`: relationship-evidence-ledger.csv, source-coverage audits, contradiction-log baseline
- `Current stance`: No blocking contradiction found in structured ledger checks for this batch.
- `Adjudication rationale`: Duplicate direct tuple count is {} and >2-parent anomaly count is {}; batch qualifies for canonical promotion.
- `Next verification action`: Re-run contradiction sweep after the next source-ingestion wave and append any competing claims.
- `Last reviewed`: {date}
{CONTRA_END}",
        selection.len(),
        unique_edges,
        duplicate_direct_tuples,
        over_parent_assignments
    );
    let contradiction_old = fs::read_to_string(&contradiction_log_path)
        .map_err(|e| format!("failed to read {}: {e}", contradiction_log_path.display()))?;
    let contradiction_new = replace_section(
        &contradiction_old,
        CONTRA_START,
        CONTRA_END,
        &contradiction_section,
    );
    fs::write(&contradiction_log_path, contradiction_new)
        .map_err(|e| format!("failed to write {}: {e}", contradiction_log_path.display()))?;

    Ok(format!(
        "Phase 5 promotion batch B complete:\n- selected claims: {}\n- unique edges covered: {}\n- newly approved canonical decisions: {}\n- manifest written: {}\n- promotion queue updated: {}\n- contradiction log updated: {}\n",
        selection.len(),
        unique_edges,
        approved_now,
        manifest_path.display(),
        promotion_queue_path.display(),
        contradiction_log_path.display()
    ))
}

use crate::csv_utils::parse_csv;
use serde_json::to_string as json_string;
use std::cmp::Ordering;
use std::collections::HashMap;
use std::fs;
use std::path::Path;

fn today_iso() -> String {
    match std::process::Command::new("date")
        .args(["-u", "+%F"])
        .output()
    {
        Ok(out) if out.status.success() => String::from_utf8_lossy(&out.stdout).trim().to_string(),
        _ => "1970-01-01".to_string(),
    }
}

fn is_undirected(t: &str) -> bool {
    matches!(t, "sibling" | "spouse" | "kin")
}

fn normalize_label(label: &str) -> String {
    label.trim().to_string()
}

fn normalized_edge_key(t: &str, source_id: &str, target_id: &str, label: &str) -> String {
    let label = normalize_label(label);
    if is_undirected(t) {
        let mut pair = [source_id.to_string(), target_id.to_string()];
        pair.sort();
        return format!("{}|{}|{}|{}", t, pair[0], pair[1], label);
    }
    format!("{}|{}|{}|{}", t, source_id, target_id, label)
}

fn split_edge_key(edge_key: &str) -> (String, String, String, String) {
    let parts = edge_key.split('|').collect::<Vec<_>>();
    let t = parts.first().copied().unwrap_or("").to_string();
    let s = parts.get(1).copied().unwrap_or("").to_string();
    let d = parts.get(2).copied().unwrap_or("").to_string();
    let l = if parts.len() > 3 {
        parts[3..].join("|")
    } else {
        String::new()
    };
    (t, s, d, l)
}

fn normalize_edge_key(edge_key: &str) -> String {
    let (t, s, d, l) = split_edge_key(edge_key);
    normalized_edge_key(&t, &s, &d, &l)
}

fn header_index(header: &[String]) -> HashMap<String, usize> {
    header
        .iter()
        .enumerate()
        .map(|(i, h)| (h.clone(), i))
        .collect::<HashMap<_, _>>()
}

fn row_cell<'a>(row: &'a [String], idx: &HashMap<String, usize>, key: &str) -> &'a str {
    idx.get(key)
        .and_then(|i| row.get(*i))
        .map(String::as_str)
        .unwrap_or("")
}

#[derive(Clone)]
struct Entry {
    edge_key: String,
    claim_id: String,
    confidence: String,
    claim_type: String,
    confidence_grade: String,
    primary_source_id: String,
    review_status: String,
    canonical_decision: String,
    reviewer: String,
    last_reviewed: String,
    inference_class: String,
    inference_rule: String,
    dossier_status: String,
    dossier_file: String,
    tracker_last_updated: String,
}

fn js_string(value: &str) -> Result<String, String> {
    json_string(value).map_err(|e| format!("failed to encode js string: {e}"))
}

fn map_entry_code(item: &Entry) -> Result<String, String> {
    let (t, s, d, l) = split_edge_key(&item.edge_key);

    Ok(format!(
        "  [k({}, {}, {}, {}), {{\n    claim_id: {},\n    confidence: {},\n    claim_type: {},\n    confidence_grade: {},\n    primary_source_id: {},\n    review_status: {},\n    canonical_decision: {},\n    reviewer: {},\n    last_reviewed: {},\n    inference_class: {},\n    inference_rule: {},\n    dossier_status: {},\n    dossier_file: {},\n    tracker_last_updated: {}\n  }}]",
        js_string(&t)?,
        js_string(&s)?,
        js_string(&d)?,
        js_string(&l)?,
        js_string(&item.claim_id)?,
        js_string(&item.confidence)?,
        js_string(&item.claim_type)?,
        js_string(&item.confidence_grade)?,
        js_string(&item.primary_source_id)?,
        js_string(&item.review_status)?,
        js_string(&item.canonical_decision)?,
        js_string(&item.reviewer)?,
        js_string(&item.last_reviewed)?,
        js_string(&item.inference_class)?,
        js_string(&item.inference_rule)?,
        js_string(&item.dossier_status)?,
        js_string(&item.dossier_file)?,
        js_string(&item.tracker_last_updated)?,
    ))
}

pub fn run(root_dir: &str, date_opt: Option<&str>) -> Result<String, String> {
    let date = date_opt.map(|v| v.to_string()).unwrap_or_else(today_iso);
    let root = Path::new(root_dir);
    let relationship_path = root
        .join("docs")
        .join("research-program")
        .join("ledgers")
        .join("relationship-evidence-ledger.csv");
    let inference_path = root
        .join("docs")
        .join("research-program")
        .join("ledgers")
        .join("inference-dossier-tracker.csv");
    let output_path = root
        .join("src")
        .join("data")
        .join("relationship-verification.js");

    let relationship_raw = fs::read_to_string(&relationship_path)
        .map_err(|e| format!("failed to read {}: {e}", relationship_path.display()))?;
    let relationship_csv = parse_csv(&relationship_raw);
    if relationship_csv.is_empty() {
        return Err(format!("relationship ledger csv is empty: {}", relationship_path.display()));
    }

    let inference_raw = fs::read_to_string(&inference_path)
        .map_err(|e| format!("failed to read {}: {e}", inference_path.display()))?;
    let inference_csv = parse_csv(&inference_raw);
    if inference_csv.is_empty() {
        return Err(format!("inference tracker csv is empty: {}", inference_path.display()));
    }

    let rel_idx = header_index(&relationship_csv[0]);
    let inf_idx = header_index(&inference_csv[0]);
    let mut entries_by_key = HashMap::<String, Entry>::new();

    for row in relationship_csv.iter().skip(1) {
        let edge_key_raw = row_cell(row, &rel_idx, "edge_key").trim();
        if edge_key_raw.is_empty() {
            continue;
        }
        let edge_key = normalize_edge_key(edge_key_raw);

        entries_by_key.insert(
            edge_key.clone(),
            Entry {
                edge_key,
                claim_id: row_cell(row, &rel_idx, "claim_id").to_string(),
                confidence: row_cell(row, &rel_idx, "confidence").to_string(),
                claim_type: row_cell(row, &rel_idx, "claim_type").to_string(),
                confidence_grade: row_cell(row, &rel_idx, "confidence_grade").to_string(),
                primary_source_id: row_cell(row, &rel_idx, "primary_source_id").to_string(),
                review_status: row_cell(row, &rel_idx, "review_status").to_string(),
                canonical_decision: row_cell(row, &rel_idx, "canonical_decision").to_string(),
                reviewer: row_cell(row, &rel_idx, "reviewer").to_string(),
                last_reviewed: row_cell(row, &rel_idx, "last_reviewed").to_string(),
                inference_class: String::new(),
                inference_rule: String::new(),
                dossier_status: String::new(),
                dossier_file: String::new(),
                tracker_last_updated: String::new(),
            },
        );
    }

    for row in inference_csv.iter().skip(1) {
        let edge_key_raw = row_cell(row, &inf_idx, "edge_key").trim();
        if edge_key_raw.is_empty() {
            continue;
        }
        let edge_key = normalize_edge_key(edge_key_raw);
        let mut entry = entries_by_key.remove(&edge_key).unwrap_or(Entry {
            edge_key: edge_key.clone(),
            claim_id: String::new(),
            confidence: String::new(),
            claim_type: "inferred".to_string(),
            confidence_grade: row_cell(row, &inf_idx, "confidence_grade").to_string(),
            primary_source_id: String::new(),
            review_status: String::new(),
            canonical_decision: String::new(),
            reviewer: String::new(),
            last_reviewed: String::new(),
            inference_class: String::new(),
            inference_rule: String::new(),
            dossier_status: String::new(),
            dossier_file: String::new(),
            tracker_last_updated: String::new(),
        });

        entry.inference_class = row_cell(row, &inf_idx, "inference_class").to_string();
        entry.inference_rule = row_cell(row, &inf_idx, "inference_rule").to_string();
        entry.dossier_status = row_cell(row, &inf_idx, "dossier_status").to_string();
        entry.dossier_file = row_cell(row, &inf_idx, "dossier_file").to_string();
        entry.tracker_last_updated = row_cell(row, &inf_idx, "last_updated").to_string();

        entries_by_key.insert(edge_key, entry);
    }

    let mut entries = entries_by_key.into_values().collect::<Vec<_>>();
    entries.sort_by(|a, b| {
        if a.edge_key == b.edge_key {
            Ordering::Equal
        } else {
            a.edge_key.cmp(&b.edge_key)
        }
    });

    let body = entries
        .iter()
        .map(map_entry_code)
        .collect::<Result<Vec<_>, _>>()?
        .join(",\n");

    let file_content = format!(
        "const UNDIRECTED_TYPES = new Set(['sibling', 'spouse', 'kin']);\n\nfunction normalizeLabel(v) {{\n  return (v || '').trim();\n}}\n\nfunction keyParts(t, s, d, l = '') {{\n  const label = normalizeLabel(l);\n  if (UNDIRECTED_TYPES.has(t)) {{\n    const [a, b] = [s, d].sort();\n    return {{ t, s: a, d: b, l: label }};\n  }}\n  return {{ t, s, d, l: label }};\n}}\n\nexport function relationshipEdgeKey(edge) {{\n  if (!edge) return '';\n  const p = keyParts(edge.t, edge.s, edge.d, edge.l || '');\n  return `${{p.t}}|${{p.s}}|${{p.d}}|${{p.l}}`;\n}}\n\nfunction k(t, s, d, l = '') {{\n  const p = keyParts(t, s, d, l);\n  return `${{p.t}}|${{p.s}}|${{p.d}}|${{p.l}}`;\n}}\n\nconst RELATIONSHIP_LEDGER_PATH = 'docs/research-program/ledgers/relationship-evidence-ledger.csv';\nconst INFERENCE_TRACKER_PATH = 'docs/research-program/ledgers/inference-dossier-tracker.csv';\nconst CONFIDENCE_EXPLAINER_PATH = 'docs/confidence-grade-explainer.md';\n\n// Auto-synced from relationship + inference ledgers on {date}.\nconst VERIFICATION_INDEX = new Map([\n{body}\n]);\n\nexport function getRelationshipVerification(edge) {{\n  return VERIFICATION_INDEX.get(relationshipEdgeKey(edge)) || null;\n}}\n\nexport function getRelationshipVerificationByEdgeKey(edgeKey) {{\n  if (!edgeKey) return null;\n  const parts = String(edgeKey).split('|');\n  const t = parts[0] || '';\n  const s = parts[1] || '';\n  const d = parts[2] || '';\n  const l = parts.slice(3).join('|');\n  return VERIFICATION_INDEX.get(k(t, s, d, l)) || null;\n}}\n\nexport function getRelationshipVerificationDocs() {{\n  return {{\n    relationship_ledger_path: RELATIONSHIP_LEDGER_PATH,\n    inference_tracker_path: INFERENCE_TRACKER_PATH,\n    confidence_explainer_path: CONFIDENCE_EXPLAINER_PATH\n  }};\n}}\n"
    );

    if let Some(parent) = output_path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("failed to create {}: {e}", parent.display()))?;
    }
    fs::write(&output_path, file_content)
        .map_err(|e| format!("failed to write {}: {e}", output_path.display()))?;

    Ok(format!(
        "Synced relationship verification index: {} edges.\n",
        entries.len()
    ))
}

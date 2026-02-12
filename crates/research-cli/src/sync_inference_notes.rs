use crate::csv_utils::parse_csv;
use regex::Regex;
use serde_json::to_string as json_string;
use std::cmp::Ordering;
use std::collections::HashMap;
use std::fs;
use std::path::Path;
use std::sync::OnceLock;

fn today_iso() -> String {
    match std::process::Command::new("date")
        .args(["-u", "+%F"])
        .output()
    {
        Ok(out) if out.status.success() => String::from_utf8_lossy(&out.stdout).trim().to_string(),
        _ => "1970-01-01".to_string(),
    }
}

fn split_key(edge_key: &str) -> (String, String, String, String) {
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

fn between(text: &str, start_heading: &str, end_heading: &str) -> String {
    let Some(start) = text.find(start_heading) else {
        return String::new();
    };
    let from = start + start_heading.len();
    let tail = &text[from..];
    if let Some(end) = tail.find(end_heading) {
        tail[..end].trim().to_string()
    } else {
        tail.trim().to_string()
    }
}

fn pair_summary_regex() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| {
        Regex::new(r"(?m)^- Pair summary:\s*(.+)$").expect("valid pair summary regex")
    })
}

fn logic_line_regex() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| Regex::new(r"^\d+\.\s+").expect("valid logic prefix regex"))
}

fn extract_summary(dossier_text: &str) -> String {
    if let Some(caps) = pair_summary_regex().captures(dossier_text) {
        return caps
            .get(1)
            .map(|m| m.as_str().trim().to_string())
            .unwrap_or_else(|| {
                "Pair-specific inference rationale documented in dossier.".to_string()
            });
    }
    "Pair-specific inference rationale documented in dossier.".to_string()
}

fn extract_logic(dossier_text: &str) -> Vec<String> {
    let block = between(
        dossier_text,
        "## 3) Logic chain (pair-specific)",
        "## 4) Alternative interpretations",
    );

    let mut out = block
        .lines()
        .map(str::trim)
        .filter(|line| logic_line_regex().is_match(line))
        .map(|line| logic_line_regex().replace(line, "").to_string())
        .map(|line| line.trim_start_matches("- ").trim().to_string())
        .filter(|line| !line.is_empty())
        .collect::<Vec<_>>();

    if out.is_empty() {
        out.push("Pair-specific logic chain is recorded in the dossier.".to_string());
    }
    out
}

fn extract_verification(dossier_text: &str) -> Vec<String> {
    let block = between(
        dossier_text,
        "## 5) Verification checklist",
        "## 6) Source basis",
    );

    let mut out = block
        .lines()
        .map(str::trim)
        .filter(|line| line.starts_with("- "))
        .map(|line| line.trim_start_matches("- ").trim().to_string())
        .filter(|line| !line.is_empty())
        .collect::<Vec<_>>();

    if out.is_empty() {
        out.push("Use dossier verification checklist for upgrade/downgrade criteria.".to_string());
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

fn row_cell<'a>(row: &'a [String], idx: &HashMap<String, usize>, key: &str) -> &'a str {
    idx.get(key)
        .and_then(|i| row.get(*i))
        .map(String::as_str)
        .unwrap_or("")
}

#[derive(Clone)]
struct Entry {
    edge_key: String,
    dossier: String,
    summary: String,
    logic: Vec<String>,
    verification: Vec<String>,
}

fn js_string(value: &str) -> Result<String, String> {
    json_string(value).map_err(|e| format!("failed to encode js string: {e}"))
}

fn map_entry_code(item: &Entry) -> Result<String, String> {
    let (t, s, d, l) = split_key(&item.edge_key);
    let summary = js_string(&item.summary)?;
    let dossier = js_string(&item.dossier)?;
    let t_js = js_string(&t)?;
    let s_js = js_string(&s)?;
    let d_js = js_string(&d)?;
    let l_js = js_string(&l)?;

    let logic = item
        .logic
        .iter()
        .map(|v| js_string(v).map(|s| format!("      {s}")))
        .collect::<Result<Vec<_>, _>>()?
        .join(",\n");
    let verification = item
        .verification
        .iter()
        .map(|v| js_string(v).map(|s| format!("      {s}")))
        .collect::<Result<Vec<_>, _>>()?
        .join(",\n");

    Ok(format!(
        "  [k({t_js}, {s_js}, {d_js}, {l_js}), {{\n    summary: {summary},\n    dossier: {dossier},\n    logic: [\n{logic}\n    ],\n    verification: [\n{verification}\n    ]\n  }}]"
    ))
}

pub fn run(root_dir: &str, date_opt: Option<&str>) -> Result<String, String> {
    let date = date_opt.map(|v| v.to_string()).unwrap_or_else(today_iso);
    let root = Path::new(root_dir);
    let tracker_path = root
        .join("docs")
        .join("research-program")
        .join("ledgers")
        .join("inference-dossier-tracker.csv");
    let output_path = root.join("src").join("data").join("inference-notes.js");

    let tracker_raw = fs::read_to_string(&tracker_path)
        .map_err(|e| format!("failed to read {}: {e}", tracker_path.display()))?;
    let tracker_csv = parse_csv(&tracker_raw);
    if tracker_csv.is_empty() {
        return Err(format!("tracker csv is empty: {}", tracker_path.display()));
    }

    let idx = header_index(&tracker_csv[0]);
    let mut entries = Vec::<Entry>::new();

    for row in tracker_csv.iter().skip(1) {
        let edge_key = row_cell(row, &idx, "edge_key").trim().to_string();
        let dossier_rel_path = row_cell(row, &idx, "dossier_file").trim().to_string();
        if edge_key.is_empty() || dossier_rel_path.is_empty() {
            continue;
        }

        let dossier_path = root.join(&dossier_rel_path);
        let dossier_text = fs::read_to_string(&dossier_path)
            .map_err(|e| format!("failed to read {}: {e}", dossier_path.display()))?;

        entries.push(Entry {
            edge_key,
            dossier: dossier_rel_path,
            summary: extract_summary(&dossier_text),
            logic: extract_logic(&dossier_text),
            verification: extract_verification(&dossier_text),
        });
    }

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
        "const UNDIRECTED_TYPES = new Set(['sibling', 'spouse', 'kin']);\n\nfunction normalizeLabel(v) {{\n  return (v || '').trim();\n}}\n\nfunction keyParts(t, s, d, l = '') {{\n  const label = normalizeLabel(l);\n  if (UNDIRECTED_TYPES.has(t)) {{\n    const [a, b] = [s, d].sort();\n    return `${{t}}|${{a}}|${{b}}|${{label}}`;\n  }}\n  return `${{t}}|${{s}}|${{d}}|${{label}}`;\n}}\n\nexport function inferenceEdgeKey(edge) {{\n  if (!edge) return '';\n  return keyParts(edge.t, edge.s, edge.d, edge.l || '');\n}}\n\nfunction k(t, s, d, l = '') {{\n  return keyParts(t, s, d, l);\n}}\n\n// Auto-synced from inference dossiers on {date}.\nconst INFERENCE_NOTES = new Map([\n{body}\n]);\n\nexport function getInferenceNote(edge) {{\n  return INFERENCE_NOTES.get(inferenceEdgeKey(edge)) || null;\n}}\n\nexport function getCuratedInferenceNote(edge) {{\n  return getInferenceNote(edge);\n}}\n\nexport function getInferenceDossierPath(edge) {{\n  return getInferenceNote(edge)?.dossier || '';\n}}\n\nexport function isDerivedInferenceEdge(edge) {{\n  if (!edge) return false;\n  if (edge.c !== 'i') return false;\n  return (edge.evidence_refs || []).includes('SRC-DERIVED-RULES')\n    || String(edge.event_context || '').startsWith('derived:');\n}}\n"
    );

    if let Some(parent) = output_path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("failed to create {}: {e}", parent.display()))?;
    }
    fs::write(&output_path, file_content)
        .map_err(|e| format!("failed to write {}: {e}", output_path.display()))?;

    Ok(format!(
        "Synced inference notes from dossiers: {} entries.\n",
        entries.len()
    ))
}

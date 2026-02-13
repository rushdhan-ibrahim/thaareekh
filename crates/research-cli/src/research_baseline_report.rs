use crate::csv_utils::csv_escape;
use crate::source_models::SourceRecord;
use maldives_domain::{Dataset, Edge, Person};
use regex::Regex;
use serde::Deserialize;
use serde_json::Value;
use std::cmp::Ordering;
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::OnceLock;

#[derive(Debug, Deserialize)]
#[allow(non_snake_case)]
struct UiReference {
    #[serde(default)]
    officeCatalog: Vec<Value>,
    #[serde(default)]
    officeTimeline: Vec<Value>,
}

fn quality_key_regex() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| Regex::new(r"[^A-Za-z0-9]+").expect("valid quality regex"))
}

fn slug_regex() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| Regex::new(r"[^a-z0-9]+").expect("valid slug regex"))
}

fn today_iso() -> String {
    match std::process::Command::new("date")
        .args(["-u", "+%F"])
        .output()
    {
        Ok(out) if out.status.success() => String::from_utf8_lossy(&out.stdout).trim().to_string(),
        _ => "1970-01-01".to_string(),
    }
}

fn read_ui_reference(path: &str) -> Result<UiReference, String> {
    let raw = fs::read_to_string(path).map_err(|e| format!("failed to read {path}: {e}"))?;
    serde_json::from_str(&raw).map_err(|e| format!("failed to parse ui-reference json: {e}"))
}

fn quality_bucket(value: &str) -> String {
    let trimmed = value.trim();
    if trimmed.is_empty() {
        return "?".to_string();
    }
    quality_key_regex()
        .replace_all(trimmed, "")
        .to_string()
        .to_uppercase()
}

fn increment(map: &mut HashMap<String, usize>, key: &str) {
    let row = map.entry(key.to_string()).or_insert(0);
    *row += 1;
}

fn value_string(value: &Value) -> String {
    match value {
        Value::Null => String::new(),
        Value::String(v) => v.clone(),
        Value::Number(n) => n.to_string(),
        Value::Bool(v) => v.to_string(),
        Value::Array(items) => items.iter().map(value_string).collect::<Vec<_>>().join(","),
        Value::Object(_) => "[object Object]".to_string(),
    }
}

fn is_truthy(value: &Value) -> bool {
    match value {
        Value::Null => false,
        Value::Bool(v) => *v,
        Value::Number(n) => n.as_f64().unwrap_or(0.0) != 0.0,
        Value::String(s) => !s.is_empty(),
        Value::Array(_) | Value::Object(_) => true,
    }
}

fn js_or_string(value: Option<&Value>) -> String {
    let Some(v) = value else {
        return String::new();
    };
    if !is_truthy(v) {
        return String::new();
    }
    value_string(v)
}

fn array_len(person: &Person, key: &str) -> usize {
    person
        .extra
        .get(key)
        .and_then(Value::as_array)
        .map(Vec::len)
        .unwrap_or(0)
}

fn person_id_number(id: &str) -> u64 {
    let raw = id.strip_prefix('P').unwrap_or(id);
    raw.parse::<u64>().unwrap_or(u64::MAX)
}

fn normalized_endpoints(edge: &Edge) -> (String, String) {
    if matches!(edge.t.as_str(), "sibling" | "spouse" | "kin") {
        if edge.s <= edge.d {
            (edge.s.clone(), edge.d.clone())
        } else {
            (edge.d.clone(), edge.s.clone())
        }
    } else {
        (edge.s.clone(), edge.d.clone())
    }
}

fn stable_edge_key(edge: &Edge) -> String {
    let label = edge.l.trim();
    let (s, d) = normalized_endpoints(edge);
    format!("{}|{}|{}|{}", edge.t, s, d, label)
}

fn compare_edges_for_report(a: &Edge, b: &Edge) -> Ordering {
    let (a_s, a_d) = normalized_endpoints(a);
    let (b_s, b_d) = normalized_endpoints(b);
    let a_l = a.l.trim();
    let b_l = b.l.trim();

    a.t.cmp(&b.t)
        .then_with(|| a_s.cmp(&b_s))
        .then_with(|| a_d.cmp(&b_d))
        .then_with(|| a_l.cmp(b_l))
}

fn to_inference_slug(edge: &Edge) -> String {
    let base = stable_edge_key(edge).to_lowercase();
    let replaced = slug_regex().replace_all(&base, "-").to_string();
    let mut out = replaced.trim_matches('-').to_string();
    if out.len() > 140 {
        out.truncate(140);
    }
    out
}

fn csv_row(values: &[String]) -> String {
    values
        .iter()
        .map(|v| csv_escape(v))
        .collect::<Vec<_>>()
        .join(",")
}

fn write_csv(path: &Path, header: &[&str], rows: &[Vec<String>]) -> Result<(), String> {
    let mut out = String::new();
    out.push_str(
        &header
            .iter()
            .map(|h| csv_escape(h))
            .collect::<Vec<_>>()
            .join(","),
    );
    out.push('\n');
    for row in rows {
        out.push_str(&csv_row(row));
        out.push('\n');
    }
    fs::write(path, out).map_err(|e| format!("failed to write {}: {e}", path.display()))
}

fn baseline_markdown(
    date: &str,
    dataset: &Dataset,
    office_catalog_len: usize,
    office_timeline_len: usize,
    source_count: usize,
    confidence_counts: &HashMap<String, usize>,
    inferred_counts: &HashMap<String, usize>,
    people_coverage: &HashMap<String, usize>,
    source_quality_counts: &HashMap<String, usize>,
) -> String {
    let c = *confidence_counts.get("c").unwrap_or(&0);
    let i = *confidence_counts.get("i").unwrap_or(&0);
    let u = *confidence_counts.get("u").unwrap_or(&0);
    let inferred_curated = *inferred_counts.get("curated").unwrap_or(&0);
    let inferred_derived = *inferred_counts.get("derived").unwrap_or(&0);
    let inferred_total = *inferred_counts.get("total").unwrap_or(&0);
    let source_refs = *people_coverage.get("source_refs").unwrap_or(&0);
    let aliases = *people_coverage.get("aliases").unwrap_or(&0);
    let titles = *people_coverage.get("titles").unwrap_or(&0);
    let known_as = *people_coverage.get("known_as").unwrap_or(&0);
    let offices_held = *people_coverage.get("offices_held").unwrap_or(&0);
    let q_a = *source_quality_counts.get("A").unwrap_or(&0);
    let q_b = *source_quality_counts.get("B").unwrap_or(&0);
    let q_c = *source_quality_counts.get("C").unwrap_or(&0);
    let q_d = *source_quality_counts.get("D").unwrap_or(&0);

    format!(
        "# Research Baseline Metrics\n\nDate: {date}  \nMode: research\n\n## Dataset totals\n| Metric | Value |\n|---|---:|\n| People | {} |\n| Edges | {} |\n| Sources | {} |\n| Office catalog entries | {} |\n| Office timeline periods | {} |\n\n## Edge confidence split\n| Class | Count |\n|---|---:|\n| Confirmed (`c`) | {} |\n| Inferred (`i`) | {} |\n| Uncertain (`u`) | {} |\n\n## Inferred edge split\n| Inference type | Count |\n|---|---:|\n| Curated inferred | {} |\n| Rule-derived inferred | {} |\n| Total inferred | {} |\n\n## Person enrichment coverage\n| Coverage field | Populated |\n|---|---:|\n| `source_refs` | {}/{} |\n| `aliases` | {}/{} |\n| `titles` | {}/{} |\n| `known_as` | {}/{} |\n| `offices_held` | {}/{} |\n\n## Source quality distribution\n| Grade | Count |\n|---|---:|\n| A | {} |\n| B | {} |\n| C | {} |\n| D | {} |\n",
        dataset.people.len(),
        dataset.edges.len(),
        source_count,
        office_catalog_len,
        office_timeline_len,
        c,
        i,
        u,
        inferred_curated,
        inferred_derived,
        inferred_total,
        source_refs,
        dataset.people.len(),
        aliases,
        dataset.people.len(),
        titles,
        dataset.people.len(),
        known_as,
        dataset.people.len(),
        offices_held,
        dataset.people.len(),
        q_a,
        q_b,
        q_c,
        q_d
    )
}

fn write_ledgers(dataset: &Dataset, ledger_dir: &Path) -> Result<(usize, usize, usize), String> {
    let mut sorted_people = dataset.people.clone();
    sorted_people.sort_by(|a, b| person_id_number(&a.id).cmp(&person_id_number(&b.id)));

    let person_rows = sorted_people
        .iter()
        .map(|person| {
            vec![
                person.id.clone(),
                js_or_string(person.extra.get("n")),
                person.dy.clone(),
                js_or_string(person.extra.get("rg")),
                js_or_string(person.extra.get("person_confidence")),
                array_len(person, "source_refs").to_string(),
                array_len(person, "aliases").to_string(),
                array_len(person, "titles").to_string(),
                "todo".to_string(),
                format!("docs/research-program/people/{}.md", person.id),
                String::new(),
                String::new(),
            ]
        })
        .collect::<Vec<_>>();
    write_csv(
        &ledger_dir.join("person-coverage.csv"),
        &[
            "person_id",
            "display_name",
            "dynasty",
            "reign_or_role",
            "person_confidence",
            "source_refs_count",
            "aliases_count",
            "titles_count",
            "dossier_status",
            "dossier_file",
            "last_updated",
            "notes",
        ],
        &person_rows,
    )?;

    let mut sorted_edges = dataset.edges.clone();
    sorted_edges.sort_by(compare_edges_for_report);

    let edge_rows = sorted_edges
        .iter()
        .enumerate()
        .map(|(idx, edge)| {
            let refs = edge.evidence_refs.join("|");
            let primary = edge
                .evidence_refs
                .first()
                .map(String::as_str)
                .unwrap_or("")
                .to_string();
            let (s, d) = normalized_endpoints(edge);
            vec![
                format!("CLM-{:04}", idx + 1),
                stable_edge_key(edge),
                edge.t.clone(),
                s,
                d,
                edge.l.clone(),
                edge.c.clone(),
                edge.claim_type.clone(),
                edge.confidence_grade.clone(),
                refs,
                primary,
                String::new(),
                String::new(),
                String::new(),
                "todo".to_string(),
                "pending".to_string(),
                String::new(),
                String::new(),
                String::new(),
            ]
        })
        .collect::<Vec<_>>();
    write_csv(
        &ledger_dir.join("relationship-evidence-ledger.csv"),
        &[
            "claim_id",
            "edge_key",
            "relation_type",
            "source_id",
            "target_id",
            "label",
            "confidence",
            "claim_type",
            "confidence_grade",
            "evidence_refs",
            "primary_source_id",
            "claim_excerpt",
            "citation_locator",
            "access_date",
            "review_status",
            "canonical_decision",
            "reviewer",
            "last_reviewed",
            "notes",
        ],
        &edge_rows,
    )?;

    let inferred = sorted_edges
        .iter()
        .filter(|edge| edge.c == "i")
        .collect::<Vec<_>>();
    let inferred_rows = inferred
        .iter()
        .map(|edge| {
            let refs = edge.evidence_refs.join("|");
            let class = if edge.evidence_refs.iter().any(|v| v == "SRC-DERIVED-RULES") {
                "rule-derived"
            } else {
                "curated"
            };
            let (s, d) = normalized_endpoints(edge);
            vec![
                stable_edge_key(edge),
                edge.t.clone(),
                s,
                d,
                edge.l.clone(),
                class.to_string(),
                edge.inference_rule.clone(),
                edge.confidence_grade.clone(),
                refs,
                "todo".to_string(),
                format!(
                    "docs/research-program/inferences/{}.md",
                    to_inference_slug(edge)
                ),
                String::new(),
                String::new(),
            ]
        })
        .collect::<Vec<_>>();
    write_csv(
        &ledger_dir.join("inference-dossier-tracker.csv"),
        &[
            "edge_key",
            "relation_type",
            "source_id",
            "target_id",
            "label",
            "inference_class",
            "inference_rule",
            "confidence_grade",
            "evidence_refs",
            "dossier_status",
            "dossier_file",
            "last_updated",
            "notes",
        ],
        &inferred_rows,
    )?;

    Ok((person_rows.len(), edge_rows.len(), inferred_rows.len()))
}

pub fn run(
    dataset: &Dataset,
    sources: &[SourceRecord],
    ui_reference_path: &str,
    root_dir: &str,
    date_opt: Option<&str>,
    write_ledgers_flag: bool,
) -> Result<String, String> {
    let date = date_opt.map(ToString::to_string).unwrap_or_else(today_iso);
    let ui = read_ui_reference(ui_reference_path)?;

    let mut confidence_counts = HashMap::<String, usize>::new();
    let mut inferred_counts = HashMap::<String, usize>::new();
    for edge in &dataset.edges {
        increment(&mut confidence_counts, &edge.c);
        if edge.c != "i" {
            continue;
        }
        increment(&mut inferred_counts, "total");
        if edge.evidence_refs.iter().any(|v| v == "SRC-DERIVED-RULES") {
            increment(&mut inferred_counts, "derived");
        } else {
            increment(&mut inferred_counts, "curated");
        }
    }

    let mut people_coverage = HashMap::<String, usize>::new();
    for person in &dataset.people {
        if array_len(person, "source_refs") > 0 {
            increment(&mut people_coverage, "source_refs");
        }
        if array_len(person, "aliases") > 0 {
            increment(&mut people_coverage, "aliases");
        }
        if array_len(person, "titles") > 0 {
            increment(&mut people_coverage, "titles");
        }
        if array_len(person, "known_as") > 0 {
            increment(&mut people_coverage, "known_as");
        }
        if array_len(person, "offices_held") > 0 {
            increment(&mut people_coverage, "offices_held");
        }
    }

    let mut source_quality_counts = HashMap::<String, usize>::new();
    for source in sources {
        increment(&mut source_quality_counts, &quality_bucket(&source.quality));
    }

    let research_dir = Path::new(root_dir).join("docs").join("research-program");
    let ledger_dir = research_dir.join("ledgers");
    fs::create_dir_all(&ledger_dir)
        .map_err(|e| format!("failed to create {}: {e}", ledger_dir.display()))?;

    let baseline_path = research_dir.join(format!("baseline-metrics-{date}.md"));
    let latest_path = research_dir.join("baseline-metrics-latest.md");

    let baseline = baseline_markdown(
        &date,
        dataset,
        ui.officeCatalog.len(),
        ui.officeTimeline.len(),
        sources.len(),
        &confidence_counts,
        &inferred_counts,
        &people_coverage,
        &source_quality_counts,
    );
    fs::write(&baseline_path, &baseline)
        .map_err(|e| format!("failed to write {}: {e}", baseline_path.display()))?;
    fs::write(&latest_path, &baseline)
        .map_err(|e| format!("failed to write {}: {e}", latest_path.display()))?;

    let mut out = String::new();
    out.push_str(&format!("Wrote baseline artifacts for {date}:\n"));
    out.push_str(&format!("- {}\n", baseline_path.display()));
    out.push_str(&format!("- {}\n", latest_path.display()));

    if !write_ledgers_flag {
        out.push_str("- Ledger regeneration skipped (safe default).\n");
        out.push_str("- Pass `--write-ledgers` to regenerate person/relationship/inference CSV ledgers from dataset.\n");
        return Ok(out);
    }

    let (person_count, edge_count, inferred_count) = write_ledgers(dataset, &ledger_dir)?;
    let person_path: PathBuf = ledger_dir.join("person-coverage.csv");
    let edge_path: PathBuf = ledger_dir.join("relationship-evidence-ledger.csv");
    let inferred_path: PathBuf = ledger_dir.join("inference-dossier-tracker.csv");
    out.push_str(&format!(
        "- {} ({} rows)\n",
        person_path.display(),
        person_count
    ));
    out.push_str(&format!(
        "- {} ({} rows)\n",
        edge_path.display(),
        edge_count
    ));
    out.push_str(&format!(
        "- {} ({} rows)\n",
        inferred_path.display(),
        inferred_count
    ));
    Ok(out)
}

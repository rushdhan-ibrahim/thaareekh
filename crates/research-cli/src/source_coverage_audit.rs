use crate::source_models::SourceRecord;
use indexmap::IndexMap;
use maldives_domain::{Dataset, Person};
use serde_json::Value;
use std::collections::HashMap;
use std::fs;
use std::path::Path;
use url::Url;

#[derive(Clone)]
struct DynastyCoverageRow {
    dynasty: String,
    total: usize,
    with_source: usize,
    with_alias: usize,
    with_titles: usize,
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

fn refs_from_value(value: Option<&Value>) -> Vec<String> {
    match value {
        Some(Value::Array(arr)) => arr
            .iter()
            .filter_map(|v| v.as_str().map(|s| s.to_string()))
            .filter(|s| !s.trim().is_empty())
            .collect(),
        Some(Value::String(s)) => s
            .split('|')
            .map(str::trim)
            .filter(|s| !s.is_empty())
            .map(ToString::to_string)
            .collect(),
        _ => Vec::new(),
    }
}

fn person_refs(person: &Person) -> Vec<String> {
    refs_from_value(person.extra.get("source_refs"))
}

fn person_field_count(person: &Person, key: &str) -> usize {
    match person.extra.get(key) {
        Some(Value::Array(arr)) => arr
            .iter()
            .filter_map(|v| v.as_str())
            .filter(|s| !s.trim().is_empty())
            .count(),
        Some(Value::String(s)) => {
            if s.trim().is_empty() {
                0
            } else {
                1
            }
        }
        _ => 0,
    }
}

fn domain_from_url(url: &str) -> String {
    if let Ok(parsed) = Url::parse(url) {
        if let Some(host) = parsed.host_str() {
            if let Some(stripped) = host.strip_prefix("www.") {
                return stripped.to_string();
            }
            if !host.is_empty() {
                return host.to_string();
            }
        }
    }

    let raw = url.trim();
    if raw.is_empty() {
        return "unknown".to_string();
    }

    let no_scheme = raw
        .strip_prefix("https://")
        .or_else(|| raw.strip_prefix("http://"))
        .unwrap_or(raw);
    let domain = no_scheme.split('/').next().unwrap_or("unknown");
    if domain.is_empty() {
        "unknown".to_string()
    } else {
        domain.to_string()
    }
}

fn fmt_pct(value: f64) -> String {
    format!("{:.1}%", value * 100.0)
}

fn table(headers: &[&str], rows: &[Vec<String>]) -> String {
    let head = format!("| {} |", headers.join(" | "));
    let sep = format!(
        "|{}|",
        headers.iter().map(|_| "---").collect::<Vec<_>>().join("|")
    );
    let body = rows
        .iter()
        .map(|r| format!("| {} |", r.join(" | ")))
        .collect::<Vec<_>>()
        .join("\n");
    format!("{head}\n{sep}\n{body}")
}

fn sorted_entries_desc(map: &IndexMap<String, usize>) -> Vec<(String, usize)> {
    let mut rows = map
        .iter()
        .map(|(k, v)| (k.clone(), *v))
        .collect::<Vec<(String, usize)>>();
    rows.sort_by(|a, b| b.1.cmp(&a.1));
    rows
}

fn source_label(id: &str, source_by_id: &HashMap<String, SourceRecord>) -> String {
    if let Some(s) = source_by_id.get(id) {
        format!("{} ({}, {})", id, s.quality, domain_from_url(&s.url))
    } else {
        id.to_string()
    }
}

pub fn run(
    dataset: &Dataset,
    sources: &[SourceRecord],
    research_dir: &str,
    date_opt: Option<&str>,
) -> Result<String, String> {
    let date = date_opt.map(|s| s.to_string()).unwrap_or_else(today_iso);

    let source_by_id = sources
        .iter()
        .map(|s| (s.id.clone(), s.clone()))
        .collect::<HashMap<_, _>>();

    let mut edge_source_use = IndexMap::<String, usize>::new();
    let mut person_source_use = IndexMap::<String, usize>::new();
    let mut edges_no_refs = 0usize;
    let mut single_source_edges = 0usize;
    let mut multi_source_edges = 0usize;
    let mut single_weak_edges = 0usize;

    for edge in &dataset.edges {
        let refs = &edge.evidence_refs;
        if refs.is_empty() {
            edges_no_refs += 1;
        }

        if refs.len() <= 1 {
            single_source_edges += 1;
            let q = refs
                .first()
                .and_then(|id| source_by_id.get(id))
                .map(|s| {
                    if s.quality.is_empty() {
                        "?"
                    } else {
                        s.quality.as_str()
                    }
                })
                .unwrap_or("?");
            if q == "C" || q == "D" || q == "?" {
                single_weak_edges += 1;
            }
        } else {
            multi_source_edges += 1;
        }

        for id in refs {
            let entry = edge_source_use.entry(id.clone()).or_insert(0);
            *entry += 1;
        }
    }

    for person in &dataset.people {
        for id in person_refs(person) {
            let entry = person_source_use.entry(id).or_insert(0);
            *entry += 1;
        }
    }

    let mut edge_use_by_quality = HashMap::<String, usize>::new();
    for (id, n) in &edge_source_use {
        let q = source_by_id
            .get(id)
            .map(|s| {
                if s.quality.is_empty() {
                    "?"
                } else {
                    s.quality.as_str()
                }
            })
            .unwrap_or("?")
            .to_string();
        let entry = edge_use_by_quality.entry(q).or_insert(0);
        *entry += *n;
    }

    let mut person_use_by_quality = HashMap::<String, usize>::new();
    for (id, n) in &person_source_use {
        let q = source_by_id
            .get(id)
            .map(|s| {
                if s.quality.is_empty() {
                    "?"
                } else {
                    s.quality.as_str()
                }
            })
            .unwrap_or("?")
            .to_string();
        let entry = person_use_by_quality.entry(q).or_insert(0);
        *entry += *n;
    }

    let mut dynasty_coverage = IndexMap::<String, DynastyCoverageRow>::new();

    for person in &dataset.people {
        let dynasty = if person.dy.trim().is_empty() {
            "Unknown".to_string()
        } else {
            person.dy.clone()
        };

        if !dynasty_coverage.contains_key(&dynasty) {
            dynasty_coverage.insert(
                dynasty.clone(),
                DynastyCoverageRow {
                    dynasty: dynasty.clone(),
                    total: 0,
                    with_source: 0,
                    with_alias: 0,
                    with_titles: 0,
                },
            );
        }

        let row = dynasty_coverage
            .get_mut(&dynasty)
            .expect("dynasty coverage row exists");
        row.total += 1;
        if !person_refs(person).is_empty() {
            row.with_source += 1;
        }
        if person_field_count(person, "aliases") > 0 {
            row.with_alias += 1;
        }
        if person_field_count(person, "titles") > 0 {
            row.with_titles += 1;
        }
    }

    let mut source_domains = IndexMap::<String, usize>::new();
    for src in sources {
        let domain = domain_from_url(&src.url);
        let entry = source_domains.entry(domain).or_insert(0);
        *entry += 1;
    }

    let mut source_quality_dist = IndexMap::<String, usize>::new();
    for src in sources {
        let quality = if src.quality.trim().is_empty() {
            "?".to_string()
        } else {
            src.quality.clone()
        };
        let entry = source_quality_dist.entry(quality).or_insert(0);
        *entry += 1;
    }

    let top_edge_sources = sorted_entries_desc(&edge_source_use)
        .into_iter()
        .take(12)
        .collect::<Vec<_>>();
    let top_person_sources = sorted_entries_desc(&person_source_use)
        .into_iter()
        .take(12)
        .collect::<Vec<_>>();
    let top_domains = sorted_entries_desc(&source_domains)
        .into_iter()
        .take(12)
        .collect::<Vec<_>>();

    let mut dyn_rows = dynasty_coverage.values().cloned().collect::<Vec<_>>();
    dyn_rows.sort_by(|a, b| {
        let a_missing = a.total.saturating_sub(a.with_source);
        let b_missing = b.total.saturating_sub(b.with_source);
        b_missing.cmp(&a_missing).then(b.total.cmp(&a.total))
    });

    let snapshot_table = table(
        &["Metric", "Value"],
        &[
            vec!["People".to_string(), dataset.people.len().to_string()],
            vec!["Edges".to_string(), dataset.edges.len().to_string()],
            vec!["Registered sources".to_string(), sources.len().to_string()],
            vec![
                "Edges with no evidence refs".to_string(),
                edges_no_refs.to_string(),
            ],
            vec![
                "Single-source edges".to_string(),
                single_source_edges.to_string(),
            ],
            vec![
                "Multi-source edges".to_string(),
                multi_source_edges.to_string(),
            ],
            vec![
                "Single-source weak-quality edges (C/D/?)".to_string(),
                single_weak_edges.to_string(),
            ],
        ],
    );

    let source_quality_table = table(
        &["Quality", "Count"],
        &["A", "B", "C", "D", "?"]
            .iter()
            .map(|q| {
                vec![
                    q.to_string(),
                    source_quality_dist
                        .get(*q)
                        .copied()
                        .unwrap_or(0)
                        .to_string(),
                ]
            })
            .collect::<Vec<_>>(),
    );

    let edge_total_quality_refs = {
        let n = edge_use_by_quality.values().sum::<usize>();
        if n == 0 { 1 } else { n }
    };
    let edge_quality_table = table(
        &["Quality", "Claim references", "Share"],
        &["A", "B", "C", "D", "?"]
            .iter()
            .map(|q| {
                let n = edge_use_by_quality.get(*q).copied().unwrap_or(0);
                vec![
                    q.to_string(),
                    n.to_string(),
                    fmt_pct((n as f64) / (edge_total_quality_refs as f64)),
                ]
            })
            .collect::<Vec<_>>(),
    );

    let person_total_quality_refs = {
        let n = person_use_by_quality.values().sum::<usize>();
        if n == 0 { 1 } else { n }
    };
    let person_quality_table = table(
        &["Quality", "Person-source refs", "Share"],
        &["A", "B", "C", "D", "?"]
            .iter()
            .map(|q| {
                let n = person_use_by_quality.get(*q).copied().unwrap_or(0);
                vec![
                    q.to_string(),
                    n.to_string(),
                    fmt_pct((n as f64) / (person_total_quality_refs as f64)),
                ]
            })
            .collect::<Vec<_>>(),
    );

    let top_edge_table = table(
        &["Source", "Edge claim refs"],
        &top_edge_sources
            .iter()
            .map(|(id, n)| vec![source_label(id, &source_by_id), n.to_string()])
            .collect::<Vec<_>>(),
    );

    let top_person_table = table(
        &["Source", "Person refs"],
        &top_person_sources
            .iter()
            .map(|(id, n)| vec![source_label(id, &source_by_id), n.to_string()])
            .collect::<Vec<_>>(),
    );

    let domain_table = table(
        &["Domain", "Sources", "Share"],
        &top_domains
            .iter()
            .map(|(domain, n)| {
                vec![
                    domain.clone(),
                    n.to_string(),
                    fmt_pct((*n as f64) / (sources.len() as f64)),
                ]
            })
            .collect::<Vec<_>>(),
    );

    let dyn_table = table(
        &[
            "Dynasty",
            "People",
            "With source_refs",
            "Missing source_refs",
            "With aliases",
            "With titles",
        ],
        &dyn_rows
            .iter()
            .map(|r| {
                vec![
                    r.dynasty.clone(),
                    r.total.to_string(),
                    r.with_source.to_string(),
                    r.total.saturating_sub(r.with_source).to_string(),
                    r.with_alias.to_string(),
                    r.with_titles.to_string(),
                ]
            })
            .collect::<Vec<_>>(),
    );

    let md = format!(
        "# Source Coverage Audit\n\nDate: {}  \nMode: research\n\n## Snapshot\n{}\n\n## Source quality distribution (registry)\n{}\n\n## Edge evidence usage by source quality\n{}\n\n## Person source usage by source quality\n{}\n\n## Top edge evidence sources\n{}\n\n## Top person-profile sources\n{}\n\n## Domain concentration (source registry)\n{}\n\n## Dynasty-level person coverage gaps\n{}\n\n## Immediate risk flags\n- High concentration in rule-derived evidence and a small set of specialist secondary sources.\n- Early dynasties (especially Lunar and Hilaaly) still have large source coverage gaps at person level.\n- Most edge claims are still single-source; corroboration is the priority for high-visibility bridges.\n",
        date,
        snapshot_table,
        source_quality_table,
        edge_quality_table,
        person_quality_table,
        top_edge_table,
        top_person_table,
        domain_table,
        dyn_table,
    );

    let research_dir_path = Path::new(research_dir);
    fs::create_dir_all(research_dir_path)
        .map_err(|e| format!("failed to create {}: {e}", research_dir_path.display()))?;

    let dated_path = research_dir_path.join(format!("source-coverage-audit-{}.md", date));
    let latest_path = research_dir_path.join("source-coverage-audit-latest.md");

    fs::write(&dated_path, &md)
        .map_err(|e| format!("failed to write {}: {e}", dated_path.display()))?;
    fs::write(&latest_path, &md)
        .map_err(|e| format!("failed to write {}: {e}", latest_path.display()))?;

    Ok(format!(
        "Wrote source coverage audit:\n- {}\n- {}\n",
        dated_path.display(),
        latest_path.display()
    ))
}

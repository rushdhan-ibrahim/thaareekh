use crate::source_models::SourceRecord;
use maldives_domain::{Dataset, Person};
use serde::Serialize;
use serde_json::Value;
use std::collections::{BTreeMap, HashMap, HashSet};

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Totals {
    people: usize,
    edges: usize,
    sourced_edges: usize,
    graded_edges: usize,
    by_confidence_class: BTreeMap<String, usize>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Issues {
    unknown_edge_source_refs: usize,
    unknown_person_source_refs: usize,
    missing_evidence_or_grade: usize,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct MissingSample {
    idx: usize,
    t: String,
    s: String,
    d: String,
    l: String,
    c: String,
    source_dynasty: String,
    target_dynasty: String,
    inter_dynasty: bool,
    missing_refs: bool,
    missing_grade: bool,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Payload {
    mode: String,
    totals: Totals,
    issues: Issues,
    sample_missing: Vec<MissingSample>,
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

fn person_source_refs(person: &Person) -> Vec<String> {
    refs_from_value(person.extra.get("source_refs"))
}

pub fn run(
    dataset: &Dataset,
    sources: &[SourceRecord],
    mode: &str,
    limit: usize,
    only_inter_dynasty: bool,
    json_output: bool,
) -> Result<String, String> {
    let source_ids = sources
        .iter()
        .map(|s| s.id.clone())
        .collect::<HashSet<String>>();

    let by_id = dataset
        .people
        .iter()
        .map(|p| (p.id.clone(), p))
        .collect::<HashMap<_, _>>();

    let mut unknown_edge_source_refs = 0usize;
    let mut unknown_person_source_refs = 0usize;
    let mut missing_samples = Vec::<MissingSample>::new();

    for (idx, edge) in dataset.edges.iter().enumerate() {
        for r in &edge.evidence_refs {
            if !source_ids.contains(r) {
                unknown_edge_source_refs += 1;
            }
        }

        let refs = &edge.evidence_refs;
        let source_dynasty = by_id
            .get(&edge.s)
            .map(|p| {
                if p.dy.is_empty() {
                    "Unknown".to_string()
                } else {
                    p.dy.clone()
                }
            })
            .unwrap_or_else(|| "Unknown".to_string());
        let target_dynasty = by_id
            .get(&edge.d)
            .map(|p| {
                if p.dy.is_empty() {
                    "Unknown".to_string()
                } else {
                    p.dy.clone()
                }
            })
            .unwrap_or_else(|| "Unknown".to_string());

        let inter_dynasty = source_dynasty != target_dynasty;
        let missing_refs = refs.is_empty();
        let missing_grade = edge.confidence_grade.trim().is_empty();

        if missing_refs || missing_grade {
            if !only_inter_dynasty || inter_dynasty {
                missing_samples.push(MissingSample {
                    idx,
                    t: edge.t.clone(),
                    s: edge.s.clone(),
                    d: edge.d.clone(),
                    l: edge.l.clone(),
                    c: edge.c.clone(),
                    source_dynasty,
                    target_dynasty,
                    inter_dynasty,
                    missing_refs,
                    missing_grade,
                });
            }
        }
    }

    for person in &dataset.people {
        for r in person_source_refs(person) {
            if !source_ids.contains(&r) {
                unknown_person_source_refs += 1;
            }
        }
    }

    let sourced_edges = dataset
        .edges
        .iter()
        .filter(|e| !e.evidence_refs.is_empty())
        .count();
    let graded_edges = dataset
        .edges
        .iter()
        .filter(|e| !e.confidence_grade.trim().is_empty())
        .count();

    let mut by_confidence_class = BTreeMap::<String, usize>::new();
    by_confidence_class.insert("c".to_string(), 0);
    by_confidence_class.insert("i".to_string(), 0);
    by_confidence_class.insert("u".to_string(), 0);
    for edge in &dataset.edges {
        let key = edge.c.clone();
        let entry = by_confidence_class.entry(key).or_insert(0);
        *entry += 1;
    }

    let payload = Payload {
        mode: mode.to_string(),
        totals: Totals {
            people: dataset.people.len(),
            edges: dataset.edges.len(),
            sourced_edges,
            graded_edges,
            by_confidence_class,
        },
        issues: Issues {
            unknown_edge_source_refs,
            unknown_person_source_refs,
            missing_evidence_or_grade: missing_samples.len(),
        },
        sample_missing: missing_samples.into_iter().take(limit).collect(),
    };

    if json_output {
        return serde_json::to_string_pretty(&payload)
            .map(|s| format!("{s}\n"))
            .map_err(|e| format!("failed to encode audit-evidence json: {e}"));
    }

    let mut out = String::new();
    out.push_str(&format!("Mode: {}\n", payload.mode));
    out.push_str(&format!("People: {}\n", payload.totals.people));
    out.push_str(&format!("Edges: {}\n", payload.totals.edges));
    out.push_str(&format!(
        "Sourced edges: {}\n",
        payload.totals.sourced_edges
    ));
    out.push_str(&format!("Graded edges: {}\n", payload.totals.graded_edges));
    out.push_str(&format!(
        "Confidence split: c={} i={} u={}\n",
        payload
            .totals
            .by_confidence_class
            .get("c")
            .copied()
            .unwrap_or(0),
        payload
            .totals
            .by_confidence_class
            .get("i")
            .copied()
            .unwrap_or(0),
        payload
            .totals
            .by_confidence_class
            .get("u")
            .copied()
            .unwrap_or(0)
    ));
    out.push_str(&format!(
        "Unknown edge source refs: {}\n",
        payload.issues.unknown_edge_source_refs
    ));
    out.push_str(&format!(
        "Unknown person source refs: {}\n",
        payload.issues.unknown_person_source_refs
    ));
    out.push_str(&format!(
        "Missing evidence or grade: {}\n",
        payload.issues.missing_evidence_or_grade
    ));
    if only_inter_dynasty {
        out.push_str("Filter: inter-dynasty only\n");
    }
    if !payload.sample_missing.is_empty() {
        out.push_str("\nSample missing rows:\n");
        for r in &payload.sample_missing {
            let mut line = format!(
                "#{} {} {}->{} [{} -> {}] c={}",
                r.idx, r.t, r.s, r.d, r.source_dynasty, r.target_dynasty, r.c
            );
            if r.missing_refs {
                line.push_str(" missing_refs");
            }
            if r.missing_grade {
                line.push_str(" missing_grade");
            }
            if !r.l.trim().is_empty() {
                line.push_str(&format!(" label=\"{}\"", r.l));
            }
            out.push_str(&line);
            out.push('\n');
        }
    }

    Ok(out)
}

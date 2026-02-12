use crate::csv_utils::{csv_escape, parse_csv};
use crate::source_models::SourceRecord;
use indexmap::IndexMap;
use maldives_domain::{Dataset, Edge, Person};
use serde_json::Value;
use std::collections::{BTreeMap, HashMap, HashSet};
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
        if i < row.len() {
            row[i] = value;
        }
    }
}

fn value_to_string(value: Option<&Value>) -> String {
    match value {
        Some(Value::String(s)) => s.to_string(),
        Some(Value::Number(n)) => n.to_string(),
        Some(Value::Bool(b)) => b.to_string(),
        _ => String::new(),
    }
}

fn value_to_vec_strings(value: Option<&Value>) -> Vec<String> {
    match value {
        Some(Value::Array(arr)) => arr
            .iter()
            .filter_map(|v| match v {
                Value::String(s) => Some(s.to_string()),
                Value::Number(n) => Some(n.to_string()),
                Value::Bool(b) => Some(b.to_string()),
                _ => None,
            })
            .collect::<Vec<_>>(),
        Some(Value::String(s)) if !s.trim().is_empty() => vec![s.to_string()],
        _ => Vec::new(),
    }
}

fn person_string(person: &Person, key: &str) -> String {
    value_to_string(person.extra.get(key))
}

fn person_vec_strings(person: &Person, key: &str) -> Vec<String> {
    value_to_vec_strings(person.extra.get(key))
}

fn source_refs_for_person(person: &Person) -> Vec<String> {
    match person.extra.get("source_refs") {
        Some(Value::Array(arr)) => arr
            .iter()
            .filter_map(|v| v.as_str().map(|s| s.trim().to_string()))
            .filter(|s| !s.is_empty())
            .collect::<Vec<_>>(),
        Some(Value::String(s)) => s
            .split('|')
            .map(str::trim)
            .filter(|s| !s.is_empty())
            .map(ToString::to_string)
            .collect::<Vec<_>>(),
        _ => Vec::new(),
    }
}

fn known_as_names(person: &Person) -> Vec<String> {
    match person.extra.get("known_as") {
        Some(Value::Array(arr)) => arr
            .iter()
            .filter_map(|v| match v {
                Value::String(s) => Some(s.to_string()),
                Value::Object(obj) => obj
                    .get("name")
                    .and_then(Value::as_str)
                    .map(ToString::to_string),
                _ => None,
            })
            .collect::<Vec<_>>(),
        _ => Vec::new(),
    }
}

#[derive(Clone)]
struct OfficeHeld {
    office_id: String,
    label: String,
    start: String,
    end: String,
}

fn offices_held(person: &Person) -> Vec<OfficeHeld> {
    match person.extra.get("offices_held") {
        Some(Value::Array(arr)) => arr
            .iter()
            .filter_map(|v| {
                let Value::Object(obj) = v else {
                    return None;
                };
                Some(OfficeHeld {
                    office_id: value_to_string(obj.get("office_id")),
                    label: value_to_string(obj.get("label")),
                    start: value_to_string(obj.get("start")),
                    end: value_to_string(obj.get("end")),
                })
            })
            .collect::<Vec<_>>(),
        _ => Vec::new(),
    }
}

fn reign_ranges(person: &Person) -> Vec<(String, String)> {
    let Some(Value::Array(arr)) = person.extra.get("re") else {
        return Vec::new();
    };
    arr.iter()
        .filter_map(|v| {
            let Value::Array(pair) = v else {
                return None;
            };
            if pair.len() < 2 {
                return None;
            }
            let a = value_to_string(pair.first());
            let b = value_to_string(pair.get(1));
            if a.is_empty() || b.is_empty() {
                return None;
            }
            Some((a, b))
        })
        .collect::<Vec<_>>()
}

fn unique(values: Vec<String>) -> Vec<String> {
    let mut seen = HashSet::<String>::new();
    let mut out = Vec::<String>::new();
    for v in values {
        if v.is_empty() {
            continue;
        }
        if seen.insert(v.clone()) {
            out.push(v);
        }
    }
    out
}

fn format_date_range(reign_ranges: &[(String, String)]) -> String {
    if reign_ranges.is_empty() {
        return "Unknown".to_string();
    }
    reign_ranges
        .iter()
        .map(|(a, b)| format!("{a}-{b}"))
        .collect::<Vec<_>>()
        .join("; ")
}

fn format_list(items: &[String]) -> String {
    if items.is_empty() {
        return "- no modeled entries yet".to_string();
    }
    items
        .iter()
        .map(|v| format!("- {v}"))
        .collect::<Vec<_>>()
        .join("\n")
}

fn person_label(by_id: &HashMap<String, &Person>, id: &str) -> String {
    let Some(person) = by_id.get(id) else {
        return id.to_string();
    };
    let name = if person.nm.is_empty() {
        "(unnamed)".to_string()
    } else {
        person.nm.clone()
    };
    let rg = person_string(person, "rg");
    let reg = if rg.is_empty() {
        String::new()
    } else {
        format!(" ({rg})")
    };
    format!("{id} {name}{reg}")
}

fn relation_text(edge: &Edge, by_id: &HashMap<String, &Person>) -> String {
    let source = person_label(by_id, &edge.s);
    let target = person_label(by_id, &edge.d);
    let label = if edge.l.trim().is_empty() {
        String::new()
    } else {
        format!(" [{}]", edge.l)
    };
    let connector = if edge.t == "parent" { "->" } else { "<->" };
    format!(
        "{t} {source} {connector} {target}{label} ({c})",
        t = edge.t,
        c = edge.c
    )
}

fn edge_key(edge: &Edge) -> String {
    format!("{}|{}|{}|{}", edge.t, edge.s, edge.d, edge.l)
}

fn reverse_edge_key(edge: &Edge) -> String {
    format!("{}|{}|{}|{}", edge.t, edge.d, edge.s, edge.l)
}

fn short_text(text: &str, max: usize) -> String {
    let clean = text.split_whitespace().collect::<Vec<_>>().join(" ");
    if clean.is_empty() {
        return String::new();
    }
    if clean.chars().count() <= max {
        return clean;
    }
    let take = max.saturating_sub(3);
    let head = clean.chars().take(take).collect::<String>();
    format!("{head}...")
}

fn grade_rank(grade: &str) -> u8 {
    match grade {
        "A" => 1,
        "B" => 2,
        "C" => 3,
        "D" => 4,
        _ => 9,
    }
}

fn source_concentration(rel_edges: &[&Edge]) -> (Vec<(String, usize)>, usize) {
    let mut counts = IndexMap::<String, usize>::new();
    for edge in rel_edges {
        for source_id in &edge.evidence_refs {
            let e = counts.entry(source_id.clone()).or_insert(0);
            *e += 1;
        }
    }
    let mut ranked = counts.into_iter().collect::<Vec<_>>();
    ranked.sort_by(|a, b| b.1.cmp(&a.1));
    let total = ranked.iter().map(|(_, n)| *n).sum::<usize>();
    (ranked, total)
}

#[derive(Clone)]
struct ClaimRow {
    claim_id: String,
    claim_excerpt: String,
    citation_locator: String,
    primary_source_id: String,
    review_status: String,
    canonical_decision: String,
}

fn claim_anchor_text(
    claim: &ClaimRow,
    edge: &Edge,
    by_person_id: &HashMap<String, &Person>,
) -> String {
    let source = if claim.primary_source_id.is_empty() {
        "source-unassigned".to_string()
    } else {
        claim.primary_source_id.clone()
    };
    let grade = if edge.confidence_grade.is_empty() {
        "?".to_string()
    } else {
        edge.confidence_grade.clone()
    };
    let rel = format!(
        "{} {} {} {}",
        edge.t,
        person_label(by_person_id, &edge.s),
        if edge.t == "parent" { "->" } else { "<->" },
        person_label(by_person_id, &edge.d)
    );
    let label = if edge.l.is_empty() {
        String::new()
    } else {
        format!(" [{}]", edge.l)
    };
    let excerpt = short_text(&claim.claim_excerpt, 200);
    let locator = short_text(&claim.citation_locator, 180);
    format!(
        "{} | {}{} | {} [{}] | {} | locator: {}",
        if claim.claim_id.is_empty() {
            "(claim id missing)"
        } else {
            claim.claim_id.as_str()
        },
        rel,
        label,
        source,
        grade,
        excerpt,
        locator
    )
}

fn evidence_anchors_for_person(
    rel_edges: &[&Edge],
    claims_by_edge_key: &HashMap<String, ClaimRow>,
    by_person_id: &HashMap<String, &Person>,
) -> Vec<String> {
    let mut anchors = Vec::<(u8, String)>::new();
    for edge in rel_edges {
        if edge.c != "c" {
            continue;
        }
        let mut claim = claims_by_edge_key.get(&edge_key(edge)).cloned();
        if claim.is_none() && edge.t != "parent" {
            claim = claims_by_edge_key.get(&reverse_edge_key(edge)).cloned();
        }
        let Some(claim) = claim else {
            continue;
        };
        let text = claim_anchor_text(&claim, edge, by_person_id);
        anchors.push((grade_rank(&edge.confidence_grade), text));
    }
    anchors.sort_by(|a, b| a.0.cmp(&b.0).then(a.1.cmp(&b.1)));
    anchors
        .into_iter()
        .map(|(_, text)| text)
        .collect::<Vec<_>>()
}

#[derive(Clone)]
struct InferenceTrackerRow {
    dossier_file: String,
    dossier_status: String,
}

fn inference_links_for_person(
    rel_edges: &[&Edge],
    inference_by_edge_key: &HashMap<String, InferenceTrackerRow>,
) -> Vec<String> {
    let mut links = Vec::<String>::new();
    for edge in rel_edges {
        if edge.c != "i" {
            continue;
        }
        let key = edge_key(edge);
        let mut tracker = inference_by_edge_key.get(&key).cloned();
        let mut match_mode = "direct";
        if tracker.is_none() && edge.t != "parent" {
            tracker = inference_by_edge_key.get(&reverse_edge_key(edge)).cloned();
            if tracker.is_some() {
                match_mode = "reversed";
            }
        }
        if let Some(tracker) = tracker {
            let mode_suffix = if match_mode == "reversed" {
                " [matched as reversed pair]"
            } else {
                ""
            };
            links.push(format!(
                "{} -> {} ({}){}",
                key,
                if tracker.dossier_file.is_empty() {
                    "(dossier path missing)"
                } else {
                    tracker.dossier_file.as_str()
                },
                if tracker.dossier_status.is_empty() {
                    "status unknown"
                } else {
                    tracker.dossier_status.as_str()
                },
                mode_suffix
            ));
        } else {
            links.push(format!("{key} -> dossier tracker entry missing"));
        }
    }
    unique(links)
}

fn fallback_sources(dynasty: &str) -> Vec<String> {
    match dynasty {
        "Lunar" => vec![
            "SRC-TUFS-TARIKH-DIBA-MAHALL-FACSIMILE".to_string(),
            "SRC-SARUNA-RAADHAVALHI-1985".to_string(),
            "SRC-MRF-KINGS".to_string(),
        ],
        "Hilaaly" => vec![
            "SRC-TUFS-TARIKH-DIBA-MAHALL-FACSIMILE".to_string(),
            "SRC-MRF-HILAALY".to_string(),
            "SRC-MRF-KINGS".to_string(),
        ],
        "Utheemu" => vec![
            "SRC-MRF-UTHEEM".to_string(),
            "SRC-WIKI-MONARCHS".to_string(),
            "SRC-TUFS-TARIKH-DIBA-MAHALL-FACSIMILE".to_string(),
        ],
        "Dhiyamigili" => vec![
            "SRC-WIKI-DHIYAMIGILI".to_string(),
            "SRC-MRF-KINGS".to_string(),
            "SRC-WIKI-MONARCHS".to_string(),
        ],
        "Huraagey" => vec![
            "SRC-MRF-KINGS".to_string(),
            "SRC-WIKI-MONARCHS".to_string(),
            "SRC-WIKI-HURAA".to_string(),
        ],
        "Isdu" => vec![
            "SRC-MRF-KINGS".to_string(),
            "SRC-WIKI-MONARCHS".to_string(),
            "SRC-MRF-MIDU-ROYAL".to_string(),
        ],
        "Devadu" => vec![
            "SRC-MRF-KINGS".to_string(),
            "SRC-WIKI-MONARCHS".to_string(),
            "SRC-MRF-MIDU-ROYAL".to_string(),
        ],
        "Modern" => vec![
            "SRC-PO-MUIZZU".to_string(),
            "SRC-PO-SOLIH".to_string(),
            "SRC-PO-NASHEED".to_string(),
        ],
        _ => vec!["SRC-WIKI-MONARCHS".to_string(), "SRC-MRF-KINGS".to_string()],
    }
}

fn source_list_for_person(
    person: &Person,
    rel_edges: &[&Edge],
    source_by_id: &HashMap<String, SourceRecord>,
) -> String {
    let person_refs = unique(source_refs_for_person(person));
    let relation_refs = unique(
        rel_edges
            .iter()
            .flat_map(|e| e.evidence_refs.clone())
            .collect::<Vec<_>>(),
    );

    let mut source_ids = unique(
        person_refs
            .iter()
            .chain(relation_refs.iter())
            .cloned()
            .collect::<Vec<_>>(),
    );
    if source_ids.is_empty() {
        source_ids = fallback_sources(&person.dy);
    }

    source_ids
        .iter()
        .map(|id| {
            let mut tags = Vec::<String>::new();
            if person_refs.contains(id) {
                tags.push("person".to_string());
            }
            if relation_refs.contains(id) {
                tags.push("edge".to_string());
            }
            if !person_refs.contains(id) && !relation_refs.contains(id) {
                tags.push("priority".to_string());
            }
            let tag_text = if tags.is_empty() {
                String::new()
            } else {
                format!(" ({})", tags.join("+"))
            };

            if let Some(source) = source_by_id.get(id) {
                format!(
                    "- `{}`{}: {} [{}]",
                    id, tag_text, source.title, source.quality
                )
            } else {
                format!("- `{}`{}", id, tag_text)
            }
        })
        .collect::<Vec<_>>()
        .join("\n")
}

fn make_open_questions(
    person: &Person,
    rel_edges: &[&Edge],
    parent_edges: &[&Edge],
    aliases: &[String],
    source_count: usize,
) -> Vec<String> {
    let mut open = Vec::<String>::new();
    let inferred = rel_edges.iter().filter(|e| e.c == "i").count();
    let direct = rel_edges.iter().filter(|e| e.c == "c").count();
    let low_grade_direct = rel_edges
        .iter()
        .filter(|e| e.c == "c" && (e.confidence_grade == "C" || e.confidence_grade == "D"))
        .count();
    let uncertain = rel_edges.iter().filter(|e| e.c == "u").count();
    let (ranked, total_mentions) = source_concentration(rel_edges);
    let top_share = if total_mentions > 0 && !ranked.is_empty() {
        ranked[0].1 as f64 / total_mentions as f64
    } else {
        0.0
    };

    if source_refs_for_person(person).is_empty() {
        open.push("Node-level source_refs are missing; current provenance is relation-led and needs direct person-level anchoring.".to_string());
    }
    if source_count <= 1 {
        open.push("Source diversity is low for this node; add at least one independent corroborative source before promotion decisions.".to_string());
    }
    if aliases.is_empty() {
        open.push("No transliteration or alternate naming set is documented yet.".to_string());
    }
    if parent_edges.is_empty() {
        open.push(
            "Parentage remains incomplete in the current model and should be prioritized in extraction."
                .to_string(),
        );
    }
    if inferred > direct && inferred > 0 {
        open.push("Inferred relations outnumber direct relations; prioritize direct kinship wording for high-impact ties.".to_string());
    }
    if low_grade_direct > 0 {
        open.push(format!(
            "This node has {low_grade_direct} direct claims still graded C/D; prioritize stronger corroboration before promotion."
        ));
    }
    if uncertain > 0 {
        open.push(format!(
            "This node has {uncertain} uncertain claim(s); resolve contradiction pathways before canonical changes."
        ));
    }
    if top_share >= 0.6 && !ranked.is_empty() {
        open.push(format!(
            "Source concentration is high ({}% of evidence mentions from {}); diversify citations for resiliency.",
            (top_share * 100.0).round() as i64,
            ranked[0].0
        ));
    }
    if offices_held(person).is_empty() && person.dy != "Modern" {
        open.push("Office/style semantics are still under-specified for this period and require title-source mapping.".to_string());
    }
    open
}

fn make_person_dossier(
    person: &Person,
    all_edges: &[Edge],
    by_person_id: &HashMap<String, &Person>,
    claims_by_edge_key: &HashMap<String, ClaimRow>,
    inference_by_edge_key: &HashMap<String, InferenceTrackerRow>,
    source_by_id: &HashMap<String, SourceRecord>,
    date: &str,
) -> String {
    let rel_edges = all_edges
        .iter()
        .filter(|e| e.s == person.id || e.d == person.id)
        .collect::<Vec<_>>();
    let parent_edges = rel_edges
        .iter()
        .copied()
        .filter(|e| e.t == "parent" && e.d == person.id)
        .collect::<Vec<_>>();
    let child_edges = rel_edges
        .iter()
        .copied()
        .filter(|e| e.t == "parent" && e.s == person.id)
        .collect::<Vec<_>>();
    let sibling_edges = rel_edges
        .iter()
        .copied()
        .filter(|e| e.t == "sibling")
        .collect::<Vec<_>>();
    let spouse_edges = rel_edges
        .iter()
        .copied()
        .filter(|e| e.t == "spouse")
        .collect::<Vec<_>>();
    let kin_edges = rel_edges
        .iter()
        .copied()
        .filter(|e| e.t == "kin")
        .collect::<Vec<_>>();

    let direct = rel_edges.iter().filter(|e| e.c == "c").count();
    let inferred = rel_edges.iter().filter(|e| e.c == "i").count();
    let uncertain = rel_edges.iter().filter(|e| e.c == "u").count();

    let mut grade_counts = BTreeMap::<String, usize>::new();
    for edge in &rel_edges {
        let grade = if edge.confidence_grade.is_empty() {
            "?".to_string()
        } else {
            edge.confidence_grade.clone()
        };
        let e = grade_counts.entry(grade).or_insert(0);
        *e += 1;
    }

    let aliases = unique(
        person_vec_strings(person, "aliases")
            .into_iter()
            .chain(known_as_names(person))
            .collect::<Vec<_>>(),
    );
    let office_text = offices_held(person)
        .into_iter()
        .map(|o| {
            let years = [o.start.clone(), o.end.clone()]
                .into_iter()
                .filter(|v| !v.is_empty())
                .collect::<Vec<_>>()
                .join("-");
            let years_text = if years.is_empty() {
                String::new()
            } else {
                format!(" ({years})")
            };
            format!(
                "{}{}",
                if !o.office_id.is_empty() {
                    o.office_id
                } else if !o.label.is_empty() {
                    o.label
                } else {
                    "office".to_string()
                },
                years_text
            )
        })
        .collect::<Vec<_>>();

    let source_list = source_list_for_person(person, &rel_edges, source_by_id);
    let source_count = source_list
        .lines()
        .filter(|line| !line.trim().is_empty())
        .count();
    let open_questions =
        make_open_questions(person, &rel_edges, &parent_edges, &aliases, source_count);
    let anchors = evidence_anchors_for_person(&rel_edges, claims_by_edge_key, by_person_id);
    let inference_links = inference_links_for_person(&rel_edges, inference_by_edge_key);
    let (ranked_concentration, _) = source_concentration(&rel_edges);
    let concentration_list = ranked_concentration
        .iter()
        .take(5)
        .map(|(id, count)| format!("{id} ({count})"))
        .collect::<Vec<_>>();

    let high_priority_promotion = rel_edges
        .iter()
        .filter(|edge| {
            edge.c == "c" && (edge.confidence_grade == "A" || edge.confidence_grade == "B")
        })
        .filter_map(|edge| claims_by_edge_key.get(&edge_key(edge)))
        .filter_map(|claim| {
            if claim.review_status.to_lowercase() == "in_progress"
                && claim.canonical_decision.to_lowercase() == "pending"
            {
                if claim.claim_id.is_empty() {
                    None
                } else {
                    Some(claim.claim_id.clone())
                }
            } else {
                None
            }
        })
        .collect::<Vec<_>>();

    format!(
        "# Person Dossier\n\nPerson ID: `{}`  \nLast updated: `{}`  \nResearch status: `in_progress`\n\n## 1) Identity\n- Canonical display name: {}\n- Regnal name(s): {}\n- Throne number / sovereign ordinal (if applicable): {}\n- Dynasty / house: {}\n- Gender: {}\n- Language/script variants:\n{}\n\n## 2) Titles, styles, and offices\n- Titles/styles (with period notes):\n{}\n- Offices held:\n{}\n- Institution links:\n- pending institution-link extraction\n\n## 3) Timeline anchors\n- Birth (date/place/source): {} / {}\n- Accession or elevation events: reign {}\n- Deposition/transition events: extraction pending explicit transition statements\n- Death (date/place/source): {} / {}\n\n## 4) Family and relationships\n- Parents:\n{}\n- Siblings:\n{}\n- Spouse(s)/consorts:\n{}\n- Children:\n{}\n- Collateral branch links:\n{}\n\n## 5) Evidence summary\n- Direct claims (`c`): {}\n- Inferred claims (`i`): {}\n- Uncertain claims (`u`): {}\n- Grade distribution: A={}, B={}, C={}, D={}\n- Evidence footprint: {} source IDs currently linked to this node/its relations.\n- Source concentration (top 5 by evidence mention count):\n{}\n- Direct claim anchors (claim ID + locator):\n{}\n- Inference dossiers touching this node:\n{}\n\n## 6) Source list\n{}\n\n## 7) Open questions\n{}\n\n## 8) Notes for graph integration\n- Required node field updates: source_refs completion, alias/transliteration normalization, and title/style enrichment.\n- Required edge updates: promote verified direct A/B claims with explicit locators; keep i/u claims in research until corroboration hardening completes.\n- Promotion-ready direct claim IDs (A/B with pending canonical decision): {}.\n",
        person.id,
        date,
        if person.nm.is_empty() {
            "Unknown".to_string()
        } else {
            person.nm.clone()
        },
        {
            let rg = person_string(person, "rg");
            if rg.is_empty() {
                "Unknown".to_string()
            } else {
                rg
            }
        },
        {
            let n = person_vec_strings(person, "n");
            if n.is_empty() {
                "Unknown".to_string()
            } else {
                n.join(", ")
            }
        },
        if person.dy.is_empty() {
            "Unknown".to_string()
        } else {
            person.dy.clone()
        },
        {
            let g = person_string(person, "g");
            if g.is_empty() {
                "Unknown".to_string()
            } else {
                g
            }
        },
        format_list(&aliases),
        format_list(&person_vec_strings(person, "titles")),
        format_list(&office_text),
        {
            let yb = person_string(person, "yb");
            if yb.is_empty() {
                "Unknown".to_string()
            } else {
                yb
            }
        },
        {
            let pb = person_string(person, "pb");
            if pb.is_empty() {
                "Unknown".to_string()
            } else {
                pb
            }
        },
        format_date_range(&reign_ranges(person)),
        {
            let yd = person_string(person, "yd");
            if yd.is_empty() {
                "Unknown".to_string()
            } else {
                yd
            }
        },
        {
            let pd = person_string(person, "pd");
            if pd.is_empty() {
                "Unknown".to_string()
            } else {
                pd
            }
        },
        format_list(
            &parent_edges
                .iter()
                .map(|e| relation_text(e, by_person_id))
                .collect::<Vec<_>>()
        ),
        format_list(
            &sibling_edges
                .iter()
                .map(|e| relation_text(e, by_person_id))
                .collect::<Vec<_>>()
        ),
        format_list(
            &spouse_edges
                .iter()
                .map(|e| relation_text(e, by_person_id))
                .collect::<Vec<_>>()
        ),
        format_list(
            &child_edges
                .iter()
                .map(|e| relation_text(e, by_person_id))
                .collect::<Vec<_>>()
        ),
        format_list(
            &kin_edges
                .iter()
                .map(|e| relation_text(e, by_person_id))
                .collect::<Vec<_>>()
        ),
        direct,
        inferred,
        uncertain,
        grade_counts.get("A").copied().unwrap_or(0),
        grade_counts.get("B").copied().unwrap_or(0),
        grade_counts.get("C").copied().unwrap_or(0),
        grade_counts.get("D").copied().unwrap_or(0),
        source_count,
        format_list(&concentration_list),
        format_list(&anchors.into_iter().take(12).collect::<Vec<_>>()),
        format_list(&inference_links),
        source_list,
        format_list(&open_questions),
        if high_priority_promotion.is_empty() {
            "none flagged in this pass".to_string()
        } else {
            high_priority_promotion.join(", ")
        }
    )
}

fn load_relationship_claims(path: &Path) -> Result<HashMap<String, ClaimRow>, String> {
    let csv_text =
        fs::read_to_string(path).map_err(|e| format!("failed to read {}: {e}", path.display()))?;
    let rows = parse_csv(&csv_text);
    if rows.is_empty() {
        return Ok(HashMap::new());
    }
    let idx = header_index(&rows[0]);
    let mut map = HashMap::<String, ClaimRow>::new();
    for row in rows.iter().skip(1) {
        let key = row_get(row, &idx, "edge_key").to_string();
        if key.is_empty() || map.contains_key(&key) {
            continue;
        }
        map.insert(
            key,
            ClaimRow {
                claim_id: row_get(row, &idx, "claim_id").to_string(),
                claim_excerpt: row_get(row, &idx, "claim_excerpt").to_string(),
                citation_locator: row_get(row, &idx, "citation_locator").to_string(),
                primary_source_id: row_get(row, &idx, "primary_source_id").to_string(),
                review_status: row_get(row, &idx, "review_status").to_string(),
                canonical_decision: row_get(row, &idx, "canonical_decision").to_string(),
            },
        );
    }
    Ok(map)
}

fn load_inference_tracker(path: &Path) -> Result<HashMap<String, InferenceTrackerRow>, String> {
    let csv_text =
        fs::read_to_string(path).map_err(|e| format!("failed to read {}: {e}", path.display()))?;
    let rows = parse_csv(&csv_text);
    if rows.is_empty() {
        return Ok(HashMap::new());
    }
    let idx = header_index(&rows[0]);
    let mut map = HashMap::<String, InferenceTrackerRow>::new();
    for row in rows.iter().skip(1) {
        let key = row_get(row, &idx, "edge_key").to_string();
        if key.is_empty() {
            continue;
        }
        map.insert(
            key,
            InferenceTrackerRow {
                dossier_file: row_get(row, &idx, "dossier_file").to_string(),
                dossier_status: row_get(row, &idx, "dossier_status").to_string(),
            },
        );
    }
    Ok(map)
}

fn refresh_person_coverage_ledger(
    dataset: &Dataset,
    ledger_path: &Path,
    date: &str,
) -> Result<(), String> {
    let csv_text = fs::read_to_string(ledger_path)
        .map_err(|e| format!("failed to read {}: {e}", ledger_path.display()))?;
    let mut rows = parse_csv(&csv_text);
    if rows.is_empty() {
        return Ok(());
    }
    let idx = header_index(&rows[0]);
    let data_ids = dataset
        .people
        .iter()
        .map(|p| p.id.clone())
        .collect::<HashSet<_>>();

    for row in rows.iter_mut().skip(1) {
        let person_id = row_get(row, &idx, "person_id");
        if !data_ids.contains(person_id) {
            continue;
        }
        row_set(row, &idx, "dossier_status", "in_progress".to_string());
        row_set(row, &idx, "last_updated", date.to_string());
        row_set(row, &idx, "notes", "Phase 2 depth refresh completed: claim anchors, source concentration, and inference links added.".to_string());
    }

    fs::write(ledger_path, rows_to_csv(&rows))
        .map_err(|e| format!("failed to write {}: {e}", ledger_path.display()))
}

pub fn run(
    dataset: &Dataset,
    sources: &[SourceRecord],
    root_dir: &str,
    date_opt: Option<&str>,
) -> Result<String, String> {
    let date = date_opt.map(ToString::to_string).unwrap_or_else(today_iso);
    let root = Path::new(root_dir);

    let people_dir = root.join("docs").join("research-program").join("people");
    let ledger_path = root
        .join("docs")
        .join("research-program")
        .join("ledgers")
        .join("person-coverage.csv");
    let relationship_ledger_path = root
        .join("docs")
        .join("research-program")
        .join("ledgers")
        .join("relationship-evidence-ledger.csv");
    let inference_tracker_path = root
        .join("docs")
        .join("research-program")
        .join("ledgers")
        .join("inference-dossier-tracker.csv");

    let by_person_id = dataset
        .people
        .iter()
        .map(|p| (p.id.clone(), p))
        .collect::<HashMap<_, _>>();
    let source_by_id = sources
        .iter()
        .map(|s| (s.id.clone(), s.clone()))
        .collect::<HashMap<_, _>>();

    let claims_by_edge_key = load_relationship_claims(&relationship_ledger_path)?;
    let inference_by_edge_key = load_inference_tracker(&inference_tracker_path)?;

    fs::create_dir_all(&people_dir)
        .map_err(|e| format!("failed to create {}: {e}", people_dir.display()))?;

    for person in &dataset.people {
        let content = make_person_dossier(
            person,
            &dataset.edges,
            &by_person_id,
            &claims_by_edge_key,
            &inference_by_edge_key,
            &source_by_id,
            &date,
        );
        let target = people_dir.join(format!("{}.md", person.id));
        fs::write(&target, content)
            .map_err(|e| format!("failed to write {}: {e}", target.display()))?;
    }

    refresh_person_coverage_ledger(dataset, &ledger_path, &date)?;
    Ok(format!(
        "Person dossier refresh complete: {} files rewritten.\n",
        dataset.people.len()
    ))
}

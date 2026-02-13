use crate::csv_utils::{csv_escape, parse_csv};
use crate::source_models::SourceRecord;
use maldives_domain::{Dataset, Edge, Person};
use serde::Deserialize;
use serde_json::Value;
use std::collections::{HashMap, HashSet};
use std::fs;
use std::path::{Path, PathBuf};

pub(crate) const DEFAULT_DATE: &str = "2026-02-08";

#[derive(Clone, Debug, Deserialize)]
pub(crate) struct RelationshipUpdate {
    pub(crate) claim_excerpt: String,
    pub(crate) citation_locator: String,
    pub(crate) notes: String,
}

#[derive(Clone, Debug, Deserialize)]
pub(crate) struct QueueUpdate {
    pub(crate) status: String,
    pub(crate) owner: String,
    pub(crate) notes: String,
}

#[derive(Clone, Debug, Deserialize)]
pub(crate) struct CuratedInferenceNote {
    #[serde(default)]
    pub(crate) summary: String,
    #[allow(dead_code)]
    #[serde(default)]
    pub(crate) dossier: String,
    #[serde(default)]
    pub(crate) logic: Vec<String>,
    #[serde(default)]
    pub(crate) verification: Vec<String>,
}

#[derive(Clone, Debug)]
pub(crate) struct PersonDossierOptions<'a> {
    pub(crate) date: &'a str,
    pub(crate) primary_targets: &'a [String],
    pub(crate) include_spouse_edges: bool,
    pub(crate) uncertain_contested_wording: bool,
    pub(crate) required_edge_updates: &'a str,
}

pub(crate) fn rows_to_csv(rows: &[Vec<String>]) -> String {
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

pub(crate) fn header_index(header: &[String]) -> HashMap<String, usize> {
    header
        .iter()
        .enumerate()
        .map(|(i, h)| (h.clone(), i))
        .collect::<HashMap<_, _>>()
}

pub(crate) fn row_get<'a>(row: &'a [String], idx: &HashMap<String, usize>, key: &str) -> &'a str {
    idx.get(key)
        .and_then(|i| row.get(*i))
        .map(String::as_str)
        .unwrap_or("")
}

pub(crate) fn row_set(row: &mut [String], idx: &HashMap<String, usize>, key: &str, value: String) {
    let Some(col) = idx.get(key).copied() else {
        return;
    };
    if col < row.len() {
        row[col] = value;
    }
}

pub(crate) fn with_date(value: &str, date: &str) -> String {
    if date == DEFAULT_DATE {
        value.to_string()
    } else {
        value.replace(DEFAULT_DATE, date)
    }
}

fn parse_prefixed_numeric_id(value: &str) -> (&str, Option<u64>) {
    if let Some((prefix, number)) = value.split_once('-') {
        if let Ok(n) = number.parse::<u64>() {
            return (prefix, Some(n));
        }
    }
    (value, None)
}

pub(crate) fn compare_prefixed_numeric(a: &str, b: &str) -> std::cmp::Ordering {
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

pub(crate) fn ledger_dir(root_dir: &str) -> PathBuf {
    Path::new(root_dir)
        .join("docs")
        .join("research-program")
        .join("ledgers")
}

pub(crate) fn source_by_id_map(sources: &[SourceRecord]) -> HashMap<String, SourceRecord> {
    sources
        .iter()
        .map(|source| (source.id.clone(), source.clone()))
        .collect::<HashMap<_, _>>()
}

pub(crate) fn by_person_id(dataset: &Dataset) -> HashMap<String, &Person> {
    dataset
        .people
        .iter()
        .map(|person| (person.id.clone(), person))
        .collect::<HashMap<_, _>>()
}

pub(crate) fn person_label(by_id: &HashMap<String, &Person>, id: &str) -> String {
    let Some(person) = by_id.get(id) else {
        return id.to_string();
    };
    let name = if person.nm.is_empty() {
        "(unnamed)".to_string()
    } else {
        person.nm.clone()
    };
    let regnal = person_string(person, "rg");
    let reg = if regnal.is_empty() {
        String::new()
    } else {
        format!(" ({regnal})")
    };
    format!("{id} {name}{reg}")
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
        return "- none recorded".to_string();
    }
    items
        .iter()
        .map(|v| format!("- {v}"))
        .collect::<Vec<_>>()
        .join("\n")
}

fn relation_text(edge: &Edge, by_id: &HashMap<String, &Person>) -> String {
    let source = person_label(by_id, &edge.s);
    let target = person_label(by_id, &edge.d);
    let label = if edge.l.is_empty() {
        String::new()
    } else {
        format!(" [{}]", edge.l)
    };
    format!("{} {} -> {}{} ({})", edge.t, source, target, label, edge.c)
}

pub(crate) fn inference_edge_key(edge: &Edge) -> String {
    let label = edge.l.trim();
    if matches!(edge.t.as_str(), "sibling" | "spouse" | "kin") {
        let (a, b) = if edge.s <= edge.d {
            (edge.s.as_str(), edge.d.as_str())
        } else {
            (edge.d.as_str(), edge.s.as_str())
        };
        return format!("{}|{}|{}|{}", edge.t, a, b, label);
    }
    format!("{}|{}|{}|{}", edge.t, edge.s, edge.d, label)
}

fn dynasty_value(by_person_id: &HashMap<String, &Person>, id: &str) -> String {
    let Some(person) = by_person_id.get(id) else {
        return "Unknown".to_string();
    };
    if person.dy.is_empty() {
        "Unknown".to_string()
    } else {
        person.dy.clone()
    }
}

fn source_line(source_by_id: &HashMap<String, SourceRecord>, id: &str) -> String {
    let Some(source) = source_by_id.get(id) else {
        return format!("- `{id}` (not yet in registry notes)");
    };
    format!("- `{id}`: {} [{}]", source.title, source.quality)
}

fn source_line_inference(source_by_id: &HashMap<String, SourceRecord>, id: &str) -> String {
    let Some(source) = source_by_id.get(id) else {
        return format!("- `{id}` (Unknown source)");
    };
    format!("- `{id}` ({})", source.title)
}

pub(crate) fn make_person_dossier(
    person: &Person,
    all_edges: &[Edge],
    by_person_id: &HashMap<String, &Person>,
    source_by_id: &HashMap<String, SourceRecord>,
    options: &PersonDossierOptions<'_>,
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
    let direct = rel_edges
        .iter()
        .copied()
        .filter(|e| e.c == "c")
        .collect::<Vec<_>>();
    let inferred = rel_edges
        .iter()
        .copied()
        .filter(|e| e.c == "i")
        .collect::<Vec<_>>();
    let uncertain = rel_edges
        .iter()
        .copied()
        .filter(|e| e.c == "u")
        .collect::<Vec<_>>();

    let relation_source_ids = unique(
        rel_edges
            .iter()
            .flat_map(|e| e.evidence_refs.clone())
            .collect::<Vec<_>>(),
    );
    let source_ids = unique(
        source_refs_for_person(person)
            .into_iter()
            .chain(relation_source_ids)
            .chain(options.primary_targets.iter().cloned())
            .collect::<Vec<_>>(),
    );

    let office_text = offices_held(person)
        .into_iter()
        .map(|o| {
            let years = [o.start, o.end]
                .into_iter()
                .filter(|v| !v.is_empty())
                .collect::<Vec<_>>()
                .join("-");
            let years_text = if years.is_empty() {
                String::new()
            } else {
                format!(" ({years})")
            };
            if !o.office_id.is_empty() {
                format!("{}{}", o.office_id, years_text)
            } else if !o.label.is_empty() {
                format!("{}{}", o.label, years_text)
            } else {
                format!("office{}", years_text)
            }
        })
        .collect::<Vec<_>>();

    let aliases = unique(
        person_vec_strings(person, "aliases")
            .into_iter()
            .chain(known_as_names(person))
            .collect::<Vec<_>>(),
    );

    let sources_list = source_ids
        .iter()
        .map(|id| source_line(source_by_id, id))
        .collect::<Vec<_>>()
        .join("\n");

    let mut open_questions = Vec::<String>::new();
    if source_refs_for_person(person).is_empty() {
        open_questions.push(
            "Direct person-level source_refs are still missing and need chronicle corroboration."
                .to_string(),
        );
    }
    if aliases.is_empty() {
        open_questions.push("No verified alternate name/transliteration set yet.".to_string());
    }
    if office_text.is_empty() {
        open_questions
            .push("No office/style assignment verified beyond regnal framing.".to_string());
    }
    if parent_edges.is_empty() {
        open_questions.push(
            "Parentage is currently incomplete in model and requires source extraction."
                .to_string(),
        );
    }

    let throne_numbers = person_vec_strings(person, "n");
    let throne_text = if throne_numbers.is_empty() {
        "Unknown".to_string()
    } else {
        throne_numbers.join(", ")
    };
    let uncertain_line = if options.uncertain_contested_wording {
        if uncertain.is_empty() {
            "None currently attached.".to_string()
        } else {
            format!(
                "{} uncertain/contested relations currently modeled.",
                uncertain.len()
            )
        }
    } else if uncertain.is_empty() {
        "None currently attached.".to_string()
    } else {
        format!("{} uncertain relations currently modeled.", uncertain.len())
    };

    let spouse_block = if options.include_spouse_edges {
        format_list(
            &spouse_edges
                .iter()
                .map(|e| relation_text(e, by_person_id))
                .collect::<Vec<_>>(),
        )
    } else {
        "- none recorded".to_string()
    };

    format!(
        "# Person Dossier\n\nPerson ID: `{}`  \nLast updated: `{}`  \nResearch status: `in_progress`\n\n## 1) Identity\n- Canonical display name: {}\n- Regnal name(s): {}\n- Throne number / sovereign ordinal (if applicable): {}\n- Dynasty / house: {}\n- Gender: {}\n- Language/script variants:\n{}\n\n## 2) Titles, styles, and offices\n- Titles/styles (with period notes):\n{}\n- Offices held:\n{}\n- Institution links:\n- none recorded\n\n## 3) Timeline anchors\n- Birth (date/place/source): {} / {}\n- Accession or elevation events: reign {}\n- Deposition/transition events: not yet extracted for this node\n- Death (date/place/source): {} / {}\n\n## 4) Family and relationships\n- Parents:\n{}\n- Siblings:\n{}\n- Spouse(s)/consorts:\n{}\n- Children:\n{}\n- Collateral branch links:\n{}\n\n## 5) Evidence summary\n- High-confidence (`A/B`) claims: {}\n- Inferred (`C`) claims: {}\n- Uncertain/contested (`D`) claims: {}\n\n## 6) Source list\n{}\n\n## 7) Open questions\n{}\n\n## 8) Notes for graph integration\n- Required node field updates: source_refs backfill; aliases/transliteration enrichment; title/style notes.\n- Required edge updates: {}\n- Promotion readiness: not ready for canonical promotion change this batch.\n",
        person.id,
        options.date,
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
        throne_text,
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
                .collect::<Vec<_>>(),
        ),
        format_list(
            &sibling_edges
                .iter()
                .map(|e| relation_text(e, by_person_id))
                .collect::<Vec<_>>(),
        ),
        spouse_block,
        format_list(
            &child_edges
                .iter()
                .map(|e| relation_text(e, by_person_id))
                .collect::<Vec<_>>(),
        ),
        format_list(
            &kin_edges
                .iter()
                .map(|e| relation_text(e, by_person_id))
                .collect::<Vec<_>>(),
        ),
        if direct.is_empty() {
            "No direct relation edges currently attached.".to_string()
        } else {
            format!(
                "{} modeled relations currently marked direct.",
                direct.len()
            )
        },
        if inferred.is_empty() {
            "No inferred edges for this node.".to_string()
        } else {
            format!(
                "{} inferred relations present and require pair-level dossier traceability.",
                inferred.len()
            )
        },
        uncertain_line,
        sources_list,
        format_list(&open_questions),
        options.required_edge_updates
    )
}

pub(crate) fn make_curated_inference_dossier(
    edge: &Edge,
    note_opt: Option<&CuratedInferenceNote>,
    by_person_id: &HashMap<String, &Person>,
    source_by_id: &HashMap<String, SourceRecord>,
    date: &str,
) -> String {
    let source = person_label(by_person_id, &edge.s);
    let target = person_label(by_person_id, &edge.d);
    let sources = if edge.evidence_refs.is_empty() {
        "- none".to_string()
    } else {
        edge.evidence_refs
            .iter()
            .map(|id| source_line_inference(source_by_id, id))
            .collect::<Vec<_>>()
            .join("\n")
    };

    let logic_lines = {
        let fallback = vec!["Pair-specific logic extraction pending.".to_string()];
        let logic = note_opt
            .map(|note| note.logic.as_slice())
            .filter(|v| !v.is_empty())
            .unwrap_or(fallback.as_slice());
        logic
            .iter()
            .enumerate()
            .map(|(i, line)| format!("{}. {}", i + 1, line))
            .collect::<Vec<_>>()
            .join("\n")
    };

    let verification_lines = {
        let fallback = vec!["Gather direct relation wording for this pair.".to_string()];
        let verification = note_opt
            .map(|note| note.verification.as_slice())
            .filter(|v| !v.is_empty())
            .unwrap_or(fallback.as_slice());
        verification
            .iter()
            .map(|line| format!("- {line}"))
            .collect::<Vec<_>>()
            .join("\n")
    };

    let summary = note_opt
        .map(|note| note.summary.as_str())
        .filter(|v| !v.trim().is_empty())
        .unwrap_or("Inference rationale pending detailed write-up.");
    let relation_label = if edge.l.is_empty() {
        "(no label)"
    } else {
        edge.l.as_str()
    };
    let grade = if edge.confidence_grade.is_empty() {
        "C"
    } else {
        edge.confidence_grade.as_str()
    };

    format!(
        "# Inference Dossier\n\nEdge key: `{}`  \nLast updated: `{}`  \nInference class: `curated`\n\n## 1) Edge identity\n- Relation type: {}\n- Source node: {}\n- Target node: {}\n- Label: {}\n- Current confidence marker (`c/i/u`): {}\n- Current grade (`A/B/C/D`): {}\n\n## 2) Why this specific pair is modeled\n- Pair summary: {}\n- Historical/dynastic context: {} -> {} branch continuity context.\n\n## 3) Logic chain (pair-specific)\n{}\n4. Reason this implies the modeled relation for this exact pair: The current model supports this specific pair as the narrowest defensible relation without overstating direct lineage.\n\n## 4) Alternative interpretations\n- Plausible competing relation class: generic collateral `kin` or unresolved branch proximity.\n- Why current model is preferred: It preserves the continuity signal while flagging uncertainty explicitly.\n- What evidence would switch interpretation: direct source wording naming a specific relation class between these exact nodes.\n\n## 5) Verification checklist\n- Evidence needed to promote to confirmed: at least one explicit relation statement in an A/B source with locator.\n- Evidence that would downgrade/remove: contradictory parentage or branch assignment in stronger sources.\n- Re-check interval: every major source-ingestion batch.\n\n## 6) Source basis\n{}\n- Claim excerpt notes: ledger claim row should include precise locator text in relationship evidence ledger.\n\n## 7) Integration notes\n- `src/data/inference-notes.js` summary update needed: no\n- Edge label/type update needed: pending source extraction outcome\n- Canonical promotion candidate: no\n\n## 8) Verification actions\n{}\n",
        inference_edge_key(edge),
        date,
        edge.t,
        source,
        target,
        relation_label,
        edge.c,
        grade,
        summary,
        dynasty_value(by_person_id, &edge.s),
        dynasty_value(by_person_id, &edge.d),
        logic_lines,
        sources,
        verification_lines
    )
}

fn object_edge_pair(value: Option<&Value>) -> Option<(String, String)> {
    let Value::Object(obj) = value? else {
        return None;
    };
    let s = obj
        .get("s")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();
    let d = obj
        .get("d")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();
    if s.is_empty() || d.is_empty() {
        return None;
    }
    Some((s, d))
}

fn object_edge_pairs(value: Option<&Value>) -> Vec<(String, String)> {
    let Some(Value::Array(arr)) = value else {
        return Vec::new();
    };
    arr.iter()
        .filter_map(|item| object_edge_pair(Some(item)))
        .collect::<Vec<_>>()
}

fn derived_logic(edge: &Edge, by_person_id: &HashMap<String, &Person>) -> Vec<String> {
    let basis_obj = edge.inference_basis.as_object();
    let mut lines = Vec::<String>::new();

    if edge.inference_rule == "parent-of-parent-grandparent" {
        let parent_edges = object_edge_pairs(basis_obj.and_then(|o| o.get("parent_edges")));
        let via = basis_obj
            .and_then(|o| o.get("via_parent"))
            .and_then(Value::as_str)
            .map(|id| person_label(by_person_id, id))
            .unwrap_or_else(|| "an intermediate parent node".to_string());
        if let Some((s, d)) = parent_edges.first() {
            lines.push(format!(
                "Supporting edge: parent {} -> {}.",
                person_label(by_person_id, s),
                person_label(by_person_id, d)
            ));
        }
        if let Some((s, d)) = parent_edges.get(1) {
            lines.push(format!(
                "Supporting edge: parent {} -> {}.",
                person_label(by_person_id, s),
                person_label(by_person_id, d)
            ));
        }
        lines.push(format!(
            "By the parent-of-parent rule via {via}, the source node is inferred as grandparent-level kin of the target node."
        ));
        return lines;
    }

    if edge.inference_rule == "parent-sibling-aunt-uncle" {
        let support = object_edge_pairs(basis_obj.and_then(|o| o.get("supporting_edges")));
        let via_parent = basis_obj
            .and_then(|o| o.get("via_parent"))
            .and_then(Value::as_str)
            .map(|id| person_label(by_person_id, id))
            .unwrap_or_else(|| "the child parent node".to_string());
        let via_sib = basis_obj
            .and_then(|o| o.get("via_parent_sibling"))
            .and_then(Value::as_str)
            .map(|id| person_label(by_person_id, id))
            .unwrap_or_else(|| "the parent sibling node".to_string());
        if let Some((s, d)) = support.first() {
            lines.push(format!(
                "Supporting edge: parent {} -> {}.",
                person_label(by_person_id, s),
                person_label(by_person_id, d)
            ));
        }
        if let Some((s, d)) = support.get(1) {
            lines.push(format!(
                "Supporting edge: sibling {} <-> {}.",
                person_label(by_person_id, s),
                person_label(by_person_id, d)
            ));
        }
        lines.push(format!(
            "Because {via_sib} is sibling to {via_parent}, the modeled relation to the child branch is inferred as aunt/uncle↔niece/nephew kin."
        ));
        return lines;
    }

    if edge.inference_rule == "children-of-siblings-cousin" {
        let cps = object_edge_pairs(basis_obj.and_then(|o| o.get("child_parent_edges")));
        if let Some((s, d)) = cps.first() {
            lines.push(format!(
                "Supporting edge: parent {} -> {}.",
                person_label(by_person_id, s),
                person_label(by_person_id, d)
            ));
        }
        if let Some((s, d)) = cps.get(1) {
            lines.push(format!(
                "Supporting edge: parent {} -> {}.",
                person_label(by_person_id, s),
                person_label(by_person_id, d)
            ));
        }
        if let Some((s, d)) = object_edge_pair(basis_obj.and_then(|o| o.get("parent_sibling_edge")))
        {
            lines.push(format!(
                "Supporting edge: sibling {} <-> {}.",
                person_label(by_person_id, &s),
                person_label(by_person_id, &d)
            ));
        }
        lines
            .push("Children of sibling parents are inferred as cousins in this model.".to_string());
        return lines;
    }

    if edge.inference_rule == "shared-parent-sibling" {
        if let Some(shared_parent) = basis_obj
            .and_then(|o| o.get("shared_parent"))
            .and_then(Value::as_str)
        {
            lines.push(format!(
                "Supporting node: shared parent {}.",
                person_label(by_person_id, shared_parent)
            ));
        }
        let parent_edges = object_edge_pairs(basis_obj.and_then(|o| o.get("parent_edges")));
        for (s, d) in parent_edges {
            lines.push(format!(
                "Supporting edge: parent {} -> {}.",
                person_label(by_person_id, &s),
                person_label(by_person_id, &d)
            ));
        }
        lines.push(
            "Children sharing the same parent are inferred as siblings in this model.".to_string(),
        );
        return lines;
    }

    lines.push(
        "Inference basis metadata indicates a derived family-rule relation for this pair."
            .to_string(),
    );
    lines
}

pub(crate) fn make_derived_inference_dossier(
    edge: &Edge,
    by_person_id: &HashMap<String, &Person>,
    source_by_id: &HashMap<String, SourceRecord>,
    date: &str,
) -> String {
    let source = person_label(by_person_id, &edge.s);
    let target = person_label(by_person_id, &edge.d);
    let sources = if edge.evidence_refs.is_empty() {
        "- none".to_string()
    } else {
        edge.evidence_refs
            .iter()
            .map(|id| {
                let Some(source) = source_by_id.get(id) else {
                    return format!("- `{id}` (Unknown source)");
                };
                format!("- `{id}` ({})", source.title)
            })
            .collect::<Vec<_>>()
            .join("\n")
    };

    let logic_lines = derived_logic(edge, by_person_id)
        .iter()
        .enumerate()
        .map(|(idx, line)| format!("{}. {line}", idx + 1))
        .collect::<Vec<_>>()
        .join("\n");

    let grade = if edge.confidence_grade.is_empty() {
        "C"
    } else {
        edge.confidence_grade.as_str()
    };
    let label = if edge.l.is_empty() {
        "(no label)"
    } else {
        edge.l.as_str()
    };
    let rule = if edge.inference_rule.is_empty() {
        "derived-rule"
    } else {
        edge.inference_rule.as_str()
    };

    format!(
        "# Inference Dossier\n\nEdge key: `{}`  \nLast updated: `{}`  \nInference class: `rule-derived`\n\n## 1) Edge identity\n- Relation type: {}\n- Source node: {}\n- Target node: {}\n- Label: {}\n- Current confidence marker (`c/i/u`): {}\n- Current grade (`A/B/C/D`): {}\n\n## 2) Why this specific pair is modeled\n- Pair summary: This pair is derived from explicit modeled family edges using rule `{}`.\n- Historical/dynastic context: {} -> {} branch context.\n\n## 3) Logic chain (pair-specific)\n{}\n4. Reason this implies the modeled relation for this exact pair: The derived-rule chain currently supports this pair as a reversible inferred relation.\n\n## 4) Alternative interpretations\n- Plausible competing relation class: broader `kin` with no precise generational label.\n- Why current model is preferred: existing direct parent/sibling edges already encode enough structure for this derived relation.\n- What evidence would switch interpretation: direct source wording that contradicts one or more supporting parent/sibling edges.\n\n## 5) Verification checklist\n- Evidence needed to promote to confirmed: explicit text stating this exact relation class for this exact pair.\n- Evidence that would downgrade/remove: changes or contradictions in any supporting source edge in inference basis.\n- Re-check interval: every ingest batch that changes parent/sibling edges.\n\n## 6) Source basis\n{}\n- Claim excerpt notes: derived from inference basis metadata in edge object and supporting source-backed parent/sibling edges.\n\n## 7) Integration notes\n- `src/data/inference-notes.js` summary update needed: no\n- Edge label/type update needed: only if direct textual evidence becomes available\n- Canonical promotion candidate: no\n",
        inference_edge_key(edge),
        date,
        edge.t,
        source,
        target,
        label,
        edge.c,
        grade,
        rule,
        dynasty_value(by_person_id, &edge.s),
        dynasty_value(by_person_id, &edge.d),
        logic_lines,
        sources
    )
}

pub(crate) fn update_person_coverage(
    path: &Path,
    person_ids: &HashSet<String>,
    date: &str,
    notes: &str,
) -> Result<usize, String> {
    let raw =
        fs::read_to_string(path).map_err(|e| format!("failed to read {}: {e}", path.display()))?;
    let mut rows = parse_csv(&raw);
    if rows.is_empty() {
        return Err(format!("empty csv: {}", path.display()));
    }
    let idx = header_index(&rows[0]);
    let mut updated = 0usize;
    for row in rows.iter_mut().skip(1) {
        if !person_ids.contains(row_get(row, &idx, "person_id")) {
            continue;
        }
        row_set(row, &idx, "dossier_status", "in_progress".to_string());
        row_set(row, &idx, "last_updated", date.to_string());
        row_set(row, &idx, "notes", notes.to_string());
        updated += 1;
    }
    fs::write(path, rows_to_csv(&rows))
        .map_err(|e| format!("failed to write {}: {e}", path.display()))?;
    Ok(updated)
}

pub(crate) fn update_inference_tracker(
    path: &Path,
    inference_keys: &HashSet<String>,
    date: &str,
    notes: &str,
) -> Result<usize, String> {
    let raw =
        fs::read_to_string(path).map_err(|e| format!("failed to read {}: {e}", path.display()))?;
    let mut rows = parse_csv(&raw);
    if rows.is_empty() {
        return Err(format!("empty csv: {}", path.display()));
    }
    let idx = header_index(&rows[0]);
    let mut updated = 0usize;
    for row in rows.iter_mut().skip(1) {
        if !inference_keys.contains(row_get(row, &idx, "edge_key")) {
            continue;
        }
        row_set(row, &idx, "dossier_status", "in_progress".to_string());
        row_set(row, &idx, "last_updated", date.to_string());
        row_set(row, &idx, "notes", notes.to_string());
        updated += 1;
    }
    fs::write(path, rows_to_csv(&rows))
        .map_err(|e| format!("failed to write {}: {e}", path.display()))?;
    Ok(updated)
}

pub(crate) fn update_relationship_ledger(
    path: &Path,
    relationship_updates: &HashMap<String, RelationshipUpdate>,
    reviewer: &str,
    date: &str,
) -> Result<usize, String> {
    let raw =
        fs::read_to_string(path).map_err(|e| format!("failed to read {}: {e}", path.display()))?;
    let mut rows = parse_csv(&raw);
    if rows.is_empty() {
        return Err(format!("empty csv: {}", path.display()));
    }
    let idx = header_index(&rows[0]);
    let mut updated = 0usize;
    for row in rows.iter_mut().skip(1) {
        let claim_id = row_get(row, &idx, "claim_id");
        let Some(update) = relationship_updates.get(claim_id) else {
            continue;
        };
        row_set(row, &idx, "claim_excerpt", update.claim_excerpt.clone());
        row_set(
            row,
            &idx,
            "citation_locator",
            with_date(&update.citation_locator, date),
        );
        row_set(row, &idx, "access_date", date.to_string());
        row_set(row, &idx, "review_status", "in_progress".to_string());
        row_set(row, &idx, "canonical_decision", "pending".to_string());
        row_set(row, &idx, "reviewer", reviewer.to_string());
        row_set(row, &idx, "last_reviewed", date.to_string());
        row_set(row, &idx, "notes", update.notes.clone());
        updated += 1;
    }
    fs::write(path, rows_to_csv(&rows))
        .map_err(|e| format!("failed to write {}: {e}", path.display()))?;
    Ok(updated)
}

pub(crate) fn update_source_queue(
    path: &Path,
    queue_updates: &HashMap<String, QueueUpdate>,
    date: &str,
) -> Result<usize, String> {
    let raw =
        fs::read_to_string(path).map_err(|e| format!("failed to read {}: {e}", path.display()))?;
    let mut rows = parse_csv(&raw);
    if rows.is_empty() {
        return Err(format!("empty csv: {}", path.display()));
    }
    let idx = header_index(&rows[0]);
    let mut updated = 0usize;
    for row in rows.iter_mut().skip(1) {
        let queue_id = row_get(row, &idx, "queue_id");
        let Some(update) = queue_updates.get(queue_id) else {
            continue;
        };
        row_set(row, &idx, "status", update.status.clone());
        row_set(row, &idx, "last_updated", date.to_string());
        row_set(row, &idx, "owner", update.owner.clone());
        row_set(row, &idx, "notes", update.notes.clone());
        updated += 1;
    }
    fs::write(path, rows_to_csv(&rows))
        .map_err(|e| format!("failed to write {}: {e}", path.display()))?;
    Ok(updated)
}

pub(crate) fn overwrite_source_extract_log(
    path: &Path,
    header: &[String],
    rows: &[Vec<String>],
    date: &str,
) -> Result<usize, String> {
    let mut out = Vec::<Vec<String>>::new();
    out.push(header.to_vec());
    for row in rows {
        out.push(row.iter().map(|v| with_date(v, date)).collect::<Vec<_>>());
    }
    fs::write(path, rows_to_csv(&out))
        .map_err(|e| format!("failed to write {}: {e}", path.display()))?;
    Ok(rows.len())
}

pub(crate) fn upsert_source_extract_entries(
    path: &Path,
    entries: &[HashMap<String, String>],
    date: &str,
) -> Result<usize, String> {
    let raw =
        fs::read_to_string(path).map_err(|e| format!("failed to read {}: {e}", path.display()))?;
    let mut rows = parse_csv(&raw);
    if rows.is_empty() {
        return Err(format!("empty csv: {}", path.display()));
    }
    let header = rows[0].clone();
    let idx = header_index(&header);
    let mut by_id = HashMap::<String, usize>::new();
    for (i, row) in rows.iter().enumerate().skip(1) {
        by_id.insert(row_get(row, &idx, "extract_id").to_string(), i);
    }

    for entry in entries {
        let extract_id = entry.get("extract_id").cloned().unwrap_or_default();
        let row_data = header
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
            rows[i] = row_data;
        } else {
            rows.push(row_data);
        }
    }

    let mut body = rows.into_iter().skip(1).collect::<Vec<_>>();
    body.sort_by(|a, b| {
        compare_prefixed_numeric(
            row_get(a, &idx, "extract_id"),
            row_get(b, &idx, "extract_id"),
        )
    });
    let mut out = vec![header];
    out.extend(body);
    fs::write(path, rows_to_csv(&out))
        .map_err(|e| format!("failed to write {}: {e}", path.display()))?;
    Ok(entries.len())
}

pub(crate) fn write_markdown(path: &Path, content: &str) -> Result<(), String> {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("failed to create {}: {e}", parent.display()))?;
    }
    fs::write(path, content).map_err(|e| format!("failed to write {}: {e}", path.display()))
}

pub(crate) fn sweep_default_inference_file(edge_key: &str) -> String {
    let mut out = String::new();
    let mut prev_dash = false;
    for ch in edge_key.chars() {
        let mapped = if ch == '|' || ch == '/' {
            '-'
        } else {
            ch.to_ascii_lowercase()
        };
        if mapped == '-' {
            if prev_dash {
                continue;
            }
            prev_dash = true;
        } else {
            prev_dash = false;
        }
        out.push(mapped);
    }
    format!("docs/research-program/inferences/{out}.md")
}

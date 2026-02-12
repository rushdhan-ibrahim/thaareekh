use crate::csv_utils::{CsvRow, index_rows, read_ledger, row_value, take_row, to_csv};
use maldives_domain::{Dataset, Edge, Person};
use regex::Regex;
use serde_json::Value;
use std::collections::{BTreeMap, HashMap, HashSet};
use std::fmt::Write as FmtWrite;
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::OnceLock;

const PERSON_HEADER: &[&str] = &[
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
];

const RELATIONSHIP_HEADER: &[&str] = &[
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
];

const INFERENCE_HEADER: &[&str] = &[
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
];

const CONCEPT_HEADER: &[&str] = &[
    "concept_id",
    "canonical_label",
    "category",
    "period_scope",
    "linked_people_count",
    "linked_sources_count",
    "status",
    "entry_file",
    "last_updated",
    "notes",
];

fn today_iso() -> String {
    match std::process::Command::new("date").arg("+%F").output() {
        Ok(out) if out.status.success() => String::from_utf8_lossy(&out.stdout).trim().to_string(),
        _ => "1970-01-01".to_string(),
    }
}

fn person_id_number(id: &str) -> u64 {
    id.strip_prefix('P')
        .and_then(|v| v.parse::<u64>().ok())
        .unwrap_or(u64::MAX)
}

fn concept_id_number(id: &str) -> u64 {
    id.strip_prefix("CONCEPT-")
        .and_then(|v| v.parse::<u64>().ok())
        .unwrap_or(u64::MAX)
}

fn is_undirected(t: &str) -> bool {
    matches!(t, "sibling" | "spouse" | "kin")
}

fn edge_key(edge: &Edge) -> String {
    format!("{}|{}|{}|{}", edge.t, edge.s, edge.d, edge.l.trim())
}

fn normalized_edge_key(t: &str, source_id: &str, target_id: &str, label: &str) -> String {
    let label = label.trim();
    if is_undirected(t) {
        if source_id <= target_id {
            format!("{}|{}|{}|{}", t, source_id, target_id, label)
        } else {
            format!("{}|{}|{}|{}", t, target_id, source_id, label)
        }
    } else {
        format!("{}|{}|{}|{}", t, source_id, target_id, label)
    }
}

fn stable_edge_sort_key(edge: &Edge) -> String {
    let mut s = edge.s.clone();
    let mut d = edge.d.clone();
    if is_undirected(&edge.t) && s > d {
        std::mem::swap(&mut s, &mut d);
    }
    format!(
        "{}|{}|{}|{}|{}|{}|{}",
        edge.t,
        s,
        d,
        edge.l.trim(),
        edge.c,
        edge.claim_type,
        edge.confidence_grade
    )
}

fn normalize_refs_iter<I>(iter: I) -> Vec<String>
where
    I: IntoIterator<Item = String>,
{
    let mut out = Vec::new();
    let mut seen = HashSet::<String>::new();
    for raw in iter {
        let v = raw.trim().to_string();
        if v.is_empty() {
            continue;
        }
        if seen.insert(v.clone()) {
            out.push(v);
        }
    }
    out
}

fn normalize_refs_text(text: &str) -> Vec<String> {
    normalize_refs_iter(text.split('|').map(|v| v.to_string()).collect::<Vec<_>>())
}

fn normalize_refs_list(list: &[String]) -> Vec<String> {
    normalize_refs_iter(list.to_vec())
}

fn normalize_refs_value(value: Option<&Value>) -> Vec<String> {
    match value {
        Some(Value::Array(arr)) => normalize_refs_iter(
            arr.iter()
                .filter_map(|v| v.as_str().map(|s| s.to_string()))
                .collect::<Vec<_>>(),
        ),
        Some(Value::String(s)) => normalize_refs_text(s),
        _ => Vec::new(),
    }
}

fn parse_claim_id(claim_id: &str) -> Option<u32> {
    let raw = claim_id.strip_prefix("CLM-")?;
    raw.parse::<u32>().ok()
}

fn slugify(input: &str, max_len: usize) -> String {
    let mut out = String::new();
    let mut last_dash = false;

    for ch in input.chars() {
        if ch.is_ascii_alphanumeric() {
            out.push(ch.to_ascii_lowercase());
            last_dash = false;
        } else if !last_dash {
            out.push('-');
            last_dash = true;
        }
        if out.len() >= max_len {
            break;
        }
    }

    let trimmed = out.trim_matches('-').to_string();
    if trimmed.len() > max_len {
        trimmed[..max_len].trim_matches('-').to_string()
    } else {
        trimmed
    }
}

fn to_inference_slug(edge: &Edge) -> String {
    slugify(
        &normalized_edge_key(&edge.t, &edge.s, &edge.d, &edge.l),
        140,
    )
}

fn value_to_string(value: Option<&Value>) -> String {
    match value {
        Some(Value::String(s)) => s.to_string(),
        Some(Value::Number(n)) => n.to_string(),
        Some(Value::Bool(b)) => b.to_string(),
        Some(Value::Array(arr)) => arr
            .iter()
            .filter_map(|v| match v {
                Value::String(s) => Some(s.to_string()),
                Value::Number(n) => Some(n.to_string()),
                Value::Bool(b) => Some(b.to_string()),
                _ => None,
            })
            .collect::<Vec<_>>()
            .join(", "),
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
                _ => None,
            })
            .collect(),
        Some(Value::String(s)) => vec![s.to_string()],
        _ => Vec::new(),
    }
}

fn person_extra_string(person: &Person, key: &str) -> String {
    value_to_string(person.extra.get(key))
}

fn person_extra_strings(person: &Person, key: &str) -> Vec<String> {
    value_to_vec_strings(person.extra.get(key))
}

fn person_reign_windows(person: &Person) -> Vec<String> {
    let mut out = Vec::new();
    let Some(Value::Array(arr)) = person.extra.get("re") else {
        return out;
    };
    for item in arr {
        match item {
            Value::Array(pair) if pair.len() >= 2 => {
                let a = value_to_string(pair.first());
                let b = value_to_string(pair.get(1));
                if !a.is_empty() && !b.is_empty() {
                    out.push(format!("{a}-{b}"));
                }
            }
            Value::String(s) if !s.trim().is_empty() => out.push(s.to_string()),
            _ => {}
        }
    }
    out
}

fn relation_text(edge: &Edge, names: &HashMap<String, String>) -> String {
    let src = names
        .get(&edge.s)
        .cloned()
        .unwrap_or_else(|| edge.s.clone());
    let dst = names
        .get(&edge.d)
        .cloned()
        .unwrap_or_else(|| edge.d.clone());
    if edge.t == "parent" {
        format!("{src} as parent of {dst}")
    } else {
        format!("{src} and {dst}")
    }
}

fn default_claim_excerpt(edge: &Edge, names: &HashMap<String, String>) -> String {
    let rel_text = relation_text(edge, names);
    let label_text = if edge.l.trim().is_empty() {
        String::new()
    } else {
        format!(" ({})", edge.l.trim())
    };

    if edge.c == "i" {
        format!(
            "Inferred {}{} relation modeled between {}.",
            edge.t, label_text, rel_text
        )
    } else if edge.c == "u" {
        format!(
            "Contested {}{} relation retained for research comparison between {}.",
            edge.t, label_text, rel_text
        )
    } else {
        format!(
            "Direct {}{} relation recorded between {}.",
            edge.t, label_text, rel_text
        )
    }
}

fn default_claim_type(edge: &Edge) -> &'static str {
    if edge.c == "i" {
        "inferred"
    } else if edge.c == "u" {
        "contested"
    } else {
        "direct"
    }
}

fn default_grade(edge: &Edge) -> &'static str {
    if edge.c == "u" {
        "D"
    } else if edge.c == "i" {
        "C"
    } else {
        "B"
    }
}

fn default_review_status(edge: &Edge) -> &'static str {
    if edge.c == "c" { "todo" } else { "in_progress" }
}

fn is_rule_derived(edge: &Edge) -> bool {
    normalize_refs_list(&edge.evidence_refs)
        .iter()
        .any(|r| r == "SRC-DERIVED-RULES")
        || edge.event_context.starts_with("derived:")
}

fn make_person_dossier_stub(person: &Person, date: &str) -> String {
    let source_refs = normalize_refs_value(person.extra.get("source_refs"));
    let title_lines = {
        let items = person_extra_strings(person, "titles");
        if items.is_empty() {
            "- none recorded yet".to_string()
        } else {
            items
                .iter()
                .map(|v| format!("- {v}"))
                .collect::<Vec<_>>()
                .join("\n")
        }
    };
    let alias_lines = {
        let items = person_extra_strings(person, "aliases");
        if items.is_empty() {
            "- none recorded yet".to_string()
        } else {
            items
                .iter()
                .map(|v| format!("- {v}"))
                .collect::<Vec<_>>()
                .join("\n")
        }
    };
    let bio = person_extra_string(person, "bio").trim().to_string();
    let reign_windows = person_reign_windows(person);
    let throne_numbers = person_extra_strings(person, "n");

    let source_lines = if source_refs.is_empty() {
        "- none recorded yet".to_string()
    } else {
        source_refs
            .iter()
            .map(|id| format!("- `{id}`"))
            .collect::<Vec<_>>()
            .join("\n")
    };

    format!(
        "# Person Dossier\n\nPerson ID: `{}`  \nLast updated: `{}`  \nResearch status: `in_progress`\n\n## 1) Identity\n- Canonical display name: {}\n- Regnal name(s): {}\n- Dynasty / house: {}\n- Gender: {}\n- Throne number(s): {}\n\n## 2) Titles and aliases\n- Titles/styles:\n{}\n- Alias/transliteration set:\n{}\n\n## 3) Timeline and notes\n- Reign/rule windows: {}\n- Birth: {} ({})\n- Death: {} ({})\n- Biography summary:\n{}\n\n## 4) Evidence footprint\n- Node-level source refs ({}):\n{}\n\n## 5) Open research tasks\n- Add claim-level anchors and locator excerpts for high-impact relationships.\n- Expand title/office semantics and known-as variants.\n- Confirm chronology with independent corroboration where current support is single-source.\n",
        person.id,
        date,
        if person.nm.is_empty() {
            person.id.clone()
        } else {
            person.nm.clone()
        },
        person_extra_string(person, "rg").if_empty("Unknown"),
        if person.dy.is_empty() {
            "Unknown".to_string()
        } else {
            person.dy.clone()
        },
        person_extra_string(person, "g").if_empty("Unknown"),
        if throne_numbers.is_empty() {
            "Unknown".to_string()
        } else {
            throne_numbers.join(", ")
        },
        title_lines,
        alias_lines,
        if reign_windows.is_empty() {
            "Unknown".to_string()
        } else {
            reign_windows.join("; ")
        },
        person_extra_string(person, "yb").if_empty("Unknown"),
        person_extra_string(person, "pb").if_empty("Unknown"),
        person_extra_string(person, "yd").if_empty("Unknown"),
        person_extra_string(person, "pd").if_empty("Unknown"),
        if bio.is_empty() {
            "- Narrative summary pending expansion.".to_string()
        } else {
            format!("- {bio}")
        },
        source_refs.len(),
        source_lines
    )
}

trait StringExt {
    fn if_empty(self, fallback: &str) -> String;
}

impl StringExt for String {
    fn if_empty(self, fallback: &str) -> String {
        if self.trim().is_empty() {
            fallback.to_string()
        } else {
            self
        }
    }
}

fn regex_primary_label() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| Regex::new(r"(?m)^- Primary label:\s*(.+)$").expect("regex"))
}

fn regex_category() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| Regex::new(r"(?m)^Category:\s*`?([^`\n]+)`?").expect("regex"))
}

fn regex_period_scope() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| {
        Regex::new(r"(?m)^- Historical scope and periodization:\s*(.*)$").expect("regex")
    })
}

fn regex_last_updated() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| Regex::new(r"(?m)^Last updated:\s*`?(\d{4}-\d{2}-\d{2})`?").expect("regex"))
}

fn regex_people_code() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| Regex::new(r"`P\d+`").expect("regex"))
}

fn regex_source_code() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| Regex::new(r"`SRC-[A-Z0-9-]+`").expect("regex"))
}

struct ConceptMeta {
    canonical_label: String,
    category: String,
    period_scope_line: String,
    last_updated: String,
    linked_people_count: usize,
    linked_sources_count: usize,
}

fn parse_concept_meta(text: &str) -> ConceptMeta {
    let canonical_label = regex_primary_label()
        .captures(text)
        .and_then(|c| c.get(1).map(|m| m.as_str().trim().to_string()))
        .unwrap_or_default();
    let category = regex_category()
        .captures(text)
        .and_then(|c| c.get(1).map(|m| m.as_str().trim().to_string()))
        .unwrap_or_default();
    let period_scope_line = regex_period_scope()
        .captures(text)
        .and_then(|c| c.get(1).map(|m| m.as_str().trim().to_string()))
        .unwrap_or_default();
    let last_updated = regex_last_updated()
        .captures(text)
        .and_then(|c| c.get(1).map(|m| m.as_str().trim().to_string()))
        .unwrap_or_default();

    let linked_people_count = regex_people_code()
        .find_iter(text)
        .map(|m| m.as_str().trim_matches('`').to_string())
        .collect::<HashSet<_>>()
        .len();

    let linked_sources_count = regex_source_code()
        .find_iter(text)
        .map(|m| m.as_str().trim_matches('`').to_string())
        .collect::<HashSet<_>>()
        .len();

    ConceptMeta {
        canonical_label,
        category,
        period_scope_line,
        last_updated,
        linked_people_count,
        linked_sources_count,
    }
}

fn write_archive_if_needed(
    archive_dir: &Path,
    filename: &str,
    header: &[&str],
    rows: &[CsvRow],
) -> Result<Option<PathBuf>, String> {
    if rows.is_empty() {
        return Ok(None);
    }
    fs::create_dir_all(archive_dir)
        .map_err(|e| format!("failed to create {}: {e}", archive_dir.display()))?;
    let path = archive_dir.join(filename);
    fs::write(&path, to_csv(header, rows))
        .map_err(|e| format!("failed to write {}: {e}", path.display()))?;
    Ok(Some(path))
}

fn prev_value(prev: Option<&CsvRow>, key: &str) -> String {
    prev.map(|r| row_value(r, key).to_string())
        .unwrap_or_default()
}

fn is_concept_file(name: &str) -> bool {
    if !name.starts_with("CONCEPT-") || !name.ends_with(".md") {
        return false;
    }
    name.strip_prefix("CONCEPT-")
        .and_then(|v| v.strip_suffix(".md"))
        .and_then(|v| v.parse::<u64>().ok())
        .is_some()
}

fn row_with_pairs(pairs: &[(&str, String)]) -> CsvRow {
    pairs
        .iter()
        .map(|(k, v)| ((*k).to_string(), v.clone()))
        .collect::<BTreeMap<_, _>>()
}

pub fn run(dataset: &Dataset, root_dir: &str, date_opt: Option<&str>) -> Result<String, String> {
    let date = date_opt.map(|s| s.to_string()).unwrap_or_else(today_iso);

    let root = PathBuf::from(root_dir);
    let research_dir = root.join("docs").join("research-program");
    let ledger_dir = research_dir.join("ledgers");
    let people_dir = research_dir.join("people");
    let concept_dir = research_dir.join("concepts");
    let archive_dir = ledger_dir.join("archive");

    fs::create_dir_all(&ledger_dir)
        .map_err(|e| format!("failed to create {}: {e}", ledger_dir.display()))?;
    fs::create_dir_all(&people_dir)
        .map_err(|e| format!("failed to create {}: {e}", people_dir.display()))?;

    let person_path = ledger_dir.join("person-coverage.csv");
    let relation_path = ledger_dir.join("relationship-evidence-ledger.csv");
    let inference_path = ledger_dir.join("inference-dossier-tracker.csv");
    let concept_path = ledger_dir.join("concept-coverage.csv");

    let person_existing = read_ledger(&person_path, PERSON_HEADER)?;
    let relation_existing = read_ledger(&relation_path, RELATIONSHIP_HEADER)?;
    let inference_existing = read_ledger(&inference_path, INFERENCE_HEADER)?;
    let concept_existing = read_ledger(&concept_path, CONCEPT_HEADER)?;

    let person_by_id = person_existing
        .iter()
        .map(|row| (row_value(row, "person_id").to_string(), row))
        .collect::<HashMap<_, _>>();

    let mut sorted_people = dataset.people.clone();
    sorted_people.sort_by(|a, b| person_id_number(&a.id).cmp(&person_id_number(&b.id)));

    let mut person_rows = Vec::<CsvRow>::new();
    let mut created_person_dossiers = Vec::<String>::new();

    for person in &sorted_people {
        let prev = person_by_id.get(&person.id).copied();

        let display_name = if !person.nm.is_empty() {
            person.nm.clone()
        } else {
            let prev_name = prev_value(prev, "display_name");
            if !prev_name.is_empty() {
                prev_name
            } else {
                person_extra_string(person, "n")
            }
        };

        let source_refs_count = normalize_refs_value(person.extra.get("source_refs")).len();
        let aliases_count = person_extra_strings(person, "aliases").len();
        let titles_count = person_extra_strings(person, "titles").len();

        let mut row = row_with_pairs(&[
            ("person_id", person.id.clone()),
            ("display_name", display_name),
            (
                "dynasty",
                if !person.dy.is_empty() {
                    person.dy.clone()
                } else {
                    prev_value(prev, "dynasty")
                },
            ),
            ("reign_or_role", {
                let rg = person_extra_string(person, "rg");
                if !rg.is_empty() {
                    rg
                } else {
                    prev_value(prev, "reign_or_role")
                }
            }),
            ("person_confidence", {
                let confidence = person_extra_string(person, "person_confidence");
                if !confidence.is_empty() {
                    confidence
                } else {
                    prev_value(prev, "person_confidence")
                }
            }),
            ("source_refs_count", source_refs_count.to_string()),
            ("aliases_count", aliases_count.to_string()),
            ("titles_count", titles_count.to_string()),
            ("dossier_status", {
                let status = prev_value(prev, "dossier_status");
                if status.is_empty() {
                    "in_progress".to_string()
                } else {
                    status
                }
            }),
            ("dossier_file", {
                let path = prev_value(prev, "dossier_file");
                if path.is_empty() {
                    format!("docs/research-program/people/{}.md", person.id)
                } else {
                    path
                }
            }),
            ("last_updated", {
                let updated = prev_value(prev, "last_updated");
                if updated.is_empty() {
                    date.clone()
                } else {
                    updated
                }
            }),
            ("notes", {
                let notes = prev_value(prev, "notes");
                if notes.is_empty() {
                    "Row reconciled with current research graph.".to_string()
                } else {
                    notes
                }
            }),
        ]);

        let dossier_file = row_value(&row, "dossier_file").to_string();
        let dossier_path = root.join(&dossier_file);
        if !dossier_path.exists() {
            if let Some(parent) = dossier_path.parent() {
                fs::create_dir_all(parent)
                    .map_err(|e| format!("failed to create {}: {e}", parent.display()))?;
            }
            fs::write(&dossier_path, make_person_dossier_stub(person, &date))
                .map_err(|e| format!("failed to write {}: {e}", dossier_path.display()))?;
            created_person_dossiers.push(dossier_file);
            row.insert("last_updated".to_string(), date.clone());
            row.insert(
                "notes".to_string(),
                "Auto-created dossier stub during graph↔ledger reconciliation.".to_string(),
            );
        }

        person_rows.push(row);
    }

    let mut inference_used = HashSet::<usize>::new();
    let inference_exact = index_rows(&inference_existing, |row| {
        row_value(row, "edge_key").to_string()
    });
    let inference_norm = index_rows(&inference_existing, |row| {
        normalized_edge_key(
            row_value(row, "relation_type"),
            row_value(row, "source_id"),
            row_value(row, "target_id"),
            row_value(row, "label"),
        )
    });

    let mut inferred_edges = dataset
        .edges
        .iter()
        .filter(|edge| edge.c == "i")
        .cloned()
        .collect::<Vec<_>>();
    inferred_edges.sort_by(|a, b| stable_edge_sort_key(a).cmp(&stable_edge_sort_key(b)));

    let mut inference_rows = Vec::<CsvRow>::new();
    for edge in &inferred_edges {
        let ek = edge_key(edge);
        let mut prev_idx = take_row(&inference_exact, &ek, &mut inference_used);
        if prev_idx.is_none() && is_undirected(&edge.t) {
            prev_idx = take_row(
                &inference_norm,
                &normalized_edge_key(&edge.t, &edge.s, &edge.d, &edge.l),
                &mut inference_used,
            );
        }
        let prev = prev_idx.map(|idx| &inference_existing[idx]);

        let derived = is_rule_derived(edge);
        let inference_rule = if !edge.inference_rule.is_empty() {
            edge.inference_rule.clone()
        } else {
            prev_value(prev, "inference_rule")
        };

        let confidence_grade = if !edge.confidence_grade.is_empty() {
            edge.confidence_grade.clone()
        } else {
            let prev_grade = prev_value(prev, "confidence_grade");
            if prev_grade.is_empty() {
                default_grade(edge).to_string()
            } else {
                prev_grade
            }
        };

        let dossier_status = {
            let status = prev_value(prev, "dossier_status");
            if status.is_empty() {
                "in_progress".to_string()
            } else {
                status
            }
        };

        let dossier_file = {
            let path = prev_value(prev, "dossier_file");
            if path.is_empty() {
                format!(
                    "docs/research-program/inferences/{}.md",
                    to_inference_slug(edge)
                )
            } else {
                path
            }
        };

        let notes = {
            let existing = prev_value(prev, "notes");
            if !existing.is_empty() {
                existing
            } else if derived {
                "Rule-derived inference tracked for pair-specific dossier verification.".to_string()
            } else {
                "Curated inference tracked for pair-specific dossier verification.".to_string()
            }
        };

        inference_rows.push(row_with_pairs(&[
            ("edge_key", ek),
            ("relation_type", edge.t.clone()),
            ("source_id", edge.s.clone()),
            ("target_id", edge.d.clone()),
            ("label", edge.l.clone()),
            ("inference_class", {
                let klass = prev_value(prev, "inference_class");
                if klass.is_empty() {
                    if derived {
                        "rule-derived".to_string()
                    } else {
                        "curated".to_string()
                    }
                } else {
                    klass
                }
            }),
            ("inference_rule", inference_rule),
            ("confidence_grade", confidence_grade),
            (
                "evidence_refs",
                normalize_refs_list(&edge.evidence_refs).join("|"),
            ),
            ("dossier_status", dossier_status),
            ("dossier_file", dossier_file),
            ("last_updated", {
                let updated = prev_value(prev, "last_updated");
                if updated.is_empty() {
                    date.clone()
                } else {
                    updated
                }
            }),
            ("notes", notes),
        ]));
    }

    let inference_dossier_by_key = inference_rows
        .iter()
        .map(|row| {
            (
                row_value(row, "edge_key").to_string(),
                row_value(row, "dossier_file").to_string(),
            )
        })
        .collect::<HashMap<_, _>>();

    let mut relation_used = HashSet::<usize>::new();
    let relation_exact = index_rows(&relation_existing, |row| {
        row_value(row, "edge_key").to_string()
    });
    let relation_norm = index_rows(&relation_existing, |row| {
        normalized_edge_key(
            row_value(row, "relation_type"),
            row_value(row, "source_id"),
            row_value(row, "target_id"),
            row_value(row, "label"),
        )
    });

    let mut sorted_edges = dataset.edges.clone();
    sorted_edges.sort_by(|a, b| stable_edge_sort_key(a).cmp(&stable_edge_sort_key(b)));

    let names_by_id = dataset
        .people
        .iter()
        .map(|p| {
            (
                p.id.clone(),
                if p.nm.is_empty() {
                    p.id.clone()
                } else {
                    p.nm.clone()
                },
            )
        })
        .collect::<HashMap<_, _>>();

    let mut used_claim_ids = HashSet::<String>::new();
    let mut claim_counter = relation_existing
        .iter()
        .filter_map(|row| parse_claim_id(row_value(row, "claim_id")))
        .max()
        .unwrap_or(0);

    let mut relation_rows = Vec::<CsvRow>::new();

    for edge in &sorted_edges {
        let ek = edge_key(edge);
        let mut prev_idx = take_row(&relation_exact, &ek, &mut relation_used);
        if prev_idx.is_none() && is_undirected(&edge.t) {
            prev_idx = take_row(
                &relation_norm,
                &normalized_edge_key(&edge.t, &edge.s, &edge.d, &edge.l),
                &mut relation_used,
            );
        }
        let prev = prev_idx.map(|idx| &relation_existing[idx]);

        let mut claim_id = prev_value(prev, "claim_id");
        if parse_claim_id(&claim_id).is_none() || used_claim_ids.contains(&claim_id) {
            claim_counter += 1;
            claim_id = format!("CLM-{:04}", claim_counter);
        }
        used_claim_ids.insert(claim_id.clone());

        let refs = normalize_refs_list(&edge.evidence_refs);
        let inferred_dossier = inference_dossier_by_key
            .get(&ek)
            .cloned()
            .unwrap_or_default();
        let prev_primary = prev_value(prev, "primary_source_id");
        let base_source_id = if !refs.is_empty() {
            refs[0].clone()
        } else {
            prev_primary.clone()
        };

        let default_locator = if edge.c == "i" {
            if !inferred_dossier.is_empty() {
                format!("Inference basis documented in {inferred_dossier}.")
            } else {
                "Inference basis documented in pair dossier (path pending).".to_string()
            }
        } else if !base_source_id.is_empty() {
            format!(
                "Primary source {}; this claim is documented in the relationship ledger row and queued for quote-level locator refinement.",
                base_source_id
            )
        } else {
            "Primary source mapping pending for this claim row.".to_string()
        };

        let primary_source_id =
            if !prev_primary.is_empty() && refs.iter().any(|r| r == &prev_primary) {
                prev_primary
            } else if !refs.is_empty() {
                refs[0].clone()
            } else {
                prev_value(prev, "primary_source_id")
            };

        let claim_type = if !edge.claim_type.is_empty() {
            edge.claim_type.clone()
        } else {
            let prev_claim_type = prev_value(prev, "claim_type");
            if prev_claim_type.is_empty() {
                default_claim_type(edge).to_string()
            } else {
                prev_claim_type
            }
        };

        let confidence_grade = if !edge.confidence_grade.is_empty() {
            edge.confidence_grade.clone()
        } else {
            let prev_grade = prev_value(prev, "confidence_grade");
            if prev_grade.is_empty() {
                default_grade(edge).to_string()
            } else {
                prev_grade
            }
        };

        let claim_excerpt = {
            let existing = prev_value(prev, "claim_excerpt");
            if existing.is_empty() {
                default_claim_excerpt(edge, &names_by_id)
            } else {
                existing
            }
        };

        let citation_locator = {
            let existing = prev_value(prev, "citation_locator");
            if existing.is_empty() {
                default_locator
            } else {
                existing
            }
        };

        let review_status = {
            let existing = prev_value(prev, "review_status");
            if existing.is_empty() {
                default_review_status(edge).to_string()
            } else {
                existing
            }
        };

        let canonical_decision = {
            let existing = prev_value(prev, "canonical_decision");
            if existing.is_empty() {
                "pending".to_string()
            } else {
                existing
            }
        };

        let notes = {
            let existing = prev_value(prev, "notes");
            if !existing.is_empty() {
                existing
            } else if edge.c == "u" {
                "Conflicting/alternative claim retained in research mode for adjudication."
                    .to_string()
            } else if edge.c == "i" {
                "Inference claim tracked with pair-specific dossier linkage.".to_string()
            } else {
                "Direct claim tracked in research ledger.".to_string()
            }
        };

        relation_rows.push(row_with_pairs(&[
            ("claim_id", claim_id),
            ("edge_key", ek),
            ("relation_type", edge.t.clone()),
            ("source_id", edge.s.clone()),
            ("target_id", edge.d.clone()),
            ("label", edge.l.clone()),
            ("confidence", edge.c.clone()),
            ("claim_type", claim_type),
            ("confidence_grade", confidence_grade),
            ("evidence_refs", refs.join("|")),
            ("primary_source_id", primary_source_id),
            ("claim_excerpt", claim_excerpt),
            ("citation_locator", citation_locator),
            ("access_date", prev_value(prev, "access_date")),
            ("review_status", review_status),
            ("canonical_decision", canonical_decision),
            ("reviewer", prev_value(prev, "reviewer")),
            ("last_reviewed", prev_value(prev, "last_reviewed")),
            ("notes", notes),
        ]));
    }

    let concept_by_id = concept_existing
        .iter()
        .map(|row| (row_value(row, "concept_id").to_string(), row))
        .collect::<HashMap<_, _>>();

    let mut concept_files = if concept_dir.exists() {
        fs::read_dir(&concept_dir)
            .map_err(|e| format!("failed to read {}: {e}", concept_dir.display()))?
            .filter_map(|entry| entry.ok())
            .filter_map(|entry| entry.file_name().into_string().ok())
            .filter(|name| is_concept_file(name))
            .collect::<Vec<_>>()
    } else {
        Vec::new()
    };

    concept_files.sort_by(|a, b| {
        let aid = a.trim_end_matches(".md");
        let bid = b.trim_end_matches(".md");
        concept_id_number(aid).cmp(&concept_id_number(bid))
    });

    let mut concept_rows = Vec::<CsvRow>::new();

    for file in concept_files {
        let concept_id = file.trim_end_matches(".md").to_string();
        let rel_path = format!("docs/research-program/concepts/{file}");
        let full_path = concept_dir.join(&file);
        let text = fs::read_to_string(&full_path)
            .map_err(|e| format!("failed to read {}: {e}", full_path.display()))?;
        let meta = parse_concept_meta(&text);
        let prev = concept_by_id.get(&concept_id).copied();

        let prev_people_count = prev_value(prev, "linked_people_count")
            .parse::<usize>()
            .unwrap_or(0);
        let prev_sources_count = prev_value(prev, "linked_sources_count")
            .parse::<usize>()
            .unwrap_or(0);

        concept_rows.push(row_with_pairs(&[
            ("concept_id", concept_id.clone()),
            (
                "canonical_label",
                if !meta.canonical_label.is_empty() {
                    meta.canonical_label
                } else {
                    let existing = prev_value(prev, "canonical_label");
                    if existing.is_empty() {
                        concept_id.clone()
                    } else {
                        existing
                    }
                },
            ),
            (
                "category",
                if !meta.category.is_empty() {
                    meta.category
                } else {
                    let existing = prev_value(prev, "category");
                    if existing.is_empty() {
                        "concept".to_string()
                    } else {
                        existing
                    }
                },
            ),
            (
                "period_scope",
                if !meta.period_scope_line.is_empty() {
                    meta.period_scope_line
                } else {
                    let existing = prev_value(prev, "period_scope");
                    if existing.is_empty() {
                        "periodization in concept dossier".to_string()
                    } else {
                        existing
                    }
                },
            ),
            (
                "linked_people_count",
                if meta.linked_people_count > 0 {
                    meta.linked_people_count.to_string()
                } else {
                    prev_people_count.to_string()
                },
            ),
            (
                "linked_sources_count",
                if meta.linked_sources_count > 0 {
                    meta.linked_sources_count.to_string()
                } else {
                    prev_sources_count.to_string()
                },
            ),
            ("status", {
                let existing = prev_value(prev, "status");
                if existing.is_empty() {
                    "in_progress".to_string()
                } else {
                    existing
                }
            }),
            ("entry_file", {
                let existing = prev_value(prev, "entry_file");
                if existing.is_empty() {
                    rel_path
                } else {
                    existing
                }
            }),
            (
                "last_updated",
                if !meta.last_updated.is_empty() {
                    meta.last_updated
                } else {
                    let existing = prev_value(prev, "last_updated");
                    if existing.is_empty() {
                        date.clone()
                    } else {
                        existing
                    }
                },
            ),
            ("notes", {
                let existing = prev_value(prev, "notes");
                if existing.is_empty() {
                    "Row reconciled with concept dossier set.".to_string()
                } else {
                    existing
                }
            }),
        ]));
    }

    let person_id_set = dataset
        .people
        .iter()
        .map(|p| p.id.clone())
        .collect::<HashSet<_>>();
    let active_edge_keys = sorted_edges.iter().map(edge_key).collect::<HashSet<_>>();
    let active_inference_keys = inferred_edges.iter().map(edge_key).collect::<HashSet<_>>();
    let active_concept_ids = concept_rows
        .iter()
        .map(|row| row_value(row, "concept_id").to_string())
        .collect::<HashSet<_>>();

    let stale_person_rows = person_existing
        .iter()
        .filter(|row| !person_id_set.contains(row_value(row, "person_id")))
        .cloned()
        .collect::<Vec<_>>();
    let stale_relation_rows = relation_existing
        .iter()
        .filter(|row| !active_edge_keys.contains(row_value(row, "edge_key")))
        .cloned()
        .collect::<Vec<_>>();
    let stale_inference_rows = inference_existing
        .iter()
        .filter(|row| !active_inference_keys.contains(row_value(row, "edge_key")))
        .cloned()
        .collect::<Vec<_>>();
    let stale_concept_rows = concept_existing
        .iter()
        .filter(|row| !active_concept_ids.contains(row_value(row, "concept_id")))
        .cloned()
        .collect::<Vec<_>>();

    let mut archive_paths = Vec::<PathBuf>::new();
    if let Some(path) = write_archive_if_needed(
        &archive_dir,
        &format!("person-coverage-stale-{date}.csv"),
        PERSON_HEADER,
        &stale_person_rows,
    )? {
        archive_paths.push(path);
    }
    if let Some(path) = write_archive_if_needed(
        &archive_dir,
        &format!("relationship-evidence-ledger-stale-{date}.csv"),
        RELATIONSHIP_HEADER,
        &stale_relation_rows,
    )? {
        archive_paths.push(path);
    }
    if let Some(path) = write_archive_if_needed(
        &archive_dir,
        &format!("inference-dossier-tracker-stale-{date}.csv"),
        INFERENCE_HEADER,
        &stale_inference_rows,
    )? {
        archive_paths.push(path);
    }
    if let Some(path) = write_archive_if_needed(
        &archive_dir,
        &format!("concept-coverage-stale-{date}.csv"),
        CONCEPT_HEADER,
        &stale_concept_rows,
    )? {
        archive_paths.push(path);
    }

    fs::write(&person_path, to_csv(PERSON_HEADER, &person_rows))
        .map_err(|e| format!("failed to write {}: {e}", person_path.display()))?;
    fs::write(&relation_path, to_csv(RELATIONSHIP_HEADER, &relation_rows))
        .map_err(|e| format!("failed to write {}: {e}", relation_path.display()))?;
    fs::write(&inference_path, to_csv(INFERENCE_HEADER, &inference_rows))
        .map_err(|e| format!("failed to write {}: {e}", inference_path.display()))?;
    fs::write(&concept_path, to_csv(CONCEPT_HEADER, &concept_rows))
        .map_err(|e| format!("failed to write {}: {e}", concept_path.display()))?;

    let mut out = String::new();
    writeln!(&mut out, "Reconciled ledgers for {date}:").ok();
    writeln!(&mut out, "- people: {}", person_rows.len()).ok();
    writeln!(&mut out, "- relationships: {}", relation_rows.len()).ok();
    writeln!(&mut out, "- inferences: {}", inference_rows.len()).ok();
    writeln!(&mut out, "- concepts: {}", concept_rows.len()).ok();
    writeln!(
        &mut out,
        "- created person dossier stubs: {}",
        created_person_dossiers.len()
    )
    .ok();

    if archive_paths.is_empty() {
        writeln!(&mut out, "- archived stale ledgers: 0").ok();
    } else {
        writeln!(
            &mut out,
            "- archived stale ledgers: {}",
            archive_paths.len()
        )
        .ok();
        for path in &archive_paths {
            writeln!(&mut out, "  - {}", path.display()).ok();
        }
    }

    Ok(out)
}

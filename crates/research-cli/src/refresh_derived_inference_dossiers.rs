use crate::csv_utils::{csv_escape, parse_csv};
use crate::source_models::SourceRecord;
use maldives_domain::{Dataset, Edge, Person};
use serde_json::Value;
use std::collections::{HashMap, HashSet};
use std::fs;
use std::path::Path;

const OWNER_NOTE: &str = "Phase 2 rule-derived dossier hardening: pair-specific support chain, supporting claim IDs, and explicit rule verification criteria added.";

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

fn edge_key(edge: &Edge) -> String {
    format!("{}|{}|{}|{}", edge.t, edge.s, edge.d, edge.l)
}

fn reverse_edge_key(edge: &Edge) -> String {
    format!("{}|{}|{}|{}", edge.t, edge.d, edge.s, edge.l)
}

fn short(text: &str, max: usize) -> String {
    let cleaned = text.split_whitespace().collect::<Vec<_>>().join(" ");
    if cleaned.is_empty() {
        return String::new();
    }
    if cleaned.chars().count() <= max {
        return cleaned;
    }
    let take = max.saturating_sub(3);
    let head = cleaned.chars().take(take).collect::<String>();
    format!("{head}...")
}

fn person_string(person: &Person, key: &str) -> String {
    match person.extra.get(key) {
        Some(Value::String(s)) => s.to_string(),
        Some(Value::Number(n)) => n.to_string(),
        Some(Value::Bool(b)) => b.to_string(),
        _ => String::new(),
    }
}

fn person_label(by_person_id: &HashMap<String, &Person>, id: &str) -> String {
    let Some(person) = by_person_id.get(id) else {
        return id.to_string();
    };
    let reg = person_string(person, "rg");
    let suffix = if reg.is_empty() {
        String::new()
    } else {
        format!(" ({reg})")
    };
    format!(
        "{} {}{}",
        id,
        if person.nm.is_empty() {
            "(unnamed)"
        } else {
            person.nm.as_str()
        },
        suffix
    )
}

#[derive(Clone)]
struct TrackerKey {
    t: String,
    s: String,
    d: String,
    l: String,
}

fn split_tracker_key(key: &str) -> TrackerKey {
    let parts = key.split('|').collect::<Vec<_>>();
    TrackerKey {
        t: parts.first().copied().unwrap_or("").to_string(),
        s: parts.get(1).copied().unwrap_or("").to_string(),
        d: parts.get(2).copied().unwrap_or("").to_string(),
        l: if parts.len() > 3 {
            parts[3..].join("|")
        } else {
            String::new()
        },
    }
}

fn confidence_rank(grade: &str) -> u8 {
    match grade {
        "A" => 1,
        "B" => 2,
        "C" => 3,
        "D" => 4,
        _ => 9,
    }
}

#[derive(Clone)]
struct ClaimRow {
    claim_id: String,
    claim_excerpt: String,
    citation_locator: String,
    primary_source_id: String,
}

fn is_undirected(t: &str) -> bool {
    matches!(t, "sibling" | "spouse" | "kin")
}

fn edge_claim_for(edge: &Edge, claim_by_edge_key: &HashMap<String, ClaimRow>) -> Option<ClaimRow> {
    let key = edge_key(edge);
    if let Some(claim) = claim_by_edge_key.get(&key) {
        return Some(claim.clone());
    }
    if is_undirected(&edge.t) {
        let rev = reverse_edge_key(edge);
        if let Some(claim) = claim_by_edge_key.get(&rev) {
            return Some(claim.clone());
        }
    }
    None
}

#[derive(Clone)]
struct EdgeRef {
    t: String,
    s: String,
    d: String,
}

fn value_to_edge_ref(value: &Value) -> Option<EdgeRef> {
    let Value::Object(obj) = value else {
        return None;
    };
    let t = obj
        .get("t")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();
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
    if t.is_empty() || s.is_empty() || d.is_empty() {
        return None;
    }
    Some(EdgeRef { t, s, d })
}

fn support_edges_for_rule(rule: &str, basis: &Value) -> Vec<EdgeRef> {
    let Value::Object(obj) = basis else {
        return Vec::new();
    };

    let mut out = Vec::<EdgeRef>::new();
    let mut push_from_array = |key: &str| {
        if let Some(Value::Array(arr)) = obj.get(key) {
            for item in arr {
                if let Some(edge_ref) = value_to_edge_ref(item) {
                    out.push(edge_ref);
                }
            }
        }
    };

    if rule == "shared-parent-sibling" {
        push_from_array("parent_edges");
        return out;
    }
    if rule == "parent-of-parent-grandparent" {
        push_from_array("parent_edges");
        return out;
    }
    if rule == "parent-sibling-aunt-uncle" {
        push_from_array("supporting_edges");
        return out;
    }
    if rule == "children-of-siblings-cousin" {
        push_from_array("child_parent_edges");
        if let Some(value) = obj.get("parent_sibling_edge") {
            if let Some(edge_ref) = value_to_edge_ref(value) {
                out.push(edge_ref);
            }
        }
        return out;
    }

    out
}

fn find_best_dataset_edge(ref_edge: &EdgeRef, dataset_edges: &[Edge]) -> Option<Edge> {
    let primary = dataset_edges
        .iter()
        .filter(|edge| edge.t == ref_edge.t && edge.s == ref_edge.s && edge.d == ref_edge.d)
        .cloned()
        .collect::<Vec<_>>();
    let reversed = if is_undirected(&ref_edge.t) {
        dataset_edges
            .iter()
            .filter(|edge| edge.t == ref_edge.t && edge.s == ref_edge.d && edge.d == ref_edge.s)
            .cloned()
            .collect::<Vec<_>>()
    } else {
        Vec::new()
    };

    let mut candidates = primary
        .into_iter()
        .chain(reversed)
        .filter(|edge| edge.c == "c")
        .collect::<Vec<_>>();
    candidates.sort_by(|a, b| {
        confidence_rank(&a.confidence_grade).cmp(&confidence_rank(&b.confidence_grade))
    });
    candidates.into_iter().next()
}

fn rule_label(rule: &str) -> &'static str {
    match rule {
        "shared-parent-sibling" => "shared-parent-sibling",
        "parent-of-parent-grandparent" => "parent-of-parent-grandparent",
        "parent-sibling-aunt-uncle" => "parent-sibling-aunt-uncle",
        "children-of-siblings-cousin" => "children-of-siblings-cousin",
        _ => "derived-rule",
    }
}

fn rule_application_text(
    edge: &Edge,
    rule: &str,
    basis: &Value,
    by_person_id: &HashMap<String, &Person>,
) -> String {
    let src = person_label(by_person_id, &edge.s);
    let dst = person_label(by_person_id, &edge.d);
    let basis_obj = basis.as_object();

    if rule == "shared-parent-sibling" {
        let parent = basis_obj
            .and_then(|obj| obj.get("shared_parent"))
            .and_then(Value::as_str)
            .map(|id| person_label(by_person_id, id))
            .unwrap_or_else(|| "the same parent node".to_string());
        return format!(
            "Rule application ({}): because both endpoints share parent {}, {} and {} are modeled as inferred sibling-line kin.",
            rule_label(rule),
            parent,
            src,
            dst
        );
    }
    if rule == "parent-of-parent-grandparent" {
        let via = basis_obj
            .and_then(|obj| obj.get("via_parent"))
            .and_then(Value::as_str)
            .map(|id| person_label(by_person_id, id))
            .unwrap_or_else(|| "an intermediate parent node".to_string());
        return format!(
            "Rule application ({}): with source -> {} and {} -> target parent links, {} is modeled as inferred grandparent-line kin of {}.",
            rule_label(rule),
            via,
            via,
            src,
            dst
        );
    }
    if rule == "parent-sibling-aunt-uncle" {
        let via_parent = basis_obj
            .and_then(|obj| obj.get("via_parent"))
            .and_then(Value::as_str)
            .map(|id| person_label(by_person_id, id))
            .unwrap_or_else(|| "a parent anchor".to_string());
        let via_sib = basis_obj
            .and_then(|obj| obj.get("via_parent_sibling"))
            .and_then(Value::as_str)
            .map(|id| person_label(by_person_id, id))
            .unwrap_or_else(|| src.clone());
        return format!(
            "Rule application ({}): sibling({}, {}) plus parent({}, child) yields inferred aunt/uncle-line kin between {} and {}.",
            rule_label(rule),
            via_parent,
            via_sib,
            via_parent,
            src,
            dst
        );
    }
    if rule == "children-of-siblings-cousin" {
        let pair = basis_obj
            .and_then(|obj| obj.get("via_parent_siblings"))
            .and_then(Value::as_array)
            .map(|arr| {
                arr.iter()
                    .filter_map(Value::as_str)
                    .map(ToString::to_string)
                    .collect::<Vec<_>>()
            })
            .unwrap_or_default();
        if pair.len() == 2 {
            return format!(
                "Rule application ({}): children of sibling parents {} and {} are modeled as inferred cousin-line kin ({} <-> {}).",
                rule_label(rule),
                person_label(by_person_id, &pair[0]),
                person_label(by_person_id, &pair[1]),
                src,
                dst
            );
        }
        return format!(
            "Rule application ({}): children of sibling parents are modeled as inferred cousin-line kin for this pair.",
            rule_label(rule)
        );
    }

    format!(
        "Rule application ({}): this inferred edge is derived from structured support edges and remains provisional until directly sourced wording is found.",
        rule_label(rule)
    )
}

fn support_line(
    support_edge: &Edge,
    claim: Option<&ClaimRow>,
    by_person_id: &HashMap<String, &Person>,
) -> String {
    let arrow = if support_edge.t == "parent" {
        "->"
    } else {
        "<->"
    };
    let relation_label = if support_edge.l.is_empty() {
        String::new()
    } else {
        format!(" [{}]", support_edge.l)
    };
    let claim_id = claim
        .map(|c| c.claim_id.as_str())
        .filter(|v| !v.is_empty())
        .unwrap_or("claim-id-missing");
    let source = claim
        .map(|c| c.primary_source_id.as_str())
        .filter(|v| !v.is_empty())
        .or_else(|| support_edge.evidence_refs.first().map(|s| s.as_str()))
        .unwrap_or("source-missing");
    let grade = if support_edge.confidence_grade.is_empty() {
        "?"
    } else {
        support_edge.confidence_grade.as_str()
    };
    let excerpt = claim
        .map(|c| short(&c.claim_excerpt, 150))
        .unwrap_or_default();
    let excerpt_suffix = if excerpt.is_empty() {
        String::new()
    } else {
        format!("; excerpt: {excerpt}")
    };

    format!(
        "{} {} {} {}{} ({}, {}, grade {}){}",
        support_edge.t,
        person_label(by_person_id, &support_edge.s),
        arrow,
        person_label(by_person_id, &support_edge.d),
        relation_label,
        claim_id,
        source,
        grade,
        excerpt_suffix
    )
}

fn alternative_lines(rule: &str) -> [String; 2] {
    if rule == "shared-parent-sibling" {
        return [
            "Possible competing interpretation: half-sibling or cousin if one supporting parent edge is revised.".to_string(),
            "Contradiction trigger: direct sources assigning a different parent to one endpoint.".to_string(),
        ];
    }
    if rule == "parent-of-parent-grandparent" {
        return [
            "Possible competing interpretation: broader ancestor relation without explicit grandparent-level wording.".to_string(),
            "Contradiction trigger: updated parent edges that break the two-step parent chain.".to_string(),
        ];
    }
    if rule == "parent-sibling-aunt-uncle" {
        return [
            "Possible competing interpretation: cousin-line relation if the sibling basis edge changes generation mapping.".to_string(),
            "Contradiction trigger: revision/removal of either the parent edge or sibling edge in the rule basis.".to_string(),
        ];
    }
    if rule == "children-of-siblings-cousin" {
        return [
            "Possible competing interpretation: more distant collateral kin if parent-sibling linkage weakens.".to_string(),
            "Contradiction trigger: changes to either child-parent edge or the parent-sibling edge.".to_string(),
        ];
    }
    [
        "Possible competing interpretation: broad kin proximity without the current derived label."
            .to_string(),
        "Contradiction trigger: any revision that invalidates the support-edge rule chain."
            .to_string(),
    ]
}

fn verification_lines(
    edge: &Edge,
    rule: &str,
    by_person_id: &HashMap<String, &Person>,
) -> [String; 3] {
    let src = person_label(by_person_id, &edge.s);
    let dst = person_label(by_person_id, &edge.d);
    let label_suffix = if edge.l.is_empty() {
        String::new()
    } else {
        format!(" ({})", edge.l)
    };
    [
        format!(
            "Promotion requirement: explicit A/B source wording naming {} and {} as {}{}.",
            src, dst, edge.t, label_suffix
        ),
        format!(
            "Downgrade/removal trigger: source-backed changes to any support edge used by rule {}.",
            rule_label(rule)
        ),
        "Review cadence: recompute after any parent/sibling edge change in this local branch."
            .to_string(),
    ]
}

fn source_basis_lines(
    support_claims: &[Option<ClaimRow>],
    inferred_claim: &Option<ClaimRow>,
    source_by_id: &HashMap<String, SourceRecord>,
) -> Vec<String> {
    let mut source_ids = vec!["SRC-DERIVED-RULES".to_string()];
    source_ids.extend(
        support_claims
            .iter()
            .filter_map(|claim| claim.as_ref().map(|c| c.primary_source_id.clone()))
            .filter(|id| !id.is_empty())
            .collect::<Vec<_>>(),
    );
    if let Some(claim) = inferred_claim {
        if !claim.primary_source_id.is_empty() {
            source_ids.push(claim.primary_source_id.clone());
        }
    }
    let source_ids = unique(source_ids);

    let mut lines = source_ids
        .iter()
        .map(|id| {
            if let Some(src) = source_by_id.get(id) {
                format!("- `{}` ({})", id, src.title)
            } else {
                format!("- `{}` (source metadata not found)", id)
            }
        })
        .collect::<Vec<_>>();

    if let Some(claim) = inferred_claim {
        lines.push(format!(
            "- Primary inferred claim row: {}",
            if claim.claim_id.is_empty() {
                "(id missing)"
            } else {
                claim.claim_id.as_str()
            }
        ));
        lines.push(format!("- Inferred claim locator: {}", {
            let v = short(&claim.citation_locator, 260);
            if v.is_empty() {
                "locator missing".to_string()
            } else {
                v
            }
        }));
    } else {
        lines.push(
            "- Primary inferred claim row: not found in relationship ledger (requires reconciliation)."
                .to_string(),
        );
    }

    lines
}

fn build_dossier(
    edge: &Edge,
    tracker_key: &str,
    rule: &str,
    support_lines: &[String],
    inferred_claim: &Option<ClaimRow>,
    support_claims: &[Option<ClaimRow>],
    by_person_id: &HashMap<String, &Person>,
    source_by_id: &HashMap<String, SourceRecord>,
    dyn_context: &str,
    date: &str,
) -> String {
    let src = person_label(by_person_id, &edge.s);
    let dst = person_label(by_person_id, &edge.d);
    let label = if edge.l.is_empty() {
        "(no label)".to_string()
    } else {
        edge.l.clone()
    };
    let alternatives = alternative_lines(rule);
    let verifications = verification_lines(edge, rule, by_person_id);
    let source_basis = source_basis_lines(support_claims, inferred_claim, source_by_id);

    let mut logic_lines = Vec::<String>::new();
    if !support_lines.is_empty() {
        logic_lines.push(format!(
            "Support set for rule {} resolved as follows.",
            rule_label(rule)
        ));
        for line in support_lines {
            logic_lines.push(format!("Supporting edge: {line}"));
        }
        logic_lines.push(rule_application_text(
            edge,
            rule,
            &edge.inference_basis,
            by_person_id,
        ));
    } else {
        logic_lines.push(format!(
            "Supporting edge: unresolved from inference basis metadata for rule {}.",
            rule_label(rule)
        ));
        logic_lines.push(
            "This dossier should be re-generated after edge-basis reconciliation.".to_string(),
        );
    }
    logic_lines.push(format!(
        "Current modeling remains inferred because direct source text naming {}{} for this exact pair is not yet captured.",
        edge.t,
        if edge.l.is_empty() {
            String::new()
        } else {
            format!(" ({})", edge.l)
        }
    ));

    format!(
        "# Inference Dossier\n\nEdge key: `{}`  \nLast updated: `{}`  \nInference class: `rule-derived`\n\n## 1) Edge identity\n- Relation type: {}\n- Source node: {}\n- Target node: {}\n- Label: {}\n- Current confidence marker (`c/i/u`): {}\n- Current grade (`A/B/C/D`): {}\n\n## 2) Why this specific pair is modeled\n- Pair summary: {} and {} are modeled as inferred {}{} through rule `{}`.\n- Historical/dynastic context: {}\n- Rule basis status: {}.\n\n## 3) Logic chain (pair-specific)\n{}\n\n## 4) Alternative interpretations\n- {}\n- {}\n- Model-retention rationale: keep the edge inferred until pairwise direct wording is captured.\n\n## 5) Verification checklist\n- {}\n- {}\n- {}\n\n## 6) Source basis\n{}\n\n## 7) Integration notes\n- Rule metadata source: `edge.inference_basis` + `edge.inference_rule` on research dataset edge.\n- Canonical promotion candidate: no (remains inferred pending explicit pairwise wording).\n- If support edges change, re-run derived dossier refresh before any promotion decision.\n",
        tracker_key,
        date,
        edge.t,
        src,
        dst,
        label,
        if edge.c.is_empty() {
            "i"
        } else {
            edge.c.as_str()
        },
        if edge.confidence_grade.is_empty() {
            "?"
        } else {
            edge.confidence_grade.as_str()
        },
        src,
        dst,
        edge.t,
        if edge.l.is_empty() {
            String::new()
        } else {
            format!(" ({})", edge.l)
        },
        rule_label(rule),
        dyn_context,
        if support_lines.is_empty() {
            "unresolved support edges".to_string()
        } else {
            format!(
                "resolved ({} supporting edge{})",
                support_lines.len(),
                if support_lines.len() == 1 { "" } else { "s" }
            )
        },
        logic_lines
            .iter()
            .enumerate()
            .map(|(i, line)| format!("{}. {}", i + 1, line))
            .collect::<Vec<_>>()
            .join("\n"),
        alternatives[0],
        alternatives[1],
        verifications[0],
        verifications[1],
        verifications[2],
        source_basis.join("\n")
    )
}

pub fn run(
    dataset: &Dataset,
    sources: &[SourceRecord],
    root_dir: &str,
    date_opt: Option<&str>,
) -> Result<String, String> {
    let date = date_opt.map(ToString::to_string).unwrap_or_else(today_iso);
    let root = Path::new(root_dir);
    let relationship_ledger_path = root
        .join("docs")
        .join("research-program")
        .join("ledgers")
        .join("relationship-evidence-ledger.csv");
    let tracker_path = root
        .join("docs")
        .join("research-program")
        .join("ledgers")
        .join("inference-dossier-tracker.csv");

    let by_person_id = dataset
        .people
        .iter()
        .map(|person| (person.id.clone(), person))
        .collect::<HashMap<_, _>>();
    let source_by_id = sources
        .iter()
        .map(|s| (s.id.clone(), s.clone()))
        .collect::<HashMap<_, _>>();

    let relationship_csv = parse_csv(
        &fs::read_to_string(&relationship_ledger_path)
            .map_err(|e| format!("failed to read {}: {e}", relationship_ledger_path.display()))?,
    );
    if relationship_csv.is_empty() {
        return Err(format!("empty csv: {}", relationship_ledger_path.display()));
    }
    let rel_idx = header_index(&relationship_csv[0]);
    let mut claim_by_edge_key = HashMap::<String, ClaimRow>::new();
    for row in relationship_csv.iter().skip(1) {
        let key = row_get(row, &rel_idx, "edge_key").to_string();
        if key.is_empty() || claim_by_edge_key.contains_key(&key) {
            continue;
        }
        claim_by_edge_key.insert(
            key,
            ClaimRow {
                claim_id: row_get(row, &rel_idx, "claim_id").to_string(),
                claim_excerpt: row_get(row, &rel_idx, "claim_excerpt").to_string(),
                citation_locator: row_get(row, &rel_idx, "citation_locator").to_string(),
                primary_source_id: row_get(row, &rel_idx, "primary_source_id").to_string(),
            },
        );
    }

    let mut tracker_csv = parse_csv(
        &fs::read_to_string(&tracker_path)
            .map_err(|e| format!("failed to read {}: {e}", tracker_path.display()))?,
    );
    if tracker_csv.is_empty() {
        return Err(format!("empty csv: {}", tracker_path.display()));
    }
    let tracker_idx = header_index(&tracker_csv[0]);

    let mut rewritten = 0usize;
    for row in tracker_csv.iter_mut().skip(1) {
        if row_get(row, &tracker_idx, "inference_class") != "rule-derived" {
            continue;
        }

        let key = row_get(row, &tracker_idx, "edge_key").to_string();
        let parsed = split_tracker_key(&key);
        let rule = row_get(row, &tracker_idx, "inference_rule").to_string();

        let mut edge = dataset.edges.iter().find(|e| edge_key(e) == key).cloned();
        if edge.is_none()
            && !parsed.t.is_empty()
            && !parsed.s.is_empty()
            && !parsed.d.is_empty()
            && parsed.t != "parent"
        {
            edge = dataset
                .edges
                .iter()
                .find(|e| e.t == parsed.t && e.s == parsed.d && e.d == parsed.s && e.l == parsed.l)
                .cloned();
        }
        let Some(edge) = edge else {
            continue;
        };

        let canonical_edge = Edge {
            t: if parsed.t.is_empty() {
                edge.t.clone()
            } else {
                parsed.t.clone()
            },
            s: if parsed.s.is_empty() {
                edge.s.clone()
            } else {
                parsed.s.clone()
            },
            d: if parsed.d.is_empty() {
                edge.d.clone()
            } else {
                parsed.d.clone()
            },
            l: parsed.l.clone(),
            c: edge.c.clone(),
            claim_type: edge.claim_type.clone(),
            confidence_grade: edge.confidence_grade.clone(),
            evidence_refs: edge.evidence_refs.clone(),
            event_context: edge.event_context.clone(),
            inference_rule: edge.inference_rule.clone(),
            inference_basis: edge.inference_basis.clone(),
            extra: edge.extra.clone(),
        };

        let basis_edges = support_edges_for_rule(&rule, &edge.inference_basis);
        let support_resolved = basis_edges
            .iter()
            .filter_map(|edge_ref| find_best_dataset_edge(edge_ref, &dataset.edges))
            .collect::<Vec<_>>();
        let support_claims = support_resolved
            .iter()
            .map(|support| edge_claim_for(support, &claim_by_edge_key))
            .collect::<Vec<_>>();
        let support_lines = support_resolved
            .iter()
            .enumerate()
            .map(|(i, support)| support_line(support, support_claims[i].as_ref(), &by_person_id))
            .collect::<Vec<_>>();

        let inferred_claim = claim_by_edge_key
            .get(&key)
            .cloned()
            .or_else(|| edge_claim_for(&canonical_edge, &claim_by_edge_key));
        let dyn_context = format!(
            "{} -> {}",
            by_person_id
                .get(&canonical_edge.s)
                .map(|p| {
                    if p.dy.is_empty() {
                        "Unknown".to_string()
                    } else {
                        p.dy.clone()
                    }
                })
                .unwrap_or_else(|| "Unknown".to_string()),
            by_person_id
                .get(&canonical_edge.d)
                .map(|p| {
                    if p.dy.is_empty() {
                        "Unknown".to_string()
                    } else {
                        p.dy.clone()
                    }
                })
                .unwrap_or_else(|| "Unknown".to_string())
        );

        let dossier_rel_path = row_get(row, &tracker_idx, "dossier_file").to_string();
        let dossier_path = root.join(&dossier_rel_path);
        if let Some(parent) = dossier_path.parent() {
            fs::create_dir_all(parent)
                .map_err(|e| format!("failed to create {}: {e}", parent.display()))?;
        }
        fs::write(
            &dossier_path,
            build_dossier(
                &canonical_edge,
                &key,
                &rule,
                &support_lines,
                &inferred_claim,
                &support_claims,
                &by_person_id,
                &source_by_id,
                &dyn_context,
                &date,
            ),
        )
        .map_err(|e| format!("failed to write {}: {e}", dossier_path.display()))?;

        row_set(row, &tracker_idx, "last_updated", date.clone());
        row_set(row, &tracker_idx, "notes", OWNER_NOTE.to_string());
        rewritten += 1;
    }

    fs::write(&tracker_path, rows_to_csv(&tracker_csv))
        .map_err(|e| format!("failed to write {}: {e}", tracker_path.display()))?;

    Ok(format!(
        "Derived inference dossier refresh complete: {} files updated.\n",
        rewritten
    ))
}

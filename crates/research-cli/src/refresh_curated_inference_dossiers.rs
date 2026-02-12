use crate::csv_utils::{csv_escape, parse_csv};
use crate::source_models::SourceRecord;
use maldives_domain::{Dataset, Edge, Person};
use std::collections::{HashMap, HashSet, VecDeque};
use std::fs;
use std::path::Path;

const OWNER_NOTE: &str = "Phase 2 curated dossier hardening: pair-specific support chains, claim IDs, and verification criteria added.";

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

fn person_string(person: &Person, key: &str) -> String {
    match person.extra.get(key) {
        Some(serde_json::Value::String(s)) => s.to_string(),
        Some(serde_json::Value::Number(n)) => n.to_string(),
        Some(serde_json::Value::Bool(b)) => b.to_string(),
        _ => String::new(),
    }
}

fn person_label(by_person_id: &HashMap<String, &Person>, id: &str) -> String {
    let Some(person) = by_person_id.get(id) else {
        return id.to_string();
    };
    let regnal = person_string(person, "rg");
    let suffix = if regnal.is_empty() {
        String::new()
    } else {
        format!(" ({regnal})")
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

#[derive(Clone)]
struct ClaimRow {
    claim_id: String,
    citation_locator: String,
    primary_source_id: String,
}

fn claim_for_edge(edge: &Edge, claim_by_edge_key: &HashMap<String, ClaimRow>) -> Option<ClaimRow> {
    let key = edge_key(edge);
    if let Some(claim) = claim_by_edge_key.get(&key) {
        return Some(claim.clone());
    }
    if edge.t != "parent" {
        let reversed = reverse_edge_key(edge);
        if let Some(claim) = claim_by_edge_key.get(&reversed) {
            return Some(claim.clone());
        }
    }
    None
}

#[derive(Clone)]
struct PathStep {
    from: String,
    to: String,
    edge: Edge,
}

#[derive(Clone)]
struct Neighbor {
    to: String,
    edge: Edge,
}

fn build_adjacency(direct_edges: &[Edge]) -> HashMap<String, Vec<Neighbor>> {
    let mut map = HashMap::<String, Vec<Neighbor>>::new();
    let mut push = |from: &str, to: &str, edge: &Edge| {
        map.entry(from.to_string()).or_default().push(Neighbor {
            to: to.to_string(),
            edge: edge.clone(),
        });
    };

    for edge in direct_edges {
        if edge.t == "parent" {
            push(&edge.s, &edge.d, edge);
            push(&edge.d, &edge.s, edge);
            continue;
        }
        push(&edge.s, &edge.d, edge);
        push(&edge.d, &edge.s, edge);
    }
    map
}

fn find_shortest_path_undirected(
    source_id: &str,
    target_id: &str,
    adjacency: &HashMap<String, Vec<Neighbor>>,
    max_depth: usize,
) -> Option<Vec<PathStep>> {
    if source_id == target_id {
        return Some(Vec::new());
    }
    let mut queue = VecDeque::<(String, Vec<PathStep>)>::new();
    let mut seen = HashSet::<String>::new();
    queue.push_back((source_id.to_string(), Vec::new()));
    seen.insert(source_id.to_string());

    while let Some((node, path)) = queue.pop_front() {
        if path.len() >= max_depth {
            continue;
        }
        let neighbors = adjacency.get(&node).cloned().unwrap_or_default();
        for neighbor in neighbors {
            if seen.contains(&neighbor.to) {
                continue;
            }
            let mut next_path = path.clone();
            next_path.push(PathStep {
                from: node.clone(),
                to: neighbor.to.clone(),
                edge: neighbor.edge.clone(),
            });
            if neighbor.to == target_id {
                return Some(next_path);
            }
            seen.insert(neighbor.to.clone());
            queue.push_back((neighbor.to, next_path));
        }
    }
    None
}

fn find_directed_parent_path(
    source_id: &str,
    target_id: &str,
    direct_edges: &[Edge],
    max_depth: usize,
) -> Option<Vec<PathStep>> {
    let mut parent_adj = HashMap::<String, Vec<Edge>>::new();
    for edge in direct_edges {
        if edge.t != "parent" {
            continue;
        }
        parent_adj
            .entry(edge.s.clone())
            .or_default()
            .push(edge.clone());
    }

    let mut queue = VecDeque::<(String, Vec<PathStep>)>::new();
    let mut seen = HashSet::<String>::new();
    queue.push_back((source_id.to_string(), Vec::new()));
    seen.insert(source_id.to_string());

    while let Some((node, path)) = queue.pop_front() {
        if path.len() >= max_depth {
            continue;
        }
        for edge in parent_adj.get(&node).cloned().unwrap_or_default() {
            let child = edge.d.clone();
            if seen.contains(&child) {
                continue;
            }
            let mut next_path = path.clone();
            next_path.push(PathStep {
                from: node.clone(),
                to: child.clone(),
                edge: edge.clone(),
            });
            if child == target_id {
                return Some(next_path);
            }
            seen.insert(child.clone());
            queue.push_back((child, next_path));
        }
    }
    None
}

fn edge_step_text(
    step: &PathStep,
    by_person_id: &HashMap<String, &Person>,
    claim_by_edge_key: &HashMap<String, ClaimRow>,
) -> String {
    let claim = claim_for_edge(&step.edge, claim_by_edge_key);
    let rel_label = if step.edge.l.is_empty() {
        String::new()
    } else {
        format!(" [{}]", step.edge.l)
    };
    let arrow = if step.edge.t == "parent" { "->" } else { "<->" };
    let claim_id = claim
        .as_ref()
        .map(|c| c.claim_id.as_str())
        .filter(|v| !v.is_empty())
        .unwrap_or("claim-id-missing");
    let source = claim
        .as_ref()
        .map(|c| c.primary_source_id.as_str())
        .filter(|v| !v.is_empty())
        .or_else(|| step.edge.evidence_refs.first().map(|s| s.as_str()))
        .unwrap_or("source-missing");
    format!(
        "{} {} {} {}{} ({}, {})",
        step.edge.t,
        person_label(by_person_id, &step.from),
        arrow,
        person_label(by_person_id, &step.to),
        rel_label,
        claim_id,
        source
    )
}

fn local_anchor_lines(
    edge: &Edge,
    direct_edges: &[Edge],
    by_person_id: &HashMap<String, &Person>,
    claim_by_edge_key: &HashMap<String, ClaimRow>,
) -> Vec<String> {
    let mut candidates = direct_edges
        .iter()
        .filter(|d| d.s == edge.s || d.d == edge.s || d.s == edge.d || d.d == edge.d)
        .map(|d| {
            let claim = claim_for_edge(d, claim_by_edge_key);
            let claim_id = claim
                .as_ref()
                .map(|c| c.claim_id.clone())
                .filter(|v| !v.is_empty())
                .unwrap_or_else(|| "claim-id-missing".to_string());
            let grade = if d.confidence_grade.is_empty() {
                "?".to_string()
            } else {
                d.confidence_grade.clone()
            };
            (d.clone(), claim, claim_id, grade)
        })
        .collect::<Vec<_>>();

    let rank = |grade: &str| match grade {
        "A" => 1,
        "B" => 2,
        "C" => 3,
        "D" => 4,
        "?" => 9,
        _ => 9,
    };
    candidates.sort_by(|a, b| rank(&a.3).cmp(&rank(&b.3)).then(a.2.cmp(&b.2)));

    unique(
        candidates
            .into_iter()
            .take(6)
            .map(|(d, claim, claim_id, _)| {
                let rel_label = if d.l.is_empty() {
                    String::new()
                } else {
                    format!(" [{}]", d.l)
                };
                let arrow = if d.t == "parent" { "->" } else { "<->" };
                let source_id = claim
                    .as_ref()
                    .map(|c| c.primary_source_id.as_str())
                    .filter(|v| !v.is_empty())
                    .or_else(|| d.evidence_refs.first().map(|s| s.as_str()))
                    .unwrap_or("source-missing");
                format!(
                    "{}: {} {} {} {}{} ({}, grade {})",
                    claim_id,
                    d.t,
                    person_label(by_person_id, &d.s),
                    arrow,
                    person_label(by_person_id, &d.d),
                    rel_label,
                    source_id,
                    if d.confidence_grade.is_empty() {
                        "?"
                    } else {
                        d.confidence_grade.as_str()
                    }
                )
            })
            .collect::<Vec<_>>(),
    )
}

fn relation_alternative_hints(edge: &Edge) -> [String; 2] {
    if edge.t == "sibling" {
        return [
            "Possible competing interpretation: half-sibling or cousin if shared-parent evidence is partial rather than full.".to_string(),
            "Competing interpretation trigger: direct wording that uses non-sibling kin terminology for this pair.".to_string(),
        ];
    }
    if edge.t == "parent" {
        return [
            "Possible competing interpretation: grandparent or older collateral guardian-line relation instead of direct parent.".to_string(),
            "Competing interpretation trigger: explicit source naming a different immediate parent for the target node.".to_string(),
        ];
    }
    [
        "Possible competing interpretation: broader political/dynastic proximity without blood-kin specificity.".to_string(),
        "Competing interpretation trigger: explicit source that either gives a narrower relation or denies direct family continuity.".to_string(),
    ]
}

fn build_source_basis(
    edge: &Edge,
    inferred_claim: &Option<ClaimRow>,
    source_by_id: &HashMap<String, SourceRecord>,
) -> Vec<String> {
    let source_ids = unique(edge.evidence_refs.clone());
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

fn make_dossier(
    edge: &Edge,
    tracker_key: &str,
    inferred_claim: &Option<ClaimRow>,
    path: &Option<Vec<PathStep>>,
    anchors: &[String],
    by_person_id: &HashMap<String, &Person>,
    claim_by_edge_key: &HashMap<String, ClaimRow>,
    source_by_id: &HashMap<String, SourceRecord>,
    date: &str,
) -> String {
    let src = person_label(by_person_id, &edge.s);
    let dst = person_label(by_person_id, &edge.d);
    let label = if edge.l.is_empty() {
        "(no label)".to_string()
    } else {
        edge.l.clone()
    };
    let dyn_context = format!(
        "{} -> {}",
        by_person_id
            .get(&edge.s)
            .map(|p| {
                if p.dy.is_empty() {
                    "Unknown".to_string()
                } else {
                    p.dy.clone()
                }
            })
            .unwrap_or_else(|| "Unknown".to_string()),
        by_person_id
            .get(&edge.d)
            .map(|p| {
                if p.dy.is_empty() {
                    "Unknown".to_string()
                } else {
                    p.dy.clone()
                }
            })
            .unwrap_or_else(|| "Unknown".to_string())
    );

    let alt_hints = relation_alternative_hints(edge);
    let path_lines = path
        .as_ref()
        .map(|steps| {
            steps
                .iter()
                .map(|step| edge_step_text(step, by_person_id, claim_by_edge_key))
                .collect::<Vec<_>>()
        })
        .unwrap_or_default();

    let mut logic_lines = Vec::<String>::new();
    if !path_lines.is_empty() {
        logic_lines.push(format!(
            "Shortest direct-claim support path ({} step{}) linking this pair:",
            path_lines.len(),
            if path_lines.len() == 1 { "" } else { "s" }
        ));
        for line in &path_lines {
            logic_lines.push(format!("- {line}"));
        }
        logic_lines.push("This path provides relational adjacency support for the exact two nodes while still lacking explicit wording for the inferred relation label itself.".to_string());
    } else {
        logic_lines.push(
            "No short direct-claim path (<=4 steps) was found in the current direct-edge set for this exact node pair.".to_string(),
        );
        logic_lines.push("Inference currently rests on curated branch-context interpretation plus source-level continuity wording, not a direct named relation statement.".to_string());
    }
    logic_lines.push(format!(
        "Current modeling choice remains `inferred` because explicit source wording that names `{}` for {} and {} is still absent.",
        edge.t, src, dst
    ));

    let verification_items = [
        format!(
            "Promotion requirement: an A/B source statement explicitly naming {} and {} with relation class `{}`{}.",
            src,
            dst,
            edge.t,
            if edge.l.is_empty() {
                String::new()
            } else {
                format!(" ({})", edge.l)
            }
        ),
        "Downgrade/removal trigger: a stronger source that assigns incompatible parentage or explicitly contradicts this pairwise relation.".to_string(),
        "Review cadence: re-check after each source-ingestion batch touching this dynasty/branch cluster.".to_string(),
    ];

    let integration_items = [
        "`src/data/inference-notes.js` summary should be synced if relation wording changes after verification.".to_string(),
        "Canonical promotion candidate: no (remains inferred until explicit pairwise wording is captured).".to_string(),
        format!(
            "Verification priority level: {} (current grade {})",
            if edge.confidence_grade == "B" || edge.confidence_grade == "C" {
                "high"
            } else {
                "moderate"
            },
            if edge.confidence_grade.is_empty() {
                "?"
            } else {
                edge.confidence_grade.as_str()
            }
        ),
    ];

    format!(
        "# Inference Dossier\n\nEdge key: `{}`  \nLast updated: `{}`  \nInference class: `curated`\n\n## 1) Edge identity\n- Relation type: {}\n- Source node: {}\n- Target node: {}\n- Label: {}\n- Current confidence marker (`c/i/u`): {}\n- Current grade (`A/B/C/D`): {}\n\n## 2) Why this specific pair is modeled\n- Pair summary: {} and {} are modeled as `{}`{} to preserve a targeted continuity claim without over-promoting certainty.\n- Historical/dynastic context: {}\n- Immediate direct-claim anchors around these nodes:\n{}\n\n## 3) Logic chain (pair-specific)\n{}\n\n## 4) Alternative interpretations\n- {}\n- {}\n- Model-retention rationale: keep the edge as inferred until explicit pairwise wording is located.\n\n## 5) Verification checklist\n- {}\n- {}\n- {}\n\n## 6) Source basis\n{}\n\n## 7) Integration notes\n- {}\n- {}\n- {}\n",
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
            format!(" with label `{}`", edge.l)
        },
        dyn_context,
        if anchors.is_empty() {
            "- No direct local anchors found in current ledger rows.".to_string()
        } else {
            anchors
                .iter()
                .map(|line| format!("- {line}"))
                .collect::<Vec<_>>()
                .join("\n")
        },
        logic_lines
            .iter()
            .enumerate()
            .map(|(i, line)| format!("{}. {}", i + 1, line))
            .collect::<Vec<_>>()
            .join("\n"),
        alt_hints[0],
        alt_hints[1],
        verification_items[0],
        verification_items[1],
        verification_items[2],
        build_source_basis(edge, inferred_claim, source_by_id).join("\n"),
        integration_items[0],
        integration_items[1],
        integration_items[2]
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
    let relationship_idx = header_index(&relationship_csv[0]);
    let mut claim_by_edge_key = HashMap::<String, ClaimRow>::new();
    for row in relationship_csv.iter().skip(1) {
        let key = row_get(row, &relationship_idx, "edge_key").to_string();
        if key.is_empty() || claim_by_edge_key.contains_key(&key) {
            continue;
        }
        claim_by_edge_key.insert(
            key,
            ClaimRow {
                claim_id: row_get(row, &relationship_idx, "claim_id").to_string(),
                citation_locator: row_get(row, &relationship_idx, "citation_locator").to_string(),
                primary_source_id: row_get(row, &relationship_idx, "primary_source_id").to_string(),
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

    let direct_edges = dataset
        .edges
        .iter()
        .filter(|edge| edge.c == "c")
        .cloned()
        .collect::<Vec<_>>();
    let adjacency = build_adjacency(&direct_edges);

    let mut rewritten = 0usize;
    for row in tracker_csv.iter_mut().skip(1) {
        if row_get(row, &tracker_idx, "inference_class") != "curated" {
            continue;
        }

        let key = row_get(row, &tracker_idx, "edge_key").to_string();
        let parts = key.split('|').collect::<Vec<_>>();
        let relation_type = parts.first().copied().unwrap_or("").to_string();
        let source_id = parts.get(1).copied().unwrap_or("").to_string();
        let target_id = parts.get(2).copied().unwrap_or("").to_string();
        let label = if parts.len() > 3 {
            parts[3..].join("|")
        } else {
            String::new()
        };

        let mut inferred_edge = dataset
            .edges
            .iter()
            .find(|edge| edge_key(edge) == key)
            .cloned();
        if inferred_edge.is_none()
            && !relation_type.is_empty()
            && !source_id.is_empty()
            && !target_id.is_empty()
            && relation_type != "parent"
        {
            inferred_edge = dataset
                .edges
                .iter()
                .find(|edge| {
                    edge.t == relation_type
                        && edge.s == target_id
                        && edge.d == source_id
                        && edge.l == label
                })
                .cloned();
        }
        let Some(inferred_edge) = inferred_edge else {
            continue;
        };

        let canonical_edge = Edge {
            t: if relation_type.is_empty() {
                inferred_edge.t.clone()
            } else {
                relation_type.clone()
            },
            s: if source_id.is_empty() {
                inferred_edge.s.clone()
            } else {
                source_id.clone()
            },
            d: if target_id.is_empty() {
                inferred_edge.d.clone()
            } else {
                target_id.clone()
            },
            l: label.clone(),
            c: inferred_edge.c.clone(),
            claim_type: inferred_edge.claim_type.clone(),
            confidence_grade: inferred_edge.confidence_grade.clone(),
            evidence_refs: inferred_edge.evidence_refs.clone(),
            event_context: inferred_edge.event_context.clone(),
            inference_rule: inferred_edge.inference_rule.clone(),
            inference_basis: inferred_edge.inference_basis.clone(),
            extra: inferred_edge.extra.clone(),
        };

        let inferred_claim = claim_by_edge_key
            .get(&key)
            .cloned()
            .or_else(|| claim_for_edge(&canonical_edge, &claim_by_edge_key));
        let anchors = local_anchor_lines(
            &canonical_edge,
            &direct_edges,
            &by_person_id,
            &claim_by_edge_key,
        );

        let path = if canonical_edge.t == "parent" {
            find_directed_parent_path(&canonical_edge.s, &canonical_edge.d, &direct_edges, 4)
                .or_else(|| {
                    find_shortest_path_undirected(
                        &canonical_edge.s,
                        &canonical_edge.d,
                        &adjacency,
                        4,
                    )
                })
        } else {
            find_shortest_path_undirected(&canonical_edge.s, &canonical_edge.d, &adjacency, 4)
        };

        let dossier_rel_path = row_get(row, &tracker_idx, "dossier_file").to_string();
        let dossier_path = root.join(&dossier_rel_path);
        if let Some(parent) = dossier_path.parent() {
            fs::create_dir_all(parent)
                .map_err(|e| format!("failed to create {}: {e}", parent.display()))?;
        }
        fs::write(
            &dossier_path,
            make_dossier(
                &canonical_edge,
                &key,
                &inferred_claim,
                &path,
                &anchors,
                &by_person_id,
                &claim_by_edge_key,
                &source_by_id,
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
        "Curated inference dossier refresh complete: {} files updated.\n",
        rewritten
    ))
}

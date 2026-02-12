use indexmap::{IndexMap, IndexSet};
use maldives_domain::{BaselineSnapshot, Dataset, DatasetStats, Edge, Person};
use serde_json::{Value, json};
use std::collections::{BTreeMap, BTreeSet, HashSet};

fn increment(map: &mut BTreeMap<String, u64>, key: &str) {
    let entry = map.entry(key.to_string()).or_insert(0);
    *entry += 1;
}

fn directed_key(t: &str, s: &str, d: &str) -> String {
    format!("{t}|{s}|{d}")
}

fn undirected_key(t: &str, a: &str, b: &str) -> String {
    if a <= b {
        format!("{t}|{a}|{b}")
    } else {
        format!("{t}|{b}|{a}")
    }
}

fn compare_split_map(
    mode: &str,
    split_label: &str,
    expected: &BTreeMap<String, u64>,
    actual: &BTreeMap<String, u64>,
    issues: &mut Vec<String>,
) {
    let keys = expected
        .keys()
        .chain(actual.keys())
        .cloned()
        .collect::<BTreeSet<_>>();

    for key in keys {
        let expected_value = expected.get(&key).copied().unwrap_or_default();
        let actual_value = actual.get(&key).copied().unwrap_or_default();
        if expected_value != actual_value {
            issues.push(format!(
                "datasets.{mode}.{split_label}.{key} expected {expected_value} != actual {actual_value}"
            ));
        }
    }
}

fn add_to_index_set(map: &mut IndexMap<String, IndexSet<String>>, key: &str, value: &str) {
    map.entry(key.to_string())
        .or_default()
        .insert(value.to_string());
}

pub fn compute_dataset_stats(dataset: &Dataset) -> DatasetStats {
    let mut stats = DatasetStats {
        people: dataset.people.len() as u64,
        edges: dataset.edges.len() as u64,
        ..DatasetStats::default()
    };

    for edge in &dataset.edges {
        increment(
            &mut stats.confidence_split,
            if edge.c.is_empty() { "?" } else { &edge.c },
        );
        increment(
            &mut stats.relation_split,
            if edge.t.is_empty() { "?" } else { &edge.t },
        );
        increment(
            &mut stats.claim_type_split,
            if edge.claim_type.is_empty() {
                "unknown"
            } else {
                &edge.claim_type
            },
        );
        increment(
            &mut stats.confidence_grade_split,
            if edge.confidence_grade.is_empty() {
                "?"
            } else {
                &edge.confidence_grade
            },
        );

        if edge.c == "i" {
            stats.inferred_edges += 1;
        }
        if edge.c == "u" {
            stats.uncertain_edges += 1;
        }

        if !edge.evidence_refs.is_empty() {
            stats.edges_with_evidence_refs += 1;
        }
        if edge.evidence_refs.len() > 1 {
            stats.multi_source_edges += 1;
        }
    }

    stats
}

pub fn normalized_edge_key(edge: &Edge) -> String {
    let undirected = matches!(edge.t.as_str(), "sibling" | "spouse" | "kin");
    if undirected {
        let mut ends = [edge.s.as_str(), edge.d.as_str()];
        ends.sort();
        return format!(
            "{}|{}|{}|{}|{}|{}|{}",
            edge.t,
            ends[0],
            ends[1],
            edge.l.trim(),
            edge.c,
            edge.claim_type,
            edge.confidence_grade
        );
    }

    format!(
        "{}|{}|{}|{}|{}|{}|{}",
        edge.t,
        edge.s,
        edge.d,
        edge.l.trim(),
        edge.c,
        edge.claim_type,
        edge.confidence_grade
    )
}

pub fn normalize_edge(edge: &Edge) -> Edge {
    let mut out = edge.clone();
    if out.confidence_grade.is_empty() {
        out.confidence_grade = match out.c.as_str() {
            "u" => "D".to_string(),
            "i" => "C".to_string(),
            _ => "B".to_string(),
        };
    }
    if out.claim_type.is_empty() {
        out.claim_type = match out.c.as_str() {
            "u" => "contested".to_string(),
            "i" => "inferred".to_string(),
            _ => "direct".to_string(),
        };
    }
    if out.evidence_refs.is_empty() {
        out.evidence_refs = vec!["SRC-MRF-KINGS".to_string()];
    }
    out
}

pub fn merge_unique_edges(base: &[Edge], extra: &[Edge]) -> Vec<Edge> {
    let mut out = base.to_vec();
    let mut seen = out
        .iter()
        .map(normalized_edge_key)
        .collect::<HashSet<String>>();

    for edge in extra {
        let key = normalized_edge_key(edge);
        if seen.insert(key) {
            out.push(edge.clone());
        }
    }

    out
}

fn inferred_edge(
    t: &str,
    s: &str,
    d: &str,
    l: &str,
    event_context: &str,
    inference_rule: &str,
    inference_basis: Value,
) -> Edge {
    Edge {
        t: t.to_string(),
        s: s.to_string(),
        d: d.to_string(),
        l: l.to_string(),
        c: "i".to_string(),
        claim_type: "inferred".to_string(),
        confidence_grade: "C".to_string(),
        evidence_refs: vec!["SRC-DERIVED-RULES".to_string()],
        event_context: event_context.to_string(),
        inference_rule: inference_rule.to_string(),
        inference_basis,
        extra: BTreeMap::new(),
    }
}

pub fn expand_derived_relations(people: &[Person], edges: &[Edge]) -> Vec<Edge> {
    let by_id = people
        .iter()
        .map(|p| p.id.clone())
        .collect::<HashSet<String>>();

    let mut has_directed = HashSet::new();
    let mut has_undirected = HashSet::new();

    for edge in edges {
        has_directed.insert(directed_key(&edge.t, &edge.s, &edge.d));
        if matches!(edge.t.as_str(), "sibling" | "spouse" | "kin") {
            has_undirected.insert(undirected_key(&edge.t, &edge.s, &edge.d));
        }
    }

    let parent_edges = edges
        .iter()
        .filter(|e| e.t == "parent" && e.c != "u")
        .cloned()
        .collect::<Vec<_>>();

    let mut parents_by_child: IndexMap<String, IndexSet<String>> = IndexMap::new();
    let mut children_by_parent: IndexMap<String, IndexSet<String>> = IndexMap::new();
    for edge in &parent_edges {
        add_to_index_set(&mut parents_by_child, &edge.d, &edge.s);
        add_to_index_set(&mut children_by_parent, &edge.s, &edge.d);
    }

    let mut sibling_map: IndexMap<String, IndexSet<String>> = IndexMap::new();
    for edge in edges.iter().filter(|e| e.t == "sibling" && e.c != "u") {
        add_to_index_set(&mut sibling_map, &edge.s, &edge.d);
        add_to_index_set(&mut sibling_map, &edge.d, &edge.s);
    }

    let mut derived = Vec::new();

    let add_derived = |edge: Edge,
                       has_directed: &mut HashSet<String>,
                       has_undirected: &mut HashSet<String>,
                       derived: &mut Vec<Edge>| {
        if matches!(edge.t.as_str(), "sibling" | "spouse" | "kin") {
            let key = undirected_key(&edge.t, &edge.s, &edge.d);
            if !has_undirected.insert(key) {
                return;
            }
        } else {
            let key = directed_key(&edge.t, &edge.s, &edge.d);
            if !has_directed.insert(key) {
                return;
            }
        }
        derived.push(edge);
    };

    // 1) siblings from shared parent
    for (parent, children_set) in &children_by_parent {
        let children = children_set.iter().cloned().collect::<Vec<_>>();
        for i in 0..children.len() {
            for j in (i + 1)..children.len() {
                let a = &children[i];
                let b = &children[j];
                if !by_id.contains(a) || !by_id.contains(b) {
                    continue;
                }
                add_derived(
                    inferred_edge(
                        "sibling",
                        a,
                        b,
                        "siblings (shared parent)",
                        "derived:shared-parent",
                        "shared-parent-sibling",
                        json!({
                            "shared_parent": parent,
                            "parent_edges": [
                                { "s": parent, "d": a, "t": "parent" },
                                { "s": parent, "d": b, "t": "parent" }
                            ]
                        }),
                    ),
                    &mut has_directed,
                    &mut has_undirected,
                    &mut derived,
                );
                add_to_index_set(&mut sibling_map, a, b);
                add_to_index_set(&mut sibling_map, b, a);
            }
        }

        // keep parent in scope so lint doesn't suggest underscore name later
        let _ = parent;
    }

    // 2) grandparent (parent of parent)
    for (child, parents) in &parents_by_child {
        for parent in parents {
            if let Some(grandparents) = parents_by_child.get(parent) {
                for gp in grandparents {
                    if gp == child || !by_id.contains(gp) || !by_id.contains(child) {
                        continue;
                    }
                    if has_directed.contains(&directed_key("parent", gp, child)) {
                        continue;
                    }
                    add_derived(
                        inferred_edge(
                            "kin",
                            gp,
                            child,
                            "grandparent",
                            "derived:parent-of-parent",
                            "parent-of-parent-grandparent",
                            json!({
                                "via_parent": parent,
                                "parent_edges": [
                                    { "s": gp, "d": parent, "t": "parent" },
                                    { "s": parent, "d": child, "t": "parent" }
                                ]
                            }),
                        ),
                        &mut has_directed,
                        &mut has_undirected,
                        &mut derived,
                    );
                }
            }
        }
    }

    // 3) aunt/uncle from parent sibling
    for (child, parents) in &parents_by_child {
        for parent in parents {
            if let Some(sibs) = sibling_map.get(parent) {
                for sib in sibs {
                    if sib == child || !by_id.contains(sib) || !by_id.contains(child) {
                        continue;
                    }
                    if has_directed.contains(&directed_key("parent", sib, child))
                        || has_directed.contains(&directed_key("parent", child, sib))
                    {
                        continue;
                    }
                    add_derived(
                        inferred_edge(
                            "kin",
                            sib,
                            child,
                            "aunt/uncle↔niece/nephew",
                            "derived:parent-sibling",
                            "parent-sibling-aunt-uncle",
                            json!({
                                "via_parent": parent,
                                "via_parent_sibling": sib,
                                "supporting_edges": [
                                    { "s": parent, "d": child, "t": "parent" },
                                    { "s": parent, "d": sib, "t": "sibling" }
                                ]
                            }),
                        ),
                        &mut has_directed,
                        &mut has_undirected,
                        &mut derived,
                    );
                }
            }
        }
    }

    // 4) cousins from children of siblings
    let mut sibling_pairs = Vec::new();
    let mut seen_pairs = HashSet::new();
    for (a, sibs) in &sibling_map {
        for b in sibs {
            let key = if a <= b {
                format!("{a}|{b}")
            } else {
                format!("{b}|{a}")
            };
            if seen_pairs.insert(key) {
                sibling_pairs.push((a.clone(), b.clone()));
            }
        }
    }

    for (a, b) in sibling_pairs {
        let a_kids = children_by_parent
            .get(&a)
            .cloned()
            .unwrap_or_default()
            .into_iter()
            .collect::<Vec<_>>();
        let b_kids = children_by_parent
            .get(&b)
            .cloned()
            .unwrap_or_default()
            .into_iter()
            .collect::<Vec<_>>();

        for c1 in &a_kids {
            for c2 in &b_kids {
                if c1 == c2 || !by_id.contains(c1) || !by_id.contains(c2) {
                    continue;
                }
                if has_undirected.contains(&undirected_key("sibling", c1, c2)) {
                    continue;
                }
                if has_directed.contains(&directed_key("parent", c1, c2))
                    || has_directed.contains(&directed_key("parent", c2, c1))
                {
                    continue;
                }
                add_derived(
                    inferred_edge(
                        "kin",
                        c1,
                        c2,
                        "cousins",
                        "derived:children-of-siblings",
                        "children-of-siblings-cousin",
                        json!({
                            "via_parent_siblings": [a, b],
                            "child_parent_edges": [
                                { "s": a, "d": c1, "t": "parent" },
                                { "s": b, "d": c2, "t": "parent" }
                            ],
                            "parent_sibling_edge": { "s": a, "d": b, "t": "sibling" }
                        }),
                    ),
                    &mut has_directed,
                    &mut has_undirected,
                    &mut derived,
                );
            }
        }
    }

    derived
}

pub fn compare_against_baseline(
    mode: &str,
    baseline: &BaselineSnapshot,
    actual: &DatasetStats,
) -> Vec<String> {
    let mut issues = Vec::new();
    let Some(expected) = baseline.datasets.get(mode) else {
        issues.push(format!("missing baseline.datasets.{mode}"));
        return issues;
    };

    if expected.people != actual.people {
        issues.push(format!(
            "datasets.{mode}.people expected {} != actual {}",
            expected.people, actual.people
        ));
    }
    if expected.edges != actual.edges {
        issues.push(format!(
            "datasets.{mode}.edges expected {} != actual {}",
            expected.edges, actual.edges
        ));
    }
    if expected.inferred_edges != actual.inferred_edges {
        issues.push(format!(
            "datasets.{mode}.inferred_edges expected {} != actual {}",
            expected.inferred_edges, actual.inferred_edges
        ));
    }
    if expected.uncertain_edges != actual.uncertain_edges {
        issues.push(format!(
            "datasets.{mode}.uncertain_edges expected {} != actual {}",
            expected.uncertain_edges, actual.uncertain_edges
        ));
    }
    if expected.edges_with_evidence_refs != actual.edges_with_evidence_refs {
        issues.push(format!(
            "datasets.{mode}.edges_with_evidence_refs expected {} != actual {}",
            expected.edges_with_evidence_refs, actual.edges_with_evidence_refs
        ));
    }
    if expected.multi_source_edges != actual.multi_source_edges {
        issues.push(format!(
            "datasets.{mode}.multi_source_edges expected {} != actual {}",
            expected.multi_source_edges, actual.multi_source_edges
        ));
    }

    compare_split_map(
        mode,
        "confidence_split",
        &expected.confidence_split,
        &actual.confidence_split,
        &mut issues,
    );
    compare_split_map(
        mode,
        "relation_split",
        &expected.relation_split,
        &actual.relation_split,
        &mut issues,
    );
    compare_split_map(
        mode,
        "claim_type_split",
        &expected.claim_type_split,
        &actual.claim_type_split,
        &mut issues,
    );
    compare_split_map(
        mode,
        "confidence_grade_split",
        &expected.confidence_grade_split,
        &actual.confidence_grade_split,
        &mut issues,
    );

    issues
}

#[cfg(test)]
mod tests {
    use super::{expand_derived_relations, normalized_edge_key};
    use maldives_domain::{Edge, Person};
    use serde_json::Value;
    use std::collections::BTreeMap;

    fn sample_edge(t: &str, s: &str, d: &str) -> Edge {
        Edge {
            t: t.to_string(),
            s: s.to_string(),
            d: d.to_string(),
            l: String::new(),
            c: "c".to_string(),
            claim_type: "direct".to_string(),
            confidence_grade: "B".to_string(),
            evidence_refs: vec![],
            event_context: String::new(),
            inference_rule: String::new(),
            inference_basis: Value::Null,
            extra: BTreeMap::new(),
        }
    }

    fn sample_person(id: &str) -> Person {
        Person {
            id: id.to_string(),
            nm: String::new(),
            dy: String::new(),
            extra: BTreeMap::new(),
        }
    }

    #[test]
    fn undirected_key_is_order_independent() {
        let a = sample_edge("sibling", "P10", "P2");
        let b = sample_edge("sibling", "P2", "P10");
        assert_eq!(normalized_edge_key(&a), normalized_edge_key(&b));
    }

    #[test]
    fn directed_key_preserves_order() {
        let a = sample_edge("parent", "P10", "P2");
        let b = sample_edge("parent", "P2", "P10");
        assert_ne!(normalized_edge_key(&a), normalized_edge_key(&b));
    }

    #[test]
    fn derives_siblings_and_grandparents() {
        let people = vec![
            sample_person("P1"),
            sample_person("P2"),
            sample_person("P3"),
            sample_person("P4"),
        ];
        let edges = vec![
            sample_edge("parent", "P1", "P2"),
            sample_edge("parent", "P1", "P3"),
            sample_edge("parent", "P2", "P4"),
        ];

        let derived = expand_derived_relations(&people, &edges);
        assert!(derived.iter().any(|e| {
            e.t == "sibling" && ((e.s == "P2" && e.d == "P3") || (e.s == "P3" && e.d == "P2"))
        }));
        assert!(
            derived
                .iter()
                .any(|e| e.t == "kin" && e.s == "P1" && e.d == "P4" && e.l == "grandparent")
        );
    }
}

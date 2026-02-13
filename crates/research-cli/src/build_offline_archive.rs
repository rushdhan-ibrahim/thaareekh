use maldives_domain::{Dataset, Edge, Person};
use serde_json::{Map, Value, json};
use std::collections::{HashMap, HashSet};
use std::fs;
use std::path::{Path, PathBuf};

#[derive(Default)]
struct SourceClaims {
    people: Vec<Value>,
    edges: Vec<Value>,
}

fn now_iso() -> String {
    match std::process::Command::new("date")
        .args(["-u", "+%Y-%m-%dT%H:%M:%S.000Z"])
        .output()
    {
        Ok(out) if out.status.success() => String::from_utf8_lossy(&out.stdout).trim().to_string(),
        _ => "1970-01-01T00:00:00.000Z".to_string(),
    }
}

fn read_json(path: &str) -> Result<Value, String> {
    let raw = fs::read_to_string(path).map_err(|e| format!("failed to read {path}: {e}"))?;
    serde_json::from_str(&raw).map_err(|e| format!("failed to parse json at {path}: {e}"))
}

fn parse_sources_payload(payload: &Value) -> Result<Vec<Value>, String> {
    if let Some(arr) = payload.as_array() {
        return Ok(arr.clone());
    }
    if let Some(arr) = payload.get("sources").and_then(Value::as_array) {
        return Ok(arr.clone());
    }
    Err("sources payload must be an array or an object with 'sources' array".to_string())
}

fn resolve_output_path(output_path: &str) -> Result<PathBuf, String> {
    let path = Path::new(output_path);
    if path.is_absolute() {
        return Ok(path.to_path_buf());
    }
    let cwd = std::env::current_dir().map_err(|e| format!("failed to read cwd: {e}"))?;
    Ok(cwd.join(path))
}

fn value_to_string(value: &Value) -> String {
    match value {
        Value::Null => String::new(),
        Value::String(v) => v.clone(),
        Value::Number(v) => v.to_string(),
        Value::Bool(v) => v.to_string(),
        Value::Array(items) => items
            .iter()
            .map(value_to_string)
            .collect::<Vec<_>>()
            .join(","),
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
    value_to_string(v)
}

fn js_or(value: Option<&Value>, fallback: Value) -> Value {
    match value {
        Some(v) if is_truthy(v) => v.clone(),
        _ => fallback,
    }
}

fn refs_from_value(value: Option<&Value>) -> Vec<String> {
    value
        .and_then(Value::as_array)
        .map(|items| {
            items
                .iter()
                .filter_map(Value::as_str)
                .map(str::to_string)
                .collect::<Vec<_>>()
        })
        .unwrap_or_default()
}

fn object_prop<'a>(value: &'a Value, key: &str) -> Option<&'a Value> {
    value.as_object().and_then(|obj| obj.get(key))
}

fn source_id(source: &Value) -> Option<String> {
    source
        .as_object()
        .and_then(|obj| obj.get("id"))
        .and_then(Value::as_str)
        .map(str::trim)
        .filter(|id| !id.is_empty())
        .map(str::to_string)
}

fn sort_people_claims(people: &mut [Value]) {
    people.sort_by(|a, b| {
        let a_id = object_prop(a, "id").and_then(Value::as_str).unwrap_or("");
        let b_id = object_prop(b, "id").and_then(Value::as_str).unwrap_or("");
        a_id.cmp(b_id)
    });
}

fn sort_edge_claims(edges: &mut [Value]) {
    edges.sort_by(|a, b| {
        let a_t = object_prop(a, "type").and_then(Value::as_str).unwrap_or("");
        let b_t = object_prop(b, "type").and_then(Value::as_str).unwrap_or("");
        let a_s = object_prop(a, "source")
            .and_then(Value::as_str)
            .unwrap_or("");
        let b_s = object_prop(b, "source")
            .and_then(Value::as_str)
            .unwrap_or("");
        let a_d = object_prop(a, "target")
            .and_then(Value::as_str)
            .unwrap_or("");
        let b_d = object_prop(b, "target")
            .and_then(Value::as_str)
            .unwrap_or("");
        let a_l = object_prop(a, "label")
            .and_then(Value::as_str)
            .unwrap_or("");
        let b_l = object_prop(b, "label")
            .and_then(Value::as_str)
            .unwrap_or("");

        a_t.cmp(b_t)
            .then_with(|| a_s.cmp(b_s))
            .then_with(|| a_d.cmp(b_d))
            .then_with(|| a_l.cmp(b_l))
    });
}

fn compact_person(person: &Person) -> Value {
    json!({
        "id": person.id,
        "name": person.nm,
        "dynasty": person.dy,
        "regnal": js_or_string(person.extra.get("rg")),
        "aliases": js_or(person.extra.get("aliases"), Value::Array(Vec::new())),
        "known_as": js_or(person.extra.get("known_as"), Value::Array(Vec::new())),
        "titles": js_or(person.extra.get("titles"), Value::Array(Vec::new())),
        "offices_held": js_or(person.extra.get("offices_held"), Value::Array(Vec::new())),
        "royal_link": js_or(person.extra.get("royal_link"), Value::Null),
        "reign": js_or(person.extra.get("re"), Value::Array(Vec::new())),
        "born_year": person.extra.get("yb").cloned().unwrap_or(Value::Null),
        "died_year": person.extra.get("yd").cloned().unwrap_or(Value::Null),
        "birth_place": js_or_string(person.extra.get("pb")),
        "death_place": js_or_string(person.extra.get("pd")),
        "source_refs": js_or(person.extra.get("source_refs"), Value::Array(Vec::new()))
    })
}

fn compact_edge(edge: &Edge, people_by_id: &HashMap<&str, &Person>) -> Value {
    let source_name = people_by_id
        .get(edge.s.as_str())
        .map(|person| person.nm.clone())
        .unwrap_or_else(|| edge.s.clone());
    let target_name = people_by_id
        .get(edge.d.as_str())
        .map(|person| person.nm.clone())
        .unwrap_or_else(|| edge.d.clone());

    json!({
        "type": edge.t,
        "source_id": edge.s,
        "source_name": source_name,
        "target_id": edge.d,
        "target_name": target_name,
        "label": edge.l,
        "confidence_class": edge.c,
        "claim_type": edge.claim_type,
        "confidence_grade": edge.confidence_grade,
        "evidence_refs": edge.evidence_refs,
        "event_context": edge.event_context
    })
}

fn index_claims_by_source(sources: &[Value], people: &[Person], edges: &[Edge]) -> Value {
    let source_ids = sources.iter().filter_map(source_id).collect::<Vec<_>>();
    let source_set = source_ids.iter().cloned().collect::<HashSet<_>>();
    let mut buckets = source_ids
        .iter()
        .map(|id| (id.clone(), SourceClaims::default()))
        .collect::<HashMap<_, _>>();

    for person in people {
        let person_base = json!({
            "id": person.id,
            "name": person.nm,
            "dynasty": person.dy
        });

        for ref_id in refs_from_value(person.extra.get("source_refs")) {
            if !source_set.contains(&ref_id) {
                continue;
            }
            if let Some(bucket) = buckets.get_mut(&ref_id) {
                bucket.people.push(person_base.clone());
            }
        }

        if let Some(known_as) = person.extra.get("known_as").and_then(Value::as_array) {
            for alias in known_as {
                for ref_id in refs_from_value(object_prop(alias, "source_refs")) {
                    if !source_set.contains(&ref_id) {
                        continue;
                    }
                    if let Some(bucket) = buckets.get_mut(&ref_id) {
                        bucket.people.push(json!({
                            "id": person.id,
                            "name": person.nm,
                            "dynasty": person.dy,
                            "claim": "known_as",
                            "value": js_or_string(object_prop(alias, "name"))
                        }));
                    }
                }
            }
        }

        if let Some(offices) = person.extra.get("offices_held").and_then(Value::as_array) {
            for office in offices {
                let office_value = js_or_string(object_prop(office, "office_id"));
                let resolved_office_value = if office_value.is_empty() {
                    js_or_string(object_prop(office, "label"))
                } else {
                    office_value
                };
                for ref_id in refs_from_value(object_prop(office, "source_refs")) {
                    if !source_set.contains(&ref_id) {
                        continue;
                    }
                    if let Some(bucket) = buckets.get_mut(&ref_id) {
                        bucket.people.push(json!({
                            "id": person.id,
                            "name": person.nm,
                            "dynasty": person.dy,
                            "claim": "office",
                            "value": resolved_office_value
                        }));
                    }
                }
            }
        }

        if let Some(royal_link) = person.extra.get("royal_link") {
            let status = js_or_string(object_prop(royal_link, "status"));
            for ref_id in refs_from_value(object_prop(royal_link, "source_refs")) {
                if !source_set.contains(&ref_id) {
                    continue;
                }
                if let Some(bucket) = buckets.get_mut(&ref_id) {
                    bucket.people.push(json!({
                        "id": person.id,
                        "name": person.nm,
                        "dynasty": person.dy,
                        "claim": "royal_link",
                        "value": status
                    }));
                }
            }
        }
    }

    for edge in edges {
        for ref_id in &edge.evidence_refs {
            if !source_set.contains(ref_id) {
                continue;
            }
            if let Some(bucket) = buckets.get_mut(ref_id) {
                bucket.edges.push(json!({
                    "type": edge.t,
                    "source": edge.s,
                    "target": edge.d,
                    "label": edge.l,
                    "confidence_class": edge.c,
                    "claim_type": edge.claim_type,
                    "confidence_grade": edge.confidence_grade
                }));
            }
        }
    }

    let mut claims = Map::new();
    for source in sources {
        let Some(id) = source_id(source) else {
            continue;
        };
        let mut bucket = buckets.remove(&id).unwrap_or_default();
        sort_people_claims(&mut bucket.people);
        sort_edge_claims(&mut bucket.edges);
        claims.insert(
            id,
            json!({
                "people": bucket.people,
                "edges": bucket.edges
            }),
        );
    }
    Value::Object(claims)
}

pub fn run(
    canonical: &Dataset,
    research: &Dataset,
    sources_path: &str,
    ui_reference_path: &str,
    output_path: &str,
) -> Result<String, String> {
    let sources_payload = read_json(sources_path)?;
    let sources = parse_sources_payload(&sources_payload)?;
    let ui_payload = read_json(ui_reference_path)?;
    let office_catalog = ui_payload
        .get("officeCatalog")
        .filter(|v| v.is_array())
        .cloned()
        .unwrap_or_else(|| Value::Array(Vec::new()));
    let office_timeline = ui_payload
        .get("officeTimeline")
        .filter(|v| v.is_array())
        .cloned()
        .unwrap_or_else(|| Value::Array(Vec::new()));

    let people_by_id = research
        .people
        .iter()
        .map(|person| (person.id.as_str(), person))
        .collect::<HashMap<_, _>>();

    let canonical_people = canonical
        .people
        .iter()
        .map(compact_person)
        .collect::<Vec<_>>();
    let canonical_edges = canonical
        .edges
        .iter()
        .map(|edge| compact_edge(edge, &people_by_id))
        .collect::<Vec<_>>();
    let research_people = research
        .people
        .iter()
        .map(compact_person)
        .collect::<Vec<_>>();
    let research_edges = research
        .edges
        .iter()
        .map(|edge| compact_edge(edge, &people_by_id))
        .collect::<Vec<_>>();
    let claims_by_source = index_claims_by_source(&sources, &research.people, &research.edges);

    let payload = json!({
        "generated_at": now_iso(),
        "description": "Offline local archive of all integrated genealogy data, source registry metadata, and source-linked claim indices.",
        "sources": sources,
        "offices": {
            "catalog": office_catalog,
            "timeline": office_timeline
        },
        "canonical": {
            "people_count": canonical.people.len(),
            "edge_count": canonical.edges.len(),
            "people": canonical_people,
            "edges": canonical_edges
        },
        "research": {
            "people_count": research.people.len(),
            "edge_count": research.edges.len(),
            "people": research_people,
            "edges": research_edges
        },
        "claims_by_source": claims_by_source
    });

    let output = resolve_output_path(output_path)?;
    if let Some(parent) = output.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("failed to create {}: {e}", parent.display()))?;
    }

    let encoded = serde_json::to_string_pretty(&payload)
        .map_err(|e| format!("failed to encode json: {e}"))?;
    fs::write(&output, format!("{encoded}\n"))
        .map_err(|e| format!("failed to write {}: {e}", output.display()))?;

    Ok(format!("Wrote {}\n", output.display()))
}

use crate::phase1_batch_common::{
    DEFAULT_DATE, PersonDossierOptions, by_person_id, header_index, inference_edge_key, ledger_dir,
    make_derived_inference_dossier, make_person_dossier, row_get, row_set, source_by_id_map,
    sweep_default_inference_file, write_markdown,
};
use crate::source_models::SourceRecord;
use maldives_domain::{Dataset, Edge};
use serde::Deserialize;
use std::collections::HashMap;
use std::fs;
use std::path::Path;
use std::sync::OnceLock;

#[derive(Clone, Debug, Deserialize)]
struct Payload {
    batch_owner: String,
    primary_targets: Vec<String>,
    concept_source_map: HashMap<String, Vec<String>>,
}

#[derive(Clone, Debug)]
struct SweepPeopleResult {
    updated: usize,
    missing: usize,
}

#[derive(Clone, Debug)]
struct SweepInferenceResult {
    updated: usize,
    missing_edges: usize,
    inference_dossier_by_key: HashMap<String, String>,
}

fn payload() -> &'static Payload {
    static PAYLOAD: OnceLock<Payload> = OnceLock::new();
    PAYLOAD.get_or_init(|| {
        serde_json::from_str(include_str!("../data/phase1_batch_sweep.payload.json"))
            .expect("valid phase1 batch sweep payload")
    })
}

fn source_line(source_by_id: &HashMap<String, SourceRecord>, id: &str) -> String {
    let Some(source) = source_by_id.get(id) else {
        return format!("- `{id}`");
    };
    format!("- `{id}`: {} [{}]", source.title, source.quality)
}

fn make_concept_entry(
    row: &[String],
    idx: &HashMap<String, usize>,
    source_ids: &[String],
    source_by_id: &HashMap<String, SourceRecord>,
    date: &str,
) -> String {
    let source_lines = if source_ids.is_empty() {
        "- none assigned".to_string()
    } else {
        source_ids
            .iter()
            .map(|id| source_line(source_by_id, id))
            .collect::<Vec<_>>()
            .join("\n")
    };
    format!(
        "# Concept Entry\n\nConcept ID: `{}`  \nLast updated: `{}`  \nCategory: `{}`\n\n## 1) Canonical label\n- Primary label: {}\n- Alternate labels/spellings: to be expanded during extraction\n- Language/script forms: to be expanded during extraction\n\n## 2) Definition\n- Short definition: Working definition drafted for Phase 1; refine after locator extraction.\n- Historical scope and periodization: {}\n- Why it matters in this genealogy graph: This concept affects relation interpretation, title semantics, and confidence adjudication.\n\n## 3) Semantic and historical notes\n- Functional meaning by period: Pending primary-source extraction and periodized notes.\n- Rank/status implications: Pending office and title evidence mapping.\n- Known changes in role or usage: Pending contradiction and terminology pass.\n\n## 4) Person and event links\n- Linked people (`P...`): to be mapped in Phase 3 concept deep pass.\n- Linked offices/institutions: to be mapped in concept-office reconciliation.\n- Linked transitions/events: to be mapped in contradiction and promotion queue pass.\n\n## 5) Evidence\n- Primary sources: listed below.\n- Secondary/specialist sources: listed below where applicable.\n- Conflicting definitions: unresolved; track in contradiction log when encountered.\n\n## 6) Source list\n{}\n\n## 7) Open questions\n- Missing evidence: exact locator-level excerpts are still pending.\n- Etymology uncertainty: term-history and language-shift notes pending.\n- Terminology ambiguity: rank/function overlap requires period-specific disambiguation.\n",
        row_get(row, idx, "concept_id"),
        date,
        row_get(row, idx, "category"),
        {
            let label = row_get(row, idx, "canonical_label");
            if label.is_empty() { "Unknown" } else { label }
        },
        {
            let scope = row_get(row, idx, "period_scope");
            if scope.is_empty() { "Unknown" } else { scope }
        },
        source_lines
    )
}

fn parse_evidence_refs(value: &str) -> Vec<String> {
    if value.trim().is_empty() {
        return Vec::new();
    }
    value
        .split('|')
        .map(str::trim)
        .filter(|v| !v.is_empty())
        .map(ToString::to_string)
        .collect::<Vec<_>>()
}

fn claim_excerpt_for(
    row: &[String],
    edge: Option<&Edge>,
    by_person_id: &HashMap<String, &maldives_domain::Person>,
    idx: &HashMap<String, usize>,
) -> String {
    let source_id = row_get(row, idx, "source_id");
    let target_id = row_get(row, idx, "target_id");
    let source = crate::phase1_batch_common::person_label(by_person_id, source_id);
    let target = crate::phase1_batch_common::person_label(by_person_id, target_id);
    let rel = if row_get(row, idx, "relation_type").is_empty() {
        edge.map(|e| e.t.as_str()).unwrap_or("relation")
    } else {
        row_get(row, idx, "relation_type")
    };
    let label = if row_get(row, idx, "label").is_empty() {
        edge.map(|e| e.l.as_str()).unwrap_or("")
    } else {
        row_get(row, idx, "label")
    };
    let label_text = if label.is_empty() {
        String::new()
    } else {
        format!(" ({label})")
    };

    if let Some(e) = edge {
        if e.c == "i" {
            let rule = if e.inference_rule.is_empty() {
                "inference metadata"
            } else {
                e.inference_rule.as_str()
            };
            return format!(
                "Inferred {rel} relation{label_text} between {source} and {target} from modeled rule chain {rule}."
            );
        }
    }
    if rel == "parent" {
        return format!("Modeled parent relation: {source} -> {target}.");
    }
    if rel == "sibling" {
        return format!("Modeled sibling relation{label_text}: {source} <-> {target}.");
    }
    if rel == "spouse" {
        return format!("Modeled spouse relation{label_text}: {source} <-> {target}.");
    }
    if rel == "kin" {
        return format!("Modeled kin relation{label_text}: {source} <-> {target}.");
    }
    format!("Modeled {rel} relation{label_text}: {source} <-> {target}.")
}

fn citation_locator_for(
    row: &[String],
    edge: Option<&Edge>,
    idx: &HashMap<String, usize>,
    inference_dossier_by_key: &HashMap<String, String>,
) -> String {
    if let Some(e) = edge {
        if !e.inference_rule.is_empty() {
            let key = inference_edge_key(e);
            if let Some(dossier) = inference_dossier_by_key.get(&key) {
                return format!("Inference basis: {} (see {}).", e.inference_rule, dossier);
            }
            return format!("Inference basis: {}.", e.inference_rule);
        }
    }
    let primary = row_get(row, idx, "primary_source_id");
    if !primary.is_empty() {
        return format!("{primary} locator extraction pending in source sweep.");
    }
    let refs = parse_evidence_refs(row_get(row, idx, "evidence_refs"));
    if let Some(first) = refs.first() {
        return format!("{first} locator extraction pending in source sweep.");
    }
    "Locator pending source assignment.".to_string()
}

fn claim_note_for_type(claim_type: &str) -> String {
    if claim_type == "inferred" {
        return "Backfilled from inference metadata and queued for pair-specific verification."
            .to_string();
    }
    if claim_type == "direct" {
        return "Direct claim moved to in_progress for locator extraction.".to_string();
    }
    if claim_type == "uncertain" {
        return "Contested claim moved to in_progress for contradiction adjudication and locator extraction."
            .to_string();
    }
    "Claim moved to in_progress during batch sweep.".to_string()
}

fn sweep_person_coverage_and_dossiers(
    dataset: &Dataset,
    sources: &[SourceRecord],
    root_dir: &str,
    date: &str,
) -> Result<SweepPeopleResult, String> {
    let path = ledger_dir(root_dir).join("person-coverage.csv");
    let raw =
        fs::read_to_string(&path).map_err(|e| format!("failed to read {}: {e}", path.display()))?;
    let mut rows = crate::csv_utils::parse_csv(&raw);
    if rows.is_empty() {
        return Err(format!("empty csv: {}", path.display()));
    }

    let idx = header_index(&rows[0]);
    let people_dir = Path::new(root_dir)
        .join("docs")
        .join("research-program")
        .join("people");
    let by_id = by_person_id(dataset);
    let source_map = source_by_id_map(sources);
    let options = PersonDossierOptions {
        date,
        primary_targets: &payload().primary_targets,
        include_spouse_edges: true,
        uncertain_contested_wording: true,
        required_edge_updates: "corroborate direct and inferred bridge claims with chronicle-backed locators.",
    };

    let mut updated = 0usize;
    let mut missing = 0usize;
    for row in rows.iter_mut().skip(1) {
        if row_get(row, &idx, "dossier_status") != "todo" {
            continue;
        }
        let person_id = row_get(row, &idx, "person_id").to_string();
        let Some(person) = by_id.get(&person_id).copied() else {
            missing += 1;
            row_set(row, &idx, "last_updated", date.to_string());
            row_set(
                row,
                &idx,
                "notes",
                "Batch sweep: person not found in dataset.".to_string(),
            );
            continue;
        };
        let content = make_person_dossier(person, &dataset.edges, &by_id, &source_map, &options);
        let dossier_file = row_get(row, &idx, "dossier_file");
        let target = if dossier_file.is_empty() {
            people_dir.join(format!("{person_id}.md"))
        } else {
            Path::new(root_dir).join(dossier_file)
        };
        write_markdown(&target, &content)?;
        row_set(row, &idx, "dossier_status", "in_progress".to_string());
        row_set(row, &idx, "last_updated", date.to_string());
        row_set(
            row,
            &idx,
            "notes",
            "Phase 1 batch sweep dossier draft created.".to_string(),
        );
        updated += 1;
    }
    fs::write(&path, crate::phase1_batch_common::rows_to_csv(&rows))
        .map_err(|e| format!("failed to write {}: {e}", path.display()))?;
    Ok(SweepPeopleResult { updated, missing })
}

fn sweep_inference_tracker_and_dossiers(
    dataset: &Dataset,
    sources: &[SourceRecord],
    root_dir: &str,
    date: &str,
) -> Result<SweepInferenceResult, String> {
    let path = ledger_dir(root_dir).join("inference-dossier-tracker.csv");
    let raw =
        fs::read_to_string(&path).map_err(|e| format!("failed to read {}: {e}", path.display()))?;
    let mut rows = crate::csv_utils::parse_csv(&raw);
    if rows.is_empty() {
        return Err(format!("empty csv: {}", path.display()));
    }

    let idx = header_index(&rows[0]);
    let inferences_dir = Path::new(root_dir)
        .join("docs")
        .join("research-program")
        .join("inferences");
    fs::create_dir_all(&inferences_dir)
        .map_err(|e| format!("failed to create {}: {e}", inferences_dir.display()))?;

    let by_id = by_person_id(dataset);
    let source_map = source_by_id_map(sources);
    let key_to_edge = dataset
        .edges
        .iter()
        .map(|edge| (inference_edge_key(edge), edge))
        .collect::<HashMap<_, _>>();

    let mut updated = 0usize;
    let mut missing_edges = 0usize;
    let mut inference_dossier_by_key = HashMap::<String, String>::new();

    for row in rows.iter_mut().skip(1) {
        let key = row_get(row, &idx, "edge_key").to_string();
        let existing_file = row_get(row, &idx, "dossier_file").to_string();
        if !existing_file.is_empty() {
            inference_dossier_by_key.insert(key.clone(), existing_file.clone());
        }
        if row_get(row, &idx, "dossier_status") != "todo" {
            continue;
        }
        let Some(edge) = key_to_edge.get(&key).copied() else {
            missing_edges += 1;
            row_set(row, &idx, "last_updated", date.to_string());
            row_set(
                row,
                &idx,
                "notes",
                "Batch sweep: edge key missing from dataset.".to_string(),
            );
            continue;
        };

        let content = make_derived_inference_dossier(edge, &by_id, &source_map, date);
        let target_rel = if existing_file.is_empty() {
            sweep_default_inference_file(&key)
        } else {
            existing_file.clone()
        };
        let target = Path::new(root_dir).join(&target_rel);
        write_markdown(&target, &content)?;

        row_set(row, &idx, "dossier_status", "in_progress".to_string());
        row_set(row, &idx, "last_updated", date.to_string());
        row_set(
            row,
            &idx,
            "notes",
            "Phase 1 batch sweep derived dossier drafted.".to_string(),
        );
        if existing_file.is_empty() {
            row_set(row, &idx, "dossier_file", target_rel.clone());
        }
        inference_dossier_by_key.insert(key, target_rel);
        updated += 1;
    }
    fs::write(&path, crate::phase1_batch_common::rows_to_csv(&rows))
        .map_err(|e| format!("failed to write {}: {e}", path.display()))?;

    Ok(SweepInferenceResult {
        updated,
        missing_edges,
        inference_dossier_by_key,
    })
}

fn sweep_relationship_ledger(
    dataset: &Dataset,
    root_dir: &str,
    date: &str,
    inference_dossier_by_key: &HashMap<String, String>,
) -> Result<usize, String> {
    let path = ledger_dir(root_dir).join("relationship-evidence-ledger.csv");
    let raw =
        fs::read_to_string(&path).map_err(|e| format!("failed to read {}: {e}", path.display()))?;
    let mut rows = crate::csv_utils::parse_csv(&raw);
    if rows.is_empty() {
        return Err(format!("empty csv: {}", path.display()));
    }
    let idx = header_index(&rows[0]);
    let by_id = by_person_id(dataset);
    let key_to_edge = dataset
        .edges
        .iter()
        .map(|edge| (inference_edge_key(edge), edge))
        .collect::<HashMap<_, _>>();

    let mut updated = 0usize;
    for row in rows.iter_mut().skip(1) {
        if row_get(row, &idx, "review_status") != "todo" {
            continue;
        }
        let edge_key = row_get(row, &idx, "edge_key");
        let edge = key_to_edge.get(edge_key).copied();

        if row_get(row, &idx, "claim_excerpt").is_empty() {
            let excerpt = claim_excerpt_for(row, edge, &by_id, &idx);
            row_set(row, &idx, "claim_excerpt", excerpt);
        }
        if row_get(row, &idx, "citation_locator").is_empty() {
            let locator = citation_locator_for(row, edge, &idx, inference_dossier_by_key);
            row_set(row, &idx, "citation_locator", locator);
        }
        row_set(row, &idx, "access_date", date.to_string());
        row_set(row, &idx, "review_status", "in_progress".to_string());
        row_set(row, &idx, "canonical_decision", "pending".to_string());
        row_set(row, &idx, "reviewer", payload().batch_owner.clone());
        row_set(row, &idx, "last_reviewed", date.to_string());
        if row_get(row, &idx, "notes").is_empty() {
            let claim_type = row_get(row, &idx, "claim_type").to_string();
            row_set(row, &idx, "notes", claim_note_for_type(&claim_type));
        }
        updated += 1;
    }

    fs::write(&path, crate::phase1_batch_common::rows_to_csv(&rows))
        .map_err(|e| format!("failed to write {}: {e}", path.display()))?;
    Ok(updated)
}

fn sweep_concept_coverage(
    sources: &[SourceRecord],
    root_dir: &str,
    date: &str,
) -> Result<usize, String> {
    let path = ledger_dir(root_dir).join("concept-coverage.csv");
    let raw =
        fs::read_to_string(&path).map_err(|e| format!("failed to read {}: {e}", path.display()))?;
    let mut rows = crate::csv_utils::parse_csv(&raw);
    if rows.is_empty() {
        return Err(format!("empty csv: {}", path.display()));
    }
    let idx = header_index(&rows[0]);
    let concepts_dir = Path::new(root_dir)
        .join("docs")
        .join("research-program")
        .join("concepts");
    fs::create_dir_all(&concepts_dir)
        .map_err(|e| format!("failed to create {}: {e}", concepts_dir.display()))?;
    let source_map = source_by_id_map(sources);

    let mut updated = 0usize;
    for row in rows.iter_mut().skip(1) {
        if row_get(row, &idx, "status") != "todo" {
            continue;
        }
        let concept_id = row_get(row, &idx, "concept_id").to_string();
        let source_ids = payload()
            .concept_source_map
            .get(&concept_id)
            .cloned()
            .unwrap_or_else(|| payload().primary_targets.iter().take(3).cloned().collect());
        let content = make_concept_entry(row, &idx, &source_ids, &source_map, date);
        let entry_file = row_get(row, &idx, "entry_file");
        let target = if entry_file.is_empty() {
            concepts_dir.join(format!("{concept_id}.md"))
        } else {
            Path::new(root_dir).join(entry_file)
        };
        write_markdown(&target, &content)?;
        row_set(row, &idx, "status", "in_progress".to_string());
        row_set(
            row,
            &idx,
            "linked_sources_count",
            source_ids.len().to_string(),
        );
        row_set(row, &idx, "last_updated", date.to_string());
        row_set(
            row,
            &idx,
            "notes",
            "Phase 1 batch sweep concept entry draft created.".to_string(),
        );
        updated += 1;
    }
    fs::write(&path, crate::phase1_batch_common::rows_to_csv(&rows))
        .map_err(|e| format!("failed to write {}: {e}", path.display()))?;
    Ok(updated)
}

fn sweep_source_queue(root_dir: &str, date: &str) -> Result<usize, String> {
    let path = ledger_dir(root_dir).join("source-expansion-queue.csv");
    let raw =
        fs::read_to_string(&path).map_err(|e| format!("failed to read {}: {e}", path.display()))?;
    let mut rows = crate::csv_utils::parse_csv(&raw);
    if rows.is_empty() {
        return Err(format!("empty csv: {}", path.display()));
    }
    let idx = header_index(&rows[0]);

    let mut updated = 0usize;
    for row in rows.iter_mut().skip(1) {
        if row_get(row, &idx, "status") != "pending" {
            continue;
        }
        row_set(row, &idx, "status", "in_progress".to_string());
        row_set(row, &idx, "last_updated", date.to_string());
        row_set(row, &idx, "owner", payload().batch_owner.clone());
        let next_notes = if row_get(row, &idx, "notes").is_empty() {
            "Batch sweep moved this queue row to active.".to_string()
        } else {
            format!(
                "{} Batch sweep moved this queue row to active.",
                row_get(row, &idx, "notes")
            )
        };
        row_set(row, &idx, "notes", next_notes);
        updated += 1;
    }

    fs::write(&path, crate::phase1_batch_common::rows_to_csv(&rows))
        .map_err(|e| format!("failed to write {}: {e}", path.display()))?;
    Ok(updated)
}

fn sweep_source_extract_log(root_dir: &str, date: &str) -> Result<usize, String> {
    let path = ledger_dir(root_dir).join("source-extract-log.csv");
    let raw =
        fs::read_to_string(&path).map_err(|e| format!("failed to read {}: {e}", path.display()))?;
    let mut rows = crate::csv_utils::parse_csv(&raw);
    if rows.is_empty() {
        return Err(format!("empty csv: {}", path.display()));
    }
    let idx = header_index(&rows[0]);

    let mut updated = 0usize;
    for row in rows.iter_mut().skip(1) {
        if row_get(row, &idx, "extract_status") != "pending" {
            continue;
        }
        row_set(row, &idx, "extract_status", "in_progress".to_string());
        row_set(row, &idx, "date", date.to_string());
        row_set(row, &idx, "researcher", payload().batch_owner.clone());
        let next_notes = if row_get(row, &idx, "notes").is_empty() {
            "Batch sweep moved this extract row to active.".to_string()
        } else {
            format!(
                "{} Batch sweep moved this extract row to active.",
                row_get(row, &idx, "notes")
            )
        };
        row_set(row, &idx, "notes", next_notes);
        updated += 1;
    }

    fs::write(&path, crate::phase1_batch_common::rows_to_csv(&rows))
        .map_err(|e| format!("failed to write {}: {e}", path.display()))?;
    Ok(updated)
}

pub fn run(
    dataset: &Dataset,
    sources: &[SourceRecord],
    root_dir: &str,
    date_opt: Option<&str>,
) -> Result<String, String> {
    let date = date_opt.unwrap_or(DEFAULT_DATE);

    let people = sweep_person_coverage_and_dossiers(dataset, sources, root_dir, date)?;
    let inference = sweep_inference_tracker_and_dossiers(dataset, sources, root_dir, date)?;
    let relationship =
        sweep_relationship_ledger(dataset, root_dir, date, &inference.inference_dossier_by_key)?;
    let concept = sweep_concept_coverage(sources, root_dir, date)?;
    let queue = sweep_source_queue(root_dir, date)?;
    let extract = sweep_source_extract_log(root_dir, date)?;

    Ok(format!(
        "Phase 1 batch sweep complete:\n- people dossiers advanced: {} (missing people: {})\n- inference dossiers advanced: {} (missing edges: {})\n- relationship claims advanced: {}\n- concept entries advanced: {}\n- source queue rows activated: {}\n- source extract rows activated: {}\n",
        people.updated,
        people.missing,
        inference.updated,
        inference.missing_edges,
        relationship,
        concept,
        queue,
        extract
    ))
}

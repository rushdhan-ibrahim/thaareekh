use crate::phase1_batch_common::{
    DEFAULT_DATE, PersonDossierOptions, QueueUpdate, RelationshipUpdate, by_person_id,
    header_index, inference_edge_key, ledger_dir, make_derived_inference_dossier,
    make_person_dossier, row_get, source_by_id_map, update_inference_tracker,
    update_person_coverage, update_relationship_ledger, update_source_queue,
    upsert_source_extract_entries, write_markdown,
};
use crate::source_models::SourceRecord;
use maldives_domain::Dataset;
use serde::Deserialize;
use std::collections::{HashMap, HashSet};
use std::fs;
use std::path::Path;
use std::sync::OnceLock;

#[derive(Clone, Debug, Deserialize)]
struct Payload {
    person_ids: Vec<String>,
    primary_targets: Vec<String>,
    inference_target_keys: Vec<String>,
    relationship_updates: HashMap<String, RelationshipUpdate>,
    queue_updates: HashMap<String, QueueUpdate>,
    source_extract_entries: Vec<HashMap<String, String>>,
}

fn payload() -> &'static Payload {
    static PAYLOAD: OnceLock<Payload> = OnceLock::new();
    PAYLOAD.get_or_init(|| {
        serde_json::from_str(include_str!("../data/phase1_batch_c.payload.json"))
            .expect("valid phase1 batch C payload")
    })
}

fn write_person_dossiers(
    dataset: &Dataset,
    sources: &[SourceRecord],
    root_dir: &str,
    date: &str,
) -> Result<usize, String> {
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

    let mut written = 0usize;
    for id in &payload().person_ids {
        let Some(person) = by_id.get(id) else {
            continue;
        };
        let content = make_person_dossier(person, &dataset.edges, &by_id, &source_map, &options);
        let target = people_dir.join(format!("{id}.md"));
        write_markdown(&target, &content)?;
        written += 1;
    }
    Ok(written)
}

fn write_derived_inference_dossiers(
    dataset: &Dataset,
    sources: &[SourceRecord],
    root_dir: &str,
    date: &str,
) -> Result<usize, String> {
    let tracker_path = ledger_dir(root_dir).join("inference-dossier-tracker.csv");
    let tracker_raw = fs::read_to_string(&tracker_path)
        .map_err(|e| format!("failed to read {}: {e}", tracker_path.display()))?;
    let tracker_rows = crate::csv_utils::parse_csv(&tracker_raw);
    if tracker_rows.is_empty() {
        return Err(format!("empty csv: {}", tracker_path.display()));
    }
    let idx = header_index(&tracker_rows[0]);
    let target_keys = payload()
        .inference_target_keys
        .iter()
        .cloned()
        .collect::<HashSet<_>>();
    let by_id = by_person_id(dataset);
    let source_map = source_by_id_map(sources);
    let key_to_edge = dataset
        .edges
        .iter()
        .map(|edge| (inference_edge_key(edge), edge))
        .collect::<HashMap<_, _>>();

    let mut written = 0usize;
    for row in tracker_rows.iter().skip(1) {
        let key = row_get(row, &idx, "edge_key");
        if !target_keys.contains(key) {
            continue;
        }
        let Some(edge) = key_to_edge.get(key).copied() else {
            continue;
        };
        let file = row_get(row, &idx, "dossier_file");
        if file.is_empty() {
            continue;
        }
        let content = make_derived_inference_dossier(edge, &by_id, &source_map, date);
        write_markdown(&Path::new(root_dir).join(file), &content)?;
        written += 1;
    }
    Ok(written)
}

pub fn run(
    dataset: &Dataset,
    sources: &[SourceRecord],
    root_dir: &str,
    date_opt: Option<&str>,
) -> Result<String, String> {
    let date = date_opt.unwrap_or(DEFAULT_DATE);
    let ledgers = ledger_dir(root_dir);

    let person_ids = payload()
        .person_ids
        .iter()
        .cloned()
        .collect::<HashSet<String>>();
    let inference_keys = payload()
        .inference_target_keys
        .iter()
        .cloned()
        .collect::<HashSet<String>>();

    write_person_dossiers(dataset, sources, root_dir, date)?;
    update_person_coverage(
        &ledgers.join("person-coverage.csv"),
        &person_ids,
        date,
        "Phase 1 batch C dossier draft created.",
    )?;
    update_relationship_ledger(
        &ledgers.join("relationship-evidence-ledger.csv"),
        &payload().relationship_updates,
        "phase1-batch-c",
        date,
    )?;
    update_inference_tracker(
        &ledgers.join("inference-dossier-tracker.csv"),
        &inference_keys,
        date,
        "Phase 1 batch C derived dossier drafted.",
    )?;
    write_derived_inference_dossiers(dataset, sources, root_dir, date)?;
    update_source_queue(
        &ledgers.join("source-expansion-queue.csv"),
        &payload().queue_updates,
        date,
    )?;
    upsert_source_extract_entries(
        &ledgers.join("source-extract-log.csv"),
        &payload().source_extract_entries,
        date,
    )?;

    Ok("Phase 1 batch C complete: dossiers and ledgers updated.\n".to_string())
}

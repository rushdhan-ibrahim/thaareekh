use crate::phase1_batch_common::{
    CuratedInferenceNote, DEFAULT_DATE, PersonDossierOptions, RelationshipUpdate, by_person_id,
    header_index, inference_edge_key, ledger_dir, make_curated_inference_dossier,
    make_person_dossier, overwrite_source_extract_log, row_get, source_by_id_map,
    update_inference_tracker, update_person_coverage, update_relationship_ledger, write_markdown,
};
use crate::source_models::SourceRecord;
use maldives_domain::Dataset;
use serde::Deserialize;
use std::collections::{HashMap, HashSet};
use std::fs;
use std::path::Path;
use std::sync::OnceLock;

const OWNER: &str = "phase1-batch-a";

#[derive(Clone, Debug, Deserialize)]
struct SourceExtractLogPayload {
    header: Vec<String>,
    rows: Vec<Vec<String>>,
}

#[derive(Clone, Debug, Deserialize)]
struct Payload {
    person_ids: Vec<String>,
    primary_targets: Vec<String>,
    inference_target_keys: Vec<String>,
    relationship_updates: HashMap<String, RelationshipUpdate>,
    curated_notes: HashMap<String, CuratedInferenceNote>,
    source_extract_log: SourceExtractLogPayload,
}

fn payload() -> &'static Payload {
    static PAYLOAD: OnceLock<Payload> = OnceLock::new();
    PAYLOAD.get_or_init(|| {
        serde_json::from_str(include_str!("../data/phase1_batch_a.payload.json"))
            .expect("valid phase1 batch A payload")
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
        include_spouse_edges: false,
        uncertain_contested_wording: false,
        required_edge_updates: "corroborate direct edges with primary chronicle or inscription-backed wording.",
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

fn write_inference_dossiers(
    dataset: &Dataset,
    sources: &[SourceRecord],
    root_dir: &str,
    date: &str,
) -> Result<usize, String> {
    let ledger_path = ledger_dir(root_dir).join("inference-dossier-tracker.csv");
    let tracker_raw = fs::read_to_string(&ledger_path)
        .map_err(|e| format!("failed to read {}: {e}", ledger_path.display()))?;
    let tracker_rows = crate::csv_utils::parse_csv(&tracker_raw);
    if tracker_rows.is_empty() {
        return Err(format!("empty csv: {}", ledger_path.display()));
    }
    let idx = header_index(&tracker_rows[0]);
    let by_id = by_person_id(dataset);
    let source_map = source_by_id_map(sources);
    let key_to_edge = dataset
        .edges
        .iter()
        .map(|edge| (inference_edge_key(edge), edge))
        .collect::<HashMap<_, _>>();
    let target_keys = payload()
        .inference_target_keys
        .iter()
        .cloned()
        .collect::<HashSet<_>>();

    let mut written = 0usize;
    for row in tracker_rows.iter().skip(1) {
        let key = row_get(row, &idx, "edge_key");
        if !target_keys.contains(key) {
            continue;
        }
        let Some(edge) = key_to_edge.get(key).copied() else {
            continue;
        };
        let note = payload().curated_notes.get(key);
        let content = make_curated_inference_dossier(edge, note, &by_id, &source_map, date);
        let file = row_get(row, &idx, "dossier_file");
        if file.is_empty() {
            continue;
        }
        let target = Path::new(root_dir).join(file);
        write_markdown(&target, &content)?;
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
        "Phase 1 batch A dossier draft created.",
    )?;
    update_relationship_ledger(
        &ledgers.join("relationship-evidence-ledger.csv"),
        &payload().relationship_updates,
        OWNER,
        date,
    )?;
    update_inference_tracker(
        &ledgers.join("inference-dossier-tracker.csv"),
        &inference_keys,
        date,
        "Phase 1 batch A dossier drafted.",
    )?;
    write_inference_dossiers(dataset, sources, root_dir, date)?;
    overwrite_source_extract_log(
        &ledgers.join("source-extract-log.csv"),
        &payload().source_extract_log.header,
        &payload().source_extract_log.rows,
        date,
    )?;

    Ok("Phase 1 batch A complete: dossiers and ledgers updated.\n".to_string())
}

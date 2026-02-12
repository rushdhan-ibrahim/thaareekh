mod audit_evidence;
mod csv_utils;
mod qa_batch_content;
mod reconcile_ledgers;
mod refresh_curated_inference_dossiers;
mod refresh_derived_inference_dossiers;
mod refresh_person_dossiers;
mod refresh_relationship_ledger_quality;
mod source_coverage_audit;
mod source_models;
mod sync_inference_notes;

use maldives_domain::{BaselineSnapshot, Dataset};
use maldives_engine::{
    compare_against_baseline, compute_dataset_stats, expand_derived_relations, merge_unique_edges,
    normalize_edge,
};
use source_models::{SourceRecord, parse_sources_json};
use std::{env, fs, path::PathBuf, process};

fn usage() {
    eprintln!(
        "Usage:\n  maldives-research-cli summarize <dataset.json>\n  maldives-research-cli parity <baseline.json> <mode> <dataset.json>\n  maldives-research-cli derive <dataset.json> <output.json>\n  maldives-research-cli qa-ledgers <dataset.json> <ledger-dir>\n  maldives-research-cli qa-batch-content <root-dir>\n  maldives-research-cli reconcile-ledgers <dataset.json> <root-dir> [date]\n  maldives-research-cli audit-evidence <dataset.json> <sources.json> [--mode <mode>] [--limit <n>] [--inter-dynasty-only] [--json]\n  maldives-research-cli source-coverage-audit <dataset.json> <sources.json> <research-dir> [date]\n  maldives-research-cli refresh-relationship-ledger-quality <root-dir> [date]\n  maldives-research-cli sync-inference-notes <root-dir> [date]\n  maldives-research-cli refresh-person-dossiers <dataset.json> <sources.json> <root-dir> [date]\n  maldives-research-cli refresh-derived-inference-dossiers <dataset.json> <sources.json> <root-dir> [date]\n  maldives-research-cli refresh-curated-inference-dossiers <dataset.json> <sources.json> <root-dir> [date]"
    );
}

fn read_dataset(path: &str) -> Result<Dataset, String> {
    let raw = fs::read_to_string(path).map_err(|e| format!("failed to read dataset: {e}"))?;
    serde_json::from_str(&raw).map_err(|e| format!("failed to parse dataset json: {e}"))
}

fn read_baseline(path: &str) -> Result<BaselineSnapshot, String> {
    let raw = fs::read_to_string(path).map_err(|e| format!("failed to read baseline: {e}"))?;
    serde_json::from_str(&raw).map_err(|e| format!("failed to parse baseline json: {e}"))
}

fn read_sources(path: &str) -> Result<Vec<SourceRecord>, String> {
    let raw = fs::read_to_string(path).map_err(|e| format!("failed to read sources: {e}"))?;
    parse_sources_json(&raw)
}

fn cmd_summarize(dataset_path: &str) -> Result<(), String> {
    let dataset = read_dataset(dataset_path)?;
    let stats = compute_dataset_stats(&dataset);
    println!("mode: {}", dataset.mode);
    println!("people: {}", stats.people);
    println!("edges: {}", stats.edges);
    println!("inferred_edges: {}", stats.inferred_edges);
    println!("uncertain_edges: {}", stats.uncertain_edges);
    Ok(())
}

fn cmd_parity(baseline_path: &str, mode: &str, dataset_path: &str) -> Result<(), String> {
    let baseline = read_baseline(baseline_path)?;
    let dataset = read_dataset(dataset_path)?;
    let actual = compute_dataset_stats(&dataset);
    let issues = compare_against_baseline(mode, &baseline, &actual);

    if !issues.is_empty() {
        eprintln!("Parity failed ({}):", issues.len());
        for issue in issues {
            eprintln!("- {}", issue);
        }
        process::exit(1);
    }

    println!("Parity passed for mode '{mode}'.");
    Ok(())
}

fn cmd_derive(dataset_path: &str, output_path: &str) -> Result<(), String> {
    let dataset = read_dataset(dataset_path)?;
    let derived = expand_derived_relations(&dataset.people, &dataset.edges);
    let merged = merge_unique_edges(&dataset.edges, &derived);
    let normalized = merged.iter().map(normalize_edge).collect::<Vec<_>>();

    let output = Dataset {
        generated_at: dataset.generated_at,
        mode: dataset.mode,
        people: dataset.people,
        edges: normalized,
    };

    let payload = serde_json::to_string_pretty(&output)
        .map_err(|e| format!("failed to encode output json: {e}"))?;
    fs::write(output_path, format!("{payload}\n"))
        .map_err(|e| format!("failed to write output json: {e}"))?;

    println!(
        "Derived dataset written: {} (people={}, edges={})",
        output_path,
        output.people.len(),
        output.edges.len()
    );
    Ok(())
}

fn read_csv_file(path: PathBuf) -> Result<Vec<Vec<String>>, String> {
    csv_utils::read_csv_raw(&path)
}

fn cmd_qa_ledgers(dataset_path: &str, ledger_dir: &str) -> Result<(), String> {
    let dataset = read_dataset(dataset_path)?;
    let inferred_count = dataset.edges.iter().filter(|e| e.c == "i").count();
    let ledger_dir = PathBuf::from(ledger_dir);

    let person_parsed = read_csv_file(ledger_dir.join("person-coverage.csv"))?;
    let edge_parsed = read_csv_file(ledger_dir.join("relationship-evidence-ledger.csv"))?;
    let inference_parsed = read_csv_file(ledger_dir.join("inference-dossier-tracker.csv"))?;
    let concept_parsed = read_csv_file(ledger_dir.join("concept-coverage.csv"))?;
    let source_queue_parsed = read_csv_file(ledger_dir.join("source-expansion-queue.csv"))?;
    let source_extract_parsed = read_csv_file(ledger_dir.join("source-extract-log.csv"))?;

    let person_rows = csv_utils::data_rows(&person_parsed);
    let edge_rows = csv_utils::data_rows(&edge_parsed);
    let inference_rows = csv_utils::data_rows(&inference_parsed);
    let concept_rows = csv_utils::data_rows(&concept_parsed);
    let source_queue_rows = csv_utils::data_rows(&source_queue_parsed);
    let source_extract_rows = csv_utils::data_rows(&source_extract_parsed);

    let mut issues = Vec::new();
    if person_rows != dataset.people.len() {
        issues.push(format!(
            "Person ledger rows ({person_rows}) != people in research mode ({}).",
            dataset.people.len()
        ));
    }
    if edge_rows != dataset.edges.len() {
        issues.push(format!(
            "Relationship ledger rows ({edge_rows}) != edges in research mode ({}).",
            dataset.edges.len()
        ));
    }
    if inference_rows != inferred_count {
        issues.push(format!(
            "Inference tracker rows ({inference_rows}) != inferred edges ({inferred_count})."
        ));
    }
    if concept_rows == 0 {
        issues.push("Concept coverage ledger has no rows.".to_string());
    }
    if source_queue_rows == 0 {
        issues.push("Source expansion queue has no rows.".to_string());
    }
    if source_extract_rows == 0 {
        issues.push("Source extract log has no rows.".to_string());
    }

    let csv_checks = [
        ("person-coverage.csv", &person_parsed),
        ("relationship-evidence-ledger.csv", &edge_parsed),
        ("inference-dossier-tracker.csv", &inference_parsed),
        ("concept-coverage.csv", &concept_parsed),
        ("source-expansion-queue.csv", &source_queue_parsed),
        ("source-extract-log.csv", &source_extract_parsed),
    ];
    for (name, parsed) in csv_checks {
        let bad_rows = csv_utils::invalid_column_rows(parsed);
        if !bad_rows.is_empty() {
            let joined = bad_rows
                .iter()
                .map(|n| n.to_string())
                .collect::<Vec<_>>()
                .join(", ");
            issues.push(format!(
                "{name} has inconsistent column counts at rows: {joined}"
            ));
        }
    }

    if !issues.is_empty() {
        eprintln!("Research ledger QA failed ({}):", issues.len());
        for msg in issues {
            eprintln!("- {msg}");
        }
        process::exit(1);
    }

    println!(
        "Research ledger QA passed:\n- people: {person_rows}\n- edges: {edge_rows}\n- inferred edges: {inference_rows}\n- concept rows: {concept_rows}\n- source queue rows: {source_queue_rows}\n- source extract rows: {source_extract_rows}"
    );
    Ok(())
}

fn cmd_qa_batch_content(root_dir: &str) -> Result<(), String> {
    let payload = qa_batch_content::run(root_dir)?;
    println!("{payload}");
    Ok(())
}

fn cmd_reconcile_ledgers(
    dataset_path: &str,
    root_dir: &str,
    date_opt: Option<&str>,
) -> Result<(), String> {
    let dataset = read_dataset(dataset_path)?;
    let summary = reconcile_ledgers::run(&dataset, root_dir, date_opt)?;
    print!("{summary}");
    Ok(())
}

fn cmd_audit_evidence(
    dataset_path: &str,
    sources_path: &str,
    mode_opt: Option<&str>,
    limit: usize,
    only_inter_dynasty: bool,
    json_output: bool,
) -> Result<(), String> {
    let dataset = read_dataset(dataset_path)?;
    let sources = read_sources(sources_path)?;
    let mode = mode_opt.unwrap_or(dataset.mode.as_str());
    let payload = audit_evidence::run(
        &dataset,
        &sources,
        mode,
        limit,
        only_inter_dynasty,
        json_output,
    )?;
    print!("{payload}");
    Ok(())
}

fn cmd_source_coverage_audit(
    dataset_path: &str,
    sources_path: &str,
    research_dir: &str,
    date_opt: Option<&str>,
) -> Result<(), String> {
    let dataset = read_dataset(dataset_path)?;
    let sources = read_sources(sources_path)?;
    let summary = source_coverage_audit::run(&dataset, &sources, research_dir, date_opt)?;
    print!("{summary}");
    Ok(())
}

fn cmd_refresh_relationship_ledger_quality(
    root_dir: &str,
    date_opt: Option<&str>,
) -> Result<(), String> {
    let summary = refresh_relationship_ledger_quality::run(root_dir, date_opt)?;
    print!("{summary}");
    Ok(())
}

fn cmd_sync_inference_notes(root_dir: &str, date_opt: Option<&str>) -> Result<(), String> {
    let summary = sync_inference_notes::run(root_dir, date_opt)?;
    print!("{summary}");
    Ok(())
}

fn cmd_refresh_person_dossiers(
    dataset_path: &str,
    sources_path: &str,
    root_dir: &str,
    date_opt: Option<&str>,
) -> Result<(), String> {
    let dataset = read_dataset(dataset_path)?;
    let sources = read_sources(sources_path)?;
    let summary = refresh_person_dossiers::run(&dataset, &sources, root_dir, date_opt)?;
    print!("{summary}");
    Ok(())
}

fn cmd_refresh_derived_inference_dossiers(
    dataset_path: &str,
    sources_path: &str,
    root_dir: &str,
    date_opt: Option<&str>,
) -> Result<(), String> {
    let dataset = read_dataset(dataset_path)?;
    let sources = read_sources(sources_path)?;
    let summary = refresh_derived_inference_dossiers::run(&dataset, &sources, root_dir, date_opt)?;
    print!("{summary}");
    Ok(())
}

fn cmd_refresh_curated_inference_dossiers(
    dataset_path: &str,
    sources_path: &str,
    root_dir: &str,
    date_opt: Option<&str>,
) -> Result<(), String> {
    let dataset = read_dataset(dataset_path)?;
    let sources = read_sources(sources_path)?;
    let summary = refresh_curated_inference_dossiers::run(&dataset, &sources, root_dir, date_opt)?;
    print!("{summary}");
    Ok(())
}

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 3 {
        usage();
        process::exit(2);
    }

    let cmd = args[1].as_str();
    let result = match cmd {
        "summarize" => {
            if args.len() != 3 {
                usage();
                process::exit(2);
            }
            cmd_summarize(&args[2])
        }
        "parity" => {
            if args.len() != 5 {
                usage();
                process::exit(2);
            }
            cmd_parity(&args[2], &args[3], &args[4])
        }
        "derive" => {
            if args.len() != 4 {
                usage();
                process::exit(2);
            }
            cmd_derive(&args[2], &args[3])
        }
        "qa-ledgers" => {
            if args.len() != 4 {
                usage();
                process::exit(2);
            }
            cmd_qa_ledgers(&args[2], &args[3])
        }
        "qa-batch-content" => {
            if args.len() != 3 {
                usage();
                process::exit(2);
            }
            cmd_qa_batch_content(&args[2])
        }
        "reconcile-ledgers" => {
            if args.len() != 4 && args.len() != 5 {
                usage();
                process::exit(2);
            }
            cmd_reconcile_ledgers(&args[2], &args[3], args.get(4).map(String::as_str))
        }
        "audit-evidence" => {
            if args.len() < 4 {
                usage();
                process::exit(2);
            }

            let mut mode_opt: Option<String> = None;
            let mut limit: usize = 30;
            let mut only_inter_dynasty = false;
            let mut json_output = false;

            let mut i = 4usize;
            while i < args.len() {
                match args[i].as_str() {
                    "--mode" => {
                        let value = args.get(i + 1).ok_or_else(|| {
                            "missing value for --mode in audit-evidence command".to_string()
                        });
                        match value {
                            Ok(v) => mode_opt = Some(v.clone()),
                            Err(err) => {
                                eprintln!("{err}");
                                process::exit(2);
                            }
                        }
                        i += 2;
                    }
                    "--limit" => {
                        let raw = args.get(i + 1).ok_or_else(|| {
                            "missing value for --limit in audit-evidence command".to_string()
                        });
                        let parsed = match raw {
                            Ok(v) => v.parse::<usize>(),
                            Err(err) => {
                                eprintln!("{err}");
                                process::exit(2);
                            }
                        };
                        match parsed {
                            Ok(n) => limit = n,
                            Err(_) => {
                                eprintln!("invalid --limit value: {}", args[i + 1]);
                                process::exit(2);
                            }
                        }
                        i += 2;
                    }
                    "--inter-dynasty-only" => {
                        only_inter_dynasty = true;
                        i += 1;
                    }
                    "--json" => {
                        json_output = true;
                        i += 1;
                    }
                    other => {
                        eprintln!("unknown audit-evidence flag: {other}");
                        process::exit(2);
                    }
                }
            }

            cmd_audit_evidence(
                &args[2],
                &args[3],
                mode_opt.as_deref(),
                limit,
                only_inter_dynasty,
                json_output,
            )
        }
        "source-coverage-audit" => {
            if args.len() != 5 && args.len() != 6 {
                usage();
                process::exit(2);
            }
            cmd_source_coverage_audit(
                &args[2],
                &args[3],
                &args[4],
                args.get(5).map(String::as_str),
            )
        }
        "refresh-relationship-ledger-quality" => {
            if args.len() != 3 && args.len() != 4 {
                usage();
                process::exit(2);
            }
            cmd_refresh_relationship_ledger_quality(&args[2], args.get(3).map(String::as_str))
        }
        "sync-inference-notes" => {
            if args.len() != 3 && args.len() != 4 {
                usage();
                process::exit(2);
            }
            cmd_sync_inference_notes(&args[2], args.get(3).map(String::as_str))
        }
        "refresh-person-dossiers" => {
            if args.len() != 5 && args.len() != 6 {
                usage();
                process::exit(2);
            }
            cmd_refresh_person_dossiers(
                &args[2],
                &args[3],
                &args[4],
                args.get(5).map(String::as_str),
            )
        }
        "refresh-derived-inference-dossiers" => {
            if args.len() != 5 && args.len() != 6 {
                usage();
                process::exit(2);
            }
            cmd_refresh_derived_inference_dossiers(
                &args[2],
                &args[3],
                &args[4],
                args.get(5).map(String::as_str),
            )
        }
        "refresh-curated-inference-dossiers" => {
            if args.len() != 5 && args.len() != 6 {
                usage();
                process::exit(2);
            }
            cmd_refresh_curated_inference_dossiers(
                &args[2],
                &args[3],
                &args[4],
                args.get(5).map(String::as_str),
            )
        }
        _ => {
            usage();
            process::exit(2);
        }
    };

    if let Err(err) = result {
        eprintln!("{err}");
        process::exit(1);
    }
}

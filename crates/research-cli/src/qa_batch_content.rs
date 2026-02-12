use crate::csv_utils::{CsvRow, read_ledger, row_value};
use serde::Serialize;
use std::fs;
use std::path::{Path, PathBuf};

const PERSON_REQUIRED_HEADINGS: &[&str] = &[
    "## 1) Identity",
    "## 2) Titles, styles, and offices",
    "## 3) Timeline anchors",
    "## 4) Family and relationships",
    "## 5) Evidence summary",
    "## 6) Source list",
    "## 7) Open questions",
    "## 8) Notes for graph integration",
];

const INFERENCE_REQUIRED_HEADINGS: &[&str] = &[
    "## 1) Edge identity",
    "## 2) Why this specific pair is modeled",
    "## 3) Logic chain (pair-specific)",
    "## 4) Alternative interpretations",
    "## 5) Verification checklist",
    "## 6) Source basis",
    "## 7) Integration notes",
];

const CONCEPT_REQUIRED_HEADINGS: &[&str] = &[
    "## 1) Canonical label",
    "## 2) Definition",
    "## 3) Semantic and historical notes",
    "## 4) Person and event links",
    "## 5) Evidence",
    "## 6) Source list",
    "## 7) Open questions",
];

const LOW_DEPTH_PATTERNS: &[&str] = &[
    "to be expanded",
    "working definition drafted",
    "not yet extracted",
    "none recorded",
    "locator extraction pending",
    "pending source assignment",
];

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

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct HitSample {
    id: String,
    hits: usize,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct PersonAudit {
    total: usize,
    missing_files: usize,
    heading_issues: usize,
    low_depth_files: usize,
    worst: Vec<HitSample>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct InferenceAudit {
    total: usize,
    missing_files: usize,
    heading_issues: usize,
    weak_logic: usize,
    weak_samples: Vec<String>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ConceptAudit {
    total: usize,
    missing_files: usize,
    heading_issues: usize,
    low_depth_files: usize,
    worst: Vec<HitSample>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct RelationshipAudit {
    total: usize,
    missing_excerpt: usize,
    missing_locator: usize,
    generic_locator: usize,
    generic_backfill_note: usize,
}

#[derive(Serialize)]
struct BatchReport {
    person: PersonAudit,
    inference: InferenceAudit,
    concept: ConceptAudit,
    relationship: RelationshipAudit,
}

fn count_occurrences(haystack: &str, needle: &str) -> usize {
    if needle.is_empty() {
        return 0;
    }
    let mut total = 0usize;
    let mut start = 0usize;
    while let Some(offset) = haystack[start..].find(needle) {
        total += 1;
        start += offset + needle.len();
    }
    total
}

fn count_pattern_hits(text: &str) -> usize {
    let lower = text.to_lowercase();
    LOW_DEPTH_PATTERNS
        .iter()
        .map(|pattern| count_occurrences(&lower, pattern))
        .sum()
}

fn has_missing_headings(text: &str, required: &[&str]) -> bool {
    required.iter().any(|h| !text.contains(h))
}

fn read_text(path: &Path) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| format!("failed to read {}: {e}", path.display()))
}

fn person_audit(rows: &[CsvRow], root_dir: &Path) -> Result<PersonAudit, String> {
    let mut missing_files = 0usize;
    let mut heading_issues = 0usize;
    let mut low_depth_files = 0usize;
    let mut worst = Vec::<HitSample>::new();

    for row in rows {
        let rel_path = row_value(row, "dossier_file");
        if rel_path.trim().is_empty() {
            missing_files += 1;
            continue;
        }
        let path = root_dir.join(rel_path);
        if !path.exists() {
            missing_files += 1;
            continue;
        }

        let text = read_text(&path)?;
        if has_missing_headings(&text, PERSON_REQUIRED_HEADINGS) {
            heading_issues += 1;
        }

        let hits = count_pattern_hits(&text);
        if hits >= 8 {
            low_depth_files += 1;
            worst.push(HitSample {
                id: row_value(row, "person_id").to_string(),
                hits,
            });
        }
    }

    worst.sort_by(|a, b| b.hits.cmp(&a.hits).then(a.id.cmp(&b.id)));
    worst.truncate(12);

    Ok(PersonAudit {
        total: rows.len(),
        missing_files,
        heading_issues,
        low_depth_files,
        worst,
    })
}

fn inference_audit(rows: &[CsvRow], root_dir: &Path) -> Result<InferenceAudit, String> {
    let mut missing_files = 0usize;
    let mut heading_issues = 0usize;
    let mut weak_logic = 0usize;
    let mut weak_samples = Vec::<String>::new();

    for row in rows {
        let rel_path = row_value(row, "dossier_file");
        if rel_path.trim().is_empty() {
            missing_files += 1;
            continue;
        }
        let path = root_dir.join(rel_path);
        if !path.exists() {
            missing_files += 1;
            continue;
        }

        let text = read_text(&path)?;
        if has_missing_headings(&text, INFERENCE_REQUIRED_HEADINGS) {
            heading_issues += 1;
        }

        let support_count = text.matches("Supporting edge:").count();
        let support_node_count = text.matches("Supporting node:").count();
        if row_value(row, "inference_class") == "rule-derived"
            && support_count + support_node_count == 0
        {
            weak_logic += 1;
            weak_samples.push(row_value(row, "edge_key").to_string());
        }
    }

    weak_samples.truncate(12);

    Ok(InferenceAudit {
        total: rows.len(),
        missing_files,
        heading_issues,
        weak_logic,
        weak_samples,
    })
}

fn concept_audit(rows: &[CsvRow], root_dir: &Path) -> Result<ConceptAudit, String> {
    let mut missing_files = 0usize;
    let mut heading_issues = 0usize;
    let mut low_depth_files = 0usize;
    let mut worst = Vec::<HitSample>::new();

    for row in rows {
        let rel_path = row_value(row, "entry_file");
        if rel_path.trim().is_empty() {
            missing_files += 1;
            continue;
        }
        let path = root_dir.join(rel_path);
        if !path.exists() {
            missing_files += 1;
            continue;
        }

        let text = read_text(&path)?;
        if has_missing_headings(&text, CONCEPT_REQUIRED_HEADINGS) {
            heading_issues += 1;
        }

        let hits = count_pattern_hits(&text);
        if hits >= 6 {
            low_depth_files += 1;
            worst.push(HitSample {
                id: row_value(row, "concept_id").to_string(),
                hits,
            });
        }
    }

    worst.sort_by(|a, b| b.hits.cmp(&a.hits).then(a.id.cmp(&b.id)));
    worst.truncate(8);

    Ok(ConceptAudit {
        total: rows.len(),
        missing_files,
        heading_issues,
        low_depth_files,
        worst,
    })
}

fn relationship_audit(rows: &[CsvRow]) -> RelationshipAudit {
    let unresolved = [
        "locator extraction pending",
        "requires locator-level excerpt",
        "tracked in source-expansion queue",
    ];

    let mut missing_excerpt = 0usize;
    let mut missing_locator = 0usize;
    let mut generic_locator = 0usize;
    let mut generic_backfill_note = 0usize;

    for row in rows {
        let excerpt = row_value(row, "claim_excerpt");
        let locator = row_value(row, "citation_locator");
        let notes = row_value(row, "notes");

        let locator_lower = locator.to_lowercase();
        let has_placeholder_locator = unresolved
            .iter()
            .any(|pattern| locator_lower.contains(pattern));

        if excerpt.trim().is_empty() {
            missing_excerpt += 1;
        }
        if locator.trim().is_empty() || has_placeholder_locator {
            missing_locator += 1;
        }
        if has_placeholder_locator {
            generic_locator += 1;
        }
        if notes
            .to_lowercase()
            .contains("backfilled from inference metadata")
        {
            generic_backfill_note += 1;
        }
    }

    RelationshipAudit {
        total: rows.len(),
        missing_excerpt,
        missing_locator,
        generic_locator,
        generic_backfill_note,
    }
}

pub fn run(root_dir: &str) -> Result<String, String> {
    let root = PathBuf::from(root_dir);
    let ledger_dir = root.join("docs").join("research-program").join("ledgers");

    let person_rows = read_ledger(&ledger_dir.join("person-coverage.csv"), PERSON_HEADER)?;
    let inference_rows = read_ledger(
        &ledger_dir.join("inference-dossier-tracker.csv"),
        INFERENCE_HEADER,
    )?;
    let concept_rows = read_ledger(&ledger_dir.join("concept-coverage.csv"), CONCEPT_HEADER)?;
    let relationship_rows = read_ledger(
        &ledger_dir.join("relationship-evidence-ledger.csv"),
        RELATIONSHIP_HEADER,
    )?;

    let report = BatchReport {
        person: person_audit(&person_rows, &root)?,
        inference: inference_audit(&inference_rows, &root)?,
        concept: concept_audit(&concept_rows, &root)?,
        relationship: relationship_audit(&relationship_rows),
    };

    serde_json::to_string_pretty(&report).map_err(|e| format!("failed to encode report: {e}"))
}

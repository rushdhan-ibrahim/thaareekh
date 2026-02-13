use crate::csv_utils::{csv_escape, parse_csv};
use std::collections::{HashMap, HashSet};
use std::fs;
use std::path::Path;

const DEFAULT_DATE: &str = "2026-02-08";
const OWNER: &str = "phase5-conflict-c";

const QUEUE_START: &str = "<!-- PROMOTION-BATCH-C-START -->";
const QUEUE_END: &str = "<!-- PROMOTION-BATCH-C-END -->";
const CONTRA_START: &str = "<!-- CONTRADICTION-BATCH-C-START -->";
const CONTRA_END: &str = "<!-- CONTRADICTION-BATCH-C-END -->";

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
    let Some(col) = idx.get(key).copied() else {
        return;
    };
    if col < row.len() {
        row[col] = value;
    }
}

fn append_note(row: &mut [String], idx: &HashMap<String, usize>, message: &str) {
    let prev = row_get(row, idx, "notes");
    if prev.contains(message) {
        return;
    }
    let next = if prev.is_empty() {
        message.to_string()
    } else {
        format!("{prev} {message}")
    };
    row_set(row, idx, "notes", next);
}

fn replace_section(text: &str, start: &str, end: &str, section: &str) -> String {
    if let (Some(a), Some(b_start)) = (text.find(start), text.find(end)) {
        let b = b_start + end.len();
        return format!("{}{}{}", &text[..a], section, &text[b..]);
    }
    format!("{}\n\n{}\n", text.trim_end(), section)
}

pub fn run(root_dir: &str, date_opt: Option<&str>) -> Result<String, String> {
    let date = date_opt.unwrap_or(DEFAULT_DATE);
    let root = Path::new(root_dir);
    let relationship_ledger_path = root
        .join("docs")
        .join("research-program")
        .join("ledgers")
        .join("relationship-evidence-ledger.csv");
    let promotion_queue_path = root
        .join("docs")
        .join("research-program")
        .join("promotion-queue.md");
    let contradiction_log_path = root
        .join("docs")
        .join("research-program")
        .join("contradiction-log.md");

    let focus_ids = [
        "CLM-0209", "CLM-0212", "CLM-0215", "CLM-0217", "CLM-0219", "CLM-0262", "CLM-0363",
        "CLM-0364", "CLM-0365", "CLM-0366", "CLM-0382", "CLM-0383", "CLM-0450",
    ]
    .into_iter()
    .collect::<HashSet<_>>();
    let deferred_ids = ["CLM-0209", "CLM-0215"].into_iter().collect::<HashSet<_>>();
    let classification_ids = ["CLM-0364"].into_iter().collect::<HashSet<_>>();

    let rel_raw = fs::read_to_string(&relationship_ledger_path)
        .map_err(|e| format!("failed to read {}: {e}", relationship_ledger_path.display()))?;
    let mut rel_csv = parse_csv(&rel_raw);
    if rel_csv.is_empty() {
        return Err(format!("empty csv: {}", relationship_ledger_path.display()));
    }
    let idx = header_index(&rel_csv[0]);

    let mut reviewed = 0usize;
    let mut deferred = 0usize;
    let mut classification_flagged = 0usize;

    for row in rel_csv.iter_mut().skip(1) {
        let claim_id = row_get(row, &idx, "claim_id").to_string();
        if !focus_ids.contains(claim_id.as_str()) {
            continue;
        }

        reviewed += 1;
        row_set(row, &idx, "reviewer", OWNER.to_string());
        row_set(row, &idx, "last_reviewed", date.to_string());
        row_set(row, &idx, "access_date", date.to_string());
        append_note(
            row,
            &idx,
            &format!("Phase 5 conflict batch C reviewed {date} for P87/P90/P91/P95/P129 corridor."),
        );

        if deferred_ids.contains(claim_id.as_str()) {
            deferred += 1;
            row_set(row, &idx, "canonical_decision", "deferred".to_string());
            append_note(
                row,
                &idx,
                "Deferred in Phase 5 batch C: ambiguous late-monarchy ancestor wording conflicts with stronger direct lineage scaffold; keep out of canonical promotion.",
            );
        }

        if classification_ids.contains(claim_id.as_str()) {
            classification_flagged += 1;
            append_note(
                row,
                &idx,
                "Phase 5 batch C classification review: excerpt uses direct parent wording but edge remains inferred; require quote-level extraction and one independent corroboration before promotion.",
            );
        }
    }

    fs::write(&relationship_ledger_path, rows_to_csv(&rel_csv)).map_err(|e| {
        format!(
            "failed to write {}: {e}",
            relationship_ledger_path.display()
        )
    })?;

    let queue_section = format!(
        "{QUEUE_START}
## Batch 3 ({date}): High-Impact Bridge Adjudication (P87/P90/P91/P95/P129)

### 1. `parent|P87|P129|`
1. Claim/edge: `parent|P87|P129|` (CLM-0364)
2. Proposed change: Keep edge as inferred for now, but prioritize immediate promotion review because current excerpt wording is direct parent language.
3. Evidence summary: Current ledger excerpt states direct parent wording from `SRC-MRF-KINGS` while model state remains inferred; this is a classification mismatch requiring quote-level confirmation and independent corroboration.
4. Source IDs: SRC-MRF-KINGS (+ target corroboration source to be added from queue)
5. Risk notes: High-visibility bridge into modern Didi descendants; misclassification would propagate to sibling and avuncular inference chains.
6. Reviewer: {OWNER}
7. Status: pending

### 2. `kin|P86|P95|ancestor?` and `kin|P88|P95|grandfather?`
1. Claim/edge: `kin|P86|P95|ancestor?` (CLM-0209), `kin|P88|P95|grandfather?` (CLM-0215)
2. Proposed change: Defer canonical promotion and explicitly treat both as contested placeholders pending stronger source wording.
3. Evidence summary: Both claims remain question-mark labels from the same specialist source family, while stronger direct scaffold claims in the same corridor identify `P87 -> P95` as the explicit grandparent relation.
4. Source IDs: SRC-MRF-KINGS
5. Risk notes: These labels can be true only at broader generational depth, but current phrasing is too ambiguous for canonical edge semantics.
6. Reviewer: {OWNER}
7. Status: deferred

### 3. `kin|P90|P95|aunt/uncle↔niece/nephew` and `kin|P91|P95|aunt/uncle↔niece/nephew`
1. Claim/edge: `kin|P90|P95|aunt/uncle↔niece/nephew` (CLM-0217), `kin|P91|P95|aunt/uncle↔niece/nephew` (CLM-0219)
2. Proposed change: Retain as inferred with no promotion change.
3. Evidence summary: Derived logic remains coherent via `P87 -> P90/P91` plus `P87 -> P129 -> P95`, but direct pairwise aunt/uncle wording is not captured yet.
4. Source IDs: SRC-DERIVED-RULES (+ support chain from SRC-MRF-KINGS and SRC-WIKI-MUHAMMAD-FAREED)
5. Risk notes: Safe as inferred; should only be promoted after pair-explicit wording is captured.
6. Reviewer: {OWNER}
7. Status: pending

{QUEUE_END}"
    );
    let queue_old = fs::read_to_string(&promotion_queue_path)
        .map_err(|e| format!("failed to read {}: {e}", promotion_queue_path.display()))?;
    let queue_new = replace_section(&queue_old, QUEUE_START, QUEUE_END, &queue_section);
    fs::write(&promotion_queue_path, queue_new)
        .map_err(|e| format!("failed to write {}: {e}", promotion_queue_path.display()))?;

    let contradiction_section = format!(
        "{CONTRA_START}
### Batch Review ({date}) — Bridge Corridor Adjudication
- `ID`: CLOG-{date}-C1
- `Topic`: Late-monarchy to modern bridge contradiction handling around P95
- `Entities`: P86, P87, P88, P90, P91, P95, P129
- `Claim A`: Direct scaffold claims indicate `P87 -> P95` (grandfather via daughter) and `P129 -> P95` parent linkage, supported by parent claims `P87 -> P90/P91`.
- `Claim B`: Contested labels `P86 -> P95 ancestor?` and `P88 -> P95 grandfather?` remain ambiguous and are currently D-grade placeholders.
- `Sources`: CLM-0212, CLM-0262, CLM-0363, CLM-0365, CLM-0366, CLM-0450 vs CLM-0209, CLM-0215; SRC-MRF-KINGS, SRC-WIKI-MUHAMMAD-FAREED, SRC-DERIVED-RULES
- `Current stance`: Keep direct scaffold claims active; defer ambiguous D-grade ancestor labels from canonical promotion.
- `Adjudication rationale`: The corridor has a coherent and explicit direct backbone for immediate relations; ambiguous question-mark labels do not meet canonical specificity standards.
- `Next verification action`: Capture quote-level excerpts for CLM-0209/0215 and add one independent corroboration source before revisiting.
- `Last reviewed`: {date}

- `ID`: CLOG-{date}-C2
- `Topic`: Classification mismatch on `parent|P87|P129|`
- `Entities`: P87, P129
- `Claim A`: CLM-0364 excerpt currently states direct parent wording from `SRC-MRF-KINGS`.
- `Claim B`: Edge remains marked inferred in dataset/ledger modeling.
- `Sources`: CLM-0364, docs/research-program/inferences/parent-p87-p129.md, SRC-MRF-KINGS
- `Current stance`: Treat as high-priority promotion candidate, but do not auto-promote until quote-level extraction and one independent corroboration check are complete.
- `Adjudication rationale`: This edge sits on a high-impact monarchy-to-modern bridge; strict promotion standards require explicit quote-level capture and corroboration to avoid overfitting to one source stream.
- `Next verification action`: Run targeted deep-source extraction pass for CLM-0364 and queue corroboration source assignment.
- `Last reviewed`: {date}
{CONTRA_END}"
    );
    let contradiction_old = fs::read_to_string(&contradiction_log_path)
        .map_err(|e| format!("failed to read {}: {e}", contradiction_log_path.display()))?;
    let contradiction_new = replace_section(
        &contradiction_old,
        CONTRA_START,
        CONTRA_END,
        &contradiction_section,
    );
    fs::write(&contradiction_log_path, contradiction_new)
        .map_err(|e| format!("failed to write {}: {e}", contradiction_log_path.display()))?;

    Ok(format!(
        "Phase 5 conflict batch C complete:\n- focus claims reviewed: {reviewed}\n- contested claims deferred: {deferred}\n- classification mismatches flagged: {classification_flagged}\n- relationship ledger updated: {}\n- promotion queue updated: {}\n- contradiction log updated: {}\n",
        relationship_ledger_path.display(),
        promotion_queue_path.display(),
        contradiction_log_path.display()
    ))
}

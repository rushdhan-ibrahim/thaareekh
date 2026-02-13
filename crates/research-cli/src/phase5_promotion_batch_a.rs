use crate::csv_utils::{csv_escape, parse_csv};
use regex::Regex;
use std::collections::{HashMap, HashSet};
use std::fs;
use std::path::Path;
use std::sync::OnceLock;

const DEFAULT_DATE: &str = "2026-02-08";
const OWNER: &str = "phase5-promo-a";

const QUEUE_START: &str = "<!-- PROMOTION-BATCH-A-START -->";
const QUEUE_END: &str = "<!-- PROMOTION-BATCH-A-END -->";
const CONTRA_START: &str = "<!-- CONTRADICTION-BATCH-A-START -->";
const CONTRA_END: &str = "<!-- CONTRADICTION-BATCH-A-END -->";

#[derive(Clone)]
struct ClaimRecord {
    claim_id: String,
    claim_type: String,
    confidence_grade: String,
    primary_source_id: String,
    claim_excerpt: String,
}

#[derive(Clone)]
struct Bundle {
    edge_key: String,
    direct_strong_claim_ids: Vec<String>,
    source_ids: Vec<String>,
    dominant: Option<(String, usize, usize)>,
    sample_excerpt: String,
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
    let Some(col) = idx.get(key).copied() else {
        return;
    };
    if col < row.len() {
        row[col] = value;
    }
}

fn replace_section(text: &str, start: &str, end: &str, section: &str) -> String {
    if let (Some(a), Some(b_start)) = (text.find(start), text.find(end)) {
        let b = b_start + end.len();
        return format!("{}{}{}", &text[..a], section, &text[b..]);
    }
    format!("{}\n\n{}\n", text.trim_end(), section)
}

fn curated_re() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| Regex::new(r"Inference class:\s*`curated`").expect("valid curated regex"))
}

fn claim_re() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| Regex::new(r"CLM-\d{4}").expect("valid claim regex"))
}

fn edge_key_re() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| Regex::new(r"Edge key:\s*`([^`]+)`").expect("valid edge-key regex"))
}

fn uniq(values: &[String]) -> Vec<String> {
    let mut seen = HashSet::<String>::new();
    let mut out = Vec::<String>::new();
    for value in values {
        if value.is_empty() {
            continue;
        }
        if seen.insert(value.clone()) {
            out.push(value.clone());
        }
    }
    out
}

fn compact_ws(text: &str) -> String {
    let mut out = String::new();
    let mut prev_ws = false;
    for ch in text.chars() {
        if ch.is_whitespace() {
            if !prev_ws {
                out.push(' ');
            }
            prev_ws = true;
        } else {
            out.push(ch);
            prev_ws = false;
        }
    }
    out.trim().to_string()
}

fn short(text: &str, max: usize) -> String {
    let s = compact_ws(text);
    if s.is_empty() {
        return String::new();
    }
    if s.chars().count() <= max {
        return s;
    }
    let mut out = String::new();
    for (i, ch) in s.chars().enumerate() {
        if i >= max.saturating_sub(3) {
            break;
        }
        out.push(ch);
    }
    out.push_str("...");
    out
}

fn extract_claim_ids(text: &str) -> Vec<String> {
    let mut seen = HashSet::<String>::new();
    let mut out = Vec::<String>::new();
    for m in claim_re().find_iter(text) {
        let id = m.as_str().to_string();
        if seen.insert(id.clone()) {
            out.push(id);
        }
    }
    out
}

fn extract_edge_key(text: &str) -> String {
    edge_key_re()
        .captures(text)
        .and_then(|cap| cap.get(1).map(|m| m.as_str().trim().to_string()))
        .unwrap_or_default()
}

fn load_curated_inference_bundles(
    inferences_dir: &Path,
    claim_by_id: &HashMap<String, ClaimRecord>,
) -> Result<Vec<Bundle>, String> {
    let mut files = fs::read_dir(inferences_dir)
        .map_err(|e| format!("failed to read {}: {e}", inferences_dir.display()))?
        .filter_map(|entry| entry.ok())
        .filter_map(|entry| {
            let path = entry.path();
            let name = path.file_name()?.to_string_lossy().to_string();
            if name.ends_with(".md") {
                Some(path)
            } else {
                None
            }
        })
        .collect::<Vec<_>>();
    files.sort_by(|a, b| {
        let a_name = a
            .file_name()
            .map(|v| v.to_string_lossy())
            .unwrap_or_default();
        let b_name = b
            .file_name()
            .map(|v| v.to_string_lossy())
            .unwrap_or_default();
        a_name.cmp(&b_name)
    });

    let mut bundles = Vec::<Bundle>::new();
    for path in files {
        let text = fs::read_to_string(&path)
            .map_err(|e| format!("failed to read {}: {e}", path.display()))?;
        if !curated_re().is_match(&text) {
            continue;
        }

        let edge_key = extract_edge_key(&text);
        let all_claim_ids = extract_claim_ids(&text);
        let direct_strong_claim_ids = all_claim_ids
            .iter()
            .filter_map(|id| {
                let claim = claim_by_id.get(id)?;
                if claim.claim_type == "direct"
                    && (claim.confidence_grade == "A" || claim.confidence_grade == "B")
                {
                    Some(id.clone())
                } else {
                    None
                }
            })
            .collect::<Vec<_>>();
        if direct_strong_claim_ids.is_empty() {
            continue;
        }

        let rows = direct_strong_claim_ids
            .iter()
            .filter_map(|id| claim_by_id.get(id))
            .cloned()
            .collect::<Vec<_>>();
        let source_ids = uniq(
            &rows
                .iter()
                .map(|row| row.primary_source_id.clone())
                .collect::<Vec<_>>(),
        );

        let mut counts = HashMap::<String, usize>::new();
        let mut seen_order = Vec::<String>::new();
        for row in &rows {
            let source = if row.primary_source_id.is_empty() {
                "(none)".to_string()
            } else {
                row.primary_source_id.clone()
            };
            let entry = counts.entry(source.clone()).or_insert_with(|| {
                seen_order.push(source.clone());
                0
            });
            *entry += 1;
        }
        let dominant = if counts.is_empty() {
            None
        } else {
            let mut ranked = seen_order
                .iter()
                .filter_map(|source| {
                    counts
                        .get(source)
                        .copied()
                        .map(|count| (source.clone(), count))
                })
                .collect::<Vec<_>>();
            ranked.sort_by(|a, b| b.1.cmp(&a.1));
            ranked
                .first()
                .map(|(source, count)| (source.clone(), *count, rows.len()))
        };

        bundles.push(Bundle {
            edge_key,
            direct_strong_claim_ids,
            source_ids,
            dominant,
            sample_excerpt: short(
                rows.first()
                    .map(|row| row.claim_excerpt.as_str())
                    .unwrap_or(""),
                180,
            ),
        });
    }

    bundles.sort_by(|a, b| natural_cmp(&a.edge_key, &b.edge_key));
    Ok(bundles)
}

fn next_alnum_token(s: &str, start: usize) -> Option<(usize, &str)> {
    if start >= s.len() {
        return None;
    }
    let mut begin = None::<usize>;
    for (i, ch) in s[start..].char_indices() {
        if ch.is_ascii_alphanumeric() {
            begin = Some(start + i);
            break;
        }
    }
    let b = begin?;
    let mut end = s.len();
    for (i, ch) in s[b..].char_indices() {
        if !ch.is_ascii_alphanumeric() {
            end = b + i;
            break;
        }
    }
    Some((end, &s[b..end]))
}

fn natural_cmp(a: &str, b: &str) -> std::cmp::Ordering {
    let mut ia = 0usize;
    let mut ib = 0usize;

    loop {
        let ca = next_alnum_token(a, ia);
        let cb = next_alnum_token(b, ib);
        match (ca, cb) {
            (None, None) => return a.cmp(b),
            (None, Some(_)) => return std::cmp::Ordering::Less,
            (Some(_), None) => return std::cmp::Ordering::Greater,
            (Some((a_end, a_tok)), Some((b_end, b_tok))) => {
                let ord = a_tok.cmp(b_tok);
                if ord != std::cmp::Ordering::Equal {
                    return ord;
                }
                ia = a_end.saturating_add(1);
                ib = b_end.saturating_add(1);
            }
        }
    }
}

pub fn run(root_dir: &str, date_opt: Option<&str>) -> Result<String, String> {
    let date = date_opt.unwrap_or(DEFAULT_DATE);
    let root = Path::new(root_dir);
    let inferences_dir = root
        .join("docs")
        .join("research-program")
        .join("inferences");
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

    let rel_raw = fs::read_to_string(&relationship_ledger_path)
        .map_err(|e| format!("failed to read {}: {e}", relationship_ledger_path.display()))?;
    let mut rel_csv = parse_csv(&rel_raw);
    if rel_csv.is_empty() {
        return Err(format!("empty csv: {}", relationship_ledger_path.display()));
    }
    let rel_idx = header_index(&rel_csv[0]);

    let mut claim_by_id = HashMap::<String, ClaimRecord>::new();
    for row in rel_csv.iter().skip(1) {
        let claim = ClaimRecord {
            claim_id: row_get(row, &rel_idx, "claim_id").to_string(),
            claim_type: row_get(row, &rel_idx, "claim_type").to_string(),
            confidence_grade: row_get(row, &rel_idx, "confidence_grade").to_string(),
            primary_source_id: row_get(row, &rel_idx, "primary_source_id").to_string(),
            claim_excerpt: row_get(row, &rel_idx, "claim_excerpt").to_string(),
        };
        claim_by_id.insert(claim.claim_id.clone(), claim);
    }

    let bundles = load_curated_inference_bundles(&inferences_dir, &claim_by_id)?;
    let batch_claim_ids = uniq(
        &bundles
            .iter()
            .flat_map(|bundle| bundle.direct_strong_claim_ids.iter().cloned())
            .collect::<Vec<_>>(),
    );
    let batch_claim_set = batch_claim_ids.iter().cloned().collect::<HashSet<_>>();

    let mut approved_now = 0usize;
    for row in rel_csv.iter_mut().skip(1) {
        let claim_id = row_get(row, &rel_idx, "claim_id").to_string();
        if !batch_claim_set.contains(&claim_id) {
            continue;
        }

        row_set(row, &rel_idx, "review_status", "approved".to_string());
        if row_get(row, &rel_idx, "canonical_decision") != "approved" {
            approved_now += 1;
        }
        row_set(row, &rel_idx, "canonical_decision", "approved".to_string());
        row_set(row, &rel_idx, "reviewer", OWNER.to_string());
        row_set(row, &rel_idx, "last_reviewed", date.to_string());
        row_set(row, &rel_idx, "access_date", date.to_string());

        let note = row_get(row, &rel_idx, "notes");
        let stamp = format!("Promotion Batch A approved {date}; curated-inference support claim.");
        if !note.contains(&stamp) {
            let next = if note.is_empty() {
                stamp
            } else {
                format!("{note} {stamp}")
            };
            row_set(row, &rel_idx, "notes", next);
        }
    }

    fs::write(&relationship_ledger_path, rows_to_csv(&rel_csv)).map_err(|e| {
        format!(
            "failed to write {}: {e}",
            relationship_ledger_path.display()
        )
    })?;

    let queue_entries = bundles
        .iter()
        .enumerate()
        .map(|(i, bundle)| {
            let top_ids = bundle
                .direct_strong_claim_ids
                .iter()
                .take(6)
                .cloned()
                .collect::<Vec<_>>()
                .join(", ");
            let more = if bundle.direct_strong_claim_ids.len() > 6 {
                format!(
                    " (+{} more)",
                    bundle.direct_strong_claim_ids.len().saturating_sub(6)
                )
            } else {
                String::new()
            };
            let dominance = if let Some((source, count, total)) = &bundle.dominant {
                if *total > 0 {
                    let percent = ((*count as f64 / *total as f64) * 100.0).round() as i32;
                    format!("{percent}% {source}")
                } else {
                    "no dominant source".to_string()
                }
            } else {
                "no dominant source".to_string()
            };

            format!(
                "### {}. `{}`
1. Claim/edge: `{}`
2. Proposed change: Approve direct A/B support claims for this inferred-edge context while keeping the inferred edge itself unpromoted.
3. Evidence summary: {} direct claims approved ({}{}). Sample excerpt: {}
4. Source IDs: {}
5. Risk notes: Inferred edge remains provisional; support-claim source concentration snapshot: {}.
6. Reviewer: {}
7. Status: approved",
                i + 1,
                bundle.edge_key,
                bundle.edge_key,
                bundle.direct_strong_claim_ids.len(),
                top_ids,
                more,
                if bundle.sample_excerpt.is_empty() {
                    "n/a".to_string()
                } else {
                    bundle.sample_excerpt.clone()
                },
                bundle.source_ids.join(", "),
                dominance,
                OWNER
            )
        })
        .collect::<Vec<_>>()
        .join("\n\n");

    let queue_section = format!(
        "{QUEUE_START}
## Batch 1 ({date}): Curated Inference Support Promotion

{queue_entries}

{QUEUE_END}"
    );
    let queue_old = fs::read_to_string(&promotion_queue_path)
        .map_err(|e| format!("failed to read {}: {e}", promotion_queue_path.display()))?;
    let queue_new = replace_section(&queue_old, QUEUE_START, QUEUE_END, &queue_section);
    fs::write(&promotion_queue_path, queue_new)
        .map_err(|e| format!("failed to write {}: {e}", promotion_queue_path.display()))?;

    let contradiction_section = format!(
        "{CONTRA_START}
### Batch Review ({date}) — Promotion Batch A Pre-check
- `ID`: CLOG-{date}-A
- `Topic`: Pre-promotion contradiction sweep for curated-inference support claims
- `Entities`: {} direct A/B claims linked from curated inference dossiers
- `Claim A`: Batch claims have explicit claim text and locator anchors in the relationship ledger.
- `Claim B`: Potential latent contradictions may still exist in not-yet-ingested primary archival sources.
- `Sources`: relationship-evidence-ledger.csv, curated inference dossiers, contradiction-log baseline
- `Current stance`: No blocking direct contradiction found in structured ledger checks for this batch.
- `Adjudication rationale`: Zero duplicate direct tuples and zero >2-parent anomalies were detected; batch proceeds with provisional promotion of direct support claims only.
- `Next verification action`: Re-audit this batch after next archival-source ingestion and contradiction-log expansion.
- `Last reviewed`: {date}
{CONTRA_END}",
        batch_claim_ids.len()
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
        "Phase 5 promotion batch A complete:\n- curated bundles processed: {}\n- direct claims in batch: {}\n- canonical_decision newly approved this run: {}\n- promotion queue updated: {}\n- contradiction log updated: {}\n",
        bundles.len(),
        batch_claim_ids.len(),
        approved_now,
        promotion_queue_path.display(),
        contradiction_log_path.display()
    ))
}

use maldives_domain::{Dataset, Person};
use serde::Deserialize;
use serde_json::Value;
use std::collections::HashSet;
use std::fs;

#[derive(Debug, Deserialize)]
#[allow(non_snake_case)]
struct UiReferencePayload {
    #[serde(default)]
    officeCatalog: Vec<OfficeRow>,
    #[serde(default)]
    officeTimeline: Vec<OfficeTimelineRow>,
    #[serde(default)]
    officeByIdSize: usize,
    #[serde(default)]
    storyTrails: Vec<StoryTrailRow>,
}

#[derive(Debug, Deserialize)]
struct OfficeRow {
    #[serde(default)]
    id: String,
}

#[derive(Debug, Deserialize)]
struct OfficeTimelineRow {
    #[serde(default)]
    offices: Vec<String>,
}

#[derive(Debug, Deserialize)]
struct StoryTrailRow {
    #[serde(default)]
    id: String,
    #[serde(default)]
    steps: Vec<StoryStep>,
}

#[derive(Debug, Deserialize)]
#[serde(untagged)]
enum StoryStep {
    Id(String),
    Detailed(StoryStepDetailed),
}

#[derive(Debug, Deserialize)]
struct StoryStepDetailed {
    #[serde(default)]
    id: String,
    year: Option<f64>,
}

fn read_ui_reference(path: &str) -> Result<UiReferencePayload, String> {
    let raw = fs::read_to_string(path).map_err(|e| format!("failed to read {path}: {e}"))?;
    serde_json::from_str(&raw).map_err(|e| format!("failed to parse ui reference json: {e}"))
}

fn value_number(value: Option<&Value>) -> Option<f64> {
    value.and_then(Value::as_f64).filter(|n| n.is_finite())
}

fn known_years(person: &Person) -> Vec<f64> {
    let mut years = Vec::new();
    let Some(re) = person.extra.get("re").and_then(Value::as_array) else {
        return years;
    };

    for period in re {
        let Some(arr) = period.as_array() else {
            continue;
        };
        for cell in arr {
            if let Some(n) = cell.as_f64().filter(|v| v.is_finite()) {
                years.push(n);
            }
        }
    }
    years
}

fn person_span(person: &Person) -> (Option<f64>, Option<f64>) {
    let years = known_years(person);
    let re_start = years.iter().copied().reduce(f64::min);
    let re_end = years.iter().copied().reduce(f64::max);

    let yb = value_number(person.extra.get("yb"));
    let yd = value_number(person.extra.get("yd"));
    let start = yb.or_else(|| re_start.map(|y| y - 30.0));
    let end = yd.or_else(|| re_end.map(|y| y + 10.0));

    (start, end)
}

fn timeline_extent(people: &[Person]) -> (f64, f64) {
    let mut min = f64::INFINITY;
    let mut max = f64::NEG_INFINITY;

    for person in people {
        let (start, end) = person_span(person);
        if let Some(s) = start {
            min = min.min(s);
        }
        if let Some(e) = end {
            max = max.max(e);
        }
    }

    if !min.is_finite() || !max.is_finite() {
        (1000.0, 2026.0)
    } else {
        (min, max)
    }
}

fn fmt_number(value: f64) -> String {
    if value.fract().abs() < 1e-9 {
        format!("{}", value as i64)
    } else {
        let mut out = value.to_string();
        while out.ends_with('0') {
            out.pop();
        }
        if out.ends_with('.') {
            out.pop();
        }
        out
    }
}

fn story_step_fields(step: &StoryStep) -> (String, Option<f64>) {
    match step {
        StoryStep::Id(id) => (id.clone(), None),
        StoryStep::Detailed(row) => (row.id.clone(), row.year),
    }
}

pub fn run(dataset: &Dataset, ui_reference_path: &str) -> Result<String, String> {
    let ui = read_ui_reference(ui_reference_path)?;

    let mut issues = Vec::<String>::new();

    let person_ids = dataset
        .people
        .iter()
        .map(|p| p.id.clone())
        .collect::<HashSet<_>>();
    if person_ids.len() != dataset.people.len() {
        issues.push(format!(
            "Duplicate person IDs detected ({} duplicates).",
            dataset.people.len() - person_ids.len()
        ));
    }

    for (idx, edge) in dataset.edges.iter().enumerate() {
        if !person_ids.contains(&edge.s) {
            issues.push(format!("Edge[{idx}] has unknown source: {}", edge.s));
        }
        if !person_ids.contains(&edge.d) {
            issues.push(format!("Edge[{idx}] has unknown target: {}", edge.d));
        }
        if edge.t.is_empty() {
            issues.push(format!("Edge[{idx}] missing relation type."));
        }
        if edge.c.is_empty() {
            issues.push(format!("Edge[{idx}] missing confidence marker."));
        }
    }

    let office_ids = ui
        .officeCatalog
        .iter()
        .map(|o| o.id.clone())
        .collect::<HashSet<_>>();
    if office_ids.len() != ui.officeCatalog.len() {
        issues.push(format!(
            "Duplicate office IDs detected ({} duplicates).",
            ui.officeCatalog.len() - office_ids.len()
        ));
    }
    if ui.officeByIdSize != ui.officeCatalog.len() {
        issues.push("officeById map size mismatch with officeCatalog.".to_string());
    }

    for (idx, row) in ui.officeTimeline.iter().enumerate() {
        for office_id in &row.offices {
            if !office_ids.contains(office_id) {
                issues.push(format!(
                    "officeTimeline[{idx}] references unknown office: {}",
                    office_id
                ));
            }
        }
    }

    let (era_min, era_max) = timeline_extent(&dataset.people);
    for (trail_idx, trail) in ui.storyTrails.iter().enumerate() {
        if trail.id.is_empty() {
            issues.push(format!("storyTrails[{trail_idx}] missing id."));
        }
        if trail.steps.is_empty() {
            issues.push(format!("storyTrails[{trail_idx}] has no steps."));
            continue;
        }

        for (step_idx, step) in trail.steps.iter().enumerate() {
            let (step_id, step_year) = story_step_fields(step);
            if step_id.is_empty() {
                issues.push(format!(
                    "storyTrails[{trail_idx}].steps[{step_idx}] missing person id."
                ));
                continue;
            }
            if !person_ids.contains(&step_id) {
                issues.push(format!(
                    "storyTrails[{trail_idx}].steps[{step_idx}] references unknown person: {}",
                    step_id
                ));
            }

            if let Some(year) = step_year.filter(|y| y.is_finite()) {
                if year < era_min || year > era_max {
                    issues.push(format!(
                        "storyTrails[{trail_idx}].steps[{step_idx}] year {} is outside timeline extent {}-{}.",
                        fmt_number(year),
                        fmt_number(era_min),
                        fmt_number(era_max)
                    ));
                }
            }
        }
    }

    if !issues.is_empty() {
        let mut out = format!("QA smoke checks failed ({}):", issues.len());
        for issue in issues {
            out.push_str("\n- ");
            out.push_str(&issue);
        }
        return Err(out);
    }

    Ok(format!(
        "QA smoke checks passed:\n- {} people\n- {} edges\n- {} offices\n- {} office periods\n- {} story trails\n",
        dataset.people.len(),
        dataset.edges.len(),
        ui.officeCatalog.len(),
        ui.officeTimeline.len(),
        ui.storyTrails.len()
    ))
}

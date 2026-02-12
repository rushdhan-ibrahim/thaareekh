use std::collections::{BTreeMap, HashMap, HashSet};
use std::fs;
use std::path::Path;

pub type CsvRow = BTreeMap<String, String>;

pub fn parse_csv(text: &str) -> Vec<Vec<String>> {
    let mut rows = Vec::new();
    let mut row = Vec::new();
    let mut field = String::new();
    let mut in_quotes = false;
    let chars = text.chars().collect::<Vec<_>>();
    let mut i = 0usize;

    while i < chars.len() {
        let ch = chars[i];
        if in_quotes {
            if ch == '"' {
                if i + 1 < chars.len() && chars[i + 1] == '"' {
                    field.push('"');
                    i += 1;
                } else {
                    in_quotes = false;
                }
            } else {
                field.push(ch);
            }
            i += 1;
            continue;
        }

        match ch {
            '"' => in_quotes = true,
            ',' => {
                row.push(field);
                field = String::new();
            }
            '\n' => {
                row.push(field);
                rows.push(row);
                row = Vec::new();
                field = String::new();
            }
            '\r' => {}
            _ => field.push(ch),
        }
        i += 1;
    }

    if !field.is_empty() || !row.is_empty() {
        row.push(field);
        rows.push(row);
    }

    rows
}

pub fn read_csv_raw(path: &Path) -> Result<Vec<Vec<String>>, String> {
    let raw =
        fs::read_to_string(path).map_err(|e| format!("failed to read {}: {e}", path.display()))?;
    Ok(parse_csv(&raw))
}

pub fn data_rows(parsed: &[Vec<String>]) -> usize {
    parsed.len().saturating_sub(1)
}

pub fn invalid_column_rows(parsed: &[Vec<String>]) -> Vec<usize> {
    if parsed.is_empty() {
        return Vec::new();
    }
    let expected = parsed[0].len();
    parsed
        .iter()
        .enumerate()
        .skip(1)
        .filter_map(|(i, row)| (row.len() != expected).then_some(i + 1))
        .collect()
}

pub fn csv_escape(input: &str) -> String {
    if input.contains('"') || input.contains(',') || input.contains('\n') {
        format!("\"{}\"", input.replace('"', "\"\""))
    } else {
        input.to_string()
    }
}

pub fn to_csv(header: &[&str], rows: &[CsvRow]) -> String {
    let mut out = String::new();
    out.push_str(
        &header
            .iter()
            .map(|h| csv_escape(h))
            .collect::<Vec<_>>()
            .join(","),
    );
    out.push('\n');

    for row in rows {
        let line = header
            .iter()
            .map(|h| csv_escape(row.get(*h).map(String::as_str).unwrap_or("")))
            .collect::<Vec<_>>()
            .join(",");
        out.push_str(&line);
        out.push('\n');
    }

    out
}

pub fn is_empty_row_map(row: &CsvRow) -> bool {
    !row.values().any(|v| !v.trim().is_empty())
}

pub fn rows_from_parsed(parsed: &[Vec<String>], header_fallback: &[&str]) -> Vec<CsvRow> {
    if parsed.is_empty() {
        return Vec::new();
    }

    let header = if parsed[0].is_empty() {
        header_fallback
            .iter()
            .map(|h| h.to_string())
            .collect::<Vec<_>>()
    } else {
        parsed[0].clone()
    };

    parsed
        .iter()
        .skip(1)
        .map(|cells| {
            header
                .iter()
                .enumerate()
                .map(|(i, h)| (h.clone(), cells.get(i).cloned().unwrap_or_default()))
                .collect::<CsvRow>()
        })
        .filter(|row| !is_empty_row_map(row))
        .collect()
}

pub fn read_ledger(path: &Path, header_fallback: &[&str]) -> Result<Vec<CsvRow>, String> {
    if !path.exists() {
        return Ok(Vec::new());
    }
    let parsed = read_csv_raw(path)?;
    Ok(rows_from_parsed(&parsed, header_fallback))
}

pub fn row_value<'a>(row: &'a CsvRow, key: &str) -> &'a str {
    row.get(key).map(String::as_str).unwrap_or("")
}

pub fn index_rows<F>(rows: &[CsvRow], key_fn: F) -> HashMap<String, Vec<usize>>
where
    F: Fn(&CsvRow) -> String,
{
    let mut map = HashMap::<String, Vec<usize>>::new();
    for (idx, row) in rows.iter().enumerate() {
        let key = key_fn(row);
        if key.is_empty() {
            continue;
        }
        map.entry(key).or_default().push(idx);
    }
    map
}

pub fn take_row(
    map: &HashMap<String, Vec<usize>>,
    key: &str,
    used: &mut HashSet<usize>,
) -> Option<usize> {
    let indexes = map.get(key)?;
    for idx in indexes {
        if used.insert(*idx) {
            return Some(*idx);
        }
    }
    None
}

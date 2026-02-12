use serde::Deserialize;
use serde_json::Value;

#[derive(Debug, Clone, Deserialize)]
pub struct SourceRecord {
    pub id: String,
    #[serde(default)]
    pub url: String,
    #[serde(default)]
    pub title: String,
    #[serde(default)]
    pub quality: String,
}

pub fn parse_sources_json(raw: &str) -> Result<Vec<SourceRecord>, String> {
    let value: Value =
        serde_json::from_str(raw).map_err(|e| format!("failed to parse sources json: {e}"))?;

    if value.is_array() {
        return serde_json::from_value(value)
            .map_err(|e| format!("failed to parse source array: {e}"));
    }

    if let Some(list) = value.get("sources") {
        return serde_json::from_value(list.clone())
            .map_err(|e| format!("failed to parse sources object payload: {e}"));
    }

    Err("sources json must be an array or an object with 'sources' array".to_string())
}

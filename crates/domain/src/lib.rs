use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::BTreeMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Person {
    pub id: String,
    #[serde(default)]
    pub nm: String,
    #[serde(default)]
    pub dy: String,
    #[serde(flatten)]
    pub extra: BTreeMap<String, Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Edge {
    pub t: String,
    pub s: String,
    pub d: String,
    #[serde(default)]
    pub l: String,
    #[serde(default)]
    pub c: String,
    #[serde(default)]
    pub claim_type: String,
    #[serde(default)]
    pub confidence_grade: String,
    #[serde(default)]
    pub evidence_refs: Vec<String>,
    #[serde(default, skip_serializing_if = "String::is_empty")]
    pub event_context: String,
    #[serde(default, skip_serializing_if = "String::is_empty")]
    pub inference_rule: String,
    #[serde(default, skip_serializing_if = "Value::is_null")]
    pub inference_basis: Value,
    #[serde(flatten)]
    pub extra: BTreeMap<String, Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Dataset {
    #[serde(default)]
    pub generated_at: String,
    pub mode: String,
    pub people: Vec<Person>,
    pub edges: Vec<Edge>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct DatasetStats {
    pub people: u64,
    pub edges: u64,
    pub inferred_edges: u64,
    pub uncertain_edges: u64,
    pub edges_with_evidence_refs: u64,
    pub multi_source_edges: u64,
    pub confidence_split: BTreeMap<String, u64>,
    pub relation_split: BTreeMap<String, u64>,
    pub claim_type_split: BTreeMap<String, u64>,
    pub confidence_grade_split: BTreeMap<String, u64>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct ResearchWorkspaceStats {
    #[serde(default)]
    pub ledgers: BTreeMap<String, u64>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct BaselineSnapshot {
    #[serde(default)]
    pub baseline_date: String,
    #[serde(default)]
    pub generated_at: String,
    #[serde(default)]
    pub datasets: BTreeMap<String, DatasetStats>,
    #[serde(default)]
    pub research_workspace: ResearchWorkspaceStats,
}

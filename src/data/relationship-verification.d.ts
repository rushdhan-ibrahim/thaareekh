export interface RelationshipVerificationMeta {
  claim_id?: string;
  confidence?: string;
  claim_type?: string;
  confidence_grade?: string;
  primary_source_id?: string;
  review_status?: string;
  canonical_decision?: string;
  reviewer?: string;
  last_reviewed?: string;
  inference_class?: string;
  inference_rule?: string;
  dossier_status?: string;
  dossier_file?: string;
  tracker_last_updated?: string;
}

export function relationshipEdgeKey(edge: { t?: string; s?: string; d?: string; l?: string }): string;
export function getRelationshipVerification(edge: Record<string, unknown>): RelationshipVerificationMeta | null;
export function getRelationshipVerificationByEdgeKey(edgeKey: string): RelationshipVerificationMeta | null;
export function getRelationshipVerificationDocs(): {
  relationship_ledger_path?: string;
  inference_tracker_path?: string;
  confidence_explainer_path?: string;
};

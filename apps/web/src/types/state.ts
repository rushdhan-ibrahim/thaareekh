/**
 * Core domain types for the Maldives Royal Genealogy application.
 * These mirror the runtime shapes used by legacy src/state.js and data modules.
 */

export type ConfidenceCode = 'c' | 'i' | 'u';
export type EdgeType = 'parent' | 'sibling' | 'spouse' | 'kin';
export type ViewMode = 'graph' | 'tree';
export type Locale = 'en' | 'dv';
export type Density = 'compact' | 'comfortable' | 'presentation';
export type OverlayMode = 'relation' | 'confidence' | 'source';

export interface PersonNode {
  id: string;
  nm: string;
  g?: string;
  dy?: string;
  re?: Array<[number, number?]>;
  n?: Array<string | number>;
  yb?: number;
  yd?: number;
  pb?: string;
  pd?: string;
  aliases?: string[];
  regnal_names?: string[];
  known_as?: Array<string | { name?: string; type?: string; c?: string; note?: string; source_refs?: string[] }>;
  titles?: string[];
  offices_held?: Array<{
    office_id?: string;
    label?: string;
    start?: number;
    end?: number;
    note?: string;
    c?: string;
    source_refs?: string[];
  }>;
  rg?: string;
  name_dv?: string;
  bio?: string;
  facts?: string[];
  source_refs?: string[];
  royal_link?: {
    type?: string;
    via?: string;
    path_summary?: string;
  };
}

export interface EdgeRecord {
  s: string;
  d: string;
  t: EdgeType;
  c: ConfidenceCode;
  l?: string;
  confidence_grade?: string;
  evidence_refs?: string[];
  claim_type?: string;
  event_context?: string;
  inference_rule?: string;
  inference_bases?: string[];
  dossier_path?: string;
}

export interface LinkDatum {
  source: string | { id: string; x?: number; y?: number };
  target: string | { id: string; x?: number; y?: number };
  _e: EdgeRecord;
}

export interface TreeMeta {
  index: number;
  ids: string[];
  size: number;
  repId: string | undefined;
  repName: string;
  dynasty: string;
  year: number | null;
}

export interface AppState {
  nodes: PersonNode[];
  links: LinkDatum[];
  sim: unknown;
  svgEl: unknown;
  gL: unknown;
  gLH: unknown;
  gN: unknown;
  gBadges: unknown;
  selId: string | null;
  selEdge: LinkDatum | null;
  tr: unknown;
  W: number;
  H: number;
  zoomBehavior: unknown;
  viewMode: ViewMode;
  lang: Locale;
  density: Density;
  sidebarOpen: boolean;
  focusMode: boolean;
  overlayMode: OverlayMode;
  eraEnabled: boolean;
  eraYear: number | null;
  eraPlaying: boolean;
  eraTimer: ReturnType<typeof setInterval> | null;
  loaderHidden: boolean;
  filterPanelOpen: boolean;
  onboardingComplete: boolean;
  minimapVisible: boolean;
  _treesMeta: TreeMeta[];
}

/**
 * Ambient module declarations for legacy data module imports.
 * Wildcard patterns allow TS to resolve imports from src/data/*.js.
 */

declare module '*sovereigns.merge.js' {
  export function resolveDataMode(): 'canonical' | 'research';
  export function getDataset(mode?: 'canonical' | 'research'): {
    mode: string;
    people: Array<Record<string, unknown>>;
    edges: Array<Record<string, unknown>>;
  };
  export const mode: string;
  export const people: Array<Record<string, unknown>>;
  export const edges: Array<Record<string, unknown>>;
  export const byId: Map<string, Record<string, unknown>>;
}

declare module '*offices.js' {
  export interface OfficeCatalogEntry {
    id: string;
    name: string;
    kind?: string;
    summary?: string;
    alt_names?: string[];
    source_refs?: string[];
  }
  export const officeCatalog: OfficeCatalogEntry[];
  export const officeById: Map<string, OfficeCatalogEntry>;
}

declare module '*sources.js' {
  export interface SourceEntry {
    id: string;
    url?: string;
    title: string;
    publisher?: string;
    access_date?: string;
    quality?: string;
    notes?: string;
  }
  export const sources: SourceEntry[];
}

declare module '*era-events.js' {
  export interface DynastyTransition {
    year: number;
    dynasty: string;
    label: string;
    short: string;
  }
  export const dynastyTransitions: DynastyTransition[];
}

declare module '*timeline.js' {
  export function personSpan(p: Record<string, unknown>): {
    start: number | null;
    end: number | null;
  };
  export function spanForId(id: string): { start: number | null; end: number | null } | null;
  export function activeInYearById(id: string, year: number): boolean;
}

declare module '*storytrails.js' {
  export interface StoryTrailStep {
    id: string;
    year: number;
    title: string;
    note: string;
  }
  export interface StoryTrail {
    id: string;
    title: string;
    summary: string;
    theme: string;
    steps: StoryTrailStep[];
  }
  export const storyTrails: StoryTrail[];
}

declare module '*geo.js' {
  export interface PlaceAnchor {
    id: string;
    en: string;
    dv: string;
    x: number;
    y: number;
    aliases: string[];
  }
  export function resolvePlace(text: string): PlaceAnchor | null;
  export function resolveLocationArray(locations: string[]): PlaceAnchor[];
}

declare module '*inference-notes.js' {
  export function inferenceEdgeKey(edge: { t?: string; s?: string; d?: string; l?: string }): string;
  export function getInferenceNote(key: string): {
    summary: string;
    dossier?: string;
    logic?: Array<{ step: string; text: string }>;
    bases?: string[];
    checklist?: Array<{ item: string; status: string }>;
  } | null;
}

declare module '*profile.enrichments.js' {
  export const profileEnrichments: Array<Record<string, unknown>>;
  export const profileEnrichmentById: Map<string, Record<string, unknown>>;
}

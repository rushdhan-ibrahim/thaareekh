/**
 * Ambient module declarations for legacy data module imports.
 * Wildcard patterns allow TS to resolve imports from src/data/*.js.
 */

// ---------------------------------------------------------------------------
// CDN-loaded libraries (importmap)
// ---------------------------------------------------------------------------

declare module 'd3' {
  interface ZoomTransform {
    x: number;
    y: number;
    k: number;
    translate(x: number, y: number): ZoomTransform;
    scale(k: number): ZoomTransform;
  }
  export const zoomIdentity: ZoomTransform;
  export function select(el: Element | string): D3Sel;
  export interface D3Sel {
    selectAll(sel: string): D3Sel;
    select(sel: string): D3Sel;
    remove(): D3Sel;
    append(tag: string): D3Sel;
    attr(name: string, value?: unknown): D3Sel;
    data(data: unknown[]): D3Sel;
    enter(): D3Sel;
    transition(): D3Sel;
    duration(ms: number): D3Sel;
    call(fn: unknown, ...args: unknown[]): D3Sel;
  }
}

declare module 'gsap' {
  const gsap: {
    to(target: unknown, vars: Record<string, unknown>): unknown;
  };
  export default gsap;
  export { gsap };
}

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
  export interface OfficeTimelinePeriod {
    label: string;
    period?: string;
    summary?: string;
    offices?: string[];
    source_refs?: string[];
  }
  export const officeCatalog: OfficeCatalogEntry[];
  export const officeById: Map<string, OfficeCatalogEntry>;
  export const officeTimeline: OfficeTimelinePeriod[];
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
  export const sourceById: Map<string, SourceEntry>;
}

declare module '*era-events.js' {
  export interface DynastyTransition {
    year: number;
    dynasty: string;
    label: string;
    short?: string;
  }
  export interface EraMilestone {
    year: number;
    label: string;
    short?: string;
    kind?: string;
  }
  export const dynastyTransitions: DynastyTransition[];
  export const eraMilestones: EraMilestone[];
}

declare module '*timeline.js' {
  export function personSpan(p: Record<string, unknown>): {
    start: number | null;
    end: number | null;
  };
  export function spanForId(id: string): { start: number | null; end: number | null } | null;
  export function activeInYearById(id: string, year: number): boolean;
  export function timelineExtent(): { min: number; max: number };
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
  export function resolvePlace(text: string | undefined | null): PlaceAnchor | null;
  export function resolveLocationArray(locations: string[]): PlaceAnchor[];
  export function extractPlaceMentions(text: string): PlaceAnchor[];
  export function placeLabelForLang(anchor: PlaceAnchor, lang: string): string;
}

declare module '*inference-notes.js' {
  export function inferenceEdgeKey(edge: { t?: string; s?: string; d?: string; l?: string }): string;
  export function getInferenceNote(edge: Record<string, unknown>): {
    summary?: string;
    dossier?: string;
    logic?: string[];
    verification?: string[];
    bases?: string[];
  } | null;
  export function getInferenceDossierPath(edge: Record<string, unknown>): string | null;
  export function isDerivedInferenceEdge(edge: Record<string, unknown>): boolean;
}

declare module '*profile.enrichments.js' {
  export const profileEnrichments: Array<Record<string, unknown>>;
  export const profileEnrichmentById: Map<string, Record<string, unknown>>;
}

declare module '*sovereigns.merge.js' {
  export function getDataset(mode?: 'canonical' | 'research'): {
    mode: string;
    people: Array<Record<string, unknown>>;
    edges: Array<Record<string, unknown>>;
  };
}

declare module '*offices.js' {
  export const officeById: Map<string, { id: string; name: string }>;
}

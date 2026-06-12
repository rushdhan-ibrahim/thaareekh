/**
 * Scriptorium audio maps — pure pitch/timing tables.
 * No WebAudio access here; parity-tested against the JS mirror.
 */

/** Pentatonic anchor pitches per dynasty (Hz) — consonant under overlap. */
export const DYNASTY_PITCH: Record<string, number> = {
  lunar: 392.0, // G4
  hilaaly: 440.0, // A4
  utheemu: 493.88, // B4
  dhiyamigili: 587.33, // D5
  huraagey: 659.25 // E5
};

export const DEFAULT_PITCH = 440.0;

/** Anchor pitch for a dynasty key (case-insensitive). */
export function dynastyPitch(key: string | null | undefined): number {
  if (!key) return DEFAULT_PITCH;
  const hit = DYNASTY_PITCH[String(key).toLowerCase()];
  return typeof hit === 'number' ? hit : DEFAULT_PITCH;
}

/** Clamp into [0, 1]. */
export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** Era scrub tick pitch rises with progress through the chronicle. */
export function tickPitch(progress: number): number {
  return Math.round((3200 + 1400 * clamp01(progress)) * 10) / 10;
}

/** Sovereign bell base frequency — a darker octave of the dynasty anchor. */
export function bellPitch(key: string | null | undefined): number {
  return Math.round((dynastyPitch(key) / 2) * 100) / 100;
}

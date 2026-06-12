# The Living Chronicle — experience uplift plan (2026-06-12)

Rannavaaru already *looks* like a computational manuscript. This uplift makes it
*behave* like one — a chronicle that breathes, sounds, and performs its own
history. Every addition deepens the existing concept; nothing decorates for
decoration's sake. Both runtimes (apps/web TS = deployed, root src JS = parity
mirror) stay in lockstep, and new pure logic gains parity verifiers like the
rest of the repo.

## 1. The Scriptorium Sound (new dimension)
Fully synthesized WebAudio — zero audio assets, zero network weight.
- **Bed**: looped brown-noise "ocean" through a slow-breathing lowpass, plus a
  two-partial drone (A2 + fifth, ±2 cent detune) that breathes on an
  ultra-slow LFO. Master bus → gentle compressor. Everything beneath -28 dBFS.
- **Voices**: ink-tap on node select (pitch keyed per dynasty on a pentatonic
  set so overlaps stay consonant); a deeper two-partial bell for sovereigns;
  band-passed paper whisper on hover (throttled); quill-scratch swell synced to
  edge self-drawing; page-turn noise sweep on graph↔tree; small chime on
  command palette; decade ticks (pitch rises with year) while scrubbing the
  era; wax-press thump on export.
- **Respectful by default**: off until invited. One-time invitation card after
  onboarding; header toggle (♪) persists in localStorage; AudioContext suspends
  on hidden tabs; hard mute kills the bus instantly.
- Modules: `audio/scriptorium-audio.(ts|js)` (engine + pure pitch/tick maps),
  `ui/sound-toggle.(ts|js)`. Parity: pitch/tick tables.

## 2. The Overture (cinematic entry)
The loader becomes an illumination sequence: title plate inks in over
parchment, a hairline rule draws across, then the graph reveals — nodes
ink-blot in by century cohort (PRNG-jittered delays), edges replay their
quill-draw, orrery rings fade up. ≤2.6 s, skip on any input,
`prefers-reduced-motion` ⇒ instant. Module: `ui/overture.(ts|js)` +
`graph-first-render` event from rebuild.

## 3. The Illuminated Timeline (era scrubber)
The era slider becomes a manuscript instrument: dynasty-colored reign bands
beneath the track, a jewel thumb, a hover/drag bubble naming the year and the
reigning sovereign, era-glow coupling, decade tick sounds. The native range
input stays underneath for accessibility. Module: `ui/era-scrubber.(ts|js)`;
pure band-stop + reigning-at logic parity-tested.

## 4. Story-Trail Performances (play mode)
A play button on the story rail lets a trail perform itself: camera glides
between steps (existing goF/GSAP), sidebar narrates, soft cues mark steps,
an inked progress rule fills along the rail; any user interaction pauses.
Implemented inside `storytrails.(ts|js)`.

## 5. Marginalia (profile folio v2)
Scholarship made tactile on the profile card:
- wax-seal stamp embossing the evidence grade (A/B/C),
- a reign-arc sparkline (life span against 1117–1968, reign emphasized),
- inked tally marks for source counts.
Pure helpers in `ui/marginalia.(ts|js)` (parity-tested), consumed by sidebar.

## 6. Materiality & Motion polish
- View Transitions API for theme flips and sidebar content swaps (progressive;
  reduced-motion guarded).
- Candlelight vignette on the graph chamber; ink-styled `:focus-visible`.
- Colophon overlay on `?` — the keyboard map set like a manuscript colophon.
- Onboarding copy corrected to the real corpus (200+ people, 600+ edges).
- Era ambience: scrub position warms/cools the chamber subtly (existing
  --era-* vars, deeper coupling).

## Engineering discipline
- TS first, JS mirrored, `node --check` on mirrors; new parity scripts wired
  into package.json + CI (`verify-ts-{marginalia,era-scrubber,audio}-parity`).
- No new runtime deps; CDN importmap untouched; worker untouched.
- sw.js CACHE_NAME bump on ship; dist rebuilt; CI green on both remotes; live
  verify on myrkvidur.com/thaareekh.

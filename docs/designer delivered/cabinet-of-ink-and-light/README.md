# Movements Remastered

This folder contains a remastered version of the three uploaded HTML studies, plus a new library volume and shared assets.

## What changed

The original pages were strong already: good paper tone, convincing code-underlay plates, and a coherent manuscript/computation voice. I kept that structure and added a shared system around it.

### Cross-page improvements
- shared `assets/relic-common.css` for page furniture, corner sigils, plate frames, navigation, dormant-motion control, and responsive polish
- shared `assets/relic-enhancer.js` / `.ts` to augment every page with:
  - cabinet navigation
  - folio corner medallions
  - plate-side mini artefacts
  - title whispers
  - colophon seals
  - active / dormant viewport states
- the three original HTML files were copied into this folder and enhanced without stripping their existing authored content

### New movement library
- `assets/movement-library.ts` is a small TypeScript registry of reusable artefact renderers
- `assets/movement-library.js` is the compiled runtime for browsers
- added twelve new artefacts:
  - Astrolabe
  - Vesica
  - Rose Window
  - Labyrinth
  - Eclipse Engine
  - Aether Knot
  - Chaplet
  - Water Clock
  - Pilgrim Star
  - Lantern Window
  - Sigil Bloom
  - Memory Field

## Files
- `index.html` — cabinet landing page
- `on-the-unfolding-of-form-plates.html` — enhanced copy of the treatise page
- `twelve-movements-for-ink-and-light.html` — enhanced copy of volume I
- `twelve-more-movements.html` — enhanced copy of volume II
- `twelve-further-artefacts-for-ink-and-light.html` — new volume built from the shared library

## Suggested next move

The strongest next step would be to pull the existing inline renderers from volumes I and II into the same TypeScript registry, so every plate in the cabinet is data-driven and seedable from one source of truth.

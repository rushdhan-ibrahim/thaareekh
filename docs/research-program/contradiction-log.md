# Contradiction Log

Date initialized: 2026-02-08

Use this log for explicit claim conflicts. Do not remove older entries; append updates with dates.

## Entry template
- `ID`:
- `Topic`:
- `Entities`:
- `Claim A`:
- `Claim B`:
- `Sources`:
- `Current stance`:
- `Adjudication rationale`:
- `Next verification action`:
- `Last reviewed`:

## Active contradictions
- None logged yet.

<!-- CONTRADICTION-BATCH-A-START -->
### Batch Review (2026-02-08) — Promotion Batch A Pre-check
- `ID`: CLOG-2026-02-08-A
- `Topic`: Pre-promotion contradiction sweep for curated-inference support claims
- `Entities`: 25 direct A/B claims linked from curated inference dossiers
- `Claim A`: Batch claims have explicit claim text and locator anchors in the relationship ledger.
- `Claim B`: Potential latent contradictions may still exist in not-yet-ingested primary archival sources.
- `Sources`: relationship-evidence-ledger.csv, curated inference dossiers, contradiction-log baseline
- `Current stance`: No blocking direct contradiction found in structured ledger checks for this batch.
- `Adjudication rationale`: Zero duplicate direct tuples and zero >2-parent anomalies were detected; batch proceeds with provisional promotion of direct support claims only.
- `Next verification action`: Re-audit this batch after next archival-source ingestion and contradiction-log expansion.
- `Last reviewed`: 2026-02-08
<!-- CONTRADICTION-BATCH-A-END -->

<!-- CONTRADICTION-BATCH-B-START -->
### Batch Review (2026-02-08) — Promotion Batch B Pre-check
- `ID`: CLOG-2026-02-08-B
- `Topic`: Pre-promotion contradiction sweep for remaining direct A/B claims
- `Entities`: 12 direct A/B claims (12 unique edges)
- `Claim A`: Selected claims have explicit relation text and citation locators in the relationship ledger.
- `Claim B`: Latent contradictions may surface when additional archival corpora are ingested.
- `Sources`: relationship-evidence-ledger.csv, source-coverage audits, contradiction-log baseline
- `Current stance`: No blocking contradiction found in structured ledger checks for this batch.
- `Adjudication rationale`: Duplicate direct tuple count is 0 and >2-parent anomaly count is 0; batch qualifies for canonical promotion.
- `Next verification action`: Re-run contradiction sweep after the next source-ingestion wave and append any competing claims.
- `Last reviewed`: 2026-02-08
<!-- CONTRADICTION-BATCH-B-END -->

<!-- CONTRADICTION-BATCH-C-START -->
### Batch Review (2026-02-08) — Bridge Corridor Adjudication
- `ID`: CLOG-2026-02-08-C1
- `Topic`: Late-monarchy to modern bridge contradiction handling around P95
- `Entities`: P86, P87, P88, P90, P91, P95, P129
- `Claim A`: Direct scaffold claims indicate `P87 -> P95` (grandfather via daughter) and `P129 -> P95` parent linkage, supported by parent claims `P87 -> P90/P91`.
- `Claim B`: Contested labels `P86 -> P95 ancestor?` and `P88 -> P95 grandfather?` remain ambiguous and are currently D-grade placeholders.
- `Sources`: CLM-0212, CLM-0262, CLM-0363, CLM-0365, CLM-0366, CLM-0450 vs CLM-0209, CLM-0215; SRC-MRF-KINGS, SRC-WIKI-MUHAMMAD-FAREED, SRC-DERIVED-RULES
- `Current stance`: Keep direct scaffold claims active; defer ambiguous D-grade ancestor labels from canonical promotion.
- `Adjudication rationale`: The corridor has a coherent and explicit direct backbone for immediate relations; ambiguous question-mark labels do not meet canonical specificity standards.
- `Next verification action`: Quote-level excerpts for CLM-0209/0215 are now captured; next step is independent non-MRF corroboration and clarification of the `86/88` slash notation before revisiting.
- `Last reviewed`: 2026-02-08

- `ID`: CLOG-2026-02-08-C2
- `Topic`: Classification mismatch on `parent|P87|P129|`
- `Entities`: P87, P129
- `Claim A`: CLM-0364 now has quote-level direct parent wording in MRF photo/family-album material for Don Goma as daughter of Ibrahim Nooreddine.
- `Claim B`: Edge remains marked inferred in dataset/ledger modeling.
- `Sources`: CLM-0364, docs/research-program/inferences/parent-p87-p129.md, SRC-MRF-KINGS, SRC-MRF-PHOTO-6, SRC-MRF-KAKAAGE-ALBUM
- `Current stance`: Keep as high-priority promotion candidate, but retain inferred status until one independent non-MRF corroboration source is captured.
- `Adjudication rationale`: Quote-level wording is now explicit but remains within one source family; promotion standards for this high-impact bridge require at least one external corroboration stream.
- `Next verification action`: Assign an independent corroboration source for P87->P129 and rerun classification review.
- `Last reviewed`: 2026-02-08
<!-- CONTRADICTION-BATCH-C-END -->

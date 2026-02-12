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
- `CLOG-2026-02-09-D1` — P61 chronology precision remains open (exact birth/death dating pending archival-grade evidence).
- `CLOG-2026-02-09-D2` — P67 chronology precision remains open (issue-route contradiction is resolved in model; death-year precision is still disputed).
- `CLOG-2026-02-09-D4` — P41 paternal alternate tradition remains actively managed (`P39 -> P41` canonical; `P40 -> P41` retained as contested `u/D` claim).

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

<!-- CONTRADICTION-BATCH-D-START -->
### Batch Review (2026-02-09) — European Colonial Findings: Portuguese-Era Date Contradictions

- `ID`: CLOG-2026-02-09-D1
- `Topic`: P61 (Dom Manoel / Hassan IX) birth and death dates
- `Entities`: P61
- `Claim A`: Project data lists birth year 1525 and death year 1585 (SRC-MRF-KINGS, SRC-WIKI-MONARCHS).
- `Claim B`: RoyalArk genealogical database lists birth c.1531 and death before July 10, 1584 (SRC-ROYALARK-M16).
- `Sources`: SRC-MRF-KINGS, SRC-WIKI-MONARCHS, SRC-ROYALARK-M16, SRC-DESILVA-PORT-ENCOUNTERS
- `Current stance`: Retain project data (1525, 1585) as current canonical values; flag RoyalArk dates as alternative claims requiring primary-source adjudication.
- `Adjudication rationale`: Neither source provides primary archival citations for exact dates. The 6-year birth discrepancy and ~1-year death discrepancy require resolution via Portuguese colonial archives (Goa Historical Archives or Arquivo Nacional da Torre do Tombo).
- `Next verification action`: Search for Dom Manoel's baptismal record (January 1, 1552, Cochin) and Goa administrative records for death date. Cross-reference with Diogo do Couto's Decadas.
- `Last reviewed`: 2026-02-09

- `ID`: CLOG-2026-02-09-D2
- `Topic`: P67 (Dom Philippe / Dom Felipe) birth, death, and issue
- `Entities`: P67
- `Claim A`: Project data lists birth year 1588 and death year 1635; project edges imply P67 had descendants (SRC-MRF-KINGS, SRC-WIKI-MONARCHS).
- `Claim B`: RoyalArk gives birth 1593, died "s.p. unm." (without issue, unmarried) before 1639 at Goa (SRC-ROYALARK-M16). The scroll.in article states Dom Philippe was killed in the 1632 expedition to Maldives, contradicting both project and RoyalArk death dates.
- `Sources`: SRC-MRF-KINGS, SRC-WIKI-MONARCHS, SRC-ROYALARK-M16, SRC-SCROLL-GOA-KINGS
- `Current stance`: Flag as high-priority contradiction. The "died without issue" claim from RoyalArk directly conflicts with project edge data showing P67 as a parent. The Huraagey lineage passes through P67's sister Dona Ines (P213), not through P67 himself.
- `Adjudication rationale`: If RoyalArk is correct that P67 died unmarried without issue, any project edges showing P67 as a parent must be re-routed through P213 (Dona Ines). The current project edge P66→P67 (parent) remains valid regardless. The 5-year birth discrepancy (1588 vs 1593) and conflicting death accounts (1632 expedition vs before 1639 at Goa) require Portuguese archival verification.
- `Next verification action`: Check project edges for any claims of P67 having children; verify whether the Huraagey bridge depends on P67's issue or on P213's issue. Consult Diogo do Couto and Goa Archives for P67 death circumstances.
- `Last reviewed`: 2026-02-09
- `ID`: CLOG-2026-02-09-D3
- `Topic`: P27 (Dhaain) maternal parentage
- `Entities`: P25, P26, P27
- `Claim A`: Project data note for P27 states "Daughter of #26 (not of #25)", implying P25 (Raadhaafathi/Malika Fatima) is NOT the mother.
- `Claim B`: RoyalArk states P27's mother IS Malika Fatima (= P25 Raadhaafathi), and that P26 came to power through his wife P25's abdication in his favor.
- `Sources`: SRC-MRF-KINGS, SRC-ROYALARK-MALDIVES
- `Current stance`: Flag for adjudication. The RoyalArk claim is genealogically coherent (P25 abdicated in favor of husband P26, their daughter P27 then succeeded).
- `Adjudication rationale`: The project note may reflect a misreading or an alternative tradition. The RoyalArk reconstruction is internally consistent with the succession pattern. Requires cross-check with the Tarikh chronicle text.
- `Next verification action`: Consult Tarikh Arabic text (SRC-TUFS-TARIKH-DIBA-MAHALL-FACSIMILE) for P27's parentage statement.
- `Last reviewed`: 2026-02-09

- `ID`: CLOG-2026-02-09-D4
- `Topic`: P41 (Yusuf IV / Raadha Veeru) paternal parentage
- `Entities`: P39, P40, P41
- `Claim A`: Project data shows P40 as father of P41 (edge P40->P41, parent).
- `Claim B`: RoyalArk states P41 is the son of P39 (Yusuf II), not P40 (Abu Bakar I). P41 married P39's divorced wife Amira Bulau Ma'ava Kilege as second spouse.
- `Sources`: SRC-MRF-KINGS, SRC-ROYALARK-MALDIVES
- `Current stance`: Flag as medium-priority. The discrepancy changes the dynastic line of descent.
- `Adjudication rationale`: RoyalArk's reconstruction places P41 as son of P39, which aligns with the naming tradition (both Yusuf). The project's P40->P41 edge may be an inference error. Requires Tarikh text verification.
- `Next verification action`: Consult Tarikh Arabic text for the explicit father statement for P41.
- `Last reviewed`: 2026-02-09

- `ID`: CLOG-2026-02-09-D5
- `Topic`: P60 and P61 sibling relationship (full vs half-brothers)
- `Entities`: P60, P61
- `Claim A`: Project data implies P60 and P61 are full brothers (same dynasty, same parents implied by adjacency in the Hilaaly list).
- `Claim B`: RoyalArk states P60 and P61 share the same mother (Golavehi Aisha Rani Kilege) but have different fathers, making them maternal half-brothers, not full brothers. P60's father was Prince Ahmad Manikufa'anu Kalaminja; P61's father was a different Hilaaly prince.
- `Sources`: SRC-ROYALARK-M5, SRC-ROYALARK-M16, SRC-DESILVA-PORT-ENCOUNTERS
- `Current stance`: Flag for adjudication. The half-brother vs full-brother distinction affects succession claims.
- `Adjudication rationale`: The RoyalArk reconstruction provides named parents for both, supporting the half-brother claim. The project's sibling edge type should be reviewed.
- `Next verification action`: Check the project edge between P60 and P61 for edge type; verify through Portuguese colonial records (de Silva).
- `Last reviewed`: 2026-02-09
<!-- CONTRADICTION-BATCH-D-END -->

<!-- CONTRADICTION-BATCH-H-START -->
### Batch Review (2026-02-10) — Foundational P0 Extraction Activation Follow-up

- `ID`: CLOG-2026-02-10-H1
- `Topic`: Portuguese bridge contradiction lane activation (P61/P66/P67/P213 corridor)
- `Entities`: P61, P66, P67, P209, P210, P213
- `Claim A`: Portuguese-corridor parent/sibling claims now have source-specific locator hardening in the relationship ledger (`CLM-0605`, `CLM-0606`, `CLM-0607`, `CLM-0608`, `CLM-0609`, `CLM-0628`, `CLM-0630`, `CLM-0631`, `CLM-0632`).
- `Claim B`: Date and issue contradictions for P61/P67 remain unresolved pending direct quote-level extraction from translated Portuguese primaries and archive-corroborated dates.
- `Sources`: SRC-ROYALARK-M16, SRC-DESILVA-PORT-ENCOUNTERS, relationship-evidence-ledger.csv, docs/research-program/findings/phase1-batch-h-foundational-extractions.md
- `Current stance`: Keep existing modeled bridge claims active; maintain contradiction status for date and issue disputes.
- `Adjudication rationale`: Batch H improved locator traceability but did not yet introduce decisive contradictory evidence sufficient for canonical model rewrites.
- `Next verification action`: Execute quote-level extraction pass from de Silva Chapter 7 and map any decisive date/issue statements into contradiction entries D1-D5.
- `Last reviewed`: 2026-02-10
<!-- CONTRADICTION-BATCH-H-END -->

<!-- CONTRADICTION-BATCH-I-START -->
### Batch Review (2026-02-10) — Quote-Level Portuguese Corridor Hardening

- `ID`: CLOG-2026-02-10-I1
- `Topic`: Portuguese corridor claim wording upgraded to pair-specific quote-level review state
- `Entities`: P61, P66, P67, P209, P210, P211, P212, P213
- `Claim A`: Portuguese corridor parent/sibling claims now contain pair-specific lineage wording and source-specific locators for `CLM-0605..0609`, `CLM-0628`, `CLM-0630`, `CLM-0631`, `CLM-0632`.
- `Claim B`: Existing date and issue contradictions for P61/P67 remain unresolved and require primary-archive corroboration beyond current specialist genealogical and translated-primary layers.
- `Sources`: SRC-ROYALARK-M16, SRC-DESILVA-PORT-ENCOUNTERS, docs/research-program/findings/phase1-batch-i-quote-and-corroboration.md
- `Current stance`: Marked reviewer-ready for contradiction adjudication pass; canonical decisions remain pending.
- `Adjudication rationale`: Evidence traceability quality materially improved, but contradiction thresholds are not yet met for canonical rewrites on disputed chronology/issue claims.
- `Next verification action`: Execute contradiction adjudication for D1-D5 with explicit acceptance/rejection criteria per disputed claim and archive-level follow-up targets.
- `Last reviewed`: 2026-02-10
<!-- CONTRADICTION-BATCH-I-END -->

<!-- CONTRADICTION-BATCH-J-START -->
### Batch Review (2026-02-10) — D1..D5 Adjudication Pass (Round 1)

- `ID`: CLOG-2026-02-10-J1
- `Topic`: D1 update — P61 (Dom Manoel) birth/death chronology
- `Entities`: P61
- `Claim A`: Earlier model snapshot retained 1525/1585.
- `Claim B`: RoyalArk-supported profile framing uses 1531 and death before/around 1584.
- `Sources`: SRC-ROYALARK-M16, SRC-DESILVA-PORT-ENCOUNTERS, src/data/sovereigns.js
- `Current stance`: Partially resolved in current model direction: profile now reflects 1531/1584 framing with explicit uncertainty notes.
- `Adjudication rationale`: Chronology handling now follows the stronger internally consistent Portuguese-branch reconstruction in project data, but still lacks decisive primary archival citation for exact terminal year/day.
- `Next verification action`: Keep open for archival primary confirmation from Goa/Cochin record series and Portuguese chronicles (Diogo do Couto lane).
- `Last reviewed`: 2026-02-10

- `ID`: CLOG-2026-02-10-J2
- `Topic`: D2 update — P67 birth/death/issue contradiction
- `Entities`: P67, P213
- `Claim A`: Legacy contradiction asserted that project still modeled descendant issue from P67.
- `Claim B`: Current model states P67 died without issue and routes Huraagey bridge through sister P213.
- `Sources`: SRC-ROYALARK-M16, SRC-DESILVA-PORT-ENCOUNTERS, docs/research-program/people/P67.md
- `Current stance`: Issue-line contradiction resolved in model; death-year precision remains open.
- `Adjudication rationale`: Parentage routing conflict is now closed at graph level (no child edges from P67); unresolved part is only chronology precision among competing secondary reports.
- `Next verification action`: Treat death-year exactness as an open chronology sub-issue; retain current value with explicit uncertainty note until primary records are captured.
- `Last reviewed`: 2026-02-10

- `ID`: CLOG-2026-02-10-J3
- `Topic`: D3 update — P27 maternal parentage
- `Entities`: P25, P26, P27
- `Claim A`: Prior note suggested P27 was not daughter of P25.
- `Claim B`: Current graph models both `P26 -> P27` and `P25 -> P27`, with RoyalArk-backed maternal linkage.
- `Sources`: CLM-0331, CLM-0595, SRC-MRF-KINGS, SRC-ROYALARK-MALDIVES, docs/research-program/people/P27.md
- `Current stance`: Resolved for current model as dual-parent linkage.
- `Adjudication rationale`: Current lineage representation is internally coherent and now explicitly tracks both parental links rather than suppressing maternal attribution.
- `Next verification action`: Maintain as resolved-in-model but seek chronicle-level quote corroboration from Tarikh extraction lane.
- `Last reviewed`: 2026-02-10

- `ID`: CLOG-2026-02-10-J4
- `Topic`: D4 update — P41 paternal parentage
- `Entities`: P39, P40, P41
- `Claim A`: Canonical parent linkage in model is `P39 -> P41`.
- `Claim B`: Alternate `P40 -> P41` claim persists in source tradition.
- `Sources`: CLM-0596, CLM-0599, SRC-ROYALARK-MALDIVES, SRC-MRF-KINGS
- `Current stance`: Managed contradiction: canonical route kept as `P39 -> P41`; alternate retained as `u/D` contested edge for transparency.
- `Adjudication rationale`: This preserves both traditions without collapsing uncertainty into canonical structure and keeps verification pathways explicit.
- `Next verification action`: Upgrade/downgrade only after direct chronicle quote extraction for the exact father statement.
- `Last reviewed`: 2026-02-10

- `ID`: CLOG-2026-02-10-J5
- `Topic`: D5 update — P60/P61 sibling type
- `Entities`: P60, P61, P219, P220, P221
- `Claim A`: Older interpretation treated P60/P61 as full brothers.
- `Claim B`: Current model classifies them as maternal half-brothers with explicit shared-mother pathway.
- `Sources`: CLM-0640, SRC-ROYALARK-MALDIVES, SRC-MRF-KINGS, docs/research-program/people/P60.md, docs/research-program/people/P61.md
- `Current stance`: Resolved in current model as maternal half-brothers.
- `Adjudication rationale`: The modeled parent chains and sibling label now align with the named-parent reconstruction used in the bridge corridor.
- `Next verification action`: Preserve current classification; add quote-level extraction from the RoyalArk/MRF family blocks for final promotion-ready wording.
- `Last reviewed`: 2026-02-10
<!-- CONTRADICTION-BATCH-J-END -->

<!-- CONTRADICTION-BATCH-K-START -->
### Batch Review (2026-02-10) — D1..D5 Closure Normalization (Round 2)

- `ID`: CLOG-2026-02-10-K1
- `Topic`: D1 normalization — P61 chronology contradiction scope
- `Entities`: P61
- `Claim A`: Current model and profile now use the 1531 / before-or-around-1584 framing with explicit uncertainty notes.
- `Claim B`: No archival-grade primary citation has yet fixed exact terminal dates at day/month precision.
- `Sources`: src/data/sovereigns.js, CLM-0605..0609 context set, SRC-DESILVA-PORT-ENCOUNTERS, SRC-DIOGO-COUTO
- `Current stance`: Keep contradiction open as a chronology-precision sub-issue only (model-direction dispute is closed).
- `Adjudication rationale`: The graph no longer carries the prior 1525/1585 canonical profile, so the remaining risk is precision, not structural lineage integrity.
- `Next verification action`: Run targeted archival extraction lane from Portuguese chronicle and Goa/Cochin registry references (see `SRCQ-048`, `SRCQ-049`; extract rows `EXT-067`, `EXT-068`).
- `Last reviewed`: 2026-02-10

- `ID`: CLOG-2026-02-10-K2
- `Topic`: D2 normalization — P67 issue-route vs chronology split
- `Entities`: P67, P213
- `Claim A`: Current graph routes the Huraagey bridge through P213 and does not model descendants from P67.
- `Claim B`: Birth/death chronology precision remains unresolved across source traditions.
- `Sources`: src/data/sovereigns.js, docs/research-program/people/P67.md, CLM-0632, SRC-ROYALARK-M16, SRC-DESILVA-PORT-ENCOUNTERS
- `Current stance`: Issue-line contradiction is closed in model; chronology precision remains open.
- `Adjudication rationale`: The high-impact structural conflict is resolved, but final date precision still requires primary archival corroboration.
- `Next verification action`: Prioritize Portuguese chronicle and archive extraction for death-event chronology (see `SRCQ-048`, `SRCQ-049`; extract rows `EXT-067`, `EXT-068`).
- `Last reviewed`: 2026-02-10

- `ID`: CLOG-2026-02-10-K3
- `Topic`: D3 closure confirmation — P27 maternal parentage
- `Entities`: P25, P26, P27
- `Claim A`: Current model includes both parent links `P25 -> P27` and `P26 -> P27`.
- `Claim B`: Prior single-parent note state has been retired from canonical structure.
- `Sources`: CLM-0331, CLM-0595, docs/research-program/people/P27.md
- `Current stance`: Closed in model.
- `Adjudication rationale`: Dual-parent representation now matches the active evidence pathway and removes the prior binary contradiction from canonical graph behavior.
- `Next verification action`: Keep Tarikh quote-level corroboration as a quality-upgrade task, not a structural blocker.
- `Last reviewed`: 2026-02-10

- `ID`: CLOG-2026-02-10-K4
- `Topic`: D4 managed contradiction confirmation — P41 paternal parentage
- `Entities`: P39, P40, P41
- `Claim A`: Canonical parent edge is `P39 -> P41` and now remains stable in model.
- `Claim B`: Alternate `P40 -> P41` lineage claim remains tracked as contested (`u/D`) evidence.
- `Sources`: CLM-0596, CLM-0599, SRC-ROYALARK-MALDIVES, SRC-MRF-KINGS
- `Current stance`: Managed contradiction remains active with explicit canonical/contested separation.
- `Adjudication rationale`: This preserves transparency and reviewer traceability without collapsing uncertainty into the canonical branch.
- `Next verification action`: Promote/retire alternate branch only after direct chronicle father-statement extraction in the Tarikh lane.
- `Last reviewed`: 2026-02-10

- `ID`: CLOG-2026-02-10-K5
- `Topic`: D5 closure confirmation — P60/P61 sibling type
- `Entities`: P60, P61, P219, P220, P221
- `Claim A`: Current graph and ledger classify P60/P61 as maternal half-brothers.
- `Claim B`: Earlier full-brother interpretation is no longer canonical in model.
- `Sources`: CLM-0640, SRC-ROYALARK-MALDIVES, SRC-MRF-KINGS, docs/research-program/people/P60.md, docs/research-program/people/P61.md
- `Current stance`: Closed in model.
- `Adjudication rationale`: Parent-chain semantics and sibling labeling are now aligned with named-parent evidence and no longer conflict in graph behavior.
- `Next verification action`: Keep Portuguese archive corroboration as a confidence-hardening step, not a structural blocker.
- `Last reviewed`: 2026-02-10

- `ID`: CLOG-2026-02-10-K6
- `Topic`: D1/D2 archival scout update — Diogo do Couto corpus
- `Entities`: P61, P67
- `Claim A`: `Da Asia` corpus scout found multiple Maldives mentions across accessible OCR identifiers.
- `Claim B`: The same scout did not recover direct date-bearing statements naming Dom Manoel or Dom Philippe.
- `Sources`: SRC-DIOGO-COUTO, docs/research-program/findings/phase5-batch-k-couto-corpus-scout.md
- `Current stance`: D1/D2 remain open as chronology-precision issues.
- `Adjudication rationale`: Discovery mapping succeeded, but no decisive named chronology evidence was captured in this pass.
- `Next verification action`: Run chapter-level manual extraction on high-hit identifiers and continue `goa-cochin-archive-lane` record-series discovery for baptism/death-event evidence.
- `Last reviewed`: 2026-02-10
<!-- CONTRADICTION-BATCH-K-END -->

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

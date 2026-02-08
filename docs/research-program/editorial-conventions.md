# Editorial and Citation Conventions

Date: 2026-02-08

## 1) Identity and naming
- Use one canonical display name per person record.
- Record every known variant in `aliases`/`known_as` with source refs.
- Preserve source spelling in quote/excerpt fields; normalize only in canonical fields.
- Keep regnal numbering explicit (for example, `Sultan Mohamed Imaduddine I`).

## 2) Transliteration and language handling
- Store transliterations as variants, not replacements of canonical form.
- Mark language/script when known (Dhivehi, Arabic, Portuguese, English).
- If transliteration differs across sources, retain all attested forms with notes.

## 3) Title and office normalization
- Separate personal title/style from formal office.
- When a term changes meaning across periods, annotate period-specific usage.
- Do not infer office tenure dates without explicit evidence.

## 4) Claim writing standard
- Write one atomic claim per ledger row.
- Include explicit relation class (`parent`, `sibling`, `spouse`, `kin`, etc.).
- Quote or tightly paraphrase the relevant statement for traceability.

## 5) Confidence and grade assignment
- Confidence (`c/i/u`) reflects relation certainty in graph modeling.
- Grade (`A/B/C/D`) reflects source quality and corroboration depth.
- Every non-`A` claim should include what evidence would improve it.

## 6) Citation format
- Always include source ID, URL, and access date in source registry.
- In claim ledgers, include locator details (page, section, paragraph, table).
- Avoid uncited assertions in dossiers.

## 7) Contradictions and disputes
- Keep conflicting claims in the log; never silently overwrite.
- Record adjudication rationale and date.
- If unresolved, keep as inferred/uncertain and document verification needs.

## 8) Inference dossier requirement
- Each inferred edge must have a pair-specific dossier.
- Dossier must explain why this exact pair is inferred, not only the general rule.
- Include promotion and removal criteria tied to evidence thresholds.

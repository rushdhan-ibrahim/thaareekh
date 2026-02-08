# Confidence, Inference, and Grade Explainer

Date: 2026-02-08
Status: active reference for research-mode interpretation

## 1) What confidence means (`c`, `i`, `u`)

Each relationship edge has a confidence class in `edge.c`.

- `c` (`confirmed`): the exact relationship is explicitly stated in cited sources.
- `i` (`inferred`): the relationship is modeled from supporting facts, but direct pairwise wording for that exact edge is not yet captured.
- `u` (`uncertain`): the claim remains ambiguous or contested after review.

## 2) What source grade means (`A`–`D`)

Each relationship claim has a source quality band in `edge.confidence_grade`.

- `A`: official/primary evidence with direct claim support.
- `B`: strong specialist or secondary support with clear claim traceability.
- `C`: plausible but limited corroboration; keep under active review.
- `D`: weak or contested support; not suitable as settled fact.

## 3) How confidence and grade work together

- Confidence answers: "How settled is this edge in the current model?"
- Grade answers: "How strong is the supporting evidence quality?"
- A high grade does not automatically make an inferred edge confirmed; direct pairwise wording is still required for promotion from `i` to `c`.

## 4) Inferred-edge verification model (pair-specific)

Every inferred edge should be audited using its dedicated dossier in:
- `docs/research-program/inferences/`

Each dossier contains:
1. Pair summary (why this specific node pair is modeled).
2. Step-by-step logic chain tied to cited support claims.
3. Verification checklist with explicit promotion and downgrade/removal criteria.
4. Source basis with claim IDs and locator context.

## 5) How to inspect this in the UI

1. Click a relationship edge.
2. If it is inferred, open the **Inference Logic** section in the relationship card.
3. Use **Open full pair dossier (Markdown)** for the complete pair-specific audit trail.
4. Use the inference dossier tracker at:
   - `docs/research-program/ledgers/inference-dossier-tracker.csv`

## 6) Promotion policy summary

- Promote only when canonical thresholds are met.
- Keep inferred edges inferred until explicit pairwise wording is captured.
- Record contradictions instead of silently overwriting claims.
- Re-audit promoted batches after major source-ingestion waves.

# Inference & Confidence Guide

Date: 2026-02-08
Canonical reference: `docs/confidence-grade-explainer.md`

## Confidence class (`c`, `i`, `u`)
- `c` (confirmed): the relationship is explicitly stated in the cited source set.
- `i` (inferred): the relationship is modeled from supporting facts, but the exact edge statement is not directly quoted.
- `u` (uncertain): sources conflict, or wording is too ambiguous for a stable claim.

## Source grade (`A`–`D`)
- `A`: primary/official source with direct claim support.
- `B`: strong specialist or secondary source with clear support.
- `C`: plausible claim with limited corroboration; requires active review.
- `D`: weak or contested evidence; do not treat as settled.

## Inferred edge documentation model
Every inferred edge should provide:
1. Summary: why the edge is currently modeled.
2. Logic chain: node-specific supporting statements/steps.
3. Verification checklist: what would upgrade, revise, or remove the edge.
4. Cited basis sources.

## Derived inference rules
Rule-derived inferred edges use explicit basis metadata:
- `shared-parent-sibling`
- `parent-of-parent-grandparent`
- `parent-sibling-aunt-uncle`
- `children-of-siblings-cousin`

Each derived edge should surface the exact supporting modeled edges used by the rule.

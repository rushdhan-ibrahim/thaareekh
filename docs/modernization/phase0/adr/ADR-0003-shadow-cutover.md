# ADR-0003: Shadow Cutover Strategy

Date: 2026-02-10
Status: accepted

## Context
A single-step replacement would create high risk for research integrity and user trust.

## Decision
- Run legacy and rewritten systems in parallel during stabilization.
- Compare outputs using parity harness.
- Promote rewritten stack to default only after signed checklist completion.

## Consequences
- Temporary duplicated maintenance effort.
- Enables controlled rollback and objective verification.

# ADR-0002: No-Loss Parity Gates

Date: 2026-02-10
Status: accepted

## Context
The project contains high-value research artifacts and handcrafted explainability assets that must not regress.

## Decision
- Freeze golden baseline snapshots.
- Require parity checks before every phase completion.
- Block cutover until parity and QA pipelines pass in shadow mode.

## Consequences
- Slower early migration velocity.
- Significantly lower risk of data loss and behavioral drift.

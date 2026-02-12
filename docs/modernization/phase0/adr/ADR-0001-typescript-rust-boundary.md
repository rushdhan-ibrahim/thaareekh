# ADR-0001: TypeScript/Rust Boundary

Date: 2026-02-10
Status: accepted

## Context
The current system mixes UI concerns and domain logic in JavaScript modules. A full rewrite must improve speed and maintainability without loss of behavior.

## Decision
- TypeScript owns UI, interaction orchestration, and accessibility concerns.
- Rust owns domain model, merge/inference engine, and research CLI workflows.
- Browser runtime calls Rust through a WASM worker boundary.

## Consequences
- Heavy compute leaves the UI thread.
- Domain logic becomes testable and deterministic across web/CLI.
- Requires typed API contracts and serialization schema discipline.

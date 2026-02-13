# Phase 0 Feature Parity Matrix

Date: 2026-02-10
Status: in progress

## Dataset invariants
- [x] Canonical dataset parity (people/edges/labels/confidence/grades).
- [x] Research dataset parity (people/edges/derived edges).
- [x] Inference dossier linkage parity.
- [ ] Source registry parity.
- [ ] Contradiction log and promotion queue link integrity.

## UX and interaction parity
- [x] Search scoring engine parity (rank + filter semantics).
- [x] Search dropdown controller core parity (render + keyboard model).
- [x] Search controller runtime cutover in TS scaffold (DOM wiring + adapter hooks).
- [x] Command-palette core controller parity (render + keyboard model).
- [x] Relationship neighbor extraction parity (sidebar link-group core).
- [ ] Graph mode rendering + interaction parity.
- [ ] Tree mode rendering + interaction parity.
- [ ] Search and command palette parity.
- [ ] Filter panel and overlay mode parity.
- [ ] Compare workflow parity.
- [x] Pathfinding output parity.
- [ ] Era slider/playback parity.
- [ ] Story trails parity.
- [ ] Sidebar detail and evidence card parity.
- [ ] Export behavior parity.
- [ ] Offline/service-worker parity.

## Research pipeline parity
- [x] QA smoke parity.
- [x] Research baseline-report parity.
- [x] Ledger reconciliation output parity.
- [x] QA ledger checks parity.
- [x] Batch-content QA parity.
- [x] Evidence audit parity.
- [x] Coverage audit parity.
- [x] Relationship-ledger quality refresh parity.
- [x] Inference-notes sync parity.
- [x] Dossier refresh jobs parity.
- [x] Concept-entry refresh parity.
- [x] Offline archive build parity.
- [x] Phase 1 batch driver parity.
- [x] Phase 1 locator batch parity.
- [x] Phase 5 conflict/promotion batch parity.

## Performance targets
- [ ] Initial interactivity improvement >= 40%.
- [ ] Main-thread long task reduction >= 70%.
- [ ] Search/filter/path p95 <= 100ms.
- [ ] Dataset merge/inference speedup >= 3x.
- [ ] Research QA pipeline runtime reduction >= 50%.

## Sign-off gates
- [x] Golden baseline generated and frozen.
- [x] Parity harness integrated into CI.
- [ ] Shadow-run comparison completed.
- [ ] Cutover checklist approved.

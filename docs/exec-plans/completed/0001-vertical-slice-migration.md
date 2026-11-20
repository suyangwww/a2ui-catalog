# Execution Plan 0001: Horizontal-to-Vertical Deep-Module Migration

Status: Completed
Owner: Catalog Architecture
Last Verified: 2026-11-19

## Objective

Refactor all **41 A2UI v1.0 Components** and **20 Catalog Functions** from horizontal category files (`schemas/*.ts`, `components/*.tsx`, `instructions.ts`) into self-contained vertical Deep-Module slices under `src/components/<slug>/` and `src/functions/<slug>/`, guarded by `./scripts/verify.sh`.

## Completed Batches

- [x] **Batch 1 — Protocol & Harness:** `src/protocol/`, `src/primitives/`, `.dependency-cruiser.cjs`, `eslint.config.mjs`, `scripts/check-docs.mjs`, `scripts/verify.sh`.
- [x] **Batch 2 — Layout Slices (10):** `row`, `column`, `grid`, `list`, `carousel`, `card`, `tabs`, `accordion`, `modal`, `divider`.
- [x] **Batch 3 — Media & Identity Slices (7):** `text`, `image`, `icon`, `avatar`, `status-badge`, `video`, `audio-player`.
- [x] **Batch 4 — Input Slices (9):** `button`, `text-field`, `check-box`, `switch`, `segmented-control`, `choice-picker`, `slider`, `stepper-input`, `date-time-input`.
- [x] **Batch 5 — Reasoning & HITL Slices (4):** `thought-trace`, `step-timeline`, `approval-card`, `progress-indicator`.
- [x] **Batch 6 — Grounding & Code Slices (5):** `source-list`, `code-block`, `diff-viewer`, `artifact-card`, `callout`.
- [x] **Batch 7 — Data & Synthesis Slices (6):** `stat-metric`, `chart`, `data-table`, `key-value-list`, `comparison-matrix`, `follow-up-suggestions`.
- [x] **Batch 8 — Function Slices, Catalog Compiler, Thin Package Projections & Worktree Preview.**

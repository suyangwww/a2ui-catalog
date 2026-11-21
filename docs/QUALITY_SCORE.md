# Component & Function Quality Score

Status: Active
Owner: Catalog Architecture
Last Verified: 2026-11-20

Generated deterministically by `pnpm quality:score` ([scripts/compute-quality-score.mjs](../scripts/compute-quality-score.mjs)). Grades each vertical slice in `src/components/*` and `src/functions/*` across strict Zod schema validation, validated `examples.json` fixtures, seam tests, semantic/ARIA markup, `prompt.md` context budget (`< 1500` chars), and file line budgets (`<= 350` lines).

## Summary: **49 / 49** Components at Grade **A** · **9 / 9** Function Slices at Grade **A**

## 1. Component Slices (49)

| Slice (`src/components/*`) | Strict Schema | Examples | Seam Test | Semantic/A11y | Prompt Size | Renderer Lines | Grade |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `accordion` | Pass | 1 | Pass | Pass | 316c | 80L | **A** |
| `annotated-diagram` | Pass | 1 | Pass | Pass | 593c | 237L | **A** |
| `approval-card` | Pass | 1 | Pass | Pass | 427c | 159L | **A** |
| `artifact-card` | Pass | 1 | Pass | Pass | 397c | 113L | **A** |
| `audio-player` | Pass | 1 | Pass | Pass | 322c | 99L | **A** |
| `avatar` | Pass | 1 | Pass | Pass | 329c | 63L | **A** |
| `button` | Pass | 1 | Pass | Pass | 436c | 65L | **A** |
| `callout` | Pass | 1 | Pass | Pass | 354c | 55L | **A** |
| `card` | Pass | 1 | Pass | Pass | 394c | 80L | **A** |
| `carousel` | Pass | 1 | Pass | Pass | 361c | 82L | **A** |
| `chart` | Pass | 1 | Pass | Pass | 419c | 294L | **A** |
| `check-box` | Pass | 1 | Pass | Pass | 327c | 58L | **A** |
| `checklist-card` | Pass | 1 | Pass | Pass | 470c | 130L | **A** |
| `choice-picker` | Pass | 1 | Pass | Pass | 377c | 129L | **A** |
| `code-block` | Pass | 1 | Pass | Pass | 415c | 81L | **A** |
| `column` | Pass | 1 | Pass | Pass | 297c | 29L | **A** |
| `comparison-matrix` | Pass | 1 | Pass | Pass | 376c | 163L | **A** |
| `data-table` | Pass | 1 | Pass | Pass | 384c | 144L | **A** |
| `date-time-input` | Pass | 1 | Pass | Pass | 332c | 53L | **A** |
| `diff-viewer` | Pass | 1 | Pass | Pass | 402c | 100L | **A** |
| `divider` | Pass | 1 | Pass | Pass | 293c | 32L | **A** |
| `follow-up-suggestions` | Pass | 1 | Pass | Pass | 311c | 52L | **A** |
| `grid` | Pass | 1 | Pass | Pass | 356c | 47L | **A** |
| `icon` | Pass | 1 | Pass | Pass | 280c | 25L | **A** |
| `image` | Pass | 1 | Pass | Pass | 378c | 84L | **A** |
| `key-value-list` | Pass | 1 | Pass | Pass | 334c | 66L | **A** |
| `list` | Pass | 1 | Pass | Pass | 347c | 35L | **A** |
| `micro-app` | Pass | 1 | Pass | Pass | 659c | 140L | **A** |
| `modal` | Pass | 1 | Pass | Pass | 387c | 35L | **A** |
| `progress-indicator` | Pass | 1 | Pass | Pass | 355c | 121L | **A** |
| `proportion-bar` | Pass | 2 | Pass | Pass | 533c | 132L | **A** |
| `quiz-card` | Pass | 1 | Pass | Pass | 515c | 211L | **A** |
| `route-map` | Pass | 1 | Pass | Pass | 637c | 262L | **A** |
| `row` | Pass | 1 | Pass | Pass | 322c | 36L | **A** |
| `segmented-control` | Pass | 1 | Pass | Pass | 323c | 63L | **A** |
| `slider` | Pass | 1 | Pass | Pass | 343c | 105L | **A** |
| `source-list` | Pass | 1 | Pass | Pass | 339c | 67L | **A** |
| `split-ledger` | Pass | 1 | Pass | Pass | 717c | 288L | **A** |
| `stat-metric` | Pass | 1 | Pass | Pass | 388c | 92L | **A** |
| `status-badge` | Pass | 1 | Pass | Pass | 336c | 26L | **A** |
| `step-timeline` | Pass | 1 | Pass | Pass | 320c | 73L | **A** |
| `stepper-input` | Pass | 1 | Pass | Pass | 328c | 92L | **A** |
| `swatch-picker` | Pass | 1 | Pass | Pass | 417c | 108L | **A** |
| `switch` | Pass | 1 | Pass | Pass | 348c | 55L | **A** |
| `tabs` | Pass | 1 | Pass | Pass | 343c | 80L | **A** |
| `text` | Pass | 1 | Pass | Pass | 340c | 105L | **A** |
| `text-field` | Pass | 1 | Pass | Pass | 387c | 99L | **A** |
| `thought-trace` | Pass | 1 | Pass | Pass | 381c | 92L | **A** |
| `video` | Pass | 1 | Pass | Pass | 334c | 28L | **A** |

## 2. Function Slices (9)

| Slice (`src/functions/*`) | `schema.ts` | `index.ts` Seam | Seam Test | Grade |
| :--- | :---: | :---: | :---: | :---: |
| `basic-v1` | Pass | Pass | Pass | **A** |
| `compute-math` | Pass | Pass | Pass | **A** |
| `copy-to-clipboard` | Pass | Pass | Pass | **A** |
| `format-compact-number` | Pass | Pass | Pass | **A** |
| `format-percent` | Pass | Pass | Pass | **A** |
| `format-relative-time` | Pass | Pass | Pass | **A** |
| `select-by-value` | Pass | Pass | Pass | **A** |
| `set-value` | Pass | Pass | Pass | **A** |
| `share-content` | Pass | Pass | Pass | **A** |

# Technical Debt & Migration Tracker

Status: Active
Owner: Catalog Architecture
Last Verified: 2026-11-19

## Completed Migrations

- [x] Prune `AGENTS.md` to `< 100` lines and establish progressive disclosure map (`ARCHITECTURE.md`, `docs/GLOSSARY.md`, `docs/adr/`, `docs/specs/`, `.agents/skills/`).
- [x] Add deterministic harness (`scripts/verify.sh`, `scripts/check-docs.mjs`, `.dependency-cruiser.cjs`, `eslint.config.mjs`, `linters/rules/`, `tests/catalog-contract.test.ts`).
- [x] Migrate horizontal `packages/core/src/schemas/*.ts` and `packages/react/src/components/*.tsx` into 41 vertical Deep-Module slices under `src/components/<slug>/`.
- [x] Migrate `packages/core/src/functions/index.ts` into vertical function slices under `src/functions/<slug>/`.
- [x] Add worktree-safe isolated preview (`src/preview/` + `scripts/worktree-preview.sh`) and Playwright smoke suite (`tests/preview-smoke.spec.ts`).
- [x] Add CI verification and weekly GC / quality-score workflows (`.github/workflows/verify.yml`, `.github/workflows/gc-audit.yml`).

## Active Watchlist (Tracked by `.agents/skills/architecture-review`)

- Keep `src/components/chart/renderer.tsx` modularized with internal `donut-chart.tsx` helper so every file remains comfortably under the 350-line cap.
- Periodically run `pnpm gc:knip` and `pnpm quality:score` to catch unused exports or prompt drift early.

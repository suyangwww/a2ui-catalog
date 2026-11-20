---
name: architecture-review
description: Audit src/ for shallow modules, files approaching the 350-line cap, duplicated slice helpers, and over-mocked tests.
---

# Skill: Architectural & Deep-Module Review

Run this audit periodically or before large refactors to prevent structural entropy.

## Audit Checklist

1. **Boundary & Dead-Code Sensors:**
   - Run `pnpm lint` (`eslint` + `dependency-cruiser`) and `pnpm gc:knip`.
2. **Shallow Module Detection:**
   - Inspect `src/components/*/index.ts` and `src/functions/*/index.ts`. Each `index.ts` Seam must export only the canonical descriptor (`defineCatalogComponent` / `defineCatalogFunction`) and public `Props`/`Args` type — never internal sub-components or private helpers.
3. **Line-Count Headroom (`max-lines: 350`):**
   - Scan `src/**/*.{ts,tsx}` for files exceeding `280` non-blank, non-comment lines. Split private sub-views (e.g., `donut-chart.tsx` inside `src/components/chart/`) behind the existing `index.ts` Seam before hitting the 350-line hard error.
4. **Duplication Across Slices:**
   - Identify repeated parsing, formatting, or accessibility helpers across `3+` slices and extract them into `src/protocol/` (if pure) or `src/primitives/` (if React/UI).
5. **Seam-Only Testing:**
   - Verify `src/components/*/*.test.tsx` and `src/functions/*/*.test.ts` import from `./index.js` rather than mocking private internals.

## Output Format

Append a ranked list of concrete refactoring proposals (with file paths, line counts, and target Seam) to [docs/exec-plans/tech-debt-tracker.md](../../../docs/exec-plans/tech-debt-tracker.md).

# ADR 0001: Vertical Deep-Module Slices for A2UI Components & Functions

Status: Accepted
Owner: Catalog Architecture
Last Verified: 2026-11-19

## Context

Early iterations of `a2ui-catalog` grouped code horizontally by technical concern (`schemas/layout.ts`, `schemas/data.ts`, `components/layout.tsx`, `components/data.tsx`, centralized `instructions.ts`, and separate showcase fixtures). As the catalog grew to **41 components** and **20 functions**, horizontal files exceeded 500–860 lines, forcing coding agents to load thousands of unrelated tokens to modify a single component and allowing silent drift between Zod schemas, LLM prompt hints, example fixtures, and React renderers.

## Decision

1. **Co-locate every Component vertically** in `src/components/<kebab-slug>/` with six standardized files: `schema.ts`, `prompt.md`, `examples.json`, `renderer.tsx`, `index.ts`, and `<slug>.test.tsx`.
2. **Co-locate every custom Catalog Function vertically** in `src/functions/<kebab-slug>/` with `schema.ts`, `index.ts`, and `<slug>.test.ts`.
3. **Enforce Narrow Seams mechanically:** `.dependency-cruiser.cjs` forbids importing internal slice files from outside that slice, and `eslint.config.mjs` enforces a 350-line cap, zero `any`, and zero `as` casts in `src/`.
4. **Verify Cross-Artifact Alignment in CI:** `tests/catalog-contract.test.ts` asserts that every slice directory is registered in `src/catalog/registry.ts`, every `examples.json` fixture passes `propsSchema.safeParse`, and every `prompt.md` stays concise (`< 1500` chars) and references only valid schema properties.

## Consequences

- **Positive:** Adding or editing a component touches one small directory (`< 350` lines per file) + one registration line in `src/catalog/registry.ts`. Drift between schemas, prompts, examples, and renderers fails deterministically in `./scripts/verify.sh`.
- **Negative / Trade-off:** More directories (`41` component folders) in exchange for dramatically smaller per-task context windows and strict isolation. Do not re-consolidate slices into horizontal category files.

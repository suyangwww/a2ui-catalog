---
name: add-component
description: Scaffold or update an A2UI v1.0 vertical component slice under src/components/<slug>/ with full contract verification.
---

# Skill: Add or Update an A2UI Catalog Component

Follow these steps strictly whenever adding a new Component or modifying an existing Component Slice.

## Step 1: Align on Terminology & Spec
1. Read [docs/GLOSSARY.md](../../../docs/GLOSSARY.md) to ensure exact terminology (`Surface`, `Component`, `Dynamic Value`, `Check Rule`, `Composition Rule`, `Slice`, `Seam`).
2. Check [docs/specs/](../../../docs/specs/) and [docs/COMPONENT_CATALOG_SPEC.md](../../../docs/COMPONENT_CATALOG_SPEC.md) for the component's specification. Update or add the spec before writing implementation code.

## Step 2: Scaffold the Vertical Slice (`src/components/<slug>/`)
Create a single kebab-case folder `src/components/<slug>/` containing all six required files:
1. `schema.ts` — Zod `PropsSchema` (strictly typed, importing `Dynamic*`, `ActionSchema`, `CommonProps`, or `CheckableProps` from `../../protocol/index.js`), `ComponentApi` (`{ name, schema }`), `allowedChildren`, and `export type <Name>Props`. **Zero React imports in `schema.ts`.**
2. `prompt.md` — Concise (`20..1500` chars) LLM usage guidance including a `Props: \`...\`` line naming only real properties present in `schema.ts`.
3. `examples.json` — Non-empty JSON array of `{ "title": "...", "props": { ... }, "children"?: [...], "dataModel"?: {...} }` fixtures validated against `PropsSchema` (do not put `"component"` inside `props`).
4. `renderer.tsx` — Concrete React component (`<= 350` non-blank, non-comment lines; zero `any`; zero `as` casts; use safe value readers from `../../primitives/index.js`). Enforce `>= 44px` coarse-pointer hit targets and `prefers-reduced-motion` compliance.
5. `index.ts` — Narrow Seam calling `defineCatalogComponent({ id, slug, group, api, propsSchema, allowedChildren, renderer })` and exporting only the descriptor, `Api`, and `Props` type.
6. `<slug>.test.tsx` — Black-box test importing exclusively from `./index.js` and `./examples.json` to test strict schema validation and JSX rendering.

## Step 3: Register in `src/catalog/registry.ts`
1. Import the slice descriptor from `../components/<slug>/index.js` and add it to `ALL_COMPONENT_SLICES` in `src/catalog/registry.ts`.
2. Export `<Name>Api` in `packages/core/src/index.ts` if exposing the framework-free schema to `@a2ui-catalog/core`.

## Step 4: Verify Mechanically & Visually
1. Run `./scripts/verify.sh` (typecheck, ESLint + `dependency-cruiser` boundaries, doc integrity, `tests/catalog-contract.test.ts`, unit tests, and `pnpm build:catalog`).
2. Run `pnpm quality:score` to update [docs/QUALITY_SCORE.md](../../../docs/QUALITY_SCORE.md).
3. Boot `./scripts/worktree-preview.sh` or run `pnpm test:smoke` (`tests/preview-smoke.spec.ts`) to confirm zero runtime console errors across Light/Dark and Desktop/Mobile viewports.

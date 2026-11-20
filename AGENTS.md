# a2ui-catalog — Agent Entry Point

## Commands
- Full verification (run before every commit): `./scripts/verify.sh`
- Unit, boundary & A2UI contract tests: `pnpm test`
- End-to-end & preview smoke tests: `pnpm test:e2e`
- Typecheck (strict): `pnpm typecheck`
- Lint & architectural boundaries: `pnpm lint`
- Compile `dist/catalog.json` & `packages/schema/catalog.json`: `pnpm build:catalog`
- Recompute component health grades: `pnpm quality:score`
- Isolated preview server (worktree-safe): `./scripts/worktree-preview.sh`

## Non-Discoverable Landmines
- Use `pnpm` only; never run `npm install` or `yarn`.
- Target **A2UI v1.0** exclusively (`"version": "1.0"`, `"protocolVersion": "1.0"`, `@path`, `@call`, `@checks`, `@catalogId`, `@accessibility`, `@metadata`).
- Keep `zod` pinned to `^3.25.76` in `pnpm-workspace.yaml` `overrides` (`@a2ui/web_core` and `@a2ui/agent` rely on Zod 3 AST reflection). Use `@google/genai` directly in `apps/agent` (do not add `@google/adk`).
- Every A2UI component lives in its own vertical slice under `src/components/<slug>/` (`schema.ts`, `prompt.md`, `examples.json`, `renderer.tsx`, `index.ts`, `<slug>.test.tsx`) and exports its contract exclusively from `index.ts`.
- Keep `src/protocol/` dependency-pure (zero `react` or `react-dom` imports) and keep every file in `src/` under 350 non-blank, non-comment lines.
- Never hand-edit generated `dist/catalog.json` or `packages/schema/catalog.json`; regenerate via `pnpm build:catalog`.
- Validate all untrusted/agent payloads at the boundary with Zod and runtime type guards; no `any` or `as` type casts in `src/` production code.
- Enforce `>= 44px` coarse-pointer hit targets, mobile Bottom Sheets for `Modal` / `ArtifactCard`, `tabular-nums` on metrics/tables/charts, and `prefers-reduced-motion` compliance.

## Where to Look Next (Progressive Disclosure)
- Architecture, layers & invariants: [ARCHITECTURE.md](ARCHITECTURE.md)
- Canonical A2UI & domain terms: [docs/GLOSSARY.md](docs/GLOSSARY.md)
- Per-component health grades: [docs/QUALITY_SCORE.md](docs/QUALITY_SCORE.md)
- Plain-English usage guide for humans & agents: [docs/PLAYBOOK.md](docs/PLAYBOOK.md)
- Past design decisions (do not re-litigate): [docs/adr/0001-vertical-deep-modules.md](docs/adr/0001-vertical-deep-modules.md)
- Component specs & technical design: [docs/specs/0001-lumina-v1-catalog-spec.md](docs/specs/0001-lumina-v1-catalog-spec.md), [docs/COMPONENT_CATALOG_SPEC.md](docs/COMPONENT_CATALOG_SPEC.md), [docs/DESIGN.md](docs/DESIGN.md)
- Execution plans & tech-debt log: [docs/exec-plans/tech-debt-tracker.md](docs/exec-plans/tech-debt-tracker.md)
- Task workflows (load only when relevant):
  - Adding or updating a component: [.agents/skills/add-component/SKILL.md](.agents/skills/add-component/SKILL.md)
  - Refactoring or architectural audit: [.agents/skills/architecture-review/SKILL.md](.agents/skills/architecture-review/SKILL.md)
  - Checking documentation freshness: [.agents/skills/doc-gardening/SKILL.md](.agents/skills/doc-gardening/SKILL.md)

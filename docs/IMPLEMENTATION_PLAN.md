# A2UI Lumina Catalog — Master Implementation Plan

**Target Repository:** `/home/antigravity/wsyang0309/a2ui-catalog`  
**Companion Specifications:**
- Architecture & Design System: [`docs/DESIGN.md`](file:///home/antigravity/wsyang0309/a2ui-catalog/docs/DESIGN.md)
- Normative 41-Component & 20-Function Contract: [`docs/COMPONENT_CATALOG_SPEC.md`](file:///home/antigravity/wsyang0309/a2ui-catalog/docs/COMPONENT_CATALOG_SPEC.md)

This document is an **agent-executable engineering plan** broken into **8 sequential milestones (Phases 0–7)**. Each phase has explicit file targets, canonical code patterns, and automated verification gates that MUST pass before advancing to the next phase.

---

## 1. Monorepo Architecture & Target File Tree

Use **`pnpm` workspaces** (Node.js 24 LTS, TypeScript `5.9.x`) with strict package boundaries enforcing our 4-layer multi-platform architecture:

```text
a2ui-catalog/
├── package.json                       # Root workspace scripts & pnpm.overrides (zod@^3.25.76)
├── pnpm-workspace.yaml                # packages/*, apps/*, tools/*
├── tsconfig.base.json                 # Shared strict ESM TypeScript config
├── vitest.workspace.ts                # Unified unit/surface test runner
├── playwright.config.ts               # Desktop + Mobile (iPhone 15 Pro) E2E config
├── docs/
│   ├── DESIGN.md
│   ├── COMPONENT_CATALOG_SPEC.md
│   ├── IMPLEMENTATION_PLAN.md
│   └── PLATFORM_EXTENSION_GUIDE.md    # Angular, Flutter, SwiftUI, Jetpack Compose blueprints
├── packages/
│   ├── tokens/                        # @a2ui-catalog/tokens (Layer 0 — Zero framework deps)
│   │   ├── src/
│   │   │   ├── colors.tokens.json     # Alabaster (Light) & Obsidian (Dark) W3C tokens
│   │   │   ├── typography.tokens.json # SF Pro / Inter scale + tabular-nums rules
│   │   │   ├── layout.tokens.json     # Concentric radii, spacing, elevation, glass blur
│   │   │   └── motion.tokens.json     # Physical spring constants (mass, stiffness, damping)
│   │   ├── scripts/build-tokens.mjs   # Emits CSS vars, TS constants, Swift/Kotlin/Dart stubs
│   │   └── dist/                      # lumina-tokens.css, index.js, index.d.ts, platform stubs
│   ├── core/                          # @a2ui-catalog/core (Layer 1 — Pure @a2ui/web_core v1.0)
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── catalog-id.ts          # LUMINA_V1_CATALOG_ID + profile IDs
│   │   │   ├── instructions.ts        # LLM system prompt guidance string
│   │   │   ├── schemas/               # 41 ComponentApi definitions grouped in 6 categories
│   │   │   │   ├── layout.ts          # Row, Column, Grid, List, Carousel, Card, Tabs, Accordion, Modal, Divider
│   │   │   │   ├── media.ts           # Text, Image, Icon, Avatar, StatusBadge, Video, AudioPlayer
│   │   │   │   ├── inputs.ts          # Button, TextField, CheckBox, Switch, SegmentedControl, ChoicePicker, Slider, StepperInput, DateTimeInput
│   │   │   │   ├── reasoning.ts       # ThoughtTrace, StepTimeline, ApprovalCard, ProgressIndicator
│   │   │   │   ├── grounding.ts       # SourceList, CodeBlock, DiffViewer, ArtifactCard, Callout
│   │   │   │   └── data.ts            # StatMetric, Chart, DataTable, KeyValueList, ComparisonMatrix, FollowUpSuggestions
│   │   │   ├── functions/             # 14 re-exported Basic v1.0 + 6 Lumina FunctionImplementations
│   │   │   └── profiles.ts            # Full catalog + domain slices via Catalog.copyWith()
│   │   └── tests/                     # Schema generation, function unit tests, profile slicing tests
│   ├── schema/                        # @a2ui-catalog/schema (Layer 0 — Portable Artifacts & Conformance)
│   │   ├── catalog.json               # Generated canonical A2UI v1.0 JSON Schema Draft 2020-12
│   │   ├── vendor/v1_0/               # Synced upstream A2UI v1.0 meta-schemas & 38 basic examples
│   │   ├── conformance/               # Golden v1.0 .json fixtures for all 41 components + 4 hero flows
│   │   ├── scripts/export-and-validate.mjs
│   │   └── tests/conformance.test.ts  # Ajv Draft 2020-12 + PayloadValidator conformance suite
│   └── react/                         # @a2ui-catalog/react (Layer 2 — React Web & Mobile Renderer)
│       ├── src/
│       │   ├── index.ts               # luminaReactCatalog, LuminaProvider, LuminaSurface, hooks
│       │   ├── theme/                 # LuminaProvider (theme, toast portal, reduced-motion, viewport context)
│       │   ├── motion/                # Spring presets, StreamingEntrance wrapper, AnimatedNumber
│       │   ├── icons/                 # 83-icon registry (58 Basic v1.0 + 25 Agentic -> lucide-react)
│       │   ├── primitives/            # Adaptive Overlay (Modal <-> Draggable Mobile BottomSheet), Toast
│       │   └── components/            # 41 ReactComponentImplementations matching @a2ui-catalog/core
│       │       ├── layout/
│       │       ├── media/
│       │       ├── inputs/
│       │       ├── reasoning/
│       │       ├── grounding/
│       │       └── data/
│       └── tests/
│           ├── basic-v1-compat.test.tsx  # Runs all 38 upstream Basic Catalog v1.0 examples!
│           ├── components/               # Unit + interaction + @checks tests for all 41 components
│           └── mobile-adaptation.test.tsx
├── apps/
│   ├── explorer/                      # Interactive Component Workbench (Port 5173)
│   │   └── src/                       # Gallery, Live v1.0 Stream Simulator, DataModel & Action Inspector, Mobile Frame
│   ├── agent/                         # Live A2A v1.0 Agent Server (Port 10002)
│   │   └── src/
│   │       ├── index.ts               # Express + @a2a-js/sdk JSON-RPC & SSE (/a2a/json-rpc)
│   │       ├── executor.ts            # @a2ui/agent A2uiGenerator + ResponseStream + self-repair retry
│   │       ├── backends/
│   │       │   ├── gemini-backend.ts  # Live @google/genai (gemini-2.5-flash) + tool loop
│   │       │   └── replay-backend.ts  # Zero-API-key realistic chunk-streamed Stub/Replay mode
│   │       └── scenarios/             # Tools, mock domain datasets & golden replay streams for 4 Hero Cases
│   └── studio/                        # Flagship Conversational Agent UI + Canvas Drawer (Port 5174)
│       └── src/                       # ChatGPT/Apple Intelligence shell, Hero launcher, Artifact side-sheet, Mobile sheet
└── e2e/
    ├── explorer.spec.ts               # Component rendering, stream simulator, dark/light mode
    └── hero-workflows.spec.ts         # Multi-turn E2E tests across Desktop & Mobile iPhone 15 Pro viewports
```

---

## 2. Verified Dependency Matrix & Critical Engineering Rules

Pin these exact compatible package versions verified against npm and `a2ui-project/a2ui`:

| Package | Version | Role & Constraint |
| :--- | :--- | :--- |
| `@a2ui/web_core` | `^0.15.0` | Core v1.0 protocol (`@a2ui/web_core/v1_0`, `@a2ui/web_core/catalogs/basic/v1`) |
| `@a2ui/react` | `^0.15.0` | `A2uiSurface`, `createComponentImplementation`, `MarkdownContext` |
| `@a2ui/markdown-it` | `^0.2.2` | Sanitized Markdown renderer shared with `Text`, `Callout`, `ArtifactCard` |
| `@a2ui/agent` | `^0.1.0` | Server-side `A2uiGenerator`, `CatalogConfig`, `ExpressFormatFactory`, `DirectJsonFormatFactory` |
| `@a2a-js/sdk` | `^0.3.13` | A2A JSON-RPC & SSE server/client transport (matches upstream Node agent sample) |
| `@google/genai` | `^3.6.1` | Official Gemini SDK for live LLM generation (do **NOT** use `@google/adk` due to Zod 4 conflict) |
| `zod` | `^3.25.76` | **MUST** be pinned in root `package.json` `pnpm.overrides` so all packages share Zod 3 |
| `react` / `react-dom` | `^19.0.0` (peer `^18 \|\| ^19`) | Primary UI runtime |
| `motion` | `^14.14.0` | Hardware-accelerated spring animations (`motion/react`), `AnimatePresence`, `layoutId` |
| `lucide-react` | `^1.76.0` | Crisp `1.75px`-stroke icons mapped to A2UI icon identifiers |
| `@radix-ui/react-*` | Latest stable | Accessible headless `dialog`, `accordion`, `tabs`, `switch`, `checkbox`, `slider`, `tooltip` |
| `ajv` / `ajv-formats` | `^8.17.1` | JSON Schema Draft 2020-12 conformance validator (`ajv/dist/2020`) |

### Mandatory Coding Invariants for the Implementing Agent

1. **Never Mutate Surface State Outside A2UI:** Interactive inputs MUST write back through `@a2ui/react`'s bound setter (`props.setValue?.(...)` or `context` writable bindings) so reactive `@path` and `@call` expressions re-evaluate automatically.
2. **Always Wire Accessibility & Check Refs:** Every **Checkable** component (`Button`, `TextField`, `CheckBox`, `Switch`, `ChoicePicker`, `Slider`, `StepperInput`, `DateTimeInput`, `ApprovalCard`) MUST attach `accessibilityRef` to its primary interactive element and `validationErrorsRef` to its validation error container.
3. **Always Render Child IDs via `buildChild`:** Container components (`Row`, `Column`, `Grid`, `List`, `Carousel`, `Card`, `Tabs`, `Accordion`, `Modal`, `ThoughtTrace`, `StepTimeline`, `ApprovalCard`, `ArtifactCard`) MUST render child slots using `buildChild(childId)` — never manually indexing `surface.componentsModel`.
4. **Sanitize External Media & Links:** Pass all external URLs in `Image`, `Video`, `AudioPlayer`, and `SourceList` through `sanitizeMediaUrl` from `@a2ui/web_core/v1_0` (rejecting `javascript:` / `data:text/html` schemes).

---

## 3. Canonical Implementation Patterns (Reference Templates)

### 3.1 Defining a `ComponentApi` in `@a2ui-catalog/core`

```typescript
// packages/core/src/schemas/reasoning.ts
import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import {
  ActionSchema,
  CheckableSchema,
  componentId,
  dynamicString,
  WeightSchema,
} from '@a2ui/web_core/v1_0';

export const ApprovalCardApi = {
  name: 'ApprovalCard',
  schema: CheckableSchema.extend({
    title: dynamicString('Headline of the approval request.'),
    description: dynamicString('Context explaining what will happen on approval.').optional(),
    riskLevel: z.enum(['low', 'medium', 'high']).default('medium'),
    state: dynamicString("Current state: 'pending', 'approved', or 'rejected'.").optional(),
    details: componentId({ description: 'Optional child component (e.g. KeyValueList or DiffViewer).' }).optional(),
    approveLabel: dynamicString('Primary approval button text.').optional(),
    approveAction: ActionSchema,
    rejectLabel: dynamicString('Secondary rejection button text.').optional(),
    rejectAction: ActionSchema.optional(),
    weight: WeightSchema.optional(),
  }).describe('Human-in-the-loop confirmation card for high-impact or irreversible agent actions.'),
} satisfies ComponentApi;
```

### 3.2 Implementing the React Component in `@a2ui-catalog/react`

```tsx
// packages/react/src/components/reasoning/ApprovalCard.tsx
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createComponentImplementation } from '@a2ui/react';
import { ApprovalCardApi } from '@a2ui-catalog/core';
import { springFluid, springTactile } from '../../motion/springs';

export const ApprovalCard = createComponentImplementation(
  ApprovalCardApi,
  ({ props, buildChild, accessibilityRef, validationErrorsRef }) => {
    const state = (props.state as string) ?? 'pending';
    const risk = (props.riskLevel as 'low' | 'medium' | 'high') ?? 'medium';
    const isValid = props.isValid !== false;
    const errors = (props.validationErrors as string[] | undefined) ?? [];

    return (
      <motion.section
        ref={accessibilityRef}
        layout
        transition={springFluid}
        className={`lumina-approval-card lumina-risk-${risk} lumina-state-${state}`}
      >
        {/* Header, optional buildChild(props.details), validationErrorsRef, and tactile Approve/Decline buttons */}
        {props.details ? <div className="lumina-approval-details">{buildChild(String(props.details))}</div> : null}
        <div ref={validationErrorsRef} className="lumina-validation-errors" aria-live="polite">
          {errors.map((err, i) => <span key={i}>{err}</span>)}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {state === 'pending' ? (
            <motion.div key="actions" className="lumina-approval-actions">
              {props.rejectAction && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  transition={springTactile}
                  onClick={() => props.onRejectAction?.()}
                >
                  {String(props.rejectLabel ?? 'Decline')}
                </motion.button>
              )}
              <motion.button
                type="button"
                disabled={!isValid}
                whileTap={isValid ? { scale: 0.97 } : undefined}
                transition={springTactile}
                onClick={() => isValid && props.onApproveAction?.()}
              >
                {String(props.approveLabel ?? 'Approve')}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key="receipt" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
              {state === 'approved' ? 'Approved' : 'Declined'}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    );
  },
);
```

> [!NOTE]
> Verify the exact bound action/setter callback names exposed by `@a2ui/web_core@0.15.0`'s `GenericBinder` (`onAction` / `setValue` / `context.dispatchAction`) during Phase 1's vertical slice test against `MessageProcessor` so every input and multi-action component (`ApprovalCard`, `DiffViewer`, `FollowUpSuggestions`) dispatches actions cleanly!

---

## 4. Phased Execution Plan (Milestones 0–7)

### Phase 0: Monorepo Bootstrap, Design Tokens & Upstream Fixture Sync
**Goal:** Establish a rock-solid `pnpm` monorepo, generate the Apple/ChatGPT design token system, and vendor upstream A2UI v1.0 schemas & golden Basic Catalog examples for automated parity testing.

1. **Workspace Scaffolding:**
   - Create `package.json` (`"packageManager": "pnpm@10.x"`, `pnpm.overrides: { "zod": "^3.25.76" }`), `pnpm-workspace.yaml`, `tsconfig.base.json`, `.gitignore`, and `vitest.workspace.ts`.
   - Install core dependencies and verify zero peer-dependency or Zod version conflicts.
2. **Design Tokens Package (`@a2ui-catalog/tokens`):**
   - Author W3C token files (`colors.tokens.json`, `typography.tokens.json`, `layout.tokens.json`, `motion.tokens.json`) implementing the exact **Alabaster & Obsidian** palette, concentric border radii (`20px / 14px / 10px / 6px`), `tabular-nums` font stacks, and 4 physical spring curves (`springTactile`, `springFluid`, `springSheet`, `springStream`) from [`docs/DESIGN.md`](file:///home/antigravity/wsyang0309/a2ui-catalog/docs/DESIGN.md).
   - Write `scripts/build-tokens.mjs` to emit:
     - `dist/lumina-tokens.css` (Light + Dark `[data-lumina-theme]` + `@media (prefers-color-scheme: dark)` + `@media (pointer: coarse)` variables)
     - `dist/index.ts` (typed TypeScript token & Motion spring objects)
     - `dist/platforms/{LuminaTokens.swift, LuminaTokens.kt, lumina_tokens.dart}` (proving cross-platform token codegen!).
3. **Upstream A2UI v1.0 Spec & Golden Example Sync (`@a2ui-catalog/schema`):**
   - Fetch/copy upstream `specification/v1_0/json/{catalog_definition.json, common_types.json, agent_to_renderer.json, renderer_to_agent.json}` and `catalogs/basic/v1/{catalog.json, examples/*.json}` from `a2ui-project/a2ui` into `packages/schema/vendor/v1_0/` via a repeatable script `packages/schema/scripts/sync-upstream-spec.mjs`.
4. **Verification Gate (Phase 0):**
   - `pnpm build` compiles `@a2ui-catalog/tokens` cleanly and outputs CSS + TS + Swift/Kotlin/Dart token artifacts.

---

### Phase 1: Web Core (`@a2ui-catalog/core`), `catalog.json` Generation & Spec Conformance
**Goal:** Implement all 41 `ComponentApi` schemas, all 20 `FunctionImplementation`s, catalog prompt `instructions`, domain profile slices, and pass 100% Ajv Draft 2020-12 A2UI v1.0 schema conformance.

1. **Author All 41 Component Schemas (`packages/core/src/schemas/`):**
   - Implement `layout.ts` (10), `media.ts` (7), `inputs.ts` (9), `reasoning.ts` (4), `grounding.ts` (5), and `data.ts` (6) strictly matching [`docs/COMPONENT_CATALOG_SPEC.md`](file:///home/antigravity/wsyang0309/a2ui-catalog/docs/COMPONENT_CATALOG_SPEC.md).
   - Ensure every Basic Catalog v1.0 property name and enum value is accepted without breaking existing v1.0 examples.
2. **Author All 20 Functions (`packages/core/src/functions/`):**
   - Re-export all 14 `BASIC_FUNCTIONS` from `@a2ui/web_core/v1_0`.
   - Implement `formatCompactNumber`, `formatPercent`, `formatRelativeTime`, `copyToClipboard`, `shareContent`, and `setValue` using `createFunctionImplementation`, with full unit tests.
3. **Catalog Assembly, Profile Slices & `catalog.json` Export:**
   - Assemble `luminaCoreCatalog` (`protocolVersion: "1.0"`, `LUMINA_V1_CATALOG_ID`, `LUMINA_INSTRUCTIONS`) and `createLuminaCatalogSlice('core' | 'research' | 'commerce' | 'devops' | 'analytics')`.
   - Write `packages/schema/scripts/export-and-validate.mjs` to serialize `luminaCoreCatalog.toJson()` -> `packages/schema/catalog.json` and validate it with `ajv/dist/2020` against `vendor/v1_0/catalog_definition.json` + UAX #31 identifier rules.
4. **Verification Gate (Phase 1):**
   - `pnpm --filter @a2ui-catalog/core test` passes 100% of schema & function unit tests.
   - `pnpm --filter @a2ui-catalog/schema test` proves `packages/schema/catalog.json` validates cleanly against A2UI v1.0 `catalog_definition.json` AND loads losslessly via `Catalog.fromJson()` in `@a2ui/web_core` and `@a2ui/agent`'s `A2uiGenerator`!

---

### Phase 2: React Foundation & Upgraded Core Primitives (26 Components — Categories 1, 2 & 3)
**Goal:** Build the `@a2ui-catalog/react` core infrastructure (theme, motion, accessibility, mobile Bottom Sheet, icon registry, toast feedback) and all 26 Layout, Media, and Input components—passing all 38 upstream Basic Catalog v1.0 golden examples!

1. **React Infrastructure (`packages/react/src/`):**
   - `LuminaProvider`: Scopes `data-lumina-theme`, injects `@a2ui-catalog/tokens/lumina-tokens.css`, wires `<MarkdownContext.Provider value={renderMarkdown}>` (`@a2ui/markdown-it`), manages reduced-motion preference (`useReducedMotion()`), and hosts the non-intrusive floating Toast pill for `copyToClipboard`.
   - `LuminaSurface`: Ergonomic wrapper around `<A2uiSurface surface={surface} />` with error boundary and streaming surface container styling.
   - `icons/`: Complete 83-icon lookup table mapping all 58 Basic Catalog v1.0 camelCase icon names + 25 agentic icon names to `lucide-react` components + custom `{ svgPath }` SVG rendering.
   - `primitives/AdaptiveOverlay`: Desktop centered frosted `@radix-ui/react-dialog` (`>= 768px`) that automatically renders as a touch-draggable iOS **Bottom Sheet** (`< 768px`) with spring snap-back, drag-down dismissal, and safe-area padding.
2. **Implement Category 1 — Layout & Containers (10):**
   - `Row`, `Column`, `Grid`, `List` (supporting `TemplateChildList` + `@index` + staggered item entrance), `Carousel` (CSS scroll-snap + desktop glass chevrons + dots), `Card`, `Tabs` (Motion `layoutId` sliding pill), `Accordion`, `Modal` (powered by `AdaptiveOverlay`), `Divider`.
3. **Implement Category 2 — Typography, Media & Identity (7):**
   - `Text` (optical scale + sanitized Markdown), `Image` (skeleton shimmer + optional spring lightbox zoom), `Icon`, `Avatar`, `StatusBadge` (with live `pulse` dot), `Video`, `AudioPlayer` (custom sleek scrub bar + `1x/1.5x/2x` speed toggle + tabular timecode).
4. **Implement Category 3 — Tactile Inputs & Controls (9):**
   - `Button` (supports both `child` and `label`, tactile `0.97` press scale, `@checks` gating), `TextField` (prefix icon, clearable, auto-grow `longText`, animated `@checks` shake), `CheckBox` (SVG stroke draw), `Switch` (iOS spring thumb), `SegmentedControl` (`layoutId` sliding pill), `ChoicePicker` (`checkbox | chips | cards` + live filter input), `Slider` (active track fill + tabular readout), `StepperInput` (odometer digit roll), `DateTimeInput`.
5. **Verification Gate (Phase 2 — Upstream Compatibility Milestone!):**
   - Write `packages/react/tests/basic-v1-compat.test.tsx` (adapted from `typescript/renderers/react/a2ui_explorer/tests/v1_0/*.test.tsx`): rewrite `catalogId` on all **38 upstream `catalogs/basic/v1/examples/*.json`** to `LUMINA_V1_CATALOG_ID`, process through `MessageProcessor([luminaReactCatalog])`, render in `<LuminaSurface />`, and assert non-empty DOM output + **zero processor or validation errors** across all 38 examples!
   - Unit tests for `Grid`, `Carousel`, `Accordion`, `Avatar`, `StatusBadge`, `Switch`, `SegmentedControl`, `StepperInput`, two-way data binding, and `@checks` validation errors.

---

### Phase 3: Higher-Order Agentic Components (15 Components — Categories 4, 5 & 6)
**Goal:** Build the 15 signature agentic UI components that make Lumina rival ChatGPT's Intelligent UI and Apple's native apps, along with golden conformance fixtures for every component.

1. **Implement Category 4 — Agentic Reasoning, Workflow & HITL (4):**
   - `ThoughtTrace` (metallic text shimmer when `status === 'thinking'`, smooth collapsible step list).
   - `StepTimeline` (pulsing active ring, animated connector fill, spring checkmarks, expandable step `child`).
   - `ApprovalCard` (risk-tinted glass header, nested `details` slot, `@checks` gating, smooth `pending -> approved/rejected` receipt morph).
   - `ProgressIndicator` (`bar`, circular SVG `ring`, and `segmented` variants + smooth numeric interpolation).
2. **Implement Category 5 — Grounding, Knowledge & Artifacts (5):**
   - `SourceList` (`pills`, horizontal snap `cards`, and `compactList` variants with domain monograms & citation indices).
   - `CodeBlock` (lightweight zero-WASM regex/token syntax highlighter for TS/JS/Python/JSON/SQL/Bash/YAML/Diff, line numbers, highlighted lines, animated Copy -> Checkmark button, optional action CTA).
   - `DiffViewer` (LCS line diff engine supporting `unified` and `split` modes, auto-collapsing `split` -> `unified` on `< 640px` mobile, plus optional `acceptAction` / `rejectAction`).
   - `ArtifactCard` (crisp Canvas preview card; clicking opens `child` inside a desktop slide-over sheet or mobile fullscreen sheet via `AdaptiveOverlay`).
   - `Callout` (6 semantic tones with icon, Markdown body, and optional action).
3. **Implement Category 6 — Data Synthesis & Conversational Flow (6):**
   - `StatMetric` (tabular KPI counter interpolation, semantic delta badge, smooth SVG cubic-bezier sparkline).
   - `Chart` (custom responsive SVG `line`, `area`, `bar`, `stackedBar`, and `donut` charts — animated stroke/bar entrance, Apple Stocks-style magnetic hover crosshair on desktop + touch-drag scrubber on mobile!).
   - `DataTable` (client-side column sorting, `currency`/`percent`/`number`/`badge` formatting, sticky primary column on mobile horizontal scroll, `maxRows` expander, `rowAction`).
   - `KeyValueList` (Apple Wallet receipt rows, `copyable` values, `rows | grid` layouts).
   - `ComparisonMatrix` (highlighted `recommended` option column on desktop; swipeable snap cards on mobile).
   - `FollowUpSuggestions` (staggered conversational prompt chips dispatching `Action`).
4. **Author Golden Conformance Fixtures (`packages/schema/conformance/`):**
   - Create JSON test fixtures covering all 23 net-new Lumina components and validate every fixture against `packages/schema/catalog.json` + `agent_to_renderer.json`.
5. **Verification Gate (Phase 3):**
   - `pnpm test` runs Vitest across `core`, `schema`, and `react` with 100% pass rate across all 41 components (including keyboard navigation, `@checks`, action dispatch, and mobile viewport media queries).

---

### Phase 4: Lumina Component Explorer & Live Stream Workbench (`apps/explorer`)
**Goal:** Build a locally runnable developer workbench (adapting `typescript/renderers/react/a2ui_explorer` & `tools/composer`) to inspect, stream, edit, and mobile-test every component and example.

1. **Explorer Features (`apps/explorer`, Vite + React, Port `5173`):**
   - ** Categorized Sidebar:** Browse all 41 Lumina component showcases + all 38 Basic Catalog v1.0 examples + 4 Hero static previews.
   - **Live A2UI v1.0 JSON Editor & Stream Simulator:** Toggle **"Simulate Agent Stream"** (streams `createSurface`, `updateDataModel`, and incremental `updateComponents` batches at `60ms–150ms` intervals so developers can watch streaming choreography and counter interpolations live!).
   - **Inspector Drawer:** Real-time `SurfaceModel.dataModel` JSON viewer/editor (test two-way reactivity live!) + Outbound `Action` & `FunctionCall` event log.
   - **Theme & Device Frame Controls:** Instant **Alabaster Light / Obsidian Dark** switcher + **Desktop (`100%`) / iPad (`768×1024`) / iPhone 15 Pro (`393×852` with notch & safe-area inset)** device frame preview!
2. **Verification Gate (Phase 4):**
   - `pnpm --filter @a2ui-catalog/explorer build` succeeds with zero TypeScript or bundler warnings.

---

### Phase 5: Live A2UI v1.0 Agent Server (`apps/agent` — Gemini + Deterministic Replay)
**Goal:** Build the A2A JSON-RPC + SSE agent server reusing `@a2ui/agent`, `@a2a-js/sdk`, and `@google/genai` (adapting `samples/agent/node/restaurant_finder` to A2UI v1.0 and Lumina), supporting both live Gemini inference and zero-key deterministic streaming replay.

1. **A2A v1.0 Server & `@a2ui/agent` Pipeline (`apps/agent`, Port `10002`):**
   - Expose `/a2a/json-rpc` (`message/stream` SSE and `message/send`) and `/health` (reporting active mode: `gemini` vs `replay`, supported catalog IDs, and available hero scenarios) with CORS enabled for `localhost:*`.
   - Load `packages/schema/catalog.json` via `Catalog.fromJson(...)` into `A2uiGenerator([new CatalogConfig(luminaCatalog)], examplesMap, new ExpressFormatFactory())` (with configurable fallback to `DirectJsonFormatFactory`).
   - Read inbound `metadata.a2uiRendererCapabilities["1.0"].supportedCatalogIds` AND inbound A2UI v1.0 `action` parts (`name`, `surfaceId`, `sourceComponentId`, `context`, `userMessage`).
   - Validate streamed LLM output incrementally using `@a2ui/agent`'s `ResponseStream` / `parseResponse`; if validation fails on live LLM output, automatically run 1 self-repair turn passing the exact schema validation error back to Gemini!
2. **Dual Backend Implementation:**
   - **`GeminiBackend` (`@google/genai`, model configurable via `GEMINI_MODEL`, default `gemini-2.5-flash`):** Maintains multi-turn conversation state per `contextId`, executes domain tools for the 4 Hero Scenarios, and streams A2UI v1.0 surfaces.
   - **`DeterministicReplayBackend` (default when `GEMINI_API_KEY` is unset or `LUMINA_AGENT_MODE=replay`):** Matches user prompt intent or `action.name` to rich multi-step A2UI v1.0 message sequences, streaming them over SSE with realistic `ThoughtTrace` -> `StepTimeline` -> `updateComponents` -> `updateDataModel` timing (`80ms` between chunks) so local evaluation and CI showcase the exact live streaming experience without requiring API keys!
3. **Implement the 4 Hero Scenarios & Domain Tools (`apps/agent/src/scenarios/`):**
   - **Hero 1 — Executive Tokyo Travel Concierge:**
     - *Turn 1 (`"Plan a 4-day executive trip to Tokyo in May"`):* Streams `ThoughtTrace` -> `StepTimeline` (Flight search, Boutique hotel curation, Weather check) -> `ComparisonMatrix` (ANA NH 105 vs JAL JL 005 vs United UA 837) -> `Carousel` of 3 Tokyo hotel `Card`s -> `FollowUpSuggestions`.
     - *Turn 2 (`action: select_flight` or `"Customize NH 105 & Aman Tokyo"`):* Streams customization surface with `SegmentedControl` (Cabin class), `StepperInput` (Travelers & Extra nights), `Switch` (Airport limousine transfer), reactive `@call: formatCurrency` live total `StatMetric`, and `ApprovalCard` (`"Hold & Confirm Itinerary"`).
     - *Turn 3 (`action: confirm_booking`):* Updates/transitions into an Apple Wallet-style confirmation pass (`StatusBadge` `"Confirmed · On Time"`, `KeyValueList` with copyable PNR `LUM-8842K`, `ArtifactCard` full day-by-day itinerary).
   - **Hero 2 — Deep Research & AI Semiconductor Synthesis:**
     - *Turn 1:* Streams `ThoughtTrace` + determinate `ProgressIndicator` -> `SourceList` (5 grounded industry citations) -> 3-card `Grid` of `StatMetric`s (Data Center TAM, Gross Margin, YoY Growth with sparklines) -> interactive multi-series `Chart` (`area` / `bar` quarterly revenue) -> sortable `DataTable` -> `Callout` key insight -> `ArtifactCard` (expandable executive memo) + `FollowUpSuggestions`.
     - *Turn 2 (`action: drilldown_segment` or follow-up chip):* Streams comparative margin `Chart` (`line`) + sensitivity `Slider`.
   - **Hero 3 — Autonomous DevOps & Production Hotfix Copilot:**
     - *Turn 1:* Streams `StepTimeline` (Alert triage -> Trace correlation -> Patch synthesis) -> `Callout` (`critical`: connection pool exhaustion in `checkout-api`) -> p99 latency spike `Chart` -> diagnostic SQL/log `CodeBlock` -> `DiffViewer` (`pool_config.yaml` & `retry.ts` patch) -> high-risk `ApprovalCard` gated by a `CheckBox` (`@checks: [required]` `"I verified staging canary metrics"`).
     - *Turn 2 (`action: approve_rollout`):* Streams live canary rollout `ProgressIndicator` (`segmented`) -> `StatusBadge` `"Healthy · p99 42ms"`.
   - **Hero 4 — Personal Wealth & Subscription Optimizer:**
     - *Turn 1:* Streams net monthly savings `StatMetric` + spending `Chart` (`donut`) -> `SegmentedControl` (`Overview | Subscriptions | Rebalance`) -> recurring subscriptions `List` (`TemplateChildList`) with interactive `Switch` toggles -> live monthly investment `Slider` dynamically computing projected 5-year value on the client -> `ApprovalCard` (`"Cancel Selected & Rebalance"`).
4. **Verification Gate (Phase 5):**
   - Automated Vitest suite (`apps/agent/tests/agent.test.ts`, modeled on `samples/agent/node/restaurant_finder/tests/`) drives every Hero multi-turn flow in-process over JSON-RPC SSE, validating 100% of emitted A2UI v1.0 parts against `packages/schema/catalog.json` and `agent_to_renderer.json`!

---

### Phase 6: Flagship Studio App (`apps/studio`) — End-to-End Agent Showcase
**Goal:** Build a breathtaking ChatGPT / Apple Intelligence-inspired React application (`apps/studio`, Port `5174`) connecting to `apps/agent` over A2A v1.0 streaming SSE.

1. **Studio Experience (`apps/studio`):**
   - **Zero-Friction Hero Launcher:** Clean welcome screen featuring 4 tactile Hero Scenario cards (1-click launch) + freeform prompt composer bar (`Cmd/Ctrl+Enter`, streaming stop button).
   - **Live Mode Pill in Header:** Displays `Live Gemini` (when `apps/agent` detects `GEMINI_API_KEY`, with optional Runtime API Key input modal for quick local testing!) or `Interactive Replay` mode, plus **Light / Dark** toggle and **Mobile / Desktop Preview** toggle.
   - **Conversational Surface Stream:** Renders user prompts, outbound UI action pills (e.g., *"Selected NH 105 Business"*), and live-streaming `<LuminaSurface />` turns.
   - **Integrated Canvas / Artifact Drawer:** Clicking any `ArtifactCard` smoothly opens a split-screen ChatGPT Canvas pane on desktop (or fullscreen draggable sheet on mobile).
   - **Protocol X-Ray Toggle (`Inspector`):** Optional collapsible developer drawer showing live A2A SSE JSON-RPC frames (`createSurface`, `updateComponents`, `updateDataModel`, `action`) in real time!
2. **Root One-Command Runner:**
   - Configure root `pnpm dev` to launch `apps/agent` (`:10002`), `apps/studio` (`:5174`), and `apps/explorer` (`:5173`) concurrently with clear startup banner URLs.

---

### Phase 7: Cross-Platform Extension Guide, Playwright E2E & Release Polish
**Goal:** Prove end-to-end visual, functional, and mobile fidelity in real headless Chromium browsers and finalize multi-platform extension documentation.

1. **Playwright E2E Test Suite (`e2e/`):**
   - Configure `playwright.config.ts` with two projects: `desktop-chromium` (`1440×900`) and `mobile-iphone` (`393×852`, `isMobile: true`, `hasTouch: true`).
   - **`e2e/explorer.spec.ts`:** Verifies Component Explorer loads, switches Light/Dark themes, streams an example incrementally, and updates reactive `DataModel` bindings.
   - **`e2e/hero-workflows.spec.ts`:** Drives all **4 Hero Use Cases** end-to-end through `apps/studio` <-> `apps/agent`:
     - Verifies multi-turn actions (`ComparisonMatrix` selection -> `StepperInput` increment -> `ApprovalCard` `@checks` validation block & unlock -> confirmed receipt).
     - Verifies mobile `Modal` / `ArtifactCard` renders as a bottom sheet with `>= 44px` touch targets and zero horizontal viewport overflow (`scrollWidth <= clientWidth`).
2. **Multi-Platform Extension Blueprint (`docs/PLATFORM_EXTENSION_GUIDE.md`):**
   - Document step-by-step adapter patterns with working code templates for extending Lumina to:
     - **Angular** (`@a2ui/angular` reusing `@a2ui-catalog/core` + `@a2ui-catalog/tokens/lumina-tokens.css`)
     - **Flutter** (`a2ui_flutter` + `lumina_tokens.dart` + `packages/schema/catalog.json`)
     - **iOS SwiftUI** (`A2UISwiftUI` + `LuminaTokens.swift` + `packages/schema/catalog.json`)
     - **Android Jetpack Compose** (`androidx.a2ui.compose` + `LuminaTokens.kt` + `packages/schema/catalog.json`)
3. **Final Verification Gate (Phase 7):**
   - `pnpm build` -> `0` errors across all packages and apps.
   - `pnpm lint && pnpm typecheck` -> `0` errors.
   - `pnpm test` -> All unit, schema conformance, 38 Basic Catalog v1.0 compatibility, 41 Lumina component, and Node agent SSE tests pass.
   - `pnpm test:e2e` -> All Desktop + Mobile Playwright tests pass.

---

## 5. Master Execution Checklist for the Coding Agent

- [ ] **Phase 0:** Initialize `pnpm` monorepo (`zod@^3.25.76` override), build `@a2ui-catalog/tokens` (CSS + TS + Swift/Kotlin/Dart emitters), and sync upstream A2UI v1.0 JSON schemas & 38 Basic Catalog examples.
- [ ] **Phase 1:** Implement `@a2ui-catalog/core` (41 `ComponentApi` schemas, 20 `FunctionImplementation`s, prompt `instructions`, profile slices) and validate generated `packages/schema/catalog.json` against A2UI v1.0 `catalog_definition.json`.
- [ ] **Phase 2:** Implement `@a2ui-catalog/react` foundation (`LuminaProvider`, `LuminaSurface`, `AdaptiveOverlay`, 83-icon registry, spring presets) + Categories 1–3 (26 components) and pass all 38 upstream Basic Catalog v1.0 examples.
- [ ] **Phase 3:** Implement Categories 4–6 (15 agentic components: `ThoughtTrace`, `StepTimeline`, `ApprovalCard`, `ProgressIndicator`, `SourceList`, `CodeBlock`, `DiffViewer`, `ArtifactCard`, `Callout`, `StatMetric`, `Chart`, `DataTable`, `KeyValueList`, `ComparisonMatrix`, `FollowUpSuggestions`) + golden conformance fixtures & unit tests.
- [ ] **Phase 4:** Build `apps/explorer` (41-component gallery, Live Stream Simulator, DataModel/Action inspector, Desktop/iPad/iPhone frame preview).
- [ ] **Phase 5:** Build `apps/agent` (`@a2ui/agent` + `@a2a-js/sdk` + `@google/genai` `GeminiBackend` + zero-key `DeterministicReplayBackend` + 4 multi-turn Hero Scenarios) and pass JSON-RPC SSE validation tests.
- [ ] **Phase 6:** Build `apps/studio` (ChatGPT/Apple Intelligence conversational UI, 4 Hero launchers, Canvas/Artifact drawer, Protocol X-Ray inspector, runtime Gemini API key support, `pnpm dev` one-command launcher).
- [ ] **Phase 7:** Author `docs/PLATFORM_EXTENSION_GUIDE.md` and pass full Desktop + Mobile Playwright E2E test suite (`pnpm test:e2e`).

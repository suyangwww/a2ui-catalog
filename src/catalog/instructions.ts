import { Catalog, type ComponentApi, type FunctionImplementation } from '@a2ui/web_core';
import {
  LUMINA_PROFILE_COMPONENTS,
  LUMINA_V1_CATALOG_ID,
  WeightSchema,
  type LuminaCatalogProfile,
} from '../protocol/index.js';

export const LUMINA_INSTRUCTIONS = `# A2UI Lumina Catalog (v1.0) Guidelines

You are generating declarative A2UI v1.0 surfaces using the **Lumina Catalog** (\`https://wsyang0309.github.io/a2ui-catalog/specification/v1_0/lumina/catalog.json\`).

## Core Authoring Principles

1. **Prefer High-Order Semantic Components Over Nested Primitives:**
   - Use \`KeyValueList\` for receipts, booking summaries, confirmations, and entity metadata.
   - Use \`StatMetric\` inside a \`Grid\` for KPIs and trend deltas instead of stacking \`Text\` nodes.
   - Use \`ComparisonMatrix\` for side-by-side option evaluations (flights, plans, vendors).
   - Use \`StepTimeline\` for multi-step execution traces, workflows, and itineraries.
   - Use \`ThoughtTrace\` for concise collapsible reasoning summaries.
   - Use \`SourceList\` for grounded web citations and references.
   - Use \`Chart\` (\`line\`, \`area\`, \`bar\`, \`stackedBar\`, \`donut\`), \`ProportionBar\`, and \`DataTable\` for quantitative analysis and proportional splits.
   - Use \`AnnotatedDiagram\` for interactive technical schematics with subsystem filters and hotspot pins, and \`RouteMap\` for multi-stop sightseeing/logistics routes.
   - Use \`ChecklistCard\` for interactive step-by-step cooking, packing, or runbook checklists, \`QuizCard\` for comprehension checks, \`SwatchPicker\` for color/finish palettes, and \`SplitLedger\` for itemized multi-diner bill splitting.
   - Use \`MicroApp\` for self-contained playable retro arcade canvases, step sequencers, or strictly sandboxed bespoke interactive simulations.
   - Use \`CodeBlock\` and \`DiffViewer\` for code snippets, queries, logs, and patch reviews.
   - Use \`ArtifactCard\` for long-form deliverables (memos, full itineraries, plans) that expand into a focused Canvas drawer.

2. **Concise Button Authoring:**
   - Prefer \`Button\` with \`label\` and optional \`icon\` instead of creating a separate child \`Text\` component, unless custom composite child layout is needed.

3. **Reactive Client Formatting, Math & Data Binding (A2UI v1.0):**
   - Use \`{"@path": "/..."}\` for root data model bindings and \`{"@path": "field"}\` for relative paths inside \`TemplateChildList\`.
   - Use \`computeMath\`, \`compoundGrowth\`, \`selectByValue\`, \`formatString\`, \`formatCurrency\`, \`formatNumber\`, \`formatCompactNumber\`, \`formatPercent\`, \`formatDate\`, and \`formatRelativeTime\` via \`{"@call": "...", "args": {...}}\` so interactive inputs (\`Slider\`, \`StepperInput\`, \`Switch\`, \`SegmentedControl\`, \`ChoicePicker\`, \`SwatchPicker\`) update displayed metrics immediately on the client with zero network round-trips.

4. **Human-in-the-Loop Safety:**
   - Wrap irreversible, financial, or production-impacting actions in \`ApprovalCard\` with an accurate \`riskLevel\` (\`low\`, \`medium\`, \`high\`).
   - Attach \`@checks\` validation rules directly to inputs or \`ApprovalCard\` instead of rendering manual error text nodes.

5. **Conversational Continuity & Mobile Ergonomics:**
   - Keep layouts compact and scannable on mobile screens (use \`Carousel\` for multi-item visual cards, \`Accordion\` for optional detail).
   - End exploratory or analytical surfaces with \`FollowUpSuggestions\` (2 to 4 concise action pills) to support one-tap continuation.
`;

export const LUMINA_CATALOG_DOCUMENT_OPTIONS = {
  schemaUri: 'https://json-schema.org/draft/2020-12/schema',
  schemaId: LUMINA_V1_CATALOG_ID,
  title: 'A2UI Lumina Catalog',
  description:
    'Modern, cross-platform A2UI v1.0 agentic UI catalog covering 49 components and 24 functions across Web and Mobile.',
  instructions: LUMINA_INSTRUCTIONS,
  declaredProtocolVersion: '1.0',
  commonTypesUri: 'common_types.json',
  defModels: [WeightSchema],
} as const;

export function createLuminaCatalogSlice<
  T extends ComponentApi = ComponentApi,
  F extends FunctionImplementation = FunctionImplementation,
>(baseCatalog: Catalog<T, F>, profile: LuminaCatalogProfile): Catalog<T, F> {
  if (profile === 'full') {
    return baseCatalog;
  }
  const allowed = new Set<string>(LUMINA_PROFILE_COMPONENTS[profile]);
  const components = Array.from(baseCatalog.components.values()).filter((c) =>
    allowed.has(c.name),
  );
  const functions = Array.from(baseCatalog.functions.values());
  return new Catalog<T, F>(
    baseCatalog.id,
    baseCatalog.protocolVersion,
    components,
    functions,
    LUMINA_CATALOG_DOCUMENT_OPTIONS,
  );
}

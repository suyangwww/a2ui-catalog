import type React from 'react';
import type { z } from 'zod';
import { Catalog, type ComponentApi, type FunctionImplementation } from '@a2ui/web_core';
import {
  LUMINA_PROTOCOL_VERSION,
  LUMINA_V1_CATALOG_ID,
  type CatalogComponentDescriptor,
  type CatalogFunctionSliceDescriptor,
} from '../protocol/index.js';
import { LUMINA_CATALOG_DOCUMENT_OPTIONS } from './instructions.js';

// Layout & Containers (10)
import { rowComponent } from '../components/row/index.js';
import { columnComponent } from '../components/column/index.js';
import { gridComponent } from '../components/grid/index.js';
import { listComponent } from '../components/list/index.js';
import { carouselComponent } from '../components/carousel/index.js';
import { cardComponent } from '../components/card/index.js';
import { tabsComponent } from '../components/tabs/index.js';
import { accordionComponent } from '../components/accordion/index.js';
import { modalComponent } from '../components/modal/index.js';
import { dividerComponent } from '../components/divider/index.js';

// Content & Media (9)
import { textComponent } from '../components/text/index.js';
import { imageComponent } from '../components/image/index.js';
import { iconComponent } from '../components/icon/index.js';
import { avatarComponent } from '../components/avatar/index.js';
import { statusBadgeComponent } from '../components/status-badge/index.js';
import { videoComponent } from '../components/video/index.js';
import { audioPlayerComponent } from '../components/audio-player/index.js';
import { annotatedDiagramComponent } from '../components/annotated-diagram/index.js';
import { routeMapComponent } from '../components/route-map/index.js';

// Interactive Inputs (10)
import { buttonComponent } from '../components/button/index.js';
import { textFieldComponent } from '../components/text-field/index.js';
import { checkBoxComponent } from '../components/check-box/index.js';
import { switchComponent } from '../components/switch/index.js';
import { segmentedControlComponent } from '../components/segmented-control/index.js';
import { choicePickerComponent } from '../components/choice-picker/index.js';
import { sliderComponent } from '../components/slider/index.js';
import { stepperInputComponent } from '../components/stepper-input/index.js';
import { dateTimeInputComponent } from '../components/date-time-input/index.js';
import { swatchPickerComponent } from '../components/swatch-picker/index.js';

// Agentic Reasoning & Execution (5)
import { thoughtTraceComponent } from '../components/thought-trace/index.js';
import { stepTimelineComponent } from '../components/step-timeline/index.js';
import { approvalCardComponent } from '../components/approval-card/index.js';
import { progressIndicatorComponent } from '../components/progress-indicator/index.js';
import { checklistCardComponent } from '../components/checklist-card/index.js';

// Grounding, Code & Artifacts (6)
import { sourceListComponent } from '../components/source-list/index.js';
import { codeBlockComponent } from '../components/code-block/index.js';
import { diffViewerComponent } from '../components/diff-viewer/index.js';
import { artifactCardComponent } from '../components/artifact-card/index.js';
import { calloutComponent } from '../components/callout/index.js';
import { microAppComponent } from '../components/micro-app/index.js';

// Structured Data & Intelligence (9)
import { statMetricComponent } from '../components/stat-metric/index.js';
import { chartComponent } from '../components/chart/index.js';
import { dataTableComponent } from '../components/data-table/index.js';
import { keyValueListComponent } from '../components/key-value-list/index.js';
import { comparisonMatrixComponent } from '../components/comparison-matrix/index.js';
import { followUpSuggestionsComponent } from '../components/follow-up-suggestions/index.js';
import { proportionBarComponent } from '../components/proportion-bar/index.js';
import { quizCardComponent } from '../components/quiz-card/index.js';
import { splitLedgerComponent } from '../components/split-ledger/index.js';

// Function Slices (9)
import { basicV1FunctionsSlice } from '../functions/basic-v1/index.js';
import {
  FormatCompactNumberApi,
  FormatCompactNumberImplementation,
  formatCompactNumberSlice,
} from '../functions/format-compact-number/index.js';
import {
  FormatPercentApi,
  FormatPercentImplementation,
  formatPercentSlice,
} from '../functions/format-percent/index.js';
import {
  FormatRelativeTimeApi,
  FormatRelativeTimeImplementation,
  formatRelativeTimeSlice,
} from '../functions/format-relative-time/index.js';
import {
  CopyToClipboardApi,
  CopyToClipboardImplementation,
  copyToClipboardSlice,
} from '../functions/copy-to-clipboard/index.js';
import {
  ShareContentApi,
  ShareContentImplementation,
  shareContentSlice,
} from '../functions/share-content/index.js';
import {
  SetValueApi,
  SetValueImplementation,
  setValueSlice,
} from '../functions/set-value/index.js';
import {
  CompoundGrowthApi,
  CompoundGrowthImplementation,
  ComputeMathApi,
  ComputeMathImplementation,
  computeMathSlice,
} from '../functions/compute-math/index.js';
import {
  SampleDistributionApi,
  SampleDistributionImplementation,
  SelectByValueApi,
  SelectByValueImplementation,
  selectByValueSlice,
} from '../functions/select-by-value/index.js';

export type AnyComponentSlice = CatalogComponentDescriptor<
  z.ZodObject<z.ZodRawShape>,
  React.ReactNode
>;

export const ALL_COMPONENT_SLICES: readonly AnyComponentSlice[] = [
  rowComponent,
  columnComponent,
  gridComponent,
  listComponent,
  carouselComponent,
  cardComponent,
  tabsComponent,
  accordionComponent,
  modalComponent,
  dividerComponent,
  textComponent,
  imageComponent,
  iconComponent,
  avatarComponent,
  statusBadgeComponent,
  videoComponent,
  audioPlayerComponent,
  annotatedDiagramComponent,
  routeMapComponent,
  buttonComponent,
  textFieldComponent,
  checkBoxComponent,
  switchComponent,
  segmentedControlComponent,
  choicePickerComponent,
  sliderComponent,
  stepperInputComponent,
  dateTimeInputComponent,
  swatchPickerComponent,
  thoughtTraceComponent,
  stepTimelineComponent,
  approvalCardComponent,
  progressIndicatorComponent,
  checklistCardComponent,
  sourceListComponent,
  codeBlockComponent,
  diffViewerComponent,
  artifactCardComponent,
  calloutComponent,
  microAppComponent,
  statMetricComponent,
  chartComponent,
  dataTableComponent,
  keyValueListComponent,
  comparisonMatrixComponent,
  followUpSuggestionsComponent,
  proportionBarComponent,
  quizCardComponent,
  splitLedgerComponent,
];

export const ALL_FUNCTION_SLICES: readonly CatalogFunctionSliceDescriptor[] = [
  basicV1FunctionsSlice,
  formatCompactNumberSlice,
  formatPercentSlice,
  formatRelativeTimeSlice,
  copyToClipboardSlice,
  shareContentSlice,
  setValueSlice,
  computeMathSlice,
  selectByValueSlice,
];

const componentsBySlug = new Map<string, AnyComponentSlice>(
  ALL_COMPONENT_SLICES.map((slice) => [slice.slug, slice]),
);

const componentsById = new Map<string, AnyComponentSlice>(
  ALL_COMPONENT_SLICES.map((slice) => [slice.id, slice]),
);

export const LUMINA_COMPONENT_APIS: readonly ComponentApi[] = ALL_COMPONENT_SLICES.map(
  (s) => s.api,
);

export const LUMINA_CUSTOM_FUNCTIONS: readonly FunctionImplementation[] = [
  FormatCompactNumberImplementation,
  FormatPercentImplementation,
  FormatRelativeTimeImplementation,
  CopyToClipboardImplementation,
  ShareContentImplementation,
  SetValueImplementation,
  ComputeMathImplementation,
  CompoundGrowthImplementation,
  SelectByValueImplementation,
  SampleDistributionImplementation,
];

export const LUMINA_FUNCTIONS: readonly FunctionImplementation[] = ALL_FUNCTION_SLICES.flatMap(
  (s) => s.implementations,
);

export const luminaCoreCatalog = new Catalog<ComponentApi, FunctionImplementation>(
  LUMINA_V1_CATALOG_ID,
  LUMINA_PROTOCOL_VERSION,
  [...LUMINA_COMPONENT_APIS],
  [...LUMINA_FUNCTIONS],
  LUMINA_CATALOG_DOCUMENT_OPTIONS,
);

export const catalogRegistry = {
  listComponents(): readonly AnyComponentSlice[] {
    return ALL_COMPONENT_SLICES;
  },
  listComponentSlugs(): string[] {
    return ALL_COMPONENT_SLICES.map((s) => s.slug);
  },
  getComponentBySlug(slug: string): AnyComponentSlice | undefined {
    return componentsBySlug.get(slug);
  },
  getComponentById(id: string): AnyComponentSlice | undefined {
    return componentsById.get(id);
  },
  listFunctionSlices(): readonly CatalogFunctionSliceDescriptor[] {
    return ALL_FUNCTION_SLICES;
  },
  listFunctionSlugs(): string[] {
    return ALL_FUNCTION_SLICES.map((s) => s.slug);
  },
  listFunctions(): readonly FunctionImplementation[] {
    return LUMINA_FUNCTIONS;
  },
};

export {
  CompoundGrowthApi,
  CompoundGrowthImplementation,
  ComputeMathApi,
  ComputeMathImplementation,
  CopyToClipboardApi,
  CopyToClipboardImplementation,
  FormatCompactNumberApi,
  FormatCompactNumberImplementation,
  FormatPercentApi,
  FormatPercentImplementation,
  FormatRelativeTimeApi,
  FormatRelativeTimeImplementation,
  SampleDistributionApi,
  SampleDistributionImplementation,
  SelectByValueApi,
  SelectByValueImplementation,
  SetValueApi,
  SetValueImplementation,
  ShareContentApi,
  ShareContentImplementation,
};

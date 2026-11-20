import { Catalog, type ComponentApi, type FunctionImplementation } from '@a2ui/web_core';
import {
  LUMINA_PROTOCOL_VERSION,
  LUMINA_V1_CATALOG_ID,
} from '../../../src/protocol/index.js';
import { LUMINA_CATALOG_DOCUMENT_OPTIONS } from '../../../src/catalog/instructions.js';

export * from '../../../src/protocol/index.js';
export {
  LUMINA_CATALOG_DOCUMENT_OPTIONS,
  LUMINA_INSTRUCTIONS,
  createLuminaCatalogSlice,
} from '../../../src/catalog/instructions.js';

// Functions (Framework-free Layer 1B)
import { basicV1FunctionsSlice } from '../../../src/functions/basic-v1/index.js';
import {
  FormatCompactNumberApi,
  FormatCompactNumberImplementation,
} from '../../../src/functions/format-compact-number/index.js';
import {
  FormatPercentApi,
  FormatPercentImplementation,
} from '../../../src/functions/format-percent/index.js';
import {
  FormatRelativeTimeApi,
  FormatRelativeTimeImplementation,
} from '../../../src/functions/format-relative-time/index.js';
import {
  CopyToClipboardApi,
  CopyToClipboardImplementation,
} from '../../../src/functions/copy-to-clipboard/index.js';
import {
  ShareContentApi,
  ShareContentImplementation,
} from '../../../src/functions/share-content/index.js';
import {
  SetValueApi,
  SetValueImplementation,
} from '../../../src/functions/set-value/index.js';
import {
  CompoundGrowthApi,
  CompoundGrowthImplementation,
  ComputeMathApi,
  ComputeMathImplementation,
} from '../../../src/functions/compute-math/index.js';
import {
  SampleDistributionApi,
  SampleDistributionImplementation,
  SelectByValueApi,
  SelectByValueImplementation,
} from '../../../src/functions/select-by-value/index.js';

// Component Schemas (Framework-free Layer 1A schema modules — zero React imports)
import { RowApi } from '../../../src/components/row/schema.js';
import { ColumnApi } from '../../../src/components/column/schema.js';
import { GridApi } from '../../../src/components/grid/schema.js';
import { ListApi } from '../../../src/components/list/schema.js';
import { CarouselApi } from '../../../src/components/carousel/schema.js';
import { CardApi } from '../../../src/components/card/schema.js';
import { TabsApi } from '../../../src/components/tabs/schema.js';
import { AccordionApi } from '../../../src/components/accordion/schema.js';
import { ModalApi } from '../../../src/components/modal/schema.js';
import { DividerApi } from '../../../src/components/divider/schema.js';

import { TextApi } from '../../../src/components/text/schema.js';
import { ImageApi } from '../../../src/components/image/schema.js';
import { IconApi } from '../../../src/components/icon/schema.js';
import { AvatarApi } from '../../../src/components/avatar/schema.js';
import { StatusBadgeApi } from '../../../src/components/status-badge/schema.js';
import { VideoApi } from '../../../src/components/video/schema.js';
import { AudioPlayerApi } from '../../../src/components/audio-player/schema.js';
import { AnnotatedDiagramApi } from '../../../src/components/annotated-diagram/schema.js';
import { RouteMapApi } from '../../../src/components/route-map/schema.js';

import { ButtonApi } from '../../../src/components/button/schema.js';
import { TextFieldApi } from '../../../src/components/text-field/schema.js';
import { CheckBoxApi } from '../../../src/components/check-box/schema.js';
import { SwitchApi } from '../../../src/components/switch/schema.js';
import { SegmentedControlApi } from '../../../src/components/segmented-control/schema.js';
import { ChoicePickerApi } from '../../../src/components/choice-picker/schema.js';
import { SliderApi } from '../../../src/components/slider/schema.js';
import { StepperInputApi } from '../../../src/components/stepper-input/schema.js';
import { DateTimeInputApi } from '../../../src/components/date-time-input/schema.js';
import { SwatchPickerApi } from '../../../src/components/swatch-picker/schema.js';

import { ThoughtTraceApi } from '../../../src/components/thought-trace/schema.js';
import { StepTimelineApi } from '../../../src/components/step-timeline/schema.js';
import { ApprovalCardApi } from '../../../src/components/approval-card/schema.js';
import { ProgressIndicatorApi } from '../../../src/components/progress-indicator/schema.js';
import { ChecklistCardApi } from '../../../src/components/checklist-card/schema.js';

import { SourceListApi } from '../../../src/components/source-list/schema.js';
import { CodeBlockApi } from '../../../src/components/code-block/schema.js';
import { DiffViewerApi } from '../../../src/components/diff-viewer/schema.js';
import { ArtifactCardApi } from '../../../src/components/artifact-card/schema.js';
import { CalloutApi } from '../../../src/components/callout/schema.js';
import { MicroAppApi } from '../../../src/components/micro-app/schema.js';

import { StatMetricApi } from '../../../src/components/stat-metric/schema.js';
import { ChartApi } from '../../../src/components/chart/schema.js';
import { DataTableApi } from '../../../src/components/data-table/schema.js';
import { KeyValueListApi } from '../../../src/components/key-value-list/schema.js';
import { ComparisonMatrixApi } from '../../../src/components/comparison-matrix/schema.js';
import { FollowUpSuggestionsApi } from '../../../src/components/follow-up-suggestions/schema.js';
import { ProportionBarApi } from '../../../src/components/proportion-bar/schema.js';
import { QuizCardApi } from '../../../src/components/quiz-card/schema.js';
import { SplitLedgerApi } from '../../../src/components/split-ledger/schema.js';

export const LAYOUT_COMPONENT_APIS = [
  RowApi,
  ColumnApi,
  GridApi,
  ListApi,
  CarouselApi,
  CardApi,
  TabsApi,
  AccordionApi,
  ModalApi,
  DividerApi,
] as const;

export const MEDIA_COMPONENT_APIS = [
  TextApi,
  ImageApi,
  IconApi,
  AvatarApi,
  StatusBadgeApi,
  VideoApi,
  AudioPlayerApi,
  AnnotatedDiagramApi,
  RouteMapApi,
] as const;

export const INPUT_COMPONENT_APIS = [
  ButtonApi,
  TextFieldApi,
  CheckBoxApi,
  SwitchApi,
  SegmentedControlApi,
  ChoicePickerApi,
  SliderApi,
  StepperInputApi,
  DateTimeInputApi,
  SwatchPickerApi,
] as const;

export const REASONING_COMPONENT_APIS = [
  ThoughtTraceApi,
  StepTimelineApi,
  ApprovalCardApi,
  ProgressIndicatorApi,
  ChecklistCardApi,
] as const;

export const GROUNDING_COMPONENT_APIS = [
  SourceListApi,
  CodeBlockApi,
  DiffViewerApi,
  ArtifactCardApi,
  CalloutApi,
  MicroAppApi,
] as const;

export const DATA_COMPONENT_APIS = [
  StatMetricApi,
  ChartApi,
  DataTableApi,
  KeyValueListApi,
  ComparisonMatrixApi,
  FollowUpSuggestionsApi,
  ProportionBarApi,
  QuizCardApi,
  SplitLedgerApi,
] as const;

export const LUMINA_COMPONENT_APIS = [
  ...LAYOUT_COMPONENT_APIS,
  ...MEDIA_COMPONENT_APIS,
  ...INPUT_COMPONENT_APIS,
  ...REASONING_COMPONENT_APIS,
  ...GROUNDING_COMPONENT_APIS,
  ...DATA_COMPONENT_APIS,
] as const;

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

export const LUMINA_FUNCTIONS: readonly FunctionImplementation[] = [
  ...basicV1FunctionsSlice.implementations,
  ...LUMINA_CUSTOM_FUNCTIONS,
];

export const luminaCoreCatalog = new Catalog<ComponentApi, FunctionImplementation>(
  LUMINA_V1_CATALOG_ID,
  LUMINA_PROTOCOL_VERSION,
  [...LUMINA_COMPONENT_APIS],
  [...LUMINA_FUNCTIONS],
  LUMINA_CATALOG_DOCUMENT_OPTIONS,
);

export {
  AccordionApi,
  AnnotatedDiagramApi,
  ApprovalCardApi,
  ArtifactCardApi,
  AudioPlayerApi,
  AvatarApi,
  ButtonApi,
  CalloutApi,
  CardApi,
  CarouselApi,
  ChartApi,
  CheckBoxApi,
  ChecklistCardApi,
  ChoicePickerApi,
  CodeBlockApi,
  ColumnApi,
  ComparisonMatrixApi,
  CompoundGrowthApi,
  CompoundGrowthImplementation,
  ComputeMathApi,
  ComputeMathImplementation,
  CopyToClipboardApi,
  CopyToClipboardImplementation,
  DataTableApi,
  DateTimeInputApi,
  DiffViewerApi,
  DividerApi,
  FollowUpSuggestionsApi,
  FormatCompactNumberApi,
  FormatCompactNumberImplementation,
  FormatPercentApi,
  FormatPercentImplementation,
  FormatRelativeTimeApi,
  FormatRelativeTimeImplementation,
  GridApi,
  IconApi,
  ImageApi,
  KeyValueListApi,
  ListApi,
  MicroAppApi,
  ModalApi,
  ProgressIndicatorApi,
  ProportionBarApi,
  QuizCardApi,
  RouteMapApi,
  RowApi,
  SampleDistributionApi,
  SampleDistributionImplementation,
  SegmentedControlApi,
  SelectByValueApi,
  SelectByValueImplementation,
  SetValueApi,
  SetValueImplementation,
  ShareContentApi,
  ShareContentImplementation,
  SliderApi,
  SourceListApi,
  SplitLedgerApi,
  StatMetricApi,
  StatusBadgeApi,
  StepTimelineApi,
  StepperInputApi,
  SwatchPickerApi,
  SwitchApi,
  TabsApi,
  TextApi,
  TextFieldApi,
  ThoughtTraceApi,
  VideoApi,
};

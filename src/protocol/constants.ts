export const LUMINA_V1_CATALOG_ID =
  'https://wsyang0309.github.io/a2ui-catalog/specification/v1_0/lumina/catalog.json';

export const BASIC_V1_CATALOG_ID =
  'https://a2ui.org/specification/v1_0/catalogs/basic/catalog.json';

export const LUMINA_PROTOCOL_VERSION = '1.0' as const;

export type LuminaCatalogProfile =
  | 'full'
  | 'core'
  | 'research'
  | 'commerce'
  | 'devops'
  | 'analytics';

export const LUMINA_PROFILE_COMPONENTS: Record<
  Exclude<LuminaCatalogProfile, 'full'>,
  readonly string[]
> = {
  core: [
    'Row', 'Column', 'Grid', 'List', 'Card', 'Tabs', 'Accordion', 'Modal', 'Divider',
    'Text', 'Image', 'Icon', 'Avatar', 'StatusBadge',
    'Button', 'TextField', 'CheckBox', 'Switch', 'SegmentedControl', 'ChoicePicker', 'Slider', 'StepperInput', 'DateTimeInput', 'SwatchPicker',
    'ChecklistCard', 'Callout', 'KeyValueList', 'ProportionBar', 'QuizCard', 'FollowUpSuggestions',
  ],
  research: [
    'Row', 'Column', 'Grid', 'List', 'Card', 'Tabs', 'Accordion', 'Modal', 'Divider',
    'Text', 'Image', 'Icon', 'StatusBadge', 'AnnotatedDiagram', 'RouteMap', 'Button', 'Slider', 'SegmentedControl',
    'ThoughtTrace', 'StepTimeline', 'ProgressIndicator', 'ChecklistCard',
    'SourceList', 'ArtifactCard', 'Callout', 'MicroApp',
    'StatMetric', 'Chart', 'DataTable', 'KeyValueList', 'ComparisonMatrix', 'ProportionBar', 'QuizCard', 'FollowUpSuggestions',
  ],
  commerce: [
    'Row', 'Column', 'Grid', 'List', 'Carousel', 'Card', 'Tabs', 'Accordion', 'Modal', 'Divider',
    'Text', 'Image', 'Icon', 'Avatar', 'StatusBadge', 'RouteMap',
    'Button', 'TextField', 'CheckBox', 'Switch', 'SegmentedControl', 'ChoicePicker', 'Slider', 'StepperInput', 'DateTimeInput', 'SwatchPicker',
    'ThoughtTrace', 'StepTimeline', 'ApprovalCard', 'ChecklistCard', 'ArtifactCard', 'Callout',
    'StatMetric', 'KeyValueList', 'ComparisonMatrix', 'ProportionBar', 'SplitLedger', 'FollowUpSuggestions',
  ],
  devops: [
    'Row', 'Column', 'Grid', 'List', 'Card', 'Tabs', 'Accordion', 'Modal', 'Divider',
    'Text', 'Icon', 'Avatar', 'StatusBadge', 'AnnotatedDiagram',
    'Button', 'TextField', 'CheckBox', 'Switch', 'SegmentedControl',
    'ThoughtTrace', 'StepTimeline', 'ApprovalCard', 'ProgressIndicator', 'ChecklistCard',
    'CodeBlock', 'DiffViewer', 'ArtifactCard', 'Callout', 'MicroApp',
    'StatMetric', 'Chart', 'DataTable', 'KeyValueList', 'ProportionBar', 'FollowUpSuggestions',
  ],
  analytics: [
    'Row', 'Column', 'Grid', 'List', 'Card', 'Tabs', 'Modal', 'Divider',
    'Text', 'Icon', 'StatusBadge', 'AnnotatedDiagram',
    'Button', 'Switch', 'SegmentedControl', 'ChoicePicker', 'Slider', 'DateTimeInput',
    'ProgressIndicator', 'ArtifactCard', 'Callout',
    'StatMetric', 'Chart', 'DataTable', 'KeyValueList', 'ComparisonMatrix', 'ProportionBar', 'QuizCard', 'FollowUpSuggestions',
  ],
};

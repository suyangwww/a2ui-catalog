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
    'Button', 'TextField', 'CheckBox', 'Switch', 'SegmentedControl', 'ChoicePicker', 'Slider', 'StepperInput', 'DateTimeInput',
    'Callout', 'KeyValueList', 'FollowUpSuggestions',
  ],
  research: [
    'Row', 'Column', 'Grid', 'List', 'Card', 'Tabs', 'Accordion', 'Modal', 'Divider',
    'Text', 'Image', 'Icon', 'StatusBadge', 'Button', 'Slider', 'SegmentedControl',
    'ThoughtTrace', 'StepTimeline', 'ProgressIndicator',
    'SourceList', 'ArtifactCard', 'Callout',
    'StatMetric', 'Chart', 'DataTable', 'KeyValueList', 'ComparisonMatrix', 'FollowUpSuggestions',
  ],
  commerce: [
    'Row', 'Column', 'Grid', 'List', 'Carousel', 'Card', 'Tabs', 'Accordion', 'Modal', 'Divider',
    'Text', 'Image', 'Icon', 'Avatar', 'StatusBadge',
    'Button', 'TextField', 'CheckBox', 'Switch', 'SegmentedControl', 'ChoicePicker', 'Slider', 'StepperInput', 'DateTimeInput',
    'ThoughtTrace', 'StepTimeline', 'ApprovalCard', 'ArtifactCard', 'Callout',
    'StatMetric', 'KeyValueList', 'ComparisonMatrix', 'FollowUpSuggestions',
  ],
  devops: [
    'Row', 'Column', 'Grid', 'List', 'Card', 'Tabs', 'Accordion', 'Modal', 'Divider',
    'Text', 'Icon', 'Avatar', 'StatusBadge',
    'Button', 'TextField', 'CheckBox', 'Switch', 'SegmentedControl',
    'ThoughtTrace', 'StepTimeline', 'ApprovalCard', 'ProgressIndicator',
    'CodeBlock', 'DiffViewer', 'ArtifactCard', 'Callout',
    'StatMetric', 'Chart', 'DataTable', 'KeyValueList', 'FollowUpSuggestions',
  ],
  analytics: [
    'Row', 'Column', 'Grid', 'List', 'Card', 'Tabs', 'Modal', 'Divider',
    'Text', 'Icon', 'StatusBadge',
    'Button', 'Switch', 'SegmentedControl', 'ChoicePicker', 'Slider', 'DateTimeInput',
    'ProgressIndicator', 'ArtifactCard', 'Callout',
    'StatMetric', 'Chart', 'DataTable', 'KeyValueList', 'ComparisonMatrix', 'FollowUpSuggestions',
  ],
};

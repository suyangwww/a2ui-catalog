import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  SEGMENTED_CONTROL_ALLOWED_CHILDREN,
  SegmentedControlApi,
  SegmentedControlPropsSchema,
  type SegmentedControlProps,
} from './schema.js';
import { SegmentedControlRenderer } from './renderer.js';

export const segmentedControlComponent = defineCatalogComponent<typeof SegmentedControlPropsSchema, React.ReactNode>({
  id: 'SegmentedControl',
  slug: 'segmented-control',
  group: 'Buttons & Form Inputs',
  api: SegmentedControlApi,
  propsSchema: SegmentedControlPropsSchema,
  allowedChildren: SEGMENTED_CONTROL_ALLOWED_CHILDREN,
  renderer: SegmentedControlRenderer,
});

export { SegmentedControlApi, type SegmentedControlProps };

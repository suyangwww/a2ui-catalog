import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  PROGRESS_INDICATOR_ALLOWED_CHILDREN,
  ProgressIndicatorApi,
  ProgressIndicatorPropsSchema,
  type ProgressIndicatorProps,
} from './schema.js';
import { ProgressIndicatorRenderer } from './renderer.js';

export const progressIndicatorComponent = defineCatalogComponent<typeof ProgressIndicatorPropsSchema, React.ReactNode>({
  id: 'ProgressIndicator',
  slug: 'progress-indicator',
  group: 'Agent Thinking & Approvals',
  api: ProgressIndicatorApi,
  propsSchema: ProgressIndicatorPropsSchema,
  allowedChildren: PROGRESS_INDICATOR_ALLOWED_CHILDREN,
  renderer: ProgressIndicatorRenderer,
});

export { ProgressIndicatorApi, type ProgressIndicatorProps };

import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  CALLOUT_ALLOWED_CHILDREN,
  CalloutApi,
  CalloutPropsSchema,
  type CalloutProps,
} from './schema.js';
import { CalloutRenderer } from './renderer.js';

export const calloutComponent = defineCatalogComponent<typeof CalloutPropsSchema, React.ReactNode>({
  id: 'Callout',
  slug: 'callout',
  group: 'Sources, Code & Documents',
  api: CalloutApi,
  propsSchema: CalloutPropsSchema,
  allowedChildren: CALLOUT_ALLOWED_CHILDREN,
  renderer: CalloutRenderer,
});

export { CalloutApi, type CalloutProps };

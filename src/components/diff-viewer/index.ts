import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  DIFF_VIEWER_ALLOWED_CHILDREN,
  DiffViewerApi,
  DiffViewerPropsSchema,
  type DiffViewerProps,
} from './schema.js';
import { DiffViewerRenderer } from './renderer.js';

export const diffViewerComponent = defineCatalogComponent<typeof DiffViewerPropsSchema, React.ReactNode>({
  id: 'DiffViewer',
  slug: 'diff-viewer',
  group: 'Sources, Code & Documents',
  api: DiffViewerApi,
  propsSchema: DiffViewerPropsSchema,
  allowedChildren: DIFF_VIEWER_ALLOWED_CHILDREN,
  renderer: DiffViewerRenderer,
});

export { DiffViewerApi, type DiffViewerProps };

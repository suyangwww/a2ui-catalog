import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  GRID_ALLOWED_CHILDREN,
  GridApi,
  GridPropsSchema,
  type GridProps,
} from './schema.js';
import { GridRenderer } from './renderer.js';

export const gridComponent = defineCatalogComponent<typeof GridPropsSchema, React.ReactNode>({
  id: 'Grid',
  slug: 'grid',
  group: 'Layout & Containers',
  api: GridApi,
  propsSchema: GridPropsSchema,
  allowedChildren: GRID_ALLOWED_CHILDREN,
  renderer: GridRenderer,
});

export { GridApi, type GridProps };

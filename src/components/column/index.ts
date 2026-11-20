import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  COLUMN_ALLOWED_CHILDREN,
  ColumnApi,
  ColumnPropsSchema,
  type ColumnProps,
} from './schema.js';
import { ColumnRenderer } from './renderer.js';

export const columnComponent = defineCatalogComponent<typeof ColumnPropsSchema, React.ReactNode>({
  id: 'Column',
  slug: 'column',
  group: 'Layout & Containers',
  api: ColumnApi,
  propsSchema: ColumnPropsSchema,
  allowedChildren: COLUMN_ALLOWED_CHILDREN,
  renderer: ColumnRenderer,
});

export { ColumnApi, type ColumnProps };

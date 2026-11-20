import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  DATA_TABLE_ALLOWED_CHILDREN,
  DataTableApi,
  DataTablePropsSchema,
  type DataTableProps,
} from './schema.js';
import { DataTableRenderer } from './renderer.js';

export const dataTableComponent = defineCatalogComponent<typeof DataTablePropsSchema, React.ReactNode>({
  id: 'DataTable',
  slug: 'data-table',
  group: 'Numbers, Charts & Next Steps',
  api: DataTableApi,
  propsSchema: DataTablePropsSchema,
  allowedChildren: DATA_TABLE_ALLOWED_CHILDREN,
  renderer: DataTableRenderer,
});

export { DataTableApi, type DataTableProps };

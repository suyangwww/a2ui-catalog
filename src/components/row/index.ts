import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  ROW_ALLOWED_CHILDREN,
  RowApi,
  RowPropsSchema,
  type RowProps,
} from './schema.js';
import { RowRenderer } from './renderer.js';

export const rowComponent = defineCatalogComponent<typeof RowPropsSchema, React.ReactNode>({
  id: 'Row',
  slug: 'row',
  group: 'Layout & Containers',
  api: RowApi,
  propsSchema: RowPropsSchema,
  allowedChildren: ROW_ALLOWED_CHILDREN,
  renderer: RowRenderer,
});

export { RowApi, type RowProps };

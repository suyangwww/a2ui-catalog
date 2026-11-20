import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  LIST_ALLOWED_CHILDREN,
  ListApi,
  ListPropsSchema,
  type ListProps,
} from './schema.js';
import { ListRenderer } from './renderer.js';

export const listComponent = defineCatalogComponent<typeof ListPropsSchema, React.ReactNode>({
  id: 'List',
  slug: 'list',
  group: 'Layout & Containers',
  api: ListApi,
  propsSchema: ListPropsSchema,
  allowedChildren: LIST_ALLOWED_CHILDREN,
  renderer: ListRenderer,
});

export { ListApi, type ListProps };

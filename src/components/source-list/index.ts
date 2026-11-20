import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  SOURCE_LIST_ALLOWED_CHILDREN,
  SourceListApi,
  SourceListPropsSchema,
  type SourceListProps,
} from './schema.js';
import { SourceListRenderer } from './renderer.js';

export const sourceListComponent = defineCatalogComponent<typeof SourceListPropsSchema, React.ReactNode>({
  id: 'SourceList',
  slug: 'source-list',
  group: 'Sources, Code & Documents',
  api: SourceListApi,
  propsSchema: SourceListPropsSchema,
  allowedChildren: SOURCE_LIST_ALLOWED_CHILDREN,
  renderer: SourceListRenderer,
});

export { SourceListApi, type SourceListProps };

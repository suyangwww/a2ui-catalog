import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  KEY_VALUE_LIST_ALLOWED_CHILDREN,
  KeyValueListApi,
  KeyValueListPropsSchema,
  type KeyValueListProps,
} from './schema.js';
import { KeyValueListRenderer } from './renderer.js';

export const keyValueListComponent = defineCatalogComponent<typeof KeyValueListPropsSchema, React.ReactNode>({
  id: 'KeyValueList',
  slug: 'key-value-list',
  group: 'Numbers, Charts & Next Steps',
  api: KeyValueListApi,
  propsSchema: KeyValueListPropsSchema,
  allowedChildren: KEY_VALUE_LIST_ALLOWED_CHILDREN,
  renderer: KeyValueListRenderer,
});

export { KeyValueListApi, type KeyValueListProps };

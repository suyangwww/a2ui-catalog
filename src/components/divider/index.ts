import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  DIVIDER_ALLOWED_CHILDREN,
  DividerApi,
  DividerPropsSchema,
  type DividerProps,
} from './schema.js';
import { DividerRenderer } from './renderer.js';

export const dividerComponent = defineCatalogComponent<typeof DividerPropsSchema, React.ReactNode>({
  id: 'Divider',
  slug: 'divider',
  group: 'Layout & Containers',
  api: DividerApi,
  propsSchema: DividerPropsSchema,
  allowedChildren: DIVIDER_ALLOWED_CHILDREN,
  renderer: DividerRenderer,
});

export { DividerApi, type DividerProps };

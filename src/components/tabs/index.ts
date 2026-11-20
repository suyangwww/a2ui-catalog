import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  TABS_ALLOWED_CHILDREN,
  TabsApi,
  TabsPropsSchema,
  type TabsProps,
} from './schema.js';
import { TabsRenderer } from './renderer.js';

export const tabsComponent = defineCatalogComponent<typeof TabsPropsSchema, React.ReactNode>({
  id: 'Tabs',
  slug: 'tabs',
  group: 'Layout & Containers',
  api: TabsApi,
  propsSchema: TabsPropsSchema,
  allowedChildren: TABS_ALLOWED_CHILDREN,
  renderer: TabsRenderer,
});

export { TabsApi, type TabsProps };

import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  MICRO_APP_ALLOWED_CHILDREN,
  MicroAppApi,
  MicroAppPropsSchema,
  type MicroAppProps,
} from './schema.js';
import { MicroAppRenderer } from './renderer.js';

export const microAppComponent = defineCatalogComponent<
  typeof MicroAppPropsSchema,
  React.ReactNode
>({
  id: 'MicroApp',
  slug: 'micro-app',
  group: 'Sources, Code & Documents',
  api: MicroAppApi,
  propsSchema: MicroAppPropsSchema,
  allowedChildren: MICRO_APP_ALLOWED_CHILDREN,
  renderer: MicroAppRenderer,
});

export { MicroAppApi, type MicroAppProps };

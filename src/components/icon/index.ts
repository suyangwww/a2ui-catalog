import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  ICON_ALLOWED_CHILDREN,
  IconApi,
  IconPropsSchema,
  type IconProps,
} from './schema.js';
import { IconRenderer } from './renderer.js';

export const iconComponent = defineCatalogComponent<typeof IconPropsSchema, React.ReactNode>({
  id: 'Icon',
  slug: 'icon',
  group: 'Text, Media & Identity',
  api: IconApi,
  propsSchema: IconPropsSchema,
  allowedChildren: ICON_ALLOWED_CHILDREN,
  renderer: IconRenderer,
});

export { IconApi, type IconProps };

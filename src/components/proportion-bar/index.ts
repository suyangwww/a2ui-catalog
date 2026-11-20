import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  PROPORTION_BAR_ALLOWED_CHILDREN,
  ProportionBarApi,
  ProportionBarPropsSchema,
  type ProportionBarProps,
} from './schema.js';
import { ProportionBarRenderer } from './renderer.js';

export const proportionBarComponent = defineCatalogComponent<
  typeof ProportionBarPropsSchema,
  React.ReactNode
>({
  id: 'ProportionBar',
  slug: 'proportion-bar',
  group: 'Numbers, Charts & Next Steps',
  api: ProportionBarApi,
  propsSchema: ProportionBarPropsSchema,
  allowedChildren: PROPORTION_BAR_ALLOWED_CHILDREN,
  renderer: ProportionBarRenderer,
});

export { ProportionBarApi, type ProportionBarProps };

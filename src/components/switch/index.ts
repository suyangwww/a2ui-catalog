import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  SWITCH_ALLOWED_CHILDREN,
  SwitchApi,
  SwitchPropsSchema,
  type SwitchProps,
} from './schema.js';
import { SwitchRenderer } from './renderer.js';

export const switchComponent = defineCatalogComponent<typeof SwitchPropsSchema, React.ReactNode>({
  id: 'Switch',
  slug: 'switch',
  group: 'Buttons & Form Inputs',
  api: SwitchApi,
  propsSchema: SwitchPropsSchema,
  allowedChildren: SWITCH_ALLOWED_CHILDREN,
  renderer: SwitchRenderer,
});

export { SwitchApi, type SwitchProps };

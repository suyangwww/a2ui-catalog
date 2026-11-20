import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  BUTTON_ALLOWED_CHILDREN,
  ButtonApi,
  ButtonPropsSchema,
  type ButtonProps,
} from './schema.js';
import { ButtonRenderer } from './renderer.js';

export const buttonComponent = defineCatalogComponent<typeof ButtonPropsSchema, React.ReactNode>({
  id: 'Button',
  slug: 'button',
  group: 'Buttons & Form Inputs',
  api: ButtonApi,
  propsSchema: ButtonPropsSchema,
  allowedChildren: BUTTON_ALLOWED_CHILDREN,
  renderer: ButtonRenderer,
});

export { ButtonApi, type ButtonProps };

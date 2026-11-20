import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  SWATCH_PICKER_ALLOWED_CHILDREN,
  SwatchPickerApi,
  SwatchPickerPropsSchema,
  type SwatchPickerProps,
} from './schema.js';
import { SwatchPickerRenderer } from './renderer.js';

export const swatchPickerComponent = defineCatalogComponent<
  typeof SwatchPickerPropsSchema,
  React.ReactNode
>({
  id: 'SwatchPicker',
  slug: 'swatch-picker',
  group: 'Buttons & Form Inputs',
  api: SwatchPickerApi,
  propsSchema: SwatchPickerPropsSchema,
  allowedChildren: SWATCH_PICKER_ALLOWED_CHILDREN,
  renderer: SwatchPickerRenderer,
});

export { SwatchPickerApi, type SwatchPickerProps };

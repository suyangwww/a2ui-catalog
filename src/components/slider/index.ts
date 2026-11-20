import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  SLIDER_ALLOWED_CHILDREN,
  SliderApi,
  SliderPropsSchema,
  type SliderProps,
} from './schema.js';
import { SliderRenderer } from './renderer.js';

export const sliderComponent = defineCatalogComponent<typeof SliderPropsSchema, React.ReactNode>({
  id: 'Slider',
  slug: 'slider',
  group: 'Buttons & Form Inputs',
  api: SliderApi,
  propsSchema: SliderPropsSchema,
  allowedChildren: SLIDER_ALLOWED_CHILDREN,
  renderer: SliderRenderer,
});

export { SliderApi, type SliderProps };

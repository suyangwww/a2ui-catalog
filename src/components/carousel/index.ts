import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  CAROUSEL_ALLOWED_CHILDREN,
  CarouselApi,
  CarouselPropsSchema,
  type CarouselProps,
} from './schema.js';
import { CarouselRenderer } from './renderer.js';

export const carouselComponent = defineCatalogComponent<typeof CarouselPropsSchema, React.ReactNode>({
  id: 'Carousel',
  slug: 'carousel',
  group: 'Layout & Containers',
  api: CarouselApi,
  propsSchema: CarouselPropsSchema,
  allowedChildren: CAROUSEL_ALLOWED_CHILDREN,
  renderer: CarouselRenderer,
});

export { CarouselApi, type CarouselProps };

import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  IMAGE_ALLOWED_CHILDREN,
  ImageApi,
  ImagePropsSchema,
  type ImageProps,
} from './schema.js';
import { ImageRenderer } from './renderer.js';

export const imageComponent = defineCatalogComponent<typeof ImagePropsSchema, React.ReactNode>({
  id: 'Image',
  slug: 'image',
  group: 'Text, Media & Identity',
  api: ImageApi,
  propsSchema: ImagePropsSchema,
  allowedChildren: IMAGE_ALLOWED_CHILDREN,
  renderer: ImageRenderer,
});

export { ImageApi, type ImageProps };

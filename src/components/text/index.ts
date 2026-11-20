import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  TEXT_ALLOWED_CHILDREN,
  TextApi,
  TextPropsSchema,
  type TextProps,
} from './schema.js';
import { TextRenderer } from './renderer.js';

export const textComponent = defineCatalogComponent<typeof TextPropsSchema, React.ReactNode>({
  id: 'Text',
  slug: 'text',
  group: 'Text, Media & Identity',
  api: TextApi,
  propsSchema: TextPropsSchema,
  allowedChildren: TEXT_ALLOWED_CHILDREN,
  renderer: TextRenderer,
});

export { TextApi, type TextProps };

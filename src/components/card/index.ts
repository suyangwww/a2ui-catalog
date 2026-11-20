import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  CARD_ALLOWED_CHILDREN,
  CardApi,
  CardPropsSchema,
  type CardProps,
} from './schema.js';
import { CardRenderer } from './renderer.js';

export const cardComponent = defineCatalogComponent<typeof CardPropsSchema, React.ReactNode>({
  id: 'Card',
  slug: 'card',
  group: 'Layout & Containers',
  api: CardApi,
  propsSchema: CardPropsSchema,
  allowedChildren: CARD_ALLOWED_CHILDREN,
  renderer: CardRenderer,
});

export { CardApi, type CardProps };

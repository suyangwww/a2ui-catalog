import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  MODAL_ALLOWED_CHILDREN,
  ModalApi,
  ModalPropsSchema,
  type ModalProps,
} from './schema.js';
import { ModalRenderer } from './renderer.js';

export const modalComponent = defineCatalogComponent<typeof ModalPropsSchema, React.ReactNode>({
  id: 'Modal',
  slug: 'modal',
  group: 'Layout & Containers',
  api: ModalApi,
  propsSchema: ModalPropsSchema,
  allowedChildren: MODAL_ALLOWED_CHILDREN,
  renderer: ModalRenderer,
});

export { ModalApi, type ModalProps };

import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  ACCORDION_ALLOWED_CHILDREN,
  AccordionApi,
  AccordionPropsSchema,
  type AccordionProps,
} from './schema.js';
import { AccordionRenderer } from './renderer.js';

export const accordionComponent = defineCatalogComponent<typeof AccordionPropsSchema, React.ReactNode>({
  id: 'Accordion',
  slug: 'accordion',
  group: 'Layout & Containers',
  api: AccordionApi,
  propsSchema: AccordionPropsSchema,
  allowedChildren: ACCORDION_ALLOWED_CHILDREN,
  renderer: AccordionRenderer,
});

export { AccordionApi, type AccordionProps };

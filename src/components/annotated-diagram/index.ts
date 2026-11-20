import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  ANNOTATED_DIAGRAM_ALLOWED_CHILDREN,
  AnnotatedDiagramApi,
  AnnotatedDiagramPropsSchema,
  type AnnotatedDiagramProps,
} from './schema.js';
import { AnnotatedDiagramRenderer } from './renderer.js';

export const annotatedDiagramComponent = defineCatalogComponent<
  typeof AnnotatedDiagramPropsSchema,
  React.ReactNode
>({
  id: 'AnnotatedDiagram',
  slug: 'annotated-diagram',
  group: 'Text, Media & Identity',
  api: AnnotatedDiagramApi,
  propsSchema: AnnotatedDiagramPropsSchema,
  allowedChildren: ANNOTATED_DIAGRAM_ALLOWED_CHILDREN,
  renderer: AnnotatedDiagramRenderer,
});

export { AnnotatedDiagramApi, type AnnotatedDiagramProps };

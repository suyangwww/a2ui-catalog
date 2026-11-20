import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  ARTIFACT_CARD_ALLOWED_CHILDREN,
  ArtifactCardApi,
  ArtifactCardPropsSchema,
  type ArtifactCardProps,
} from './schema.js';
import { ArtifactCardRenderer } from './renderer.js';

export const artifactCardComponent = defineCatalogComponent<typeof ArtifactCardPropsSchema, React.ReactNode>({
  id: 'ArtifactCard',
  slug: 'artifact-card',
  group: 'Sources, Code & Documents',
  api: ArtifactCardApi,
  propsSchema: ArtifactCardPropsSchema,
  allowedChildren: ARTIFACT_CARD_ALLOWED_CHILDREN,
  renderer: ArtifactCardRenderer,
});

export { ArtifactCardApi, type ArtifactCardProps };

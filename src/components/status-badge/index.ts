import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  STATUS_BADGE_ALLOWED_CHILDREN,
  StatusBadgeApi,
  StatusBadgePropsSchema,
  type StatusBadgeProps,
} from './schema.js';
import { StatusBadgeRenderer } from './renderer.js';

export const statusBadgeComponent = defineCatalogComponent<typeof StatusBadgePropsSchema, React.ReactNode>({
  id: 'StatusBadge',
  slug: 'status-badge',
  group: 'Text, Media & Identity',
  api: StatusBadgeApi,
  propsSchema: StatusBadgePropsSchema,
  allowedChildren: STATUS_BADGE_ALLOWED_CHILDREN,
  renderer: StatusBadgeRenderer,
});

export { StatusBadgeApi, type StatusBadgeProps };

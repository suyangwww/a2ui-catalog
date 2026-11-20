import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  ROUTE_MAP_ALLOWED_CHILDREN,
  RouteMapApi,
  RouteMapPropsSchema,
  type RouteMapProps,
} from './schema.js';
import { RouteMapRenderer } from './renderer.js';

export const routeMapComponent = defineCatalogComponent<
  typeof RouteMapPropsSchema,
  React.ReactNode
>({
  id: 'RouteMap',
  slug: 'route-map',
  group: 'Text, Media & Identity',
  api: RouteMapApi,
  propsSchema: RouteMapPropsSchema,
  allowedChildren: ROUTE_MAP_ALLOWED_CHILDREN,
  renderer: RouteMapRenderer,
});

export { RouteMapApi, type RouteMapProps };

import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  CHART_ALLOWED_CHILDREN,
  ChartApi,
  ChartPropsSchema,
  type ChartProps,
} from './schema.js';
import { ChartRenderer } from './renderer.js';

export const chartComponent = defineCatalogComponent<typeof ChartPropsSchema, React.ReactNode>({
  id: 'Chart',
  slug: 'chart',
  group: 'Numbers, Charts & Next Steps',
  api: ChartApi,
  propsSchema: ChartPropsSchema,
  allowedChildren: CHART_ALLOWED_CHILDREN,
  renderer: ChartRenderer,
});

export { ChartApi, type ChartProps };

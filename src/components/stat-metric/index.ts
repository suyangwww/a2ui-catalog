import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  STAT_METRIC_ALLOWED_CHILDREN,
  StatMetricApi,
  StatMetricPropsSchema,
  type StatMetricProps,
} from './schema.js';
import { StatMetricRenderer } from './renderer.js';

export const statMetricComponent = defineCatalogComponent<typeof StatMetricPropsSchema, React.ReactNode>({
  id: 'StatMetric',
  slug: 'stat-metric',
  group: 'Numbers, Charts & Next Steps',
  api: StatMetricApi,
  propsSchema: StatMetricPropsSchema,
  allowedChildren: STAT_METRIC_ALLOWED_CHILDREN,
  renderer: StatMetricRenderer,
});

export { StatMetricApi, type StatMetricProps };

import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, dynString, dynValue, spec } from '../../protocol/index.js';

export const StatMetricPropsSchema = z
  .object({
    label: dynString('KPI metric label.'),
    value: dynString('Formatted KPI display value (supports @path and @call formatters).'),
    delta: dynString('Optional delta badge text (e.g., "+14.2% YoY").').optional(),
    trend: z.enum(['up', 'down', 'flat']).optional(),
    trendSentiment: z.enum(['positive', 'negative', 'neutral']).optional(),
    caption: dynString('Optional supporting footnote.').optional(),
    sparkline: dynValue('Optional numeric array rendered as an inline area sparkline.').optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Big-number KPI metric card with animated counter, trend pill, and optional sparkline.')
  .strict();

export type StatMetricProps = z.infer<typeof StatMetricPropsSchema>;

export const StatMetricApi = {
  name: 'StatMetric',
  schema: spec(StatMetricPropsSchema),
} satisfies ComponentApi;

export const STAT_METRIC_ALLOWED_CHILDREN = 'none' as const;

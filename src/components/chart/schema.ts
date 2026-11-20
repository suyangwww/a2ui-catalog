import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import {
  ChartColorEnum,
  WeightSchema,
  dynString,
  dynValue,
  spec,
} from '../../protocol/index.js';

export const ChartPropsSchema = z
  .object({
    type: z.enum(['line', 'area', 'bar', 'stackedBar', 'donut']),
    data: dynValue('Array of data records (literal array or @path data binding).'),
    xKey: z.string().describe('Record key for x-axis categories/timestamps or donut slice labels.'),
    series: z
      .array(
        spec(
          z.object({
            key: z.string().describe('Numeric field key in each data record.'),
            label: dynString('Human-readable series label.'),
            color: ChartColorEnum.optional(),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .min(1)
      .describe('One or more plotted data series.'),
    title: dynString('Optional chart title.').optional(),
    subtitle: dynString('Optional chart subtitle.').optional(),
    valuePrefix: z.string().optional(),
    valueSuffix: z.string().optional(),
    height: z.number().min(140).max(520).default(240).optional(),
    showLegend: z.boolean().default(true).optional(),
    weight: WeightSchema.optional(),
  })
  .describe(
    'Interactive animated SVG chart with desktop hover crosshair and mobile touch scrubbing.',
  )
  .strict();

export type ChartProps = z.infer<typeof ChartPropsSchema>;

export const ChartApi = {
  name: 'Chart',
  schema: spec(ChartPropsSchema),
} satisfies ComponentApi;

export const CHART_ALLOWED_CHILDREN = 'none' as const;

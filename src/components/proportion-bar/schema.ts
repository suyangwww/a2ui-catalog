import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import {
  ChartColorEnum,
  WeightSchema,
  dynNumber,
  dynString,
  spec,
} from '../../protocol/index.js';

export const ProportionBarPropsSchema = z
  .object({
    title: dynString('Optional breakdown heading.').optional(),
    subtitle: dynString('Optional secondary caption.').optional(),
    variant: z
      .enum(['split', 'stacked', 'inlineLabels'])
      .default('split')
      .describe('Layout style: 2-column split stats, stacked legend, or inline bar labels.')
      .optional(),
    segments: z
      .array(
        spec(
          z.object({
            id: z.string().describe('Stable segment identifier.'),
            label: dynString('Human-readable segment label.'),
            value: dynNumber('Numeric magnitude of this segment.'),
            formattedValue: dynString('Optional pre-formatted display string (e.g., "$180,000").').optional(),
            color: ChartColorEnum.optional(),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .min(1)
      .max(8)
      .describe('Ordered proportional segments.'),
    unitPrefix: z.string().optional(),
    unitSuffix: z.string().optional(),
    decimals: z.number().int().min(0).max(4).default(0).optional(),
    negativeNote: dynString(
      'Optional callout note shown when any segment is negative (e.g., net imports in GDP).',
    ).optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Horizontal proportional allocation bar with swatched tabular legend statistics.')
  .strict();

export type ProportionBarProps = z.infer<typeof ProportionBarPropsSchema>;

export const ProportionBarApi = {
  name: 'ProportionBar',
  schema: spec(ProportionBarPropsSchema),
} satisfies ComponentApi;

export const PROPORTION_BAR_ALLOWED_CHILDREN = 'none' as const;

import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, actionRef, dynString, spec } from '../../protocol/index.js';

export const ComparisonMatrixPropsSchema = z
  .object({
    title: dynString('Optional comparison heading.').optional(),
    criteria: z
      .array(
        spec(
          z.object({
            key: z.string(),
            label: dynString('Criterion row label.'),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .min(1),
    options: z
      .array(
        spec(
          z.object({
            id: z.string(),
            title: dynString('Option title (e.g., "ANA NH 105").'),
            subtitle: dynString('Optional headline price or sublabel.').optional(),
            badge: dynString('Optional recommendation badge (e.g., "Best Value").').optional(),
            recommended: z.boolean().default(false).optional(),
            values: z.record(z.string(), dynString('Cell value for this criterion.')),
            actionLabel: dynString('Optional selection CTA button label.').optional(),
            action: actionRef('Optional selection action for this option.').optional(),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .min(2)
      .max(5),
    weight: WeightSchema.optional(),
  })
  .describe('Side-by-side option evaluator adapting to swipeable snap cards on mobile.')
  .strict();

export type ComparisonMatrixProps = z.infer<typeof ComparisonMatrixPropsSchema>;

export const ComparisonMatrixApi = {
  name: 'ComparisonMatrix',
  schema: spec(ComparisonMatrixPropsSchema),
} satisfies ComponentApi;

export const COMPARISON_MATRIX_ALLOWED_CHILDREN = 'none' as const;

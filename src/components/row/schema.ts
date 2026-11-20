import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { GapEnum, WeightSchema, childListRef, spec } from '../../protocol/index.js';

export const RowPropsSchema = z
  .object({
    children: childListRef('Horizontal child components or template descriptor.'),
    justify: z
      .enum(['start', 'center', 'end', 'spaceBetween', 'spaceAround', 'spaceEvenly', 'stretch'])
      .default('start')
      .optional(),
    align: z.enum(['start', 'center', 'end', 'stretch', 'baseline']).default('center').optional(),
    gap: GapEnum.default('md').optional(),
    wrap: z.boolean().default(false).optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Horizontal flex layout container.')
  .strict();

export type RowProps = z.infer<typeof RowPropsSchema>;

export const RowApi = {
  name: 'Row',
  schema: spec(RowPropsSchema),
} satisfies ComponentApi;

export const ROW_ALLOWED_CHILDREN = 'any' as const;

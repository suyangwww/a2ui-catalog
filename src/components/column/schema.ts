import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { GapEnum, WeightSchema, childListRef, spec } from '../../protocol/index.js';

export const ColumnPropsSchema = z
  .object({
    children: childListRef('Vertical child components or template descriptor.'),
    justify: z
      .enum(['start', 'center', 'end', 'spaceBetween', 'spaceAround', 'spaceEvenly', 'stretch'])
      .default('start')
      .optional(),
    align: z.enum(['start', 'center', 'end', 'stretch']).default('stretch').optional(),
    gap: GapEnum.default('md').optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Vertical flex stack container.')
  .strict();

export type ColumnProps = z.infer<typeof ColumnPropsSchema>;

export const ColumnApi = {
  name: 'Column',
  schema: spec(ColumnPropsSchema),
} satisfies ComponentApi;

export const COLUMN_ALLOWED_CHILDREN = 'any' as const;

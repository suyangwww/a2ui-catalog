import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, dynString, spec } from '../../protocol/index.js';

export const DividerPropsSchema = z
  .object({
    axis: z.enum(['horizontal', 'vertical']).default('horizontal').optional(),
    label: dynString('Optional centered label on a horizontal divider.').optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Optical 1px hairline separator.')
  .strict();

export type DividerProps = z.infer<typeof DividerPropsSchema>;

export const DividerApi = {
  name: 'Divider',
  schema: spec(DividerPropsSchema),
} satisfies ComponentApi;

export const DIVIDER_ALLOWED_CHILDREN = 'none' as const;

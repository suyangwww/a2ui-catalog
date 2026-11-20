import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, childListRef, spec } from '../../protocol/index.js';

export const ListPropsSchema = z
  .object({
    children: childListRef('Ordered list items or TemplateChildList descriptor.'),
    direction: z.enum(['vertical', 'horizontal']).default('vertical').optional(),
    align: z.enum(['start', 'center', 'end', 'stretch']).default('stretch').optional(),
    dividers: z.boolean().default(false).optional(),
    gap: z.enum(['none', 'xs', 'sm', 'md', 'lg']).default('sm').optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Ordered vertical or horizontal collection optimized for dynamic list templates.')
  .strict();

export type ListProps = z.infer<typeof ListPropsSchema>;

export const ListApi = {
  name: 'List',
  schema: spec(ListPropsSchema),
} satisfies ComponentApi;

export const LIST_ALLOWED_CHILDREN = 'any' as const;

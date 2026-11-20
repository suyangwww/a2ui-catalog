import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, childListRef, spec } from '../../protocol/index.js';

export const GridPropsSchema = z
  .object({
    children: childListRef('Child components placed in the responsive 2D bento grid.'),
    columns: z.number().int().min(1).max(6).default(2).optional(),
    minItemWidth: z.number().min(120).max(600).optional(),
    gap: z.enum(['xs', 'sm', 'md', 'lg']).default('md').optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Responsive 2D bento grid for KPI metrics, entity cards, and structured summaries.')
  .strict();

export type GridProps = z.infer<typeof GridPropsSchema>;

export const GridApi = {
  name: 'Grid',
  schema: spec(GridPropsSchema),
} satisfies ComponentApi;

export const GRID_ALLOWED_CHILDREN = 'any' as const;

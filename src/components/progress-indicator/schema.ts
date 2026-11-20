import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, dynNumber, dynString, spec } from '../../protocol/index.js';

export const ProgressIndicatorPropsSchema = z
  .object({
    label: dynString('Progress status label.'),
    value: dynNumber(
      'Determinate completion percentage (0..100). Omit for indeterminate mode.',
    ).optional(),
    sublabel: dynString('Optional secondary progress detail.').optional(),
    variant: z.enum(['bar', 'ring', 'segmented']).default('bar').optional(),
    segments: z.number().int().min(2).max(12).default(4).optional(),
    tone: z.enum(['accent', 'success', 'warning', 'critical']).default('accent').optional(),
    weight: WeightSchema.optional(),
  })
  .describe(
    'Determinate or indeterminate progress bar, circular ring, or segmented step indicator.',
  )
  .strict();

export type ProgressIndicatorProps = z.infer<typeof ProgressIndicatorPropsSchema>;

export const ProgressIndicatorApi = {
  name: 'ProgressIndicator',
  schema: spec(ProgressIndicatorPropsSchema),
} satisfies ComponentApi;

export const PROGRESS_INDICATOR_ALLOWED_CHILDREN = 'none' as const;

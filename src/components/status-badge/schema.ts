import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { ToneEnum, WeightSchema, dynString, spec } from '../../protocol/index.js';

export const StatusBadgePropsSchema = z
  .object({
    label: dynString('Compact status label.'),
    tone: ToneEnum.default('neutral').optional(),
    icon: z.string().optional(),
    pulse: z.boolean().default(false).optional(),
    size: z.enum(['sm', 'md']).default('md').optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Compact semantic status pill with optional live pulsing dot.')
  .strict();

export type StatusBadgeProps = z.infer<typeof StatusBadgePropsSchema>;

export const StatusBadgeApi = {
  name: 'StatusBadge',
  schema: spec(StatusBadgePropsSchema),
} satisfies ComponentApi;

export const STATUS_BADGE_ALLOWED_CHILDREN = 'none' as const;

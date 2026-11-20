import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, actionRef, dynString, spec } from '../../protocol/index.js';

export const SegmentedControlPropsSchema = z
  .object({
    value: dynString('Two-way bound selected segment value.'),
    options: z
      .array(
        spec(
          z.object({
            label: dynString('Segment label.'),
            value: z.string().describe('Stable option value.'),
            icon: z.string().optional(),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .min(2)
      .max(6)
      .describe('Mutually exclusive segments (2 to 6 options).'),
    label: dynString('Optional accessible group label.').optional(),
    fullWidth: z.boolean().default(true).optional(),
    action: actionRef('Optional action dispatched when selection changes.').optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Apple/ChatGPT sliding-pill single-choice selector.')
  .strict();

export type SegmentedControlProps = z.infer<typeof SegmentedControlPropsSchema>;

export const SegmentedControlApi = {
  name: 'SegmentedControl',
  schema: spec(SegmentedControlPropsSchema),
} satisfies ComponentApi;

export const SEGMENTED_CONTROL_ALLOWED_CHILDREN = 'none' as const;

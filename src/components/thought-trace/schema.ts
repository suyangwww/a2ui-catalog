import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, childRef, dynNumber, dynString, spec } from '../../protocol/index.js';

export const ThoughtTracePropsSchema = z
  .object({
    summary: dynString('Concise reasoning header (e.g., "Thought for 6s · Compared 4 carriers").'),
    status: z.enum(['thinking', 'complete']).default('complete').optional(),
    durationSeconds: dynNumber('Optional elapsed reasoning duration in seconds.').optional(),
    steps: z
      .array(
        spec(
          z.object({
            title: dynString('Reasoning step title.'),
            detail: dynString('Optional step notes or findings.').optional(),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .optional(),
    child: childRef('Optional rich body slot inside the expanded reasoning trace.').optional(),
    defaultExpanded: z.boolean().default(false).optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Collapsible agent reasoning summary with metallic shimmer while thinking.')
  .strict();

export type ThoughtTraceProps = z.infer<typeof ThoughtTracePropsSchema>;

export const ThoughtTraceApi = {
  name: 'ThoughtTrace',
  schema: spec(ThoughtTracePropsSchema),
} satisfies ComponentApi;

export const THOUGHT_TRACE_ALLOWED_CHILDREN = 'any' as const;

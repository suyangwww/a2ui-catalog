import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, childRef, dynString, spec } from '../../protocol/index.js';

export const StepTimelinePropsSchema = z
  .object({
    title: dynString('Optional timeline title.').optional(),
    steps: z
      .array(
        spec(
          z.object({
            id: z.string(),
            title: dynString('Step title.'),
            subtitle: dynString('Optional step detail or status note.').optional(),
            status: z.enum(['pending', 'active', 'completed', 'error', 'skipped']),
            timestamp: dynString('Optional elapsed time or schedule label.').optional(),
            icon: z.string().optional(),
            child: childRef('Optional child component nested beneath this step.').optional(),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .min(1)
      .describe('Ordered execution, deployment, or itinerary steps.'),
    weight: WeightSchema.optional(),
  })
  .describe('Structured vertical multi-step workflow and tool execution tracker.')
  .strict();

export type StepTimelineProps = z.infer<typeof StepTimelinePropsSchema>;

export const StepTimelineApi = {
  name: 'StepTimeline',
  schema: spec(StepTimelinePropsSchema),
} satisfies ComponentApi;

export const STEP_TIMELINE_ALLOWED_CHILDREN = 'any' as const;

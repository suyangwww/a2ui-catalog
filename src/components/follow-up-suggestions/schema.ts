import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, actionRef, dynString, spec } from '../../protocol/index.js';

export const FollowUpSuggestionsPropsSchema = z
  .object({
    title: dynString('Optional heading (e.g., "Suggested next steps").').optional(),
    layout: z.enum(['wrap', 'scroll', 'stack']).default('wrap').optional(),
    suggestions: z
      .array(
        spec(
          z.object({
            label: dynString('Concise prompt chip label.'),
            icon: z.string().optional(),
            action: actionRef('Action dispatched when the suggestion pill is tapped.'),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .min(1)
      .max(6),
    weight: WeightSchema.optional(),
  })
  .describe('Conversational next-step prompt pills for effortless turn continuation.')
  .strict();

export type FollowUpSuggestionsProps = z.infer<typeof FollowUpSuggestionsPropsSchema>;

export const FollowUpSuggestionsApi = {
  name: 'FollowUpSuggestions',
  schema: spec(FollowUpSuggestionsPropsSchema),
} satisfies ComponentApi;

export const FOLLOW_UP_SUGGESTIONS_ALLOWED_CHILDREN = 'none' as const;

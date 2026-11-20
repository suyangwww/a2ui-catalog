import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, dynString, spec } from '../../protocol/index.js';

export const QuizCardPropsSchema = z
  .object({
    title: dynString('Optional quiz header title.').optional(),
    subtitle: dynString('Optional quiz context caption.').optional(),
    value: dynString('Optional two-way bound selected option ID for single-question checks.').optional(),
    questions: z
      .array(
        spec(
          z.object({
            id: z.string().describe('Question identifier.'),
            prompt: dynString('Question text.'),
            hint: dynString('Optional progressive hint disclosed on tap.').optional(),
            correctOptionId: z.string().describe('ID of the correct option.'),
            explanation: dynString('Overall explanation revealed after answering.').optional(),
            options: z
              .array(
                spec(
                  z.object({
                    id: z.string().describe('Option identifier (e.g., "a", "b").'),
                    label: dynString('Option text.'),
                    explanation: dynString(
                      'Optional per-option rationale shown beneath this option when selected.',
                    ).optional(),
                  }),
                  { closure: 'additionalProperties' },
                ),
              )
              .min(2)
              .max(6),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .min(1)
      .max(12)
      .describe('One or more interactive comprehension questions.'),
    showScore: z.boolean().default(true).optional(),
    weight: WeightSchema.optional(),
  })
  .describe(
    'Interactive single-question knowledge check or multi-question quiz with instant correctness feedback.',
  )
  .strict();

export type QuizCardProps = z.infer<typeof QuizCardPropsSchema>;

export const QuizCardApi = {
  name: 'QuizCard',
  schema: spec(QuizCardPropsSchema),
} satisfies ComponentApi;

export const QUIZ_CARD_ALLOWED_CHILDREN = 'none' as const;

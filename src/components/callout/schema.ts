import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, actionRef, dynString, spec } from '../../protocol/index.js';

export const CalloutPropsSchema = z
  .object({
    body: dynString('Callout message body (supports sanitized Markdown).'),
    title: dynString('Optional callout heading.').optional(),
    tone: z
      .enum(['neutral', 'info', 'tip', 'success', 'warning', 'critical'])
      .default('info')
      .optional(),
    icon: z.string().optional(),
    actionLabel: dynString('Optional inline CTA label.').optional(),
    action: actionRef('Optional inline CTA action.').optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Tinted semantic insight, warning, or alert banner.')
  .strict();

export type CalloutProps = z.infer<typeof CalloutPropsSchema>;

export const CalloutApi = {
  name: 'Callout',
  schema: spec(CalloutPropsSchema),
} satisfies ComponentApi;

export const CALLOUT_ALLOWED_CHILDREN = 'none' as const;

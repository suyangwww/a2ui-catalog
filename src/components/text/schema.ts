import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, dynString, spec } from '../../protocol/index.js';

export const TextPropsSchema = z
  .object({
    text: dynString('Text or sanitized Markdown prose to display.'),
    variant: z
      .enum(['hero', 'h1', 'h2', 'h3', 'subtitle', 'body', 'caption', 'overline', 'code'])
      .default('body')
      .optional(),
    tone: z
      .enum(['primary', 'secondary', 'tertiary', 'accent', 'success', 'warning', 'critical'])
      .default('primary')
      .optional(),
    align: z.enum(['start', 'center', 'end']).default('start').optional(),
    maxLines: z.number().int().min(1).max(20).optional(),
    tabularNums: z.boolean().default(false).optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Optical typography and sanitized Markdown prose renderer.')
  .strict();

export type TextProps = z.infer<typeof TextPropsSchema>;

export const TextApi = {
  name: 'Text',
  schema: spec(TextPropsSchema),
} satisfies ComponentApi;

export const TEXT_ALLOWED_CHILDREN = 'none' as const;

import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, dynString, spec } from '../../protocol/index.js';

export const SourceListPropsSchema = z
  .object({
    title: dynString('Optional header label (e.g., "Sources (5)").').optional(),
    variant: z.enum(['pills', 'cards', 'compactList']).default('cards').optional(),
    sources: z
      .array(
        spec(
          z.object({
            id: z.string(),
            title: dynString('Source title.'),
            url: dynString('Canonical external URL.'),
            domain: dynString('Optional short domain name; derived from url if omitted.').optional(),
            snippet: dynString('Optional supporting excerpt.').optional(),
            publishedAt: dynString('Optional publication date or relative age.').optional(),
            index: z.number().int().min(1).optional(),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .min(1)
      .describe('Grounded citations and web sources.'),
    weight: WeightSchema.optional(),
  })
  .describe('ChatGPT Search-style grounded citation chips or horizontal source cards.')
  .strict();

export type SourceListProps = z.infer<typeof SourceListPropsSchema>;

export const SourceListApi = {
  name: 'SourceList',
  schema: spec(SourceListPropsSchema),
} satisfies ComponentApi;

export const SOURCE_LIST_ALLOWED_CHILDREN = 'none' as const;

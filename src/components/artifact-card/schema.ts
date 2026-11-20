import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, actionRef, childRef, dynString, spec } from '../../protocol/index.js';

export const ArtifactCardPropsSchema = z
  .object({
    title: dynString('Deliverable title (e.g., "Q3 AI Semiconductor Memo").'),
    subtitle: dynString(
      'Optional metadata caption (e.g., "Updated just now · 1,240 words").',
    ).optional(),
    kind: z
      .enum(['document', 'report', 'code', 'plan', 'itinerary', 'dataset'])
      .default('document')
      .optional(),
    version: dynString('Optional version tag (e.g., "v2").').optional(),
    preview: dynString('Optional short excerpt displayed on the card face.').optional(),
    child: childRef('Optional full artifact body opened in a Canvas drawer or mobile sheet.').optional(),
    action: actionRef('Optional external action dispatched when opened.').optional(),
    weight: WeightSchema.optional(),
  })
  .describe('ChatGPT Canvas-style deliverable card that expands into a focused reader drawer.')
  .strict();

export type ArtifactCardProps = z.infer<typeof ArtifactCardPropsSchema>;

export const ArtifactCardApi = {
  name: 'ArtifactCard',
  schema: spec(ArtifactCardPropsSchema),
} satisfies ComponentApi;

export const ARTIFACT_CARD_ALLOWED_CHILDREN = 'any' as const;

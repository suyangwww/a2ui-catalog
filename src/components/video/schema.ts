import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, dynString, spec } from '../../protocol/index.js';

export const VideoPropsSchema = z
  .object({
    url: dynString('URL of the video resource.'),
    posterUrl: dynString('Optional preview poster image URL.').optional(),
    title: dynString('Optional caption or video title.').optional(),
    autoPlayMuted: z.boolean().default(false).optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Rounded native video player with poster preview.')
  .strict();

export type VideoProps = z.infer<typeof VideoPropsSchema>;

export const VideoApi = {
  name: 'Video',
  schema: spec(VideoPropsSchema),
} satisfies ComponentApi;

export const VIDEO_ALLOWED_CHILDREN = 'none' as const;

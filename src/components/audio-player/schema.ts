import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, dynString, spec } from '../../protocol/index.js';

export const AudioPlayerPropsSchema = z
  .object({
    url: dynString('URL of the audio resource.'),
    description: dynString('Track title or voice summary label.').optional(),
    subtitle: dynString('Optional speaker or source subtitle.').optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Compact tactile audio player with speed controls and tabular timecode.')
  .strict();

export type AudioPlayerProps = z.infer<typeof AudioPlayerPropsSchema>;

export const AudioPlayerApi = {
  name: 'AudioPlayer',
  schema: spec(AudioPlayerPropsSchema),
} satisfies ComponentApi;

export const AUDIO_PLAYER_ALLOWED_CHILDREN = 'none' as const;

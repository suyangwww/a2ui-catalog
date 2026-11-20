import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  AUDIO_PLAYER_ALLOWED_CHILDREN,
  AudioPlayerApi,
  AudioPlayerPropsSchema,
  type AudioPlayerProps,
} from './schema.js';
import { AudioPlayerRenderer } from './renderer.js';

export const audioPlayerComponent = defineCatalogComponent<typeof AudioPlayerPropsSchema, React.ReactNode>({
  id: 'AudioPlayer',
  slug: 'audio-player',
  group: 'Text, Media & Identity',
  api: AudioPlayerApi,
  propsSchema: AudioPlayerPropsSchema,
  allowedChildren: AUDIO_PLAYER_ALLOWED_CHILDREN,
  renderer: AudioPlayerRenderer,
});

export { AudioPlayerApi, type AudioPlayerProps };

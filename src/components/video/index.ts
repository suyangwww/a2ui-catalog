import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  VIDEO_ALLOWED_CHILDREN,
  VideoApi,
  VideoPropsSchema,
  type VideoProps,
} from './schema.js';
import { VideoRenderer } from './renderer.js';

export const videoComponent = defineCatalogComponent<typeof VideoPropsSchema, React.ReactNode>({
  id: 'Video',
  slug: 'video',
  group: 'Text, Media & Identity',
  api: VideoApi,
  propsSchema: VideoPropsSchema,
  allowedChildren: VIDEO_ALLOWED_CHILDREN,
  renderer: VideoRenderer,
});

export { VideoApi, type VideoProps };

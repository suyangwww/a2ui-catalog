import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  AVATAR_ALLOWED_CHILDREN,
  AvatarApi,
  AvatarPropsSchema,
  type AvatarProps,
} from './schema.js';
import { AvatarRenderer } from './renderer.js';

export const avatarComponent = defineCatalogComponent<typeof AvatarPropsSchema, React.ReactNode>({
  id: 'Avatar',
  slug: 'avatar',
  group: 'Text, Media & Identity',
  api: AvatarApi,
  propsSchema: AvatarPropsSchema,
  allowedChildren: AVATAR_ALLOWED_CHILDREN,
  renderer: AvatarRenderer,
});

export { AvatarApi, type AvatarProps };

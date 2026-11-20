import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, dynString, spec } from '../../protocol/index.js';

export const AvatarPropsSchema = z
  .object({
    name: dynString('Display name for accessibility and initials fallback.'),
    src: dynString('Optional avatar image URL.').optional(),
    subtitle: dynString('Optional subtitle rendering an inline avatar lockup.').optional(),
    size: z.enum(['xs', 'sm', 'md', 'lg']).default('md').optional(),
    shape: z.enum(['circle', 'rounded']).default('circle').optional(),
    status: z.enum(['online', 'busy', 'offline', 'thinking']).optional(),
    weight: WeightSchema.optional(),
  })
  .describe('User, agent, or brand avatar with initials fallback and live status indicator.')
  .strict();

export type AvatarProps = z.infer<typeof AvatarPropsSchema>;

export const AvatarApi = {
  name: 'Avatar',
  schema: spec(AvatarPropsSchema),
} satisfies ComponentApi;

export const AVATAR_ALLOWED_CHILDREN = 'none' as const;

import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, dynString, spec } from '../../protocol/index.js';

export const ImagePropsSchema = z
  .object({
    url: dynString('URL of the image to display.'),
    description: dynString('Alt text and optional lightbox caption.').optional(),
    fit: z.enum(['contain', 'cover', 'fill', 'none', 'scaleDown']).default('cover').optional(),
    variant: z
      .enum([
        'icon',
        'avatar',
        'smallFeature',
        'mediumFeature',
        'largeFeature',
        'header',
        'rounded',
        'wide',
      ])
      .default('mediumFeature')
      .optional(),
    aspectRatio: z.enum(['1:1', '4:3', '16:9', '21:9', 'auto']).default('auto').optional(),
    zoomable: z.boolean().default(false).optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Media image with shimmer skeleton loading and optional tap-to-zoom lightbox.')
  .strict();

export type ImageProps = z.infer<typeof ImagePropsSchema>;

export const ImageApi = {
  name: 'Image',
  schema: spec(ImagePropsSchema),
} satisfies ComponentApi;

export const IMAGE_ALLOWED_CHILDREN = 'none' as const;

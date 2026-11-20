import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, childListRef, dynString, spec } from '../../protocol/index.js';

export const CarouselPropsSchema = z
  .object({
    children: childListRef('Horizontally swipeable snap-aligned cards.'),
    title: dynString('Optional rail header title.').optional(),
    itemWidth: z.enum(['compact', 'standard', 'wide', 'full']).default('standard').optional(),
    showIndicators: z.boolean().default(true).optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Touch-first horizontal snap rail for hotels, flights, products, or visual cards.')
  .strict();

export type CarouselProps = z.infer<typeof CarouselPropsSchema>;

export const CarouselApi = {
  name: 'Carousel',
  schema: spec(CarouselPropsSchema),
} satisfies ComponentApi;

export const CAROUSEL_ALLOWED_CHILDREN = 'any' as const;

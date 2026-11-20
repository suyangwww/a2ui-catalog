import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import {
  WeightSchema,
  actionRef,
  childListRef,
  childRef,
  dynString,
  spec,
} from '../../protocol/index.js';

export const CardPropsSchema = z
  .object({
    child: childRef('Single child component ID (Basic Catalog compatible).').optional(),
    children: childListRef('Optional multi-child vertical stack inside the card.').optional(),
    title: dynString('Optional card header title.').optional(),
    subtitle: dynString('Optional card header subtitle.').optional(),
    headerTrailing: childRef('Optional badge or control in the card header trailing slot.').optional(),
    footer: childRef('Optional footer child separated by a hairline divider.').optional(),
    variant: z.enum(['elevated', 'outlined', 'subtle', 'glass']).default('elevated').optional(),
    padding: z.enum(['none', 'sm', 'md', 'lg']).default('md').optional(),
    action: actionRef('Optional interactive card press action.').optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Elevated surface container with optical corner concentricity.')
  .strict();

export type CardProps = z.infer<typeof CardPropsSchema>;

export const CardApi = {
  name: 'Card',
  schema: spec(CardPropsSchema),
} satisfies ComponentApi;

export const CARD_ALLOWED_CHILDREN = 'any' as const;

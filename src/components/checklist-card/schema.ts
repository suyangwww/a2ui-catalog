import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import {
  WeightSchema,
  checksField,
  dynString,
  dynStringList,
  spec,
} from '../../protocol/index.js';

export const ChecklistCardPropsSchema = z
  .object({
    checks: checksField,
    title: dynString('Checklist card title (e.g., "Cooking checklist" or "Packing list").'),
    subtitle: dynString('Optional helper subtitle beneath title.').optional(),
    value: dynStringList('Two-way bound array of completed item IDs.'),
    items: z
      .array(
        spec(
          z.object({
            id: z.string().describe('Unique item identifier.'),
            title: dynString('Primary task or step title.'),
            detail: dynString('Optional step instructions or secondary note.').optional(),
            time: dynString('Optional schedule timestamp (e.g., "1:30 PM" or "Saturday").').optional(),
            badge: dynString('Optional category pill (e.g., "Top", "Prep").').optional(),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .min(1)
      .describe('Ordered checkable steps or tasks.'),
    showProgress: z.boolean().default(true).optional(),
    resettable: z.boolean().default(true).optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Interactive checkable task and cooking/packing timeline card with live progress bar.')
  .strict();

export type ChecklistCardProps = z.infer<typeof ChecklistCardPropsSchema>;

export const ChecklistCardApi = {
  name: 'ChecklistCard',
  schema: spec(ChecklistCardPropsSchema, { mixins: ['Checkable'] }),
} satisfies ComponentApi;

export const CHECKLIST_CARD_ALLOWED_CHILDREN = 'none' as const;

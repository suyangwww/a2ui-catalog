import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import {
  WeightSchema,
  checksField,
  dynString,
  dynStringList,
  spec,
} from '../../protocol/index.js';

export const ChoicePickerPropsSchema = z
  .object({
    checks: checksField,
    label: dynString('Optional group label.').optional(),
    variant: z
      .enum(['multipleSelection', 'mutuallyExclusive'])
      .default('mutuallyExclusive')
      .optional(),
    options: z
      .array(
        spec(
          z.object({
            label: dynString('Option label.'),
            value: z.string().describe('Stable option value.'),
            description: dynString(
              'Optional secondary detail (best with cards or gallery displayStyle).',
            ).optional(),
            eyebrow: dynString('Optional index or category caption (e.g., "01 · Trail utility").').optional(),
            imageUrl: dynString('Optional image URL for visual moodboard/gallery cards.').optional(),
            icon: z.string().optional(),
            badge: dynString('Optional badge text (e.g., "+$120" or "Popular").').optional(),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .min(1)
      .describe('Available options to choose from.'),
    value: dynStringList('Two-way bound array of selected option values.'),
    displayStyle: z.enum(['checkbox', 'chips', 'cards', 'gallery']).default('chips').optional(),
    filterable: z.boolean().default(false).optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Single or multi-select picker supporting chips, checkboxes, cards, or visual gallery moodboards.')
  .strict();

export type ChoicePickerProps = z.infer<typeof ChoicePickerPropsSchema>;

export const ChoicePickerApi = {
  name: 'ChoicePicker',
  schema: spec(ChoicePickerPropsSchema, { mixins: ['Checkable'] }),
} satisfies ComponentApi;

export const CHOICE_PICKER_ALLOWED_CHILDREN = 'none' as const;

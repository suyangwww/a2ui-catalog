import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, dynString, spec } from '../../protocol/index.js';

export const KeyValueListPropsSchema = z
  .object({
    title: dynString('Optional section heading.').optional(),
    layout: z.enum(['rows', 'grid']).default('rows').optional(),
    dividers: z.boolean().default(true).optional(),
    items: z
      .array(
        spec(
          z.object({
            label: dynString('Field key label.'),
            value: dynString('Formatted field value.'),
            subvalue: dynString('Optional secondary detail beneath value.').optional(),
            tone: z
              .enum(['default', 'strong', 'accent', 'success', 'warning', 'critical'])
              .default('default')
              .optional(),
            copyable: z.boolean().default(false).optional(),
            mono: z.boolean().default(false).optional(),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .min(1),
    weight: WeightSchema.optional(),
  })
  .describe('Apple Wallet / receipt-style aligned key-value summary list.')
  .strict();

export type KeyValueListProps = z.infer<typeof KeyValueListPropsSchema>;

export const KeyValueListApi = {
  name: 'KeyValueList',
  schema: spec(KeyValueListPropsSchema),
} satisfies ComponentApi;

export const KEY_VALUE_LIST_ALLOWED_CHILDREN = 'none' as const;

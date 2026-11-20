import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import {
  WeightSchema,
  dynNumber,
  dynString,
  spec,
} from '../../protocol/index.js';

export const SplitLedgerPropsSchema = z
  .object({
    eyebrow: dynString('Optional top masthead label (e.g., "THE DINNER LEDGER").').optional(),
    title: dynString('Ledger heading (e.g., "The Check, Please.").'),
    subtitle: dynString('Optional subtitle (e.g., "TABLE OF FIVE · ITEMIZED BILL").').optional(),
    footerNote: dynString('Optional bottom sign-off line.').optional(),
    variant: z
      .enum(['clipboard', 'card'])
      .default('clipboard')
      .describe('Visual container material: physical clipboard paper or standard elevated card.')
      .optional(),
    currency: z.string().default('USD').optional(),
    guests: z
      .array(z.string())
      .min(2)
      .max(10)
      .describe('Initial participant names.'),
    items: z
      .array(
        spec(
          z.object({
            id: z.string().describe('Line item identifier.'),
            name: z.string().describe('Dish or expense description.'),
            price: z.number().min(0).describe('Pre-tax item price.'),
            sharedBy: z
              .array(z.number().int().min(0))
              .describe('Zero-based guest indices sharing this item.'),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .min(1)
      .describe('Initial itemized dishes or expenses.'),
    taxAmount: dynNumber('Initial tax dollar amount or percentage.').optional(),
    taxMode: z.enum(['amount', 'percent']).default('amount').optional(),
    tipPercent: dynNumber('Initial tip percentage (0..40).').optional(),
    tipPresets: z.array(z.number().min(0).max(100)).default([15, 18, 20, 25]).optional(),
    defaultExpandedReceipt: z.boolean().default(false).optional(),
    weight: WeightSchema.optional(),
  })
  .describe(
    'Interactive multi-guest itemized bill and expense splitter with cent-exact largest-remainder allocation.',
  )
  .strict();

export type SplitLedgerProps = z.infer<typeof SplitLedgerPropsSchema>;

export const SplitLedgerApi = {
  name: 'SplitLedger',
  schema: spec(SplitLedgerPropsSchema),
} satisfies ComponentApi;

export const SPLIT_LEDGER_ALLOWED_CHILDREN = 'none' as const;

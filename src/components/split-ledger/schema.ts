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
    eyebrow: dynString('Optional top masthead label.').optional(),
    title: dynString('Ledger heading.'),
    subtitle: dynString('Optional subtitle.').optional(),
    footerNote: dynString('Optional bottom sign-off line.').optional(),
    ctaLabel: dynString('Optional submit button label (e.g., "Calculate split" or "Split the check").').optional(),
    variant: z
      .enum(['card', 'clipboard'])
      .default('card')
      .describe('Visual container material: elevated card or tactile clipboard paper.')
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
            name: z.string().describe('Expense or item description.'),
            price: z.number().min(0).describe('Pre-tax item price.'),
            sharedBy: z
              .array(z.number().int().min(0))
              .describe('Zero-based participant indices sharing this item.'),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .min(1)
      .describe('Initial itemized expenses.'),
    taxAmount: dynNumber('Initial tax amount or percentage.').optional(),
    taxMode: z.enum(['amount', 'percent']).default('amount').optional(),
    tipPercent: dynNumber('Initial tip/gratuity percentage (0..40).').optional(),
    tipPresets: z.array(z.number().min(0).max(100)).default([15, 18, 20, 25]).optional(),
    defaultExpandedReceipt: z.boolean().default(false).optional(),
    weight: WeightSchema.optional(),
  })
  .describe(
    'Interactive multi-participant itemized expense and bill splitter with cent-exact largest-remainder allocation.',
  )
  .strict();

export type SplitLedgerProps = z.infer<typeof SplitLedgerPropsSchema>;

export const SplitLedgerApi = {
  name: 'SplitLedger',
  schema: spec(SplitLedgerPropsSchema),
} satisfies ComponentApi;

export const SPLIT_LEDGER_ALLOWED_CHILDREN = 'none' as const;

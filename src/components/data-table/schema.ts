import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import {
  WeightSchema,
  actionRef,
  dynString,
  dynValue,
  spec,
} from '../../protocol/index.js';

export const DataTablePropsSchema = z
  .object({
    columns: z
      .array(
        spec(
          z.object({
            key: z.string(),
            header: dynString('Column header label.'),
            align: z.enum(['start', 'center', 'end']).default('start').optional(),
            format: z
              .enum(['text', 'number', 'currency', 'percent', 'badge'])
              .default('text')
              .optional(),
            currency: z.string().default('USD').optional(),
            sortable: z.boolean().default(true).optional(),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .min(1),
    rows: dynValue('Array of row objects (literal or @path binding).'),
    rowKey: z.string().default('id').optional(),
    caption: dynString('Optional table caption or summary.').optional(),
    maxRows: z.number().int().min(1).max(200).optional(),
    rowAction: actionRef('Optional action dispatched when a table row is clicked.').optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Sortable, tabular-numerals data table with mobile horizontal scroll support.')
  .strict();

export type DataTableProps = z.infer<typeof DataTablePropsSchema>;

export const DataTableApi = {
  name: 'DataTable',
  schema: spec(DataTablePropsSchema),
} satisfies ComponentApi;

export const DATA_TABLE_ALLOWED_CHILDREN = 'none' as const;

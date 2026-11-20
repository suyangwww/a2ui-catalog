import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, checksField, dynString, spec } from '../../protocol/index.js';

export const DateTimeInputPropsSchema = z
  .object({
    checks: checksField,
    value: dynString('Two-way bound ISO 8601 date, time, or datetime string.'),
    label: dynString('Optional field label.').optional(),
    enableDate: z.boolean().default(true).optional(),
    enableTime: z.boolean().default(false).optional(),
    min: dynString('Optional minimum ISO date/time bound.').optional(),
    max: dynString('Optional maximum ISO date/time bound.').optional(),
    weight: WeightSchema.optional(),
  })
  .describe('Date, time, or date-time picker with native mobile ergonomics.')
  .strict();

export type DateTimeInputProps = z.infer<typeof DateTimeInputPropsSchema>;

export const DateTimeInputApi = {
  name: 'DateTimeInput',
  schema: spec(DateTimeInputPropsSchema, { mixins: ['Checkable'] }),
} satisfies ComponentApi;

export const DATE_TIME_INPUT_ALLOWED_CHILDREN = 'none' as const;

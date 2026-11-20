import { z } from 'zod';
import { DynamicNumberSchema } from '../../protocol/index.js';

const FormatCompactNumberPropsSchema = z
  .object({
    value: DynamicNumberSchema.describe('REF:#/$defs/DynamicNumber|The number to format.'),
    decimals: DynamicNumberSchema.describe(
      'REF:#/$defs/DynamicNumber|Maximum fraction digits (default 1).',
    ).optional(),
  })
  .strict();

export const FormatCompactNumberApi = {
  name: 'formatCompactNumber',
  returnType: 'string' as const,
  allowedCallers: 'rendererOnly' as const,
  description: 'Formats a large number using compact notation (e.g., 1420000 -> "1.4M").',
  schema: FormatCompactNumberPropsSchema,
};

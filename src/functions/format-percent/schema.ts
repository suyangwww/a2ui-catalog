import { z } from 'zod';
import { DynamicNumberSchema } from '../../protocol/index.js';

const FormatPercentPropsSchema = z
  .object({
    value: DynamicNumberSchema.describe(
      'REF:#/$defs/DynamicNumber|The ratio to format (0.124 = 12.4%).',
    ),
    decimals: DynamicNumberSchema.describe(
      'REF:#/$defs/DynamicNumber|Fraction digits (default 1).',
    ).optional(),
    signDisplay: z.enum(['auto', 'always', 'never']).optional(),
  })
  .strict();

export const FormatPercentApi = {
  name: 'formatPercent',
  returnType: 'string' as const,
  allowedCallers: 'rendererOnly' as const,
  description: 'Formats a decimal ratio as a percentage string (e.g., 0.124 -> "+12.4%").',
  schema: FormatPercentPropsSchema,
};

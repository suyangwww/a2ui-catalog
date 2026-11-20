import { z } from 'zod';
import { DynamicStringSchema } from '../../protocol/index.js';

const FormatRelativeTimePropsSchema = z
  .object({
    value: DynamicStringSchema.describe('REF:#/$defs/DynamicString|ISO 8601 timestamp string.'),
  })
  .strict();

export const FormatRelativeTimeApi = {
  name: 'formatRelativeTime',
  returnType: 'string' as const,
  allowedCallers: 'rendererOnly' as const,
  description:
    'Formats an ISO 8601 timestamp relative to the current time (e.g., "4m ago", "in 2h").',
  schema: FormatRelativeTimePropsSchema,
};

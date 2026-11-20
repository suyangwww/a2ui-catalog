import { z } from 'zod';
import {
  DynamicNumberSchema,
  DynamicStringSchema,
  DynamicValueSchema,
} from '../../protocol/index.js';

const SelectByValuePropsSchema = z
  .object({
    value: DynamicValueSchema.describe('REF:#/$defs/DynamicValue|Input value to match or test.'),
    cases: z
      .record(z.string(), z.unknown())
      .describe('Key-value lookup map keyed by String(value).')
      .optional(),
    fallback: DynamicValueSchema.describe(
      'REF:#/$defs/DynamicValue|Fallback value when no case matches.',
    ).optional(),
    whenNegative: DynamicValueSchema.describe(
      'REF:#/$defs/DynamicValue|Returned when numeric value < 0.',
    ).optional(),
    whenNonNegative: DynamicValueSchema.describe(
      'REF:#/$defs/DynamicValue|Returned when numeric value >= 0.',
    ).optional(),
  })
  .strict();

export const SelectByValueApi = {
  name: 'selectByValue',
  returnType: 'any' as const,
  allowedCallers: 'rendererOnly' as const,
  description:
    'Declarative client-side conditional lookup that returns matching case data or sign-dependent content.',
  schema: SelectByValuePropsSchema,
};

const SampleDistributionPropsSchema = z
  .object({
    action: z
      .enum(['draw', 'reset'])
      .describe('Draw additional random samples or reset the target Data Model state.'),
    path: z.string().describe('Target JSON pointer path in the Surface Data Model.'),
    distribution: DynamicStringSchema.describe(
      'REF:#/$defs/DynamicString|Continuous distribution family ("uniform" | "normal" | "skewed" | "bimodal").',
    ).optional(),
    sampleSize: DynamicNumberSchema.describe(
      'REF:#/$defs/DynamicNumber|Observations averaged per draw (n >= 1; n > 1 draws sample means).',
    ).optional(),
    count: DynamicNumberSchema.describe(
      'REF:#/$defs/DynamicNumber|Number of draws to append (1..2000).',
    ).optional(),
    bins: DynamicNumberSchema.describe(
      'REF:#/$defs/DynamicNumber|Histogram bucket count (4..32, default 14).',
    ).optional(),
  })
  .strict();

export const SampleDistributionApi = {
  name: 'sampleDistribution',
  returnType: 'void' as const,
  allowedCallers: 'rendererOnly' as const,
  description:
    'Draws or resets continuous random samples and binned histogram data ({ values, bins, count, mean, stdev }) in the local Data Model.',
  schema: SampleDistributionPropsSchema,
};

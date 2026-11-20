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

const RunSimulationPropsSchema = z
  .object({
    mode: z
      .enum(['cltDraw', 'cltReset', 'montyPick', 'montyResolve', 'montySim', 'montyReset'])
      .describe('Simulation action mode.'),
    path: z.string().describe('Target JSON pointer path in the Surface Data Model.'),
    count: DynamicNumberSchema.describe(
      'REF:#/$defs/DynamicNumber|Number of Monte Carlo samples or games to draw.',
    ).optional(),
    sampleSize: DynamicNumberSchema.describe(
      'REF:#/$defs/DynamicNumber|Sample size n per draw for CLT.',
    ).optional(),
    distribution: DynamicStringSchema.describe(
      'REF:#/$defs/DynamicString|Population distribution ("Skewed" | "Uniform" | "Bimodal").',
    ).optional(),
    door: DynamicNumberSchema.describe(
      'REF:#/$defs/DynamicNumber|Chosen door index (0, 1, or 2) in Monty Hall.',
    ).optional(),
    strategy: DynamicStringSchema.describe(
      'REF:#/$defs/DynamicString|Resolution choice ("switch" | "stay") in Monty Hall.',
    ).optional(),
  })
  .strict();

export const RunSimulationApi = {
  name: 'runSimulation',
  returnType: 'void' as const,
  allowedCallers: 'rendererOnly' as const,
  description:
    'Runs interactive statistical or probability simulations (CLT histograms, Monty Hall trials) in the local Data Model.',
  schema: RunSimulationPropsSchema,
};

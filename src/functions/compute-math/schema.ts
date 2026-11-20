import { z } from 'zod';
import { DynamicNumberSchema } from '../../protocol/index.js';

const ComputeMathPropsSchema = z
  .object({
    op: z
      .enum([
        'add',
        'sub',
        'mul',
        'div',
        'round',
        'ceil',
        'floor',
        'clamp',
        'abs',
        'percentOf',
        'sum',
      ])
      .describe('Arithmetic operation to perform.'),
    a: DynamicNumberSchema.describe('REF:#/$defs/DynamicNumber|Primary numeric operand.'),
    b: DynamicNumberSchema.describe('REF:#/$defs/DynamicNumber|Optional second numeric operand.').optional(),
    c: DynamicNumberSchema.describe('REF:#/$defs/DynamicNumber|Optional third numeric operand.').optional(),
    d: DynamicNumberSchema.describe('REF:#/$defs/DynamicNumber|Optional fourth numeric operand.').optional(),
    decimals: DynamicNumberSchema.describe(
      'REF:#/$defs/DynamicNumber|Optional rounding precision (fraction digits).',
    ).optional(),
  })
  .strict();

export const ComputeMathApi = {
  name: 'computeMath',
  returnType: 'number' as const,
  allowedCallers: 'rendererOnly' as const,
  description:
    'Evaluates safe client-side arithmetic (add, sub, mul, div, sum, clamp, round, ceil) for zero-RTT reactive totals.',
  schema: ComputeMathPropsSchema,
};

const CompoundGrowthPropsSchema = z
  .object({
    monthly: DynamicNumberSchema.describe('REF:#/$defs/DynamicNumber|Monthly deposit amount.'),
    years: DynamicNumberSchema.describe('REF:#/$defs/DynamicNumber|Investment horizon in years.'),
    annualRate: DynamicNumberSchema.describe(
      'REF:#/$defs/DynamicNumber|Assumed annual percentage rate (e.g., 5 for 5%).',
    ),
    initial: DynamicNumberSchema.describe(
      'REF:#/$defs/DynamicNumber|Optional starting principal balance (default 0).',
    ).optional(),
    metric: z
      .enum(['total', 'contributions', 'growth'])
      .default('total')
      .describe('Which projected figure to return.')
      .optional(),
  })
  .strict();

export const CompoundGrowthApi = {
  name: 'compoundGrowth',
  returnType: 'number' as const,
  allowedCallers: 'rendererOnly' as const,
  description:
    'Computes monthly-compounded investment balance, total contributions, or investment growth.',
  schema: CompoundGrowthPropsSchema,
};

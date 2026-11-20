import { describe, expect, it } from 'vitest';
import { DataContext, DataModel } from '@a2ui/web_core';
import {
  CompoundGrowthImplementation,
  ComputeMathImplementation,
  computeMathSlice,
} from './index.js';

describe('function slice: compute-math', () => {
  it('evaluates computeMath operations and matches OpenAI Roth IRA compoundGrowth to the dollar', () => {
    const ctx = new DataContext(new DataModel({}), '/');
    expect(computeMathSlice.slug).toBe('compute-math');
    expect(
      ComputeMathImplementation.execute({ op: 'mul', a: 5, b: 0.4, decimals: 1 }, ctx),
    ).toBe(2);
    expect(
      ComputeMathImplementation.execute({ op: 'sum', a: 600, b: 200, c: 170, d: 30 }, ctx),
    ).toBe(1000);
    expect(
      CompoundGrowthImplementation.execute(
        { monthly: 500, years: 30, annualRate: 5, metric: 'total' },
        ctx,
      ),
    ).toBe(416129);
    expect(
      CompoundGrowthImplementation.execute(
        { monthly: 500, years: 30, annualRate: 5, metric: 'contributions' },
        ctx,
      ),
    ).toBe(180000);
    expect(
      CompoundGrowthImplementation.execute(
        { monthly: 500, years: 30, annualRate: 5, metric: 'growth' },
        ctx,
      ),
    ).toBe(236129);
  });
});

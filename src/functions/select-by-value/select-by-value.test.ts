import { describe, expect, it } from 'vitest';
import { DataContext, DataModel } from '@a2ui/web_core';
import {
  SampleDistributionImplementation,
  SelectByValueImplementation,
  selectByValueSlice,
} from './index.js';

describe('function slice: select-by-value', () => {
  it('resolves conditional lookup cases and draws continuous statistical histograms in DataModel', () => {
    const dm = new DataModel({ samples: {} });
    const ctx = new DataContext(dm, '/');
    expect(selectByValueSlice.slug).toBe('select-by-value');

    expect(
      SelectByValueImplementation.execute(
        { value: 'Warm', cases: { Warm: 'Linen shirt', Cool: 'Wool coat' }, fallback: 'Tee' },
        ctx,
      ),
    ).toBe('Linen shirt');

    expect(
      SelectByValueImplementation.execute(
        { value: -40, whenNegative: 'Deficit', whenNonNegative: 'Surplus' },
        ctx,
      ),
    ).toBe('Deficit');

    SampleDistributionImplementation.execute(
      { action: 'draw', path: '/samples', count: 120, sampleSize: 10, distribution: 'skewed', bins: 10 },
      ctx,
    );
    const out = dm.get('/samples') as Record<string, unknown>;
    expect(out.count).toBe('120');
    expect(Array.isArray(out.bins)).toBe(true);
    expect((out.bins as unknown[]).length).toBe(10);

    SampleDistributionImplementation.execute(
      { action: 'reset', path: '/samples', bins: 10 },
      ctx,
    );
    const cleared = dm.get('/samples') as Record<string, unknown>;
    expect(cleared.count).toBe('0');
  });
});

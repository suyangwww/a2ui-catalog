import { describe, expect, it } from 'vitest';
import { DataContext, DataModel } from '@a2ui/web_core';
import {
  RunSimulationImplementation,
  SelectByValueImplementation,
  selectByValueSlice,
} from './index.js';

describe('function slice: select-by-value', () => {
  it('resolves conditional lookup cases and executes CLT/Monty simulations in DataModel', () => {
    const dm = new DataModel({ clt: {}, monty: {} });
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
        { value: -40, whenNegative: 'Net imports reduce GDP', whenNonNegative: 'Trade surplus' },
        ctx,
      ),
    ).toBe('Net imports reduce GDP');

    RunSimulationImplementation.execute(
      { mode: 'cltDraw', path: '/clt', count: 100, sampleSize: 10, distribution: 'Skewed' },
      ctx,
    );
    const clt = dm.get('/clt') as Record<string, unknown>;
    expect(clt.sampleCount).toBe('100');
    expect(Array.isArray(clt.sampleBins)).toBe(true);

    RunSimulationImplementation.execute(
      { mode: 'montySim', path: '/monty', count: 500 },
      ctx,
    );
    const monty = dm.get('/monty') as Record<string, unknown>;
    expect(Array.isArray(monty.chartData)).toBe(true);
  });
});

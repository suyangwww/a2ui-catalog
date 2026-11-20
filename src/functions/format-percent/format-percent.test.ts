import { describe, expect, it } from 'vitest';
import { DataContext, DataModel } from '@a2ui/web_core';
import { FormatPercentImplementation, formatPercentSlice } from './index.js';

describe('function slice: format-percent', () => {
  it('formats decimal ratios as percentage strings with optional signDisplay', () => {
    const ctx = new DataContext(new DataModel({}), '/');
    expect(formatPercentSlice.slug).toBe('format-percent');
    expect(
      FormatPercentImplementation.execute({ value: 0.124, decimals: 1, signDisplay: 'always' }, ctx),
    ).toBe('+12.4%');
  });
});

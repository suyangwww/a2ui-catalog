import { describe, expect, it } from 'vitest';
import { DataContext, DataModel } from '@a2ui/web_core';
import { FormatCompactNumberImplementation, formatCompactNumberSlice } from './index.js';

describe('function slice: format-compact-number', () => {
  it('formats compact numbers and handles non-finite inputs safely', () => {
    const ctx = new DataContext(new DataModel({}), '/');
    expect(formatCompactNumberSlice.slug).toBe('format-compact-number');
    expect(FormatCompactNumberImplementation.execute({ value: 1420000, decimals: 1 }, ctx)).toBe('1.4M');
    expect(FormatCompactNumberImplementation.execute({ value: Number.NaN }, ctx)).toBe('');
  });
});

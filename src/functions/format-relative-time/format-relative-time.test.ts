import { describe, expect, it } from 'vitest';
import { DataContext, DataModel } from '@a2ui/web_core';
import { FormatRelativeTimeImplementation, formatRelativeTimeSlice } from './index.js';

describe('function slice: format-relative-time', () => {
  it('formats recent ISO timestamps relative to now', () => {
    const ctx = new DataContext(new DataModel({}), '/');
    expect(formatRelativeTimeSlice.slug).toBe('format-relative-time');
    const twoMinsAgo = new Date(Date.now() - 120_000).toISOString();
    expect(String(FormatRelativeTimeImplementation.execute({ value: twoMinsAgo }, ctx))).toContain('2');
  });
});

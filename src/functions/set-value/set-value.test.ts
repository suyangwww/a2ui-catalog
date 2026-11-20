import { describe, expect, it } from 'vitest';
import { DataContext, DataModel } from '@a2ui/web_core';
import { SetValueImplementation, setValueSlice } from './index.js';

describe('function slice: set-value', () => {
  it('mutates the local DataModel at the specified JSON pointer path', () => {
    const dm = new DataModel({ count: 0 });
    const ctx = new DataContext(dm, '/');
    SetValueImplementation.execute({ path: '/count', value: 42 }, ctx);
    expect(setValueSlice.slug).toBe('set-value');
    expect(dm.get('/count')).toBe(42);
  });
});

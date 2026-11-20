import { describe, expect, it } from 'vitest';
import { BASIC_V1_FUNCTION_NAMES, basicV1FunctionsSlice } from './index.js';

describe('function slice: basic-v1', () => {
  it('registers all 14 standard A2UI v1.0 Basic Catalog functions', () => {
    expect(basicV1FunctionsSlice.slug).toBe('basic-v1');
    const publicNames = BASIC_V1_FUNCTION_NAMES.filter((name) => !name.startsWith('@'));
    expect(publicNames).toHaveLength(14);
    expect(publicNames).toContain('formatCurrency');
    expect(publicNames).toContain('required');
  });
});

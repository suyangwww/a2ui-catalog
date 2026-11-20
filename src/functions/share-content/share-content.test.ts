import { describe, expect, it } from 'vitest';
import { DataContext, DataModel } from '@a2ui/web_core';
import { subscribeLuminaToasts } from '../../protocol/index.js';
import { ShareContentImplementation, shareContentSlice } from './index.js';

describe('function slice: share-content', () => {
  it('falls back to clipboard toast summary when Web Share API is unavailable', () => {
    const ctx = new DataContext(new DataModel({}), '/');
    const toasts: string[] = [];
    const unsub = subscribeLuminaToasts((msg) => toasts.push(msg));
    const ok = ShareContentImplementation.execute(
      { title: 'Tokyo Trip', url: 'https://example.com' },
      ctx,
    );
    unsub();
    expect(shareContentSlice.slug).toBe('share-content');
    expect(ok).toBe(true);
    expect(toasts).toEqual(['Copied share summary']);
  });
});

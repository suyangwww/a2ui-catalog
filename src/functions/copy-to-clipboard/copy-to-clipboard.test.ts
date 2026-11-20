import { describe, expect, it } from 'vitest';
import { DataContext, DataModel } from '@a2ui/web_core';
import { subscribeLuminaToasts } from '../../protocol/index.js';
import { CopyToClipboardImplementation, copyToClipboardSlice } from './index.js';

describe('function slice: copy-to-clipboard', () => {
  it('emits confirmation toast via protocol toast bus', () => {
    const ctx = new DataContext(new DataModel({}), '/');
    const toasts: string[] = [];
    const unsub = subscribeLuminaToasts((msg) => toasts.push(msg));
    CopyToClipboardImplementation.execute({ text: 'LUM-8842K', label: 'Copied PNR' }, ctx);
    unsub();
    expect(copyToClipboardSlice.slug).toBe('copy-to-clipboard');
    expect(toasts).toEqual(['Copied PNR']);
  });
});

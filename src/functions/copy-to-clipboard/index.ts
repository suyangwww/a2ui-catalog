import { createFunctionImplementation } from '@a2ui/web_core';
import { defineCatalogFunction, emitLuminaToast } from '../../protocol/index.js';
import { CopyToClipboardApi } from './schema.js';

export const CopyToClipboardImplementation = createFunctionImplementation(
  CopyToClipboardApi,
  (args) => {
    const text = String(args.text ?? '');
    const label = args.label ? String(args.label) : 'Copied to clipboard';
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(text).catch(() => {});
    }
    emitLuminaToast(label);
  },
);

export const copyToClipboardSlice = defineCatalogFunction({
  slug: 'copy-to-clipboard',
  implementations: [CopyToClipboardImplementation],
});

export { CopyToClipboardApi };

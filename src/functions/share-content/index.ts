import { createFunctionImplementation } from '@a2ui/web_core';
import { defineCatalogFunction, emitLuminaToast } from '../../protocol/index.js';
import { ShareContentApi } from './schema.js';

export const ShareContentImplementation = createFunctionImplementation(
  ShareContentApi,
  (args) => {
    const title = String(args.title ?? '');
    const text = args.text ? String(args.text) : undefined;
    const url = args.url ? String(args.url) : undefined;
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      const shareData: ShareData = { title };
      if (text !== undefined) shareData.text = text;
      if (url !== undefined) shareData.url = url;
      void navigator.share(shareData).catch(() => {});
      return true;
    }
    const fallback = [title, text, url].filter(Boolean).join(' — ');
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(fallback).catch(() => {});
    }
    emitLuminaToast('Copied share summary');
    return true;
  },
);

export const shareContentSlice = defineCatalogFunction({
  slug: 'share-content',
  implementations: [ShareContentImplementation],
});

export { ShareContentApi };

import { createFunctionImplementation } from '@a2ui/web_core';
import { defineCatalogFunction } from '../../protocol/index.js';
import { FormatCompactNumberApi } from './schema.js';

export const FormatCompactNumberImplementation = createFunctionImplementation(
  FormatCompactNumberApi,
  (args) => {
    const num = Number(args.value);
    if (!Number.isFinite(num)) return '';
    const decimals =
      typeof args.decimals === 'number' && Number.isFinite(args.decimals)
        ? Math.max(0, Math.min(4, Math.floor(args.decimals)))
        : 1;
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: decimals,
    }).format(num);
  },
);

export const formatCompactNumberSlice = defineCatalogFunction({
  slug: 'format-compact-number',
  implementations: [FormatCompactNumberImplementation],
});

export { FormatCompactNumberApi };

import { createFunctionImplementation } from '@a2ui/web_core';
import { defineCatalogFunction } from '../../protocol/index.js';
import { FormatPercentApi } from './schema.js';

export const FormatPercentImplementation = createFunctionImplementation(
  FormatPercentApi,
  (args) => {
    const num = Number(args.value);
    if (!Number.isFinite(num)) return '';
    const decimals =
      typeof args.decimals === 'number' && Number.isFinite(args.decimals)
        ? Math.max(0, Math.min(4, Math.floor(args.decimals)))
        : 1;
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      signDisplay: args.signDisplay ?? 'auto',
    }).format(num);
  },
);

export const formatPercentSlice = defineCatalogFunction({
  slug: 'format-percent',
  implementations: [FormatPercentImplementation],
});

export { FormatPercentApi };

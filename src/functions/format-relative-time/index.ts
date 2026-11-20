import { createFunctionImplementation } from '@a2ui/web_core';
import { defineCatalogFunction } from '../../protocol/index.js';
import { FormatRelativeTimeApi } from './schema.js';

export const FormatRelativeTimeImplementation = createFunctionImplementation(
  FormatRelativeTimeApi,
  (args) => {
    const raw = String(args.value ?? '');
    const ts = Date.parse(raw);
    if (Number.isNaN(ts)) return raw;
    const diffSec = Math.round((ts - Date.now()) / 1000);
    const abs = Math.abs(diffSec);
    if (abs < 45) return 'just now';
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto', style: 'short' });
    if (abs < 3600) return rtf.format(Math.round(diffSec / 60), 'minute');
    if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), 'hour');
    if (abs < 2592000) return rtf.format(Math.round(diffSec / 86400), 'day');
    if (abs < 31536000) return rtf.format(Math.round(diffSec / 2592000), 'month');
    return rtf.format(Math.round(diffSec / 31536000), 'year');
  },
);

export const formatRelativeTimeSlice = defineCatalogFunction({
  slug: 'format-relative-time',
  implementations: [FormatRelativeTimeImplementation],
});

export { FormatRelativeTimeApi };

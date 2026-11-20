import { createFunctionImplementation } from '@a2ui/web_core';
import { defineCatalogFunction } from '../../protocol/index.js';
import { SetValueApi } from './schema.js';

export const SetValueImplementation = createFunctionImplementation(
  SetValueApi,
  (args, context) => {
    const targetPath = String(args.path ?? '');
    if (!targetPath) return;
    context.set(targetPath, args.value);
  },
);

export const setValueSlice = defineCatalogFunction({
  slug: 'set-value',
  implementations: [SetValueImplementation],
});

export { SetValueApi };

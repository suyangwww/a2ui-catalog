import { defineCatalogFunction } from '../../protocol/index.js';
import {
  BASIC_V1_FUNCTION_IMPLEMENTATIONS,
  BASIC_V1_FUNCTION_NAMES,
} from './schema.js';

export const basicV1FunctionsSlice = defineCatalogFunction({
  slug: 'basic-v1',
  implementations: BASIC_V1_FUNCTION_IMPLEMENTATIONS,
});

export { BASIC_V1_FUNCTION_IMPLEMENTATIONS, BASIC_V1_FUNCTION_NAMES };

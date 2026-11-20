import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  COMPARISON_MATRIX_ALLOWED_CHILDREN,
  ComparisonMatrixApi,
  ComparisonMatrixPropsSchema,
  type ComparisonMatrixProps,
} from './schema.js';
import { ComparisonMatrixRenderer } from './renderer.js';

export const comparisonMatrixComponent = defineCatalogComponent<typeof ComparisonMatrixPropsSchema, React.ReactNode>({
  id: 'ComparisonMatrix',
  slug: 'comparison-matrix',
  group: 'Numbers, Charts & Next Steps',
  api: ComparisonMatrixApi,
  propsSchema: ComparisonMatrixPropsSchema,
  allowedChildren: COMPARISON_MATRIX_ALLOWED_CHILDREN,
  renderer: ComparisonMatrixRenderer,
});

export { ComparisonMatrixApi, type ComparisonMatrixProps };

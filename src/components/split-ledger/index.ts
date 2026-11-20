import type React from 'react';
import { defineCatalogComponent } from '../../protocol/index.js';
import {
  SPLIT_LEDGER_ALLOWED_CHILDREN,
  SplitLedgerApi,
  SplitLedgerPropsSchema,
  type SplitLedgerProps,
} from './schema.js';
import { SplitLedgerRenderer } from './renderer.js';

export const splitLedgerComponent = defineCatalogComponent<
  typeof SplitLedgerPropsSchema,
  React.ReactNode
>({
  id: 'SplitLedger',
  slug: 'split-ledger',
  group: 'Numbers, Charts & Next Steps',
  api: SplitLedgerApi,
  propsSchema: SplitLedgerPropsSchema,
  allowedChildren: SPLIT_LEDGER_ALLOWED_CHILDREN,
  renderer: SplitLedgerRenderer,
});

export { SplitLedgerApi, type SplitLedgerProps };
